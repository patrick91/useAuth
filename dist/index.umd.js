!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("react"),require("@xstate/react"),require("date-fns"),require("xstate"),require("xstate/lib/actions"),require("auth0-js"),require("netlify-identity-widget")):"function"==typeof define&&define.amd?define(["exports","react","@xstate/react","date-fns","xstate","xstate/lib/actions","auth0-js","netlify-identity-widget"],e):e((t=t||self).reactUseAuth={},t.react,t.react,t.dateFns,t.xstate,t.actions,t.auth0Js,t.netlifyIdentityWidget)}(this,function(t,e,n,r,i,o,a,u){var s="default"in e?e.default:e;function c(){return(c=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,u=u&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u;var h=i.Machine({id:"useAuth",initial:"unauthenticated",context:{user:{},expiresAt:null,authResult:null,isAuthenticating:!1,error:void 0,errorType:void 0,config:{navigate:function(){return console.error("Please specify a navigation method that works with your router")},callbackDomain:"http://localhost:8000",customPropertyNamespace:"http://localhost:8000"}},states:{unauthenticated:{on:{LOGIN:"authenticating",CHECK_SESSION:"verifying",SET_CONFIG:{actions:["setConfig"]}}},authenticating:{on:{ERROR:"error",AUTHENTICATED:"authenticated",SET_CONFIG:{actions:["setConfig"]}},entry:["startAuthenticating"],exit:["stopAuthenticating"]},verifying:{invoke:{id:"checkSession",src:function(t,e){return t.config.authProvider.checkSession()},onDone:{target:"authenticated"},onError:{target:"error"}},entry:["startAuthenticating"],exit:["stopAuthenticating"]},authenticated:{on:{LOGOUT:"unauthenticated",SET_CONFIG:{actions:["setConfig"]},CHECK_SESSION:"verifying"},entry:["saveUserToContext","saveToLocalStorage"],exit:o.choose([{cond:function(t,e){return"CHECK_SESSION"!==e.type},actions:["clearUserFromContext","clearLocalStorage"]}])},error:{entry:["saveErrorToContext","clearUserFromContext","clearLocalStorage"]}}},{actions:{startAuthenticating:i.assign(function(t){return{isAuthenticating:!0}}),stopAuthenticating:i.assign(function(t){return{isAuthenticating:!1}}),saveUserToContext:i.assign(function(t,e){var n=e.data?e.data:e,i=n.authResult;return{user:n.user,authResult:i,expiresAt:r.addSeconds(new Date,i.expiresIn)}}),clearUserFromContext:i.assign(function(t){return{user:{},expiresAt:null,authResult:null}}),saveToLocalStorage:function(t,e){var n=t.expiresAt,r=t.user;"undefined"!=typeof localStorage&&(localStorage.setItem("useAuth:expires_at",n?n.toISOString():"0"),localStorage.setItem("useAuth:user",JSON.stringify(r)))},clearLocalStorage:function(){"undefined"!=typeof localStorage&&(localStorage.removeItem("useAuth:expires_at"),localStorage.removeItem("useAuth:user"))},saveErrorToContext:i.assign(function(t,e){return{errorType:e.errorType,error:e.error}}),setConfig:i.assign(function(t,e){return{config:c({},t.config,e)}})}}),l=i.interpret(h);l.start(),function(t){if("undefined"!=typeof localStorage){var e=new Date(localStorage.getItem("useAuth:expires_at")||"0"),n=new Date;if(r.isAfter(e,n)){var i=JSON.parse(localStorage.getItem("useAuth:user")||"{}");t("LOGIN"),t("AUTHENTICATED",{user:i,authResult:{expiresIn:r.differenceInSeconds(e,n)}})}}}(l.send);var f=function(){var t=n.useService(l),i=t[0],o=t[1],a=i.context.config,u=a.authProvider,s=a.navigate,c=a.callbackDomain,h=a.customPropertyNamespace,f=e.useCallback(function(t){var e=(void 0===t?{}:t).postLoginRoute,n=void 0===e?"/":e;try{if(!u||!s||!c)return console.warn("authProvider not configured yet"),Promise.resolve();var r=function(){if("undefined"!=typeof window)return o("LOGIN"),Promise.resolve(u.handleLoginCallback(o)).then(function(t){t&&s(n)})}();return Promise.resolve(r&&r.then?r.then(function(){}):void 0)}catch(t){return Promise.reject(t)}},[u,s,c]),d=function(){return!(!i.context.expiresAt||!r.isAfter(i.context.expiresAt,new Date))};return{isAuthenticating:i.context.isAuthenticating,isAuthenticated:d,isAuthorized:function(t){var e=Array.isArray(t)?t:[t],n=i.context.user[(h+"/user_metadata").replace(/\/+user_metadata/,"/user_metadata")];return!(!d()||!n)&&e.some(function(t){return n.roles.includes(t)})},user:i.context.user,userId:i.context.user?i.context.user.sub:null,authResult:i.context.authResult,login:function(){null==u||u.authorize()},signup:function(){null==u||u.signup()},logout:function(){null==u||u.logout(c),o("LOGOUT"),s("/")},handleAuthentication:f,dispatch:o}};function d(t,e){try{var n=t()}catch(t){return e(t)}return n&&n.then?n.then(void 0,e):n}var p=function(){function t(t){this.dispatch=t.dispatch,this.auth0=new a.WebAuth(c({},t))}var e=t.prototype;return e.authorize=function(){this.auth0.authorize()},e.signup=function(){this.auth0.authorize({mode:"signUp",screen_hint:"signup"})},e.logout=function(t){this.auth0.logout({returnTo:t})},e.handleLoginCallback=function(){try{var t=this;return Promise.resolve(new Promise(function(e,n){t.auth0.parseHash(function(n,r){try{n&&(t.dispatch("ERROR",{error:n,errorType:"authResult"}),e(!1));var i=d(function(){return Promise.resolve(t.handleAuthResult(r)).then(function(t){e(t)})},function(n){t.dispatch("ERROR",{error:n,errorType:"handleAuth"}),e(!1)});return Promise.resolve(i&&i.then?i.then(function(){}):void 0)}catch(t){return Promise.reject(t)}})}))}catch(t){return Promise.reject(t)}},e.checkSession=function(){try{var t=this;return Promise.resolve(new Promise(function(e,n){t.auth0.checkSession({},function(r,i){try{var o=function(){if(!r&&i&&i.accessToken&&i.idToken){var o=d(function(){return Promise.resolve(t.fetchUser(i)).then(function(t){e({user:t,authResult:i})})},function(t){n(t)});if(o&&o.then)return o.then(function(){})}else n(r||new Error("Session invalid"))}();return Promise.resolve(o&&o.then?o.then(function(){}):void 0)}catch(t){return Promise.reject(t)}})}))}catch(t){return Promise.reject(t)}},e.handleAuthResult=function(t){try{var e=this;return t&&t.accessToken&&t.idToken?Promise.resolve(e.fetchUser(t)).then(function(n){return e.dispatch("AUTHENTICATED",{authResult:t,user:n}),!0}):Promise.resolve(!1)}catch(t){return Promise.reject(t)}},e.fetchUser=function(t){try{var e=this;return Promise.resolve(new Promise(function(n,r){e.auth0.client.userInfo((null==t?void 0:t.accessToken)||"",function(t,e){t?r(t):n(e)})}))}catch(t){return Promise.reject(t)}},t}(),g={__proto__:null,Auth0:p,NetlifyIdentity:function(){function t(t){var e=this;this.netlifyIdentity=u,this.netlifyIdentity.init(t),this.dispatch=t.dispatch,this.netlifyIdentity.on("error",function(t){e.dispatch("ERROR",{error:t,errorType:"netlifyError"})}),this.netlifyIdentity.on("login",function(t){e.dispatch("AUTHENTICATED",{user:t,authResult:{expiresIn:7200}})}),this.netlifyIdentity.on("init",function(t){console.log(t),t&&(e.dispatch("LOGIN"),e.dispatch("AUTHENTICATED",{user:t,authResult:{expiresIn:7200}}))})}var e=t.prototype;return e.authorize=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("login")},e.signup=function(){this.dispatch("LOGIN"),this.netlifyIdentity.open("signup")},e.logout=function(t){this.netlifyIdentity.logout()},e.handleLoginCallback=function(t){return Promise.resolve(!0)},e.checkSession=function(){try{return Promise.resolve(this.netlifyIdentity.refresh()).then(function(){return{user:{},authResult:{}}})}catch(t){return Promise.reject(t)}},t}()};t.AuthProvider=function(t){var n=t.children,r=t.navigate,i=t.auth0_domain,o=t.auth0_params,a=void 0===o?{}:o,u=t.customPropertyNamespace,h="undefined"!=typeof window?window.location.protocol+"//"+window.location.host:"http://localhost:8000",l={domain:i,clientID:t.auth0_client_id,redirectUri:h+"/auth0_callback",audience:"https://"+(t.auth0_audience_domain||i)+"/api/v2/",responseType:"token id_token",scope:"openid profile email"},d=f().dispatch;return e.useEffect(function(){var t=new p(c({dispatch:d},l,a));d("SET_CONFIG",{authProvider:t,navigate:r,customPropertyNamespace:u,callbackDomain:h}),d("CHECK_SESSION")},[r,u,h]),s.createElement(s.Fragment,null,n)},t.Providers=g,t.useAuth=f});
//# sourceMappingURL=index.umd.js.map
