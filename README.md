## webviewBridgeJs
配合`WebViewJavascriptBridge`，用于桥接web页面js调用app函数

基于`WebViewJavascriptBridge` 调用app函数，在APP环境需要依赖以下开源项目

IOS:https://github.com/marcuswestin/WebViewJavascriptBridge
Android:https://github.com/gzsll/WebViewJavascriptBridge

## 基本属性

**callAPPFunction** - _Function( appFunName, param, callBack )_: 调用app函数，`appFunName`代表调用的app函数名，必须确定函数名在app中已经被注册 `param`代表app函数需要的参数，`callBack`app函数执行完成后需要调用的js函数。通过`WebViewJavascriptBridge`调用app函数，调用此函数时必须位于app webview中调用，函数根据`userAgentAndroid`、`userAgentIos`两个属性判断是否为app，默认值为`APP-ANDROID`、`APP-IOS`。如果`WebViewJavascriptBridge`没有加载完成，会等到加载完成后去执行app函数。

**callApp** - _Function( appFunName, param, callBack )_: 直接通过`WebViewJavascriptBridge`调用app

**userAgentAndroid**: _string_ 默认值:`APP-ANDROID`，app的user agent中需要包含这个默认值

**userAgentIos**: _string_ 默认值:`APP-IOS`，app的user agent中需要包含这个默认值

**isCanCallApp** - _Function() boolean_: 判断`WebViewJavascriptBridge`是否加载完成

**isAPP** - _Function() boolean_: 判断是否为app环境，函数根据`userAgentAndroid`、`userAgentIos`两个属性判断是否为app

**debug** - _Function ( message )_: 在属性`bedebug`为`true`会将`message` `alert`出来，app不方便调试代码可通过`debug`函数进行调试。

**thirdPartShare** _Function(content, url, img, title, callBack)_ : app分享，通过 app函数名"thirdPartShare"调用app函数


## 函数调用方式
```
格式：appBridge.<函数名>(<参数>)

// appFunName： 为app的函数名，param： 调用app函数需要的参数，callBack：app函数执行完后调用的js函数
appBridge.callAPPFunction( appFunName, param, callBack );

```


## Demo 

### 内部扩展，以下代码位于app-bridge.js中
```
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
	
}
```

### 外部调用
```
var title = "我是标题",
var content = "我是内容",
var img ="http://bpic.588ku.com/back_pic/04/71/07/88589a6c0791964.jpg",
var url = http://www.baidu.com"
appBridge.thirdPartShare: function(content, url, img, title, callBack);
```
