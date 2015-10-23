var gulp = require("gulp");
var util = require("gulp-util");
var semver = require("semver");
var pkg = require("./package.json");
var fs = require("fs");
var conventionalChangelog = require("gulp-conventional-changelog");
var bump = require("gulp-bump");
var git = require("gulp-git");
var runSequence = require("run-sequence");

var argv = util.env;

gulp.task('bump', function(cb) {
    if (!semver.valid(pkg.version)) {
        util.log(util.colors.red('Error: Invalid version number - ' + pkg.version));
        return process.exit(1);
    }

    var hasValidType = !!argv.type ? !!argv.type.match(new RegExp(/major|minor|patch/)) : false;
    if (!hasValidType) {
        util.log(util.colors.red('Error: Required bump \'type\' is missing! Usage: npm release --type=(major|minor|patch)'));
        return process.exit(1);
    }

    pkg.version = semver.inc(pkg.version, argv.type);
    gulp.src(['package.json'])
        .pipe(bump({ version: pkg.version }))
        .pipe(gulp.dest('./'))
        .on('end', cb);
});

gulp.task('changelog',  function(cb) {
    gulp.src('CHANGELOG.md', { buffer: false })
        .pipe(conventionalChangelog({ preset: 'angular' }))
        .pipe(gulp.dest('./'))
        .on('end', cb);
});

gulp.task('commit-changelog', function(cb) {
    gulp.src(['CHANGELOG.md', 'package.json'])
        .pipe(git.add())
        .pipe(git.commit('chore(release): ' + pkg.version))
        .on('end', cb);
});

gulp.task('create-version-tag', function(cb) {
    git.tag(pkg.version, 'release ' + pkg.version, function(err) {
        if (err) throw err;
        cb();
    });
});

gulp.task('push-master', function(cb) {
    git.push('origin', 'master', { args: '--tags' }, function(err) {
        if (err) throw err;
        cb();
    });
});

gulp.task('release', function(cb) {
    runSequence( 'bump', 'changelog', 'commit-changelog', 'create-version-tag', 'push-master', cb);
});
