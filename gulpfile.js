/* gulpfile.js  –  pronto para Dart-Sass (node-sass removido) */
var gulp        = require('gulp');
var sass        = require('gulp-sass')(require('sass'));   // <-- mudança chave
var browserSync = require('browser-sync').create();
var header      = require('gulp-header');
var cleanCSS    = require('gulp-clean-css');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var pkg         = require('./package.json');

// Banner
var banner = [
  '/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  ''
].join('');

// Compila SCSS
gulp.task('sass', function () {
  return gulp.src('scss/resume.scss')
    .pipe(sass().on('error', sass.logError))   // log de erros claro
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

// Minifica CSS
gulp.task('minify-css', gulp.series('sass', function () {
  return gulp.src('css/resume.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
}));

// Minifica JS
gulp.task('minify-js', function () {
  return gulp.src('js/resume.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.stream());
});

// Copia vendors
gulp.task('copy', function () {
  gulp.src([
    'node_modules/bootstrap/dist/**/*',
    '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'
  ]).pipe(gulp.dest('vendor/bootstrap'));

  gulp.src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/jquery/dist/jquery.min.js'
  ]).pipe(gulp.dest('vendor/jquery'));

  gulp.src(['node_modules/jquery.easing/*.js'])
    .pipe(gulp.dest('vendor/jquery-easing'));

  gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ]).pipe(gulp.dest('vendor/font-awesome'));

  gulp.src([
    'node_modules/devicons/**/*',
    '!node_modules/devicons/*.json',
    '!node_modules/devicons/*.md',
    '!node_modules/devicons/!PNG',
    '!node_modules/devicons/!PNG/**/*',
    '!node_modules/devicons/!SVG',
    '!node_modules/devicons/!SVG/**/*'
  ]).pipe(gulp.dest('vendor/devicons'));

  gulp.src([
    'node_modules/simple-line-icons/**/*',
    '!node_modules/simple-line-icons/*.json',
    '!node_modules/simple-line-icons/*.md'
  ]).pipe(gulp.dest('vendor/simple-line-icons'));
});

// Tarefas principais
gulp.task('default', gulp.parallel('sass', 'minify-css', 'minify-js', 'copy'));

gulp.task('browserSync', function () {
  browserSync.init({ server: { baseDir: './' } });
});

gulp.task('dev', gulp.series(
  gulp.parallel('sass', 'minify-css', 'minify-js'),
  gulp.parallel('browserSync', function watch () {
    gulp.watch('scss/**/*.scss', gulp.series('sass'));
    gulp.watch('css/*.css', gulp.series('minify-css'));
    gulp.watch('js/*.js', gulp.series('minify-js'));
    gulp.watch('*.html').on('change', browserSync.reload);
  })
));