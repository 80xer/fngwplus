$(document).ready(() => {
	const store = new Storage()
	parallel(Object.keys(STORE), setDefault, loadExtension)

	function setDefault(key, cb) {
		const storeKey = STORE[key]
		store.get(storeKey, (val) => {
			store.set(storeKey, val == null ? DEFAULTS[key] : val, cb)
		})
	}

	function loadExtension() {
		const $document = $(document)
		const $html = $('html')
		const locationPathView = {
			[PAGE.LOGIN]: [new LoginView()],
			[PAGE.HOME]: [new DutyView()],
			[PAGE.EHR]: [new EhrView()],
			[PAGE.EHRMY]: [new EhrView()],
			[PAGE.EHRCOMP]: [new EhrCompView()],
			[PAGE.TASK_ALL_NEW_FNGUIDE]: [new AllNewFnguide()]
		};

		var imgPath = chrome.extension.getURL('/images/fngwplus.png');
		var $plusImg = $('<img class="logo plusimg" src="' + imgPath + '">');

		$html.addClass(ADDON_CLASS)
		let firstLoad = true, pathname, hash

		$document
			.on(EVENT.LOC_CHANGE, () => startFnGwPlus())

		function ga() {
			window._gaq = [];
			window._gaq.push(['_setAccount', 'UA-78966622-1']);
			window._gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = 'https://ssl.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		}
		
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

		var createPluslogo = function () {
			ga();

			createPluslogo = function () {
				if ($('h1>a>img.logo.plusimg').length === 0) {
					var $plusImgClone = $plusImg.clone();
					$plusImgClone.insertAfter('h1>a>img.logo');
					setTimeout(function() {
						$plusImgClone.addClass('show');
					}, 500);
				}
			}

			createPluslogo();
		}

    detectLocChange()
		startFnGwPlus()

		function startFnGwPlus() {
			asyncDom('h1>a>img.logo', createPluslogo)
			let locpath = location.pathname;
			setViews(locationPathView[locpath]);
			stopViews(locpath);
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
