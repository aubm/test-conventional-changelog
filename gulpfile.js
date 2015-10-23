var gulp = require("gulp");
var util = require("gulp-util");
var semver = require("semver");
var pkg = require("./package.json");
var fs = require("fs");
var conventionalChangelog = require("gulp-conventional-changelog");
var bump = require("gulp-bump");
var git = require("gulp-git");

var argv = util.env;

var bumpType = !!argv.type ? argv.env :

gulp.task('bump', function() {
    var type = argv.type;
    type = 'patch';

    if (!semver.valid(pkg.version)) {
        util.log(util.colors.red('Error: Invalid version number - ' + pkg.version));
        return process.exit(1);
    }

    /*
    var hasValidType = !!argv.type ? !!argv.type.match(new RegExp(/major|minor|patch/)) : false;

    if (!hasValidType) {
        util.log(util.colors.red('Error: Required bump \'type\' is missing! Usage: npm release --type=(major|minor|patch)'));
        return process.exit(1);
    }
   */

    pkg.version = semver.inc(pkg.version, type);
    return gulp.src(['package.json'])
        .pipe(bump({ version: pkg.version }))
        .pipe(gulp.dest('./'));
});

gulp.task('changelog', ['bump'],  function() {
    return gulp.src('CHANGELOG.md', { buffer: false })
        .pipe(conventionalChangelog({ preset: 'angular' }))
        .pipe(gulp.dest('./'));
});

gulp.task('release', ['changelog'],  function(cb) {
    gulp.src(['CHANGELOG.md', 'package.json'])
        .pipe(git.add())
        .pipe(git.commit('chore(release): ' + pkg.version));

    git.tag(pkg.version, 'release ' + pkg.version, function(err) {
        if (err) throw err;
    });

    git.push('origin', 'master', function(err) {
        if (err) throw err;
    });

    cb();
});
