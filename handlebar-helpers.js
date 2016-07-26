var 
	Handlebars = require('handlebars'),
	handlebarHelpers = require('handlebars-helpers')({handlebars: Handlebars}),
	helpers = {
		formatDuration(dur) { 
			var value;
			
			if (dur.substr(0, 2) === 'PT')
				value = parseInt(dur.substr(2))
			else if (dur.substr(0, 1) === 'P')
				value = parseInt(dur.substr(1))
			else
				value = parseInt(dur)
			
			return value + ' min';
		}
		,'iconUrl': iconName => `/assets/img/icons/${iconName}.svg`
		,'twitterUrl': username => `http://twitter.com/${username}`
		,'githubUrl': username => `http://github.com/${username}`
		,'twitterShareUrl': (urlToShare, text) => `https://twitter.com/intent/tweet?url=${encodeURI(urlToShare)}&text=${encodeURIComponent(text)}`
		,'facebookShareUrl': urlToShare => `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(urlToShare)}`
		,'googleplusShareUrl': urlToShare => `https://plus.google.com/share?url=${encodeURI(urlToShare)}`
		,'linkedinShareUrl': (urlToShare, title) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURI(urlToShare)}&title=${encodeURIComponent(title)}`
		//,'imageUrl', function(img) { return `/assets/img/${img}`; });
	}
;

for (var name in helpers)
	Handlebars.registerHelper(name, helpers[name]);
