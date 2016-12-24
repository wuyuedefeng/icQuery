// npm install gulp-browserify babelify  gulp-plumber gulp --save-dev
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var plumber = require('gulp-plumber');
var conditionalify = require('conditionalify');
gulp.task('es6ToEs5', function() {
    return browserify('./src/main.js')
        .transform('conditionalify', {
            context: {
                icNote: 'exist',
                icArgs: 'exist'
            }
        })
        .transform(babelify)
        .bundle()
        .pipe(plumber())
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('icQuery.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./build'));
});

var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
gulp.task('uglify',['es6ToEs5'], function () {
   return gulp.src('./build/icQuery.js')
       .pipe(plumber())
       .pipe(uglify())
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest("./build"));
});


// npm install --save-dev gulp-watch --save-dev
var watch = require('gulp-watch');
gulp.task('watch',['uglify'], function(){
    watch('./src/**/*.js', function () {
        gulp.run('uglify');
    });
});
