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

//图片处理
// gulp.task('images',function(){
//     var imgDev = './dev/images/*.{png,jpg,gif,ico}',
//         imgSrc = './src/images/';
//     gulp.src(imgDev)
//         .pipe(imagemin({
//             optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//             progressive: true,  //类型：Boolean 默认：false 无损压缩jpg图片
//             interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//             multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
//             svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
//             use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
//         }))
//         .pipe(gulp.dest(imgSrc))
//         .pipe(livereload());
// });


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


//require合并
gulp.task('rjs', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(amdOptimize("main", {
            //require config
            paths: {
                    "jquery": "../../libs/jquery/dist/jquery.min",
                    "jquery.serializeJSON": "../../libs/jquery.serializeJSON/jquery.serializejson.min",
                    "sug": "src/js/suggestion/suggestion",
                    "validate": "../util/src/js/util/validate",
                    "urlParam": "../util/src/js/util/url.param"
            },
            shim: {
                "jquery.serializeJSON": ['jquery']
            }
    }))
    .pipe(concat("index.js"))           //合并
        .pipe(gulp.dest("dist/js"))          //输出保存
        .pipe(rename("index.min.js"))          //重命名
        .pipe(uglify())                        //压缩
        .pipe(gulp.dest("dist/js"));         //输出保存
    });



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
    gulp.src(['./src/css','./src/images','./src/*.html'],{read: false})
        .pipe(clean());
})

// 默认任务 清空图片、样式 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('html','css','images');
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

        // 监听html
        gulp.watch('./dev/*.html', function(){
            gulp.run('html');
        })

});

