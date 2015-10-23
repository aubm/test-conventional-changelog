var gulp = require("gulp");
var conventionalChangelog = require("conventional-changelog");

gulp.task("changelog", function() {
    conventionalChangelog({ preset: 'angular' })
        .pipe(process.stdout);
});
