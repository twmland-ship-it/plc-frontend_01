(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[820],{15469:function(t,e,n){var o,a;(function(r,i,l){t.exports?t.exports=l():(o=l,a="function"===typeof o?o.call(e,n,e,t):o,void 0===a||(t.exports=a))})(0,0,(function(){function t(t,e){return t=t.replace(/:\//g,"://"),t=t.replace(/([^:\s])\/+/g,"$1/"),t=t.replace(/\/(\?|&|#[^!])/g,"$1"),t=t.replace(/(\?.+)\?/g,"$1&"),t}return function(){var e=arguments,n={};"object"===typeof arguments[0]&&(e=arguments[0],n=arguments[1]||{});var o=[].slice.call(e,0).join("/");return t(o,n)}}))},28597:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return w}});var o=n(20641),a=n(72644);const r=(0,o.Lk)("div",{class:"ninjadash-authentication-top"},[(0,o.Lk)("h2",{class:"ninjadash-authentication-top__title"},"登入系統")],-1),i={class:"ninjadash-authentication-content"};function l(t,e,n,l,c,u){const s=(0,o.g2)("a-input"),d=(0,o.g2)("a-form-item"),f=(0,o.g2)("sdButton"),p=(0,o.g2)("a-form"),g=(0,o.g2)("AuthWrapper"),x=(0,o.g2)("a-col"),h=(0,o.g2)("a-row");return(0,o.uX)(),(0,o.Wv)(h,{justify:"center"},{default:(0,o.k6)((()=>[(0,o.bF)(x,{xxl:6,xl:12,md:12,sm:18},{default:(0,o.k6)((()=>[(0,o.bF)(g,null,{default:(0,o.k6)((()=>[r,(0,o.Lk)("div",i,[(0,o.bF)(p,{onFinish:t.handleSubmit,model:t.formState,layout:"vertical"},{default:(0,o.k6)((()=>[(0,o.bF)(d,{name:"username",label:"帳號"},{default:(0,o.k6)((()=>[(0,o.bF)(s,{type:"text",value:t.formState.acc,"onUpdate:value":e[0]||(e[0]=e=>t.formState.acc=e)},null,8,["value"])])),_:1}),(0,o.bF)(d,{name:"password",initialValue:"123456",label:"密碼"},{default:(0,o.k6)((()=>[(0,o.bF)(s,{type:"password",value:t.formState.password,"onUpdate:value":e[1]||(e[1]=e=>t.formState.password=e),placeholder:"Password"},null,8,["value"])])),_:1}),(0,o.bF)(d,null,{default:(0,o.k6)((()=>[(0,o.bF)(f,{class:"btn-signin",htmlType:"submit",type:"primary"},{default:(0,o.k6)((()=>[(0,o.eW)((0,a.v_)(t.isLoading?"請稍等...":"登入"),1)])),_:1})])),_:1})])),_:1},8,["onFinish","model"])])])),_:1})])),_:1})])),_:1})}n(44114);var c=n(79841),u=n(40834),s=n(95853);const d=s.Ay.div`
  flex:1;
  border-radius: 6px;
  margin-top: 25px;
  box-shadow: 0 5px 20px rgba(140,144,164,.08);
  background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
  .ninjadash-authentication-top{
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-secondary"]};
    .ninjadash-authentication-top__title{
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      margin-bottom: 0;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
    }
  }
  .ninjadash-authentication-content{
    padding: 30px 40px;
    .ant-form-item-label {
      > label{
        font-size: 14px;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      }
    }
    .ant-form-item{
      margin-bottom: 25px;
    }
    .ant-input:focus,
    .ant-input-focused{
      box-shadow: 0 5px 20px rgba(251,53,134,.10);
    }
    .ant-input{
      &::placeholder{
        color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
      }
    }
    .ant-form-item-explain-error{
      font-size: 13px;
      margin-top: 2px;
    }
    .ninjadash-auth-extra-links{
      display: flex;
      justify-content: space-between;
      margin-top: -5px;
      .ant-checkbox-wrapper{
        span{
          font-size: 13px;
          color: ${({theme:t})=>t[t.mainContent]["light-text"]};
        }
        .ant-checkbox{
          &+span{
            position: relative;
            top: -2px;
          }
        }
      }
      .forgot-pass-link{
        font-size: 13px;
        color: ${({theme:t})=>t["primary-color"]};
      }
    }
    .btn-signin,
    .btn-create{
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      width: 100%;
      margin-top: 25px;
    }
    .ninjadash-form-divider{
      font-size: 13px;
      color: ${({theme:t})=>t[t.mainContent]["border-color-default"]};
      text-align: center;
      position: relative;
      margin: 0 -10px 25px -10px;
      &:before{
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        height: 1px;
        background: ${({theme:t})=>t[t.mainContent]["border-color-secondary"]};
      }
      span{
        font-weight: 500;
        padding: 0 15px;
        display: inline-block;
        position: relative;
        z-index: 2;
        background: ${({theme:t})=>t[t.mainContent]["white-background"]};
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
      }
    }
    .ninjadash-social-login{
      display: flex;
      align-items: center;
      justify-content: center;
      margin: -6px;
      @media only screen and (max-width: 767px){
        justify-content: center;
      }
      &.signin-social{
        li{
          a{
            background-color: #fff;
          }
        }
      }
      li{
        padding:6px;
        a{
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          height: 48px;
          padding: 0 15px;
          background: ${({theme:t})=>t[t.mainContent]["general-background"]};
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
          font-weight: 500;
          transition: background-color 0.3s;
          @media only screen and (max-width: 379px){
            height: 44px;
            padding: 0 12px;
          }
          span:not(.anticon){
            display: inline-block;
            margin-left: 5px;
          }
          svg,
          i{
            width: 20px;
            height: 20px;
          }
          &.google-social{
            background-color: #F0654810;
            &:hover{
              background-color: #F06548;
              svg path{
                fill: #FFFFFF;
              }
            }
            svg path{
              fill: #F06548;
            }
            div{
              height: 20px;
            }
          }
          &.facebook-social{
            background-color: #3A589B10;
            &:hover{
              background-color: #3A589B;
              svg{
                fill: #fff;
              }
            }
            svg{
              fill: #3A589B;
            }
          }
          &.twitter-social{
            background-color: #03A9F410;
            &:hover{
              background-color: #03A9F4;
              svg{
                fill: #fff;
              }
            }
            svg{
              fill: #03A9F4;
            }
          }
          &.github-social{
            background-color: #03A9F410;
            &:hover{
              background-color: #03A9F4;
              svg{
                fill: #fff;
              }
            }
            svg{
              fill: #0A0A0A;
            }
          }
        }
      }
    }
  }
  .ninjadash-authentication-bottom{
    text-align: center;
    padding: 25px;
    border-radius: 0 0 6px 6px;
    background-color: ${({theme:t})=>t[t.mainContent]["dark-background"]};
    p{
      font-size: 14px;
      font-weight: 500;
      color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
      margin-bottom: 0;
      a{
        margin-left: 6px;
        ${({theme:t})=>t["primary-color"]};
      }
    }
  }
  .auth-contents{
    display: flex;
    align-items: center;
    justify-content: center;
    form{
      width: 420px;
      h1{
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 45px;
        @media only screen and (max-width: 767px){
          margin-bottom: 28px;
        }
        input::placeholder{
          color: ${({theme:t})=>t["extra-light-color"]};
        }
      }
      .auth-form-action{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        @media only screen and (max-width: 379px){
          flex-flow: column;
          .forgot-pass-link{
            margin-top: 15px;
          }
        }
      }
    }
    #forgotPass{
      .forgot-text{
        margin-bottom: 25px;
      }
      .return-text{
        margin-top: 35px;
      }
    }


  }
  .auth0-login{
    margin: -6px;
    display: flex;
    flex-wrap: wrap;
  a{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    height: 48px;
    padding: 0 30px;
    background: ${({theme:t})=>t["bg-color-light"]};
    color: ${({theme:t})=>t["text-color"]};
    font-weight: 500;
    border: 0 none;
    border-radius: 5px;
    margin: 6px;
    flex: 1;
    @media (max-width:480px){
      flex: none;
      width: 100%;
    }
  }
}
`;var f=n(75220),p=n(90955);const g={theme:{logo:"/oco_logo.png",primaryColor:"#FF8000",labeledSubmitButton:!0},avatar:null,rememberLastLogin:!1,auth:{redirect:!1},languageDictionary:{title:"Sign in with Auth0"},popupOptions:{width:460,height:506,left:200,top:300}};var x=n(97357);const h="dev-cc7jh4vf.us.auth0.com",m="RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",b=(0,o.pM)({name:"SignIn",components:{AuthWrapper:d},setup(){const{state:t,dispatch:e}=(0,u.Pj)(),n=(0,o.EW)((()=>t.auth.loading)),a=(0,c.KR)(null),r=(0,f.rd)(),i=(0,f.lq)(),l=async()=>{try{await e("auth/login",d),r.push("/")}catch(t){x.A.error({title:"登入錯誤",content:t.message})}},s=t=>{t.value=t},d=(0,c.Kh)({acc:"",password:"",id:i.params.id}),b=new p.Auth0Lock(m,h,g);return b.on("authenticated",(t=>{b.getUserInfo(t.accessToken,(t=>{t||(l(),b.hide())}))})),{isLoading:n,checked:a,handleSubmit:l,onChange:s,formState:d,lock:b}}});var _=b,v=n(66262);const y=(0,v.A)(_,[["render",l]]);var w=y},35372:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=d;var o=a(n(83399));function a(t){return t&&t.__esModule?t:{default:t}}function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}var i="(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])",l="(".concat(i,"[.]){3}").concat(i),c=new RegExp("^".concat(l,"$")),u="(?:[0-9a-fA-F]{1,4})",s=new RegExp("^("+"(?:".concat(u,":){7}(?:").concat(u,"|:)|")+"(?:".concat(u,":){6}(?:").concat(l,"|:").concat(u,"|:)|")+"(?:".concat(u,":){5}(?::").concat(l,"|(:").concat(u,"){1,2}|:)|")+"(?:".concat(u,":){4}(?:(:").concat(u,"){0,1}:").concat(l,"|(:").concat(u,"){1,3}|:)|")+"(?:".concat(u,":){3}(?:(:").concat(u,"){0,2}:").concat(l,"|(:").concat(u,"){1,4}|:)|")+"(?:".concat(u,":){2}(?:(:").concat(u,"){0,3}:").concat(l,"|(:").concat(u,"){1,5}|:)|")+"(?:".concat(u,":){1}(?:(:").concat(u,"){0,4}:").concat(l,"|(:").concat(u,"){1,6}|:)|")+"(?::((?::".concat(u,"){0,5}:").concat(l,"|(?::").concat(u,"){1,7}|:))")+")(%[0-9a-zA-Z.]{1,})?$");function d(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};(0,o.default)(t);var n=("object"===r(e)?e.version:arguments[1])||"";return n?"4"===n.toString()?c.test(t):"6"===n.toString()&&s.test(t):d(t,{version:4})||d(t,{version:6})}t.exports=e.default,t.exports["default"]=e.default},46255:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=i;var o=a(n(83399));function a(t){return t&&t.__esModule?t:{default:t}}function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function i(t,e){var n,a;(0,o.default)(t),"object"===r(e)?(n=e.min||0,a=e.max):(n=arguments[1],a=arguments[2]);var i=encodeURI(t).split(/%..|./).length-1;return i>=n&&("undefined"===typeof a||i<=a)}t.exports=e.default,t.exports["default"]=e.default},57658:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=l;var o=r(n(83399)),a=r(n(93610));function r(t){return t&&t.__esModule?t:{default:t}}var i={require_tld:!0,allow_underscores:!1,allow_trailing_dot:!1,allow_numeric_tld:!1,allow_wildcard:!1,ignore_max_length:!1};function l(t,e){(0,o.default)(t),e=(0,a.default)(e,i),e.allow_trailing_dot&&"."===t[t.length-1]&&(t=t.substring(0,t.length-1)),!0===e.allow_wildcard&&0===t.indexOf("*.")&&(t=t.substring(2));var n=t.split("."),r=n[n.length-1];if(e.require_tld){if(n.length<2)return!1;if(!e.allow_numeric_tld&&!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(r))return!1;if(/\s/.test(r))return!1}return!(!e.allow_numeric_tld&&/^\d+$/.test(r))&&n.every((function(t){return!(t.length>63&&!e.ignore_max_length)&&(!!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(t)&&(!/[\uff01-\uff5e]/.test(t)&&(!/^-|-$/.test(t)&&!(!e.allow_underscores&&/_/.test(t)))))}))}t.exports=e.default,t.exports["default"]=e.default},69517:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=_;var o=u(n(83399)),a=u(n(81572)),r=u(n(46255)),i=u(n(57658)),l=u(n(35372)),c=u(n(93610));function u(t){return t&&t.__esModule?t:{default:t}}var s={allow_display_name:!1,allow_underscores:!1,require_display_name:!1,allow_utf8_local_part:!0,require_tld:!0,blacklisted_chars:"",ignore_max_length:!1,host_blacklist:[],host_whitelist:[]},d=/^([^\x00-\x1F\x7F-\x9F\cX]+)</i,f=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i,p=/^[a-z\d]+$/,g=/^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i,x=/^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i,h=/^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i,m=254;function b(t){var e=t.replace(/^"(.+)"$/,"$1");if(!e.trim())return!1;var n=/[\.";<>]/.test(e);if(n){if(e===t)return!1;var o=e.split('"').length===e.split('\\"').length;if(!o)return!1}return!0}function _(t,e){if((0,o.default)(t),e=(0,c.default)(e,s),e.require_display_name||e.allow_display_name){var n=t.match(d);if(n){var u=n[1];if(t=t.replace(u,"").replace(/(^<|>$)/g,""),u.endsWith(" ")&&(u=u.slice(0,-1)),!b(u))return!1}else if(e.require_display_name)return!1}if(!e.ignore_max_length&&t.length>m)return!1;var _=t.split("@"),v=_.pop(),y=v.toLowerCase();if(e.host_blacklist.length>0&&(0,a.default)(y,e.host_blacklist))return!1;if(e.host_whitelist.length>0&&!(0,a.default)(y,e.host_whitelist))return!1;var w=_.join("@");if(e.domain_specific_validation&&("gmail.com"===y||"googlemail.com"===y)){w=w.toLowerCase();var F=w.split("+")[0];if(!(0,r.default)(F.replace(/\./g,""),{min:6,max:30}))return!1;for(var k=F.split("."),A=0;A<k.length;A++)if(!p.test(k[A]))return!1}if(!1===e.ignore_max_length&&(!(0,r.default)(w,{max:64})||!(0,r.default)(v,{max:254})))return!1;if(!(0,i.default)(v,{require_tld:e.require_tld,ignore_max_length:e.ignore_max_length,allow_underscores:e.allow_underscores})){if(!e.allow_ip_domain)return!1;if(!(0,l.default)(v)){if(!v.startsWith("[")||!v.endsWith("]"))return!1;var $=v.slice(1,-1);if(0===$.length||!(0,l.default)($))return!1}}if(e.blacklisted_chars&&-1!==w.search(new RegExp("[".concat(e.blacklisted_chars,"]+"),"g")))return!1;if('"'===w[0]&&'"'===w[w.length-1])return w=w.slice(1,w.length-1),e.allow_utf8_local_part?h.test(w):g.test(w);for(var j=e.allow_utf8_local_part?x:f,S=w.split("."),C=0;C<S.length;C++)if(!j.test(S[C]))return!1;return!0}t.exports=e.default,t.exports["default"]=e.default},81572:function(t,e){"use strict";function n(t){return"[object RegExp]"===Object.prototype.toString.call(t)}function o(t,e){for(var o=0;o<e.length;o++){var a=e[o];if(t===a||n(a)&&a.test(t))return!0}return!1}Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=o,t.exports=e.default,t.exports["default"]=e.default},83399:function(t,e){"use strict";function n(t){if(void 0===t||null===t)throw new TypeError("Expected a string but received a ".concat(t));if("String"!==t.constructor.name)throw new TypeError("Expected a string but received a ".concat(t.constructor.name))}Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n,t.exports=e.default,t.exports["default"]=e.default},93610:function(t,e){"use strict";function n(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1?arguments[1]:void 0;for(var n in e)"undefined"===typeof t[n]&&(t[n]=e[n]);return t}Object.defineProperty(e,"__esModule",{value:!0}),e["default"]=n,t.exports=e.default,t.exports["default"]=e.default},97357:function(t,e,n){"use strict";n(1532);var o=n(30995),a=n(20641),r=n(91979),i=n(18748),l=n(58698),c=n(35789);const u={confirm(t){return o.A.confirm({icon:(0,a.h)(r.A),...t})},error(t){return o.A.error({icon:(0,a.h)(i.A),...t})},info(t){return o.A.info({icon:(0,a.h)(l.A),...t})},success(t){return o.A.success({icon:(0,a.h)(c.A),...t})},warning(t){return o.A.warning({icon:(0,a.h)(r.A),...t})}};e.A=u}}]);