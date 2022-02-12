const { src, dest, watch, parallel, series } = require('gulp')

const fileinclude = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const csso = require('gulp-csso')
const sourcemaps = require('gulp-sourcemaps')
const gulpif = require('gulp-if')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')

const del = require('del');
const browserSync = require('browser-sync').create();


const jsFiles = ['./src/js/one.js', './src/js/two.js']
let isDev = true



function html() {
    return src(['./src/**/*.html', '!./src/html-parts/*.html'])
        .pipe(fileinclude({
            prefix: '@@'
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('./dist/'))
}

function scss() {
    return src(['./src/css/*.scss'])
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false,
            overrideBrowserslist: '> .5% or last 10 versions',
            grid: 'autoplace'
        }))
        .pipe(gcmq())
        .pipe(csso())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(dest('./dist/css/'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(jsFiles)
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(newer('./dist/js/'))
        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(dest('./dist/js/'))
        .pipe(browserSync.stream());
}

function images() {
    return src('./src/img/**/*')
        .pipe(newer('./dist/img/'))
        .pipe(imagemin())
        .pipe(dest('./dist/img/'))
}

function fonts() {
    return src('./src/fonts/**/*')
        .pipe(dest('./dist/fonts'))
}

function clean() {
    return del('dist/*')
    // return del(['dist/*', '!img/'])
}

function watcher() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })

    watch('./src/**/*.html', html).on('change', browserSync.reload)
    watch('./src/css/**/*.scss', scss)
    watch('./src/js/**/*.js', scripts)
    watch('./src/img/**/*', images)
    watch('./src/fonts/**/*', fonts)
}

async function replaceByBuild() {
    return isDev = false
}


exports.html = html
exports.scss = scss
exports.scripts = scripts
exports.images = images
exports.fonts = fonts
exports.clean = clean
exports.replaceByBuild = replaceByBuild

exports.watcher = watcher
exports.dev = series(clean, parallel(html, scss, scripts, images, fonts), watcher)
exports.build = series(clean, replaceByBuild, parallel(html, scss, scripts, images, fonts))



