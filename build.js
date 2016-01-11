var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var assets = require('metalsmith-assets');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var uglify = require('metalsmith-uglify');
var browserSync = require('metalsmith-browser-sync');
var helpers = require('diy-handlebars-helpers');
var metadata = require('metalsmith-metadata');
var sass = require('metalsmith-sass');

/**
 * Normalize an `options` dictionary.
 *
 * @param {Object} options
 */

function normalize(options) {
  options = options || {};

  for (var key in options) {
    var val = options[key];
    if ('string' === typeof val) {
      options[key] = {
        pattern: val
      };
    }
  }
  return options;
}

var bcnjs = function bcnjs(opts) {
  opts = normalize(opts);
  var keys = Object.keys(opts);

  return function(files, metalsmith, done) {
    var metadata = metalsmith.metadata();

    var nextEvent;

    for (var i = 0; i < metadata.events.length; i++) {
      var date = moment(metadata.events[i].startDate, 'YYYYMMDD:HHmm').add(2, 'days').unix();
      if (date >= moment().unix()) {
        nextEvent = metadata.events[i];
      }
    }

    nextEvent.talks = [];

    for (var i = 0; i < nextEvent.performer.length; i++) {
      var talk = files['talk/' + nextEvent.performer[i].id + '.md'];
      if (talk.name) {
        nextEvent.talks.push(talk);
      }
    }

    metalsmith._metadata.nextEvent = nextEvent;
    done();
  };
};

Metalsmith(__dirname)
  .source('src/')
  .destination('./build')
  .use(metadata({
    'chapters': 'data/chapters.json',
    'sponsors': 'data/sponsors.json',
    'members': 'data/members.json'
  }))
  .use(collections({
    talks: {
      pattern: 'talk/*.md',
      sortBy: 'startDate',
      reverse: true,
      limit: 1
    }
  }))
  .use(collections({
    events: {
      pattern: 'event/*.md',
      sortBy: 'startDate',
      reverse: true
    }
  }))
  .use(bcnjs({
    event: 'test'
  }))
  .use(permalinks({
    pattern: ':title'
  }))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials'
  }))
  .use(sass({
    outputStyle: 'expanded',
    outputDir: 'assets/css/'
  }))
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))
  .use(uglify())
  .build(function(error) {
    if (error) {
      console.log(error);
    }
  });
