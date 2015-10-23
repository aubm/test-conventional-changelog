var gulp = require("gulp");
var fs = require("fs");
var conventionalChangelog = require("conventional-changelog");

gulp.task("changelog", function() {
    return conventionalChangelog({ preset: 'angular' })
        .pipe(fs.createWriteStream('CHANGELOG.md'));
});
