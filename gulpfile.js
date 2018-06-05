const gulp = require('gulp');
const gulpConcat = require('gulp-concat');
const gulpBabel = require('gulp-babel');
const gulpUglify = require('gulp-uglify');

// 预先 babel -> Uglify 压缩 .min -> 合并 -> 输出
gulp.task('main', function() {
    gulp.src(['./libs/polyfill.min.js', './libs/exif.js', './src/emiya-canvas.js'])
        .pipe(gulpBabel({
            presets: ['env']
        }))
        .pipe(gulpUglify())
        .pipe(gulpConcat('emiya-canvas.min.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('module', function() {
    gulp.src('./showcase.js')
        .pipe(gulpBabel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['main', 'module']);