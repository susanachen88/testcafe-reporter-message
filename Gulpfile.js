var gulp    = require('gulp');
var eslint  = require('gulp-eslint');
var babel   = require('gulp-babel');
var mocha   = require('gulp-mocha');
var del     = require('del');

async function clean(cb) {
    //remark
    del('lib', cb);
}

function lint() {
    return gulp
        .src([
            'src/**/*.js',
            'test/**/*.js',
            'Gulpfile.js'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function build() {
    return gulp
        .src('src/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('lib'));
}

function test() {
    return gulp
        .src('test/test.js')
        .pipe(mocha({
            ui: 'bdd',
            reporter: 'spec',
            timeout: typeof v8debug === 'undefined' ? 20000 : Infinity // NOTE: disable timeouts in debug
        }));
}

function watch() {
    gulp.watch('src/**/*.js');
}

function preview() {
    var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
    var pluginFactory       = require('./lib');
    var reporterTestCalls   = require('./test/utils/reporter-test-calls');
    var plugin              = buildReporterPlugin(pluginFactory);

    console.log();

    reporterTestCalls.forEach(function(call) {
        plugin[call.method].apply(plugin, call.args);
    });

    process.exit(0);
}

exports.clean = clean;
exports.lint = lint;
exports.test = gulp.series(clean, lint, build, test);
exports.build = gulp.series(clean, lint, build);
exports.watch = gulp.series(clean, lint, build, watch);
exports.preview = gulp.series(clean, lint, build, preview);
