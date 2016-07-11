var Metalsmith = require('metalsmith')
var markdown = require('metalsmith-markdown')
var layouts = require('metalsmith-layouts')
var assets = require('metalsmith-assets')
var collections = require('metalsmith-collections')
var permalinks = require('metalsmith-permalinks')
var browserSync = require('metalsmith-browser-sync')
var metadata = require('metalsmith-metadata')
var moment = require('moment')
var sass = require('metalsmith-sass')

/**
 * Normalize an `options` dictionary.
 *
 * @param {Object} options
 */

function normalize (options) {
  options = options || {}

  for (var key in options) {
    var val = options[key]
    if ('string' === typeof val) {
      options[key] = {
        pattern: val
      }
    }
  }
  return options
}

var bcnjs = function bcnjs (opts) {
  opts = normalize(opts)

  return function (files, metalsmith, done) {
    var metadata = metalsmith.metadata()
    var tmpEvent
    var nextEvent
    var totalPreviousTalks = 10

    // Formats the talks information from the files
    var formatEventTalks = function formatEventTalks (event) {
      var result = []
      if (event.performer) {
        for (var j = 0; j < event.performer.length; j++) {
          var talk = files['data/talks/' + event.performer[j].id + '.md']
          if (talk && talk.name) {
            result.push(talk)
          }
        }
      }
      return result
    }

    // Get the position of the nextEvent
    for (var i = 0; i < metadata.events.length; i++) {
      var content = JSON.parse(metadata.events[i].contents.toString('utf-8'))
      var date = moment(content.startDate, 'YYYYMMDDTHHmm')
        .add(1, 'minutes')
        .unix()
      if (date >= moment()
          .unix()) {
        tmpEvent = i
      }
    }

    // Initialize the nextEvent
    nextEvent = null
    if (metadata.events[tmpEvent]) {
      nextEvent = JSON.parse(metadata.events[tmpEvent].contents)
      nextEvent.startDate = moment.utc(nextEvent.startDate, 'YYYYMMDDTHHmm')
        .format('MMMM DD, HH:mm')
    }

    // Formats the nextEvent
    if (nextEvent) {
      nextEvent.talks = []

      Array.prototype.push.apply(nextEvent.talks, formatEventTalks(
        nextEvent))

      if (nextEvent.talks <= 2) {
        for (var k = nextEvent.talks.length; k < 2; k++) {
          nextEvent.talks.push({})
        }
      }
    } else {
      nextEvent = {
        'context': 'http://schema.org',
        'organizer': {
          'type': 'Organization',
          'address': {
            'type': 'PostalAddress',
            'addressLocality': 'Barcelona, Spain',
            'postalCode': '08003',
            'streetAddress': 'C/ Mare de Deu del Pilar 20'
          },
          'email': 'hola(at)barcelonajs.org',
          'name': 'BarcelonaJS',
          'url': 'http://barcelonajs.org'
        },
        'performer': [],
        'layout': 'page.html'
      }
    }

    // Sets the previousTalks
    var previousTalks = []
    for (i = 0; i < metadata.events.length; i++) {
      if (i > tmpEvent && previousTalks.length <= totalPreviousTalks) {
        var event = JSON.parse(metadata.events[i].contents)
        Array.prototype.push.apply(previousTalks, formatEventTalks(event))
      }
    }

    metalsmith._metadata.nextEvent = nextEvent
    metalsmith._metadata.previousTalks = previousTalks
    done()
  }
}

function addTalksLayout() {
  return function (files, metalsmith, done) {
	metalsmith.metadata().talks.forEach(t => { if (!('layout' in t)) t.layout = 'talk.html'; });
	done();
  }
}

/*
function bumpTalkUrl() {
  return function (files, metalsmith, done) {
	var tmp = Object.keys(files).filter(k => k.match(/data\\talks//g)); // 'data\\talks/20160511-deep-dive-into-redux-performance-optimizations.html',
	console.log(files);
	done();
  }
}
*/

Metalsmith(__dirname)
  .source('src/')
  .destination('./build')
  .use(metadata({
    'chapters': 'data/chapters.json',
    'sponsors': 'data/sponsors.json',
    'jobs': 'data/jobs.json',
    'members': 'data/members.json'
  }))
  .use(collections({
    talks: {
      pattern: 'data/talks/*.md',
      sortBy: 'startDate',
      reverse: true,
      limit: 1
    }
  }))
  .use(collections({
    events: {
      pattern: 'data/events/*.json',
      sortBy: 'startDate',
      reverse: true
    }
  }))
  .use(bcnjs())
  .use(addTalksLayout())
  .use(permalinks({
    pattern: ':title'
  }))
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials'
  }))
  //.use(bumpTalkUrl())
  .use(sass({
    outputStyle: 'expanded',
    outputDir: 'assets/css/'
  }))
  .use(assets({
    source: './assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }))
  .use(browserSync({
    server: './build',
    files: ['src/**/*.*']
  }))
  .build(function (error) {
    if (error) {
      console.log(error)
    }
  })
