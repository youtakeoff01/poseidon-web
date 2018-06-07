/**
 *@author Lishanming_
 * created on 2017年5月1日 15:42:12
 */
'use strict';

	var gulp = require('gulp');
	var wrench = require('wrench');

	/*加载所有任务*/
	wrench.readdirSyncRecursive('./gulp').filter(function(file) {
	  return (/\.(js|coffee)$/i).test(file);
	}).map(function(file) {
	  require('./gulp/' + file);
	});
	
	gulp.task('default',function(){
		gulp.start('browser-sync');
	});

