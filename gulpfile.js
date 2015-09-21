var gulp = require("gulp");
var browserify = require('browserify')
var babelify = require('babelify')
var react = require('gulp-react');
var source = require('vinyl-source-stream')
var using = require('gulp-using');  // ファイル名の出力

gulp.task('browserify', function(){
  var b = browserify({
    entries: ['./src/main.js'],
  });
  return b
   .transform(babelify)
   .bundle()
   .pipe(source('app.js'))
   .pipe(gulp.dest('./js'));
});

gulp.task('react', function() {
  return gulp.src('./src/**/*.jsx')
   .pipe(using())
   .pipe(react())
   .pipe(gulp.dest('js/'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*.jsx'], ['react']);
});
