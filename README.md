# webviewBridgeJs
配合WebViewJavascriptBridge，用于桥接web页面js调用app函数

这个是基于`WebViewJavascriptBridge`
IOS:https://github.com/marcuswestin/WebViewJavascriptBridge
Android:https://github.com/gzsll/WebViewJavascriptBridge

# 调用方式
```
// appFunName： 为app的函数名，param： 调用app函数需要的参数，callBack：app函数执行完后调用的js函数
appBridge.callAPPFunction( appFunName, param, callBack );

```
