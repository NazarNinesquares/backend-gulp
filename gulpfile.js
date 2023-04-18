let project_folder = "assets";

// Змінна із списком шляхів файлів
let path = {

	// Список зкомпільованих папок/файлів
	build: {
		css: project_folder + "/css/",
		js: project_folder + "/js/",
	},
	// Список робочих папок/файлів
	src: {
		css: project_folder + "/scss/style.scss",
		js: project_folder + "/js/scripts.js",
	},
	// Список папок/файлів, за якими GULP постійно слідкує
	watch: {
		css: project_folder + "/scss/**/*.scss",
		js: project_folder + "/js/scripts.js",
	},
	// Коренева папка вихідних папок/файлів, яку GULP очищає при запуску
	clean: {
		css: project_folder + "/css/",
		js: project_folder + "/js/scripts.min.js",
	}
}

// Список плагінів
let {src, dest} = require('gulp'),
	gulp = require('gulp'),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	del = require('del'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default;



function css() {
	return src(path.src.css)
	.pipe(scss({
		oninputStyle: 'expanded'
	}).on('error', scss.logError))
	.pipe(group_media())
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 10 versions'], grid: true,
		cascade: true
	}))
	.pipe(dest(path.build.css))
	.pipe(clean_css({level: { 2: { specialComments: 0 } } }))
	.pipe(rename({
		extname: '.min.css'
	}))
	.pipe(dest(path.build.css))
}

function js() {
	return src(path.src.js)
	.pipe(uglify({
		toplevel: true
	}))
	.pipe(rename({
		extname: '.min.js'
	}))
	.pipe(dest(path.build.js))
}

function watchFiles() {
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
}

function clean () {
	return del(path.clean.css), del(path.clean.js);
}

let build = gulp.series(clean, gulp.parallel(js, css));
let watch = gulp.parallel(build, watchFiles);




exports.js = js;
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = watch;