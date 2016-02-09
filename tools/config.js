'use strict';

module.exports = {
  "debug": false,
  "about": "Barcelona.JS is a usergroup focused on JavaScript and related topics.",
  "date_format": "DD.MM.YYYY",
  "paths": {
    "talks": "talks/",
    "events": "events/",
    "jobs": "jobs/"
  },
  "url": "http://barcelonajs.org",
  "labels": {
    "job": "job",
    "talk": "talk",
    "proposal": "proposal",
    "event": "event",
    "hot": "hot"
  },
  "schema": {
    "default_organizer": {
      "type": "Organization",
      "address": {
        "type": "PostalAddress",
        "addressLocality": "Barcelona, Spain",
        "postalCode": "08003",
        "streetAddress": "C/ Mare de Deu del Pilar 20"
      },
      "email": "hola(at)barcelonajs.org",
      "name": "BarcelonaJS",
      "url": "http://barcelonajs.org"
    },
    "default_talk_url": "/talk/",
    "default_event_url": "/event/",
    "default_start_time": "19:00",
    "default_talk": {
      "type": "Educational event",
      "duration": "PT30M"
    },
    "default_event": {
      "context": "http://schema.org",
      "type": "Social event",
      "location": {
        "type": "Place",
        "address": {
          "type": "PostalAddress",
          "addressLocality": "Barcelona, Spain",
          "postalCode": "08001",
          "streetAddress": "C/ Fontanella 2",
          "name": "Mobile World Centre"
        },
        "url": "https://www.mobileworldcentre.com"
      },
      "duration": "PT2H",
      "url": "http://barcelonajs.org"
    },
    "doorTime": "18:45",
    "inLanguage": {
      "type": "Language",
      "name": "English"
    }
  },
  "default_offers": {
    "type": "Offer",
    "url": "https://ti.to/barcelonajs",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "http://schema.org/InStock"
  }
};
