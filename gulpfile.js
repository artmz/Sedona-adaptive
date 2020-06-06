const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const svgstore = require('gulp-svgstore');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');
const runsequence = require('gulp4-run-sequence');
const server = require('browser-sync').create();


gulp.task('sass', function(done) {
    gulp.src("source/sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"))
        .pipe(server.stream());


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
    .pipe(gulp.dest("build/img"))

  done()
});

// Clean
gulp.task('clean', function(done) {
  del("build")


  done();
});

// Copy
gulp.task('copy', function(done) {
  gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"))


  done();
});

//Post Html

gulp.task('html', function(done) {
  gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"))
    .pipe(server.stream()) //добавил строку

    done();
});

//Sprites

gulp.task('sprite', function(done) {
  gulp.src("source/img/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))


  done();
});


gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.scss", gulp.series('sass'));
  gulp.watch("source/*.html", gulp.series('html'));
  gulp.watch("build/**/*.html").on('change', server.reload);
  gulp.watch("build/css/**/*.css").on('change', server.reload);
});



gulp.task('default', gulp.series('clean', 'copy', 'sass', 'html', 'serve'));
