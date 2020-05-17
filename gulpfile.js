const gulp     = require('gulp')
const rename   = require('gulp-rename')
const replace  = require('gulp-replace')
const cleanCSS = require('gulp-clean-css')
const beautify = require('gulp-jsbeautifier')

const options = {
  cleanCSS: { format: { semicolonAfterLastProperty: true } },
  beautify: { 'indent_size': 2, 'css': { 'selector-separator-newline': true } },
  rename: { suffix: '-sass-placeholders', extname: '.scss' }
}

gulp.task('placeholder', () => {
  return gulp.src([
    'node_modules/tachyons/css/tachyons.css'
  ])
  .pipe( cleanCSS(options.cleanCSS) )
  .pipe( beautify(options.beautify) )
  .pipe( replace(/^(\s{0,2})\.(\w)/gm, '$1%$2') )
  .pipe( replace(/\n\n/gm, '\n') )
  .pipe( replace(/\n {2,4}([\w\-])/gm, ' $1') )
  .pipe( replace(/^( {0,2}\S[^\n]+)\n {0,2}\}/gm, '$1 }') )
  .pipe( replace(/\,\n/gm, ', ') )
  .pipe( replace(/\"/gm, '\'') )
  .pipe( rename(options.rename) )
  .pipe( gulp.dest('scss') )
})

gulp.task('index', () => {
  return gulp.src([
    'scss/tachyons-sass-placeholders.scss'
  ])
  .pipe( replace(/\n/gm, ' ') )
  .pipe( replace(/\s+/gm, ' ') )
  .pipe( replace(/([\s\S]+)/gm, 'module.exports = { scss: "$1"}') )
  .pipe( rename({ basename: "index", extname: ".js" }) )
  .pipe( gulp.dest('./') )
})

gulp.task('default', gulp.series('placeholder', 'index'))
