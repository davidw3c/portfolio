---
title: "How to create code snippets in Sublime Text 3"
date: 2022-01-25T15:28:42Z
draft: false
tags: ["Sublime"]
---

Code snippets in Sublime Text 3 can save you a lot of time. They allow you to create a key word which you type and then press 'tab' to generate a code block.

<!--more-->

## Create a new Snippet

In order to create a new snippet , in Mac - Sublime Text 3, go to `Tools > Developer > New Snippet` on some machines it may simply be `Tools > New Snippet`.

You will be greeted with something that looks a bit like this in a new untitled file:

```
<snippet>
    <content><![CDATA[
Hello, ${1:this} is a ${2:snippet}.
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <!-- <tabTrigger>hello</tabTrigger> -->
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <!-- <scope>source.python</scope> -->
</snippet>
```

Now lets say you have the following code, which you would like to use for your new Snippet:

```php
<?php if( have_rows('repeater_field_name') ): ?>
    <?php while ( have_rows('repeater_field_name') ) : the_row(); ?>

        <?php echo get_sub_field('sub_field_name'); ?>

    <?php endwhile; ?>
<?php endif; ?>
```

What you would do is insert this code between the opening `<snippet><content><![CDATA[` and closing `]]></content>`

So it looks like this:

```
<snippet>
	<content><![CDATA[
<?php if( have_rows('repeater_field_name') ): ?>
	<?php while ( have_rows('repeater_field_name') ) : the_row(); ?>

		<?php echo get_sub_field('sub_field_name'); ?>

	<?php endwhile; ?>
<?php endif; ?>
]]></content>
</snippet>
```

After the closing `]]></content>` tag, you then have to insert a `<tabTrigger>` tag. Like this:
```
<tabTrigger>acfrepeater</tabTrigger>
```

Your final code will look like this: 

```
<snippet>
	<content><![CDATA[
<?php if( have_rows('repeater_field_name') ): ?>
	<?php while ( have_rows('repeater_field_name') ) : the_row(); ?>

		<?php echo get_sub_field('sub_field_name'); ?>

	<?php endwhile; ?>
<?php endif; ?>
]]></content>
<tabTrigger>acfrepeater</tabTrigger>
</snippet>
```

## Saving the Snippet

Be sure to save your snippet with the file extension of `.sublimt-snippet` for example:
```
acfrepeater.sublime-snippet
```

In Mac finder, you can see all of your snippets by going to the following location:
```
Users > yourname > Library > Application Support > Sublime Text 3 > Packages > User
```

Note that you will need to show hidden files as Library will be hidden. The shortcut to do this is `Command + Shift + . `

