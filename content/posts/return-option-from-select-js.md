---
title: "Return an Option From a Select dropdown in Javascript"
date: 2021-10-06T19:26:32+01:00
draft: false
---

In this article, I will explore how you can use Javascript to return the clicked on 'option' from a select dropdown menu.

<!--more-->

If you have a select dropdown, you might wish to add an event listener to it in order to find out what 'option' a user has clicked.

However, if you simply add the event listener to the `<select>` tag itself, all that will be returned to you is the `<select>` element and not the `<option>` element inside of it.

To begin this task, you can interact with a <select> box by using the ‘change’ event listener, either:

```
addEventListener('change', function() {});
```

Or

```
onchange = function() {}
```

You can then create a node list of the items in the <select> dropdown using a rule called `.options` e.g.

```
my_select_var.onchange = function() {
console.log(this.options);
}
```

This will list out a node list of every single option on the clicked on select as a Node List.

You can then retrieve the one you clicked on by using brackets `[]` to access the node list with `this` like so:

```
this.options[this.selectedIndex];
```

`selectedIndex` in this context is going to give you a console log of the full <option> tag you clicked on! But you then want to access attributes, so you can append like so (putting these inside a console log):

```
this.options[this.selectedIndex].id;
this.options[this.selectedIndex].text;
this.options[this.selectedIndex].getAttribute('data-filter');