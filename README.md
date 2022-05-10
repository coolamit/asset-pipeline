# iGeek Asset Pipeline

This is an asset pipeline base that I use on my projects.

## Prerequisites

### Directory structure

The asset pipeline expects this directory structure.
```
assets                        <-- {assets root dir}
    |_ src                    <-- {source files for scss, js, images}
        |_ scss
        |_ js
        |_ images
    |_ build                  <-- {compiled files for css, js, images}
        |_ css
        |_ js
        |_ images
    |_ .babelrc               <-- {babel config}
    |_ .nvmrc                 <-- {nvm config contaiing node ver to use}
    |_ gulpfile.babel.js      <-- {gulp tasks}
    |_ package.json           <-- {packages to install}
```

### Dependency manager

You can use `npm` or [`yarn`](https://yarnpkg.com/) - whichever you prefer. I personally prefer `yarn` and use that because its faster, less annoying & less error prone than `npm`. This document assumes you choose to use `yarn`.

Also, this asset pipeline expects [`nvm`](https://github.com/nvm-sh/nvm) to be installed. `nvm` is a nifty utility which allows you to run multiple node versions on your computer as needed. It's very handy if you work across different projects with different node requirements.

## Usage

### First run

If this is your first run then you need to run the following commands.
1. Switch to `assets/` folder on your terminal and run `nvm install`. This will install the correct version of Node.js to use with this asset pipeline.
2. Run `yarn install` to install the node packages.

### Regular run

1. Switch to `assets/` folder on your terminal and run `nvm use`. This will ensure you are using correct version of node as required by this asset pipeline.
2. Run `yarn run prod` to compile assets for use on production. You can compile only SCSS or JS and commands specific for those purposes along with dev environment commands can be found in `package.json`.

