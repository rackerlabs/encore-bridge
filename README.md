# Encore Bridge

Enable the use of the EncoreUI framework for apps that are designed using Helix and must be exposed to customers.

## Strategy

This is implemented as a custom build of the EncoreUI framework, not a layer on top of it.  To do that, the source code is mounted as a git submodule, and it's directory structure is mirrored in the local src directory.  The gulp-based build system merges the two source trees, preferring local source wherever there is a conflict.  This enables file-specific overrides, but only in situations where different behavior is needed.  Of course, an in-depth knowledge of the EncoreUI framework is required to make much sense of these overrides.


## Building

To test changes, leave `gulp watch` running in one terminal window.  In another, run `gulp demo` to recompile the demo app each time you make a change to the documentation source.  You will also need to run your own http server for the demo app, which can be started via `npm run serve`.


To make it easy for applications to consume the library, the built source is checked in to version control.  Always run
```
gulp build:dist
```
before committing your code to actually make the updates hit the downstream applications.  Think of this as a shortcut to setting up a npm or bower module with a robust release process.
