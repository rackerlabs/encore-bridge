var _ = require('lodash');
var concat = require('gulp-concat');
var filesort = require('gulp-angular-filesort');
var gulp = require('gulp');
var html2js = require('gulp-ng-html2js');
var htmlmin = require('gulp-htmlmin');
var insert = require('gulp-insert');
var less = require('gulp-less');
var merge = require('merge2');

var config = require('./config.json');

var files = _.map(config.modules.components, (c) => `${config.submodule}/components/${c}/scripts/!(*.spec|*.page|*.exercise).js`)
.concat(_.map(config.modules.components, (c) => `${config.submodule}/components/${c}/${c}.module.js`))
.concat(_.map(config.modules.utilities, (u) => `${config.submodule}/utilities/${u}/scripts/${u}.js`))
.concat(`${config.submodule}/utilities/utilities.module.js`);

var modules = _.map(config.modules.components, (c) => `encore.ui.${c}`)
.concat('encore.ui.utilities');

function buildEncore () {
  return gulp.src(files)
  .pipe(filesort())
};

function buildTemplates () {
  return gulp.src('src/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(html2js({
    declareModule: false,
    moduleName: 'encore.bridge',
    rename: (url) => `templates/${_.last(url.split('/'))}`
  }))
}

gulp.task('build:scripts', function () {
  merge(buildEncore(), buildTemplates(), gulp.src('src/**/*.js'))
  .pipe(concat('encore-bridge.js'))
  .pipe(insert.prepend(
    "angular.module('encore.bridge', ['" + modules.join("','") + "']);\n"
  ))
  .pipe(gulp.dest('./demo/'));
});

gulp.task('build:styles', function () {
  gulp.src('src/**/*.less')
  .pipe(less())
  .pipe(concat('encore-bridge.css'))
  .pipe(gulp.dest('./demo/'));
});

gulp.task('watch', ['build:styles', 'build:scripts'], function () {
  gulp.watch('src/**/*.less', ['build:styles']);
  gulp.watch('src/**/*', ['build:scripts']);
});

gulp.task('demo', function () {
  gulp.src(_.map(config.modules.components, (c) => `${config.submodule}/components/${c}/docs/${c}.js`))
  .pipe(concat('demoCtrls.js'))
  .pipe(gulp.dest('./demo/'));
});
