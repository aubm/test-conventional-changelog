var gulp = require("gulp");
var util = require("gulp-util");
var fs = require("fs");
var conventionalChangelog = require("conventional-changelog");

var argv = util.env;

var releaseCount = !!argv.env ? argv.env : '1';

gulp.task("changelog", function() {
    return conventionalChangelog({
        preset: 'angular',
        releaseCount: releaseCount
    })
        .pipe(fs.createWriteStream('CHANGELOG.md'));
});
