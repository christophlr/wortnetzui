function yE(n,e){for(var t=0;t<e.length;t++){const r=e[t];if(typeof r!="string"&&!Array.isArray(r)){for(const o in r)if(o!=="default"&&!(o in n)){const a=Object.getOwnPropertyDescriptor(r,o);a&&Object.defineProperty(n,o,a.get?a:{enumerable:!0,get:()=>r[o]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();function P_(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var bd={exports:{}},Va={},Td={exports:{}},Mt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var B0;function SE(){if(B0)return Mt;B0=1;var n=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),a=Symbol.for("react.provider"),c=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),v=Symbol.for("react.lazy"),g=Symbol.iterator;function m(P){return P===null||typeof P!="object"?null:(P=g&&P[g]||P["@@iterator"],typeof P=="function"?P:null)}var _={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,E={};function y(P,V,ge){this.props=P,this.context=V,this.refs=E,this.updater=ge||_}y.prototype.isReactComponent={},y.prototype.setState=function(P,V){if(typeof P!="object"&&typeof P!="function"&&P!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,P,V,"setState")},y.prototype.forceUpdate=function(P){this.updater.enqueueForceUpdate(this,P,"forceUpdate")};function x(){}x.prototype=y.prototype;function T(P,V,ge){this.props=P,this.context=V,this.refs=E,this.updater=ge||_}var N=T.prototype=new x;N.constructor=T,M(N,y.prototype),N.isPureReactComponent=!0;var C=Array.isArray,k=Object.prototype.hasOwnProperty,I={current:null},F={key:!0,ref:!0,__self:!0,__source:!0};function b(P,V,ge){var ye,Se={},te=null,he=null;if(V!=null)for(ye in V.ref!==void 0&&(he=V.ref),V.key!==void 0&&(te=""+V.key),V)k.call(V,ye)&&!F.hasOwnProperty(ye)&&(Se[ye]=V[ye]);var pe=arguments.length-2;if(pe===1)Se.children=ge;else if(1<pe){for(var oe=Array(pe),Ae=0;Ae<pe;Ae++)oe[Ae]=arguments[Ae+2];Se.children=oe}if(P&&P.defaultProps)for(ye in pe=P.defaultProps,pe)Se[ye]===void 0&&(Se[ye]=pe[ye]);return{$$typeof:n,type:P,key:te,ref:he,props:Se,_owner:I.current}}function O(P,V){return{$$typeof:n,type:P.type,key:V,ref:P.ref,props:P.props,_owner:P._owner}}function X(P){return typeof P=="object"&&P!==null&&P.$$typeof===n}function B(P){var V={"=":"=0",":":"=2"};return"$"+P.replace(/[=:]/g,function(ge){return V[ge]})}var Z=/\/+/g;function ne(P,V){return typeof P=="object"&&P!==null&&P.key!=null?B(""+P.key):V.toString(36)}function ce(P,V,ge,ye,Se){var te=typeof P;(te==="undefined"||te==="boolean")&&(P=null);var he=!1;if(P===null)he=!0;else switch(te){case"string":case"number":he=!0;break;case"object":switch(P.$$typeof){case n:case e:he=!0}}if(he)return he=P,Se=Se(he),P=ye===""?"."+ne(he,0):ye,C(Se)?(ge="",P!=null&&(ge=P.replace(Z,"$&/")+"/"),ce(Se,V,ge,"",function(Ae){return Ae})):Se!=null&&(X(Se)&&(Se=O(Se,ge+(!Se.key||he&&he.key===Se.key?"":(""+Se.key).replace(Z,"$&/")+"/")+P)),V.push(Se)),1;if(he=0,ye=ye===""?".":ye+":",C(P))for(var pe=0;pe<P.length;pe++){te=P[pe];var oe=ye+ne(te,pe);he+=ce(te,V,ge,oe,Se)}else if(oe=m(P),typeof oe=="function")for(P=oe.call(P),pe=0;!(te=P.next()).done;)te=te.value,oe=ye+ne(te,pe++),he+=ce(te,V,ge,oe,Se);else if(te==="object")throw V=String(P),Error("Objects are not valid as a React child (found: "+(V==="[object Object]"?"object with keys {"+Object.keys(P).join(", ")+"}":V)+"). If you meant to render a collection of children, use an array instead.");return he}function G(P,V,ge){if(P==null)return P;var ye=[],Se=0;return ce(P,ye,"","",function(te){return V.call(ge,te,Se++)}),ye}function Y(P){if(P._status===-1){var V=P._result;V=V(),V.then(function(ge){(P._status===0||P._status===-1)&&(P._status=1,P._result=ge)},function(ge){(P._status===0||P._status===-1)&&(P._status=2,P._result=ge)}),P._status===-1&&(P._status=0,P._result=V)}if(P._status===1)return P._result.default;throw P._result}var j={current:null},W={transition:null},z={ReactCurrentDispatcher:j,ReactCurrentBatchConfig:W,ReactCurrentOwner:I};function $(){throw Error("act(...) is not supported in production builds of React.")}return Mt.Children={map:G,forEach:function(P,V,ge){G(P,function(){V.apply(this,arguments)},ge)},count:function(P){var V=0;return G(P,function(){V++}),V},toArray:function(P){return G(P,function(V){return V})||[]},only:function(P){if(!X(P))throw Error("React.Children.only expected to receive a single React element child.");return P}},Mt.Component=y,Mt.Fragment=t,Mt.Profiler=o,Mt.PureComponent=T,Mt.StrictMode=r,Mt.Suspense=h,Mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=z,Mt.act=$,Mt.cloneElement=function(P,V,ge){if(P==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+P+".");var ye=M({},P.props),Se=P.key,te=P.ref,he=P._owner;if(V!=null){if(V.ref!==void 0&&(te=V.ref,he=I.current),V.key!==void 0&&(Se=""+V.key),P.type&&P.type.defaultProps)var pe=P.type.defaultProps;for(oe in V)k.call(V,oe)&&!F.hasOwnProperty(oe)&&(ye[oe]=V[oe]===void 0&&pe!==void 0?pe[oe]:V[oe])}var oe=arguments.length-2;if(oe===1)ye.children=ge;else if(1<oe){pe=Array(oe);for(var Ae=0;Ae<oe;Ae++)pe[Ae]=arguments[Ae+2];ye.children=pe}return{$$typeof:n,type:P.type,key:Se,ref:te,props:ye,_owner:he}},Mt.createContext=function(P){return P={$$typeof:c,_currentValue:P,_currentValue2:P,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},P.Provider={$$typeof:a,_context:P},P.Consumer=P},Mt.createElement=b,Mt.createFactory=function(P){var V=b.bind(null,P);return V.type=P,V},Mt.createRef=function(){return{current:null}},Mt.forwardRef=function(P){return{$$typeof:f,render:P}},Mt.isValidElement=X,Mt.lazy=function(P){return{$$typeof:v,_payload:{_status:-1,_result:P},_init:Y}},Mt.memo=function(P,V){return{$$typeof:d,type:P,compare:V===void 0?null:V}},Mt.startTransition=function(P){var V=W.transition;W.transition={};try{P()}finally{W.transition=V}},Mt.unstable_act=$,Mt.useCallback=function(P,V){return j.current.useCallback(P,V)},Mt.useContext=function(P){return j.current.useContext(P)},Mt.useDebugValue=function(){},Mt.useDeferredValue=function(P){return j.current.useDeferredValue(P)},Mt.useEffect=function(P,V){return j.current.useEffect(P,V)},Mt.useId=function(){return j.current.useId()},Mt.useImperativeHandle=function(P,V,ge){return j.current.useImperativeHandle(P,V,ge)},Mt.useInsertionEffect=function(P,V){return j.current.useInsertionEffect(P,V)},Mt.useLayoutEffect=function(P,V){return j.current.useLayoutEffect(P,V)},Mt.useMemo=function(P,V){return j.current.useMemo(P,V)},Mt.useReducer=function(P,V,ge){return j.current.useReducer(P,V,ge)},Mt.useRef=function(P){return j.current.useRef(P)},Mt.useState=function(P){return j.current.useState(P)},Mt.useSyncExternalStore=function(P,V,ge){return j.current.useSyncExternalStore(P,V,ge)},Mt.useTransition=function(){return j.current.useTransition()},Mt.version="18.3.1",Mt}var V0;function Ap(){return V0||(V0=1,Td.exports=SE()),Td.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var G0;function ME(){if(G0)return Va;G0=1;var n=Ap(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,o=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(f,h,d){var v,g={},m=null,_=null;d!==void 0&&(m=""+d),h.key!==void 0&&(m=""+h.key),h.ref!==void 0&&(_=h.ref);for(v in h)r.call(h,v)&&!a.hasOwnProperty(v)&&(g[v]=h[v]);if(f&&f.defaultProps)for(v in h=f.defaultProps,h)g[v]===void 0&&(g[v]=h[v]);return{$$typeof:e,type:f,key:m,ref:_,props:g,_owner:o.current}}return Va.Fragment=t,Va.jsx=c,Va.jsxs=c,Va}var H0;function EE(){return H0||(H0=1,bd.exports=ME()),bd.exports}var w=EE(),mc={},Ad={exports:{}},$n={},Rd={exports:{}},Cd={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W0;function wE(){return W0||(W0=1,(function(n){function e(W,z){var $=W.length;W.push(z);e:for(;0<$;){var P=$-1>>>1,V=W[P];if(0<o(V,z))W[P]=z,W[$]=V,$=P;else break e}}function t(W){return W.length===0?null:W[0]}function r(W){if(W.length===0)return null;var z=W[0],$=W.pop();if($!==z){W[0]=$;e:for(var P=0,V=W.length,ge=V>>>1;P<ge;){var ye=2*(P+1)-1,Se=W[ye],te=ye+1,he=W[te];if(0>o(Se,$))te<V&&0>o(he,Se)?(W[P]=he,W[te]=$,P=te):(W[P]=Se,W[ye]=$,P=ye);else if(te<V&&0>o(he,$))W[P]=he,W[te]=$,P=te;else break e}}return z}function o(W,z){var $=W.sortIndex-z.sortIndex;return $!==0?$:W.id-z.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;n.unstable_now=function(){return a.now()}}else{var c=Date,f=c.now();n.unstable_now=function(){return c.now()-f}}var h=[],d=[],v=1,g=null,m=3,_=!1,M=!1,E=!1,y=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,T=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function N(W){for(var z=t(d);z!==null;){if(z.callback===null)r(d);else if(z.startTime<=W)r(d),z.sortIndex=z.expirationTime,e(h,z);else break;z=t(d)}}function C(W){if(E=!1,N(W),!M)if(t(h)!==null)M=!0,Y(k);else{var z=t(d);z!==null&&j(C,z.startTime-W)}}function k(W,z){M=!1,E&&(E=!1,x(b),b=-1),_=!0;var $=m;try{for(N(z),g=t(h);g!==null&&(!(g.expirationTime>z)||W&&!B());){var P=g.callback;if(typeof P=="function"){g.callback=null,m=g.priorityLevel;var V=P(g.expirationTime<=z);z=n.unstable_now(),typeof V=="function"?g.callback=V:g===t(h)&&r(h),N(z)}else r(h);g=t(h)}if(g!==null)var ge=!0;else{var ye=t(d);ye!==null&&j(C,ye.startTime-z),ge=!1}return ge}finally{g=null,m=$,_=!1}}var I=!1,F=null,b=-1,O=5,X=-1;function B(){return!(n.unstable_now()-X<O)}function Z(){if(F!==null){var W=n.unstable_now();X=W;var z=!0;try{z=F(!0,W)}finally{z?ne():(I=!1,F=null)}}else I=!1}var ne;if(typeof T=="function")ne=function(){T(Z)};else if(typeof MessageChannel<"u"){var ce=new MessageChannel,G=ce.port2;ce.port1.onmessage=Z,ne=function(){G.postMessage(null)}}else ne=function(){y(Z,0)};function Y(W){F=W,I||(I=!0,ne())}function j(W,z){b=y(function(){W(n.unstable_now())},z)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(W){W.callback=null},n.unstable_continueExecution=function(){M||_||(M=!0,Y(k))},n.unstable_forceFrameRate=function(W){0>W||125<W?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):O=0<W?Math.floor(1e3/W):5},n.unstable_getCurrentPriorityLevel=function(){return m},n.unstable_getFirstCallbackNode=function(){return t(h)},n.unstable_next=function(W){switch(m){case 1:case 2:case 3:var z=3;break;default:z=m}var $=m;m=z;try{return W()}finally{m=$}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(W,z){switch(W){case 1:case 2:case 3:case 4:case 5:break;default:W=3}var $=m;m=W;try{return z()}finally{m=$}},n.unstable_scheduleCallback=function(W,z,$){var P=n.unstable_now();switch(typeof $=="object"&&$!==null?($=$.delay,$=typeof $=="number"&&0<$?P+$:P):$=P,W){case 1:var V=-1;break;case 2:V=250;break;case 5:V=1073741823;break;case 4:V=1e4;break;default:V=5e3}return V=$+V,W={id:v++,callback:z,priorityLevel:W,startTime:$,expirationTime:V,sortIndex:-1},$>P?(W.sortIndex=$,e(d,W),t(h)===null&&W===t(d)&&(E?(x(b),b=-1):E=!0,j(C,$-P))):(W.sortIndex=V,e(h,W),M||_||(M=!0,Y(k))),W},n.unstable_shouldYield=B,n.unstable_wrapCallback=function(W){var z=m;return function(){var $=m;m=z;try{return W.apply(this,arguments)}finally{m=$}}}})(Cd)),Cd}var j0;function bE(){return j0||(j0=1,Rd.exports=wE()),Rd.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var X0;function TE(){if(X0)return $n;X0=1;var n=Ap(),e=bE();function t(i){for(var s="https://reactjs.org/docs/error-decoder.html?invariant="+i,l=1;l<arguments.length;l++)s+="&args[]="+encodeURIComponent(arguments[l]);return"Minified React error #"+i+"; visit "+s+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,o={};function a(i,s){c(i,s),c(i+"Capture",s)}function c(i,s){for(o[i]=s,i=0;i<s.length;i++)r.add(s[i])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,d=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,v={},g={};function m(i){return h.call(g,i)?!0:h.call(v,i)?!1:d.test(i)?g[i]=!0:(v[i]=!0,!1)}function _(i,s,l,u){if(l!==null&&l.type===0)return!1;switch(typeof s){case"function":case"symbol":return!0;case"boolean":return u?!1:l!==null?!l.acceptsBooleans:(i=i.toLowerCase().slice(0,5),i!=="data-"&&i!=="aria-");default:return!1}}function M(i,s,l,u){if(s===null||typeof s>"u"||_(i,s,l,u))return!0;if(u)return!1;if(l!==null)switch(l.type){case 3:return!s;case 4:return s===!1;case 5:return isNaN(s);case 6:return isNaN(s)||1>s}return!1}function E(i,s,l,u,p,S,R){this.acceptsBooleans=s===2||s===3||s===4,this.attributeName=u,this.attributeNamespace=p,this.mustUseProperty=l,this.propertyName=i,this.type=s,this.sanitizeURL=S,this.removeEmptyString=R}var y={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(i){y[i]=new E(i,0,!1,i,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(i){var s=i[0];y[s]=new E(s,1,!1,i[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(i){y[i]=new E(i,2,!1,i.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(i){y[i]=new E(i,2,!1,i,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(i){y[i]=new E(i,3,!1,i.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(i){y[i]=new E(i,3,!0,i,null,!1,!1)}),["capture","download"].forEach(function(i){y[i]=new E(i,4,!1,i,null,!1,!1)}),["cols","rows","size","span"].forEach(function(i){y[i]=new E(i,6,!1,i,null,!1,!1)}),["rowSpan","start"].forEach(function(i){y[i]=new E(i,5,!1,i.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function T(i){return i[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(i){var s=i.replace(x,T);y[s]=new E(s,1,!1,i,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(i){var s=i.replace(x,T);y[s]=new E(s,1,!1,i,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(i){var s=i.replace(x,T);y[s]=new E(s,1,!1,i,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(i){y[i]=new E(i,1,!1,i.toLowerCase(),null,!1,!1)}),y.xlinkHref=new E("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(i){y[i]=new E(i,1,!1,i.toLowerCase(),null,!0,!0)});function N(i,s,l,u){var p=y.hasOwnProperty(s)?y[s]:null;(p!==null?p.type!==0:u||!(2<s.length)||s[0]!=="o"&&s[0]!=="O"||s[1]!=="n"&&s[1]!=="N")&&(M(s,l,p,u)&&(l=null),u||p===null?m(s)&&(l===null?i.removeAttribute(s):i.setAttribute(s,""+l)):p.mustUseProperty?i[p.propertyName]=l===null?p.type===3?!1:"":l:(s=p.attributeName,u=p.attributeNamespace,l===null?i.removeAttribute(s):(p=p.type,l=p===3||p===4&&l===!0?"":""+l,u?i.setAttributeNS(u,s,l):i.setAttribute(s,l))))}var C=n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,k=Symbol.for("react.element"),I=Symbol.for("react.portal"),F=Symbol.for("react.fragment"),b=Symbol.for("react.strict_mode"),O=Symbol.for("react.profiler"),X=Symbol.for("react.provider"),B=Symbol.for("react.context"),Z=Symbol.for("react.forward_ref"),ne=Symbol.for("react.suspense"),ce=Symbol.for("react.suspense_list"),G=Symbol.for("react.memo"),Y=Symbol.for("react.lazy"),j=Symbol.for("react.offscreen"),W=Symbol.iterator;function z(i){return i===null||typeof i!="object"?null:(i=W&&i[W]||i["@@iterator"],typeof i=="function"?i:null)}var $=Object.assign,P;function V(i){if(P===void 0)try{throw Error()}catch(l){var s=l.stack.trim().match(/\n( *(at )?)/);P=s&&s[1]||""}return`
`+P+i}var ge=!1;function ye(i,s){if(!i||ge)return"";ge=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(s)if(s=function(){throw Error()},Object.defineProperty(s.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(s,[])}catch(de){var u=de}Reflect.construct(i,[],s)}else{try{s.call()}catch(de){u=de}i.call(s.prototype)}else{try{throw Error()}catch(de){u=de}i()}}catch(de){if(de&&u&&typeof de.stack=="string"){for(var p=de.stack.split(`
`),S=u.stack.split(`
`),R=p.length-1,H=S.length-1;1<=R&&0<=H&&p[R]!==S[H];)H--;for(;1<=R&&0<=H;R--,H--)if(p[R]!==S[H]){if(R!==1||H!==1)do if(R--,H--,0>H||p[R]!==S[H]){var K=`
`+p[R].replace(" at new "," at ");return i.displayName&&K.includes("<anonymous>")&&(K=K.replace("<anonymous>",i.displayName)),K}while(1<=R&&0<=H);break}}}finally{ge=!1,Error.prepareStackTrace=l}return(i=i?i.displayName||i.name:"")?V(i):""}function Se(i){switch(i.tag){case 5:return V(i.type);case 16:return V("Lazy");case 13:return V("Suspense");case 19:return V("SuspenseList");case 0:case 2:case 15:return i=ye(i.type,!1),i;case 11:return i=ye(i.type.render,!1),i;case 1:return i=ye(i.type,!0),i;default:return""}}function te(i){if(i==null)return null;if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i;switch(i){case F:return"Fragment";case I:return"Portal";case O:return"Profiler";case b:return"StrictMode";case ne:return"Suspense";case ce:return"SuspenseList"}if(typeof i=="object")switch(i.$$typeof){case B:return(i.displayName||"Context")+".Consumer";case X:return(i._context.displayName||"Context")+".Provider";case Z:var s=i.render;return i=i.displayName,i||(i=s.displayName||s.name||"",i=i!==""?"ForwardRef("+i+")":"ForwardRef"),i;case G:return s=i.displayName||null,s!==null?s:te(i.type)||"Memo";case Y:s=i._payload,i=i._init;try{return te(i(s))}catch{}}return null}function he(i){var s=i.type;switch(i.tag){case 24:return"Cache";case 9:return(s.displayName||"Context")+".Consumer";case 10:return(s._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return i=s.render,i=i.displayName||i.name||"",s.displayName||(i!==""?"ForwardRef("+i+")":"ForwardRef");case 7:return"Fragment";case 5:return s;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return te(s);case 8:return s===b?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof s=="function")return s.displayName||s.name||null;if(typeof s=="string")return s}return null}function pe(i){switch(typeof i){case"boolean":case"number":case"string":case"undefined":return i;case"object":return i;default:return""}}function oe(i){var s=i.type;return(i=i.nodeName)&&i.toLowerCase()==="input"&&(s==="checkbox"||s==="radio")}function Ae(i){var s=oe(i)?"checked":"value",l=Object.getOwnPropertyDescriptor(i.constructor.prototype,s),u=""+i[s];if(!i.hasOwnProperty(s)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var p=l.get,S=l.set;return Object.defineProperty(i,s,{configurable:!0,get:function(){return p.call(this)},set:function(R){u=""+R,S.call(this,R)}}),Object.defineProperty(i,s,{enumerable:l.enumerable}),{getValue:function(){return u},setValue:function(R){u=""+R},stopTracking:function(){i._valueTracker=null,delete i[s]}}}}function Te(i){i._valueTracker||(i._valueTracker=Ae(i))}function rt(i){if(!i)return!1;var s=i._valueTracker;if(!s)return!0;var l=s.getValue(),u="";return i&&(u=oe(i)?i.checked?"true":"false":i.value),i=u,i!==l?(s.setValue(i),!0):!1}function Be(i){if(i=i||(typeof document<"u"?document:void 0),typeof i>"u")return null;try{return i.activeElement||i.body}catch{return i.body}}function Qe(i,s){var l=s.checked;return $({},s,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:l??i._wrapperState.initialChecked})}function pt(i,s){var l=s.defaultValue==null?"":s.defaultValue,u=s.checked!=null?s.checked:s.defaultChecked;l=pe(s.value!=null?s.value:l),i._wrapperState={initialChecked:u,initialValue:l,controlled:s.type==="checkbox"||s.type==="radio"?s.checked!=null:s.value!=null}}function st(i,s){s=s.checked,s!=null&&N(i,"checked",s,!1)}function Ct(i,s){st(i,s);var l=pe(s.value),u=s.type;if(l!=null)u==="number"?(l===0&&i.value===""||i.value!=l)&&(i.value=""+l):i.value!==""+l&&(i.value=""+l);else if(u==="submit"||u==="reset"){i.removeAttribute("value");return}s.hasOwnProperty("value")?Wt(i,s.type,l):s.hasOwnProperty("defaultValue")&&Wt(i,s.type,pe(s.defaultValue)),s.checked==null&&s.defaultChecked!=null&&(i.defaultChecked=!!s.defaultChecked)}function wt(i,s,l){if(s.hasOwnProperty("value")||s.hasOwnProperty("defaultValue")){var u=s.type;if(!(u!=="submit"&&u!=="reset"||s.value!==void 0&&s.value!==null))return;s=""+i._wrapperState.initialValue,l||s===i.value||(i.value=s),i.defaultValue=s}l=i.name,l!==""&&(i.name=""),i.defaultChecked=!!i._wrapperState.initialChecked,l!==""&&(i.name=l)}function Wt(i,s,l){(s!=="number"||Be(i.ownerDocument)!==i)&&(l==null?i.defaultValue=""+i._wrapperState.initialValue:i.defaultValue!==""+l&&(i.defaultValue=""+l))}var Q=Array.isArray;function zt(i,s,l,u){if(i=i.options,s){s={};for(var p=0;p<l.length;p++)s["$"+l[p]]=!0;for(l=0;l<i.length;l++)p=s.hasOwnProperty("$"+i[l].value),i[l].selected!==p&&(i[l].selected=p),p&&u&&(i[l].defaultSelected=!0)}else{for(l=""+pe(l),s=null,p=0;p<i.length;p++){if(i[p].value===l){i[p].selected=!0,u&&(i[p].defaultSelected=!0);return}s!==null||i[p].disabled||(s=i[p])}s!==null&&(s.selected=!0)}}function ut(i,s){if(s.dangerouslySetInnerHTML!=null)throw Error(t(91));return $({},s,{value:void 0,defaultValue:void 0,children:""+i._wrapperState.initialValue})}function Pt(i,s){var l=s.value;if(l==null){if(l=s.children,s=s.defaultValue,l!=null){if(s!=null)throw Error(t(92));if(Q(l)){if(1<l.length)throw Error(t(93));l=l[0]}s=l}s==null&&(s=""),l=s}i._wrapperState={initialValue:pe(l)}}function ke(i,s){var l=pe(s.value),u=pe(s.defaultValue);l!=null&&(l=""+l,l!==i.value&&(i.value=l),s.defaultValue==null&&i.defaultValue!==l&&(i.defaultValue=l)),u!=null&&(i.defaultValue=""+u)}function Bt(i){var s=i.textContent;s===i._wrapperState.initialValue&&s!==""&&s!==null&&(i.value=s)}function U(i){switch(i){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function A(i,s){return i==null||i==="http://www.w3.org/1999/xhtml"?U(s):i==="http://www.w3.org/2000/svg"&&s==="foreignObject"?"http://www.w3.org/1999/xhtml":i}var re,_e=(function(i){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(s,l,u,p){MSApp.execUnsafeLocalFunction(function(){return i(s,l,u,p)})}:i})(function(i,s){if(i.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in i)i.innerHTML=s;else{for(re=re||document.createElement("div"),re.innerHTML="<svg>"+s.valueOf().toString()+"</svg>",s=re.firstChild;i.firstChild;)i.removeChild(i.firstChild);for(;s.firstChild;)i.appendChild(s.firstChild)}});function Me(i,s){if(s){var l=i.firstChild;if(l&&l===i.lastChild&&l.nodeType===3){l.nodeValue=s;return}}i.textContent=s}var Ce={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Oe=["Webkit","ms","Moz","O"];Object.keys(Ce).forEach(function(i){Oe.forEach(function(s){s=s+i.charAt(0).toUpperCase()+i.substring(1),Ce[s]=Ce[i]})});function me(i,s,l){return s==null||typeof s=="boolean"||s===""?"":l||typeof s!="number"||s===0||Ce.hasOwnProperty(i)&&Ce[i]?(""+s).trim():s+"px"}function xe(i,s){i=i.style;for(var l in s)if(s.hasOwnProperty(l)){var u=l.indexOf("--")===0,p=me(l,s[l],u);l==="float"&&(l="cssFloat"),u?i.setProperty(l,p):i[l]=p}}var Ve=$({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function He(i,s){if(s){if(Ve[i]&&(s.children!=null||s.dangerouslySetInnerHTML!=null))throw Error(t(137,i));if(s.dangerouslySetInnerHTML!=null){if(s.children!=null)throw Error(t(60));if(typeof s.dangerouslySetInnerHTML!="object"||!("__html"in s.dangerouslySetInnerHTML))throw Error(t(61))}if(s.style!=null&&typeof s.style!="object")throw Error(t(62))}}function Le(i,s){if(i.indexOf("-")===-1)return typeof s.is=="string";switch(i){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Pe=null;function at(i){return i=i.target||i.srcElement||window,i.correspondingUseElement&&(i=i.correspondingUseElement),i.nodeType===3?i.parentNode:i}var dt=null,xt=null,q=null;function Ne(i){if(i=Ta(i)){if(typeof dt!="function")throw Error(t(280));var s=i.stateNode;s&&(s=Pl(s),dt(i.stateNode,i.type,s))}}function ve(i){xt?q?q.push(i):q=[i]:xt=i}function Ge(){if(xt){var i=xt,s=q;if(q=xt=null,Ne(i),s)for(i=0;i<s.length;i++)Ne(s[i])}}function Ue(i,s){return i(s)}function Ee(){}var Ke=!1;function ht(i,s,l){if(Ke)return i(s,l);Ke=!0;try{return Ue(i,s,l)}finally{Ke=!1,(xt!==null||q!==null)&&(Ee(),Ge())}}function Ht(i,s){var l=i.stateNode;if(l===null)return null;var u=Pl(l);if(u===null)return null;l=u[s];e:switch(s){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(i=i.type,u=!(i==="button"||i==="input"||i==="select"||i==="textarea")),i=!u;break e;default:i=!1}if(i)return null;if(l&&typeof l!="function")throw Error(t(231,s,typeof l));return l}var Dt=!1;if(f)try{var Ln={};Object.defineProperty(Ln,"passive",{get:function(){Dt=!0}}),window.addEventListener("test",Ln,Ln),window.removeEventListener("test",Ln,Ln)}catch{Dt=!1}function ri(i,s,l,u,p,S,R,H,K){var de=Array.prototype.slice.call(arguments,3);try{s.apply(l,de)}catch(be){this.onError(be)}}var nr=!1,$s=null,gs=!1,Ys=null,ir={onError:function(i){nr=!0,$s=i}};function sa(i,s,l,u,p,S,R,H,K){nr=!1,$s=null,ri.apply(ir,arguments)}function hl(i,s,l,u,p,S,R,H,K){if(sa.apply(this,arguments),nr){if(nr){var de=$s;nr=!1,$s=null}else throw Error(t(198));gs||(gs=!0,Ys=de)}}function Ui(i){var s=i,l=i;if(i.alternate)for(;s.return;)s=s.return;else{i=s;do s=i,(s.flags&4098)!==0&&(l=s.return),i=s.return;while(i)}return s.tag===3?l:null}function vs(i){if(i.tag===13){var s=i.memoizedState;if(s===null&&(i=i.alternate,i!==null&&(s=i.memoizedState)),s!==null)return s.dehydrated}return null}function oa(i){if(Ui(i)!==i)throw Error(t(188))}function Ks(i){var s=i.alternate;if(!s){if(s=Ui(i),s===null)throw Error(t(188));return s!==i?null:i}for(var l=i,u=s;;){var p=l.return;if(p===null)break;var S=p.alternate;if(S===null){if(u=p.return,u!==null){l=u;continue}break}if(p.child===S.child){for(S=p.child;S;){if(S===l)return oa(p),i;if(S===u)return oa(p),s;S=S.sibling}throw Error(t(188))}if(l.return!==u.return)l=p,u=S;else{for(var R=!1,H=p.child;H;){if(H===l){R=!0,l=p,u=S;break}if(H===u){R=!0,u=p,l=S;break}H=H.sibling}if(!R){for(H=S.child;H;){if(H===l){R=!0,l=S,u=p;break}if(H===u){R=!0,u=S,l=p;break}H=H.sibling}if(!R)throw Error(t(189))}}if(l.alternate!==u)throw Error(t(190))}if(l.tag!==3)throw Error(t(188));return l.stateNode.current===l?i:s}function aa(i){return i=Ks(i),i!==null?la(i):null}function la(i){if(i.tag===5||i.tag===6)return i;for(i=i.child;i!==null;){var s=la(i);if(s!==null)return s;i=i.sibling}return null}var pl=e.unstable_scheduleCallback,ml=e.unstable_cancelCallback,$u=e.unstable_shouldYield,Yu=e.unstable_requestPaint,Qt=e.unstable_now,Ku=e.unstable_getCurrentPriorityLevel,ca=e.unstable_ImmediatePriority,D=e.unstable_UserBlockingPriority,ee=e.unstable_NormalPriority,fe=e.unstable_LowPriority,le=e.unstable_IdlePriority,ae=null,Fe=null;function Xe(i){if(Fe&&typeof Fe.onCommitFiberRoot=="function")try{Fe.onCommitFiberRoot(ae,i,void 0,(i.current.flags&128)===128)}catch{}}var Ie=Math.clz32?Math.clz32:mt,qe=Math.log,tt=Math.LN2;function mt(i){return i>>>=0,i===0?32:31-(qe(i)/tt|0)|0}var gt=64,Je=4194304;function Tt(i){switch(i&-i){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return i&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return i}}function jt(i,s){var l=i.pendingLanes;if(l===0)return 0;var u=0,p=i.suspendedLanes,S=i.pingedLanes,R=l&268435455;if(R!==0){var H=R&~p;H!==0?u=Tt(H):(S&=R,S!==0&&(u=Tt(S)))}else R=l&~p,R!==0?u=Tt(R):S!==0&&(u=Tt(S));if(u===0)return 0;if(s!==0&&s!==u&&(s&p)===0&&(p=u&-u,S=s&-s,p>=S||p===16&&(S&4194240)!==0))return s;if((u&4)!==0&&(u|=l&16),s=i.entangledLanes,s!==0)for(i=i.entanglements,s&=u;0<s;)l=31-Ie(s),p=1<<l,u|=i[l],s&=~p;return u}function qt(i,s){switch(i){case 1:case 2:case 4:return s+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return s+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ft(i,s){for(var l=i.suspendedLanes,u=i.pingedLanes,p=i.expirationTimes,S=i.pendingLanes;0<S;){var R=31-Ie(S),H=1<<R,K=p[R];K===-1?((H&l)===0||(H&u)!==0)&&(p[R]=qt(H,s)):K<=s&&(i.expiredLanes|=H),S&=~H}}function an(i){return i=i.pendingLanes&-1073741825,i!==0?i:i&1073741824?1073741824:0}function We(){var i=gt;return gt<<=1,(gt&4194240)===0&&(gt=64),i}function yn(i){for(var s=[],l=0;31>l;l++)s.push(i);return s}function yt(i,s,l){i.pendingLanes|=s,s!==536870912&&(i.suspendedLanes=0,i.pingedLanes=0),i=i.eventTimes,s=31-Ie(s),i[s]=l}function Bn(i,s){var l=i.pendingLanes&~s;i.pendingLanes=s,i.suspendedLanes=0,i.pingedLanes=0,i.expiredLanes&=s,i.mutableReadLanes&=s,i.entangledLanes&=s,s=i.entanglements;var u=i.eventTimes;for(i=i.expirationTimes;0<l;){var p=31-Ie(l),S=1<<p;s[p]=0,u[p]=-1,i[p]=-1,l&=~S}}function Vn(i,s){var l=i.entangledLanes|=s;for(i=i.entanglements;l;){var u=31-Ie(l),p=1<<u;p&s|i[u]&s&&(i[u]|=s),l&=~p}}var St=0;function rr(i){return i&=-i,1<i?4<i?(i&268435455)!==0?16:536870912:4:1}var Ut,$t,_i,Ot,xi,Fi=!1,_s=[],Dr=null,Nr=null,Lr=null,ua=new Map,fa=new Map,Ir=[],GS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Em(i,s){switch(i){case"focusin":case"focusout":Dr=null;break;case"dragenter":case"dragleave":Nr=null;break;case"mouseover":case"mouseout":Lr=null;break;case"pointerover":case"pointerout":ua.delete(s.pointerId);break;case"gotpointercapture":case"lostpointercapture":fa.delete(s.pointerId)}}function da(i,s,l,u,p,S){return i===null||i.nativeEvent!==S?(i={blockedOn:s,domEventName:l,eventSystemFlags:u,nativeEvent:S,targetContainers:[p]},s!==null&&(s=Ta(s),s!==null&&$t(s)),i):(i.eventSystemFlags|=u,s=i.targetContainers,p!==null&&s.indexOf(p)===-1&&s.push(p),i)}function HS(i,s,l,u,p){switch(s){case"focusin":return Dr=da(Dr,i,s,l,u,p),!0;case"dragenter":return Nr=da(Nr,i,s,l,u,p),!0;case"mouseover":return Lr=da(Lr,i,s,l,u,p),!0;case"pointerover":var S=p.pointerId;return ua.set(S,da(ua.get(S)||null,i,s,l,u,p)),!0;case"gotpointercapture":return S=p.pointerId,fa.set(S,da(fa.get(S)||null,i,s,l,u,p)),!0}return!1}function wm(i){var s=xs(i.target);if(s!==null){var l=Ui(s);if(l!==null){if(s=l.tag,s===13){if(s=vs(l),s!==null){i.blockedOn=s,xi(i.priority,function(){_i(l)});return}}else if(s===3&&l.stateNode.current.memoizedState.isDehydrated){i.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}i.blockedOn=null}function gl(i){if(i.blockedOn!==null)return!1;for(var s=i.targetContainers;0<s.length;){var l=Zu(i.domEventName,i.eventSystemFlags,s[0],i.nativeEvent);if(l===null){l=i.nativeEvent;var u=new l.constructor(l.type,l);Pe=u,l.target.dispatchEvent(u),Pe=null}else return s=Ta(l),s!==null&&$t(s),i.blockedOn=l,!1;s.shift()}return!0}function bm(i,s,l){gl(i)&&l.delete(s)}function WS(){Fi=!1,Dr!==null&&gl(Dr)&&(Dr=null),Nr!==null&&gl(Nr)&&(Nr=null),Lr!==null&&gl(Lr)&&(Lr=null),ua.forEach(bm),fa.forEach(bm)}function ha(i,s){i.blockedOn===s&&(i.blockedOn=null,Fi||(Fi=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,WS)))}function pa(i){function s(p){return ha(p,i)}if(0<_s.length){ha(_s[0],i);for(var l=1;l<_s.length;l++){var u=_s[l];u.blockedOn===i&&(u.blockedOn=null)}}for(Dr!==null&&ha(Dr,i),Nr!==null&&ha(Nr,i),Lr!==null&&ha(Lr,i),ua.forEach(s),fa.forEach(s),l=0;l<Ir.length;l++)u=Ir[l],u.blockedOn===i&&(u.blockedOn=null);for(;0<Ir.length&&(l=Ir[0],l.blockedOn===null);)wm(l),l.blockedOn===null&&Ir.shift()}var qs=C.ReactCurrentBatchConfig,vl=!0;function jS(i,s,l,u){var p=St,S=qs.transition;qs.transition=null;try{St=1,qu(i,s,l,u)}finally{St=p,qs.transition=S}}function XS(i,s,l,u){var p=St,S=qs.transition;qs.transition=null;try{St=4,qu(i,s,l,u)}finally{St=p,qs.transition=S}}function qu(i,s,l,u){if(vl){var p=Zu(i,s,l,u);if(p===null)mf(i,s,u,_l,l),Em(i,u);else if(HS(p,i,s,l,u))u.stopPropagation();else if(Em(i,u),s&4&&-1<GS.indexOf(i)){for(;p!==null;){var S=Ta(p);if(S!==null&&Ut(S),S=Zu(i,s,l,u),S===null&&mf(i,s,u,_l,l),S===p)break;p=S}p!==null&&u.stopPropagation()}else mf(i,s,u,null,l)}}var _l=null;function Zu(i,s,l,u){if(_l=null,i=at(u),i=xs(i),i!==null)if(s=Ui(i),s===null)i=null;else if(l=s.tag,l===13){if(i=vs(s),i!==null)return i;i=null}else if(l===3){if(s.stateNode.current.memoizedState.isDehydrated)return s.tag===3?s.stateNode.containerInfo:null;i=null}else s!==i&&(i=null);return _l=i,null}function Tm(i){switch(i){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ku()){case ca:return 1;case D:return 4;case ee:case fe:return 16;case le:return 536870912;default:return 16}default:return 16}}var Ur=null,Qu=null,xl=null;function Am(){if(xl)return xl;var i,s=Qu,l=s.length,u,p="value"in Ur?Ur.value:Ur.textContent,S=p.length;for(i=0;i<l&&s[i]===p[i];i++);var R=l-i;for(u=1;u<=R&&s[l-u]===p[S-u];u++);return xl=p.slice(i,1<u?1-u:void 0)}function yl(i){var s=i.keyCode;return"charCode"in i?(i=i.charCode,i===0&&s===13&&(i=13)):i=s,i===10&&(i=13),32<=i||i===13?i:0}function Sl(){return!0}function Rm(){return!1}function qn(i){function s(l,u,p,S,R){this._reactName=l,this._targetInst=p,this.type=u,this.nativeEvent=S,this.target=R,this.currentTarget=null;for(var H in i)i.hasOwnProperty(H)&&(l=i[H],this[H]=l?l(S):S[H]);return this.isDefaultPrevented=(S.defaultPrevented!=null?S.defaultPrevented:S.returnValue===!1)?Sl:Rm,this.isPropagationStopped=Rm,this}return $(s.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=Sl)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=Sl)},persist:function(){},isPersistent:Sl}),s}var Zs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(i){return i.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ju=qn(Zs),ma=$({},Zs,{view:0,detail:0}),$S=qn(ma),ef,tf,ga,Ml=$({},ma,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:rf,button:0,buttons:0,relatedTarget:function(i){return i.relatedTarget===void 0?i.fromElement===i.srcElement?i.toElement:i.fromElement:i.relatedTarget},movementX:function(i){return"movementX"in i?i.movementX:(i!==ga&&(ga&&i.type==="mousemove"?(ef=i.screenX-ga.screenX,tf=i.screenY-ga.screenY):tf=ef=0,ga=i),ef)},movementY:function(i){return"movementY"in i?i.movementY:tf}}),Cm=qn(Ml),YS=$({},Ml,{dataTransfer:0}),KS=qn(YS),qS=$({},ma,{relatedTarget:0}),nf=qn(qS),ZS=$({},Zs,{animationName:0,elapsedTime:0,pseudoElement:0}),QS=qn(ZS),JS=$({},Zs,{clipboardData:function(i){return"clipboardData"in i?i.clipboardData:window.clipboardData}}),eM=qn(JS),tM=$({},Zs,{data:0}),Pm=qn(tM),nM={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},iM={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},rM={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function sM(i){var s=this.nativeEvent;return s.getModifierState?s.getModifierState(i):(i=rM[i])?!!s[i]:!1}function rf(){return sM}var oM=$({},ma,{key:function(i){if(i.key){var s=nM[i.key]||i.key;if(s!=="Unidentified")return s}return i.type==="keypress"?(i=yl(i),i===13?"Enter":String.fromCharCode(i)):i.type==="keydown"||i.type==="keyup"?iM[i.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:rf,charCode:function(i){return i.type==="keypress"?yl(i):0},keyCode:function(i){return i.type==="keydown"||i.type==="keyup"?i.keyCode:0},which:function(i){return i.type==="keypress"?yl(i):i.type==="keydown"||i.type==="keyup"?i.keyCode:0}}),aM=qn(oM),lM=$({},Ml,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Dm=qn(lM),cM=$({},ma,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:rf}),uM=qn(cM),fM=$({},Zs,{propertyName:0,elapsedTime:0,pseudoElement:0}),dM=qn(fM),hM=$({},Ml,{deltaX:function(i){return"deltaX"in i?i.deltaX:"wheelDeltaX"in i?-i.wheelDeltaX:0},deltaY:function(i){return"deltaY"in i?i.deltaY:"wheelDeltaY"in i?-i.wheelDeltaY:"wheelDelta"in i?-i.wheelDelta:0},deltaZ:0,deltaMode:0}),pM=qn(hM),mM=[9,13,27,32],sf=f&&"CompositionEvent"in window,va=null;f&&"documentMode"in document&&(va=document.documentMode);var gM=f&&"TextEvent"in window&&!va,Nm=f&&(!sf||va&&8<va&&11>=va),Lm=" ",Im=!1;function Um(i,s){switch(i){case"keyup":return mM.indexOf(s.keyCode)!==-1;case"keydown":return s.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Fm(i){return i=i.detail,typeof i=="object"&&"data"in i?i.data:null}var Qs=!1;function vM(i,s){switch(i){case"compositionend":return Fm(s);case"keypress":return s.which!==32?null:(Im=!0,Lm);case"textInput":return i=s.data,i===Lm&&Im?null:i;default:return null}}function _M(i,s){if(Qs)return i==="compositionend"||!sf&&Um(i,s)?(i=Am(),xl=Qu=Ur=null,Qs=!1,i):null;switch(i){case"paste":return null;case"keypress":if(!(s.ctrlKey||s.altKey||s.metaKey)||s.ctrlKey&&s.altKey){if(s.char&&1<s.char.length)return s.char;if(s.which)return String.fromCharCode(s.which)}return null;case"compositionend":return Nm&&s.locale!=="ko"?null:s.data;default:return null}}var xM={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Om(i){var s=i&&i.nodeName&&i.nodeName.toLowerCase();return s==="input"?!!xM[i.type]:s==="textarea"}function km(i,s,l,u){ve(u),s=Al(s,"onChange"),0<s.length&&(l=new Ju("onChange","change",null,l,u),i.push({event:l,listeners:s}))}var _a=null,xa=null;function yM(i){ng(i,0)}function El(i){var s=io(i);if(rt(s))return i}function SM(i,s){if(i==="change")return s}var zm=!1;if(f){var of;if(f){var af="oninput"in document;if(!af){var Bm=document.createElement("div");Bm.setAttribute("oninput","return;"),af=typeof Bm.oninput=="function"}of=af}else of=!1;zm=of&&(!document.documentMode||9<document.documentMode)}function Vm(){_a&&(_a.detachEvent("onpropertychange",Gm),xa=_a=null)}function Gm(i){if(i.propertyName==="value"&&El(xa)){var s=[];km(s,xa,i,at(i)),ht(yM,s)}}function MM(i,s,l){i==="focusin"?(Vm(),_a=s,xa=l,_a.attachEvent("onpropertychange",Gm)):i==="focusout"&&Vm()}function EM(i){if(i==="selectionchange"||i==="keyup"||i==="keydown")return El(xa)}function wM(i,s){if(i==="click")return El(s)}function bM(i,s){if(i==="input"||i==="change")return El(s)}function TM(i,s){return i===s&&(i!==0||1/i===1/s)||i!==i&&s!==s}var yi=typeof Object.is=="function"?Object.is:TM;function ya(i,s){if(yi(i,s))return!0;if(typeof i!="object"||i===null||typeof s!="object"||s===null)return!1;var l=Object.keys(i),u=Object.keys(s);if(l.length!==u.length)return!1;for(u=0;u<l.length;u++){var p=l[u];if(!h.call(s,p)||!yi(i[p],s[p]))return!1}return!0}function Hm(i){for(;i&&i.firstChild;)i=i.firstChild;return i}function Wm(i,s){var l=Hm(i);i=0;for(var u;l;){if(l.nodeType===3){if(u=i+l.textContent.length,i<=s&&u>=s)return{node:l,offset:s-i};i=u}e:{for(;l;){if(l.nextSibling){l=l.nextSibling;break e}l=l.parentNode}l=void 0}l=Hm(l)}}function jm(i,s){return i&&s?i===s?!0:i&&i.nodeType===3?!1:s&&s.nodeType===3?jm(i,s.parentNode):"contains"in i?i.contains(s):i.compareDocumentPosition?!!(i.compareDocumentPosition(s)&16):!1:!1}function Xm(){for(var i=window,s=Be();s instanceof i.HTMLIFrameElement;){try{var l=typeof s.contentWindow.location.href=="string"}catch{l=!1}if(l)i=s.contentWindow;else break;s=Be(i.document)}return s}function lf(i){var s=i&&i.nodeName&&i.nodeName.toLowerCase();return s&&(s==="input"&&(i.type==="text"||i.type==="search"||i.type==="tel"||i.type==="url"||i.type==="password")||s==="textarea"||i.contentEditable==="true")}function AM(i){var s=Xm(),l=i.focusedElem,u=i.selectionRange;if(s!==l&&l&&l.ownerDocument&&jm(l.ownerDocument.documentElement,l)){if(u!==null&&lf(l)){if(s=u.start,i=u.end,i===void 0&&(i=s),"selectionStart"in l)l.selectionStart=s,l.selectionEnd=Math.min(i,l.value.length);else if(i=(s=l.ownerDocument||document)&&s.defaultView||window,i.getSelection){i=i.getSelection();var p=l.textContent.length,S=Math.min(u.start,p);u=u.end===void 0?S:Math.min(u.end,p),!i.extend&&S>u&&(p=u,u=S,S=p),p=Wm(l,S);var R=Wm(l,u);p&&R&&(i.rangeCount!==1||i.anchorNode!==p.node||i.anchorOffset!==p.offset||i.focusNode!==R.node||i.focusOffset!==R.offset)&&(s=s.createRange(),s.setStart(p.node,p.offset),i.removeAllRanges(),S>u?(i.addRange(s),i.extend(R.node,R.offset)):(s.setEnd(R.node,R.offset),i.addRange(s)))}}for(s=[],i=l;i=i.parentNode;)i.nodeType===1&&s.push({element:i,left:i.scrollLeft,top:i.scrollTop});for(typeof l.focus=="function"&&l.focus(),l=0;l<s.length;l++)i=s[l],i.element.scrollLeft=i.left,i.element.scrollTop=i.top}}var RM=f&&"documentMode"in document&&11>=document.documentMode,Js=null,cf=null,Sa=null,uf=!1;function $m(i,s,l){var u=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;uf||Js==null||Js!==Be(u)||(u=Js,"selectionStart"in u&&lf(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),Sa&&ya(Sa,u)||(Sa=u,u=Al(cf,"onSelect"),0<u.length&&(s=new Ju("onSelect","select",null,s,l),i.push({event:s,listeners:u}),s.target=Js)))}function wl(i,s){var l={};return l[i.toLowerCase()]=s.toLowerCase(),l["Webkit"+i]="webkit"+s,l["Moz"+i]="moz"+s,l}var eo={animationend:wl("Animation","AnimationEnd"),animationiteration:wl("Animation","AnimationIteration"),animationstart:wl("Animation","AnimationStart"),transitionend:wl("Transition","TransitionEnd")},ff={},Ym={};f&&(Ym=document.createElement("div").style,"AnimationEvent"in window||(delete eo.animationend.animation,delete eo.animationiteration.animation,delete eo.animationstart.animation),"TransitionEvent"in window||delete eo.transitionend.transition);function bl(i){if(ff[i])return ff[i];if(!eo[i])return i;var s=eo[i],l;for(l in s)if(s.hasOwnProperty(l)&&l in Ym)return ff[i]=s[l];return i}var Km=bl("animationend"),qm=bl("animationiteration"),Zm=bl("animationstart"),Qm=bl("transitionend"),Jm=new Map,eg="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Fr(i,s){Jm.set(i,s),a(s,[i])}for(var df=0;df<eg.length;df++){var hf=eg[df],CM=hf.toLowerCase(),PM=hf[0].toUpperCase()+hf.slice(1);Fr(CM,"on"+PM)}Fr(Km,"onAnimationEnd"),Fr(qm,"onAnimationIteration"),Fr(Zm,"onAnimationStart"),Fr("dblclick","onDoubleClick"),Fr("focusin","onFocus"),Fr("focusout","onBlur"),Fr(Qm,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),a("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),a("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),a("onBeforeInput",["compositionend","keypress","textInput","paste"]),a("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ma="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),DM=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ma));function tg(i,s,l){var u=i.type||"unknown-event";i.currentTarget=l,hl(u,s,void 0,i),i.currentTarget=null}function ng(i,s){s=(s&4)!==0;for(var l=0;l<i.length;l++){var u=i[l],p=u.event;u=u.listeners;e:{var S=void 0;if(s)for(var R=u.length-1;0<=R;R--){var H=u[R],K=H.instance,de=H.currentTarget;if(H=H.listener,K!==S&&p.isPropagationStopped())break e;tg(p,H,de),S=K}else for(R=0;R<u.length;R++){if(H=u[R],K=H.instance,de=H.currentTarget,H=H.listener,K!==S&&p.isPropagationStopped())break e;tg(p,H,de),S=K}}}if(gs)throw i=Ys,gs=!1,Ys=null,i}function Yt(i,s){var l=s[Sf];l===void 0&&(l=s[Sf]=new Set);var u=i+"__bubble";l.has(u)||(ig(s,i,2,!1),l.add(u))}function pf(i,s,l){var u=0;s&&(u|=4),ig(l,i,u,s)}var Tl="_reactListening"+Math.random().toString(36).slice(2);function Ea(i){if(!i[Tl]){i[Tl]=!0,r.forEach(function(l){l!=="selectionchange"&&(DM.has(l)||pf(l,!1,i),pf(l,!0,i))});var s=i.nodeType===9?i:i.ownerDocument;s===null||s[Tl]||(s[Tl]=!0,pf("selectionchange",!1,s))}}function ig(i,s,l,u){switch(Tm(s)){case 1:var p=jS;break;case 4:p=XS;break;default:p=qu}l=p.bind(null,s,l,i),p=void 0,!Dt||s!=="touchstart"&&s!=="touchmove"&&s!=="wheel"||(p=!0),u?p!==void 0?i.addEventListener(s,l,{capture:!0,passive:p}):i.addEventListener(s,l,!0):p!==void 0?i.addEventListener(s,l,{passive:p}):i.addEventListener(s,l,!1)}function mf(i,s,l,u,p){var S=u;if((s&1)===0&&(s&2)===0&&u!==null)e:for(;;){if(u===null)return;var R=u.tag;if(R===3||R===4){var H=u.stateNode.containerInfo;if(H===p||H.nodeType===8&&H.parentNode===p)break;if(R===4)for(R=u.return;R!==null;){var K=R.tag;if((K===3||K===4)&&(K=R.stateNode.containerInfo,K===p||K.nodeType===8&&K.parentNode===p))return;R=R.return}for(;H!==null;){if(R=xs(H),R===null)return;if(K=R.tag,K===5||K===6){u=S=R;continue e}H=H.parentNode}}u=u.return}ht(function(){var de=S,be=at(l),Re=[];e:{var we=Jm.get(i);if(we!==void 0){var je=Ju,Ye=i;switch(i){case"keypress":if(yl(l)===0)break e;case"keydown":case"keyup":je=aM;break;case"focusin":Ye="focus",je=nf;break;case"focusout":Ye="blur",je=nf;break;case"beforeblur":case"afterblur":je=nf;break;case"click":if(l.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":je=Cm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":je=KS;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":je=uM;break;case Km:case qm:case Zm:je=QS;break;case Qm:je=dM;break;case"scroll":je=$S;break;case"wheel":je=pM;break;case"copy":case"cut":case"paste":je=eM;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":je=Dm}var Ze=(s&4)!==0,rn=!Ze&&i==="scroll",se=Ze?we!==null?we+"Capture":null:we;Ze=[];for(var J=de,ue;J!==null;){ue=J;var De=ue.stateNode;if(ue.tag===5&&De!==null&&(ue=De,se!==null&&(De=Ht(J,se),De!=null&&Ze.push(wa(J,De,ue)))),rn)break;J=J.return}0<Ze.length&&(we=new je(we,Ye,null,l,be),Re.push({event:we,listeners:Ze}))}}if((s&7)===0){e:{if(we=i==="mouseover"||i==="pointerover",je=i==="mouseout"||i==="pointerout",we&&l!==Pe&&(Ye=l.relatedTarget||l.fromElement)&&(xs(Ye)||Ye[sr]))break e;if((je||we)&&(we=be.window===be?be:(we=be.ownerDocument)?we.defaultView||we.parentWindow:window,je?(Ye=l.relatedTarget||l.toElement,je=de,Ye=Ye?xs(Ye):null,Ye!==null&&(rn=Ui(Ye),Ye!==rn||Ye.tag!==5&&Ye.tag!==6)&&(Ye=null)):(je=null,Ye=de),je!==Ye)){if(Ze=Cm,De="onMouseLeave",se="onMouseEnter",J="mouse",(i==="pointerout"||i==="pointerover")&&(Ze=Dm,De="onPointerLeave",se="onPointerEnter",J="pointer"),rn=je==null?we:io(je),ue=Ye==null?we:io(Ye),we=new Ze(De,J+"leave",je,l,be),we.target=rn,we.relatedTarget=ue,De=null,xs(be)===de&&(Ze=new Ze(se,J+"enter",Ye,l,be),Ze.target=ue,Ze.relatedTarget=rn,De=Ze),rn=De,je&&Ye)t:{for(Ze=je,se=Ye,J=0,ue=Ze;ue;ue=to(ue))J++;for(ue=0,De=se;De;De=to(De))ue++;for(;0<J-ue;)Ze=to(Ze),J--;for(;0<ue-J;)se=to(se),ue--;for(;J--;){if(Ze===se||se!==null&&Ze===se.alternate)break t;Ze=to(Ze),se=to(se)}Ze=null}else Ze=null;je!==null&&rg(Re,we,je,Ze,!1),Ye!==null&&rn!==null&&rg(Re,rn,Ye,Ze,!0)}}e:{if(we=de?io(de):window,je=we.nodeName&&we.nodeName.toLowerCase(),je==="select"||je==="input"&&we.type==="file")var et=SM;else if(Om(we))if(zm)et=bM;else{et=EM;var nt=MM}else(je=we.nodeName)&&je.toLowerCase()==="input"&&(we.type==="checkbox"||we.type==="radio")&&(et=wM);if(et&&(et=et(i,de))){km(Re,et,l,be);break e}nt&&nt(i,we,de),i==="focusout"&&(nt=we._wrapperState)&&nt.controlled&&we.type==="number"&&Wt(we,"number",we.value)}switch(nt=de?io(de):window,i){case"focusin":(Om(nt)||nt.contentEditable==="true")&&(Js=nt,cf=de,Sa=null);break;case"focusout":Sa=cf=Js=null;break;case"mousedown":uf=!0;break;case"contextmenu":case"mouseup":case"dragend":uf=!1,$m(Re,l,be);break;case"selectionchange":if(RM)break;case"keydown":case"keyup":$m(Re,l,be)}var it;if(sf)e:{switch(i){case"compositionstart":var ct="onCompositionStart";break e;case"compositionend":ct="onCompositionEnd";break e;case"compositionupdate":ct="onCompositionUpdate";break e}ct=void 0}else Qs?Um(i,l)&&(ct="onCompositionEnd"):i==="keydown"&&l.keyCode===229&&(ct="onCompositionStart");ct&&(Nm&&l.locale!=="ko"&&(Qs||ct!=="onCompositionStart"?ct==="onCompositionEnd"&&Qs&&(it=Am()):(Ur=be,Qu="value"in Ur?Ur.value:Ur.textContent,Qs=!0)),nt=Al(de,ct),0<nt.length&&(ct=new Pm(ct,i,null,l,be),Re.push({event:ct,listeners:nt}),it?ct.data=it:(it=Fm(l),it!==null&&(ct.data=it)))),(it=gM?vM(i,l):_M(i,l))&&(de=Al(de,"onBeforeInput"),0<de.length&&(be=new Pm("onBeforeInput","beforeinput",null,l,be),Re.push({event:be,listeners:de}),be.data=it))}ng(Re,s)})}function wa(i,s,l){return{instance:i,listener:s,currentTarget:l}}function Al(i,s){for(var l=s+"Capture",u=[];i!==null;){var p=i,S=p.stateNode;p.tag===5&&S!==null&&(p=S,S=Ht(i,l),S!=null&&u.unshift(wa(i,S,p)),S=Ht(i,s),S!=null&&u.push(wa(i,S,p))),i=i.return}return u}function to(i){if(i===null)return null;do i=i.return;while(i&&i.tag!==5);return i||null}function rg(i,s,l,u,p){for(var S=s._reactName,R=[];l!==null&&l!==u;){var H=l,K=H.alternate,de=H.stateNode;if(K!==null&&K===u)break;H.tag===5&&de!==null&&(H=de,p?(K=Ht(l,S),K!=null&&R.unshift(wa(l,K,H))):p||(K=Ht(l,S),K!=null&&R.push(wa(l,K,H)))),l=l.return}R.length!==0&&i.push({event:s,listeners:R})}var NM=/\r\n?/g,LM=/\u0000|\uFFFD/g;function sg(i){return(typeof i=="string"?i:""+i).replace(NM,`
`).replace(LM,"")}function Rl(i,s,l){if(s=sg(s),sg(i)!==s&&l)throw Error(t(425))}function Cl(){}var gf=null,vf=null;function _f(i,s){return i==="textarea"||i==="noscript"||typeof s.children=="string"||typeof s.children=="number"||typeof s.dangerouslySetInnerHTML=="object"&&s.dangerouslySetInnerHTML!==null&&s.dangerouslySetInnerHTML.__html!=null}var xf=typeof setTimeout=="function"?setTimeout:void 0,IM=typeof clearTimeout=="function"?clearTimeout:void 0,og=typeof Promise=="function"?Promise:void 0,UM=typeof queueMicrotask=="function"?queueMicrotask:typeof og<"u"?function(i){return og.resolve(null).then(i).catch(FM)}:xf;function FM(i){setTimeout(function(){throw i})}function yf(i,s){var l=s,u=0;do{var p=l.nextSibling;if(i.removeChild(l),p&&p.nodeType===8)if(l=p.data,l==="/$"){if(u===0){i.removeChild(p),pa(s);return}u--}else l!=="$"&&l!=="$?"&&l!=="$!"||u++;l=p}while(l);pa(s)}function Or(i){for(;i!=null;i=i.nextSibling){var s=i.nodeType;if(s===1||s===3)break;if(s===8){if(s=i.data,s==="$"||s==="$!"||s==="$?")break;if(s==="/$")return null}}return i}function ag(i){i=i.previousSibling;for(var s=0;i;){if(i.nodeType===8){var l=i.data;if(l==="$"||l==="$!"||l==="$?"){if(s===0)return i;s--}else l==="/$"&&s++}i=i.previousSibling}return null}var no=Math.random().toString(36).slice(2),Oi="__reactFiber$"+no,ba="__reactProps$"+no,sr="__reactContainer$"+no,Sf="__reactEvents$"+no,OM="__reactListeners$"+no,kM="__reactHandles$"+no;function xs(i){var s=i[Oi];if(s)return s;for(var l=i.parentNode;l;){if(s=l[sr]||l[Oi]){if(l=s.alternate,s.child!==null||l!==null&&l.child!==null)for(i=ag(i);i!==null;){if(l=i[Oi])return l;i=ag(i)}return s}i=l,l=i.parentNode}return null}function Ta(i){return i=i[Oi]||i[sr],!i||i.tag!==5&&i.tag!==6&&i.tag!==13&&i.tag!==3?null:i}function io(i){if(i.tag===5||i.tag===6)return i.stateNode;throw Error(t(33))}function Pl(i){return i[ba]||null}var Mf=[],ro=-1;function kr(i){return{current:i}}function Kt(i){0>ro||(i.current=Mf[ro],Mf[ro]=null,ro--)}function Xt(i,s){ro++,Mf[ro]=i.current,i.current=s}var zr={},bn=kr(zr),Gn=kr(!1),ys=zr;function so(i,s){var l=i.type.contextTypes;if(!l)return zr;var u=i.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===s)return u.__reactInternalMemoizedMaskedChildContext;var p={},S;for(S in l)p[S]=s[S];return u&&(i=i.stateNode,i.__reactInternalMemoizedUnmaskedChildContext=s,i.__reactInternalMemoizedMaskedChildContext=p),p}function Hn(i){return i=i.childContextTypes,i!=null}function Dl(){Kt(Gn),Kt(bn)}function lg(i,s,l){if(bn.current!==zr)throw Error(t(168));Xt(bn,s),Xt(Gn,l)}function cg(i,s,l){var u=i.stateNode;if(s=s.childContextTypes,typeof u.getChildContext!="function")return l;u=u.getChildContext();for(var p in u)if(!(p in s))throw Error(t(108,he(i)||"Unknown",p));return $({},l,u)}function Nl(i){return i=(i=i.stateNode)&&i.__reactInternalMemoizedMergedChildContext||zr,ys=bn.current,Xt(bn,i),Xt(Gn,Gn.current),!0}function ug(i,s,l){var u=i.stateNode;if(!u)throw Error(t(169));l?(i=cg(i,s,ys),u.__reactInternalMemoizedMergedChildContext=i,Kt(Gn),Kt(bn),Xt(bn,i)):Kt(Gn),Xt(Gn,l)}var or=null,Ll=!1,Ef=!1;function fg(i){or===null?or=[i]:or.push(i)}function zM(i){Ll=!0,fg(i)}function Br(){if(!Ef&&or!==null){Ef=!0;var i=0,s=St;try{var l=or;for(St=1;i<l.length;i++){var u=l[i];do u=u(!0);while(u!==null)}or=null,Ll=!1}catch(p){throw or!==null&&(or=or.slice(i+1)),pl(ca,Br),p}finally{St=s,Ef=!1}}return null}var oo=[],ao=0,Il=null,Ul=0,si=[],oi=0,Ss=null,ar=1,lr="";function Ms(i,s){oo[ao++]=Ul,oo[ao++]=Il,Il=i,Ul=s}function dg(i,s,l){si[oi++]=ar,si[oi++]=lr,si[oi++]=Ss,Ss=i;var u=ar;i=lr;var p=32-Ie(u)-1;u&=~(1<<p),l+=1;var S=32-Ie(s)+p;if(30<S){var R=p-p%5;S=(u&(1<<R)-1).toString(32),u>>=R,p-=R,ar=1<<32-Ie(s)+p|l<<p|u,lr=S+i}else ar=1<<S|l<<p|u,lr=i}function wf(i){i.return!==null&&(Ms(i,1),dg(i,1,0))}function bf(i){for(;i===Il;)Il=oo[--ao],oo[ao]=null,Ul=oo[--ao],oo[ao]=null;for(;i===Ss;)Ss=si[--oi],si[oi]=null,lr=si[--oi],si[oi]=null,ar=si[--oi],si[oi]=null}var Zn=null,Qn=null,Zt=!1,Si=null;function hg(i,s){var l=ui(5,null,null,0);l.elementType="DELETED",l.stateNode=s,l.return=i,s=i.deletions,s===null?(i.deletions=[l],i.flags|=16):s.push(l)}function pg(i,s){switch(i.tag){case 5:var l=i.type;return s=s.nodeType!==1||l.toLowerCase()!==s.nodeName.toLowerCase()?null:s,s!==null?(i.stateNode=s,Zn=i,Qn=Or(s.firstChild),!0):!1;case 6:return s=i.pendingProps===""||s.nodeType!==3?null:s,s!==null?(i.stateNode=s,Zn=i,Qn=null,!0):!1;case 13:return s=s.nodeType!==8?null:s,s!==null?(l=Ss!==null?{id:ar,overflow:lr}:null,i.memoizedState={dehydrated:s,treeContext:l,retryLane:1073741824},l=ui(18,null,null,0),l.stateNode=s,l.return=i,i.child=l,Zn=i,Qn=null,!0):!1;default:return!1}}function Tf(i){return(i.mode&1)!==0&&(i.flags&128)===0}function Af(i){if(Zt){var s=Qn;if(s){var l=s;if(!pg(i,s)){if(Tf(i))throw Error(t(418));s=Or(l.nextSibling);var u=Zn;s&&pg(i,s)?hg(u,l):(i.flags=i.flags&-4097|2,Zt=!1,Zn=i)}}else{if(Tf(i))throw Error(t(418));i.flags=i.flags&-4097|2,Zt=!1,Zn=i}}}function mg(i){for(i=i.return;i!==null&&i.tag!==5&&i.tag!==3&&i.tag!==13;)i=i.return;Zn=i}function Fl(i){if(i!==Zn)return!1;if(!Zt)return mg(i),Zt=!0,!1;var s;if((s=i.tag!==3)&&!(s=i.tag!==5)&&(s=i.type,s=s!=="head"&&s!=="body"&&!_f(i.type,i.memoizedProps)),s&&(s=Qn)){if(Tf(i))throw gg(),Error(t(418));for(;s;)hg(i,s),s=Or(s.nextSibling)}if(mg(i),i.tag===13){if(i=i.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(t(317));e:{for(i=i.nextSibling,s=0;i;){if(i.nodeType===8){var l=i.data;if(l==="/$"){if(s===0){Qn=Or(i.nextSibling);break e}s--}else l!=="$"&&l!=="$!"&&l!=="$?"||s++}i=i.nextSibling}Qn=null}}else Qn=Zn?Or(i.stateNode.nextSibling):null;return!0}function gg(){for(var i=Qn;i;)i=Or(i.nextSibling)}function lo(){Qn=Zn=null,Zt=!1}function Rf(i){Si===null?Si=[i]:Si.push(i)}var BM=C.ReactCurrentBatchConfig;function Aa(i,s,l){if(i=l.ref,i!==null&&typeof i!="function"&&typeof i!="object"){if(l._owner){if(l=l._owner,l){if(l.tag!==1)throw Error(t(309));var u=l.stateNode}if(!u)throw Error(t(147,i));var p=u,S=""+i;return s!==null&&s.ref!==null&&typeof s.ref=="function"&&s.ref._stringRef===S?s.ref:(s=function(R){var H=p.refs;R===null?delete H[S]:H[S]=R},s._stringRef=S,s)}if(typeof i!="string")throw Error(t(284));if(!l._owner)throw Error(t(290,i))}return i}function Ol(i,s){throw i=Object.prototype.toString.call(s),Error(t(31,i==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":i))}function vg(i){var s=i._init;return s(i._payload)}function _g(i){function s(se,J){if(i){var ue=se.deletions;ue===null?(se.deletions=[J],se.flags|=16):ue.push(J)}}function l(se,J){if(!i)return null;for(;J!==null;)s(se,J),J=J.sibling;return null}function u(se,J){for(se=new Map;J!==null;)J.key!==null?se.set(J.key,J):se.set(J.index,J),J=J.sibling;return se}function p(se,J){return se=Yr(se,J),se.index=0,se.sibling=null,se}function S(se,J,ue){return se.index=ue,i?(ue=se.alternate,ue!==null?(ue=ue.index,ue<J?(se.flags|=2,J):ue):(se.flags|=2,J)):(se.flags|=1048576,J)}function R(se){return i&&se.alternate===null&&(se.flags|=2),se}function H(se,J,ue,De){return J===null||J.tag!==6?(J=xd(ue,se.mode,De),J.return=se,J):(J=p(J,ue),J.return=se,J)}function K(se,J,ue,De){var et=ue.type;return et===F?be(se,J,ue.props.children,De,ue.key):J!==null&&(J.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===Y&&vg(et)===J.type)?(De=p(J,ue.props),De.ref=Aa(se,J,ue),De.return=se,De):(De=ac(ue.type,ue.key,ue.props,null,se.mode,De),De.ref=Aa(se,J,ue),De.return=se,De)}function de(se,J,ue,De){return J===null||J.tag!==4||J.stateNode.containerInfo!==ue.containerInfo||J.stateNode.implementation!==ue.implementation?(J=yd(ue,se.mode,De),J.return=se,J):(J=p(J,ue.children||[]),J.return=se,J)}function be(se,J,ue,De,et){return J===null||J.tag!==7?(J=Ps(ue,se.mode,De,et),J.return=se,J):(J=p(J,ue),J.return=se,J)}function Re(se,J,ue){if(typeof J=="string"&&J!==""||typeof J=="number")return J=xd(""+J,se.mode,ue),J.return=se,J;if(typeof J=="object"&&J!==null){switch(J.$$typeof){case k:return ue=ac(J.type,J.key,J.props,null,se.mode,ue),ue.ref=Aa(se,null,J),ue.return=se,ue;case I:return J=yd(J,se.mode,ue),J.return=se,J;case Y:var De=J._init;return Re(se,De(J._payload),ue)}if(Q(J)||z(J))return J=Ps(J,se.mode,ue,null),J.return=se,J;Ol(se,J)}return null}function we(se,J,ue,De){var et=J!==null?J.key:null;if(typeof ue=="string"&&ue!==""||typeof ue=="number")return et!==null?null:H(se,J,""+ue,De);if(typeof ue=="object"&&ue!==null){switch(ue.$$typeof){case k:return ue.key===et?K(se,J,ue,De):null;case I:return ue.key===et?de(se,J,ue,De):null;case Y:return et=ue._init,we(se,J,et(ue._payload),De)}if(Q(ue)||z(ue))return et!==null?null:be(se,J,ue,De,null);Ol(se,ue)}return null}function je(se,J,ue,De,et){if(typeof De=="string"&&De!==""||typeof De=="number")return se=se.get(ue)||null,H(J,se,""+De,et);if(typeof De=="object"&&De!==null){switch(De.$$typeof){case k:return se=se.get(De.key===null?ue:De.key)||null,K(J,se,De,et);case I:return se=se.get(De.key===null?ue:De.key)||null,de(J,se,De,et);case Y:var nt=De._init;return je(se,J,ue,nt(De._payload),et)}if(Q(De)||z(De))return se=se.get(ue)||null,be(J,se,De,et,null);Ol(J,De)}return null}function Ye(se,J,ue,De){for(var et=null,nt=null,it=J,ct=J=0,_n=null;it!==null&&ct<ue.length;ct++){it.index>ct?(_n=it,it=null):_n=it.sibling;var Nt=we(se,it,ue[ct],De);if(Nt===null){it===null&&(it=_n);break}i&&it&&Nt.alternate===null&&s(se,it),J=S(Nt,J,ct),nt===null?et=Nt:nt.sibling=Nt,nt=Nt,it=_n}if(ct===ue.length)return l(se,it),Zt&&Ms(se,ct),et;if(it===null){for(;ct<ue.length;ct++)it=Re(se,ue[ct],De),it!==null&&(J=S(it,J,ct),nt===null?et=it:nt.sibling=it,nt=it);return Zt&&Ms(se,ct),et}for(it=u(se,it);ct<ue.length;ct++)_n=je(it,se,ct,ue[ct],De),_n!==null&&(i&&_n.alternate!==null&&it.delete(_n.key===null?ct:_n.key),J=S(_n,J,ct),nt===null?et=_n:nt.sibling=_n,nt=_n);return i&&it.forEach(function(Kr){return s(se,Kr)}),Zt&&Ms(se,ct),et}function Ze(se,J,ue,De){var et=z(ue);if(typeof et!="function")throw Error(t(150));if(ue=et.call(ue),ue==null)throw Error(t(151));for(var nt=et=null,it=J,ct=J=0,_n=null,Nt=ue.next();it!==null&&!Nt.done;ct++,Nt=ue.next()){it.index>ct?(_n=it,it=null):_n=it.sibling;var Kr=we(se,it,Nt.value,De);if(Kr===null){it===null&&(it=_n);break}i&&it&&Kr.alternate===null&&s(se,it),J=S(Kr,J,ct),nt===null?et=Kr:nt.sibling=Kr,nt=Kr,it=_n}if(Nt.done)return l(se,it),Zt&&Ms(se,ct),et;if(it===null){for(;!Nt.done;ct++,Nt=ue.next())Nt=Re(se,Nt.value,De),Nt!==null&&(J=S(Nt,J,ct),nt===null?et=Nt:nt.sibling=Nt,nt=Nt);return Zt&&Ms(se,ct),et}for(it=u(se,it);!Nt.done;ct++,Nt=ue.next())Nt=je(it,se,ct,Nt.value,De),Nt!==null&&(i&&Nt.alternate!==null&&it.delete(Nt.key===null?ct:Nt.key),J=S(Nt,J,ct),nt===null?et=Nt:nt.sibling=Nt,nt=Nt);return i&&it.forEach(function(xE){return s(se,xE)}),Zt&&Ms(se,ct),et}function rn(se,J,ue,De){if(typeof ue=="object"&&ue!==null&&ue.type===F&&ue.key===null&&(ue=ue.props.children),typeof ue=="object"&&ue!==null){switch(ue.$$typeof){case k:e:{for(var et=ue.key,nt=J;nt!==null;){if(nt.key===et){if(et=ue.type,et===F){if(nt.tag===7){l(se,nt.sibling),J=p(nt,ue.props.children),J.return=se,se=J;break e}}else if(nt.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===Y&&vg(et)===nt.type){l(se,nt.sibling),J=p(nt,ue.props),J.ref=Aa(se,nt,ue),J.return=se,se=J;break e}l(se,nt);break}else s(se,nt);nt=nt.sibling}ue.type===F?(J=Ps(ue.props.children,se.mode,De,ue.key),J.return=se,se=J):(De=ac(ue.type,ue.key,ue.props,null,se.mode,De),De.ref=Aa(se,J,ue),De.return=se,se=De)}return R(se);case I:e:{for(nt=ue.key;J!==null;){if(J.key===nt)if(J.tag===4&&J.stateNode.containerInfo===ue.containerInfo&&J.stateNode.implementation===ue.implementation){l(se,J.sibling),J=p(J,ue.children||[]),J.return=se,se=J;break e}else{l(se,J);break}else s(se,J);J=J.sibling}J=yd(ue,se.mode,De),J.return=se,se=J}return R(se);case Y:return nt=ue._init,rn(se,J,nt(ue._payload),De)}if(Q(ue))return Ye(se,J,ue,De);if(z(ue))return Ze(se,J,ue,De);Ol(se,ue)}return typeof ue=="string"&&ue!==""||typeof ue=="number"?(ue=""+ue,J!==null&&J.tag===6?(l(se,J.sibling),J=p(J,ue),J.return=se,se=J):(l(se,J),J=xd(ue,se.mode,De),J.return=se,se=J),R(se)):l(se,J)}return rn}var co=_g(!0),xg=_g(!1),kl=kr(null),zl=null,uo=null,Cf=null;function Pf(){Cf=uo=zl=null}function Df(i){var s=kl.current;Kt(kl),i._currentValue=s}function Nf(i,s,l){for(;i!==null;){var u=i.alternate;if((i.childLanes&s)!==s?(i.childLanes|=s,u!==null&&(u.childLanes|=s)):u!==null&&(u.childLanes&s)!==s&&(u.childLanes|=s),i===l)break;i=i.return}}function fo(i,s){zl=i,Cf=uo=null,i=i.dependencies,i!==null&&i.firstContext!==null&&((i.lanes&s)!==0&&(Wn=!0),i.firstContext=null)}function ai(i){var s=i._currentValue;if(Cf!==i)if(i={context:i,memoizedValue:s,next:null},uo===null){if(zl===null)throw Error(t(308));uo=i,zl.dependencies={lanes:0,firstContext:i}}else uo=uo.next=i;return s}var Es=null;function Lf(i){Es===null?Es=[i]:Es.push(i)}function yg(i,s,l,u){var p=s.interleaved;return p===null?(l.next=l,Lf(s)):(l.next=p.next,p.next=l),s.interleaved=l,cr(i,u)}function cr(i,s){i.lanes|=s;var l=i.alternate;for(l!==null&&(l.lanes|=s),l=i,i=i.return;i!==null;)i.childLanes|=s,l=i.alternate,l!==null&&(l.childLanes|=s),l=i,i=i.return;return l.tag===3?l.stateNode:null}var Vr=!1;function If(i){i.updateQueue={baseState:i.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Sg(i,s){i=i.updateQueue,s.updateQueue===i&&(s.updateQueue={baseState:i.baseState,firstBaseUpdate:i.firstBaseUpdate,lastBaseUpdate:i.lastBaseUpdate,shared:i.shared,effects:i.effects})}function ur(i,s){return{eventTime:i,lane:s,tag:0,payload:null,callback:null,next:null}}function Gr(i,s,l){var u=i.updateQueue;if(u===null)return null;if(u=u.shared,(Rt&2)!==0){var p=u.pending;return p===null?s.next=s:(s.next=p.next,p.next=s),u.pending=s,cr(i,l)}return p=u.interleaved,p===null?(s.next=s,Lf(u)):(s.next=p.next,p.next=s),u.interleaved=s,cr(i,l)}function Bl(i,s,l){if(s=s.updateQueue,s!==null&&(s=s.shared,(l&4194240)!==0)){var u=s.lanes;u&=i.pendingLanes,l|=u,s.lanes=l,Vn(i,l)}}function Mg(i,s){var l=i.updateQueue,u=i.alternate;if(u!==null&&(u=u.updateQueue,l===u)){var p=null,S=null;if(l=l.firstBaseUpdate,l!==null){do{var R={eventTime:l.eventTime,lane:l.lane,tag:l.tag,payload:l.payload,callback:l.callback,next:null};S===null?p=S=R:S=S.next=R,l=l.next}while(l!==null);S===null?p=S=s:S=S.next=s}else p=S=s;l={baseState:u.baseState,firstBaseUpdate:p,lastBaseUpdate:S,shared:u.shared,effects:u.effects},i.updateQueue=l;return}i=l.lastBaseUpdate,i===null?l.firstBaseUpdate=s:i.next=s,l.lastBaseUpdate=s}function Vl(i,s,l,u){var p=i.updateQueue;Vr=!1;var S=p.firstBaseUpdate,R=p.lastBaseUpdate,H=p.shared.pending;if(H!==null){p.shared.pending=null;var K=H,de=K.next;K.next=null,R===null?S=de:R.next=de,R=K;var be=i.alternate;be!==null&&(be=be.updateQueue,H=be.lastBaseUpdate,H!==R&&(H===null?be.firstBaseUpdate=de:H.next=de,be.lastBaseUpdate=K))}if(S!==null){var Re=p.baseState;R=0,be=de=K=null,H=S;do{var we=H.lane,je=H.eventTime;if((u&we)===we){be!==null&&(be=be.next={eventTime:je,lane:0,tag:H.tag,payload:H.payload,callback:H.callback,next:null});e:{var Ye=i,Ze=H;switch(we=s,je=l,Ze.tag){case 1:if(Ye=Ze.payload,typeof Ye=="function"){Re=Ye.call(je,Re,we);break e}Re=Ye;break e;case 3:Ye.flags=Ye.flags&-65537|128;case 0:if(Ye=Ze.payload,we=typeof Ye=="function"?Ye.call(je,Re,we):Ye,we==null)break e;Re=$({},Re,we);break e;case 2:Vr=!0}}H.callback!==null&&H.lane!==0&&(i.flags|=64,we=p.effects,we===null?p.effects=[H]:we.push(H))}else je={eventTime:je,lane:we,tag:H.tag,payload:H.payload,callback:H.callback,next:null},be===null?(de=be=je,K=Re):be=be.next=je,R|=we;if(H=H.next,H===null){if(H=p.shared.pending,H===null)break;we=H,H=we.next,we.next=null,p.lastBaseUpdate=we,p.shared.pending=null}}while(!0);if(be===null&&(K=Re),p.baseState=K,p.firstBaseUpdate=de,p.lastBaseUpdate=be,s=p.shared.interleaved,s!==null){p=s;do R|=p.lane,p=p.next;while(p!==s)}else S===null&&(p.shared.lanes=0);Ts|=R,i.lanes=R,i.memoizedState=Re}}function Eg(i,s,l){if(i=s.effects,s.effects=null,i!==null)for(s=0;s<i.length;s++){var u=i[s],p=u.callback;if(p!==null){if(u.callback=null,u=l,typeof p!="function")throw Error(t(191,p));p.call(u)}}}var Ra={},ki=kr(Ra),Ca=kr(Ra),Pa=kr(Ra);function ws(i){if(i===Ra)throw Error(t(174));return i}function Uf(i,s){switch(Xt(Pa,s),Xt(Ca,i),Xt(ki,Ra),i=s.nodeType,i){case 9:case 11:s=(s=s.documentElement)?s.namespaceURI:A(null,"");break;default:i=i===8?s.parentNode:s,s=i.namespaceURI||null,i=i.tagName,s=A(s,i)}Kt(ki),Xt(ki,s)}function ho(){Kt(ki),Kt(Ca),Kt(Pa)}function wg(i){ws(Pa.current);var s=ws(ki.current),l=A(s,i.type);s!==l&&(Xt(Ca,i),Xt(ki,l))}function Ff(i){Ca.current===i&&(Kt(ki),Kt(Ca))}var Jt=kr(0);function Gl(i){for(var s=i;s!==null;){if(s.tag===13){var l=s.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||l.data==="$?"||l.data==="$!"))return s}else if(s.tag===19&&s.memoizedProps.revealOrder!==void 0){if((s.flags&128)!==0)return s}else if(s.child!==null){s.child.return=s,s=s.child;continue}if(s===i)break;for(;s.sibling===null;){if(s.return===null||s.return===i)return null;s=s.return}s.sibling.return=s.return,s=s.sibling}return null}var Of=[];function kf(){for(var i=0;i<Of.length;i++)Of[i]._workInProgressVersionPrimary=null;Of.length=0}var Hl=C.ReactCurrentDispatcher,zf=C.ReactCurrentBatchConfig,bs=0,en=null,fn=null,gn=null,Wl=!1,Da=!1,Na=0,VM=0;function Tn(){throw Error(t(321))}function Bf(i,s){if(s===null)return!1;for(var l=0;l<s.length&&l<i.length;l++)if(!yi(i[l],s[l]))return!1;return!0}function Vf(i,s,l,u,p,S){if(bs=S,en=s,s.memoizedState=null,s.updateQueue=null,s.lanes=0,Hl.current=i===null||i.memoizedState===null?jM:XM,i=l(u,p),Da){S=0;do{if(Da=!1,Na=0,25<=S)throw Error(t(301));S+=1,gn=fn=null,s.updateQueue=null,Hl.current=$M,i=l(u,p)}while(Da)}if(Hl.current=$l,s=fn!==null&&fn.next!==null,bs=0,gn=fn=en=null,Wl=!1,s)throw Error(t(300));return i}function Gf(){var i=Na!==0;return Na=0,i}function zi(){var i={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return gn===null?en.memoizedState=gn=i:gn=gn.next=i,gn}function li(){if(fn===null){var i=en.alternate;i=i!==null?i.memoizedState:null}else i=fn.next;var s=gn===null?en.memoizedState:gn.next;if(s!==null)gn=s,fn=i;else{if(i===null)throw Error(t(310));fn=i,i={memoizedState:fn.memoizedState,baseState:fn.baseState,baseQueue:fn.baseQueue,queue:fn.queue,next:null},gn===null?en.memoizedState=gn=i:gn=gn.next=i}return gn}function La(i,s){return typeof s=="function"?s(i):s}function Hf(i){var s=li(),l=s.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=i;var u=fn,p=u.baseQueue,S=l.pending;if(S!==null){if(p!==null){var R=p.next;p.next=S.next,S.next=R}u.baseQueue=p=S,l.pending=null}if(p!==null){S=p.next,u=u.baseState;var H=R=null,K=null,de=S;do{var be=de.lane;if((bs&be)===be)K!==null&&(K=K.next={lane:0,action:de.action,hasEagerState:de.hasEagerState,eagerState:de.eagerState,next:null}),u=de.hasEagerState?de.eagerState:i(u,de.action);else{var Re={lane:be,action:de.action,hasEagerState:de.hasEagerState,eagerState:de.eagerState,next:null};K===null?(H=K=Re,R=u):K=K.next=Re,en.lanes|=be,Ts|=be}de=de.next}while(de!==null&&de!==S);K===null?R=u:K.next=H,yi(u,s.memoizedState)||(Wn=!0),s.memoizedState=u,s.baseState=R,s.baseQueue=K,l.lastRenderedState=u}if(i=l.interleaved,i!==null){p=i;do S=p.lane,en.lanes|=S,Ts|=S,p=p.next;while(p!==i)}else p===null&&(l.lanes=0);return[s.memoizedState,l.dispatch]}function Wf(i){var s=li(),l=s.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=i;var u=l.dispatch,p=l.pending,S=s.memoizedState;if(p!==null){l.pending=null;var R=p=p.next;do S=i(S,R.action),R=R.next;while(R!==p);yi(S,s.memoizedState)||(Wn=!0),s.memoizedState=S,s.baseQueue===null&&(s.baseState=S),l.lastRenderedState=S}return[S,u]}function bg(){}function Tg(i,s){var l=en,u=li(),p=s(),S=!yi(u.memoizedState,p);if(S&&(u.memoizedState=p,Wn=!0),u=u.queue,jf(Cg.bind(null,l,u,i),[i]),u.getSnapshot!==s||S||gn!==null&&gn.memoizedState.tag&1){if(l.flags|=2048,Ia(9,Rg.bind(null,l,u,p,s),void 0,null),vn===null)throw Error(t(349));(bs&30)!==0||Ag(l,s,p)}return p}function Ag(i,s,l){i.flags|=16384,i={getSnapshot:s,value:l},s=en.updateQueue,s===null?(s={lastEffect:null,stores:null},en.updateQueue=s,s.stores=[i]):(l=s.stores,l===null?s.stores=[i]:l.push(i))}function Rg(i,s,l,u){s.value=l,s.getSnapshot=u,Pg(s)&&Dg(i)}function Cg(i,s,l){return l(function(){Pg(s)&&Dg(i)})}function Pg(i){var s=i.getSnapshot;i=i.value;try{var l=s();return!yi(i,l)}catch{return!0}}function Dg(i){var s=cr(i,1);s!==null&&bi(s,i,1,-1)}function Ng(i){var s=zi();return typeof i=="function"&&(i=i()),s.memoizedState=s.baseState=i,i={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:La,lastRenderedState:i},s.queue=i,i=i.dispatch=WM.bind(null,en,i),[s.memoizedState,i]}function Ia(i,s,l,u){return i={tag:i,create:s,destroy:l,deps:u,next:null},s=en.updateQueue,s===null?(s={lastEffect:null,stores:null},en.updateQueue=s,s.lastEffect=i.next=i):(l=s.lastEffect,l===null?s.lastEffect=i.next=i:(u=l.next,l.next=i,i.next=u,s.lastEffect=i)),i}function Lg(){return li().memoizedState}function jl(i,s,l,u){var p=zi();en.flags|=i,p.memoizedState=Ia(1|s,l,void 0,u===void 0?null:u)}function Xl(i,s,l,u){var p=li();u=u===void 0?null:u;var S=void 0;if(fn!==null){var R=fn.memoizedState;if(S=R.destroy,u!==null&&Bf(u,R.deps)){p.memoizedState=Ia(s,l,S,u);return}}en.flags|=i,p.memoizedState=Ia(1|s,l,S,u)}function Ig(i,s){return jl(8390656,8,i,s)}function jf(i,s){return Xl(2048,8,i,s)}function Ug(i,s){return Xl(4,2,i,s)}function Fg(i,s){return Xl(4,4,i,s)}function Og(i,s){if(typeof s=="function")return i=i(),s(i),function(){s(null)};if(s!=null)return i=i(),s.current=i,function(){s.current=null}}function kg(i,s,l){return l=l!=null?l.concat([i]):null,Xl(4,4,Og.bind(null,s,i),l)}function Xf(){}function zg(i,s){var l=li();s=s===void 0?null:s;var u=l.memoizedState;return u!==null&&s!==null&&Bf(s,u[1])?u[0]:(l.memoizedState=[i,s],i)}function Bg(i,s){var l=li();s=s===void 0?null:s;var u=l.memoizedState;return u!==null&&s!==null&&Bf(s,u[1])?u[0]:(i=i(),l.memoizedState=[i,s],i)}function Vg(i,s,l){return(bs&21)===0?(i.baseState&&(i.baseState=!1,Wn=!0),i.memoizedState=l):(yi(l,s)||(l=We(),en.lanes|=l,Ts|=l,i.baseState=!0),s)}function GM(i,s){var l=St;St=l!==0&&4>l?l:4,i(!0);var u=zf.transition;zf.transition={};try{i(!1),s()}finally{St=l,zf.transition=u}}function Gg(){return li().memoizedState}function HM(i,s,l){var u=Xr(i);if(l={lane:u,action:l,hasEagerState:!1,eagerState:null,next:null},Hg(i))Wg(s,l);else if(l=yg(i,s,l,u),l!==null){var p=Un();bi(l,i,u,p),jg(l,s,u)}}function WM(i,s,l){var u=Xr(i),p={lane:u,action:l,hasEagerState:!1,eagerState:null,next:null};if(Hg(i))Wg(s,p);else{var S=i.alternate;if(i.lanes===0&&(S===null||S.lanes===0)&&(S=s.lastRenderedReducer,S!==null))try{var R=s.lastRenderedState,H=S(R,l);if(p.hasEagerState=!0,p.eagerState=H,yi(H,R)){var K=s.interleaved;K===null?(p.next=p,Lf(s)):(p.next=K.next,K.next=p),s.interleaved=p;return}}catch{}finally{}l=yg(i,s,p,u),l!==null&&(p=Un(),bi(l,i,u,p),jg(l,s,u))}}function Hg(i){var s=i.alternate;return i===en||s!==null&&s===en}function Wg(i,s){Da=Wl=!0;var l=i.pending;l===null?s.next=s:(s.next=l.next,l.next=s),i.pending=s}function jg(i,s,l){if((l&4194240)!==0){var u=s.lanes;u&=i.pendingLanes,l|=u,s.lanes=l,Vn(i,l)}}var $l={readContext:ai,useCallback:Tn,useContext:Tn,useEffect:Tn,useImperativeHandle:Tn,useInsertionEffect:Tn,useLayoutEffect:Tn,useMemo:Tn,useReducer:Tn,useRef:Tn,useState:Tn,useDebugValue:Tn,useDeferredValue:Tn,useTransition:Tn,useMutableSource:Tn,useSyncExternalStore:Tn,useId:Tn,unstable_isNewReconciler:!1},jM={readContext:ai,useCallback:function(i,s){return zi().memoizedState=[i,s===void 0?null:s],i},useContext:ai,useEffect:Ig,useImperativeHandle:function(i,s,l){return l=l!=null?l.concat([i]):null,jl(4194308,4,Og.bind(null,s,i),l)},useLayoutEffect:function(i,s){return jl(4194308,4,i,s)},useInsertionEffect:function(i,s){return jl(4,2,i,s)},useMemo:function(i,s){var l=zi();return s=s===void 0?null:s,i=i(),l.memoizedState=[i,s],i},useReducer:function(i,s,l){var u=zi();return s=l!==void 0?l(s):s,u.memoizedState=u.baseState=s,i={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:i,lastRenderedState:s},u.queue=i,i=i.dispatch=HM.bind(null,en,i),[u.memoizedState,i]},useRef:function(i){var s=zi();return i={current:i},s.memoizedState=i},useState:Ng,useDebugValue:Xf,useDeferredValue:function(i){return zi().memoizedState=i},useTransition:function(){var i=Ng(!1),s=i[0];return i=GM.bind(null,i[1]),zi().memoizedState=i,[s,i]},useMutableSource:function(){},useSyncExternalStore:function(i,s,l){var u=en,p=zi();if(Zt){if(l===void 0)throw Error(t(407));l=l()}else{if(l=s(),vn===null)throw Error(t(349));(bs&30)!==0||Ag(u,s,l)}p.memoizedState=l;var S={value:l,getSnapshot:s};return p.queue=S,Ig(Cg.bind(null,u,S,i),[i]),u.flags|=2048,Ia(9,Rg.bind(null,u,S,l,s),void 0,null),l},useId:function(){var i=zi(),s=vn.identifierPrefix;if(Zt){var l=lr,u=ar;l=(u&~(1<<32-Ie(u)-1)).toString(32)+l,s=":"+s+"R"+l,l=Na++,0<l&&(s+="H"+l.toString(32)),s+=":"}else l=VM++,s=":"+s+"r"+l.toString(32)+":";return i.memoizedState=s},unstable_isNewReconciler:!1},XM={readContext:ai,useCallback:zg,useContext:ai,useEffect:jf,useImperativeHandle:kg,useInsertionEffect:Ug,useLayoutEffect:Fg,useMemo:Bg,useReducer:Hf,useRef:Lg,useState:function(){return Hf(La)},useDebugValue:Xf,useDeferredValue:function(i){var s=li();return Vg(s,fn.memoizedState,i)},useTransition:function(){var i=Hf(La)[0],s=li().memoizedState;return[i,s]},useMutableSource:bg,useSyncExternalStore:Tg,useId:Gg,unstable_isNewReconciler:!1},$M={readContext:ai,useCallback:zg,useContext:ai,useEffect:jf,useImperativeHandle:kg,useInsertionEffect:Ug,useLayoutEffect:Fg,useMemo:Bg,useReducer:Wf,useRef:Lg,useState:function(){return Wf(La)},useDebugValue:Xf,useDeferredValue:function(i){var s=li();return fn===null?s.memoizedState=i:Vg(s,fn.memoizedState,i)},useTransition:function(){var i=Wf(La)[0],s=li().memoizedState;return[i,s]},useMutableSource:bg,useSyncExternalStore:Tg,useId:Gg,unstable_isNewReconciler:!1};function Mi(i,s){if(i&&i.defaultProps){s=$({},s),i=i.defaultProps;for(var l in i)s[l]===void 0&&(s[l]=i[l]);return s}return s}function $f(i,s,l,u){s=i.memoizedState,l=l(u,s),l=l==null?s:$({},s,l),i.memoizedState=l,i.lanes===0&&(i.updateQueue.baseState=l)}var Yl={isMounted:function(i){return(i=i._reactInternals)?Ui(i)===i:!1},enqueueSetState:function(i,s,l){i=i._reactInternals;var u=Un(),p=Xr(i),S=ur(u,p);S.payload=s,l!=null&&(S.callback=l),s=Gr(i,S,p),s!==null&&(bi(s,i,p,u),Bl(s,i,p))},enqueueReplaceState:function(i,s,l){i=i._reactInternals;var u=Un(),p=Xr(i),S=ur(u,p);S.tag=1,S.payload=s,l!=null&&(S.callback=l),s=Gr(i,S,p),s!==null&&(bi(s,i,p,u),Bl(s,i,p))},enqueueForceUpdate:function(i,s){i=i._reactInternals;var l=Un(),u=Xr(i),p=ur(l,u);p.tag=2,s!=null&&(p.callback=s),s=Gr(i,p,u),s!==null&&(bi(s,i,u,l),Bl(s,i,u))}};function Xg(i,s,l,u,p,S,R){return i=i.stateNode,typeof i.shouldComponentUpdate=="function"?i.shouldComponentUpdate(u,S,R):s.prototype&&s.prototype.isPureReactComponent?!ya(l,u)||!ya(p,S):!0}function $g(i,s,l){var u=!1,p=zr,S=s.contextType;return typeof S=="object"&&S!==null?S=ai(S):(p=Hn(s)?ys:bn.current,u=s.contextTypes,S=(u=u!=null)?so(i,p):zr),s=new s(l,S),i.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=Yl,i.stateNode=s,s._reactInternals=i,u&&(i=i.stateNode,i.__reactInternalMemoizedUnmaskedChildContext=p,i.__reactInternalMemoizedMaskedChildContext=S),s}function Yg(i,s,l,u){i=s.state,typeof s.componentWillReceiveProps=="function"&&s.componentWillReceiveProps(l,u),typeof s.UNSAFE_componentWillReceiveProps=="function"&&s.UNSAFE_componentWillReceiveProps(l,u),s.state!==i&&Yl.enqueueReplaceState(s,s.state,null)}function Yf(i,s,l,u){var p=i.stateNode;p.props=l,p.state=i.memoizedState,p.refs={},If(i);var S=s.contextType;typeof S=="object"&&S!==null?p.context=ai(S):(S=Hn(s)?ys:bn.current,p.context=so(i,S)),p.state=i.memoizedState,S=s.getDerivedStateFromProps,typeof S=="function"&&($f(i,s,S,l),p.state=i.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(s=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),s!==p.state&&Yl.enqueueReplaceState(p,p.state,null),Vl(i,l,p,u),p.state=i.memoizedState),typeof p.componentDidMount=="function"&&(i.flags|=4194308)}function po(i,s){try{var l="",u=s;do l+=Se(u),u=u.return;while(u);var p=l}catch(S){p=`
Error generating stack: `+S.message+`
`+S.stack}return{value:i,source:s,stack:p,digest:null}}function Kf(i,s,l){return{value:i,source:null,stack:l??null,digest:s??null}}function qf(i,s){try{console.error(s.value)}catch(l){setTimeout(function(){throw l})}}var YM=typeof WeakMap=="function"?WeakMap:Map;function Kg(i,s,l){l=ur(-1,l),l.tag=3,l.payload={element:null};var u=s.value;return l.callback=function(){tc||(tc=!0,fd=u),qf(i,s)},l}function qg(i,s,l){l=ur(-1,l),l.tag=3;var u=i.type.getDerivedStateFromError;if(typeof u=="function"){var p=s.value;l.payload=function(){return u(p)},l.callback=function(){qf(i,s)}}var S=i.stateNode;return S!==null&&typeof S.componentDidCatch=="function"&&(l.callback=function(){qf(i,s),typeof u!="function"&&(Wr===null?Wr=new Set([this]):Wr.add(this));var R=s.stack;this.componentDidCatch(s.value,{componentStack:R!==null?R:""})}),l}function Zg(i,s,l){var u=i.pingCache;if(u===null){u=i.pingCache=new YM;var p=new Set;u.set(s,p)}else p=u.get(s),p===void 0&&(p=new Set,u.set(s,p));p.has(l)||(p.add(l),i=lE.bind(null,i,s,l),s.then(i,i))}function Qg(i){do{var s;if((s=i.tag===13)&&(s=i.memoizedState,s=s!==null?s.dehydrated!==null:!0),s)return i;i=i.return}while(i!==null);return null}function Jg(i,s,l,u,p){return(i.mode&1)===0?(i===s?i.flags|=65536:(i.flags|=128,l.flags|=131072,l.flags&=-52805,l.tag===1&&(l.alternate===null?l.tag=17:(s=ur(-1,1),s.tag=2,Gr(l,s,1))),l.lanes|=1),i):(i.flags|=65536,i.lanes=p,i)}var KM=C.ReactCurrentOwner,Wn=!1;function In(i,s,l,u){s.child=i===null?xg(s,null,l,u):co(s,i.child,l,u)}function e0(i,s,l,u,p){l=l.render;var S=s.ref;return fo(s,p),u=Vf(i,s,l,u,S,p),l=Gf(),i!==null&&!Wn?(s.updateQueue=i.updateQueue,s.flags&=-2053,i.lanes&=~p,fr(i,s,p)):(Zt&&l&&wf(s),s.flags|=1,In(i,s,u,p),s.child)}function t0(i,s,l,u,p){if(i===null){var S=l.type;return typeof S=="function"&&!_d(S)&&S.defaultProps===void 0&&l.compare===null&&l.defaultProps===void 0?(s.tag=15,s.type=S,n0(i,s,S,u,p)):(i=ac(l.type,null,u,s,s.mode,p),i.ref=s.ref,i.return=s,s.child=i)}if(S=i.child,(i.lanes&p)===0){var R=S.memoizedProps;if(l=l.compare,l=l!==null?l:ya,l(R,u)&&i.ref===s.ref)return fr(i,s,p)}return s.flags|=1,i=Yr(S,u),i.ref=s.ref,i.return=s,s.child=i}function n0(i,s,l,u,p){if(i!==null){var S=i.memoizedProps;if(ya(S,u)&&i.ref===s.ref)if(Wn=!1,s.pendingProps=u=S,(i.lanes&p)!==0)(i.flags&131072)!==0&&(Wn=!0);else return s.lanes=i.lanes,fr(i,s,p)}return Zf(i,s,l,u,p)}function i0(i,s,l){var u=s.pendingProps,p=u.children,S=i!==null?i.memoizedState:null;if(u.mode==="hidden")if((s.mode&1)===0)s.memoizedState={baseLanes:0,cachePool:null,transitions:null},Xt(go,Jn),Jn|=l;else{if((l&1073741824)===0)return i=S!==null?S.baseLanes|l:l,s.lanes=s.childLanes=1073741824,s.memoizedState={baseLanes:i,cachePool:null,transitions:null},s.updateQueue=null,Xt(go,Jn),Jn|=i,null;s.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=S!==null?S.baseLanes:l,Xt(go,Jn),Jn|=u}else S!==null?(u=S.baseLanes|l,s.memoizedState=null):u=l,Xt(go,Jn),Jn|=u;return In(i,s,p,l),s.child}function r0(i,s){var l=s.ref;(i===null&&l!==null||i!==null&&i.ref!==l)&&(s.flags|=512,s.flags|=2097152)}function Zf(i,s,l,u,p){var S=Hn(l)?ys:bn.current;return S=so(s,S),fo(s,p),l=Vf(i,s,l,u,S,p),u=Gf(),i!==null&&!Wn?(s.updateQueue=i.updateQueue,s.flags&=-2053,i.lanes&=~p,fr(i,s,p)):(Zt&&u&&wf(s),s.flags|=1,In(i,s,l,p),s.child)}function s0(i,s,l,u,p){if(Hn(l)){var S=!0;Nl(s)}else S=!1;if(fo(s,p),s.stateNode===null)ql(i,s),$g(s,l,u),Yf(s,l,u,p),u=!0;else if(i===null){var R=s.stateNode,H=s.memoizedProps;R.props=H;var K=R.context,de=l.contextType;typeof de=="object"&&de!==null?de=ai(de):(de=Hn(l)?ys:bn.current,de=so(s,de));var be=l.getDerivedStateFromProps,Re=typeof be=="function"||typeof R.getSnapshotBeforeUpdate=="function";Re||typeof R.UNSAFE_componentWillReceiveProps!="function"&&typeof R.componentWillReceiveProps!="function"||(H!==u||K!==de)&&Yg(s,R,u,de),Vr=!1;var we=s.memoizedState;R.state=we,Vl(s,u,R,p),K=s.memoizedState,H!==u||we!==K||Gn.current||Vr?(typeof be=="function"&&($f(s,l,be,u),K=s.memoizedState),(H=Vr||Xg(s,l,H,u,we,K,de))?(Re||typeof R.UNSAFE_componentWillMount!="function"&&typeof R.componentWillMount!="function"||(typeof R.componentWillMount=="function"&&R.componentWillMount(),typeof R.UNSAFE_componentWillMount=="function"&&R.UNSAFE_componentWillMount()),typeof R.componentDidMount=="function"&&(s.flags|=4194308)):(typeof R.componentDidMount=="function"&&(s.flags|=4194308),s.memoizedProps=u,s.memoizedState=K),R.props=u,R.state=K,R.context=de,u=H):(typeof R.componentDidMount=="function"&&(s.flags|=4194308),u=!1)}else{R=s.stateNode,Sg(i,s),H=s.memoizedProps,de=s.type===s.elementType?H:Mi(s.type,H),R.props=de,Re=s.pendingProps,we=R.context,K=l.contextType,typeof K=="object"&&K!==null?K=ai(K):(K=Hn(l)?ys:bn.current,K=so(s,K));var je=l.getDerivedStateFromProps;(be=typeof je=="function"||typeof R.getSnapshotBeforeUpdate=="function")||typeof R.UNSAFE_componentWillReceiveProps!="function"&&typeof R.componentWillReceiveProps!="function"||(H!==Re||we!==K)&&Yg(s,R,u,K),Vr=!1,we=s.memoizedState,R.state=we,Vl(s,u,R,p);var Ye=s.memoizedState;H!==Re||we!==Ye||Gn.current||Vr?(typeof je=="function"&&($f(s,l,je,u),Ye=s.memoizedState),(de=Vr||Xg(s,l,de,u,we,Ye,K)||!1)?(be||typeof R.UNSAFE_componentWillUpdate!="function"&&typeof R.componentWillUpdate!="function"||(typeof R.componentWillUpdate=="function"&&R.componentWillUpdate(u,Ye,K),typeof R.UNSAFE_componentWillUpdate=="function"&&R.UNSAFE_componentWillUpdate(u,Ye,K)),typeof R.componentDidUpdate=="function"&&(s.flags|=4),typeof R.getSnapshotBeforeUpdate=="function"&&(s.flags|=1024)):(typeof R.componentDidUpdate!="function"||H===i.memoizedProps&&we===i.memoizedState||(s.flags|=4),typeof R.getSnapshotBeforeUpdate!="function"||H===i.memoizedProps&&we===i.memoizedState||(s.flags|=1024),s.memoizedProps=u,s.memoizedState=Ye),R.props=u,R.state=Ye,R.context=K,u=de):(typeof R.componentDidUpdate!="function"||H===i.memoizedProps&&we===i.memoizedState||(s.flags|=4),typeof R.getSnapshotBeforeUpdate!="function"||H===i.memoizedProps&&we===i.memoizedState||(s.flags|=1024),u=!1)}return Qf(i,s,l,u,S,p)}function Qf(i,s,l,u,p,S){r0(i,s);var R=(s.flags&128)!==0;if(!u&&!R)return p&&ug(s,l,!1),fr(i,s,S);u=s.stateNode,KM.current=s;var H=R&&typeof l.getDerivedStateFromError!="function"?null:u.render();return s.flags|=1,i!==null&&R?(s.child=co(s,i.child,null,S),s.child=co(s,null,H,S)):In(i,s,H,S),s.memoizedState=u.state,p&&ug(s,l,!0),s.child}function o0(i){var s=i.stateNode;s.pendingContext?lg(i,s.pendingContext,s.pendingContext!==s.context):s.context&&lg(i,s.context,!1),Uf(i,s.containerInfo)}function a0(i,s,l,u,p){return lo(),Rf(p),s.flags|=256,In(i,s,l,u),s.child}var Jf={dehydrated:null,treeContext:null,retryLane:0};function ed(i){return{baseLanes:i,cachePool:null,transitions:null}}function l0(i,s,l){var u=s.pendingProps,p=Jt.current,S=!1,R=(s.flags&128)!==0,H;if((H=R)||(H=i!==null&&i.memoizedState===null?!1:(p&2)!==0),H?(S=!0,s.flags&=-129):(i===null||i.memoizedState!==null)&&(p|=1),Xt(Jt,p&1),i===null)return Af(s),i=s.memoizedState,i!==null&&(i=i.dehydrated,i!==null)?((s.mode&1)===0?s.lanes=1:i.data==="$!"?s.lanes=8:s.lanes=1073741824,null):(R=u.children,i=u.fallback,S?(u=s.mode,S=s.child,R={mode:"hidden",children:R},(u&1)===0&&S!==null?(S.childLanes=0,S.pendingProps=R):S=lc(R,u,0,null),i=Ps(i,u,l,null),S.return=s,i.return=s,S.sibling=i,s.child=S,s.child.memoizedState=ed(l),s.memoizedState=Jf,i):td(s,R));if(p=i.memoizedState,p!==null&&(H=p.dehydrated,H!==null))return qM(i,s,R,u,H,p,l);if(S){S=u.fallback,R=s.mode,p=i.child,H=p.sibling;var K={mode:"hidden",children:u.children};return(R&1)===0&&s.child!==p?(u=s.child,u.childLanes=0,u.pendingProps=K,s.deletions=null):(u=Yr(p,K),u.subtreeFlags=p.subtreeFlags&14680064),H!==null?S=Yr(H,S):(S=Ps(S,R,l,null),S.flags|=2),S.return=s,u.return=s,u.sibling=S,s.child=u,u=S,S=s.child,R=i.child.memoizedState,R=R===null?ed(l):{baseLanes:R.baseLanes|l,cachePool:null,transitions:R.transitions},S.memoizedState=R,S.childLanes=i.childLanes&~l,s.memoizedState=Jf,u}return S=i.child,i=S.sibling,u=Yr(S,{mode:"visible",children:u.children}),(s.mode&1)===0&&(u.lanes=l),u.return=s,u.sibling=null,i!==null&&(l=s.deletions,l===null?(s.deletions=[i],s.flags|=16):l.push(i)),s.child=u,s.memoizedState=null,u}function td(i,s){return s=lc({mode:"visible",children:s},i.mode,0,null),s.return=i,i.child=s}function Kl(i,s,l,u){return u!==null&&Rf(u),co(s,i.child,null,l),i=td(s,s.pendingProps.children),i.flags|=2,s.memoizedState=null,i}function qM(i,s,l,u,p,S,R){if(l)return s.flags&256?(s.flags&=-257,u=Kf(Error(t(422))),Kl(i,s,R,u)):s.memoizedState!==null?(s.child=i.child,s.flags|=128,null):(S=u.fallback,p=s.mode,u=lc({mode:"visible",children:u.children},p,0,null),S=Ps(S,p,R,null),S.flags|=2,u.return=s,S.return=s,u.sibling=S,s.child=u,(s.mode&1)!==0&&co(s,i.child,null,R),s.child.memoizedState=ed(R),s.memoizedState=Jf,S);if((s.mode&1)===0)return Kl(i,s,R,null);if(p.data==="$!"){if(u=p.nextSibling&&p.nextSibling.dataset,u)var H=u.dgst;return u=H,S=Error(t(419)),u=Kf(S,u,void 0),Kl(i,s,R,u)}if(H=(R&i.childLanes)!==0,Wn||H){if(u=vn,u!==null){switch(R&-R){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(u.suspendedLanes|R))!==0?0:p,p!==0&&p!==S.retryLane&&(S.retryLane=p,cr(i,p),bi(u,i,p,-1))}return vd(),u=Kf(Error(t(421))),Kl(i,s,R,u)}return p.data==="$?"?(s.flags|=128,s.child=i.child,s=cE.bind(null,i),p._reactRetry=s,null):(i=S.treeContext,Qn=Or(p.nextSibling),Zn=s,Zt=!0,Si=null,i!==null&&(si[oi++]=ar,si[oi++]=lr,si[oi++]=Ss,ar=i.id,lr=i.overflow,Ss=s),s=td(s,u.children),s.flags|=4096,s)}function c0(i,s,l){i.lanes|=s;var u=i.alternate;u!==null&&(u.lanes|=s),Nf(i.return,s,l)}function nd(i,s,l,u,p){var S=i.memoizedState;S===null?i.memoizedState={isBackwards:s,rendering:null,renderingStartTime:0,last:u,tail:l,tailMode:p}:(S.isBackwards=s,S.rendering=null,S.renderingStartTime=0,S.last=u,S.tail=l,S.tailMode=p)}function u0(i,s,l){var u=s.pendingProps,p=u.revealOrder,S=u.tail;if(In(i,s,u.children,l),u=Jt.current,(u&2)!==0)u=u&1|2,s.flags|=128;else{if(i!==null&&(i.flags&128)!==0)e:for(i=s.child;i!==null;){if(i.tag===13)i.memoizedState!==null&&c0(i,l,s);else if(i.tag===19)c0(i,l,s);else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===s)break e;for(;i.sibling===null;){if(i.return===null||i.return===s)break e;i=i.return}i.sibling.return=i.return,i=i.sibling}u&=1}if(Xt(Jt,u),(s.mode&1)===0)s.memoizedState=null;else switch(p){case"forwards":for(l=s.child,p=null;l!==null;)i=l.alternate,i!==null&&Gl(i)===null&&(p=l),l=l.sibling;l=p,l===null?(p=s.child,s.child=null):(p=l.sibling,l.sibling=null),nd(s,!1,p,l,S);break;case"backwards":for(l=null,p=s.child,s.child=null;p!==null;){if(i=p.alternate,i!==null&&Gl(i)===null){s.child=p;break}i=p.sibling,p.sibling=l,l=p,p=i}nd(s,!0,l,null,S);break;case"together":nd(s,!1,null,null,void 0);break;default:s.memoizedState=null}return s.child}function ql(i,s){(s.mode&1)===0&&i!==null&&(i.alternate=null,s.alternate=null,s.flags|=2)}function fr(i,s,l){if(i!==null&&(s.dependencies=i.dependencies),Ts|=s.lanes,(l&s.childLanes)===0)return null;if(i!==null&&s.child!==i.child)throw Error(t(153));if(s.child!==null){for(i=s.child,l=Yr(i,i.pendingProps),s.child=l,l.return=s;i.sibling!==null;)i=i.sibling,l=l.sibling=Yr(i,i.pendingProps),l.return=s;l.sibling=null}return s.child}function ZM(i,s,l){switch(s.tag){case 3:o0(s),lo();break;case 5:wg(s);break;case 1:Hn(s.type)&&Nl(s);break;case 4:Uf(s,s.stateNode.containerInfo);break;case 10:var u=s.type._context,p=s.memoizedProps.value;Xt(kl,u._currentValue),u._currentValue=p;break;case 13:if(u=s.memoizedState,u!==null)return u.dehydrated!==null?(Xt(Jt,Jt.current&1),s.flags|=128,null):(l&s.child.childLanes)!==0?l0(i,s,l):(Xt(Jt,Jt.current&1),i=fr(i,s,l),i!==null?i.sibling:null);Xt(Jt,Jt.current&1);break;case 19:if(u=(l&s.childLanes)!==0,(i.flags&128)!==0){if(u)return u0(i,s,l);s.flags|=128}if(p=s.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Xt(Jt,Jt.current),u)break;return null;case 22:case 23:return s.lanes=0,i0(i,s,l)}return fr(i,s,l)}var f0,id,d0,h0;f0=function(i,s){for(var l=s.child;l!==null;){if(l.tag===5||l.tag===6)i.appendChild(l.stateNode);else if(l.tag!==4&&l.child!==null){l.child.return=l,l=l.child;continue}if(l===s)break;for(;l.sibling===null;){if(l.return===null||l.return===s)return;l=l.return}l.sibling.return=l.return,l=l.sibling}},id=function(){},d0=function(i,s,l,u){var p=i.memoizedProps;if(p!==u){i=s.stateNode,ws(ki.current);var S=null;switch(l){case"input":p=Qe(i,p),u=Qe(i,u),S=[];break;case"select":p=$({},p,{value:void 0}),u=$({},u,{value:void 0}),S=[];break;case"textarea":p=ut(i,p),u=ut(i,u),S=[];break;default:typeof p.onClick!="function"&&typeof u.onClick=="function"&&(i.onclick=Cl)}He(l,u);var R;l=null;for(de in p)if(!u.hasOwnProperty(de)&&p.hasOwnProperty(de)&&p[de]!=null)if(de==="style"){var H=p[de];for(R in H)H.hasOwnProperty(R)&&(l||(l={}),l[R]="")}else de!=="dangerouslySetInnerHTML"&&de!=="children"&&de!=="suppressContentEditableWarning"&&de!=="suppressHydrationWarning"&&de!=="autoFocus"&&(o.hasOwnProperty(de)?S||(S=[]):(S=S||[]).push(de,null));for(de in u){var K=u[de];if(H=p!=null?p[de]:void 0,u.hasOwnProperty(de)&&K!==H&&(K!=null||H!=null))if(de==="style")if(H){for(R in H)!H.hasOwnProperty(R)||K&&K.hasOwnProperty(R)||(l||(l={}),l[R]="");for(R in K)K.hasOwnProperty(R)&&H[R]!==K[R]&&(l||(l={}),l[R]=K[R])}else l||(S||(S=[]),S.push(de,l)),l=K;else de==="dangerouslySetInnerHTML"?(K=K?K.__html:void 0,H=H?H.__html:void 0,K!=null&&H!==K&&(S=S||[]).push(de,K)):de==="children"?typeof K!="string"&&typeof K!="number"||(S=S||[]).push(de,""+K):de!=="suppressContentEditableWarning"&&de!=="suppressHydrationWarning"&&(o.hasOwnProperty(de)?(K!=null&&de==="onScroll"&&Yt("scroll",i),S||H===K||(S=[])):(S=S||[]).push(de,K))}l&&(S=S||[]).push("style",l);var de=S;(s.updateQueue=de)&&(s.flags|=4)}},h0=function(i,s,l,u){l!==u&&(s.flags|=4)};function Ua(i,s){if(!Zt)switch(i.tailMode){case"hidden":s=i.tail;for(var l=null;s!==null;)s.alternate!==null&&(l=s),s=s.sibling;l===null?i.tail=null:l.sibling=null;break;case"collapsed":l=i.tail;for(var u=null;l!==null;)l.alternate!==null&&(u=l),l=l.sibling;u===null?s||i.tail===null?i.tail=null:i.tail.sibling=null:u.sibling=null}}function An(i){var s=i.alternate!==null&&i.alternate.child===i.child,l=0,u=0;if(s)for(var p=i.child;p!==null;)l|=p.lanes|p.childLanes,u|=p.subtreeFlags&14680064,u|=p.flags&14680064,p.return=i,p=p.sibling;else for(p=i.child;p!==null;)l|=p.lanes|p.childLanes,u|=p.subtreeFlags,u|=p.flags,p.return=i,p=p.sibling;return i.subtreeFlags|=u,i.childLanes=l,s}function QM(i,s,l){var u=s.pendingProps;switch(bf(s),s.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return An(s),null;case 1:return Hn(s.type)&&Dl(),An(s),null;case 3:return u=s.stateNode,ho(),Kt(Gn),Kt(bn),kf(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(i===null||i.child===null)&&(Fl(s)?s.flags|=4:i===null||i.memoizedState.isDehydrated&&(s.flags&256)===0||(s.flags|=1024,Si!==null&&(pd(Si),Si=null))),id(i,s),An(s),null;case 5:Ff(s);var p=ws(Pa.current);if(l=s.type,i!==null&&s.stateNode!=null)d0(i,s,l,u,p),i.ref!==s.ref&&(s.flags|=512,s.flags|=2097152);else{if(!u){if(s.stateNode===null)throw Error(t(166));return An(s),null}if(i=ws(ki.current),Fl(s)){u=s.stateNode,l=s.type;var S=s.memoizedProps;switch(u[Oi]=s,u[ba]=S,i=(s.mode&1)!==0,l){case"dialog":Yt("cancel",u),Yt("close",u);break;case"iframe":case"object":case"embed":Yt("load",u);break;case"video":case"audio":for(p=0;p<Ma.length;p++)Yt(Ma[p],u);break;case"source":Yt("error",u);break;case"img":case"image":case"link":Yt("error",u),Yt("load",u);break;case"details":Yt("toggle",u);break;case"input":pt(u,S),Yt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!S.multiple},Yt("invalid",u);break;case"textarea":Pt(u,S),Yt("invalid",u)}He(l,S),p=null;for(var R in S)if(S.hasOwnProperty(R)){var H=S[R];R==="children"?typeof H=="string"?u.textContent!==H&&(S.suppressHydrationWarning!==!0&&Rl(u.textContent,H,i),p=["children",H]):typeof H=="number"&&u.textContent!==""+H&&(S.suppressHydrationWarning!==!0&&Rl(u.textContent,H,i),p=["children",""+H]):o.hasOwnProperty(R)&&H!=null&&R==="onScroll"&&Yt("scroll",u)}switch(l){case"input":Te(u),wt(u,S,!0);break;case"textarea":Te(u),Bt(u);break;case"select":case"option":break;default:typeof S.onClick=="function"&&(u.onclick=Cl)}u=p,s.updateQueue=u,u!==null&&(s.flags|=4)}else{R=p.nodeType===9?p:p.ownerDocument,i==="http://www.w3.org/1999/xhtml"&&(i=U(l)),i==="http://www.w3.org/1999/xhtml"?l==="script"?(i=R.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild)):typeof u.is=="string"?i=R.createElement(l,{is:u.is}):(i=R.createElement(l),l==="select"&&(R=i,u.multiple?R.multiple=!0:u.size&&(R.size=u.size))):i=R.createElementNS(i,l),i[Oi]=s,i[ba]=u,f0(i,s,!1,!1),s.stateNode=i;e:{switch(R=Le(l,u),l){case"dialog":Yt("cancel",i),Yt("close",i),p=u;break;case"iframe":case"object":case"embed":Yt("load",i),p=u;break;case"video":case"audio":for(p=0;p<Ma.length;p++)Yt(Ma[p],i);p=u;break;case"source":Yt("error",i),p=u;break;case"img":case"image":case"link":Yt("error",i),Yt("load",i),p=u;break;case"details":Yt("toggle",i),p=u;break;case"input":pt(i,u),p=Qe(i,u),Yt("invalid",i);break;case"option":p=u;break;case"select":i._wrapperState={wasMultiple:!!u.multiple},p=$({},u,{value:void 0}),Yt("invalid",i);break;case"textarea":Pt(i,u),p=ut(i,u),Yt("invalid",i);break;default:p=u}He(l,p),H=p;for(S in H)if(H.hasOwnProperty(S)){var K=H[S];S==="style"?xe(i,K):S==="dangerouslySetInnerHTML"?(K=K?K.__html:void 0,K!=null&&_e(i,K)):S==="children"?typeof K=="string"?(l!=="textarea"||K!=="")&&Me(i,K):typeof K=="number"&&Me(i,""+K):S!=="suppressContentEditableWarning"&&S!=="suppressHydrationWarning"&&S!=="autoFocus"&&(o.hasOwnProperty(S)?K!=null&&S==="onScroll"&&Yt("scroll",i):K!=null&&N(i,S,K,R))}switch(l){case"input":Te(i),wt(i,u,!1);break;case"textarea":Te(i),Bt(i);break;case"option":u.value!=null&&i.setAttribute("value",""+pe(u.value));break;case"select":i.multiple=!!u.multiple,S=u.value,S!=null?zt(i,!!u.multiple,S,!1):u.defaultValue!=null&&zt(i,!!u.multiple,u.defaultValue,!0);break;default:typeof p.onClick=="function"&&(i.onclick=Cl)}switch(l){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(s.flags|=4)}s.ref!==null&&(s.flags|=512,s.flags|=2097152)}return An(s),null;case 6:if(i&&s.stateNode!=null)h0(i,s,i.memoizedProps,u);else{if(typeof u!="string"&&s.stateNode===null)throw Error(t(166));if(l=ws(Pa.current),ws(ki.current),Fl(s)){if(u=s.stateNode,l=s.memoizedProps,u[Oi]=s,(S=u.nodeValue!==l)&&(i=Zn,i!==null))switch(i.tag){case 3:Rl(u.nodeValue,l,(i.mode&1)!==0);break;case 5:i.memoizedProps.suppressHydrationWarning!==!0&&Rl(u.nodeValue,l,(i.mode&1)!==0)}S&&(s.flags|=4)}else u=(l.nodeType===9?l:l.ownerDocument).createTextNode(u),u[Oi]=s,s.stateNode=u}return An(s),null;case 13:if(Kt(Jt),u=s.memoizedState,i===null||i.memoizedState!==null&&i.memoizedState.dehydrated!==null){if(Zt&&Qn!==null&&(s.mode&1)!==0&&(s.flags&128)===0)gg(),lo(),s.flags|=98560,S=!1;else if(S=Fl(s),u!==null&&u.dehydrated!==null){if(i===null){if(!S)throw Error(t(318));if(S=s.memoizedState,S=S!==null?S.dehydrated:null,!S)throw Error(t(317));S[Oi]=s}else lo(),(s.flags&128)===0&&(s.memoizedState=null),s.flags|=4;An(s),S=!1}else Si!==null&&(pd(Si),Si=null),S=!0;if(!S)return s.flags&65536?s:null}return(s.flags&128)!==0?(s.lanes=l,s):(u=u!==null,u!==(i!==null&&i.memoizedState!==null)&&u&&(s.child.flags|=8192,(s.mode&1)!==0&&(i===null||(Jt.current&1)!==0?dn===0&&(dn=3):vd())),s.updateQueue!==null&&(s.flags|=4),An(s),null);case 4:return ho(),id(i,s),i===null&&Ea(s.stateNode.containerInfo),An(s),null;case 10:return Df(s.type._context),An(s),null;case 17:return Hn(s.type)&&Dl(),An(s),null;case 19:if(Kt(Jt),S=s.memoizedState,S===null)return An(s),null;if(u=(s.flags&128)!==0,R=S.rendering,R===null)if(u)Ua(S,!1);else{if(dn!==0||i!==null&&(i.flags&128)!==0)for(i=s.child;i!==null;){if(R=Gl(i),R!==null){for(s.flags|=128,Ua(S,!1),u=R.updateQueue,u!==null&&(s.updateQueue=u,s.flags|=4),s.subtreeFlags=0,u=l,l=s.child;l!==null;)S=l,i=u,S.flags&=14680066,R=S.alternate,R===null?(S.childLanes=0,S.lanes=i,S.child=null,S.subtreeFlags=0,S.memoizedProps=null,S.memoizedState=null,S.updateQueue=null,S.dependencies=null,S.stateNode=null):(S.childLanes=R.childLanes,S.lanes=R.lanes,S.child=R.child,S.subtreeFlags=0,S.deletions=null,S.memoizedProps=R.memoizedProps,S.memoizedState=R.memoizedState,S.updateQueue=R.updateQueue,S.type=R.type,i=R.dependencies,S.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext}),l=l.sibling;return Xt(Jt,Jt.current&1|2),s.child}i=i.sibling}S.tail!==null&&Qt()>vo&&(s.flags|=128,u=!0,Ua(S,!1),s.lanes=4194304)}else{if(!u)if(i=Gl(R),i!==null){if(s.flags|=128,u=!0,l=i.updateQueue,l!==null&&(s.updateQueue=l,s.flags|=4),Ua(S,!0),S.tail===null&&S.tailMode==="hidden"&&!R.alternate&&!Zt)return An(s),null}else 2*Qt()-S.renderingStartTime>vo&&l!==1073741824&&(s.flags|=128,u=!0,Ua(S,!1),s.lanes=4194304);S.isBackwards?(R.sibling=s.child,s.child=R):(l=S.last,l!==null?l.sibling=R:s.child=R,S.last=R)}return S.tail!==null?(s=S.tail,S.rendering=s,S.tail=s.sibling,S.renderingStartTime=Qt(),s.sibling=null,l=Jt.current,Xt(Jt,u?l&1|2:l&1),s):(An(s),null);case 22:case 23:return gd(),u=s.memoizedState!==null,i!==null&&i.memoizedState!==null!==u&&(s.flags|=8192),u&&(s.mode&1)!==0?(Jn&1073741824)!==0&&(An(s),s.subtreeFlags&6&&(s.flags|=8192)):An(s),null;case 24:return null;case 25:return null}throw Error(t(156,s.tag))}function JM(i,s){switch(bf(s),s.tag){case 1:return Hn(s.type)&&Dl(),i=s.flags,i&65536?(s.flags=i&-65537|128,s):null;case 3:return ho(),Kt(Gn),Kt(bn),kf(),i=s.flags,(i&65536)!==0&&(i&128)===0?(s.flags=i&-65537|128,s):null;case 5:return Ff(s),null;case 13:if(Kt(Jt),i=s.memoizedState,i!==null&&i.dehydrated!==null){if(s.alternate===null)throw Error(t(340));lo()}return i=s.flags,i&65536?(s.flags=i&-65537|128,s):null;case 19:return Kt(Jt),null;case 4:return ho(),null;case 10:return Df(s.type._context),null;case 22:case 23:return gd(),null;case 24:return null;default:return null}}var Zl=!1,Rn=!1,eE=typeof WeakSet=="function"?WeakSet:Set,$e=null;function mo(i,s){var l=i.ref;if(l!==null)if(typeof l=="function")try{l(null)}catch(u){nn(i,s,u)}else l.current=null}function rd(i,s,l){try{l()}catch(u){nn(i,s,u)}}var p0=!1;function tE(i,s){if(gf=vl,i=Xm(),lf(i)){if("selectionStart"in i)var l={start:i.selectionStart,end:i.selectionEnd};else e:{l=(l=i.ownerDocument)&&l.defaultView||window;var u=l.getSelection&&l.getSelection();if(u&&u.rangeCount!==0){l=u.anchorNode;var p=u.anchorOffset,S=u.focusNode;u=u.focusOffset;try{l.nodeType,S.nodeType}catch{l=null;break e}var R=0,H=-1,K=-1,de=0,be=0,Re=i,we=null;t:for(;;){for(var je;Re!==l||p!==0&&Re.nodeType!==3||(H=R+p),Re!==S||u!==0&&Re.nodeType!==3||(K=R+u),Re.nodeType===3&&(R+=Re.nodeValue.length),(je=Re.firstChild)!==null;)we=Re,Re=je;for(;;){if(Re===i)break t;if(we===l&&++de===p&&(H=R),we===S&&++be===u&&(K=R),(je=Re.nextSibling)!==null)break;Re=we,we=Re.parentNode}Re=je}l=H===-1||K===-1?null:{start:H,end:K}}else l=null}l=l||{start:0,end:0}}else l=null;for(vf={focusedElem:i,selectionRange:l},vl=!1,$e=s;$e!==null;)if(s=$e,i=s.child,(s.subtreeFlags&1028)!==0&&i!==null)i.return=s,$e=i;else for(;$e!==null;){s=$e;try{var Ye=s.alternate;if((s.flags&1024)!==0)switch(s.tag){case 0:case 11:case 15:break;case 1:if(Ye!==null){var Ze=Ye.memoizedProps,rn=Ye.memoizedState,se=s.stateNode,J=se.getSnapshotBeforeUpdate(s.elementType===s.type?Ze:Mi(s.type,Ze),rn);se.__reactInternalSnapshotBeforeUpdate=J}break;case 3:var ue=s.stateNode.containerInfo;ue.nodeType===1?ue.textContent="":ue.nodeType===9&&ue.documentElement&&ue.removeChild(ue.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(De){nn(s,s.return,De)}if(i=s.sibling,i!==null){i.return=s.return,$e=i;break}$e=s.return}return Ye=p0,p0=!1,Ye}function Fa(i,s,l){var u=s.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var p=u=u.next;do{if((p.tag&i)===i){var S=p.destroy;p.destroy=void 0,S!==void 0&&rd(s,l,S)}p=p.next}while(p!==u)}}function Ql(i,s){if(s=s.updateQueue,s=s!==null?s.lastEffect:null,s!==null){var l=s=s.next;do{if((l.tag&i)===i){var u=l.create;l.destroy=u()}l=l.next}while(l!==s)}}function sd(i){var s=i.ref;if(s!==null){var l=i.stateNode;switch(i.tag){case 5:i=l;break;default:i=l}typeof s=="function"?s(i):s.current=i}}function m0(i){var s=i.alternate;s!==null&&(i.alternate=null,m0(s)),i.child=null,i.deletions=null,i.sibling=null,i.tag===5&&(s=i.stateNode,s!==null&&(delete s[Oi],delete s[ba],delete s[Sf],delete s[OM],delete s[kM])),i.stateNode=null,i.return=null,i.dependencies=null,i.memoizedProps=null,i.memoizedState=null,i.pendingProps=null,i.stateNode=null,i.updateQueue=null}function g0(i){return i.tag===5||i.tag===3||i.tag===4}function v0(i){e:for(;;){for(;i.sibling===null;){if(i.return===null||g0(i.return))return null;i=i.return}for(i.sibling.return=i.return,i=i.sibling;i.tag!==5&&i.tag!==6&&i.tag!==18;){if(i.flags&2||i.child===null||i.tag===4)continue e;i.child.return=i,i=i.child}if(!(i.flags&2))return i.stateNode}}function od(i,s,l){var u=i.tag;if(u===5||u===6)i=i.stateNode,s?l.nodeType===8?l.parentNode.insertBefore(i,s):l.insertBefore(i,s):(l.nodeType===8?(s=l.parentNode,s.insertBefore(i,l)):(s=l,s.appendChild(i)),l=l._reactRootContainer,l!=null||s.onclick!==null||(s.onclick=Cl));else if(u!==4&&(i=i.child,i!==null))for(od(i,s,l),i=i.sibling;i!==null;)od(i,s,l),i=i.sibling}function ad(i,s,l){var u=i.tag;if(u===5||u===6)i=i.stateNode,s?l.insertBefore(i,s):l.appendChild(i);else if(u!==4&&(i=i.child,i!==null))for(ad(i,s,l),i=i.sibling;i!==null;)ad(i,s,l),i=i.sibling}var Sn=null,Ei=!1;function Hr(i,s,l){for(l=l.child;l!==null;)_0(i,s,l),l=l.sibling}function _0(i,s,l){if(Fe&&typeof Fe.onCommitFiberUnmount=="function")try{Fe.onCommitFiberUnmount(ae,l)}catch{}switch(l.tag){case 5:Rn||mo(l,s);case 6:var u=Sn,p=Ei;Sn=null,Hr(i,s,l),Sn=u,Ei=p,Sn!==null&&(Ei?(i=Sn,l=l.stateNode,i.nodeType===8?i.parentNode.removeChild(l):i.removeChild(l)):Sn.removeChild(l.stateNode));break;case 18:Sn!==null&&(Ei?(i=Sn,l=l.stateNode,i.nodeType===8?yf(i.parentNode,l):i.nodeType===1&&yf(i,l),pa(i)):yf(Sn,l.stateNode));break;case 4:u=Sn,p=Ei,Sn=l.stateNode.containerInfo,Ei=!0,Hr(i,s,l),Sn=u,Ei=p;break;case 0:case 11:case 14:case 15:if(!Rn&&(u=l.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){p=u=u.next;do{var S=p,R=S.destroy;S=S.tag,R!==void 0&&((S&2)!==0||(S&4)!==0)&&rd(l,s,R),p=p.next}while(p!==u)}Hr(i,s,l);break;case 1:if(!Rn&&(mo(l,s),u=l.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=l.memoizedProps,u.state=l.memoizedState,u.componentWillUnmount()}catch(H){nn(l,s,H)}Hr(i,s,l);break;case 21:Hr(i,s,l);break;case 22:l.mode&1?(Rn=(u=Rn)||l.memoizedState!==null,Hr(i,s,l),Rn=u):Hr(i,s,l);break;default:Hr(i,s,l)}}function x0(i){var s=i.updateQueue;if(s!==null){i.updateQueue=null;var l=i.stateNode;l===null&&(l=i.stateNode=new eE),s.forEach(function(u){var p=uE.bind(null,i,u);l.has(u)||(l.add(u),u.then(p,p))})}}function wi(i,s){var l=s.deletions;if(l!==null)for(var u=0;u<l.length;u++){var p=l[u];try{var S=i,R=s,H=R;e:for(;H!==null;){switch(H.tag){case 5:Sn=H.stateNode,Ei=!1;break e;case 3:Sn=H.stateNode.containerInfo,Ei=!0;break e;case 4:Sn=H.stateNode.containerInfo,Ei=!0;break e}H=H.return}if(Sn===null)throw Error(t(160));_0(S,R,p),Sn=null,Ei=!1;var K=p.alternate;K!==null&&(K.return=null),p.return=null}catch(de){nn(p,s,de)}}if(s.subtreeFlags&12854)for(s=s.child;s!==null;)y0(s,i),s=s.sibling}function y0(i,s){var l=i.alternate,u=i.flags;switch(i.tag){case 0:case 11:case 14:case 15:if(wi(s,i),Bi(i),u&4){try{Fa(3,i,i.return),Ql(3,i)}catch(Ze){nn(i,i.return,Ze)}try{Fa(5,i,i.return)}catch(Ze){nn(i,i.return,Ze)}}break;case 1:wi(s,i),Bi(i),u&512&&l!==null&&mo(l,l.return);break;case 5:if(wi(s,i),Bi(i),u&512&&l!==null&&mo(l,l.return),i.flags&32){var p=i.stateNode;try{Me(p,"")}catch(Ze){nn(i,i.return,Ze)}}if(u&4&&(p=i.stateNode,p!=null)){var S=i.memoizedProps,R=l!==null?l.memoizedProps:S,H=i.type,K=i.updateQueue;if(i.updateQueue=null,K!==null)try{H==="input"&&S.type==="radio"&&S.name!=null&&st(p,S),Le(H,R);var de=Le(H,S);for(R=0;R<K.length;R+=2){var be=K[R],Re=K[R+1];be==="style"?xe(p,Re):be==="dangerouslySetInnerHTML"?_e(p,Re):be==="children"?Me(p,Re):N(p,be,Re,de)}switch(H){case"input":Ct(p,S);break;case"textarea":ke(p,S);break;case"select":var we=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!S.multiple;var je=S.value;je!=null?zt(p,!!S.multiple,je,!1):we!==!!S.multiple&&(S.defaultValue!=null?zt(p,!!S.multiple,S.defaultValue,!0):zt(p,!!S.multiple,S.multiple?[]:"",!1))}p[ba]=S}catch(Ze){nn(i,i.return,Ze)}}break;case 6:if(wi(s,i),Bi(i),u&4){if(i.stateNode===null)throw Error(t(162));p=i.stateNode,S=i.memoizedProps;try{p.nodeValue=S}catch(Ze){nn(i,i.return,Ze)}}break;case 3:if(wi(s,i),Bi(i),u&4&&l!==null&&l.memoizedState.isDehydrated)try{pa(s.containerInfo)}catch(Ze){nn(i,i.return,Ze)}break;case 4:wi(s,i),Bi(i);break;case 13:wi(s,i),Bi(i),p=i.child,p.flags&8192&&(S=p.memoizedState!==null,p.stateNode.isHidden=S,!S||p.alternate!==null&&p.alternate.memoizedState!==null||(ud=Qt())),u&4&&x0(i);break;case 22:if(be=l!==null&&l.memoizedState!==null,i.mode&1?(Rn=(de=Rn)||be,wi(s,i),Rn=de):wi(s,i),Bi(i),u&8192){if(de=i.memoizedState!==null,(i.stateNode.isHidden=de)&&!be&&(i.mode&1)!==0)for($e=i,be=i.child;be!==null;){for(Re=$e=be;$e!==null;){switch(we=$e,je=we.child,we.tag){case 0:case 11:case 14:case 15:Fa(4,we,we.return);break;case 1:mo(we,we.return);var Ye=we.stateNode;if(typeof Ye.componentWillUnmount=="function"){u=we,l=we.return;try{s=u,Ye.props=s.memoizedProps,Ye.state=s.memoizedState,Ye.componentWillUnmount()}catch(Ze){nn(u,l,Ze)}}break;case 5:mo(we,we.return);break;case 22:if(we.memoizedState!==null){E0(Re);continue}}je!==null?(je.return=we,$e=je):E0(Re)}be=be.sibling}e:for(be=null,Re=i;;){if(Re.tag===5){if(be===null){be=Re;try{p=Re.stateNode,de?(S=p.style,typeof S.setProperty=="function"?S.setProperty("display","none","important"):S.display="none"):(H=Re.stateNode,K=Re.memoizedProps.style,R=K!=null&&K.hasOwnProperty("display")?K.display:null,H.style.display=me("display",R))}catch(Ze){nn(i,i.return,Ze)}}}else if(Re.tag===6){if(be===null)try{Re.stateNode.nodeValue=de?"":Re.memoizedProps}catch(Ze){nn(i,i.return,Ze)}}else if((Re.tag!==22&&Re.tag!==23||Re.memoizedState===null||Re===i)&&Re.child!==null){Re.child.return=Re,Re=Re.child;continue}if(Re===i)break e;for(;Re.sibling===null;){if(Re.return===null||Re.return===i)break e;be===Re&&(be=null),Re=Re.return}be===Re&&(be=null),Re.sibling.return=Re.return,Re=Re.sibling}}break;case 19:wi(s,i),Bi(i),u&4&&x0(i);break;case 21:break;default:wi(s,i),Bi(i)}}function Bi(i){var s=i.flags;if(s&2){try{e:{for(var l=i.return;l!==null;){if(g0(l)){var u=l;break e}l=l.return}throw Error(t(160))}switch(u.tag){case 5:var p=u.stateNode;u.flags&32&&(Me(p,""),u.flags&=-33);var S=v0(i);ad(i,S,p);break;case 3:case 4:var R=u.stateNode.containerInfo,H=v0(i);od(i,H,R);break;default:throw Error(t(161))}}catch(K){nn(i,i.return,K)}i.flags&=-3}s&4096&&(i.flags&=-4097)}function nE(i,s,l){$e=i,S0(i)}function S0(i,s,l){for(var u=(i.mode&1)!==0;$e!==null;){var p=$e,S=p.child;if(p.tag===22&&u){var R=p.memoizedState!==null||Zl;if(!R){var H=p.alternate,K=H!==null&&H.memoizedState!==null||Rn;H=Zl;var de=Rn;if(Zl=R,(Rn=K)&&!de)for($e=p;$e!==null;)R=$e,K=R.child,R.tag===22&&R.memoizedState!==null?w0(p):K!==null?(K.return=R,$e=K):w0(p);for(;S!==null;)$e=S,S0(S),S=S.sibling;$e=p,Zl=H,Rn=de}M0(i)}else(p.subtreeFlags&8772)!==0&&S!==null?(S.return=p,$e=S):M0(i)}}function M0(i){for(;$e!==null;){var s=$e;if((s.flags&8772)!==0){var l=s.alternate;try{if((s.flags&8772)!==0)switch(s.tag){case 0:case 11:case 15:Rn||Ql(5,s);break;case 1:var u=s.stateNode;if(s.flags&4&&!Rn)if(l===null)u.componentDidMount();else{var p=s.elementType===s.type?l.memoizedProps:Mi(s.type,l.memoizedProps);u.componentDidUpdate(p,l.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var S=s.updateQueue;S!==null&&Eg(s,S,u);break;case 3:var R=s.updateQueue;if(R!==null){if(l=null,s.child!==null)switch(s.child.tag){case 5:l=s.child.stateNode;break;case 1:l=s.child.stateNode}Eg(s,R,l)}break;case 5:var H=s.stateNode;if(l===null&&s.flags&4){l=H;var K=s.memoizedProps;switch(s.type){case"button":case"input":case"select":case"textarea":K.autoFocus&&l.focus();break;case"img":K.src&&(l.src=K.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(s.memoizedState===null){var de=s.alternate;if(de!==null){var be=de.memoizedState;if(be!==null){var Re=be.dehydrated;Re!==null&&pa(Re)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}Rn||s.flags&512&&sd(s)}catch(we){nn(s,s.return,we)}}if(s===i){$e=null;break}if(l=s.sibling,l!==null){l.return=s.return,$e=l;break}$e=s.return}}function E0(i){for(;$e!==null;){var s=$e;if(s===i){$e=null;break}var l=s.sibling;if(l!==null){l.return=s.return,$e=l;break}$e=s.return}}function w0(i){for(;$e!==null;){var s=$e;try{switch(s.tag){case 0:case 11:case 15:var l=s.return;try{Ql(4,s)}catch(K){nn(s,l,K)}break;case 1:var u=s.stateNode;if(typeof u.componentDidMount=="function"){var p=s.return;try{u.componentDidMount()}catch(K){nn(s,p,K)}}var S=s.return;try{sd(s)}catch(K){nn(s,S,K)}break;case 5:var R=s.return;try{sd(s)}catch(K){nn(s,R,K)}}}catch(K){nn(s,s.return,K)}if(s===i){$e=null;break}var H=s.sibling;if(H!==null){H.return=s.return,$e=H;break}$e=s.return}}var iE=Math.ceil,Jl=C.ReactCurrentDispatcher,ld=C.ReactCurrentOwner,ci=C.ReactCurrentBatchConfig,Rt=0,vn=null,ln=null,Mn=0,Jn=0,go=kr(0),dn=0,Oa=null,Ts=0,ec=0,cd=0,ka=null,jn=null,ud=0,vo=1/0,dr=null,tc=!1,fd=null,Wr=null,nc=!1,jr=null,ic=0,za=0,dd=null,rc=-1,sc=0;function Un(){return(Rt&6)!==0?Qt():rc!==-1?rc:rc=Qt()}function Xr(i){return(i.mode&1)===0?1:(Rt&2)!==0&&Mn!==0?Mn&-Mn:BM.transition!==null?(sc===0&&(sc=We()),sc):(i=St,i!==0||(i=window.event,i=i===void 0?16:Tm(i.type)),i)}function bi(i,s,l,u){if(50<za)throw za=0,dd=null,Error(t(185));yt(i,l,u),((Rt&2)===0||i!==vn)&&(i===vn&&((Rt&2)===0&&(ec|=l),dn===4&&$r(i,Mn)),Xn(i,u),l===1&&Rt===0&&(s.mode&1)===0&&(vo=Qt()+500,Ll&&Br()))}function Xn(i,s){var l=i.callbackNode;Ft(i,s);var u=jt(i,i===vn?Mn:0);if(u===0)l!==null&&ml(l),i.callbackNode=null,i.callbackPriority=0;else if(s=u&-u,i.callbackPriority!==s){if(l!=null&&ml(l),s===1)i.tag===0?zM(T0.bind(null,i)):fg(T0.bind(null,i)),UM(function(){(Rt&6)===0&&Br()}),l=null;else{switch(rr(u)){case 1:l=ca;break;case 4:l=D;break;case 16:l=ee;break;case 536870912:l=le;break;default:l=ee}l=I0(l,b0.bind(null,i))}i.callbackPriority=s,i.callbackNode=l}}function b0(i,s){if(rc=-1,sc=0,(Rt&6)!==0)throw Error(t(327));var l=i.callbackNode;if(_o()&&i.callbackNode!==l)return null;var u=jt(i,i===vn?Mn:0);if(u===0)return null;if((u&30)!==0||(u&i.expiredLanes)!==0||s)s=oc(i,u);else{s=u;var p=Rt;Rt|=2;var S=R0();(vn!==i||Mn!==s)&&(dr=null,vo=Qt()+500,Rs(i,s));do try{oE();break}catch(H){A0(i,H)}while(!0);Pf(),Jl.current=S,Rt=p,ln!==null?s=0:(vn=null,Mn=0,s=dn)}if(s!==0){if(s===2&&(p=an(i),p!==0&&(u=p,s=hd(i,p))),s===1)throw l=Oa,Rs(i,0),$r(i,u),Xn(i,Qt()),l;if(s===6)$r(i,u);else{if(p=i.current.alternate,(u&30)===0&&!rE(p)&&(s=oc(i,u),s===2&&(S=an(i),S!==0&&(u=S,s=hd(i,S))),s===1))throw l=Oa,Rs(i,0),$r(i,u),Xn(i,Qt()),l;switch(i.finishedWork=p,i.finishedLanes=u,s){case 0:case 1:throw Error(t(345));case 2:Cs(i,jn,dr);break;case 3:if($r(i,u),(u&130023424)===u&&(s=ud+500-Qt(),10<s)){if(jt(i,0)!==0)break;if(p=i.suspendedLanes,(p&u)!==u){Un(),i.pingedLanes|=i.suspendedLanes&p;break}i.timeoutHandle=xf(Cs.bind(null,i,jn,dr),s);break}Cs(i,jn,dr);break;case 4:if($r(i,u),(u&4194240)===u)break;for(s=i.eventTimes,p=-1;0<u;){var R=31-Ie(u);S=1<<R,R=s[R],R>p&&(p=R),u&=~S}if(u=p,u=Qt()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*iE(u/1960))-u,10<u){i.timeoutHandle=xf(Cs.bind(null,i,jn,dr),u);break}Cs(i,jn,dr);break;case 5:Cs(i,jn,dr);break;default:throw Error(t(329))}}}return Xn(i,Qt()),i.callbackNode===l?b0.bind(null,i):null}function hd(i,s){var l=ka;return i.current.memoizedState.isDehydrated&&(Rs(i,s).flags|=256),i=oc(i,s),i!==2&&(s=jn,jn=l,s!==null&&pd(s)),i}function pd(i){jn===null?jn=i:jn.push.apply(jn,i)}function rE(i){for(var s=i;;){if(s.flags&16384){var l=s.updateQueue;if(l!==null&&(l=l.stores,l!==null))for(var u=0;u<l.length;u++){var p=l[u],S=p.getSnapshot;p=p.value;try{if(!yi(S(),p))return!1}catch{return!1}}}if(l=s.child,s.subtreeFlags&16384&&l!==null)l.return=s,s=l;else{if(s===i)break;for(;s.sibling===null;){if(s.return===null||s.return===i)return!0;s=s.return}s.sibling.return=s.return,s=s.sibling}}return!0}function $r(i,s){for(s&=~cd,s&=~ec,i.suspendedLanes|=s,i.pingedLanes&=~s,i=i.expirationTimes;0<s;){var l=31-Ie(s),u=1<<l;i[l]=-1,s&=~u}}function T0(i){if((Rt&6)!==0)throw Error(t(327));_o();var s=jt(i,0);if((s&1)===0)return Xn(i,Qt()),null;var l=oc(i,s);if(i.tag!==0&&l===2){var u=an(i);u!==0&&(s=u,l=hd(i,u))}if(l===1)throw l=Oa,Rs(i,0),$r(i,s),Xn(i,Qt()),l;if(l===6)throw Error(t(345));return i.finishedWork=i.current.alternate,i.finishedLanes=s,Cs(i,jn,dr),Xn(i,Qt()),null}function md(i,s){var l=Rt;Rt|=1;try{return i(s)}finally{Rt=l,Rt===0&&(vo=Qt()+500,Ll&&Br())}}function As(i){jr!==null&&jr.tag===0&&(Rt&6)===0&&_o();var s=Rt;Rt|=1;var l=ci.transition,u=St;try{if(ci.transition=null,St=1,i)return i()}finally{St=u,ci.transition=l,Rt=s,(Rt&6)===0&&Br()}}function gd(){Jn=go.current,Kt(go)}function Rs(i,s){i.finishedWork=null,i.finishedLanes=0;var l=i.timeoutHandle;if(l!==-1&&(i.timeoutHandle=-1,IM(l)),ln!==null)for(l=ln.return;l!==null;){var u=l;switch(bf(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Dl();break;case 3:ho(),Kt(Gn),Kt(bn),kf();break;case 5:Ff(u);break;case 4:ho();break;case 13:Kt(Jt);break;case 19:Kt(Jt);break;case 10:Df(u.type._context);break;case 22:case 23:gd()}l=l.return}if(vn=i,ln=i=Yr(i.current,null),Mn=Jn=s,dn=0,Oa=null,cd=ec=Ts=0,jn=ka=null,Es!==null){for(s=0;s<Es.length;s++)if(l=Es[s],u=l.interleaved,u!==null){l.interleaved=null;var p=u.next,S=l.pending;if(S!==null){var R=S.next;S.next=p,u.next=R}l.pending=u}Es=null}return i}function A0(i,s){do{var l=ln;try{if(Pf(),Hl.current=$l,Wl){for(var u=en.memoizedState;u!==null;){var p=u.queue;p!==null&&(p.pending=null),u=u.next}Wl=!1}if(bs=0,gn=fn=en=null,Da=!1,Na=0,ld.current=null,l===null||l.return===null){dn=1,Oa=s,ln=null;break}e:{var S=i,R=l.return,H=l,K=s;if(s=Mn,H.flags|=32768,K!==null&&typeof K=="object"&&typeof K.then=="function"){var de=K,be=H,Re=be.tag;if((be.mode&1)===0&&(Re===0||Re===11||Re===15)){var we=be.alternate;we?(be.updateQueue=we.updateQueue,be.memoizedState=we.memoizedState,be.lanes=we.lanes):(be.updateQueue=null,be.memoizedState=null)}var je=Qg(R);if(je!==null){je.flags&=-257,Jg(je,R,H,S,s),je.mode&1&&Zg(S,de,s),s=je,K=de;var Ye=s.updateQueue;if(Ye===null){var Ze=new Set;Ze.add(K),s.updateQueue=Ze}else Ye.add(K);break e}else{if((s&1)===0){Zg(S,de,s),vd();break e}K=Error(t(426))}}else if(Zt&&H.mode&1){var rn=Qg(R);if(rn!==null){(rn.flags&65536)===0&&(rn.flags|=256),Jg(rn,R,H,S,s),Rf(po(K,H));break e}}S=K=po(K,H),dn!==4&&(dn=2),ka===null?ka=[S]:ka.push(S),S=R;do{switch(S.tag){case 3:S.flags|=65536,s&=-s,S.lanes|=s;var se=Kg(S,K,s);Mg(S,se);break e;case 1:H=K;var J=S.type,ue=S.stateNode;if((S.flags&128)===0&&(typeof J.getDerivedStateFromError=="function"||ue!==null&&typeof ue.componentDidCatch=="function"&&(Wr===null||!Wr.has(ue)))){S.flags|=65536,s&=-s,S.lanes|=s;var De=qg(S,H,s);Mg(S,De);break e}}S=S.return}while(S!==null)}P0(l)}catch(et){s=et,ln===l&&l!==null&&(ln=l=l.return);continue}break}while(!0)}function R0(){var i=Jl.current;return Jl.current=$l,i===null?$l:i}function vd(){(dn===0||dn===3||dn===2)&&(dn=4),vn===null||(Ts&268435455)===0&&(ec&268435455)===0||$r(vn,Mn)}function oc(i,s){var l=Rt;Rt|=2;var u=R0();(vn!==i||Mn!==s)&&(dr=null,Rs(i,s));do try{sE();break}catch(p){A0(i,p)}while(!0);if(Pf(),Rt=l,Jl.current=u,ln!==null)throw Error(t(261));return vn=null,Mn=0,dn}function sE(){for(;ln!==null;)C0(ln)}function oE(){for(;ln!==null&&!$u();)C0(ln)}function C0(i){var s=L0(i.alternate,i,Jn);i.memoizedProps=i.pendingProps,s===null?P0(i):ln=s,ld.current=null}function P0(i){var s=i;do{var l=s.alternate;if(i=s.return,(s.flags&32768)===0){if(l=QM(l,s,Jn),l!==null){ln=l;return}}else{if(l=JM(l,s),l!==null){l.flags&=32767,ln=l;return}if(i!==null)i.flags|=32768,i.subtreeFlags=0,i.deletions=null;else{dn=6,ln=null;return}}if(s=s.sibling,s!==null){ln=s;return}ln=s=i}while(s!==null);dn===0&&(dn=5)}function Cs(i,s,l){var u=St,p=ci.transition;try{ci.transition=null,St=1,aE(i,s,l,u)}finally{ci.transition=p,St=u}return null}function aE(i,s,l,u){do _o();while(jr!==null);if((Rt&6)!==0)throw Error(t(327));l=i.finishedWork;var p=i.finishedLanes;if(l===null)return null;if(i.finishedWork=null,i.finishedLanes=0,l===i.current)throw Error(t(177));i.callbackNode=null,i.callbackPriority=0;var S=l.lanes|l.childLanes;if(Bn(i,S),i===vn&&(ln=vn=null,Mn=0),(l.subtreeFlags&2064)===0&&(l.flags&2064)===0||nc||(nc=!0,I0(ee,function(){return _o(),null})),S=(l.flags&15990)!==0,(l.subtreeFlags&15990)!==0||S){S=ci.transition,ci.transition=null;var R=St;St=1;var H=Rt;Rt|=4,ld.current=null,tE(i,l),y0(l,i),AM(vf),vl=!!gf,vf=gf=null,i.current=l,nE(l),Yu(),Rt=H,St=R,ci.transition=S}else i.current=l;if(nc&&(nc=!1,jr=i,ic=p),S=i.pendingLanes,S===0&&(Wr=null),Xe(l.stateNode),Xn(i,Qt()),s!==null)for(u=i.onRecoverableError,l=0;l<s.length;l++)p=s[l],u(p.value,{componentStack:p.stack,digest:p.digest});if(tc)throw tc=!1,i=fd,fd=null,i;return(ic&1)!==0&&i.tag!==0&&_o(),S=i.pendingLanes,(S&1)!==0?i===dd?za++:(za=0,dd=i):za=0,Br(),null}function _o(){if(jr!==null){var i=rr(ic),s=ci.transition,l=St;try{if(ci.transition=null,St=16>i?16:i,jr===null)var u=!1;else{if(i=jr,jr=null,ic=0,(Rt&6)!==0)throw Error(t(331));var p=Rt;for(Rt|=4,$e=i.current;$e!==null;){var S=$e,R=S.child;if(($e.flags&16)!==0){var H=S.deletions;if(H!==null){for(var K=0;K<H.length;K++){var de=H[K];for($e=de;$e!==null;){var be=$e;switch(be.tag){case 0:case 11:case 15:Fa(8,be,S)}var Re=be.child;if(Re!==null)Re.return=be,$e=Re;else for(;$e!==null;){be=$e;var we=be.sibling,je=be.return;if(m0(be),be===de){$e=null;break}if(we!==null){we.return=je,$e=we;break}$e=je}}}var Ye=S.alternate;if(Ye!==null){var Ze=Ye.child;if(Ze!==null){Ye.child=null;do{var rn=Ze.sibling;Ze.sibling=null,Ze=rn}while(Ze!==null)}}$e=S}}if((S.subtreeFlags&2064)!==0&&R!==null)R.return=S,$e=R;else e:for(;$e!==null;){if(S=$e,(S.flags&2048)!==0)switch(S.tag){case 0:case 11:case 15:Fa(9,S,S.return)}var se=S.sibling;if(se!==null){se.return=S.return,$e=se;break e}$e=S.return}}var J=i.current;for($e=J;$e!==null;){R=$e;var ue=R.child;if((R.subtreeFlags&2064)!==0&&ue!==null)ue.return=R,$e=ue;else e:for(R=J;$e!==null;){if(H=$e,(H.flags&2048)!==0)try{switch(H.tag){case 0:case 11:case 15:Ql(9,H)}}catch(et){nn(H,H.return,et)}if(H===R){$e=null;break e}var De=H.sibling;if(De!==null){De.return=H.return,$e=De;break e}$e=H.return}}if(Rt=p,Br(),Fe&&typeof Fe.onPostCommitFiberRoot=="function")try{Fe.onPostCommitFiberRoot(ae,i)}catch{}u=!0}return u}finally{St=l,ci.transition=s}}return!1}function D0(i,s,l){s=po(l,s),s=Kg(i,s,1),i=Gr(i,s,1),s=Un(),i!==null&&(yt(i,1,s),Xn(i,s))}function nn(i,s,l){if(i.tag===3)D0(i,i,l);else for(;s!==null;){if(s.tag===3){D0(s,i,l);break}else if(s.tag===1){var u=s.stateNode;if(typeof s.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(Wr===null||!Wr.has(u))){i=po(l,i),i=qg(s,i,1),s=Gr(s,i,1),i=Un(),s!==null&&(yt(s,1,i),Xn(s,i));break}}s=s.return}}function lE(i,s,l){var u=i.pingCache;u!==null&&u.delete(s),s=Un(),i.pingedLanes|=i.suspendedLanes&l,vn===i&&(Mn&l)===l&&(dn===4||dn===3&&(Mn&130023424)===Mn&&500>Qt()-ud?Rs(i,0):cd|=l),Xn(i,s)}function N0(i,s){s===0&&((i.mode&1)===0?s=1:(s=Je,Je<<=1,(Je&130023424)===0&&(Je=4194304)));var l=Un();i=cr(i,s),i!==null&&(yt(i,s,l),Xn(i,l))}function cE(i){var s=i.memoizedState,l=0;s!==null&&(l=s.retryLane),N0(i,l)}function uE(i,s){var l=0;switch(i.tag){case 13:var u=i.stateNode,p=i.memoizedState;p!==null&&(l=p.retryLane);break;case 19:u=i.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(s),N0(i,l)}var L0;L0=function(i,s,l){if(i!==null)if(i.memoizedProps!==s.pendingProps||Gn.current)Wn=!0;else{if((i.lanes&l)===0&&(s.flags&128)===0)return Wn=!1,ZM(i,s,l);Wn=(i.flags&131072)!==0}else Wn=!1,Zt&&(s.flags&1048576)!==0&&dg(s,Ul,s.index);switch(s.lanes=0,s.tag){case 2:var u=s.type;ql(i,s),i=s.pendingProps;var p=so(s,bn.current);fo(s,l),p=Vf(null,s,u,i,p,l);var S=Gf();return s.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(s.tag=1,s.memoizedState=null,s.updateQueue=null,Hn(u)?(S=!0,Nl(s)):S=!1,s.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,If(s),p.updater=Yl,s.stateNode=p,p._reactInternals=s,Yf(s,u,i,l),s=Qf(null,s,u,!0,S,l)):(s.tag=0,Zt&&S&&wf(s),In(null,s,p,l),s=s.child),s;case 16:u=s.elementType;e:{switch(ql(i,s),i=s.pendingProps,p=u._init,u=p(u._payload),s.type=u,p=s.tag=dE(u),i=Mi(u,i),p){case 0:s=Zf(null,s,u,i,l);break e;case 1:s=s0(null,s,u,i,l);break e;case 11:s=e0(null,s,u,i,l);break e;case 14:s=t0(null,s,u,Mi(u.type,i),l);break e}throw Error(t(306,u,""))}return s;case 0:return u=s.type,p=s.pendingProps,p=s.elementType===u?p:Mi(u,p),Zf(i,s,u,p,l);case 1:return u=s.type,p=s.pendingProps,p=s.elementType===u?p:Mi(u,p),s0(i,s,u,p,l);case 3:e:{if(o0(s),i===null)throw Error(t(387));u=s.pendingProps,S=s.memoizedState,p=S.element,Sg(i,s),Vl(s,u,null,l);var R=s.memoizedState;if(u=R.element,S.isDehydrated)if(S={element:u,isDehydrated:!1,cache:R.cache,pendingSuspenseBoundaries:R.pendingSuspenseBoundaries,transitions:R.transitions},s.updateQueue.baseState=S,s.memoizedState=S,s.flags&256){p=po(Error(t(423)),s),s=a0(i,s,u,l,p);break e}else if(u!==p){p=po(Error(t(424)),s),s=a0(i,s,u,l,p);break e}else for(Qn=Or(s.stateNode.containerInfo.firstChild),Zn=s,Zt=!0,Si=null,l=xg(s,null,u,l),s.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(lo(),u===p){s=fr(i,s,l);break e}In(i,s,u,l)}s=s.child}return s;case 5:return wg(s),i===null&&Af(s),u=s.type,p=s.pendingProps,S=i!==null?i.memoizedProps:null,R=p.children,_f(u,p)?R=null:S!==null&&_f(u,S)&&(s.flags|=32),r0(i,s),In(i,s,R,l),s.child;case 6:return i===null&&Af(s),null;case 13:return l0(i,s,l);case 4:return Uf(s,s.stateNode.containerInfo),u=s.pendingProps,i===null?s.child=co(s,null,u,l):In(i,s,u,l),s.child;case 11:return u=s.type,p=s.pendingProps,p=s.elementType===u?p:Mi(u,p),e0(i,s,u,p,l);case 7:return In(i,s,s.pendingProps,l),s.child;case 8:return In(i,s,s.pendingProps.children,l),s.child;case 12:return In(i,s,s.pendingProps.children,l),s.child;case 10:e:{if(u=s.type._context,p=s.pendingProps,S=s.memoizedProps,R=p.value,Xt(kl,u._currentValue),u._currentValue=R,S!==null)if(yi(S.value,R)){if(S.children===p.children&&!Gn.current){s=fr(i,s,l);break e}}else for(S=s.child,S!==null&&(S.return=s);S!==null;){var H=S.dependencies;if(H!==null){R=S.child;for(var K=H.firstContext;K!==null;){if(K.context===u){if(S.tag===1){K=ur(-1,l&-l),K.tag=2;var de=S.updateQueue;if(de!==null){de=de.shared;var be=de.pending;be===null?K.next=K:(K.next=be.next,be.next=K),de.pending=K}}S.lanes|=l,K=S.alternate,K!==null&&(K.lanes|=l),Nf(S.return,l,s),H.lanes|=l;break}K=K.next}}else if(S.tag===10)R=S.type===s.type?null:S.child;else if(S.tag===18){if(R=S.return,R===null)throw Error(t(341));R.lanes|=l,H=R.alternate,H!==null&&(H.lanes|=l),Nf(R,l,s),R=S.sibling}else R=S.child;if(R!==null)R.return=S;else for(R=S;R!==null;){if(R===s){R=null;break}if(S=R.sibling,S!==null){S.return=R.return,R=S;break}R=R.return}S=R}In(i,s,p.children,l),s=s.child}return s;case 9:return p=s.type,u=s.pendingProps.children,fo(s,l),p=ai(p),u=u(p),s.flags|=1,In(i,s,u,l),s.child;case 14:return u=s.type,p=Mi(u,s.pendingProps),p=Mi(u.type,p),t0(i,s,u,p,l);case 15:return n0(i,s,s.type,s.pendingProps,l);case 17:return u=s.type,p=s.pendingProps,p=s.elementType===u?p:Mi(u,p),ql(i,s),s.tag=1,Hn(u)?(i=!0,Nl(s)):i=!1,fo(s,l),$g(s,u,p),Yf(s,u,p,l),Qf(null,s,u,!0,i,l);case 19:return u0(i,s,l);case 22:return i0(i,s,l)}throw Error(t(156,s.tag))};function I0(i,s){return pl(i,s)}function fE(i,s,l,u){this.tag=i,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=s,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ui(i,s,l,u){return new fE(i,s,l,u)}function _d(i){return i=i.prototype,!(!i||!i.isReactComponent)}function dE(i){if(typeof i=="function")return _d(i)?1:0;if(i!=null){if(i=i.$$typeof,i===Z)return 11;if(i===G)return 14}return 2}function Yr(i,s){var l=i.alternate;return l===null?(l=ui(i.tag,s,i.key,i.mode),l.elementType=i.elementType,l.type=i.type,l.stateNode=i.stateNode,l.alternate=i,i.alternate=l):(l.pendingProps=s,l.type=i.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=i.flags&14680064,l.childLanes=i.childLanes,l.lanes=i.lanes,l.child=i.child,l.memoizedProps=i.memoizedProps,l.memoizedState=i.memoizedState,l.updateQueue=i.updateQueue,s=i.dependencies,l.dependencies=s===null?null:{lanes:s.lanes,firstContext:s.firstContext},l.sibling=i.sibling,l.index=i.index,l.ref=i.ref,l}function ac(i,s,l,u,p,S){var R=2;if(u=i,typeof i=="function")_d(i)&&(R=1);else if(typeof i=="string")R=5;else e:switch(i){case F:return Ps(l.children,p,S,s);case b:R=8,p|=8;break;case O:return i=ui(12,l,s,p|2),i.elementType=O,i.lanes=S,i;case ne:return i=ui(13,l,s,p),i.elementType=ne,i.lanes=S,i;case ce:return i=ui(19,l,s,p),i.elementType=ce,i.lanes=S,i;case j:return lc(l,p,S,s);default:if(typeof i=="object"&&i!==null)switch(i.$$typeof){case X:R=10;break e;case B:R=9;break e;case Z:R=11;break e;case G:R=14;break e;case Y:R=16,u=null;break e}throw Error(t(130,i==null?i:typeof i,""))}return s=ui(R,l,s,p),s.elementType=i,s.type=u,s.lanes=S,s}function Ps(i,s,l,u){return i=ui(7,i,u,s),i.lanes=l,i}function lc(i,s,l,u){return i=ui(22,i,u,s),i.elementType=j,i.lanes=l,i.stateNode={isHidden:!1},i}function xd(i,s,l){return i=ui(6,i,null,s),i.lanes=l,i}function yd(i,s,l){return s=ui(4,i.children!==null?i.children:[],i.key,s),s.lanes=l,s.stateNode={containerInfo:i.containerInfo,pendingChildren:null,implementation:i.implementation},s}function hE(i,s,l,u,p){this.tag=s,this.containerInfo=i,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=yn(0),this.expirationTimes=yn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=yn(0),this.identifierPrefix=u,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function Sd(i,s,l,u,p,S,R,H,K){return i=new hE(i,s,l,H,K),s===1?(s=1,S===!0&&(s|=8)):s=0,S=ui(3,null,null,s),i.current=S,S.stateNode=i,S.memoizedState={element:u,isDehydrated:l,cache:null,transitions:null,pendingSuspenseBoundaries:null},If(S),i}function pE(i,s,l){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:I,key:u==null?null:""+u,children:i,containerInfo:s,implementation:l}}function U0(i){if(!i)return zr;i=i._reactInternals;e:{if(Ui(i)!==i||i.tag!==1)throw Error(t(170));var s=i;do{switch(s.tag){case 3:s=s.stateNode.context;break e;case 1:if(Hn(s.type)){s=s.stateNode.__reactInternalMemoizedMergedChildContext;break e}}s=s.return}while(s!==null);throw Error(t(171))}if(i.tag===1){var l=i.type;if(Hn(l))return cg(i,l,s)}return s}function F0(i,s,l,u,p,S,R,H,K){return i=Sd(l,u,!0,i,p,S,R,H,K),i.context=U0(null),l=i.current,u=Un(),p=Xr(l),S=ur(u,p),S.callback=s??null,Gr(l,S,p),i.current.lanes=p,yt(i,p,u),Xn(i,u),i}function cc(i,s,l,u){var p=s.current,S=Un(),R=Xr(p);return l=U0(l),s.context===null?s.context=l:s.pendingContext=l,s=ur(S,R),s.payload={element:i},u=u===void 0?null:u,u!==null&&(s.callback=u),i=Gr(p,s,R),i!==null&&(bi(i,p,R,S),Bl(i,p,R)),R}function uc(i){if(i=i.current,!i.child)return null;switch(i.child.tag){case 5:return i.child.stateNode;default:return i.child.stateNode}}function O0(i,s){if(i=i.memoizedState,i!==null&&i.dehydrated!==null){var l=i.retryLane;i.retryLane=l!==0&&l<s?l:s}}function Md(i,s){O0(i,s),(i=i.alternate)&&O0(i,s)}function mE(){return null}var k0=typeof reportError=="function"?reportError:function(i){console.error(i)};function Ed(i){this._internalRoot=i}fc.prototype.render=Ed.prototype.render=function(i){var s=this._internalRoot;if(s===null)throw Error(t(409));cc(i,s,null,null)},fc.prototype.unmount=Ed.prototype.unmount=function(){var i=this._internalRoot;if(i!==null){this._internalRoot=null;var s=i.containerInfo;As(function(){cc(null,i,null,null)}),s[sr]=null}};function fc(i){this._internalRoot=i}fc.prototype.unstable_scheduleHydration=function(i){if(i){var s=Ot();i={blockedOn:null,target:i,priority:s};for(var l=0;l<Ir.length&&s!==0&&s<Ir[l].priority;l++);Ir.splice(l,0,i),l===0&&wm(i)}};function wd(i){return!(!i||i.nodeType!==1&&i.nodeType!==9&&i.nodeType!==11)}function dc(i){return!(!i||i.nodeType!==1&&i.nodeType!==9&&i.nodeType!==11&&(i.nodeType!==8||i.nodeValue!==" react-mount-point-unstable "))}function z0(){}function gE(i,s,l,u,p){if(p){if(typeof u=="function"){var S=u;u=function(){var de=uc(R);S.call(de)}}var R=F0(s,u,i,0,null,!1,!1,"",z0);return i._reactRootContainer=R,i[sr]=R.current,Ea(i.nodeType===8?i.parentNode:i),As(),R}for(;p=i.lastChild;)i.removeChild(p);if(typeof u=="function"){var H=u;u=function(){var de=uc(K);H.call(de)}}var K=Sd(i,0,!1,null,null,!1,!1,"",z0);return i._reactRootContainer=K,i[sr]=K.current,Ea(i.nodeType===8?i.parentNode:i),As(function(){cc(s,K,l,u)}),K}function hc(i,s,l,u,p){var S=l._reactRootContainer;if(S){var R=S;if(typeof p=="function"){var H=p;p=function(){var K=uc(R);H.call(K)}}cc(s,R,i,p)}else R=gE(l,s,i,p,u);return uc(R)}Ut=function(i){switch(i.tag){case 3:var s=i.stateNode;if(s.current.memoizedState.isDehydrated){var l=Tt(s.pendingLanes);l!==0&&(Vn(s,l|1),Xn(s,Qt()),(Rt&6)===0&&(vo=Qt()+500,Br()))}break;case 13:As(function(){var u=cr(i,1);if(u!==null){var p=Un();bi(u,i,1,p)}}),Md(i,1)}},$t=function(i){if(i.tag===13){var s=cr(i,134217728);if(s!==null){var l=Un();bi(s,i,134217728,l)}Md(i,134217728)}},_i=function(i){if(i.tag===13){var s=Xr(i),l=cr(i,s);if(l!==null){var u=Un();bi(l,i,s,u)}Md(i,s)}},Ot=function(){return St},xi=function(i,s){var l=St;try{return St=i,s()}finally{St=l}},dt=function(i,s,l){switch(s){case"input":if(Ct(i,l),s=l.name,l.type==="radio"&&s!=null){for(l=i;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll("input[name="+JSON.stringify(""+s)+'][type="radio"]'),s=0;s<l.length;s++){var u=l[s];if(u!==i&&u.form===i.form){var p=Pl(u);if(!p)throw Error(t(90));rt(u),Ct(u,p)}}}break;case"textarea":ke(i,l);break;case"select":s=l.value,s!=null&&zt(i,!!l.multiple,s,!1)}},Ue=md,Ee=As;var vE={usingClientEntryPoint:!1,Events:[Ta,io,Pl,ve,Ge,md]},Ba={findFiberByHostInstance:xs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},_E={bundleType:Ba.bundleType,version:Ba.version,rendererPackageName:Ba.rendererPackageName,rendererConfig:Ba.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:C.ReactCurrentDispatcher,findHostInstanceByFiber:function(i){return i=aa(i),i===null?null:i.stateNode},findFiberByHostInstance:Ba.findFiberByHostInstance||mE,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var pc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!pc.isDisabled&&pc.supportsFiber)try{ae=pc.inject(_E),Fe=pc}catch{}}return $n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vE,$n.createPortal=function(i,s){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!wd(s))throw Error(t(200));return pE(i,s,null,l)},$n.createRoot=function(i,s){if(!wd(i))throw Error(t(299));var l=!1,u="",p=k0;return s!=null&&(s.unstable_strictMode===!0&&(l=!0),s.identifierPrefix!==void 0&&(u=s.identifierPrefix),s.onRecoverableError!==void 0&&(p=s.onRecoverableError)),s=Sd(i,1,!1,null,null,l,!1,u,p),i[sr]=s.current,Ea(i.nodeType===8?i.parentNode:i),new Ed(s)},$n.findDOMNode=function(i){if(i==null)return null;if(i.nodeType===1)return i;var s=i._reactInternals;if(s===void 0)throw typeof i.render=="function"?Error(t(188)):(i=Object.keys(i).join(","),Error(t(268,i)));return i=aa(s),i=i===null?null:i.stateNode,i},$n.flushSync=function(i){return As(i)},$n.hydrate=function(i,s,l){if(!dc(s))throw Error(t(200));return hc(null,i,s,!0,l)},$n.hydrateRoot=function(i,s,l){if(!wd(i))throw Error(t(405));var u=l!=null&&l.hydratedSources||null,p=!1,S="",R=k0;if(l!=null&&(l.unstable_strictMode===!0&&(p=!0),l.identifierPrefix!==void 0&&(S=l.identifierPrefix),l.onRecoverableError!==void 0&&(R=l.onRecoverableError)),s=F0(s,null,i,1,l??null,p,!1,S,R),i[sr]=s.current,Ea(i),u)for(i=0;i<u.length;i++)l=u[i],p=l._getVersion,p=p(l._source),s.mutableSourceEagerHydrationData==null?s.mutableSourceEagerHydrationData=[l,p]:s.mutableSourceEagerHydrationData.push(l,p);return new fc(s)},$n.render=function(i,s,l){if(!dc(s))throw Error(t(200));return hc(null,i,s,!1,l)},$n.unmountComponentAtNode=function(i){if(!dc(i))throw Error(t(40));return i._reactRootContainer?(As(function(){hc(null,null,i,!1,function(){i._reactRootContainer=null,i[sr]=null})}),!0):!1},$n.unstable_batchedUpdates=md,$n.unstable_renderSubtreeIntoContainer=function(i,s,l,u){if(!dc(l))throw Error(t(200));if(i==null||i._reactInternals===void 0)throw Error(t(38));return hc(i,s,l,!1,u)},$n.version="18.3.1-next-f1338f8080-20240426",$n}var $0;function D_(){if($0)return Ad.exports;$0=1;function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}return n(),Ad.exports=TE(),Ad.exports}var Y0;function AE(){if(Y0)return mc;Y0=1;var n=D_();return mc.createRoot=n.createRoot,mc.hydrateRoot=n.hydrateRoot,mc}var RE=AE(),L=Ap();const un=P_(L),CE=yE({__proto__:null,default:un},[L]);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PE=n=>n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),DE=n=>n.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase()),K0=n=>{const e=DE(n);return e.charAt(0).toUpperCase()+e.slice(1)},N_=(...n)=>n.filter((e,t,r)=>!!e&&e.trim()!==""&&r.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var NE={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LE=L.forwardRef(({color:n="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:r,className:o="",children:a,iconNode:c,...f},h)=>L.createElement("svg",{ref:h,...NE,width:e,height:e,stroke:n,strokeWidth:r?Number(t)*24/Number(e):t,className:N_("lucide",o),...f},[...c.map(([d,v])=>L.createElement(d,v)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wn=(n,e)=>{const t=L.forwardRef(({className:r,...o},a)=>L.createElement(LE,{ref:a,iconNode:e,className:N_(`lucide-${PE(K0(n))}`,`lucide-${n}`,r),...o}));return t.displayName=K0(n),t};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const IE=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],UE=wn("chevron-left",IE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const FE=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],uu=wn("chevron-right",FE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OE=[["path",{d:"M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",key:"1f1r0c"}]],L_=wn("diamond",OE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kE=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],zE=wn("eye",kE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const BE=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],VE=wn("folder-open",BE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const GE=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],HE=wn("lock",GE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const WE=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],jE=wn("monitor",WE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const XE=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],$E=wn("moon",XE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const YE=[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]],KE=wn("pause",YE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qE=[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]],ZE=wn("play",qE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const QE=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],q0=wn("plus",QE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const JE=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],ew=wn("save",JE);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tw=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],nw=wn("settings",tw);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iw=[["polygon",{points:"19 20 9 12 19 4 19 20",key:"o2sva"}],["line",{x1:"5",x2:"5",y1:"19",y2:"5",key:"1ocqjk"}]],rw=wn("skip-back",iw);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sw=[["polygon",{points:"5 4 15 12 5 20 5 4",key:"16p6eg"}],["line",{x1:"19",x2:"19",y1:"5",y2:"19",key:"futhcm"}]],ow=wn("skip-forward",sw);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aw=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}]],lw=wn("square",aw);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cw=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],uw=wn("sun",cw);function lt(n,e,{checkForDefaultPrevented:t=!0}={}){return function(o){if(n==null||n(o),t===!1||!o.defaultPrevented)return e==null?void 0:e(o)}}function Z0(n,e){if(typeof n=="function")return n(e);n!=null&&(n.current=e)}function Cu(...n){return e=>{let t=!1;const r=n.map(o=>{const a=Z0(o,e);return!t&&typeof a=="function"&&(t=!0),a});if(t)return()=>{for(let o=0;o<r.length;o++){const a=r[o];typeof a=="function"?a():Z0(n[o],null)}}}}function tn(...n){return L.useCallback(Cu(...n),n)}function Ii(n,e=[]){let t=[];function r(a,c){const f=L.createContext(c),h=t.length;t=[...t,c];const d=g=>{var x;const{scope:m,children:_,...M}=g,E=((x=m==null?void 0:m[n])==null?void 0:x[h])||f,y=L.useMemo(()=>M,Object.values(M));return w.jsx(E.Provider,{value:y,children:_})};d.displayName=a+"Provider";function v(g,m){var E;const _=((E=m==null?void 0:m[n])==null?void 0:E[h])||f,M=L.useContext(_);if(M)return M;if(c!==void 0)return c;throw new Error(`\`${g}\` must be used within \`${a}\``)}return[d,v]}const o=()=>{const a=t.map(c=>L.createContext(c));return function(f){const h=(f==null?void 0:f[n])||a;return L.useMemo(()=>({[`__scope${n}`]:{...f,[n]:h}}),[f,h])}};return o.scopeName=n,[r,fw(o,...e)]}function fw(...n){const e=n[0];if(n.length===1)return e;const t=()=>{const r=n.map(o=>({useScope:o(),scopeName:o.scopeName}));return function(a){const c=r.reduce((f,{useScope:h,scopeName:d})=>{const g=h(a)[`__scope${d}`];return{...f,...g}},{});return L.useMemo(()=>({[`__scope${e.scopeName}`]:c}),[c])}};return t.scopeName=e.scopeName,t}function Di(n){const e=L.useRef(n);return L.useEffect(()=>{e.current=n}),L.useMemo(()=>(...t)=>{var r;return(r=e.current)==null?void 0:r.call(e,...t)},[])}function hs({prop:n,defaultProp:e,onChange:t=()=>{}}){const[r,o]=dw({defaultProp:e,onChange:t}),a=n!==void 0,c=a?n:r,f=Di(t),h=L.useCallback(d=>{if(a){const g=typeof d=="function"?d(n):d;g!==n&&f(g)}else o(d)},[a,n,o,f]);return[c,h]}function dw({defaultProp:n,onChange:e}){const t=L.useState(n),[r]=t,o=L.useRef(r),a=Di(e);return L.useEffect(()=>{o.current!==r&&(a(r),o.current=r)},[r,o,a]),t}var Rp=D_();const hw=P_(Rp);var nl=L.forwardRef((n,e)=>{const{children:t,...r}=n,o=L.Children.toArray(t),a=o.find(mw);if(a){const c=a.props.children,f=o.map(h=>h===a?L.Children.count(c)>1?L.Children.only(null):L.isValidElement(c)?c.props.children:null:h);return w.jsx(Eh,{...r,ref:e,children:L.isValidElement(c)?L.cloneElement(c,void 0,f):null})}return w.jsx(Eh,{...r,ref:e,children:t})});nl.displayName="Slot";var Eh=L.forwardRef((n,e)=>{const{children:t,...r}=n;if(L.isValidElement(t)){const o=vw(t),a=gw(r,t.props);return t.type!==L.Fragment&&(a.ref=e?Cu(e,o):o),L.cloneElement(t,a)}return L.Children.count(t)>1?L.Children.only(null):null});Eh.displayName="SlotClone";var pw=({children:n})=>w.jsx(w.Fragment,{children:n});function mw(n){return L.isValidElement(n)&&n.type===pw}function gw(n,e){const t={...e};for(const r in e){const o=n[r],a=e[r];/^on[A-Z]/.test(r)?o&&a?t[r]=(...f)=>{a(...f),o(...f)}:o&&(t[r]=o):r==="style"?t[r]={...o,...a}:r==="className"&&(t[r]=[o,a].filter(Boolean).join(" "))}return{...n,...t}}function vw(n){var r,o;let e=(r=Object.getOwnPropertyDescriptor(n.props,"ref"))==null?void 0:r.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?n.ref:(e=(o=Object.getOwnPropertyDescriptor(n,"ref"))==null?void 0:o.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?n.props.ref:n.props.ref||n.ref)}var _w=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"],It=_w.reduce((n,e)=>{const t=L.forwardRef((r,o)=>{const{asChild:a,...c}=r,f=a?nl:e;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),w.jsx(f,{...c,ref:o})});return t.displayName=`Primitive.${e}`,{...n,[e]:t}},{});function I_(n,e){n&&Rp.flushSync(()=>n.dispatchEvent(e))}function Pu(n){const e=n+"CollectionProvider",[t,r]=Ii(e),[o,a]=t(e,{collectionRef:{current:null},itemMap:new Map}),c=_=>{const{scope:M,children:E}=_,y=un.useRef(null),x=un.useRef(new Map).current;return w.jsx(o,{scope:M,itemMap:x,collectionRef:y,children:E})};c.displayName=e;const f=n+"CollectionSlot",h=un.forwardRef((_,M)=>{const{scope:E,children:y}=_,x=a(f,E),T=tn(M,x.collectionRef);return w.jsx(nl,{ref:T,children:y})});h.displayName=f;const d=n+"CollectionItemSlot",v="data-radix-collection-item",g=un.forwardRef((_,M)=>{const{scope:E,children:y,...x}=_,T=un.useRef(null),N=tn(M,T),C=a(d,E);return un.useEffect(()=>(C.itemMap.set(T,{ref:T,...x}),()=>void C.itemMap.delete(T))),w.jsx(nl,{[v]:"",ref:N,children:y})});g.displayName=d;function m(_){const M=a(n+"CollectionConsumer",_);return un.useCallback(()=>{const y=M.collectionRef.current;if(!y)return[];const x=Array.from(y.querySelectorAll(`[${v}]`));return Array.from(M.itemMap.values()).sort((C,k)=>x.indexOf(C.ref.current)-x.indexOf(k.ref.current))},[M.collectionRef,M.itemMap])}return[{Provider:c,Slot:h,ItemSlot:g},m,r]}var xw=L.createContext(void 0);function Qo(n){const e=L.useContext(xw);return n||e||"ltr"}function yw(n,e=globalThis==null?void 0:globalThis.document){const t=Di(n);L.useEffect(()=>{const r=o=>{o.key==="Escape"&&t(o)};return e.addEventListener("keydown",r,{capture:!0}),()=>e.removeEventListener("keydown",r,{capture:!0})},[t,e])}var Sw="DismissableLayer",wh="dismissableLayer.update",Mw="dismissableLayer.pointerDownOutside",Ew="dismissableLayer.focusOutside",Q0,U_=L.createContext({layers:new Set,layersWithOutsidePointerEventsDisabled:new Set,branches:new Set}),F_=L.forwardRef((n,e)=>{const{disableOutsidePointerEvents:t=!1,onEscapeKeyDown:r,onPointerDownOutside:o,onFocusOutside:a,onInteractOutside:c,onDismiss:f,...h}=n,d=L.useContext(U_),[v,g]=L.useState(null),m=(v==null?void 0:v.ownerDocument)??(globalThis==null?void 0:globalThis.document),[,_]=L.useState({}),M=tn(e,F=>g(F)),E=Array.from(d.layers),[y]=[...d.layersWithOutsidePointerEventsDisabled].slice(-1),x=E.indexOf(y),T=v?E.indexOf(v):-1,N=d.layersWithOutsidePointerEventsDisabled.size>0,C=T>=x,k=Tw(F=>{const b=F.target,O=[...d.branches].some(X=>X.contains(b));!C||O||(o==null||o(F),c==null||c(F),F.defaultPrevented||f==null||f())},m),I=Aw(F=>{const b=F.target;[...d.branches].some(X=>X.contains(b))||(a==null||a(F),c==null||c(F),F.defaultPrevented||f==null||f())},m);return yw(F=>{T===d.layers.size-1&&(r==null||r(F),!F.defaultPrevented&&f&&(F.preventDefault(),f()))},m),L.useEffect(()=>{if(v)return t&&(d.layersWithOutsidePointerEventsDisabled.size===0&&(Q0=m.body.style.pointerEvents,m.body.style.pointerEvents="none"),d.layersWithOutsidePointerEventsDisabled.add(v)),d.layers.add(v),J0(),()=>{t&&d.layersWithOutsidePointerEventsDisabled.size===1&&(m.body.style.pointerEvents=Q0)}},[v,m,t,d]),L.useEffect(()=>()=>{v&&(d.layers.delete(v),d.layersWithOutsidePointerEventsDisabled.delete(v),J0())},[v,d]),L.useEffect(()=>{const F=()=>_({});return document.addEventListener(wh,F),()=>document.removeEventListener(wh,F)},[]),w.jsx(It.div,{...h,ref:M,style:{pointerEvents:N?C?"auto":"none":void 0,...n.style},onFocusCapture:lt(n.onFocusCapture,I.onFocusCapture),onBlurCapture:lt(n.onBlurCapture,I.onBlurCapture),onPointerDownCapture:lt(n.onPointerDownCapture,k.onPointerDownCapture)})});F_.displayName=Sw;var ww="DismissableLayerBranch",bw=L.forwardRef((n,e)=>{const t=L.useContext(U_),r=L.useRef(null),o=tn(e,r);return L.useEffect(()=>{const a=r.current;if(a)return t.branches.add(a),()=>{t.branches.delete(a)}},[t.branches]),w.jsx(It.div,{...n,ref:o})});bw.displayName=ww;function Tw(n,e=globalThis==null?void 0:globalThis.document){const t=Di(n),r=L.useRef(!1),o=L.useRef(()=>{});return L.useEffect(()=>{const a=f=>{if(f.target&&!r.current){let h=function(){O_(Mw,t,d,{discrete:!0})};const d={originalEvent:f};f.pointerType==="touch"?(e.removeEventListener("click",o.current),o.current=h,e.addEventListener("click",o.current,{once:!0})):h()}else e.removeEventListener("click",o.current);r.current=!1},c=window.setTimeout(()=>{e.addEventListener("pointerdown",a)},0);return()=>{window.clearTimeout(c),e.removeEventListener("pointerdown",a),e.removeEventListener("click",o.current)}},[e,t]),{onPointerDownCapture:()=>r.current=!0}}function Aw(n,e=globalThis==null?void 0:globalThis.document){const t=Di(n),r=L.useRef(!1);return L.useEffect(()=>{const o=a=>{a.target&&!r.current&&O_(Ew,t,{originalEvent:a},{discrete:!1})};return e.addEventListener("focusin",o),()=>e.removeEventListener("focusin",o)},[e,t]),{onFocusCapture:()=>r.current=!0,onBlurCapture:()=>r.current=!1}}function J0(){const n=new CustomEvent(wh);document.dispatchEvent(n)}function O_(n,e,t,{discrete:r}){const o=t.originalEvent.target,a=new CustomEvent(n,{bubbles:!1,cancelable:!0,detail:t});e&&o.addEventListener(n,e,{once:!0}),r?I_(o,a):o.dispatchEvent(a)}var Pd=0;function Rw(){L.useEffect(()=>{const n=document.querySelectorAll("[data-radix-focus-guard]");return document.body.insertAdjacentElement("afterbegin",n[0]??ev()),document.body.insertAdjacentElement("beforeend",n[1]??ev()),Pd++,()=>{Pd===1&&document.querySelectorAll("[data-radix-focus-guard]").forEach(e=>e.remove()),Pd--}},[])}function ev(){const n=document.createElement("span");return n.setAttribute("data-radix-focus-guard",""),n.tabIndex=0,n.style.outline="none",n.style.opacity="0",n.style.position="fixed",n.style.pointerEvents="none",n}var Dd="focusScope.autoFocusOnMount",Nd="focusScope.autoFocusOnUnmount",tv={bubbles:!1,cancelable:!0},Cw="FocusScope",k_=L.forwardRef((n,e)=>{const{loop:t=!1,trapped:r=!1,onMountAutoFocus:o,onUnmountAutoFocus:a,...c}=n,[f,h]=L.useState(null),d=Di(o),v=Di(a),g=L.useRef(null),m=tn(e,E=>h(E)),_=L.useRef({paused:!1,pause(){this.paused=!0},resume(){this.paused=!1}}).current;L.useEffect(()=>{if(r){let E=function(N){if(_.paused||!f)return;const C=N.target;f.contains(C)?g.current=C:is(g.current,{select:!0})},y=function(N){if(_.paused||!f)return;const C=N.relatedTarget;C!==null&&(f.contains(C)||is(g.current,{select:!0}))},x=function(N){if(document.activeElement===document.body)for(const k of N)k.removedNodes.length>0&&is(f)};document.addEventListener("focusin",E),document.addEventListener("focusout",y);const T=new MutationObserver(x);return f&&T.observe(f,{childList:!0,subtree:!0}),()=>{document.removeEventListener("focusin",E),document.removeEventListener("focusout",y),T.disconnect()}}},[r,f,_.paused]),L.useEffect(()=>{if(f){iv.add(_);const E=document.activeElement;if(!f.contains(E)){const x=new CustomEvent(Dd,tv);f.addEventListener(Dd,d),f.dispatchEvent(x),x.defaultPrevented||(Pw(Uw(z_(f)),{select:!0}),document.activeElement===E&&is(f))}return()=>{f.removeEventListener(Dd,d),setTimeout(()=>{const x=new CustomEvent(Nd,tv);f.addEventListener(Nd,v),f.dispatchEvent(x),x.defaultPrevented||is(E??document.body,{select:!0}),f.removeEventListener(Nd,v),iv.remove(_)},0)}}},[f,d,v,_]);const M=L.useCallback(E=>{if(!t&&!r||_.paused)return;const y=E.key==="Tab"&&!E.altKey&&!E.ctrlKey&&!E.metaKey,x=document.activeElement;if(y&&x){const T=E.currentTarget,[N,C]=Dw(T);N&&C?!E.shiftKey&&x===C?(E.preventDefault(),t&&is(N,{select:!0})):E.shiftKey&&x===N&&(E.preventDefault(),t&&is(C,{select:!0})):x===T&&E.preventDefault()}},[t,r,_.paused]);return w.jsx(It.div,{tabIndex:-1,...c,ref:m,onKeyDown:M})});k_.displayName=Cw;function Pw(n,{select:e=!1}={}){const t=document.activeElement;for(const r of n)if(is(r,{select:e}),document.activeElement!==t)return}function Dw(n){const e=z_(n),t=nv(e,n),r=nv(e.reverse(),n);return[t,r]}function z_(n){const e=[],t=document.createTreeWalker(n,NodeFilter.SHOW_ELEMENT,{acceptNode:r=>{const o=r.tagName==="INPUT"&&r.type==="hidden";return r.disabled||r.hidden||o?NodeFilter.FILTER_SKIP:r.tabIndex>=0?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;t.nextNode();)e.push(t.currentNode);return e}function nv(n,e){for(const t of n)if(!Nw(t,{upTo:e}))return t}function Nw(n,{upTo:e}){if(getComputedStyle(n).visibility==="hidden")return!0;for(;n;){if(e!==void 0&&n===e)return!1;if(getComputedStyle(n).display==="none")return!0;n=n.parentElement}return!1}function Lw(n){return n instanceof HTMLInputElement&&"select"in n}function is(n,{select:e=!1}={}){if(n&&n.focus){const t=document.activeElement;n.focus({preventScroll:!0}),n!==t&&Lw(n)&&e&&n.select()}}var iv=Iw();function Iw(){let n=[];return{add(e){const t=n[0];e!==t&&(t==null||t.pause()),n=rv(n,e),n.unshift(e)},remove(e){var t;n=rv(n,e),(t=n[0])==null||t.resume()}}}function rv(n,e){const t=[...n],r=t.indexOf(e);return r!==-1&&t.splice(r,1),t}function Uw(n){return n.filter(e=>e.tagName!=="A")}var ls=globalThis!=null&&globalThis.document?L.useLayoutEffect:()=>{},Fw=CE.useId||(()=>{}),Ow=0;function Xo(n){const[e,t]=L.useState(Fw());return ls(()=>{t(r=>r??String(Ow++))},[n]),n||(e?`radix-${e}`:"")}const kw=["top","right","bottom","left"],cs=Math.min,ni=Math.max,fu=Math.round,gc=Math.floor,Ki=n=>({x:n,y:n}),zw={left:"right",right:"left",bottom:"top",top:"bottom"};function bh(n,e,t){return ni(n,cs(e,t))}function wr(n,e){return typeof n=="function"?n(e):n}function br(n){return n.split("-")[0]}function Jo(n){return n.split("-")[1]}function Cp(n){return n==="x"?"y":"x"}function Pp(n){return n==="y"?"height":"width"}function Xi(n){const e=n[0];return e==="t"||e==="b"?"y":"x"}function Dp(n){return Cp(Xi(n))}function Bw(n,e,t){t===void 0&&(t=!1);const r=Jo(n),o=Dp(n),a=Pp(o);let c=o==="x"?r===(t?"end":"start")?"right":"left":r==="start"?"bottom":"top";return e.reference[a]>e.floating[a]&&(c=du(c)),[c,du(c)]}function Vw(n){const e=du(n);return[Th(n),e,Th(e)]}function Th(n){return n.includes("start")?n.replace("start","end"):n.replace("end","start")}const sv=["left","right"],ov=["right","left"],Gw=["top","bottom"],Hw=["bottom","top"];function Ww(n,e,t){switch(n){case"top":case"bottom":return t?e?ov:sv:e?sv:ov;case"left":case"right":return e?Gw:Hw;default:return[]}}function jw(n,e,t,r){const o=Jo(n);let a=Ww(br(n),t==="start",r);return o&&(a=a.map(c=>c+"-"+o),e&&(a=a.concat(a.map(Th)))),a}function du(n){const e=br(n);return zw[e]+n.slice(e.length)}function Xw(n){return{top:0,right:0,bottom:0,left:0,...n}}function B_(n){return typeof n!="number"?Xw(n):{top:n,right:n,bottom:n,left:n}}function hu(n){const{x:e,y:t,width:r,height:o}=n;return{width:r,height:o,top:t,left:e,right:e+r,bottom:t+o,x:e,y:t}}function av(n,e,t){let{reference:r,floating:o}=n;const a=Xi(e),c=Dp(e),f=Pp(c),h=br(e),d=a==="y",v=r.x+r.width/2-o.width/2,g=r.y+r.height/2-o.height/2,m=r[f]/2-o[f]/2;let _;switch(h){case"top":_={x:v,y:r.y-o.height};break;case"bottom":_={x:v,y:r.y+r.height};break;case"right":_={x:r.x+r.width,y:g};break;case"left":_={x:r.x-o.width,y:g};break;default:_={x:r.x,y:r.y}}switch(Jo(e)){case"start":_[c]-=m*(t&&d?-1:1);break;case"end":_[c]+=m*(t&&d?-1:1);break}return _}async function $w(n,e){var t;e===void 0&&(e={});const{x:r,y:o,platform:a,rects:c,elements:f,strategy:h}=n,{boundary:d="clippingAncestors",rootBoundary:v="viewport",elementContext:g="floating",altBoundary:m=!1,padding:_=0}=wr(e,n),M=B_(_),y=f[m?g==="floating"?"reference":"floating":g],x=hu(await a.getClippingRect({element:(t=await(a.isElement==null?void 0:a.isElement(y)))==null||t?y:y.contextElement||await(a.getDocumentElement==null?void 0:a.getDocumentElement(f.floating)),boundary:d,rootBoundary:v,strategy:h})),T=g==="floating"?{x:r,y:o,width:c.floating.width,height:c.floating.height}:c.reference,N=await(a.getOffsetParent==null?void 0:a.getOffsetParent(f.floating)),C=await(a.isElement==null?void 0:a.isElement(N))?await(a.getScale==null?void 0:a.getScale(N))||{x:1,y:1}:{x:1,y:1},k=hu(a.convertOffsetParentRelativeRectToViewportRelativeRect?await a.convertOffsetParentRelativeRectToViewportRelativeRect({elements:f,rect:T,offsetParent:N,strategy:h}):T);return{top:(x.top-k.top+M.top)/C.y,bottom:(k.bottom-x.bottom+M.bottom)/C.y,left:(x.left-k.left+M.left)/C.x,right:(k.right-x.right+M.right)/C.x}}const Yw=50,Kw=async(n,e,t)=>{const{placement:r="bottom",strategy:o="absolute",middleware:a=[],platform:c}=t,f=c.detectOverflow?c:{...c,detectOverflow:$w},h=await(c.isRTL==null?void 0:c.isRTL(e));let d=await c.getElementRects({reference:n,floating:e,strategy:o}),{x:v,y:g}=av(d,r,h),m=r,_=0;const M={};for(let E=0;E<a.length;E++){const y=a[E];if(!y)continue;const{name:x,fn:T}=y,{x:N,y:C,data:k,reset:I}=await T({x:v,y:g,initialPlacement:r,placement:m,strategy:o,middlewareData:M,rects:d,platform:f,elements:{reference:n,floating:e}});v=N??v,g=C??g,M[x]={...M[x],...k},I&&_<Yw&&(_++,typeof I=="object"&&(I.placement&&(m=I.placement),I.rects&&(d=I.rects===!0?await c.getElementRects({reference:n,floating:e,strategy:o}):I.rects),{x:v,y:g}=av(d,m,h)),E=-1)}return{x:v,y:g,placement:m,strategy:o,middlewareData:M}},qw=n=>({name:"arrow",options:n,async fn(e){const{x:t,y:r,placement:o,rects:a,platform:c,elements:f,middlewareData:h}=e,{element:d,padding:v=0}=wr(n,e)||{};if(d==null)return{};const g=B_(v),m={x:t,y:r},_=Dp(o),M=Pp(_),E=await c.getDimensions(d),y=_==="y",x=y?"top":"left",T=y?"bottom":"right",N=y?"clientHeight":"clientWidth",C=a.reference[M]+a.reference[_]-m[_]-a.floating[M],k=m[_]-a.reference[_],I=await(c.getOffsetParent==null?void 0:c.getOffsetParent(d));let F=I?I[N]:0;(!F||!await(c.isElement==null?void 0:c.isElement(I)))&&(F=f.floating[N]||a.floating[M]);const b=C/2-k/2,O=F/2-E[M]/2-1,X=cs(g[x],O),B=cs(g[T],O),Z=X,ne=F-E[M]-B,ce=F/2-E[M]/2+b,G=bh(Z,ce,ne),Y=!h.arrow&&Jo(o)!=null&&ce!==G&&a.reference[M]/2-(ce<Z?X:B)-E[M]/2<0,j=Y?ce<Z?ce-Z:ce-ne:0;return{[_]:m[_]+j,data:{[_]:G,centerOffset:ce-G-j,...Y&&{alignmentOffset:j}},reset:Y}}}),Zw=function(n){return n===void 0&&(n={}),{name:"flip",options:n,async fn(e){var t,r;const{placement:o,middlewareData:a,rects:c,initialPlacement:f,platform:h,elements:d}=e,{mainAxis:v=!0,crossAxis:g=!0,fallbackPlacements:m,fallbackStrategy:_="bestFit",fallbackAxisSideDirection:M="none",flipAlignment:E=!0,...y}=wr(n,e);if((t=a.arrow)!=null&&t.alignmentOffset)return{};const x=br(o),T=Xi(f),N=br(f)===f,C=await(h.isRTL==null?void 0:h.isRTL(d.floating)),k=m||(N||!E?[du(f)]:Vw(f)),I=M!=="none";!m&&I&&k.push(...jw(f,E,M,C));const F=[f,...k],b=await h.detectOverflow(e,y),O=[];let X=((r=a.flip)==null?void 0:r.overflows)||[];if(v&&O.push(b[x]),g){const ce=Bw(o,c,C);O.push(b[ce[0]],b[ce[1]])}if(X=[...X,{placement:o,overflows:O}],!O.every(ce=>ce<=0)){var B,Z;const ce=(((B=a.flip)==null?void 0:B.index)||0)+1,G=F[ce];if(G&&(!(g==="alignment"?T!==Xi(G):!1)||X.every(W=>Xi(W.placement)===T?W.overflows[0]>0:!0)))return{data:{index:ce,overflows:X},reset:{placement:G}};let Y=(Z=X.filter(j=>j.overflows[0]<=0).sort((j,W)=>j.overflows[1]-W.overflows[1])[0])==null?void 0:Z.placement;if(!Y)switch(_){case"bestFit":{var ne;const j=(ne=X.filter(W=>{if(I){const z=Xi(W.placement);return z===T||z==="y"}return!0}).map(W=>[W.placement,W.overflows.filter(z=>z>0).reduce((z,$)=>z+$,0)]).sort((W,z)=>W[1]-z[1])[0])==null?void 0:ne[0];j&&(Y=j);break}case"initialPlacement":Y=f;break}if(o!==Y)return{reset:{placement:Y}}}return{}}}};function lv(n,e){return{top:n.top-e.height,right:n.right-e.width,bottom:n.bottom-e.height,left:n.left-e.width}}function cv(n){return kw.some(e=>n[e]>=0)}const Qw=function(n){return n===void 0&&(n={}),{name:"hide",options:n,async fn(e){const{rects:t,platform:r}=e,{strategy:o="referenceHidden",...a}=wr(n,e);switch(o){case"referenceHidden":{const c=await r.detectOverflow(e,{...a,elementContext:"reference"}),f=lv(c,t.reference);return{data:{referenceHiddenOffsets:f,referenceHidden:cv(f)}}}case"escaped":{const c=await r.detectOverflow(e,{...a,altBoundary:!0}),f=lv(c,t.floating);return{data:{escapedOffsets:f,escaped:cv(f)}}}default:return{}}}}},V_=new Set(["left","top"]);async function Jw(n,e){const{placement:t,platform:r,elements:o}=n,a=await(r.isRTL==null?void 0:r.isRTL(o.floating)),c=br(t),f=Jo(t),h=Xi(t)==="y",d=V_.has(c)?-1:1,v=a&&h?-1:1,g=wr(e,n);let{mainAxis:m,crossAxis:_,alignmentAxis:M}=typeof g=="number"?{mainAxis:g,crossAxis:0,alignmentAxis:null}:{mainAxis:g.mainAxis||0,crossAxis:g.crossAxis||0,alignmentAxis:g.alignmentAxis};return f&&typeof M=="number"&&(_=f==="end"?M*-1:M),h?{x:_*v,y:m*d}:{x:m*d,y:_*v}}const e1=function(n){return n===void 0&&(n=0),{name:"offset",options:n,async fn(e){var t,r;const{x:o,y:a,placement:c,middlewareData:f}=e,h=await Jw(e,n);return c===((t=f.offset)==null?void 0:t.placement)&&(r=f.arrow)!=null&&r.alignmentOffset?{}:{x:o+h.x,y:a+h.y,data:{...h,placement:c}}}}},t1=function(n){return n===void 0&&(n={}),{name:"shift",options:n,async fn(e){const{x:t,y:r,placement:o,platform:a}=e,{mainAxis:c=!0,crossAxis:f=!1,limiter:h={fn:x=>{let{x:T,y:N}=x;return{x:T,y:N}}},...d}=wr(n,e),v={x:t,y:r},g=await a.detectOverflow(e,d),m=Xi(br(o)),_=Cp(m);let M=v[_],E=v[m];if(c){const x=_==="y"?"top":"left",T=_==="y"?"bottom":"right",N=M+g[x],C=M-g[T];M=bh(N,M,C)}if(f){const x=m==="y"?"top":"left",T=m==="y"?"bottom":"right",N=E+g[x],C=E-g[T];E=bh(N,E,C)}const y=h.fn({...e,[_]:M,[m]:E});return{...y,data:{x:y.x-t,y:y.y-r,enabled:{[_]:c,[m]:f}}}}}},n1=function(n){return n===void 0&&(n={}),{options:n,fn(e){const{x:t,y:r,placement:o,rects:a,middlewareData:c}=e,{offset:f=0,mainAxis:h=!0,crossAxis:d=!0}=wr(n,e),v={x:t,y:r},g=Xi(o),m=Cp(g);let _=v[m],M=v[g];const E=wr(f,e),y=typeof E=="number"?{mainAxis:E,crossAxis:0}:{mainAxis:0,crossAxis:0,...E};if(h){const N=m==="y"?"height":"width",C=a.reference[m]-a.floating[N]+y.mainAxis,k=a.reference[m]+a.reference[N]-y.mainAxis;_<C?_=C:_>k&&(_=k)}if(d){var x,T;const N=m==="y"?"width":"height",C=V_.has(br(o)),k=a.reference[g]-a.floating[N]+(C&&((x=c.offset)==null?void 0:x[g])||0)+(C?0:y.crossAxis),I=a.reference[g]+a.reference[N]+(C?0:((T=c.offset)==null?void 0:T[g])||0)-(C?y.crossAxis:0);M<k?M=k:M>I&&(M=I)}return{[m]:_,[g]:M}}}},i1=function(n){return n===void 0&&(n={}),{name:"size",options:n,async fn(e){var t,r;const{placement:o,rects:a,platform:c,elements:f}=e,{apply:h=()=>{},...d}=wr(n,e),v=await c.detectOverflow(e,d),g=br(o),m=Jo(o),_=Xi(o)==="y",{width:M,height:E}=a.floating;let y,x;g==="top"||g==="bottom"?(y=g,x=m===(await(c.isRTL==null?void 0:c.isRTL(f.floating))?"start":"end")?"left":"right"):(x=g,y=m==="end"?"top":"bottom");const T=E-v.top-v.bottom,N=M-v.left-v.right,C=cs(E-v[y],T),k=cs(M-v[x],N),I=!e.middlewareData.shift;let F=C,b=k;if((t=e.middlewareData.shift)!=null&&t.enabled.x&&(b=N),(r=e.middlewareData.shift)!=null&&r.enabled.y&&(F=T),I&&!m){const X=ni(v.left,0),B=ni(v.right,0),Z=ni(v.top,0),ne=ni(v.bottom,0);_?b=M-2*(X!==0||B!==0?X+B:ni(v.left,v.right)):F=E-2*(Z!==0||ne!==0?Z+ne:ni(v.top,v.bottom))}await h({...e,availableWidth:b,availableHeight:F});const O=await c.getDimensions(f.floating);return M!==O.width||E!==O.height?{reset:{rects:!0}}:{}}}};function Du(){return typeof window<"u"}function ea(n){return G_(n)?(n.nodeName||"").toLowerCase():"#document"}function ii(n){var e;return(n==null||(e=n.ownerDocument)==null?void 0:e.defaultView)||window}function tr(n){var e;return(e=(G_(n)?n.ownerDocument:n.document)||window.document)==null?void 0:e.documentElement}function G_(n){return Du()?n instanceof Node||n instanceof ii(n).Node:!1}function Ni(n){return Du()?n instanceof Element||n instanceof ii(n).Element:!1}function Cr(n){return Du()?n instanceof HTMLElement||n instanceof ii(n).HTMLElement:!1}function uv(n){return!Du()||typeof ShadowRoot>"u"?!1:n instanceof ShadowRoot||n instanceof ii(n).ShadowRoot}function ll(n){const{overflow:e,overflowX:t,overflowY:r,display:o}=Li(n);return/auto|scroll|overlay|hidden|clip/.test(e+r+t)&&o!=="inline"&&o!=="contents"}function r1(n){return/^(table|td|th)$/.test(ea(n))}function Nu(n){try{if(n.matches(":popover-open"))return!0}catch{}try{return n.matches(":modal")}catch{return!1}}const s1=/transform|translate|scale|rotate|perspective|filter/,o1=/paint|layout|strict|content/,Ds=n=>!!n&&n!=="none";let Ld;function Np(n){const e=Ni(n)?Li(n):n;return Ds(e.transform)||Ds(e.translate)||Ds(e.scale)||Ds(e.rotate)||Ds(e.perspective)||!Lp()&&(Ds(e.backdropFilter)||Ds(e.filter))||s1.test(e.willChange||"")||o1.test(e.contain||"")}function a1(n){let e=us(n);for(;Cr(e)&&!$o(e);){if(Np(e))return e;if(Nu(e))return null;e=us(e)}return null}function Lp(){return Ld==null&&(Ld=typeof CSS<"u"&&CSS.supports&&CSS.supports("-webkit-backdrop-filter","none")),Ld}function $o(n){return/^(html|body|#document)$/.test(ea(n))}function Li(n){return ii(n).getComputedStyle(n)}function Lu(n){return Ni(n)?{scrollLeft:n.scrollLeft,scrollTop:n.scrollTop}:{scrollLeft:n.scrollX,scrollTop:n.scrollY}}function us(n){if(ea(n)==="html")return n;const e=n.assignedSlot||n.parentNode||uv(n)&&n.host||tr(n);return uv(e)?e.host:e}function H_(n){const e=us(n);return $o(e)?n.ownerDocument?n.ownerDocument.body:n.body:Cr(e)&&ll(e)?e:H_(e)}function il(n,e,t){var r;e===void 0&&(e=[]),t===void 0&&(t=!0);const o=H_(n),a=o===((r=n.ownerDocument)==null?void 0:r.body),c=ii(o);if(a){const f=Ah(c);return e.concat(c,c.visualViewport||[],ll(o)?o:[],f&&t?il(f):[])}else return e.concat(o,il(o,[],t))}function Ah(n){return n.parent&&Object.getPrototypeOf(n.parent)?n.frameElement:null}function W_(n){const e=Li(n);let t=parseFloat(e.width)||0,r=parseFloat(e.height)||0;const o=Cr(n),a=o?n.offsetWidth:t,c=o?n.offsetHeight:r,f=fu(t)!==a||fu(r)!==c;return f&&(t=a,r=c),{width:t,height:r,$:f}}function Ip(n){return Ni(n)?n:n.contextElement}function Vo(n){const e=Ip(n);if(!Cr(e))return Ki(1);const t=e.getBoundingClientRect(),{width:r,height:o,$:a}=W_(e);let c=(a?fu(t.width):t.width)/r,f=(a?fu(t.height):t.height)/o;return(!c||!Number.isFinite(c))&&(c=1),(!f||!Number.isFinite(f))&&(f=1),{x:c,y:f}}const l1=Ki(0);function j_(n){const e=ii(n);return!Lp()||!e.visualViewport?l1:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function c1(n,e,t){return e===void 0&&(e=!1),!t||e&&t!==ii(n)?!1:e}function Vs(n,e,t,r){e===void 0&&(e=!1),t===void 0&&(t=!1);const o=n.getBoundingClientRect(),a=Ip(n);let c=Ki(1);e&&(r?Ni(r)&&(c=Vo(r)):c=Vo(n));const f=c1(a,t,r)?j_(a):Ki(0);let h=(o.left+f.x)/c.x,d=(o.top+f.y)/c.y,v=o.width/c.x,g=o.height/c.y;if(a){const m=ii(a),_=r&&Ni(r)?ii(r):r;let M=m,E=Ah(M);for(;E&&r&&_!==M;){const y=Vo(E),x=E.getBoundingClientRect(),T=Li(E),N=x.left+(E.clientLeft+parseFloat(T.paddingLeft))*y.x,C=x.top+(E.clientTop+parseFloat(T.paddingTop))*y.y;h*=y.x,d*=y.y,v*=y.x,g*=y.y,h+=N,d+=C,M=ii(E),E=Ah(M)}}return hu({width:v,height:g,x:h,y:d})}function Iu(n,e){const t=Lu(n).scrollLeft;return e?e.left+t:Vs(tr(n)).left+t}function X_(n,e){const t=n.getBoundingClientRect(),r=t.left+e.scrollLeft-Iu(n,t),o=t.top+e.scrollTop;return{x:r,y:o}}function u1(n){let{elements:e,rect:t,offsetParent:r,strategy:o}=n;const a=o==="fixed",c=tr(r),f=e?Nu(e.floating):!1;if(r===c||f&&a)return t;let h={scrollLeft:0,scrollTop:0},d=Ki(1);const v=Ki(0),g=Cr(r);if((g||!g&&!a)&&((ea(r)!=="body"||ll(c))&&(h=Lu(r)),g)){const _=Vs(r);d=Vo(r),v.x=_.x+r.clientLeft,v.y=_.y+r.clientTop}const m=c&&!g&&!a?X_(c,h):Ki(0);return{width:t.width*d.x,height:t.height*d.y,x:t.x*d.x-h.scrollLeft*d.x+v.x+m.x,y:t.y*d.y-h.scrollTop*d.y+v.y+m.y}}function f1(n){return Array.from(n.getClientRects())}function d1(n){const e=tr(n),t=Lu(n),r=n.ownerDocument.body,o=ni(e.scrollWidth,e.clientWidth,r.scrollWidth,r.clientWidth),a=ni(e.scrollHeight,e.clientHeight,r.scrollHeight,r.clientHeight);let c=-t.scrollLeft+Iu(n);const f=-t.scrollTop;return Li(r).direction==="rtl"&&(c+=ni(e.clientWidth,r.clientWidth)-o),{width:o,height:a,x:c,y:f}}const fv=25;function h1(n,e){const t=ii(n),r=tr(n),o=t.visualViewport;let a=r.clientWidth,c=r.clientHeight,f=0,h=0;if(o){a=o.width,c=o.height;const v=Lp();(!v||v&&e==="fixed")&&(f=o.offsetLeft,h=o.offsetTop)}const d=Iu(r);if(d<=0){const v=r.ownerDocument,g=v.body,m=getComputedStyle(g),_=v.compatMode==="CSS1Compat"&&parseFloat(m.marginLeft)+parseFloat(m.marginRight)||0,M=Math.abs(r.clientWidth-g.clientWidth-_);M<=fv&&(a-=M)}else d<=fv&&(a+=d);return{width:a,height:c,x:f,y:h}}function p1(n,e){const t=Vs(n,!0,e==="fixed"),r=t.top+n.clientTop,o=t.left+n.clientLeft,a=Cr(n)?Vo(n):Ki(1),c=n.clientWidth*a.x,f=n.clientHeight*a.y,h=o*a.x,d=r*a.y;return{width:c,height:f,x:h,y:d}}function dv(n,e,t){let r;if(e==="viewport")r=h1(n,t);else if(e==="document")r=d1(tr(n));else if(Ni(e))r=p1(e,t);else{const o=j_(n);r={x:e.x-o.x,y:e.y-o.y,width:e.width,height:e.height}}return hu(r)}function $_(n,e){const t=us(n);return t===e||!Ni(t)||$o(t)?!1:Li(t).position==="fixed"||$_(t,e)}function m1(n,e){const t=e.get(n);if(t)return t;let r=il(n,[],!1).filter(f=>Ni(f)&&ea(f)!=="body"),o=null;const a=Li(n).position==="fixed";let c=a?us(n):n;for(;Ni(c)&&!$o(c);){const f=Li(c),h=Np(c);!h&&f.position==="fixed"&&(o=null),(a?!h&&!o:!h&&f.position==="static"&&!!o&&(o.position==="absolute"||o.position==="fixed")||ll(c)&&!h&&$_(n,c))?r=r.filter(v=>v!==c):o=f,c=us(c)}return e.set(n,r),r}function g1(n){let{element:e,boundary:t,rootBoundary:r,strategy:o}=n;const c=[...t==="clippingAncestors"?Nu(e)?[]:m1(e,this._c):[].concat(t),r],f=dv(e,c[0],o);let h=f.top,d=f.right,v=f.bottom,g=f.left;for(let m=1;m<c.length;m++){const _=dv(e,c[m],o);h=ni(_.top,h),d=cs(_.right,d),v=cs(_.bottom,v),g=ni(_.left,g)}return{width:d-g,height:v-h,x:g,y:h}}function v1(n){const{width:e,height:t}=W_(n);return{width:e,height:t}}function _1(n,e,t){const r=Cr(e),o=tr(e),a=t==="fixed",c=Vs(n,!0,a,e);let f={scrollLeft:0,scrollTop:0};const h=Ki(0);function d(){h.x=Iu(o)}if(r||!r&&!a)if((ea(e)!=="body"||ll(o))&&(f=Lu(e)),r){const _=Vs(e,!0,a,e);h.x=_.x+e.clientLeft,h.y=_.y+e.clientTop}else o&&d();a&&!r&&o&&d();const v=o&&!r&&!a?X_(o,f):Ki(0),g=c.left+f.scrollLeft-h.x-v.x,m=c.top+f.scrollTop-h.y-v.y;return{x:g,y:m,width:c.width,height:c.height}}function Id(n){return Li(n).position==="static"}function hv(n,e){if(!Cr(n)||Li(n).position==="fixed")return null;if(e)return e(n);let t=n.offsetParent;return tr(n)===t&&(t=t.ownerDocument.body),t}function Y_(n,e){const t=ii(n);if(Nu(n))return t;if(!Cr(n)){let o=us(n);for(;o&&!$o(o);){if(Ni(o)&&!Id(o))return o;o=us(o)}return t}let r=hv(n,e);for(;r&&r1(r)&&Id(r);)r=hv(r,e);return r&&$o(r)&&Id(r)&&!Np(r)?t:r||a1(n)||t}const x1=async function(n){const e=this.getOffsetParent||Y_,t=this.getDimensions,r=await t(n.floating);return{reference:_1(n.reference,await e(n.floating),n.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function y1(n){return Li(n).direction==="rtl"}const S1={convertOffsetParentRelativeRectToViewportRelativeRect:u1,getDocumentElement:tr,getClippingRect:g1,getOffsetParent:Y_,getElementRects:x1,getClientRects:f1,getDimensions:v1,getScale:Vo,isElement:Ni,isRTL:y1};function K_(n,e){return n.x===e.x&&n.y===e.y&&n.width===e.width&&n.height===e.height}function M1(n,e){let t=null,r;const o=tr(n);function a(){var f;clearTimeout(r),(f=t)==null||f.disconnect(),t=null}function c(f,h){f===void 0&&(f=!1),h===void 0&&(h=1),a();const d=n.getBoundingClientRect(),{left:v,top:g,width:m,height:_}=d;if(f||e(),!m||!_)return;const M=gc(g),E=gc(o.clientWidth-(v+m)),y=gc(o.clientHeight-(g+_)),x=gc(v),N={rootMargin:-M+"px "+-E+"px "+-y+"px "+-x+"px",threshold:ni(0,cs(1,h))||1};let C=!0;function k(I){const F=I[0].intersectionRatio;if(F!==h){if(!C)return c();F?c(!1,F):r=setTimeout(()=>{c(!1,1e-7)},1e3)}F===1&&!K_(d,n.getBoundingClientRect())&&c(),C=!1}try{t=new IntersectionObserver(k,{...N,root:o.ownerDocument})}catch{t=new IntersectionObserver(k,N)}t.observe(n)}return c(!0),a}function E1(n,e,t,r){r===void 0&&(r={});const{ancestorScroll:o=!0,ancestorResize:a=!0,elementResize:c=typeof ResizeObserver=="function",layoutShift:f=typeof IntersectionObserver=="function",animationFrame:h=!1}=r,d=Ip(n),v=o||a?[...d?il(d):[],...e?il(e):[]]:[];v.forEach(x=>{o&&x.addEventListener("scroll",t,{passive:!0}),a&&x.addEventListener("resize",t)});const g=d&&f?M1(d,t):null;let m=-1,_=null;c&&(_=new ResizeObserver(x=>{let[T]=x;T&&T.target===d&&_&&e&&(_.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var N;(N=_)==null||N.observe(e)})),t()}),d&&!h&&_.observe(d),e&&_.observe(e));let M,E=h?Vs(n):null;h&&y();function y(){const x=Vs(n);E&&!K_(E,x)&&t(),E=x,M=requestAnimationFrame(y)}return t(),()=>{var x;v.forEach(T=>{o&&T.removeEventListener("scroll",t),a&&T.removeEventListener("resize",t)}),g==null||g(),(x=_)==null||x.disconnect(),_=null,h&&cancelAnimationFrame(M)}}const w1=e1,b1=t1,T1=Zw,A1=i1,R1=Qw,pv=qw,C1=n1,P1=(n,e,t)=>{const r=new Map,o={platform:S1,...t},a={...o.platform,_c:r};return Kw(n,e,{...o,platform:a})};var D1=typeof document<"u",N1=function(){},eu=D1?L.useLayoutEffect:N1;function pu(n,e){if(n===e)return!0;if(typeof n!=typeof e)return!1;if(typeof n=="function"&&n.toString()===e.toString())return!0;let t,r,o;if(n&&e&&typeof n=="object"){if(Array.isArray(n)){if(t=n.length,t!==e.length)return!1;for(r=t;r--!==0;)if(!pu(n[r],e[r]))return!1;return!0}if(o=Object.keys(n),t=o.length,t!==Object.keys(e).length)return!1;for(r=t;r--!==0;)if(!{}.hasOwnProperty.call(e,o[r]))return!1;for(r=t;r--!==0;){const a=o[r];if(!(a==="_owner"&&n.$$typeof)&&!pu(n[a],e[a]))return!1}return!0}return n!==n&&e!==e}function q_(n){return typeof window>"u"?1:(n.ownerDocument.defaultView||window).devicePixelRatio||1}function mv(n,e){const t=q_(n);return Math.round(e*t)/t}function Ud(n){const e=L.useRef(n);return eu(()=>{e.current=n}),e}function L1(n){n===void 0&&(n={});const{placement:e="bottom",strategy:t="absolute",middleware:r=[],platform:o,elements:{reference:a,floating:c}={},transform:f=!0,whileElementsMounted:h,open:d}=n,[v,g]=L.useState({x:0,y:0,strategy:t,placement:e,middlewareData:{},isPositioned:!1}),[m,_]=L.useState(r);pu(m,r)||_(r);const[M,E]=L.useState(null),[y,x]=L.useState(null),T=L.useCallback(W=>{W!==I.current&&(I.current=W,E(W))},[]),N=L.useCallback(W=>{W!==F.current&&(F.current=W,x(W))},[]),C=a||M,k=c||y,I=L.useRef(null),F=L.useRef(null),b=L.useRef(v),O=h!=null,X=Ud(h),B=Ud(o),Z=Ud(d),ne=L.useCallback(()=>{if(!I.current||!F.current)return;const W={placement:e,strategy:t,middleware:m};B.current&&(W.platform=B.current),P1(I.current,F.current,W).then(z=>{const $={...z,isPositioned:Z.current!==!1};ce.current&&!pu(b.current,$)&&(b.current=$,Rp.flushSync(()=>{g($)}))})},[m,e,t,B,Z]);eu(()=>{d===!1&&b.current.isPositioned&&(b.current.isPositioned=!1,g(W=>({...W,isPositioned:!1})))},[d]);const ce=L.useRef(!1);eu(()=>(ce.current=!0,()=>{ce.current=!1}),[]),eu(()=>{if(C&&(I.current=C),k&&(F.current=k),C&&k){if(X.current)return X.current(C,k,ne);ne()}},[C,k,ne,X,O]);const G=L.useMemo(()=>({reference:I,floating:F,setReference:T,setFloating:N}),[T,N]),Y=L.useMemo(()=>({reference:C,floating:k}),[C,k]),j=L.useMemo(()=>{const W={position:t,left:0,top:0};if(!Y.floating)return W;const z=mv(Y.floating,v.x),$=mv(Y.floating,v.y);return f?{...W,transform:"translate("+z+"px, "+$+"px)",...q_(Y.floating)>=1.5&&{willChange:"transform"}}:{position:t,left:z,top:$}},[t,f,Y.floating,v.x,v.y]);return L.useMemo(()=>({...v,update:ne,refs:G,elements:Y,floatingStyles:j}),[v,ne,G,Y,j])}const I1=n=>{function e(t){return{}.hasOwnProperty.call(t,"current")}return{name:"arrow",options:n,fn(t){const{element:r,padding:o}=typeof n=="function"?n(t):n;return r&&e(r)?r.current!=null?pv({element:r.current,padding:o}).fn(t):{}:r?pv({element:r,padding:o}).fn(t):{}}}},U1=(n,e)=>{const t=w1(n);return{name:t.name,fn:t.fn,options:[n,e]}},F1=(n,e)=>{const t=b1(n);return{name:t.name,fn:t.fn,options:[n,e]}},O1=(n,e)=>({fn:C1(n).fn,options:[n,e]}),k1=(n,e)=>{const t=T1(n);return{name:t.name,fn:t.fn,options:[n,e]}},z1=(n,e)=>{const t=A1(n);return{name:t.name,fn:t.fn,options:[n,e]}},B1=(n,e)=>{const t=R1(n);return{name:t.name,fn:t.fn,options:[n,e]}},V1=(n,e)=>{const t=I1(n);return{name:t.name,fn:t.fn,options:[n,e]}};var G1="Arrow",Z_=L.forwardRef((n,e)=>{const{children:t,width:r=10,height:o=5,...a}=n;return w.jsx(It.svg,{...a,ref:e,width:r,height:o,viewBox:"0 0 30 10",preserveAspectRatio:"none",children:n.asChild?t:w.jsx("polygon",{points:"0,0 30,0 15,10"})})});Z_.displayName=G1;var H1=Z_;function Up(n){const[e,t]=L.useState(void 0);return ls(()=>{if(n){t({width:n.offsetWidth,height:n.offsetHeight});const r=new ResizeObserver(o=>{if(!Array.isArray(o)||!o.length)return;const a=o[0];let c,f;if("borderBoxSize"in a){const h=a.borderBoxSize,d=Array.isArray(h)?h[0]:h;c=d.inlineSize,f=d.blockSize}else c=n.offsetWidth,f=n.offsetHeight;t({width:c,height:f})});return r.observe(n,{box:"border-box"}),()=>r.unobserve(n)}else t(void 0)},[n]),e}var Fp="Popper",[Q_,J_]=Ii(Fp),[W1,ex]=Q_(Fp),tx=n=>{const{__scopePopper:e,children:t}=n,[r,o]=L.useState(null);return w.jsx(W1,{scope:e,anchor:r,onAnchorChange:o,children:t})};tx.displayName=Fp;var nx="PopperAnchor",ix=L.forwardRef((n,e)=>{const{__scopePopper:t,virtualRef:r,...o}=n,a=ex(nx,t),c=L.useRef(null),f=tn(e,c);return L.useEffect(()=>{a.onAnchorChange((r==null?void 0:r.current)||c.current)}),r?null:w.jsx(It.div,{...o,ref:f})});ix.displayName=nx;var Op="PopperContent",[j1,X1]=Q_(Op),rx=L.forwardRef((n,e)=>{var he,pe,oe,Ae,Te,rt;const{__scopePopper:t,side:r="bottom",sideOffset:o=0,align:a="center",alignOffset:c=0,arrowPadding:f=0,avoidCollisions:h=!0,collisionBoundary:d=[],collisionPadding:v=0,sticky:g="partial",hideWhenDetached:m=!1,updatePositionStrategy:_="optimized",onPlaced:M,...E}=n,y=ex(Op,t),[x,T]=L.useState(null),N=tn(e,Be=>T(Be)),[C,k]=L.useState(null),I=Up(C),F=(I==null?void 0:I.width)??0,b=(I==null?void 0:I.height)??0,O=r+(a!=="center"?"-"+a:""),X=typeof v=="number"?v:{top:0,right:0,bottom:0,left:0,...v},B=Array.isArray(d)?d:[d],Z=B.length>0,ne={padding:X,boundary:B.filter(Y1),altBoundary:Z},{refs:ce,floatingStyles:G,placement:Y,isPositioned:j,middlewareData:W}=L1({strategy:"fixed",placement:O,whileElementsMounted:(...Be)=>E1(...Be,{animationFrame:_==="always"}),elements:{reference:y.anchor},middleware:[U1({mainAxis:o+b,alignmentAxis:c}),h&&F1({mainAxis:!0,crossAxis:!1,limiter:g==="partial"?O1():void 0,...ne}),h&&k1({...ne}),z1({...ne,apply:({elements:Be,rects:Qe,availableWidth:pt,availableHeight:st})=>{const{width:Ct,height:wt}=Qe.reference,Wt=Be.floating.style;Wt.setProperty("--radix-popper-available-width",`${pt}px`),Wt.setProperty("--radix-popper-available-height",`${st}px`),Wt.setProperty("--radix-popper-anchor-width",`${Ct}px`),Wt.setProperty("--radix-popper-anchor-height",`${wt}px`)}}),C&&V1({element:C,padding:f}),K1({arrowWidth:F,arrowHeight:b}),m&&B1({strategy:"referenceHidden",...ne})]}),[z,$]=ax(Y),P=Di(M);ls(()=>{j&&(P==null||P())},[j,P]);const V=(he=W.arrow)==null?void 0:he.x,ge=(pe=W.arrow)==null?void 0:pe.y,ye=((oe=W.arrow)==null?void 0:oe.centerOffset)!==0,[Se,te]=L.useState();return ls(()=>{x&&te(window.getComputedStyle(x).zIndex)},[x]),w.jsx("div",{ref:ce.setFloating,"data-radix-popper-content-wrapper":"",style:{...G,transform:j?G.transform:"translate(0, -200%)",minWidth:"max-content",zIndex:Se,"--radix-popper-transform-origin":[(Ae=W.transformOrigin)==null?void 0:Ae.x,(Te=W.transformOrigin)==null?void 0:Te.y].join(" "),...((rt=W.hide)==null?void 0:rt.referenceHidden)&&{visibility:"hidden",pointerEvents:"none"}},dir:n.dir,children:w.jsx(j1,{scope:t,placedSide:z,onArrowChange:k,arrowX:V,arrowY:ge,shouldHideArrow:ye,children:w.jsx(It.div,{"data-side":z,"data-align":$,...E,ref:N,style:{...E.style,animation:j?void 0:"none"}})})})});rx.displayName=Op;var sx="PopperArrow",$1={top:"bottom",right:"left",bottom:"top",left:"right"},ox=L.forwardRef(function(e,t){const{__scopePopper:r,...o}=e,a=X1(sx,r),c=$1[a.placedSide];return w.jsx("span",{ref:a.onArrowChange,style:{position:"absolute",left:a.arrowX,top:a.arrowY,[c]:0,transformOrigin:{top:"",right:"0 0",bottom:"center 0",left:"100% 0"}[a.placedSide],transform:{top:"translateY(100%)",right:"translateY(50%) rotate(90deg) translateX(-50%)",bottom:"rotate(180deg)",left:"translateY(50%) rotate(-90deg) translateX(50%)"}[a.placedSide],visibility:a.shouldHideArrow?"hidden":void 0},children:w.jsx(H1,{...o,ref:t,style:{...o.style,display:"block"}})})});ox.displayName=sx;function Y1(n){return n!==null}var K1=n=>({name:"transformOrigin",options:n,fn(e){var y,x,T;const{placement:t,rects:r,middlewareData:o}=e,c=((y=o.arrow)==null?void 0:y.centerOffset)!==0,f=c?0:n.arrowWidth,h=c?0:n.arrowHeight,[d,v]=ax(t),g={start:"0%",center:"50%",end:"100%"}[v],m=(((x=o.arrow)==null?void 0:x.x)??0)+f/2,_=(((T=o.arrow)==null?void 0:T.y)??0)+h/2;let M="",E="";return d==="bottom"?(M=c?g:`${m}px`,E=`${-h}px`):d==="top"?(M=c?g:`${m}px`,E=`${r.floating.height+h}px`):d==="right"?(M=`${-h}px`,E=c?g:`${_}px`):d==="left"&&(M=`${r.floating.width+h}px`,E=c?g:`${_}px`),{data:{x:M,y:E}}}});function ax(n){const[e,t="center"]=n.split("-");return[e,t]}var q1=tx,Z1=ix,Q1=rx,J1=ox,eb="Portal",lx=L.forwardRef((n,e)=>{var f;const{container:t,...r}=n,[o,a]=L.useState(!1);ls(()=>a(!0),[]);const c=t||o&&((f=globalThis==null?void 0:globalThis.document)==null?void 0:f.body);return c?hw.createPortal(w.jsx(It.div,{...r,ref:e}),c):null});lx.displayName=eb;function tb(n,e){return L.useReducer((t,r)=>e[t][r]??t,n)}var ps=n=>{const{present:e,children:t}=n,r=nb(e),o=typeof t=="function"?t({present:r.isPresent}):L.Children.only(t),a=tn(r.ref,ib(o));return typeof t=="function"||r.isPresent?L.cloneElement(o,{ref:a}):null};ps.displayName="Presence";function nb(n){const[e,t]=L.useState(),r=L.useRef({}),o=L.useRef(n),a=L.useRef("none"),c=n?"mounted":"unmounted",[f,h]=tb(c,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return L.useEffect(()=>{const d=vc(r.current);a.current=f==="mounted"?d:"none"},[f]),ls(()=>{const d=r.current,v=o.current;if(v!==n){const m=a.current,_=vc(d);n?h("MOUNT"):_==="none"||(d==null?void 0:d.display)==="none"?h("UNMOUNT"):h(v&&m!==_?"ANIMATION_OUT":"UNMOUNT"),o.current=n}},[n,h]),ls(()=>{if(e){let d;const v=e.ownerDocument.defaultView??window,g=_=>{const E=vc(r.current).includes(_.animationName);if(_.target===e&&E&&(h("ANIMATION_END"),!o.current)){const y=e.style.animationFillMode;e.style.animationFillMode="forwards",d=v.setTimeout(()=>{e.style.animationFillMode==="forwards"&&(e.style.animationFillMode=y)})}},m=_=>{_.target===e&&(a.current=vc(r.current))};return e.addEventListener("animationstart",m),e.addEventListener("animationcancel",g),e.addEventListener("animationend",g),()=>{v.clearTimeout(d),e.removeEventListener("animationstart",m),e.removeEventListener("animationcancel",g),e.removeEventListener("animationend",g)}}else h("ANIMATION_END")},[e,h]),{isPresent:["mounted","unmountSuspended"].includes(f),ref:L.useCallback(d=>{d&&(r.current=getComputedStyle(d)),t(d)},[])}}function vc(n){return(n==null?void 0:n.animationName)||"none"}function ib(n){var r,o;let e=(r=Object.getOwnPropertyDescriptor(n.props,"ref"))==null?void 0:r.get,t=e&&"isReactWarning"in e&&e.isReactWarning;return t?n.ref:(e=(o=Object.getOwnPropertyDescriptor(n,"ref"))==null?void 0:o.get,t=e&&"isReactWarning"in e&&e.isReactWarning,t?n.props.ref:n.props.ref||n.ref)}var Fd="rovingFocusGroup.onEntryFocus",rb={bubbles:!1,cancelable:!0},Uu="RovingFocusGroup",[Rh,cx,sb]=Pu(Uu),[ob,ta]=Ii(Uu,[sb]),[ab,lb]=ob(Uu),ux=L.forwardRef((n,e)=>w.jsx(Rh.Provider,{scope:n.__scopeRovingFocusGroup,children:w.jsx(Rh.Slot,{scope:n.__scopeRovingFocusGroup,children:w.jsx(cb,{...n,ref:e})})}));ux.displayName=Uu;var cb=L.forwardRef((n,e)=>{const{__scopeRovingFocusGroup:t,orientation:r,loop:o=!1,dir:a,currentTabStopId:c,defaultCurrentTabStopId:f,onCurrentTabStopIdChange:h,onEntryFocus:d,preventScrollOnEntryFocus:v=!1,...g}=n,m=L.useRef(null),_=tn(e,m),M=Qo(a),[E=null,y]=hs({prop:c,defaultProp:f,onChange:h}),[x,T]=L.useState(!1),N=Di(d),C=cx(t),k=L.useRef(!1),[I,F]=L.useState(0);return L.useEffect(()=>{const b=m.current;if(b)return b.addEventListener(Fd,N),()=>b.removeEventListener(Fd,N)},[N]),w.jsx(ab,{scope:t,orientation:r,dir:M,loop:o,currentTabStopId:E,onItemFocus:L.useCallback(b=>y(b),[y]),onItemShiftTab:L.useCallback(()=>T(!0),[]),onFocusableItemAdd:L.useCallback(()=>F(b=>b+1),[]),onFocusableItemRemove:L.useCallback(()=>F(b=>b-1),[]),children:w.jsx(It.div,{tabIndex:x||I===0?-1:0,"data-orientation":r,...g,ref:_,style:{outline:"none",...n.style},onMouseDown:lt(n.onMouseDown,()=>{k.current=!0}),onFocus:lt(n.onFocus,b=>{const O=!k.current;if(b.target===b.currentTarget&&O&&!x){const X=new CustomEvent(Fd,rb);if(b.currentTarget.dispatchEvent(X),!X.defaultPrevented){const B=C().filter(Y=>Y.focusable),Z=B.find(Y=>Y.active),ne=B.find(Y=>Y.id===E),G=[Z,ne,...B].filter(Boolean).map(Y=>Y.ref.current);hx(G,v)}}k.current=!1}),onBlur:lt(n.onBlur,()=>T(!1))})})}),fx="RovingFocusGroupItem",dx=L.forwardRef((n,e)=>{const{__scopeRovingFocusGroup:t,focusable:r=!0,active:o=!1,tabStopId:a,...c}=n,f=Xo(),h=a||f,d=lb(fx,t),v=d.currentTabStopId===h,g=cx(t),{onFocusableItemAdd:m,onFocusableItemRemove:_}=d;return L.useEffect(()=>{if(r)return m(),()=>_()},[r,m,_]),w.jsx(Rh.ItemSlot,{scope:t,id:h,focusable:r,active:o,children:w.jsx(It.span,{tabIndex:v?0:-1,"data-orientation":d.orientation,...c,ref:e,onMouseDown:lt(n.onMouseDown,M=>{r?d.onItemFocus(h):M.preventDefault()}),onFocus:lt(n.onFocus,()=>d.onItemFocus(h)),onKeyDown:lt(n.onKeyDown,M=>{if(M.key==="Tab"&&M.shiftKey){d.onItemShiftTab();return}if(M.target!==M.currentTarget)return;const E=db(M,d.orientation,d.dir);if(E!==void 0){if(M.metaKey||M.ctrlKey||M.altKey||M.shiftKey)return;M.preventDefault();let x=g().filter(T=>T.focusable).map(T=>T.ref.current);if(E==="last")x.reverse();else if(E==="prev"||E==="next"){E==="prev"&&x.reverse();const T=x.indexOf(M.currentTarget);x=d.loop?hb(x,T+1):x.slice(T+1)}setTimeout(()=>hx(x))}})})})});dx.displayName=fx;var ub={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function fb(n,e){return e!=="rtl"?n:n==="ArrowLeft"?"ArrowRight":n==="ArrowRight"?"ArrowLeft":n}function db(n,e,t){const r=fb(n.key,t);if(!(e==="vertical"&&["ArrowLeft","ArrowRight"].includes(r))&&!(e==="horizontal"&&["ArrowUp","ArrowDown"].includes(r)))return ub[r]}function hx(n,e=!1){const t=document.activeElement;for(const r of n)if(r===t||(r.focus({preventScroll:e}),document.activeElement!==t))return}function hb(n,e){return n.map((t,r)=>n[(e+r)%n.length])}var kp=ux,zp=dx,pb=function(n){if(typeof document>"u")return null;var e=Array.isArray(n)?n[0]:n;return e.ownerDocument.body},xo=new WeakMap,_c=new WeakMap,xc={},Od=0,px=function(n){return n&&(n.host||px(n.parentNode))},mb=function(n,e){return e.map(function(t){if(n.contains(t))return t;var r=px(t);return r&&n.contains(r)?r:(console.error("aria-hidden",t,"in not contained inside",n,". Doing nothing"),null)}).filter(function(t){return!!t})},gb=function(n,e,t,r){var o=mb(e,Array.isArray(n)?n:[n]);xc[t]||(xc[t]=new WeakMap);var a=xc[t],c=[],f=new Set,h=new Set(o),d=function(g){!g||f.has(g)||(f.add(g),d(g.parentNode))};o.forEach(d);var v=function(g){!g||h.has(g)||Array.prototype.forEach.call(g.children,function(m){if(f.has(m))v(m);else try{var _=m.getAttribute(r),M=_!==null&&_!=="false",E=(xo.get(m)||0)+1,y=(a.get(m)||0)+1;xo.set(m,E),a.set(m,y),c.push(m),E===1&&M&&_c.set(m,!0),y===1&&m.setAttribute(t,"true"),M||m.setAttribute(r,"true")}catch(x){console.error("aria-hidden: cannot operate on ",m,x)}})};return v(e),f.clear(),Od++,function(){c.forEach(function(g){var m=xo.get(g)-1,_=a.get(g)-1;xo.set(g,m),a.set(g,_),m||(_c.has(g)||g.removeAttribute(r),_c.delete(g)),_||g.removeAttribute(t)}),Od--,Od||(xo=new WeakMap,xo=new WeakMap,_c=new WeakMap,xc={})}},vb=function(n,e,t){t===void 0&&(t="data-aria-hidden");var r=Array.from(Array.isArray(n)?n:[n]),o=pb(n);return o?(r.push.apply(r,Array.from(o.querySelectorAll("[aria-live], script"))),gb(r,o,t,"aria-hidden")):function(){return null}},Wi=function(){return Wi=Object.assign||function(e){for(var t,r=1,o=arguments.length;r<o;r++){t=arguments[r];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e},Wi.apply(this,arguments)};function mx(n,e){var t={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(t[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(n);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(n,r[o])&&(t[r[o]]=n[r[o]]);return t}function _b(n,e,t){if(t||arguments.length===2)for(var r=0,o=e.length,a;r<o;r++)(a||!(r in e))&&(a||(a=Array.prototype.slice.call(e,0,r)),a[r]=e[r]);return n.concat(a||Array.prototype.slice.call(e))}var tu="right-scroll-bar-position",nu="width-before-scroll-bar",xb="with-scroll-bars-hidden",yb="--removed-body-scroll-bar-size";function kd(n,e){return typeof n=="function"?n(e):n&&(n.current=e),n}function Sb(n,e){var t=L.useState(function(){return{value:n,callback:e,facade:{get current(){return t.value},set current(r){var o=t.value;o!==r&&(t.value=r,t.callback(r,o))}}}})[0];return t.callback=e,t.facade}var Mb=typeof window<"u"?L.useLayoutEffect:L.useEffect,gv=new WeakMap;function Eb(n,e){var t=Sb(null,function(r){return n.forEach(function(o){return kd(o,r)})});return Mb(function(){var r=gv.get(t);if(r){var o=new Set(r),a=new Set(n),c=t.current;o.forEach(function(f){a.has(f)||kd(f,null)}),a.forEach(function(f){o.has(f)||kd(f,c)})}gv.set(t,n)},[n]),t}function wb(n){return n}function bb(n,e){e===void 0&&(e=wb);var t=[],r=!1,o={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return t.length?t[t.length-1]:n},useMedium:function(a){var c=e(a,r);return t.push(c),function(){t=t.filter(function(f){return f!==c})}},assignSyncMedium:function(a){for(r=!0;t.length;){var c=t;t=[],c.forEach(a)}t={push:function(f){return a(f)},filter:function(){return t}}},assignMedium:function(a){r=!0;var c=[];if(t.length){var f=t;t=[],f.forEach(a),c=t}var h=function(){var v=c;c=[],v.forEach(a)},d=function(){return Promise.resolve().then(h)};d(),t={push:function(v){c.push(v),d()},filter:function(v){return c=c.filter(v),t}}}};return o}function Tb(n){n===void 0&&(n={});var e=bb(null);return e.options=Wi({async:!0,ssr:!1},n),e}var gx=function(n){var e=n.sideCar,t=mx(n,["sideCar"]);if(!e)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=e.read();if(!r)throw new Error("Sidecar medium not found");return L.createElement(r,Wi({},t))};gx.isSideCarExport=!0;function Ab(n,e){return n.useMedium(e),gx}var vx=Tb(),zd=function(){},Fu=L.forwardRef(function(n,e){var t=L.useRef(null),r=L.useState({onScrollCapture:zd,onWheelCapture:zd,onTouchMoveCapture:zd}),o=r[0],a=r[1],c=n.forwardProps,f=n.children,h=n.className,d=n.removeScrollBar,v=n.enabled,g=n.shards,m=n.sideCar,_=n.noRelative,M=n.noIsolation,E=n.inert,y=n.allowPinchZoom,x=n.as,T=x===void 0?"div":x,N=n.gapMode,C=mx(n,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),k=m,I=Eb([t,e]),F=Wi(Wi({},C),o);return L.createElement(L.Fragment,null,v&&L.createElement(k,{sideCar:vx,removeScrollBar:d,shards:g,noRelative:_,noIsolation:M,inert:E,setCallbacks:a,allowPinchZoom:!!y,lockRef:t,gapMode:N}),c?L.cloneElement(L.Children.only(f),Wi(Wi({},F),{ref:I})):L.createElement(T,Wi({},F,{className:h,ref:I}),f))});Fu.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};Fu.classNames={fullWidth:nu,zeroRight:tu};var Rb=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Cb(){if(!document)return null;var n=document.createElement("style");n.type="text/css";var e=Rb();return e&&n.setAttribute("nonce",e),n}function Pb(n,e){n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}function Db(n){var e=document.head||document.getElementsByTagName("head")[0];e.appendChild(n)}var Nb=function(){var n=0,e=null;return{add:function(t){n==0&&(e=Cb())&&(Pb(e,t),Db(e)),n++},remove:function(){n--,!n&&e&&(e.parentNode&&e.parentNode.removeChild(e),e=null)}}},Lb=function(){var n=Nb();return function(e,t){L.useEffect(function(){return n.add(e),function(){n.remove()}},[e&&t])}},_x=function(){var n=Lb(),e=function(t){var r=t.styles,o=t.dynamic;return n(r,o),null};return e},Ib={left:0,top:0,right:0,gap:0},Bd=function(n){return parseInt(n||"",10)||0},Ub=function(n){var e=window.getComputedStyle(document.body),t=e[n==="padding"?"paddingLeft":"marginLeft"],r=e[n==="padding"?"paddingTop":"marginTop"],o=e[n==="padding"?"paddingRight":"marginRight"];return[Bd(t),Bd(r),Bd(o)]},Fb=function(n){if(n===void 0&&(n="margin"),typeof window>"u")return Ib;var e=Ub(n),t=document.documentElement.clientWidth,r=window.innerWidth;return{left:e[0],top:e[1],right:e[2],gap:Math.max(0,r-t+e[2]-e[0])}},Ob=_x(),Go="data-scroll-locked",kb=function(n,e,t,r){var o=n.left,a=n.top,c=n.right,f=n.gap;return t===void 0&&(t="margin"),`
  .`.concat(xb,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(f,"px ").concat(r,`;
  }
  body[`).concat(Go,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([e&&"position: relative ".concat(r,";"),t==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(a,`px;
    padding-right: `).concat(c,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(f,"px ").concat(r,`;
    `),t==="padding"&&"padding-right: ".concat(f,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(tu,` {
    right: `).concat(f,"px ").concat(r,`;
  }
  
  .`).concat(nu,` {
    margin-right: `).concat(f,"px ").concat(r,`;
  }
  
  .`).concat(tu," .").concat(tu,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(nu," .").concat(nu,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(Go,`] {
    `).concat(yb,": ").concat(f,`px;
  }
`)},vv=function(){var n=parseInt(document.body.getAttribute(Go)||"0",10);return isFinite(n)?n:0},zb=function(){L.useEffect(function(){return document.body.setAttribute(Go,(vv()+1).toString()),function(){var n=vv()-1;n<=0?document.body.removeAttribute(Go):document.body.setAttribute(Go,n.toString())}},[])},Bb=function(n){var e=n.noRelative,t=n.noImportant,r=n.gapMode,o=r===void 0?"margin":r;zb();var a=L.useMemo(function(){return Fb(o)},[o]);return L.createElement(Ob,{styles:kb(a,!e,o,t?"":"!important")})},Ch=!1;if(typeof window<"u")try{var yc=Object.defineProperty({},"passive",{get:function(){return Ch=!0,!0}});window.addEventListener("test",yc,yc),window.removeEventListener("test",yc,yc)}catch{Ch=!1}var yo=Ch?{passive:!1}:!1,Vb=function(n){return n.tagName==="TEXTAREA"},xx=function(n,e){if(!(n instanceof Element))return!1;var t=window.getComputedStyle(n);return t[e]!=="hidden"&&!(t.overflowY===t.overflowX&&!Vb(n)&&t[e]==="visible")},Gb=function(n){return xx(n,"overflowY")},Hb=function(n){return xx(n,"overflowX")},_v=function(n,e){var t=e.ownerDocument,r=e;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var o=yx(n,r);if(o){var a=Sx(n,r),c=a[1],f=a[2];if(c>f)return!0}r=r.parentNode}while(r&&r!==t.body);return!1},Wb=function(n){var e=n.scrollTop,t=n.scrollHeight,r=n.clientHeight;return[e,t,r]},jb=function(n){var e=n.scrollLeft,t=n.scrollWidth,r=n.clientWidth;return[e,t,r]},yx=function(n,e){return n==="v"?Gb(e):Hb(e)},Sx=function(n,e){return n==="v"?Wb(e):jb(e)},Xb=function(n,e){return n==="h"&&e==="rtl"?-1:1},$b=function(n,e,t,r,o){var a=Xb(n,window.getComputedStyle(e).direction),c=a*r,f=t.target,h=e.contains(f),d=!1,v=c>0,g=0,m=0;do{if(!f)break;var _=Sx(n,f),M=_[0],E=_[1],y=_[2],x=E-y-a*M;(M||x)&&yx(n,f)&&(g+=x,m+=M);var T=f.parentNode;f=T&&T.nodeType===Node.DOCUMENT_FRAGMENT_NODE?T.host:T}while(!h&&f!==document.body||h&&(e.contains(f)||e===f));return(v&&Math.abs(g)<1||!v&&Math.abs(m)<1)&&(d=!0),d},Sc=function(n){return"changedTouches"in n?[n.changedTouches[0].clientX,n.changedTouches[0].clientY]:[0,0]},xv=function(n){return[n.deltaX,n.deltaY]},yv=function(n){return n&&"current"in n?n.current:n},Yb=function(n,e){return n[0]===e[0]&&n[1]===e[1]},Kb=function(n){return`
  .block-interactivity-`.concat(n,` {pointer-events: none;}
  .allow-interactivity-`).concat(n,` {pointer-events: all;}
`)},qb=0,So=[];function Zb(n){var e=L.useRef([]),t=L.useRef([0,0]),r=L.useRef(),o=L.useState(qb++)[0],a=L.useState(_x)[0],c=L.useRef(n);L.useEffect(function(){c.current=n},[n]),L.useEffect(function(){if(n.inert){document.body.classList.add("block-interactivity-".concat(o));var E=_b([n.lockRef.current],(n.shards||[]).map(yv),!0).filter(Boolean);return E.forEach(function(y){return y.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),E.forEach(function(y){return y.classList.remove("allow-interactivity-".concat(o))})}}},[n.inert,n.lockRef.current,n.shards]);var f=L.useCallback(function(E,y){if("touches"in E&&E.touches.length===2||E.type==="wheel"&&E.ctrlKey)return!c.current.allowPinchZoom;var x=Sc(E),T=t.current,N="deltaX"in E?E.deltaX:T[0]-x[0],C="deltaY"in E?E.deltaY:T[1]-x[1],k,I=E.target,F=Math.abs(N)>Math.abs(C)?"h":"v";if("touches"in E&&F==="h"&&I.type==="range")return!1;var b=window.getSelection(),O=b&&b.anchorNode,X=O?O===I||O.contains(I):!1;if(X)return!1;var B=_v(F,I);if(!B)return!0;if(B?k=F:(k=F==="v"?"h":"v",B=_v(F,I)),!B)return!1;if(!r.current&&"changedTouches"in E&&(N||C)&&(r.current=k),!k)return!0;var Z=r.current||k;return $b(Z,y,E,Z==="h"?N:C)},[]),h=L.useCallback(function(E){var y=E;if(!(!So.length||So[So.length-1]!==a)){var x="deltaY"in y?xv(y):Sc(y),T=e.current.filter(function(k){return k.name===y.type&&(k.target===y.target||y.target===k.shadowParent)&&Yb(k.delta,x)})[0];if(T&&T.should){y.cancelable&&y.preventDefault();return}if(!T){var N=(c.current.shards||[]).map(yv).filter(Boolean).filter(function(k){return k.contains(y.target)}),C=N.length>0?f(y,N[0]):!c.current.noIsolation;C&&y.cancelable&&y.preventDefault()}}},[]),d=L.useCallback(function(E,y,x,T){var N={name:E,delta:y,target:x,should:T,shadowParent:Qb(x)};e.current.push(N),setTimeout(function(){e.current=e.current.filter(function(C){return C!==N})},1)},[]),v=L.useCallback(function(E){t.current=Sc(E),r.current=void 0},[]),g=L.useCallback(function(E){d(E.type,xv(E),E.target,f(E,n.lockRef.current))},[]),m=L.useCallback(function(E){d(E.type,Sc(E),E.target,f(E,n.lockRef.current))},[]);L.useEffect(function(){return So.push(a),n.setCallbacks({onScrollCapture:g,onWheelCapture:g,onTouchMoveCapture:m}),document.addEventListener("wheel",h,yo),document.addEventListener("touchmove",h,yo),document.addEventListener("touchstart",v,yo),function(){So=So.filter(function(E){return E!==a}),document.removeEventListener("wheel",h,yo),document.removeEventListener("touchmove",h,yo),document.removeEventListener("touchstart",v,yo)}},[]);var _=n.removeScrollBar,M=n.inert;return L.createElement(L.Fragment,null,M?L.createElement(a,{styles:Kb(o)}):null,_?L.createElement(Bb,{noRelative:n.noRelative,gapMode:n.gapMode}):null)}function Qb(n){for(var e=null;n!==null;)n instanceof ShadowRoot&&(e=n.host,n=n.host),n=n.parentNode;return e}const Jb=Ab(vx,Zb);var Mx=L.forwardRef(function(n,e){return L.createElement(Fu,Wi({},n,{ref:e,sideCar:Jb}))});Mx.classNames=Fu.classNames;var Ph=["Enter"," "],eT=["ArrowDown","PageUp","Home"],Ex=["ArrowUp","PageDown","End"],tT=[...eT,...Ex],nT={ltr:[...Ph,"ArrowRight"],rtl:[...Ph,"ArrowLeft"]},iT={ltr:["ArrowLeft"],rtl:["ArrowRight"]},cl="Menu",[rl,rT,sT]=Pu(cl),[js,wx]=Ii(cl,[sT,J_,ta]),Ou=J_(),bx=ta(),[oT,Xs]=js(cl),[aT,ul]=js(cl),Tx=n=>{const{__scopeMenu:e,open:t=!1,children:r,dir:o,onOpenChange:a,modal:c=!0}=n,f=Ou(e),[h,d]=L.useState(null),v=L.useRef(!1),g=Di(a),m=Qo(o);return L.useEffect(()=>{const _=()=>{v.current=!0,document.addEventListener("pointerdown",M,{capture:!0,once:!0}),document.addEventListener("pointermove",M,{capture:!0,once:!0})},M=()=>v.current=!1;return document.addEventListener("keydown",_,{capture:!0}),()=>{document.removeEventListener("keydown",_,{capture:!0}),document.removeEventListener("pointerdown",M,{capture:!0}),document.removeEventListener("pointermove",M,{capture:!0})}},[]),w.jsx(q1,{...f,children:w.jsx(oT,{scope:e,open:t,onOpenChange:g,content:h,onContentChange:d,children:w.jsx(aT,{scope:e,onClose:L.useCallback(()=>g(!1),[g]),isUsingKeyboardRef:v,dir:m,modal:c,children:r})})})};Tx.displayName=cl;var lT="MenuAnchor",Bp=L.forwardRef((n,e)=>{const{__scopeMenu:t,...r}=n,o=Ou(t);return w.jsx(Z1,{...o,...r,ref:e})});Bp.displayName=lT;var Vp="MenuPortal",[cT,Ax]=js(Vp,{forceMount:void 0}),Rx=n=>{const{__scopeMenu:e,forceMount:t,children:r,container:o}=n,a=Xs(Vp,e);return w.jsx(cT,{scope:e,forceMount:t,children:w.jsx(ps,{present:t||a.open,children:w.jsx(lx,{asChild:!0,container:o,children:r})})})};Rx.displayName=Vp;var gi="MenuContent",[uT,Gp]=js(gi),Cx=L.forwardRef((n,e)=>{const t=Ax(gi,n.__scopeMenu),{forceMount:r=t.forceMount,...o}=n,a=Xs(gi,n.__scopeMenu),c=ul(gi,n.__scopeMenu);return w.jsx(rl.Provider,{scope:n.__scopeMenu,children:w.jsx(ps,{present:r||a.open,children:w.jsx(rl.Slot,{scope:n.__scopeMenu,children:c.modal?w.jsx(fT,{...o,ref:e}):w.jsx(dT,{...o,ref:e})})})})}),fT=L.forwardRef((n,e)=>{const t=Xs(gi,n.__scopeMenu),r=L.useRef(null),o=tn(e,r);return L.useEffect(()=>{const a=r.current;if(a)return vb(a)},[]),w.jsx(Hp,{...n,ref:o,trapFocus:t.open,disableOutsidePointerEvents:t.open,disableOutsideScroll:!0,onFocusOutside:lt(n.onFocusOutside,a=>a.preventDefault(),{checkForDefaultPrevented:!1}),onDismiss:()=>t.onOpenChange(!1)})}),dT=L.forwardRef((n,e)=>{const t=Xs(gi,n.__scopeMenu);return w.jsx(Hp,{...n,ref:e,trapFocus:!1,disableOutsidePointerEvents:!1,disableOutsideScroll:!1,onDismiss:()=>t.onOpenChange(!1)})}),Hp=L.forwardRef((n,e)=>{const{__scopeMenu:t,loop:r=!1,trapFocus:o,onOpenAutoFocus:a,onCloseAutoFocus:c,disableOutsidePointerEvents:f,onEntryFocus:h,onEscapeKeyDown:d,onPointerDownOutside:v,onFocusOutside:g,onInteractOutside:m,onDismiss:_,disableOutsideScroll:M,...E}=n,y=Xs(gi,t),x=ul(gi,t),T=Ou(t),N=bx(t),C=rT(t),[k,I]=L.useState(null),F=L.useRef(null),b=tn(e,F,y.onContentChange),O=L.useRef(0),X=L.useRef(""),B=L.useRef(0),Z=L.useRef(null),ne=L.useRef("right"),ce=L.useRef(0),G=M?Mx:L.Fragment,Y=M?{as:nl,allowPinchZoom:!0}:void 0,j=z=>{var he,pe;const $=X.current+z,P=C().filter(oe=>!oe.disabled),V=document.activeElement,ge=(he=P.find(oe=>oe.ref.current===V))==null?void 0:he.textValue,ye=P.map(oe=>oe.textValue),Se=wT(ye,$,ge),te=(pe=P.find(oe=>oe.textValue===Se))==null?void 0:pe.ref.current;(function oe(Ae){X.current=Ae,window.clearTimeout(O.current),Ae!==""&&(O.current=window.setTimeout(()=>oe(""),1e3))})($),te&&setTimeout(()=>te.focus())};L.useEffect(()=>()=>window.clearTimeout(O.current),[]),Rw();const W=L.useCallback(z=>{var P,V;return ne.current===((P=Z.current)==null?void 0:P.side)&&TT(z,(V=Z.current)==null?void 0:V.area)},[]);return w.jsx(uT,{scope:t,searchRef:X,onItemEnter:L.useCallback(z=>{W(z)&&z.preventDefault()},[W]),onItemLeave:L.useCallback(z=>{var $;W(z)||(($=F.current)==null||$.focus(),I(null))},[W]),onTriggerLeave:L.useCallback(z=>{W(z)&&z.preventDefault()},[W]),pointerGraceTimerRef:B,onPointerGraceIntentChange:L.useCallback(z=>{Z.current=z},[]),children:w.jsx(G,{...Y,children:w.jsx(k_,{asChild:!0,trapped:o,onMountAutoFocus:lt(a,z=>{var $;z.preventDefault(),($=F.current)==null||$.focus({preventScroll:!0})}),onUnmountAutoFocus:c,children:w.jsx(F_,{asChild:!0,disableOutsidePointerEvents:f,onEscapeKeyDown:d,onPointerDownOutside:v,onFocusOutside:g,onInteractOutside:m,onDismiss:_,children:w.jsx(kp,{asChild:!0,...N,dir:x.dir,orientation:"vertical",loop:r,currentTabStopId:k,onCurrentTabStopIdChange:I,onEntryFocus:lt(h,z=>{x.isUsingKeyboardRef.current||z.preventDefault()}),preventScrollOnEntryFocus:!0,children:w.jsx(Q1,{role:"menu","aria-orientation":"vertical","data-state":jx(y.open),"data-radix-menu-content":"",dir:x.dir,...T,...E,ref:b,style:{outline:"none",...E.style},onKeyDown:lt(E.onKeyDown,z=>{const P=z.target.closest("[data-radix-menu-content]")===z.currentTarget,V=z.ctrlKey||z.altKey||z.metaKey,ge=z.key.length===1;P&&(z.key==="Tab"&&z.preventDefault(),!V&&ge&&j(z.key));const ye=F.current;if(z.target!==ye||!tT.includes(z.key))return;z.preventDefault();const te=C().filter(he=>!he.disabled).map(he=>he.ref.current);Ex.includes(z.key)&&te.reverse(),MT(te)}),onBlur:lt(n.onBlur,z=>{z.currentTarget.contains(z.target)||(window.clearTimeout(O.current),X.current="")}),onPointerMove:lt(n.onPointerMove,sl(z=>{const $=z.target,P=ce.current!==z.clientX;if(z.currentTarget.contains($)&&P){const V=z.clientX>ce.current?"right":"left";ne.current=V,ce.current=z.clientX}}))})})})})})})});Cx.displayName=gi;var hT="MenuGroup",Wp=L.forwardRef((n,e)=>{const{__scopeMenu:t,...r}=n;return w.jsx(It.div,{role:"group",...r,ref:e})});Wp.displayName=hT;var pT="MenuLabel",Px=L.forwardRef((n,e)=>{const{__scopeMenu:t,...r}=n;return w.jsx(It.div,{...r,ref:e})});Px.displayName=pT;var mu="MenuItem",Sv="menu.itemSelect",ku=L.forwardRef((n,e)=>{const{disabled:t=!1,onSelect:r,...o}=n,a=L.useRef(null),c=ul(mu,n.__scopeMenu),f=Gp(mu,n.__scopeMenu),h=tn(e,a),d=L.useRef(!1),v=()=>{const g=a.current;if(!t&&g){const m=new CustomEvent(Sv,{bubbles:!0,cancelable:!0});g.addEventListener(Sv,_=>r==null?void 0:r(_),{once:!0}),I_(g,m),m.defaultPrevented?d.current=!1:c.onClose()}};return w.jsx(Dx,{...o,ref:h,disabled:t,onClick:lt(n.onClick,v),onPointerDown:g=>{var m;(m=n.onPointerDown)==null||m.call(n,g),d.current=!0},onPointerUp:lt(n.onPointerUp,g=>{var m;d.current||(m=g.currentTarget)==null||m.click()}),onKeyDown:lt(n.onKeyDown,g=>{const m=f.searchRef.current!=="";t||m&&g.key===" "||Ph.includes(g.key)&&(g.currentTarget.click(),g.preventDefault())})})});ku.displayName=mu;var Dx=L.forwardRef((n,e)=>{const{__scopeMenu:t,disabled:r=!1,textValue:o,...a}=n,c=Gp(mu,t),f=bx(t),h=L.useRef(null),d=tn(e,h),[v,g]=L.useState(!1),[m,_]=L.useState("");return L.useEffect(()=>{const M=h.current;M&&_((M.textContent??"").trim())},[a.children]),w.jsx(rl.ItemSlot,{scope:t,disabled:r,textValue:o??m,children:w.jsx(zp,{asChild:!0,...f,focusable:!r,children:w.jsx(It.div,{role:"menuitem","data-highlighted":v?"":void 0,"aria-disabled":r||void 0,"data-disabled":r?"":void 0,...a,ref:d,onPointerMove:lt(n.onPointerMove,sl(M=>{r?c.onItemLeave(M):(c.onItemEnter(M),M.defaultPrevented||M.currentTarget.focus({preventScroll:!0}))})),onPointerLeave:lt(n.onPointerLeave,sl(M=>c.onItemLeave(M))),onFocus:lt(n.onFocus,()=>g(!0)),onBlur:lt(n.onBlur,()=>g(!1))})})})}),mT="MenuCheckboxItem",Nx=L.forwardRef((n,e)=>{const{checked:t=!1,onCheckedChange:r,...o}=n;return w.jsx(Ox,{scope:n.__scopeMenu,checked:t,children:w.jsx(ku,{role:"menuitemcheckbox","aria-checked":gu(t)?"mixed":t,...o,ref:e,"data-state":Xp(t),onSelect:lt(o.onSelect,()=>r==null?void 0:r(gu(t)?!0:!t),{checkForDefaultPrevented:!1})})})});Nx.displayName=mT;var Lx="MenuRadioGroup",[gT,vT]=js(Lx,{value:void 0,onValueChange:()=>{}}),Ix=L.forwardRef((n,e)=>{const{value:t,onValueChange:r,...o}=n,a=Di(r);return w.jsx(gT,{scope:n.__scopeMenu,value:t,onValueChange:a,children:w.jsx(Wp,{...o,ref:e})})});Ix.displayName=Lx;var Ux="MenuRadioItem",Fx=L.forwardRef((n,e)=>{const{value:t,...r}=n,o=vT(Ux,n.__scopeMenu),a=t===o.value;return w.jsx(Ox,{scope:n.__scopeMenu,checked:a,children:w.jsx(ku,{role:"menuitemradio","aria-checked":a,...r,ref:e,"data-state":Xp(a),onSelect:lt(r.onSelect,()=>{var c;return(c=o.onValueChange)==null?void 0:c.call(o,t)},{checkForDefaultPrevented:!1})})})});Fx.displayName=Ux;var jp="MenuItemIndicator",[Ox,_T]=js(jp,{checked:!1}),kx=L.forwardRef((n,e)=>{const{__scopeMenu:t,forceMount:r,...o}=n,a=_T(jp,t);return w.jsx(ps,{present:r||gu(a.checked)||a.checked===!0,children:w.jsx(It.span,{...o,ref:e,"data-state":Xp(a.checked)})})});kx.displayName=jp;var xT="MenuSeparator",zx=L.forwardRef((n,e)=>{const{__scopeMenu:t,...r}=n;return w.jsx(It.div,{role:"separator","aria-orientation":"horizontal",...r,ref:e})});zx.displayName=xT;var yT="MenuArrow",Bx=L.forwardRef((n,e)=>{const{__scopeMenu:t,...r}=n,o=Ou(t);return w.jsx(J1,{...o,...r,ref:e})});Bx.displayName=yT;var ST="MenuSub",[aL,Vx]=js(ST),Ja="MenuSubTrigger",Gx=L.forwardRef((n,e)=>{const t=Xs(Ja,n.__scopeMenu),r=ul(Ja,n.__scopeMenu),o=Vx(Ja,n.__scopeMenu),a=Gp(Ja,n.__scopeMenu),c=L.useRef(null),{pointerGraceTimerRef:f,onPointerGraceIntentChange:h}=a,d={__scopeMenu:n.__scopeMenu},v=L.useCallback(()=>{c.current&&window.clearTimeout(c.current),c.current=null},[]);return L.useEffect(()=>v,[v]),L.useEffect(()=>{const g=f.current;return()=>{window.clearTimeout(g),h(null)}},[f,h]),w.jsx(Bp,{asChild:!0,...d,children:w.jsx(Dx,{id:o.triggerId,"aria-haspopup":"menu","aria-expanded":t.open,"aria-controls":o.contentId,"data-state":jx(t.open),...n,ref:Cu(e,o.onTriggerChange),onClick:g=>{var m;(m=n.onClick)==null||m.call(n,g),!(n.disabled||g.defaultPrevented)&&(g.currentTarget.focus(),t.open||t.onOpenChange(!0))},onPointerMove:lt(n.onPointerMove,sl(g=>{a.onItemEnter(g),!g.defaultPrevented&&!n.disabled&&!t.open&&!c.current&&(a.onPointerGraceIntentChange(null),c.current=window.setTimeout(()=>{t.onOpenChange(!0),v()},100))})),onPointerLeave:lt(n.onPointerLeave,sl(g=>{var _,M;v();const m=(_=t.content)==null?void 0:_.getBoundingClientRect();if(m){const E=(M=t.content)==null?void 0:M.dataset.side,y=E==="right",x=y?-5:5,T=m[y?"left":"right"],N=m[y?"right":"left"];a.onPointerGraceIntentChange({area:[{x:g.clientX+x,y:g.clientY},{x:T,y:m.top},{x:N,y:m.top},{x:N,y:m.bottom},{x:T,y:m.bottom}],side:E}),window.clearTimeout(f.current),f.current=window.setTimeout(()=>a.onPointerGraceIntentChange(null),300)}else{if(a.onTriggerLeave(g),g.defaultPrevented)return;a.onPointerGraceIntentChange(null)}})),onKeyDown:lt(n.onKeyDown,g=>{var _;const m=a.searchRef.current!=="";n.disabled||m&&g.key===" "||nT[r.dir].includes(g.key)&&(t.onOpenChange(!0),(_=t.content)==null||_.focus(),g.preventDefault())})})})});Gx.displayName=Ja;var Hx="MenuSubContent",Wx=L.forwardRef((n,e)=>{const t=Ax(gi,n.__scopeMenu),{forceMount:r=t.forceMount,...o}=n,a=Xs(gi,n.__scopeMenu),c=ul(gi,n.__scopeMenu),f=Vx(Hx,n.__scopeMenu),h=L.useRef(null),d=tn(e,h);return w.jsx(rl.Provider,{scope:n.__scopeMenu,children:w.jsx(ps,{present:r||a.open,children:w.jsx(rl.Slot,{scope:n.__scopeMenu,children:w.jsx(Hp,{id:f.contentId,"aria-labelledby":f.triggerId,...o,ref:d,align:"start",side:c.dir==="rtl"?"left":"right",disableOutsidePointerEvents:!1,disableOutsideScroll:!1,trapFocus:!1,onOpenAutoFocus:v=>{var g;c.isUsingKeyboardRef.current&&((g=h.current)==null||g.focus()),v.preventDefault()},onCloseAutoFocus:v=>v.preventDefault(),onFocusOutside:lt(n.onFocusOutside,v=>{v.target!==f.trigger&&a.onOpenChange(!1)}),onEscapeKeyDown:lt(n.onEscapeKeyDown,v=>{c.onClose(),v.preventDefault()}),onKeyDown:lt(n.onKeyDown,v=>{var _;const g=v.currentTarget.contains(v.target),m=iT[c.dir].includes(v.key);g&&m&&(a.onOpenChange(!1),(_=f.trigger)==null||_.focus(),v.preventDefault())})})})})})});Wx.displayName=Hx;function jx(n){return n?"open":"closed"}function gu(n){return n==="indeterminate"}function Xp(n){return gu(n)?"indeterminate":n?"checked":"unchecked"}function MT(n){const e=document.activeElement;for(const t of n)if(t===e||(t.focus(),document.activeElement!==e))return}function ET(n,e){return n.map((t,r)=>n[(e+r)%n.length])}function wT(n,e,t){const o=e.length>1&&Array.from(e).every(d=>d===e[0])?e[0]:e,a=t?n.indexOf(t):-1;let c=ET(n,Math.max(a,0));o.length===1&&(c=c.filter(d=>d!==t));const h=c.find(d=>d.toLowerCase().startsWith(o.toLowerCase()));return h!==t?h:void 0}function bT(n,e){const{x:t,y:r}=n;let o=!1;for(let a=0,c=e.length-1;a<e.length;c=a++){const f=e[a].x,h=e[a].y,d=e[c].x,v=e[c].y;h>r!=v>r&&t<(d-f)*(r-h)/(v-h)+f&&(o=!o)}return o}function TT(n,e){if(!e)return!1;const t={x:n.clientX,y:n.clientY};return bT(t,e)}function sl(n){return e=>e.pointerType==="mouse"?n(e):void 0}var AT=Tx,RT=Bp,CT=Rx,PT=Cx,DT=Wp,NT=Px,LT=ku,IT=Nx,UT=Ix,FT=Fx,OT=kx,kT=zx,zT=Bx,BT=Gx,VT=Wx,$p="DropdownMenu",[GT]=Ii($p,[wx]),zn=wx(),[HT,Xx]=GT($p),$x=n=>{const{__scopeDropdownMenu:e,children:t,dir:r,open:o,defaultOpen:a,onOpenChange:c,modal:f=!0}=n,h=zn(e),d=L.useRef(null),[v=!1,g]=hs({prop:o,defaultProp:a,onChange:c});return w.jsx(HT,{scope:e,triggerId:Xo(),triggerRef:d,contentId:Xo(),open:v,onOpenChange:g,onOpenToggle:L.useCallback(()=>g(m=>!m),[g]),modal:f,children:w.jsx(AT,{...h,open:v,onOpenChange:g,dir:r,modal:f,children:t})})};$x.displayName=$p;var Yx="DropdownMenuTrigger",Kx=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,disabled:r=!1,...o}=n,a=Xx(Yx,t),c=zn(t);return w.jsx(RT,{asChild:!0,...c,children:w.jsx(It.button,{type:"button",id:a.triggerId,"aria-haspopup":"menu","aria-expanded":a.open,"aria-controls":a.open?a.contentId:void 0,"data-state":a.open?"open":"closed","data-disabled":r?"":void 0,disabled:r,...o,ref:Cu(e,a.triggerRef),onPointerDown:lt(n.onPointerDown,f=>{!r&&f.button===0&&f.ctrlKey===!1&&(a.onOpenToggle(),a.open||f.preventDefault())}),onKeyDown:lt(n.onKeyDown,f=>{r||(["Enter"," "].includes(f.key)&&a.onOpenToggle(),f.key==="ArrowDown"&&a.onOpenChange(!0),["Enter"," ","ArrowDown"].includes(f.key)&&f.preventDefault())})})})});Kx.displayName=Yx;var WT="DropdownMenuPortal",qx=n=>{const{__scopeDropdownMenu:e,...t}=n,r=zn(e);return w.jsx(CT,{...r,...t})};qx.displayName=WT;var Zx="DropdownMenuContent",Qx=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=Xx(Zx,t),a=zn(t),c=L.useRef(!1);return w.jsx(PT,{id:o.contentId,"aria-labelledby":o.triggerId,...a,...r,ref:e,onCloseAutoFocus:lt(n.onCloseAutoFocus,f=>{var h;c.current||(h=o.triggerRef.current)==null||h.focus(),c.current=!1,f.preventDefault()}),onInteractOutside:lt(n.onInteractOutside,f=>{const h=f.detail.originalEvent,d=h.button===0&&h.ctrlKey===!0,v=h.button===2||d;(!o.modal||v)&&(c.current=!0)}),style:{...n.style,"--radix-dropdown-menu-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-dropdown-menu-content-available-width":"var(--radix-popper-available-width)","--radix-dropdown-menu-content-available-height":"var(--radix-popper-available-height)","--radix-dropdown-menu-trigger-width":"var(--radix-popper-anchor-width)","--radix-dropdown-menu-trigger-height":"var(--radix-popper-anchor-height)"}})});Qx.displayName=Zx;var jT="DropdownMenuGroup",XT=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(DT,{...o,...r,ref:e})});XT.displayName=jT;var $T="DropdownMenuLabel",YT=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(NT,{...o,...r,ref:e})});YT.displayName=$T;var KT="DropdownMenuItem",Jx=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(LT,{...o,...r,ref:e})});Jx.displayName=KT;var qT="DropdownMenuCheckboxItem",ZT=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(IT,{...o,...r,ref:e})});ZT.displayName=qT;var QT="DropdownMenuRadioGroup",JT=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(UT,{...o,...r,ref:e})});JT.displayName=QT;var eA="DropdownMenuRadioItem",tA=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(FT,{...o,...r,ref:e})});tA.displayName=eA;var nA="DropdownMenuItemIndicator",iA=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(OT,{...o,...r,ref:e})});iA.displayName=nA;var rA="DropdownMenuSeparator",sA=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(kT,{...o,...r,ref:e})});sA.displayName=rA;var oA="DropdownMenuArrow",aA=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(zT,{...o,...r,ref:e})});aA.displayName=oA;var lA="DropdownMenuSubTrigger",cA=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(BT,{...o,...r,ref:e})});cA.displayName=lA;var uA="DropdownMenuSubContent",fA=L.forwardRef((n,e)=>{const{__scopeDropdownMenu:t,...r}=n,o=zn(t);return w.jsx(VT,{...o,...r,ref:e,style:{...n.style,"--radix-dropdown-menu-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-dropdown-menu-content-available-width":"var(--radix-popper-available-width)","--radix-dropdown-menu-content-available-height":"var(--radix-popper-available-height)","--radix-dropdown-menu-trigger-width":"var(--radix-popper-anchor-width)","--radix-dropdown-menu-trigger-height":"var(--radix-popper-anchor-height)"}})});fA.displayName=uA;var dA=$x,hA=Kx,pA=qx,mA=Qx,Mv=Jx;function gA(){return w.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 17 17",fill:"none",children:[w.jsx("circle",{cx:"8.5",cy:"8.5",r:"2.5",fill:"#3b9eff"}),w.jsx("circle",{cx:"2",cy:"3",r:"1.4",fill:"#3b9eff",opacity:"0.5"}),w.jsx("circle",{cx:"15",cy:"3",r:"1.4",fill:"#3b9eff",opacity:"0.5"}),w.jsx("circle",{cx:"2.5",cy:"14",r:"1.4",fill:"#3b9eff",opacity:"0.5"}),w.jsx("circle",{cx:"15",cy:"14",r:"1.4",fill:"#3b9eff",opacity:"0.5"}),w.jsx("circle",{cx:"15.5",cy:"8.5",r:"1.2",fill:"#3b9eff",opacity:"0.35"}),w.jsx("line",{x1:"8.5",y1:"8.5",x2:"2",y2:"3",stroke:"#3b9eff",strokeOpacity:"0.28",strokeWidth:"0.8"}),w.jsx("line",{x1:"8.5",y1:"8.5",x2:"15",y2:"3",stroke:"#3b9eff",strokeOpacity:"0.28",strokeWidth:"0.8"}),w.jsx("line",{x1:"8.5",y1:"8.5",x2:"2.5",y2:"14",stroke:"#3b9eff",strokeOpacity:"0.28",strokeWidth:"0.8"}),w.jsx("line",{x1:"8.5",y1:"8.5",x2:"15",y2:"14",stroke:"#3b9eff",strokeOpacity:"0.28",strokeWidth:"0.8"}),w.jsx("line",{x1:"8.5",y1:"8.5",x2:"15.5",y2:"8.5",stroke:"#3b9eff",strokeOpacity:"0.22",strokeWidth:"0.8"}),w.jsx("line",{x1:"2",y1:"3",x2:"15",y2:"3",stroke:"#3b9eff",strokeOpacity:"0.12",strokeWidth:"0.5"}),w.jsx("line",{x1:"2.5",y1:"14",x2:"15",y2:"14",stroke:"#3b9eff",strokeOpacity:"0.12",strokeWidth:"0.5"})]})}function Ga({onClick:n,title:e,children:t,active:r=!1}){return w.jsx("button",{onClick:n,title:e,className:`w-7 h-7 flex items-center justify-center rounded transition-colors ${r?"bg-zinc-700 text-zinc-100":"text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"}`,children:t})}function vA({isPlaying:n,onPlayPause:e,onStop:t,viewMode:r,onViewModeChange:o,playheadPosition:a,onPlayheadChange:c,onSaveState:f,onLoadState:h,theme:d="system",onThemeChange:v}){const[g,m]=L.useState(!1),_=x=>c(Math.max(0,Math.min(30,a+x*(1/30)))),M=()=>{const x=d==="system"?"light":d==="light"?"dark":"system";v==null||v(x)},E=d==="system"?"System (automatisch)":d==="light"?"Hell":"Dunkel",y=d==="light"?uw:d==="dark"?$E:jE;return w.jsxs("div",{className:"h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-3 gap-2 select-none shrink-0",children:[w.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[w.jsx(gA,{}),w.jsx("span",{className:"text-[12px] font-medium text-zinc-100 tracking-tight whitespace-nowrap",children:"Wornetze"})]}),w.jsx("div",{className:"h-4 w-px bg-zinc-800 mx-1 shrink-0"}),w.jsxs("div",{className:"flex items-center shrink-0",children:[w.jsxs(dA,{open:g,onOpenChange:m,children:[w.jsx(hA,{asChild:!0,children:w.jsx("button",{className:"px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors data-[state=open]:bg-zinc-800 data-[state=open]:text-zinc-200",children:"Datei"})}),w.jsx(pA,{children:w.jsxs(mA,{className:"min-w-[180px] bg-zinc-900 border border-zinc-800 rounded-md shadow-xl p-1 z-50",sideOffset:5,align:"start",children:[w.jsxs(Mv,{className:"flex items-center gap-2 px-2 py-1.5 text-[11px] text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded cursor-pointer outline-none",onSelect:()=>f==null?void 0:f(),children:[w.jsx(ew,{size:12}),"Zustand Speichern"]}),w.jsxs(Mv,{className:"flex items-center gap-2 px-2 py-1.5 text-[11px] text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 rounded cursor-pointer outline-none",onSelect:()=>h==null?void 0:h(),children:[w.jsx(VE,{size:12}),"Zustand Laden"]})]})})]}),["Bearbeiten","Ansicht","Fenster"].map(x=>w.jsx("button",{className:"px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors",children:x},x))]}),w.jsx("div",{className:"h-4 w-px bg-zinc-800 mx-1 shrink-0"}),w.jsxs("div",{className:"flex items-center gap-0.5 shrink-0",children:[w.jsx(Ga,{onClick:()=>c(0),title:"Zum Anfang",children:w.jsx(rw,{size:11})}),w.jsx(Ga,{onClick:()=>_(-1),title:"Ein Frame zurück",children:w.jsx(UE,{size:13})}),w.jsx(Ga,{onClick:t,title:"Stopp",children:w.jsx(lw,{size:9,fill:"currentColor"})}),w.jsx("button",{onClick:e,title:n?"Pause":"Abspielen (Leertaste)",className:`w-8 h-8 flex items-center justify-center rounded transition-all ${n?"bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/40":"text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"}`,children:n?w.jsx(KE,{size:13,fill:"currentColor"}):w.jsx(ZE,{size:13,fill:"currentColor",className:"ml-0.5"})}),w.jsx(Ga,{onClick:()=>_(1),title:"Ein Frame vor",children:w.jsx(uu,{size:13})}),w.jsx(Ga,{onClick:()=>c(30),title:"Zum Ende",children:w.jsx(ow,{size:11})})]}),w.jsx("div",{className:"flex-1"}),w.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[w.jsx("div",{className:"flex h-6 rounded overflow-hidden border border-zinc-700 bg-zinc-950",children:["2D","3D"].map((x,T)=>w.jsx("button",{onClick:()=>o(x),className:`px-3 text-[11px] transition-colors ${T>0?"border-l border-zinc-700":""} ${r===x?"bg-cyan-600 text-white":"text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"}`,children:x},x))}),w.jsx("div",{className:"h-4 w-px bg-zinc-800"}),w.jsx("button",{className:"h-6 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 text-[11px] rounded border border-zinc-700/60 transition-colors",children:"Exportieren"}),w.jsx("button",{className:"w-7 h-7 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors",children:w.jsx(nw,{size:13})}),w.jsx("div",{className:"h-4 w-px bg-zinc-800"}),w.jsx("button",{onClick:M,title:E,className:"w-7 h-7 flex items-center justify-center rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors",children:w.jsx(y,{size:13})})]})]})}var Yp="Collapsible",[_A,ey]=Ii(Yp),[xA,Kp]=_A(Yp),ty=L.forwardRef((n,e)=>{const{__scopeCollapsible:t,open:r,defaultOpen:o,disabled:a,onOpenChange:c,...f}=n,[h=!1,d]=hs({prop:r,defaultProp:o,onChange:c});return w.jsx(xA,{scope:t,disabled:a,contentId:Xo(),open:h,onOpenToggle:L.useCallback(()=>d(v=>!v),[d]),children:w.jsx(It.div,{"data-state":Zp(h),"data-disabled":a?"":void 0,...f,ref:e})})});ty.displayName=Yp;var ny="CollapsibleTrigger",iy=L.forwardRef((n,e)=>{const{__scopeCollapsible:t,...r}=n,o=Kp(ny,t);return w.jsx(It.button,{type:"button","aria-controls":o.contentId,"aria-expanded":o.open||!1,"data-state":Zp(o.open),"data-disabled":o.disabled?"":void 0,disabled:o.disabled,...r,ref:e,onClick:lt(n.onClick,o.onOpenToggle)})});iy.displayName=ny;var qp="CollapsibleContent",ry=L.forwardRef((n,e)=>{const{forceMount:t,...r}=n,o=Kp(qp,n.__scopeCollapsible);return w.jsx(ps,{present:t||o.open,children:({present:a})=>w.jsx(yA,{...r,ref:e,present:a})})});ry.displayName=qp;var yA=L.forwardRef((n,e)=>{const{__scopeCollapsible:t,present:r,children:o,...a}=n,c=Kp(qp,t),[f,h]=L.useState(r),d=L.useRef(null),v=tn(e,d),g=L.useRef(0),m=g.current,_=L.useRef(0),M=_.current,E=c.open||f,y=L.useRef(E),x=L.useRef(void 0);return L.useEffect(()=>{const T=requestAnimationFrame(()=>y.current=!1);return()=>cancelAnimationFrame(T)},[]),ls(()=>{const T=d.current;if(T){x.current=x.current||{transitionDuration:T.style.transitionDuration,animationName:T.style.animationName},T.style.transitionDuration="0s",T.style.animationName="none";const N=T.getBoundingClientRect();g.current=N.height,_.current=N.width,y.current||(T.style.transitionDuration=x.current.transitionDuration,T.style.animationName=x.current.animationName),h(r)}},[c.open,r]),w.jsx(It.div,{"data-state":Zp(c.open),"data-disabled":c.disabled?"":void 0,id:c.contentId,hidden:!E,...a,ref:v,style:{"--radix-collapsible-content-height":m?`${m}px`:void 0,"--radix-collapsible-content-width":M?`${M}px`:void 0,...n.style},children:E&&o})});function Zp(n){return n?"open":"closed"}var SA=ty,MA=iy,EA=ry,Pr="Accordion",wA=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[Qp,bA,TA]=Pu(Pr),[zu]=Ii(Pr,[TA,ey]),Jp=ey(),sy=un.forwardRef((n,e)=>{const{type:t,...r}=n,o=r,a=r;return w.jsx(Qp.Provider,{scope:n.__scopeAccordion,children:t==="multiple"?w.jsx(PA,{...a,ref:e}):w.jsx(CA,{...o,ref:e})})});sy.displayName=Pr;var[oy,AA]=zu(Pr),[ay,RA]=zu(Pr,{collapsible:!1}),CA=un.forwardRef((n,e)=>{const{value:t,defaultValue:r,onValueChange:o=()=>{},collapsible:a=!1,...c}=n,[f,h]=hs({prop:t,defaultProp:r,onChange:o});return w.jsx(oy,{scope:n.__scopeAccordion,value:f?[f]:[],onItemOpen:h,onItemClose:un.useCallback(()=>a&&h(""),[a,h]),children:w.jsx(ay,{scope:n.__scopeAccordion,collapsible:a,children:w.jsx(ly,{...c,ref:e})})})}),PA=un.forwardRef((n,e)=>{const{value:t,defaultValue:r,onValueChange:o=()=>{},...a}=n,[c=[],f]=hs({prop:t,defaultProp:r,onChange:o}),h=un.useCallback(v=>f((g=[])=>[...g,v]),[f]),d=un.useCallback(v=>f((g=[])=>g.filter(m=>m!==v)),[f]);return w.jsx(oy,{scope:n.__scopeAccordion,value:c,onItemOpen:h,onItemClose:d,children:w.jsx(ay,{scope:n.__scopeAccordion,collapsible:!0,children:w.jsx(ly,{...a,ref:e})})})}),[DA,Bu]=zu(Pr),ly=un.forwardRef((n,e)=>{const{__scopeAccordion:t,disabled:r,dir:o,orientation:a="vertical",...c}=n,f=un.useRef(null),h=tn(f,e),d=bA(t),g=Qo(o)==="ltr",m=lt(n.onKeyDown,_=>{var b;if(!wA.includes(_.key))return;const M=_.target,E=d().filter(O=>{var X;return!((X=O.ref.current)!=null&&X.disabled)}),y=E.findIndex(O=>O.ref.current===M),x=E.length;if(y===-1)return;_.preventDefault();let T=y;const N=0,C=x-1,k=()=>{T=y+1,T>C&&(T=N)},I=()=>{T=y-1,T<N&&(T=C)};switch(_.key){case"Home":T=N;break;case"End":T=C;break;case"ArrowRight":a==="horizontal"&&(g?k():I());break;case"ArrowDown":a==="vertical"&&k();break;case"ArrowLeft":a==="horizontal"&&(g?I():k());break;case"ArrowUp":a==="vertical"&&I();break}const F=T%x;(b=E[F].ref.current)==null||b.focus()});return w.jsx(DA,{scope:t,disabled:r,direction:o,orientation:a,children:w.jsx(Qp.Slot,{scope:t,children:w.jsx(It.div,{...c,"data-orientation":a,ref:h,onKeyDown:r?void 0:m})})})}),vu="AccordionItem",[NA,em]=zu(vu),cy=un.forwardRef((n,e)=>{const{__scopeAccordion:t,value:r,...o}=n,a=Bu(vu,t),c=AA(vu,t),f=Jp(t),h=Xo(),d=r&&c.value.includes(r)||!1,v=a.disabled||n.disabled;return w.jsx(NA,{scope:t,open:d,disabled:v,triggerId:h,children:w.jsx(SA,{"data-orientation":a.orientation,"data-state":my(d),...f,...o,ref:e,disabled:v,open:d,onOpenChange:g=>{g?c.onItemOpen(r):c.onItemClose(r)}})})});cy.displayName=vu;var uy="AccordionHeader",fy=un.forwardRef((n,e)=>{const{__scopeAccordion:t,...r}=n,o=Bu(Pr,t),a=em(uy,t);return w.jsx(It.h3,{"data-orientation":o.orientation,"data-state":my(a.open),"data-disabled":a.disabled?"":void 0,...r,ref:e})});fy.displayName=uy;var Dh="AccordionTrigger",dy=un.forwardRef((n,e)=>{const{__scopeAccordion:t,...r}=n,o=Bu(Pr,t),a=em(Dh,t),c=RA(Dh,t),f=Jp(t);return w.jsx(Qp.ItemSlot,{scope:t,children:w.jsx(MA,{"aria-disabled":a.open&&!c.collapsible||void 0,"data-orientation":o.orientation,id:a.triggerId,...f,...r,ref:e})})});dy.displayName=Dh;var hy="AccordionContent",py=un.forwardRef((n,e)=>{const{__scopeAccordion:t,...r}=n,o=Bu(Pr,t),a=em(hy,t),c=Jp(t);return w.jsx(EA,{role:"region","aria-labelledby":a.triggerId,"data-orientation":o.orientation,...c,...r,ref:e,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...n.style}})});py.displayName=hy;function my(n){return n?"open":"closed"}var Mc=sy,LA=cy,IA=fy,UA=dy,FA=py;function gy(n){const e=L.useRef({value:n,previous:n});return L.useMemo(()=>(e.current.value!==n&&(e.current.previous=e.current.value,e.current.value=n),e.current.previous),[n])}var tm="Radio",[OA,vy]=Ii(tm),[kA,zA]=OA(tm),_y=L.forwardRef((n,e)=>{const{__scopeRadio:t,name:r,checked:o=!1,required:a,disabled:c,value:f="on",onCheck:h,form:d,...v}=n,[g,m]=L.useState(null),_=tn(e,y=>m(y)),M=L.useRef(!1),E=g?d||!!g.closest("form"):!0;return w.jsxs(kA,{scope:t,checked:o,disabled:c,children:[w.jsx(It.button,{type:"button",role:"radio","aria-checked":o,"data-state":Sy(o),"data-disabled":c?"":void 0,disabled:c,value:f,...v,ref:_,onClick:lt(n.onClick,y=>{o||h==null||h(),E&&(M.current=y.isPropagationStopped(),M.current||y.stopPropagation())})}),E&&w.jsx(BA,{control:g,bubbles:!M.current,name:r,value:f,checked:o,required:a,disabled:c,form:d,style:{transform:"translateX(-100%)"}})]})});_y.displayName=tm;var xy="RadioIndicator",yy=L.forwardRef((n,e)=>{const{__scopeRadio:t,forceMount:r,...o}=n,a=zA(xy,t);return w.jsx(ps,{present:r||a.checked,children:w.jsx(It.span,{"data-state":Sy(a.checked),"data-disabled":a.disabled?"":void 0,...o,ref:e})})});yy.displayName=xy;var BA=n=>{const{control:e,checked:t,bubbles:r=!0,...o}=n,a=L.useRef(null),c=gy(t),f=Up(e);return L.useEffect(()=>{const h=a.current,d=window.HTMLInputElement.prototype,g=Object.getOwnPropertyDescriptor(d,"checked").set;if(c!==t&&g){const m=new Event("click",{bubbles:r});g.call(h,t),h.dispatchEvent(m)}},[c,t,r]),w.jsx("input",{type:"radio","aria-hidden":!0,defaultChecked:t,...o,tabIndex:-1,ref:a,style:{...n.style,...f,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function Sy(n){return n?"checked":"unchecked"}var VA=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],nm="RadioGroup",[GA]=Ii(nm,[ta,vy]),My=ta(),Ey=vy(),[HA,WA]=GA(nm),wy=L.forwardRef((n,e)=>{const{__scopeRadioGroup:t,name:r,defaultValue:o,value:a,required:c=!1,disabled:f=!1,orientation:h,dir:d,loop:v=!0,onValueChange:g,...m}=n,_=My(t),M=Qo(d),[E,y]=hs({prop:a,defaultProp:o,onChange:g});return w.jsx(HA,{scope:t,name:r,required:c,disabled:f,value:E,onValueChange:y,children:w.jsx(kp,{asChild:!0,..._,orientation:h,dir:M,loop:v,children:w.jsx(It.div,{role:"radiogroup","aria-required":c,"aria-orientation":h,"data-disabled":f?"":void 0,dir:M,...m,ref:e})})})});wy.displayName=nm;var by="RadioGroupItem",Ty=L.forwardRef((n,e)=>{const{__scopeRadioGroup:t,disabled:r,...o}=n,a=WA(by,t),c=a.disabled||r,f=My(t),h=Ey(t),d=L.useRef(null),v=tn(e,d),g=a.value===o.value,m=L.useRef(!1);return L.useEffect(()=>{const _=E=>{VA.includes(E.key)&&(m.current=!0)},M=()=>m.current=!1;return document.addEventListener("keydown",_),document.addEventListener("keyup",M),()=>{document.removeEventListener("keydown",_),document.removeEventListener("keyup",M)}},[]),w.jsx(zp,{asChild:!0,...f,focusable:!c,active:g,children:w.jsx(_y,{disabled:c,required:a.required,checked:g,...h,...o,name:a.name,ref:v,onCheck:()=>a.onValueChange(o.value),onKeyDown:lt(_=>{_.key==="Enter"&&_.preventDefault()}),onFocus:lt(o.onFocus,()=>{var _;m.current&&((_=d.current)==null||_.click())})})})});Ty.displayName=by;var jA="RadioGroupIndicator",Ay=L.forwardRef((n,e)=>{const{__scopeRadioGroup:t,...r}=n,o=Ey(t);return w.jsx(yy,{...o,...r,ref:e})});Ay.displayName=jA;var Ev=wy,wv=Ty,bv=Ay;function Ry(n,[e,t]){return Math.min(t,Math.max(e,n))}var Cy=["PageUp","PageDown"],Py=["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"],Dy={"from-left":["Home","PageDown","ArrowDown","ArrowLeft"],"from-right":["Home","PageDown","ArrowDown","ArrowRight"],"from-bottom":["Home","PageDown","ArrowDown","ArrowLeft"],"from-top":["Home","PageDown","ArrowUp","ArrowLeft"]},na="Slider",[Nh,XA,$A]=Pu(na),[Ny]=Ii(na,[$A]),[YA,Vu]=Ny(na),Ly=L.forwardRef((n,e)=>{const{name:t,min:r=0,max:o=100,step:a=1,orientation:c="horizontal",disabled:f=!1,minStepsBetweenThumbs:h=0,defaultValue:d=[r],value:v,onValueChange:g=()=>{},onValueCommit:m=()=>{},inverted:_=!1,form:M,...E}=n,y=L.useRef(new Set),x=L.useRef(0),N=c==="horizontal"?KA:qA,[C=[],k]=hs({prop:v,defaultProp:d,onChange:B=>{var ne;(ne=[...y.current][x.current])==null||ne.focus(),g(B)}}),I=L.useRef(C);function F(B){const Z=tR(C,B);X(B,Z)}function b(B){X(B,x.current)}function O(){const B=I.current[x.current];C[x.current]!==B&&m(C)}function X(B,Z,{commit:ne}={commit:!1}){const ce=sR(a),G=oR(Math.round((B-r)/a)*a+r,ce),Y=Ry(G,[r,o]);k((j=[])=>{const W=JA(j,Y,Z);if(rR(W,h*a)){x.current=W.indexOf(Y);const z=String(W)!==String(j);return z&&ne&&m(W),z?W:j}else return j})}return w.jsx(YA,{scope:n.__scopeSlider,name:t,disabled:f,min:r,max:o,valueIndexToChangeRef:x,thumbs:y.current,values:C,orientation:c,form:M,children:w.jsx(Nh.Provider,{scope:n.__scopeSlider,children:w.jsx(Nh.Slot,{scope:n.__scopeSlider,children:w.jsx(N,{"aria-disabled":f,"data-disabled":f?"":void 0,...E,ref:e,onPointerDown:lt(E.onPointerDown,()=>{f||(I.current=C)}),min:r,max:o,inverted:_,onSlideStart:f?void 0:F,onSlideMove:f?void 0:b,onSlideEnd:f?void 0:O,onHomeKeyDown:()=>!f&&X(r,0,{commit:!0}),onEndKeyDown:()=>!f&&X(o,C.length-1,{commit:!0}),onStepKeyDown:({event:B,direction:Z})=>{if(!f){const G=Cy.includes(B.key)||B.shiftKey&&Py.includes(B.key)?10:1,Y=x.current,j=C[Y],W=a*G*Z;X(j+W,Y,{commit:!0})}}})})})})});Ly.displayName=na;var[Iy,Uy]=Ny(na,{startEdge:"left",endEdge:"right",size:"width",direction:1}),KA=L.forwardRef((n,e)=>{const{min:t,max:r,dir:o,inverted:a,onSlideStart:c,onSlideMove:f,onSlideEnd:h,onStepKeyDown:d,...v}=n,[g,m]=L.useState(null),_=tn(e,N=>m(N)),M=L.useRef(void 0),E=Qo(o),y=E==="ltr",x=y&&!a||!y&&a;function T(N){const C=M.current||g.getBoundingClientRect(),k=[0,C.width],F=im(k,x?[t,r]:[r,t]);return M.current=C,F(N-C.left)}return w.jsx(Iy,{scope:n.__scopeSlider,startEdge:x?"left":"right",endEdge:x?"right":"left",direction:x?1:-1,size:"width",children:w.jsx(Fy,{dir:E,"data-orientation":"horizontal",...v,ref:_,style:{...v.style,"--radix-slider-thumb-transform":"translateX(-50%)"},onSlideStart:N=>{const C=T(N.clientX);c==null||c(C)},onSlideMove:N=>{const C=T(N.clientX);f==null||f(C)},onSlideEnd:()=>{M.current=void 0,h==null||h()},onStepKeyDown:N=>{const k=Dy[x?"from-left":"from-right"].includes(N.key);d==null||d({event:N,direction:k?-1:1})}})})}),qA=L.forwardRef((n,e)=>{const{min:t,max:r,inverted:o,onSlideStart:a,onSlideMove:c,onSlideEnd:f,onStepKeyDown:h,...d}=n,v=L.useRef(null),g=tn(e,v),m=L.useRef(void 0),_=!o;function M(E){const y=m.current||v.current.getBoundingClientRect(),x=[0,y.height],N=im(x,_?[r,t]:[t,r]);return m.current=y,N(E-y.top)}return w.jsx(Iy,{scope:n.__scopeSlider,startEdge:_?"bottom":"top",endEdge:_?"top":"bottom",size:"height",direction:_?1:-1,children:w.jsx(Fy,{"data-orientation":"vertical",...d,ref:g,style:{...d.style,"--radix-slider-thumb-transform":"translateY(50%)"},onSlideStart:E=>{const y=M(E.clientY);a==null||a(y)},onSlideMove:E=>{const y=M(E.clientY);c==null||c(y)},onSlideEnd:()=>{m.current=void 0,f==null||f()},onStepKeyDown:E=>{const x=Dy[_?"from-bottom":"from-top"].includes(E.key);h==null||h({event:E,direction:x?-1:1})}})})}),Fy=L.forwardRef((n,e)=>{const{__scopeSlider:t,onSlideStart:r,onSlideMove:o,onSlideEnd:a,onHomeKeyDown:c,onEndKeyDown:f,onStepKeyDown:h,...d}=n,v=Vu(na,t);return w.jsx(It.span,{...d,ref:e,onKeyDown:lt(n.onKeyDown,g=>{g.key==="Home"?(c(g),g.preventDefault()):g.key==="End"?(f(g),g.preventDefault()):Cy.concat(Py).includes(g.key)&&(h(g),g.preventDefault())}),onPointerDown:lt(n.onPointerDown,g=>{const m=g.target;m.setPointerCapture(g.pointerId),g.preventDefault(),v.thumbs.has(m)?m.focus():r(g)}),onPointerMove:lt(n.onPointerMove,g=>{g.target.hasPointerCapture(g.pointerId)&&o(g)}),onPointerUp:lt(n.onPointerUp,g=>{const m=g.target;m.hasPointerCapture(g.pointerId)&&(m.releasePointerCapture(g.pointerId),a(g))})})}),Oy="SliderTrack",ky=L.forwardRef((n,e)=>{const{__scopeSlider:t,...r}=n,o=Vu(Oy,t);return w.jsx(It.span,{"data-disabled":o.disabled?"":void 0,"data-orientation":o.orientation,...r,ref:e})});ky.displayName=Oy;var Lh="SliderRange",zy=L.forwardRef((n,e)=>{const{__scopeSlider:t,...r}=n,o=Vu(Lh,t),a=Uy(Lh,t),c=L.useRef(null),f=tn(e,c),h=o.values.length,d=o.values.map(m=>Vy(m,o.min,o.max)),v=h>1?Math.min(...d):0,g=100-Math.max(...d);return w.jsx(It.span,{"data-orientation":o.orientation,"data-disabled":o.disabled?"":void 0,...r,ref:f,style:{...n.style,[a.startEdge]:v+"%",[a.endEdge]:g+"%"}})});zy.displayName=Lh;var Ih="SliderThumb",By=L.forwardRef((n,e)=>{const t=XA(n.__scopeSlider),[r,o]=L.useState(null),a=tn(e,f=>o(f)),c=L.useMemo(()=>r?t().findIndex(f=>f.ref.current===r):-1,[t,r]);return w.jsx(ZA,{...n,ref:a,index:c})}),ZA=L.forwardRef((n,e)=>{const{__scopeSlider:t,index:r,name:o,...a}=n,c=Vu(Ih,t),f=Uy(Ih,t),[h,d]=L.useState(null),v=tn(e,T=>d(T)),g=h?c.form||!!h.closest("form"):!0,m=Up(h),_=c.values[r],M=_===void 0?0:Vy(_,c.min,c.max),E=eR(r,c.values.length),y=m==null?void 0:m[f.size],x=y?nR(y,M,f.direction):0;return L.useEffect(()=>{if(h)return c.thumbs.add(h),()=>{c.thumbs.delete(h)}},[h,c.thumbs]),w.jsxs("span",{style:{transform:"var(--radix-slider-thumb-transform)",position:"absolute",[f.startEdge]:`calc(${M}% + ${x}px)`},children:[w.jsx(Nh.ItemSlot,{scope:n.__scopeSlider,children:w.jsx(It.span,{role:"slider","aria-label":n["aria-label"]||E,"aria-valuemin":c.min,"aria-valuenow":_,"aria-valuemax":c.max,"aria-orientation":c.orientation,"data-orientation":c.orientation,"data-disabled":c.disabled?"":void 0,tabIndex:c.disabled?void 0:0,...a,ref:v,style:_===void 0?{display:"none"}:n.style,onFocus:lt(n.onFocus,()=>{c.valueIndexToChangeRef.current=r})})}),g&&w.jsx(QA,{name:o??(c.name?c.name+(c.values.length>1?"[]":""):void 0),form:c.form,value:_},r)]})});By.displayName=Ih;var QA=n=>{const{value:e,...t}=n,r=L.useRef(null),o=gy(e);return L.useEffect(()=>{const a=r.current,c=window.HTMLInputElement.prototype,h=Object.getOwnPropertyDescriptor(c,"value").set;if(o!==e&&h){const d=new Event("input",{bubbles:!0});h.call(a,e),a.dispatchEvent(d)}},[o,e]),w.jsx("input",{style:{display:"none"},...t,ref:r,defaultValue:e})};function JA(n=[],e,t){const r=[...n];return r[t]=e,r.sort((o,a)=>o-a)}function Vy(n,e,t){const a=100/(t-e)*(n-e);return Ry(a,[0,100])}function eR(n,e){return e>2?`Value ${n+1} of ${e}`:e===2?["Minimum","Maximum"][n]:void 0}function tR(n,e){if(n.length===1)return 0;const t=n.map(o=>Math.abs(o-e)),r=Math.min(...t);return t.indexOf(r)}function nR(n,e,t){const r=n/2,a=im([0,50],[0,r]);return(r-a(e)*t)*t}function iR(n){return n.slice(0,-1).map((e,t)=>n[t+1]-e)}function rR(n,e){if(e>0){const t=iR(n);return Math.min(...t)>=e}return!0}function im(n,e){return t=>{if(n[0]===n[1]||e[0]===e[1])return e[0];const r=(e[1]-e[0])/(n[1]-n[0]);return e[0]+r*(t-n[0])}}function sR(n){return(String(n).split(".")[1]||"").length}function oR(n,e){const t=Math.pow(10,e);return Math.round(n*t)/t}var aR=Ly,lR=ky,cR=zy,uR=By,rm="Tabs",[fR]=Ii(rm,[ta]),Gy=ta(),[dR,sm]=fR(rm),Hy=L.forwardRef((n,e)=>{const{__scopeTabs:t,value:r,onValueChange:o,defaultValue:a,orientation:c="horizontal",dir:f,activationMode:h="automatic",...d}=n,v=Qo(f),[g,m]=hs({prop:r,onChange:o,defaultProp:a});return w.jsx(dR,{scope:t,baseId:Xo(),value:g,onValueChange:m,orientation:c,dir:v,activationMode:h,children:w.jsx(It.div,{dir:v,"data-orientation":c,...d,ref:e})})});Hy.displayName=rm;var Wy="TabsList",jy=L.forwardRef((n,e)=>{const{__scopeTabs:t,loop:r=!0,...o}=n,a=sm(Wy,t),c=Gy(t);return w.jsx(kp,{asChild:!0,...c,orientation:a.orientation,dir:a.dir,loop:r,children:w.jsx(It.div,{role:"tablist","aria-orientation":a.orientation,...o,ref:e})})});jy.displayName=Wy;var Xy="TabsTrigger",$y=L.forwardRef((n,e)=>{const{__scopeTabs:t,value:r,disabled:o=!1,...a}=n,c=sm(Xy,t),f=Gy(t),h=qy(c.baseId,r),d=Zy(c.baseId,r),v=r===c.value;return w.jsx(zp,{asChild:!0,...f,focusable:!o,active:v,children:w.jsx(It.button,{type:"button",role:"tab","aria-selected":v,"aria-controls":d,"data-state":v?"active":"inactive","data-disabled":o?"":void 0,disabled:o,id:h,...a,ref:e,onMouseDown:lt(n.onMouseDown,g=>{!o&&g.button===0&&g.ctrlKey===!1?c.onValueChange(r):g.preventDefault()}),onKeyDown:lt(n.onKeyDown,g=>{[" ","Enter"].includes(g.key)&&c.onValueChange(r)}),onFocus:lt(n.onFocus,()=>{const g=c.activationMode!=="manual";!v&&!o&&g&&c.onValueChange(r)})})})});$y.displayName=Xy;var Yy="TabsContent",Ky=L.forwardRef((n,e)=>{const{__scopeTabs:t,value:r,forceMount:o,children:a,...c}=n,f=sm(Yy,t),h=qy(f.baseId,r),d=Zy(f.baseId,r),v=r===f.value,g=L.useRef(v);return L.useEffect(()=>{const m=requestAnimationFrame(()=>g.current=!1);return()=>cancelAnimationFrame(m)},[]),w.jsx(ps,{present:o||v,children:({present:m})=>w.jsx(It.div,{"data-state":v?"active":"inactive","data-orientation":f.orientation,role:"tabpanel","aria-labelledby":h,hidden:!m,id:d,tabIndex:0,...c,ref:e,style:{...n.style,animationDuration:g.current?"0s":void 0},children:m&&a})})});Ky.displayName=Yy;function qy(n,e){return`${n}-trigger-${e}`}function Zy(n,e){return`${n}-content-${e}`}var hR=Hy,pR=jy,Ec=$y,wc=Ky;function Qy({active:n,color:e,onClick:t}){const r={cyan:n?"text-cyan-400":"text-zinc-700 hover:text-zinc-500",orange:n?"text-orange-400":"text-zinc-700 hover:text-zinc-500",purple:n?"text-purple-400":"text-zinc-700 hover:text-zinc-500"}[e];return w.jsx("button",{onClick:t,className:`w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors hover:bg-zinc-800/80 ${r}`,children:w.jsx(L_,{size:8,fill:n?"currentColor":"none"})})}function qr({kfKey:n,label:e,value:t,onChange:r,color:o,kfs:a,onToggle:c,displayFn:f,min:h=0,max:d=200}){const v=o==="cyan"?"bg-cyan-600/50":"bg-orange-600/50",g=o==="cyan"?"bg-cyan-400":"bg-orange-400";return w.jsxs("div",{children:[w.jsxs("div",{className:"flex items-center gap-2 mb-1.5",children:[w.jsx(Qy,{active:a[n],color:o,onClick:()=>c(n)}),w.jsx("span",{className:"text-[11px] text-zinc-500 flex-1",children:e}),w.jsx("span",{className:"text-[11px] font-mono text-zinc-400 w-9 text-right shrink-0",children:f?f(t):t[0]})]}),w.jsxs(aR,{className:"relative flex items-center w-full h-4 pl-7",value:t,onValueChange:r,min:h,max:d,step:1,children:[w.jsx(lR,{className:"bg-zinc-800 relative grow rounded-full h-[2px]",children:w.jsx(cR,{className:`absolute rounded-full h-full ${v}`})}),w.jsx(uR,{className:`block w-2.5 h-2.5 border-[1.5px] border-zinc-950 rounded-full hover:scale-125 focus:outline-none transition-transform cursor-grab ${g}`})]})]})}function Ns({value:n,label:e,color:t,children:r}){const o={cyan:"border-l-cyan-500/60",orange:"border-l-orange-500/60",purple:"border-l-purple-500/60"},a={cyan:"bg-cyan-500",orange:"bg-orange-500",purple:"bg-purple-500"};return w.jsxs(LA,{value:n,className:"border-b border-zinc-800/80",children:[w.jsx(IA,{asChild:!0,children:w.jsx("div",{children:w.jsxs(UA,{className:`w-full flex items-center gap-2.5 px-3 h-9 transition-colors hover:bg-zinc-800/30 group ${t?`border-l-2 ${o[t]}`:"pl-3"}`,children:[t&&w.jsx("div",{className:`w-1.5 h-1.5 rounded-full shrink-0 ${a[t]}`}),!t&&w.jsx(uu,{size:11,className:"text-zinc-600 transition-transform duration-150 group-data-[state=open]:rotate-90 shrink-0"}),w.jsx("span",{className:"text-[11px] font-medium text-zinc-200 flex-1 text-left",children:e}),t&&w.jsx(uu,{size:11,className:"text-zinc-600 transition-transform duration-150 group-data-[state=open]:rotate-90"})]})})}),w.jsx(FA,{className:"overflow-hidden data-[state=open]:animate-none",children:w.jsx("div",{className:"px-3 pb-3 pt-1.5 bg-[#00000000]",children:r})})]})}function mR({children:n}){return w.jsx("span",{className:"text-[9px] text-zinc-700 uppercase tracking-widest block mb-1.5 mt-2.5 first:mt-0",children:n})}function gR({onPhysicsChange:n,onTextChange:e,onColorChange:t,onStyleChange:r,currentTime:o=0,cameraSnapshots:a=[],onDeleteSnapshot:c}={}){const[f,h]=L.useState({saturation:!1,lightness:!1,edgeOpacity:!1,edgeWidth:!1,nodeScale:!1,repulsion:!1,springK:!0,damping:!1,minSpeed:!1}),[d,v]=L.useState("word"),[g,m]=L.useState([800]),[_,M]=L.useState([150]),[E,y]=L.useState([6]),[x,T]=L.useState([88]),[N,C]=L.useState(.5),[k,I]=L.useState("Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes far away up the hill. It was 3am that day cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write I write like a ritual over and over. The more exist the more I go I fly they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time."),[F,b]=L.useState("cyan-green"),[O,X]=L.useState([75]),[B,Z]=L.useState([65]),[ne,ce]=L.useState([85]),[G,Y]=L.useState([2]),[j,W]=L.useState([100]),z=P=>h(V=>({...V,[P]:!V[P]})),$=()=>{n==null||n({repulsion:_[0]*10,springK:E[0]/100,damping:x[0]/100,minSpeed:N})};return L.useEffect(()=>{$()},[_,E,x,N]),L.useEffect(()=>{const P={"cyan-green":{hueStart:180,hueEnd:120},"cyan-green-bright":{hueStart:140,hueEnd:85},"purple-pink":{hueStart:280,hueEnd:320},"orange-red":{hueStart:40,hueEnd:0},"yellow-green":{hueStart:60,hueEnd:120},"blue-purple":{hueStart:220,hueEnd:280}},V=P[F]||P["cyan-green"];t==null||t({...V,saturation:O[0],lightness:B[0]})},[F,O,B]),L.useEffect(()=>{r==null||r({edgeOpacity:ne[0]/100,edgeWidth:G[0],nodeScale:j[0]/100})},[ne,G,j]),w.jsxs("div",{className:"w-[268px] bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden",children:[w.jsxs("div",{className:"h-8 flex items-center justify-between px-3 border-b border-zinc-800 shrink-0",children:[w.jsx("span",{className:"text-[9px] font-medium text-zinc-600 uppercase tracking-widest",children:"Inspector"}),w.jsxs("div",{className:"flex items-center gap-1",children:[w.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-cyan-500/70"}),w.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-orange-500/70"}),w.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-purple-500/70"})]})]}),w.jsxs(hR,{defaultValue:"content",className:"flex-1 flex flex-col overflow-hidden",children:[w.jsxs(pR,{className:"flex border-b border-zinc-800 shrink-0",children:[w.jsx(Ec,{value:"content",className:"flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-purple-500/60",children:"Inhalt"}),w.jsx(Ec,{value:"visual",className:"flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-cyan-500/60",children:"Visuell"}),w.jsx(Ec,{value:"camera",className:"flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-cyan-500/60",children:"Kamera"}),w.jsx(Ec,{value:"physics",className:"flex-1 h-9 text-[10px] text-zinc-500 hover:text-zinc-300 data-[state=active]:text-zinc-200 data-[state=active]:bg-zinc-800/50 transition-colors border-b-2 border-transparent data-[state=active]:border-orange-500/60",children:"Physik"})]}),w.jsx(wc,{value:"content",className:"flex-1 overflow-y-auto",children:w.jsxs(Mc,{type:"multiple",defaultValue:["text","parsing"],children:[w.jsxs(Ns,{value:"text",label:"Text",children:[w.jsx("textarea",{className:"w-full h-[88px] bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-700 rounded px-2.5 py-2 text-[11px] font-mono text-zinc-300 resize-none focus:outline-none transition-colors leading-relaxed",value:k,onChange:P=>I(P.target.value)}),w.jsx("button",{onClick:()=>e==null?void 0:e(k),className:"w-full mt-2 h-7 bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-400 text-[11px] rounded border border-cyan-700/40 hover:border-cyan-600/50 transition-colors",children:"Anwenden"})]}),w.jsxs(Ns,{value:"parsing",label:"Parsing / Zerteilung",color:"purple",children:[w.jsx(Ev,{value:d,onValueChange:v,className:"flex flex-col gap-1",children:[{value:"sentence",label:"Satzebene"},{value:"word",label:"Wortebene"},{value:"both",label:"Beides"}].map(P=>w.jsxs("label",{className:"flex items-center gap-2.5 h-7 cursor-pointer group",children:[w.jsx(wv,{value:P.value,className:"w-3.5 h-3.5 rounded-full border border-zinc-700 data-[state=checked]:border-purple-500 bg-zinc-950 shrink-0 flex items-center justify-center transition-colors",children:w.jsx(bv,{children:w.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-purple-400"})})}),w.jsx("span",{className:"text-[11px] text-zinc-500 group-hover:text-zinc-200 transition-colors",children:P.label})]},P.value))}),w.jsx("p",{className:"text-[9px] text-zinc-700 mt-2 leading-relaxed",children:"Bestimmt welche Ebenen in der Timeline keyframable sind."})]})]})}),w.jsx(wc,{value:"visual",className:"flex-1 overflow-y-auto",children:w.jsxs(Mc,{type:"multiple",defaultValue:["colors","style"],children:[w.jsxs(Ns,{value:"colors",label:"Farben",color:"purple",children:[w.jsx("span",{className:"text-[10px] text-zinc-600 block mb-3",children:"Farbschema (kurz → lang)"}),w.jsx(Ev,{value:F,onValueChange:b,className:"flex flex-col gap-1.5",children:[{value:"cyan-green",label:"Cyan → Grün"},{value:"cyan-green-bright",label:"Cyan → Grün (hell)"},{value:"purple-pink",label:"Lila → Pink"},{value:"orange-red",label:"Orange → Rot"},{value:"yellow-green",label:"Gelb → Grün"},{value:"blue-purple",label:"Blau → Lila"}].map(P=>w.jsxs("label",{className:"flex items-center gap-2.5 h-6 cursor-pointer group",children:[w.jsx(wv,{value:P.value,className:"w-4 h-4 rounded-sm border border-zinc-700 data-[state=checked]:border-zinc-500 shrink-0 flex items-center justify-center transition-all overflow-hidden relative",style:{background:P.value==="cyan-green"?"linear-gradient(135deg, #06b6d4, #10b981)":P.value==="cyan-green-bright"?"linear-gradient(135deg, #22d3ee, #34d399)":P.value==="purple-pink"?"linear-gradient(135deg, #a855f7, #ec4899)":P.value==="orange-red"?"linear-gradient(135deg, #f97316, #ef4444)":P.value==="yellow-green"?"linear-gradient(135deg, #eab308, #22c55e)":P.value==="blue-purple"?"linear-gradient(135deg, #3b82f6, #a855f7)":"#18181b"},children:w.jsx(bv,{children:w.jsx("div",{className:"w-2 h-2 rounded-[1px] bg-white/90 shadow-sm"})})}),w.jsx("span",{className:"text-[11px] text-zinc-500 group-hover:text-zinc-200 transition-colors",children:P.label})]},P.value))}),w.jsxs("div",{className:"mt-4 space-y-3",children:[w.jsx(qr,{kfKey:"saturation",label:"Sättigung",value:O,onChange:X,color:"cyan",kfs:f,onToggle:z,min:30,max:100,displayFn:P=>P[0]+"%"}),w.jsx(qr,{kfKey:"lightness",label:"Helligkeit",value:B,onChange:Z,color:"cyan",kfs:f,onToggle:z,min:40,max:80,displayFn:P=>P[0]+"%"})]})]}),w.jsx(Ns,{value:"style",label:"Darstellung",color:"cyan",children:w.jsxs("div",{className:"space-y-3",children:[w.jsx(qr,{kfKey:"edgeOpacity",label:"Linien-Deckkraft",value:ne,onChange:ce,color:"cyan",kfs:f,onToggle:z,min:10,max:100,displayFn:P=>P[0]+"%"}),w.jsx(qr,{kfKey:"edgeWidth",label:"Linien-Stärke",value:G,onChange:Y,color:"cyan",kfs:f,onToggle:z,min:1,max:5}),w.jsx(qr,{kfKey:"nodeScale",label:"Node-Größe",value:j,onChange:W,color:"cyan",kfs:f,onToggle:z,min:50,max:150,displayFn:P=>P[0]+"%"})]})})]})}),w.jsx(wc,{value:"camera",className:"flex-1 overflow-y-auto",children:w.jsxs(Mc,{type:"multiple",defaultValue:["camera-controls","camera-snapshots"],children:[w.jsxs(Ns,{value:"camera-controls",label:"Steuerung",color:"cyan",children:[w.jsxs("div",{className:"text-[10px] text-zinc-600 leading-relaxed mb-3",children:["Verwende die Maus zum Steuern:",w.jsxs("div",{className:"mt-1 space-y-0.5 text-zinc-700",children:[w.jsx("div",{children:"• Linksklick + Ziehen: Rotieren"}),w.jsx("div",{children:"• Mausrad: Zoomen"}),w.jsx("div",{children:"• Rechtsklick + Ziehen: Verschieben"})]})]}),w.jsx(mR,{children:"Manuelle Steuerung"}),w.jsxs("div",{className:"space-y-2",children:[w.jsx("div",{className:"text-[9px] text-zinc-600 mb-1",children:"Position (X, Y, Z)"}),w.jsxs("div",{className:"grid grid-cols-3 gap-1.5",children:[w.jsx("input",{type:"number",placeholder:"X",className:"w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"}),w.jsx("input",{type:"number",placeholder:"Y",className:"w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"}),w.jsx("input",{type:"number",placeholder:"Z",className:"w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"})]}),w.jsx("div",{className:"text-[9px] text-zinc-600 mb-1 mt-3",children:"Ziel (X, Y, Z)"}),w.jsxs("div",{className:"grid grid-cols-3 gap-1.5",children:[w.jsx("input",{type:"number",placeholder:"X",className:"w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"}),w.jsx("input",{type:"number",placeholder:"Y",className:"w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"}),w.jsx("input",{type:"number",placeholder:"Z",className:"w-full h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-600 rounded text-[11px] text-zinc-300 text-center focus:outline-none transition-colors font-mono"})]})]})]}),w.jsxs(Ns,{value:"camera-snapshots",label:"Snapshots",color:"cyan",children:[w.jsxs("div",{className:"text-[10px] text-zinc-600 bg-zinc-900/50 rounded px-2 py-1.5 border border-zinc-800",children:["💡 Benutze den ",w.jsx("span",{className:"text-cyan-400",children:"📸 Snapshot"})," Button in der Timeline"]}),a.length>0&&w.jsxs("div",{className:"mt-3 space-y-1",children:[w.jsx("span",{className:"text-[10px] text-zinc-600 block mb-1.5",children:"Gespeicherte Snapshots:"}),a.map((P,V)=>w.jsxs("div",{className:`flex items-center justify-between px-2 py-1 rounded text-[10px] ${Math.abs(P.time-o)<.1?"bg-cyan-900/30 border border-cyan-700/40":"bg-zinc-900/50 border border-zinc-800"}`,children:[w.jsxs("span",{className:"text-zinc-400 font-mono",children:[Math.floor(P.time/60).toString().padStart(2,"0"),":",(P.time%60).toFixed(1).padStart(4,"0"),"s"]}),w.jsx("button",{onClick:()=>c==null?void 0:c(P.time),className:"text-zinc-600 hover:text-red-400 transition-colors",children:"✕"})]},V))]})]})]})}),w.jsx(wc,{value:"physics",className:"flex-1 overflow-y-auto",children:w.jsx(Mc,{type:"multiple",defaultValue:["physics-params"],children:w.jsx(Ns,{value:"physics-params",label:"Parameter",color:"orange",children:w.jsxs("div",{className:"space-y-3",children:[w.jsx(qr,{kfKey:"repulsion",label:"Repulsion",value:_,onChange:M,color:"orange",kfs:f,onToggle:z,min:10,max:500,displayFn:P=>(P[0]*10).toFixed(0)}),w.jsx(qr,{kfKey:"springK",label:"Spring K",value:E,onChange:y,color:"orange",kfs:f,onToggle:z,min:1,max:20,displayFn:P=>(P[0]/100).toFixed(2)}),w.jsx(qr,{kfKey:"damping",label:"Damping",value:x,onChange:T,color:"orange",kfs:f,onToggle:z,min:80,max:99,displayFn:P=>(P[0]/100).toFixed(2)}),w.jsxs("div",{className:"flex items-center gap-2 h-[26px]",children:[w.jsx(Qy,{active:f.minSpeed,color:"orange",onClick:()=>z("minSpeed")}),w.jsx("span",{className:"text-[11px] text-zinc-500 flex-1",children:"Min Speed"}),w.jsx("input",{type:"number",value:N,onChange:P=>C(parseFloat(P.target.value)||0),step:"0.1",className:"w-16 h-6 px-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 focus:border-zinc-600 rounded text-[11px] text-zinc-300 text-right focus:outline-none transition-colors shrink-0 font-mono"})]})]})})})})]}),w.jsxs("div",{className:"h-7 border-t border-zinc-800 flex items-center px-3 gap-2 shrink-0",children:[w.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-green-500/70"}),w.jsx("span",{className:"text-[9px] text-zinc-600",children:"Bereit · 14 Wörter"}),w.jsx("div",{className:"flex-1"}),w.jsx("span",{className:"text-[9px] text-zinc-700",children:"v0.4.2"})]})]})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const om="184",Ho={ROTATE:0,DOLLY:1,PAN:2},Bo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},vR=0,Tv=1,_R=2,iu=1,xR=2,el=3,fs=0,Kn=1,_r=2,Sr=0,Wo=1,Av=2,Rv=3,Cv=4,yR=5,Os=100,SR=101,MR=102,ER=103,wR=104,bR=200,TR=201,AR=202,RR=203,Uh=204,Fh=205,CR=206,PR=207,DR=208,NR=209,LR=210,IR=211,UR=212,FR=213,OR=214,Oh=0,kh=1,zh=2,Yo=3,Bh=4,Vh=5,Gh=6,Hh=7,Jy=0,kR=1,zR=2,qi=0,eS=1,tS=2,nS=3,iS=4,rS=5,sS=6,oS=7,aS=300,Gs=301,Ko=302,Vd=303,Gd=304,Gu=306,Wh=1e3,yr=1001,jh=1002,En=1003,BR=1004,bc=1005,Dn=1006,Hd=1007,zs=1008,pi=1009,lS=1010,cS=1011,ol=1012,am=1013,Ji=1014,$i=1015,Tr=1016,lm=1017,cm=1018,al=1020,uS=35902,fS=35899,dS=1021,hS=1022,Ci=1023,Ar=1026,Bs=1027,pS=1028,um=1029,Hs=1030,fm=1031,dm=1033,ru=33776,su=33777,ou=33778,au=33779,Xh=35840,$h=35841,Yh=35842,Kh=35843,qh=36196,Zh=37492,Qh=37496,Jh=37488,ep=37489,_u=37490,tp=37491,np=37808,ip=37809,rp=37810,sp=37811,op=37812,ap=37813,lp=37814,cp=37815,up=37816,fp=37817,dp=37818,hp=37819,pp=37820,mp=37821,gp=36492,vp=36494,_p=36495,xp=36283,yp=36284,xu=36285,Sp=36286,VR=3200,Pv=0,GR=1,ss="",di="srgb",yu="srgb-linear",Su="linear",kt="srgb",Mo=7680,Dv=519,HR=512,WR=513,jR=514,hm=515,XR=516,$R=517,pm=518,YR=519,Mp=35044,Nv="300 es",Yi=2e3,Mu=2001;function KR(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Eu(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function qR(){const n=Eu("canvas");return n.style.display="block",n}const Lv={};function wu(...n){const e="THREE."+n.shift();console.log(e,...n)}function mS(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function ot(...n){n=mS(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function At(...n){n=mS(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Ep(...n){const e=n.join(" ");e in Lv||(Lv[e]=!0,ot(...n))}function ZR(n,e,t){return new Promise(function(r,o){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:o();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:r()}}setTimeout(a,t)})}const QR={[Oh]:kh,[zh]:Gh,[Bh]:Hh,[Yo]:Vh,[kh]:Oh,[Gh]:zh,[Hh]:Bh,[Vh]:Yo};class ms{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){const r=this._listeners;if(r===void 0)return;const o=r[e];if(o!==void 0){const a=o.indexOf(t);a!==-1&&o.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const r=t[e.type];if(r!==void 0){e.target=this;const o=r.slice(0);for(let a=0,c=o.length;a<c;a++)o[a].call(this,e);e.target=null}}}const Cn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],lu=Math.PI/180,wp=180/Math.PI;function as(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Cn[n&255]+Cn[n>>8&255]+Cn[n>>16&255]+Cn[n>>24&255]+"-"+Cn[e&255]+Cn[e>>8&255]+"-"+Cn[e>>16&15|64]+Cn[e>>24&255]+"-"+Cn[t&63|128]+Cn[t>>8&255]+"-"+Cn[t>>16&255]+Cn[t>>24&255]+Cn[r&255]+Cn[r>>8&255]+Cn[r>>16&255]+Cn[r>>24&255]).toLowerCase()}function Et(n,e,t){return Math.max(e,Math.min(t,n))}function JR(n,e){return(n%e+e)%e}function Wd(n,e,t){return(1-t)*n+t*e}function ji(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Vt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const eC={DEG2RAD:lu},_m=class _m{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,o=e.elements;return this.x=o[0]*t+o[3]*r+o[6],this.y=o[1]*t+o[4]*r+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Et(this.x,e.x,t.x),this.y=Et(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Et(this.x,e,t),this.y=Et(this.y,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Et(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(Et(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),o=Math.sin(t),a=this.x-e.x,c=this.y-e.y;return this.x=a*r-c*o+e.x,this.y=a*o+c*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};_m.prototype.isVector2=!0;let ft=_m;class ds{constructor(e=0,t=0,r=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=o}static slerpFlat(e,t,r,o,a,c,f){let h=r[o+0],d=r[o+1],v=r[o+2],g=r[o+3],m=a[c+0],_=a[c+1],M=a[c+2],E=a[c+3];if(g!==E||h!==m||d!==_||v!==M){let y=h*m+d*_+v*M+g*E;y<0&&(m=-m,_=-_,M=-M,E=-E,y=-y);let x=1-f;if(y<.9995){const T=Math.acos(y),N=Math.sin(T);x=Math.sin(x*T)/N,f=Math.sin(f*T)/N,h=h*x+m*f,d=d*x+_*f,v=v*x+M*f,g=g*x+E*f}else{h=h*x+m*f,d=d*x+_*f,v=v*x+M*f,g=g*x+E*f;const T=1/Math.sqrt(h*h+d*d+v*v+g*g);h*=T,d*=T,v*=T,g*=T}}e[t]=h,e[t+1]=d,e[t+2]=v,e[t+3]=g}static multiplyQuaternionsFlat(e,t,r,o,a,c){const f=r[o],h=r[o+1],d=r[o+2],v=r[o+3],g=a[c],m=a[c+1],_=a[c+2],M=a[c+3];return e[t]=f*M+v*g+h*_-d*m,e[t+1]=h*M+v*m+d*g-f*_,e[t+2]=d*M+v*_+f*m-h*g,e[t+3]=v*M-f*g-h*m-d*_,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,o){return this._x=e,this._y=t,this._z=r,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,o=e._y,a=e._z,c=e._order,f=Math.cos,h=Math.sin,d=f(r/2),v=f(o/2),g=f(a/2),m=h(r/2),_=h(o/2),M=h(a/2);switch(c){case"XYZ":this._x=m*v*g+d*_*M,this._y=d*_*g-m*v*M,this._z=d*v*M+m*_*g,this._w=d*v*g-m*_*M;break;case"YXZ":this._x=m*v*g+d*_*M,this._y=d*_*g-m*v*M,this._z=d*v*M-m*_*g,this._w=d*v*g+m*_*M;break;case"ZXY":this._x=m*v*g-d*_*M,this._y=d*_*g+m*v*M,this._z=d*v*M+m*_*g,this._w=d*v*g-m*_*M;break;case"ZYX":this._x=m*v*g-d*_*M,this._y=d*_*g+m*v*M,this._z=d*v*M-m*_*g,this._w=d*v*g+m*_*M;break;case"YZX":this._x=m*v*g+d*_*M,this._y=d*_*g+m*v*M,this._z=d*v*M-m*_*g,this._w=d*v*g-m*_*M;break;case"XZY":this._x=m*v*g-d*_*M,this._y=d*_*g-m*v*M,this._z=d*v*M+m*_*g,this._w=d*v*g+m*_*M;break;default:ot("Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,o=Math.sin(r);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],o=t[4],a=t[8],c=t[1],f=t[5],h=t[9],d=t[2],v=t[6],g=t[10],m=r+f+g;if(m>0){const _=.5/Math.sqrt(m+1);this._w=.25/_,this._x=(v-h)*_,this._y=(a-d)*_,this._z=(c-o)*_}else if(r>f&&r>g){const _=2*Math.sqrt(1+r-f-g);this._w=(v-h)/_,this._x=.25*_,this._y=(o+c)/_,this._z=(a+d)/_}else if(f>g){const _=2*Math.sqrt(1+f-r-g);this._w=(a-d)/_,this._x=(o+c)/_,this._y=.25*_,this._z=(h+v)/_}else{const _=2*Math.sqrt(1+g-r-f);this._w=(c-o)/_,this._x=(a+d)/_,this._y=(h+v)/_,this._z=.25*_}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Et(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const o=Math.min(1,t/r);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,o=e._y,a=e._z,c=e._w,f=t._x,h=t._y,d=t._z,v=t._w;return this._x=r*v+c*f+o*d-a*h,this._y=o*v+c*h+a*f-r*d,this._z=a*v+c*d+r*h-o*f,this._w=c*v-r*f-o*h-a*d,this._onChangeCallback(),this}slerp(e,t){let r=e._x,o=e._y,a=e._z,c=e._w,f=this.dot(e);f<0&&(r=-r,o=-o,a=-a,c=-c,f=-f);let h=1-t;if(f<.9995){const d=Math.acos(f),v=Math.sin(d);h=Math.sin(h*d)/v,t=Math.sin(t*d)/v,this._x=this._x*h+r*t,this._y=this._y*h+o*t,this._z=this._z*h+a*t,this._w=this._w*h+c*t,this._onChangeCallback()}else this._x=this._x*h+r*t,this._y=this._y*h+o*t,this._z=this._z*h+a*t,this._w=this._w*h+c*t,this.normalize();return this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),o=Math.sqrt(1-r),a=Math.sqrt(r);return this.set(o*Math.sin(e),o*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const xm=class xm{constructor(e=0,t=0,r=0){this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Iv.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Iv.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,o=this.z,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6]*o,this.y=a[1]*t+a[4]*r+a[7]*o,this.z=a[2]*t+a[5]*r+a[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,o=this.z,a=e.elements,c=1/(a[3]*t+a[7]*r+a[11]*o+a[15]);return this.x=(a[0]*t+a[4]*r+a[8]*o+a[12])*c,this.y=(a[1]*t+a[5]*r+a[9]*o+a[13])*c,this.z=(a[2]*t+a[6]*r+a[10]*o+a[14])*c,this}applyQuaternion(e){const t=this.x,r=this.y,o=this.z,a=e.x,c=e.y,f=e.z,h=e.w,d=2*(c*o-f*r),v=2*(f*t-a*o),g=2*(a*r-c*t);return this.x=t+h*d+c*g-f*v,this.y=r+h*v+f*d-a*g,this.z=o+h*g+a*v-c*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,o=this.z,a=e.elements;return this.x=a[0]*t+a[4]*r+a[8]*o,this.y=a[1]*t+a[5]*r+a[9]*o,this.z=a[2]*t+a[6]*r+a[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Et(this.x,e.x,t.x),this.y=Et(this.y,e.y,t.y),this.z=Et(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Et(this.x,e,t),this.y=Et(this.y,e,t),this.z=Et(this.z,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Et(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,o=e.y,a=e.z,c=t.x,f=t.y,h=t.z;return this.x=o*h-a*f,this.y=a*c-r*h,this.z=r*f-o*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return jd.copy(this).projectOnVector(e),this.sub(jd)}reflect(e){return this.sub(jd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(Et(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,o=this.z-e.z;return t*t+r*r+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const o=Math.sin(t)*e;return this.x=o*Math.sin(r),this.y=Math.cos(t)*e,this.z=o*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};xm.prototype.isVector3=!0;let ie=xm;const jd=new ie,Iv=new ds,ym=class ym{constructor(e,t,r,o,a,c,f,h,d){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,o,a,c,f,h,d)}set(e,t,r,o,a,c,f,h,d){const v=this.elements;return v[0]=e,v[1]=o,v[2]=f,v[3]=t,v[4]=a,v[5]=h,v[6]=r,v[7]=c,v[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,o=t.elements,a=this.elements,c=r[0],f=r[3],h=r[6],d=r[1],v=r[4],g=r[7],m=r[2],_=r[5],M=r[8],E=o[0],y=o[3],x=o[6],T=o[1],N=o[4],C=o[7],k=o[2],I=o[5],F=o[8];return a[0]=c*E+f*T+h*k,a[3]=c*y+f*N+h*I,a[6]=c*x+f*C+h*F,a[1]=d*E+v*T+g*k,a[4]=d*y+v*N+g*I,a[7]=d*x+v*C+g*F,a[2]=m*E+_*T+M*k,a[5]=m*y+_*N+M*I,a[8]=m*x+_*C+M*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],o=e[2],a=e[3],c=e[4],f=e[5],h=e[6],d=e[7],v=e[8];return t*c*v-t*f*d-r*a*v+r*f*h+o*a*d-o*c*h}invert(){const e=this.elements,t=e[0],r=e[1],o=e[2],a=e[3],c=e[4],f=e[5],h=e[6],d=e[7],v=e[8],g=v*c-f*d,m=f*h-v*a,_=d*a-c*h,M=t*g+r*m+o*_;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/M;return e[0]=g*E,e[1]=(o*d-v*r)*E,e[2]=(f*r-o*c)*E,e[3]=m*E,e[4]=(v*t-o*h)*E,e[5]=(o*a-f*t)*E,e[6]=_*E,e[7]=(r*h-d*t)*E,e[8]=(c*t-r*a)*E,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,o,a,c,f){const h=Math.cos(a),d=Math.sin(a);return this.set(r*h,r*d,-r*(h*c+d*f)+c+e,-o*d,o*h,-o*(-d*c+h*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(Xd.makeScale(e,t)),this}rotate(e){return this.premultiply(Xd.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xd.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let o=0;o<9;o++)if(t[o]!==r[o])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ym.prototype.isMatrix3=!0;let vt=ym;const Xd=new vt,Uv=new vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Fv=new vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tC(){const n={enabled:!0,workingColorSpace:yu,spaces:{},convert:function(o,a,c){return this.enabled===!1||a===c||!a||!c||(this.spaces[a].transfer===kt&&(o.r=Mr(o.r),o.g=Mr(o.g),o.b=Mr(o.b)),this.spaces[a].primaries!==this.spaces[c].primaries&&(o.applyMatrix3(this.spaces[a].toXYZ),o.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===kt&&(o.r=jo(o.r),o.g=jo(o.g),o.b=jo(o.b))),o},workingToColorSpace:function(o,a){return this.convert(o,this.workingColorSpace,a)},colorSpaceToWorking:function(o,a){return this.convert(o,a,this.workingColorSpace)},getPrimaries:function(o){return this.spaces[o].primaries},getTransfer:function(o){return o===ss?Su:this.spaces[o].transfer},getToneMappingMode:function(o){return this.spaces[o].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(o,a=this.workingColorSpace){return o.fromArray(this.spaces[a].luminanceCoefficients)},define:function(o){Object.assign(this.spaces,o)},_getMatrix:function(o,a,c){return o.copy(this.spaces[a].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(o){return this.spaces[o].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(o=this.workingColorSpace){return this.spaces[o].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(o,a){return Ep("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(o,a)},toWorkingColorSpace:function(o,a){return Ep("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(o,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],r=[.3127,.329];return n.define({[yu]:{primaries:e,whitePoint:r,transfer:Su,toXYZ:Uv,fromXYZ:Fv,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:di},outputColorSpaceConfig:{drawingBufferColorSpace:di}},[di]:{primaries:e,whitePoint:r,transfer:kt,toXYZ:Uv,fromXYZ:Fv,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:di}}}),n}const bt=tC();function Mr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function jo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Eo;class nC{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{Eo===void 0&&(Eo=Eu("canvas")),Eo.width=e.width,Eo.height=e.height;const o=Eo.getContext("2d");e instanceof ImageData?o.putImageData(e,0,0):o.drawImage(e,0,0,e.width,e.height),r=Eo}return r.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Eu("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const o=r.getImageData(0,0,e.width,e.height),a=o.data;for(let c=0;c<a.length;c++)a[c]=Mr(a[c]/255)*255;return r.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Mr(t[r]/255)*255):t[r]=Mr(t[r]);return{data:t,width:e.width,height:e.height}}else return ot("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let iC=0;class mm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:iC++}),this.uuid=as(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},o=this.data;if(o!==null){let a;if(Array.isArray(o)){a=[];for(let c=0,f=o.length;c<f;c++)o[c].isDataTexture?a.push($d(o[c].image)):a.push($d(o[c]))}else a=$d(o);r.url=a}return t||(e.images[this.uuid]=r),r}}function $d(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?nC.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(ot("Texture: Unable to serialize Texture."),{})}let rC=0;const Yd=new ie;class Nn extends ms{constructor(e=Nn.DEFAULT_IMAGE,t=Nn.DEFAULT_MAPPING,r=yr,o=yr,a=Dn,c=zs,f=Ci,h=pi,d=Nn.DEFAULT_ANISOTROPY,v=ss){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rC++}),this.uuid=as(),this.name="",this.source=new mm(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=o,this.magFilter=a,this.minFilter=c,this.anisotropy=d,this.format=f,this.internalFormat=null,this.type=h,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=v,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Yd).x}get height(){return this.source.getSize(Yd).y}get depth(){return this.source.getSize(Yd).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const r=e[t];if(r===void 0){ot(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){ot(`Texture.setValues(): property '${t}' does not exist.`);continue}o&&r&&o.isVector2&&r.isVector2||o&&r&&o.isVector3&&r.isVector3||o&&r&&o.isMatrix3&&r.isMatrix3?o.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==aS)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Wh:e.x=e.x-Math.floor(e.x);break;case yr:e.x=e.x<0?0:1;break;case jh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Wh:e.y=e.y-Math.floor(e.y);break;case yr:e.y=e.y<0?0:1;break;case jh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=aS;Nn.DEFAULT_ANISOTROPY=1;const Sm=class Sm{constructor(e=0,t=0,r=0,o=1){this.x=e,this.y=t,this.z=r,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,o){return this.x=e,this.y=t,this.z=r,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,o=this.z,a=this.w,c=e.elements;return this.x=c[0]*t+c[4]*r+c[8]*o+c[12]*a,this.y=c[1]*t+c[5]*r+c[9]*o+c[13]*a,this.z=c[2]*t+c[6]*r+c[10]*o+c[14]*a,this.w=c[3]*t+c[7]*r+c[11]*o+c[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,o,a;const h=e.elements,d=h[0],v=h[4],g=h[8],m=h[1],_=h[5],M=h[9],E=h[2],y=h[6],x=h[10];if(Math.abs(v-m)<.01&&Math.abs(g-E)<.01&&Math.abs(M-y)<.01){if(Math.abs(v+m)<.1&&Math.abs(g+E)<.1&&Math.abs(M+y)<.1&&Math.abs(d+_+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const N=(d+1)/2,C=(_+1)/2,k=(x+1)/2,I=(v+m)/4,F=(g+E)/4,b=(M+y)/4;return N>C&&N>k?N<.01?(r=0,o=.707106781,a=.707106781):(r=Math.sqrt(N),o=I/r,a=F/r):C>k?C<.01?(r=.707106781,o=0,a=.707106781):(o=Math.sqrt(C),r=I/o,a=b/o):k<.01?(r=.707106781,o=.707106781,a=0):(a=Math.sqrt(k),r=F/a,o=b/a),this.set(r,o,a,t),this}let T=Math.sqrt((y-M)*(y-M)+(g-E)*(g-E)+(m-v)*(m-v));return Math.abs(T)<.001&&(T=1),this.x=(y-M)/T,this.y=(g-E)/T,this.z=(m-v)/T,this.w=Math.acos((d+_+x-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Et(this.x,e.x,t.x),this.y=Et(this.y,e.y,t.y),this.z=Et(this.z,e.z,t.z),this.w=Et(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Et(this.x,e,t),this.y=Et(this.y,e,t),this.z=Et(this.z,e,t),this.w=Et(this.w,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Et(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Sm.prototype.isVector4=!0;let sn=Sm;class sC extends ms{constructor(e=1,t=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},r),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=r.depth,this.scissor=new sn(0,0,e,t),this.scissorTest=!1,this.viewport=new sn(0,0,e,t),this.textures=[];const o={width:e,height:t,depth:r.depth},a=new Nn(o),c=r.count;for(let f=0;f<c;f++)this.textures[f]=a.clone(),this.textures[f].isRenderTargetTexture=!0,this.textures[f].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview}_setTextureOptions(e={}){const t={minFilter:Dn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let r=0;r<this.textures.length;r++)this.textures[r].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let o=0,a=this.textures.length;o<a;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=r,this.textures[o].isData3DTexture!==!0&&(this.textures[o].isArrayTexture=this.textures[o].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,r=e.textures.length;t<r;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const o=Object.assign({},e.textures[t].image);this.textures[t].source=new mm(o)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Zi extends sC{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class gS extends Nn{constructor(e=null,t=1,r=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:o},this.magFilter=En,this.minFilter=En,this.wrapR=yr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class oC extends Nn{constructor(e=null,t=1,r=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:o},this.magFilter=En,this.minFilter=En,this.wrapR=yr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ru=class Ru{constructor(e,t,r,o,a,c,f,h,d,v,g,m,_,M,E,y){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,o,a,c,f,h,d,v,g,m,_,M,E,y)}set(e,t,r,o,a,c,f,h,d,v,g,m,_,M,E,y){const x=this.elements;return x[0]=e,x[4]=t,x[8]=r,x[12]=o,x[1]=a,x[5]=c,x[9]=f,x[13]=h,x[2]=d,x[6]=v,x[10]=g,x[14]=m,x[3]=_,x[7]=M,x[11]=E,x[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ru().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),r.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this)}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,r=e.elements,o=1/wo.setFromMatrixColumn(e,0).length(),a=1/wo.setFromMatrixColumn(e,1).length(),c=1/wo.setFromMatrixColumn(e,2).length();return t[0]=r[0]*o,t[1]=r[1]*o,t[2]=r[2]*o,t[3]=0,t[4]=r[4]*a,t[5]=r[5]*a,t[6]=r[6]*a,t[7]=0,t[8]=r[8]*c,t[9]=r[9]*c,t[10]=r[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,o=e.y,a=e.z,c=Math.cos(r),f=Math.sin(r),h=Math.cos(o),d=Math.sin(o),v=Math.cos(a),g=Math.sin(a);if(e.order==="XYZ"){const m=c*v,_=c*g,M=f*v,E=f*g;t[0]=h*v,t[4]=-h*g,t[8]=d,t[1]=_+M*d,t[5]=m-E*d,t[9]=-f*h,t[2]=E-m*d,t[6]=M+_*d,t[10]=c*h}else if(e.order==="YXZ"){const m=h*v,_=h*g,M=d*v,E=d*g;t[0]=m+E*f,t[4]=M*f-_,t[8]=c*d,t[1]=c*g,t[5]=c*v,t[9]=-f,t[2]=_*f-M,t[6]=E+m*f,t[10]=c*h}else if(e.order==="ZXY"){const m=h*v,_=h*g,M=d*v,E=d*g;t[0]=m-E*f,t[4]=-c*g,t[8]=M+_*f,t[1]=_+M*f,t[5]=c*v,t[9]=E-m*f,t[2]=-c*d,t[6]=f,t[10]=c*h}else if(e.order==="ZYX"){const m=c*v,_=c*g,M=f*v,E=f*g;t[0]=h*v,t[4]=M*d-_,t[8]=m*d+E,t[1]=h*g,t[5]=E*d+m,t[9]=_*d-M,t[2]=-d,t[6]=f*h,t[10]=c*h}else if(e.order==="YZX"){const m=c*h,_=c*d,M=f*h,E=f*d;t[0]=h*v,t[4]=E-m*g,t[8]=M*g+_,t[1]=g,t[5]=c*v,t[9]=-f*v,t[2]=-d*v,t[6]=_*g+M,t[10]=m-E*g}else if(e.order==="XZY"){const m=c*h,_=c*d,M=f*h,E=f*d;t[0]=h*v,t[4]=-g,t[8]=d*v,t[1]=m*g+E,t[5]=c*v,t[9]=_*g-M,t[2]=M*g-_,t[6]=f*v,t[10]=E*g+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(aC,e,lC)}lookAt(e,t,r){const o=this.elements;return ei.subVectors(e,t),ei.lengthSq()===0&&(ei.z=1),ei.normalize(),Zr.crossVectors(r,ei),Zr.lengthSq()===0&&(Math.abs(r.z)===1?ei.x+=1e-4:ei.z+=1e-4,ei.normalize(),Zr.crossVectors(r,ei)),Zr.normalize(),Tc.crossVectors(ei,Zr),o[0]=Zr.x,o[4]=Tc.x,o[8]=ei.x,o[1]=Zr.y,o[5]=Tc.y,o[9]=ei.y,o[2]=Zr.z,o[6]=Tc.z,o[10]=ei.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,o=t.elements,a=this.elements,c=r[0],f=r[4],h=r[8],d=r[12],v=r[1],g=r[5],m=r[9],_=r[13],M=r[2],E=r[6],y=r[10],x=r[14],T=r[3],N=r[7],C=r[11],k=r[15],I=o[0],F=o[4],b=o[8],O=o[12],X=o[1],B=o[5],Z=o[9],ne=o[13],ce=o[2],G=o[6],Y=o[10],j=o[14],W=o[3],z=o[7],$=o[11],P=o[15];return a[0]=c*I+f*X+h*ce+d*W,a[4]=c*F+f*B+h*G+d*z,a[8]=c*b+f*Z+h*Y+d*$,a[12]=c*O+f*ne+h*j+d*P,a[1]=v*I+g*X+m*ce+_*W,a[5]=v*F+g*B+m*G+_*z,a[9]=v*b+g*Z+m*Y+_*$,a[13]=v*O+g*ne+m*j+_*P,a[2]=M*I+E*X+y*ce+x*W,a[6]=M*F+E*B+y*G+x*z,a[10]=M*b+E*Z+y*Y+x*$,a[14]=M*O+E*ne+y*j+x*P,a[3]=T*I+N*X+C*ce+k*W,a[7]=T*F+N*B+C*G+k*z,a[11]=T*b+N*Z+C*Y+k*$,a[15]=T*O+N*ne+C*j+k*P,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],o=e[8],a=e[12],c=e[1],f=e[5],h=e[9],d=e[13],v=e[2],g=e[6],m=e[10],_=e[14],M=e[3],E=e[7],y=e[11],x=e[15],T=h*_-d*m,N=f*_-d*g,C=f*m-h*g,k=c*_-d*v,I=c*m-h*v,F=c*g-f*v;return t*(E*T-y*N+x*C)-r*(M*T-y*k+x*I)+o*(M*N-E*k+x*F)-a*(M*C-E*I+y*F)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],o=e[2],a=e[3],c=e[4],f=e[5],h=e[6],d=e[7],v=e[8],g=e[9],m=e[10],_=e[11],M=e[12],E=e[13],y=e[14],x=e[15],T=t*f-r*c,N=t*h-o*c,C=t*d-a*c,k=r*h-o*f,I=r*d-a*f,F=o*d-a*h,b=v*E-g*M,O=v*y-m*M,X=v*x-_*M,B=g*y-m*E,Z=g*x-_*E,ne=m*x-_*y,ce=T*ne-N*Z+C*B+k*X-I*O+F*b;if(ce===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const G=1/ce;return e[0]=(f*ne-h*Z+d*B)*G,e[1]=(o*Z-r*ne-a*B)*G,e[2]=(E*F-y*I+x*k)*G,e[3]=(m*I-g*F-_*k)*G,e[4]=(h*X-c*ne-d*O)*G,e[5]=(t*ne-o*X+a*O)*G,e[6]=(y*C-M*F-x*N)*G,e[7]=(v*F-m*C+_*N)*G,e[8]=(c*Z-f*X+d*b)*G,e[9]=(r*X-t*Z-a*b)*G,e[10]=(M*I-E*C+x*T)*G,e[11]=(g*C-v*I-_*T)*G,e[12]=(f*O-c*B-h*b)*G,e[13]=(t*B-r*O+o*b)*G,e[14]=(E*N-M*k-y*T)*G,e[15]=(v*k-g*N+m*T)*G,this}scale(e){const t=this.elements,r=e.x,o=e.y,a=e.z;return t[0]*=r,t[4]*=o,t[8]*=a,t[1]*=r,t[5]*=o,t[9]*=a,t[2]*=r,t[6]*=o,t[10]*=a,t[3]*=r,t[7]*=o,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,o))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),o=Math.sin(t),a=1-r,c=e.x,f=e.y,h=e.z,d=a*c,v=a*f;return this.set(d*c+r,d*f-o*h,d*h+o*f,0,d*f+o*h,v*f+r,v*h-o*c,0,d*h-o*f,v*h+o*c,a*h*h+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,o,a,c){return this.set(1,r,a,0,e,1,c,0,t,o,1,0,0,0,0,1),this}compose(e,t,r){const o=this.elements,a=t._x,c=t._y,f=t._z,h=t._w,d=a+a,v=c+c,g=f+f,m=a*d,_=a*v,M=a*g,E=c*v,y=c*g,x=f*g,T=h*d,N=h*v,C=h*g,k=r.x,I=r.y,F=r.z;return o[0]=(1-(E+x))*k,o[1]=(_+C)*k,o[2]=(M-N)*k,o[3]=0,o[4]=(_-C)*I,o[5]=(1-(m+x))*I,o[6]=(y+T)*I,o[7]=0,o[8]=(M+N)*F,o[9]=(y-T)*F,o[10]=(1-(m+E))*F,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,r){const o=this.elements;e.x=o[12],e.y=o[13],e.z=o[14];const a=this.determinant();if(a===0)return r.set(1,1,1),t.identity(),this;let c=wo.set(o[0],o[1],o[2]).length();const f=wo.set(o[4],o[5],o[6]).length(),h=wo.set(o[8],o[9],o[10]).length();a<0&&(c=-c),Ti.copy(this);const d=1/c,v=1/f,g=1/h;return Ti.elements[0]*=d,Ti.elements[1]*=d,Ti.elements[2]*=d,Ti.elements[4]*=v,Ti.elements[5]*=v,Ti.elements[6]*=v,Ti.elements[8]*=g,Ti.elements[9]*=g,Ti.elements[10]*=g,t.setFromRotationMatrix(Ti),r.x=c,r.y=f,r.z=h,this}makePerspective(e,t,r,o,a,c,f=Yi,h=!1){const d=this.elements,v=2*a/(t-e),g=2*a/(r-o),m=(t+e)/(t-e),_=(r+o)/(r-o);let M,E;if(h)M=a/(c-a),E=c*a/(c-a);else if(f===Yi)M=-(c+a)/(c-a),E=-2*c*a/(c-a);else if(f===Mu)M=-c/(c-a),E=-c*a/(c-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return d[0]=v,d[4]=0,d[8]=m,d[12]=0,d[1]=0,d[5]=g,d[9]=_,d[13]=0,d[2]=0,d[6]=0,d[10]=M,d[14]=E,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,r,o,a,c,f=Yi,h=!1){const d=this.elements,v=2/(t-e),g=2/(r-o),m=-(t+e)/(t-e),_=-(r+o)/(r-o);let M,E;if(h)M=1/(c-a),E=c/(c-a);else if(f===Yi)M=-2/(c-a),E=-(c+a)/(c-a);else if(f===Mu)M=-1/(c-a),E=-a/(c-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return d[0]=v,d[4]=0,d[8]=0,d[12]=m,d[1]=0,d[5]=g,d[9]=0,d[13]=_,d[2]=0,d[6]=0,d[10]=M,d[14]=E,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let o=0;o<16;o++)if(t[o]!==r[o])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}};Ru.prototype.isMatrix4=!0;let on=Ru;const wo=new ie,Ti=new on,aC=new ie(0,0,0),lC=new ie(1,1,1),Zr=new ie,Tc=new ie,ei=new ie,Ov=new on,kv=new ds;class Ws{constructor(e=0,t=0,r=0,o=Ws.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,o=this._order){return this._x=e,this._y=t,this._z=r,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const o=e.elements,a=o[0],c=o[4],f=o[8],h=o[1],d=o[5],v=o[9],g=o[2],m=o[6],_=o[10];switch(t){case"XYZ":this._y=Math.asin(Et(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-v,_),this._z=Math.atan2(-c,a)):(this._x=Math.atan2(m,d),this._z=0);break;case"YXZ":this._x=Math.asin(-Et(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(f,_),this._z=Math.atan2(h,d)):(this._y=Math.atan2(-g,a),this._z=0);break;case"ZXY":this._x=Math.asin(Et(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-g,_),this._z=Math.atan2(-c,d)):(this._y=0,this._z=Math.atan2(h,a));break;case"ZYX":this._y=Math.asin(-Et(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(m,_),this._z=Math.atan2(h,a)):(this._x=0,this._z=Math.atan2(-c,d));break;case"YZX":this._z=Math.asin(Et(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-v,d),this._y=Math.atan2(-g,a)):(this._x=0,this._y=Math.atan2(f,_));break;case"XZY":this._z=Math.asin(-Et(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(m,d),this._y=Math.atan2(f,a)):(this._x=Math.atan2(-v,_),this._y=0);break;default:ot("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return Ov.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ov,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return kv.setFromEuler(this),this.setFromQuaternion(kv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ws.DEFAULT_ORDER="XYZ";class vS{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let cC=0;const zv=new ie,bo=new ds,hr=new on,Ac=new ie,Ha=new ie,uC=new ie,fC=new ds,Bv=new ie(1,0,0),Vv=new ie(0,1,0),Gv=new ie(0,0,1),Hv={type:"added"},dC={type:"removed"},To={type:"childadded",child:null},Kd={type:"childremoved",child:null};class kn extends ms{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cC++}),this.uuid=as(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=kn.DEFAULT_UP.clone();const e=new ie,t=new Ws,r=new ds,o=new ie(1,1,1);function a(){r.setFromEuler(t,!1)}function c(){t.setFromQuaternion(r,void 0,!1)}t._onChange(a),r._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new on},normalMatrix:{value:new vt}}),this.matrix=new on,this.matrixWorld=new on,this.matrixAutoUpdate=kn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vS,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return bo.setFromAxisAngle(e,t),this.quaternion.multiply(bo),this}rotateOnWorldAxis(e,t){return bo.setFromAxisAngle(e,t),this.quaternion.premultiply(bo),this}rotateX(e){return this.rotateOnAxis(Bv,e)}rotateY(e){return this.rotateOnAxis(Vv,e)}rotateZ(e){return this.rotateOnAxis(Gv,e)}translateOnAxis(e,t){return zv.copy(e).applyQuaternion(this.quaternion),this.position.add(zv.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Bv,e)}translateY(e){return this.translateOnAxis(Vv,e)}translateZ(e){return this.translateOnAxis(Gv,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hr.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?Ac.copy(e):Ac.set(e,t,r);const o=this.parent;this.updateWorldMatrix(!0,!1),Ha.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hr.lookAt(Ha,Ac,this.up):hr.lookAt(Ac,Ha,this.up),this.quaternion.setFromRotationMatrix(hr),o&&(hr.extractRotation(o.matrixWorld),bo.setFromRotationMatrix(hr),this.quaternion.premultiply(bo.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(At("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hv),To.child=e,this.dispatchEvent(To),To.child=null):At("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dC),Kd.child=e,this.dispatchEvent(Kd),Kd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hr.multiply(e.parent.matrixWorld)),e.applyMatrix4(hr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hv),To.child=e,this.dispatchEvent(To),To.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,o=this.children.length;r<o;r++){const c=this.children[r].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const o=this.children;for(let a=0,c=o.length;a<c;a++)o[a].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ha,e,uC),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ha,fC,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,o=t.length;r<o;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,o=t.length;r<o;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,r=e.y,o=e.z,a=this.matrix.elements;a[12]+=t-a[0]*t-a[4]*r-a[8]*o,a[13]+=r-a[1]*t-a[5]*r-a[9]*o,a[14]+=o-a[2]*t-a[6]*r-a[10]*o}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,o=t.length;r<o;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const o=this.children;for(let a=0,c=o.length;a<c;a++)o[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),this.static!==!1&&(o.static=this.static),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.pivot!==null&&(o.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(o.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(o.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.geometryInfo=this._geometryInfo.map(f=>({...f,boundingBox:f.boundingBox?f.boundingBox.toJSON():void 0,boundingSphere:f.boundingSphere?f.boundingSphere.toJSON():void 0})),o.instanceInfo=this._instanceInfo.map(f=>({...f})),o.availableInstanceIds=this._availableInstanceIds.slice(),o.availableGeometryIds=this._availableGeometryIds.slice(),o.nextIndexStart=this._nextIndexStart,o.nextVertexStart=this._nextVertexStart,o.geometryCount=this._geometryCount,o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.matricesTexture=this._matricesTexture.toJSON(e),o.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(o.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(o.boundingBox=this.boundingBox.toJSON()));function a(f,h){return f[h.uuid]===void 0&&(f[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=a(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const h=f.shapes;if(Array.isArray(h))for(let d=0,v=h.length;d<v;d++){const g=h[d];a(e.shapes,g)}else a(e.shapes,h)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let h=0,d=this.material.length;h<d;h++)f.push(a(e.materials,this.material[h]));o.material=f}else o.material=a(e.materials,this.material);if(this.children.length>0){o.children=[];for(let f=0;f<this.children.length;f++)o.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let f=0;f<this.animations.length;f++){const h=this.animations[f];o.animations.push(a(e.animations,h))}}if(t){const f=c(e.geometries),h=c(e.materials),d=c(e.textures),v=c(e.images),g=c(e.shapes),m=c(e.skeletons),_=c(e.animations),M=c(e.nodes);f.length>0&&(r.geometries=f),h.length>0&&(r.materials=h),d.length>0&&(r.textures=d),v.length>0&&(r.images=v),g.length>0&&(r.shapes=g),m.length>0&&(r.skeletons=m),_.length>0&&(r.animations=_),M.length>0&&(r.nodes=M)}return r.object=o,r;function c(f){const h=[];for(const d in f){const v=f[d];delete v.metadata,h.push(v)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const o=e.children[r];this.add(o.clone())}return this}}kn.DEFAULT_UP=new ie(0,1,0);kn.DEFAULT_MATRIX_AUTO_UPDATE=!0;kn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Rc extends kn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const hC={type:"move"};class qd{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rc,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rc,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new ie,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new ie),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rc,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new ie,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new ie,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let o=null,a=null,c=null;const f=this._targetRay,h=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){c=!0;for(const E of e.hand.values()){const y=t.getJointPose(E,r),x=this._getHandJoint(d,E);y!==null&&(x.matrix.fromArray(y.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=y.radius),x.visible=y!==null}const v=d.joints["index-finger-tip"],g=d.joints["thumb-tip"],m=v.position.distanceTo(g.position),_=.02,M=.005;d.inputState.pinching&&m>_+M?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&m<=_-M&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,r),a!==null&&(h.matrix.fromArray(a.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,a.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(a.linearVelocity)):h.hasLinearVelocity=!1,a.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(a.angularVelocity)):h.hasAngularVelocity=!1,h.eventsEnabled&&h.dispatchEvent({type:"gripUpdated",data:e,target:this})));f!==null&&(o=t.getPose(e.targetRaySpace,r),o===null&&a!==null&&(o=a),o!==null&&(f.matrix.fromArray(o.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,o.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(o.linearVelocity)):f.hasLinearVelocity=!1,o.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(o.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(hC)))}return f!==null&&(f.visible=o!==null),h!==null&&(h.visible=a!==null),d!==null&&(d.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new Rc;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const _S={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qr={h:0,s:0,l:0},Cc={h:0,s:0,l:0};function Zd(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Lt{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=di){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,bt.colorSpaceToWorking(this,t),this}setRGB(e,t,r,o=bt.workingColorSpace){return this.r=e,this.g=t,this.b=r,bt.colorSpaceToWorking(this,o),this}setHSL(e,t,r,o=bt.workingColorSpace){if(e=JR(e,1),t=Et(t,0,1),r=Et(r,0,1),t===0)this.r=this.g=this.b=r;else{const a=r<=.5?r*(1+t):r+t-r*t,c=2*r-a;this.r=Zd(c,a,e+1/3),this.g=Zd(c,a,e),this.b=Zd(c,a,e-1/3)}return bt.colorSpaceToWorking(this,o),this}setStyle(e,t=di){function r(a){a!==void 0&&parseFloat(a)<1&&ot("Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const c=o[1],f=o[2];switch(c){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:ot("Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=o[1],c=a.length;if(c===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(a,16),t);ot("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=di){const r=_S[e.toLowerCase()];return r!==void 0?this.setHex(r,t):ot("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mr(e.r),this.g=Mr(e.g),this.b=Mr(e.b),this}copyLinearToSRGB(e){return this.r=jo(e.r),this.g=jo(e.g),this.b=jo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=di){return bt.workingToColorSpace(Pn.copy(this),e),Math.round(Et(Pn.r*255,0,255))*65536+Math.round(Et(Pn.g*255,0,255))*256+Math.round(Et(Pn.b*255,0,255))}getHexString(e=di){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=bt.workingColorSpace){bt.workingToColorSpace(Pn.copy(this),t);const r=Pn.r,o=Pn.g,a=Pn.b,c=Math.max(r,o,a),f=Math.min(r,o,a);let h,d;const v=(f+c)/2;if(f===c)h=0,d=0;else{const g=c-f;switch(d=v<=.5?g/(c+f):g/(2-c-f),c){case r:h=(o-a)/g+(o<a?6:0);break;case o:h=(a-r)/g+2;break;case a:h=(r-o)/g+4;break}h/=6}return e.h=h,e.s=d,e.l=v,e}getRGB(e,t=bt.workingColorSpace){return bt.workingToColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=di){bt.workingToColorSpace(Pn.copy(this),e);const t=Pn.r,r=Pn.g,o=Pn.b;return e!==di?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(o*255)})`}offsetHSL(e,t,r){return this.getHSL(Qr),this.setHSL(Qr.h+e,Qr.s+t,Qr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(Qr),e.getHSL(Cc);const r=Wd(Qr.h,Cc.h,t),o=Wd(Qr.s,Cc.s,t),a=Wd(Qr.l,Cc.l,t);return this.setHSL(r,o,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,o=this.b,a=e.elements;return this.r=a[0]*t+a[3]*r+a[6]*o,this.g=a[1]*t+a[4]*r+a[7]*o,this.b=a[2]*t+a[5]*r+a[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pn=new Lt;Lt.NAMES=_S;class pC extends kn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ws,this.environmentIntensity=1,this.environmentRotation=new Ws,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Ai=new ie,pr=new ie,Qd=new ie,mr=new ie,Ao=new ie,Ro=new ie,Wv=new ie,Jd=new ie,eh=new ie,th=new ie,nh=new sn,ih=new sn,rh=new sn;class mi{constructor(e=new ie,t=new ie,r=new ie){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,o){o.subVectors(r,t),Ai.subVectors(e,t),o.cross(Ai);const a=o.lengthSq();return a>0?o.multiplyScalar(1/Math.sqrt(a)):o.set(0,0,0)}static getBarycoord(e,t,r,o,a){Ai.subVectors(o,t),pr.subVectors(r,t),Qd.subVectors(e,t);const c=Ai.dot(Ai),f=Ai.dot(pr),h=Ai.dot(Qd),d=pr.dot(pr),v=pr.dot(Qd),g=c*d-f*f;if(g===0)return a.set(0,0,0),null;const m=1/g,_=(d*h-f*v)*m,M=(c*v-f*h)*m;return a.set(1-_-M,M,_)}static containsPoint(e,t,r,o){return this.getBarycoord(e,t,r,o,mr)===null?!1:mr.x>=0&&mr.y>=0&&mr.x+mr.y<=1}static getInterpolation(e,t,r,o,a,c,f,h){return this.getBarycoord(e,t,r,o,mr)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(a,mr.x),h.addScaledVector(c,mr.y),h.addScaledVector(f,mr.z),h)}static getInterpolatedAttribute(e,t,r,o,a,c){return nh.setScalar(0),ih.setScalar(0),rh.setScalar(0),nh.fromBufferAttribute(e,t),ih.fromBufferAttribute(e,r),rh.fromBufferAttribute(e,o),c.setScalar(0),c.addScaledVector(nh,a.x),c.addScaledVector(ih,a.y),c.addScaledVector(rh,a.z),c}static isFrontFacing(e,t,r,o){return Ai.subVectors(r,t),pr.subVectors(e,t),Ai.cross(pr).dot(o)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,o){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,r,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ai.subVectors(this.c,this.b),pr.subVectors(this.a,this.b),Ai.cross(pr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,o,a){return mi.getInterpolation(e,this.a,this.b,this.c,t,r,o,a)}containsPoint(e){return mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,o=this.b,a=this.c;let c,f;Ao.subVectors(o,r),Ro.subVectors(a,r),Jd.subVectors(e,r);const h=Ao.dot(Jd),d=Ro.dot(Jd);if(h<=0&&d<=0)return t.copy(r);eh.subVectors(e,o);const v=Ao.dot(eh),g=Ro.dot(eh);if(v>=0&&g<=v)return t.copy(o);const m=h*g-v*d;if(m<=0&&h>=0&&v<=0)return c=h/(h-v),t.copy(r).addScaledVector(Ao,c);th.subVectors(e,a);const _=Ao.dot(th),M=Ro.dot(th);if(M>=0&&_<=M)return t.copy(a);const E=_*d-h*M;if(E<=0&&d>=0&&M<=0)return f=d/(d-M),t.copy(r).addScaledVector(Ro,f);const y=v*M-_*g;if(y<=0&&g-v>=0&&_-M>=0)return Wv.subVectors(a,o),f=(g-v)/(g-v+(_-M)),t.copy(o).addScaledVector(Wv,f);const x=1/(y+E+m);return c=E*x,f=m*x,t.copy(r).addScaledVector(Ao,c).addScaledVector(Ro,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class fl{constructor(e=new ie(1/0,1/0,1/0),t=new ie(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(Ri.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(Ri.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=Ri.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const a=r.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let c=0,f=a.count;c<f;c++)e.isMesh===!0?e.getVertexPosition(c,Ri):Ri.fromBufferAttribute(a,c),Ri.applyMatrix4(e.matrixWorld),this.expandByPoint(Ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Pc.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Pc.copy(r.boundingBox)),Pc.applyMatrix4(e.matrixWorld),this.union(Pc)}const o=e.children;for(let a=0,c=o.length;a<c;a++)this.expandByObject(o[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ri),Ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wa),Dc.subVectors(this.max,Wa),Co.subVectors(e.a,Wa),Po.subVectors(e.b,Wa),Do.subVectors(e.c,Wa),Jr.subVectors(Po,Co),es.subVectors(Do,Po),Ls.subVectors(Co,Do);let t=[0,-Jr.z,Jr.y,0,-es.z,es.y,0,-Ls.z,Ls.y,Jr.z,0,-Jr.x,es.z,0,-es.x,Ls.z,0,-Ls.x,-Jr.y,Jr.x,0,-es.y,es.x,0,-Ls.y,Ls.x,0];return!sh(t,Co,Po,Do,Dc)||(t=[1,0,0,0,1,0,0,0,1],!sh(t,Co,Po,Do,Dc))?!1:(Nc.crossVectors(Jr,es),t=[Nc.x,Nc.y,Nc.z],sh(t,Co,Po,Do,Dc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const gr=[new ie,new ie,new ie,new ie,new ie,new ie,new ie,new ie],Ri=new ie,Pc=new fl,Co=new ie,Po=new ie,Do=new ie,Jr=new ie,es=new ie,Ls=new ie,Wa=new ie,Dc=new ie,Nc=new ie,Is=new ie;function sh(n,e,t,r,o){for(let a=0,c=n.length-3;a<=c;a+=3){Is.fromArray(n,a);const f=o.x*Math.abs(Is.x)+o.y*Math.abs(Is.y)+o.z*Math.abs(Is.z),h=e.dot(Is),d=t.dot(Is),v=r.dot(Is);if(Math.max(-Math.max(h,d,v),Math.min(h,d,v))>f)return!1}return!0}const cn=new ie,Lc=new ft;let mC=0;class Pi extends ms{constructor(e,t,r=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:mC++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=Mp,this.updateRanges=[],this.gpuType=$i,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let o=0,a=this.itemSize;o<a;o++)this.array[e+o]=t.array[r+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)Lc.fromBufferAttribute(this,t),Lc.applyMatrix3(e),this.setXY(t,Lc.x,Lc.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix3(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix4(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)cn.fromBufferAttribute(this,t),cn.applyNormalMatrix(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)cn.fromBufferAttribute(this,t),cn.transformDirection(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=ji(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Vt(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ji(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ji(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ji(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ji(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,o){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),r=Vt(r,this.array),o=Vt(o,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=o,this}setXYZW(e,t,r,o,a){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),r=Vt(r,this.array),o=Vt(o,this.array),a=Vt(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=o,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Mp&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class xS extends Pi{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class yS extends Pi{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class Qi extends Pi{constructor(e,t,r){super(new Float32Array(e),t,r)}}const gC=new fl,ja=new ie,oh=new ie;class Hu{constructor(e=new ie,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):gC.setFromPoints(e).getCenter(r);let o=0;for(let a=0,c=e.length;a<c;a++)o=Math.max(o,r.distanceToSquared(e[a]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ja.subVectors(e,this.center);const t=ja.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),o=(r-this.radius)*.5;this.center.addScaledVector(ja,o/r),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(oh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ja.copy(e.center).add(oh)),this.expandByPoint(ja.copy(e.center).sub(oh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let vC=0;const fi=new on,ah=new kn,No=new ie,ti=new fl,Xa=new fl,xn=new ie;class vi extends ms{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vC++}),this.uuid=as(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(KR(e)?yS:xS)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const a=new vt().getNormalMatrix(e);r.applyNormalMatrix(a),r.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fi.makeRotationFromQuaternion(e),this.applyMatrix4(fi),this}rotateX(e){return fi.makeRotationX(e),this.applyMatrix4(fi),this}rotateY(e){return fi.makeRotationY(e),this.applyMatrix4(fi),this}rotateZ(e){return fi.makeRotationZ(e),this.applyMatrix4(fi),this}translate(e,t,r){return fi.makeTranslation(e,t,r),this.applyMatrix4(fi),this}scale(e,t,r){return fi.makeScale(e,t,r),this.applyMatrix4(fi),this}lookAt(e){return ah.lookAt(e),ah.updateMatrix(),this.applyMatrix4(ah.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(No).negate(),this.translate(No.x,No.y,No.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let o=0,a=e.length;o<a;o++){const c=e[o];r.push(c.x,c.y,c.z||0)}this.setAttribute("position",new Qi(r,3))}else{const r=Math.min(e.length,t.count);for(let o=0;o<r;o++){const a=e[o];t.setXYZ(o,a.x,a.y,a.z||0)}e.length>t.count&&ot("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){At("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new ie(-1/0,-1/0,-1/0),new ie(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ti.setFromBufferAttribute(a),this.morphTargetsRelative?(xn.addVectors(this.boundingBox.min,ti.min),this.boundingBox.expandByPoint(xn),xn.addVectors(this.boundingBox.max,ti.max),this.boundingBox.expandByPoint(xn)):(this.boundingBox.expandByPoint(ti.min),this.boundingBox.expandByPoint(ti.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&At('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Hu);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){At("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new ie,1/0);return}if(e){const r=this.boundingSphere.center;if(ti.setFromBufferAttribute(e),t)for(let a=0,c=t.length;a<c;a++){const f=t[a];Xa.setFromBufferAttribute(f),this.morphTargetsRelative?(xn.addVectors(ti.min,Xa.min),ti.expandByPoint(xn),xn.addVectors(ti.max,Xa.max),ti.expandByPoint(xn)):(ti.expandByPoint(Xa.min),ti.expandByPoint(Xa.max))}ti.getCenter(r);let o=0;for(let a=0,c=e.count;a<c;a++)xn.fromBufferAttribute(e,a),o=Math.max(o,r.distanceToSquared(xn));if(t)for(let a=0,c=t.length;a<c;a++){const f=t[a],h=this.morphTargetsRelative;for(let d=0,v=f.count;d<v;d++)xn.fromBufferAttribute(f,d),h&&(No.fromBufferAttribute(e,d),xn.add(No)),o=Math.max(o,r.distanceToSquared(xn))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&At('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){At("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,o=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pi(new Float32Array(4*r.count),4));const c=this.getAttribute("tangent"),f=[],h=[];for(let b=0;b<r.count;b++)f[b]=new ie,h[b]=new ie;const d=new ie,v=new ie,g=new ie,m=new ft,_=new ft,M=new ft,E=new ie,y=new ie;function x(b,O,X){d.fromBufferAttribute(r,b),v.fromBufferAttribute(r,O),g.fromBufferAttribute(r,X),m.fromBufferAttribute(a,b),_.fromBufferAttribute(a,O),M.fromBufferAttribute(a,X),v.sub(d),g.sub(d),_.sub(m),M.sub(m);const B=1/(_.x*M.y-M.x*_.y);isFinite(B)&&(E.copy(v).multiplyScalar(M.y).addScaledVector(g,-_.y).multiplyScalar(B),y.copy(g).multiplyScalar(_.x).addScaledVector(v,-M.x).multiplyScalar(B),f[b].add(E),f[O].add(E),f[X].add(E),h[b].add(y),h[O].add(y),h[X].add(y))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let b=0,O=T.length;b<O;++b){const X=T[b],B=X.start,Z=X.count;for(let ne=B,ce=B+Z;ne<ce;ne+=3)x(e.getX(ne+0),e.getX(ne+1),e.getX(ne+2))}const N=new ie,C=new ie,k=new ie,I=new ie;function F(b){k.fromBufferAttribute(o,b),I.copy(k);const O=f[b];N.copy(O),N.sub(k.multiplyScalar(k.dot(O))).normalize(),C.crossVectors(I,O);const B=C.dot(h[b])<0?-1:1;c.setXYZW(b,N.x,N.y,N.z,B)}for(let b=0,O=T.length;b<O;++b){const X=T[b],B=X.start,Z=X.count;for(let ne=B,ce=B+Z;ne<ce;ne+=3)F(e.getX(ne+0)),F(e.getX(ne+1)),F(e.getX(ne+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Pi(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let m=0,_=r.count;m<_;m++)r.setXYZ(m,0,0,0);const o=new ie,a=new ie,c=new ie,f=new ie,h=new ie,d=new ie,v=new ie,g=new ie;if(e)for(let m=0,_=e.count;m<_;m+=3){const M=e.getX(m+0),E=e.getX(m+1),y=e.getX(m+2);o.fromBufferAttribute(t,M),a.fromBufferAttribute(t,E),c.fromBufferAttribute(t,y),v.subVectors(c,a),g.subVectors(o,a),v.cross(g),f.fromBufferAttribute(r,M),h.fromBufferAttribute(r,E),d.fromBufferAttribute(r,y),f.add(v),h.add(v),d.add(v),r.setXYZ(M,f.x,f.y,f.z),r.setXYZ(E,h.x,h.y,h.z),r.setXYZ(y,d.x,d.y,d.z)}else for(let m=0,_=t.count;m<_;m+=3)o.fromBufferAttribute(t,m+0),a.fromBufferAttribute(t,m+1),c.fromBufferAttribute(t,m+2),v.subVectors(c,a),g.subVectors(o,a),v.cross(g),r.setXYZ(m+0,v.x,v.y,v.z),r.setXYZ(m+1,v.x,v.y,v.z),r.setXYZ(m+2,v.x,v.y,v.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)xn.fromBufferAttribute(e,t),xn.normalize(),e.setXYZ(t,xn.x,xn.y,xn.z)}toNonIndexed(){function e(f,h){const d=f.array,v=f.itemSize,g=f.normalized,m=new d.constructor(h.length*v);let _=0,M=0;for(let E=0,y=h.length;E<y;E++){f.isInterleavedBufferAttribute?_=h[E]*f.data.stride+f.offset:_=h[E]*v;for(let x=0;x<v;x++)m[M++]=d[_++]}return new Pi(m,v,g)}if(this.index===null)return ot("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new vi,r=this.index.array,o=this.attributes;for(const f in o){const h=o[f],d=e(h,r);t.setAttribute(f,d)}const a=this.morphAttributes;for(const f in a){const h=[],d=a[f];for(let v=0,g=d.length;v<g;v++){const m=d[v],_=e(m,r);h.push(_)}t.morphAttributes[f]=h}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let f=0,h=c.length;f<h;f++){const d=c[f];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const d in h)h[d]!==void 0&&(e[d]=h[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const h in r){const d=r[h];e.data.attributes[h]=d.toJSON(e.data)}const o={};let a=!1;for(const h in this.morphAttributes){const d=this.morphAttributes[h],v=[];for(let g=0,m=d.length;g<m;g++){const _=d[g];v.push(_.toJSON(e.data))}v.length>0&&(o[h]=v,a=!0)}a&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere=f.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const o=e.attributes;for(const d in o){const v=o[d];this.setAttribute(d,v.clone(t))}const a=e.morphAttributes;for(const d in a){const v=[],g=a[d];for(let m=0,_=g.length;m<_;m++)v.push(g[m].clone(t));this.morphAttributes[d]=v}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let d=0,v=c.length;d<v;d++){const g=c[d];this.addGroup(g.start,g.count,g.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class _C{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Mp,this.updateRanges=[],this.version=0,this.uuid=as()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,r){e*=this.stride,r*=t.stride;for(let o=0,a=this.stride;o<a;o++)this.array[e+o]=t.array[r+o];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=as()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),r=new this.constructor(t,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=as()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Fn=new ie;class bu{constructor(e,t,r,o=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=r,this.normalized=o}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,r=this.data.count;t<r;t++)Fn.fromBufferAttribute(this,t),Fn.applyMatrix4(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)Fn.fromBufferAttribute(this,t),Fn.applyNormalMatrix(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)Fn.fromBufferAttribute(this,t),Fn.transformDirection(e),this.setXYZ(t,Fn.x,Fn.y,Fn.z);return this}getComponent(e,t){let r=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(r=ji(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Vt(r,this.array)),this.data.array[e*this.data.stride+this.offset+t]=r,this}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=ji(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=ji(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=ji(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=ji(t,this.array)),t}setXY(e,t,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Vt(t,this.array),r=Vt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=r,this}setXYZ(e,t,r,o){return e=e*this.data.stride+this.offset,this.normalized&&(t=Vt(t,this.array),r=Vt(r,this.array),o=Vt(o,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=r,this.data.array[e+2]=o,this}setXYZW(e,t,r,o,a){return e=e*this.data.stride+this.offset,this.normalized&&(t=Vt(t,this.array),r=Vt(r,this.array),o=Vt(o,this.array),a=Vt(a,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=r,this.data.array[e+2]=o,this.data.array[e+3]=a,this}clone(e){if(e===void 0){wu("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let r=0;r<this.count;r++){const o=r*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[o+a])}return new Pi(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new bu(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){wu("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let r=0;r<this.count;r++){const o=r*this.data.stride+this.offset;for(let a=0;a<this.itemSize;a++)t.push(this.data.array[o+a])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let xC=0;class ia extends ms{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xC++}),this.uuid=as(),this.name="",this.type="Material",this.blending=Wo,this.side=fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uh,this.blendDst=Fh,this.blendEquation=Os,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Lt(0,0,0),this.blendAlpha=0,this.depthFunc=Yo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dv,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mo,this.stencilZFail=Mo,this.stencilZPass=Mo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){ot(`Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){ot(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(r):o&&o.isVector3&&r&&r.isVector3?o.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(r.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(r.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Wo&&(r.blending=this.blending),this.side!==fs&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Uh&&(r.blendSrc=this.blendSrc),this.blendDst!==Fh&&(r.blendDst=this.blendDst),this.blendEquation!==Os&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==Yo&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dv&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mo&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Mo&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Mo&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.allowOverride===!1&&(r.allowOverride=!1),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function o(a){const c=[];for(const f in a){const h=a[f];delete h.metadata,c.push(h)}return c}if(t){const a=o(e.textures),c=o(e.images);a.length>0&&(r.textures=a),c.length>0&&(r.images=c)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const o=t.length;r=new Array(o);for(let a=0;a!==o;++a)r[a]=t[a].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class SS extends ia{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Lo;const $a=new ie,Io=new ie,Uo=new ie,Fo=new ft,Ya=new ft,MS=new on,Ic=new ie,Ka=new ie,Uc=new ie,jv=new ft,lh=new ft,Xv=new ft;class yC extends kn{constructor(e=new SS){if(super(),this.isSprite=!0,this.type="Sprite",Lo===void 0){Lo=new vi;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),r=new _C(t,5);Lo.setIndex([0,1,2,0,2,3]),Lo.setAttribute("position",new bu(r,3,0,!1)),Lo.setAttribute("uv",new bu(r,2,3,!1))}this.geometry=Lo,this.material=e,this.center=new ft(.5,.5),this.count=1}raycast(e,t){e.camera===null&&At('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Io.setFromMatrixScale(this.matrixWorld),MS.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Uo.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Io.multiplyScalar(-Uo.z);const r=this.material.rotation;let o,a;r!==0&&(a=Math.cos(r),o=Math.sin(r));const c=this.center;Fc(Ic.set(-.5,-.5,0),Uo,c,Io,o,a),Fc(Ka.set(.5,-.5,0),Uo,c,Io,o,a),Fc(Uc.set(.5,.5,0),Uo,c,Io,o,a),jv.set(0,0),lh.set(1,0),Xv.set(1,1);let f=e.ray.intersectTriangle(Ic,Ka,Uc,!1,$a);if(f===null&&(Fc(Ka.set(-.5,.5,0),Uo,c,Io,o,a),lh.set(0,1),f=e.ray.intersectTriangle(Ic,Uc,Ka,!1,$a),f===null))return;const h=e.ray.origin.distanceTo($a);h<e.near||h>e.far||t.push({distance:h,point:$a.clone(),uv:mi.getInterpolation($a,Ic,Ka,Uc,jv,lh,Xv,new ft),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Fc(n,e,t,r,o,a){Fo.subVectors(n,t).addScalar(.5).multiply(r),o!==void 0?(Ya.x=a*Fo.x-o*Fo.y,Ya.y=o*Fo.x+a*Fo.y):Ya.copy(Fo),n.copy(e),n.x+=Ya.x,n.y+=Ya.y,n.applyMatrix4(MS)}const vr=new ie,ch=new ie,Oc=new ie,ts=new ie,uh=new ie,kc=new ie,fh=new ie;class gm{constructor(e=new ie,t=new ie(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,vr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=vr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(vr.copy(this.origin).addScaledVector(this.direction,t),vr.distanceToSquared(e))}distanceSqToSegment(e,t,r,o){ch.copy(e).add(t).multiplyScalar(.5),Oc.copy(t).sub(e).normalize(),ts.copy(this.origin).sub(ch);const a=e.distanceTo(t)*.5,c=-this.direction.dot(Oc),f=ts.dot(this.direction),h=-ts.dot(Oc),d=ts.lengthSq(),v=Math.abs(1-c*c);let g,m,_,M;if(v>0)if(g=c*h-f,m=c*f-h,M=a*v,g>=0)if(m>=-M)if(m<=M){const E=1/v;g*=E,m*=E,_=g*(g+c*m+2*f)+m*(c*g+m+2*h)+d}else m=a,g=Math.max(0,-(c*m+f)),_=-g*g+m*(m+2*h)+d;else m=-a,g=Math.max(0,-(c*m+f)),_=-g*g+m*(m+2*h)+d;else m<=-M?(g=Math.max(0,-(-c*a+f)),m=g>0?-a:Math.min(Math.max(-a,-h),a),_=-g*g+m*(m+2*h)+d):m<=M?(g=0,m=Math.min(Math.max(-a,-h),a),_=m*(m+2*h)+d):(g=Math.max(0,-(c*a+f)),m=g>0?a:Math.min(Math.max(-a,-h),a),_=-g*g+m*(m+2*h)+d);else m=c>0?-a:a,g=Math.max(0,-(c*m+f)),_=-g*g+m*(m+2*h)+d;return r&&r.copy(this.origin).addScaledVector(this.direction,g),o&&o.copy(ch).addScaledVector(Oc,m),_}intersectSphere(e,t){vr.subVectors(e.center,this.origin);const r=vr.dot(this.direction),o=vr.dot(vr)-r*r,a=e.radius*e.radius;if(o>a)return null;const c=Math.sqrt(a-o),f=r-c,h=r+c;return h<0?null:f<0?this.at(h,t):this.at(f,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,o,a,c,f,h;const d=1/this.direction.x,v=1/this.direction.y,g=1/this.direction.z,m=this.origin;return d>=0?(r=(e.min.x-m.x)*d,o=(e.max.x-m.x)*d):(r=(e.max.x-m.x)*d,o=(e.min.x-m.x)*d),v>=0?(a=(e.min.y-m.y)*v,c=(e.max.y-m.y)*v):(a=(e.max.y-m.y)*v,c=(e.min.y-m.y)*v),r>c||a>o||((a>r||isNaN(r))&&(r=a),(c<o||isNaN(o))&&(o=c),g>=0?(f=(e.min.z-m.z)*g,h=(e.max.z-m.z)*g):(f=(e.max.z-m.z)*g,h=(e.min.z-m.z)*g),r>h||f>o)||((f>r||r!==r)&&(r=f),(h<o||o!==o)&&(o=h),o<0)?null:this.at(r>=0?r:o,t)}intersectsBox(e){return this.intersectBox(e,vr)!==null}intersectTriangle(e,t,r,o,a){uh.subVectors(t,e),kc.subVectors(r,e),fh.crossVectors(uh,kc);let c=this.direction.dot(fh),f;if(c>0){if(o)return null;f=1}else if(c<0)f=-1,c=-c;else return null;ts.subVectors(this.origin,e);const h=f*this.direction.dot(kc.crossVectors(ts,kc));if(h<0)return null;const d=f*this.direction.dot(uh.cross(ts));if(d<0||h+d>c)return null;const v=-f*ts.dot(fh);return v<0?null:this.at(v/c,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ES extends ia{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ws,this.combine=Jy,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const $v=new on,Us=new gm,zc=new Hu,Yv=new ie,Bc=new ie,Vc=new ie,Gc=new ie,dh=new ie,Hc=new ie,Kv=new ie,Wc=new ie;class Rr extends kn{constructor(e=new vi,t=new ES){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const o=t[r[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=o.length;a<c;a++){const f=o[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=a}}}}getVertexPosition(e,t){const r=this.geometry,o=r.attributes.position,a=r.morphAttributes.position,c=r.morphTargetsRelative;t.fromBufferAttribute(o,e);const f=this.morphTargetInfluences;if(a&&f){Hc.set(0,0,0);for(let h=0,d=a.length;h<d;h++){const v=f[h],g=a[h];v!==0&&(dh.fromBufferAttribute(g,e),c?Hc.addScaledVector(dh,v):Hc.addScaledVector(dh.sub(t),v))}t.add(Hc)}return t}raycast(e,t){const r=this.geometry,o=this.material,a=this.matrixWorld;o!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),zc.copy(r.boundingSphere),zc.applyMatrix4(a),Us.copy(e.ray).recast(e.near),!(zc.containsPoint(Us.origin)===!1&&(Us.intersectSphere(zc,Yv)===null||Us.origin.distanceToSquared(Yv)>(e.far-e.near)**2))&&($v.copy(a).invert(),Us.copy(e.ray).applyMatrix4($v),!(r.boundingBox!==null&&Us.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Us)))}_computeIntersections(e,t,r){let o;const a=this.geometry,c=this.material,f=a.index,h=a.attributes.position,d=a.attributes.uv,v=a.attributes.uv1,g=a.attributes.normal,m=a.groups,_=a.drawRange;if(f!==null)if(Array.isArray(c))for(let M=0,E=m.length;M<E;M++){const y=m[M],x=c[y.materialIndex],T=Math.max(y.start,_.start),N=Math.min(f.count,Math.min(y.start+y.count,_.start+_.count));for(let C=T,k=N;C<k;C+=3){const I=f.getX(C),F=f.getX(C+1),b=f.getX(C+2);o=jc(this,x,e,r,d,v,g,I,F,b),o&&(o.faceIndex=Math.floor(C/3),o.face.materialIndex=y.materialIndex,t.push(o))}}else{const M=Math.max(0,_.start),E=Math.min(f.count,_.start+_.count);for(let y=M,x=E;y<x;y+=3){const T=f.getX(y),N=f.getX(y+1),C=f.getX(y+2);o=jc(this,c,e,r,d,v,g,T,N,C),o&&(o.faceIndex=Math.floor(y/3),t.push(o))}}else if(h!==void 0)if(Array.isArray(c))for(let M=0,E=m.length;M<E;M++){const y=m[M],x=c[y.materialIndex],T=Math.max(y.start,_.start),N=Math.min(h.count,Math.min(y.start+y.count,_.start+_.count));for(let C=T,k=N;C<k;C+=3){const I=C,F=C+1,b=C+2;o=jc(this,x,e,r,d,v,g,I,F,b),o&&(o.faceIndex=Math.floor(C/3),o.face.materialIndex=y.materialIndex,t.push(o))}}else{const M=Math.max(0,_.start),E=Math.min(h.count,_.start+_.count);for(let y=M,x=E;y<x;y+=3){const T=y,N=y+1,C=y+2;o=jc(this,c,e,r,d,v,g,T,N,C),o&&(o.faceIndex=Math.floor(y/3),t.push(o))}}}}function SC(n,e,t,r,o,a,c,f){let h;if(e.side===Kn?h=r.intersectTriangle(c,a,o,!0,f):h=r.intersectTriangle(o,a,c,e.side===fs,f),h===null)return null;Wc.copy(f),Wc.applyMatrix4(n.matrixWorld);const d=t.ray.origin.distanceTo(Wc);return d<t.near||d>t.far?null:{distance:d,point:Wc.clone(),object:n}}function jc(n,e,t,r,o,a,c,f,h,d){n.getVertexPosition(f,Bc),n.getVertexPosition(h,Vc),n.getVertexPosition(d,Gc);const v=SC(n,e,t,r,Bc,Vc,Gc,Kv);if(v){const g=new ie;mi.getBarycoord(Kv,Bc,Vc,Gc,g),o&&(v.uv=mi.getInterpolatedAttribute(o,f,h,d,g,new ft)),a&&(v.uv1=mi.getInterpolatedAttribute(a,f,h,d,g,new ft)),c&&(v.normal=mi.getInterpolatedAttribute(c,f,h,d,g,new ie),v.normal.dot(r.direction)>0&&v.normal.multiplyScalar(-1));const m={a:f,b:h,c:d,normal:new ie,materialIndex:0};mi.getNormal(Bc,Vc,Gc,m.normal),v.face=m,v.barycoord=g}return v}class MC extends Nn{constructor(e=null,t=1,r=1,o,a,c,f,h,d=En,v=En,g,m){super(null,c,f,h,d,v,o,a,g,m),this.isDataTexture=!0,this.image={data:e,width:t,height:r},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const hh=new ie,EC=new ie,wC=new vt;class rs{constructor(e=new ie(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,o){return this.normal.set(e,t,r),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const o=hh.subVectors(r,t).cross(EC.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,r=!0){const o=e.delta(hh),a=this.normal.dot(o);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const c=-(e.start.dot(this.normal)+this.constant)/a;return r===!0&&(c<0||c>1)?null:t.copy(e.start).addScaledVector(o,c)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||wC.getNormalMatrix(e),o=this.coplanarPoint(hh).applyMatrix4(e),a=this.normal.applyMatrix3(r).normalize();return this.constant=-o.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Fs=new Hu,bC=new ft(.5,.5),Xc=new ie;class wS{constructor(e=new rs,t=new rs,r=new rs,o=new rs,a=new rs,c=new rs){this.planes=[e,t,r,o,a,c]}set(e,t,r,o,a,c){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(r),f[3].copy(o),f[4].copy(a),f[5].copy(c),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=Yi,r=!1){const o=this.planes,a=e.elements,c=a[0],f=a[1],h=a[2],d=a[3],v=a[4],g=a[5],m=a[6],_=a[7],M=a[8],E=a[9],y=a[10],x=a[11],T=a[12],N=a[13],C=a[14],k=a[15];if(o[0].setComponents(d-c,_-v,x-M,k-T).normalize(),o[1].setComponents(d+c,_+v,x+M,k+T).normalize(),o[2].setComponents(d+f,_+g,x+E,k+N).normalize(),o[3].setComponents(d-f,_-g,x-E,k-N).normalize(),r)o[4].setComponents(h,m,y,C).normalize(),o[5].setComponents(d-h,_-m,x-y,k-C).normalize();else if(o[4].setComponents(d-h,_-m,x-y,k-C).normalize(),t===Yi)o[5].setComponents(d+h,_+m,x+y,k+C).normalize();else if(t===Mu)o[5].setComponents(h,m,y,C).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fs)}intersectsSprite(e){Fs.center.set(0,0,0);const t=bC.distanceTo(e.center);return Fs.radius=.7071067811865476+t,Fs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fs)}intersectsSphere(e){const t=this.planes,r=e.center,o=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(r)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const o=t[r];if(Xc.x=o.normal.x>0?e.max.x:e.min.x,Xc.y=o.normal.y>0?e.max.y:e.min.y,Xc.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Xc)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class bS extends ia{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Lt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Tu=new ie,Au=new ie,qv=new on,qa=new gm,$c=new Hu,ph=new ie,Zv=new ie;class TC extends kn{constructor(e=new vi,t=new bS){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,r=[0];for(let o=1,a=t.count;o<a;o++)Tu.fromBufferAttribute(t,o-1),Au.fromBufferAttribute(t,o),r[o]=r[o-1],r[o]+=Tu.distanceTo(Au);e.setAttribute("lineDistance",new Qi(r,1))}else ot("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const r=this.geometry,o=this.matrixWorld,a=e.params.Line.threshold,c=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),$c.copy(r.boundingSphere),$c.applyMatrix4(o),$c.radius+=a,e.ray.intersectsSphere($c)===!1)return;qv.copy(o).invert(),qa.copy(e.ray).applyMatrix4(qv);const f=a/((this.scale.x+this.scale.y+this.scale.z)/3),h=f*f,d=this.isLineSegments?2:1,v=r.index,m=r.attributes.position;if(v!==null){const _=Math.max(0,c.start),M=Math.min(v.count,c.start+c.count);for(let E=_,y=M-1;E<y;E+=d){const x=v.getX(E),T=v.getX(E+1),N=Yc(this,e,qa,h,x,T,E);N&&t.push(N)}if(this.isLineLoop){const E=v.getX(M-1),y=v.getX(_),x=Yc(this,e,qa,h,E,y,M-1);x&&t.push(x)}}else{const _=Math.max(0,c.start),M=Math.min(m.count,c.start+c.count);for(let E=_,y=M-1;E<y;E+=d){const x=Yc(this,e,qa,h,E,E+1,E);x&&t.push(x)}if(this.isLineLoop){const E=Yc(this,e,qa,h,M-1,_,M-1);E&&t.push(E)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const o=t[r[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=o.length;a<c;a++){const f=o[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=a}}}}}function Yc(n,e,t,r,o,a,c){const f=n.geometry.attributes.position;if(Tu.fromBufferAttribute(f,o),Au.fromBufferAttribute(f,a),t.distanceSqToSegment(Tu,Au,ph,Zv)>r)return;ph.applyMatrix4(n.matrixWorld);const d=e.ray.origin.distanceTo(ph);if(!(d<e.near||d>e.far))return{distance:d,point:Zv.clone().applyMatrix4(n.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:n}}class TS extends Nn{constructor(e=[],t=Gs,r,o,a,c,f,h,d,v){super(e,t,r,o,a,c,f,h,d,v),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class AC extends Nn{constructor(e,t,r,o,a,c,f,h,d){super(e,t,r,o,a,c,f,h,d),this.isCanvasTexture=!0,this.needsUpdate=!0}}class qo extends Nn{constructor(e,t,r=Ji,o,a,c,f=En,h=En,d,v=Ar,g=1){if(v!==Ar&&v!==Bs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const m={width:e,height:t,depth:g};super(m,o,a,c,f,h,v,r,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new mm(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class RC extends qo{constructor(e,t=Ji,r=Gs,o,a,c=En,f=En,h,d=Ar){const v={width:e,height:e,depth:1},g=[v,v,v,v,v,v];super(e,e,t,r,o,a,c,f,h,d),this.image=g,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class AS extends Nn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class dl extends vi{constructor(e=1,t=1,r=1,o=1,a=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:o,heightSegments:a,depthSegments:c};const f=this;o=Math.floor(o),a=Math.floor(a),c=Math.floor(c);const h=[],d=[],v=[],g=[];let m=0,_=0;M("z","y","x",-1,-1,r,t,e,c,a,0),M("z","y","x",1,-1,r,t,-e,c,a,1),M("x","z","y",1,1,e,r,t,o,c,2),M("x","z","y",1,-1,e,r,-t,o,c,3),M("x","y","z",1,-1,e,t,r,o,a,4),M("x","y","z",-1,-1,e,t,-r,o,a,5),this.setIndex(h),this.setAttribute("position",new Qi(d,3)),this.setAttribute("normal",new Qi(v,3)),this.setAttribute("uv",new Qi(g,2));function M(E,y,x,T,N,C,k,I,F,b,O){const X=C/F,B=k/b,Z=C/2,ne=k/2,ce=I/2,G=F+1,Y=b+1;let j=0,W=0;const z=new ie;for(let $=0;$<Y;$++){const P=$*B-ne;for(let V=0;V<G;V++){const ge=V*X-Z;z[E]=ge*T,z[y]=P*N,z[x]=ce,d.push(z.x,z.y,z.z),z[E]=0,z[y]=0,z[x]=I>0?1:-1,v.push(z.x,z.y,z.z),g.push(V/F),g.push(1-$/b),j+=1}}for(let $=0;$<b;$++)for(let P=0;P<F;P++){const V=m+P+G*$,ge=m+P+G*($+1),ye=m+(P+1)+G*($+1),Se=m+(P+1)+G*$;h.push(V,ge,Se),h.push(ge,ye,Se),W+=6}f.addGroup(_,W,O),_+=W,m+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dl(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Wu extends vi{constructor(e=1,t=1,r=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:o};const a=e/2,c=t/2,f=Math.floor(r),h=Math.floor(o),d=f+1,v=h+1,g=e/f,m=t/h,_=[],M=[],E=[],y=[];for(let x=0;x<v;x++){const T=x*m-c;for(let N=0;N<d;N++){const C=N*g-a;M.push(C,-T,0),E.push(0,0,1),y.push(N/f),y.push(1-x/h)}}for(let x=0;x<h;x++)for(let T=0;T<f;T++){const N=T+d*x,C=T+d*(x+1),k=T+1+d*(x+1),I=T+1+d*x;_.push(N,C,I),_.push(C,k,I)}this.setIndex(_),this.setAttribute("position",new Qi(M,3)),this.setAttribute("normal",new Qi(E,3)),this.setAttribute("uv",new Qi(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wu(e.width,e.height,e.widthSegments,e.heightSegments)}}function Zo(n){const e={};for(const t in n){e[t]={};for(const r in n[t]){const o=n[t][r];if(Qv(o))o.isRenderTargetTexture?(ot("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=o.clone();else if(Array.isArray(o))if(Qv(o[0])){const a=[];for(let c=0,f=o.length;c<f;c++)a[c]=o[c].clone();e[t][r]=a}else e[t][r]=o.slice();else e[t][r]=o}}return e}function On(n){const e={};for(let t=0;t<n.length;t++){const r=Zo(n[t]);for(const o in r)e[o]=r[o]}return e}function Qv(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function CC(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function RS(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:bt.workingColorSpace}const PC={clone:Zo,merge:On};var DC=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,NC=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class er extends ia{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=DC,this.fragmentShader=NC,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zo(e.uniforms),this.uniformsGroups=CC(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const c=this.uniforms[o].value;c&&c.isTexture?t.uniforms[o]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[o]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[o]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[o]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[o]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[o]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[o]={type:"m4",value:c.toArray()}:t.uniforms[o]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const o in this.extensions)this.extensions[o]===!0&&(r[o]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class LC extends er{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class IC extends ia{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=VR,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class UC extends ia{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Kc=new ie,qc=new ds,Vi=new ie;class CS extends kn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new on,this.projectionMatrix=new on,this.projectionMatrixInverse=new on,this.coordinateSystem=Yi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Kc,qc,Vi),Vi.x===1&&Vi.y===1&&Vi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kc,qc,Vi.set(1,1,1)).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorld.decompose(Kc,qc,Vi),Vi.x===1&&Vi.y===1&&Vi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Kc,qc,Vi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const ns=new ie,Jv=new ft,e_=new ft;class hi extends CS{constructor(e=50,t=1,r=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=wp*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(lu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return wp*2*Math.atan(Math.tan(lu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,t){return this.getViewBounds(e,Jv,e_),t.subVectors(e_,Jv)}setViewOffset(e,t,r,o,a,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=o,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(lu*.5*this.fov)/this.zoom,r=2*t,o=this.aspect*r,a=-.5*o;const c=this.view;if(this.view!==null&&this.view.enabled){const h=c.fullWidth,d=c.fullHeight;a+=c.offsetX*o/h,t-=c.offsetY*r/d,o*=c.width/h,r*=c.height/d}const f=this.filmOffset;f!==0&&(a+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+o,t,t-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class PS extends CS{constructor(e=-1,t=1,r=1,o=-1,a=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=o,this.near=a,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,o,a,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=o,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let a=r-e,c=r+e,f=o+t,h=o-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,v=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=d*this.view.offsetX,c=a+d*this.view.width,f-=v*this.view.offsetY,h=f-v*this.view.height}this.projectionMatrix.makeOrthographic(a,c,f,h,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Oo=-90,ko=1;class FC extends kn{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new hi(Oo,ko,e,t);o.layers=this.layers,this.add(o);const a=new hi(Oo,ko,e,t);a.layers=this.layers,this.add(a);const c=new hi(Oo,ko,e,t);c.layers=this.layers,this.add(c);const f=new hi(Oo,ko,e,t);f.layers=this.layers,this.add(f);const h=new hi(Oo,ko,e,t);h.layers=this.layers,this.add(h);const d=new hi(Oo,ko,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,o,a,c,f,h]=t;for(const d of t)this.remove(d);if(e===Yi)r.up.set(0,1,0),r.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===Mu)r.up.set(0,-1,0),r.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,c,f,h,d,v]=this.children,g=e.getRenderTarget(),m=e.getActiveCubeFace(),_=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const E=r.texture.generateMipmaps;r.texture.generateMipmaps=!1;let y=!1;e.isWebGLRenderer===!0?y=e.state.buffers.depth.getReversed():y=e.reversedDepthBuffer,e.setRenderTarget(r,0,o),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(r,1,o),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(r,2,o),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,f),e.setRenderTarget(r,3,o),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(r,4,o),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,d),r.texture.generateMipmaps=E,e.setRenderTarget(r,5,o),y&&e.autoClear===!1&&e.clearDepth(),e.render(t,v),e.setRenderTarget(g,m,_),e.xr.enabled=M,r.texture.needsPMREMUpdate=!0}}class OC extends hi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class t_{constructor(e=1,t=0,r=0){this.radius=e,this.phi=t,this.theta=r}set(e,t,r){return this.radius=e,this.phi=t,this.theta=r,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Et(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,r){return this.radius=Math.sqrt(e*e+t*t+r*r),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,r),this.phi=Math.acos(Et(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Mm=class Mm{constructor(e,t,r,o){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,r,o)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let r=0;r<4;r++)this.elements[r]=e[r+t];return this}set(e,t,r,o){const a=this.elements;return a[0]=e,a[2]=t,a[1]=r,a[3]=o,this}};Mm.prototype.isMatrix2=!0;let n_=Mm;class kC extends ms{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){ot("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function i_(n,e,t,r){const o=zC(r);switch(t){case dS:return n*e;case pS:return n*e/o.components*o.byteLength;case um:return n*e/o.components*o.byteLength;case Hs:return n*e*2/o.components*o.byteLength;case fm:return n*e*2/o.components*o.byteLength;case hS:return n*e*3/o.components*o.byteLength;case Ci:return n*e*4/o.components*o.byteLength;case dm:return n*e*4/o.components*o.byteLength;case ru:case su:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case ou:case au:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $h:case Kh:return Math.max(n,16)*Math.max(e,8)/4;case Xh:case Yh:return Math.max(n,8)*Math.max(e,8)/2;case qh:case Zh:case Jh:case ep:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Qh:case _u:case tp:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case np:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ip:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case rp:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case sp:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case op:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case ap:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case lp:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case cp:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case up:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case fp:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case dp:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case hp:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case pp:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case mp:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case gp:case vp:case _p:return Math.ceil(n/4)*Math.ceil(e/4)*16;case xp:case yp:return Math.ceil(n/4)*Math.ceil(e/4)*8;case xu:case Sp:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zC(n){switch(n){case pi:case lS:return{byteLength:1,components:1};case ol:case cS:case Tr:return{byteLength:2,components:1};case lm:case cm:return{byteLength:2,components:4};case Ji:case am:case $i:return{byteLength:4,components:1};case uS:case fS:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:om}}));typeof window<"u"&&(window.__THREE__?ot("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=om);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function DS(){let n=null,e=!1,t=null,r=null;function o(a,c){t(a,c),r=n.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(r=n.requestAnimationFrame(o),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function BC(n){const e=new WeakMap;function t(f,h){const d=f.array,v=f.usage,g=d.byteLength,m=n.createBuffer();n.bindBuffer(h,m),n.bufferData(h,d,v),f.onUploadCallback();let _;if(d instanceof Float32Array)_=n.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)_=n.HALF_FLOAT;else if(d instanceof Uint16Array)f.isFloat16BufferAttribute?_=n.HALF_FLOAT:_=n.UNSIGNED_SHORT;else if(d instanceof Int16Array)_=n.SHORT;else if(d instanceof Uint32Array)_=n.UNSIGNED_INT;else if(d instanceof Int32Array)_=n.INT;else if(d instanceof Int8Array)_=n.BYTE;else if(d instanceof Uint8Array)_=n.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)_=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:m,type:_,bytesPerElement:d.BYTES_PER_ELEMENT,version:f.version,size:g}}function r(f,h,d){const v=h.array,g=h.updateRanges;if(n.bindBuffer(d,f),g.length===0)n.bufferSubData(d,0,v);else{g.sort((_,M)=>_.start-M.start);let m=0;for(let _=1;_<g.length;_++){const M=g[m],E=g[_];E.start<=M.start+M.count+1?M.count=Math.max(M.count,E.start+E.count-M.start):(++m,g[m]=E)}g.length=m+1;for(let _=0,M=g.length;_<M;_++){const E=g[_];n.bufferSubData(d,E.start*v.BYTES_PER_ELEMENT,v,E.start,E.count)}h.clearUpdateRanges()}h.onUploadCallback()}function o(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function a(f){f.isInterleavedBufferAttribute&&(f=f.data);const h=e.get(f);h&&(n.deleteBuffer(h.buffer),e.delete(f))}function c(f,h){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const v=e.get(f);(!v||v.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const d=e.get(f);if(d===void 0)e.set(f,t(f,h));else if(d.version<f.version){if(d.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(d.buffer,f,h),d.version=f.version}}return{get:o,remove:a,update:c}}var VC=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,GC=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,HC=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,WC=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jC=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,XC=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$C=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,YC=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,KC=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,qC=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ZC=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,QC=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,JC=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,eP=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,tP=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,nP=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,iP=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rP=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sP=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,oP=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,aP=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,lP=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,cP=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,uP=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fP=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,dP=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,hP=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,pP=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mP=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gP=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vP="gl_FragColor = linearToOutputTexel( gl_FragColor );",_P=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xP=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,yP=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,SP=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,MP=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,EP=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,wP=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bP=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,TP=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,AP=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,RP=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,CP=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,PP=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,DP=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,NP=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,LP=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,IP=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,UP=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,FP=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,OP=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kP=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zP=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,BP=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,VP=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,GP=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,HP=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,WP=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jP=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,XP=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$P=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,YP=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,KP=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qP=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ZP=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,QP=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,JP=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,e2=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,t2=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,n2=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,i2=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,r2=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,s2=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,o2=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,a2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,l2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,c2=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,u2=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,f2=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,d2=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,h2=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,p2=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,m2=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,g2=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,v2=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_2=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,x2=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,y2=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,S2=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,M2=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,E2=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,w2=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,b2=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,T2=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,A2=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,R2=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,C2=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,P2=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,D2=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,N2=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,L2=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,I2=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,U2=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,F2=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,O2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,k2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,z2=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,B2=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const V2=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,G2=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,W2=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,j2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,X2=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$2=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Y2=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,K2=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,q2=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Z2=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Q2=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,J2=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e3=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,t3=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,n3=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i3=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r3=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s3=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,o3=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a3=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,l3=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,c3=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u3=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f3=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,d3=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h3=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p3=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m3=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,g3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,v3=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_3=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,x3=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y3=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_t={alphahash_fragment:VC,alphahash_pars_fragment:GC,alphamap_fragment:HC,alphamap_pars_fragment:WC,alphatest_fragment:jC,alphatest_pars_fragment:XC,aomap_fragment:$C,aomap_pars_fragment:YC,batching_pars_vertex:KC,batching_vertex:qC,begin_vertex:ZC,beginnormal_vertex:QC,bsdfs:JC,iridescence_fragment:eP,bumpmap_pars_fragment:tP,clipping_planes_fragment:nP,clipping_planes_pars_fragment:iP,clipping_planes_pars_vertex:rP,clipping_planes_vertex:sP,color_fragment:oP,color_pars_fragment:aP,color_pars_vertex:lP,color_vertex:cP,common:uP,cube_uv_reflection_fragment:fP,defaultnormal_vertex:dP,displacementmap_pars_vertex:hP,displacementmap_vertex:pP,emissivemap_fragment:mP,emissivemap_pars_fragment:gP,colorspace_fragment:vP,colorspace_pars_fragment:_P,envmap_fragment:xP,envmap_common_pars_fragment:yP,envmap_pars_fragment:SP,envmap_pars_vertex:MP,envmap_physical_pars_fragment:LP,envmap_vertex:EP,fog_vertex:wP,fog_pars_vertex:bP,fog_fragment:TP,fog_pars_fragment:AP,gradientmap_pars_fragment:RP,lightmap_pars_fragment:CP,lights_lambert_fragment:PP,lights_lambert_pars_fragment:DP,lights_pars_begin:NP,lights_toon_fragment:IP,lights_toon_pars_fragment:UP,lights_phong_fragment:FP,lights_phong_pars_fragment:OP,lights_physical_fragment:kP,lights_physical_pars_fragment:zP,lights_fragment_begin:BP,lights_fragment_maps:VP,lights_fragment_end:GP,lightprobes_pars_fragment:HP,logdepthbuf_fragment:WP,logdepthbuf_pars_fragment:jP,logdepthbuf_pars_vertex:XP,logdepthbuf_vertex:$P,map_fragment:YP,map_pars_fragment:KP,map_particle_fragment:qP,map_particle_pars_fragment:ZP,metalnessmap_fragment:QP,metalnessmap_pars_fragment:JP,morphinstance_vertex:e2,morphcolor_vertex:t2,morphnormal_vertex:n2,morphtarget_pars_vertex:i2,morphtarget_vertex:r2,normal_fragment_begin:s2,normal_fragment_maps:o2,normal_pars_fragment:a2,normal_pars_vertex:l2,normal_vertex:c2,normalmap_pars_fragment:u2,clearcoat_normal_fragment_begin:f2,clearcoat_normal_fragment_maps:d2,clearcoat_pars_fragment:h2,iridescence_pars_fragment:p2,opaque_fragment:m2,packing:g2,premultiplied_alpha_fragment:v2,project_vertex:_2,dithering_fragment:x2,dithering_pars_fragment:y2,roughnessmap_fragment:S2,roughnessmap_pars_fragment:M2,shadowmap_pars_fragment:E2,shadowmap_pars_vertex:w2,shadowmap_vertex:b2,shadowmask_pars_fragment:T2,skinbase_vertex:A2,skinning_pars_vertex:R2,skinning_vertex:C2,skinnormal_vertex:P2,specularmap_fragment:D2,specularmap_pars_fragment:N2,tonemapping_fragment:L2,tonemapping_pars_fragment:I2,transmission_fragment:U2,transmission_pars_fragment:F2,uv_pars_fragment:O2,uv_pars_vertex:k2,uv_vertex:z2,worldpos_vertex:B2,background_vert:V2,background_frag:G2,backgroundCube_vert:H2,backgroundCube_frag:W2,cube_vert:j2,cube_frag:X2,depth_vert:$2,depth_frag:Y2,distance_vert:K2,distance_frag:q2,equirect_vert:Z2,equirect_frag:Q2,linedashed_vert:J2,linedashed_frag:e3,meshbasic_vert:t3,meshbasic_frag:n3,meshlambert_vert:i3,meshlambert_frag:r3,meshmatcap_vert:s3,meshmatcap_frag:o3,meshnormal_vert:a3,meshnormal_frag:l3,meshphong_vert:c3,meshphong_frag:u3,meshphysical_vert:f3,meshphysical_frag:d3,meshtoon_vert:h3,meshtoon_frag:p3,points_vert:m3,points_frag:g3,shadow_vert:v3,shadow_frag:_3,sprite_vert:x3,sprite_frag:y3},ze={common:{diffuse:{value:new Lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new vt}},envmap:{envMap:{value:null},envMapRotation:{value:new vt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new vt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new ie},probesMax:{value:new ie},probesResolution:{value:new ie}},points:{diffuse:{value:new Lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0},uvTransform:{value:new vt}},sprite:{diffuse:{value:new Lt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new vt},alphaMap:{value:null},alphaMapTransform:{value:new vt},alphaTest:{value:0}}},Hi={basic:{uniforms:On([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:On([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new Lt(0)},envMapIntensity:{value:1}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:On([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new Lt(0)},specular:{value:new Lt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:On([ze.common,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.roughnessmap,ze.metalnessmap,ze.fog,ze.lights,{emissive:{value:new Lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:On([ze.common,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.gradientmap,ze.fog,ze.lights,{emissive:{value:new Lt(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:On([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:On([ze.points,ze.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:On([ze.common,ze.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:On([ze.common,ze.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:On([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:On([ze.sprite,ze.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new vt}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distance:{uniforms:On([ze.common,ze.displacementmap,{referencePosition:{value:new ie},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distance_vert,fragmentShader:_t.distance_frag},shadow:{uniforms:On([ze.lights,ze.fog,{color:{value:new Lt(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};Hi.physical={uniforms:On([Hi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new vt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new vt},sheen:{value:0},sheenColor:{value:new Lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new vt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new vt},attenuationDistance:{value:0},attenuationColor:{value:new Lt(0)},specularColor:{value:new Lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new vt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new vt}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};const Zc={r:0,b:0,g:0},S3=new on,NS=new vt;NS.set(-1,0,0,0,1,0,0,0,1);function M3(n,e,t,r,o,a){const c=new Lt(0);let f=o===!0?0:1,h,d,v=null,g=0,m=null;function _(T){let N=T.isScene===!0?T.background:null;if(N&&N.isTexture){const C=T.backgroundBlurriness>0;N=e.get(N,C)}return N}function M(T){let N=!1;const C=_(T);C===null?y(c,f):C&&C.isColor&&(y(C,1),N=!0);const k=n.xr.getEnvironmentBlendMode();k==="additive"?t.buffers.color.setClear(0,0,0,1,a):k==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(n.autoClear||N)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function E(T,N){const C=_(N);C&&(C.isCubeTexture||C.mapping===Gu)?(d===void 0&&(d=new Rr(new dl(1,1,1),new er({name:"BackgroundCubeMaterial",uniforms:Zo(Hi.backgroundCube.uniforms),vertexShader:Hi.backgroundCube.vertexShader,fragmentShader:Hi.backgroundCube.fragmentShader,side:Kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(k,I,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),d.material.uniforms.envMap.value=C,d.material.uniforms.backgroundBlurriness.value=N.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(S3.makeRotationFromEuler(N.backgroundRotation)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===!1&&d.material.uniforms.backgroundRotation.value.premultiply(NS),d.material.toneMapped=bt.getTransfer(C.colorSpace)!==kt,(v!==C||g!==C.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,v=C,g=C.version,m=n.toneMapping),d.layers.enableAll(),T.unshift(d,d.geometry,d.material,0,0,null)):C&&C.isTexture&&(h===void 0&&(h=new Rr(new Wu(2,2),new er({name:"BackgroundMaterial",uniforms:Zo(Hi.background.uniforms),vertexShader:Hi.background.vertexShader,fragmentShader:Hi.background.fragmentShader,side:fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(h)),h.material.uniforms.t2D.value=C,h.material.uniforms.backgroundIntensity.value=N.backgroundIntensity,h.material.toneMapped=bt.getTransfer(C.colorSpace)!==kt,C.matrixAutoUpdate===!0&&C.updateMatrix(),h.material.uniforms.uvTransform.value.copy(C.matrix),(v!==C||g!==C.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,v=C,g=C.version,m=n.toneMapping),h.layers.enableAll(),T.unshift(h,h.geometry,h.material,0,0,null))}function y(T,N){T.getRGB(Zc,RS(n)),t.buffers.color.setClear(Zc.r,Zc.g,Zc.b,N,a)}function x(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0)}return{getClearColor:function(){return c},setClearColor:function(T,N=1){c.set(T),f=N,y(c,f)},getClearAlpha:function(){return f},setClearAlpha:function(T){f=T,y(c,f)},render:M,addToRenderList:E,dispose:x}}function E3(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),r={},o=m(null);let a=o,c=!1;function f(B,Z,ne,ce,G){let Y=!1;const j=g(B,ce,ne,Z);a!==j&&(a=j,d(a.object)),Y=_(B,ce,ne,G),Y&&M(B,ce,ne,G),G!==null&&e.update(G,n.ELEMENT_ARRAY_BUFFER),(Y||c)&&(c=!1,C(B,Z,ne,ce),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function h(){return n.createVertexArray()}function d(B){return n.bindVertexArray(B)}function v(B){return n.deleteVertexArray(B)}function g(B,Z,ne,ce){const G=ce.wireframe===!0;let Y=r[Z.id];Y===void 0&&(Y={},r[Z.id]=Y);const j=B.isInstancedMesh===!0?B.id:0;let W=Y[j];W===void 0&&(W={},Y[j]=W);let z=W[ne.id];z===void 0&&(z={},W[ne.id]=z);let $=z[G];return $===void 0&&($=m(h()),z[G]=$),$}function m(B){const Z=[],ne=[],ce=[];for(let G=0;G<t;G++)Z[G]=0,ne[G]=0,ce[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:Z,enabledAttributes:ne,attributeDivisors:ce,object:B,attributes:{},index:null}}function _(B,Z,ne,ce){const G=a.attributes,Y=Z.attributes;let j=0;const W=ne.getAttributes();for(const z in W)if(W[z].location>=0){const P=G[z];let V=Y[z];if(V===void 0&&(z==="instanceMatrix"&&B.instanceMatrix&&(V=B.instanceMatrix),z==="instanceColor"&&B.instanceColor&&(V=B.instanceColor)),P===void 0||P.attribute!==V||V&&P.data!==V.data)return!0;j++}return a.attributesNum!==j||a.index!==ce}function M(B,Z,ne,ce){const G={},Y=Z.attributes;let j=0;const W=ne.getAttributes();for(const z in W)if(W[z].location>=0){let P=Y[z];P===void 0&&(z==="instanceMatrix"&&B.instanceMatrix&&(P=B.instanceMatrix),z==="instanceColor"&&B.instanceColor&&(P=B.instanceColor));const V={};V.attribute=P,P&&P.data&&(V.data=P.data),G[z]=V,j++}a.attributes=G,a.attributesNum=j,a.index=ce}function E(){const B=a.newAttributes;for(let Z=0,ne=B.length;Z<ne;Z++)B[Z]=0}function y(B){x(B,0)}function x(B,Z){const ne=a.newAttributes,ce=a.enabledAttributes,G=a.attributeDivisors;ne[B]=1,ce[B]===0&&(n.enableVertexAttribArray(B),ce[B]=1),G[B]!==Z&&(n.vertexAttribDivisor(B,Z),G[B]=Z)}function T(){const B=a.newAttributes,Z=a.enabledAttributes;for(let ne=0,ce=Z.length;ne<ce;ne++)Z[ne]!==B[ne]&&(n.disableVertexAttribArray(ne),Z[ne]=0)}function N(B,Z,ne,ce,G,Y,j){j===!0?n.vertexAttribIPointer(B,Z,ne,G,Y):n.vertexAttribPointer(B,Z,ne,ce,G,Y)}function C(B,Z,ne,ce){E();const G=ce.attributes,Y=ne.getAttributes(),j=Z.defaultAttributeValues;for(const W in Y){const z=Y[W];if(z.location>=0){let $=G[W];if($===void 0&&(W==="instanceMatrix"&&B.instanceMatrix&&($=B.instanceMatrix),W==="instanceColor"&&B.instanceColor&&($=B.instanceColor)),$!==void 0){const P=$.normalized,V=$.itemSize,ge=e.get($);if(ge===void 0)continue;const ye=ge.buffer,Se=ge.type,te=ge.bytesPerElement,he=Se===n.INT||Se===n.UNSIGNED_INT||$.gpuType===am;if($.isInterleavedBufferAttribute){const pe=$.data,oe=pe.stride,Ae=$.offset;if(pe.isInstancedInterleavedBuffer){for(let Te=0;Te<z.locationSize;Te++)x(z.location+Te,pe.meshPerAttribute);B.isInstancedMesh!==!0&&ce._maxInstanceCount===void 0&&(ce._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let Te=0;Te<z.locationSize;Te++)y(z.location+Te);n.bindBuffer(n.ARRAY_BUFFER,ye);for(let Te=0;Te<z.locationSize;Te++)N(z.location+Te,V/z.locationSize,Se,P,oe*te,(Ae+V/z.locationSize*Te)*te,he)}else{if($.isInstancedBufferAttribute){for(let pe=0;pe<z.locationSize;pe++)x(z.location+pe,$.meshPerAttribute);B.isInstancedMesh!==!0&&ce._maxInstanceCount===void 0&&(ce._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let pe=0;pe<z.locationSize;pe++)y(z.location+pe);n.bindBuffer(n.ARRAY_BUFFER,ye);for(let pe=0;pe<z.locationSize;pe++)N(z.location+pe,V/z.locationSize,Se,P,V*te,V/z.locationSize*pe*te,he)}}else if(j!==void 0){const P=j[W];if(P!==void 0)switch(P.length){case 2:n.vertexAttrib2fv(z.location,P);break;case 3:n.vertexAttrib3fv(z.location,P);break;case 4:n.vertexAttrib4fv(z.location,P);break;default:n.vertexAttrib1fv(z.location,P)}}}}T()}function k(){O();for(const B in r){const Z=r[B];for(const ne in Z){const ce=Z[ne];for(const G in ce){const Y=ce[G];for(const j in Y)v(Y[j].object),delete Y[j];delete ce[G]}}delete r[B]}}function I(B){if(r[B.id]===void 0)return;const Z=r[B.id];for(const ne in Z){const ce=Z[ne];for(const G in ce){const Y=ce[G];for(const j in Y)v(Y[j].object),delete Y[j];delete ce[G]}}delete r[B.id]}function F(B){for(const Z in r){const ne=r[Z];for(const ce in ne){const G=ne[ce];if(G[B.id]===void 0)continue;const Y=G[B.id];for(const j in Y)v(Y[j].object),delete Y[j];delete G[B.id]}}}function b(B){for(const Z in r){const ne=r[Z],ce=B.isInstancedMesh===!0?B.id:0,G=ne[ce];if(G!==void 0){for(const Y in G){const j=G[Y];for(const W in j)v(j[W].object),delete j[W];delete G[Y]}delete ne[ce],Object.keys(ne).length===0&&delete r[Z]}}}function O(){X(),c=!0,a!==o&&(a=o,d(a.object))}function X(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:f,reset:O,resetDefaultState:X,dispose:k,releaseStatesOfGeometry:I,releaseStatesOfObject:b,releaseStatesOfProgram:F,initAttributes:E,enableAttribute:y,disableUnusedAttributes:T}}function w3(n,e,t){let r;function o(h){r=h}function a(h,d){n.drawArrays(r,h,d),t.update(d,r,1)}function c(h,d,v){v!==0&&(n.drawArraysInstanced(r,h,d,v),t.update(d,r,v))}function f(h,d,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,h,0,d,0,v);let m=0;for(let _=0;_<v;_++)m+=d[_];t.update(m,r,1)}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=f}function b3(n,e,t,r){let o;function a(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");o=n.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function c(F){return!(F!==Ci&&r.convert(F)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(F){const b=F===Tr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==pi&&r.convert(F)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==$i&&!b)}function h(F){if(F==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const v=h(d);v!==d&&(ot("WebGLRenderer:",d,"not supported, using",v,"instead."),d=v);const g=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&m===!1&&ot("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const _=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=n.getParameter(n.MAX_TEXTURE_SIZE),y=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),x=n.getParameter(n.MAX_VERTEX_ATTRIBS),T=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),N=n.getParameter(n.MAX_VARYING_VECTORS),C=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),k=n.getParameter(n.MAX_SAMPLES),I=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:h,textureFormatReadable:c,textureTypeReadable:f,precision:d,logarithmicDepthBuffer:g,reversedDepthBuffer:m,maxTextures:_,maxVertexTextures:M,maxTextureSize:E,maxCubemapSize:y,maxAttributes:x,maxVertexUniforms:T,maxVaryings:N,maxFragmentUniforms:C,maxSamples:k,samples:I}}function T3(n){const e=this;let t=null,r=0,o=!1,a=!1;const c=new rs,f=new vt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(g,m){const _=g.length!==0||m||r!==0||o;return o=m,r=g.length,_},this.beginShadows=function(){a=!0,v(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(g,m){t=v(g,m,0)},this.setState=function(g,m,_){const M=g.clippingPlanes,E=g.clipIntersection,y=g.clipShadows,x=n.get(g);if(!o||M===null||M.length===0||a&&!y)a?v(null):d();else{const T=a?0:r,N=T*4;let C=x.clippingState||null;h.value=C,C=v(M,m,N,_);for(let k=0;k!==N;++k)C[k]=t[k];x.clippingState=C,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=T}};function d(){h.value!==t&&(h.value=t,h.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function v(g,m,_,M){const E=g!==null?g.length:0;let y=null;if(E!==0){if(y=h.value,M!==!0||y===null){const x=_+E*4,T=m.matrixWorldInverse;f.getNormalMatrix(T),(y===null||y.length<x)&&(y=new Float32Array(x));for(let N=0,C=_;N!==E;++N,C+=4)c.copy(g[N]).applyMatrix4(T,f),c.normal.toArray(y,C),y[C+3]=c.constant}h.value=y,h.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,y}}const os=4,r_=[.125,.215,.35,.446,.526,.582],ks=20,A3=256,Za=new PS,s_=new Lt;let mh=null,gh=0,vh=0,_h=!1;const R3=new ie;class o_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,r=.1,o=100,a={}){const{size:c=256,position:f=R3}=a;mh=this._renderer.getRenderTarget(),gh=this._renderer.getActiveCubeFace(),vh=this._renderer.getActiveMipmapLevel(),_h=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const h=this._allocateTargets();return h.depthBuffer=!0,this._sceneToCubeUV(e,r,o,h,f),t>0&&this._blur(h,0,0,t),this._applyPMREM(h),this._cleanup(h),h}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=c_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=l_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(mh,gh,vh),this._renderer.xr.enabled=_h,e.scissorTest=!1,zo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gs||e.mapping===Ko?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mh=this._renderer.getRenderTarget(),gh=this._renderer.getActiveCubeFace(),vh=this._renderer.getActiveMipmapLevel(),_h=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Dn,minFilter:Dn,generateMipmaps:!1,type:Tr,format:Ci,colorSpace:yu,depthBuffer:!1},o=a_(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=a_(e,t,r);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=C3(a)),this._blurMaterial=D3(a,e,t),this._ggxMaterial=P3(a,e,t)}return o}_compileMaterial(e){const t=new Rr(new vi,e);this._renderer.compile(t,Za)}_sceneToCubeUV(e,t,r,o,a){const h=new hi(90,1,t,r),d=[1,-1,1,1,1,1],v=[1,1,1,-1,-1,-1],g=this._renderer,m=g.autoClear,_=g.toneMapping;g.getClearColor(s_),g.toneMapping=qi,g.autoClear=!1,g.state.buffers.depth.getReversed()&&(g.setRenderTarget(o),g.clearDepth(),g.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Rr(new dl,new ES({name:"PMREM.Background",side:Kn,depthWrite:!1,depthTest:!1})));const E=this._backgroundBox,y=E.material;let x=!1;const T=e.background;T?T.isColor&&(y.color.copy(T),e.background=null,x=!0):(y.color.copy(s_),x=!0);for(let N=0;N<6;N++){const C=N%3;C===0?(h.up.set(0,d[N],0),h.position.set(a.x,a.y,a.z),h.lookAt(a.x+v[N],a.y,a.z)):C===1?(h.up.set(0,0,d[N]),h.position.set(a.x,a.y,a.z),h.lookAt(a.x,a.y+v[N],a.z)):(h.up.set(0,d[N],0),h.position.set(a.x,a.y,a.z),h.lookAt(a.x,a.y,a.z+v[N]));const k=this._cubeSize;zo(o,C*k,N>2?k:0,k,k),g.setRenderTarget(o),x&&g.render(E,h),g.render(e,h)}g.toneMapping=_,g.autoClear=m,e.background=T}_textureToCubeUV(e,t){const r=this._renderer,o=e.mapping===Gs||e.mapping===Ko;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=c_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=l_());const a=o?this._cubemapMaterial:this._equirectMaterial,c=this._lodMeshes[0];c.material=a;const f=a.uniforms;f.envMap.value=e;const h=this._cubeSize;zo(t,0,0,3*h,2*h),r.setRenderTarget(t),r.render(c,Za)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const o=this._lodMeshes.length;for(let a=1;a<o;a++)this._applyGGXFilter(e,a-1,a);t.autoClear=r}_applyGGXFilter(e,t,r){const o=this._renderer,a=this._pingPongRenderTarget,c=this._ggxMaterial,f=this._lodMeshes[r];f.material=c;const h=c.uniforms,d=r/(this._lodMeshes.length-1),v=t/(this._lodMeshes.length-1),g=Math.sqrt(d*d-v*v),m=0+d*1.25,_=g*m,{_lodMax:M}=this,E=this._sizeLods[r],y=3*E*(r>M-os?r-M+os:0),x=4*(this._cubeSize-E);h.envMap.value=e.texture,h.roughness.value=_,h.mipInt.value=M-t,zo(a,y,x,3*E,2*E),o.setRenderTarget(a),o.render(f,Za),h.envMap.value=a.texture,h.roughness.value=0,h.mipInt.value=M-r,zo(e,y,x,3*E,2*E),o.setRenderTarget(e),o.render(f,Za)}_blur(e,t,r,o,a){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,r,o,"latitudinal",a),this._halfBlur(c,e,r,r,o,"longitudinal",a)}_halfBlur(e,t,r,o,a,c,f){const h=this._renderer,d=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&At("blur direction must be either latitudinal or longitudinal!");const v=3,g=this._lodMeshes[o];g.material=d;const m=d.uniforms,_=this._sizeLods[r]-1,M=isFinite(a)?Math.PI/(2*_):2*Math.PI/(2*ks-1),E=a/M,y=isFinite(a)?1+Math.floor(v*E):ks;y>ks&&ot(`sigmaRadians, ${a}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${ks}`);const x=[];let T=0;for(let F=0;F<ks;++F){const b=F/E,O=Math.exp(-b*b/2);x.push(O),F===0?T+=O:F<y&&(T+=2*O)}for(let F=0;F<x.length;F++)x[F]=x[F]/T;m.envMap.value=e.texture,m.samples.value=y,m.weights.value=x,m.latitudinal.value=c==="latitudinal",f&&(m.poleAxis.value=f);const{_lodMax:N}=this;m.dTheta.value=M,m.mipInt.value=N-r;const C=this._sizeLods[o],k=3*C*(o>N-os?o-N+os:0),I=4*(this._cubeSize-C);zo(t,k,I,3*C,2*C),h.setRenderTarget(t),h.render(g,Za)}}function C3(n){const e=[],t=[],r=[];let o=n;const a=n-os+1+r_.length;for(let c=0;c<a;c++){const f=Math.pow(2,o);e.push(f);let h=1/f;c>n-os?h=r_[c-n+os-1]:c===0&&(h=0),t.push(h);const d=1/(f-2),v=-d,g=1+d,m=[v,v,g,v,g,g,v,v,g,g,v,g],_=6,M=6,E=3,y=2,x=1,T=new Float32Array(E*M*_),N=new Float32Array(y*M*_),C=new Float32Array(x*M*_);for(let I=0;I<_;I++){const F=I%3*2/3-1,b=I>2?0:-1,O=[F,b,0,F+2/3,b,0,F+2/3,b+1,0,F,b,0,F+2/3,b+1,0,F,b+1,0];T.set(O,E*M*I),N.set(m,y*M*I);const X=[I,I,I,I,I,I];C.set(X,x*M*I)}const k=new vi;k.setAttribute("position",new Pi(T,E)),k.setAttribute("uv",new Pi(N,y)),k.setAttribute("faceIndex",new Pi(C,x)),r.push(new Rr(k,null)),o>os&&o--}return{lodMeshes:r,sizeLods:e,sigmas:t}}function a_(n,e,t){const r=new Zi(n,e,t);return r.texture.mapping=Gu,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function zo(n,e,t,r,o){n.viewport.set(e,t,r,o),n.scissor.set(e,t,r,o)}function P3(n,e,t){return new er({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:A3,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ju(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function D3(n,e,t){const r=new Float32Array(ks),o=new ie(0,1,0);return new er({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:ju(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function l_(){return new er({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ju(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function c_(){return new er({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ju(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Sr,depthTest:!1,depthWrite:!1})}function ju(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class LS extends Zi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},o=[r,r,r,r,r,r];this.texture=new TS(o),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},o=new dl(5,5,5),a=new er({name:"CubemapFromEquirect",uniforms:Zo(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Kn,blending:Sr});a.uniforms.tEquirect.value=t;const c=new Rr(o,a),f=t.minFilter;return t.minFilter===zs&&(t.minFilter=Dn),new FC(1,10,this).update(e,c),t.minFilter=f,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,r=!0,o=!0){const a=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,r,o);e.setRenderTarget(a)}}function N3(n){let e=new WeakMap,t=new WeakMap,r=null;function o(m,_=!1){return m==null?null:_?c(m):a(m)}function a(m){if(m&&m.isTexture){const _=m.mapping;if(_===Vd||_===Gd)if(e.has(m)){const M=e.get(m).texture;return f(M,m.mapping)}else{const M=m.image;if(M&&M.height>0){const E=new LS(M.height);return E.fromEquirectangularTexture(n,m),e.set(m,E),m.addEventListener("dispose",d),f(E.texture,m.mapping)}else return null}}return m}function c(m){if(m&&m.isTexture){const _=m.mapping,M=_===Vd||_===Gd,E=_===Gs||_===Ko;if(M||E){let y=t.get(m);const x=y!==void 0?y.texture.pmremVersion:0;if(m.isRenderTargetTexture&&m.pmremVersion!==x)return r===null&&(r=new o_(n)),y=M?r.fromEquirectangular(m,y):r.fromCubemap(m,y),y.texture.pmremVersion=m.pmremVersion,t.set(m,y),y.texture;if(y!==void 0)return y.texture;{const T=m.image;return M&&T&&T.height>0||E&&T&&h(T)?(r===null&&(r=new o_(n)),y=M?r.fromEquirectangular(m):r.fromCubemap(m),y.texture.pmremVersion=m.pmremVersion,t.set(m,y),m.addEventListener("dispose",v),y.texture):null}}}return m}function f(m,_){return _===Vd?m.mapping=Gs:_===Gd&&(m.mapping=Ko),m}function h(m){let _=0;const M=6;for(let E=0;E<M;E++)m[E]!==void 0&&_++;return _===M}function d(m){const _=m.target;_.removeEventListener("dispose",d);const M=e.get(_);M!==void 0&&(e.delete(_),M.dispose())}function v(m){const _=m.target;_.removeEventListener("dispose",v);const M=t.get(_);M!==void 0&&(t.delete(_),M.dispose())}function g(){e=new WeakMap,t=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:o,dispose:g}}function L3(n){const e={};function t(r){if(e[r]!==void 0)return e[r];const o=n.getExtension(r);return e[r]=o,o}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const o=t(r);return o===null&&Ep("WebGLRenderer: "+r+" extension not supported."),o}}}function I3(n,e,t,r){const o={},a=new WeakMap;function c(g){const m=g.target;m.index!==null&&e.remove(m.index);for(const M in m.attributes)e.remove(m.attributes[M]);m.removeEventListener("dispose",c),delete o[m.id];const _=a.get(m);_&&(e.remove(_),a.delete(m)),r.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function f(g,m){return o[m.id]===!0||(m.addEventListener("dispose",c),o[m.id]=!0,t.memory.geometries++),m}function h(g){const m=g.attributes;for(const _ in m)e.update(m[_],n.ARRAY_BUFFER)}function d(g){const m=[],_=g.index,M=g.attributes.position;let E=0;if(M===void 0)return;if(_!==null){const T=_.array;E=_.version;for(let N=0,C=T.length;N<C;N+=3){const k=T[N+0],I=T[N+1],F=T[N+2];m.push(k,I,I,F,F,k)}}else{const T=M.array;E=M.version;for(let N=0,C=T.length/3-1;N<C;N+=3){const k=N+0,I=N+1,F=N+2;m.push(k,I,I,F,F,k)}}const y=new(M.count>=65535?yS:xS)(m,1);y.version=E;const x=a.get(g);x&&e.remove(x),a.set(g,y)}function v(g){const m=a.get(g);if(m){const _=g.index;_!==null&&m.version<_.version&&d(g)}else d(g);return a.get(g)}return{get:f,update:h,getWireframeAttribute:v}}function U3(n,e,t){let r;function o(g){r=g}let a,c;function f(g){a=g.type,c=g.bytesPerElement}function h(g,m){n.drawElements(r,m,a,g*c),t.update(m,r,1)}function d(g,m,_){_!==0&&(n.drawElementsInstanced(r,m,a,g*c,_),t.update(m,r,_))}function v(g,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,m,0,a,g,0,_);let E=0;for(let y=0;y<_;y++)E+=m[y];t.update(E,r,1)}this.setMode=o,this.setIndex=f,this.render=h,this.renderInstances=d,this.renderMultiDraw=v}function F3(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(a,c,f){switch(t.calls++,c){case n.TRIANGLES:t.triangles+=f*(a/3);break;case n.LINES:t.lines+=f*(a/2);break;case n.LINE_STRIP:t.lines+=f*(a-1);break;case n.LINE_LOOP:t.lines+=f*a;break;case n.POINTS:t.points+=f*a;break;default:At("WebGLInfo: Unknown draw mode:",c);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:r}}function O3(n,e,t){const r=new WeakMap,o=new sn;function a(c,f,h){const d=c.morphTargetInfluences,v=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,g=v!==void 0?v.length:0;let m=r.get(f);if(m===void 0||m.count!==g){let X=function(){b.dispose(),r.delete(f),f.removeEventListener("dispose",X)};var _=X;m!==void 0&&m.texture.dispose();const M=f.morphAttributes.position!==void 0,E=f.morphAttributes.normal!==void 0,y=f.morphAttributes.color!==void 0,x=f.morphAttributes.position||[],T=f.morphAttributes.normal||[],N=f.morphAttributes.color||[];let C=0;M===!0&&(C=1),E===!0&&(C=2),y===!0&&(C=3);let k=f.attributes.position.count*C,I=1;k>e.maxTextureSize&&(I=Math.ceil(k/e.maxTextureSize),k=e.maxTextureSize);const F=new Float32Array(k*I*4*g),b=new gS(F,k,I,g);b.type=$i,b.needsUpdate=!0;const O=C*4;for(let B=0;B<g;B++){const Z=x[B],ne=T[B],ce=N[B],G=k*I*4*B;for(let Y=0;Y<Z.count;Y++){const j=Y*O;M===!0&&(o.fromBufferAttribute(Z,Y),F[G+j+0]=o.x,F[G+j+1]=o.y,F[G+j+2]=o.z,F[G+j+3]=0),E===!0&&(o.fromBufferAttribute(ne,Y),F[G+j+4]=o.x,F[G+j+5]=o.y,F[G+j+6]=o.z,F[G+j+7]=0),y===!0&&(o.fromBufferAttribute(ce,Y),F[G+j+8]=o.x,F[G+j+9]=o.y,F[G+j+10]=o.z,F[G+j+11]=ce.itemSize===4?o.w:1)}}m={count:g,texture:b,size:new ft(k,I)},r.set(f,m),f.addEventListener("dispose",X)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)h.getUniforms().setValue(n,"morphTexture",c.morphTexture,t);else{let M=0;for(let y=0;y<d.length;y++)M+=d[y];const E=f.morphTargetsRelative?1:1-M;h.getUniforms().setValue(n,"morphTargetBaseInfluence",E),h.getUniforms().setValue(n,"morphTargetInfluences",d)}h.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),h.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}return{update:a}}function k3(n,e,t,r,o){let a=new WeakMap;function c(d){const v=o.render.frame,g=d.geometry,m=e.get(d,g);if(a.get(m)!==v&&(e.update(m),a.set(m,v)),d.isInstancedMesh&&(d.hasEventListener("dispose",h)===!1&&d.addEventListener("dispose",h),a.get(d)!==v&&(t.update(d.instanceMatrix,n.ARRAY_BUFFER),d.instanceColor!==null&&t.update(d.instanceColor,n.ARRAY_BUFFER),a.set(d,v))),d.isSkinnedMesh){const _=d.skeleton;a.get(_)!==v&&(_.update(),a.set(_,v))}return m}function f(){a=new WeakMap}function h(d){const v=d.target;v.removeEventListener("dispose",h),r.releaseStatesOfObject(v),t.remove(v.instanceMatrix),v.instanceColor!==null&&t.remove(v.instanceColor)}return{update:c,dispose:f}}const z3={[eS]:"LINEAR_TONE_MAPPING",[tS]:"REINHARD_TONE_MAPPING",[nS]:"CINEON_TONE_MAPPING",[iS]:"ACES_FILMIC_TONE_MAPPING",[sS]:"AGX_TONE_MAPPING",[oS]:"NEUTRAL_TONE_MAPPING",[rS]:"CUSTOM_TONE_MAPPING"};function B3(n,e,t,r,o){const a=new Zi(e,t,{type:n,depthBuffer:r,stencilBuffer:o,depthTexture:r?new qo(e,t):void 0}),c=new Zi(e,t,{type:Tr,depthBuffer:!1,stencilBuffer:!1}),f=new vi;f.setAttribute("position",new Qi([-1,3,0,-1,-1,0,3,-1,0],3)),f.setAttribute("uv",new Qi([0,2,0,0,2,0],2));const h=new LC({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Rr(f,h),v=new PS(-1,1,1,-1,0,1);let g=null,m=null,_=!1,M,E=null,y=[],x=!1;this.setSize=function(T,N){a.setSize(T,N),c.setSize(T,N);for(let C=0;C<y.length;C++){const k=y[C];k.setSize&&k.setSize(T,N)}},this.setEffects=function(T){y=T,x=y.length>0&&y[0].isRenderPass===!0;const N=a.width,C=a.height;for(let k=0;k<y.length;k++){const I=y[k];I.setSize&&I.setSize(N,C)}},this.begin=function(T,N){if(_||T.toneMapping===qi&&y.length===0)return!1;if(E=N,N!==null){const C=N.width,k=N.height;(a.width!==C||a.height!==k)&&this.setSize(C,k)}return x===!1&&T.setRenderTarget(a),M=T.toneMapping,T.toneMapping=qi,!0},this.hasRenderPass=function(){return x},this.end=function(T,N){T.toneMapping=M,_=!0;let C=a,k=c;for(let I=0;I<y.length;I++){const F=y[I];if(F.enabled!==!1&&(F.render(T,k,C,N),F.needsSwap!==!1)){const b=C;C=k,k=b}}if(g!==T.outputColorSpace||m!==T.toneMapping){g=T.outputColorSpace,m=T.toneMapping,h.defines={},bt.getTransfer(g)===kt&&(h.defines.SRGB_TRANSFER="");const I=z3[m];I&&(h.defines[I]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=C.texture,T.setRenderTarget(E),T.render(d,v),E=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),c.dispose(),f.dispose(),h.dispose()}}const IS=new Nn,bp=new qo(1,1),US=new gS,FS=new oC,OS=new TS,u_=[],f_=[],d_=new Float32Array(16),h_=new Float32Array(9),p_=new Float32Array(4);function ra(n,e,t){const r=n[0];if(r<=0||r>0)return n;const o=e*t;let a=u_[o];if(a===void 0&&(a=new Float32Array(o),u_[o]=a),e!==0){r.toArray(a,0);for(let c=1,f=0;c!==e;++c)f+=t,n[c].toArray(a,f)}return a}function pn(n,e){if(n.length!==e.length)return!1;for(let t=0,r=n.length;t<r;t++)if(n[t]!==e[t])return!1;return!0}function mn(n,e){for(let t=0,r=e.length;t<r;t++)n[t]=e[t]}function Xu(n,e){let t=f_[e];t===void 0&&(t=new Int32Array(e),f_[e]=t);for(let r=0;r!==e;++r)t[r]=n.allocateTextureUnit();return t}function V3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function G3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pn(t,e))return;n.uniform2fv(this.addr,e),mn(t,e)}}function H3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(pn(t,e))return;n.uniform3fv(this.addr,e),mn(t,e)}}function W3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pn(t,e))return;n.uniform4fv(this.addr,e),mn(t,e)}}function j3(n,e){const t=this.cache,r=e.elements;if(r===void 0){if(pn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),mn(t,e)}else{if(pn(t,r))return;p_.set(r),n.uniformMatrix2fv(this.addr,!1,p_),mn(t,r)}}function X3(n,e){const t=this.cache,r=e.elements;if(r===void 0){if(pn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),mn(t,e)}else{if(pn(t,r))return;h_.set(r),n.uniformMatrix3fv(this.addr,!1,h_),mn(t,r)}}function $3(n,e){const t=this.cache,r=e.elements;if(r===void 0){if(pn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),mn(t,e)}else{if(pn(t,r))return;d_.set(r),n.uniformMatrix4fv(this.addr,!1,d_),mn(t,r)}}function Y3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function K3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pn(t,e))return;n.uniform2iv(this.addr,e),mn(t,e)}}function q3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pn(t,e))return;n.uniform3iv(this.addr,e),mn(t,e)}}function Z3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pn(t,e))return;n.uniform4iv(this.addr,e),mn(t,e)}}function Q3(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function J3(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pn(t,e))return;n.uniform2uiv(this.addr,e),mn(t,e)}}function eD(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pn(t,e))return;n.uniform3uiv(this.addr,e),mn(t,e)}}function tD(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pn(t,e))return;n.uniform4uiv(this.addr,e),mn(t,e)}}function nD(n,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(n.uniform1i(this.addr,o),r[0]=o);let a;this.type===n.SAMPLER_2D_SHADOW?(bp.compareFunction=t.isReversedDepthBuffer()?pm:hm,a=bp):a=IS,t.setTexture2D(e||a,o)}function iD(n,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(n.uniform1i(this.addr,o),r[0]=o),t.setTexture3D(e||FS,o)}function rD(n,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(n.uniform1i(this.addr,o),r[0]=o),t.setTextureCube(e||OS,o)}function sD(n,e,t){const r=this.cache,o=t.allocateTextureUnit();r[0]!==o&&(n.uniform1i(this.addr,o),r[0]=o),t.setTexture2DArray(e||US,o)}function oD(n){switch(n){case 5126:return V3;case 35664:return G3;case 35665:return H3;case 35666:return W3;case 35674:return j3;case 35675:return X3;case 35676:return $3;case 5124:case 35670:return Y3;case 35667:case 35671:return K3;case 35668:case 35672:return q3;case 35669:case 35673:return Z3;case 5125:return Q3;case 36294:return J3;case 36295:return eD;case 36296:return tD;case 35678:case 36198:case 36298:case 36306:case 35682:return nD;case 35679:case 36299:case 36307:return iD;case 35680:case 36300:case 36308:case 36293:return rD;case 36289:case 36303:case 36311:case 36292:return sD}}function aD(n,e){n.uniform1fv(this.addr,e)}function lD(n,e){const t=ra(e,this.size,2);n.uniform2fv(this.addr,t)}function cD(n,e){const t=ra(e,this.size,3);n.uniform3fv(this.addr,t)}function uD(n,e){const t=ra(e,this.size,4);n.uniform4fv(this.addr,t)}function fD(n,e){const t=ra(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function dD(n,e){const t=ra(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function hD(n,e){const t=ra(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function pD(n,e){n.uniform1iv(this.addr,e)}function mD(n,e){n.uniform2iv(this.addr,e)}function gD(n,e){n.uniform3iv(this.addr,e)}function vD(n,e){n.uniform4iv(this.addr,e)}function _D(n,e){n.uniform1uiv(this.addr,e)}function xD(n,e){n.uniform2uiv(this.addr,e)}function yD(n,e){n.uniform3uiv(this.addr,e)}function SD(n,e){n.uniform4uiv(this.addr,e)}function MD(n,e,t){const r=this.cache,o=e.length,a=Xu(t,o);pn(r,a)||(n.uniform1iv(this.addr,a),mn(r,a));let c;this.type===n.SAMPLER_2D_SHADOW?c=bp:c=IS;for(let f=0;f!==o;++f)t.setTexture2D(e[f]||c,a[f])}function ED(n,e,t){const r=this.cache,o=e.length,a=Xu(t,o);pn(r,a)||(n.uniform1iv(this.addr,a),mn(r,a));for(let c=0;c!==o;++c)t.setTexture3D(e[c]||FS,a[c])}function wD(n,e,t){const r=this.cache,o=e.length,a=Xu(t,o);pn(r,a)||(n.uniform1iv(this.addr,a),mn(r,a));for(let c=0;c!==o;++c)t.setTextureCube(e[c]||OS,a[c])}function bD(n,e,t){const r=this.cache,o=e.length,a=Xu(t,o);pn(r,a)||(n.uniform1iv(this.addr,a),mn(r,a));for(let c=0;c!==o;++c)t.setTexture2DArray(e[c]||US,a[c])}function TD(n){switch(n){case 5126:return aD;case 35664:return lD;case 35665:return cD;case 35666:return uD;case 35674:return fD;case 35675:return dD;case 35676:return hD;case 5124:case 35670:return pD;case 35667:case 35671:return mD;case 35668:case 35672:return gD;case 35669:case 35673:return vD;case 5125:return _D;case 36294:return xD;case 36295:return yD;case 36296:return SD;case 35678:case 36198:case 36298:case 36306:case 35682:return MD;case 35679:case 36299:case 36307:return ED;case 35680:case 36300:case 36308:case 36293:return wD;case 36289:case 36303:case 36311:case 36292:return bD}}class AD{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=oD(t.type)}}class RD{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=TD(t.type)}}class CD{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const o=this.seq;for(let a=0,c=o.length;a!==c;++a){const f=o[a];f.setValue(e,t[f.id],r)}}}const xh=/(\w+)(\])?(\[|\.)?/g;function m_(n,e){n.seq.push(e),n.map[e.id]=e}function PD(n,e,t){const r=n.name,o=r.length;for(xh.lastIndex=0;;){const a=xh.exec(r),c=xh.lastIndex;let f=a[1];const h=a[2]==="]",d=a[3];if(h&&(f=f|0),d===void 0||d==="["&&c+2===o){m_(t,d===void 0?new AD(f,n,e):new RD(f,n,e));break}else{let g=t.map[f];g===void 0&&(g=new CD(f),m_(t,g)),t=g}}}class cu{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let c=0;c<r;++c){const f=e.getActiveUniform(t,c),h=e.getUniformLocation(t,f.name);PD(f,h,this)}const o=[],a=[];for(const c of this.seq)c.type===e.SAMPLER_2D_SHADOW||c.type===e.SAMPLER_CUBE_SHADOW||c.type===e.SAMPLER_2D_ARRAY_SHADOW?o.push(c):a.push(c);o.length>0&&(this.seq=o.concat(a))}setValue(e,t,r,o){const a=this.map[t];a!==void 0&&a.setValue(e,r,o)}setOptional(e,t,r){const o=t[r];o!==void 0&&this.setValue(e,r,o)}static upload(e,t,r,o){for(let a=0,c=t.length;a!==c;++a){const f=t[a],h=r[f.id];h.needsUpdate!==!1&&f.setValue(e,h.value,o)}}static seqWithValue(e,t){const r=[];for(let o=0,a=e.length;o!==a;++o){const c=e[o];c.id in t&&r.push(c)}return r}}function g_(n,e,t){const r=n.createShader(e);return n.shaderSource(r,t),n.compileShader(r),r}const DD=37297;let ND=0;function LD(n,e){const t=n.split(`
`),r=[],o=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let c=o;c<a;c++){const f=c+1;r.push(`${f===e?">":" "} ${f}: ${t[c]}`)}return r.join(`
`)}const v_=new vt;function ID(n){bt._getMatrix(v_,bt.workingColorSpace,n);const e=`mat3( ${v_.elements.map(t=>t.toFixed(4))} )`;switch(bt.getTransfer(n)){case Su:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return ot("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function __(n,e,t){const r=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(r&&a==="")return"";const c=/ERROR: 0:(\d+)/.exec(a);if(c){const f=parseInt(c[1]);return t.toUpperCase()+`

`+a+`

`+LD(n.getShaderSource(e),f)}else return a}function UD(n,e){const t=ID(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const FD={[eS]:"Linear",[tS]:"Reinhard",[nS]:"Cineon",[iS]:"ACESFilmic",[sS]:"AgX",[oS]:"Neutral",[rS]:"Custom"};function OD(n,e){const t=FD[e];return t===void 0?(ot("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Qc=new ie;function kD(){bt.getLuminanceCoefficients(Qc);const n=Qc.x.toFixed(4),e=Qc.y.toFixed(4),t=Qc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zD(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tl).join(`
`)}function BD(n){const e=[];for(const t in n){const r=n[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function VD(n,e){const t={},r=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let o=0;o<r;o++){const a=n.getActiveAttrib(e,o),c=a.name;let f=1;a.type===n.FLOAT_MAT2&&(f=2),a.type===n.FLOAT_MAT3&&(f=3),a.type===n.FLOAT_MAT4&&(f=4),t[c]={type:a.type,location:n.getAttribLocation(e,c),locationSize:f}}return t}function tl(n){return n!==""}function x_(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function y_(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const GD=/^[ \t]*#include +<([\w\d./]+)>/gm;function Tp(n){return n.replace(GD,WD)}const HD=new Map;function WD(n,e){let t=_t[e];if(t===void 0){const r=HD.get(e);if(r!==void 0)t=_t[r],ot('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return Tp(t)}const jD=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function S_(n){return n.replace(jD,XD)}function XD(n,e,t,r){let o="";for(let a=parseInt(e);a<parseInt(t);a++)o+=r.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return o}function M_(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const $D={[iu]:"SHADOWMAP_TYPE_PCF",[el]:"SHADOWMAP_TYPE_VSM"};function YD(n){return $D[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const KD={[Gs]:"ENVMAP_TYPE_CUBE",[Ko]:"ENVMAP_TYPE_CUBE",[Gu]:"ENVMAP_TYPE_CUBE_UV"};function qD(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":KD[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const ZD={[Ko]:"ENVMAP_MODE_REFRACTION"};function QD(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":ZD[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const JD={[Jy]:"ENVMAP_BLENDING_MULTIPLY",[kR]:"ENVMAP_BLENDING_MIX",[zR]:"ENVMAP_BLENDING_ADD"};function eN(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":JD[n.combine]||"ENVMAP_BLENDING_NONE"}function tN(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function nN(n,e,t,r){const o=n.getContext(),a=t.defines;let c=t.vertexShader,f=t.fragmentShader;const h=YD(t),d=qD(t),v=QD(t),g=eN(t),m=tN(t),_=zD(t),M=BD(a),E=o.createProgram();let y,x,T=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(tl).join(`
`),y.length>0&&(y+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(tl).join(`
`),x.length>0&&(x+=`
`)):(y=[M_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+v:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tl).join(`
`),x=[M_(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+v:"",t.envMap?"#define "+g:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qi?"#define TONE_MAPPING":"",t.toneMapping!==qi?_t.tonemapping_pars_fragment:"",t.toneMapping!==qi?OD("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,UD("linearToOutputTexel",t.outputColorSpace),kD(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(tl).join(`
`)),c=Tp(c),c=x_(c,t),c=y_(c,t),f=Tp(f),f=x_(f,t),f=y_(f,t),c=S_(c),f=S_(f),t.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,y=[_,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,x=["#define varying in",t.glslVersion===Nv?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nv?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const N=T+y+c,C=T+x+f,k=g_(o,o.VERTEX_SHADER,N),I=g_(o,o.FRAGMENT_SHADER,C);o.attachShader(E,k),o.attachShader(E,I),t.index0AttributeName!==void 0?o.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(E,0,"position"),o.linkProgram(E);function F(B){if(n.debug.checkShaderErrors){const Z=o.getProgramInfoLog(E)||"",ne=o.getShaderInfoLog(k)||"",ce=o.getShaderInfoLog(I)||"",G=Z.trim(),Y=ne.trim(),j=ce.trim();let W=!0,z=!0;if(o.getProgramParameter(E,o.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(o,E,k,I);else{const $=__(o,k,"vertex"),P=__(o,I,"fragment");At("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(E,o.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+G+`
`+$+`
`+P)}else G!==""?ot("WebGLProgram: Program Info Log:",G):(Y===""||j==="")&&(z=!1);z&&(B.diagnostics={runnable:W,programLog:G,vertexShader:{log:Y,prefix:y},fragmentShader:{log:j,prefix:x}})}o.deleteShader(k),o.deleteShader(I),b=new cu(o,E),O=VD(o,E)}let b;this.getUniforms=function(){return b===void 0&&F(this),b};let O;this.getAttributes=function(){return O===void 0&&F(this),O};let X=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return X===!1&&(X=o.getProgramParameter(E,DD)),X},this.destroy=function(){r.releaseStatesOfProgram(this),o.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ND++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=k,this.fragmentShader=I,this}let iN=0;class rN{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,o=this._getShaderStage(t),a=this._getShaderStage(r),c=this._getShaderCacheForMaterial(e);return c.has(o)===!1&&(c.add(o),o.usedTimes++),c.has(a)===!1&&(c.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new sN(e),t.set(e,r)),r}}class sN{constructor(e){this.id=iN++,this.code=e,this.usedTimes=0}}function oN(n){return n===Hs||n===_u||n===xu}function aN(n,e,t,r,o,a){const c=new vS,f=new rN,h=new Set,d=[],v=new Map,g=r.logarithmicDepthBuffer;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(b){return h.add(b),b===0?"uv":`uv${b}`}function E(b,O,X,B,Z,ne){const ce=B.fog,G=Z.geometry,Y=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?B.environment:null,j=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap,W=e.get(b.envMap||Y,j),z=W&&W.mapping===Gu?W.image.height:null,$=_[b.type];b.precision!==null&&(m=r.getMaxPrecision(b.precision),m!==b.precision&&ot("WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const P=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,V=P!==void 0?P.length:0;let ge=0;G.morphAttributes.position!==void 0&&(ge=1),G.morphAttributes.normal!==void 0&&(ge=2),G.morphAttributes.color!==void 0&&(ge=3);let ye,Se,te,he;if($){const ht=Hi[$];ye=ht.vertexShader,Se=ht.fragmentShader}else ye=b.vertexShader,Se=b.fragmentShader,f.update(b),te=f.getVertexShaderID(b),he=f.getFragmentShaderID(b);const pe=n.getRenderTarget(),oe=n.state.buffers.depth.getReversed(),Ae=Z.isInstancedMesh===!0,Te=Z.isBatchedMesh===!0,rt=!!b.map,Be=!!b.matcap,Qe=!!W,pt=!!b.aoMap,st=!!b.lightMap,Ct=!!b.bumpMap,wt=!!b.normalMap,Wt=!!b.displacementMap,Q=!!b.emissiveMap,zt=!!b.metalnessMap,ut=!!b.roughnessMap,Pt=b.anisotropy>0,ke=b.clearcoat>0,Bt=b.dispersion>0,U=b.iridescence>0,A=b.sheen>0,re=b.transmission>0,_e=Pt&&!!b.anisotropyMap,Me=ke&&!!b.clearcoatMap,Ce=ke&&!!b.clearcoatNormalMap,Oe=ke&&!!b.clearcoatRoughnessMap,me=U&&!!b.iridescenceMap,xe=U&&!!b.iridescenceThicknessMap,Ve=A&&!!b.sheenColorMap,He=A&&!!b.sheenRoughnessMap,Le=!!b.specularMap,Pe=!!b.specularColorMap,at=!!b.specularIntensityMap,dt=re&&!!b.transmissionMap,xt=re&&!!b.thicknessMap,q=!!b.gradientMap,Ne=!!b.alphaMap,ve=b.alphaTest>0,Ge=!!b.alphaHash,Ue=!!b.extensions;let Ee=qi;b.toneMapped&&(pe===null||pe.isXRRenderTarget===!0)&&(Ee=n.toneMapping);const Ke={shaderID:$,shaderType:b.type,shaderName:b.name,vertexShader:ye,fragmentShader:Se,defines:b.defines,customVertexShaderID:te,customFragmentShaderID:he,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Te,batchingColor:Te&&Z._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&Z.instanceColor!==null,instancingMorph:Ae&&Z.morphTexture!==null,outputColorSpace:pe===null?n.outputColorSpace:pe.isXRRenderTarget===!0?pe.texture.colorSpace:bt.workingColorSpace,alphaToCoverage:!!b.alphaToCoverage,map:rt,matcap:Be,envMap:Qe,envMapMode:Qe&&W.mapping,envMapCubeUVHeight:z,aoMap:pt,lightMap:st,bumpMap:Ct,normalMap:wt,displacementMap:Wt,emissiveMap:Q,normalMapObjectSpace:wt&&b.normalMapType===GR,normalMapTangentSpace:wt&&b.normalMapType===Pv,packedNormalMap:wt&&b.normalMapType===Pv&&oN(b.normalMap.format),metalnessMap:zt,roughnessMap:ut,anisotropy:Pt,anisotropyMap:_e,clearcoat:ke,clearcoatMap:Me,clearcoatNormalMap:Ce,clearcoatRoughnessMap:Oe,dispersion:Bt,iridescence:U,iridescenceMap:me,iridescenceThicknessMap:xe,sheen:A,sheenColorMap:Ve,sheenRoughnessMap:He,specularMap:Le,specularColorMap:Pe,specularIntensityMap:at,transmission:re,transmissionMap:dt,thicknessMap:xt,gradientMap:q,opaque:b.transparent===!1&&b.blending===Wo&&b.alphaToCoverage===!1,alphaMap:Ne,alphaTest:ve,alphaHash:Ge,combine:b.combine,mapUv:rt&&M(b.map.channel),aoMapUv:pt&&M(b.aoMap.channel),lightMapUv:st&&M(b.lightMap.channel),bumpMapUv:Ct&&M(b.bumpMap.channel),normalMapUv:wt&&M(b.normalMap.channel),displacementMapUv:Wt&&M(b.displacementMap.channel),emissiveMapUv:Q&&M(b.emissiveMap.channel),metalnessMapUv:zt&&M(b.metalnessMap.channel),roughnessMapUv:ut&&M(b.roughnessMap.channel),anisotropyMapUv:_e&&M(b.anisotropyMap.channel),clearcoatMapUv:Me&&M(b.clearcoatMap.channel),clearcoatNormalMapUv:Ce&&M(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Oe&&M(b.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&M(b.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&M(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&M(b.sheenColorMap.channel),sheenRoughnessMapUv:He&&M(b.sheenRoughnessMap.channel),specularMapUv:Le&&M(b.specularMap.channel),specularColorMapUv:Pe&&M(b.specularColorMap.channel),specularIntensityMapUv:at&&M(b.specularIntensityMap.channel),transmissionMapUv:dt&&M(b.transmissionMap.channel),thicknessMapUv:xt&&M(b.thicknessMap.channel),alphaMapUv:Ne&&M(b.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(wt||Pt),vertexNormals:!!G.attributes.normal,vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:Z.isPoints===!0&&!!G.attributes.uv&&(rt||Ne),fog:!!ce,useFog:b.fog===!0,fogExp2:!!ce&&ce.isFogExp2,flatShading:b.wireframe===!1&&(b.flatShading===!0||G.attributes.normal===void 0&&wt===!1&&(b.isMeshLambertMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isMeshPhysicalMaterial)),sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:g,reversedDepthBuffer:oe,skinning:Z.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:V,morphTextureStride:ge,numDirLights:O.directional.length,numPointLights:O.point.length,numSpotLights:O.spot.length,numSpotLightMaps:O.spotLightMap.length,numRectAreaLights:O.rectArea.length,numHemiLights:O.hemi.length,numDirLightShadows:O.directionalShadowMap.length,numPointLightShadows:O.pointShadowMap.length,numSpotLightShadows:O.spotShadowMap.length,numSpotLightShadowsWithMaps:O.numSpotLightShadowsWithMaps,numLightProbes:O.numLightProbes,numLightProbeGrids:ne.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&X.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ee,decodeVideoTexture:rt&&b.map.isVideoTexture===!0&&bt.getTransfer(b.map.colorSpace)===kt,decodeVideoTextureEmissive:Q&&b.emissiveMap.isVideoTexture===!0&&bt.getTransfer(b.emissiveMap.colorSpace)===kt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===_r,flipSided:b.side===Kn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Ue&&b.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&b.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Ke.vertexUv1s=h.has(1),Ke.vertexUv2s=h.has(2),Ke.vertexUv3s=h.has(3),h.clear(),Ke}function y(b){const O=[];if(b.shaderID?O.push(b.shaderID):(O.push(b.customVertexShaderID),O.push(b.customFragmentShaderID)),b.defines!==void 0)for(const X in b.defines)O.push(X),O.push(b.defines[X]);return b.isRawShaderMaterial===!1&&(x(O,b),T(O,b),O.push(n.outputColorSpace)),O.push(b.customProgramCacheKey),O.join()}function x(b,O){b.push(O.precision),b.push(O.outputColorSpace),b.push(O.envMapMode),b.push(O.envMapCubeUVHeight),b.push(O.mapUv),b.push(O.alphaMapUv),b.push(O.lightMapUv),b.push(O.aoMapUv),b.push(O.bumpMapUv),b.push(O.normalMapUv),b.push(O.displacementMapUv),b.push(O.emissiveMapUv),b.push(O.metalnessMapUv),b.push(O.roughnessMapUv),b.push(O.anisotropyMapUv),b.push(O.clearcoatMapUv),b.push(O.clearcoatNormalMapUv),b.push(O.clearcoatRoughnessMapUv),b.push(O.iridescenceMapUv),b.push(O.iridescenceThicknessMapUv),b.push(O.sheenColorMapUv),b.push(O.sheenRoughnessMapUv),b.push(O.specularMapUv),b.push(O.specularColorMapUv),b.push(O.specularIntensityMapUv),b.push(O.transmissionMapUv),b.push(O.thicknessMapUv),b.push(O.combine),b.push(O.fogExp2),b.push(O.sizeAttenuation),b.push(O.morphTargetsCount),b.push(O.morphAttributeCount),b.push(O.numDirLights),b.push(O.numPointLights),b.push(O.numSpotLights),b.push(O.numSpotLightMaps),b.push(O.numHemiLights),b.push(O.numRectAreaLights),b.push(O.numDirLightShadows),b.push(O.numPointLightShadows),b.push(O.numSpotLightShadows),b.push(O.numSpotLightShadowsWithMaps),b.push(O.numLightProbes),b.push(O.shadowMapType),b.push(O.toneMapping),b.push(O.numClippingPlanes),b.push(O.numClipIntersection),b.push(O.depthPacking)}function T(b,O){c.disableAll(),O.instancing&&c.enable(0),O.instancingColor&&c.enable(1),O.instancingMorph&&c.enable(2),O.matcap&&c.enable(3),O.envMap&&c.enable(4),O.normalMapObjectSpace&&c.enable(5),O.normalMapTangentSpace&&c.enable(6),O.clearcoat&&c.enable(7),O.iridescence&&c.enable(8),O.alphaTest&&c.enable(9),O.vertexColors&&c.enable(10),O.vertexAlphas&&c.enable(11),O.vertexUv1s&&c.enable(12),O.vertexUv2s&&c.enable(13),O.vertexUv3s&&c.enable(14),O.vertexTangents&&c.enable(15),O.anisotropy&&c.enable(16),O.alphaHash&&c.enable(17),O.batching&&c.enable(18),O.dispersion&&c.enable(19),O.batchingColor&&c.enable(20),O.gradientMap&&c.enable(21),O.packedNormalMap&&c.enable(22),O.vertexNormals&&c.enable(23),b.push(c.mask),c.disableAll(),O.fog&&c.enable(0),O.useFog&&c.enable(1),O.flatShading&&c.enable(2),O.logarithmicDepthBuffer&&c.enable(3),O.reversedDepthBuffer&&c.enable(4),O.skinning&&c.enable(5),O.morphTargets&&c.enable(6),O.morphNormals&&c.enable(7),O.morphColors&&c.enable(8),O.premultipliedAlpha&&c.enable(9),O.shadowMapEnabled&&c.enable(10),O.doubleSided&&c.enable(11),O.flipSided&&c.enable(12),O.useDepthPacking&&c.enable(13),O.dithering&&c.enable(14),O.transmission&&c.enable(15),O.sheen&&c.enable(16),O.opaque&&c.enable(17),O.pointsUvs&&c.enable(18),O.decodeVideoTexture&&c.enable(19),O.decodeVideoTextureEmissive&&c.enable(20),O.alphaToCoverage&&c.enable(21),O.numLightProbeGrids>0&&c.enable(22),b.push(c.mask)}function N(b){const O=_[b.type];let X;if(O){const B=Hi[O];X=PC.clone(B.uniforms)}else X=b.uniforms;return X}function C(b,O){let X=v.get(O);return X!==void 0?++X.usedTimes:(X=new nN(n,O,b,o),d.push(X),v.set(O,X)),X}function k(b){if(--b.usedTimes===0){const O=d.indexOf(b);d[O]=d[d.length-1],d.pop(),v.delete(b.cacheKey),b.destroy()}}function I(b){f.remove(b)}function F(){f.dispose()}return{getParameters:E,getProgramCacheKey:y,getUniforms:N,acquireProgram:C,releaseProgram:k,releaseShaderCache:I,programs:d,dispose:F}}function lN(){let n=new WeakMap;function e(c){return n.has(c)}function t(c){let f=n.get(c);return f===void 0&&(f={},n.set(c,f)),f}function r(c){n.delete(c)}function o(c,f,h){n.get(c)[f]=h}function a(){n=new WeakMap}return{has:e,get:t,remove:r,update:o,dispose:a}}function cN(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function E_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function w_(){const n=[];let e=0;const t=[],r=[],o=[];function a(){e=0,t.length=0,r.length=0,o.length=0}function c(m){let _=0;return m.isInstancedMesh&&(_+=2),m.isSkinnedMesh&&(_+=1),_}function f(m,_,M,E,y,x){let T=n[e];return T===void 0?(T={id:m.id,object:m,geometry:_,material:M,materialVariant:c(m),groupOrder:E,renderOrder:m.renderOrder,z:y,group:x},n[e]=T):(T.id=m.id,T.object=m,T.geometry=_,T.material=M,T.materialVariant=c(m),T.groupOrder=E,T.renderOrder=m.renderOrder,T.z=y,T.group=x),e++,T}function h(m,_,M,E,y,x){const T=f(m,_,M,E,y,x);M.transmission>0?r.push(T):M.transparent===!0?o.push(T):t.push(T)}function d(m,_,M,E,y,x){const T=f(m,_,M,E,y,x);M.transmission>0?r.unshift(T):M.transparent===!0?o.unshift(T):t.unshift(T)}function v(m,_){t.length>1&&t.sort(m||cN),r.length>1&&r.sort(_||E_),o.length>1&&o.sort(_||E_)}function g(){for(let m=e,_=n.length;m<_;m++){const M=n[m];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:r,transparent:o,init:a,push:h,unshift:d,finish:g,sort:v}}function uN(){let n=new WeakMap;function e(r,o){const a=n.get(r);let c;return a===void 0?(c=new w_,n.set(r,[c])):o>=a.length?(c=new w_,a.push(c)):c=a[o],c}function t(){n=new WeakMap}return{get:e,dispose:t}}function fN(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new ie,color:new Lt};break;case"SpotLight":t={position:new ie,direction:new ie,color:new Lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new ie,color:new Lt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new ie,skyColor:new Lt,groundColor:new Lt};break;case"RectAreaLight":t={color:new Lt,position:new ie,halfWidth:new ie,halfHeight:new ie};break}return n[e.id]=t,t}}}function dN(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let hN=0;function pN(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function mN(n){const e=new fN,t=dN(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)r.probe.push(new ie);const o=new ie,a=new on,c=new on;function f(d){let v=0,g=0,m=0;for(let O=0;O<9;O++)r.probe[O].set(0,0,0);let _=0,M=0,E=0,y=0,x=0,T=0,N=0,C=0,k=0,I=0,F=0;d.sort(pN);for(let O=0,X=d.length;O<X;O++){const B=d[O],Z=B.color,ne=B.intensity,ce=B.distance;let G=null;if(B.shadow&&B.shadow.map&&(B.shadow.map.texture.format===Hs?G=B.shadow.map.texture:G=B.shadow.map.depthTexture||B.shadow.map.texture),B.isAmbientLight)v+=Z.r*ne,g+=Z.g*ne,m+=Z.b*ne;else if(B.isLightProbe){for(let Y=0;Y<9;Y++)r.probe[Y].addScaledVector(B.sh.coefficients[Y],ne);F++}else if(B.isDirectionalLight){const Y=e.get(B);if(Y.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const j=B.shadow,W=t.get(B);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,r.directionalShadow[_]=W,r.directionalShadowMap[_]=G,r.directionalShadowMatrix[_]=B.shadow.matrix,T++}r.directional[_]=Y,_++}else if(B.isSpotLight){const Y=e.get(B);Y.position.setFromMatrixPosition(B.matrixWorld),Y.color.copy(Z).multiplyScalar(ne),Y.distance=ce,Y.coneCos=Math.cos(B.angle),Y.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),Y.decay=B.decay,r.spot[E]=Y;const j=B.shadow;if(B.map&&(r.spotLightMap[k]=B.map,k++,j.updateMatrices(B),B.castShadow&&I++),r.spotLightMatrix[E]=j.matrix,B.castShadow){const W=t.get(B);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,r.spotShadow[E]=W,r.spotShadowMap[E]=G,C++}E++}else if(B.isRectAreaLight){const Y=e.get(B);Y.color.copy(Z).multiplyScalar(ne),Y.halfWidth.set(B.width*.5,0,0),Y.halfHeight.set(0,B.height*.5,0),r.rectArea[y]=Y,y++}else if(B.isPointLight){const Y=e.get(B);if(Y.color.copy(B.color).multiplyScalar(B.intensity),Y.distance=B.distance,Y.decay=B.decay,B.castShadow){const j=B.shadow,W=t.get(B);W.shadowIntensity=j.intensity,W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,W.shadowCameraNear=j.camera.near,W.shadowCameraFar=j.camera.far,r.pointShadow[M]=W,r.pointShadowMap[M]=G,r.pointShadowMatrix[M]=B.shadow.matrix,N++}r.point[M]=Y,M++}else if(B.isHemisphereLight){const Y=e.get(B);Y.skyColor.copy(B.color).multiplyScalar(ne),Y.groundColor.copy(B.groundColor).multiplyScalar(ne),r.hemi[x]=Y,x++}}y>0&&(n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ze.LTC_FLOAT_1,r.rectAreaLTC2=ze.LTC_FLOAT_2):(r.rectAreaLTC1=ze.LTC_HALF_1,r.rectAreaLTC2=ze.LTC_HALF_2)),r.ambient[0]=v,r.ambient[1]=g,r.ambient[2]=m;const b=r.hash;(b.directionalLength!==_||b.pointLength!==M||b.spotLength!==E||b.rectAreaLength!==y||b.hemiLength!==x||b.numDirectionalShadows!==T||b.numPointShadows!==N||b.numSpotShadows!==C||b.numSpotMaps!==k||b.numLightProbes!==F)&&(r.directional.length=_,r.spot.length=E,r.rectArea.length=y,r.point.length=M,r.hemi.length=x,r.directionalShadow.length=T,r.directionalShadowMap.length=T,r.pointShadow.length=N,r.pointShadowMap.length=N,r.spotShadow.length=C,r.spotShadowMap.length=C,r.directionalShadowMatrix.length=T,r.pointShadowMatrix.length=N,r.spotLightMatrix.length=C+k-I,r.spotLightMap.length=k,r.numSpotLightShadowsWithMaps=I,r.numLightProbes=F,b.directionalLength=_,b.pointLength=M,b.spotLength=E,b.rectAreaLength=y,b.hemiLength=x,b.numDirectionalShadows=T,b.numPointShadows=N,b.numSpotShadows=C,b.numSpotMaps=k,b.numLightProbes=F,r.version=hN++)}function h(d,v){let g=0,m=0,_=0,M=0,E=0;const y=v.matrixWorldInverse;for(let x=0,T=d.length;x<T;x++){const N=d[x];if(N.isDirectionalLight){const C=r.directional[g];C.direction.setFromMatrixPosition(N.matrixWorld),o.setFromMatrixPosition(N.target.matrixWorld),C.direction.sub(o),C.direction.transformDirection(y),g++}else if(N.isSpotLight){const C=r.spot[_];C.position.setFromMatrixPosition(N.matrixWorld),C.position.applyMatrix4(y),C.direction.setFromMatrixPosition(N.matrixWorld),o.setFromMatrixPosition(N.target.matrixWorld),C.direction.sub(o),C.direction.transformDirection(y),_++}else if(N.isRectAreaLight){const C=r.rectArea[M];C.position.setFromMatrixPosition(N.matrixWorld),C.position.applyMatrix4(y),c.identity(),a.copy(N.matrixWorld),a.premultiply(y),c.extractRotation(a),C.halfWidth.set(N.width*.5,0,0),C.halfHeight.set(0,N.height*.5,0),C.halfWidth.applyMatrix4(c),C.halfHeight.applyMatrix4(c),M++}else if(N.isPointLight){const C=r.point[m];C.position.setFromMatrixPosition(N.matrixWorld),C.position.applyMatrix4(y),m++}else if(N.isHemisphereLight){const C=r.hemi[E];C.direction.setFromMatrixPosition(N.matrixWorld),C.direction.transformDirection(y),E++}}}return{setup:f,setupView:h,state:r}}function b_(n){const e=new mN(n),t=[],r=[],o=[];function a(m){g.camera=m,t.length=0,r.length=0,o.length=0}function c(m){t.push(m)}function f(m){r.push(m)}function h(m){o.push(m)}function d(){e.setup(t)}function v(m){e.setupView(t,m)}const g={lightsArray:t,shadowsArray:r,lightProbeGridArray:o,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:g,setupLights:d,setupLightsView:v,pushLight:c,pushShadow:f,pushLightProbeGrid:h}}function gN(n){let e=new WeakMap;function t(o,a=0){const c=e.get(o);let f;return c===void 0?(f=new b_(n),e.set(o,[f])):a>=c.length?(f=new b_(n),c.push(f)):f=c[a],f}function r(){e=new WeakMap}return{get:t,dispose:r}}const vN=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_N=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,xN=[new ie(1,0,0),new ie(-1,0,0),new ie(0,1,0),new ie(0,-1,0),new ie(0,0,1),new ie(0,0,-1)],yN=[new ie(0,-1,0),new ie(0,-1,0),new ie(0,0,1),new ie(0,0,-1),new ie(0,-1,0),new ie(0,-1,0)],T_=new on,Qa=new ie,yh=new ie;function SN(n,e,t){let r=new wS;const o=new ft,a=new ft,c=new sn,f=new IC,h=new UC,d={},v=t.maxTextureSize,g={[fs]:Kn,[Kn]:fs,[_r]:_r},m=new er({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:vN,fragmentShader:_N}),_=m.clone();_.defines.HORIZONTAL_PASS=1;const M=new vi;M.setAttribute("position",new Pi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new Rr(M,m),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=iu;let x=this.type;this.render=function(I,F,b){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||I.length===0)return;this.type===xR&&(ot("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=iu);const O=n.getRenderTarget(),X=n.getActiveCubeFace(),B=n.getActiveMipmapLevel(),Z=n.state;Z.setBlending(Sr),Z.buffers.depth.getReversed()===!0?Z.buffers.color.setClear(0,0,0,0):Z.buffers.color.setClear(1,1,1,1),Z.buffers.depth.setTest(!0),Z.setScissorTest(!1);const ne=x!==this.type;ne&&F.traverse(function(ce){ce.material&&(Array.isArray(ce.material)?ce.material.forEach(G=>G.needsUpdate=!0):ce.material.needsUpdate=!0)});for(let ce=0,G=I.length;ce<G;ce++){const Y=I[ce],j=Y.shadow;if(j===void 0){ot("WebGLShadowMap:",Y,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;o.copy(j.mapSize);const W=j.getFrameExtents();o.multiply(W),a.copy(j.mapSize),(o.x>v||o.y>v)&&(o.x>v&&(a.x=Math.floor(v/W.x),o.x=a.x*W.x,j.mapSize.x=a.x),o.y>v&&(a.y=Math.floor(v/W.y),o.y=a.y*W.y,j.mapSize.y=a.y));const z=n.state.buffers.depth.getReversed();if(j.camera._reversedDepth=z,j.map===null||ne===!0){if(j.map!==null&&(j.map.depthTexture!==null&&(j.map.depthTexture.dispose(),j.map.depthTexture=null),j.map.dispose()),this.type===el){if(Y.isPointLight){ot("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}j.map=new Zi(o.x,o.y,{format:Hs,type:Tr,minFilter:Dn,magFilter:Dn,generateMipmaps:!1}),j.map.texture.name=Y.name+".shadowMap",j.map.depthTexture=new qo(o.x,o.y,$i),j.map.depthTexture.name=Y.name+".shadowMapDepth",j.map.depthTexture.format=Ar,j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=En,j.map.depthTexture.magFilter=En}else Y.isPointLight?(j.map=new LS(o.x),j.map.depthTexture=new RC(o.x,Ji)):(j.map=new Zi(o.x,o.y),j.map.depthTexture=new qo(o.x,o.y,Ji)),j.map.depthTexture.name=Y.name+".shadowMap",j.map.depthTexture.format=Ar,this.type===iu?(j.map.depthTexture.compareFunction=z?pm:hm,j.map.depthTexture.minFilter=Dn,j.map.depthTexture.magFilter=Dn):(j.map.depthTexture.compareFunction=null,j.map.depthTexture.minFilter=En,j.map.depthTexture.magFilter=En);j.camera.updateProjectionMatrix()}const $=j.map.isWebGLCubeRenderTarget?6:1;for(let P=0;P<$;P++){if(j.map.isWebGLCubeRenderTarget)n.setRenderTarget(j.map,P),n.clear();else{P===0&&(n.setRenderTarget(j.map),n.clear());const V=j.getViewport(P);c.set(a.x*V.x,a.y*V.y,a.x*V.z,a.y*V.w),Z.viewport(c)}if(Y.isPointLight){const V=j.camera,ge=j.matrix,ye=Y.distance||V.far;ye!==V.far&&(V.far=ye,V.updateProjectionMatrix()),Qa.setFromMatrixPosition(Y.matrixWorld),V.position.copy(Qa),yh.copy(V.position),yh.add(xN[P]),V.up.copy(yN[P]),V.lookAt(yh),V.updateMatrixWorld(),ge.makeTranslation(-Qa.x,-Qa.y,-Qa.z),T_.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),j._frustum.setFromProjectionMatrix(T_,V.coordinateSystem,V.reversedDepth)}else j.updateMatrices(Y);r=j.getFrustum(),C(F,b,j.camera,Y,this.type)}j.isPointLightShadow!==!0&&this.type===el&&T(j,b),j.needsUpdate=!1}x=this.type,y.needsUpdate=!1,n.setRenderTarget(O,X,B)};function T(I,F){const b=e.update(E);m.defines.VSM_SAMPLES!==I.blurSamples&&(m.defines.VSM_SAMPLES=I.blurSamples,_.defines.VSM_SAMPLES=I.blurSamples,m.needsUpdate=!0,_.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new Zi(o.x,o.y,{format:Hs,type:Tr})),m.uniforms.shadow_pass.value=I.map.depthTexture,m.uniforms.resolution.value=I.mapSize,m.uniforms.radius.value=I.radius,n.setRenderTarget(I.mapPass),n.clear(),n.renderBufferDirect(F,null,b,m,E,null),_.uniforms.shadow_pass.value=I.mapPass.texture,_.uniforms.resolution.value=I.mapSize,_.uniforms.radius.value=I.radius,n.setRenderTarget(I.map),n.clear(),n.renderBufferDirect(F,null,b,_,E,null)}function N(I,F,b,O){let X=null;const B=b.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(B!==void 0)X=B;else if(X=b.isPointLight===!0?h:f,n.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0||F.alphaToCoverage===!0){const Z=X.uuid,ne=F.uuid;let ce=d[Z];ce===void 0&&(ce={},d[Z]=ce);let G=ce[ne];G===void 0&&(G=X.clone(),ce[ne]=G,F.addEventListener("dispose",k)),X=G}if(X.visible=F.visible,X.wireframe=F.wireframe,O===el?X.side=F.shadowSide!==null?F.shadowSide:F.side:X.side=F.shadowSide!==null?F.shadowSide:g[F.side],X.alphaMap=F.alphaMap,X.alphaTest=F.alphaToCoverage===!0?.5:F.alphaTest,X.map=F.map,X.clipShadows=F.clipShadows,X.clippingPlanes=F.clippingPlanes,X.clipIntersection=F.clipIntersection,X.displacementMap=F.displacementMap,X.displacementScale=F.displacementScale,X.displacementBias=F.displacementBias,X.wireframeLinewidth=F.wireframeLinewidth,X.linewidth=F.linewidth,b.isPointLight===!0&&X.isMeshDistanceMaterial===!0){const Z=n.properties.get(X);Z.light=b}return X}function C(I,F,b,O,X){if(I.visible===!1)return;if(I.layers.test(F.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&X===el)&&(!I.frustumCulled||r.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,I.matrixWorld);const ne=e.update(I),ce=I.material;if(Array.isArray(ce)){const G=ne.groups;for(let Y=0,j=G.length;Y<j;Y++){const W=G[Y],z=ce[W.materialIndex];if(z&&z.visible){const $=N(I,z,O,X);I.onBeforeShadow(n,I,F,b,ne,$,W),n.renderBufferDirect(b,null,ne,$,I,W),I.onAfterShadow(n,I,F,b,ne,$,W)}}}else if(ce.visible){const G=N(I,ce,O,X);I.onBeforeShadow(n,I,F,b,ne,G,null),n.renderBufferDirect(b,null,ne,G,I,null),I.onAfterShadow(n,I,F,b,ne,G,null)}}const Z=I.children;for(let ne=0,ce=Z.length;ne<ce;ne++)C(Z[ne],F,b,O,X)}function k(I){I.target.removeEventListener("dispose",k);for(const b in d){const O=d[b],X=I.target.uuid;X in O&&(O[X].dispose(),delete O[X])}}}function MN(n,e){function t(){let q=!1;const Ne=new sn;let ve=null;const Ge=new sn(0,0,0,0);return{setMask:function(Ue){ve!==Ue&&!q&&(n.colorMask(Ue,Ue,Ue,Ue),ve=Ue)},setLocked:function(Ue){q=Ue},setClear:function(Ue,Ee,Ke,ht,Ht){Ht===!0&&(Ue*=ht,Ee*=ht,Ke*=ht),Ne.set(Ue,Ee,Ke,ht),Ge.equals(Ne)===!1&&(n.clearColor(Ue,Ee,Ke,ht),Ge.copy(Ne))},reset:function(){q=!1,ve=null,Ge.set(-1,0,0,0)}}}function r(){let q=!1,Ne=!1,ve=null,Ge=null,Ue=null;return{setReversed:function(Ee){if(Ne!==Ee){const Ke=e.get("EXT_clip_control");Ee?Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.ZERO_TO_ONE_EXT):Ke.clipControlEXT(Ke.LOWER_LEFT_EXT,Ke.NEGATIVE_ONE_TO_ONE_EXT),Ne=Ee;const ht=Ue;Ue=null,this.setClear(ht)}},getReversed:function(){return Ne},setTest:function(Ee){Ee?pe(n.DEPTH_TEST):oe(n.DEPTH_TEST)},setMask:function(Ee){ve!==Ee&&!q&&(n.depthMask(Ee),ve=Ee)},setFunc:function(Ee){if(Ne&&(Ee=QR[Ee]),Ge!==Ee){switch(Ee){case Oh:n.depthFunc(n.NEVER);break;case kh:n.depthFunc(n.ALWAYS);break;case zh:n.depthFunc(n.LESS);break;case Yo:n.depthFunc(n.LEQUAL);break;case Bh:n.depthFunc(n.EQUAL);break;case Vh:n.depthFunc(n.GEQUAL);break;case Gh:n.depthFunc(n.GREATER);break;case Hh:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ge=Ee}},setLocked:function(Ee){q=Ee},setClear:function(Ee){Ue!==Ee&&(Ue=Ee,Ne&&(Ee=1-Ee),n.clearDepth(Ee))},reset:function(){q=!1,ve=null,Ge=null,Ue=null,Ne=!1}}}function o(){let q=!1,Ne=null,ve=null,Ge=null,Ue=null,Ee=null,Ke=null,ht=null,Ht=null;return{setTest:function(Dt){q||(Dt?pe(n.STENCIL_TEST):oe(n.STENCIL_TEST))},setMask:function(Dt){Ne!==Dt&&!q&&(n.stencilMask(Dt),Ne=Dt)},setFunc:function(Dt,Ln,ri){(ve!==Dt||Ge!==Ln||Ue!==ri)&&(n.stencilFunc(Dt,Ln,ri),ve=Dt,Ge=Ln,Ue=ri)},setOp:function(Dt,Ln,ri){(Ee!==Dt||Ke!==Ln||ht!==ri)&&(n.stencilOp(Dt,Ln,ri),Ee=Dt,Ke=Ln,ht=ri)},setLocked:function(Dt){q=Dt},setClear:function(Dt){Ht!==Dt&&(n.clearStencil(Dt),Ht=Dt)},reset:function(){q=!1,Ne=null,ve=null,Ge=null,Ue=null,Ee=null,Ke=null,ht=null,Ht=null}}}const a=new t,c=new r,f=new o,h=new WeakMap,d=new WeakMap;let v={},g={},m={},_=new WeakMap,M=[],E=null,y=!1,x=null,T=null,N=null,C=null,k=null,I=null,F=null,b=new Lt(0,0,0),O=0,X=!1,B=null,Z=null,ne=null,ce=null,G=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,W=0;const z=n.getParameter(n.VERSION);z.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(z)[1]),j=W>=1):z.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),j=W>=2);let $=null,P={};const V=n.getParameter(n.SCISSOR_BOX),ge=n.getParameter(n.VIEWPORT),ye=new sn().fromArray(V),Se=new sn().fromArray(ge);function te(q,Ne,ve,Ge){const Ue=new Uint8Array(4),Ee=n.createTexture();n.bindTexture(q,Ee),n.texParameteri(q,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(q,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ke=0;Ke<ve;Ke++)q===n.TEXTURE_3D||q===n.TEXTURE_2D_ARRAY?n.texImage3D(Ne,0,n.RGBA,1,1,Ge,0,n.RGBA,n.UNSIGNED_BYTE,Ue):n.texImage2D(Ne+Ke,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Ue);return Ee}const he={};he[n.TEXTURE_2D]=te(n.TEXTURE_2D,n.TEXTURE_2D,1),he[n.TEXTURE_CUBE_MAP]=te(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),he[n.TEXTURE_2D_ARRAY]=te(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),he[n.TEXTURE_3D]=te(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),c.setClear(1),f.setClear(0),pe(n.DEPTH_TEST),c.setFunc(Yo),Ct(!1),wt(Tv),pe(n.CULL_FACE),pt(Sr);function pe(q){v[q]!==!0&&(n.enable(q),v[q]=!0)}function oe(q){v[q]!==!1&&(n.disable(q),v[q]=!1)}function Ae(q,Ne){return m[q]!==Ne?(n.bindFramebuffer(q,Ne),m[q]=Ne,q===n.DRAW_FRAMEBUFFER&&(m[n.FRAMEBUFFER]=Ne),q===n.FRAMEBUFFER&&(m[n.DRAW_FRAMEBUFFER]=Ne),!0):!1}function Te(q,Ne){let ve=M,Ge=!1;if(q){ve=_.get(Ne),ve===void 0&&(ve=[],_.set(Ne,ve));const Ue=q.textures;if(ve.length!==Ue.length||ve[0]!==n.COLOR_ATTACHMENT0){for(let Ee=0,Ke=Ue.length;Ee<Ke;Ee++)ve[Ee]=n.COLOR_ATTACHMENT0+Ee;ve.length=Ue.length,Ge=!0}}else ve[0]!==n.BACK&&(ve[0]=n.BACK,Ge=!0);Ge&&n.drawBuffers(ve)}function rt(q){return E!==q?(n.useProgram(q),E=q,!0):!1}const Be={[Os]:n.FUNC_ADD,[SR]:n.FUNC_SUBTRACT,[MR]:n.FUNC_REVERSE_SUBTRACT};Be[ER]=n.MIN,Be[wR]=n.MAX;const Qe={[bR]:n.ZERO,[TR]:n.ONE,[AR]:n.SRC_COLOR,[Uh]:n.SRC_ALPHA,[LR]:n.SRC_ALPHA_SATURATE,[DR]:n.DST_COLOR,[CR]:n.DST_ALPHA,[RR]:n.ONE_MINUS_SRC_COLOR,[Fh]:n.ONE_MINUS_SRC_ALPHA,[NR]:n.ONE_MINUS_DST_COLOR,[PR]:n.ONE_MINUS_DST_ALPHA,[IR]:n.CONSTANT_COLOR,[UR]:n.ONE_MINUS_CONSTANT_COLOR,[FR]:n.CONSTANT_ALPHA,[OR]:n.ONE_MINUS_CONSTANT_ALPHA};function pt(q,Ne,ve,Ge,Ue,Ee,Ke,ht,Ht,Dt){if(q===Sr){y===!0&&(oe(n.BLEND),y=!1);return}if(y===!1&&(pe(n.BLEND),y=!0),q!==yR){if(q!==x||Dt!==X){if((T!==Os||k!==Os)&&(n.blendEquation(n.FUNC_ADD),T=Os,k=Os),Dt)switch(q){case Wo:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Av:n.blendFunc(n.ONE,n.ONE);break;case Rv:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Cv:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:At("WebGLState: Invalid blending: ",q);break}else switch(q){case Wo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Av:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Rv:At("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Cv:At("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:At("WebGLState: Invalid blending: ",q);break}N=null,C=null,I=null,F=null,b.set(0,0,0),O=0,x=q,X=Dt}return}Ue=Ue||Ne,Ee=Ee||ve,Ke=Ke||Ge,(Ne!==T||Ue!==k)&&(n.blendEquationSeparate(Be[Ne],Be[Ue]),T=Ne,k=Ue),(ve!==N||Ge!==C||Ee!==I||Ke!==F)&&(n.blendFuncSeparate(Qe[ve],Qe[Ge],Qe[Ee],Qe[Ke]),N=ve,C=Ge,I=Ee,F=Ke),(ht.equals(b)===!1||Ht!==O)&&(n.blendColor(ht.r,ht.g,ht.b,Ht),b.copy(ht),O=Ht),x=q,X=!1}function st(q,Ne){q.side===_r?oe(n.CULL_FACE):pe(n.CULL_FACE);let ve=q.side===Kn;Ne&&(ve=!ve),Ct(ve),q.blending===Wo&&q.transparent===!1?pt(Sr):pt(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),c.setFunc(q.depthFunc),c.setTest(q.depthTest),c.setMask(q.depthWrite),a.setMask(q.colorWrite);const Ge=q.stencilWrite;f.setTest(Ge),Ge&&(f.setMask(q.stencilWriteMask),f.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),f.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),Q(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?pe(n.SAMPLE_ALPHA_TO_COVERAGE):oe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ct(q){B!==q&&(q?n.frontFace(n.CW):n.frontFace(n.CCW),B=q)}function wt(q){q!==vR?(pe(n.CULL_FACE),q!==Z&&(q===Tv?n.cullFace(n.BACK):q===_R?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):oe(n.CULL_FACE),Z=q}function Wt(q){q!==ne&&(j&&n.lineWidth(q),ne=q)}function Q(q,Ne,ve){q?(pe(n.POLYGON_OFFSET_FILL),(ce!==Ne||G!==ve)&&(ce=Ne,G=ve,c.getReversed()&&(Ne=-Ne),n.polygonOffset(Ne,ve))):oe(n.POLYGON_OFFSET_FILL)}function zt(q){q?pe(n.SCISSOR_TEST):oe(n.SCISSOR_TEST)}function ut(q){q===void 0&&(q=n.TEXTURE0+Y-1),$!==q&&(n.activeTexture(q),$=q)}function Pt(q,Ne,ve){ve===void 0&&($===null?ve=n.TEXTURE0+Y-1:ve=$);let Ge=P[ve];Ge===void 0&&(Ge={type:void 0,texture:void 0},P[ve]=Ge),(Ge.type!==q||Ge.texture!==Ne)&&($!==ve&&(n.activeTexture(ve),$=ve),n.bindTexture(q,Ne||he[q]),Ge.type=q,Ge.texture=Ne)}function ke(){const q=P[$];q!==void 0&&q.type!==void 0&&(n.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function Bt(){try{n.compressedTexImage2D(...arguments)}catch(q){At("WebGLState:",q)}}function U(){try{n.compressedTexImage3D(...arguments)}catch(q){At("WebGLState:",q)}}function A(){try{n.texSubImage2D(...arguments)}catch(q){At("WebGLState:",q)}}function re(){try{n.texSubImage3D(...arguments)}catch(q){At("WebGLState:",q)}}function _e(){try{n.compressedTexSubImage2D(...arguments)}catch(q){At("WebGLState:",q)}}function Me(){try{n.compressedTexSubImage3D(...arguments)}catch(q){At("WebGLState:",q)}}function Ce(){try{n.texStorage2D(...arguments)}catch(q){At("WebGLState:",q)}}function Oe(){try{n.texStorage3D(...arguments)}catch(q){At("WebGLState:",q)}}function me(){try{n.texImage2D(...arguments)}catch(q){At("WebGLState:",q)}}function xe(){try{n.texImage3D(...arguments)}catch(q){At("WebGLState:",q)}}function Ve(q){return g[q]!==void 0?g[q]:n.getParameter(q)}function He(q,Ne){g[q]!==Ne&&(n.pixelStorei(q,Ne),g[q]=Ne)}function Le(q){ye.equals(q)===!1&&(n.scissor(q.x,q.y,q.z,q.w),ye.copy(q))}function Pe(q){Se.equals(q)===!1&&(n.viewport(q.x,q.y,q.z,q.w),Se.copy(q))}function at(q,Ne){let ve=d.get(Ne);ve===void 0&&(ve=new WeakMap,d.set(Ne,ve));let Ge=ve.get(q);Ge===void 0&&(Ge=n.getUniformBlockIndex(Ne,q.name),ve.set(q,Ge))}function dt(q,Ne){const Ge=d.get(Ne).get(q);h.get(Ne)!==Ge&&(n.uniformBlockBinding(Ne,Ge,q.__bindingPointIndex),h.set(Ne,Ge))}function xt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),c.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),v={},g={},$=null,P={},m={},_=new WeakMap,M=[],E=null,y=!1,x=null,T=null,N=null,C=null,k=null,I=null,F=null,b=new Lt(0,0,0),O=0,X=!1,B=null,Z=null,ne=null,ce=null,G=null,ye.set(0,0,n.canvas.width,n.canvas.height),Se.set(0,0,n.canvas.width,n.canvas.height),a.reset(),c.reset(),f.reset()}return{buffers:{color:a,depth:c,stencil:f},enable:pe,disable:oe,bindFramebuffer:Ae,drawBuffers:Te,useProgram:rt,setBlending:pt,setMaterial:st,setFlipSided:Ct,setCullFace:wt,setLineWidth:Wt,setPolygonOffset:Q,setScissorTest:zt,activeTexture:ut,bindTexture:Pt,unbindTexture:ke,compressedTexImage2D:Bt,compressedTexImage3D:U,texImage2D:me,texImage3D:xe,pixelStorei:He,getParameter:Ve,updateUBOMapping:at,uniformBlockBinding:dt,texStorage2D:Ce,texStorage3D:Oe,texSubImage2D:A,texSubImage3D:re,compressedTexSubImage2D:_e,compressedTexSubImage3D:Me,scissor:Le,viewport:Pe,reset:xt}}function EN(n,e,t,r,o,a,c){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new ft,v=new WeakMap,g=new Set;let m;const _=new WeakMap;let M=!1;try{M=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function E(U,A){return M?new OffscreenCanvas(U,A):Eu("canvas")}function y(U,A,re){let _e=1;const Me=Bt(U);if((Me.width>re||Me.height>re)&&(_e=re/Math.max(Me.width,Me.height)),_e<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const Ce=Math.floor(_e*Me.width),Oe=Math.floor(_e*Me.height);m===void 0&&(m=E(Ce,Oe));const me=A?E(Ce,Oe):m;return me.width=Ce,me.height=Oe,me.getContext("2d").drawImage(U,0,0,Ce,Oe),ot("WebGLRenderer: Texture has been resized from ("+Me.width+"x"+Me.height+") to ("+Ce+"x"+Oe+")."),me}else return"data"in U&&ot("WebGLRenderer: Image in DataTexture is too big ("+Me.width+"x"+Me.height+")."),U;return U}function x(U){return U.generateMipmaps}function T(U){n.generateMipmap(U)}function N(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function C(U,A,re,_e,Me,Ce=!1){if(U!==null){if(n[U]!==void 0)return n[U];ot("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let Oe;_e&&(Oe=e.get("EXT_texture_norm16"),Oe||ot("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let me=A;if(A===n.RED&&(re===n.FLOAT&&(me=n.R32F),re===n.HALF_FLOAT&&(me=n.R16F),re===n.UNSIGNED_BYTE&&(me=n.R8),re===n.UNSIGNED_SHORT&&Oe&&(me=Oe.R16_EXT),re===n.SHORT&&Oe&&(me=Oe.R16_SNORM_EXT)),A===n.RED_INTEGER&&(re===n.UNSIGNED_BYTE&&(me=n.R8UI),re===n.UNSIGNED_SHORT&&(me=n.R16UI),re===n.UNSIGNED_INT&&(me=n.R32UI),re===n.BYTE&&(me=n.R8I),re===n.SHORT&&(me=n.R16I),re===n.INT&&(me=n.R32I)),A===n.RG&&(re===n.FLOAT&&(me=n.RG32F),re===n.HALF_FLOAT&&(me=n.RG16F),re===n.UNSIGNED_BYTE&&(me=n.RG8),re===n.UNSIGNED_SHORT&&Oe&&(me=Oe.RG16_EXT),re===n.SHORT&&Oe&&(me=Oe.RG16_SNORM_EXT)),A===n.RG_INTEGER&&(re===n.UNSIGNED_BYTE&&(me=n.RG8UI),re===n.UNSIGNED_SHORT&&(me=n.RG16UI),re===n.UNSIGNED_INT&&(me=n.RG32UI),re===n.BYTE&&(me=n.RG8I),re===n.SHORT&&(me=n.RG16I),re===n.INT&&(me=n.RG32I)),A===n.RGB_INTEGER&&(re===n.UNSIGNED_BYTE&&(me=n.RGB8UI),re===n.UNSIGNED_SHORT&&(me=n.RGB16UI),re===n.UNSIGNED_INT&&(me=n.RGB32UI),re===n.BYTE&&(me=n.RGB8I),re===n.SHORT&&(me=n.RGB16I),re===n.INT&&(me=n.RGB32I)),A===n.RGBA_INTEGER&&(re===n.UNSIGNED_BYTE&&(me=n.RGBA8UI),re===n.UNSIGNED_SHORT&&(me=n.RGBA16UI),re===n.UNSIGNED_INT&&(me=n.RGBA32UI),re===n.BYTE&&(me=n.RGBA8I),re===n.SHORT&&(me=n.RGBA16I),re===n.INT&&(me=n.RGBA32I)),A===n.RGB&&(re===n.UNSIGNED_SHORT&&Oe&&(me=Oe.RGB16_EXT),re===n.SHORT&&Oe&&(me=Oe.RGB16_SNORM_EXT),re===n.UNSIGNED_INT_5_9_9_9_REV&&(me=n.RGB9_E5),re===n.UNSIGNED_INT_10F_11F_11F_REV&&(me=n.R11F_G11F_B10F)),A===n.RGBA){const xe=Ce?Su:bt.getTransfer(Me);re===n.FLOAT&&(me=n.RGBA32F),re===n.HALF_FLOAT&&(me=n.RGBA16F),re===n.UNSIGNED_BYTE&&(me=xe===kt?n.SRGB8_ALPHA8:n.RGBA8),re===n.UNSIGNED_SHORT&&Oe&&(me=Oe.RGBA16_EXT),re===n.SHORT&&Oe&&(me=Oe.RGBA16_SNORM_EXT),re===n.UNSIGNED_SHORT_4_4_4_4&&(me=n.RGBA4),re===n.UNSIGNED_SHORT_5_5_5_1&&(me=n.RGB5_A1)}return(me===n.R16F||me===n.R32F||me===n.RG16F||me===n.RG32F||me===n.RGBA16F||me===n.RGBA32F)&&e.get("EXT_color_buffer_float"),me}function k(U,A){let re;return U?A===null||A===Ji||A===al?re=n.DEPTH24_STENCIL8:A===$i?re=n.DEPTH32F_STENCIL8:A===ol&&(re=n.DEPTH24_STENCIL8,ot("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Ji||A===al?re=n.DEPTH_COMPONENT24:A===$i?re=n.DEPTH_COMPONENT32F:A===ol&&(re=n.DEPTH_COMPONENT16),re}function I(U,A){return x(U)===!0||U.isFramebufferTexture&&U.minFilter!==En&&U.minFilter!==Dn?Math.log2(Math.max(A.width,A.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?A.mipmaps.length:1}function F(U){const A=U.target;A.removeEventListener("dispose",F),O(A),A.isVideoTexture&&v.delete(A),A.isHTMLTexture&&g.delete(A)}function b(U){const A=U.target;A.removeEventListener("dispose",b),B(A)}function O(U){const A=r.get(U);if(A.__webglInit===void 0)return;const re=U.source,_e=_.get(re);if(_e){const Me=_e[A.__cacheKey];Me.usedTimes--,Me.usedTimes===0&&X(U),Object.keys(_e).length===0&&_.delete(re)}r.remove(U)}function X(U){const A=r.get(U);n.deleteTexture(A.__webglTexture);const re=U.source,_e=_.get(re);delete _e[A.__cacheKey],c.memory.textures--}function B(U){const A=r.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),r.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let _e=0;_e<6;_e++){if(Array.isArray(A.__webglFramebuffer[_e]))for(let Me=0;Me<A.__webglFramebuffer[_e].length;Me++)n.deleteFramebuffer(A.__webglFramebuffer[_e][Me]);else n.deleteFramebuffer(A.__webglFramebuffer[_e]);A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer[_e])}else{if(Array.isArray(A.__webglFramebuffer))for(let _e=0;_e<A.__webglFramebuffer.length;_e++)n.deleteFramebuffer(A.__webglFramebuffer[_e]);else n.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&n.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&n.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let _e=0;_e<A.__webglColorRenderbuffer.length;_e++)A.__webglColorRenderbuffer[_e]&&n.deleteRenderbuffer(A.__webglColorRenderbuffer[_e]);A.__webglDepthRenderbuffer&&n.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const re=U.textures;for(let _e=0,Me=re.length;_e<Me;_e++){const Ce=r.get(re[_e]);Ce.__webglTexture&&(n.deleteTexture(Ce.__webglTexture),c.memory.textures--),r.remove(re[_e])}r.remove(U)}let Z=0;function ne(){Z=0}function ce(){return Z}function G(U){Z=U}function Y(){const U=Z;return U>=o.maxTextures&&ot("WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+o.maxTextures),Z+=1,U}function j(U){const A=[];return A.push(U.wrapS),A.push(U.wrapT),A.push(U.wrapR||0),A.push(U.magFilter),A.push(U.minFilter),A.push(U.anisotropy),A.push(U.internalFormat),A.push(U.format),A.push(U.type),A.push(U.generateMipmaps),A.push(U.premultiplyAlpha),A.push(U.flipY),A.push(U.unpackAlignment),A.push(U.colorSpace),A.join()}function W(U,A){const re=r.get(U);if(U.isVideoTexture&&Pt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&re.__version!==U.version){const _e=U.image;if(_e===null)ot("WebGLRenderer: Texture marked for update but no image data found.");else if(_e.complete===!1)ot("WebGLRenderer: Texture marked for update but image is incomplete");else{oe(re,U,A);return}}else U.isExternalTexture&&(re.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,re.__webglTexture,n.TEXTURE0+A)}function z(U,A){const re=r.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&re.__version!==U.version){oe(re,U,A);return}else U.isExternalTexture&&(re.__webglTexture=U.sourceTexture?U.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,re.__webglTexture,n.TEXTURE0+A)}function $(U,A){const re=r.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&re.__version!==U.version){oe(re,U,A);return}t.bindTexture(n.TEXTURE_3D,re.__webglTexture,n.TEXTURE0+A)}function P(U,A){const re=r.get(U);if(U.isCubeDepthTexture!==!0&&U.version>0&&re.__version!==U.version){Ae(re,U,A);return}t.bindTexture(n.TEXTURE_CUBE_MAP,re.__webglTexture,n.TEXTURE0+A)}const V={[Wh]:n.REPEAT,[yr]:n.CLAMP_TO_EDGE,[jh]:n.MIRRORED_REPEAT},ge={[En]:n.NEAREST,[BR]:n.NEAREST_MIPMAP_NEAREST,[bc]:n.NEAREST_MIPMAP_LINEAR,[Dn]:n.LINEAR,[Hd]:n.LINEAR_MIPMAP_NEAREST,[zs]:n.LINEAR_MIPMAP_LINEAR},ye={[HR]:n.NEVER,[YR]:n.ALWAYS,[WR]:n.LESS,[hm]:n.LEQUAL,[jR]:n.EQUAL,[pm]:n.GEQUAL,[XR]:n.GREATER,[$R]:n.NOTEQUAL};function Se(U,A){if(A.type===$i&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===Dn||A.magFilter===Hd||A.magFilter===bc||A.magFilter===zs||A.minFilter===Dn||A.minFilter===Hd||A.minFilter===bc||A.minFilter===zs)&&ot("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,V[A.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,V[A.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,V[A.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,ge[A.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,ge[A.minFilter]),A.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,ye[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===En||A.minFilter!==bc&&A.minFilter!==zs||A.type===$i&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||r.get(A).__currentAnisotropy){const re=e.get("EXT_texture_filter_anisotropic");n.texParameterf(U,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,o.getMaxAnisotropy())),r.get(A).__currentAnisotropy=A.anisotropy}}}function te(U,A){let re=!1;U.__webglInit===void 0&&(U.__webglInit=!0,A.addEventListener("dispose",F));const _e=A.source;let Me=_.get(_e);Me===void 0&&(Me={},_.set(_e,Me));const Ce=j(A);if(Ce!==U.__cacheKey){Me[Ce]===void 0&&(Me[Ce]={texture:n.createTexture(),usedTimes:0},c.memory.textures++,re=!0),Me[Ce].usedTimes++;const Oe=Me[U.__cacheKey];Oe!==void 0&&(Me[U.__cacheKey].usedTimes--,Oe.usedTimes===0&&X(A)),U.__cacheKey=Ce,U.__webglTexture=Me[Ce].texture}return re}function he(U,A,re){return Math.floor(Math.floor(U/re)/A)}function pe(U,A,re,_e){const Ce=U.updateRanges;if(Ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,A.width,A.height,re,_e,A.data);else{Ce.sort((He,Le)=>He.start-Le.start);let Oe=0;for(let He=1;He<Ce.length;He++){const Le=Ce[Oe],Pe=Ce[He],at=Le.start+Le.count,dt=he(Pe.start,A.width,4),xt=he(Le.start,A.width,4);Pe.start<=at+1&&dt===xt&&he(Pe.start+Pe.count-1,A.width,4)===dt?Le.count=Math.max(Le.count,Pe.start+Pe.count-Le.start):(++Oe,Ce[Oe]=Pe)}Ce.length=Oe+1;const me=t.getParameter(n.UNPACK_ROW_LENGTH),xe=t.getParameter(n.UNPACK_SKIP_PIXELS),Ve=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,A.width);for(let He=0,Le=Ce.length;He<Le;He++){const Pe=Ce[He],at=Math.floor(Pe.start/4),dt=Math.ceil(Pe.count/4),xt=at%A.width,q=Math.floor(at/A.width),Ne=dt,ve=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,xt),t.pixelStorei(n.UNPACK_SKIP_ROWS,q),t.texSubImage2D(n.TEXTURE_2D,0,xt,q,Ne,ve,re,_e,A.data)}U.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,me),t.pixelStorei(n.UNPACK_SKIP_PIXELS,xe),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ve)}}function oe(U,A,re){let _e=n.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(_e=n.TEXTURE_2D_ARRAY),A.isData3DTexture&&(_e=n.TEXTURE_3D);const Me=te(U,A),Ce=A.source;t.bindTexture(_e,U.__webglTexture,n.TEXTURE0+re);const Oe=r.get(Ce);if(Ce.version!==Oe.__version||Me===!0){if(t.activeTexture(n.TEXTURE0+re),(typeof ImageBitmap<"u"&&A.image instanceof ImageBitmap)===!1){const ve=bt.getPrimaries(bt.workingColorSpace),Ge=A.colorSpace===ss?null:bt.getPrimaries(A.colorSpace),Ue=A.colorSpace===ss||ve===Ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ue)}t.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment);let xe=y(A.image,!1,o.maxTextureSize);xe=ke(A,xe);const Ve=a.convert(A.format,A.colorSpace),He=a.convert(A.type);let Le=C(A.internalFormat,Ve,He,A.normalized,A.colorSpace,A.isVideoTexture);Se(_e,A);let Pe;const at=A.mipmaps,dt=A.isVideoTexture!==!0,xt=Oe.__version===void 0||Me===!0,q=Ce.dataReady,Ne=I(A,xe);if(A.isDepthTexture)Le=k(A.format===Bs,A.type),xt&&(dt?t.texStorage2D(n.TEXTURE_2D,1,Le,xe.width,xe.height):t.texImage2D(n.TEXTURE_2D,0,Le,xe.width,xe.height,0,Ve,He,null));else if(A.isDataTexture)if(at.length>0){dt&&xt&&t.texStorage2D(n.TEXTURE_2D,Ne,Le,at[0].width,at[0].height);for(let ve=0,Ge=at.length;ve<Ge;ve++)Pe=at[ve],dt?q&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Pe.width,Pe.height,Ve,He,Pe.data):t.texImage2D(n.TEXTURE_2D,ve,Le,Pe.width,Pe.height,0,Ve,He,Pe.data);A.generateMipmaps=!1}else dt?(xt&&t.texStorage2D(n.TEXTURE_2D,Ne,Le,xe.width,xe.height),q&&pe(A,xe,Ve,He)):t.texImage2D(n.TEXTURE_2D,0,Le,xe.width,xe.height,0,Ve,He,xe.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){dt&&xt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,Le,at[0].width,at[0].height,xe.depth);for(let ve=0,Ge=at.length;ve<Ge;ve++)if(Pe=at[ve],A.format!==Ci)if(Ve!==null)if(dt){if(q)if(A.layerUpdates.size>0){const Ue=i_(Pe.width,Pe.height,A.format,A.type);for(const Ee of A.layerUpdates){const Ke=Pe.data.subarray(Ee*Ue/Pe.data.BYTES_PER_ELEMENT,(Ee+1)*Ue/Pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,Ee,Pe.width,Pe.height,1,Ve,Ke)}A.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Pe.width,Pe.height,xe.depth,Ve,Pe.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ve,Le,Pe.width,Pe.height,xe.depth,0,Pe.data,0,0);else ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else dt?q&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ve,0,0,0,Pe.width,Pe.height,xe.depth,Ve,He,Pe.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ve,Le,Pe.width,Pe.height,xe.depth,0,Ve,He,Pe.data)}else{dt&&xt&&t.texStorage2D(n.TEXTURE_2D,Ne,Le,at[0].width,at[0].height);for(let ve=0,Ge=at.length;ve<Ge;ve++)Pe=at[ve],A.format!==Ci?Ve!==null?dt?q&&t.compressedTexSubImage2D(n.TEXTURE_2D,ve,0,0,Pe.width,Pe.height,Ve,Pe.data):t.compressedTexImage2D(n.TEXTURE_2D,ve,Le,Pe.width,Pe.height,0,Pe.data):ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):dt?q&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Pe.width,Pe.height,Ve,He,Pe.data):t.texImage2D(n.TEXTURE_2D,ve,Le,Pe.width,Pe.height,0,Ve,He,Pe.data)}else if(A.isDataArrayTexture)if(dt){if(xt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ne,Le,xe.width,xe.height,xe.depth),q)if(A.layerUpdates.size>0){const ve=i_(xe.width,xe.height,A.format,A.type);for(const Ge of A.layerUpdates){const Ue=xe.data.subarray(Ge*ve/xe.data.BYTES_PER_ELEMENT,(Ge+1)*ve/xe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Ge,xe.width,xe.height,1,Ve,He,Ue)}A.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xe.width,xe.height,xe.depth,Ve,He,xe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,xe.width,xe.height,xe.depth,0,Ve,He,xe.data);else if(A.isData3DTexture)dt?(xt&&t.texStorage3D(n.TEXTURE_3D,Ne,Le,xe.width,xe.height,xe.depth),q&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xe.width,xe.height,xe.depth,Ve,He,xe.data)):t.texImage3D(n.TEXTURE_3D,0,Le,xe.width,xe.height,xe.depth,0,Ve,He,xe.data);else if(A.isFramebufferTexture){if(xt)if(dt)t.texStorage2D(n.TEXTURE_2D,Ne,Le,xe.width,xe.height);else{let ve=xe.width,Ge=xe.height;for(let Ue=0;Ue<Ne;Ue++)t.texImage2D(n.TEXTURE_2D,Ue,Le,ve,Ge,0,Ve,He,null),ve>>=1,Ge>>=1}}else if(A.isHTMLTexture){if("texElementImage2D"in n){const ve=n.canvas;if(ve.hasAttribute("layoutsubtree")||ve.setAttribute("layoutsubtree","true"),xe.parentNode!==ve){ve.appendChild(xe),g.add(A),ve.onpaint=ht=>{const Ht=ht.changedElements;for(const Dt of g)Ht.includes(Dt.image)&&(Dt.needsUpdate=!0)},ve.requestPaint();return}const Ge=0,Ue=n.RGBA,Ee=n.RGBA,Ke=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,Ge,Ue,Ee,Ke,xe),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(at.length>0){if(dt&&xt){const ve=Bt(at[0]);t.texStorage2D(n.TEXTURE_2D,Ne,Le,ve.width,ve.height)}for(let ve=0,Ge=at.length;ve<Ge;ve++)Pe=at[ve],dt?q&&t.texSubImage2D(n.TEXTURE_2D,ve,0,0,Ve,He,Pe):t.texImage2D(n.TEXTURE_2D,ve,Le,Ve,He,Pe);A.generateMipmaps=!1}else if(dt){if(xt){const ve=Bt(xe);t.texStorage2D(n.TEXTURE_2D,Ne,Le,ve.width,ve.height)}q&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ve,He,xe)}else t.texImage2D(n.TEXTURE_2D,0,Le,Ve,He,xe);x(A)&&T(_e),Oe.__version=Ce.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function Ae(U,A,re){if(A.image.length!==6)return;const _e=te(U,A),Me=A.source;t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+re);const Ce=r.get(Me);if(Me.version!==Ce.__version||_e===!0){t.activeTexture(n.TEXTURE0+re);const Oe=bt.getPrimaries(bt.workingColorSpace),me=A.colorSpace===ss?null:bt.getPrimaries(A.colorSpace),xe=A.colorSpace===ss||Oe===me?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,A.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,A.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Ve=A.isCompressedTexture||A.image[0].isCompressedTexture,He=A.image[0]&&A.image[0].isDataTexture,Le=[];for(let Ee=0;Ee<6;Ee++)!Ve&&!He?Le[Ee]=y(A.image[Ee],!0,o.maxCubemapSize):Le[Ee]=He?A.image[Ee].image:A.image[Ee],Le[Ee]=ke(A,Le[Ee]);const Pe=Le[0],at=a.convert(A.format,A.colorSpace),dt=a.convert(A.type),xt=C(A.internalFormat,at,dt,A.normalized,A.colorSpace),q=A.isVideoTexture!==!0,Ne=Ce.__version===void 0||_e===!0,ve=Me.dataReady;let Ge=I(A,Pe);Se(n.TEXTURE_CUBE_MAP,A);let Ue;if(Ve){q&&Ne&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ge,xt,Pe.width,Pe.height);for(let Ee=0;Ee<6;Ee++){Ue=Le[Ee].mipmaps;for(let Ke=0;Ke<Ue.length;Ke++){const ht=Ue[Ke];A.format!==Ci?at!==null?q?ve&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke,0,0,ht.width,ht.height,at,ht.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke,xt,ht.width,ht.height,0,ht.data):ot("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?ve&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke,0,0,ht.width,ht.height,at,dt,ht.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke,xt,ht.width,ht.height,0,at,dt,ht.data)}}}else{if(Ue=A.mipmaps,q&&Ne){Ue.length>0&&Ge++;const Ee=Bt(Le[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ge,xt,Ee.width,Ee.height)}for(let Ee=0;Ee<6;Ee++)if(He){q?ve&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,Le[Ee].width,Le[Ee].height,at,dt,Le[Ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,xt,Le[Ee].width,Le[Ee].height,0,at,dt,Le[Ee].data);for(let Ke=0;Ke<Ue.length;Ke++){const Ht=Ue[Ke].image[Ee].image;q?ve&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke+1,0,0,Ht.width,Ht.height,at,dt,Ht.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke+1,xt,Ht.width,Ht.height,0,at,dt,Ht.data)}}else{q?ve&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,0,0,at,dt,Le[Ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0,xt,at,dt,Le[Ee]);for(let Ke=0;Ke<Ue.length;Ke++){const ht=Ue[Ke];q?ve&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke+1,0,0,at,dt,ht.image[Ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Ke+1,xt,at,dt,ht.image[Ee])}}}x(A)&&T(n.TEXTURE_CUBE_MAP),Ce.__version=Me.version,A.onUpdate&&A.onUpdate(A)}U.__version=A.version}function Te(U,A,re,_e,Me,Ce){const Oe=a.convert(re.format,re.colorSpace),me=a.convert(re.type),xe=C(re.internalFormat,Oe,me,re.normalized,re.colorSpace),Ve=r.get(A),He=r.get(re);if(He.__renderTarget=A,!Ve.__hasExternalTextures){const Le=Math.max(1,A.width>>Ce),Pe=Math.max(1,A.height>>Ce);Me===n.TEXTURE_3D||Me===n.TEXTURE_2D_ARRAY?t.texImage3D(Me,Ce,xe,Le,Pe,A.depth,0,Oe,me,null):t.texImage2D(Me,Ce,xe,Le,Pe,0,Oe,me,null)}t.bindFramebuffer(n.FRAMEBUFFER,U),ut(A)?f.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,_e,Me,He.__webglTexture,0,zt(A)):(Me===n.TEXTURE_2D||Me>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Me<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,_e,Me,He.__webglTexture,Ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function rt(U,A,re){if(n.bindRenderbuffer(n.RENDERBUFFER,U),A.depthBuffer){const _e=A.depthTexture,Me=_e&&_e.isDepthTexture?_e.type:null,Ce=k(A.stencilBuffer,Me),Oe=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ut(A)?f.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,zt(A),Ce,A.width,A.height):re?n.renderbufferStorageMultisample(n.RENDERBUFFER,zt(A),Ce,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,Ce,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Oe,n.RENDERBUFFER,U)}else{const _e=A.textures;for(let Me=0;Me<_e.length;Me++){const Ce=_e[Me],Oe=a.convert(Ce.format,Ce.colorSpace),me=a.convert(Ce.type),xe=C(Ce.internalFormat,Oe,me,Ce.normalized,Ce.colorSpace);ut(A)?f.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,zt(A),xe,A.width,A.height):re?n.renderbufferStorageMultisample(n.RENDERBUFFER,zt(A),xe,A.width,A.height):n.renderbufferStorage(n.RENDERBUFFER,xe,A.width,A.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Be(U,A,re){const _e=A.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,U),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Me=r.get(A.depthTexture);if(Me.__renderTarget=A,(!Me.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),_e){if(Me.__webglInit===void 0&&(Me.__webglInit=!0,A.depthTexture.addEventListener("dispose",F)),Me.__webglTexture===void 0){Me.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,Me.__webglTexture),Se(n.TEXTURE_CUBE_MAP,A.depthTexture);const Ve=a.convert(A.depthTexture.format),He=a.convert(A.depthTexture.type);let Le;A.depthTexture.format===Ar?Le=n.DEPTH_COMPONENT24:A.depthTexture.format===Bs&&(Le=n.DEPTH24_STENCIL8);for(let Pe=0;Pe<6;Pe++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,Le,A.width,A.height,0,Ve,He,null)}}else W(A.depthTexture,0);const Ce=Me.__webglTexture,Oe=zt(A),me=_e?n.TEXTURE_CUBE_MAP_POSITIVE_X+re:n.TEXTURE_2D,xe=A.depthTexture.format===Bs?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(A.depthTexture.format===Ar)ut(A)?f.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,xe,me,Ce,0,Oe):n.framebufferTexture2D(n.FRAMEBUFFER,xe,me,Ce,0);else if(A.depthTexture.format===Bs)ut(A)?f.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,xe,me,Ce,0,Oe):n.framebufferTexture2D(n.FRAMEBUFFER,xe,me,Ce,0);else throw new Error("Unknown depthTexture format")}function Qe(U){const A=r.get(U),re=U.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==U.depthTexture){const _e=U.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),_e){const Me=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,_e.removeEventListener("dispose",Me)};_e.addEventListener("dispose",Me),A.__depthDisposeCallback=Me}A.__boundDepthTexture=_e}if(U.depthTexture&&!A.__autoAllocateDepthBuffer)if(re)for(let _e=0;_e<6;_e++)Be(A.__webglFramebuffer[_e],U,_e);else{const _e=U.texture.mipmaps;_e&&_e.length>0?Be(A.__webglFramebuffer[0],U,0):Be(A.__webglFramebuffer,U,0)}else if(re){A.__webglDepthbuffer=[];for(let _e=0;_e<6;_e++)if(t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[_e]),A.__webglDepthbuffer[_e]===void 0)A.__webglDepthbuffer[_e]=n.createRenderbuffer(),rt(A.__webglDepthbuffer[_e],U,!1);else{const Me=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ce=A.__webglDepthbuffer[_e];n.bindRenderbuffer(n.RENDERBUFFER,Ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,Me,n.RENDERBUFFER,Ce)}}else{const _e=U.texture.mipmaps;if(_e&&_e.length>0?t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=n.createRenderbuffer(),rt(A.__webglDepthbuffer,U,!1);else{const Me=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ce=A.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,Me,n.RENDERBUFFER,Ce)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function pt(U,A,re){const _e=r.get(U);A!==void 0&&Te(_e.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),re!==void 0&&Qe(U)}function st(U){const A=U.texture,re=r.get(U),_e=r.get(A);U.addEventListener("dispose",b);const Me=U.textures,Ce=U.isWebGLCubeRenderTarget===!0,Oe=Me.length>1;if(Oe||(_e.__webglTexture===void 0&&(_e.__webglTexture=n.createTexture()),_e.__version=A.version,c.memory.textures++),Ce){re.__webglFramebuffer=[];for(let me=0;me<6;me++)if(A.mipmaps&&A.mipmaps.length>0){re.__webglFramebuffer[me]=[];for(let xe=0;xe<A.mipmaps.length;xe++)re.__webglFramebuffer[me][xe]=n.createFramebuffer()}else re.__webglFramebuffer[me]=n.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){re.__webglFramebuffer=[];for(let me=0;me<A.mipmaps.length;me++)re.__webglFramebuffer[me]=n.createFramebuffer()}else re.__webglFramebuffer=n.createFramebuffer();if(Oe)for(let me=0,xe=Me.length;me<xe;me++){const Ve=r.get(Me[me]);Ve.__webglTexture===void 0&&(Ve.__webglTexture=n.createTexture(),c.memory.textures++)}if(U.samples>0&&ut(U)===!1){re.__webglMultisampledFramebuffer=n.createFramebuffer(),re.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,re.__webglMultisampledFramebuffer);for(let me=0;me<Me.length;me++){const xe=Me[me];re.__webglColorRenderbuffer[me]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,re.__webglColorRenderbuffer[me]);const Ve=a.convert(xe.format,xe.colorSpace),He=a.convert(xe.type),Le=C(xe.internalFormat,Ve,He,xe.normalized,xe.colorSpace,U.isXRRenderTarget===!0),Pe=zt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Pe,Le,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,re.__webglColorRenderbuffer[me])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(re.__webglDepthRenderbuffer=n.createRenderbuffer(),rt(re.__webglDepthRenderbuffer,U,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Ce){t.bindTexture(n.TEXTURE_CUBE_MAP,_e.__webglTexture),Se(n.TEXTURE_CUBE_MAP,A);for(let me=0;me<6;me++)if(A.mipmaps&&A.mipmaps.length>0)for(let xe=0;xe<A.mipmaps.length;xe++)Te(re.__webglFramebuffer[me][xe],U,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me,xe);else Te(re.__webglFramebuffer[me],U,A,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);x(A)&&T(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Oe){for(let me=0,xe=Me.length;me<xe;me++){const Ve=Me[me],He=r.get(Ve);let Le=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Le=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(Le,He.__webglTexture),Se(Le,Ve),Te(re.__webglFramebuffer,U,Ve,n.COLOR_ATTACHMENT0+me,Le,0),x(Ve)&&T(Le)}t.unbindTexture()}else{let me=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(me=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(me,_e.__webglTexture),Se(me,A),A.mipmaps&&A.mipmaps.length>0)for(let xe=0;xe<A.mipmaps.length;xe++)Te(re.__webglFramebuffer[xe],U,A,n.COLOR_ATTACHMENT0,me,xe);else Te(re.__webglFramebuffer,U,A,n.COLOR_ATTACHMENT0,me,0);x(A)&&T(me),t.unbindTexture()}U.depthBuffer&&Qe(U)}function Ct(U){const A=U.textures;for(let re=0,_e=A.length;re<_e;re++){const Me=A[re];if(x(Me)){const Ce=N(U),Oe=r.get(Me).__webglTexture;t.bindTexture(Ce,Oe),T(Ce),t.unbindTexture()}}}const wt=[],Wt=[];function Q(U){if(U.samples>0){if(ut(U)===!1){const A=U.textures,re=U.width,_e=U.height;let Me=n.COLOR_BUFFER_BIT;const Ce=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Oe=r.get(U),me=A.length>1;if(me)for(let Ve=0;Ve<A.length;Ve++)t.bindFramebuffer(n.FRAMEBUFFER,Oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Oe.__webglMultisampledFramebuffer);const xe=U.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Oe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Oe.__webglFramebuffer);for(let Ve=0;Ve<A.length;Ve++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(Me|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(Me|=n.STENCIL_BUFFER_BIT)),me){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Oe.__webglColorRenderbuffer[Ve]);const He=r.get(A[Ve]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,He,0)}n.blitFramebuffer(0,0,re,_e,0,0,re,_e,Me,n.NEAREST),h===!0&&(wt.length=0,Wt.length=0,wt.push(n.COLOR_ATTACHMENT0+Ve),U.depthBuffer&&U.resolveDepthBuffer===!1&&(wt.push(Ce),Wt.push(Ce),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Wt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,wt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),me)for(let Ve=0;Ve<A.length;Ve++){t.bindFramebuffer(n.FRAMEBUFFER,Oe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.RENDERBUFFER,Oe.__webglColorRenderbuffer[Ve]);const He=r.get(A[Ve]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Oe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ve,n.TEXTURE_2D,He,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Oe.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&h){const A=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[A])}}}function zt(U){return Math.min(o.maxSamples,U.samples)}function ut(U){const A=r.get(U);return U.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function Pt(U){const A=c.render.frame;v.get(U)!==A&&(v.set(U,A),U.update())}function ke(U,A){const re=U.colorSpace,_e=U.format,Me=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||re!==yu&&re!==ss&&(bt.getTransfer(re)===kt?(_e!==Ci||Me!==pi)&&ot("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):At("WebGLTextures: Unsupported texture color space:",re)),A}function Bt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(d.width=U.naturalWidth||U.width,d.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(d.width=U.displayWidth,d.height=U.displayHeight):(d.width=U.width,d.height=U.height),d}this.allocateTextureUnit=Y,this.resetTextureUnits=ne,this.getTextureUnits=ce,this.setTextureUnits=G,this.setTexture2D=W,this.setTexture2DArray=z,this.setTexture3D=$,this.setTextureCube=P,this.rebindTextures=pt,this.setupRenderTarget=st,this.updateRenderTargetMipmap=Ct,this.updateMultisampleRenderTarget=Q,this.setupDepthRenderbuffer=Qe,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=ut,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function wN(n,e){function t(r,o=ss){let a;const c=bt.getTransfer(o);if(r===pi)return n.UNSIGNED_BYTE;if(r===lm)return n.UNSIGNED_SHORT_4_4_4_4;if(r===cm)return n.UNSIGNED_SHORT_5_5_5_1;if(r===uS)return n.UNSIGNED_INT_5_9_9_9_REV;if(r===fS)return n.UNSIGNED_INT_10F_11F_11F_REV;if(r===lS)return n.BYTE;if(r===cS)return n.SHORT;if(r===ol)return n.UNSIGNED_SHORT;if(r===am)return n.INT;if(r===Ji)return n.UNSIGNED_INT;if(r===$i)return n.FLOAT;if(r===Tr)return n.HALF_FLOAT;if(r===dS)return n.ALPHA;if(r===hS)return n.RGB;if(r===Ci)return n.RGBA;if(r===Ar)return n.DEPTH_COMPONENT;if(r===Bs)return n.DEPTH_STENCIL;if(r===pS)return n.RED;if(r===um)return n.RED_INTEGER;if(r===Hs)return n.RG;if(r===fm)return n.RG_INTEGER;if(r===dm)return n.RGBA_INTEGER;if(r===ru||r===su||r===ou||r===au)if(c===kt)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===ru)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===su)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ou)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===au)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===ru)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===su)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ou)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===au)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Xh||r===$h||r===Yh||r===Kh)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Xh)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===$h)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Yh)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Kh)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===qh||r===Zh||r===Qh||r===Jh||r===ep||r===_u||r===tp)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(r===qh||r===Zh)return c===kt?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Qh)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(r===Jh)return a.COMPRESSED_R11_EAC;if(r===ep)return a.COMPRESSED_SIGNED_R11_EAC;if(r===_u)return a.COMPRESSED_RG11_EAC;if(r===tp)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(r===np||r===ip||r===rp||r===sp||r===op||r===ap||r===lp||r===cp||r===up||r===fp||r===dp||r===hp||r===pp||r===mp)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(r===np)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===ip)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===rp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===sp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===op)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===ap)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===lp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===cp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===up)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===fp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===dp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===hp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===pp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===mp)return c===kt?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===gp||r===vp||r===_p)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(r===gp)return c===kt?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===vp)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===_p)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===xp||r===yp||r===xu||r===Sp)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(r===xp)return a.COMPRESSED_RED_RGTC1_EXT;if(r===yp)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===xu)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Sp)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===al?n.UNSIGNED_INT_24_8:n[r]!==void 0?n[r]:null}return{convert:t}}const bN=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,TN=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class AN{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const r=new AS(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new er({vertexShader:bN,fragmentShader:TN,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rr(new Wu(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class RN extends ms{constructor(e,t){super();const r=this;let o=null,a=1,c=null,f="local-floor",h=1,d=null,v=null,g=null,m=null,_=null,M=null;const E=typeof XRWebGLBinding<"u",y=new AN,x={},T=t.getContextAttributes();let N=null,C=null;const k=[],I=[],F=new ft;let b=null;const O=new hi;O.viewport=new sn;const X=new hi;X.viewport=new sn;const B=[O,X],Z=new OC;let ne=null,ce=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let he=k[te];return he===void 0&&(he=new qd,k[te]=he),he.getTargetRaySpace()},this.getControllerGrip=function(te){let he=k[te];return he===void 0&&(he=new qd,k[te]=he),he.getGripSpace()},this.getHand=function(te){let he=k[te];return he===void 0&&(he=new qd,k[te]=he),he.getHandSpace()};function G(te){const he=I.indexOf(te.inputSource);if(he===-1)return;const pe=k[he];pe!==void 0&&(pe.update(te.inputSource,te.frame,d||c),pe.dispatchEvent({type:te.type,data:te.inputSource}))}function Y(){o.removeEventListener("select",G),o.removeEventListener("selectstart",G),o.removeEventListener("selectend",G),o.removeEventListener("squeeze",G),o.removeEventListener("squeezestart",G),o.removeEventListener("squeezeend",G),o.removeEventListener("end",Y),o.removeEventListener("inputsourceschange",j);for(let te=0;te<k.length;te++){const he=I[te];he!==null&&(I[te]=null,k[te].disconnect(he))}ne=null,ce=null,y.reset();for(const te in x)delete x[te];e.setRenderTarget(N),_=null,m=null,g=null,o=null,C=null,Se.stop(),r.isPresenting=!1,e.setPixelRatio(b),e.setSize(F.width,F.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){a=te,r.isPresenting===!0&&ot("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){f=te,r.isPresenting===!0&&ot("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||c},this.setReferenceSpace=function(te){d=te},this.getBaseLayer=function(){return m!==null?m:_},this.getBinding=function(){return g===null&&E&&(g=new XRWebGLBinding(o,t)),g},this.getFrame=function(){return M},this.getSession=function(){return o},this.setSession=async function(te){if(o=te,o!==null){if(N=e.getRenderTarget(),o.addEventListener("select",G),o.addEventListener("selectstart",G),o.addEventListener("selectend",G),o.addEventListener("squeeze",G),o.addEventListener("squeezestart",G),o.addEventListener("squeezeend",G),o.addEventListener("end",Y),o.addEventListener("inputsourceschange",j),T.xrCompatible!==!0&&await t.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(F),E&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,oe=null,Ae=null;T.depth&&(Ae=T.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=T.stencil?Bs:Ar,oe=T.stencil?al:Ji);const Te={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:a};g=this.getBinding(),m=g.createProjectionLayer(Te),o.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),C=new Zi(m.textureWidth,m.textureHeight,{format:Ci,type:pi,depthTexture:new qo(m.textureWidth,m.textureHeight,oe,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:T.stencil,colorSpace:e.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{const pe={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:a};_=new XRWebGLLayer(o,t,pe),o.updateRenderState({baseLayer:_}),e.setPixelRatio(1),e.setSize(_.framebufferWidth,_.framebufferHeight,!1),C=new Zi(_.framebufferWidth,_.framebufferHeight,{format:Ci,type:pi,colorSpace:e.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:_.ignoreDepthValues===!1,resolveStencilBuffer:_.ignoreDepthValues===!1})}C.isXRRenderTarget=!0,this.setFoveation(h),d=null,c=await o.requestReferenceSpace(f),Se.setContext(o),Se.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function j(te){for(let he=0;he<te.removed.length;he++){const pe=te.removed[he],oe=I.indexOf(pe);oe>=0&&(I[oe]=null,k[oe].disconnect(pe))}for(let he=0;he<te.added.length;he++){const pe=te.added[he];let oe=I.indexOf(pe);if(oe===-1){for(let Te=0;Te<k.length;Te++)if(Te>=I.length){I.push(pe),oe=Te;break}else if(I[Te]===null){I[Te]=pe,oe=Te;break}if(oe===-1)break}const Ae=k[oe];Ae&&Ae.connect(pe)}}const W=new ie,z=new ie;function $(te,he,pe){W.setFromMatrixPosition(he.matrixWorld),z.setFromMatrixPosition(pe.matrixWorld);const oe=W.distanceTo(z),Ae=he.projectionMatrix.elements,Te=pe.projectionMatrix.elements,rt=Ae[14]/(Ae[10]-1),Be=Ae[14]/(Ae[10]+1),Qe=(Ae[9]+1)/Ae[5],pt=(Ae[9]-1)/Ae[5],st=(Ae[8]-1)/Ae[0],Ct=(Te[8]+1)/Te[0],wt=rt*st,Wt=rt*Ct,Q=oe/(-st+Ct),zt=Q*-st;if(he.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(zt),te.translateZ(Q),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Ae[10]===-1)te.projectionMatrix.copy(he.projectionMatrix),te.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const ut=rt+Q,Pt=Be+Q,ke=wt-zt,Bt=Wt+(oe-zt),U=Qe*Be/Pt*ut,A=pt*Be/Pt*ut;te.projectionMatrix.makePerspective(ke,Bt,U,A,ut,Pt),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function P(te,he){he===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(he.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(o===null)return;let he=te.near,pe=te.far;y.texture!==null&&(y.depthNear>0&&(he=y.depthNear),y.depthFar>0&&(pe=y.depthFar)),Z.near=X.near=O.near=he,Z.far=X.far=O.far=pe,(ne!==Z.near||ce!==Z.far)&&(o.updateRenderState({depthNear:Z.near,depthFar:Z.far}),ne=Z.near,ce=Z.far),Z.layers.mask=te.layers.mask|6,O.layers.mask=Z.layers.mask&-5,X.layers.mask=Z.layers.mask&-3;const oe=te.parent,Ae=Z.cameras;P(Z,oe);for(let Te=0;Te<Ae.length;Te++)P(Ae[Te],oe);Ae.length===2?$(Z,O,X):Z.projectionMatrix.copy(O.projectionMatrix),V(te,Z,oe)};function V(te,he,pe){pe===null?te.matrix.copy(he.matrixWorld):(te.matrix.copy(pe.matrixWorld),te.matrix.invert(),te.matrix.multiply(he.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(he.projectionMatrix),te.projectionMatrixInverse.copy(he.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=wp*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return Z},this.getFoveation=function(){if(!(m===null&&_===null))return h},this.setFoveation=function(te){h=te,m!==null&&(m.fixedFoveation=te),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=te)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(Z)},this.getCameraTexture=function(te){return x[te]};let ge=null;function ye(te,he){if(v=he.getViewerPose(d||c),M=he,v!==null){const pe=v.views;_!==null&&(e.setRenderTargetFramebuffer(C,_.framebuffer),e.setRenderTarget(C));let oe=!1;pe.length!==Z.cameras.length&&(Z.cameras.length=0,oe=!0);for(let Be=0;Be<pe.length;Be++){const Qe=pe[Be];let pt=null;if(_!==null)pt=_.getViewport(Qe);else{const Ct=g.getViewSubImage(m,Qe);pt=Ct.viewport,Be===0&&(e.setRenderTargetTextures(C,Ct.colorTexture,Ct.depthStencilTexture),e.setRenderTarget(C))}let st=B[Be];st===void 0&&(st=new hi,st.layers.enable(Be),st.viewport=new sn,B[Be]=st),st.matrix.fromArray(Qe.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(Qe.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(pt.x,pt.y,pt.width,pt.height),Be===0&&(Z.matrix.copy(st.matrix),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale)),oe===!0&&Z.cameras.push(st)}const Ae=o.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&E){g=r.getBinding();const Be=g.getDepthInformation(pe[0]);Be&&Be.isValid&&Be.texture&&y.init(Be,o.renderState)}if(Ae&&Ae.includes("camera-access")&&E){e.state.unbindTexture(),g=r.getBinding();for(let Be=0;Be<pe.length;Be++){const Qe=pe[Be].camera;if(Qe){let pt=x[Qe];pt||(pt=new AS,x[Qe]=pt);const st=g.getCameraImage(Qe);pt.sourceTexture=st}}}}for(let pe=0;pe<k.length;pe++){const oe=I[pe],Ae=k[pe];oe!==null&&Ae!==void 0&&Ae.update(oe,he,d||c)}ge&&ge(te,he),he.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:he}),M=null}const Se=new DS;Se.setAnimationLoop(ye),this.setAnimationLoop=function(te){ge=te},this.dispose=function(){}}}const CN=new on,kS=new vt;kS.set(-1,0,0,0,1,0,0,0,1);function PN(n,e){function t(y,x){y.matrixAutoUpdate===!0&&y.updateMatrix(),x.value.copy(y.matrix)}function r(y,x){x.color.getRGB(y.fogColor.value,RS(n)),x.isFog?(y.fogNear.value=x.near,y.fogFar.value=x.far):x.isFogExp2&&(y.fogDensity.value=x.density)}function o(y,x,T,N,C){x.isNodeMaterial?x.uniformsNeedUpdate=!1:x.isMeshBasicMaterial?a(y,x):x.isMeshLambertMaterial?(a(y,x),x.envMap&&(y.envMapIntensity.value=x.envMapIntensity)):x.isMeshToonMaterial?(a(y,x),g(y,x)):x.isMeshPhongMaterial?(a(y,x),v(y,x),x.envMap&&(y.envMapIntensity.value=x.envMapIntensity)):x.isMeshStandardMaterial?(a(y,x),m(y,x),x.isMeshPhysicalMaterial&&_(y,x,C)):x.isMeshMatcapMaterial?(a(y,x),M(y,x)):x.isMeshDepthMaterial?a(y,x):x.isMeshDistanceMaterial?(a(y,x),E(y,x)):x.isMeshNormalMaterial?a(y,x):x.isLineBasicMaterial?(c(y,x),x.isLineDashedMaterial&&f(y,x)):x.isPointsMaterial?h(y,x,T,N):x.isSpriteMaterial?d(y,x):x.isShadowMaterial?(y.color.value.copy(x.color),y.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function a(y,x){y.opacity.value=x.opacity,x.color&&y.diffuse.value.copy(x.color),x.emissive&&y.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(y.map.value=x.map,t(x.map,y.mapTransform)),x.alphaMap&&(y.alphaMap.value=x.alphaMap,t(x.alphaMap,y.alphaMapTransform)),x.bumpMap&&(y.bumpMap.value=x.bumpMap,t(x.bumpMap,y.bumpMapTransform),y.bumpScale.value=x.bumpScale,x.side===Kn&&(y.bumpScale.value*=-1)),x.normalMap&&(y.normalMap.value=x.normalMap,t(x.normalMap,y.normalMapTransform),y.normalScale.value.copy(x.normalScale),x.side===Kn&&y.normalScale.value.negate()),x.displacementMap&&(y.displacementMap.value=x.displacementMap,t(x.displacementMap,y.displacementMapTransform),y.displacementScale.value=x.displacementScale,y.displacementBias.value=x.displacementBias),x.emissiveMap&&(y.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,y.emissiveMapTransform)),x.specularMap&&(y.specularMap.value=x.specularMap,t(x.specularMap,y.specularMapTransform)),x.alphaTest>0&&(y.alphaTest.value=x.alphaTest);const T=e.get(x),N=T.envMap,C=T.envMapRotation;N&&(y.envMap.value=N,y.envMapRotation.value.setFromMatrix4(CN.makeRotationFromEuler(C)).transpose(),N.isCubeTexture&&N.isRenderTargetTexture===!1&&y.envMapRotation.value.premultiply(kS),y.reflectivity.value=x.reflectivity,y.ior.value=x.ior,y.refractionRatio.value=x.refractionRatio),x.lightMap&&(y.lightMap.value=x.lightMap,y.lightMapIntensity.value=x.lightMapIntensity,t(x.lightMap,y.lightMapTransform)),x.aoMap&&(y.aoMap.value=x.aoMap,y.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,y.aoMapTransform))}function c(y,x){y.diffuse.value.copy(x.color),y.opacity.value=x.opacity,x.map&&(y.map.value=x.map,t(x.map,y.mapTransform))}function f(y,x){y.dashSize.value=x.dashSize,y.totalSize.value=x.dashSize+x.gapSize,y.scale.value=x.scale}function h(y,x,T,N){y.diffuse.value.copy(x.color),y.opacity.value=x.opacity,y.size.value=x.size*T,y.scale.value=N*.5,x.map&&(y.map.value=x.map,t(x.map,y.uvTransform)),x.alphaMap&&(y.alphaMap.value=x.alphaMap,t(x.alphaMap,y.alphaMapTransform)),x.alphaTest>0&&(y.alphaTest.value=x.alphaTest)}function d(y,x){y.diffuse.value.copy(x.color),y.opacity.value=x.opacity,y.rotation.value=x.rotation,x.map&&(y.map.value=x.map,t(x.map,y.mapTransform)),x.alphaMap&&(y.alphaMap.value=x.alphaMap,t(x.alphaMap,y.alphaMapTransform)),x.alphaTest>0&&(y.alphaTest.value=x.alphaTest)}function v(y,x){y.specular.value.copy(x.specular),y.shininess.value=Math.max(x.shininess,1e-4)}function g(y,x){x.gradientMap&&(y.gradientMap.value=x.gradientMap)}function m(y,x){y.metalness.value=x.metalness,x.metalnessMap&&(y.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,y.metalnessMapTransform)),y.roughness.value=x.roughness,x.roughnessMap&&(y.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,y.roughnessMapTransform)),x.envMap&&(y.envMapIntensity.value=x.envMapIntensity)}function _(y,x,T){y.ior.value=x.ior,x.sheen>0&&(y.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),y.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(y.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,y.sheenColorMapTransform)),x.sheenRoughnessMap&&(y.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,y.sheenRoughnessMapTransform))),x.clearcoat>0&&(y.clearcoat.value=x.clearcoat,y.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(y.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,y.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(y.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===Kn&&y.clearcoatNormalScale.value.negate())),x.dispersion>0&&(y.dispersion.value=x.dispersion),x.iridescence>0&&(y.iridescence.value=x.iridescence,y.iridescenceIOR.value=x.iridescenceIOR,y.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(y.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,y.iridescenceMapTransform)),x.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),x.transmission>0&&(y.transmission.value=x.transmission,y.transmissionSamplerMap.value=T.texture,y.transmissionSamplerSize.value.set(T.width,T.height),x.transmissionMap&&(y.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,y.transmissionMapTransform)),y.thickness.value=x.thickness,x.thicknessMap&&(y.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=x.attenuationDistance,y.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(y.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(y.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=x.specularIntensity,y.specularColor.value.copy(x.specularColor),x.specularColorMap&&(y.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,y.specularColorMapTransform)),x.specularIntensityMap&&(y.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,y.specularIntensityMapTransform))}function M(y,x){x.matcap&&(y.matcap.value=x.matcap)}function E(y,x){const T=e.get(x).light;y.referencePosition.value.setFromMatrixPosition(T.matrixWorld),y.nearDistance.value=T.shadow.camera.near,y.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:o}}function DN(n,e,t,r){let o={},a={},c=[];const f=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function h(T,N){const C=N.program;r.uniformBlockBinding(T,C)}function d(T,N){let C=o[T.id];C===void 0&&(M(T),C=v(T),o[T.id]=C,T.addEventListener("dispose",y));const k=N.program;r.updateUBOMapping(T,k);const I=e.render.frame;a[T.id]!==I&&(m(T),a[T.id]=I)}function v(T){const N=g();T.__bindingPointIndex=N;const C=n.createBuffer(),k=T.__size,I=T.usage;return n.bindBuffer(n.UNIFORM_BUFFER,C),n.bufferData(n.UNIFORM_BUFFER,k,I),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,N,C),C}function g(){for(let T=0;T<f;T++)if(c.indexOf(T)===-1)return c.push(T),T;return At("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(T){const N=o[T.id],C=T.uniforms,k=T.__cache;n.bindBuffer(n.UNIFORM_BUFFER,N);for(let I=0,F=C.length;I<F;I++){const b=Array.isArray(C[I])?C[I]:[C[I]];for(let O=0,X=b.length;O<X;O++){const B=b[O];if(_(B,I,O,k)===!0){const Z=B.__offset,ne=Array.isArray(B.value)?B.value:[B.value];let ce=0;for(let G=0;G<ne.length;G++){const Y=ne[G],j=E(Y);typeof Y=="number"||typeof Y=="boolean"?(B.__data[0]=Y,n.bufferSubData(n.UNIFORM_BUFFER,Z+ce,B.__data)):Y.isMatrix3?(B.__data[0]=Y.elements[0],B.__data[1]=Y.elements[1],B.__data[2]=Y.elements[2],B.__data[3]=0,B.__data[4]=Y.elements[3],B.__data[5]=Y.elements[4],B.__data[6]=Y.elements[5],B.__data[7]=0,B.__data[8]=Y.elements[6],B.__data[9]=Y.elements[7],B.__data[10]=Y.elements[8],B.__data[11]=0):ArrayBuffer.isView(Y)?B.__data.set(new Y.constructor(Y.buffer,Y.byteOffset,B.__data.length)):(Y.toArray(B.__data,ce),ce+=j.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,Z,B.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function _(T,N,C,k){const I=T.value,F=N+"_"+C;if(k[F]===void 0)return typeof I=="number"||typeof I=="boolean"?k[F]=I:ArrayBuffer.isView(I)?k[F]=I.slice():k[F]=I.clone(),!0;{const b=k[F];if(typeof I=="number"||typeof I=="boolean"){if(b!==I)return k[F]=I,!0}else{if(ArrayBuffer.isView(I))return!0;if(b.equals(I)===!1)return b.copy(I),!0}}return!1}function M(T){const N=T.uniforms;let C=0;const k=16;for(let F=0,b=N.length;F<b;F++){const O=Array.isArray(N[F])?N[F]:[N[F]];for(let X=0,B=O.length;X<B;X++){const Z=O[X],ne=Array.isArray(Z.value)?Z.value:[Z.value];for(let ce=0,G=ne.length;ce<G;ce++){const Y=ne[ce],j=E(Y),W=C%k,z=W%j.boundary,$=W+z;C+=z,$!==0&&k-$<j.storage&&(C+=k-$),Z.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=C,C+=j.storage}}}const I=C%k;return I>0&&(C+=k-I),T.__size=C,T.__cache={},this}function E(T){const N={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(N.boundary=4,N.storage=4):T.isVector2?(N.boundary=8,N.storage=8):T.isVector3||T.isColor?(N.boundary=16,N.storage=12):T.isVector4?(N.boundary=16,N.storage=16):T.isMatrix3?(N.boundary=48,N.storage=48):T.isMatrix4?(N.boundary=64,N.storage=64):T.isTexture?ot("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(T)?(N.boundary=16,N.storage=T.byteLength):ot("WebGLRenderer: Unsupported uniform value type.",T),N}function y(T){const N=T.target;N.removeEventListener("dispose",y);const C=c.indexOf(N.__bindingPointIndex);c.splice(C,1),n.deleteBuffer(o[N.id]),delete o[N.id],delete a[N.id]}function x(){for(const T in o)n.deleteBuffer(o[T]);c=[],o={},a={}}return{bind:h,update:d,dispose:x}}const NN=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Gi=null;function LN(){return Gi===null&&(Gi=new MC(NN,16,16,Hs,Tr),Gi.name="DFG_LUT",Gi.minFilter=Dn,Gi.magFilter=Dn,Gi.wrapS=yr,Gi.wrapT=yr,Gi.generateMipmaps=!1,Gi.needsUpdate=!0),Gi}class IN{constructor(e={}){const{canvas:t=qR(),context:r=null,depth:o=!0,stencil:a=!1,alpha:c=!1,antialias:f=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:d=!1,powerPreference:v="default",failIfMajorPerformanceCaveat:g=!1,reversedDepthBuffer:m=!1,outputBufferType:_=pi}=e;this.isWebGLRenderer=!0;let M;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=r.getContextAttributes().alpha}else M=c;const E=_,y=new Set([dm,fm,um]),x=new Set([pi,Ji,ol,al,lm,cm]),T=new Uint32Array(4),N=new Int32Array(4),C=new ie;let k=null,I=null;const F=[],b=[];let O=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const X=this;let B=!1,Z=null;this._outputColorSpace=di;let ne=0,ce=0,G=null,Y=-1,j=null;const W=new sn,z=new sn;let $=null;const P=new Lt(0);let V=0,ge=t.width,ye=t.height,Se=1,te=null,he=null;const pe=new sn(0,0,ge,ye),oe=new sn(0,0,ge,ye);let Ae=!1;const Te=new wS;let rt=!1,Be=!1;const Qe=new on,pt=new ie,st=new sn,Ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let wt=!1;function Wt(){return G===null?Se:1}let Q=r;function zt(D,ee){return t.getContext(D,ee)}try{const D={alpha:!0,depth:o,stencil:a,antialias:f,premultipliedAlpha:h,preserveDrawingBuffer:d,powerPreference:v,failIfMajorPerformanceCaveat:g};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${om}`),t.addEventListener("webglcontextlost",Ee,!1),t.addEventListener("webglcontextrestored",Ke,!1),t.addEventListener("webglcontextcreationerror",ht,!1),Q===null){const ee="webgl2";if(Q=zt(ee,D),Q===null)throw zt(ee)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(D){throw At("WebGLRenderer: "+D.message),D}let ut,Pt,ke,Bt,U,A,re,_e,Me,Ce,Oe,me,xe,Ve,He,Le,Pe,at,dt,xt,q,Ne,ve;function Ge(){ut=new L3(Q),ut.init(),q=new wN(Q,ut),Pt=new b3(Q,ut,e,q),ke=new MN(Q,ut),Pt.reversedDepthBuffer&&m&&ke.buffers.depth.setReversed(!0),Bt=new F3(Q),U=new lN,A=new EN(Q,ut,ke,U,Pt,q,Bt),re=new N3(X),_e=new BC(Q),Ne=new E3(Q,_e),Me=new I3(Q,_e,Bt,Ne),Ce=new k3(Q,Me,_e,Ne,Bt),at=new O3(Q,Pt,A),He=new T3(U),Oe=new aN(X,re,ut,Pt,Ne,He),me=new PN(X,U),xe=new uN,Ve=new gN(ut),Pe=new M3(X,re,ke,Ce,M,h),Le=new SN(X,Ce,Pt),ve=new DN(Q,Bt,Pt,ke),dt=new w3(Q,ut,Bt),xt=new U3(Q,ut,Bt),Bt.programs=Oe.programs,X.capabilities=Pt,X.extensions=ut,X.properties=U,X.renderLists=xe,X.shadowMap=Le,X.state=ke,X.info=Bt}Ge(),E!==pi&&(O=new B3(E,t.width,t.height,o,a));const Ue=new RN(X,Q);this.xr=Ue,this.getContext=function(){return Q},this.getContextAttributes=function(){return Q.getContextAttributes()},this.forceContextLoss=function(){const D=ut.get("WEBGL_lose_context");D&&D.loseContext()},this.forceContextRestore=function(){const D=ut.get("WEBGL_lose_context");D&&D.restoreContext()},this.getPixelRatio=function(){return Se},this.setPixelRatio=function(D){D!==void 0&&(Se=D,this.setSize(ge,ye,!1))},this.getSize=function(D){return D.set(ge,ye)},this.setSize=function(D,ee,fe=!0){if(Ue.isPresenting){ot("WebGLRenderer: Can't change size while VR device is presenting.");return}ge=D,ye=ee,t.width=Math.floor(D*Se),t.height=Math.floor(ee*Se),fe===!0&&(t.style.width=D+"px",t.style.height=ee+"px"),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,D,ee)},this.getDrawingBufferSize=function(D){return D.set(ge*Se,ye*Se).floor()},this.setDrawingBufferSize=function(D,ee,fe){ge=D,ye=ee,Se=fe,t.width=Math.floor(D*fe),t.height=Math.floor(ee*fe),this.setViewport(0,0,D,ee)},this.setEffects=function(D){if(E===pi){At("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(D){for(let ee=0;ee<D.length;ee++)if(D[ee].isOutputPass===!0){ot("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(D||[])},this.getCurrentViewport=function(D){return D.copy(W)},this.getViewport=function(D){return D.copy(pe)},this.setViewport=function(D,ee,fe,le){D.isVector4?pe.set(D.x,D.y,D.z,D.w):pe.set(D,ee,fe,le),ke.viewport(W.copy(pe).multiplyScalar(Se).round())},this.getScissor=function(D){return D.copy(oe)},this.setScissor=function(D,ee,fe,le){D.isVector4?oe.set(D.x,D.y,D.z,D.w):oe.set(D,ee,fe,le),ke.scissor(z.copy(oe).multiplyScalar(Se).round())},this.getScissorTest=function(){return Ae},this.setScissorTest=function(D){ke.setScissorTest(Ae=D)},this.setOpaqueSort=function(D){te=D},this.setTransparentSort=function(D){he=D},this.getClearColor=function(D){return D.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor(...arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha(...arguments)},this.clear=function(D=!0,ee=!0,fe=!0){let le=0;if(D){let ae=!1;if(G!==null){const Fe=G.texture.format;ae=y.has(Fe)}if(ae){const Fe=G.texture.type,Xe=x.has(Fe),Ie=Pe.getClearColor(),qe=Pe.getClearAlpha(),tt=Ie.r,mt=Ie.g,gt=Ie.b;Xe?(T[0]=tt,T[1]=mt,T[2]=gt,T[3]=qe,Q.clearBufferuiv(Q.COLOR,0,T)):(N[0]=tt,N[1]=mt,N[2]=gt,N[3]=qe,Q.clearBufferiv(Q.COLOR,0,N))}else le|=Q.COLOR_BUFFER_BIT}ee&&(le|=Q.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),fe&&(le|=Q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),le!==0&&Q.clear(le)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(D){D.setRenderer(this),Z=D},this.dispose=function(){t.removeEventListener("webglcontextlost",Ee,!1),t.removeEventListener("webglcontextrestored",Ke,!1),t.removeEventListener("webglcontextcreationerror",ht,!1),Pe.dispose(),xe.dispose(),Ve.dispose(),U.dispose(),re.dispose(),Ce.dispose(),Ne.dispose(),ve.dispose(),Oe.dispose(),Ue.dispose(),Ue.removeEventListener("sessionstart",gs),Ue.removeEventListener("sessionend",Ys),ir.stop()};function Ee(D){D.preventDefault(),wu("WebGLRenderer: Context Lost."),B=!0}function Ke(){wu("WebGLRenderer: Context Restored."),B=!1;const D=Bt.autoReset,ee=Le.enabled,fe=Le.autoUpdate,le=Le.needsUpdate,ae=Le.type;Ge(),Bt.autoReset=D,Le.enabled=ee,Le.autoUpdate=fe,Le.needsUpdate=le,Le.type=ae}function ht(D){At("WebGLRenderer: A WebGL context could not be created. Reason: ",D.statusMessage)}function Ht(D){const ee=D.target;ee.removeEventListener("dispose",Ht),Dt(ee)}function Dt(D){Ln(D),U.remove(D)}function Ln(D){const ee=U.get(D).programs;ee!==void 0&&(ee.forEach(function(fe){Oe.releaseProgram(fe)}),D.isShaderMaterial&&Oe.releaseShaderCache(D))}this.renderBufferDirect=function(D,ee,fe,le,ae,Fe){ee===null&&(ee=Ct);const Xe=ae.isMesh&&ae.matrixWorld.determinant()<0,Ie=ml(D,ee,fe,le,ae);ke.setMaterial(le,Xe);let qe=fe.index,tt=1;if(le.wireframe===!0){if(qe=Me.getWireframeAttribute(fe),qe===void 0)return;tt=2}const mt=fe.drawRange,gt=fe.attributes.position;let Je=mt.start*tt,Tt=(mt.start+mt.count)*tt;Fe!==null&&(Je=Math.max(Je,Fe.start*tt),Tt=Math.min(Tt,(Fe.start+Fe.count)*tt)),qe!==null?(Je=Math.max(Je,0),Tt=Math.min(Tt,qe.count)):gt!=null&&(Je=Math.max(Je,0),Tt=Math.min(Tt,gt.count));const jt=Tt-Je;if(jt<0||jt===1/0)return;Ne.setup(ae,le,Ie,fe,qe);let qt,Ft=dt;if(qe!==null&&(qt=_e.get(qe),Ft=xt,Ft.setIndex(qt)),ae.isMesh)le.wireframe===!0?(ke.setLineWidth(le.wireframeLinewidth*Wt()),Ft.setMode(Q.LINES)):Ft.setMode(Q.TRIANGLES);else if(ae.isLine){let an=le.linewidth;an===void 0&&(an=1),ke.setLineWidth(an*Wt()),ae.isLineSegments?Ft.setMode(Q.LINES):ae.isLineLoop?Ft.setMode(Q.LINE_LOOP):Ft.setMode(Q.LINE_STRIP)}else ae.isPoints?Ft.setMode(Q.POINTS):ae.isSprite&&Ft.setMode(Q.TRIANGLES);if(ae.isBatchedMesh)if(ut.get("WEBGL_multi_draw"))Ft.renderMultiDraw(ae._multiDrawStarts,ae._multiDrawCounts,ae._multiDrawCount);else{const an=ae._multiDrawStarts,We=ae._multiDrawCounts,yn=ae._multiDrawCount,yt=qe?_e.get(qe).bytesPerElement:1,Bn=U.get(le).currentProgram.getUniforms();for(let Vn=0;Vn<yn;Vn++)Bn.setValue(Q,"_gl_DrawID",Vn),Ft.render(an[Vn]/yt,We[Vn])}else if(ae.isInstancedMesh)Ft.renderInstances(Je,jt,ae.count);else if(fe.isInstancedBufferGeometry){const an=fe._maxInstanceCount!==void 0?fe._maxInstanceCount:1/0,We=Math.min(fe.instanceCount,an);Ft.renderInstances(Je,jt,We)}else Ft.render(Je,jt)};function ri(D,ee,fe){D.transparent===!0&&D.side===_r&&D.forceSinglePass===!1?(D.side=Kn,D.needsUpdate=!0,Ks(D,ee,fe),D.side=fs,D.needsUpdate=!0,Ks(D,ee,fe),D.side=_r):Ks(D,ee,fe)}this.compile=function(D,ee,fe=null){fe===null&&(fe=D),I=Ve.get(fe),I.init(ee),b.push(I),fe.traverseVisible(function(ae){ae.isLight&&ae.layers.test(ee.layers)&&(I.pushLight(ae),ae.castShadow&&I.pushShadow(ae))}),D!==fe&&D.traverseVisible(function(ae){ae.isLight&&ae.layers.test(ee.layers)&&(I.pushLight(ae),ae.castShadow&&I.pushShadow(ae))}),I.setupLights();const le=new Set;return D.traverse(function(ae){if(!(ae.isMesh||ae.isPoints||ae.isLine||ae.isSprite))return;const Fe=ae.material;if(Fe)if(Array.isArray(Fe))for(let Xe=0;Xe<Fe.length;Xe++){const Ie=Fe[Xe];ri(Ie,fe,ae),le.add(Ie)}else ri(Fe,fe,ae),le.add(Fe)}),I=b.pop(),le},this.compileAsync=function(D,ee,fe=null){const le=this.compile(D,ee,fe);return new Promise(ae=>{function Fe(){if(le.forEach(function(Xe){U.get(Xe).currentProgram.isReady()&&le.delete(Xe)}),le.size===0){ae(D);return}setTimeout(Fe,10)}ut.get("KHR_parallel_shader_compile")!==null?Fe():setTimeout(Fe,10)})};let nr=null;function $s(D){nr&&nr(D)}function gs(){ir.stop()}function Ys(){ir.start()}const ir=new DS;ir.setAnimationLoop($s),typeof self<"u"&&ir.setContext(self),this.setAnimationLoop=function(D){nr=D,Ue.setAnimationLoop(D),D===null?ir.stop():ir.start()},Ue.addEventListener("sessionstart",gs),Ue.addEventListener("sessionend",Ys),this.render=function(D,ee){if(ee!==void 0&&ee.isCamera!==!0){At("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(B===!0)return;Z!==null&&Z.renderStart(D,ee);const fe=Ue.enabled===!0&&Ue.isPresenting===!0,le=O!==null&&(G===null||fe)&&O.begin(X,G);if(D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),ee.parent===null&&ee.matrixWorldAutoUpdate===!0&&ee.updateMatrixWorld(),Ue.enabled===!0&&Ue.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(Ue.cameraAutoUpdate===!0&&Ue.updateCamera(ee),ee=Ue.getCamera()),D.isScene===!0&&D.onBeforeRender(X,D,ee,G),I=Ve.get(D,b.length),I.init(ee),I.state.textureUnits=A.getTextureUnits(),b.push(I),Qe.multiplyMatrices(ee.projectionMatrix,ee.matrixWorldInverse),Te.setFromProjectionMatrix(Qe,Yi,ee.reversedDepth),Be=this.localClippingEnabled,rt=He.init(this.clippingPlanes,Be),k=xe.get(D,F.length),k.init(),F.push(k),Ue.enabled===!0&&Ue.isPresenting===!0){const Xe=X.xr.getDepthSensingMesh();Xe!==null&&sa(Xe,ee,-1/0,X.sortObjects)}sa(D,ee,0,X.sortObjects),k.finish(),X.sortObjects===!0&&k.sort(te,he),wt=Ue.enabled===!1||Ue.isPresenting===!1||Ue.hasDepthSensing()===!1,wt&&Pe.addToRenderList(k,D),this.info.render.frame++,rt===!0&&He.beginShadows();const ae=I.state.shadowsArray;if(Le.render(ae,D,ee),rt===!0&&He.endShadows(),this.info.autoReset===!0&&this.info.reset(),(le&&O.hasRenderPass())===!1){const Xe=k.opaque,Ie=k.transmissive;if(I.setupLights(),ee.isArrayCamera){const qe=ee.cameras;if(Ie.length>0)for(let tt=0,mt=qe.length;tt<mt;tt++){const gt=qe[tt];Ui(Xe,Ie,D,gt)}wt&&Pe.render(D);for(let tt=0,mt=qe.length;tt<mt;tt++){const gt=qe[tt];hl(k,D,gt,gt.viewport)}}else Ie.length>0&&Ui(Xe,Ie,D,ee),wt&&Pe.render(D),hl(k,D,ee)}G!==null&&ce===0&&(A.updateMultisampleRenderTarget(G),A.updateRenderTargetMipmap(G)),le&&O.end(X),D.isScene===!0&&D.onAfterRender(X,D,ee),Ne.resetDefaultState(),Y=-1,j=null,b.pop(),b.length>0?(I=b[b.length-1],A.setTextureUnits(I.state.textureUnits),rt===!0&&He.setGlobalState(X.clippingPlanes,I.state.camera)):I=null,F.pop(),F.length>0?k=F[F.length-1]:k=null,Z!==null&&Z.renderEnd()};function sa(D,ee,fe,le){if(D.visible===!1)return;if(D.layers.test(ee.layers)){if(D.isGroup)fe=D.renderOrder;else if(D.isLOD)D.autoUpdate===!0&&D.update(ee);else if(D.isLightProbeGrid)I.pushLightProbeGrid(D);else if(D.isLight)I.pushLight(D),D.castShadow&&I.pushShadow(D);else if(D.isSprite){if(!D.frustumCulled||Te.intersectsSprite(D)){le&&st.setFromMatrixPosition(D.matrixWorld).applyMatrix4(Qe);const Xe=Ce.update(D),Ie=D.material;Ie.visible&&k.push(D,Xe,Ie,fe,st.z,null)}}else if((D.isMesh||D.isLine||D.isPoints)&&(!D.frustumCulled||Te.intersectsObject(D))){const Xe=Ce.update(D),Ie=D.material;if(le&&(D.boundingSphere!==void 0?(D.boundingSphere===null&&D.computeBoundingSphere(),st.copy(D.boundingSphere.center)):(Xe.boundingSphere===null&&Xe.computeBoundingSphere(),st.copy(Xe.boundingSphere.center)),st.applyMatrix4(D.matrixWorld).applyMatrix4(Qe)),Array.isArray(Ie)){const qe=Xe.groups;for(let tt=0,mt=qe.length;tt<mt;tt++){const gt=qe[tt],Je=Ie[gt.materialIndex];Je&&Je.visible&&k.push(D,Xe,Je,fe,st.z,gt)}}else Ie.visible&&k.push(D,Xe,Ie,fe,st.z,null)}}const Fe=D.children;for(let Xe=0,Ie=Fe.length;Xe<Ie;Xe++)sa(Fe[Xe],ee,fe,le)}function hl(D,ee,fe,le){const{opaque:ae,transmissive:Fe,transparent:Xe}=D;I.setupLightsView(fe),rt===!0&&He.setGlobalState(X.clippingPlanes,fe),le&&ke.viewport(W.copy(le)),ae.length>0&&vs(ae,ee,fe),Fe.length>0&&vs(Fe,ee,fe),Xe.length>0&&vs(Xe,ee,fe),ke.buffers.depth.setTest(!0),ke.buffers.depth.setMask(!0),ke.buffers.color.setMask(!0),ke.setPolygonOffset(!1)}function Ui(D,ee,fe,le){if((fe.isScene===!0?fe.overrideMaterial:null)!==null)return;if(I.state.transmissionRenderTarget[le.id]===void 0){const Je=ut.has("EXT_color_buffer_half_float")||ut.has("EXT_color_buffer_float");I.state.transmissionRenderTarget[le.id]=new Zi(1,1,{generateMipmaps:!0,type:Je?Tr:pi,minFilter:zs,samples:Math.max(4,Pt.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:bt.workingColorSpace})}const Fe=I.state.transmissionRenderTarget[le.id],Xe=le.viewport||W;Fe.setSize(Xe.z*X.transmissionResolutionScale,Xe.w*X.transmissionResolutionScale);const Ie=X.getRenderTarget(),qe=X.getActiveCubeFace(),tt=X.getActiveMipmapLevel();X.setRenderTarget(Fe),X.getClearColor(P),V=X.getClearAlpha(),V<1&&X.setClearColor(16777215,.5),X.clear(),wt&&Pe.render(fe);const mt=X.toneMapping;X.toneMapping=qi;const gt=le.viewport;if(le.viewport!==void 0&&(le.viewport=void 0),I.setupLightsView(le),rt===!0&&He.setGlobalState(X.clippingPlanes,le),vs(D,fe,le),A.updateMultisampleRenderTarget(Fe),A.updateRenderTargetMipmap(Fe),ut.has("WEBGL_multisampled_render_to_texture")===!1){let Je=!1;for(let Tt=0,jt=ee.length;Tt<jt;Tt++){const qt=ee[Tt],{object:Ft,geometry:an,material:We,group:yn}=qt;if(We.side===_r&&Ft.layers.test(le.layers)){const yt=We.side;We.side=Kn,We.needsUpdate=!0,oa(Ft,fe,le,an,We,yn),We.side=yt,We.needsUpdate=!0,Je=!0}}Je===!0&&(A.updateMultisampleRenderTarget(Fe),A.updateRenderTargetMipmap(Fe))}X.setRenderTarget(Ie,qe,tt),X.setClearColor(P,V),gt!==void 0&&(le.viewport=gt),X.toneMapping=mt}function vs(D,ee,fe){const le=ee.isScene===!0?ee.overrideMaterial:null;for(let ae=0,Fe=D.length;ae<Fe;ae++){const Xe=D[ae],{object:Ie,geometry:qe,group:tt}=Xe;let mt=Xe.material;mt.allowOverride===!0&&le!==null&&(mt=le),Ie.layers.test(fe.layers)&&oa(Ie,ee,fe,qe,mt,tt)}}function oa(D,ee,fe,le,ae,Fe){D.onBeforeRender(X,ee,fe,le,ae,Fe),D.modelViewMatrix.multiplyMatrices(fe.matrixWorldInverse,D.matrixWorld),D.normalMatrix.getNormalMatrix(D.modelViewMatrix),ae.onBeforeRender(X,ee,fe,le,D,Fe),ae.transparent===!0&&ae.side===_r&&ae.forceSinglePass===!1?(ae.side=Kn,ae.needsUpdate=!0,X.renderBufferDirect(fe,ee,le,ae,D,Fe),ae.side=fs,ae.needsUpdate=!0,X.renderBufferDirect(fe,ee,le,ae,D,Fe),ae.side=_r):X.renderBufferDirect(fe,ee,le,ae,D,Fe),D.onAfterRender(X,ee,fe,le,ae,Fe)}function Ks(D,ee,fe){ee.isScene!==!0&&(ee=Ct);const le=U.get(D),ae=I.state.lights,Fe=I.state.shadowsArray,Xe=ae.state.version,Ie=Oe.getParameters(D,ae.state,Fe,ee,fe,I.state.lightProbeGridArray),qe=Oe.getProgramCacheKey(Ie);let tt=le.programs;le.environment=D.isMeshStandardMaterial||D.isMeshLambertMaterial||D.isMeshPhongMaterial?ee.environment:null,le.fog=ee.fog;const mt=D.isMeshStandardMaterial||D.isMeshLambertMaterial&&!D.envMap||D.isMeshPhongMaterial&&!D.envMap;le.envMap=re.get(D.envMap||le.environment,mt),le.envMapRotation=le.environment!==null&&D.envMap===null?ee.environmentRotation:D.envMapRotation,tt===void 0&&(D.addEventListener("dispose",Ht),tt=new Map,le.programs=tt);let gt=tt.get(qe);if(gt!==void 0){if(le.currentProgram===gt&&le.lightsStateVersion===Xe)return la(D,Ie),gt}else Ie.uniforms=Oe.getUniforms(D),Z!==null&&D.isNodeMaterial&&Z.build(D,fe,Ie),D.onBeforeCompile(Ie,X),gt=Oe.acquireProgram(Ie,qe),tt.set(qe,gt),le.uniforms=Ie.uniforms;const Je=le.uniforms;return(!D.isShaderMaterial&&!D.isRawShaderMaterial||D.clipping===!0)&&(Je.clippingPlanes=He.uniform),la(D,Ie),le.needsLights=Yu(D),le.lightsStateVersion=Xe,le.needsLights&&(Je.ambientLightColor.value=ae.state.ambient,Je.lightProbe.value=ae.state.probe,Je.directionalLights.value=ae.state.directional,Je.directionalLightShadows.value=ae.state.directionalShadow,Je.spotLights.value=ae.state.spot,Je.spotLightShadows.value=ae.state.spotShadow,Je.rectAreaLights.value=ae.state.rectArea,Je.ltc_1.value=ae.state.rectAreaLTC1,Je.ltc_2.value=ae.state.rectAreaLTC2,Je.pointLights.value=ae.state.point,Je.pointLightShadows.value=ae.state.pointShadow,Je.hemisphereLights.value=ae.state.hemi,Je.directionalShadowMatrix.value=ae.state.directionalShadowMatrix,Je.spotLightMatrix.value=ae.state.spotLightMatrix,Je.spotLightMap.value=ae.state.spotLightMap,Je.pointShadowMatrix.value=ae.state.pointShadowMatrix),le.lightProbeGrid=I.state.lightProbeGridArray.length>0,le.currentProgram=gt,le.uniformsList=null,gt}function aa(D){if(D.uniformsList===null){const ee=D.currentProgram.getUniforms();D.uniformsList=cu.seqWithValue(ee.seq,D.uniforms)}return D.uniformsList}function la(D,ee){const fe=U.get(D);fe.outputColorSpace=ee.outputColorSpace,fe.batching=ee.batching,fe.batchingColor=ee.batchingColor,fe.instancing=ee.instancing,fe.instancingColor=ee.instancingColor,fe.instancingMorph=ee.instancingMorph,fe.skinning=ee.skinning,fe.morphTargets=ee.morphTargets,fe.morphNormals=ee.morphNormals,fe.morphColors=ee.morphColors,fe.morphTargetsCount=ee.morphTargetsCount,fe.numClippingPlanes=ee.numClippingPlanes,fe.numIntersection=ee.numClipIntersection,fe.vertexAlphas=ee.vertexAlphas,fe.vertexTangents=ee.vertexTangents,fe.toneMapping=ee.toneMapping}function pl(D,ee){if(D.length===0)return null;if(D.length===1)return D[0].texture!==null?D[0]:null;C.setFromMatrixPosition(ee.matrixWorld);for(let fe=0,le=D.length;fe<le;fe++){const ae=D[fe];if(ae.texture!==null&&ae.boundingBox.containsPoint(C))return ae}return null}function ml(D,ee,fe,le,ae){ee.isScene!==!0&&(ee=Ct),A.resetTextureUnits();const Fe=ee.fog,Xe=le.isMeshStandardMaterial||le.isMeshLambertMaterial||le.isMeshPhongMaterial?ee.environment:null,Ie=G===null?X.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:bt.workingColorSpace,qe=le.isMeshStandardMaterial||le.isMeshLambertMaterial&&!le.envMap||le.isMeshPhongMaterial&&!le.envMap,tt=re.get(le.envMap||Xe,qe),mt=le.vertexColors===!0&&!!fe.attributes.color&&fe.attributes.color.itemSize===4,gt=!!fe.attributes.tangent&&(!!le.normalMap||le.anisotropy>0),Je=!!fe.morphAttributes.position,Tt=!!fe.morphAttributes.normal,jt=!!fe.morphAttributes.color;let qt=qi;le.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(qt=X.toneMapping);const Ft=fe.morphAttributes.position||fe.morphAttributes.normal||fe.morphAttributes.color,an=Ft!==void 0?Ft.length:0,We=U.get(le),yn=I.state.lights;if(rt===!0&&(Be===!0||D!==j)){const Ot=D===j&&le.id===Y;He.setState(le,D,Ot)}let yt=!1;le.version===We.__version?(We.needsLights&&We.lightsStateVersion!==yn.state.version||We.outputColorSpace!==Ie||ae.isBatchedMesh&&We.batching===!1||!ae.isBatchedMesh&&We.batching===!0||ae.isBatchedMesh&&We.batchingColor===!0&&ae.colorTexture===null||ae.isBatchedMesh&&We.batchingColor===!1&&ae.colorTexture!==null||ae.isInstancedMesh&&We.instancing===!1||!ae.isInstancedMesh&&We.instancing===!0||ae.isSkinnedMesh&&We.skinning===!1||!ae.isSkinnedMesh&&We.skinning===!0||ae.isInstancedMesh&&We.instancingColor===!0&&ae.instanceColor===null||ae.isInstancedMesh&&We.instancingColor===!1&&ae.instanceColor!==null||ae.isInstancedMesh&&We.instancingMorph===!0&&ae.morphTexture===null||ae.isInstancedMesh&&We.instancingMorph===!1&&ae.morphTexture!==null||We.envMap!==tt||le.fog===!0&&We.fog!==Fe||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==He.numPlanes||We.numIntersection!==He.numIntersection)||We.vertexAlphas!==mt||We.vertexTangents!==gt||We.morphTargets!==Je||We.morphNormals!==Tt||We.morphColors!==jt||We.toneMapping!==qt||We.morphTargetsCount!==an||!!We.lightProbeGrid!=I.state.lightProbeGridArray.length>0)&&(yt=!0):(yt=!0,We.__version=le.version);let Bn=We.currentProgram;yt===!0&&(Bn=Ks(le,ee,ae),Z&&le.isNodeMaterial&&Z.onUpdateProgram(le,Bn,We));let Vn=!1,St=!1,rr=!1;const Ut=Bn.getUniforms(),$t=We.uniforms;if(ke.useProgram(Bn.program)&&(Vn=!0,St=!0,rr=!0),le.id!==Y&&(Y=le.id,St=!0),We.needsLights){const Ot=pl(I.state.lightProbeGridArray,ae);We.lightProbeGrid!==Ot&&(We.lightProbeGrid=Ot,St=!0)}if(Vn||j!==D){ke.buffers.depth.getReversed()&&D.reversedDepth!==!0&&(D._reversedDepth=!0,D.updateProjectionMatrix()),Ut.setValue(Q,"projectionMatrix",D.projectionMatrix),Ut.setValue(Q,"viewMatrix",D.matrixWorldInverse);const xi=Ut.map.cameraPosition;xi!==void 0&&xi.setValue(Q,pt.setFromMatrixPosition(D.matrixWorld)),Pt.logarithmicDepthBuffer&&Ut.setValue(Q,"logDepthBufFC",2/(Math.log(D.far+1)/Math.LN2)),(le.isMeshPhongMaterial||le.isMeshToonMaterial||le.isMeshLambertMaterial||le.isMeshBasicMaterial||le.isMeshStandardMaterial||le.isShaderMaterial)&&Ut.setValue(Q,"isOrthographic",D.isOrthographicCamera===!0),j!==D&&(j=D,St=!0,rr=!0)}if(We.needsLights&&(yn.state.directionalShadowMap.length>0&&Ut.setValue(Q,"directionalShadowMap",yn.state.directionalShadowMap,A),yn.state.spotShadowMap.length>0&&Ut.setValue(Q,"spotShadowMap",yn.state.spotShadowMap,A),yn.state.pointShadowMap.length>0&&Ut.setValue(Q,"pointShadowMap",yn.state.pointShadowMap,A)),ae.isSkinnedMesh){Ut.setOptional(Q,ae,"bindMatrix"),Ut.setOptional(Q,ae,"bindMatrixInverse");const Ot=ae.skeleton;Ot&&(Ot.boneTexture===null&&Ot.computeBoneTexture(),Ut.setValue(Q,"boneTexture",Ot.boneTexture,A))}ae.isBatchedMesh&&(Ut.setOptional(Q,ae,"batchingTexture"),Ut.setValue(Q,"batchingTexture",ae._matricesTexture,A),Ut.setOptional(Q,ae,"batchingIdTexture"),Ut.setValue(Q,"batchingIdTexture",ae._indirectTexture,A),Ut.setOptional(Q,ae,"batchingColorTexture"),ae._colorsTexture!==null&&Ut.setValue(Q,"batchingColorTexture",ae._colorsTexture,A));const _i=fe.morphAttributes;if((_i.position!==void 0||_i.normal!==void 0||_i.color!==void 0)&&at.update(ae,fe,Bn),(St||We.receiveShadow!==ae.receiveShadow)&&(We.receiveShadow=ae.receiveShadow,Ut.setValue(Q,"receiveShadow",ae.receiveShadow)),(le.isMeshStandardMaterial||le.isMeshLambertMaterial||le.isMeshPhongMaterial)&&le.envMap===null&&ee.environment!==null&&($t.envMapIntensity.value=ee.environmentIntensity),$t.dfgLUT!==void 0&&($t.dfgLUT.value=LN()),St){if(Ut.setValue(Q,"toneMappingExposure",X.toneMappingExposure),We.needsLights&&$u($t,rr),Fe&&le.fog===!0&&me.refreshFogUniforms($t,Fe),me.refreshMaterialUniforms($t,le,Se,ye,I.state.transmissionRenderTarget[D.id]),We.needsLights&&We.lightProbeGrid){const Ot=We.lightProbeGrid;$t.probesSH.value=Ot.texture,$t.probesMin.value.copy(Ot.boundingBox.min),$t.probesMax.value.copy(Ot.boundingBox.max),$t.probesResolution.value.copy(Ot.resolution)}cu.upload(Q,aa(We),$t,A)}if(le.isShaderMaterial&&le.uniformsNeedUpdate===!0&&(cu.upload(Q,aa(We),$t,A),le.uniformsNeedUpdate=!1),le.isSpriteMaterial&&Ut.setValue(Q,"center",ae.center),Ut.setValue(Q,"modelViewMatrix",ae.modelViewMatrix),Ut.setValue(Q,"normalMatrix",ae.normalMatrix),Ut.setValue(Q,"modelMatrix",ae.matrixWorld),le.uniformsGroups!==void 0){const Ot=le.uniformsGroups;for(let xi=0,Fi=Ot.length;xi<Fi;xi++){const _s=Ot[xi];ve.update(_s,Bn),ve.bind(_s,Bn)}}return Bn}function $u(D,ee){D.ambientLightColor.needsUpdate=ee,D.lightProbe.needsUpdate=ee,D.directionalLights.needsUpdate=ee,D.directionalLightShadows.needsUpdate=ee,D.pointLights.needsUpdate=ee,D.pointLightShadows.needsUpdate=ee,D.spotLights.needsUpdate=ee,D.spotLightShadows.needsUpdate=ee,D.rectAreaLights.needsUpdate=ee,D.hemisphereLights.needsUpdate=ee}function Yu(D){return D.isMeshLambertMaterial||D.isMeshToonMaterial||D.isMeshPhongMaterial||D.isMeshStandardMaterial||D.isShadowMaterial||D.isShaderMaterial&&D.lights===!0}this.getActiveCubeFace=function(){return ne},this.getActiveMipmapLevel=function(){return ce},this.getRenderTarget=function(){return G},this.setRenderTargetTextures=function(D,ee,fe){const le=U.get(D);le.__autoAllocateDepthBuffer=D.resolveDepthBuffer===!1,le.__autoAllocateDepthBuffer===!1&&(le.__useRenderToTexture=!1),U.get(D.texture).__webglTexture=ee,U.get(D.depthTexture).__webglTexture=le.__autoAllocateDepthBuffer?void 0:fe,le.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(D,ee){const fe=U.get(D);fe.__webglFramebuffer=ee,fe.__useDefaultFramebuffer=ee===void 0};const Qt=Q.createFramebuffer();this.setRenderTarget=function(D,ee=0,fe=0){G=D,ne=ee,ce=fe;let le=null,ae=!1,Fe=!1;if(D){const Ie=U.get(D);if(Ie.__useDefaultFramebuffer!==void 0){ke.bindFramebuffer(Q.FRAMEBUFFER,Ie.__webglFramebuffer),W.copy(D.viewport),z.copy(D.scissor),$=D.scissorTest,ke.viewport(W),ke.scissor(z),ke.setScissorTest($),Y=-1;return}else if(Ie.__webglFramebuffer===void 0)A.setupRenderTarget(D);else if(Ie.__hasExternalTextures)A.rebindTextures(D,U.get(D.texture).__webglTexture,U.get(D.depthTexture).__webglTexture);else if(D.depthBuffer){const mt=D.depthTexture;if(Ie.__boundDepthTexture!==mt){if(mt!==null&&U.has(mt)&&(D.width!==mt.image.width||D.height!==mt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(D)}}const qe=D.texture;(qe.isData3DTexture||qe.isDataArrayTexture||qe.isCompressedArrayTexture)&&(Fe=!0);const tt=U.get(D).__webglFramebuffer;D.isWebGLCubeRenderTarget?(Array.isArray(tt[ee])?le=tt[ee][fe]:le=tt[ee],ae=!0):D.samples>0&&A.useMultisampledRTT(D)===!1?le=U.get(D).__webglMultisampledFramebuffer:Array.isArray(tt)?le=tt[fe]:le=tt,W.copy(D.viewport),z.copy(D.scissor),$=D.scissorTest}else W.copy(pe).multiplyScalar(Se).floor(),z.copy(oe).multiplyScalar(Se).floor(),$=Ae;if(fe!==0&&(le=Qt),ke.bindFramebuffer(Q.FRAMEBUFFER,le)&&ke.drawBuffers(D,le),ke.viewport(W),ke.scissor(z),ke.setScissorTest($),ae){const Ie=U.get(D.texture);Q.framebufferTexture2D(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Ie.__webglTexture,fe)}else if(Fe){const Ie=ee;for(let qe=0;qe<D.textures.length;qe++){const tt=U.get(D.textures[qe]);Q.framebufferTextureLayer(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0+qe,tt.__webglTexture,fe,Ie)}}else if(D!==null&&fe!==0){const Ie=U.get(D.texture);Q.framebufferTexture2D(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_2D,Ie.__webglTexture,fe)}Y=-1},this.readRenderTargetPixels=function(D,ee,fe,le,ae,Fe,Xe,Ie=0){if(!(D&&D.isWebGLRenderTarget)){At("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let qe=U.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Xe!==void 0&&(qe=qe[Xe]),qe){ke.bindFramebuffer(Q.FRAMEBUFFER,qe);try{const tt=D.textures[Ie],mt=tt.format,gt=tt.type;if(D.textures.length>1&&Q.readBuffer(Q.COLOR_ATTACHMENT0+Ie),!Pt.textureFormatReadable(mt)){At("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Pt.textureTypeReadable(gt)){At("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}ee>=0&&ee<=D.width-le&&fe>=0&&fe<=D.height-ae&&Q.readPixels(ee,fe,le,ae,q.convert(mt),q.convert(gt),Fe)}finally{const tt=G!==null?U.get(G).__webglFramebuffer:null;ke.bindFramebuffer(Q.FRAMEBUFFER,tt)}}},this.readRenderTargetPixelsAsync=async function(D,ee,fe,le,ae,Fe,Xe,Ie=0){if(!(D&&D.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let qe=U.get(D).__webglFramebuffer;if(D.isWebGLCubeRenderTarget&&Xe!==void 0&&(qe=qe[Xe]),qe)if(ee>=0&&ee<=D.width-le&&fe>=0&&fe<=D.height-ae){ke.bindFramebuffer(Q.FRAMEBUFFER,qe);const tt=D.textures[Ie],mt=tt.format,gt=tt.type;if(D.textures.length>1&&Q.readBuffer(Q.COLOR_ATTACHMENT0+Ie),!Pt.textureFormatReadable(mt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Pt.textureTypeReadable(gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Je=Q.createBuffer();Q.bindBuffer(Q.PIXEL_PACK_BUFFER,Je),Q.bufferData(Q.PIXEL_PACK_BUFFER,Fe.byteLength,Q.STREAM_READ),Q.readPixels(ee,fe,le,ae,q.convert(mt),q.convert(gt),0);const Tt=G!==null?U.get(G).__webglFramebuffer:null;ke.bindFramebuffer(Q.FRAMEBUFFER,Tt);const jt=Q.fenceSync(Q.SYNC_GPU_COMMANDS_COMPLETE,0);return Q.flush(),await ZR(Q,jt,4),Q.bindBuffer(Q.PIXEL_PACK_BUFFER,Je),Q.getBufferSubData(Q.PIXEL_PACK_BUFFER,0,Fe),Q.deleteBuffer(Je),Q.deleteSync(jt),Fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(D,ee=null,fe=0){const le=Math.pow(2,-fe),ae=Math.floor(D.image.width*le),Fe=Math.floor(D.image.height*le),Xe=ee!==null?ee.x:0,Ie=ee!==null?ee.y:0;A.setTexture2D(D,0),Q.copyTexSubImage2D(Q.TEXTURE_2D,fe,0,0,Xe,Ie,ae,Fe),ke.unbindTexture()};const Ku=Q.createFramebuffer(),ca=Q.createFramebuffer();this.copyTextureToTexture=function(D,ee,fe=null,le=null,ae=0,Fe=0){let Xe,Ie,qe,tt,mt,gt,Je,Tt,jt;const qt=D.isCompressedTexture?D.mipmaps[Fe]:D.image;if(fe!==null)Xe=fe.max.x-fe.min.x,Ie=fe.max.y-fe.min.y,qe=fe.isBox3?fe.max.z-fe.min.z:1,tt=fe.min.x,mt=fe.min.y,gt=fe.isBox3?fe.min.z:0;else{const $t=Math.pow(2,-ae);Xe=Math.floor(qt.width*$t),Ie=Math.floor(qt.height*$t),D.isDataArrayTexture?qe=qt.depth:D.isData3DTexture?qe=Math.floor(qt.depth*$t):qe=1,tt=0,mt=0,gt=0}le!==null?(Je=le.x,Tt=le.y,jt=le.z):(Je=0,Tt=0,jt=0);const Ft=q.convert(ee.format),an=q.convert(ee.type);let We;ee.isData3DTexture?(A.setTexture3D(ee,0),We=Q.TEXTURE_3D):ee.isDataArrayTexture||ee.isCompressedArrayTexture?(A.setTexture2DArray(ee,0),We=Q.TEXTURE_2D_ARRAY):(A.setTexture2D(ee,0),We=Q.TEXTURE_2D),ke.activeTexture(Q.TEXTURE0),ke.pixelStorei(Q.UNPACK_FLIP_Y_WEBGL,ee.flipY),ke.pixelStorei(Q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ee.premultiplyAlpha),ke.pixelStorei(Q.UNPACK_ALIGNMENT,ee.unpackAlignment);const yn=ke.getParameter(Q.UNPACK_ROW_LENGTH),yt=ke.getParameter(Q.UNPACK_IMAGE_HEIGHT),Bn=ke.getParameter(Q.UNPACK_SKIP_PIXELS),Vn=ke.getParameter(Q.UNPACK_SKIP_ROWS),St=ke.getParameter(Q.UNPACK_SKIP_IMAGES);ke.pixelStorei(Q.UNPACK_ROW_LENGTH,qt.width),ke.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,qt.height),ke.pixelStorei(Q.UNPACK_SKIP_PIXELS,tt),ke.pixelStorei(Q.UNPACK_SKIP_ROWS,mt),ke.pixelStorei(Q.UNPACK_SKIP_IMAGES,gt);const rr=D.isDataArrayTexture||D.isData3DTexture,Ut=ee.isDataArrayTexture||ee.isData3DTexture;if(D.isDepthTexture){const $t=U.get(D),_i=U.get(ee),Ot=U.get($t.__renderTarget),xi=U.get(_i.__renderTarget);ke.bindFramebuffer(Q.READ_FRAMEBUFFER,Ot.__webglFramebuffer),ke.bindFramebuffer(Q.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let Fi=0;Fi<qe;Fi++)rr&&(Q.framebufferTextureLayer(Q.READ_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,U.get(D).__webglTexture,ae,gt+Fi),Q.framebufferTextureLayer(Q.DRAW_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,U.get(ee).__webglTexture,Fe,jt+Fi)),Q.blitFramebuffer(tt,mt,Xe,Ie,Je,Tt,Xe,Ie,Q.DEPTH_BUFFER_BIT,Q.NEAREST);ke.bindFramebuffer(Q.READ_FRAMEBUFFER,null),ke.bindFramebuffer(Q.DRAW_FRAMEBUFFER,null)}else if(ae!==0||D.isRenderTargetTexture||U.has(D)){const $t=U.get(D),_i=U.get(ee);ke.bindFramebuffer(Q.READ_FRAMEBUFFER,Ku),ke.bindFramebuffer(Q.DRAW_FRAMEBUFFER,ca);for(let Ot=0;Ot<qe;Ot++)rr?Q.framebufferTextureLayer(Q.READ_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,$t.__webglTexture,ae,gt+Ot):Q.framebufferTexture2D(Q.READ_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_2D,$t.__webglTexture,ae),Ut?Q.framebufferTextureLayer(Q.DRAW_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,_i.__webglTexture,Fe,jt+Ot):Q.framebufferTexture2D(Q.DRAW_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_2D,_i.__webglTexture,Fe),ae!==0?Q.blitFramebuffer(tt,mt,Xe,Ie,Je,Tt,Xe,Ie,Q.COLOR_BUFFER_BIT,Q.NEAREST):Ut?Q.copyTexSubImage3D(We,Fe,Je,Tt,jt+Ot,tt,mt,Xe,Ie):Q.copyTexSubImage2D(We,Fe,Je,Tt,tt,mt,Xe,Ie);ke.bindFramebuffer(Q.READ_FRAMEBUFFER,null),ke.bindFramebuffer(Q.DRAW_FRAMEBUFFER,null)}else Ut?D.isDataTexture||D.isData3DTexture?Q.texSubImage3D(We,Fe,Je,Tt,jt,Xe,Ie,qe,Ft,an,qt.data):ee.isCompressedArrayTexture?Q.compressedTexSubImage3D(We,Fe,Je,Tt,jt,Xe,Ie,qe,Ft,qt.data):Q.texSubImage3D(We,Fe,Je,Tt,jt,Xe,Ie,qe,Ft,an,qt):D.isDataTexture?Q.texSubImage2D(Q.TEXTURE_2D,Fe,Je,Tt,Xe,Ie,Ft,an,qt.data):D.isCompressedTexture?Q.compressedTexSubImage2D(Q.TEXTURE_2D,Fe,Je,Tt,qt.width,qt.height,Ft,qt.data):Q.texSubImage2D(Q.TEXTURE_2D,Fe,Je,Tt,Xe,Ie,Ft,an,qt);ke.pixelStorei(Q.UNPACK_ROW_LENGTH,yn),ke.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,yt),ke.pixelStorei(Q.UNPACK_SKIP_PIXELS,Bn),ke.pixelStorei(Q.UNPACK_SKIP_ROWS,Vn),ke.pixelStorei(Q.UNPACK_SKIP_IMAGES,St),Fe===0&&ee.generateMipmaps&&Q.generateMipmap(We),ke.unbindTexture()},this.initRenderTarget=function(D){U.get(D).__webglFramebuffer===void 0&&A.setupRenderTarget(D)},this.initTexture=function(D){D.isCubeTexture?A.setTextureCube(D,0):D.isData3DTexture?A.setTexture3D(D,0):D.isDataArrayTexture||D.isCompressedArrayTexture?A.setTexture2DArray(D,0):A.setTexture2D(D,0),ke.unbindTexture()},this.resetState=function(){ne=0,ce=0,G=null,ke.reset(),Ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=bt._getDrawingBufferColorSpace(e),t.unpackColorSpace=bt._getUnpackColorSpace()}}const A_={type:"change"},vm={type:"start"},zS={type:"end"},Jc=new gm,R_=new rs,UN=Math.cos(70*eC.DEG2RAD),hn=new ie,Yn=2*Math.PI,Gt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Sh=1e-6;class FN extends kC{constructor(e,t=null){super(e,t),this.state=Gt.NONE,this.target=new ie,this.cursor=new ie,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ho.ROTATE,MIDDLE:Ho.DOLLY,RIGHT:Ho.PAN},this.touches={ONE:Bo.ROTATE,TWO:Bo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new ie,this._lastQuaternion=new ds,this._lastTargetPosition=new ie,this._quat=new ds().setFromUnitVectors(e.up,new ie(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new t_,this._sphericalDelta=new t_,this._scale=1,this._panOffset=new ie,this._rotateStart=new ft,this._rotateEnd=new ft,this._rotateDelta=new ft,this._panStart=new ft,this._panEnd=new ft,this._panDelta=new ft,this._dollyStart=new ft,this._dollyEnd=new ft,this._dollyDelta=new ft,this._dollyDirection=new ie,this._mouse=new ft,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=kN.bind(this),this._onPointerDown=ON.bind(this),this._onPointerUp=zN.bind(this),this._onContextMenu=XN.bind(this),this._onMouseWheel=GN.bind(this),this._onKeyDown=HN.bind(this),this._onTouchStart=WN.bind(this),this._onTouchMove=jN.bind(this),this._onMouseDown=BN.bind(this),this._onMouseMove=VN.bind(this),this._interceptControlDown=$N.bind(this),this._interceptControlUp=YN.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction=""}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(A_),this.update(),this.state=Gt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;hn.copy(t).sub(this.target),hn.applyQuaternion(this._quat),this._spherical.setFromVector3(hn),this.autoRotate&&this.state===Gt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let r=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(r)&&isFinite(o)&&(r<-Math.PI?r+=Yn:r>Math.PI&&(r-=Yn),o<-Math.PI?o+=Yn:o>Math.PI&&(o-=Yn),r<=o?this._spherical.theta=Math.max(r,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(r+o)/2?Math.max(r,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const c=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=c!=this._spherical.radius}if(hn.setFromSpherical(this._spherical),hn.applyQuaternion(this._quatInverse),t.copy(this.target).add(hn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let c=null;if(this.object.isPerspectiveCamera){const f=hn.length();c=this._clampDistance(f*this._scale);const h=f-c;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),a=!!h}else if(this.object.isOrthographicCamera){const f=new ie(this._mouse.x,this._mouse.y,0);f.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=h!==this.object.zoom;const d=new ie(this._mouse.x,this._mouse.y,0);d.unproject(this.object),this.object.position.sub(d).add(f),this.object.updateMatrixWorld(),c=hn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;c!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(c).add(this.object.position):(Jc.origin.copy(this.object.position),Jc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Jc.direction))<UN?this.object.lookAt(this.target):(R_.setFromNormalAndCoplanarPoint(this.object.up,this.target),Jc.intersectPlane(R_,this.target))))}else if(this.object.isOrthographicCamera){const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),c!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Sh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Sh||this._lastTargetPosition.distanceToSquared(this.target)>Sh?(this.dispatchEvent(A_),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Yn/60*this.autoRotateSpeed*e:Yn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){hn.setFromMatrixColumn(t,0),hn.multiplyScalar(-e),this._panOffset.add(hn)}_panUp(e,t){this.screenSpacePanning===!0?hn.setFromMatrixColumn(t,1):(hn.setFromMatrixColumn(t,0),hn.crossVectors(this.object.up,hn)),hn.multiplyScalar(e),this._panOffset.add(hn)}_pan(e,t){const r=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;hn.copy(o).sub(this.target);let a=hn.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/r.clientHeight,this.object.matrix),this._panUp(2*t*a/r.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/r.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/r.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const r=this.domElement.getBoundingClientRect(),o=e-r.left,a=t-r.top,c=r.width,f=r.height;this._mouse.x=o/c*2-1,this._mouse.y=-(a/f)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Yn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Yn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Yn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),r=.5*(e.pageX+t.x),o=.5*(e.pageY+t.y);this._rotateStart.set(r,o)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),r=.5*(e.pageX+t.x),o=.5*(e.pageY+t.y);this._panStart.set(r,o)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),r=e.pageX-t.x,o=e.pageY-t.y,a=Math.sqrt(r*r+o*o);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const r=this._getSecondPointerPosition(e),o=.5*(e.pageX+r.x),a=.5*(e.pageY+r.y);this._rotateEnd.set(o,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Yn*this._rotateDelta.x/t.clientHeight),this._rotateUp(Yn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),r=.5*(e.pageX+t.x),o=.5*(e.pageY+t.y);this._panEnd.set(r,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),r=e.pageX-t.x,o=e.pageY-t.y,a=Math.sqrt(r*r+o*o);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const c=(e.pageX+t.x)*.5,f=(e.pageY+t.y)*.5;this._updateZoomParameters(c,f)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ft,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,r={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:r.deltaY*=16;break;case 2:r.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(r.deltaY*=10),r}}function ON(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function kN(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function zN(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(zS),this.state=Gt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function BN(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ho.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=Gt.DOLLY;break;case Ho.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Gt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Gt.ROTATE}break;case Ho.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=Gt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=Gt.PAN}break;default:this.state=Gt.NONE}this.state!==Gt.NONE&&this.dispatchEvent(vm)}function VN(n){switch(this.state){case Gt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case Gt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case Gt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function GN(n){this.enabled===!1||this.enableZoom===!1||this.state!==Gt.NONE||(n.preventDefault(),this.dispatchEvent(vm),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(zS))}function HN(n){this.enabled!==!1&&this._handleKeyDown(n)}function WN(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Bo.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=Gt.TOUCH_ROTATE;break;case Bo.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=Gt.TOUCH_PAN;break;default:this.state=Gt.NONE}break;case 2:switch(this.touches.TWO){case Bo.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=Gt.TOUCH_DOLLY_PAN;break;case Bo.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=Gt.TOUCH_DOLLY_ROTATE;break;default:this.state=Gt.NONE}break;default:this.state=Gt.NONE}this.state!==Gt.NONE&&this.dispatchEvent(vm)}function jN(n){switch(this._trackPointer(n),this.state){case Gt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case Gt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case Gt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case Gt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=Gt.NONE}}function XN(n){this.enabled!==!1&&n.preventDefault()}function $N(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function YN(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const KN="Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes, far away up the hill. It was 3am that day, cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write, I write like a ritual over and over. The more exist the more I go I fly, they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time.",qN={repulsion:1500,springK:.06,damping:.88,minSpeed:.5},BS=L.forwardRef(function({isPlaying:e,playheadPosition:t,inputText:r=KN,physicsParams:o=qN,colorSettings:a={hueStart:180,hueEnd:120,saturation:75,lightness:65},styleSettings:c={edgeOpacity:.85,edgeWidth:2,nodeScale:1},cameraSnapshots:f=[]},h){const d=L.useRef(null),v=L.useRef(),g=L.useRef(),m=L.useRef(),_=L.useRef(),M=L.useRef(new Map),E=L.useRef([]),y=L.useRef(),x=L.useRef(1/0),T=L.useRef(-1/0),N=L.useRef(!0),C=L.useRef(0),k=L.useRef(t),I=L.useRef(f),F=L.useRef(e),b=L.useRef(null);L.useImperativeHandle(h,()=>({getCameraSnapshot:()=>!g.current||!_.current?null:{position:{x:g.current.position.x,y:g.current.position.y,z:g.current.position.z},target:{x:_.current.target.x,y:_.current.target.y,z:_.current.target.z}}})),L.useEffect(()=>{k.current=t},[t]),L.useEffect(()=>{I.current=f,b.current=null},[f]),L.useEffect(()=>{F.current=e},[e]);const O=z=>z.replace(/[,!?;:()"""]/g,"").replace(/\n+/g," ").trim().toUpperCase(),X=z=>z.split(/[.!?]+/).map($=>$.trim()).filter(Boolean),B=(z,$,P)=>{const V=z.length;for(let ge=0;ge<V;ge++)for(let ye=ge+1;ye<=V;ye++){const Se=z.slice(ge,ye).join(" ");P.has(Se)?P.get(Se).sentenceIds.add($):P.set(Se,{label:Se,wordCount:ye-ge,sentenceIds:new Set([$]),x:0,y:0,z:0,vx:0,vy:0,vz:0})}},Z=(z,$,P)=>{const V=z.length;for(let ge=0;ge<V;ge++)for(let ye=ge+1;ye<=V;ye++){if(ye-ge<=1)continue;const Se=z.slice(ge,ye).join(" "),te=$.get(Se);if(!te)continue;const he=z.slice(ge+1,ye).join(" "),pe=$.get(he),oe=z.slice(ge,ye-1).join(" "),Ae=$.get(oe);pe&&!P.some(Te=>Te.a===te&&Te.b===pe||Te.a===pe&&Te.b===te)&&P.push({a:te,b:pe}),Ae&&!P.some(Te=>Te.a===te&&Te.b===Ae||Te.a===Ae&&Te.b===te)&&P.push({a:te,b:Ae})}},ne=z=>{const $=new Map,P=[],V=O(z),ge=X(V);ge.forEach((te,he)=>{const pe=te.split(/\s+/).filter(Boolean);B(pe,he,$)}),ge.forEach(te=>{const he=te.split(/\s+/).filter(Boolean);Z(he,$,P)});let ye=1/0,Se=-1/0;return $.forEach(te=>{ye=Math.min(ye,te.wordCount),Se=Math.max(Se,te.wordCount)}),{nodes:$,edges:P,minWords:ye,maxWords:Se}},ce=(z,$,P)=>{Array.from(z.values()).forEach(ge=>{const ye=P!==$?(ge.wordCount-$)/(P-$):.5,he=300+400*Math.pow(ye,.4)*(.7+Math.random()*.6),pe=Math.random()*Math.PI*2,oe=Math.acos(2*Math.random()-1);ge.x=he*Math.sin(oe)*Math.cos(pe),ge.y=he*Math.sin(oe)*Math.sin(pe)+400,ge.z=he*Math.cos(oe),ge.vx=(Math.random()-.5)*3,ge.vy=(Math.random()-.5)*3,ge.vz=(Math.random()-.5)*3})},G=(z,$,P)=>{const V=Array.from(z.values()),{repulsion:ge,springK:ye,damping:Se,minSpeed:te}=P;V.forEach(oe=>{oe.vx*=Se,oe.vy*=Se,oe.vz*=Se});for(let oe=0;oe<V.length;oe++)for(let Ae=oe+1;Ae<V.length;Ae++){const Te=V[oe],rt=V[Ae],Be=Te.x-rt.x,Qe=Te.y-rt.y,pt=Te.z-rt.z,st=Be*Be+Qe*Qe+pt*pt+1,Ct=Math.sqrt(st);let wt=!1;Te.sentenceIds.forEach(U=>{rt.sentenceIds.has(U)&&(wt=!0)});const Wt=wt?.6:1.5,zt=1+Math.abs(Te.wordCount-rt.wordCount)*.15;let ut=ge*Wt*zt/st;ut=Math.min(ut,40);const Pt=Be/Ct*ut,ke=Qe/Ct*ut,Bt=pt/Ct*ut;Te.vx+=Pt,Te.vy+=ke,Te.vz+=Bt,rt.vx-=Pt,rt.vy-=ke,rt.vz-=Bt}$.forEach(oe=>{const Ae=oe.b.x-oe.a.x,Te=oe.b.y-oe.a.y,rt=oe.b.z-oe.a.z,Be=Ae*ye,Qe=Te*ye,pt=rt*ye;oe.a.vx+=Be,oe.a.vy+=Qe,oe.a.vz+=pt,oe.b.vx-=Be,oe.b.vy-=Qe,oe.b.vz-=pt});const he=20;let pe=0;return V.forEach(oe=>{const Ae=Math.sqrt(oe.vx*oe.vx+oe.vy*oe.vy+oe.vz*oe.vz);Ae>he&&(oe.vx=oe.vx/Ae*he,oe.vy=oe.vy/Ae*he,oe.vz=oe.vz/Ae*he),Ae>te&&(oe.x+=oe.vx,oe.y+=oe.vy,oe.z+=oe.vz,pe+=Ae),oe.textSprite&&oe.textSprite.position.set(oe.x,oe.y,oe.z)}),$.forEach(oe=>{if(oe.line){const Ae=oe.line.geometry.attributes.position;Ae.setXYZ(0,oe.a.x,oe.a.y,oe.a.z),Ae.setXYZ(1,oe.b.x,oe.b.y,oe.b.z),Ae.needsUpdate=!0}}),pe/V.length},Y=(z,$)=>{const P=document.createElement("canvas"),V=P.getContext("2d"),ge=z.split(" "),ye=28,Se=ye*1.2,te=14,he=3;V.font=`600 ${ye}px "Space Grotesk", sans-serif`;const oe=Math.max(...ge.map(wt=>V.measureText(wt).width))+te*2,Ae=ge.length*Se+te*2;P.width=oe*he,P.height=Ae*he,V.scale(he,he),V.fillStyle="#0a0b0d",V.fillRect(0,0,oe,Ae),V.strokeStyle=$,V.lineWidth=2,V.strokeRect(1,1,oe-2,Ae-2),V.font=`600 ${ye}px "Space Grotesk", sans-serif`,V.fillStyle=$,V.textAlign="center",V.textBaseline="middle",ge.forEach((wt,Wt)=>{const Q=te+Se/2+Wt*Se;V.fillText(wt,oe/2,Q)});const Te=new AC(P);Te.needsUpdate=!0;const rt=new SS({map:Te,transparent:!0}),Be=new yC(rt),Qe=z.split(" ").length,pt=Math.max(.4,1-Qe*.05),st=Math.max(oe,Ae)/2.5*pt,Ct=Ae/oe;return Be.scale.set(st,st*Ct,1),Be.userData.baseScale=st,Be.userData.aspectRatio=Ct,Be},j=(z,$,P,V)=>{const ge=P!==$?(z-$)/(P-$):.5;return`hsl(${V.hueStart+(V.hueEnd-V.hueStart)*ge}, ${V.saturation}%, ${V.lightness}%)`},W=(z,$)=>{if(!g.current||!_.current||z.length===0)return;const P=[...z].sort((Qe,pt)=>Qe.time-pt.time);let V=P[0],ge=P[P.length-1];if(P.length===1||$<=P[0].time)V=P[0],ge=P[0];else if($>=P[P.length-1].time)V=P[P.length-1],ge=P[P.length-1];else for(let Qe=0;Qe<P.length-1;Qe++)if(P[Qe].time<=$&&P[Qe+1].time>=$){V=P[Qe],ge=P[Qe+1];break}const ye=ge.time-V.time,Se=$-V.time,te=ye>0?Math.max(0,Math.min(1,Se/ye)):0,he=te<.5?2*te*te:1-Math.pow(-2*te+2,2)/2,pe=V.position.x+(ge.position.x-V.position.x)*he,oe=V.position.y+(ge.position.y-V.position.y)*he,Ae=V.position.z+(ge.position.z-V.position.z)*he,Te=V.target.x+(ge.target.x-V.target.x)*he,rt=V.target.y+(ge.target.y-V.target.y)*he,Be=V.target.z+(ge.target.z-V.target.z)*he;g.current.position.set(pe,oe,Ae),_.current.target.set(Te,rt,Be),g.current.lookAt(_.current.target)};return L.useEffect(()=>{if(!d.current)return;const z=new pC;z.background=new Lt(855568),v.current=z;const $=new hi(50,d.current.clientWidth/d.current.clientHeight,1,15e3);$.position.set(1200,800,1500),$.lookAt(0,400,0),g.current=$;const P=new IN({antialias:!0});P.setSize(d.current.clientWidth,d.current.clientHeight),P.setPixelRatio(window.devicePixelRatio),d.current.appendChild(P.domElement),m.current=P;const V=new FN($,P.domElement);V.enableDamping=!0,V.dampingFactor=.05,V.minDistance=10,V.maxDistance=5e4,V.target.set(0,400,0),V.update(),_.current=V;const{nodes:ge,edges:ye,minWords:Se,maxWords:te}=ne(r);ce(ge,Se,te),M.current=ge,E.current=ye,x.current=Se,T.current=te;const he=new bS({color:10133674,opacity:c.edgeOpacity,transparent:!0,linewidth:c.edgeWidth});ye.forEach(Te=>{const rt=[new ie(Te.a.x,Te.a.y,Te.a.z),new ie(Te.b.x,Te.b.y,Te.b.z)],Be=new vi().setFromPoints(rt),Qe=new TC(Be,he);z.add(Qe),Te.line=Qe}),ge.forEach(Te=>{const rt=j(Te.wordCount,Se,te,a),Be=Y(Te.label,rt);Be.position.set(Te.x,Te.y,Te.z);const Qe=Be.userData.baseScale||1,pt=Be.userData.aspectRatio||1;Be.scale.set(Qe*c.nodeScale,Qe*c.nodeScale*pt,1),z.add(Be),Te.textSprite=Be});let pe=Date.now();const oe=()=>{y.current=requestAnimationFrame(oe);const Te=Date.now(),rt=(Te-pe)/16.67;pe=Te,rt<5&&N.current&&(G(M.current,E.current,o)<.5?(C.current++,C.current>60&&(N.current=!1,console.log("Physics stabilized and paused"))):C.current=0);const Be=k.current,Qe=I.current;(F.current||Be!==b.current)&&(W(Qe,Be),b.current=Be),_.current&&_.current.update(),P.render(z,$)};oe();const Ae=()=>{!d.current||!$||!P||($.aspect=d.current.clientWidth/d.current.clientHeight,$.updateProjectionMatrix(),P.setSize(d.current.clientWidth,d.current.clientHeight))};return window.addEventListener("resize",Ae),()=>{window.removeEventListener("resize",Ae),y.current&&cancelAnimationFrame(y.current),_.current&&_.current.dispose(),m.current&&d.current&&(d.current.removeChild(m.current.domElement),m.current.dispose())}},[r]),L.useEffect(()=>{N.current=!0,C.current=0},[o]),L.useEffect(()=>{if(!v.current||M.current.size===0)return;const z=M.current,$=x.current,P=T.current;z.forEach(V=>{if(V.textSprite){const ge=j(V.wordCount,$,P,a),ye=Y(V.label,ge);ye.position.copy(V.textSprite.position);const Se=ye.userData.baseScale||1,te=ye.userData.aspectRatio||1;ye.scale.set(Se*c.nodeScale,Se*c.nodeScale*te,1),v.current.remove(V.textSprite),v.current.add(ye),V.textSprite=ye}})},[a]),L.useEffect(()=>{M.current.size&&M.current.forEach(z=>{if(z.textSprite){const $=z.textSprite.userData.baseScale||1,P=z.textSprite.userData.aspectRatio||1;z.textSprite.scale.set($*c.nodeScale,$*c.nodeScale*P,1)}})},[c.nodeScale]),L.useEffect(()=>{E.current.forEach(z=>{z.line&&(z.line.material.opacity=c.edgeOpacity,z.line.material.linewidth=c.edgeWidth,z.line.material.needsUpdate=!0)})},[c.edgeOpacity,c.edgeWidth]),w.jsx("div",{ref:d,className:"w-full h-full"})});BS.displayName="Network3D";const C_=[{id:"die",label:"Die",x:41,y:52,r:3.5,bright:!1},{id:"blaue",label:"blaue",x:31,y:37,r:4.5,bright:!0},{id:"insel",label:"Insel",x:50,y:27,r:5,bright:!0},{id:"geht",label:"geht",x:60,y:46,r:3,bright:!1},{id:"einsam",label:"einsam",x:52,y:62,r:4.5,bright:!0},{id:"in",label:"in",x:68,y:39,r:2.5,bright:!1},{id:"die2",label:"die",x:75,y:30,r:2.5,bright:!1},{id:"ferne",label:"Ferne",x:83,y:21,r:4.5,bright:!0},{id:"stille",label:"Stille",x:24,y:20,r:3,bright:!1},{id:"wellen",label:"Wellen",x:17,y:57,r:3,bright:!1},{id:"wind",label:"Wind",x:65,y:64,r:3,bright:!1},{id:"dunkel",label:"Dunkelheit",x:79,y:69,r:2.5,bright:!1},{id:"meer",label:"Meer",x:13,y:43,r:3,bright:!1},{id:"horizont",label:"Horizont",x:73,y:15,r:2.5,bright:!1},{id:"blau",label:"Blau",x:20,y:29,r:3,bright:!1}],ZN=[["die","blaue"],["die","insel"],["blaue","insel"],["blaue","blau"],["blaue","wellen"],["blaue","meer"],["insel","geht"],["insel","stille"],["geht","einsam"],["geht","in"],["in","die2"],["die2","ferne"],["ferne","horizont"],["ferne","dunkel"],["einsam","wind"],["wind","dunkel"],["meer","wellen"],["blau","stille"]];function QN({isPlaying:n,phase:e}){const t=Object.fromEntries(C_.map(r=>[r.id,r]));return w.jsxs("svg",{className:"absolute inset-0 w-full h-full pointer-events-none",viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid meet",children:[w.jsxs("defs",{children:[w.jsxs("filter",{id:"glow",children:[w.jsx("feGaussianBlur",{stdDeviation:"0.6",result:"blur"}),w.jsxs("feMerge",{children:[w.jsx("feMergeNode",{in:"blur"}),w.jsx("feMergeNode",{in:"SourceGraphic"})]})]}),w.jsxs("filter",{id:"glow-strong",children:[w.jsx("feGaussianBlur",{stdDeviation:"1.2",result:"blur"}),w.jsxs("feMerge",{children:[w.jsx("feMergeNode",{in:"blur"}),w.jsx("feMergeNode",{in:"SourceGraphic"})]})]}),w.jsxs("radialGradient",{id:"centerGlow",cx:"50%",cy:"50%",r:"50%",children:[w.jsx("stop",{offset:"0%",stopColor:"#0e7490",stopOpacity:"0.18"}),w.jsx("stop",{offset:"100%",stopColor:"#0e7490",stopOpacity:"0"})]})]}),w.jsx("ellipse",{cx:"50",cy:"42",rx:"38",ry:"28",fill:"url(#centerGlow)"}),ZN.map(([r,o],a)=>{const c=t[r],f=t[o];if(!c||!f)return null;const h=c.bright||f.bright;return w.jsx("line",{x1:c.x,y1:c.y,x2:f.x,y2:f.y,stroke:h?"#3b9eff":"#3f3f46",strokeWidth:h?.18:.12,strokeOpacity:h?.28:.18},a)}),C_.map(r=>{const o=n?Math.sin(e*2+r.x*.3)*.3:0,a=r.y+o;return r.bright?w.jsxs("g",{filter:"url(#glow-strong)",children:[w.jsx("circle",{cx:r.x,cy:a,r:r.r+1.5,fill:"none",stroke:"#3b9eff",strokeWidth:"0.18",strokeOpacity:"0.22"}),w.jsx("circle",{cx:r.x,cy:a,r:r.r,fill:"#0c4a6e",stroke:"#3b9eff",strokeWidth:"0.35",strokeOpacity:"0.8"}),w.jsx("circle",{cx:r.x,cy:a,r:1,fill:"#66b3ff",fillOpacity:"0.7"}),w.jsx("text",{x:r.x,y:a+r.r+2.4,textAnchor:"middle",fontSize:"2.2",fill:"#7dd3fc",fillOpacity:"0.75",fontFamily:"monospace",children:r.label})]},r.id):w.jsxs("g",{children:[w.jsx("circle",{cx:r.x,cy:a,r:r.r,fill:"#1c1c20",stroke:"#3f3f46",strokeWidth:"0.2",strokeOpacity:"0.6"}),w.jsx("text",{x:r.x,y:a+r.r+2.4,textAnchor:"middle",fontSize:"2",fill:"#52525b",fillOpacity:"0.9",fontFamily:"monospace",children:r.label})]},r.id)})]})}const JN=L.forwardRef(function({viewMode:e,physicsEnabled:t,isPlaying:r,playheadPosition:o,physicsParams:a,inputText:c,colorSettings:f,styleSettings:h,cameraSnapshots:d},v){const g=o*.5;return w.jsxs("div",{className:"flex-1 bg-zinc-950 relative overflow-hidden",children:[e==="2D"?w.jsxs(w.Fragment,{children:[w.jsxs("svg",{className:"absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]",xmlns:"http://www.w3.org/2000/svg",children:[w.jsx("defs",{children:w.jsx("pattern",{id:"dots",x:"0",y:"0",width:"24",height:"24",patternUnits:"userSpaceOnUse",children:w.jsx("circle",{cx:"1",cy:"1",r:"0.8",fill:"#a1a1aa"})})}),w.jsx("rect",{width:"100%",height:"100%",fill:"url(#dots)"})]}),w.jsx("div",{className:"absolute inset-0",children:w.jsx(QN,{isPlaying:r,phase:g})}),w.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none",children:w.jsxs("div",{className:"relative opacity-10",children:[w.jsx("div",{className:"absolute w-px h-6 bg-zinc-400 left-1/2 -translate-x-1/2 -top-3"}),w.jsx("div",{className:"absolute h-px w-6 bg-zinc-400 top-1/2 -translate-y-1/2 -left-3"})]})}),w.jsx("div",{className:"absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none",children:w.jsx("span",{className:"text-[9px] text-zinc-700 uppercase tracking-[0.2em]",children:"Preview — Nicht-interaktiver Platzhalter"})})]}):w.jsx("div",{className:"absolute inset-0",children:w.jsx(BS,{ref:v,isPlaying:r,playheadPosition:o,physicsParams:a,inputText:c,colorSettings:f,styleSettings:h,cameraSnapshots:d})}),w.jsxs("div",{className:"absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none z-10",children:[w.jsxs("div",{className:`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-medium ${e==="3D"?"bg-orange-950/60 border-orange-800/50 text-orange-400":"bg-cyan-950/60 border-cyan-800/50 text-cyan-400"}`,children:[w.jsx("div",{className:`w-1 h-1 rounded-full ${e==="3D"?"bg-orange-400":"bg-cyan-400"}`}),e]}),w.jsxs("div",{className:`flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-medium ${t?"bg-orange-950/50 border-orange-800/40 text-orange-400":"bg-zinc-900/80 border-zinc-700/50 text-zinc-600"}`,children:[w.jsx("div",{className:`w-1 h-1 rounded-full ${t?"bg-orange-400":"bg-zinc-600"}`}),"Physik ",t?"An":"Aus"]})]}),r&&w.jsxs("div",{className:"absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded border bg-red-950/40 border-red-800/40 pointer-events-none z-10",children:[w.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"}),w.jsx("span",{className:"text-[10px] text-red-400 font-medium tracking-wide",children:"LIVE"})]}),w.jsxs("div",{className:"absolute bottom-3 right-3 flex flex-col items-end gap-0.5 pointer-events-none z-10",children:[w.jsx("span",{className:"text-[9px] font-mono text-zinc-700",children:"CAM · POS 0 / 0 / 500"}),w.jsx("span",{className:"text-[9px] font-mono text-zinc-700",children:"ROT 0° / 0° / 0°"}),w.jsx("span",{className:"text-[9px] font-mono text-zinc-700",children:"ZOOM 800px"})]})]})}),Er=30,xr=224,eL=[{id:"camera",name:"Camera",color:"cyan",tracks:[{id:"camera-snapshots",name:"Snapshots",kfs:[],graph:!1}]},{id:"physics",name:"Physics",color:"orange",tracks:[{id:"phys-rep",name:"Repulsion",kfs:[],graph:!1},{id:"phys-spk",name:"Spring K",kfs:[],graph:!1},{id:"phys-dmp",name:"Damping",kfs:[],graph:!1}]}],VS={cyan:{dot:"bg-cyan-500",border:"border-l-cyan-500/60",kf:"text-cyan-400",kfFill:"#3b9eff",trackBg:"bg-cyan-950/10",graphStroke:"#007fff"},orange:{dot:"bg-orange-500",border:"border-l-orange-500/60",kf:"text-orange-400",kfFill:"#fb923c",trackBg:"bg-orange-950/10",graphStroke:"#f97316"}};function Mh({label:n,value:e,accent:t=!1}){return w.jsxs("div",{className:"flex flex-col items-center gap-0.5",children:[w.jsx("span",{className:"text-[8px] text-zinc-700 uppercase tracking-widest leading-none",children:n}),w.jsx("div",{className:`px-2 py-[3px] bg-zinc-950 rounded border font-mono text-[11px] text-center tracking-wide ${t?"border-cyan-800/60 ring-1 ring-cyan-800/30 text-cyan-400 min-w-[100px]":"border-zinc-800 text-zinc-600 min-w-[80px]"}`,children:e})]})}function tL({zoom:n}){const e=Er,t=n>=6?1:n>=3?2:5,r=t/5,o=[];for(let a=0;a<=e;a+=r)o.push({t:parseFloat(a.toFixed(4)),major:Math.abs(a%t)<.001});return w.jsx("div",{className:"relative w-full h-full",children:o.map(({t:a,major:c})=>w.jsxs("div",{className:"absolute top-0 flex flex-col items-start",style:{left:`${a/Er*100}%`},children:[w.jsx("div",{className:`w-px ${c?"h-3.5 bg-zinc-600":"h-2 bg-zinc-700"}`}),c&&w.jsx("span",{className:"text-[9px] font-mono text-zinc-600 ml-0.5 mt-0.5 leading-none",children:a%60===0&&a>0?`${a/60}m`:`${a}s`})]},a))})}function nL({kfs:n,color:e}){if(n.length<2)return null;const t=26,r=n.map((a,c)=>({x:a/Er*100,y:c%2===0?t*.8:t*.2}));let o=`M ${r[0].x} ${r[0].y}`;for(let a=1;a<r.length;a++){const c=r[a-1],f=r[a],h=(c.x+f.x)/2;o+=` C ${h} ${c.y} ${h} ${f.y} ${f.x} ${f.y}`}return w.jsx("svg",{className:"absolute inset-0 w-full pointer-events-none",style:{height:t},children:w.jsx("path",{d:o,fill:"none",stroke:e,strokeWidth:"0.8",strokeOpacity:"0.35"})})}function iL({track:n,color:e,selectedKeyframe:t,onKeyframeSelect:r,onMoveKeyframe:o,snap:a,contentRef:c}){const f=VS[e],[h,d]=L.useState(null),v=L.useCallback(g=>{if(!c.current)return null;const m=c.current.getBoundingClientRect(),_=m.width-xr,E=(g-m.left-xr)/_*Er,y=Math.max(0,Math.min(Er,E));return a?Math.round(y*2)/2:y},[a,c]);return L.useEffect(()=>{if(!h)return;const g=_=>{const M=v(_.clientX);M!==null&&o&&(o(n.id,h.time,M),d({...h,time:M}))},m=()=>{d(null)};return window.addEventListener("mousemove",g),window.addEventListener("mouseup",m),()=>{window.removeEventListener("mousemove",g),window.removeEventListener("mouseup",m)}},[h,v,o,n.id]),w.jsxs("div",{className:"flex border-b border-zinc-800/50",style:{height:26},children:[w.jsxs("div",{className:"shrink-0 flex items-center pl-8 pr-2 border-r border-zinc-800 bg-zinc-950 gap-1.5",style:{width:xr},children:[w.jsx("span",{className:"text-[10px] text-zinc-500 flex-1 truncate",children:n.name}),n.graph&&w.jsx("span",{className:"text-[8px] text-zinc-700 bg-zinc-900 border border-zinc-800 rounded px-1",children:"curve"})]}),w.jsxs("div",{className:`flex-1 relative ${f.trackBg}`,children:[n.graph&&w.jsx(nL,{kfs:n.kfs,color:f.graphStroke}),n.kfs.map((g,m)=>{const _=(t==null?void 0:t.track)===n.id&&(t==null?void 0:t.time)===g;return w.jsx("button",{onMouseDown:M=>{M.stopPropagation(),n.id==="camera-snapshots"&&d({time:g,startX:M.clientX}),r(n.id,g)},className:"absolute top-1/2 -translate-y-1/2 -translate-x-1/2 hover:scale-150 transition-transform z-10 cursor-grab active:cursor-grabbing",style:{left:`${g/Er*100}%`},children:w.jsx(L_,{size:10,className:_?`${f.kf} drop-shadow-[0_0_8px_currentColor]`:"text-zinc-500 hover:text-zinc-300 drop-shadow-md",fill:_?f.kfFill:"currentColor",stroke:_?f.kfFill:"currentColor",strokeWidth:_?2:1.5})},`${n.id}-${g}-${m}`)})]})]})}function rL({group:n,expanded:e,onToggle:t,selectedKeyframe:r,onKeyframeSelect:o,cameraSnapshots:a,onMoveKeyframe:c,snap:f,contentRef:h}){const d=VS[n.color];return w.jsxs(w.Fragment,{children:[w.jsxs("div",{className:`flex border-b border-zinc-800 border-l-2 ${d.border}`,style:{height:30},children:[w.jsxs("div",{className:"shrink-0 flex items-center gap-1.5 px-2 cursor-pointer hover:bg-zinc-800/40 transition-colors border-r border-zinc-800",style:{width:xr},onClick:t,children:[w.jsx(uu,{size:12,className:`text-zinc-500 transition-transform duration-150 ${e?"rotate-90":""}`}),w.jsx("div",{className:`w-2 h-2 rounded-full shrink-0 ${d.dot}`}),w.jsx("span",{className:"text-[11px] font-medium text-zinc-200 flex-1 truncate",children:n.name}),w.jsx("button",{className:"opacity-0 hover:opacity-100 transition-opacity",onClick:v=>v.stopPropagation(),children:w.jsx(zE,{size:11,className:"text-zinc-600 hover:text-zinc-400"})}),w.jsx("button",{onClick:v=>v.stopPropagation(),children:w.jsx(HE,{size:11,className:"text-zinc-700 hover:text-zinc-500"})})]}),w.jsx("div",{className:"flex-1 relative",children:w.jsx("div",{className:`absolute inset-y-2 left-0 right-0 rounded-sm opacity-10 ${d.dot}`})})]}),e&&n.tracks.map(v=>{const g=v.id==="camera-snapshots"?a.map(m=>m.time):v.kfs;return w.jsx(iL,{track:{...v,kfs:g},color:n.color,selectedKeyframe:r,onKeyframeSelect:o,onMoveKeyframe:c,snap:f,contentRef:h},v.id)})]})}function sL({playheadPosition:n,onPlayheadChange:e,selectedKeyframe:t,onKeyframeSelect:r,cameraSnapshots:o=[],onCaptureSnapshot:a,onMoveKeyframe:c,timecode:f="00:00:00:00"}){const[h,d]=L.useState({camera:!0,physics:!0}),[v,g]=L.useState([1]),[m,_]=L.useState(!0),[M,E]=L.useState(!1),y=L.useRef(null),x=L.useRef(!1),T=L.useCallback(I=>{if(!y.current)return null;const F=y.current.getBoundingClientRect(),b=F.width-xr,X=(I.clientX-F.left-xr)/b*Er,B=Math.max(0,Math.min(Er,X));return m?Math.round(B*2)/2:B},[m]),N=I=>{x.current=!0;const F=T(I);F!==null&&e(F)};L.useEffect(()=>{const I=()=>{x.current=!1},F=b=>{if(!x.current)return;const O=T(b);O!==null&&e(O)};return window.addEventListener("mouseup",I),window.addEventListener("mousemove",F),()=>{window.removeEventListener("mouseup",I),window.removeEventListener("mousemove",F)}},[T,e]);const C=n/Er,k=`calc(${C*100}% + ${xr*(1-C)}px)`;return w.jsxs("div",{className:"flex flex-col bg-zinc-900 border-t border-zinc-800 shrink-0",style:{height:268},children:[w.jsxs("div",{className:"h-9 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-3 shrink-0",children:[w.jsxs("div",{className:"flex items-center gap-1.5",children:[w.jsxs("button",{className:"flex items-center gap-1 h-6 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] rounded border border-zinc-700/60 transition-colors",children:[w.jsx(q0,{size:10}),"Track"]}),w.jsxs("button",{className:"flex items-center gap-1 h-6 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] rounded border border-zinc-700/60 transition-colors",children:[w.jsx(q0,{size:10}),"Parameter"]}),w.jsxs("button",{onClick:a,className:"flex items-center gap-1 h-6 px-2 bg-cyan-800/30 hover:bg-cyan-700/40 text-cyan-400 hover:text-cyan-300 rounded border border-cyan-700/60 transition-colors text-[10px]",children:[w.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"currentColor",children:w.jsx("path",{d:"M5 0 L10 5 L5 10 L0 5 Z"})}),"Keyframe"]}),w.jsx("div",{className:"h-4 w-px bg-zinc-800 mx-0.5"}),w.jsx("button",{className:"h-6 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 text-[10px] rounded border border-zinc-700/60 transition-colors",children:"Marker"})]}),w.jsxs("div",{className:"flex items-center gap-2.5",children:[w.jsx(Mh,{label:"In",value:"00:00:00:00"}),w.jsx(Mh,{label:"Timecode",value:f,accent:!0}),w.jsx(Mh,{label:"Out",value:"00:00:30:00"})]})]}),w.jsxs("div",{className:"flex-1 overflow-hidden flex flex-col relative",ref:y,children:[w.jsxs("div",{className:"flex shrink-0 border-b border-zinc-800",style:{height:24},children:[w.jsx("div",{className:"shrink-0 bg-zinc-950 border-r border-zinc-800",style:{width:xr}}),w.jsxs("div",{className:"flex-1 relative bg-zinc-950 cursor-col-resize overflow-hidden",onMouseDown:N,children:[w.jsx(tL,{zoom:v[0]}),w.jsxs("div",{className:"absolute top-0 bottom-0 pointer-events-none",style:{left:`${C*100}%`},children:[w.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent border-t-red-500"}),w.jsx("div",{className:"absolute top-1 bottom-0 left-1/2 -translate-x-1/2 w-px bg-red-500/60"})]})]})]}),w.jsxs("div",{className:"flex-1 overflow-y-auto",onMouseDown:N,children:[eL.map(I=>w.jsx(rL,{group:I,expanded:h[I.id],onToggle:()=>d(F=>({...F,[I.id]:!F[I.id]})),selectedKeyframe:t,onKeyframeSelect:r,cameraSnapshots:o,onMoveKeyframe:c,snap:m,contentRef:y},I.id)),w.jsxs("div",{className:"flex border-b border-zinc-800/30",style:{height:16},children:[w.jsx("div",{className:"shrink-0 border-r border-zinc-800",style:{width:xr}}),w.jsx("div",{className:"flex-1"})]})]}),w.jsx("div",{className:"absolute top-0 bottom-0 pointer-events-none z-20",style:{left:k},children:w.jsx("div",{className:"absolute top-0 bottom-0 w-px bg-red-500/70"})})]})]})}function oL(){const[n,e]=L.useState(!1),[t,r]=L.useState("3D"),[o,a]=L.useState(0),[c,f]=L.useState("00:00:00:00"),[h,d]=L.useState(null),[v,g]=L.useState("system"),[m,_]=L.useState("Blue watched as a word or phrase materialised in scintillating sparks. A poetry of fire which casts everything into darkness with the brightness of its reflections. The lemon goblin stares from the unwanted canvasses thrown in a corner. The blue island goes and goes far away up the hill. It was 3am that day cold and blue and full of hope. I write sentences for them to make them bloom. I need more long sentences that make the flowers more flowery. So I write I write like a ritual over and over. The more exist the more I go I fly they slay. They were etching each other in fine copper plates. You can see them today and tomorrow for the first time."),[M,E]=L.useState({hueStart:180,hueEnd:120,saturation:75,lightness:65}),[y,x]=L.useState({edgeOpacity:.85,edgeWidth:2,nodeScale:1}),[T,N]=L.useState({repulsion:1500,springK:.06,damping:.88,minSpeed:.5}),[C,k]=L.useState([]),I=L.useRef(null),F=L.useRef(o);L.useEffect(()=>{F.current=o},[o]);const b=L.useRef(),O=L.useRef(0),X=L.useRef(0);L.useEffect(()=>{if(n){O.current=Date.now(),X.current=o;const G=()=>{const Y=(Date.now()-O.current)/1e3,j=X.current+Y;j>=30?(a(30),e(!1)):(a(j),b.current=requestAnimationFrame(G))};b.current=requestAnimationFrame(G)}else b.current&&cancelAnimationFrame(b.current);return()=>{b.current&&cancelAnimationFrame(b.current)}},[n]),L.useEffect(()=>{const G=Math.floor(o),Y=Math.floor((o-G)*30),j=G%60,W=Math.floor(G/60)%60,z=Math.floor(G/3600);f(`${String(z).padStart(2,"0")}:${String(W).padStart(2,"0")}:${String(j).padStart(2,"0")}:${String(Y).padStart(2,"0")}`)},[o]);const B=()=>e(G=>!G),Z=()=>{e(!1),a(0)},ne=()=>{var j;if(console.log("[Snapshot] click. viewMode=",t,"ref=",I.current),t!=="3D"){console.warn("[Snapshot] aborted: not 3D");return}const G=(j=I.current)==null?void 0:j.getCameraSnapshot();if(console.log("[Snapshot] got snapshot=",G),!G)return;const Y=F.current;k(W=>[...W.filter($=>Math.abs($.time-Y)>.1),{...G,time:Y}].sort(($,P)=>$.time-P.time))},ce=(G,Y,j)=>{G==="camera-snapshots"&&k(W=>W.map(z=>Math.abs(z.time-Y)<.01?{...z,time:j}:z).sort((z,$)=>z.time-$.time))};return L.useEffect(()=>{const G=window.matchMedia("(prefers-color-scheme: dark)"),Y=(j,W)=>{const z=j==="dark"||j==="system"&&W;document.documentElement.classList.toggle("dark",z)};if(Y(v,G.matches),v==="system"){const j=W=>Y("system",W.matches);return G.addEventListener("change",j),()=>G.removeEventListener("change",j)}},[v]),w.jsxs("div",{className:"size-full flex flex-col bg-background text-foreground overflow-hidden",children:[w.jsx(vA,{isPlaying:n,onPlayPause:B,onStop:Z,viewMode:t,onViewModeChange:r,playheadPosition:o,onPlayheadChange:G=>{a(G),n&&e(!1)},theme:v,onThemeChange:g,onSaveState:()=>{const G={inputText:m,colorSettings:M,styleSettings:y,physicsParams:T,viewMode:t,cameraSnapshots:C},Y=new Blob([JSON.stringify(G,null,2)],{type:"application/json"}),j=URL.createObjectURL(Y),W=document.createElement("a");W.href=j,W.download=`sprachvernetzungen-${Date.now()}.json`,W.click(),URL.revokeObjectURL(j)},onLoadState:()=>{const G=document.createElement("input");G.type="file",G.accept=".json",G.onchange=Y=>{var W;const j=(W=Y.target.files)==null?void 0:W[0];if(j){const z=new FileReader;z.onload=$=>{var P;try{const V=JSON.parse((P=$.target)==null?void 0:P.result);V.inputText&&_(V.inputText),V.colorSettings&&E(V.colorSettings),V.styleSettings&&x(V.styleSettings),V.physicsParams&&N(V.physicsParams),V.viewMode&&r(V.viewMode),V.cameraSnapshots&&k(V.cameraSnapshots)}catch(V){console.error("Failed to load state:",V)}},z.readAsText(j)}},G.click()}}),w.jsxs("div",{className:"flex-1 flex overflow-hidden min-h-0",children:[w.jsx(gR,{onPhysicsChange:N,onTextChange:_,onColorChange:E,onStyleChange:x,currentTime:o,cameraSnapshots:C,onDeleteSnapshot:G=>{k(Y=>Y.filter(j=>Math.abs(j.time-G)>.1))}}),w.jsx(JN,{ref:I,viewMode:t,physicsEnabled:!0,isPlaying:n,playheadPosition:o,physicsParams:T,inputText:m,colorSettings:M,styleSettings:y,cameraSnapshots:C})]}),w.jsx(sL,{playheadPosition:o,onPlayheadChange:G=>{a(G),n&&e(!1)},selectedKeyframe:h,onKeyframeSelect:(G,Y)=>d({track:G,time:Y}),cameraSnapshots:C,onCaptureSnapshot:ne,onMoveKeyframe:ce,timecode:c})]})}RE.createRoot(document.getElementById("root")).render(w.jsx(oL,{}));
