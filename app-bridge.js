/**
 * [用于桥接web页面js调用app函数]
 * @param  {[type]} w [description]
 * @return {[type]}   [description]
 */
(function(w) {
	"use strict";
	
	var appBridge = function() {
		var _this                  = this;
		_this.userAgentAndroid     = "APP-ANDROID";		// 安卓app默认的userAgent
		_this.userAgentIos         = "APP-IOS";			// ios app默认的userAgent
		_this.bedebug              = true;
	}
	
	appBridge.prototype = {
			/**
			 * 分享格式
			 * 	{ 
			 *  "title":"我是标题",
			 *  "content":"我是内容",
			 *  "picURL":"http://bpic.588ku.com/back_pic/04/71/07/88589a6c0791964.jpg",
			 *  "clickURL":"http://www.baidu.com"
			 * }
			 */
			thirdPartShare: function(content, url, img, title, callBack) {
				var _this = this;
				var shareContent = _this.buildShareContent(content, url, img, title);
				_this.debug("分享开始格式："+JSON.stringify(shareContent));
				_this.callAPPFunction( "thirdPartShare", shareContent, function(responseData) {
					_this.debug("分享回调开始");
					
					if ( !callBack ) {
						_this.debug("没有回调函数");
						return;
					}
					
					_this.debug(responseData.shareResult);
					_this.debug(responseData);
					
					if ( callBack.complete ) {
						callBack.complete.call(this, responseData);
					}
					
					if ( responseData.shareResult == "true" && callBack.success ) {
						callBack.success.call(this, responseData);
					}
					
					if ( responseData.shareResult == "false" && callBack.fail ) {
						callBack.fail.call(this, responseData);
					}
				} );
			},
			/**
			 * 分享的默认值
			 */
			sharedDefault: {
				img:"",
				title:"",
				url:"",
				content:"",
			},

			/**
			 * 对传入的参数进行验证，如果参数值不对会设置上默认的值
			 * @param content
			 * @param url
			 * @param img
			 * @param title
			 * @returns {___anonymous4302_4403}
			 */
			buildShareContent: function( content, url, img, title ) {
				var _this = this;
				// 如果参数不对 设置上默认值
				if ( !img ) {
					img = _this.sharedDefault["img"];
				}
				if ( !url ) {
					url = _this.sharedDefault["url"];
				}
				if ( !title ) {
					title = _this.sharedDefault["title"];
				}
				if ( !content ) {
					content = _this.sharedDefault["content"];
				}
				return {
						"title":title,
						"content": content,
						"picURL": img,
						"clickURL": url
				}
				
			},

			/**
			 * 调用APP函数,如果 'WebViewJavascriptBridge 没有加载完成会等到加载完成后再去调用APP函数
			 * @param appFunName		app的函数名，这个函数名需要在app中注册过
			 * @param param             app函数需要的参数
			 * @param callBack			app函数执行完成之后需要回调的js函数，可空
			 */
			callAPPFunction: function ( appFunName, param, callBack ) {
				var _this = this;
				
				if ( !_this.isAPP() ) {
					return;
				}
				
				if ( !_this.isCanCallApp() ) {
					// 没有webviewBridge需要监听webviewBride加载完成之后再去执行函数
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						_this.callApp( appFunName, param, callBack );
					}, false);
					return;
				}
				_this.callApp( appFunName, param, callBack );
			},
			
			/**
			 * 调用APP函数
			 * @param appFunName
			 * @param param
			 * @param callBack
			 */
			callApp: function( appFunName, param, callBack ) {
				w.WebViewJavascriptBridge.callHandler(
						appFunName,
						param,
				        callBack
				    );
			},

			/**
			 * 判断是否可以调用APP的函数
			 * @returns {Boolean}
			 */
			isCanCallApp: function() {
				 return typeof window.WebViewJavascriptBridge != "undefined" && window.WebViewJavascriptBridge != null; 
			},
			
			/**
			 * 根据默认的useAgent判断是否是app客户端
			 * @return {Boolean} [description]
			 */
			isAPP: function() {
				var _this = this;
				return navigator.userAgent.indexOf(_this.userAgentAndroid) >= 0 || navigator.userAgent.indexOf(_this.userAgentIos) >= 0;
			},
			
			/**
			 * 如果bedebug属性是true，会在app中alert出message内容，可用于app端调试使用
			 * @param  {[type]} message [description]
			 * @return {[type]}         [description]
			 */
			debug:function ( message ) {
				var _this = this;
				if ( _this.bedebug ) {
					alert(message);
				}
				
			}
	}
	
	w.appBridge = new appBridge();
	return w.appBridge;
})(window);
