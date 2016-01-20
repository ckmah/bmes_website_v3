// grab gulp packages
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

var bases = {
    dev: 'dev/',
    dist: 'dist/'
};

var paths = {
    js: ['js/*.js', '!js/*.min.js'],
    jsAll: ['js/*.js'],
    styles: ['styles/*.less', 'styles/**/*.less', 'styles/*.css'],
    html: ['*.html', '**/*.html'],
    images: ['images/**/*.png', 'images/**/*.jpg'],
    extras: ['.htcacess', 'crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico']
};

gulp.task('default', ['sequence']);

// configure jshint task
gulp.task('jshint', function() {
    return gulp.src(paths.js, {
            cwd: bases.dev
        })
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(bases.dist)
        .pipe(plugins.clean());
});

// minify js and concatenate into one file
gulp.task('build-js', function() {
    return gulp.src(paths.jsAll, {
            cwd: bases.dev,
            base: bases.dev + 'js/'

        }) // process original source
        .pipe(plugins.sourcemaps.init())
        // only uglify if gulp is ran with '--type production'
        .pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(bases.dist + 'js/'))
        .pipe(browserSync.stream());
});

// task ensures the `build-js` task is complete before reloading browsers
gulp.task('js-watch', ['build-js'], browserSync.reload);

// compile less map to modified source
gulp.task('build-css', function() {
    return gulp.src(paths.styles, {
            cwd: bases.dev,
            base: bases.dev + 'styles/'

        }) // process original source
        .pipe(plugins.less())
        .pipe((gulp.dest(bases.dist + 'css/')))
        .pipe(browserSync.stream());
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', function() {
    return gulp.src(paths.images, {
            cwd: bases.dev,
            base: bases.dev + 'images/'
        })
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(bases.dist + 'images/'))
        .pipe(browserSync.stream());

});

// copy html files
gulp.task('copy-html', function() {
    return gulp.src(paths.html, {
            cwd: bases.dev,
            base: bases.dev
        })
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());
});

// copy extra files
gulp.task('copy-extras', function() {
    return gulp.src(paths.extras, {
            cwd: bases.dev,
            base: bases.dev
        })
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());
});

// build task
gulp.task('build', ['jshint', 'build-js', 'build-css', 'imagemin', 'copy-html']);

// configure which files to watch and what tasks to use on file changes
gulp.task('serve', function(gulpCallback) {
    // static server
    browserSync.init({
        server: {
            baseDir: bases.dist
        }
    }, function callback() {
        // server is now up, watch files
        gulp.watch(paths.html, {
            cwd: bases.dev,
            base: bases.dev
        }, ['copy-html']);
        gulp.watch(paths.jsAll, {
            cwd: bases.dev,
            base: bases.dev
        }, ['jshint', 'js-watch']);
        gulp.watch(paths.styles, {
            cwd: bases.dev,
            base: bases.dev
        }, ['build-css']);
        gulp.watch(paths.images, {
            cwd: bases.dev,
            base: bases.dev
        }, ['imagemin']);

        //gulp.watch(bases.dev + paths.extras, ['copy-extras']);
        gulpCallback();
    });
})

// run clean, build, and serve in sequence
gulp.task('sequence', function(callback) {
    runSequence('clean', 'build', 'serve', callback);
})
