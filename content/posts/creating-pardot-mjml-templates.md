---
title: "Creating Pardot Email Templates using MJML"
date: 2021-02-04T20:28:54Z
draft: false
tags: ["Pardot", "MJML", "Email Marketing"]
---

Creating an email template that works across multiple email clients can be a notoriously difficult task. However, templating tools such as MJML can make things much easier, and combining MJML with Pardot is a robust workflow to create effective email marketing campaigns.

<!--more-->

However, it is important to understand that there are some special considerations which must be made when using [MJML](https://mjml.io/) in conjunction with [Pardot](https://www.pardot.com/).

In this guide I will seek to establish some useful tips when it comes to making MJML tags work in conjunction with Pardots "editable region" attributes.

## How to make an template editable in Pardot

In order to make parts of an email template editable in Pardot you need to attach `pardot-region` attributes to HTML tags. 

A typical Pardot Region might look something like this:
```
<p pardot-region="editable-paragraph">Some text</p>
```
You can enter any name you like into your pardot region- but the naming structure must obey css class naming rules - in other words, you cannot have spaces between words!

## Pardot Region Types

In Pardot, there are several different types of Pardot Regions. Here is a brief overview of some of the most popular types:

### Link

```
<a href="#" pardot-region="editable-link" pardot-region-type="link">My Link</a>
```

### Image

```
<img src="image.jpg" pardot-region="editable-image" pardot-region-type="image">
```

### Simple / Plain Text Editor
```
<p pardot-region="simple-text" pardot-region-type="simple">Your text here</p>
```

### Basic Editor 
```
<div pardot-region="pardot-basic" pardot-region-type="basic"><h3>My Header</h3></div>
```

### WYSIWYG Editor 
```
<div pardot-region="pardot" pardot-region-type="pardot"><h3>My Header</h3></div>
```

### HTML
```
<code pardot-region="editable-html" pardot-region-type="html"> 
    <p>This is some code</p>
</code> 
 ```

 ### Repeatable (Email only)
 ```
pardot-repeatable="name-of-section"
 ```

 ### Removable (Email only)
 ```
pardot-removable="name-of-section"
 ```

 ---

## How to add Pardot Regions into MJML Templates

If you are using MJML, you may be tempted to try adding your pardot region attributes to the MJML tags themselves, for example:

```
<mj-image src="path/to/image.jpg" pardot-region="my-image-region" />
 ```

However, if you try to attach `pardot-region` attributes to MJML tags like this, it will NOT work because **MJML does not recognise Pardot region attributes.** 

When you try to transpile the MJML into HTML, it will throw an error because the pardot attribute is not supported.

The solution is to avoid using many of the MJML component tags such as:
- `<mj-image>`
- `<mj-button>`
- `<mj-social>`

And instead use MJTML tags which will allow you to nest raw HTML inside of them.

Two tags which accept raw HTML input are:
- `<mj-text>`
- `<mj-raw>`

This will then allow you to add HTML for editable buttons, images and text *inside* these MJML tags.

For example, the way to create an editable image using Pardot regions would be:
```
<mj-text>
    <img pardot-region="editable-image" pardot-region-type="image">
</mj-text>
```

If you wanted to create an editable button, the `<mj-button>` tag is not a good idea, because you would not be able to use `<mj-button pardot-region="editable-button">` since MJML does not regonise pardot attributes. 

The better solution would be to nest a button inside `<mj-text>` e.g. 

```
<mj-text>
    <a href="#" class="button" pardot-region="editable-button">
</mj-text>
```

The same also applies to `<mj-social>` tags. It is better to create the social icons using HTML code and then insert that code inside the `<mj-raw>` tags. 
