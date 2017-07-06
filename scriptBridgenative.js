/**
 * 调用方式：
 * window.WebViewJavascriptBridge.send(data, function(responseData) {}); 
 * window.WebViewJavascriptBridge.callHandler(functionName, data, function(responseData) {}); 
 */
(function($) {
		$.WebViewJavascriptBridge = {
			connectWebViewJavascriptBridge : function(callback) {
				if (window.WebViewJavascriptBridge) {
					return callback(WebViewJavascriptBridge)
				}
				if (window.WVJBCallbacks) {
			    	return window.WVJBCallbacks.push(callback);
			    }
				
				// IOS 要这么走不然会有问题
				if ( navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ) {
					window.WVJBCallbacks = [callback];
				    var WVJBIframe = document.createElement('iframe');
				    WVJBIframe.style.display = 'none';
				    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
				    document.documentElement.appendChild(WVJBIframe);
				    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady',
							function() {callback(WebViewJavascriptBridge)}, false);
				}
			}
		};
		
		// 注册回调函数，第一次连接时调用 初始化函数
		// IOS 要这么走不然会有问题
		if ( navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ) {
			$.WebViewJavascriptBridge.connectWebViewJavascriptBridge(function(bridge) {});
		} else {
			$.WebViewJavascriptBridge.connectWebViewJavascriptBridge(function(bridge) {
				bridge.init(function(message, responseCallback) {
					responseCallback({});
				});
			});
		}
})(jQuery);