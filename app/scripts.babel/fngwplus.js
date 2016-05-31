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
		const $html = $('html')

		$html.addClass(ADDON_CLASS)
		console.log('in fngwplus')

	}
})
