'use strict';

const _ = require('lodash');
const concat = require('gulp-concat');
const filesort = require('gulp-angular-filesort');
const filter = require('gulp-filter');
const gulp = require('gulp');
const html2js = require('gulp-ng-html2js');
const htmlmin = require('gulp-htmlmin');
const insert = require('gulp-insert');
const less = require('gulp-less');
const merge = require('merge2');
const ngAnnotate = require('gulp-ng-annotate');
const vinylFs = require('vinyl-fs');

const config = require('./config.json');
const fsLayer = require('./vinyl-fs-layer');

const mount = (type) => (name) => {
  return fsLayer.read(`${config.submodule}/${type}s/${name}`)
  .pipe(fsLayer.mount(`src/${type}s/${name}`))
};

const files = () => merge.apply(null,
  _.map(config.modules.components, mount('component'))
  .concat(_.map(config.modules.elements, mount('element')))
  .concat(vinylFs.src(`${config.submodule}/elements/elements.module.js`, {
    base: `${config.submodule}/elements`
  }))
  .concat(_.map(config.modules.utilities, (u) => fsLayer.read(`${config.submodule}/utilities/${u}`)))
  // gulp 3 uses vinyl 0.3, which doesn't support the base option, which is needed for the stem
  .concat(vinylFs.src('src/utilities/utilities.module.js', {
    base: `${config.submodule}/utilities`
  }))
);

function buildScripts () {
  return files()
  .pipe(filter(['**/scripts/*.js', '**/*.module.js']))
  .pipe(filter((file) => !file.stem.includes('.') || file.stem.includes('module') || file.stem.includes('decorator')))
  .pipe(filesort());
};

function buildTemplates () {
  return files()
  .pipe(filter('**/templates/*.html'))
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(html2js({
    declareModule: false,
    moduleName: 'encore.bridge'
  }));
}

gulp.task('build:scripts', function () {
  let modules = _.map(config.modules.components, (c) => `encore.ui.${c}`).concat(['encore.ui.utilities', 'encore.ui.elements']);
  merge(buildScripts(), buildTemplates())
  .pipe(concat('encore-bridge.js'))
  .pipe(insert.prepend("angular.module('encore.bridge', ['" + modules.join("','") + "']);\n\n"))
  .pipe(ngAnnotate())
  .pipe(gulp.dest('./demo/'));
});

gulp.task('build:styles', function () {
  files()
  .pipe(filter('**/*.less'))
  .pipe(concat('encore-bridge.css'))
  .pipe(insert.prepend([
    '@import (reference) "encore-ui/src/styles/vars.less";',
    '@import (reference) "encore-ui/src/styles/mixins.less";',
    '@import "encore-ui/src/base.less";',
    '@import (reference) "vars.less";',
    // TODO: remove flexbox layout (fix rxForm)
    '@import "encore-ui/src/elements/FlexboxGrid/styles/layout.less";'
  ].join('\n')))
  .pipe(less({ paths: ['./', './src/styles', './encore-ui/src/styles', './node_modules/normalize.css'] }))
  .pipe(gulp.dest('./demo/'));
});

gulp.task('build:less', function () {
  gulp.src(['encore-ui/src/styles/vars.less', 'src/styles/vars.less'])
  .pipe(concat('encore-bridge.less'))
  .pipe(gulp.dest('./dist'))
});

gulp.task('build', ['build:styles', 'build:scripts']);

gulp.task('build:dist', ['build', 'build:less'], function () {
  gulp.src('demo/encore-bridge.*').pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.less', ['build:styles']);
  gulp.watch('src/**/*', ['build:scripts']);
});

gulp.task('demo', ['build'], function () {
  const templates = files()
  .pipe(filter('**/docs/**/*.html'))
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(html2js({
    declareModule: false,
    moduleName: 'demoApp',
    rename: (url) => _.last(url.split('/'))
  }));

  const scripts = files()
  .pipe(filter('**/docs/**/*.js'))

  merge(scripts, templates)
  .pipe(concat('demo.js'))
  .pipe(gulp.dest('./demo/'));
});
