# Nodejs/Express Template :robot:

[![CodeFactor](https://www.codefactor.io/repository/github/bitdaft/nodejs-express-boilerplate/badge)](https://www.codefactor.io/repository/github/bitdaft/nodejs-express-boilerplate)

### :rocket: An opinionated template to kickstart your Nodejs/Express project. 
<img src="https://64.media.tumblr.com/126fc1df4e999677f554c471139b3754/tumblr_oq9dm3D8J11relg8bo1_500.gif" height="150" />

## Features

- Clean structure allowing for writing testable code
- Hierarchical config with config file, args, and env variables, all accessible through single config object
- Easy multi-database connection management
- Message queues, and workers on separate processes
- Automatic static file loading
- Module based code encapsulation
- Logging on separate process with tagged structured logs
- Easy centralized failure and success handling

<img src="https://media.tenor.com/It6WN9CY4HMAAAAM/wow-oh-my-god.gif"/>

## Quick start

#### Modules

The most important section is the `modules` folder.  
Inside the folder contain a single `_route.js` file, which routes to each of the different modules.  
An existing template module (`_template`) is already created, so you may simply copy paste it to create a new module.

Inside each module you will find files for each action, such as:

- `*._controller.js` - controller handling
- `*._route.js` - route handling
- `*.db.js` - db queries and calls
- `*.validate.js` - controller parameter validation methods

You may also create other files for your own purposes.

> ###### A working `auth` module has been defined as an example to learn the usage

#### Database

The database folder contains all the files related to databases, such as its connections and models.  
New Models can be added to the `models` folder (Don't forget to re-export it in the `index.js` barrel file).  
You may also optionally add a schema for the model into the `schema` folder. This is purely for documentation purpose, although you may use to validate the models, once converted to JSON.  
The migrations and seeds will be available in their respective folder, after being generated by the `Knex` cli.

#### Config

The `config` folder contains the all the configurations and provides an export for use in other areas of the project.  
Both static JSON config file and env config file are stored here, in their respective files.

**NB: make sure to run `npm run FIX_ERR_REQUIRE_ESM_BULLMQ` first after `npm install` to fix bullmq issue with module imports**

### **:tada: :confetti_ball: Thats all there is to know, go ahead and use this template now**

<img src="https://media.tenor.com/XReQgcgWE8YAAAAM/omg-yay.gif" />

## File structure

```
.
├─bin                 // contains the executable
├─config              // contains config data
│ └─environment       // env file to store env variables
├─database            // contains files relevant to db
│ ├─conn              // db connection scripts
│ ├─migrations        // migrations files
│ ├─models            // db objection models
│ ├─schema            // schema description, not used in code
│ └─seeds             // seed files
├─jobs                // contains file for msq queues
│ ├─queue             // define msg queue
│ └─worker            // worker for queue
│   └─sandbox         // sandboxed worker
├─lib                 // contains lib files, usually wont need to import or interact with them except for 'logger' and 'Failure' objects
├─loadFile            // auto loads files in folder
├─middlewares         // custom middlewares for express
├─modules             // contains the actual src
│ ├─template          // a template of a module to copy paste when creating new modules
│ └─auth              // auth module pre made for most apps
└─utils               // utils functions
```

Although this is an opinionated template, the file structure has been made with the consideration that all workflows and tools used by users may be different and this template should **_ideally_** accomodate that and be able to make those changes while keeping the rest intact.

As such,

- if you use a different DB or ORM, `database` folder goes **_YEET_**
- if you have a different queue and worker mechanics, `jobs` folder goes **_YEEET_**
- if you have different routing and controller mechanics, `modules` folder goes **_YEEEET_**
- etc..., you get the idea

<img src="https://media.tenor.com/jSx1KiL3L2UAAAAC/yeet-lion-king.gif" height="200" alt="yeet" />

Removing these folders usually should not cause issues, since they are loosely coupled.
Even then if you are removing them, please make sure to check where all the imports are used in the rest of the project and make a note on how to replace them

For example

- If removing the `database` folder, you will also need you to modify `<module>.db.js` file, as it imports db models to make queries.
- If removing the `config` folder, you will need to provide an alternative export for the config, with env vars and config keys, as it is used in quite a few places, or you will need to edit those where it is already in usage to suit your needs .

> The removal/replacement of almost all folders except for `config` folder is trivially possible, with very little to change in other files.

## Multi-Tenancy

Multi tenancy support is working, and can have both dynamic connections for each request and have multi db connection at startup.
If only 1 db has been specified, it will be auto detected and will use it automatically

**NB: For usage on multi-tenancy with dynamic connections, please read the comment in `middleware/authorize.js` about setting it up.**

**_Made with :heart: :computer: :pizza: by bitDaft_**



## TODO

- [x] update all packages to latest version
- [x] Fix Knex cli command execution issues
- [x] Add docker support
- [x] Add testing support
- [x] Allow dynamic rate limit based on whether request is API key or session API call
- [x] Fixed working of multi tenancy and multi database
- [x] Auto detection of tenant (with little initial setup work)
- [ ] Add unit, integration test
- [ ] Complete proper documentation
- [ ] Add Multi tenancy connection example
