---
title: "Interactive Google Map Tutorial: Multiple markers, marker toggles & Wordpress CMS integration"
date: 2021-10-07T14:35:59+01:00
draft: false
tags: ["Google Maps", "Wordpress", "Javascript"]
---

In this tutorial, I will walk through how to set up a map with multiple markers using the Google Maps API,  make it editable in Wordpress using the Advanced Custom Fields repeater field and additionally to categorise groups of map markers so that they can be filtered using onclick buttons in Javascript.

<!--more-->

## Render multiple markers onto a google map using Advanced Custom Fields

Let’s say you want to have a Google Map, with multiple markers on it, and have those markers be controlled with Wordpress using the Advanced Custom Fields add-on.

The first thing you will want to do, if you haven’t already is download & install the advanced custom fields plugin: [ACF | Advanced Custom Fields Plugin for WordPress](https://www.advancedcustomfields.com/)

The next thing to do is create a template which will contain the map.

So within my main Wordpress theme folder, I create a file called `template-map.php`.

I’m just going to put some temporary placeholder content in for now:
```
<?php
get_header();

/*
Template Name: Map
*/
?>

<p>Map to go here</p>

<?php
get_footer();
?>
```

Once I have this saved, I’m going to create a new page called “Map” and select ‘Map’ as the template & click update:

![Template Select](/portfolio/img/google-map-tutorial/template-select.png)

Fortunately, the Advanced Custom Fields website has some great example code to help us to render multiple markers on a google map.
Simple visit this link: [ACF | Google Map](https://www.advancedcustomfields.com/resources/google-map/)
And Scroll to the section entitled “Render multiple markers onto a map”.

For this to work, you need to add two things to your template:
1. Google Maps Helper Code
2. Render Multiple Markers onto a map Code

Here’s what the full template looks like:

```
<?php
get_header();

/*
Template Name: Map
*/
?>

<!-- Google Maps Helper Code -->

<style type="text/css">
.acf-map {
    width: 100%;
    height: 400px;
    border: #ccc solid 1px;
    margin: 20px 0;
}

// Fixes potential theme css conflict.
.acf-map img {
   max-width: inherit !important;
}
</style>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
<script type="text/javascript">
(function( $ ) {

/**
 * initMap
 *
 * Renders a Google Map onto the selected jQuery element
 *
 * @date    22/10/19
 * @since   5.8.6
 *
 * @param   jQuery $el The jQuery element.
 * @return  object The map instance.
 */
function initMap( $el ) {

    // Find marker elements within map.
    var $markers = $el.find('.marker');

    // Create gerenic map.
    var mapArgs = {
        zoom        : $el.data('zoom') || 16,
        mapTypeId   : google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map( $el[0], mapArgs );

    // Add markers.
    map.markers = [];
    $markers.each(function(){
        initMarker( $(this), map );
    });

    // Center map based on markers.
    centerMap( map );

    // Return map instance.
    return map;
}

/**
 * initMarker
 *
 * Creates a marker for the given jQuery element and map.
 *
 * @date    22/10/19
 * @since   5.8.6
 *
 * @param   jQuery $el The jQuery element.
 * @param   object The map instance.
 * @return  object The marker instance.
 */
function initMarker( $marker, map ) {

    // Get position from marker.
    var lat = $marker.data('lat');
    var lng = $marker.data('lng');
    var latLng = {
        lat: parseFloat( lat ),
        lng: parseFloat( lng )
    };

    // Create marker instance.
    var marker = new google.maps.Marker({
        position : latLng,
        map: map
    });

    // Append to reference for later use.
    map.markers.push( marker );

    // If marker contains HTML, add it to an infoWindow.
    if( $marker.html() ){

        // Create info window.
        var infowindow = new google.maps.InfoWindow({
            content: $marker.html()
        });

        // Show info window when marker is clicked.
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open( map, marker );
        });
    }
}

/**
 * centerMap
 *
 * Centers the map showing all markers in view.
 *
 * @date    22/10/19
 * @since   5.8.6
 *
 * @param   object The map instance.
 * @return  void
 */
function centerMap( map ) {

    // Create map boundaries from all map markers.
    var bounds = new google.maps.LatLngBounds();
    map.markers.forEach(function( marker ){
        bounds.extend({
            lat: marker.position.lat(),
            lng: marker.position.lng()
        });
    });

    // Case: Single marker.
    if( map.markers.length == 1 ){
        map.setCenter( bounds.getCenter() );

    // Case: Multiple markers.
    } else{
        map.fitBounds( bounds );
    }
}

// Render maps on page load.
$(document).ready(function(){
    $('.acf-map').each(function(){
        var map = initMap( $(this) );
    });
});

})(jQuery);
</script>


<!-- Render Multiple Markers onto a map Code -->

<?php if( have_rows('locations') ): ?>
    <div class="acf-map" data-zoom="16">
        <?php while ( have_rows('locations') ) : the_row();

            // Load sub field values.
            $location = get_sub_field('location');
            $title = get_sub_field('location_title');
            $description = get_sub_field('description');
            ?>
            <div class="marker" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">
                <h3><?php echo esc_html( $title ); ?></h3>
                <p><em><?php echo esc_html( $location['address'] ); ?></em></p>
                <p><?php echo esc_html( $description ); ?></p>
            </div>
    <?php endwhile; ?>
    </div>
<?php endif; ?>

<?php
get_footer();
?>
```

So let’s go ahead and create a Repeater Field, which matches the fields shown in the ACF example above.

![Repeater Setup](/portfolio/img/google-map-tutorial/repeater-setup.png)

As you can see, I have created a new repeater field called “Locations” , which has 3 sub fields -  1) Location , which is a google map field type, 2) Location title - which is a plain text field, and 3) Description which is also a plain text field.

I am then setting this field to show if the template is equal to ‘Map’:

![Template Conditional](/portfolio/img/google-map-tutorial/template-conditional.png)

*You will now need to generate and add an API key.*

In your functions.php file you will need to add the following function to get Google Maps to work in Advanced Custom Fields:
```
function my_acf_init() {
    acf_update_setting('google_api_key', 'YOUR_API_KEY');
}
add_action('acf/init', 'my_acf_init');
```

And then you need to update `template-map.php` and find the following line of code and add in your API key:
```
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

Now it’s time to add some example content to our repeater field. To keep this simple, I’m just going to add 3 locations in Cambridge, UK.
1) Cambridge Airport, 2) The Fitzwilliam Museum, and 3) King's College School.

![Map Repeater](/portfolio/img/google-map-tutorial/map-repeater.png)

After clicking update and viewing the page, I can see I successfully have generated a google map on the page with 3 marker pins:

![Map Repeater](/portfolio/img/google-map-tutorial/map-pins.png)

## How to create buttons which filter multiple markers in google maps

Now let’s say you wish to assign certain map markers to a category and have them filter based upon a button click.

We can set up the categories themselves in many ways, but in this example, I’m just going to add a select dropdown field to my repeater field called ‘category’ and for the sake of simplicity create 2 categories. One called “Education” and the second called “Travel”.

![Map Repeater](/portfolio/img/google-map-tutorial/categories.png)

Back to my Map page I’m going to set Cambridge Airport as ‘Travel’ and The Fitzwilliam Museum & King's College School as ‘Education’ and re-save the page.

Now let’s add three buttons to our template code, right above the repeater field output:
```
<button class="map_marker_toggle" data-id="education">Education</button>
<button class="map_marker_toggle" data-id="travel">Travel</button>
<button id="reset_markers">Reset</button>
```

I have added a third button here called ‘reset’ - which is the only button to contain a unique ID.

The other two buttons have a shared class of ‘map_marker_toggle’, and I’m using a data attribute called `data-id` - importantly this must match the VALUE from the select dropdown ‘choices’ field , so in my case the choices field contains:
```
education : Education
travel : Travel
```

With the format here being [value] : [label]

Next up, we need to take the value from the ‘category’ select dropdown in our Wordpress repeater field and pass that into our ‘marker’ div, like so:

```
<?php if( have_rows('locations') ): ?>
    <div class="acf-map" data-zoom="16">
        <?php while ( have_rows('locations') ) : the_row();

            // Load sub field values.
            $location = get_sub_field('location');
            $title = get_sub_field('location_title');
            $description = get_sub_field('description');

            $category = get_sub_field( 'category' );
            ?>
            <div class="marker" data-category="<?php echo esc_html($category); ?>" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">
                <h3><?php echo esc_html( $title ); ?></h3>
                <p><em><?php echo esc_html( $location['address'] ); ?></em></p>
                <p><?php echo esc_html( $description ); ?></p>
            </div>
    <?php endwhile; ?>
    </div>
<?php endif; ?>
```

The two new pieces of code here are: `$category = get_sub_field( 'category' );` and `<div class="marker" data-category="<?php echo esc_html($category); ?>" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">`.

Here is the complete code:
```
<button class="map_marker_toggle" data-id="education">Education</button>
<button class="map_marker_toggle" data-id="travel">Travel</button>

<?php if( have_rows('locations') ): ?>
    <div class="acf-map" data-zoom="16">
        <?php while ( have_rows('locations') ) : the_row();

            // Load sub field values.
            $location = get_sub_field('location');
            $title = get_sub_field('location_title');
            $description = get_sub_field('description');

            $category = get_sub_field( 'category' );
            ?>
            <div class="marker" data-category="<?php echo esc_html($category); ?>" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">
                <h3><?php echo esc_html( $title ); ?></h3>
                <p><em><?php echo esc_html( $location['address'] ); ?></em></p>
                <p><?php echo esc_html( $description ); ?></p>
            </div>
    <?php endwhile; ?>
    </div>
<?php endif; ?>
```

So our goal here is to create some Javascript which will get the ‘data-id’ attribute from the button clicked on by the user, then use that information to search through our google map markers for matching data-category attributes and only show those markers.

Firstly, let’s find the function called “initMap” which starts like this: `function initMap( $el )`

You should be able to see the following piece of code:
```
    // Add markers.
    map.markers = [];
    $markers.each(function(){
        initMarker( $(this), map );
    });
```

So lets take a look at what’s inside `map.markers` by doing a console log. I’m doing to first store map.markers in a variable, then run console.log like so:
```
    // Add markers.
    map.markers = [];
    $markers.each(function(){
        initMarker( $(this), map );
    });

    var map_markers = map.markers;
    console.log(map_markers);
```

If I right click and ‘inspect’ the page to pull up the developer tools then click ‘console’, I can see our console.log has returned to us an array with 3 objects in;

![Array](/portfolio/img/google-map-tutorial/array.png)

Each object of course represents one of our map markers.

If we open up each Object we can view the properties currently available to us:

![Object Properties](/portfolio/img/google-map-tutorial/object-properties.png)

Some of these properties will look familiar to you if you go back to the template-map.php code and then find the function called `function initMarker( $marker, map )`
If you look at the following code where the marker instance is created, you will see ‘position’ and ‘map’ - both of which are properties in our Object console view above:

```
    var marker = new google.maps.Marker({
        position : latLng,
        map: map
    });
```

Pay particular attention to the property called ‘position’. Notice the variable ‘latLng’.
This variable contains the data attributes of ‘data-lat’ and ‘data-lng’ that are added to the repeater field code:

`<div class="marker" data-category="<?php echo esc_html($category); ?>" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">`

This is done just above the marker instance code:
```
    var lat = $marker.data('lat');
    var lng = $marker.data('lng');
    var latLng = {
        lat: parseFloat( lat ),
        lng: parseFloat( lng )
    };
```

So in order for us to have something to ‘target’ our marker object with, I need to add a NEW property to this object. In this case, we’re going to extract the data-category attribute we created from each marker div: `<div class="marker" data-category="<?php echo esc_html($category); ?>”>` using the same method as the lat/long.

So, inside our `function initMarker( $marker, map )` function, let’s add a new variable:
```
var marker_category = $marker.data('category');
```

So the ‘marker_category’ variable will hold whatever data is inside our marker div’s ‘data-category’ attribute.

Now we need to make a new property in the marker object, and assign this variable to it:

```
    // Create marker instance.
    var marker = new google.maps.Marker({
        position : latLng,
        map: map,
        markercategory: marker_category,
    });
```

So the full code will look like this:
```
function initMarker( $marker, map ) {

var marker_category = $marker.data('category');

    // Get position from marker.
    var lat = $marker.data('lat');
    var lng = $marker.data('lng');
    var latLng = {
        lat: parseFloat( lat ),
        lng: parseFloat( lng )
    };

    // Create marker instance.
    var marker = new google.maps.Marker({
        position : latLng,
        map: map,
        markercategory: marker_category,
    });

ect .....
```

Head back to the map page, refresh the page, and lets take another look at the inspector tools in the console tab, opening up those objects again we can see a new property has appeared:

![Custom Object](/portfolio/img/google-map-tutorial/custom-object.png)

You will see for the first item ‘markercategory: travel’ , for the second item ‘markercategory: education’  - perfect!

So lets go back to the `function initMap( $el ) ` function , and comment out our previous console log code as we won’t be needing it for now:
```
    // var map_markers = map.markers;
    // console.log(map_markers);
```

Right below this, we’re going to create the ‘on click’ event handler for our buttons. Since we have two (and in future maybe more) buttons that share a class, we will query all buttons with the `map_marker_toggle` class and then loop through them using a for loop:

```
    // var map_markers = map.markers;
    // console.log(map_markers);

    var map_marker_toggles = document.querySelectorAll('.map_marker_toggle');

    for(var i = 0; i < map_marker_toggles.length; i++) {
    console.log(map_marker_toggles[i]);
    }
```
To check this is working, I am running a console log of all the buttons on our page with this class, and when I inspect and check the console, I see the following:

![Inspect Buttons](/portfolio/img/google-map-tutorial/inspect-buttons.png)

So now lets do the on click event handler, and retrieve the ‘data-id’ attribute by passing that into a console log:

```
    // var map_markers = map.markers;
    // console.log(map_markers);

    var map_marker_toggles = document.querySelectorAll('.map_marker_toggle');

    for(var i = 0; i < map_marker_toggles.length; i++) {
    map_marker_toggles[i].onclick = function() {
    var returned_data_attribute = this.getAttribute('data-id');
    console.log(returned_data_attribute);
    }
    }
```

So if I refresh the page, load up the console, and click on the “travel’ button I see this:

![Console Travel](/portfolio/img/google-map-tutorial/console-travel.png)

Great!

Now for an explanation of the final piece of code. You will remember originally we ran a console log of the following:
```
var map_markers = map.markers;
console.log(map_markers);
```

Which has been kept as commented out code above our `map_marker_toggles` variable.

What this console log gave us was an array, containing our map markers, each as an object. So what we need to do at this stage is once the button has been clicked and we’ve stored the buttons data-id attribute, we need to loop over the array inside the ‘map_markers’ variable and change a couple of properties. Here’s a reminder of what it looked like:

![Custom Object](/portfolio/img/google-map-tutorial/custom-object.png)

You will notice a property called ‘visible’. This is a boolean - meaning it can either be true or false. Right now the property is set to ‘true’ as our markers are visible. So we’ll want to be able to change this property.

However, I’m also going to use one of the ‘Marker’ class methods called ‘setVisible’ which is another boolean. This is what will show and hide the markers. See here for more information: [Marker  |  Maps JavaScript API  |  Google Developers](https://developers.google.com/maps/documentation/javascript/reference/marker)

Here’s my code:
```    
   var map_markers = map.markers;
   for(var i = 0; i < map_markers.length; i++) {

if (map_markers[i].markercategory == returned_data_attribute) {
    map_markers[i].visible = 'true';
    map_markers[i].setVisible(true);
} else {
    map_markers[i].visible = 'false';
    map_markers[i].setVisible(false);
}
   }
```

So the ‘map_markers` variable holds the array containing the map marker objects. We loop through them, using a for loop. Then, we’re running a conditional, to check if the map markers ‘markercategory’ property (the one we created) MATCHES the ‘returned_data_attribute’ (which is the data-id attribute of the clicked on button). If it matches, it’s going to set all those matching markers to have a property ‘visible’ of ‘true’ and use the ‘setVisible’ method and set that to true. Our ELSE statement will ensure all other markers are set to false, therefore hidden.


Here’s the full code:
```
    // var map_markers = map.markers;
    // console.log(map_markers);

    var map_marker_toggles = document.querySelectorAll('.map_marker_toggle');

    for(var i = 0; i < map_marker_toggles.length; i++) {
    map_marker_toggles[i].onclick = function() {
    var returned_data_attribute = this.getAttribute('data-id');
   
   var map_markers = map.markers;
   for(var i = 0; i < map_markers.length; i++) {

if (map_markers[i].markercategory == returned_data_attribute) {
    map_markers[i].visible = 'true';
    map_markers[i].setVisible(true);
} else {
    map_markers[i].visible = 'false';
    map_markers[i].setVisible(false);
}
   }
    }
    }
```

Refreshing the page, I can see that clicking our buttons works, and the markers then show based on the clicked on button. Perfect!

Finally, we just need to code up our reset button.
```
    // Reset Button
    var reset_button = document.getElementById('reset_markers');
    var map_markers = map.markers;

    reset_button.onclick = function() {
   for(var i = 0; i < map_markers.length; i++) {
map_markers[i].visible = 'true';
map_markers[i].setVisible(true);
   }
    }
```

So now we have a fully functioning google map with filter buttons:

![Complete Map](/portfolio/img/google-map-tutorial/complete-map.png)

Here’s the entire code of `template-map.php` for reference:

```
<?php
get_header();

/*
Template Name: Map
*/
?>

<!-- Google Maps Helper Code -->

<style type="text/css">
.acf-map {
    width: 100%;
    height: 400px;
    border: #ccc solid 1px;
    margin: 20px 0;
}

/*Fixes potential theme css conflict.*/
.acf-map img {
   max-width: inherit !important;
}
</style>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
<script type="text/javascript">
(function( $ ) {

/**
 * initMap
 * Renders a Google Map onto the selected jQuery element
 */
function initMap( $el ) {

    // Find marker elements within map.
    var $markers = $el.find('.marker');

    // Create gerenic map.
    var mapArgs = {
        zoom        : $el.data('zoom') || 16,
        mapTypeId   : google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map( $el[0], mapArgs );

    // Add markers.
    map.markers = [];
    $markers.each(function(){
        initMarker( $(this), map );
    });

    // var map_markers = map.markers;
    // console.log(map_markers);

    var map_marker_toggles = document.querySelectorAll('.map_marker_toggle');

    for(var i = 0; i < map_marker_toggles.length; i++) {
    map_marker_toggles[i].onclick = function() {
    var returned_data_attribute = this.getAttribute('data-id');

   var map_markers = map.markers;
   for(var i = 0; i < map_markers.length; i++) {

if (map_markers[i].markercategory == returned_data_attribute) {
    map_markers[i].visible = 'true';
    map_markers[i].setVisible(true);
} else {
    map_markers[i].visible = 'false';
    map_markers[i].setVisible(false);
}
   }
    }
    }

    // Reset Button
    var reset_button = document.getElementById('reset_markers');
    var map_markers = map.markers;

    reset_button.onclick = function() {
   for(var i = 0; i < map_markers.length; i++) {
map_markers[i].visible = 'true';
map_markers[i].setVisible(true);
   }
    }


    // Center map based on markers.
    centerMap( map );

    // Return map instance.
    return map;
}

/**
 * initMarker
 * Creates a marker for the given jQuery element and map.
 */
function initMarker( $marker, map ) {

var marker_category = $marker.data('category');

    // Get position from marker.
    var lat = $marker.data('lat');
    var lng = $marker.data('lng');
    var latLng = {
        lat: parseFloat( lat ),
        lng: parseFloat( lng )
    };

    // Create marker instance.
    var marker = new google.maps.Marker({
        position : latLng,
        map: map,
        markercategory: marker_category,
    });

    // Append to reference for later use.
    map.markers.push( marker );

    // If marker contains HTML, add it to an infoWindow.
    if( $marker.html() ){

        // Create info window.
        var infowindow = new google.maps.InfoWindow({
            content: $marker.html()
        });

        // Show info window when marker is clicked.
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open( map, marker );
        });
    }
}

/**
 * centerMap
 * Centers the map showing all markers in view.
 */
function centerMap( map ) {

    // Create map boundaries from all map markers.
    var bounds = new google.maps.LatLngBounds();
    map.markers.forEach(function( marker ){
        bounds.extend({
            lat: marker.position.lat(),
            lng: marker.position.lng()
        });
    });

    // Case: Single marker.
    if( map.markers.length == 1 ){
        map.setCenter( bounds.getCenter() );

    // Case: Multiple markers.
    } else{
        map.fitBounds( bounds );
    }
}

// Render maps on page load.
$(document).ready(function(){
    $('.acf-map').each(function(){
        var map = initMap( $(this) );
    });
});

})(jQuery);
</script>


<!-- Render Multiple Markers onto a map Code -->

<button class="map_marker_toggle" data-id="education">Education</button>
<button class="map_marker_toggle" data-id="travel">Travel</button>
<button id="reset_markers">Reset</button>

<?php if( have_rows('locations') ): ?>
    <div class="acf-map" data-zoom="16">
        <?php while ( have_rows('locations') ) : the_row();

            // Load sub field values.
            $location = get_sub_field('location');
            $title = get_sub_field('location_title');
            $description = get_sub_field('description');

            $category = get_sub_field( 'category' );
            ?>
            <div class="marker" data-category="<?php echo esc_html($category); ?>" data-lat="<?php echo esc_attr($location['lat']); ?>" data-lng="<?php echo esc_attr($location['lng']); ?>">
                <h3><?php echo esc_html( $title ); ?></h3>
                <p><em><?php echo esc_html( $location['address'] ); ?></em></p>
                <p><?php echo esc_html( $description ); ?></p>
            </div>
    <?php endwhile; ?>
    </div>
<?php endif; ?>

<?php
get_footer();
?>
```

## Considerations and improvements

This method is designed to be a rough guide on how to achieve a wordpress integrated google map, with multiple markers that can be toggled.

There are some considerations and things that could be improved for next time.

1. If you have a map with lots of markers, and thus lots of repeater field rows, it is possible that loading the google map multiple times when editing the content in Wordpress could trigger the API key to register too many hits. If this goes above a certain limit, it might restrict full access to the map.

2. A way to improve the aforementioned scenario is to not use the ACF google map field, but instead just create two plain text fields - lat and long. The downside here is that adding content into wordpress with multiple map markers might take longer as you would need to manually find the lat & long values for each location.

3. If your map markers contain an info window that needs to link to a single page for each marker, a custom post type might be a better solution than a repeater field. In this instance, you'd have either a google map field or plain text lat & long fields inside a post group, and then loop through your custom post group to retrieve your map markers.







