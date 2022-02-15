---
title: "Building Space Invaders in Vanilla Javascript"
date: 2021-03-02T15:50:22Z
draft: false
featured_image: 'img/projects/space-invaders.jpg'
---

A fun side project, where I create an ongoing journal log of my attempts to build the classic arcade game 'Space Invaders' from the ground up, with zero tutorials, using Javascript.

<!--more-->

> NOTE: This article is NOT a tutorial! It is a journal log which documents my time building Space Invaders without the aid of step by step guides. I’m figuring out everything as I go so the code will change drastically from start to finish as I learn from my own mistakes and challenges.

**Written in January & February of 2021**

## Building Space Invaders from scratch without ANY tutorials in January 2021

As I write, Britain is currently in lockdown - as a result of the terrible ongoing coronavirus pandemic. I wanted to use this time to dedicate to a new project. For my first personal project of 2021, I have decided to build the classic 1978 arcade game ‘Space Invaders’ using Javascript.

To give myself an added challenge, I have decided that I will adopt a “no tutorials” rule while building the game.

Instead of blindly following step by step tutorials on the internet, which encourage you to simply re-type or copy blocks of code, my objective is to build space invaders from the ground up and actively think about how I will create each part of the game. I will use a combination of my existing Javascript knowledge and also use this exercise to improve my Javascript. Whilst I will not be looking at any tutorials - I will occasionally research certain Javascript features to help me achieve my objectives.

This article will take you through my mistakes and then how I resolved them and improved my code - so this definitely not a tutorial, but more of a code journal to track my progress with this challenge.

## Game Components
First of all, let’s establish the basic components of the Space Invaders game. The following is a list of basic Space Invader game components I will need to get started:
-  A canvas
- The cannon which will fire the lazers
- The Lazer Beams
- The alien invaders
- A scoreboard

## Using Javascript to listen for key press events
One of my first considerations is that game players will need to control the ‘laser cannon’ in the game via 3 primary keyboard keys: The left arrow key (move left), the right arrow key (move right) and the spacebar (fire the laser!).

I will therefore need a Keydown event listener.

To detect the user pressing the arrow keys on their keyboard, I am going to need a ‘keydown’ event. The other event listener ‘keypress’ does not work for arrow keys.

Every key on a keyboard has a corresponding Unicode KEY.  These are the Unicode keys for the two arrows:

Left arrow unicode key = 37
Right arrow unicode key = 39

The spacebar key can use either the ‘keypress’ or ‘keydown’ event listener, but to keep things consistent, I’m going to stick with the ‘keydown’ event.

Spacebar unicode key = 32

The following simple IF statement allows us to generate an alert message if the user presses the arrow or space bar keys:

```javascript
document.addEventListener('keydown', function(event) {
  if(event.keyCode === 37) {
    alert("You pressed the left arrow key");
  }
  else if(event.keyCode === 39) {
    alert('You pressed the right arrow key');
  }
  else if(event.keyCode === 32) {
    alert('You pressed the spacebar key');
  }  
});
```

Great! We can now use this code for the next step.

## Move a div from left to right with keyboard arrow keys, using Javascript event listener
In the Space Invaders game, the laser cannon will be moved from left to right using the arrow keys.

To do this I’m going to setup a simple canvas with a div for the cannon, along with some text to track the position of the cannon.

```html
<div id="canvas">
  <div id="cannon"></div>
</div>

<p>Position of cannon: <span id="number"></span></p>
```

Now let’s style it up a bit - I am going to be using the colours from the original Space Invader game from 1978.

```css
#canvas {
  height:108px;
  width:200px;
  background:#000000;
  position:relative;
}

#cannon {
  height:15px;
  width:100px;
  background:#33ff00;
  position:absolute;
  bottom:0;
  left:0;
}
```

To make the ‘cannon’ div move 100px FROM the left when I press the right arrow key I could simply do the following:

```javascript
var cannon = document.getElementById('cannon');

document.addEventListener('keydown', function(event) {
  if(event.keyCode === 39) {
    cannon.style.left = "100px";
  }
});
```

However, obviously we want a bit more control than that. We need that number to increase if we press and hold the right arrow key, and decrease if we press and hold the left arrow key.  We also want to make sure that number doesn’t decrease past 0, or increase past the width of our container. This can be achieved by a calculation: Cannon width MINUS the canvas width , in our case this is 200 - 100 = 100. But we also need to minus 1, to make sure the number doesn’t go to 101, so I’ll be using 99.

```javascript
var cannon = document.getElementById('cannon');
var count = 0;
var rightArrowKey = 39;
var leftArrowKey = 37;

document.addEventListener('keydown', function(event) {
  if(event.keyCode === rightArrowKey && count <= 99) {
    count++;    
    console.log(count);
  }  
  else if (event.keyCode === leftArrowKey && count >= 1) {
    count--;
    console.log(count);
  }
});
```

Here’s my updated code. I’m setting the count variable to zero, and when the user presses the right arrow key, ‘count’ will go to 1 and keep going up by 1 as the key is held down. Pressing the left arrow key reduces the number by 1 all the way down to zero.

The effects can be seen in the console log:

```bash
1
2
3
2
1
0
```

Perfect. Now all I need to do is “inject” this value as an inline style on the cannon div! I do this by targeting the cannon div, adding an inline style of ‘left’ and concatenating ‘px’ to the end of the count variable.

```javascript
var cannon = document.getElementById('cannon');
var count = 0;
var rightArrowKey = 39;
var leftArrowKey = 37;
var canvasWidth = 200;
var cannonWidth = 100;
var maxCount = canvasWidth - cannonWidth - 1;

document.addEventListener('keydown', function(event) {
  if(event.keyCode === rightArrowKey && count <= maxCount) {
    count++;    
    cannon.style.left = count + "px";
  }  
  else if (event.keyCode === leftArrowKey && count >= 1) {
    count--;
    cannon.style.left = count + "px";
  }
});
```

To make things a little more fancy, I added in 3 new variables - `canvasWidth` , `cannonWidth` and `maxCount`  - This is so I can perform the basic calculation to stop the cannon going past the container, and allows me to easily tweak this number in future.

## Firing a Lazer on Space Bar Key Press
So next thing I need to do is fire a lazerbeam out that cannon when the user presses the space bar.

To start, I need to update my styles. I need to make sure the `Lazer` moves with the `cannon` so that the two are in sync.

```html
<div id="canvas">
  <div id="cannon">
    <div id="cannon-lazer"></div>
  </div>
</div>
```

For now I’ll just keep things simple and worry about the precise positioning of the `lazer` later:

```css
#canvas {
  height:108px;
  width:200px;
  background:#000000;
  position:relative;
}

#cannon {
  height:15px;
  width:100px;
  background:#33ff00;
  position:absolute;
  bottom:0;
  left:0;
}

#cannon-lazer {
  height:15px;
  width:10px;
  background:#fff;
  position:absolute;
  bottom:0;
  left:0;
  transition:0.3s;
}
```

I managed to add a very basic “lazer fire” effect simply by manipulating the ‘bottom’ position of the div on space bar key press:

```javascript
var cannon = document.getElementById('cannon');
var lazer = document.getElementById('cannon-lazer');
var count = 0;
var rightArrowKey = 39;
var leftArrowKey = 37;
var spaceBarKey = 32;
var canvasWidth = 200;
var cannonWidth = 100;
var maxCount = canvasWidth - cannonWidth - 1;

document.addEventListener('keydown', function(event) {
  if(event.keyCode === rightArrowKey && count <= maxCount) {
    count++;    
    cannon.style.left = count + "px";
  }  
  else if (event.keyCode === leftArrowKey && count >= 1) {
    count--;
    cannon.style.left = count + "px";
  }
  else if (event.keyCode === spaceBarKey) {  
    lazer.style.bottom = "93px";
  }
});
```
 
I now have a problem. The lazer only fires once, and the effect is very limited. I need to find a way to make it so that the lazer fires an unlimited number of times.

I was stumped for a while, then I have a brainwave! My initial idea of giving the lazer a static value like `lazer.style.button = 93px` and then letting CSS handle the smooth motion is not going to work. What I need to do instead is use Javascript to create a counter - which counts from 0 to 93, and when it gets to 93, reset back to 0 again (thus ‘reloading’ the lazer cannon). This value will then be injected into the lazer div’s style position.  

I created the following demo code which provides a basic example of how to trigger a counter function, which counts from 1 to 10 and then resets to 0 in the console log…

```javascript
var counter = 0;

function countToTenAndBack() {
  counter++;
  var timeOutFunc = setTimeout("countToTenAndBack()", 100);
 
  if(counter == 11) {
    counter = 0;
    clearTimeout(timeOutFunc);
  }  
  console.log(counter);
}  
countToTenAndBack();
```

I now just need to take this code and apply it to my lazer div, and count to 93 instead of 10.

Here’s an updated version of my javascript, at this stage:

```javascript
var cannon = document.getElementById('cannon');
var lazer = document.getElementById('cannon-lazer');
var count = 0;
var rightArrowKey = 39;
var leftArrowKey = 37;
var spaceBarKey = 32;
var canvasWidth = 200;
var cannonWidth = 100;
var maxCount = canvasWidth - cannonWidth - 1;

var lazer_position = 0;

function fire() {
  lazer_position++;
  var myTimeoutFunction = setTimeout("fire()", 5);
 
  if(lazer_position == 94) {
    lazer_position = 0;
    clearTimeout(myTimeoutFunction);
  }
  lazer.style.bottom = lazer_position + "px";
}

document.addEventListener('keydown', function(event) {
  if(event.keyCode === rightArrowKey && count <= maxCount) {
    count++;    
    cannon.style.left = count + "px";
  }  
  else if (event.keyCode === leftArrowKey && count >= 1) {
    count--;
    cannon.style.left = count + "px";
  }
  else if (event.keyCode === spaceBarKey) {  
    fire();
  }
});
```

## Creating and destroying the lazer element in the DOM
I had another brainwave. Perhaps instead of ‘resetting’ the position of the same lazer div on the space bar key press each time, I should instead be creating a new lazer beam by inserting it into the DOM, and then once said lazer beam reaches the top of the canvas (as per the conditional statement), I then remove it from the DOM and create a new lazer.

I therefore modified my code to come up with the following:

```html
<div id="canvas">
  <div id="cannon">
  </div>
</div>
```

CSS:
```css
#canvas {
  height:108px;
  width:200px;
  background:#000000;
  position:relative;
}

#cannon {
  height:15px;
  width:100px;
  background:#33ff00;
  position:absolute;
  bottom:0;
  left:0;
}

.newlazer {
  height:15px;
  width:15px;
  background:red;
  position:absolute;
  bottom:0;
  left:0;
}
```

JS:
```javascript
var cannon = document.getElementById('cannon');
var lazer = document.getElementById('cannon-lazer');
var count = 0;
var rightArrowKey = 39;
var leftArrowKey = 37;
var spaceBarKey = 32;
var canvasWidth = 200;
var cannonWidth = 100;
var maxCount = canvasWidth - cannonWidth - 1;
var lazer_position = 0;

function createLazer() {
  var newLazer = document.createElement('div');
  newLazer.className = "newlazer";
  cannon.appendChild(newLazer);  
}

// create a new lazer on page load
createLazer();

function destroyLazer() {
  var lazer_to_destroy = document.querySelector('.newlazer');
  lazer_to_destroy.remove();
}

function fire() {
  var lazerbeam = document.querySelector('.newlazer');
  lazer_position++;
  var myTimeoutFunction = setTimeout("fire()", 5);  
  if(lazer_position == 94) {  
    lazer_position = 0;
    clearTimeout(myTimeoutFunction);
    destroyLazer();
  }
  lazerbeam.style.bottom = lazer_position + "px";
}

document.addEventListener('keydown', function(event) {
  if(event.keyCode === rightArrowKey && count <= maxCount) {
    count++;    
    cannon.style.left = count + "px";
  }  
  else if (event.keyCode === leftArrowKey && count >= 1) {
    count--;
    cannon.style.left = count + "px";
  }
  else if (event.keyCode === spaceBarKey) {  
    createLazer();
    fire();
   }
});
```

This works much better. You can now press the space bar key and fire lasers at rapid speed!

## Collision Detection
The next thing I need to be able to do is master ‘collision detection’ in Javascript. Collision detection is essentially how you might detect when two objects collide.

My research has uncovered that in order to detect a collision, you must calculate the space between two objects - and once that space is reduced to zero, in theory, that is a collision - in practice however, there is much more to it than that!

After a lot of research into this topic, I managed to get a very basic form of collision detection working. Here’s my setup:

```html
<div id="canvas">
<div id="object-1"></div>
<div id="object-2"></div>
</div>
```

```css
#canvas {
background:#000;
height:100px;
width:100px;
position: relative;
}

#object-1 {
height:10px;
width:10px;
background:#fff;
position: absolute;
top:0;
left:30px;
}

#object-2 {
height:10px;
width:10px;
background:#fff;
position: absolute;
top:0;
right:30px;
}
```

```javascript
var object_1 = document.getElementById('object-1');
var object_2 = document.getElementById('object-2');

var object_1_left = object_1.getBoundingClientRect().left;
var object_2_left = object_2.getBoundingClientRect().left;
var object_1_top = object_1.getBoundingClientRect().top;
var object_2_top = object_2.getBoundingClientRect().top;

var object_1 = {
x: object_1_left,
y: object_1_top,
width: 10,
height: 10
}

var object_2 = {
x: object_2_left,
y: object_2_top,
width: 10,
height: 10
}

if (object_1.x < object_2.x + object_2.width && object_1.x + object_1.width > object_2.x - 1) {
    document.write("COLLISION!!!!!");
} else {
    document.write("No collision detected");
}
```

`getBoundingClientRect()` is a method that I had not used much before. Essentially, it will provide me with information about where certain objects are within the viewport. By attaching rules such as `getBoundingClientRect().left` and `getBoundingClientRect().top` I can get the distance of a `<div>` from the left and top of the viewport.

I then create two Javascript objects - giving them height, width and x and y properties.

Then a conditional is used to check when these objects collide. The following conditional creates a collision when the objects overlap by 1px:
```
object_1.x < object_2.x + object_2.width && object_1.x + object_1.width > object_2.x
```

However, I wanted a collision to occur when the two objects touch, rather than overlap, so I decided to add a `-1` :

```
object_1.x < object_2.x + object_2.width && object_1.x + object_1.width > object_2.x - 1
```

Currently, in this example, the position of the objects is being set manually, in CSS (with the left and right absolute positions). So you can tweak these CSS values until the divs “collide” in order to render the conditional as true. For the sake of mastering a simple collision detection, this example is fine, however for the game of course I will need to try to merge this code in with my other code, so that the positions are being set by the keydown event listeners.

The example of using Javascript objects has also given me some things to think about in terms of re-thinking how I might code the overall game using a more object-oriented approach.

My next steps therefore are to create an object-oriented version of the game, with keyboard controls, and collision detection in place.

**TO BE CONTINUED...**


## What have I learned
So far this project has helped me to learn more about:

1. Javascript keydown events using unicodes
2. Javascript object-oriented programming
3. Collision detection
4. The setTimeout function