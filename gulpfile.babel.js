
const production   = false,
      errorHandler = (err) => { console.log(err.toString()); this.emit('end'); };





const eslint_rules  = require('./config/eslint_rules.json'),

      dirs          = { dist: './dist', build: './build', doc: './doc', 'build/shared': './build/shared', 'dist/shared': './dist/shared' },
      less_cfg      = { },
      babel_cfg     = { presets: [ 'es2015', 'react' ] },
      eslint_cfg    = { rules: eslint_rules, extends: 'eslint:recommended', parser: 'babel-eslint', env: { node: true, commonjs: true }, plugins: ['react'], parserOptions: { ecmaFeatures: { jsx: true } } },
      aws_config    = { cache_control_max_age: 300 };





const path          = require('path'),
      fs            = require('fs'),
      child_process = require('child_process'),
        cmd         =   child_process.execSync,

      del           = require('del'),

      browserify    = require('browserify'),
      source        = require('vinyl-source-stream'),

      gulp          = require('gulp'),
      mocha         = require('gulp-mocha'),
      eslint        = require('gulp-eslint'),
//    esdoc         = require('gulp-esdoc'),
      rename        = require('gulp-rename'),
      babel         = require('gulp-babel'),
      less          = require('gulp-less'),
      uglify        = require('gulp-uglify'),

      gulp_factory  = require('./page_factory.js').gulp_factory;





const page_template = `${fs.readFileSync('./src/html/template.html')}`;





gulp.task('clean', () => del( Object.keys(dirs).map(key => dirs[key]) ) );





gulp.task('make-dirs', ['clean'], function(done_cb) {

  for (var key in dirs) {
    try      { fs.mkdirSync('.' + path.sep + path.normalize(dirs[key])); }
    catch(e) { if (e.code !== 'EEXIST') { console.log('caught ' + JSON.stringify(e) + ' while making dirs'); } }
  }

  done_cb();

});





gulp.task('static-copy', ['make-dirs'], function() {

    return gulp.src(['src/static/**/*'])
        .pipe(gulp.dest('./build/'))
        .pipe(gulp.dest('./dist/'));

});





gulp.task('babel', ['setup'], function() {

    return gulp.src(['src/js/**/*.js', 'src/test_js/**/*.js'])
        .pipe(babel(babel_cfg))
        .pipe(gulp.dest('./build'));

});





gulp.task('es5-copy', ['setup', 'babel'], function() {

    return gulp.src(['build/wsl.js'])
        .pipe(rename({extname: '.es5.js'}))
        .pipe(gulp.dest('./dist'));

});





gulp.task('extlib-copy', ['setup'], function() {

// currently a no-op.  hooray!

// this is a last resort.  use of this is cowardly and wrong.
/*
    return gulp.src(["node_modules/whatever"])
        .pipe(gulp.dest("./build"))
        .pipe(gulp.dest("./dist"));
*/

});





gulp.task('browserify', ['setup', 'babel', 'es5-copy', 'extlib-copy'], function() {

    var browserifyConfig = {},
        bpack            = browserify(browserifyConfig, { 'debug' : !production });

    return bpack
        .require('./build/wsl.js', { 'expose' : 'wsl' })
//      .external('d3')
        .bundle()
        .on('error', errorHandler)
        .pipe(source('wsl.es5.browserified.js'))
        .pipe(gulp.dest('./build'))
        .pipe(gulp.dest('./dist'));

});




/*
gulp.task('closure5', ['setup', 'browserify'], function() {
  return gulp.src('./build/wsl.es5.browserified.js')
    .pipe(closure( {
      compilerPath : 'node_modules/closure-compiler/node_modules/google-closure-compiler/compiler.jar',
      fileName     : 'wsl.es5.browserified.min.js'
    } ))
    
    .pipe(gulp.dest('./build'))
    .pipe(gulp.dest('./dist'));
});
*/




 
gulp.task('uglify', ['setup', 'browserify'], function() {

  return gulp.src('./build/wsl.es5.browserified.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./build'))
    .pipe(gulp.dest('./dist'));

});





gulp.task('build-html', ['setup'], function() {

    return gulp.src(['pages/**/*.md'])
        .pipe(gulp_factory(page_template))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('./build'))
        .pipe(gulp.dest('./dist'));

});





gulp.task('less', ['setup'], function() {

    return gulp.src(['src/less/wsl.less'])
        .pipe(less(less_cfg))
        .pipe(gulp.dest('./build/shared'))
        .pipe(gulp.dest('./dist/shared'));

});





gulp.task('doc', ['build'], function() {
/*
    return gulp.src(['./src/js'])
        .pipe(esdoc({ destination: './doc' }));
*/
  console.log('todo: switch from esdoc to jsdoc')
});





gulp.task('mocha', ['build-main'], function() {

    return gulp.src('./build/wsl_tests.js', {read: false})
        .pipe(mocha({reporter: 'mocha-silent-reporter'}));

});





gulp.task('eslint', function() {

    return gulp.src([/*'./gulpfile.babel.js', */'./src/js/*.js'])
        .pipe(eslint(eslint_cfg))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

});





gulp.task('setup',       ['clean', 'make-dirs', 'static-copy']);

gulp.task('build-main',  ['setup', 'build-html', 'es5-copy', 'extlib-copy', 'browserify', 'less']);
gulp.task('build',       ['build-main', 'test', 'uglify']);
gulp.task('build-extra', ['build', 'doc']);
gulp.task('test',        ['mocha', 'eslint']);

gulp.task('default',     ['build']);





gulp.task('publish', ['build-extra'], function(done_cb) {

    var ghpages = require('gh-pages');
    ghpages.publish('./dist', () => done_cb());

});
