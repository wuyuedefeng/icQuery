// npm install gulp-browserify babelify  gulp-plumber gulp --save-dev
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
gulp.task('es6ToEs5', function() {
    return browserify('./src/main.js')
        .transform(babelify)
        .bundle()
        .pipe(plumber())
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('icQuery.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./'));
});

var uglify = require('gulp-uglify');
gulp.task('uglify',['es6ToEs5'], function () {
   return gulp.src('./icQuery.js')
       .pipe(plumber())
       .pipe(uglify())
       .pipe(gulp.dest("./"));
});


// npm install --save-dev gulp-watch --save-dev
var watch = require('gulp-watch');
gulp.task('watch',['uglify'], function(){
    watch('./src/**/*.js', function () {
        gulp.run('uglify');
    });
});
