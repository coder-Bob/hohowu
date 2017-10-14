//导入工具包 require('node_modules里对应模块')
var gulp        = require('gulp'), //本地安装gulp所用到的地方
    rjs         = require('requirejs'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    minifycss   = require('gulp-minify-css'),
    sass        = require('gulp-ruby-sass'),
    clean       = require('gulp-clean'),             //清空文件夹
    // tiny        = require('tiny-lr'),
    // server      = tiny(),
    livereload  = require('gulp-livereload');   //livereload


gulp.task('images',function(){
    var imgDev = './dev/images/*.{png,jpg,gif,ico}',
        imgSrc = './src/images/';
    gulp.src(imgDev)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true,  //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(imgSrc))
        .pipe(livereload());
});



//样式处理
gulp.task('css',function(){
    var cssDev = './dev/sass/*',
        cssSrc = './src/css/';
    return sass(cssDev)
        .on('error',sass.logError)
        .pipe(minifycss())
        .pipe(gulp.dest(cssSrc))
        .pipe(livereload());
})



//字体输出
gulp.task('fonts',function(){
    var fontsDev = './dev/fonts/*',
        fontsSrc = './src/fonts/';
    gulp.src(fontsDev)
        .pipe(gulp.dest(fontsSrc))
        .pipe(livereload());
})


// HTML处理
gulp.task('html', function() {
    var htmlSrc = './dev/*.html',
        htmlDst = './src/';
    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        .pipe(livereload());
});


//清空图片 样式
gulp.task('clean',function(){
    gulp.src(['./src'],{read: false})
        .pipe(clean());
})

// 默认任务 清空图片、样式 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('html','css','fonts','images');
});

//默认任务

gulp.task('watch', function () {
        livereload.listen();
        //监听图片
        gulp.watch('./dev/images/*',function () {
            gulp.run('images');
        });

        //监听css
        gulp.watch('./dev/sass/*',function () {
            gulp.run('css');
        })

        //监听字体文件
        gulp.watch('./dev/fonts/*',function () {
            gulp.run('fonts');
        })

        // 监听html
        gulp.watch('./dev/*.html', function(){
            gulp.run('html');
        })

});

