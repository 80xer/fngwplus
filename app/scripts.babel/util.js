// localstorage class
class Storage {
	set(key, val, cb) {
		localStorage.setItem(key, JSON.stringify(val))
		cb && cb()
	}

	get(key, cb) {
		var val = parse(localStorage.getItem(key))
		if (cb) cb(val)
		else return val

		function parse(val) {
			try {
				return JSON.parse(val)
			} catch (e) {
				return val
			}
		}
	}
}

// async
function parallel(arr, iter, done) {
  var total = arr.length
  if (total === 0) return done()

  arr.forEach((item) => {
    iter(item, finish)
  })

  function finish() {
    if (--total === 0) done()
  }
}
