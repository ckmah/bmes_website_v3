// grab gulp packages
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var fs = require('fs');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var argv = require('minimist')(process.argv.slice(2));


var RELEASE = !!argv.release; // Minimize and optimize during a build?
var GOOGLE_ANALYTICS_ID = 'UA-XXXXXXXX-X'; // https://www.google.com/analytics/web/
var AUTOPREFIXER_BROWSERS = [ // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var pkgs = require('./package.json').dependencies;

var bases = {
  dev: 'dev/',
  dist: 'dist/'
};

var paths = {
  js: ['js/*.js', '!js/*.min.js'],
  jsAll: ['js/*.js'],
  styles: ['styles/*.less', 'styles/**/*.less', 'styles/*.css'],
  // html: ['*.html', '**/*.html'],
  // TODO load fonts
  images: ['images/**/*.png', 'images/**/*.jpg'],
  extras: ['.htcacess', 'crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
  pages: ['pages/**/*', 'layouts/**/*', 'partials/**/*'],
  data: 'data/**/*'
  // styles: ['styles/**/*.{css,less}']
};

gulp.task('default', ['sequence']);

// configure jshint task
gulp.task('jshint', function() {
  return gulp.src(paths.js, {
      cwd: bases.dev
    })
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

// Delete the dist directory
gulp.task('clean', function() {
  return gulp.src(bases.dist)
    .pipe($.clean());
});

// minify js and concatenate into one file
gulp.task('build-js', function() {
  return gulp.src(paths.jsAll, {
      cwd: bases.dev,
      base: bases.dev + 'js/'
    }) // process original source
    .pipe($.sourcemaps.init())
    // only uglify if gulp is ran with '--type production'
    .pipe($.util.env.type === 'production' ? $.uglify() : $.util.noop())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(bases.dist + 'js/'))
    .pipe(browserSync.stream());
});

// task ensures the `build-js` task is complete before reloading browsers
gulp.task('js-watch', ['build-js'], browserSync.reload);

// compile less
gulp.task('styles', function() {
  return gulp.src(paths.styles, {
      cwd: bases.dev,
      base: bases.dev + 'styles/'
    }) // process original source
    .pipe($.less())
    .pipe((gulp.dest(bases.dist + 'css/')))
    .pipe(browserSync.stream());
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', function() {
  return gulp.src(paths.images, {
      cwd: bases.dev,
      base: bases.dev + 'images/'
    })
    .pipe($.imagemin())
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

// HTML pages + content data
gulp.task('pages', function() {
  return gulp.src(paths.pages[0], {
    cwd: bases.dev,
    // base: bases.dev
  })
    .pipe($.if(/\.jade$/, $.jade({
      pretty: !RELEASE,
      locals: {
        pkgs: pkgs,
        googleAnalyticsID: GOOGLE_ANALYTICS_ID,
        // content: JSON.parse(fs.readFileSync('./data/content.json'))
      }
    })))
    .pipe($.if(RELEASE, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    })))
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
gulp.task('build', [
  'jshint',
  'build-js',
  'styles',
  'imagemin',
  'pages']);

// configure which files to watch and what tasks to use on file changes
gulp.task('serve', function(gulpCallback) {
  // static server
  browserSync.init({
    server: {
      baseDir: bases.dist
    }
  }, function callback() {
    // server is now up, watch files
    gulp.watch(paths.pages, {
      cwd: bases.dev,
      base: bases.dev
    }, ['pages']);
    gulp.watch(paths.jsAll, {
      cwd: bases.dev,
      base: bases.dev
    }, ['jshint', 'js-watch']);
    gulp.watch(paths.styles, {
      cwd: bases.dev,
      base: bases.dev
    }, ['styles']);
    gulp.watch(paths.images, {
      cwd: bases.dev,
      base: bases.dev
    }, ['imagemin']);

    //gulp.watch(bases.dev + paths.extras, ['copy-extras']);
    gulpCallback();
  });
});

// run clean, build, and serve in sequence
gulp.task('sequence', function(callback) {
  runSequence('clean', 'build', 'serve', callback);
});
