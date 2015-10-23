var gulp = require("gulp");
var util = require("gulp-util");
var semver = require("semver");
var pkg = require("./package.json");
var fs = require("fs");
var conventionalChangelog = require("gulp-conventional-changelog");
var bump = require("gulp-bump");

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
    var exec = require("child_process").exec;

    var commitMessage = 'chore(release): ' + pkg.version;

    exec('git add CHANGELOG.md package.json', childProcessCompleted);
    exec('git commit -m "' + commitMessage + '" --no-verify', childProcessCompleted);
    exec('git tag -a ' + pkg.version + ' -m "release ' + pkg.version + '"');
    exec('git push origin master', childProcessCompleted);

    cb();

    function childProcessCompleted(error, stdout, stderr) {
        util.log('stdout: ' + stdout);
        util.log('stderr: ' + stderr);
        if (error !== null) {
            return cb(error);
        }

    }
});
