const LOGIN_IMAGE_WRAPER_SELECTOR = '.custom_visual'
const PLUS_LOGO_TEMPLATE = '<img src = '
class LoginView {
	constructor() {
		this.target = LOGIN_IMAGE_WRAPER_SELECTOR
	}

	setView() {
		var imgPath = chrome.extension.getURL('/images/fngwplus.png');
		$(this.target).append('<img class="login show logo plusimg" src="' + imgPath + '">')
	}
}
