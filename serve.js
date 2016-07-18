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
var path = require('path')
var Handlebars = require('handlebars');

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
          var talk = files['data/talks/'.replace(/(\/|\\)/g, path.sep) + event.performer[j].id + '.md']
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
      if (date >= moment('2016-06-20T18:45:00Z', 'YYYYMMDDTHHmm')
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

      Array.prototype.push.apply(nextEvent.talks, formatEventTalks(nextEvent));
		
	  var k;
      for (k = 0; k < nextEvent.talks.length; k++) {
	    var md = nextEvent.talks[k].contents.toString();
	    nextEvent.talks[k].excerpt = truncate(md, 400); // max 500
	  }

      if (nextEvent.talks <= 2) {
        for (k = nextEvent.talks.length; k < 2; k++) {
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
	
	// Sets the talks archive
    var talkArchive = [];
    for (i = 0; i < metadata.events.length; i++) {
        var event = JSON.parse(metadata.events[i].contents)
        Array.prototype.push.apply(talkArchive, formatEventTalks(event))
    }

    metalsmith._metadata.nextEvent = nextEvent
    metalsmith._metadata.previousTalks = previousTalks
	metalsmith._metadata.talkArchive = talkArchive
    
	done()
  }
}

function addTalksLayout() {
  return function (files, metalsmith, done) {
	metalsmith.metadata().talks.forEach(t => { /*if (!('layout' in t))*/ t.layout = 'talk.html'; });
	done();
  }
}

function bumpTalkUrl() {
  return function (files, metalsmith, done) {
	//metalsmith.metadata().talks.forEach(t => { console.log(t.name, t.path); });
	var tmp = Object.keys(files)
		.filter(p => p.substring(0, 10) === 'data/talks'.replace(/(\/|\\)/g, path.sep))
		.forEach(p => { 
			var o = files[p];
			delete files[p];
			files[p.substring(5)] = o;
		})
	; 
	done();
  }
}

function truncate(str, len) {
    if (str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr(0, len);
        new_str = str.substr(0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substr (0, len);
        return new_str + '...' ; 
    }
    return str;
};

//Handlebars.registerHelper('imageUrl', function(img) { return `/assets/img/${img}`; });
Handlebars.registerHelper('iconUrl', function(iconName) { return `/assets/img/icons/${iconName}.svg`; });

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
  /*
  .use(permalinks({
    pattern: ':title'
  }))
  */
  .use(markdown())
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials'
  }))
  .use(bumpTalkUrl())
  .use(permalinks({
    pattern: ':title'
	,relative: false
  }))
  /*
  .use(sass({
    outputStyle: 'expanded',
    outputDir: 'assets/css/'
  }))
  */
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
