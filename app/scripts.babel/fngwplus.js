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
		var imgPath = chrome.extension.getURL('/images/fngwplus.png');

		asyncDom('h1>a>img.logo', function() {
			if ($('h1>a>img.logo.plusimg').length > 0) {
				$('h1>a>img.logo.plusimg').remove()
			}
			var $plusImg = $('<img class="logo plusimg" src="' + imgPath + '">');
			// console.log('add logo');
			$plusImg.insertAfter('h1>a>img.logo');
			setTimeout(function() {
				$plusImg.addClass('show');
			}, 500);
		})
	}

	function loadExtension() {
		const $document = $(document)
		const $html = $('html')
		const locationPathView = {
			[PAGE.LOGIN]: [new LoginView()],
			[PAGE.HOME]: [new DutyView()],
			[PAGE.EHR]: [new EhrView()],
			[PAGE.EHRCOMP]: [new EhrCompView()],
			[PAGE.TASK_ALL_NEW_FNGUIDE]: [new AllNewFnguide()]
		};

		$html.addClass(ADDON_CLASS)
		let firstLoad = true, pathname, hash

		$document
			.on(EVENT.LOC_CHANGE, () => startFnGwPlus())

    function detectLocChange() {
      if (location.pathname !== pathname || location.hash !== hash) {
        pathname = location.pathname
        hash = location.hash

        if (firstLoad) {
          firstLoad = false
        }
        else {
          setTimeout(() => {
            $(document).trigger(EVENT.LOC_CHANGE)
          }, 300)
        }
      }
      setTimeout(detectLocChange, 200)
    }

    detectLocChange()
		startFnGwPlus()

		function startFnGwPlus() {
			createPluslogo()
			let locpath = location.pathname
			console.log(locpath)
			setViews(locationPathView[locpath])
			stopViews(locpath)
		}

		function setViews(views) {
			if (!views || views.length === 0) {
				return;
			}

			for (var i = 0; i < views.length; i++) {
				checkView(views[i])
			}
		}

		function checkView(view) {
			var target = view.target
			if (!target) return
			asyncDom(target, function() {
				view.setView()
			})
		}

		function stopViews(locpath) {
			for (var page in locationPathView) {
				if (locationPathView.hasOwnProperty(page)) {
					if(page !== locpath) {
						for (var i = 0; i < locationPathView[page].length; i++) {
							locationPathView[page][i].stop && locationPathView[page][i].stop()
						}
					}
				}
			}
		}
	}
})
