---
title: "Find & replace words using a Perl script"
date: 2019-11-15T18:37:02Z
draft: true
tags: ["Perl"]
---

Are you looking for a quick, powerful way to find and replace a word across multiple documents? Writing a small Perl
script is a simple and powerful method you could try.

<!--more-->

## Perl one liner to find & replace word in a file

The following “one liner” can be directly used in Terminal (in MacOS or Linux):

```perl
perl -pi -w -e 's/old-word/new-word/g;' /absolute/path/to/folder/file.html
```

The above example would replace all instances of `old-word` with `new-word` in `file.html`.

The `/g` tells Perl to perform this operation “globally” - in other words, on the entire file.

## Multiple commands in a bash script

If you need to update multiple files, you could execute this command several times, in a shell script.

Simply create a file that ends in the .sh file extension. e.g. replace.sh and populate it like so:

```bash
#!/bin/bash
perl -pi -w -e 's/old-word/new-word/g;' /absolute/path/to/folder/file.html
perl -pi -w -e 's/old-word/new-word/g;' /absolute/path/to/folder/file2.html
perl -pi -w -e 's/old-word/new-word/g;' /absolute/path/to/folder/file3.html
```

