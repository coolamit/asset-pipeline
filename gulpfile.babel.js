/**
 * Gulp file containing all tasks for asset pipeline
 *
 * @author Amit Gupta <https://igeek.info/>
 *
 * @since 2020-05-14
 */

"use strict";

/*
 * Components to be used
 */
const gulp    = require( 'gulp' );
const babel   = require( 'gulp-babel' );
const sass    = require( 'gulp-sass' );
const cssmin  = require( 'gulp-clean-css' );
const prefix  = require( 'gulp-autoprefixer' );
const plumber = require( 'gulp-plumber' );
const uglify  = require( 'gulp-uglify' );
const notify  = require( 'gulp-notify' );
const growl   = require( 'notify-send' );
const del     = require( 'del' );

/**
 * @type {object} Paths to asset source and build directories
 */
const assetsDir = {
	buildRoot: 'build',
	cssSrc:    'src/scss/**/*.scss',
	cssBuild:  'build/css',
	jsSrc:     'src/js/**/*.js',
	jsBuild:   'build/js',
	imgSrc:    'src/images/**/*.*',
	imgBuild:  'build/images',
};

/**
 * @type {object} Asset compile options
 */
const assetOptions = {
	scss: {
		outputStyle: 'expanded'
	},
	prefixer: {
		overrideBrowserslist: [ '> 5%' ]
	}
};

/**
 * Notification method to push out notifications of completed tasks.
 * This prevents notify-send errors that gulp-notify runs into if the former is not installed.
 *
 * @return {void}
 */
const taskNotifier = notify.withReporter( ( options ) => {

	let title   = ( 'undefined' !== typeof options.title ) ? options.title : '';
	let message = ( 'undefined' !== typeof options.message ) ? options.message : '';

	growl.notify( title, message );

} );

/**
 * Gulp tasks class
 */
class GulpTasks {

	/**
	 * Class constructor
	 */
	constructor() {}

	/**
	 * Method to log events on console
	 *
	 * @param {string} typeEvent
	 * @param {string} text
	 *
	 * @return {void}
	 */
	logEvent( typeEvent, text ) {

		let date = new Date();
		let time = ( ( 10 > date.getHours() ) ? '0' : '' ) + date.getHours() + ':';
		time    += ( ( 10 > date.getMinutes() ) ? '0' : '' ) + date.getMinutes() + ':';
		time    += ( ( 10 > date.getSeconds() ) ? '0' : '' ) + date.getSeconds();

		console.log( '[' + time + '] \x1b[35m' + typeEvent + '\x1b[0m: \x1b[32m' + text + '\x1b[0m' );

	}

	/**
	 * Method to clear compiled build, to start fresh
	 *
	 * @return {Promise<string[]>}
	 */
	clearAssets() {
		return del( [ './' + assetsDir.buildRoot ] );
	}

	/**
	 * Method to clear compiled CSS files, to start fresh
	 *
	 * @return {Promise<string[]>}
	 */
	clearCss() {
		return del( [ './' + assetsDir.cssBuild ] );
	}

	/**
	 * Method to clear compiled JS files, to start fresh
	 *
	 * @return {Promise<string[]>}
	 */
	clearJs() {
		return del( [ './' + assetsDir.jsBuild ] );
	}

	/**
	 * Method to clear built image files, to start fresh
	 *
	 * @return {Promise<string[]>}
	 */
	clearImg() {
		return del( [ './' + assetsDir.imgBuild ] );
	}

	/**
	 * Method to build CSS
	 *
	 * @return {*}
	 */
	buildCss() {

		return (
			gulp
				.src( [ assetsDir.cssSrc ] )
				.pipe( plumber() )
				.pipe( sass( assetOptions.scss ) )
				.pipe( prefix( assetOptions.prefixer ) )
				.pipe( cssmin() )
				.pipe( taskNotifier( 'CSS compiled and minimized <%= file.relative %>' ) )
				.pipe( gulp.dest( assetsDir.cssBuild ) )
		);

	}

	/**
	 * Method to build JS
	 *
	 * @return {*}
	 */
	buildJs() {

		return (
			gulp
				.src( [ assetsDir.jsSrc ] )
				.pipe( plumber() )
				.pipe( babel() )
				.pipe( uglify() )
				.pipe( taskNotifier( 'JS compiled and minimized <%= file.relative %>' ) )
				.pipe( gulp.dest( assetsDir.jsBuild ) )
		);

	}

	/**
	 * Method to build Images
	 *
	 * @return {*}
	 */
	buildImg() {

		return (
			gulp
				.src( [ assetsDir.imgSrc ] )
				.pipe( plumber() )
				.pipe( taskNotifier( 'Images optimized - <%= file.relative %>' ) )
				.pipe( gulp.dest( assetsDir.imgBuild ) )
		);

	}

}  // end class

const oTasks = new GulpTasks();

/*
 * Composite tasks
 */
const buildCss = gulp.series( oTasks.clearCss, oTasks.buildCss );
const buildJs  = gulp.series( oTasks.clearJs, oTasks.buildJs );
const buildImg = gulp.series( oTasks.clearImg, oTasks.buildImg );
const build    = gulp.series( oTasks.clearAssets, gulp.parallel( oTasks.buildCss, oTasks.buildJs, oTasks.buildImg ) );

const watcherCss = () => {
	gulp
		.watch( assetsDir.cssSrc, { ignoreInitial: false, usePolling: true }, gulp.series( oTasks.clearCss, oTasks.buildCss ) )
		.on( 'change', ( path ) => {
			oTasks.logEvent( 'CHANGED CSS', 'File ' + path + ' was changed' );
		} );
};

const watcherJs = () => {
	gulp
		.watch( assetsDir.jsSrc, { ignoreInitial: false, usePolling: true }, gulp.series( oTasks.clearJs, oTasks.buildJs ) )
		.on( 'change', ( path ) => {
			oTasks.logEvent( 'CHANGED JS', 'File ' + path + ' was changed' );
		} );
};

const watcherImg = () => {
	gulp
		.watch( assetsDir.imgSrc, { ignoreInitial: false, usePolling: true }, gulp.series( oTasks.clearImg, oTasks.buildImg ) )
		.on( 'change', ( path ) => {
			oTasks.logEvent( 'CHANGED Image', 'File ' + path + ' was changed' );
		} );
};

const watchFiles = gulp.parallel( watcherCss, watcherJs, watcherImg );

/*
 * Export tasks
 */
exports.buildCss = buildCss;
exports.buildJs  = buildJs;
exports.buildImg = buildImg;
exports.clean    = oTasks.clearAssets;
exports.build    = build;
exports.watchCss = watcherCss;
exports.watchJs  = watcherJs;
exports.watchImg = watcherImg;
exports.watch    = watchFiles;
exports.default  = build;

//EOF
