//$(document).ready(embedMaterial);
embedMaterial();

var slides;

function embedMaterial() {
	slides = $('.slides').get(0)
	
	var url = slides.dataset.url;
	
	if (! url && ! /www.slideshare.net/.test(url))
		return;
	
	var oEmbedUrl = `http://www.slideshare.net/api/oembed/2?url=${url}&format=jsonp&callback=jsonpcb`;
	
	$.ajax({
		url: oEmbedUrl,
		dataType: 'jsonp',
		jsonpCallback: 'jsonpcb'
	});
	
}

function jsonpcb(json) {
	slides.innerHTML = json.html;
}

