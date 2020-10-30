## Dev Setup

After cloning the repo, move into the project directory and run `npm install` to install all project dependencies.
You should see that the directory `node_modules` has been created in the root of the project directory.

To run the server while developing, run `npm run devserver`. This script uses [nodemon](https://www.npmjs.com/package/nodemon)
to restart the server every time a file is saved. 

To run the server in production, run `npm start`.

## File Structure
```bash
.
├── bin
│   └── www
├── node_modules
├── public
│   ├── img
│   ├── script
│   └── style
├── routes
├── views
├── app.js
├── package.json
└── package-lock.json
```

* `bin/www` is the script that runs the server. It should not be modified under pretty much any circumstance.
* `node_modules` is where the projects dependencies are installed and is produced by running `npm install`.
* `public` is where static assets should go such as images, client-side javascrypt, and CSS files. Anything can be added to this directory, including direcories for other asset types, without changing the server code. Files in `public` will be served from their filesystem path, i.e. the file `foo.css` would be served at `<hostname>/style/foo.css`.
* `routes` is where any file that defines a route should live.
* `views` is where any HTML files should live, whether they are rendered templates or static files. The server is currently setup to use [mustache](https://www.npmjs.com/package/mustache) as the view engine. Any HTML file in `views` should have the suffix `.mustache`. For a view to be served by the server, a route must be added for the view.
* `app.js` is the main configuration file for the server. It is where all middle and routes are set.
* `package.json` contains all metadata associated with the npm project, including dependencies.
* `package-lock.json` defines the dependency structure and should not be manually modified.