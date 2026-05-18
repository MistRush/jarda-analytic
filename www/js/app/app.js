class Alerts {
    constructor() {
        $(() => {
            this.stack = new PNotify.Stack({
                dir1: 'down',
                dir2: 'left',
                firstpos1: 25,
                firstpos2: 25,
                modal: false,
                maxOpen: Infinity,
                delay: 30000,
            });
    
            this.opts = {
                // addModelessClass: 'nonblock',
                styling: 'bootstrap4',
                icons: {
                    prefix: 'fontawesome5',
                    closer: 'fa fa-times',
                },
                closerHover: false,
                closer: true,
                sticker: false,
                stack: this.stack,
                modules: PNotify.defaultModules
            }
        });
    }

    /**
     *
     * @param {string} title Titulek zprávy
     * @param {string} type Typ zprávy (success, error, notice, info)
     * @param {string} text Text zprávy
     */
    alert(title, type = 'info', text = '') {
        this.opts.title = title;
        this.opts.text = text;
        let notify = PNotify[type](this.opts);
        notify.on('click', function () {
            notify.close();
        });
    }

    error() {
        this.alert('Error', 'error');
    }

    success() {
        this.alert('Success', 'success');
    }
}
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.PNotify=e():t.PNotify=e()}(window,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=3)}([function(t,e,n){},,,function(t,e,n){"use strict";function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}function o(t){return function(){var e,n=l(t);if(c()){var i=l(this).constructor;Reflect.construct(n,arguments,i)}else n.apply(this,arguments);return r(this,e)}}function r(t,e){return!e||"object"!==y(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){var e="function"==typeof Map?new Map:void 0;return function(t){if(null===t||(t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,i)}function i(){return a(t,arguments,l(this).constructor)}return i.prototype=Object.create(t.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),u(i,t)}(t)}function a(t,e,n){return(c()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&u(o,n.prototype),o}).apply(null,arguments)}function c(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function u(t,e){return(Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){return(Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function f(t){return function(t){if(Array.isArray(t))return d(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return d(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return d(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function h(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function p(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function m(t,e,n){return e&&p(t.prototype,e),n&&p(t,n),t}function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function v(){}n.r(e),n.d(e,"Stack",(function(){return vt})),n.d(e,"alert",(function(){return ie})),n.d(e,"notice",(function(){return oe})),n.d(e,"info",(function(){return re})),n.d(e,"success",(function(){return se})),n.d(e,"error",(function(){return ae})),n.d(e,"defaultStack",(function(){return le})),n.d(e,"defaultModules",(function(){return fe})),n.d(e,"defaults",(function(){return de}));function g(t,e){for(var n in e)t[n]=e[n];return t}function $(t){return t()}function _(){return Object.create(null)}function x(t){t.forEach($)}function k(t){return"function"==typeof t}function b(t,e){return t!=t?e==e:t!==e||t&&"object"===y(t)||"function"==typeof t}new Set;function w(t,e){t.appendChild(e)}function O(t,e,n){t.insertBefore(e,n||null)}function C(t){t.parentNode.removeChild(t)}function M(t){return document.createElement(t)}function T(t){return document.createTextNode(t)}function S(){return T(" ")}function E(){return T("")}function H(t,e,n,i){return t.addEventListener(e,n,i),function(){return t.removeEventListener(e,n,i)}}function j(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function N(t){return Array.from(t.childNodes)}function A(t,e){e=""+e,t.data!==e&&(t.data=e)}function P(t,e){var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}var L,R=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;h(this,t),this.e=M("div"),this.a=n,this.u(e)}return m(t,[{key:"m",value:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=0;n<this.n.length;n+=1)O(t,this.n[n],e);this.t=t}},{key:"u",value:function(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}},{key:"p",value:function(t){this.d(),this.u(t),this.m(this.t,this.a)}},{key:"d",value:function(){this.n.forEach(C)}}]),t}();new Set;function I(t){L=t}function D(){if(!L)throw new Error("Function called outside component initialization");return L}function W(t,e){var n=t.$$.callbacks[e.type];n&&n.slice().forEach((function(t){return t(e)}))}var F=[],q=[],B=[],U=[],z=Promise.resolve(),G=!1;function J(){G||(G=!0,z.then(Y))}function K(){return J(),z}function Q(t){B.push(t)}var V=!1,X=new Set;function Y(){if(!V){V=!0;do{for(var t=0;t<F.length;t+=1){var e=F[t];I(e),Z(e.$$)}for(F.length=0;q.length;)q.pop()();for(var n=0;n<B.length;n+=1){var i=B[n];X.has(i)||(X.add(i),i())}B.length=0}while(F.length);for(;U.length;)U.pop()();G=!1,V=!1,X.clear()}}function Z(t){if(null!==t.fragment){t.update(),x(t.before_update);var e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(Q)}}var tt,et=new Set;function nt(){tt={r:0,c:[],p:tt}}function it(){tt.r||x(tt.c),tt=tt.p}function ot(t,e){t&&t.i&&(et.delete(t),t.i(e))}function rt(t,e,n,i){if(t&&t.o){if(et.has(t))return;et.add(t),tt.c.push((function(){et.delete(t),i&&(n&&t.d(1),i())})),t.o(e)}}var st="undefined"!=typeof window?window:global;function at(t,e){rt(t,1,1,(function(){e.delete(t.key)}))}function ct(t,e,n,i,o,r,s,a,c,u,l,f){for(var d=t.length,h=r.length,p=d,m={};p--;)m[t[p].key]=p;var y=[],v=new Map,g=new Map;for(p=h;p--;){var $=f(o,r,p),_=n($),x=s.get(_);x?i&&x.p($,e):(x=u(_,$)).c(),v.set(_,y[p]=x),_ in m&&g.set(_,Math.abs(p-m[_]))}var k=new Set,b=new Set;function w(t){ot(t,1),t.m(a,l,s.has(t.key)),s.set(t.key,t),l=t.first,h--}for(;d&&h;){var O=y[h-1],C=t[d-1],M=O.key,T=C.key;O===C?(l=O.first,d--,h--):v.has(T)?!s.has(M)||k.has(M)?w(O):b.has(T)?d--:g.get(M)>g.get(T)?(b.add(M),w(O)):(k.add(T),d--):(c(C,s),d--)}for(;d--;){var S=t[d];v.has(S.key)||c(S,s)}for(;h;)w(y[h-1]);return y}function ut(t,e){for(var n={},i={},o={$$scope:1},r=t.length;r--;){var s=t[r],a=e[r];if(a){for(var c in s)c in a||(i[c]=1);for(var u in a)o[u]||(n[u]=a[u],o[u]=1);t[r]=a}else for(var l in s)o[l]=1}for(var f in i)f in n||(n[f]=void 0);return n}function lt(t){return"object"===y(t)&&null!==t?t:{}}new Set(["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"]);function ft(t){t&&t.c()}function dt(t,e,n){var i=t.$$,o=i.fragment,r=i.on_mount,s=i.on_destroy,a=i.after_update;o&&o.m(e,n),Q((function(){var e=r.map($).filter(k);s?s.push.apply(s,f(e)):x(e),t.$$.on_mount=[]})),a.forEach(Q)}function ht(t,e){var n=t.$$;null!==n.fragment&&(x(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function pt(t,e){-1===t.$$.dirty[0]&&(F.push(t),J(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}"function"==typeof HTMLElement&&HTMLElement;var mt=function(){function t(){h(this,t)}return m(t,[{key:"$destroy",value:function(){ht(this,1),this.$destroy=v}},{key:"$on",value:function(t,e){var n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),function(){var t=n.indexOf(e);-1!==t&&n.splice(t,1)}}},{key:"$set",value:function(){}}]),t}();function yt(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var vt=function(){function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Object.assign(this,{dir1:null,dir2:null,firstpos1:null,firstpos2:null,spacing1:25,spacing2:25,push:"bottom",maxOpen:1,maxStrategy:"wait",maxClosureCausesWait:!0,modal:"ish",modalishFlash:!0,overlayClose:!0,overlayClosesPinned:!1,context:window&&document.body||null},e),"ish"===this.modal&&1!==this.maxOpen)throw new Error("A modalish stack must have a maxOpen value of 1.");if("ish"===this.modal&&!this.dir1)throw new Error("A modalish stack must have a direction.");if("top"===this.push&&"ish"===this.modal&&"close"!==this.maxStrategy)throw new Error("A modalish stack that pushes to the top must use the close maxStrategy.");this._noticeHead={notice:null,prev:null,next:null},this._noticeTail={notice:null,prev:this._noticeHead,next:null},this._noticeHead.next=this._noticeTail,this._noticeMap=new WeakMap,this._length=0,this._addpos2=0,this._animation=!0,this._posTimer=null,this._openNotices=0,this._listener=null,this._overlayOpen=!1,this._overlayInserted=!1,this._collapsingModalState=!1,this._leader=null,this._leaderOff=null,this._masking=null,this._maskingOff=null}var e,n,i;return e=t,(n=[{key:"forEach",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=n.start,o=void 0===i?"oldest":i,r=n.dir,s=void 0===r?"newer":r,a=n.skipModuleHandled,c=void 0!==a&&a;if("head"===o||"newest"===o&&"top"===this.push||"oldest"===o&&"bottom"===this.push)e=this._noticeHead.next;else if("tail"===o||"newest"===o&&"bottom"===this.push||"oldest"===o&&"top"===this.push)e=this._noticeTail.prev;else{if(!this._noticeMap.has(o))throw new Error("Invalid start param.");e=this._noticeMap.get(o)}for(;e.notice;){var u=e.notice;if("prev"===s||"top"===this.push&&"newer"===s||"bottom"===this.push&&"older"===s)e=e.prev;else{if(!("next"===s||"top"===this.push&&"older"===s||"bottom"===this.push&&"newer"===s))throw new Error("Invalid dir param.");e=e.next}if(!(c&&u.getModuleHandled()||!1!==t(u)))break}}},{key:"close",value:function(t){this.forEach((function(e){return e.close(t,!1,!1)}))}},{key:"open",value:function(t){this.forEach((function(e){return e.open(t)}))}},{key:"openLast",value:function(){this.forEach((function(t){if(-1===["opening","open","waiting"].indexOf(t.getState()))return t.open(),!1}),{start:"newest",dir:"older"})}},{key:"position",value:function(){var t=this;this._length>0?(this._resetPositionData(),this.forEach((function(e){t._positionNotice(e)}),{start:"head",dir:"next",skipModuleHandled:!0})):(delete this._nextpos1,delete this._nextpos2)}},{key:"queuePosition",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;this._posTimer&&clearTimeout(this._posTimer),this._posTimer=setTimeout((function(){return t.position()}),e)}},{key:"_resetPositionData",value:function(){this._nextpos1=this.firstpos1,this._nextpos2=this.firstpos2,this._addpos2=0}},{key:"_positionNotice",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t===this._masking,n=t.refs.elem;if(n&&(n.classList.contains("pnotify-in")||n.classList.contains("pnotify-initial")||e)){var i=[this.firstpos1,this.firstpos2,this._nextpos1,this._nextpos2,this._addpos2],o=i[0],r=i[1],s=i[2],a=i[3],c=i[4];n.getBoundingClientRect(),!this._animation||e||this._collapsingModalState?t._setMoveClass(""):t._setMoveClass("pnotify-move");var u,l=this.context===document.body?window.innerHeight:this.context.scrollHeight,f=this.context===document.body?window.innerWidth:this.context.scrollWidth;if(this.dir1){var d;switch(u={down:"top",up:"bottom",left:"right",right:"left"}[this.dir1],this.dir1){case"down":d=n.offsetTop;break;case"up":d=l-n.scrollHeight-n.offsetTop;break;case"left":d=f-n.scrollWidth-n.offsetLeft;break;case"right":d=n.offsetLeft}null==o&&(s=o=d)}if(this.dir1&&this.dir2){var h,p={down:"top",up:"bottom",left:"right",right:"left"}[this.dir2];switch(this.dir2){case"down":h=n.offsetTop;break;case"up":h=l-n.scrollHeight-n.offsetTop;break;case"left":h=f-n.scrollWidth-n.offsetLeft;break;case"right":h=n.offsetLeft}if(null==r&&(a=r=h),!e){var m=s+n.offsetHeight+this.spacing1,y=s+n.offsetWidth+this.spacing1;(("down"===this.dir1||"up"===this.dir1)&&m>l||("left"===this.dir1||"right"===this.dir1)&&y>f)&&(s=o,a+=c+this.spacing2,c=0)}switch(null!=a&&(n.style[p]="".concat(a,"px"),this._animation||n.style[p]),this.dir2){case"down":case"up":n.offsetHeight+(parseFloat(n.style.marginTop,10)||0)+(parseFloat(n.style.marginBottom,10)||0)>c&&(c=n.offsetHeight);break;case"left":case"right":n.offsetWidth+(parseFloat(n.style.marginLeft,10)||0)+(parseFloat(n.style.marginRight,10)||0)>c&&(c=n.offsetWidth)}}else if(this.dir1){var v,g;switch(this.dir1){case"down":case"up":g=["left","right"],v=this.context.scrollWidth/2-n.offsetWidth/2;break;case"left":case"right":g=["top","bottom"],v=l/2-n.offsetHeight/2}n.style[g[0]]="".concat(v,"px"),n.style[g[1]]="auto",this._animation||n.style[g[0]]}if(this.dir1)switch(null!=s&&(n.style[u]="".concat(s,"px"),this._animation||n.style[u]),this.dir1){case"down":case"up":s+=n.offsetHeight+this.spacing1;break;case"left":case"right":s+=n.offsetWidth+this.spacing1}else{var $=f/2-n.offsetWidth/2,_=l/2-n.offsetHeight/2;n.style.left="".concat($,"px"),n.style.top="".concat(_,"px"),this._animation||n.style.left}e||(this.firstpos1=o,this.firstpos2=r,this._nextpos1=s,this._nextpos2=a,this._addpos2=c)}}},{key:"_addNotice",value:function(t){var e=this,n={notice:t,prev:null,next:null};if("top"===this.push?(n.next=this._noticeHead.next,n.prev=this._noticeHead,n.next.prev=n,n.prev.next=n):(n.prev=this._noticeTail.prev,n.next=this._noticeTail,n.prev.next=n,n.next.prev=n),this._noticeMap.set(t,n),this._length++,this._listener||(this._listener=function(){return e.position()},this.context.addEventListener("pnotify:position",this._listener)),-1!==["open","opening","closing"].indexOf(t.getState()))this._handleNoticeOpened(t);else if("ish"===this.modal&&this.modalishFlash&&this._shouldNoticeWait())var i=t.on("pnotify:mount",(function(){i(),t._setMasking(!0,!1,(function(){t._setMasking(!1)})),e._resetPositionData(),e._positionNotice(e._leader),window.requestAnimationFrame((function(){e._positionNotice(t,!0)}))}))}},{key:"_removeNotice",value:function(t){if(this._noticeMap.has(t)){var e=this._noticeMap.get(t);this._leader===t&&this._setLeader(null),this._masking===t&&this._setMasking(null),e.prev.next=e.next,e.next.prev=e.prev,e.prev=null,e.next=null,this._noticeMap.delete(t),this._length--,!this._length&&this._listener&&(this.context.removeEventListener("pnotify:position",this._listener),this._listener=null),!this._length&&this._overlayOpen&&this._removeOverlay(),-1!==["open","opening","closing"].indexOf(t.getState())&&this._handleNoticeClosed(t)}}},{key:"_setLeader",value:function(t){var e=this;if(this._leaderOff&&(this._leaderOff(),this._leaderOff=null),this._leader=t,this._leader){var n,i=function(){var t=null;e._overlayOpen&&(e._collapsingModalState=!0,e.forEach((function(n){n._preventTimerClose(!1),n!==e._leader&&-1!==["opening","open"].indexOf(n.getState())&&(t||(t=n),n.close(n===t,!1,!0))}),{start:e._leader,dir:"next",skipModuleHandled:!0}),e._removeOverlay()),o&&(clearTimeout(o),o=null),e.forEach((function(n){if(n!==e._leader)return"waiting"===n.getState()||n===t?(e._setMasking(n,!!t),!1):void 0}),{start:e._leader,dir:"next",skipModuleHandled:!0})},o=null,r=function(){o&&(clearTimeout(o),o=null),o=setTimeout((function(){o=null,e._setMasking(null)}),750)};this._leaderOff=(n=[this._leader.on("mouseenter",i),this._leader.on("focusin",i),this._leader.on("mouseleave",r),this._leader.on("focusout",r)],function(){return n.map((function(t){return t()}))})}}},{key:"_setMasking",value:function(t,e){var n=this;if(this._masking){if(this._masking===t)return;this._masking._setMasking(!1,e)}if(this._maskingOff&&(this._maskingOff(),this._maskingOff=null),this._masking=t,this._masking){this._resetPositionData(),this._leader&&this._positionNotice(this._leader),this._masking._setMasking(!0,e),window.requestAnimationFrame((function(){n._masking&&n._positionNotice(n._masking)}));var i,o=function(){"ish"===n.modal&&(n._insertOverlay(),n._setMasking(null,!0),n.forEach((function(t){t._preventTimerClose(!0),"waiting"===t.getState()&&t.open()}),{start:n._leader,dir:"next",skipModuleHandled:!0}))};this._maskingOff=(i=[this._masking.on("mouseenter",o),this._masking.on("focusin",o)],function(){return i.map((function(t){return t()}))})}}},{key:"_handleNoticeClosed",value:function(t){var e=this;if(!t.getModuleHandled()){if(this._openNotices--,"ish"===this.modal&&t===this._leader&&(this._setLeader(null),this._masking&&this._setMasking(null)),this.maxOpen!==1/0&&this._openNotices<this.maxOpen){var n=function(t){if("waiting"===t.getState()&&(t.open(),e._openNotices>=e.maxOpen))return!1};"wait"===this.maxStrategy?this.forEach(n,{start:t,dir:"next"}):"close"===this.maxStrategy&&this.maxClosureCausesWait&&this.forEach(n,{start:t,dir:"older"})}this._openNotices<=0?(this._openNotices=0,this._overlayOpen&&this._removeOverlay()):this._collapsingModalState||this.queuePosition(0)}}},{key:"_handleNoticeOpened",value:function(t){var e=this;if(!t.getModuleHandled()){if(this._openNotices++,("ish"!==this.modal||!this._overlayOpen)&&this.maxOpen!==1/0&&this._openNotices>this.maxOpen&&"close"===this.maxStrategy){var n=this._openNotices-this.maxOpen;this.forEach((function(t){if(-1!==["opening","open"].indexOf(t.getState()))return t.close(!1,!1,e.maxClosureCausesWait),t===e._leader&&e._setLeader(null),!!--n}))}!0===this.modal&&this._insertOverlay(),"ish"!==this.modal||this._leader&&-1!==["opening","open","closing"].indexOf(this._leader.getState())||this._setLeader(t),"ish"===this.modal&&this._overlayOpen&&t._preventTimerClose(!0)}}},{key:"_shouldNoticeWait",value:function(){return!("ish"===this.modal&&this._overlayOpen)&&this.maxOpen!==1/0&&this._openNotices>=this.maxOpen&&"wait"===this.maxStrategy}},{key:"_insertOverlay",value:function(){var t=this;this._overlay||(this._overlay=document.createElement("div"),this._overlay.classList.add("pnotify-modal-overlay"),this.dir1&&this._overlay.classList.add("pnotify-modal-overlay-".concat(this.dir1)),this.overlayClose&&this._overlay.classList.add("pnotify-modal-overlay-closes"),this.context!==document.body&&(this._overlay.style.height="".concat(this.context.scrollHeight,"px"),this._overlay.style.width="".concat(this.context.scrollWidth,"px")),this._overlay.addEventListener("click",(function(){t.overlayClose&&(t._leader&&t._setLeader(null),t.forEach((function(e){-1===["closed","closing","waiting"].indexOf(e.getState())&&(e.hide||t.overlayClosesPinned?e.close():e.hide||"ish"!==t.modal||(t._leader?e.close(!1,!1,!0):t._setLeader(e)))}),{skipModuleHandled:!0}),t._overlayOpen&&t._removeOverlay())}))),this._overlay.parentNode!==this.context&&(this._overlay.classList.remove("pnotify-modal-overlay-in"),this._overlay=this.context.insertBefore(this._overlay,this.context.firstChild),this._overlayOpen=!0,this._overlayInserted=!0,window.requestAnimationFrame((function(){t._overlay.classList.add("pnotify-modal-overlay-in")}))),this._collapsingModalState=!1}},{key:"_removeOverlay",value:function(){var t=this;this._overlay.parentNode&&(this._overlay.classList.remove("pnotify-modal-overlay-in"),this._overlayOpen=!1,setTimeout((function(){t._overlayInserted=!1,t._overlay.parentNode&&t._overlay.parentNode.removeChild(t._overlay)}),250),setTimeout((function(){t._collapsingModalState=!1}),400))}},{key:"notices",get:function(){var t=[];return this.forEach((function(e){return t.push(e)})),t}},{key:"length",get:function(){return this._length}},{key:"leader",get:function(){return this._leader}}])&&yt(e.prototype,n),i&&yt(e,i),t}();function gt(t,e,n){return(gt=$t()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&_t(o,n.prototype),o}).apply(null,arguments)}function $t(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function _t(t,e){return(_t=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var xt=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return gt(ye,e)};function kt(t){return function(t){if(Array.isArray(t))return bt(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return bt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return bt(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function bt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}n(0);function wt(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function Ot(t,e){return(Ot=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Ct(t,e){return!e||"object"!==Pt(e)&&"function"!=typeof e?Mt(t):e}function Mt(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Tt(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function St(t){return(St=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Et(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],i=!0,o=!1,r=void 0;try{for(var s,a=t[Symbol.iterator]();!(i=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);i=!0);}catch(t){o=!0,r=t}finally{try{i||null==a.return||a.return()}finally{if(o)throw r}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return Ht(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Ht(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Ht(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function jt(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function Nt(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?jt(Object(n),!0).forEach((function(e){At(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):jt(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function At(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Pt(t){return(Pt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var Lt=st.Map;function Rt(t,e,n){var i=t.slice();return i[106]=e[n][0],i[107]=e[n][1],i}function It(t,e,n){var i=t.slice();return i[106]=e[n][0],i[107]=e[n][1],i}function Dt(t,e,n){var i=t.slice();return i[106]=e[n][0],i[107]=e[n][1],i}function Wt(t,e,n){var i=t.slice();return i[106]=e[n][0],i[107]=e[n][1],i}function Ft(t,e){var n,i,o,r=[{self:e[41]},e[107]],s=e[106].default;function a(t){for(var e={},n=0;n<r.length;n+=1)e=g(e,r[n]);return{props:e}}if(s)var c=new s(a());return{key:t,first:null,c:function(){n=E(),c&&ft(c.$$.fragment),i=E(),this.first=n},m:function(t,e){O(t,n,e),c&&dt(c,t,e),O(t,i,e),o=!0},p:function(t,e){var n=1088&e[1]?ut(r,[1024&e[1]&&{self:t[41]},64&e[1]&&lt(t[107])]):{};if(s!==(s=t[106].default)){if(c){nt();var o=c;rt(o.$$.fragment,1,0,(function(){ht(o,1)})),it()}s?(ft((c=new s(a())).$$.fragment),ot(c.$$.fragment,1),dt(c,i.parentNode,i)):c=null}else s&&c.$set(n)},i:function(t){o||(c&&ot(c.$$.fragment,t),o=!0)},o:function(t){c&&rt(c.$$.fragment,t),o=!1},d:function(t){t&&C(n),t&&C(i),c&&ht(c,t)}}}function qt(t){var e,n,i,o,r;return{c:function(){e=M("div"),j(n=M("span"),"class",t[21]("closer")),j(e,"class",i="pnotify-closer ".concat(t[20]("closer")," ").concat(!t[16]||t[25]?"":"pnotify-hidden")),j(e,"role","button"),j(e,"tabindex","0"),j(e,"title",o=t[19].close)},m:function(i,o,s){O(i,e,o),w(e,n),s&&r(),r=H(e,"click",t[98])},p:function(t,n){33619968&n[0]&&i!==(i="pnotify-closer ".concat(t[20]("closer")," ").concat(!t[16]||t[25]?"":"pnotify-hidden"))&&j(e,"class",i),524288&n[0]&&o!==(o=t[19].close)&&j(e,"title",o)},d:function(t){t&&C(e),r()}}}function Bt(t){var e,n,i,o,r,s,a;return{c:function(){e=M("div"),j(n=M("span"),"class",i="".concat(t[21]("sticker")," ").concat(t[1]?t[21]("unstuck"):t[21]("stuck"))),j(e,"class",o="pnotify-sticker ".concat(t[20]("sticker")," ").concat(!t[18]||t[25]?"":"pnotify-hidden")),j(e,"role","button"),j(e,"aria-pressed",r=!t[1]),j(e,"tabindex","0"),j(e,"title",s=t[1]?t[19].stick:t[19].unstick)},m:function(i,o,r){O(i,e,o),w(e,n),r&&a(),a=H(e,"click",t[99])},p:function(t,a){2&a[0]&&i!==(i="".concat(t[21]("sticker")," ").concat(t[1]?t[21]("unstuck"):t[21]("stuck")))&&j(n,"class",i),33816576&a[0]&&o!==(o="pnotify-sticker ".concat(t[20]("sticker")," ").concat(!t[18]||t[25]?"":"pnotify-hidden"))&&j(e,"class",o),2&a[0]&&r!==(r=!t[1])&&j(e,"aria-pressed",r),524290&a[0]&&s!==(s=t[1]?t[19].stick:t[19].unstick)&&j(e,"title",s)},d:function(t){t&&C(e),a()}}}function Ut(t){var e,n,i;return{c:function(){e=M("div"),j(n=M("span"),"class",i=!0===t[11]?t[21](t[2]):t[11]),j(e,"class","pnotify-icon ".concat(t[20]("icon")))},m:function(i,o){O(i,e,o),w(e,n),t[100](e)},p:function(t,e){2052&e[0]&&i!==(i=!0===t[11]?t[21](t[2]):t[11])&&j(n,"class",i)},d:function(n){n&&C(e),t[100](null)}}}function zt(t,e){var n,i,o,r=[{self:e[41]},e[107]],s=e[106].default;function a(t){for(var e={},n=0;n<r.length;n+=1)e=g(e,r[n]);return{props:e}}if(s)var c=new s(a());return{key:t,first:null,c:function(){n=E(),c&&ft(c.$$.fragment),i=E(),this.first=n},m:function(t,e){O(t,n,e),c&&dt(c,t,e),O(t,i,e),o=!0},p:function(t,e){var n=1152&e[1]?ut(r,[1024&e[1]&&{self:t[41]},128&e[1]&&lt(t[107])]):{};if(s!==(s=t[106].default)){if(c){nt();var o=c;rt(o.$$.fragment,1,0,(function(){ht(o,1)})),it()}s?(ft((c=new s(a())).$$.fragment),ot(c.$$.fragment,1),dt(c,i.parentNode,i)):c=null}else s&&c.$set(n)},i:function(t){o||(c&&ot(c.$$.fragment,t),o=!0)},o:function(t){c&&rt(c.$$.fragment,t),o=!1},d:function(t){t&&C(n),t&&C(i),c&&ht(c,t)}}}function Gt(t){var e,n=!t[32]&&Jt(t);return{c:function(){e=M("div"),n&&n.c(),j(e,"class","pnotify-title ".concat(t[20]("title")))},m:function(i,o){O(i,e,o),n&&n.m(e,null),t[101](e)},p:function(t,i){t[32]?n&&(n.d(1),n=null):n?n.p(t,i):((n=Jt(t)).c(),n.m(e,null))},d:function(i){i&&C(e),n&&n.d(),t[101](null)}}}function Jt(t){var e;function n(t,e){return t[4]?Qt:Kt}var i=n(t),o=i(t);return{c:function(){o.c(),e=E()},m:function(t,n){o.m(t,n),O(t,e,n)},p:function(t,r){i===(i=n(t))&&o?o.p(t,r):(o.d(1),(o=i(t))&&(o.c(),o.m(e.parentNode,e)))},d:function(t){o.d(t),t&&C(e)}}}function Kt(t){var e,n;return{c:function(){e=M("span"),n=T(t[3]),j(e,"class","pnotify-pre-line")},m:function(t,i){O(t,e,i),w(e,n)},p:function(t,e){8&e[0]&&A(n,t[3])},d:function(t){t&&C(e)}}}function Qt(t){var e;return{c:function(){e=new R(t[3],null)},m:function(t,n){e.m(t,n)},p:function(t,n){8&n[0]&&e.p(t[3])},d:function(t){t&&e.d()}}}function Vt(t){var e,n=!t[33]&&Xt(t);return{c:function(){e=M("div"),n&&n.c(),j(e,"class","pnotify-text ".concat(t[20]("text"))),j(e,"style",t[31]),j(e,"role","alert")},m:function(i,o){O(i,e,o),n&&n.m(e,null),t[102](e)},p:function(t,i){t[33]?n&&(n.d(1),n=null):n?n.p(t,i):((n=Xt(t)).c(),n.m(e,null)),1&i[1]&&j(e,"style",t[31])},d:function(i){i&&C(e),n&&n.d(),t[102](null)}}}function Xt(t){var e;function n(t,e){return t[6]?Zt:Yt}var i=n(t),o=i(t);return{c:function(){o.c(),e=E()},m:function(t,n){o.m(t,n),O(t,e,n)},p:function(t,r){i===(i=n(t))&&o?o.p(t,r):(o.d(1),(o=i(t))&&(o.c(),o.m(e.parentNode,e)))},d:function(t){o.d(t),t&&C(e)}}}function Yt(t){var e,n;return{c:function(){e=M("span"),n=T(t[5]),j(e,"class","pnotify-pre-line")},m:function(t,i){O(t,e,i),w(e,n)},p:function(t,e){32&e[0]&&A(n,t[5])},d:function(t){t&&C(e)}}}function Zt(t){var e;return{c:function(){e=new R(t[5],null)},m:function(t,n){e.m(t,n)},p:function(t,n){32&n[0]&&e.p(t[5])},d:function(t){t&&e.d()}}}function te(t,e){var n,i,o,r=[{self:e[41]},e[107]],s=e[106].default;function a(t){for(var e={},n=0;n<r.length;n+=1)e=g(e,r[n]);return{props:e}}if(s)var c=new s(a());return{key:t,first:null,c:function(){n=E(),c&&ft(c.$$.fragment),i=E(),this.first=n},m:function(t,e){O(t,n,e),c&&dt(c,t,e),O(t,i,e),o=!0},p:function(t,e){var n=1280&e[1]?ut(r,[1024&e[1]&&{self:t[41]},256&e[1]&&lt(t[107])]):{};if(s!==(s=t[106].default)){if(c){nt();var o=c;rt(o.$$.fragment,1,0,(function(){ht(o,1)})),it()}s?(ft((c=new s(a())).$$.fragment),ot(c.$$.fragment,1),dt(c,i.parentNode,i)):c=null}else s&&c.$set(n)},i:function(t){o||(c&&ot(c.$$.fragment,t),o=!0)},o:function(t){c&&rt(c.$$.fragment,t),o=!1},d:function(t){t&&C(n),t&&C(i),c&&ht(c,t)}}}function ee(t,e){var n,i,o,r=[{self:e[41]},e[107]],s=e[106].default;function a(t){for(var e={},n=0;n<r.length;n+=1)e=g(e,r[n]);return{props:e}}if(s)var c=new s(a());return{key:t,first:null,c:function(){n=E(),c&&ft(c.$$.fragment),i=E(),this.first=n},m:function(t,e){O(t,n,e),c&&dt(c,t,e),O(t,i,e),o=!0},p:function(t,e){var n=1536&e[1]?ut(r,[1024&e[1]&&{self:t[41]},512&e[1]&&lt(t[107])]):{};if(s!==(s=t[106].default)){if(c){nt();var o=c;rt(o.$$.fragment,1,0,(function(){ht(o,1)})),it()}s?(ft((c=new s(a())).$$.fragment),ot(c.$$.fragment,1),dt(c,i.parentNode,i)):c=null}else s&&c.$set(n)},i:function(t){o||(c&&ot(c.$$.fragment,t),o=!0)},o:function(t){c&&rt(c.$$.fragment,t),o=!1},d:function(t){t&&C(n),t&&C(i),c&&ht(c,t)}}}function ne(t){for(var e,n,i,o,r,s,a,c,u,l,f,d,h,p,m,y,g=[],$=new Lt,_=[],b=new Lt,T=[],E=new Lt,N=[],A=new Lt,P=t[37],L=function(t){return t[106]},R=0;R<P.length;R+=1){var I=Wt(t,P,R),D=L(I);$.set(D,g[R]=Ft(D,I))}for(var W=t[15]&&!t[35]&&qt(t),F=t[17]&&!t[35]&&Bt(t),q=!1!==t[11]&&Ut(t),B=t[38],U=function(t){return t[106]},z=0;z<B.length;z+=1){var G=Dt(t,B,z),J=U(G);b.set(J,_[z]=zt(J,G))}for(var K=!1!==t[3]&&Gt(t),Q=!1!==t[5]&&Vt(t),V=t[39],X=function(t){return t[106]},Y=0;Y<V.length;Y+=1){var Z=It(t,V,Y),tt=X(Z);E.set(tt,T[Y]=te(tt,Z))}for(var et=t[40],st=function(t){return t[106]},ut=0;ut<et.length;ut+=1){var lt=Rt(t,et,ut),ft=st(lt);A.set(ft,N[ut]=ee(ft,lt))}return{c:function(){e=M("div"),n=M("div");for(var m=0;m<g.length;m+=1)g[m].c();i=S(),W&&W.c(),o=S(),F&&F.c(),r=S(),q&&q.c(),s=S(),a=M("div");for(var y=0;y<_.length;y+=1)_[y].c();c=S(),K&&K.c(),u=S(),Q&&Q.c(),l=S();for(var v=0;v<T.length;v+=1)T[v].c();f=S();for(var $=0;$<N.length;$+=1)N[$].c();j(a,"class","pnotify-content ".concat(t[20]("content"))),j(n,"class",d="pnotify-container ".concat(t[20]("container")," ").concat(t[20](t[2])," ").concat(t[14]?"pnotify-shadow":""," ").concat(t[26].container.join(" "))),j(n,"style",h="".concat(t[29]," ").concat(t[30])),j(n,"role","alert"),j(e,"data-pnotify",""),j(e,"class",p="pnotify ".concat(!1!==t[11]?"pnotify-with-icon":""," ").concat(t[20]("elem")," pnotify-mode-").concat(t[7]," ").concat(t[8]," ").concat(t[23]," ").concat(t[24]," ").concat(t[36]," ").concat("fade"===t[12]?"pnotify-fade-".concat(t[13]):""," ").concat(t[34]?"pnotify-modal ".concat(t[9]):t[10]," ").concat(t[27]?"pnotify-masking":""," ").concat(t[28]?"pnotify-masking-in":""," ").concat(t[26].elem.join(" "))),j(e,"aria-live","assertive"),j(e,"role","alertdialog")},m:function(d,h,p){O(d,e,h),w(e,n);for(var $=0;$<g.length;$+=1)g[$].m(n,null);w(n,i),W&&W.m(n,null),w(n,o),F&&F.m(n,null),w(n,r),q&&q.m(n,null),w(n,s),w(n,a);for(var b=0;b<_.length;b+=1)_[b].m(a,null);w(a,c),K&&K.m(a,null),w(a,u),Q&&Q.m(a,null),w(a,l);for(var C=0;C<T.length;C+=1)T[C].m(a,null);t[103](a),w(n,f);for(var M=0;M<N.length;M+=1)N[M].m(n,null);var S;t[104](n),t[105](e),m=!0,p&&x(y),y=[(S=t[42].call(null,e),S&&k(S.destroy)?S.destroy:v),H(e,"mouseenter",t[43]),H(e,"mouseleave",t[44]),H(e,"focusin",t[43]),H(e,"focusout",t[44])]},p:function(t,f){if(1088&f[1]){var y=t[37];nt(),g=ct(g,f,L,1,t,y,$,n,at,Ft,i,Wt),it()}if(t[15]&&!t[35]?W?W.p(t,f):((W=qt(t)).c(),W.m(n,o)):W&&(W.d(1),W=null),t[17]&&!t[35]?F?F.p(t,f):((F=Bt(t)).c(),F.m(n,r)):F&&(F.d(1),F=null),!1!==t[11]?q?q.p(t,f):((q=Ut(t)).c(),q.m(n,s)):q&&(q.d(1),q=null),1152&f[1]){var v=t[38];nt(),_=ct(_,f,U,1,t,v,b,a,at,zt,c,Dt),it()}if(!1!==t[3]?K?K.p(t,f):((K=Gt(t)).c(),K.m(a,u)):K&&(K.d(1),K=null),!1!==t[5]?Q?Q.p(t,f):((Q=Vt(t)).c(),Q.m(a,l)):Q&&(Q.d(1),Q=null),1280&f[1]){var x=t[39];nt(),T=ct(T,f,X,1,t,x,E,a,at,te,null,It),it()}if(1536&f[1]){var k=t[40];nt(),N=ct(N,f,st,1,t,k,A,n,at,ee,null,Rt),it()}(!m||67125252&f[0]&&d!==(d="pnotify-container ".concat(t[20]("container")," ").concat(t[20](t[2])," ").concat(t[14]?"pnotify-shadow":""," ").concat(t[26].container.join(" "))))&&j(n,"class",d),(!m||1610612736&f[0]&&h!==(h="".concat(t[29]," ").concat(t[30])))&&j(n,"style",h),(!m||494944128&f[0]|40&f[1]&&p!==(p="pnotify ".concat(!1!==t[11]?"pnotify-with-icon":""," ").concat(t[20]("elem")," pnotify-mode-").concat(t[7]," ").concat(t[8]," ").concat(t[23]," ").concat(t[24]," ").concat(t[36]," ").concat("fade"===t[12]?"pnotify-fade-".concat(t[13]):""," ").concat(t[34]?"pnotify-modal ".concat(t[9]):t[10]," ").concat(t[27]?"pnotify-masking":""," ").concat(t[28]?"pnotify-masking-in":""," ").concat(t[26].elem.join(" "))))&&j(e,"class",p)},i:function(t){if(!m){for(var e=0;e<P.length;e+=1)ot(g[e]);for(var n=0;n<B.length;n+=1)ot(_[n]);for(var i=0;i<V.length;i+=1)ot(T[i]);for(var o=0;o<et.length;o+=1)ot(N[o]);m=!0}},o:function(t){for(var e=0;e<g.length;e+=1)rt(g[e]);for(var n=0;n<_.length;n+=1)rt(_[n]);for(var i=0;i<T.length;i+=1)rt(T[i]);for(var o=0;o<N.length;o+=1)rt(N[o]);m=!1},d:function(n){n&&C(e);for(var i=0;i<g.length;i+=1)g[i].d();W&&W.d(),F&&F.d(),q&&q.d();for(var o=0;o<_.length;o+=1)_[o].d();K&&K.d(),Q&&Q.d();for(var r=0;r<T.length;r+=1)T[r].d();t[103](null);for(var s=0;s<N.length;s+=1)N[s].d();t[104](null),t[105](null),x(y)}}}var ie=function(t){return xt(ce(t))},oe=function(t){return xt(ce(t,"notice"))},re=function(t){return xt(ce(t,"info"))},se=function(t){return xt(ce(t,"success"))},ae=function(t){return xt(ce(t,"error"))};function ce(t,e){"object"!==Pt(t)&&(t={text:t}),e&&(t.type=e);var n=document.body;return"stack"in t&&t.stack&&t.stack.context&&(n=t.stack.context),{target:n,props:t}}var ue,le=new vt({dir1:"down",dir2:"left",firstpos1:25,firstpos2:25,spacing1:36,spacing2:36,push:"bottom"}),fe=new Map,de={type:"notice",title:!1,titleTrusted:!1,text:!1,textTrusted:!1,styling:"brighttheme",icons:"brighttheme",mode:"no-preference",addClass:"",addModalClass:"",addModelessClass:"",autoOpen:!0,width:"360px",minHeight:"16px",maxTextHeight:"200px",icon:!0,animation:"fade",animateSpeed:"normal",shadow:!0,hide:!0,delay:8e3,mouseReset:!0,closer:!0,closerHover:!0,sticker:!0,stickerHover:!0,labels:{close:"Close",stick:"Pin",unstick:"Unpin"},remove:!0,destroy:!0,stack:le,modules:fe};function he(){le.context||(le.context=document.body),window.addEventListener("resize",(function(){ue&&clearTimeout(ue),ue=setTimeout((function(){var t=new Event("pnotify:position");document.body.dispatchEvent(t),ue=null}),10)}))}function pe(t,e,n){var i,o=D(),r=(i=D(),function(t,e){var n=i.$$.callbacks[t];if(n){var o=P(t,e);n.slice().forEach((function(t){t.call(i,o)}))}}),s=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=["focus","blur","fullscreenchange","fullscreenerror","scroll","cut","copy","paste","keydown","keypress","keyup","auxclick","click","contextmenu","dblclick","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseout","mouseup","pointerlockchange","pointerlockerror","select","wheel","drag","dragend","dragenter","dragstart","dragleave","dragover","drop","touchcancel","touchend","touchmove","touchstart","pointerover","pointerenter","pointerdown","pointermove","pointerup","pointercancel","pointerout","pointerleave","gotpointercapture","lostpointercapture"].concat(kt(e));function i(e){W(t,e)}return function(t){for(var e=[],o=0;o<n.length;o++)e.push(H(t,n[o],i));return{destroy:function(){for(var t=0;t<e.length;t++)e[t]()}}}}(o,["pnotify:init","pnotify:mount","pnotify:update","pnotify:beforeOpen","pnotify:afterOpen","pnotify:enterModal","pnotify:leaveModal","pnotify:beforeClose","pnotify:afterClose","pnotify:beforeDestroy","pnotify:afterDestroy","focusin","focusout","animationend","transitionend"]),a=e.modules,c=void 0===a?new Map(de.modules):a,u=e.stack,l=void 0===u?de.stack:u,f={elem:null,container:null,content:null,iconContainer:null,titleContainer:null,textContainer:null},d=Nt({},de);zt("init",{notice:o,defaults:d});var h,p=e.type,m=void 0===p?d.type:p,y=e.title,v=void 0===y?d.title:y,g=e.titleTrusted,$=void 0===g?d.titleTrusted:g,_=e.text,x=void 0===_?d.text:_,k=e.textTrusted,b=void 0===k?d.textTrusted:k,w=e.styling,O=void 0===w?d.styling:w,C=e.icons,M=void 0===C?d.icons:C,T=e.mode,S=void 0===T?d.mode:T,E=e.addClass,j=void 0===E?d.addClass:E,N=e.addModalClass,A=void 0===N?d.addModalClass:N,L=e.addModelessClass,R=void 0===L?d.addModelessClass:L,I=e.autoOpen,F=void 0===I?d.autoOpen:I,B=e.width,U=void 0===B?d.width:B,z=e.minHeight,G=void 0===z?d.minHeight:z,J=e.maxTextHeight,Q=void 0===J?d.maxTextHeight:J,V=e.icon,X=void 0===V?d.icon:V,Y=e.animation,Z=void 0===Y?d.animation:Y,tt=e.animateSpeed,et=void 0===tt?d.animateSpeed:tt,nt=e.shadow,it=void 0===nt?d.shadow:nt,ot=e.hide,rt=void 0===ot?d.hide:ot,st=e.delay,at=void 0===st?d.delay:st,ct=e.mouseReset,ut=void 0===ct?d.mouseReset:ct,lt=e.closer,ft=void 0===lt?d.closer:lt,dt=e.closerHover,ht=void 0===dt?d.closerHover:dt,pt=e.sticker,mt=void 0===pt?d.sticker:pt,yt=e.stickerHover,vt=void 0===yt?d.stickerHover:yt,gt=e.labels,$t=void 0===gt?d.labels:gt,_t=e.remove,xt=void 0===_t?d.remove:_t,bt=e.destroy,wt=void 0===bt?d.destroy:bt,Ot="closed",Ct=null,Mt=null,Tt=null,St=!1,Ht="",jt="",At=!1,Pt=!1,Lt={elem:[],container:[]},Rt=!1,It=!1,Dt=!1,Wt=!1,Ft=null,qt=rt,Bt=NaN,Ut=!1;function zt(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=Nt({notice:o},e);"init"===t&&Array.from(c).forEach((function(t){var e=Et(t,2),i=e[0];e[1];return"init"in i&&i.init(n)}));var i=f.elem||l&&l.context||document.body;if(!i)return r("pnotify:".concat(t),n),!0;var s=new Event("pnotify:".concat(t),{bubbles:"init"===t||"mount"===t,cancelable:t.startsWith("before")});return s.detail=n,i.dispatchEvent(s),!s.defaultPrevented}function Gt(){var t=l&&l.context||document.body;if(!t)throw new Error("No context to insert this notice into.");if(!f.elem)throw new Error("Trying to insert notice before element is available.");f.elem.parentNode!==t&&t.appendChild(f.elem)}function Jt(){f.elem&&f.elem.parentNode.removeChild(f.elem)}h=function(){zt("mount"),F&&Qt()},D().$$.on_mount.push(h),function(t){D().$$.before_update.push(t)}((function(){zt("update"),"closed"!==Ot&&"waiting"!==Ot&&rt!==qt&&(rt?qt||ie():ne()),"closed"!==Ot&&"closing"!==Ot&&l&&!l._collapsingModalState&&l.queuePosition(),qt=rt}));var Kt=e.open,Qt=void 0===Kt?function(t){if("opening"!==Ot)if("open"!==Ot){if(!Rt&&l&&l._shouldNoticeWait())n(81,Ot="waiting");else if(zt("beforeOpen",{immediate:t})){n(81,Ot="opening"),n(27,Dt=!1),n(23,Ht="pnotify-initial pnotify-hidden");var e=function(){rt&&ie(),n(81,Ot="open"),zt("afterOpen",{immediate:t})};l&&l._handleNoticeOpened(o),It?e():(Gt(),window.requestAnimationFrame((function(){"opening"===Ot&&(l&&(n(45,l._animation=!1,l),"top"===l.push&&l._resetPositionData(),l._positionNotice(o),l.queuePosition(0),n(45,l._animation=!0,l)),Zt(e,t))})))}}else rt&&ie()}:Kt,Vt=e.close,Xt=void 0===Vt?function(t,e,i){if("closing"!==Ot&&"closed"!==Ot){var r=function(){zt("beforeDestroy")&&(l&&l._removeNotice(o),o.$destroy(),zt("afterDestroy"))};if("waiting"===Ot){if(i)return;return n(81,Ot="closed"),void(wt&&!i&&r())}zt("beforeClose",{immediate:t,timerHide:e,waitAfterward:i})&&(n(81,Ot="closing"),At=!!e,Ct&&"prevented"!==Ct&&clearTimeout&&clearTimeout(Ct),n(82,Ct=null),ee((function(){n(25,Pt=!1),At=!1,n(81,Ot=i?"waiting":"closed"),zt("afterClose",{immediate:t,timerHide:e,waitAfterward:i}),l&&l._handleNoticeClosed(o),wt&&!i?r():xt&&!i&&Jt()}),t))}}:Vt,Yt=e.animateIn,Zt=void 0===Yt?function(t,e){St="in";var i=function e(n){if(!(n&&f.elem&&n.target!==f.elem||(f.elem&&f.elem.removeEventListener("transitionend",e),Mt&&clearTimeout(Mt),"in"!==St))){var i=It;if(!i&&f.elem){var o=f.elem.getBoundingClientRect();for(var r in o)if(o[r]>0){i=!0;break}}i?(t&&t.call(),St=!1):Mt=setTimeout(e,40)}};"fade"!==Z||e?(n(23,Ht="pnotify-in"),K().then((function(){i()}))):(f.elem&&f.elem.addEventListener("transitionend",i),n(23,Ht="pnotify-in"),K().then((function(){n(23,Ht="pnotify-in pnotify-fade-in"),Mt=setTimeout(i,650)})))}:Yt,te=e.animateOut,ee=void 0===te?function(t,e){St="out";var i=function e(i){if(!(i&&f.elem&&i.target!==f.elem||(f.elem&&f.elem.removeEventListener("transitionend",e),Tt&&clearTimeout(Tt),"out"!==St))){var o=It;if(!o&&f.elem){var r=f.elem.getBoundingClientRect();for(var s in r)if(r[s]>0){o=!0;break}}f.elem&&f.elem.style.opacity&&"0"!==f.elem.style.opacity&&o?Tt=setTimeout(e,40):(n(23,Ht=""),t&&t.call(),St=!1)}};"fade"!==Z||e?(n(23,Ht=""),K().then((function(){i()}))):(f.elem&&f.elem.addEventListener("transitionend",i),n(23,Ht="pnotify-in"),Tt=setTimeout(i,650))}:te;function ne(){Ct&&"prevented"!==Ct&&(clearTimeout(Ct),n(82,Ct=null)),Tt&&clearTimeout(Tt),"closing"===Ot&&(n(81,Ot="open"),St=!1,n(23,Ht="fade"===Z?"pnotify-in pnotify-fade-in":"pnotify-in"))}function ie(){"prevented"!==Ct&&(ne(),at!==1/0&&n(82,Ct=setTimeout((function(){return Xt(!1,!0)}),isNaN(at)?0:at)))}var oe,re,se,ae,ce,ue,le,fe,he,pe,me,ye;return t.$set=function(t){"modules"in t&&n(46,c=t.modules),"stack"in t&&n(45,l=t.stack),"type"in t&&n(2,m=t.type),"title"in t&&n(3,v=t.title),"titleTrusted"in t&&n(4,$=t.titleTrusted),"text"in t&&n(5,x=t.text),"textTrusted"in t&&n(6,b=t.textTrusted),"styling"in t&&n(47,O=t.styling),"icons"in t&&n(48,M=t.icons),"mode"in t&&n(7,S=t.mode),"addClass"in t&&n(8,j=t.addClass),"addModalClass"in t&&n(9,A=t.addModalClass),"addModelessClass"in t&&n(10,R=t.addModelessClass),"autoOpen"in t&&n(49,F=t.autoOpen),"width"in t&&n(50,U=t.width),"minHeight"in t&&n(51,G=t.minHeight),"maxTextHeight"in t&&n(52,Q=t.maxTextHeight),"icon"in t&&n(11,X=t.icon),"animation"in t&&n(12,Z=t.animation),"animateSpeed"in t&&n(13,et=t.animateSpeed),"shadow"in t&&n(14,it=t.shadow),"hide"in t&&n(1,rt=t.hide),"delay"in t&&n(53,at=t.delay),"mouseReset"in t&&n(54,ut=t.mouseReset),"closer"in t&&n(15,ft=t.closer),"closerHover"in t&&n(16,ht=t.closerHover),"sticker"in t&&n(17,mt=t.sticker),"stickerHover"in t&&n(18,vt=t.stickerHover),"labels"in t&&n(19,$t=t.labels),"remove"in t&&n(55,xt=t.remove),"destroy"in t&&n(56,wt=t.destroy),"open"in t&&n(59,Qt=t.open),"close"in t&&n(22,Xt=t.close),"animateIn"in t&&n(60,Zt=t.animateIn),"animateOut"in t&&n(61,ee=t.animateOut)},t.$$.update=function(){524288&t.$$.dirty[1]&&n(29,oe="string"==typeof U?"width: ".concat(U,";"):""),1048576&t.$$.dirty[1]&&n(30,re="string"==typeof G?"min-height: ".concat(G,";"):""),2097152&t.$$.dirty[1]&&n(31,se="string"==typeof Q?"max-height: ".concat(Q,"; overflow-y: auto; overscroll-behavior: contain; padding-bottom:.03em;"):""),8&t.$$.dirty[0]&&n(32,ae=v instanceof HTMLElement),32&t.$$.dirty[0]&&n(33,ce=x instanceof HTMLElement),16384&t.$$.dirty[1]|1572864&t.$$.dirty[2]&&n(34,ue=l&&(!0===l.modal||"ish"===l.modal&&"prevented"===Ct)&&-1!==["open","opening","closing"].indexOf(Ot)),1792&t.$$.dirty[0]|8&t.$$.dirty[1]&&n(35,le=j.match(/\bnonblock\b/)||A.match(/\bnonblock\b/)&&ue||R.match(/\bnonblock\b/)&&!ue),16384&t.$$.dirty[1]&&n(36,fe=l&&l.dir1?"pnotify-stack-".concat(l.dir1):""),32768&t.$$.dirty[1]&&n(37,he=Array.from(c).filter((function(t){var e=Et(t,2),n=e[0];e[1];return"PrependContainer"===n.position}))),32768&t.$$.dirty[1]&&n(38,pe=Array.from(c).filter((function(t){var e=Et(t,2),n=e[0];e[1];return"PrependContent"===n.position}))),32768&t.$$.dirty[1]&&n(39,me=Array.from(c).filter((function(t){var e=Et(t,2),n=e[0];e[1];return"AppendContent"===n.position}))),32768&t.$$.dirty[1]&&n(40,ye=Array.from(c).filter((function(t){var e=Et(t,2),n=e[0];e[1];return"AppendContainer"===n.position}))),9&t.$$.dirty[0]|2&t.$$.dirty[1]&&ae&&f.titleContainer&&f.titleContainer.appendChild(v),33&t.$$.dirty[0]|4&t.$$.dirty[1]&&ce&&f.textContainer&&f.textContainer.appendChild(x),16384&t.$$.dirty[1]|536870912&t.$$.dirty[2]&&Bt!==l&&(Bt&&Bt._removeNotice(o),l&&l._addNotice(o),n(91,Bt=l)),8&t.$$.dirty[1]|1073741824&t.$$.dirty[2]&&Ut!==ue&&(zt(ue?"enterModal":"leaveModal"),n(92,Ut=ue))},[f,rt,m,v,$,x,b,S,j,A,R,X,Z,et,it,ft,ht,mt,vt,$t,function(t){return"string"==typeof O?"".concat(O,"-").concat(t):t in O?O[t]:"".concat(O.prefix,"-").concat(t)},function(t){return"string"==typeof M?"".concat(M,"-icon-").concat(t):t in M?M[t]:"".concat(M.prefix,"-icon-").concat(t)},Xt,Ht,jt,Pt,Lt,Dt,Wt,oe,re,se,ae,ce,ue,le,fe,he,pe,me,ye,o,s,function(t){if(n(25,Pt=!0),ut&&"closing"===Ot){if(!At)return;ne()}rt&&ut&&ne()},function(t){n(25,Pt=!1),rt&&ut&&"out"!==St&&ie()},l,c,O,M,F,U,G,Q,at,ut,xt,wt,function(){return Ot},function(){return Ct},Qt,Zt,ee,ne,ie,function(t){t?(ne(),n(82,Ct="prevented")):"prevented"===Ct&&(n(82,Ct=null),"open"===Ot&&rt&&ie())},function(){return o.$on.apply(o,arguments)},function(){return o.$set.apply(o,arguments)},function(t,e){r(t,e)},function(t){for(var e=0;e<(arguments.length<=1?0:arguments.length-1);e++){var i=e+1<1||arguments.length<=e+1?void 0:arguments[e+1];-1===Lt[t].indexOf(i)&&Lt[t].push(i)}n(26,Lt)},function(t){for(var e=0;e<(arguments.length<=1?0:arguments.length-1);e++){var i=e+1<1||arguments.length<=e+1?void 0:arguments[e+1],o=Lt[t].indexOf(i);-1!==o&&Lt[t].splice(o,1)}n(26,Lt)},function(t){for(var e=0;e<(arguments.length<=1?0:arguments.length-1);e++){var n=e+1<1||arguments.length<=e+1?void 0:arguments[e+1];if(-1===Lt[t].indexOf(n))return!1}return!0},function(){return Rt},function(t){return Rt=t},function(){return It},function(t){return It=t},function(t){return St=t},function(){return Ht},function(t){return n(23,Ht=t)},function(){return jt},function(t){return n(24,jt=t)},function(t,e,i){if(Ft&&clearTimeout(Ft),Dt!==t)if(t)n(27,Dt=!0),n(28,Wt=!!e),Gt(),K().then((function(){window.requestAnimationFrame((function(){if(Dt)if(e&&i)i();else{n(28,Wt=!0);var t=function t(){f.elem&&f.elem.removeEventListener("transitionend",t),Ft&&clearTimeout(Ft),Wt&&i&&i()};f.elem&&f.elem.addEventListener("transitionend",t),Ft=setTimeout(t,650)}}))}));else if(e)n(27,Dt=!1),n(28,Wt=!1),xt&&-1===["open","opening","closing"].indexOf(Ot)&&Jt(),i&&i();else{var o=function t(){f.elem&&f.elem.removeEventListener("transitionend",t),Ft&&clearTimeout(Ft),Wt||(n(27,Dt=!1),xt&&-1===["open","opening","closing"].indexOf(Ot)&&Jt(),i&&i())};n(28,Wt=!1),f.elem&&f.elem.addEventListener("transitionend",o),f.elem&&f.elem.style.opacity,Ft=setTimeout(o,650)}},Ot,Ct,Mt,Tt,St,At,Rt,It,Ft,qt,Bt,Ut,r,d,zt,Gt,Jt,function(){return Xt(!1)},function(){return n(1,rt=!rt)},function(t){q[t?"unshift":"push"]((function(){f.iconContainer=t,n(0,f)}))},function(t){q[t?"unshift":"push"]((function(){f.titleContainer=t,n(0,f)}))},function(t){q[t?"unshift":"push"]((function(){f.textContainer=t,n(0,f)}))},function(t){q[t?"unshift":"push"]((function(){f.content=t,n(0,f)}))},function(t){q[t?"unshift":"push"]((function(){f.container=t,n(0,f)}))},function(t){q[t?"unshift":"push"]((function(){f.elem=t,n(0,f)}))}]}window&&document.body?he():document.addEventListener("DOMContentLoaded",he);var me=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Ot(t,e)}(s,t);var e,n,i,o,r=(e=s,function(){var t,n=St(e);if(Tt()){var i=St(this).constructor;t=Reflect.construct(n,arguments,i)}else t=n.apply(this,arguments);return Ct(this,t)});function s(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,s),function(t,e,n,i,o,r){var s=arguments.length>6&&void 0!==arguments[6]?arguments[6]:[-1],a=L;I(t);var c=e.props||{},u=t.$$={fragment:null,ctx:null,props:r,update:v,not_equal:o,bound:_(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(a?a.$$.context:[]),callbacks:_(),dirty:s},l=!1;if(u.ctx=n?n(t,c,(function(e,n){var i=!(arguments.length<=2)&&arguments.length-2?arguments.length<=2?void 0:arguments[2]:n;return u.ctx&&o(u.ctx[e],u.ctx[e]=i)&&(u.bound[e]&&u.bound[e](i),l&&pt(t,e)),n})):[],u.update(),l=!0,x(u.before_update),u.fragment=!!i&&i(u.ctx),e.target){if(e.hydrate){var f=N(e.target);u.fragment&&u.fragment.l(f),f.forEach(C)}else u.fragment&&u.fragment.c();e.intro&&ot(t.$$.fragment),dt(t,e.target,e.anchor),Y()}I(a)}(Mt(e=r.call(this)),t,pe,ne,b,{modules:46,stack:45,refs:0,type:2,title:3,titleTrusted:4,text:5,textTrusted:6,styling:47,icons:48,mode:7,addClass:8,addModalClass:9,addModelessClass:10,autoOpen:49,width:50,minHeight:51,maxTextHeight:52,icon:11,animation:12,animateSpeed:13,shadow:14,hide:1,delay:53,mouseReset:54,closer:15,closerHover:16,sticker:17,stickerHover:18,labels:19,remove:55,destroy:56,getState:57,getTimer:58,getStyle:20,getIcon:21,open:59,close:22,animateIn:60,animateOut:61,cancelClose:62,queueClose:63,_preventTimerClose:64,on:65,update:66,fire:67,addModuleClass:68,removeModuleClass:69,hasModuleClass:70,getModuleHandled:71,setModuleHandled:72,getModuleOpen:73,setModuleOpen:74,setAnimating:75,getAnimatingClass:76,setAnimatingClass:77,_getMoveClass:78,_setMoveClass:79,_setMasking:80},[-1,-1,-1,-1]),e}return n=s,(i=[{key:"modules",get:function(){return this.$$.ctx[46]},set:function(t){this.$set({modules:t}),Y()}},{key:"stack",get:function(){return this.$$.ctx[45]},set:function(t){this.$set({stack:t}),Y()}},{key:"refs",get:function(){return this.$$.ctx[0]}},{key:"type",get:function(){return this.$$.ctx[2]},set:function(t){this.$set({type:t}),Y()}},{key:"title",get:function(){return this.$$.ctx[3]},set:function(t){this.$set({title:t}),Y()}},{key:"titleTrusted",get:function(){return this.$$.ctx[4]},set:function(t){this.$set({titleTrusted:t}),Y()}},{key:"text",get:function(){return this.$$.ctx[5]},set:function(t){this.$set({text:t}),Y()}},{key:"textTrusted",get:function(){return this.$$.ctx[6]},set:function(t){this.$set({textTrusted:t}),Y()}},{key:"styling",get:function(){return this.$$.ctx[47]},set:function(t){this.$set({styling:t}),Y()}},{key:"icons",get:function(){return this.$$.ctx[48]},set:function(t){this.$set({icons:t}),Y()}},{key:"mode",get:function(){return this.$$.ctx[7]},set:function(t){this.$set({mode:t}),Y()}},{key:"addClass",get:function(){return this.$$.ctx[8]},set:function(t){this.$set({addClass:t}),Y()}},{key:"addModalClass",get:function(){return this.$$.ctx[9]},set:function(t){this.$set({addModalClass:t}),Y()}},{key:"addModelessClass",get:function(){return this.$$.ctx[10]},set:function(t){this.$set({addModelessClass:t}),Y()}},{key:"autoOpen",get:function(){return this.$$.ctx[49]},set:function(t){this.$set({autoOpen:t}),Y()}},{key:"width",get:function(){return this.$$.ctx[50]},set:function(t){this.$set({width:t}),Y()}},{key:"minHeight",get:function(){return this.$$.ctx[51]},set:function(t){this.$set({minHeight:t}),Y()}},{key:"maxTextHeight",get:function(){return this.$$.ctx[52]},set:function(t){this.$set({maxTextHeight:t}),Y()}},{key:"icon",get:function(){return this.$$.ctx[11]},set:function(t){this.$set({icon:t}),Y()}},{key:"animation",get:function(){return this.$$.ctx[12]},set:function(t){this.$set({animation:t}),Y()}},{key:"animateSpeed",get:function(){return this.$$.ctx[13]},set:function(t){this.$set({animateSpeed:t}),Y()}},{key:"shadow",get:function(){return this.$$.ctx[14]},set:function(t){this.$set({shadow:t}),Y()}},{key:"hide",get:function(){return this.$$.ctx[1]},set:function(t){this.$set({hide:t}),Y()}},{key:"delay",get:function(){return this.$$.ctx[53]},set:function(t){this.$set({delay:t}),Y()}},{key:"mouseReset",get:function(){return this.$$.ctx[54]},set:function(t){this.$set({mouseReset:t}),Y()}},{key:"closer",get:function(){return this.$$.ctx[15]},set:function(t){this.$set({closer:t}),Y()}},{key:"closerHover",get:function(){return this.$$.ctx[16]},set:function(t){this.$set({closerHover:t}),Y()}},{key:"sticker",get:function(){return this.$$.ctx[17]},set:function(t){this.$set({sticker:t}),Y()}},{key:"stickerHover",get:function(){return this.$$.ctx[18]},set:function(t){this.$set({stickerHover:t}),Y()}},{key:"labels",get:function(){return this.$$.ctx[19]},set:function(t){this.$set({labels:t}),Y()}},{key:"remove",get:function(){return this.$$.ctx[55]},set:function(t){this.$set({remove:t}),Y()}},{key:"destroy",get:function(){return this.$$.ctx[56]},set:function(t){this.$set({destroy:t}),Y()}},{key:"getState",get:function(){return this.$$.ctx[57]}},{key:"getTimer",get:function(){return this.$$.ctx[58]}},{key:"getStyle",get:function(){return this.$$.ctx[20]}},{key:"getIcon",get:function(){return this.$$.ctx[21]}},{key:"open",get:function(){return this.$$.ctx[59]},set:function(t){this.$set({open:t}),Y()}},{key:"close",get:function(){return this.$$.ctx[22]},set:function(t){this.$set({close:t}),Y()}},{key:"animateIn",get:function(){return this.$$.ctx[60]},set:function(t){this.$set({animateIn:t}),Y()}},{key:"animateOut",get:function(){return this.$$.ctx[61]},set:function(t){this.$set({animateOut:t}),Y()}},{key:"cancelClose",get:function(){return this.$$.ctx[62]}},{key:"queueClose",get:function(){return this.$$.ctx[63]}},{key:"_preventTimerClose",get:function(){return this.$$.ctx[64]}},{key:"on",get:function(){return this.$$.ctx[65]}},{key:"update",get:function(){return this.$$.ctx[66]}},{key:"fire",get:function(){return this.$$.ctx[67]}},{key:"addModuleClass",get:function(){return this.$$.ctx[68]}},{key:"removeModuleClass",get:function(){return this.$$.ctx[69]}},{key:"hasModuleClass",get:function(){return this.$$.ctx[70]}},{key:"getModuleHandled",get:function(){return this.$$.ctx[71]}},{key:"setModuleHandled",get:function(){return this.$$.ctx[72]}},{key:"getModuleOpen",get:function(){return this.$$.ctx[73]}},{key:"setModuleOpen",get:function(){return this.$$.ctx[74]}},{key:"setAnimating",get:function(){return this.$$.ctx[75]}},{key:"getAnimatingClass",get:function(){return this.$$.ctx[76]}},{key:"setAnimatingClass",get:function(){return this.$$.ctx[77]}},{key:"_getMoveClass",get:function(){return this.$$.ctx[78]}},{key:"_setMoveClass",get:function(){return this.$$.ctx[79]}},{key:"_setMasking",get:function(){return this.$$.ctx[80]}}])&&wt(n.prototype,i),o&&wt(n,o),s}(mt),ye=e.default=me}])}));
class Watchdog {
    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        const me = this;
        this.enableWatchdogEvent(me);
        this.disableWatchdogEvent(me);
    }

    enableWatchdogEvent(me) {
        $('.set-watchdog').unbind('click').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/default/product/set-watchdog',
                data: {
                    Product_ID: $(this).data('product-id'),
                },
                success: me.processSuccessResponse(e.target),
            });
        });
    }

    disableWatchdogEvent(me) {
        $('.disable-watchdog').unbind('click').on('click', function (e) {
            e.preventDefault();
            $.ajax({
                type: "POST",
                url: '/default/product/disable-watchdog',
                data: {
                    Product_ID: $(this).data('product-id'),
                },
                success: me.processSuccessResponse(e.target),
            });
        });
    }

    processSuccessResponse(target) {
        const me = this;
        return async function (data) {
            try {
                data = JSON.parse(data);
                if (data.error) {
                    alerts.alert('Error', 'error', data.msg);
                } else {
                    await me.displayWatchdogConfirmationInfo(data.msg);

                    if ($(target).closest('.set-watchdog').length) {
                        $(target).text('Zrušit hlídacího psa');
                        $(target).closest('.set-watchdog')
                            .addClass('disable-watchdog')
                            .removeClass('set-watchdog');
                        me.bindEvents();
                    } else if ($(target).closest('.disable-watchdog').length) {
                        $(target).text('Hlídací pes');
                        $(target).closest('.disable-watchdog')
                            .addClass('set-watchdog')
                            .removeClass('disable-watchdog');
                        me.bindEvents();
                    }
                }
            } catch (e) {
                console.error(e);
                alerts.error();
            }
        };
    }

    async displayWatchdogConfirmationInfo(content) {
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog._title = 'Nastavení hlídacího psa';
        this.dialog._modalClass = 'watchdog-confirmation';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/watchdog-confirmation', {content});
    }
}
class Wishlist {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $('.add-to-wishlist').click((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                this.updateWishList(productID);
            });

            $('.remove-from-wishlist').click((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                this.deleteWishlistItem(productID);
                $this.parent('.item').parent('.col-lg-3').hide();
            });
        });
    }



    updateWishList(productID, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/wishlist/update-wish-list",
            data: {
                ProductID: productID
            },
            success: (data) => {
                let wishlistData = JSON.parse(data);
                // CartHeader.updateCartHeader(wishlistData.TotalPriceWithVat, wishlistData.TotalCount, wishlistData.cartItems);

                if ( wishlistData.successMsg )
                    alerts.alert('Hotovo', 'success', wishlistData.successMsg);

                if ( wishlistData.failMsg )
                    alerts.alert('Chyba', 'error', wishlistData.failMsg);

                /*if ( !assign )
                    CartPrompt.addedToCart();*/

                if ( callback )
                    callback(wishlistData);
            },
        });
    }

    deleteWishlistItem(productID, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/wishlist/delete-wish-list-item",
            data: {
                ProductID: productID,
            }
        //     success: (data) => {
        //         let cartData = JSON.parse(data);
        //         CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);
        //
        //         if ( callback )
        //             callback(cartData);
        //     },
        });
    }
}
class cartController {
    indexAction() {
        new CartPage();
    }
    emptyAction() {
        new CartPage();
    }
}
class categoryController {
    indexAction() {
        new CategoryLayout();
    }
}
class complaintController {
    indexAction() {
        new Complaint();
    }
}
class customerController {

    myaccountAction() {
        new MyAccount('order-list');
    }
    addressAction() {
        window.address = new Address();
    }

    registerAction() {
        window.registration = new Registration();
    }

    oldaccountAction() {
        window.oldAccountForm = new OldAccountForm();
    }

    changeaddressrequestAction() {
        window.changeAddressRequest = new ChangeAddressRequest();
    }
}
class Dispatch {
    constructor(page) {
        this.page = page;
        this.dispatch();
    }

    dispatch() {
        let className = page.controller + 'Controller';
        let functionName = this.prepareAction(page.action + 'Action');

        try {
            let checkClass = eval(`new ${className}()`);

            if ( typeof checkClass[functionName] === 'function')
                eval(`checkClass.${functionName}()`);

        } catch (e) { }
    }

    prepareAction(action) {
        return action.replace('-', '');
    }
}
class indexController {
    indexAction() {
        new MainContactForm();
    }
}
class manufacturerController {
    detailAction() {
        new ManufacturerLayout();
    }
}
class orderController {

    step1Action() {
        window.orderAddress = new OrderAddress();
    }

    step2Action() {
        window.cartRecapitulation = new CartRecapitulation();
        window.shippingPayment = new ShippingPayment();
        window.completeOrder = new CompleteOrder();
    }

    step3Action() {
        if(Layout.checkCookieName(Layout.UTM_COOKIE)) {
            Layout.deleteCookie(Layout.UTM_COOKIE);
        }
        if(Layout.checkCookieName(Layout.REFERER_COOKIE)) {
            Layout.deleteCookie(Layout.REFERER_COOKIE);
        }
    }
}
class pageController {
    indexAction() {
        new MainContactForm();
    }

    getPageSlug() {
        const u = location.href;
        return u.replace(/(^\w+:|^)\/\//, '').replace(location.host + '/page/', '').replace(location.search, '');
    }
}
class productController {
    indexAction() {
        new ProductLayout();
    }
}
class searchController {
    indexAction() {
        new SearchLayout();
    }
}
class Dialog {
    _uid; // UID
    _modalClass; // Titulek
    _title; // Titulek
    _content; // Obsah
    _footer; // Patička
    _shown; // Bool zda již bylo zobrazené

    _confirmButton;
    _cancelButton;
    _buttons;

    onBeforeOpen;
    onAfterOpen;
    onBeforeClose;
    onAfterClose;
    confirm_function;

    fade_interval;

    constructor() {
        this._modalClass = "";
        this._content = "";
        this._title = "";
        this._footer = "";
        this._uid = 'dialog_' + Math.random().toString(36).substring(10);
        window[this._uid] = this;

        this.init();
        this.bind();
    }

    static createDialog(title, content = "", footer = "") {
        let dialog = new Dialog();
        dialog.title = title;
        dialog.content = content;
        dialog.footer = footer;
        dialog.enableCancel();
        return dialog;
    }

    /**
     * Inicializace základních proměnných
     */
    init () {
        this._element = null;

        this._confirmButton = false;
        this._cancelButton = false;
        this._buttons = [];

        this.onBeforeClose = null;
        this.onAfterClose = null;
        this.onBeforeOpen = null;
        this.onAfterOpen = null;
        this.confirm_function = 'dialogConfirm()';
        this.fade_interval = 300;

        this._shown = false;
    }

    /**
     * Bind základních akcí
     */
    bind() {
        //
    }

    /**
     * Zavírá dialog;
     */
    close() {
        window.dialogIsShown = false;
        if (this.onBeforeClose && typeof this.onBeforeClose == "function")
            this.onBeforeClose();

        $('body').removeClass('modal-open');
        this._element.remove();
        $('.modal-backdrop').remove();
        $('#modal').hide(0);

        window[this._uid] = undefined;
        if (this.onAfterClose && typeof this.onAfterClose == "function")
            this.onAfterClose();

    }

    /**
     * Otevírá dialog
     */
    open() {
        if (window.dialogIsShown) {
            console.warn('Another dialog is opened already');
            return this;
        }

        window.dialogIsShown = true;
        
        if (this.onBeforeOpen && typeof this.onBeforeOpen == "function")
            this.onBeforeOpen();

        $('#modal').show(0);
        $('body').addClass('modal-open');
        if ($('.modal-backdrop').length === 0) {
            $('body').append('<div class="modal-backdrop fade show">');
        }
        
        this.render();

        //layout.bindEvents();

        if (this.onAfterOpen && typeof this.onAfterOpen == "function")
            this.onAfterOpen();

        return this;
    }

    /**
     * Zobrazuje dialog s obsahem z URL
     * @param {string} url URL s daty
     * @param {Object} params Parametry requestu
     * @param {boolean} json Označení, zda jsou data servírována v JSONu
     */
    openFromUrl(url, params = {}, json = false) {
        params.dialog_id = this._uid;

        $.ajax({
            url: url,
            data: params,
            success: (data) => {
                if (json){
                    try {
                        data = JSON.parse(data);
                        this._content = data.content;
                        this._title = data.title;
                        this._footer = data.footer;
                    } catch (ex) {
                        console.warn('Data cannot be parsed as JSON');
                        alerts.error();
                    }
                } else {
                    this._content = data
                }

                this.open()
            }
        })
    }

    /**
     * Přida tlačítko/akci
     * @param {number} id
     * @param {string} label
     * @param {?function|null} onClick
     * @param {?string} onClick
     * @param {?string|null} icon
     * 
     * @return {DialogAction} vrácí tlačítko
     */
    addAction(id, label, onClick = null, btnType = 'primary', icon = null) {
        let action = new DialogAction(this, id, label, onClick, btnType, icon)
        this._buttons.push(action)
        return Action;
    }

    /**
     * Vykreslí dialog a nastaví jej jako element
     * 
     * @return {Dialog} vrácí sebe
     */
    render() {
        if (this._buttons.length > 0)
            this._footer += this._renderActions();
        if (this._confirmButton)
            this._footer += `<button onclick="${this.confirm_function}"><i class="fas fa-check"></i>${projectVars.confirm}</button>`;
        if (this._cancelButton)
            this._footer += `<button onclick="window['${this._uid}'].close();"><i class="fas fa-times"></i>${projectVars.cancel}</button>`;

        let template = `
            <div class="modal-dialog modal-lg modal-dialog-centered ${this._modalClass}" id="${this._uid}" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${this._title}</h5>
                        <button type="button" class="close" onclick="window['${this._uid}'].close()" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ${this._content}
                    </div>
                    ${this._footer.length > 0?'<div class="modal-footer">' + this._footer + '</div>':''}
                </div>
            </div>
        `;

        this._element = template;
        this._getModal().append($(template));
        this._element = $('#' + this._uid);
        this._shown = true;

        return this;
    }

    /**
     * Vrací element modalu, připadně jej vytvoří
     * 
     * @return {JQuery}
     */
    _getModal() {
        let $modal = $('#modal');

        if ($modal.length > 0) {
            return $modal;
        } else {
            $('body').append('<div class="modal fade show" id="modal" style="display:block;" role="dialog"></div>');
            return this._getModal();
        }
    }

    /**
     * Rendruje tlačítka do footeru
     * 
     * @returns {string}
     */
    _renderActions() {
        let out = '';

        this._buttons.forEach((e) => {
            out += e.render();
        });

        return out;
    }

    /**
     * Odstraní tlačítko
     * 
     * @returns {string}
     */
    removeAction(index) {
        this._buttons.splice(index, 1);
        return this;
    }

    /**
     * Zapne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
    enableCancel() {
        this._cancelButton = true;
        return this;
    }

    /**
     * Zapne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
    enableConfirm(confirm_function = 'dialogConfirm()') {
        this.confirm_function = confirm_function;
        this._confirmButton = true;
        return this;
    }

    /**
     * Vypne tlačítko ve footeru pro zrušení akce
     * 
     * @returns {Dialog}
     */
    disableCancel() {
        this._cancelButton = false;
        return this;
    }

    /**
     * Vypne tlačítko ve footeru pro potvrzení akce
     * 
     * @returns {Dialog}
     */
    disableConfirm() {
        this._confirmButton = false;
        return this;
    }

    /*
     *      SETTERS
     */

    /**
     * Nastaví hlavičku
     * @param value
     */
    set modalClass(value) {
        this._modalClass = value;

        return this;
    }

    /**
     * Nastaví hlavičku
     * @param value
     */
    set title(value) {
        this._title = value;
        if (this._shown)
            this._element.find('.modal-title').html(value);

        return this;
    }

    /**
     * Nastaví obsah
     * @param value
     */
    set content(value) {
        this._content = value;
        if (this._shown)
            this._element.find('.modal-body').html(value);

        return this;
    }

    /**
     * Nastaví patičku
     * @param value
     */
    set footer(value) {
        this._footer = value;
        if (this._shown)
            this._element.find('.modal-footer').html(value);

        return this;
    }

    /*
     *      GETTERS
     */

    /**
     * Vrací jQuery element
     * @return {JQuery}
     */
    get element() {
        return this._element;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get uid() {
        return this._uid;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get modalClass() {
        return this._modalClass;
    }

    /**
     * Vrací ID dialogu
     * @return {string}
     */
    get title() {
        return this._uid;
    }
}
class DialogAction {
    _dialog;
    _id
    label;
    onClick;
    btnType;
    icon;

    constructor(dialog, id, label, onClick = null, btnType = 'primary', icon = null) {
        this._id = id,
        this.label = label;
        this.onClick = onClick;
        this.btnType = btnType;
        this.btnClasses = '';
        this.icon = icon;
        this._dialog = dialog;
    }

    render() {
        let template = `
            <button class="btn btn-${this.btnType}${this.icon?' btn-with-icon':''} ${this.btnClasses}" ${this.onClick?'onclick="' + this.onClick + '"':''}>
                ${this.icon?'<i class="' + this.icon + '"></i>':''}${this.label}
            </button>
        `;

        return template;
    }
}
class ChangeAddressRequest {

    constructor() {
        $(() => {
            this.questionForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('#confirm-question').click(() => {
            this.questionForm.validate();

            if ( this.questionForm.valid )
                $('#main-form').submit();
        });
    }
}
class Complaint {
    constructor() {
        this.complaintItemCounter = 1;
        $(() => {
            this.complaintForm = new Form('complaint-form');
            this.bindEvents();
            this.initializeTogglers();
            // this.initializeCountrySelects();
            this.initializeComplaintItems();
            $('.complaint-item').first().find('.complaint-item-title').text(`Položka č. 1`);
        });
    }

    bindEvents() {
        $('#confirm-complaint').click(() => {
            this.complaintForm.validate();

            let isValid = this.complaintForm.valid && $('#gdpr').prop('checked');

            $('select:visible').each(function () {
                let select = $(this);

                if (select.hasClass('select2-hidden-accessible') && !select.val()) {
                    let select2Container = select.siblings('.select2-container');
                    select2Container.addClass('input-error');
                    isValid = false;
                } else {
                    select.siblings('.select2-container').removeClass('input-error');
                }
            });

            if (isValid) {
                this.recapchaCallback();
            }
        });

        $('select').on('change', function () {
            $(this).siblings('.select2-container').removeClass('input-error');
        });
    }

    recapchaCallback() {
        grecaptcha.ready(() => {
            grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', {action: 'submit'}).then((token) => {
                $('<input>').attr({
                    type: 'hidden',
                    id: 'recaptchaToken',
                    name: 'Token',
                    value: token
                }).appendTo('#complaint-form');
                $('#complaint-form').submit();
            });
        });
    }

    initializeTogglers() {
        $('.with-toggler').click(function() {
            $(this).toggleClass('active');
            $(this).next().slideToggle();

            if ($(this).hasClass('active')) {
                $(this).next().find('input[type="hidden"]').val(1);
            } else {
                $(this).next().find('input[type="hidden"]').val(0);
            }
        });

        $('.company-block').hide();
        $('.delivery-address-block').hide();
    }

    initializeComplaintItems() {
        if ($('.complaint-item').length === 1) {
            $('.complaint-item').first().find('.remove-complaint-item').hide();
        }

        $('#add-complaint-item').click(() => {
            const maxCurrentNumber = Math.max(...$('.complaint-item').map(function() {
                return parseInt($(this).find('.complaint-item-title').text().replace('Položka č. ', ''));
            }).get());

            const newNumber = maxCurrentNumber + 1;

            var newItem = $('.complaint-item').first().clone();

            newItem.find('.complaint-item-title').text(`Položka č. ${newNumber}`);

            newItem.find('input, textarea').each((index, el) => {
                var $el = $(el);
                var originalId = $el.attr('id');
                var originalName = $el.attr('name');
                var newId = originalId ? originalId.replace(/\d+$/, '') + newNumber : '';
                var newName = originalName.replace(/\d+$/, '') + newNumber;

                $el.attr({
                    'id': newId,
                    'name': newName
                }).val('');
            });

            newItem.find('.remove-complaint-item').show();
            $('.complaint-item').first().find('.remove-complaint-item').show();

            $('#complaint-items').append(newItem);
        });

        $(document).on('click', '.remove-complaint-item', function() {
            if ($('.complaint-item').length > 1) {
                $(this).closest('.complaint-item').remove();

                $('.complaint-item').each((index, item) => {
                    const $item = $(item);
                    const newNumber = index + 1;

                    $item.find('.complaint-item-title').text(`Položka č. ${newNumber}`);

                    $item.find('input, textarea').each((idx, el) => {
                        const $el = $(el);
                        const originalId = $el.attr('id');
                        const originalName = $el.attr('name');

                        if (originalId) {
                            $el.attr('id', originalId.replace(/\d+$/, '') + newNumber);
                        }
                        $el.attr('name', originalName.replace(/\d+$/, '') + newNumber);
                    });
                });

                if ($('.complaint-item').length === 1) {
                    $('.complaint-item').first().find('.remove-complaint-item').hide();
                }
            } else {
                alert("Musí zůstat alespoň jedna položka zásilky.");
            }
        });
    }
}
class CompleteOrder {
    constructor() {
        $(() => {
            this.customerForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('.complete-order').click(() => {
            this.customerForm.validate();

            if ( !$('#terms').prop('checked') ) {
                $('.terms label').css('color', '#ea545f');
            } else {
                $('.terms label').css('color', '#212529');
            }

            console.log(this.customerForm.valid);

            if ( this.customerForm.valid ) {
                if ( $('#terms').prop('checked') ) {
                    $('.complete-order').attr('disabled', true);
                    $('<div class="progress-loader-wrap" style="float: left;top: -20px; left:38px"><div class="progress-loader"></div></div>').insertBefore('.complete-order');
                    $('.terms-label label').css('color', '#11142D');
                    const utmParams = Layout.checkCookieName(Layout.UTM_COOKIE);
                    const referer = Layout.checkCookieName(Layout.REFERER_COOKIE);
                    if(utmParams) {
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'UtmParams',
                            name: 'UtmParams',
                            value: utmParams
                        }).appendTo('#main-form');
                    }
                    if(referer) {
                        $('<input>').attr({
                            type: 'hidden',
                            id: 'Referer',
                            name: 'Referer',
                            value: referer
                        }).appendTo('#main-form');
                    }
                    $('#main-form').submit();
                }
            }
        });

        $('.company-toggler').click(function() {
            let companyBox = $('.company-box');
            $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
        });

        $('.delivery-toggler').click(function() {
            let deliveryBox = $('.delivery-box');
            $('#IsDelivery').prop('checked') ? deliveryBox.slideDown(300) : deliveryBox.slideUp(300);
        });

        $('.user-toggler').click(function() {
            let userBox = $('.user-box');
            $('#IsUser').prop('checked') ? userBox.slideDown(300) : userBox.slideUp(300);
            $('.user-box .pw').attr({ id:"Password", type:"password", name:"Password"});
            $('.user-box .pw-again').attr({id:"PasswordAgain", type:"password", name:"PasswordAgain"});
        });
    }

    validateEmail(value) {
        let result = true;

        if ($("#IsUser").length == 0)
            return result;

        if (!$("#IsUser").prop('checked'))
            return result;

        $.ajax({
            type: "POST",
            url: "/default/customer/check-email/",
            data: { Email: value },
            async: false,
            success: function(data) {
                result = (data != 1);
            }
        });
        return result;
    }

    validatePassword() {
        let password = $('#Password').val();
        let passwordAgain = $('#PasswordAgain').val();
        let result = true;

        if ( password !== passwordAgain)
            result = false;

        return result;
    }
}
/**
 * Kupóny
 */
class Coupon {
    /**
     * Konstruktor pro kupóny
     * @param form_id
     */
    constructor(form_id = 'coupon-form') {
        this._element = document.getElementById(form_id);
        this._form = new Form(form_id);

        this.init();
    }

    /**
     * Vrací formulář
     * @return {*|jQuery|HTMLElement}
     */
    get $form() {
        return $(this._element);
    }

    init() {
        $(() => {
            this.$input = this.$form.find('input[name="couponCode"]');
            this.$submit = this.$form.find('button[type="submit"]');
            this.$reset = this.$form.find('button[type="reset"]');

            if (this.$input.val().length) {
                this.handleSuccess();
            }
        });

        this.$form.on('submit', (e) => {
            e.preventDefault();
            this.applyCoupon(this.$input.val());
        });

        this.$form.on('reset', (e) => {
            this.removeCoupon();
        });
    }

    /**
     * Aplikuje kupón
     * @param {string} coupon
     */
    applyCoupon(coupon) {
        $.ajax({
            url: projectVars.basePath + '/cart/apply-coupon',
            method: 'POST',
            data: {
                coupon: coupon
            },
            success: (data) => {
                try {
                    data = JSON.parse(data);
                    if (data.error === true)
                        return this.handleError(data.error_msg);

                    this.handleSuccess();
                } catch (ex) {
                    this.handleError();
                }
                location.reload();
                //CartPage.refreshCart();
            },
            error: () => {
                this.handleError();
            },
        });
    }


    removeCoupon() {
        $.ajax({
            url: projectVars.basePath + '/cart/remove-coupon',
            method: 'POST',
            success: (data) => {
                this.$input.prop('readonly', false);
                this.$reset.hide();
                this.$submit.show();
                location.reload();
                //CartPage.refreshCart();
            },
            error: () => {
                this.handleError();
            },
        });
    }

    /**
     * Handle pro error
     * @param {string|null} msg
     * @return {boolean}
     */
    handleError(msg = null) {
        this.$input.prop('readonly', false);
        this.$reset.hide();
        this.$submit.show();

        if (msg)
            alerts.alert('Error', 'error', msg);
        else
            alerts.error();

        return false;
    }

    /**
     * Handle pro úspěšné užití
     */
    handleSuccess() {
        this.$input.attr('readonly', true);
        this.$reset.show();
        this.$submit.hide();
    }
}
class LoginForm {

    constructor() {
        $('body').on('click', '#confirm-login', function () {
            $('.userError').hide();

            if ($('#LoginEmail').val() && $('#LoginPassword').val()) {
                $.ajax({
                    type: "POST",
                    url: "/default/customer/login-process",
                    data: {
                        Email: $('#LoginEmail').val(),
                        Password: $('#LoginPassword').val(),
                    },
                    async: false,
                    success: function (data) {
                        const dataObj = JSON.parse(data);
                        if (dataObj.success && !dataObj.userFromOldAccount) {
                            if (location.href.includes('/logout') || location.href.includes('/register-done') || location.href.includes('/set-new-password')) {
                                location.href = '/';
                            } else {
                                location.reload();
                            }
                        }
                        if (dataObj.success && dataObj.userFromOldAccount) {
                            location.href = '/default/customer/old-account?hash=' + dataObj.hash;
                        }
                        if (!dataObj.success && dataObj.userFromOldAccount) {
                            $('.userError').show();
                        }
                        if (!dataObj.success && !dataObj.userFromOldAccount) {
                            $('.userError').show();
                        }

                    }
                });
            } else {
                $('.userError').show();
            }
        });

        $('.loginDialog .modal-body').keypress(function (e) {
            if (e.keyCode === 13) {
                $('#confirm-login').trigger('click');
            }
        });

    }
}
class MainContactForm {
    constructor() {
        $(() => {
            this.contactForm = new Form("contact-us-form");
            this.bindEvents();
        });
    }

    bindEvents() {
        $("#contact-us-form #confirm-contact-form").click(async (e) => {
            e.preventDefault();
            if (this.contactForm.validate()) {
                await this.recapchaCallback();
            }
        });
    }

    recapchaCallback() {
        const me = this;
        grecaptcha.ready(function () {
            grecaptcha.execute('6LdSvYUsAAAAAMEc4A38re5VImJbJI1Jz04BF2PX', { action: 'submit' }).then(function (token) {
                me.validateForm(token);
            });
        });
    }

    validateForm(token) {
        $('<div class="progress-loader-wrap" style="float: initial; margin: 0 auto; position: absolute; right: 15px; top: -26px"><div class="progress-loader"></div></div>').insertBefore('#confirm-contact-form');
        $('#confirm-contact-form').hide();
        $.ajax({
            type: "POST",
            url: "/default/page/contact-us",
            data: {
                Name: $('#name').val(),
                Company: $('#company').val(),
                Email: $('#email').val(),
                Subject: $('#subject').val(),
                Message: $('#message').val(),
                Token: token
            },
            success: function (data) {
                $('#contact-us-form').trigger("reset");
                $('#contact-us-form form').hide();
                $('#contact-us-form').css('height', '125px');
                $('#contact-us-form').html('<p><strong>Vaše zpráva byla úspěšně odeslána. Děkujeme</strong></p>');
            },
        });
    }
}
class OldAccountForm {
    constructor() {
        $(() => {
            this.registrationForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('input[name="Hash"]').val(window.location.search.replace('?hash=', ''));

        $('#confirm-registration').click((e) => {
            e.preventDefault();
            if ( !$('#terms').prop('checked') ) {
                $('.terms label').css('color', '#ea545f');
            } else {
                $('.terms label').css('color', '#212529');
            }

            if ( !$('#gdpr').prop('checked') ) {
                $('.gdpr label').css('color', '#ea545f');
            } else {
                $('.gdpr label').css('color', '#212529');
            }

            this.registrationForm.validate();

            if ( this.registrationForm.valid && $('#gdpr').prop('checked')) {

                $('#main-form').submit();
            }
        });

        $('.company.with-toggler').click(function() {
            $('.company-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsCompany"]').val($(this).hasClass());
        });

        $('.delivery-address.with-toggler').click(function() {
            $('.delivery-address-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsDeliveryAddress"]').val($(this).hasClass());
        });
    }

    validateEmail(value) {
        let result = true;
        $.ajax({
            type: "POST",
            url: "/default/customer/check-email",
            data: { Email: value },
            async: false,
            success: function(data) {
                result = (data != 1);
            }
        });

        return result;
    }

    validatePassword() {
        let password = $('#Password').val();
        let passwordAgain = $('#PasswordAgain').val();
        let result = true;

        if ( password !== passwordAgain)
            result = false;

        return result;
    }
}
class OrderAddress {
    constructor() {
        $(() => {
            this.customerForm = new Form('main-form');
            $('#step-2').removeAttr('href');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('#step-2').click(() => {
            this.customerForm.validate();

            if ( this.customerForm.valid ) {
                $('#main-form').submit();
            }
        });

        $('.continue-shopping').click(() => {
            $('#main-form').submit();
        });

        $('#DFirstName, #DLastName, #DStreet, #DCity, #DZipCode').on('input', () => {
            this.deliveryAddressToggle();
        });


        $('#invoiceAddressesSelect').change(() => {
            let addressID = $('#invoiceAddressesSelect').val();
            this.reloadAddress(addressID, 'invoice');
        });

        $('#deliveryAddressesSelect').change(() => {
            let addressID = $('#deliveryAddressesSelect').val();
            this.reloadAddress(addressID, 'delivery');
            this.deliveryAddressToggle();
        });

        $('.company.with-toggler').click(function() {
            $('.company-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsCompany"]').val($(this).hasClass());
        });

        $('.delivery-address.with-toggler').click(function() {
            $('.delivery-address-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsDeliveryAddress"]').val($(this).hasClass());
        });

        $('.user.with-toggler').click(function() {
            $('.register-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsRegister"]').val($(this).hasClass());
        });
    }

    validateEmail(value) {
        let result = true;

        if ($("#IsUser").length == 0)
            return result;

        if (!$("#IsUser").prop('checked'))
            return result;

        $.ajax({
            type: "POST",
            url: "/default/customer/check-email",
            data: { Email: value },
            async: false,
            success: function(data) {
                result = (data != 1);
            }
        });
        return result;
    }

    validatePassword() {
        let password = $('#Password').val();
        let passwordAgain = $('#PasswordAgain').val();
        let result = true;

        if ( password !== passwordAgain)
            result = false;

        return result;
    }

    deliveryAddressToggle() {
        if($('#DFirstName').val() === '' &&
            $('#DLastName').val() === '' &&
            $('#DStreet').val() === '' &&
            $('#DCity').val() === '' &&
            $('#DZipCode').val() === '') {
            $('input[name="IsDeliveryAddress"]').val(0);
            $('.delivery-address-block').hide();
        }

    }

    reloadAddress(addressID, type) {
        $.ajax({
            type: "POST",
            url: "/default/order/get-address",
            data: { AddressID: addressID },
            success: function(data) {
                let address = JSON.parse(data);

                if(type === 'invoice') {
                    $('#FirstName').val(address.FirstName);
                    $('#LastName').val(address.LastName);
                    $('#Street').val(address.Street);
                    $('#City').val(address.City);
                    $('#ZipCode').val(address.ZipCode);
                    $('#Phone').val(address.Phone);
                    $('#CompanyName').val(address.CompanyName);
                    $('#ICO').val(address.IC);
                    $('#DIC').val(address.DIC);
                }

                if(type === 'delivery') {
                    $('#DFirstName').val(address.FirstName);
                    $('#DLastName').val(address.LastName);
                    $('#DStreet').val(address.Street);
                    $('#DCity').val(address.City);
                    $('#DZipCode').val(address.ZipCode);
                }
            }
        });
    }
}
class Question {
    constructor() {
        $(() => {
            this.questionForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('#confirm-question').click(() => {
            this.questionForm.validate();

            if ( this.questionForm.valid )
                $('#main-form').submit();
        });
    }
}
class QuestionProduct {
    constructor() {
        $(async () => {
            this.contactForm=new Form("QuestionForm");
            if(this.contactForm.validate()){
                await this.recapchaCallback()
            }
        });
    }

    recapchaCallback(){
        const me=this;
        grecaptcha.ready(function() {
            grecaptcha.execute('6LdSvYUsAAAAAMEc4A38re5VImJbJI1Jz04BF2PX', {action: 'submit'}).then(function(token) {
                me.validateForm(token);
            });
        });
    }

    validateForm(token) {
        $.ajax({
            type: "POST",
            url: '/default/product/process-question',
            data: {
                Product_ID: $('#Product_ID').val(),
                Email: $('#Email').val(),
                Phone: $('#Phone').val(),
                Description: $('#Description').val(),
                Token: token
            },
           success: function (data) {
                try {
                    data = JSON.parse(data);
                    if (data.error) {
                        alerts.alert('Error', 'error', data.msg);
                    } else {
                          const dialogId = $('#Dialog_ID').val();
                            window[dialogId].close();
                            window.onSuccessDialog();
                    }
                } catch(e) {
                    console.error(e);
                    alerts.error();
                }
            },
        });
    }
}
class Range {
    options;
    currenturl ='';
    activeFilters='';
    parameterRanges = {}

    constructor(rangeSelector, options) {
        $(() => {
            this.options = options;
            this.options.name = rangeSelector.replace('#','');
            this.parameterRanges = {[this.options.name] : []};
            this.parameterRanges[this.options.name]
                .push(...this.getActiveRanges(this.options.paramNameFrom, this.options.paramNameTo));
            if(this.options.paramNameFrom.length > 0) {
                window.activeRanges = Object.assign(window.activeRanges, {
                    [this.options.name]: {
                        [this.options.paramNameFrom]: this.parameterRanges[this.options.name][0],
                        [this.options.paramNameTo]: this.parameterRanges[this.options.name][1],
                    }
                });
            }
            this.initializeRange(rangeSelector);
            this.currenturl = $('h1').data('current-url');
            this.currentSlug = $('h1').data('current-slug');

            this.activeFilters = this.getActiveFilters();
        });
    }

    initializeRange(rangeSelector) {
        const me = this;
        $(rangeSelector).jRange({
            from: this.options.from,
            to: this.options.to,
            step: 1,
            scale: [$(rangeSelector).data('from'), ...this.divideRange(this.options.to, 2)],
            format: '%s',
            width: '100%',
            isRange: true,
            showLabels: false,
            ondragend: function (vals) {
                me.formatNumber($(rangeSelector).parent()[0].id);
                return me.handleRangeEvent(vals, rangeSelector);
            },
            onstatechange: function () {
                me.formatNumber($(rangeSelector).parent()[0].id);
                me.pagination = 1;
            }
        })
        this.setAlreadySpecifiedRange(rangeSelector);
    }

    setAlreadySpecifiedRange(rangeSelector) {
        if (this.parameterRanges[this.options.name][0]) {
            $(rangeSelector).jRange('setValue', `${this.parameterRanges[this.options.name][0]},${this.parameterRanges[this.options.name][1]}`);
            $(rangeSelector).prev('.range-info').children('.range-from').html(this.parameterRanges[this.options.name][0]);
            $(rangeSelector).prev('.range-info').children('.range-to').html(this.parameterRanges[this.options.name][1]);
        }
            else {
            $(rangeSelector).prev('.range-info').children('.range-from').html(this.options.from);
            $(rangeSelector).prev('.range-info').children('.range-to').html(this.options.to);
        }
    }

    divideRange(number, parts) {
        const range = []
        for(let i= 1; i <= parts; i++) {
            range.push(number/i);
        }
        return range.reverse();
    }

    formatNumber(idSelector) {
        $(`#${idSelector} .range-from`).html($(`#${idSelector} .pointer-label.low`).html().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
        $(`#${idSelector} .range-to`).html($(`#${idSelector} .pointer-label.high`).html().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
    }

    handleRangeEvent(vals) {
        const valArray = vals.split(',');
        this.parameterRanges[this.options.name] = [];
        for (let i = 0; i<valArray.length; i++) {
            this.addToParamsArray(this.options.name, i, valArray[i]);
        }
        this.updateCategoryUrl();
        return this.loadProducts();
    }

    addToParamsArray(name, index, value) {
        this.parameterRanges[name][index] = value;
        window.activeRanges[name][Object.keys( window.activeRanges[name])[index]] = value;
    }

    updateCategoryUrl(){
        const infoFilter = {
            filterKey:Object.keys(this.activeFilters)[0],
            filterValue:Object.values(this.activeFilters)[0],
        }

        let infoRange = '';
        for( const [i, v] of Object.keys(window.activeRanges).entries()) {
            if(Object.values( window.activeRanges[v])[0]=== null) {
                continue;
            }
            let separator = infoRange.length>0 && i>0?'&':'';
            infoRange += separator + Object.keys(window.activeRanges[v])[0]+'=';
            infoRange += Object.values(window.activeRanges[v])[0];
            infoRange += '&' + Object.keys(window.activeRanges[v])[1]+'=';
            infoRange += Object.values(window.activeRanges[v])[1];
        }

        const filterParams= `${infoFilter.filterKey}=${infoFilter.filterValue}`;
        const rangeParams = infoRange;
        this.changePageAndReplace(1);

         if(infoFilter.filterValue) {
             window.history.pushState({},"", `?${filterParams}&${rangeParams}`);
         } else {
             window.history.pushState({},"", `?${rangeParams}`);
         }
    }

    loadProducts() {
        const me = this;
        let url;
        url = `/ajax-load` + this.removePageFromString(projectVars.currentURI);

        $(`#category-products`).addClass('loading');
        $.ajax({
            url,
            data: {...this.getFilterRangeData(), ...this.activeFilters},
            type: "GET",
            dataType: "html",
            success: function (data) {
                $(`#category-products`).html(data);
                $(`#category-products`).removeClass('loading');
                if(!$('#pagination').length) {
                    $('<div class="list-pagination" id="pagination"></div>').insertAfter('#category-products');
                }
                me.updatePagination(1)

            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
                $(`#category-products`).removeClass('loading');
            },
            complete: function (xhr, status) {
                me.initializeSortingFunctionality();
            }
        });
    }

    getActiveFilters(){
        const params = new URLSearchParams(document.location.search);
        return {'f': params.get("f")};
    }

    getActiveRanges(from, to) {
        const params = new URLSearchParams(document.location.search);
        return [params.get(from), params.get(to)];
    }

    getFilterRangeData() {
        let filterRangeData = {}
        for( const objType of Object.keys(window.activeRanges)) {
            if(Object.values( window.activeRanges[objType])[0]=== null) {
                continue;
            }
            Object.assign(filterRangeData, window.activeRanges[objType]);
        }
        return filterRangeData;
    }

    initializeSortingFunctionality() {
        $('.sorting a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let sorting = $this.data('sorting');
            Cookie.setCookie('sorting', sorting, 10);
            location.reload();
        });
    }

    removePageFromString(url) {
        return url.replace(/\/?(page\/\d+\/?)/i, '');
    }

    changePageInUrl(url, newPage) {
        const urlObject = new URL(url);
        const pathParts = urlObject.pathname.split('/');

        const pageIndex = pathParts.indexOf('page');
        if (pageIndex !== -1 && pageIndex + 1 < pathParts.length) {
            pathParts[pageIndex + 1] = newPage.toString();
            urlObject.pathname = pathParts.join('/');
        }

        return urlObject.toString();
    }

   changePageAndReplace(newPage) {
        const currentUrl = window.location.href;
        const newUrl = this.changePageInUrl(currentUrl, newPage);

        window.history.replaceState({}, '', newUrl);
    }

    updatePagination(pagination) {
        const url = '/category/page-update';
        $.ajax({
            url,
            data: {
                'slug': this.currentSlug,
                'page': pagination,
                ...this.getFilterRangeData(), ...this.activeFilters
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                $(`#pagination`).html(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
        });
    }

}
class Registration {
    constructor() {
        $(() => {
            this.registrationForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
        $('<a id="loadDataFromAres" class="btn btn-primary" style="position:absolute; right:18px; padding:5px 10px; bottom:4px">Vyplnit fa údaje z ARES</a>').insertAfter($('#IC'));
        $('#loadDataFromAres').click((e) => {
            $.ajax({
                type: "POST",
                url: "/default/customer/check-ic",
                data: { IC: $('#IC').val() },
                success: function(data) {
                    if (data && data.status === 'success') {
                        const companyData = data.data;
                        $('#CompanyName').val(companyData.company);
                        $('#Street').val(companyData.street + ' ' + companyData.descriptiveNumber + (companyData.orientationNumber?('/' + companyData.orientationNumber) : ''));
                        $('#City').val(companyData.city);
                        $('#ZipCode').val(companyData.zip);
                        $('#DIC').val(companyData.tin);
                    } else {
                        alert('Zadané IČ není platné, nebo nebylo nalezeno v ARES.');
                    }
                }
            });
        })



        $('#confirm-registration').click((e) => {
            e.preventDefault();
            if ( !$('#terms').prop('checked') ) {
                $('.terms label').css('color', '#ea545f');
            } else {
                $('.terms label').css('color', '#212529');
            }

            if ( !$('#gdpr').prop('checked') ) {
                $('.gdpr label').css('color', '#ea545f');
            } else {
                $('.gdpr label').css('color', '#212529');
            }

            this.registrationForm.validate();

            if ( this.registrationForm.valid && $('#terms').prop('checked') && $('#gdpr').prop('checked')) {
                this.recapchaCallback();
            }
        });

        $('.company.with-toggler').click(function() {
            $('.company-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsCompany"]').val($(this).hasClass());
        });

        $('.delivery-address.with-toggler').click(function() {
            $('.delivery-address-block').toggle(300);
            $(this).toggleClass('active');
            $('input[name="IsDeliveryAddress"]').val($(this).hasClass());
        });
    }

    recapchaCallback(){
        grecaptcha.ready(function() {
            grecaptcha.execute('6Ld4ogArAAAAAN-5fVn8mxHa848vSIN4pqJ41BYy', {action: 'submit'}).then(function(token) {
                $('<input>').attr({
                    type: 'hidden',
                    id: 'recaptchaToken',
                    name: 'Token',
                    value: token
                }).appendTo('#main-form');
                $('#main-form').submit();
            });
        });
    }

    validateEmail(value) {
        let result = true;
        $.ajax({
            type: "POST",
            url: "/default/customer/check-email",
            data: { Email: value },
            async: false,
            success: function(data) {
                result = (data != 1);
            }
        });

        return result;
    }

    validatePassword() {
        let password = $('#Password').val();
        let passwordAgain = $('#PasswordAgain').val();
        let result = true;

        if ( password !== passwordAgain)
            result = false;

        return result;
    }
}
class Cookie {
    static setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}
class Form {
    static VALIDATOR_REQUIRED = ':required';
    static VALIDATOR_IN= ':in-validator';
    static VALIDATOR_MIN_LENGTH = ':min_length';
    static VALIDATOR_MAX_LENGTH = ':max_length';
    static VALIDATOR_LENGTH = ':length';
    static VALIDATOR_EMAIL = ':email';
    static VALIDATOR_PATTERN = ':pattern';
    static VALIDATOR_NUMBER = ':number';
    static VALIDATOR_RANGE = ':range';

    constructor(form_id) {
        this.$form = $('#' + form_id);
        this.valid = true;
    }

    checkVisibility(d) {
        if (d === undefined)
            return true;
        else
            return !$(d).is(':hidden');
    }

    validate() {
        this.valid = true;
        this.$form.find(':input').each((i, e) => {
            e = $(e);
            let validation_data = e.data('validator');
            if (validation_data === undefined)
                return;
            else if (typeof validation_data === 'string')
                validation_data = JSON.parse(validation_data);
            let value = e.val();
            let errorMessage = '';
            let errorDiv = $("#" + e.attr('name') + "Error");
            errorDiv.html('');
            e.removeClass('input-error');

            validation_data.forEach((v) => {
                switch (v.v) {
                    case Form.VALIDATOR_REQUIRED:
                        if (this.checkVisibility(v.d) && !Form.validateRequired(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_IN:
                        if (this.checkVisibility(v.d) && !Form.validateRegex(value, '^[0-9]{1,8}$'))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_EMAIL:
                        if (this.checkVisibility(v.d) && !Form.validateEmail(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_LENGTH:
                        if (this.checkVisibility(v.d) && !Form.validateLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_MAX_LENGTH:
                        if (this.checkVisibility(v.d) && !Form.validateMaxLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_MIN_LENGTH:
                        if (this.checkVisibility(v.d) && !Form.validateMinLength(value, v.p))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_NUMBER:
                        if (this.checkVisibility(v.d) && !Form.validateNumber(value))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_PATTERN:
                        let re = new RegExp(v.p);
                        if (this.checkVisibility(v.d) && !Form.validateRegex(value, re))
                            errorMessage += v.m;
                        break;
                    case Form.VALIDATOR_RANGE:
                        if (this.checkVisibility(v.d) && !Form.validateRange())
                            errorMessage += v.m;
                        break;
                    default:
                        let validateFunction = v.v.split('.');
                        if (typeof window[validateFunction[0]][validateFunction[1]] === 'function') {
                            if (!window[validateFunction[0]][validateFunction[1]](value))
                                errorMessage += v.m;
                        }
                        break;
                }
            });

            if (errorMessage !== '') {
                if (errorDiv.length === 0)
                    e.after($(`<div class="error" id="${e.attr('name')}Error"></div>`));
                $("#" + e.attr('name') + "Error").html(errorMessage);
                e.addClass('input-error');
                this.valid = false;
            }
        });

        return this.valid;
    }

    static validateRegex(value, pattern) {
        let r = new RegExp(pattern);
        return value.match(r) != null
    }

    static validateMinLength(value, minlength) {
        return value.length >= minlength;
    }

    static validateMaxLength(value, maxlength) {
        return value.length <= maxlength;
    }

    static validateLength(value, length) {
        return toString(value).length === length;
    }

    static validateEmail(value) {
        return this.validateRegex(value.toLowerCase(), /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }

    static validateRequired(value) {
        return value != '';
    }

    static validateNumber(value) {
        return value.isInteger(value);
    }

    static validateRange(value, min, max) {
        return min >= value && value <= max;
    }
}
class GoogleMap {
    apiKey;
    coordinates;
    iconName;
    elementId;
    constructor(options) {
        $(() => {
            this.apiKey = options.apiKey;
            this.coordinates = {lat: options.lat, lng: options.lng};
            this.iconName = options.iconName;
            this.elementId = options.elementId;
            this.bindEvents();
        });
    }

    bindEvents() {
        this.handleMap()
    }

    handleMap() {
        const me = this;
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&v=weekly"`;
        script.onload = function() {
           me.initMap();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }


   initMap() {
        const map = new google.maps.Map(document.getElementById(this.elementId), {
            center: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
            zoom: 16,
        });

        const iconBase = "/img/front/icons/";
        const icons = {
            evidsoft: {
                icon: iconBase + this.iconName,
            },
        };
        const features = [
            {
                position: new google.maps.LatLng(this.coordinates.lat, this.coordinates.lng),
                type: "evidsoft",
            },
        ];

        // Create markers.
        for (let i = 0; i < features.length; i++) {
            const marker = new google.maps.Marker({
                position: features[i].position,
                icon: icons[features[i].type].icon,
                map: map,
            });
        }
    }
}
class Helpers {

}
class NumberHelpers {
    formatPrice(number) {
        return this.number_format(number, projectVars.priceDecimalPlaces, ',', ' ') + ' ' + projectVars.currencyLabel;
    }

    isInteger(value) {
        return !!(Math.floor(value) == value && $.isNumeric(value));
    }

    number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }
}
class Tabs {
    constructor(tabcontainer_id) {
        this.tabcontainerID = '#' + tabcontainer_id;

        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        $(this.tabcontainerID + ' ul.tabs li').click((e) => {
            let $this = $(e.target);
            this.changeTab($this);
        });
    }

    changeTab(tab) {
        $(this.tabcontainerID + ' ul.tabs li').removeClass('current');
        $(this.tabcontainerID + ' .tab-content').removeClass('current');

        tab.addClass('current');
        $("#" + tab.attr('data-tab')).addClass('current');
    }
}
class AddressEditLayout {

    constructor() {
        $(() => {
            this.addressForm = new Form('main-form');
            this.bindEvents();
        });
    }

    bindEvents() {
         this.clickEvent();

    }

    clickEvent() {
        const me = this;
        $(".edit-address").click(function (event) {
            const addressId = $(this).data('id');
            const type = $(this).data('type');
            me.loadPage(addressId, type);
        })

        $(".remove-address").click(async function (event) {
            event.preventDefault();
            if (this.dialog) { this.dialog.close(); }
            const addressId = $(this).data('id');

            this.dialog = new Dialog();
            this.dialog._title = 'Opravdu chcete odstranit adresu?';
            this.dialog._modalClass = 'delete-address-confirmation';
            await this.dialog.openFromUrl(projectVars.basePath + '/modal/delete-address-confirmation', {addressId} );
        })

        $(".create-address-item").click(function (event) {
            const type = $(this).data('type');
            me.loadPage(null, type);
        })

    }


    loadPage(addressId, type) {
        const me = this;
        let url;
        url = this.buildProperUrlForPageLoading();
        $.ajax({
            url,
            data: {
                addressId,
                type
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPageIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function () {
                 $('#confirm-address').click(() => {
                     me.addressForm = new Form('main-form');
                     $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
                     me.addressForm.validate();

                    if ( me.addressForm.valid ) {
                        let data = {};
                        if(type === 'type-delivery') {
                           data = {
                                AddressId: addressId,
                                Label: $('#Label').val(),
                                MainAddress: $('#MainAddress').is(':checked') ? 1 : 0,
                                DFirstName: $('#DFirstName').val(),
                                DLastName: $('#DLastName').val(),
                                DStreet: $('#DStreet').val(),
                                DZipCode: $('#DZipCode').val(),
                                DCity: $('#DCity').val(),
                                DCountry: $('#DCountry').val(),

                               IsDelivery: true
                            }
                        } else {
                            data = {
                                AddressId: addressId,
                                Label: $('#Label').val(),
                                MainAddress: $('#MainAddress').is(':checked') ? 1 : 0,
                                FirstName: $('#FirstName').val(),
                                LastName: $('#LastName').val(),
                                Street: $('#Street').val(),
                                ZipCode: $('#ZipCode').val(),
                                City: $('#City').val(),
                                Country: $('#Country').val(),
                                Phone: $('#Phone').val(),
                                CompanyName: $('#CompanyName').val()??'',
                                IC: $('#IC').val()??'',
                                DIC: $('#DIC').val()??'',
                            }
                        }
                        $.ajax({
                            url: "/default/customer/address-edit-process",
                            type: 'POST',
                            dataType: "html",
                            data,
                            success: function (data) {
                                new MyAccount('address-list');
                                setTimeout(()=> {
                                    $('#address-edit-load').show();
                                    $('#address-edit-load').css('opacity', '1');
                                    $('#address-edit-load').css('width', '100%');
                                    $('#address-edit-load').css('height', 'auto');
                                    $('#address-edit-load').html(data);
                                }, 500)

                            },
                        })

                    }
                });

                $('.company-toggler').click(() => {
                    let companyBox = $('.company-box');
                    $('#IsCompany').prop('checked') ? companyBox.slideDown(300) : companyBox.slideUp(300);
                });

                $('.delivery-toggler').click(() => {
                    let deliveryBox = $('.delivery-box');
                    $('#IsDelivery').prop('checked') ? deliveryBox.slideDown(300) : deliveryBox.slideUp(300);
                });

                $('#close-edit-address').click(()=>{
                    $('#address-edit-load').hide();
                });
            }
        });
    }

    buildProperUrlForPageLoading() {
        return `/customer/address-edit`
    }

    insertLoadedPageIntoPage(data) {
        $('#address-edit-load').addClass('open');
        $('#address-edit-load').hide();
        $('#address-edit-load').html(data);
        $('#address-edit-load').show(500);
        $('html, body').animate({ scrollTop: 0 }, 500);
    }


}
class CategoryLayout {
    pagination = 1;
    remainingProducts;

    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        this.pagination = $('#ajax-load').data('current-page');
        this.remainingProducts = $(`.showing.pagination-${this.pagination}`).data('remaining-to-display');
        this.ajaxClickEvent();
        this.hideDisplayMoreButtonIfNoMoreProductsExist(this.remainingProducts);

        $('#back-to-product-top').click((e)=> {
            new Layout().backToTop();
        });

        $('.sorting a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let sorting = $this.data('sorting');
            Cookie.setCookie('sorting', sorting, 10);
            location.reload();
        });

        $('.grid a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let grid = $this.parent().data('grid');
            Cookie.setCookie('grid', grid, 10);
            location.reload();
        });

        $( "#show-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $('#show-more-description').hide();
            });
        });

        $( "#collapse-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $('#show-more-description').show();
                new Layout().doScroll("#category-headline");
            });
        });
        new Watchdog();
    }

    ajaxClickEvent() {
        const me = this;
        $("#ajax-display-more").click(function (event) {
            event.preventDefault();
            $(".loader-circle").show();
            me.loadProducts(me.increasePagination());
            new Layout().doScroll(`#ajax-product-row-${me.pagination}`);
        });
    }

    loadProducts(pagination) {
        const me = this;

        this.createDivContainerForLoadingOfProducts(pagination);
        let url;
        url = this.buildProperUrlForProductLoading(pagination);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedProductsIntoPage(pagination, data);
                me.hideDisplayMoreButtonIfNoMoreProductsExist($(`.showing.pagination-${pagination}`).data('remaining-to-display'));
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function (xhr, status) {
                me.removePreviousPaginationRow(pagination);
                me.updateUrl(pagination);
                me.updatePagination(pagination);
                const wishlist = new Wishlist();
            }
        });
    }
    createDivContainerForLoadingOfProducts(pagination) {
        if(pagination === 1) {
            $("#ajax-load").empty()
            $("#ajax-load").append(`<div id="ajax-product-row-${pagination}"></div>`);
        } else {
            $("#ajax-load").append(`<div id="ajax-product-row-${pagination}"></div>`);
        }
    }

    buildProperUrlForProductLoading(pagination) {
        let category = $("#ajax-load").data('category-slug');
        let currentFilter = $("#ajax-load").data('current-filter');
        return `/c/${category}/load-page/${pagination}?f=${currentFilter}`;
    }

    insertLoadedProductsIntoPage(pagination, data) {
        $(`#ajax-product-row-${pagination}`).hide();
        $(`#ajax-product-row-${pagination}`).html(data);
        $(`#ajax-product-row-${pagination}`).show(500);
    }

    insertLoadedPaginationIntoPage(data) {
        $(`#pagination`).html(data);
    }

    increasePagination() {
        return ++this.pagination;
    }

    removePreviousPaginationRow(pagination) {
        $(`.pl-box.origin-page-${pagination-1}`).hide();
    }

    hideDisplayMoreButtonIfNoMoreProductsExist(remaining) {
        if (typeof(remaining) === "undefined") {
            $('#ajax-display-more').hide();
        }

        if(remaining == 0) {
            $('#ajax-display-more').hide(500);
        }
    }

    updateUrl(pagination) {
        let currentCategorySlug = $("#ajax-load").data('category-slug');
        let currentFilter = $("#ajax-load").data('current-filter');
        window.history.pushState({},"", `/c/${currentCategorySlug}/page/${pagination}?f=${currentFilter}`);
    }

    updatePagination(pagination) {
        const me = this;
        const url = '/category/page-update';
        $.ajax({
            url,
            data: {
                'slug': $("#ajax-load").data('category-slug'),
                'f': $("#ajax-load").data('current-filter'),
                'page': pagination
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPaginationIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
        });
    }
}
class ConsentHandler {
    enableAnalyticsScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        })
    }

    disableAnalyticsScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        })
    }

    enableMarketingScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'update', {
            'ad_personalization': 'granted',
            'ad_user_data': 'granted',
            'analytics_storage': 'granted'
        })
    }

    disableMarketingScripts() {
        if (typeof gtag === 'undefined') {
            return;
        }
        gtag('consent', 'default', {
            'ad_personalization': 'denied',
            'ad_user_data': 'denied'
        })
    }

}


class Layout {
    // static UTM_COOKIE = 'filokalistaUtm';
    // static REFERER_COOKIE = 'filokalistaReferer';
    constructor() {
        $(() => {
            this.bindEvents();

            if (page.controller === 'index' && page.action === 'index')
                this.initSlider();
        });

        //new Newsletter();
    }

    async bindEvents() {
        const me = this;

        $(window).scroll(function() {
          me.sticker();
        });

        me.menuSticker();

        $("#currency-menu .dropdown-item").click(function () {
            me.setCookie("currencyMark", $(this).data("currencyMark"), 30);
            me.setCookie("currencyName", $(this).data("currencyName"), 30);
            location.reload();
        });

        CartHeader.quantityChangeListener();

        $(".quantity-change").click(function (e) {
            var quantity = $(e.currentTarget).siblings('.quantity').val();

            if ( $(e.currentTarget).hasClass('down') && quantity != 1 )
                $(e.currentTarget).siblings('.quantity').val(quantity - 1);

            if ( $(e.currentTarget).hasClass('up') ) {
                $(e.currentTarget).siblings('.quantity').val(quantity - (-1));
            }
            $(e.currentTarget).siblings('.quantity').trigger('change');
        });

        this.toggleLeftSide();
        this.processUtmParams(window.location.href);
        this.processReferer();

        $('.back-to-top').click((e) => {
            e.preventDefault();
            this.backToTop();
        });

        $('.mobile-search').click((e) => {
            this.toggleSearch();
        });

        // $('.mobile-menu').click((e) => {
        //     this.toggleMenu();
        // });

        $('.filter .heading').click((e) => {
            this.toggleFilter();
        });



        $('#menuToggle').click((e) => {
            $('#header').toggleClass('white-menu');
            $('.mobile-menu').toggleClass('open');
        });

        $('#menu1 a').click(function() {
            $('#menuToggle input').prop('checked', false);

            $('#header').removeClass('white-menu');
            $('.mobile-menu').removeClass('open');
        });

        $('#toggle-menu').click((e) => {
            this.toggleMenu();

            if ($(window).width() < 992) {

            }
        });

        $('#toggleMenu').click((e) => {
            // this.toggleMenu();
            console.log(sss)
        });

        // $('#menu1 li').click((e) => {
        //     this.toggleMenu();
        // });

        if (location.hash === '#prihlaseni') {
            await layout.openLoginDialog();
        }

        // mobile menu section
        var mobileBreakpoint = 992;

        function isMobile() {
            return $(window).width() < mobileBreakpoint;
        }

        $('.category-wrapper .item img').on('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                e.stopPropagation();

                var categoryWrapper = $(this).closest('.category-wrapper');
                var itemLink = $(this).closest('.item');
                var categoryId = itemLink.data('category-id');

                $('.category-wrapper .item').not(itemLink).removeClass('open');

                itemLink.toggleClass('open');

                $('.subcategory-preview').not('[data-category-id="' + categoryId + '"]').removeClass('active');

                var targetSubcategory = $('.subcategory-preview[data-category-id="' + categoryId + '"]');
                targetSubcategory.toggleClass('active');
            }
        });

        $('.subcategory-item .subcategory-name a img').on('click', function(e) {
            if (isMobile()) {
                e.preventDefault();
                e.stopPropagation();

                var subcategoryItem = $(this).closest('.subcategory-item');
                var subcategoryId = subcategoryItem.data('subcategory-id');

                $('.subcategory-item').not(subcategoryItem).removeClass('open');
                subcategoryItem.toggleClass('open');
            }
        });

        $(window).resize(function() {
            if (!isMobile()) {
                $('.category-wrapper .item').removeClass('open');
                $('.subcategory-preview').removeClass('active');
                $('.subcategory-item').removeClass('open');
            }
        });
        // end mobile menu section


        $('.category-menu .headline').click((e) => {
            this.toggleHeaderCategoryMenu();
        });

        $('.product-catalogue .link-holder').click((e) => {
            this.toggleProductCatalogue();
        });

        $('.header-main-menu-container .menu-item').each(function(e) {
            /*
                let $this = $(this);
                if ( $this.data('sub-loaded') == 0 ) {
                    $this.data('sub-loaded', 1);

                    this.running = $.ajax(projectVars.basePath + '/default/index/get-main-menu-sub-category', {
                        data: {
                            Category_ID: $this.data('category-id')
                        },
                        method: 'GET',
                        success: (data) => {
                            $this.append(data);
                            if ($(window).outerWidth() <= 768) {
                                me.mobileMenuInit();
                                me.mobileMenuSubMenuInit();
                            }
                            $(window).resize(function(){
                                if ($(window).outerWidth() <= 768) {
                                    me.mobileMenuInit();
                                    me.mobileMenuSubMenuInit();
                                }
                            });
                        }
                    });
                }

             */
        });

        // if ($(window).outerWidth() < 768) {
        //     me.mobileMenuInit();
        // }
        //
        // $(window).resize(function(){
        //     if ($(window).outerWidth() < 768) {
        //         me.mobileMenuSubMenuInit();
        //     }
        // });


        if ($('#announcement[data-announcement]').length) {
            $('#announcement .close').unbind().bind('click', (e) => {
                this.setAnnouncementRead($(e.currentTarget).parents('#announcement').data('announcement'));
                $(e.currentTarget).parents('#announcement').stop().fadeOut(300, function () {
                    //$(this).remove();
                });
            });
        }

        $(() => {
            /*
            let el = document.querySelector(".instagram-posts");
            let x = 0, y = 0, top = 0, left = 0;

            let draggingFunction = (e) => {
                document.addEventListener('mouseup', () => {
                    document.removeEventListener("mousemove", draggingFunction);
                });

                el.scrollLeft = left - e.pageX + x;
                el.scrollTop = top - e.pageY + y;
            };

            el.addEventListener('mousedown', (e) => {
                e.preventDefault();

                y = e.pageY;
                x = e.pageX;
                top = el.scrollTop;
                left = el.scrollLeft;

                document.addEventListener('mousemove', draggingFunction);
            });*/
        });
    }

    backToTop() {
        $('html, body').animate({scrollTop: 0}, 350);
    }

    toggleSearch() {
        $('.search-block').toggle('slow');
    }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle();
    //     $('.header-main-container').toggleClass('open');
    // }

    // toggleMenu() {
    //     console.log('toggle menu .. tady by se na mobilu melo otevřít menu');
    //     $('#header .menu-container').toggle('medium');
    //     // $('.mobile-menu').toggleClass('active');
    //     $('#toggle-menu.mobile-menu').toggleClass('active');
    // }

    // toggleMenu() {
    //     $('.header-main-menu-container').toggle('medium');
    //     $('.mobile-menu').toggleClass('active');
    //     $('#toggleMenu').toggleClass('active');
    // }

    toggleHeaderCategoryMenu() {
        $('#header .category-menu').toggleClass('active');
        this.toggleLeftSide();
    }

    toggleLeftSide() {
        if ($(window).width() > 991) {
            $('#content .left-side').css('padding-top', ($('#header .category-menu').height() - 20) + 'px');
        }
    }

    toggleFilter() {
        $('.filter .block').toggle('medium');
    }

    toggleProductCatalogue() {
        $('.product-catalogue .categories').toggle();
    }

    cookiePopup() {
        var cookie_popup = Cookie.getCookie('cookie-popup');
        if ( cookie_popup === undefined || !cookie_popup ) {
            $('#cookieBar').css('display','flex');
        }
        $('#cookieBar button').click(function () {
            Cookie.setCookie('cookie-popup', true, 900);
            $('#cookieBar').hide();
        });
    }

    doScroll(targetNode) {
        var target = $(targetNode);
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }

    initSlider() {
        $("#slider").responsiveSlides({
            auto: true,
            pager: false,
            nav: false,
            speed: 800,
            namespace: "centered-btns",
            manualControls: '.slider-pager',
        });
    }

    setAnnouncementRead(Hash) {
        let announcements = Cookie.getCookie('announcement');

        if (announcements.length)
            announcements = JSON.parse(announcements);
        else
            announcements = [];

        announcements.push(Hash);

        Cookie.setCookie('announcement', JSON.stringify(announcements), '10');
    }

    processUtmParams(href) {
        let isVisitorFromExternalCampaign;
        let isCookieExists;
        if (!Layout.checkCookieName(Layout.UTM_COOKIE)) {
            isCookieExists = false;
            isVisitorFromExternalCampaign = !!href.match(/(?:utm_source|utm_medium|utm_name|utm_content)/i);
        } else {
            isCookieExists = true;
            isVisitorFromExternalCampaign = true;
        }

        if(!isCookieExists && isVisitorFromExternalCampaign) {
            const utmParams = this.prepareUtmParams(href);
            this.setCookie(Layout.UTM_COOKIE, utmParams, 1);
        }
    }

    processReferer() {
        let isCookieExists = Layout.checkCookieName(Layout.REFERER_COOKIE);
        const referer = document.referrer;
        if(!isCookieExists && referer) {
            const refererValue = this.prepareRefererValue(referer);
            if(refererValue !== 'vamot')
            this.setCookie(Layout.REFERER_COOKIE, refererValue, 1);
        }
    }

    static checkCookieName(name)
    {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return match[2];
        }
        else{
            return false
        }
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static deleteCookie(cname) {
            document.cookie = cname +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    sticker() {
        const header = $('#header');
        const headerHeight = header.height();
        const content = $('#content');
        const winScroll = $(window).scrollTop();
        header.toggleClass('fixed', 0 - winScroll <= 0 );
        //content.css('padding-top', headerHeight + 20);
        /*
        if(0 - winScroll <= 0) {
            content.css('padding-top', headerHeight + 20);
        } else {
            content.css('padding-top', 0);
        }*/
    }

    prepareUtmParams(href) {
        let params = href.split('?');
        let paramValues = params[1].split('&');
        let finalParamsString = [];
        for(const paramValue of paramValues) {
            let data = paramValue.split('=');
            if(data[0].match(/(utm_source|utm_medium|utm_name|utm_content)/i))
                finalParamsString.push(`${data[0]}=${data[1]}`);
        }
        return finalParamsString.join('&');
    }
    prepareRefererValue(referer) {
        let dataWithoutSubdomain = referer.replace('www.', '').replace('search.', '');
        let dataWithoutProtocol = dataWithoutSubdomain.split('://')[1];
        return dataWithoutProtocol.split('.')[0]
    }

    mobileMenuInit() {
        $('.menu-item[data-category-id] > a').click(function(e) {
            e.preventDefault();
            $(this).parent('[data-category-id]').children('.sub-menu').addClass('show');
        })
    }
    mobileMenuSubMenuInit() {
        $('.menu-item[data-category-id] .sub-menu .back-item').each(function(e) {
            $(this).click(function(e) {
                e.preventDefault();
                $(this).closest('.sub-menu').removeClass('show');
            })
        })
    }

    async openLoginDialog() {
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog._modalClass = 'login';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/login');

        new LoginForm();
    }

    menuSticker(threshold = 200 ) {
        const me = this;
        $('.category-wrapper').hover(function() {
            if(window.scrollY >= threshold) {
                const subcategoryPreview = $(this).find('.subcategory-preview');
                const rightOffset = me.rightSpaceCalculationForFixedMenu('.container');
                subcategoryPreview.addClass('fixed');
                if (rightOffset > 0) {
                    subcategoryPreview.css('right', rightOffset);
                } else {
                    const leftOffset = me.leftSpaceCalculationForFixedMenu('.container');
                    subcategoryPreview.css('left', leftOffset);
                }
            } else {
                $(this).find('.subcategory-preview').removeClass('fixed');
                $(this).find('.subcategory-preview').css({
                    'right': '',
                    'left': ''
                });
            }
        })
    }

    async openRegistrationInfoDialog(title, content)  {
        console.log('openRegistrationInfoDialog', title, content);
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog.modalClass = 'registration-info';
        this.dialog._title = title;
        await this.dialog.openFromUrl(projectVars.basePath + '/customer/registration-info', {content} );
    }

    rightSpaceCalculationForFixedMenu(selector) {
        const content = document.querySelector(selector);
        if (content) {
            const rect = content.getBoundingClientRect();
            const spaceRight = window.innerWidth - rect.right;
            if (spaceRight < 100) {
                return 0;
            }
            return spaceRight+'px';
        }
    }

    leftSpaceCalculationForFixedMenu(selector) {
        const content = document.querySelector(selector);
        if (content) {
            const rect = content.getBoundingClientRect();
            const spaceLeft =  rect.left;
            const categoryMenuWidth = $('.category-menu.active').width();
            return (spaceLeft+categoryMenuWidth)+'px';
        }
    }
}
class ManufacturerLayout {
    pagination = 1;
    remainingProducts;

    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        this.pagination = $('#ajax-load').data('current-page');
        this.remainingProducts = $(`.showing.pagination-${this.pagination}`).data('remaining-to-display');
        this.ajaxClickEvent();
        this.hideDisplayMoreButtonIfNoMoreProductsExist(this.remainingProducts);

        $('#back-to-product-top').click((e)=> {
            new Layout().backToTop();
        })

        $('.sorting a').click((e) => {
            e.preventDefault();
            let $this = $(e.target);
            let sorting = $this.data('sorting');
            Cookie.setCookie('sorting', sorting, 10);
            location.reload();
        });

        $( "#show-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $( "#short-description" ).hide();
                $('#show-more-description').hide();
            });
        });

        $( "#collapse-more-description" ).click(function() {
            $( "#long-description" ).toggle( 250, function() {
                $( "#short-description" ).show(250);
                $('#show-more-description').show();
            });
        });
    }

    ajaxClickEvent() {
        const me = this;
        $("#ajax-display-more").click(function (event) {
            event.preventDefault();
            $(".loader-circle").show();
            me.loadProducts(me.increasePagination())
            new Layout().doScroll(`#ajax-product-row-${me.pagination}`);
        })
    }

    loadProducts(pagination) {
        const me = this;

        this.createDivContainerForLoadingOfProducts(pagination);
        let url;
        url = this.buildProperUrlForProductLoading(pagination);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedProductsIntoPage(pagination, data);
                me.hideDisplayMoreButtonIfNoMoreProductsExist($(`.showing.pagination-${pagination}`).data('remaining-to-display'));
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function (xhr, status) {
                me.removePreviousPaginationRow(pagination)
                me.updateUrl(pagination);
                me.updatePagination(pagination);
            }
        });
    }
    createDivContainerForLoadingOfProducts(pagination) {
        if(pagination === 1) {
            $("#ajax-load").empty()
            $("#ajax-load").append(`<div id="ajax-product-row-${pagination}"></div>`);
        } else {
            $("#ajax-load").append(`<div id="ajax-product-row-${pagination}"></div>`);
        }
    }

    buildProperUrlForProductLoading(pagination) {
        let manufacturer = $("#ajax-load").data('manufacturer-slug');
        return `/znacky/${manufacturer}/load-page/${pagination}`
    }

    insertLoadedProductsIntoPage(pagination, data) {
        $(`#ajax-product-row-${pagination}`).hide();
        $(`#ajax-product-row-${pagination}`).html(data);
        $(`#ajax-product-row-${pagination}`).show(500);
    }

    insertLoadedPaginationIntoPage(data) {
        $(`#pagination`).html(data);
    }

    increasePagination() {
        return ++this.pagination
    }

    removePreviousPaginationRow(pagination) {
        $(`.pl-box.origin-page-${pagination-1}`).hide()
    }

    hideDisplayMoreButtonIfNoMoreProductsExist(remaining) {
        if (typeof(remaining) === "undefined") {
            $('#ajax-display-more').hide();
        }

        if(remaining == 0) {
            $('#ajax-display-more').hide(500);
        }

    }

    updateUrl(pagination) {
        let currentManufacturerSlug = $("#ajax-load").data('manufacturer-slug');
        window.history.pushState({},"", `/znacky/${currentManufacturerSlug}/page/${pagination}/`);
    }

    updatePagination(pagination) {
        const me = this;
        const url = '/manufacturer/page-update'
        $.ajax({
            url,
            data: {
                'slug': $("#ajax-load").data('manufacturer-slug'),
                'page': pagination
            },
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPaginationIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
        });
    }
}
class MyAccount {

    defaultPage;

    constructor(defaultPage) {
        this.defaultPage = defaultPage;
        $(() => {
            this.bindEvents();
            this.init();
        });
    }

    bindEvents() {
       this.clickEvent();
    }

    init() {
        const paramsString= location.search;
        const searchParams = new URLSearchParams(paramsString);
        let indexParam = searchParams.get('page');
        if (indexParam) {
            this.clearActiveNavigation();
            this.loadPage(indexParam);
            $(`a[data-href$=${indexParam}]`).parent().addClass('active');
        } else {
            this.loadPage(this.defaultPage);
        }
    }

    clickEvent() {
        const me = this;
        $(".navigation-container li").click(function (event) {
            event.preventDefault();
            const pageSlug= $(this).children('a').attr('data-href');
            me.loadPage(pageSlug);
            me.clearActiveNavigation();
            $(this).addClass('active');
            me.updatePageUrl(pageSlug);
        });
    }

    loadPage(pageSlug) {
        const me = this;
        let url;
        url = this.buildProperUrlForPageLoading(pageSlug);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.updatePageBlock(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function (xhr, status) {
                new OrderDetailLayout();
                new AddressEditLayout();
                new PersonalDataEditLayout();
            }
        });
    }

    buildProperUrlForPageLoading(pageSlug) {
        return `/customer/${pageSlug}`;
    }

    updatePageBlock(data) {
        $('#page-block').html(data);
    }

    clearActiveNavigation() {
        $(".navigation-container li").removeClass('active');
    }

    updatePageUrl(pageSlug){
        window.history.pushState({},"", `?page=${pageSlug}`);
    }
}
class Newsletter {
    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        $(".newsletter-subscribe").click((e) => {
            this.newsletterSubscribe();
        });
    }

    newsletterSubscribe() {
        $.ajax({
            type: "POST",
            url: "/default/customer/newsletter-subscribe",
            data: {
                NewsletterSubscriber: $('.newsletter-email').val()
            },
            success: function (data) {
                let newsletterMessage = $('.newsletter-container .message');

                newsletterMessage.show();
                newsletterMessage.html(data);
            },
        });
    }
}
class OrderDetailLayout {

    isOpen = false;
    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
         this.clickEvent();
    }

    clickEvent() {
        const me = this;
        $(".open-order-detail").click(function (event) {
            if(me.isOpen) {
                $( "#order-detail-block" ).remove();
                me.isOpen = false;
                if($(this).hasClass('open')) {
                    $(this).removeClass('open');
                    $(this).parent('td').parent('tr').removeClass('open-order-detail');
                    return;
                }
            }
            $(".order-detail").removeClass('open');
            $(".order-history tr").removeClass('open-order-detail');

            const orderId= $(this).attr('data-id');
            // $(".loader-circle").show();
            $('<tr id="order-detail-block"><td colspan="6"><div id="order-detail-load"></div></td></tr>').insertAfter(  $(this).parent('td').parent('tr') );
            me.loadPage(orderId);
            $(this).addClass('open');
            $(this).parent('td').parent('tr').addClass('open-order-detail');
            me.isOpen = true;
        });
    }

    loadPage(orderId) {
        const me = this;
        let url;
        url = this.buildProperUrlForPageLoading(orderId);
        $.ajax({
            url,
            data: {},
            type: "GET",
            dataType: "html",
            success: function (data) {
                me.insertLoadedPageIntoPage(data);
            },
            error: function (xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function () {
                new OrderCustomerForm();
            }
        });
    }

    buildProperUrlForPageLoading(orderId) {
        return `/customer/order-detail/id/${orderId}`
    }

    insertLoadedPageIntoPage(data) {
        $('#order-detail-load').hide();
        $('#order-detail-load').html(data);
        $('#order-detail-load').show(500);
    }
}
class PersonalDataEditLayout {

    constructor() {
        $(() => {
            this.personalDataForm = new Form('main-form-change-personal-data');
            this.bindEvents();
        });
    }

    bindEvents() {
        const me = this;
        $('#confirm-personal-data-change').click(() => {
            $('<div class="progress-loader-wrap"><div class="progress-loader"></div></div>').insertBefore('#confirm-address');
            me.personalDataForm.validate();

            if (me.personalDataForm.valid) {
                $.ajax({
                    url: "/default/customer/edit-password-process/",
                    type: 'POST',
                    dataType: "html",
                    data: {
                        // FirstName: $('#FirstName').val(),
                        // LastName: $('#LastName').val(),
                        // Email: $('#Email').val(),
                        // Phone: $('#Phone').val(),
                        CurrentPassword: $('#CurrentPassword').val()??'',
                        Password: $('#Password').val()??'',
                        PasswordAgain: $('#PasswordAgain').val()??'',
                    },
                    success: function (data) {
                        new MyAccount('my-account-personal-data');
                        setTimeout(()=>{$('#message').html(data)},500)

                    },
                })

            }
        });
    }


}
class ProductLayout {

    constructor() {
        $(() => {
            this.bindEvents();
        });

        new Tabs('product-tabs');
    }

    bindEvents() {
        const me = this;
        $(".fancybox").fancybox({
            'speedIn': 0
        });
        this.inputControls(me);
        this.switchProductDetailBlock();

        window.onresize = (event) => {
            this.switchProductDetailBlock();
        }

        $('#button-price').click((e) => {
            e.preventDefault();
        })

        if($('.attribute-item').length) {
            me.disableAddToCartButton();
        }

        $('.attribute-item').click(function () {
            if(me.isAddToCartButtonDisabled()) {
                me.enableAddToCartButton()
            }
            me.handleProductAttributes(this);
        })


        $('.copy-current-product-link').click(async function() {
            const url = $(this).data('url');
            try {
                await navigator.clipboard.writeText(url);
            } catch (e) {
                console.log(e);
            }
        })

        if( $('.price-per-piece-block').length > 0 ) {
            const me = this;
            $('.quantity').on('change', this.debounce(function() {
                me.checkUnitPrice($('#product').data('id'), $(this).val());
            }, 1000));
        }

        new Watchdog();
    }

    switchProductDetailBlock() {
        if ($(window).width() < 992) {
            $(".desktop-visible .sticky").appendTo(".mobile-visible");
        } else {
            $(".mobile-visible .sticky").appendTo(".desktop-visible");
        }
    }

    isAddToCartButtonDisabled() {
        return $('.add-to-cart').hasClass('disabled');
    }

    enableAddToCartButton() {
        $('.add-to-cart').removeClass('disabled');
        $('.add-to-cart').removeAttr('disabled');
    }

    disableAddToCartButton() {
        $('.add-to-cart').addClass('disabled');
        // $('.add-to-cart').attr("disabled", true);
    }

    debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    handleProductAttributes(context) {
        const paramID = $(context).data('paramId');
        const productParamID = $(context).data('productParamId');
        const paramValue = $(context).data('paramValue');
        $(`#param-${paramID}`).html(paramValue);
        this.handleActiveClass(context);
        $('#selected-product-attributes').val(`${productParamID}`)
    }

    handleActiveClass(context) {
        this.clearActiveClass();
        $(context).addClass('active');
    }

    inputControls(me) {
        $('.input-group').on('click', '.button-qty', function (e) {
            me.checkWhetherIncrOrDecr(e, me);
        });
    }

    checkUnitPrice(productID, quantity) {
        $.ajax({
            url: '/default/product/check-unit-price',
            data: {
                productID: productID,
                quantity: quantity
            },
            success: function(data) {
                const response = JSON.parse(data);
                $('.price-block .with-vat').html(response.PriceWithVat +' Kč');
                $('.price-block .without-vat').html(response.PriceWithoutVat + ' Kč bez DPH');
            }
        });
    }

    checkWhetherIncrOrDecr(e, me) {
        if (e.target.value === "+") {
            me.incrementInputValue(e);
            $("#finalPrice").trigger("change");
        } else {
            me.decrementInputValue(e);
            $("#finalPrice").trigger("change");
        }
    }

    incrementInputValue(e) {
        e.preventDefault();
        const fieldName = $(e.target).data('field');
        const parent = $(e.target).closest('div');
        const currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

        if (!isNaN(currentVal)) {
            parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
        } else {
            parent.find('input[name=' + fieldName + ']').val(0);
        }
    }

    clearActiveClass() {
        $('.attribute-item').removeClass('active');
    }

    decrementInputValue(e) {
        e.preventDefault();
        const fieldName = $(e.target).data('field');
        const parent = $(e.target).closest('div');
        const currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

        if (!isNaN(currentVal) && currentVal > 0) {
            parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
        } else {
            parent.find('input[name=' + fieldName + ']').val(0);
        }
    }
}
class QuickSearch {
    /**
     * Konstruktor pro QuickSearch
     * 
     * @param {string} id 
     */
    constructor(id = 'search-result-block') {
        this._id = id;
        this._element = null;
        this._form = null;
        this._searchInput = null;
        this._searchTimeout = null;
        this._items = null;

        $(() => {
            this.init();
            this.bindEvents();
        });
    }

    /**
     * Inicializuje třídu
     * 
     * @returns {void}
     */
    init() {
        this._element = $('#' + this._id);
        this._items = this._element.find('.items');
        this._form = this._element.parent().children('form');

        return;
    }

    /**
     * Nastaví všechny eventy
     * 
     * @returns {void}
     */
    bindEvents() {
        if (this._form) {
            this._searchInput = this._form.find('[name="SearchTerm"]');
            if (this._searchInput.length) {
                this._searchInput.on('reset input paste cut', (ev) => {
                    this.inputHandler(ev.currentTarget.value)
                });

                this._form.on('reset', (ev) => {
                    this.inputHandler('')
                });
            }
        }

        return;
    }

    /**
     * Handle pro zpracování vyhledávání
     * 
     * @param {*} ev 
     * @return {boolean}
     */
    inputHandler(val) {
        if (val.length < 3) {
            this.hide();
            return false;
        }

        clearTimeout(this._searchTimeout);

        this._searchTimeout = setTimeout(() => {
            this.show();

            if (this.running) {
                this.running.abort();
            }

            this._performSearch(val);
        }, 250);

        return true;
    }

    /**
     * Zobrazí quick search
     * 
     * @returns {void}
     */
    show() {
        this._element.stop().slideDown(300, () => {
            this._element.removeAttr('style');
        });
        this._form.addClass('active');
        this._element.addClass('active');

        return;
    }

    /**
     * Skryje quick search
     * 
     * @returns {void}
     */
    hide() {
        this._element.stop().slideUp(300, () => {
            this._form.removeClass('active');
            this._element.removeClass('active');
        });

        return;
    }

    /**
     * Vyhledá produkt
     * 
     * @param {string} val 
     * @returns {void}
     */
    _performSearch(val) {
        this.renderLoading();

        this.running = $.ajax(projectVars.basePath + '/search/quick', {
            data: {
                searchTerm: val
            },
            method: 'POST',
            success: (data) => {
                this._element.html(data);
                this.show();
            },
            error: () => {
                this.hide();
            }
        });

        return;
    }

    /**
     * Vykreslí načítací obrazovku
     * 
     * @returns {void}
     */
    renderLoading() {
        let html = `<div class="loading">Načítám ...</div>`;

        this._element.html(html);
    }
}
class SearchLayout {

    constructor() {
        $(() => {
            this.bindEvents();
        });
    }

    bindEvents() {
        new Watchdog();
    }
}
class Balikovna {

    type = null;
    constructor(type = 'BALIKOVNY') {
        this.type = type;
        this.bindEvents();
    }

    bindEvents = () => {
        let selector = '#balikovnaChoosePickupPlace'
        if(this.type === 'POST_OFFICE') {
            selector = '#balikNaPostuChoosePickupPlace'
        }
        $(selector).unbind('click').click((e) => {
            e.preventDefault();
            this.createModal();
            window.addEventListener('message', this.iframeListener);
        });

    }

    iframeListener = (event) => {
        if (event.data.message === 'pickerResult') {
            $('.balikovna-overlay').remove();
            this.showSelectedPickupPoint(event.data.point);
        }
    }

    showSelectedPickupPoint(point) {
        let pickupPointElementId = 'm1-balikovna';
        if(this.type === 'POST_OFFICE') {
            pickupPointElementId = 'm1-balik-na-postu'
        }
        let divContainer = document.getElementById(pickupPointElementId);
        divContainer.style.display = "block";
        divContainer.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
        divContainer.dataset.pointChosen = !!point;
        divContainer.dataset.pointId = point ? point.id : '';
        divContainer.dataset.pointName = point ? point.name : '';
        divContainer.dataset.pointAddress = point ? `${point.street}, ${point.municipality_name}, ${point.zip}` : '';

        if(this.type === 'POST_OFFICE') {
            ShippingPayment.handleBalikNaPostu();
        } else {
            ShippingPayment.handleBalikovna();
        }
    }

    clear() {
        let pickupPointElementId = 'm1-balikovna';
        if(this.type === 'POST_OFFICE') {
            pickupPointElementId = 'm1-balik-na-postu'
        }
        const divContainer = document.getElementById(pickupPointElementId);
        divContainer.innerText = "";
        Packeta.Widget.close();
    }

    // Vytvoření modalu
    createModal = () => {
        this.clear();
        // Vytvoření overlay prvku
        const $overlay = $('<div class="balikovna-overlay">').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.7)',
            'z-index': '1000',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
        });

        // Vytvoření modálního okna
        const $modal = $('<div>').css({
            'background-color': 'white',
            'border-radius': '5px',
            'padding': '20px',
            'max-width': '90%',
            'max-height': '90%',
            'position': 'relative',
            'overflow': 'hidden'
        });

        // Vytvoření tlačítka pro zavření
        const $closeButton = $('<button>').text('X').css({
            'position': 'absolute',
            'top': '10px',
            'right': '10px',
            'border': 'none',
            'background': 'none',
            'font-size': '20px',
            'cursor': 'pointer'
        }).on('click', () => {
            $overlay.remove();
        });

        // Vytvoření iframe
        const $iframe = $('<iframe>', {
            'title': 'Výběr místa pro vyzvednutí zásilky',
            'src': `https://b2c.cpost.cz/locations/?type=${this.type}`,
            'allow': 'geolocation'
        }).css({
            'width': '90vw',
            'height': '80vh',
            'border': 'none'
        });

        // Sestavení modalu
        $modal.append($closeButton);
        $modal.append($iframe);
        $overlay.append($modal);

        // Přidání do DOM
        $('body').append($overlay);
    }

    // Funkce pro otevření mPOST_OFFICEodalu při kliknutí na tlačítko
    createModalButton = () => {
        const $button = $('<button>').text('Vybrat místo vyzvednutí').on('click', () => {
            this.createModal();
        });
        $('body').append($button);
    }
}

class Cart {
    constructor() {
        window.confirmDialog = null;

        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $(document).on('click', '.cart-block button', async function(e) {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $this.parent().parent().children().children('.quantity').val();
                try {
                    const stockCheck = await Cart.checkProductStockQuantity(productID, quantity);
                    if (stockCheck['QuantityDiff']) {
                        quantity = stockCheck['AllowedQuantity'];
                        await Cart.displayWarningInfoAboutStock(stockCheck)
                    }
                    if(quantity > 0)
                    {
                        Cart.updateCart(productID,  quantity);
                    }
                } catch (error) {
                    console.error(error);
                }

            });

            // pridani do kosiku z wish listu
            $('#wish-list .add-to-cart').click((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = 1;
                Cart.updateCart(productID, quantity);
                this.flyToCart();
            });

            // pridani do kosiku z detailu produktu
            $('.cart-info .add-to-cart').click(async (e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $('.cart-info .quantity').val();
                let cartMsg = $('#cart-msg');

                try {
                    const stockCheck = await Cart.checkProductStockQuantity(productID, quantity);
                    if (stockCheck['QuantityDiff']) {
                        quantity = stockCheck['AllowedQuantity'];
                        await Cart.displayWarningInfoAboutStock(stockCheck)
                    }
                } catch (error) {
                    console.error(error);
                }


                if ($.isNumeric(quantity)) {
                    cartMsg.hide();
                    Cart.updateCart(productID, quantity, false, null);
                } else {
                    cartMsg.show();
                    cartMsg.html('Musíte zadat číselnou hodnotu.');
                }

                this.flyToCart();
            });
        });
    }

    static updateCart(productID, quantity, assign = false, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/cart/update-cart-product",
            data: {
                ProductID: productID,
                Quantity: quantity,
                Assign: assign,
            },
            success: (data) => {
                let cartData = JSON.parse(data);
                CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);

                if ( cartData.failMsg ) {
                    alerts.alert('Chyba', 'error', cartData.failMsg);
                    if(cartData.totalQuantity) {
                        const selector = `.item[data-product-id = ${cartData.productID}] .quantity`;
                        if($(selector).length > 0) {
                            $(selector).val($(selector).val() > cartData.totalQuantity? cartData.totalQuantity : $(selector).val());
                        }
                    }
                }

                if ( !assign ) {
                    window.confirmDialog = new Dialog();
                    window.confirmDialog.modalClass = 'add-to-cart';
                    window.confirmDialog.title = 'Produkt byl přidán do košíku';
                    window.confirmDialog.openFromUrl(projectVars.basePath + '/modal/add-to-cart', {
                        'Product_ID': productID,
                        'Quantity': quantity,
                    });
                } else {
                    if ( cartData.successMsg )
                        alerts.alert('Hotovo', 'success', cartData.successMsg);
                }

                /*if ( !assign )
                    CartPrompt.addedToCart();*/

                if ( callback )
                    callback(cartData);
            },
        });
    }

    deleteProduct(productID, callback = null) {
        $.ajax({
            type: "POST",
            url: "/default/cart/delete-cart-product",
            data: {
                ProductID: productID,
            },
            success: (data) => {
                let cartData = JSON.parse(data);
                CartHeader.updateCartHeader(cartData.TotalPriceWithVat, cartData.TotalCount, cartData.cartItems);

                if ( callback )
                    callback(cartData);
            },
        });
    }

    flyToCart() {
        return;
            const cart = $('.header-cart-badge .cart-icon');
            const imgToDrag = $('.product-image .fancybox').find("img").eq(0);
            const imgWidth = imgToDrag.width();
            const imgHeight = imgToDrag.height();
            if (imgToDrag) {
                const imgClone = imgToDrag.clone()
                    .offset({
                        top: imgToDrag.offset().top,
                        left: imgToDrag.offset().left
                    })
                    .css({
                        'opacity': '0.5',
                        'position': 'absolute',
                        'height': imgHeight+'px',
                        'width': imgWidth+'px',
                        'z-index': '100'
                    })
                    .appendTo($('body'))
                    .animate({
                        'top': cart.offset().top + 10,
                        'left': cart.offset().left + 10,
                        'width': 75,
                        'height': 75
                    }, 1000, 'easeInOutExpo');

                // setTimeout(function () {
                //     cart.effect("shake", {
                //         times: 2
                //     }, 200);
                // }, 1500);

                imgClone.animate({
                    'width': 0,
                    'height': 0
                }, function () {
                    $(this).detach()
                });
            }
}

    static checkProductStockQuantity(productID, quantity) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: "/default/cart/check-product-stock-quantity",
                data: {
                    ProductID: productID,
                    Quantity: quantity,
                },
                success: (data) => {
                    let cartData = JSON.parse(data);
                    resolve(cartData);
                },
                error: (xhr, status, error) => {
                    reject(error);
                }
            });
        });
        
    }

    static async displayWarningInfoAboutStock(stockCheck) {
        if (this.dialog) { this.dialog.close(); }

        this.dialog = new Dialog();
        this.dialog._title = 'Požadované množství není skladem';
        this.dialog._modalClass = 'cart-out-stock-info';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/cart-out-stock-info', {stockCheck} );
    }
}
class CartHeader {
    static updateCartHeader(price, count, items) {
        $('#header .cart-block .price').text(price);
        $('#header .cart-block .count').text(count);
        $('#header .cart-block .items-block').html(this.formatItems(items));
        $('#header .cart-block .summary .total span').text(price);
        $('#header .cart-block').toggleClass('empty', (!items || items.length === 0));
        CartHeader.quantityChangeListener();

        $("#header .quantity-change").click(function (e) {
            var quantity = $(e.currentTarget).siblings('.quantity').val();

            if ( $(e.currentTarget).hasClass('down') && quantity != 1 )
                $(e.currentTarget).siblings('.quantity').val(quantity - 1);

            if ( $(e.currentTarget).hasClass('up') ) {
                $(e.currentTarget).siblings('.quantity').val(quantity - (-1));
            }
            $(e.currentTarget).siblings('.quantity').trigger('change');
        });
    }

    static deleteCartItem(element) {
        let productID = $(element).parents('.item').data('id');
        cart.deleteProduct(productID);
    }

    static formatItems(items) {
        let out = "";

        items.forEach((item) => {
            out += this.formatItem(item);
        });

        return out;
    }

    static quantityChangeListener() {
        $('#header .quantity').change((e) => {
            let $this = $(e.target);
            let productID = $this.data('product-id');
            let quantity = $this.val();

            Cart.updateCart(productID, quantity, true);
        });

    }

    static formatItem(item) {
        let out = `
              <div class="item" data-id="${item.Product_ID}">
                    <div class="photo-block">
                        <img src="${item.ProductImageUrl}">
                    </div>
                    <div class="info-block">
                        <a href="${projectVars.basePath}/${projectVars.url.product}/${item.slug}">${item.ProductName}</a>
                        <div class="code">Kód zboží: <span>${item.ProductCode}</span></div>
                        <div class="${item.TotalQuantityOnStock > 0 ? 'on-stock' : 'out-stock'} availability">
                        ${item.TotalQuantityOnStock > 0 ? 'Skladem' : 'Není skladem'}
                        </div>
                    </div>
                    <div class="quantity-block">
                        <span class="quantity-change down">-</span>
                        <input type="number" value="${item.Quantity}" data-product-id="${item.Product_ID}" class="quantity" maxlength="4" min="1" max="999" step="1">
                        <span class="quantity-change up">+</span>
                    </div>

                    <div class="price-block">${item.TotalPriceWithVat}</div>
                    <div class="remove-block">
                        <a href="javascript:;" onclick="CartHeader.deleteCartItem(this)">
                            <span class="remove">X</span>
                        </a>
                    </div>
                </div> `;

        return out;
    }
}
class CartPage {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $('.quantity').change((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $this.val();
                let montage = $('.montage [data-product-id="' + productID + '"]').val();

                Cart.updateCart(productID, quantity, true, function(data) {
                    CartPage.updateCartPage(data);
                }, montage);
            });

            $('.remove-item').click((e) => {
                let productID = $(e.target).data('product-id');

                cart.deleteProduct(productID, function (data) {
                    let cartRow = '.item[data-product-id="' + productID + '"]';

                    $(cartRow).fadeOut(200, function () {
                        $(cartRow).remove();
                    });
                    CartPage.updateCartPage(data);
                });
            });

            $('#clearCartContent').click(async (e) => {
                await this.openCartClearConfirmationDialog('Smazání produktů z košíku', 'Opravdu chcete smazat obsah košíku?');
            });

            $('.montage').change((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $('.count[data-product-id="' + productID + '"]').val();
                let montage = $(e.target).is(':checked');

                cart.updateCart(productID, quantity, true, null, montage);
            });

            this.initSimpleDropbox();
        });
    }

    static updateCartPage(data) {
        if (data.TotalCount == 0) {
            window.location.href = '/cart/empty/';
            return;
        }

        $('.summary-container .total-with-vat').html(data.TotalPriceWithVat);
        $('.summary-container .total-without-vat').html(data.TotalPriceWithoutVat);
        $('.summary-container .total-vat').html(data.TotalVat);
        $('.cart-summary .left-to-free-shipping').html(data.LeftToFreeShipping);
        $('#item-coupon').html(data.CouponItemHtml);


        $.each(data.cartItems, (k, v) => {
            var cartRow = '.item[data-product-id="' + v.Product_ID + '"]';

            $(cartRow + ' .count').val(v.Quantity);
            $(cartRow + ' .price').html(v.PriceWithVat);
            $(cartRow + ' .total-price').html(v.TotalPriceWithVat);
        });
    }

    async openCartClearConfirmationDialog(title, content)  {
        if (this.dialog) { this.dialog.close(); }


        this.dialog = new Dialog();
        this.dialog._title = title;
        this.dialog._modalClass = 'cart-clear-confirmation';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/cart-clear-confirmation', {title, content} );

    }

    initSimpleDropbox() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');
        const importButton = document.getElementById('importButton');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileRemove = document.getElementById('fileRemove');
        const errorMessage = document.getElementById('errorMessage');
        let selectedFile = null;

        dropzone.addEventListener('click', function() {
            fileInput.click();
        });

        importButton.style.display = 'none';

        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                validateAndPreviewFile(file);
            }
        });

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropzone.classList.add('dragover');
        }

        function unhighlight() {
            dropzone.classList.remove('dragover');
            dropzone.classList.remove('error');
        }

        // Zpracování přetaženého souboru
        dropzone.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            if (dt.files && dt.files.length > 0) {
                const file = dt.files[0];
                validateAndPreviewFile(file);
            }
        });

        // Import souboru po kliknutí na tlačítko importu
        importButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (selectedFile) {
                // Zde provádíme samotný "import" souboru
                handleFileImport(selectedFile);
            } else {
                // Pokud není vybrán soubor, otevřeme dialog pro výběr
                fileInput.click();
            }
        });

        // Odstraní vybraný soubor
        fileRemove.addEventListener('click', function() {
            clearFile();
        });

        function validateAndPreviewFile(file) {
            // Kontrola, zda je soubor CSV
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'csv') {
                // Resetování chybových stavů
                hideError();

                // Uložení souboru a zobrazení náhledu
                selectedFile = file;
                previewFile(file);

                // Aktivace tlačítka importu
                importButton.style.display = 'block';
                importButton.classList.remove('disabled');
                importButton.parentElement.classList.remove('disabled');
            } else {
                // Zobrazení chyby
                showError();

                // Vyčištění výběru
                clearFile();
            }
        }

        // Zobrazení náhledu souboru
        function previewFile(file) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileInfo.classList.add('has-file');
        }

        // Zpracování importu souboru
        function handleFileImport(file) {
            const formData = new FormData();
            formData.append('File', file);
            formData.append('Delimiter', $('#csvDelimiter').val());

            fetch('/cart/import-products-from-csv', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alerts.alert('Import dokončen', 'info',  data.message);
                            window.location.reload();
                    } else {
                        alerts.alert('Chyba', 'error',  data.error_message);
                    }
                })
                .catch(error => {
                    console.error('Chyba při importu:', error);
                    alerts.alert('Chyba', 'error', error);
                });


            // Po importu můžeme vyčistit formulář
            clearFile();
        }

        // Zobrazení chybové zprávy
        function showError() {
            alerts.alert('Upozornění', 'error', 'Prosím, vyberte platný CSV soubor.');
            errorMessage.classList.add('show');
            dropzone.classList.add('error');
            setTimeout(() => {
                errorMessage.classList.remove('show');
                dropzone.classList.remove('error');
            }, 3000);
        }

        // Skrytí chybové zprávy
        function hideError() {
            errorMessage.classList.remove('show');
            dropzone.classList.remove('error');
        }

        // Odstranění vybraného souboru
        function clearFile() {
            selectedFile = null;
            fileInput.value = '';
            fileInfo.classList.remove('has-file');
            hideError();
        }

        // Formátování velikosti souboru
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

}
class CartPrompt {
    static addedToCart() {
        let addToCartDialog = {
            state0: {
                title: 'Produkt byl přidán do košíku',
                html: 'Děkujeme Vám, za Váš zájem o naše služby.<br>Nyní můžete pokračovat v nákupu, nebo přejít k objednávce.',
                buttons: {"Pokračujte v nakupování": 1, "Nákupní košík": 2},
                submit: (e, v, m, f) => {
                    e.preventDefault();
                    if (v == 1)
                        $.prompt.close();
                    else
                        document.location.href = '/cart/';
                }
            }
        };
        $.prompt(addToCartDialog);
    }
}
class CartRecapitulation {
    shippingPriceWithoutVat = 0;
    shippingPriceWithVat = 0;
    paymentPriceWithoutVat = 0;
    paymentPriceWithVat = 0;

    updateTotalPrice () {
        let totalPriceWithoutVat = this.shippingPriceWithoutVat - (-this.paymentPriceWithoutVat) - (-$('.order-recapitulation .total-price-with-vat').data('total-produts-price-without-vat'));
        let totalPriceWithVat = this.shippingPriceWithVat - (-this.paymentPriceWithVat) - (-$('.order-recapitulation .total-price-with-vat').data('total-produts-price-with-vat'));

        $('.total .total-price-without-vat').html(numberHelpers.formatPrice(totalPriceWithoutVat));
        $('.total .total-vat').html(numberHelpers.formatPrice(totalPriceWithVat - totalPriceWithoutVat));
        $('.total .total-price-with-vat').html(numberHelpers.formatPrice(totalPriceWithVat));
    }
}
class PPL {
    constructor() {
        this.modalBox = null;
        this.closeButton = null;
        this.init();
        this.bindEvents();
    }

    init() {
        // Vytvoření základních elementů
        $('<div id="ppl-parcel-shop-modal"><div class="ppl-modal-header"></div>').insertBefore('#footer');
        $('<div id="ppl-parcelshop-map" data-countries="cz"></div>').appendTo('#ppl-parcel-shop-modal');
        $('<a id="close-modal-button">&times;</a>').prependTo('.ppl-modal-header');

        this.modalBox = document.querySelector("#ppl-parcel-shop-modal");
        this.closeButton = document.querySelector("#close-modal-button");

        // Načtení externích zdrojů
        this.loadExternalResources();
    }

    loadExternalResources() {
        // Načtení JavaScript souboru
        const script = document.createElement('script');
        script.src = 'https://www.ppl.cz/sources/map/main.js';
        script.onload = () => {
            this.setupEventListeners();
        };
        document.getElementsByTagName('head')[0].append(script);

        // Načtení CSS souboru
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://www.ppl.cz/sources/map/main.css";
        document.getElementsByTagName('head')[0].append(link);
    }

    bindEvents() {
        // Kliknutí na tlačítko pro výběr pobočky
        $('#choose-parcel-shop').unbind('click').click(() => {
            this.openModal();
        });

        // Kliknutí na tlačítko pro zavření modalu
        this.closeButton.addEventListener("click", () => {
            this.closeModal();
        });
    }

    setupEventListeners() {
        // Poslouchání událostí z mapy PPL
        document.addEventListener("ppl-parcelshop-map", (event) => {
            this.closeModal();
            this.processSelectedPoint(event.detail);
        });
    }

    openModal() {
        this.modalBox.style.opacity = 1;
        this.modalBox.style.zIndex = 99999;
    }

    closeModal() {
        this.modalBox.style.opacity = 0;
        this.modalBox.style.zIndex = -9999999;
    }

    processSelectedPoint(details) {
        const pickupID = details.id;
        const pickupName = details.name;
        const pickupCode = details.code;
        const addressCity = details.city;
        const addressStreet = details.street;
        const addressZipCode = details.zipCode;
        const parcelShopDetail = $('.ppl-selected-pickup-point');

        parcelShopDetail.css('display', 'block');
        parcelShopDetail.attr('data-point-chosen', true);
        parcelShopDetail.attr('data-point-id', pickupID);
        parcelShopDetail.attr('data-point-name', pickupName);
        parcelShopDetail.attr('data-point-code', pickupCode);
        parcelShopDetail.attr('data-point-address', `${addressStreet}, ${addressCity} ${addressZipCode}`);
        parcelShopDetail.html(`Vybrané místo: ${pickupName}, ${addressStreet}, ${addressCity} ${addressZipCode}`);

        // Zavolání metody pro zpracování na straně košíku
        ShippingPayment.handlePPL();
    }

    clear() {
        const parcelShopDetail = $('.ppl-selected-pickup-point');
        parcelShopDetail.css('display', 'none');
        parcelShopDetail.attr('data-point-chosen', false);
        parcelShopDetail.html('');
    }
}

class ShippingPayment {
    static zasilkovnaCZShippingID = 13;
    static zasilkovnaSKShippingID = 12;
    static balikovnaShippingID = 1;
    static balikNaPostuShippingID = 3;
    static pplShippingID = 8;
    static applePayID = 5;

    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            new Zasilkovna('2237ad43f1459473');
            new Balikovna('BALIKOVNY');
            new Balikovna('POST_OFFICE');
            new PPL();
            if(window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
               $(`div[data-payment-id=${ ShippingPayment.applePayID }]`).show();
            } else {
                $(`div[data-payment-id=${ ShippingPayment.applePayID }]`).remove();
            }

            // $('.continue-shopping').click(() => {
            //     $('#main-form').submit();
            // });

            $('.shippings .item').click((e) => {
                let $this = $(e.target).closest('.shippings .item');

                if ($this.hasClass('active'))
                    return;

                $('.shippings .item').removeClass('active');
                $this.addClass('active');
                $('#recap-shipping-name').html($this.data('shipping-name'));

                let shippingPriceWithVat = $this.data('shipping-price-with-vat') > 0 ? numberHelpers.formatPrice($this.data('shipping-price-with-vat')) : 'Zdarma';
                $('#recap-shipping-price').html(shippingPriceWithVat);
                $('#Shipping_ID').val($this.data('shipping-id'));

                const shippingImage = $this.find('.image img').attr('src');
                if (shippingImage) {
                    $('#recap-shipping-image').attr('src', shippingImage);
                }

                cartRecapitulation.shippingPriceWithoutVat = $this.data('shipping-price-without-vat');
                cartRecapitulation.shippingPriceWithVat = $this.data('shipping-price-with-vat');
                cartRecapitulation.updateTotalPrice();


                this.loadPayments($this.data('shipping-id'));
                ShippingPayment.handlePickUpCarriers();
            });

            $('.payments .item').click((e) => {
                let $this = $(e.target).closest('.payments .item');

                if ($this.hasClass('inactive'))
                    return;

                $('.payments .item').removeClass('active');
                $this.addClass('active');
                $('#recap-payment-name').html($this.data('payment-name'));

                let paymentPriceWithVat = $this.data('payment-price-with-vat') > 0 ? numberHelpers.formatPrice($this.data('payment-price-with-vat')) : 'Zdarma';
                $('#recap-payment-price').html(paymentPriceWithVat);
                $('#Payment_ID').val($this.data('payment-id'));

                const paymentImage = $this.find('.image img').attr('src');
                if (paymentImage) {
                    $('#recap-payment-image').attr('src', paymentImage);
                }

                cartRecapitulation.paymentPriceWithVat = $this.data('payment-price-with-vat');
                cartRecapitulation.paymentPriceWithoutVat = $this.data('payment-price-without-vat');
                cartRecapitulation.updateTotalPrice();
            });

            let selectedShippingID = $('#Shipping_ID').val();
            if ( selectedShippingID ) {
                $('.shippings .item[data-shipping-id=' + selectedShippingID + ']').click();
            } else {
                $('.shippings .item:first-of-type').click();
            }
        });
    }

    loadPayments(shippingID) {
        $.ajax({
            type: "POST",
            url: "/default/order/shipping-payments",
            data: {
                ShippingID: shippingID
            },
            success: function (data) {
                $('.no-payment').hide();

                let payments = JSON.parse(data);
                let hasPayment = false;
                let paymentsItem = $('.payments .item');
                let selectedPaymentID = $('#Payment_ID').val();

                paymentsItem.removeClass('active');
                paymentsItem.addClass('inactive');

                $.each(payments, function (k, v) {
                    let payment = $('.payments .item[data-payment-id="' + v.Payment_ID + '"]');
                    payment.removeClass('inactive');

                    if ( selectedPaymentID ) {
                        if ( v.Payment_ID == selectedPaymentID )
                            payment.click();

                        hasPayment = true;
                    } else {
                        if (!hasPayment)
                            payment.click();

                        hasPayment = true;
                    }
                });

                if (!hasPayment) {
                    $('#recap-payment-name').html('');
                    $('#recap-payment-price').html('');
                    $('#Payment_ID').val('');

                    $('.no-payment').show();
                }
            },
        });
    }

    static handlePickUpCarriers() {
        if (this.isZasilkovnaCzChosen()) {
            this.processZasilkovna();
            return;
        }

        if (this.isZasilkovnaSkChosen()) {
            this.processZasilkovna();
            return;
        }

        if (this.isPPLChosen()) {
            this.processPPL();
            return;
        }

        if (this.isBalikovnaChosen()) {
            this.processBalikovna();
            return;
        }

        if (this.isBalikNaPostuChosen()) {
            this.processBalikNaPostu();
            return;
        }

        this.enableCompleteShoppingButton();

    }

    static handleZasilkovna() {
        if (this.isZasilkovnaCzChosen() || this.isZasilkovnaSkChosen()) {
            this.processZasilkovna();
        }
    }

    static handleBalikovna() {
        if (this.isBalikovnaChosen()) {
            this.processBalikovna();
        }
    }

    static handleBalikNaPostu() {
        if (this.isBalikNaPostuChosen()) {
            this.processBalikNaPostu();
        }
    }

    static handlePPL() {
        if (this.isPPLChosen()) {
            this.processPPL();
        }

    }

    static isZasilkovnaCzChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.zasilkovnaCZShippingID;
    }

    static isZasilkovnaSkChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.zasilkovnaSKShippingID;
    }

    static isBalikovnaChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.balikovnaShippingID;
    }

    static isBalikNaPostuChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.balikNaPostuShippingID;
    }

    static isPPLChosen() {
        return $('.shippings .item.active').data('shipping-id') === this.pplShippingID;
    }

    static isPickUpPointChosen(selector) {
        return $(selector).attr('data-point-chosen') === 'true';
    }

    static getDataAboutPickUpPoint(pickupPlaceSelector) {
        const ID = $(pickupPlaceSelector).attr('data-point-id');
        const Name = $(pickupPlaceSelector).attr('data-point-name');
        const Address = $(pickupPlaceSelector).attr('data-point-address');
        const Code = $(pickupPlaceSelector).attr('data-point-code');

        return {
            ID,
            Name,
            Address,
            Code
        };

    }

    static processZasilkovna() {
        if (this.isZasilkovnaCzChosen() && !this.isPickUpPointChosen('#m1-cz')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else if(this.isZasilkovnaSkChosen() && !this.isPickUpPointChosen('#m1-sk')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky;')
        } else {
            this.enableCompleteShoppingButton();
            let pickupPointData;
            if(this.isZasilkovnaCzChosen())
                pickupPointData= this.getDataAboutPickUpPoint('#m1-cz');
            else
                pickupPointData= this.getDataAboutPickUpPoint('#m1-sk');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static processBalikovna() {
        if (this.isBalikovnaChosen() && !this.isPickUpPointChosen('#m1-balikovna')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else {
            this.enableCompleteShoppingButton();
            const pickupPointData = this.getDataAboutPickUpPoint('#m1-balikovna');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static processBalikNaPostu() {
        if (this.isBalikNaPostuChosen() && !this.isPickUpPointChosen('#m1-balik-na-postu')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else {
            this.enableCompleteShoppingButton();
            const pickupPointData = this.getDataAboutPickUpPoint('#m1-balik-na-postu');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static processPPL() {
        if (this.isPPLChosen() && !this.isPickUpPointChosen('.ppl-selected-pickup-point')) {
            this.disableCompleteShoppingButton();
            this.sendAlertMessage('.order-recapitulation', 'Je nutné vybrat výdejní místo před dalším krokem objednávky.')
        } else {
            this.enableCompleteShoppingButton();
            const pickupPointData = this.getDataAboutPickUpPoint('.ppl-selected-pickup-point');
            this.clearHiddenInputs(pickupPointData);
            this.createHiddenInputs(pickupPointData);
        }
    }

    static disableCompleteShoppingButton() {
        console.log("VOLAM SE");
        $('.complete-order').attr("disabled", "disabled");
        $('.complete-order').css("background", "gray");

        // $('.continue-shopping').attr("disabled", "disabled");
        // $('.continue-shopping').css("background", "gray");
    }

    static sendAlertMessage(selector, message) {
        console.log("VOLAM ALERT MESSAGE");
        if (!$('#info-message').length)
            $(selector).append(`<div id="info-message" style="color: red;" class="p-1">${message}</div>`);
    }

    static clearAlertMessage() {
        if ($('#info-message').length) {
            $('#info-message').remove();
        }
    }

    static enableCompleteShoppingButton() {
        $('.complete-order').removeAttr("disabled");
        $('.complete-order').removeAttr("style");

        // $('.continue-shopping').removeAttr("disabled");
        // $('.continue-shopping').removeAttr("style");

        this.clearAlertMessage();
    }

    static createHiddenInputs(data) {
        const mainForm = $('#main-form');
        for (const key in data) {
            mainForm.append(`<input type="hidden" id="PickupPoint_${key}" name="PickupPoint_${key}" value="${data[key]}">`);
        }
    }

    static clearHiddenInputs(data = null) {
        if (data) {
            for (const key in data) {
                $(`#PickupPoint_${key}`).remove()
            }
        }
    }
}
class Zasilkovna {
    packetaApiKey;
    packetaOptions;
    country;

    constructor(packetaApiKey) {
        this.packetaApiKey = packetaApiKey;
        this.loadPacketaScript();
    }

    bindEvents = () => {
        this.packetaOptions = {
            valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
            view: "modal",
            defaultCurrency: "CZK"
        }

        $('#chooseCzPickupPlace').unbind('click').click(() => {
            this.country= "cz";
            this.packetaOptions.country = "cz";
            this.packetaOptions.language= "cs";
            this.modalDialog($('#m1-cz'));
        });

        $('#chooseSkPickupPlace').unbind('click').click(() => {
            this.country= "sk";
            this.packetaOptions.country = "sk";
            this.packetaOptions.language= "sk";
            this.modalDialog($('#m1-sk'));
        });
    }

    showSelectedPickupPoint(point) {
        this.style.display = "block";
        this.innerText = "Vybrané místo: " + (point ? point.name : "Žádné");
        this.dataset.pointChosen = !!point;
        this.dataset.pointId = point ? point.id : '';
        this.dataset.pointName = point ? point.name : '';
        this.dataset.pointAddress = point ? `${point.street}, ${point.city}, ${point.zip}` : '';
        ShippingPayment.handleZasilkovna();
    }

    clear() {
        const elements = document.querySelectorAll(`.zasilkovna-${this.country}-selected-pickup-point`);
        for (let i = 0; i < elements.length; i++) {
            elements[i].innerText = "";
        }
        Packeta.Widget.close();
    }

    modalDialog(div) {
        this.clear();
        Packeta.Widget.pick(this.packetaApiKey, this.showSelectedPickupPoint.bind(div[0]), this.packetaOptions);  // Použij div[0] pro získání DOM elementu z jQuery objektu
    }

    loadPacketaScript() {
        const packetaScript = document.createElement('script');
        packetaScript.src = 'https://widget.packeta.com/v6/www/js/library.js';
        packetaScript.onload = this.bindEvents;
        document.head.appendChild(packetaScript);
    }
}
var layout = new Layout();
new Dispatch();

var newsletter = new Newsletter();
var cart = new Cart();
var consentHandler = new ConsentHandler();
var numberHelpers = new NumberHelpers();
var alerts = new Alerts();
var quickSearch = new QuickSearch();
var wishlist = new Wishlist();