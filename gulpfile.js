const gulp = require('gulp');
const ts = require('gulp-typescript');
let project = ts.createProject('tsconfig.json');

gulp.task(
  "default",
  function () {
    project.src().pipe(
      project()
    ).js.pipe(
      gulp.dest("built")
    );
  }
)
