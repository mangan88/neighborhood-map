var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	watch = require('gulp-watch');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
	livereload.listen();
	gulp.watch('index.html').on('change', livereload.changed);
	gulp.watch('css/*.css').on('change', livereload.changed);
	gulp.watch('js/*.js').on('change', livereload.changed);
});
