class View {
	constructor() {

	}

	checkDom(target, cb) {
		var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
		function checkForJS_Finish() {
			if ($(target).length > 0) {
				clearInterval(jsInitChecktimer);
				cb && cb()
			}
		}
	}
}
