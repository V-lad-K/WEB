
const { src, dest, watch, parallel } = require('gulp');
const scss    = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin')
function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    });
}

function image(){
    return src('app/images/**/*')
    .pipe(imagemin(
        [
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]
    ))
    .pipe(dest('dist/images'))
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles() {
    return src('app/scss/styles.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('styles.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}


function watching() {
    watch(['app/**/*.scss'], styles)
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts)
    watch(['app/**/*.html']).on('change', browserSync.reload)
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts

exports.default = parallel(watching, browsersync, styles, scripts)