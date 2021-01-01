---
title: "How to Create Pandoc Templates"
date: 2020-10-12T22:18:48+01:00
draft: true
tags: ["Pandoc"]
---

Pandoc is a powerful tool that lets you convert one document type into another. It also has the ability to reference a template when converting multiple files.

<!--more-->

Using Pandoc templates, you can give your content a consistent header and footer without having to add these repeatable elemenets manually each time.

In this tutorial, I aim to take you step by step through a very simple example of how we can utilise Pandoc templates. Please note the commands in this tutorial have been written for Mac OS or Linux Terminal use.

## Installing Pandoc

Before we begin, you will need to have PANDOC installed on your system: 

https://pandoc.org/installing.html

<!-- If you need the Mac OS installer, I am hosting it here on this website. Click here to download: pandoc-2.9.2.1-macOS.pkg -->

## Setting up the project structure

Set up your project structure to like this:

```html
/my_project_folder
    /input
        /file1.html
        /file2.html
        /file3.html
    /output
```

The content of `file1.html` will be:

```html
<p>THIS IS THE HEADER</p>
<p>File 1 content</p>
<p>THIS IS THE FOOTER</p>   
```

The content of `file2.html` will be:

```html     
<p>THIS IS THE HEADER</p>
<p>File 2 content</p>
<p>THIS IS THE FOOTER</p>           
```

The content of `file3.html` will be:

```html     
<p>THIS IS THE HEADER</p>
<p>File 3 content</p>
<p>THIS IS THE FOOTER</p>           
```

The output folder will stay empty for now.

Now let’s say you want to change the text which says 'THIS IS THE HEADER' to say something else. For example: 'THIS IS THE NEW HEADER'.

You could open up each of the 3 files individually, and change the text manually.

But why do that, when we can write a computer script which will do it for us automatically?

This is where Pandoc comes in handy!

The first thing we need to do is learn how to prepare our 3 files so that Pandoc can reference a template file.

We can see in our 3 files, that the header and footer of each document is the same. They all begin with header text which says 'THIS IS THE HEADER' and all end with footer text which says 'THIS IS THE FOOTER'.

The only thing that changes in each of our 3 files is the content in-between the header and the footer.

So let’s create a template file containing our header and footer text which we will be able to re-use.

Create a new folder called templates and inside that create a new file called `master_template.html`.

Our new project structure should look like this:

```
/my_project_folder
    /input
        /file1.html
        /file2.html
        /file3.html
    /output
    /templates
        /master_template.html
```
Inside `master_template.html`, we want to add the header and footer content:

```html
<p>THIS IS THE HEADER</p>

<p>THIS IS THE FOOTER</p>   
```

Next we need to tell Pandoc where in this template our file content is going to be inserted once we run our command.

We do this by adding the `$body$` variable to our `master_template.html` file:

```html
<p>THIS IS THE HEADER</p>
$body$
<p>THIS IS THE FOOTER</p>   
```

Next, we need to remove the header and footer content from each of our 3 files.

So `file1.html` should look like this:

```html
<p>File 1 content</p>  
```

And `file2.html` like this:

```html    
<p>File 2 content</p>           
```     
    
And finally, `file3.html` like this:

```html    
<p>File 3 content</p>           
```

## Single file command demo 

We are going to run a single command which will only effect one file. In this case, we want to target `input/file1.html` and tell Pandoc to encase the content of this file with the content we have in `templates/master_template.html`

Pandoc will then generate our content into a new file which it will save into `output/file1.html`.

Here’s what to do:

1. Open the command line and `cd` into `my_project_folder`

2. Type the following Pandoc command and press enter:

```
pandoc input/file1.html --from html --to html5 --template "templates/master_template.html" --output output/file1.html
```

This command should generate a new file inside `my_project_folder/output` called `file1.html`, which should contain the following content:

```html
<p>THIS IS THE HEADER</p>
<p>File 1 content</p>
<p>THIS IS THE FOOTER</p>  
```

Perfect!

## Step by Step Guide to what each segment of this PANDOC command means

Although this Pandoc command is fairly self explanatory, I think it makes sense to pause at this stage and look at the command in a little more detail.

```
pandoc input/file1.html --from html --to html5 --template "templates/master_template.html" --output output/file1.html  
```

Let’s break this Pandoc command up into segments, and describe piece by piece what each part of the command means.

1. `pandoc input/file1.html` = Specifies the INPUT FILE. This is the source path of the file we want to target. Our source path is `input/file1.html`

2. `--from` or `-f` = The input FORMAT we are converting FROM. This command tells Pandoc what format our input file is encoded in. In our case it’s html, so we say --from html

3. `--to` or `-t` = The output FORMAT to convert TO. We need to tell Pandoc what format we would like to convert our input file into. We want the output to be HTML 5, so we write `--to html5`

4. `--template` = Specify the TEMPLATE to use. We want our input file to reference a template, so we use this command to tell Pandoc which template to use. So in our case we are using `--template "templates/master_template.html`.

5. `--output` or `-o` = Pandoc is ready to convert our input content into output content using our specified template. If we did not have the --output command, Pandoc would simply print the new content into the terminal. But we don’t want this. Instead we want Pandoc to create a new file for us, containing the updated content. The --output command tells Pandoc to create a new file with a name we specify, and populate it with the new content. In our case, we are using `--output output/file1.html`

You may have noticed in the explanation above it is possible to write our commands in shorthand. This means you can write this command using shorthand commands and it will do exactly the same thing:

```
pandoc input/file1.html -f html -t html5 --template "templates/master_template.html" -o output/file1.html   
```

## Updating multiple files at once

We have seen how to update a single file using Pandoc templates. But how do we update all of our files at once?

## One option is to use a BASH script.

Create a new file inside `my_project_folder` called `automate.sh`.

One very simple way we could achieve this would just be to write out each Pandoc command separately inside our new shell script like so:

```
#!/bin/bash
pandoc input/file1.html -f html -t html5 --template "templates/master_template.html" -o output/file1.html
pandoc input/file2.html -f html -t html5 --template "templates/master_template.html" -o output/file2.html
pandoc input/file3.html -f html -t html5 --template "templates/master_template.html" -o output/file3.html       
```

Notice that each command is tweaked for the corresponding file name.

Save this file, and we now want to run this shell script from Terminal.

We can do this by opening terminal, `cd` to the `my_project_folder` directory, and typing:

```
bash automate.sh   
```

Press enter, and Boom! You should see 3 new files, each containing the content wrapped in your template layout.

## Making a change to the template file

Let’s test this now by making a change to the template file.

Go to `templates/master_template.html` and edit the header text:

From this:

```html
<p>THIS IS THE HEADER</p> 
```

To this:

```html 
<p>THIS IS THE NEW HEADER</p>   
```

Make sure you save the file.

Next, Go back to Terminal, `cd` to the `my_project_folder` directory, and type `bash automate.sh`.

If you now check `file1_new.html`, `file2_new.html` and `file3_new.html` they should all have been updated with the new text. For example, file1.html should look like this:

```html
<p>THIS IS THE NEW HEADER</p>
<p>File 1 content</p>
<p>THIS IS THE FOOTER</p>
```

## A more efficient BASH script

Over time our project may grow to include many more files. We can just keep going back to our BASH script and manually adding new Pandoc commands for each individual file we create.

However, there is a way we can write our BASH script so that we do not have to do this.

The aim of our BASH script will be to look at all of the files inside the `input` folder, run the Pandoc command, and generate the new files into the `output` folder.

Here’s a BASH script which does just this!

```
#!/bin/bash

files=input/*

for file in $files
do
  pandoc input/$(basename $file) -f html -t html5 --template "templates/master_template.html" -o output/$(basename $file)   
done
```

IMPORTANT: Remember, you must only ever run this script when you have `cd` into the `my_project_folder`!

Let’s walk through each line step by step.

1. `files=input/*` = Creates a variable called ‘files’. Here, we reference the path to our input folder. The /* signifies to target “all” files in this folder.

2. Next, we create a for loop. This loops through each file in our input folder, and performs a task.

3. `$(basename $file)` outputs the name of each file inside the input folder as part of the loop. In our case - `file1.html` , `file2.html` and `file3.html` . These file names are placed at the correct points in the sequence of our Pandoc command to give us the final result.

## Wrapping up

Hopefully this tutorial gives you a very simple glance at the possibilities of Pandoc templates. You should be able to take the simple examples in this tutorial and adapt them to your own needs.

For example, instead of just saying `THIS IS THE HEADER` - Why not go ahead and create an entire HTML header document, with the <title>, <meta> and opening <body> tags, in addition to your header markup, and to the same for footer too?