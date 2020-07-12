This is the back end for a bookmarks manager and new tab screen app. It draws inspiration from Google's new tab screen as well as the iOS home screen.

Main features:
- Manage bookmarks in a visual layout
- Organize bookmarks in pages, folders, and a drawer
- Drag and drop to sort bookmarks
- Write a note
- Adjust the layout and appearance

[Live Demo](http://localhost:3000)<br />
[Front End Repo](https://github.com/Taeil2/bookmarks-manager-front)

### Back End Stack
Node.js<br />
Express<br />
PostgreSQL

### Libraries
bcryptjs<br />
jsonwebtoken<br />
xss<br />
knex

### API Documentation
#### Authentication - /api/auth
/login - POST
Logs a user into the application
Fields
- email (required)
- password (required)


#### Users - /api/users
/ - POST
Creates a new account for a user
Fields
- email (required)
- password (required)

/user - GET
Gets a user's information
Requires a user to be logged in

/user - PATCH
Update's a user's information
Requires a user to be logged in
Fields
- note
- enable_pages
- enable_folders
- icon_size
- icon_shape
- icons_per_row
- icon_alignment
- enable_groups
- enable_hiding
- random_background
- unsplash_url

#### Pages - /api/pages
/ - GET
Gets all pages for a user
Requires a user to be logged in

/ - POST
Creates a page for a user
Requires user to be logged in
Fields
- name (required)
- page_order (required)
- is_drawer

/:page_id - GET
Gets a single page for a user
Requires a user to be logged in

/:page_id - PATCH
Updates a page for a user
Requires user to be logged in
Fields
- name (required)
- page_order (required)

/:page_id - DELETE
Deletes a user page
Requires user to be logged in

#### Bookmarks - /api/bookmarks
/:page_id - GET
Gets all bookmarks for a page

/ - POST
Creates a bookmark for a page
Fields
- page_id (required)
- name (required)
- url
- base_url
- bookmark_order (required)
- folder_name
- group_name
- is_folder
- hidden

/:bookmark_id - GET
Gets a bookmark

/:bookmark_id - PATCH
Updates a bookmark
Fields
- page_id
- name
- url
- base_url
- bookmark_order
- folder_name
- group_name
- is_folder
- hidden

/:bookmark_id - DELETE
Deletes a bookmark

#### Bookmark Images - /api/bookmark-images
/ - GET
Gets bookmark images for a url
Fields
- base_url (required)

/ - POST
Adds bookmark images for a url
Fields
- url (base url)
- icons (object)
  - width
  - height
  - bytes
  - url (icon url)
  - format
