// generated on 2016-04-29 using generator-chrome-extension 0.5.6
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    '!app/scripts.babel',
		'!app/styles.less',
    '!app/*.json',
    '!app/*.html',
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('app/scripts.babel/**/*.js', {
  env: {
    es6: true
  }
}));

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('styles', () => {
  return gulp.src('app/styles.less/fngwplus.less')
		.pipe($.plumber())
    .pipe($.less({relativeUrls: true}))
    .pipe($.autoprefixer({cascade: true}))
    .pipe(gulp.dest('app/styles'))
});

gulp.task('html',  () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
    .pipe($.sourcemaps.write())
    .pipe($.if('*.html', $.htmlmin({removeComments: true, collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
  return gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: true,
      background: {
        target: 'scripts/background.js',
        exclude: [
          'scripts/chromereload.js'
        ]
      }
  }))
  .pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
  .pipe($.if('*.js', $.sourcemaps.init()))
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.js', $.sourcemaps.write('.')))
  .pipe(gulp.dest('dist'));
});

gulp.task('buildJs', () => {
	return runSequence(['buildJs:fngw', 'buildJs:chrome']);
})

gulp.task('buildJs:fngw', () => {
	var ctx = {CHROME: true}
	const src = [
		'app/scripts.babel/constants.js',
		'app/scripts.babel/util.js',
		'app/scripts.babel/view.*.js',
		'app/scripts.babel/fngwplus.js',
		'!app/scripts.babel/Omni.js',
		'!app/scripts.babel/background.js',
		'!app/scripts.babel/chromereload.js'
	]

  return gulp.src(src)
      .pipe($.babel({
        presets: ['es2015']
      }))
			.pipe($.concat('fngwplus.js'))
			.pipe($.preprocess({context: ctx}))
      .pipe(gulp.dest('app/scripts'));
});

gulp.task('buildJs:chrome', () => {
	var ctx = {CHROME: true}
	const src = [
		'app/scripts.babel/Omni.js',
		'app/scripts.babel/background.js',
		'app/scripts.babel/chromereload.js'
	]

  return gulp.src(src)
      .pipe($.babel({
        presets: ['es2015']
      }))
			.pipe(gulp.dest('app/scripts'));
});

gulp.task('libs', () => {
	gulp.src('app/libs/**/*.js').pipe(gulp.dest('app/scripts'))
})

gulp.task('copy2dist', ['copyjs', 'copystyle']);

gulp.task('copyjs', () => {
	gulp.src([
		'app/scripts/*',
		'!app/scripts/background.js',
		'!app/scripts/chromereload.js'
	])
	.pipe($.uglify())
	.pipe(gulp.dest('dist/scripts'));
})

gulp.task('copystyle', () => {
	gulp.src('app/styles/*')
	.pipe($.cleanCss({compatibility: '*'}))
	.pipe(gulp.dest('dist/styles'))
})

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['lint', 'libs', 'buildJs', 'styles', 'html'], () => {
  $.livereload.listen();

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ]).on('change', $.livereload.reload);

	gulp.watch('app/libs/**/*', ['libs'])
  gulp.watch('app/scripts.babel/**/*.js', ['lint', 'buildJs']);
	gulp.watch('app/styles.less/**/*.less', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build size', gzip: true}));
});

gulp.task('wiredep', () => {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('package', () => {
  var manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
      .pipe($.zip('fngwplus-' + manifest.version + '.zip'))
      .pipe(gulp.dest('package'));
});

gulp.task('build', (cb) => {
  runSequence(
    'lint', 'libs', 'buildJs', 'styles', 'chromeManifest', 'copy2dist',
    [
			'html',
			'images',
			'extras'
		],
    'size', cb);
});


gulp.task('default', ['clean'], cb => {
  runSequence('build', cb);
});
