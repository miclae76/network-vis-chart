var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var del = require('del');
var pkg = require('./package.json');

var DIST = './dist';
var VERSION = process.env.VERSION || 'local-dev';

gulp.task('qext', function () {
	var qext = {
		name: 'Network chart',
		type: 'visualization',
		description: pkg.description + '\nVersion: ' + VERSION,
		version: VERSION,
		icon: 'bubbles',
		preview: 'network.png',
		keywords: 'qlik-sense, visualization',
		author: pkg.author,
		supernova: true,
		homepage: pkg.homepage,
		license: pkg.license,
		repository: pkg.repository,
		dependencies: {
			'qlik-sense': '>=5.5.x'
		}
	};
	if (pkg.contributors) {
		qext.contributors = pkg.contributors;
	}
	var src = require('stream').Readable({
		objectMode: true
	});
	src._read = function () {
		this.push(new gutil.File({
			cwd: '',
			base: '',
			path: pkg.name + '.qext',
			contents: Buffer.from(JSON.stringify(qext, null, 4))
		}));
		this.push(null);
	};
	return src.pipe(gulp.dest(DIST));
});

gulp.task('clean', function(){
  return del([DIST], { force: true });
});
gulp.task('zip-build', function(){
  return gulp.src(DIST + '/**/*')
    .pipe(zip(`${pkg.name}_${VERSION}.zip`))
    .pipe(gulp.dest(DIST));
});

gulp.task('add-assets', function(){
  return gulp.src('./assets/**/*').pipe(gulp.dest(DIST));
});


gulp.task('zip',
  gulp.series( 'qext', 'add-assets', 'zip-build')
);
gulp.task('clean',
  gulp.series( 'clean')
);