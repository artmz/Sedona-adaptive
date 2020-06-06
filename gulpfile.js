const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');




gulp.task('sass', function(done) {
    gulp.src("source/sass/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest("source/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("source/css"))
        .pipe(browserSync.stream())



    done();
});


//Post Html

gulp.task('html', function(done) {
  gulp.src("source/*html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("source"))


    done();
});

//svgStore for Sprites

gulp.task('sprite', function(done) {
  gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img"))


  done();
});

//Images optimization

gulp.task('images', function(done) {
  gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("source/img"))

  done()
});

//BrowserSync
gulp.task('serve', function(done) {

    browserSync.init({
        server: "source"
    });

    gulp.watch("source/sass/*.scss", gulp.series('sass'));
    gulp.watch("source/*.html").on('change', () => {
      browserSync.reload();
      done();
    });


    done();
});

gulp.task('default', gulp.series('sass', 'serve'));
