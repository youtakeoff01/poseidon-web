	var gulp = require('gulp');
	var del = require('del');
	
	gulp.task('clean', function() {
	    return del('./dist');
	});
	
	gulp.task('clean-master',function() {
		return del('app/css/master.css');
	});