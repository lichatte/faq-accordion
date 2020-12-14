var gulp = require('gulp');
// Requires the gulp-sass plugin
var sasss = require('gulp-sass');

gulp.task('sasss', function () {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sasss())
        .pipe(gulp.dest('root/css'))
});

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Other watchers
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
        .pipe(sasss())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

var useref = require('gulp-useref');

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulp.dest('root'))
});

// Other requires...
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('root'))
});

var cssnano = require('gulp-cssnano');

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('root'))
});

var imagemin = require('gulp-imagemin');

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('root/images'))
});

var cache = require('gulp-cache');

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        // Caching images that ran through imagemin
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('root/images'))
});

var del = require('del');

gulp.task('clean:root', function () {
    return del.sync('root');
});

var runSequence = require('run-sequence');

gulp.task('build', function (callback) {
    runSequence('clean:root',
        ['sasss', 'useref', 'images'],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});