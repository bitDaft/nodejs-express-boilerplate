# Nodejs Express Boilerplate

[![CodeFactor](https://www.codefactor.io/repository/github/bitdaft/nodejs-objection-boilerplate/badge)](https://www.codefactor.io/repository/github/bitdaft/nodejs-objection-boilerplate)

This is a opinianated starter template for nodejs express projects

## Features

- Clean structure
- Hierarchical config with config file, args, and env variables, all accessible through single config object
- Easy multi-database connection management
- Message queue, and workers on separate processes
- Automatic static file loading
- Module based code encapsulation
- Logging on separate process with tagged structured logs
- Easy centralized failure and success handling

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
