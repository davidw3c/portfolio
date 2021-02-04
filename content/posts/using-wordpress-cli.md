---
title: "Using the Wordpress Command Line"
date: 2021-02-04T20:34:21Z
draft: false
tags: ["Wordpress"]
---

The Wordpress Command Line (WP-CLI) utility allows you to quickly perform tasks such as installing and updating Wordpress via the Terminal Command Line, as opposed to using the usual Graphical User Interface.

<!--more-->

## Install 

### 1. Download wp-cli.phar

```
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
```

### 2. Make sure it works

```
php wp-cli.phar --info
```

### 3. Create WP shortcode

To be able to type just `wp`, instead of `php wp-cli.phar`, you need to make the file executable and move it to somewhere in your PATH.

```
chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp
```

Now try running `wp --info`.

## Create a site

### 1. Create your project directory. 

CD into your projects directory and make new directory:

```
mkdir YourProjectName
```

CD into this directory. For most projects you may wish to create a public_html folder, in which case you type:

```
mkdir public_html
```

And CD into public_html.

### 2. Download Wordpress

```
wp core download
```

### 3. Create the `wp-config.php` file

```
wp core config --dbname=wp_projectname --dbuser=root --dbpass=root
```

### 4. Install Wordpress

```
wp core install --url=http://local.projectname/ --title=ProjectName --admin_user=chameleon --admin_password=chameleonpass --admin_email=you@chameleonstudios.co.uk
```

NOTE: This article is still under construction. More to come soon.