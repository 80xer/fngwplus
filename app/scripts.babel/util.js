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

// async run by dom
function asyncDom(target, cb) {
	if (!target) return
	var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
	function checkForJS_Finish() {
		if (checkDom(target)) {
			clearInterval(jsInitChecktimer);
			cb && cb()
		}
	}
}

// check dom
function checkDom(target) {
	var length = 0;
	var targetLength = 0
	var flag = true;
	if (Array.isArray(target)) {
		targetLength = target.length
		for (var i = 0; i < target.length; i++) {
			flag = flag && checkDom(target[i])
		}
	} else {
		targetLength = 1
		length = $(target).length
		flag = (length >= targetLength)
	}

	return flag
}
