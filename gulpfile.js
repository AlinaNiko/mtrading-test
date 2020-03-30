"use strict";

let gulp = require("gulp"),
    watch = require("gulp-watch"),
    prefixer = require("gulp-autoprefixer"),
    sass = require("gulp-sass"),
    rimraf = require("rimraf"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

const ghPages = require("gh-pages");
const pathPages = require("path");

let path = {
    build: {
      html: "build/",
      css: "build/css/",
      images: "build/images/",
      fonts: "build/fonts/"
    },

    src: {
      html: "src/*.html",
      scss: "src/scss/style.scss",
      images: "src/images/**/*.*",
      fonts: "src/fonts/**/*.*"
    },

    watch: {
      html: "src/**/*.html",
      scss: "src/scss/**/*.scss",
      images: "src/images/**/*.*",
      fonts: "src/fonts/**/*.*"
    },

    clean: "./build"
};

let config = {
    server: {
      baseDir: "./build"
    },
    host: "localhost",
    port: 5000
};

function htmlBuild() {
  return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
}

function cssBuild() {
  return gulp.src(path.src.scss)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream:true}));
}

function imagesBuild() {
  return gulp.src(path.src.images)
        .pipe(gulp.dest(path.build.images))
        .pipe(reload({stream:true}));
}

function fontsBuild() {
  return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream:true}))
}

function watcher() {
  watch([path.watch.html], gulp.series(htmlBuild));
  watch([path.watch.scss], gulp.series(cssBuild));
  watch([path.watch.images], gulp.series(imagesBuild));
  watch([path.watch.fonts], gulp.series(fontsBuild));
}

function webserver() {
  browserSync(config);
}

function clean(cb) {
  rimraf(path.clean, cb)
}


exports.htmlBuild = htmlBuild;
exports.cssBuild = cssBuild;
exports.imagesBuild = imagesBuild;
exports.fontsBuild = fontsBuild;
exports.watcher = watcher;
exports.webserver = webserver;
exports.clean = clean;

function build(cb) {
  gulp.series(clean, gulp.parallel(clean, htmlBuild, cssBuild, imagesBuild, fontsBuild))(cb);
}

exports.build = build;
exports.default = gulp.series(build, gulp.parallel(watcher, webserver));



function deploy(cb) {
  ghPages.publish(pathPages.join(process.cwd(), "./build"), cb);
}

exports.deploy = deploy;