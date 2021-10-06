---
title: "Create a Wordpress User role that only has access to a specific custom post type"
date: 2021-10-06T19:35:30+01:00
draft: false
---

There are already some default User Roles that can be used in Wordpress such as Editor, and Author. However, Custom User Roles can be useful to create in Wordpress if you want a finer level of control over the permissions.

<!--more-->


In this article, I am going to show you how to set up a user role which can only access a custom post type you created.

Step one is to create the user role.
This can be done using the `add_role()` function. Add the following code to your functions.php file in Wordpress:

```php
add_role('contributor', 'Contributor', array(
    'read' => true,
    'edit_posts' => false,
    'delete_posts' => false,
));
```

This is going to setup a new role called “Contributor”.

We now need to define what permissions this role does, and does not have. I prefer to remove all permissions by default, and then add the ones I want.

```
function add_capability()
{
    $contributor_role = get_role('contributor');

    $contributor_role->add_cap( 'read' );

    // Remove all other capabilities
    $contributor_role->add_cap('edit_pages', false );
    $contributor_role->add_cap('publish_pages', false );
    $contributor_role->add_cap('edit_others_pages', false);
    $contributor_role->add_cap('edit_private_pages', false);
    $contributor_role->add_cap('edit_published_pages', false);
    $contributor_role->add_cap('delete_others_pages', false);

    $contributor_role->add_cap('activate_plugins', false);
    $contributor_role->add_cap('edit_plugins', false);
    $contributor_role->add_cap('delete_plugins', false);
    $contributor_role->add_cap('install_plugins', false);
    $contributor_role->add_cap('update_plugins', false);

    $contributor_role->add_cap('delete_others_posts', false);
    $contributor_role->add_cap('delete_posts', false);
    $contributor_role->add_cap('delete_private_pages', false);
    $contributor_role->add_cap('delete_published_pages', false);
    $contributor_role->add_cap('delete_private_posts', false);
    $contributor_role->add_cap('delete_published_posts', false);
    $contributor_role->add_cap('edit_others_pages', false);
    $contributor_role->add_cap('edit_others_posts', false);
    $contributor_role->add_cap('edit_posts', false);
    $contributor_role->add_cap('edit_private_posts', false);
    $contributor_role->add_cap('edit_private_posts', false);
    $contributor_role->add_cap('edit_published_pages', false);
    $contributor_role->add_cap('edit_published_pages', false);
    $contributor_role->add_cap('edit_published_posts', false);
    $contributor_role->add_cap('manage_categories', false);
    $contributor_role->add_cap('manage_links', false);
    $contributor_role->add_cap('moderate_comments', false);
    $contributor_role->add_cap('publish_pages', false);
    $contributor_role->add_cap('publish_posts', false);
    $contributor_role->add_cap('read_private_pages', false);
    $contributor_role->add_cap('read_private_posts', false);
    $contributor_role->add_cap('unfiltered_html', false);
    $contributor_role->add_cap('upload_files', false);

    // Add only magazine access
    $contributor_role->add_cap('read_magazines');
    $contributor_role->add_cap('readmagazines');
    $contributor_role->add_cap('deletemagazines');
    $contributor_role->add_cap('editmagazines');
    $contributor_role->add_cap('read_private_magazines');
    $contributor_role->add_cap('edit_magazines');
    $contributor_role->add_cap('edit_others_magazines');
    $contributor_role->add_cap('publish_magazines');
    $contributor_role->add_cap('delete_magazines'); // to be sure

    $contributor_role->add_cap('read_documents', false);
}
add_action('admin_init', 'add_capability');
```

In this instance we are adding the functionality for this user to ONLY be able to edit a post group we have created called ‘Magazines’.

To see the full list of capabilities for the default user groups - check out this page: [Roles and Capabilities | WordPress.org](https://wordpress.org/support/article/roles-and-capabilities/)

An important thing to note here is that when we setup our custom post type, we need to manually create the labels for the capabilities.

```
'public' => false,  
'supports' => array( 'title', 'thumbnail'),
ect...

'capability_type' => 'magazines', // the name of your post group
'capabilities' => array(
    'publish_posts' => 'publish_magazines',
    'edit_posts' => 'edit_magazines',
    'edit_others_posts' => 'edit_others_magazines',
    'read_private_posts' => 'read_private_magazines',
    'edit_post' => 'editmagazines',
    'delete_post' => 'deletemagazines',
    'read_post' => 'readmagazines',
),
```

All you need to do now is ADD a new user in Wordpress, and assign them to the ‘contributor’ user group.

Once you login you should see that this user only has access to the ‘Magazines’ post group.