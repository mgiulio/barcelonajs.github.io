
function embedMaterial() {
	var oEmbedURL = 'http://www.slideshare.net/api/oembed/2?url=http://www.slideshare.net/Couchbase/buildinganodeapplicationwithcouchbasenodeandangularbarcelonajs/&format=jsonp&callback=jsonpcb';
	
	$.ajax({
		url: oEmbedURL,
		dataType: 'jsonp',
		jsonpCallback: 'jsonpcb'
	});
	
}

function jsonpcb(json) {
	//console.log(json.html);
	$('.slides').get(0).innerHTML = json.html;
}

//$(document).ready(embedMaterial);
embedMaterial();
