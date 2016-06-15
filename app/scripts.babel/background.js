'use strict';
var omni = new Omni(localStorage.setup === 'true');

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status !== 'loading') return

	chrome.tabs.executeScript(tabId, {
		code: 'var injected = window.fngwplusInjected; window.fngwplusInjected = true; injected;',
		runAt: 'document_start'
	}, (res) => {
		if (chrome.runtime.lastError || res[0]) return

		const cssFiles = [
			'styles/fngwplus.css'
		]

		const jsFiles = [
			'scripts/jquery.js',
			'scripts/cal.js',
			'scripts/fngwplus.js'
		]

		function inject(fn) {
			return (file, cb) => {
				chrome.tabs[fn](tabId, { file: file, runAt: 'document_start' }, cb)
			}
		}

		eachTask([
			(cb) => eachItem(cssFiles, inject('insertCSS'), cb),
			(cb) => eachItem(jsFiles, inject('executeScript'), cb)
		])
	})
})

function eachTask(tasks, done) {
	(function next(index = 0) {
		if (index === tasks.length) done && done()
		else tasks[index](() => next(++index))
	})()
}

function eachItem(arr, iter, done) {
	const tasks = arr.map((item) => {
		return (cb) => iter(item, cb)
	})
	return eachTask(tasks, done)
}

chrome.omnibox.onInputChanged.addListener(omni.suggest.bind(omni));

chrome.omnibox.onInputEntered.addListener(
	function(text) {
		if (text) {
			if (text) omni.decide(text);
		}
	}
);

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});
