/**
 *@author Lishanming_
 * created on 2017年2月17日15:35:29
 * description 浏览器重载
 */
'use strict';
	
	var gulp = require('gulp');
	var browserSync =require('browser-sync').create();
	var sass = require('gulp-sass');
	var concat=require('gulp-concat');
	var historyApiFallback = require('connect-history-api-fallback');
	
	gulp.task('sass',['clean-master'],function(){
	    return gulp.src(['app/scss/*.scss',
	        'app/scss/**/*.scss',
	        'app/pages/**/*.scss'
	    ])
	        .pipe(sass().on('error', sass.logError))
	        .pipe(concat('master.css'))
	        .pipe(gulp.dest('app/css'))
	        .pipe(browserSync.stream());
	});
	
	
	gulp.task('browser-sync',['sass','inject'],function () {
	    browserSync.init({
	        server: {
	            baseDir:'./',   //服务器在这里配置ip
            	middleware: [historyApiFallback()]
	        },
	        port: 8421
	    });
	    gulp.watch(['app/scss/*.scss','app/pages/**/*.scss'],['sass']);
	});
	
	
