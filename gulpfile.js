var gulp = require("gulp");
var util = require("gulp-util");
var fs = require("fs");
var conventionalChangelog = require("gulp-conventional-changelog");

var argv = util.env;

var releaseCount = !!argv.env ? argv.env : '1';

gulp.task("changelog", function() {
    return gulp.src("CHANGELOG.md", { buffer: false })
        .pipe(conventionalChangelog({
            preset: 'angular',
            releaseCount: releaseCount
        }))
        .pipe(gulp.dest("./"));
});
