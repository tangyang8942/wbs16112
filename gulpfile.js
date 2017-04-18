/**
 * Gulp应用
 * 使用的插件：
 * gulp-htmlmin
 * gulp-less
 * gulp-cssmin
 * gulp-concat
 * gulp-uglify
 * gulp-autoprefixer
 * gulp-imagemin
 * gulp-plumber
 * gulp-clean
 * gulp-load-plugins
 * browser-sync  open
 * 
 */

'use strcit';

//加载模块
var gulp=require('gulp');
var $=require('gulp-load-plugins')(); //根据依赖关系自动加载插件
var browserSync=require('browser-sync').create();

//创建一个全局变量，用来定义目录路径
var app={
	srcPath:'src/', //源码source
	devPath:'build/', //构建build，便于测试
	prdPath:'dist/' //发布distribution
};


//html复制压缩
gulp.task('html',function(){
	gulp.src(app.srcPath+'**/*.html')
		.pipe($.plumber())
		.pipe(gulp.dest(app.devPath))
		.pipe($.htmlmin({
			collapseWhitespace:true,
			removeComments:true,
			collapseBooleanAttributes:true,
			removeAttributeQuotes:true,
			removeEmptyAttributes:true,
			removeScriptTypeAttributes:true,
		}))
		.pipe(gulp.dest(app.prdPath))
		.pipe(browserSync.stream()); //浏览器同步更新
});

//less编译、压缩
gulp.task('less',function(){
	gulp.src(app.srcPath+'style/index.less')
		.pipe($.plumber())
		.pipe($.less())
		.pipe($.autoprefixer({
			browsers: ['last 20 versions'], //兼容主流浏览器的最新20个版本
            cascade: false //是否美化属性值，默认值为true
		}))
		.pipe(gulp.dest(app.devPath+'css'))
		.pipe($.cssmin())
		.pipe(gulp.dest(app.prdPath+'css'))
		.pipe(browserSync.stream());
});

//js合并、混淆
gulp.task('js',function(){
	gulp.src(app.srcPath+'script/**/*.js')
		.pipe($.plumber())
		.pipe($.concat('index.js'))
		.pipe(gulp.dest(app.devPath+'js'))
		.pipe($.uglify())
		.pipe(gulp.dest(app.prdPath+'js'))
		.pipe(browserSync.stream());
});

//image压缩
gulp.task('image',function(){
	gulp.src(app.srcPath+'images/**/*')
		.pipe($.plumber())
		.pipe($.imagemin())
		.pipe(gulp.dest(app.devPath+'images'))
		.pipe(gulp.dest(app.prdPath+'images'))
		.pipe(browserSync.stream());
});

//清空之前的内容
gulp.task('clean',function(){
	gulp.src([app.devPath,app.prdPath])
		.pipe($.clean())
		.pipe(browserSync.stream());
});


gulp.task('watch',['html','less','js','image'],function(){
	gulp.watch(app.srcPath+'**/*.html',['html']);
	gulp.watch(app.srcPath+'style/index.less',['less']);
	gulp.watch(app.srcPath+'script/**/*.js',['js']);
	gulp.watch(app.srcPath+'images/**/*',['image']);
});


//静态服务器
gulp.task('default',['watch'],function(){
	browserSync.init({
		server:{
			baseDir:app.devPath
		}
	});
});




