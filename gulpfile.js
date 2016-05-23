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
const vinylFs = require('vinyl-fs');

const config = require('./config.json');
const fsLayer = require('./vinyl-fs-layer');

const mountComponent = (c) => {
  return fsLayer.read(`${config.submodule}/components/${c}`)
  .pipe(fsLayer.mount(`src/${c}`));
};

const files = () => merge.apply(null,
  _.map(config.modules.components, mountComponent)
  .concat(_.map(config.modules.utilities, (u) => fsLayer.read(`${config.submodule}/utilities/${u}`)))
  // gulp 3 uses vinyl 0.3, which doesn't support the base option, which is needed for the stem
  .concat(vinylFs.src(`${config.submodule}/utilities/utilities.module.js`, {
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
  let modules = _.map(config.modules.components, (c) => `encore.ui.${c}`).concat('encore.ui.utilities');
  merge(buildScripts(), buildTemplates())
  .pipe(concat('encore-bridge.js'))
  .pipe(insert.prepend("angular.module('encore.bridge', ['" + modules.join("','") + "']);\n\n"))
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
  const templates = files()
  .pipe(filter('**/docs/*.html'))
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(html2js({
    declareModule: false,
    moduleName: 'demoApp',
    rename: (url) => _.last(url.split('/'))
  }));

  const scripts = files()
  .pipe(filter('**/docs/*.js'))
  .pipe(filter((file) => !file.stem.includes('.')));

  merge(scripts, templates)
  .pipe(concat('demo.js'))
  .pipe(gulp.dest('./demo/'));
});
