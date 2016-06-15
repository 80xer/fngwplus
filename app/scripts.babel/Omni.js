class Omni {
	constructor() {
		this.debug = false;
		this.urls = {
			google: 'https://www.google.co.kr/search?hl=en&q=',
			google_korean: 'https://www.google.co.kr/search?hl=en&lr=lang_ko&q=',
			naver: 'https://search.naver.com/search.naver?query=',
			fnguide: 'http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?MenuYn=Y&gicode='
		}
	}

	suggest (text, suggester) {
		suggester([
			{content: 'google : ' + text, description: '구글에서 검색'},
			{content: 'google_korean : ' + text, description: '구글에서 한글 검색'},
			{content: 'naver : ' + text, description: '네이버에서 검색'}
		]);
		chrome.omnibox.setDefaultSuggestion({ description: '상장기업분석에서 종목조회'});
	}

	decide (text) {
		var args = text.split(' : ');
		var keyword = args[args.length-1];
		var url = this.urls[args[0]];
		if (!url) {
			url = this.urls.fnguide
		}
		url += keyword;
		this.redirect(url);
	}

	redirect (url, fullPath) {
    if (this.debug) {
      alert(url);
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: url });
      });
			// chrome.tabs.create({ url: url });
  	}
  };
}
