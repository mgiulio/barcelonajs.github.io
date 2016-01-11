var moment = require('moment');
var S = require('string');
var config = require('./config');
var fs = require('fs');
var path = require('path');

var history = require('./history');

// create markdown files from a .json history of events and talks

for (var key in history) {
  if (history.hasOwnProperty(key)) {
    var newEvent = history[key];

    if (newEvent.talks && newEvent.talks.length > 0) {
      var talks = history[key].talks;

      var event = JSON.parse(JSON.stringify(config.schema.default_event));

      event.startDate = moment(newEvent.date).format('YYYYMMDDT19:00');
      event.name = 'BarcelonaJS';
      event.id = moment(event.startDate, 'YYYYMMDDTHH:mm').format('YYYYMMDD') + '-' + S(event.name).slugify().s;
      event.url = config.schema.default_event_url + event.id;
      event.organizer = config.schema.default_organizer;
      event.performer = [];
      event.layout = 'page.html';

      talks.forEach(function (newTalk) {
        var talk = {};
        talk = JSON.parse(JSON.stringify(config.schema.default_talk));
        talk.id = moment(event.startDate, 'YYYYMMDDTHH:mm').format('YYYYMMDD') + '-' + S(newTalk.title).slugify().s;

        talk.name = newTalk.title;
        talk.layout = 'page.html';
        talk.description = newTalk.description;

        talk.superEvent = {
          'type': 'Social event',
          url: event.url,
          id: event.id,
          name: event.name
        };

        if (newTalk.language) {
          talk.inLanguage = newTalk.language;
        }

        if (newTalk.slides) {
          talk.workPerformed = {
            'type': 'CreativeWork',
            learningResourceType: 'presentation',
            url: newTalk.slides
          };
        }

        if (newTalk.git) {
          talk.workFeatured = {
            'type': 'CreativeWork',
            learningResourceType: 'source code',
            id: newTalk.slides
          };
        }

        if (newTalk.speaker) {
          var performer = {
            'type': 'Person',
            'name': newTalk.speaker.name,
            'id': talk.id,
            'twitter': newTalk.speaker.twitter,
            'sameAs': 'https://twitter.com/@' + newTalk.speaker.twitter,
            'url': config.schema.default_talk_url + talk.id + '.html'
          };

          if (newTalk.speaker.portrait) {
            performer.image = newTalk.speaker.portrait;
          };

          event.performer.push(performer);
          talk.performer = performer;
        }

        if (newTalk.video) {
          talk.recordedIn = {
            'type': 'CreativeWork',
            'video': {
              'type': 'VideoObject',
              id: newTalk.video
            }
          };
        }

        // var talkMd = yaml.stringify(talk); // luckily, JSON is accepted as front-matter as well, NO YAML!
        var talkMd = '---\n';
        talkMd += JSON.stringify(talk, null, 2);
        talkMd += '\n---\n';
        talkMd += '# ' + talk.name + '\n\n',
          talkMd += talk.description;

        fs.writeFileSync(path.join(__dirname, 'talks', talk.id) + '.md', talkMd);
      });

      var eventMd = JSON.stringify(event, null, 2);

      fs.writeFileSync(path.join(__dirname, 'events', event.id) + '.json', eventMd);
    }
  }
}
