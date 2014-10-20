# Unit Tests

## Installing Karma

The recommended approach is to install Karma (and all the plugins your project needs) locally in the project's directory.

```
# Install Karma:
npm install karma --save-dev

# Install plugins that your project needs:
npm install karma-jasmine karma-chrome-launcher --save-dev

# Install Karma commandline tool
npm install -g karma-cli
```

## Run Karma Tests

```
karma start karma.conf.js
```
