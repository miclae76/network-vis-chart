var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');
var settings = require('./settings');
var webpackConfig = require('./webpack.config');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

gulp.task('remove-build-folder', function(){
  return del([settings.buildDestination], { force: true });
});

gulp.task('zip-build', function(){
  return gulp.src(settings.buildDestination + '/**/*')
    .pipe(zip(settings.name + '.zip'))
    .pipe(gulp.dest(settings.buildDestination));
});

gulp.task('webpack-build', done => {
  webpack(webpackConfig, (error, statistics) => {
    const compilationErrors = statistics && statistics.compilation.errors;
    const hasCompilationErrors = !statistics || (compilationErrors && compilationErrors.length > 0);

    console.log(statistics && statistics.toString({ chunks: false, colors: true })); // eslint-disable-line no-console

    if (error || hasCompilationErrors) {
      console.log('Build has errors or eslint errors, fail it'); // eslint-disable-line no-console
      process.exit(1);
    }

    done();
  });
});

gulp.task('build',
  gulp.series('remove-build-folder', 'webpack-build', 'zip-build')
);

gulp.task('watch', () => new Promise((resolve, reject) => {
  webpackConfig.entry.unshift('webpack-dev-server/client?http://localhost:' + settings.port);
  const compiler = webpack(webpackConfig);
  const originalOutputFileSystem = compiler.outputFileSystem;
  const devServer = new WebpackDevServer(compiler, {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
  }).listen(settings.port, 'localhost', error => {
    compiler.outputFileSystem = originalOutputFileSystem;
    if (error) {
      console.error(error); // eslint-disable-line no-console
      return reject(error);
    }

    // eslint-disable-next-line no-console
    console.log('Listening at localhost:' + settings.port);

    resolve(null, devServer);
  });
}));

gulp.task('default',
  gulp.series('build')
);
