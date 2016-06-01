$(document).ready(() => {
	const store = new Storage()
	parallel(Object.keys(STORE), setDefault, loadExtension)

	function setDefault(key, cb) {
		const storeKey = STORE[key]
		store.get(storeKey, (val) => {
			store.set(storeKey, val == null ? DEFAULTS[key] : val, cb)
		})
	}

	function createPluslogo() {
		const url = location
		var imgPath = chrome.extension.getURL('/img/fngwplus.png');
    var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
    function checkForJS_Finish() {
      if ($('h1>a>img.logo').length > 0 && $('h1>a>img.logo.plusimg').length == 0) {
        clearInterval(jsInitChecktimer);
        var $plusImg = $('<img class="logo plusimg" src="' + imgPath + '">');
        // console.log('add logo');
        $plusImg.insertAfter('h1>a>img.logo');
        setTimeout(function() {
          $plusImg.addClass('show');
        }, 500);
      }
    }
	}

	function loadExtension() {
		const $document = $(document)
		const $html = $('html')
		const $dutyView = new DutyView()
		const $ehrView = new EhrView()

		$document
			.on(EVENT.LOC_CHANGE, () => startFnGwPlus())

		$html.addClass(ADDON_CLASS)
		let firstLoad = true, href, hash

    function detectLocChange() {
      if (location.href !== href || location.hash !== hash) {
        href = location.href
        hash = location.hash

        if (firstLoad) {
          firstLoad = false
        }
        else {
          setTimeout(() => {
            $(document).trigger(EVENT.LOC_CHANGE)
          }, 300) // Wait a bit for pjax DOM change
        }
      }
      setTimeout(detectLocChange, 200)
    }

    detectLocChange()
		startFnGwPlus()

		function startFnGwPlus() {
			createPluslogo()
			console.log('in start fn gw plus')
			// 페이지별로 알맞은 뷰를 append, show 처리
			let locpath = location.pathname
			if (!!~locpath.indexOf(PAGE.HOME)) checkDom($dutyView)
			if (!!~locpath.indexOf(PAGE.EHR)) checkDom($ehrView)
		}

		function checkDom(view) {
			console.log('checkDom',view)
			var target = view.target
			var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
			function checkForJS_Finish() {
				if ($(target).length > 0) {
					clearInterval(jsInitChecktimer);
					!function() {
						view.setView()
					}()
				}
			}
		}
	}
})
