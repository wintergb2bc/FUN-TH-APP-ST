export const timeout_fetch = (fetch_promise, timeout = 600000) => {
	let timeout_fn = null;
	let timeout_promise = new Promise(function(resolve, reject) {
		timeout_fn = function() {
			reject('请求超时!!!');
		};
	});
	let abortable_promise = Promise.race([ fetch_promise, timeout_promise ]);
	setTimeout(function() {
		timeout_fn();
	}, timeout);

	return abortable_promise;
}
