---
title: "The Ogden Trust"
date: 2021-12-02T15:50:22Z
draft: false
featured_image: "/portfolio/img/projects/ogden.jpg"
---

The Ogden Trust is a charitable organisation based in London which aims to increase the uptake of physics for all at post-16. 

<!--more-->

## Project Briefing

The project kicked off mid-2021. For the initial project briefing, I was presented with an RNIB audit report for the accessibility of the existing Ogden Trust website to see what accessibility issues had been raised.

My goal with the new Ogden Trust website is to build a site that focusses on two key areas: 1) Accessibility and 2) Performance.

## Pixel Perfect
To match the designs as closely as possible, I often use a google chrome extension plugin called ‘Perfect Pixel’. The plugin is like the digital equivalent of ‘tracing paper’ in that it allows you to select a JPG image to overlay on top of the website and reduce the opacity so that you can then manually tweak padding, margins and font sizes until they match the design.

For pixel perfect responsive, I took the initial design templates and resized them for each media query container size (1320, 1140, 940 ect.) and then tried to match each as closely as possible to keep the general aspect ratio and proportions of various components consistent across media queries.

## WAVE hello to Accessibility
In order to test accessibility as I build the website, I have installed the WAVE (Web accessibility evaluation tool) by WebAIM in Google Chrome. This will help flag up various issues as they arise.

## Responsive Tables
There will sometimes be table data needed on the Ogden Trust website and one frequent issue with tables in responsive web design is how to handle the table on a mobile device without the data becoming too compressed.

In this project I opted to allow users to swipe gesture to browse the table, and added in some CSS pseudo content to indicate this.

## RNIB
The website must pass an RNIB Audit - so I am building this project with accessibility in the forefront of my mind.

When we did recieve the RNIB Audit, a number of changes were made to the website to improve the accessibility, including (but not limited to):

- All images to have descriptive ALT text, and using an `aria-label` attribute where the image is a background image
- Adding a "Skip to content" link which is hidden initially but can be viewed when browsing the website via the tab key
- All forms to include an 'on submit' button - rather than updating content immediately. There was a need raised for a positive user action so that users know the page has updated, this is especially useful with filtered lists of content.
- All form fields to have a static label above them
- Swipe-able tables on mobile devices to have some descriptive text that tells users how to browse the table columns by swiping left and right
- Website to work perfectly while still at x2 zoom level
- The focus state when tabbing or clicking through the website should have a correct colour contrast 

## Accessibility Friendly Dropdown Menu in Vanilla JS
Using the Wordpress Menu system, I wanted my dropdown menus to incorporate certain accessibility features.

I decided to build an ‘on click’ menu system. The reason for choosing click as opposed to hover, is because clicking is an intentional action. When you want to do something, you click, however when using the mouse, you have no choice but to hover and thus any item such as a dropdown that appears on hover runs the risk of appearing unintentionally.

The second reason for choosing click over hover is that this mechanism is consistent across all mediums - tablets, mobile phones, screen readers, keyboard users, mouse users and so on.

One thing I wanted to add in for accessibility purposes, was for menu links with dropdowns to contain an ‘aria-expanded’ attribute.

So I wrote some JS which traverses the DOM to append this attribute to all <a> tags whereby the parent <li> has a class of `menu-item-has-children`

```javascript
var menu_item_has_children = document.querySelectorAll('.menu-item-has-children > a');

for(var i = 0; i < menu_item_has_children.length; i++) {
// Append ARIA states to all links with dropdowns
var att = document.createAttribute('aria-expanded');
att.value = "false";
menu_item_has_children[i].setAttributeNode(att);
}
```

I then created an onClick event, which would append an ‘active’ class to the <li> to show/hide the dropdown, but also update my new aria attribute to be either true, or false, depending on whether the menu is showing or hidden:

```javascript
// On Click Event
menu_item_has_children[i].onclick = function(event) {
event.preventDefault();

// Set Active Class & ARIA State
if (this.parentElement.classList.contains('active')) {
this.parentElement.classList.remove('active');
this.setAttribute('aria-expanded', 'false');
} else {

// Close Any Open Dropdowns.
for(var i = 0; i < menu_item_has_children.length; i++) {
menu_item_has_children[i].parentElement.classList.remove('active');
menu_item_has_children[i].setAttribute('aria-expanded', 'false');
}

this.parentElement.classList.add('active');
this.setAttribute('aria-expanded', 'true');
}
}
```

I also wanted some code which would close the dropdown if the user clicks anywhere on the page except the dropdown or the menu bar.

```javascript
// Close Open Dropdowns when clicking outside menu
document.body.onclick = function(e) {
for(var i = 0; i < menu_item_has_children.length; i++) {
menu_item_has_children[i].parentElement.classList.remove('active');
menu_item_has_children[i].setAttribute('aria-expanded', 'false');
}
}
menu.onclick = function(e) {
e.stopPropagation();
}
```

This code works by registering an on click event so that when the user clicks on the ‘body’, any open dropdowns will close. However - doing this alone would not work because the menu itself is part of the body and the event would ‘propagate’. Therefore, we stop the propagation on the menu itself, in order that clicking on the menu would not trigger the close event.

### Making the menu keyboard friendly
One of the good things is that the menu so far is possible to use via keyboard - by tabbing through the various links and then pressing the ‘enter’ key to activate the dropdowns.

This is good usability because if we simply showed the dropdowns right away on focus with the tab key, it would mean keyboard users would have to tab through every single link in the dropdown menus every time they tab through a page - so by adding the ‘enter’ (or click) as the condition by which dropdowns show, it gives users a choice each step of the way.

However, the key problem here is that the dropdowns do not close once the user tabs onto the next menu item, potentially resulting in drop down menus which are left open for keyboard users.

To achieve the closing of dropdown menus for keyboard users, I wrote the following code which went inside my existing for loop:
```
// Add Keyboard Controls to Close Submenu on tab
if (menu_item_has_children[i].nextElementSibling) {
var subMenu = menu_item_has_children[i].nextElementSibling;
var subMenuLinks = subMenu.querySelectorAll('a');
var lastLinkIndex = subMenuLinks.length - 1;
var lastLink = subMenuLinks[lastLinkIndex];

lastLink.addEventListener('blur', function() {
var this_parents_li = this.parentElement.parentElement.parentElement;
var this_parents_a = this.parentElement.parentElement.parentElement.firstChild;
// console.log(this_parents_li.firstChild);
this_parents_li.classList.remove('active');
this_parents_a.setAttribute('aria-expanded', 'false');
});
}
```

What we are using here is Javascript ‘blur’ event. A ‘blur’ is an event that gets triggered when an element loses focus.

A typical menu item with children in the code looks like this:
```
<li class="menu-item-has-children">
<a href="#" aria-expanded="false">About</a>
<ul class="sub-menu"></ul>
</li>
```

So `menu_item_has_children[i]` is returning the <a> tags of all <li>’s in the menu which have the class of ‘menu-item-has-children’. I am then using `nextElementSibling` , because inside each <li> is a  `<ul class="sub-menu">` - which is the next element sibling (our dropdown).
Inside this dropdown, I want to then check when the user has reached the LAST link - so I query all of the links inside `sub-menu`, count them using `.length` and then check which one is the last indexed item. This is where I want to fire my ‘blur’ event, which will then traverse the DOM back up to this items parent <li> and remove the active class and set aria-expanded back to false.


![ogdentrust.com Homepage](/portfolio/img/projects/ogden/ogden-home.png "The Ogden Trust homepage, as seen in January 2021")
![ogdentrust.com Directory](/portfolio/img/projects/ogden/directory.png "Ogden Trust Directory, as seen in January 2021")
![ogdentrust.com Resources](/portfolio/img/projects/ogden/resources.png "Ogden Trust Resources, as seen in January 2021")

