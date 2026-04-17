"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[9884],{10161:function(e,t,a){a.d(t,{A:function(){return b}});var n=a(20641),i=a(72644);const o={class:"ninjadash-datatable-filter"},r={key:0,class:"ninjadash-datatable-filter__right"},l={class:"ninjadasj-datatable"};function s(e,t,a,s,c,d){const u=(0,n.g2)("sdButton"),h=(0,n.g2)("a-space"),p=(0,n.g2)("unicon"),m=(0,n.g2)("a-input"),g=(0,n.g2)("a-button"),f=(0,n.g2)("a-col"),b=(0,n.g2)("a-row"),v=(0,n.g2)("a-table"),y=(0,n.g2)("TableWrapper"),k=(0,n.g2)("DataTableStyleWrap");return(0,n.uX)(),(0,n.Wv)(k,null,{default:(0,n.k6)((()=>[(0,n.Lk)("div",o,[(0,n.Lk)("div",null,[(0,n.bF)(h,null,{default:(0,n.k6)((()=>[e.addOption?((0,n.uX)(),(0,n.Wv)(u,{key:0,class:"act-btn",type:"primary",onClick:e.handleAdd},{default:(0,n.k6)((()=>[(0,n.eW)(" 新增 ")])),_:1},8,["onClick"])):(0,n.Q3)("",!0),e.backOption?((0,n.uX)(),(0,n.Wv)(u,{key:1,size:"default",outlined:!0,type:"primary",onClick:e.handleBack},{default:(0,n.k6)((()=>[(0,n.eW)(" 回上層 "+(0,i.v_)(e.backTitle),1)])),_:1},8,["onClick"])):(0,n.Q3)("",!0)])),_:1})]),e.filterOption?((0,n.uX)(),(0,n.CE)("div",r,[(0,n.bF)(m,{onChange:e.handleDataSearch,size:"default",placeholder:"搜尋"},{prefix:(0,n.k6)((()=>[(0,n.bF)(p,{name:"search"})])),_:1},8,["onChange"])])):(0,n.Q3)("",!0)]),(0,n.bF)(b,{align:"end"},{default:(0,n.k6)((()=>[e.importOption?((0,n.uX)(),(0,n.Wv)(f,{key:0,style:{"margin-bottom":"1rem"}},{default:(0,n.k6)((()=>[(0,n.bF)(g,{type:"primary",ghost:"",onClick:e.handleImport},{default:(0,n.k6)((()=>[(0,n.eW)("匯入")])),_:1},8,["onClick"])])),_:1})):(0,n.Q3)("",!0),e.exportOption?((0,n.uX)(),(0,n.Wv)(f,{key:1,style:{"margin-bottom":"1rem"}},{default:(0,n.k6)((()=>[(0,n.bF)(g,{type:"primary",ghost:"",onClick:e.handleExport},{default:(0,n.k6)((()=>[(0,n.eW)("匯出Excel")])),_:1},8,["onClick"])])),_:1})):(0,n.Q3)("",!0)])),_:1}),(0,n.Lk)("div",l,[(0,n.bF)(y,{class:"table-data-view table-responsive"},{default:(0,n.k6)((()=>[e.rowSelection?((0,n.uX)(),(0,n.Wv)(v,{key:0,class:"ant-table-striped","row-selection":e.rowSelections,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},childrenColumnName:e.childrenColumnName,"row-class-name":e.getRowClassName,"data-source":e.tableData,columns:e.columns,onChange:e.changePageSize},null,8,["row-selection","pagination","childrenColumnName","row-class-name","data-source","columns","onChange"])):((0,n.uX)(),(0,n.Wv)(v,{key:1,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},class:"ant-table-striped",childrenColumnName:e.childrenColumnName,"data-source":e.tableData,"row-class-name":e.getRowClassName,columns:e.columns,onChange:e.changePageSize},null,8,["pagination","childrenColumnName","data-source","row-class-name","columns","onChange"]))])),_:1})])])),_:1})}var c=a(79841),d=a(19732),u=a(95853);const h=u.Ay.div`
    .ninjadash-datatable-filter{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 20px 0 25px 0;
        @media only screen and (max-width: 575px){
            flex-wrap: wrap;
        }
        .ninjadash-datatable-filter__left{
            display: inline-flex;
            width: 100%;
            align-items: center;
            .ant-form{
                display: inline-flex;
                width: 100%;
                align-items: center;
            }
            span.label{
                margin-right: 8px;
                color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
            }
            .ninjadash-datatable-filter__input{
                display: flex;
                align-items: center;
                padding-right: 20px;
                .ant-input{
                    height: 40px;
                }
            }
        }
        .ninjadash-datatable-filter__right{
            min-width: 280px;
            @media only screen and (max-width: 575px){
                margin-top: 15px;
            }
            .ant-input-affix-wrapper{
                padding: 7.22px 20px;
                border-radius: 6px;
                .ant-input-prefix{
                    svg{
                        width: 16px;
                        height: 16px;
                        fill: ${({theme:e})=>e[e.mainContent]["light-text"]};
                    }
                }
            }
        }
    }
`;var p=a(79570),m=(0,n.pM)({components:{DataTableStyleWrap:h,TableWrapper:p.AC},props:{filterOption:d.Ay.bool,filterOnchange:d.Ay.bool,rowSelection:d.Ay.bool,defaultSelected:d.Ay.array,tableData:d.Ay.array,columns:d.Ay.array,handleDataSearch:d.Ay.func,handleAdd:d.Ay.func,handleBack:d.Ay.func,handleImport:d.Ay.func,handleExport:d.Ay.func,rowClassFunc:{type:Function,default:()=>{}},backOption:{type:Boolean,default:!1},addOption:{type:Boolean,default:!1},exportOption:{type:Boolean,default:!1},importOption:{type:Boolean,default:!1},expandedRow:{type:Object,default:null},childrenColumnName:{type:String,default:"children"},backTitle:{type:String,default:""}},setup(e,{emit:t}){const a=(0,c.KR)([]);(0,n.wB)((()=>e.defaultSelected),(e=>{a.value=e}),{immediate:!0});const i=e=>{a.value=e,t("onSelectChange",a.value)},o=(0,n.EW)((()=>({selectedRowKeys:(0,c.R1)(a),onChange:i,hideDefaultSelections:!0}))),r=(0,c.KR)(10),l=(0,c.KR)(["10","20","50","100"]),s=e=>{r.value=e.pageSize},d=({record:t})=>e.expandedRow.innerDataProp?t[e.expandedRow.innerDataProp]:t.children,u=(t,a)=>e.rowClassFunc(t)??a%2===1?"table-striped row-style":"row-style";return{pageSize:r,pageSizeOptions:l,rowSelections:o,changePageSize:s,getInnerData:d,getRowClassName:u}}}),g=a(66262);const f=(0,g.A)(m,[["render",s],["__scopeId","data-v-1b881e36"]]);var b=f},55761:function(e,t,a){a.r(t),a.d(t,{default:function(){return ga}});var n=a(20641),i=a(72644);const o={class:"ninjadash-header-content d-flex"},r={class:"ninjadash-header-content__left"},l={class:"navbar-brand align-cener-v"},s=["src"],c=["src"],d={class:"ninjadash-header-content__center"},u={key:0,class:"customer-name-display"},h={class:"customer-name-text"},p={class:"ninjadash-header-content__right d-flex"},m={class:"ninjadash-nav-actions"},g={class:"spin"},f=(0,n.Lk)("span",{class:"admin-footer__copyright"},[(0,n.eW)("2023 © "),(0,n.Lk)("a",{href:"http://www.oco.com.tw",style:{}},"橙設科技有限公司")],-1),b={class:"admin-footer__version"};function v(e,t,v,y,k,_){const w=(0,n.g2)("cctvStream"),C=(0,n.g2)("sdModal"),A=(0,n.g2)("router-link"),x=(0,n.g2)("sdButton"),E=(0,n.g2)("Notification"),S=(0,n.g2)("AuthInfo"),W=(0,n.g2)("Header"),L=(0,n.g2)("AsideItems"),R=(0,n.g2)("perfect-scrollbar"),T=(0,n.g2)("Sider"),P=(0,n.g2)("router-view"),I=(0,n.g2)("a-spin"),X=(0,n.g2)("a-col"),F=(0,n.g2)("a-row"),M=(0,n.g2)("Footer"),Y=(0,n.g2)("Content"),D=(0,n.g2)("Realtime"),O=(0,n.g2)("Layout"),N=(0,n.g2)("Div");return(0,n.uX)(),(0,n.Wv)(N,{darkMode:e.darkMode},{default:(0,n.k6)((()=>[e.cctvModalOpen?((0,n.uX)(),(0,n.Wv)(C,{key:0,visible:e.cctvModalOpen,onCancel:e.closeCCTVModal,width:500,class:"cctv-modal",wrapClassName:"cctv-modal-wrap",rootClassName:"cctv-modal-root"},{default:(0,n.k6)((()=>[(0,n.bF)(w,{cctv:e.cctvModalList,alarm:!0,dontShowOnAlarm:e.pause,onChangeAlarmSetting:e.onPauseChanged},null,8,["cctv","dontShowOnAlarm","onChangeAlarmSetting"])])),_:1},8,["visible","onCancel"])):(0,n.Q3)("",!0),(0,n.bF)(O,{class:"layout"},{default:(0,n.k6)((()=>[(0,n.bF)(W,{style:(0,i.Tr)({position:"fixed",width:"100%",top:0,zIndex:2e3,background:"rgba(255, 255, 255, 0.98)",[e.rtl?"right":"left"]:0})},{default:(0,n.k6)((()=>[(0,n.Lk)("div",o,[(0,n.Lk)("div",r,[(0,n.Lk)("div",l,[(0,n.bF)(A,{class:(0,i.C4)(e.topMenu&&e.innerWidth>991?"ninjadash-logo top-menu":"ninjadash-logo"),to:"/"},{default:(0,n.k6)((()=>[(0,n.Lk)("img",{src:(e.darkMode,a(59542)),alt:"logo"},null,8,s)])),_:1},8,["class"]),!e.topMenu||e.innerWidth<=991?((0,n.uX)(),(0,n.Wv)(x,{key:0,onClick:e.toggleCollapsed,type:"white"},{default:(0,n.k6)((()=>[(0,n.Lk)("img",{src:a(68812),alt:"menu"},null,8,c)])),_:1},8,["onClick"])):(0,n.Q3)("",!0)])]),(0,n.Lk)("div",d,[e.customerName?((0,n.uX)(),(0,n.CE)("div",u,[(0,n.Lk)("span",h,(0,i.v_)(e.customerName),1)])):(0,n.Q3)("",!0)]),(0,n.Lk)("div",p,[(0,n.Lk)("div",m,[(0,n.bF)(E,{alarms:e.importantAlarm},null,8,["alarms"]),(0,n.bF)(S)])])])])),_:1},8,["style"]),(0,n.bF)(O,null,{default:(0,n.k6)((()=>[!e.topMenu||e.innerWidth<=991?((0,n.uX)(),(0,n.Wv)(T,{key:0,width:280,style:(0,i.Tr)({margin:"65px 0 0 0",padding:""+(e.rtl?"20px 0px 55px 20px":"20px 20px 55px 0px"),overflowY:"auto",height:"100vh",position:"fixed",[e.rtl?"right":"left"]:0,zIndex:998}),collapsed:e.collapsed,theme:e.darkMode?"dark":"light"},{default:(0,n.k6)((()=>[(0,n.bF)(R,{options:{wheelSpeed:1,swipeEasing:!0,suppressScrollX:!0}},{default:(0,n.k6)((()=>[(0,n.bF)(L,{toggleCollapsed:e.toggleCollapsedMobile,topMenu:e.topMenu,rtl:e.rtl,darkMode:e.darkMode,events:e.onEventChange},null,8,["toggleCollapsed","topMenu","rtl","darkMode","events"])])),_:1})])),_:1},8,["style","collapsed","theme"])):(0,n.Q3)("",!0),(0,n.bF)(O,{class:"ninjadash-main-layout"},{default:(0,n.k6)((()=>[(0,n.bF)(Y,null,{default:(0,n.k6)((()=>[((0,n.uX)(),(0,n.Wv)(n.tY,null,{default:(0,n.k6)((()=>[(0,n.bF)(P,{style:(0,i.Tr)({minHeight:"calc(100vh - 65px - 42px)"})},null,8,["style"])])),fallback:(0,n.k6)((()=>[(0,n.Lk)("div",g,[(0,n.bF)(I)])])),_:1})),(0,n.bF)(M,{class:"admin-footer",style:(0,i.Tr)({padding:"10px 30px 10px",color:"rgba(0, 0, 0, 0.65)",fontSize:"14px",background:"rgba(255, 255, 255, .90)",width:"100%",boxShadow:"0 -5px 10px rgba(146,153,184, 0.05)"})},{default:(0,n.k6)((()=>[(0,n.bF)(F,null,{default:(0,n.k6)((()=>[(0,n.bF)(X,{span:12},{default:(0,n.k6)((()=>[f])),_:1}),(0,n.bF)(X,{span:12,style:{"text-align":"right"}},{default:(0,n.k6)((()=>[(0,n.Lk)("span",b,"版本 v"+(0,i.v_)(e.appVersion)+" | 更新時間："+(0,i.v_)(e.buildDate),1)])),_:1})])),_:1})])),_:1},8,["style"])])),_:1}),(0,n.bF)(D,{pause:e.pause,collapsed:e.alarmCollapsed,alarmSummary:e.alarmSummary,onOnPauseChanged:e.onPauseChanged,onChangePanel:e.changePanel},null,8,["pause","collapsed","alarmSummary","onOnPauseChanged","onChangePanel"])])),_:1})])),_:1})])),_:1})])),_:1},8,["darkMode"])}a(21101);var y=a(37896),k=(a(44114),a(18111),a(22489),a(20116),a(61701),a(13579),a(15115)),_=a(9322);const w=e=>((0,n.Qi)("data-v-75bd6cfe"),e=e(),(0,n.jt)(),e),C={class:""},A=w((()=>(0,n.Lk)("span",{class:"title-text"},"重要警報",-1))),x={key:0,style:{"text-align":"center"}},E={class:"ninjadash-top-dropdown__nav notification-list"},S={to:"#"},W={class:"ninjadash-top-dropdown__content notifications"},L={class:"notification-content d-flex"},R={class:"notification-text"},T=w((()=>(0,n.Lk)("br",null,null,-1))),P={class:"icon-container"},I={class:"small-circle"};function X(e,t,a,o,r,l){const s=(0,n.g2)("a-badge"),c=(0,n.g2)("sdHeading"),d=(0,n.g2)("perfect-scrollbar"),u=(0,n.g2)("router-link"),h=(0,n.g2)("NinjadashTopDropdown"),p=(0,n.g2)("font-awesome-icon"),m=(0,n.g2)("sdPopover");return(0,n.uX)(),(0,n.CE)("div",C,[(0,n.bF)(m,{placement:"bottomLeft",action:"click"},{content:(0,n.k6)((()=>[(0,n.bF)(h,{class:"ninjadash-top-dropdown"},{default:(0,n.k6)((()=>[(0,n.bF)(c,{as:"h5",class:"ninjadash-top-dropdown__title"},{default:(0,n.k6)((()=>[A,(0,n.bF)(s,{class:"badge-alert",count:e.alarms.length},null,8,["count"])])),_:1}),0===e.alarms.length?((0,n.uX)(),(0,n.CE)("div",x," 暫無重要警報 ")):(0,n.Q3)("",!0),e.alarms.length>=1?((0,n.uX)(),(0,n.Wv)(d,{key:1,options:{wheelSpeed:1,swipeEasing:!0,suppressScrollX:!0}},{default:(0,n.k6)((()=>[(0,n.Lk)("ul",E,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.importantAlarmSummary,(t=>((0,n.uX)(),(0,n.CE)("li",{key:t.Id},[(0,n.Lk)("a",S,[(0,n.Lk)("div",W,[(0,n.Lk)("div",L,[(0,n.Lk)("div",R,[(0,n.bF)(c,{as:"h5"},{default:(0,n.k6)((()=>[(0,n.eW)(" 測點: "+(0,i.v_)(t.ComponentName),1),T,(0,n.eW)(" 警報說明: "+(0,i.v_)(t.AlarmDescription),1)])),_:2},1024),(0,n.Lk)("p",null,(0,i.v_)(e.formatTime(t.AlarmTime)),1)])])])])])))),128))])])),_:1})):(0,n.Q3)("",!0),(0,n.bF)(u,{class:"btn-seeAll",to:{name:"alarm-history"}},{default:(0,n.k6)((()=>[(0,n.eW)(" 查看所有警報 ")])),_:1})])),_:1})])),default:(0,n.k6)((()=>[(0,n.bo)((0,n.Lk)("div",P,[(0,n.Lk)("div",I,[(0,n.bF)(p,{icon:e.faExclamationCircle,style:{"font-size":"32px",width:"32px",height:"32px",color:"red"}},null,8,["icon"])])],512),[[_.aG,e.isAlarm]])])),_:1})])}
/*!
 * perfect-scrollbar v1.5.6
 * Copyright 2024 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */
function F(e){return getComputedStyle(e)}function M(e,t){for(var a in t){var n=t[a];"number"===typeof n&&(n+="px"),e.style[a]=n}return e}function Y(e){var t=document.createElement("div");return t.className=e,t}var D="undefined"!==typeof Element&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector);function O(e,t){if(!D)throw new Error("No element matching method supported");return D.call(e,t)}function N(e){e.remove?e.remove():e.parentNode&&e.parentNode.removeChild(e)}function K(e,t){return Array.prototype.filter.call(e.children,(function(e){return O(e,t)}))}var U={main:"ps",rtl:"ps__rtl",element:{thumb:function(e){return"ps__thumb-"+e},rail:function(e){return"ps__rail-"+e},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(e){return"ps--active-"+e},scrolling:function(e){return"ps--scrolling-"+e}}},j={x:null,y:null};function $(e,t){var a=e.element.classList,n=U.state.scrolling(t);a.contains(n)?clearTimeout(j[t]):a.add(n)}function H(e,t){j[t]=setTimeout((function(){return e.isAlive&&e.element.classList.remove(U.state.scrolling(t))}),e.settings.scrollingThreshold)}function V(e,t){$(e,t),H(e,t)}var B=function(e){this.element=e,this.handlers={}},Q={isEmpty:{configurable:!0}};B.prototype.bind=function(e,t){"undefined"===typeof this.handlers[e]&&(this.handlers[e]=[]),this.handlers[e].push(t),this.element.addEventListener(e,t,!1)},B.prototype.unbind=function(e,t){var a=this;this.handlers[e]=this.handlers[e].filter((function(n){return!(!t||n===t)||(a.element.removeEventListener(e,n,!1),!1)}))},B.prototype.unbindAll=function(){for(var e in this.handlers)this.unbind(e)},Q.isEmpty.get=function(){var e=this;return Object.keys(this.handlers).every((function(t){return 0===e.handlers[t].length}))},Object.defineProperties(B.prototype,Q);var J=function(){this.eventElements=[]};function z(e){if("function"===typeof window.CustomEvent)return new CustomEvent(e);var t=document.createEvent("CustomEvent");return t.initCustomEvent(e,!1,!1,void 0),t}function G(e,t,a,n,i){var o;if(void 0===n&&(n=!0),void 0===i&&(i=!1),"top"===t)o=["contentHeight","containerHeight","scrollTop","y","up","down"];else{if("left"!==t)throw new Error("A proper axis should be provided");o=["contentWidth","containerWidth","scrollLeft","x","left","right"]}q(e,a,o,n,i)}function q(e,t,a,n,i){var o=a[0],r=a[1],l=a[2],s=a[3],c=a[4],d=a[5];void 0===n&&(n=!0),void 0===i&&(i=!1);var u=e.element;e.reach[s]=null,u[l]<1&&(e.reach[s]="start"),u[l]>e[o]-e[r]-1&&(e.reach[s]="end"),t&&(u.dispatchEvent(z("ps-scroll-"+s)),t<0?u.dispatchEvent(z("ps-scroll-"+c)):t>0&&u.dispatchEvent(z("ps-scroll-"+d)),n&&V(e,s)),e.reach[s]&&(t||i)&&u.dispatchEvent(z("ps-"+s+"-reach-"+e.reach[s]))}function Z(e){return parseInt(e,10)||0}function ee(e){return O(e,"input,[contenteditable]")||O(e,"select,[contenteditable]")||O(e,"textarea,[contenteditable]")||O(e,"button,[contenteditable]")}function te(e){var t=F(e);return Z(t.width)+Z(t.paddingLeft)+Z(t.paddingRight)+Z(t.borderLeftWidth)+Z(t.borderRightWidth)}J.prototype.eventElement=function(e){var t=this.eventElements.filter((function(t){return t.element===e}))[0];return t||(t=new B(e),this.eventElements.push(t)),t},J.prototype.bind=function(e,t,a){this.eventElement(e).bind(t,a)},J.prototype.unbind=function(e,t,a){var n=this.eventElement(e);n.unbind(t,a),n.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(n),1)},J.prototype.unbindAll=function(){this.eventElements.forEach((function(e){return e.unbindAll()})),this.eventElements=[]},J.prototype.once=function(e,t,a){var n=this.eventElement(e),i=function(e){n.unbind(t,i),a(e)};n.bind(t,i)};var ae={isWebKit:"undefined"!==typeof document&&"WebkitAppearance"in document.documentElement.style,supportsTouch:"undefined"!==typeof window&&("ontouchstart"in window||"maxTouchPoints"in window.navigator&&window.navigator.maxTouchPoints>0||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:"undefined"!==typeof navigator&&navigator.msMaxTouchPoints,isChrome:"undefined"!==typeof navigator&&/Chrome/i.test(navigator&&navigator.userAgent)};function ne(e){var t=e.element,a=Math.floor(t.scrollTop),n=t.getBoundingClientRect();e.containerWidth=Math.floor(n.width),e.containerHeight=Math.floor(n.height),e.contentWidth=t.scrollWidth,e.contentHeight=t.scrollHeight,t.contains(e.scrollbarXRail)||(K(t,U.element.rail("x")).forEach((function(e){return N(e)})),t.appendChild(e.scrollbarXRail)),t.contains(e.scrollbarYRail)||(K(t,U.element.rail("y")).forEach((function(e){return N(e)})),t.appendChild(e.scrollbarYRail)),!e.settings.suppressScrollX&&e.containerWidth+e.settings.scrollXMarginOffset<e.contentWidth?(e.scrollbarXActive=!0,e.railXWidth=e.containerWidth-e.railXMarginWidth,e.railXRatio=e.containerWidth/e.railXWidth,e.scrollbarXWidth=ie(e,Z(e.railXWidth*e.containerWidth/e.contentWidth)),e.scrollbarXLeft=Z((e.negativeScrollAdjustment+t.scrollLeft)*(e.railXWidth-e.scrollbarXWidth)/(e.contentWidth-e.containerWidth))):e.scrollbarXActive=!1,!e.settings.suppressScrollY&&e.containerHeight+e.settings.scrollYMarginOffset<e.contentHeight?(e.scrollbarYActive=!0,e.railYHeight=e.containerHeight-e.railYMarginHeight,e.railYRatio=e.containerHeight/e.railYHeight,e.scrollbarYHeight=ie(e,Z(e.railYHeight*e.containerHeight/e.contentHeight)),e.scrollbarYTop=Z(a*(e.railYHeight-e.scrollbarYHeight)/(e.contentHeight-e.containerHeight))):e.scrollbarYActive=!1,e.scrollbarXLeft>=e.railXWidth-e.scrollbarXWidth&&(e.scrollbarXLeft=e.railXWidth-e.scrollbarXWidth),e.scrollbarYTop>=e.railYHeight-e.scrollbarYHeight&&(e.scrollbarYTop=e.railYHeight-e.scrollbarYHeight),oe(t,e),e.scrollbarXActive?t.classList.add(U.state.active("x")):(t.classList.remove(U.state.active("x")),e.scrollbarXWidth=0,e.scrollbarXLeft=0,t.scrollLeft=!0===e.isRtl?e.contentWidth:0),e.scrollbarYActive?t.classList.add(U.state.active("y")):(t.classList.remove(U.state.active("y")),e.scrollbarYHeight=0,e.scrollbarYTop=0,t.scrollTop=0)}function ie(e,t){return e.settings.minScrollbarLength&&(t=Math.max(t,e.settings.minScrollbarLength)),e.settings.maxScrollbarLength&&(t=Math.min(t,e.settings.maxScrollbarLength)),t}function oe(e,t){var a={width:t.railXWidth},n=Math.floor(e.scrollTop);t.isRtl?a.left=t.negativeScrollAdjustment+e.scrollLeft+t.containerWidth-t.contentWidth:a.left=e.scrollLeft,t.isScrollbarXUsingBottom?a.bottom=t.scrollbarXBottom-n:a.top=t.scrollbarXTop+n,M(t.scrollbarXRail,a);var i={top:n,height:t.railYHeight};t.isScrollbarYUsingRight?t.isRtl?i.right=t.contentWidth-(t.negativeScrollAdjustment+e.scrollLeft)-t.scrollbarYRight-t.scrollbarYOuterWidth-9:i.right=t.scrollbarYRight-e.scrollLeft:t.isRtl?i.left=t.negativeScrollAdjustment+e.scrollLeft+2*t.containerWidth-t.contentWidth-t.scrollbarYLeft-t.scrollbarYOuterWidth:i.left=t.scrollbarYLeft+e.scrollLeft,M(t.scrollbarYRail,i),M(t.scrollbarX,{left:t.scrollbarXLeft,width:t.scrollbarXWidth-t.railBorderXWidth}),M(t.scrollbarY,{top:t.scrollbarYTop,height:t.scrollbarYHeight-t.railBorderYWidth})}function re(e){e.event.bind(e.scrollbarY,"mousedown",(function(e){return e.stopPropagation()})),e.event.bind(e.scrollbarYRail,"mousedown",(function(t){var a=t.pageY-window.pageYOffset-e.scrollbarYRail.getBoundingClientRect().top,n=a>e.scrollbarYTop?1:-1;e.element.scrollTop+=n*e.containerHeight,ne(e),t.stopPropagation()})),e.event.bind(e.scrollbarX,"mousedown",(function(e){return e.stopPropagation()})),e.event.bind(e.scrollbarXRail,"mousedown",(function(t){var a=t.pageX-window.pageXOffset-e.scrollbarXRail.getBoundingClientRect().left,n=a>e.scrollbarXLeft?1:-1;e.element.scrollLeft+=n*e.containerWidth,ne(e),t.stopPropagation()}))}var le=null;function se(e){ce(e,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"]),ce(e,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"])}function ce(e,t){var a=t[0],n=t[1],i=t[2],o=t[3],r=t[4],l=t[5],s=t[6],c=t[7],d=t[8],u=e.element,h=null,p=null,m=null;function g(t){t.touches&&t.touches[0]&&(t[i]=t.touches[0]["page"+c.toUpperCase()]),le===r&&(u[s]=h+m*(t[i]-p),$(e,c),ne(e),t.stopPropagation(),t.preventDefault())}function f(){H(e,c),e[d].classList.remove(U.state.clicking),document.removeEventListener("mousemove",g),document.removeEventListener("mouseup",f),document.removeEventListener("touchmove",g),document.removeEventListener("touchend",f),le=null}function b(t){null===le&&(le=r,h=u[s],t.touches&&(t[i]=t.touches[0]["page"+c.toUpperCase()]),p=t[i],m=(e[n]-e[a])/(e[o]-e[l]),t.touches?(document.addEventListener("touchmove",g,{passive:!1}),document.addEventListener("touchend",f)):(document.addEventListener("mousemove",g),document.addEventListener("mouseup",f)),e[d].classList.add(U.state.clicking)),t.stopPropagation(),t.cancelable&&t.preventDefault()}e[r].addEventListener("mousedown",b),e[r].addEventListener("touchstart",b)}function de(e){var t=e.element,a=function(){return O(t,":hover")},n=function(){return O(e.scrollbarX,":focus")||O(e.scrollbarY,":focus")};function i(a,n){var i=Math.floor(t.scrollTop);if(0===a){if(!e.scrollbarYActive)return!1;if(0===i&&n>0||i>=e.contentHeight-e.containerHeight&&n<0)return!e.settings.wheelPropagation}var o=t.scrollLeft;if(0===n){if(!e.scrollbarXActive)return!1;if(0===o&&a<0||o>=e.contentWidth-e.containerWidth&&a>0)return!e.settings.wheelPropagation}return!0}e.event.bind(e.ownerDocument,"keydown",(function(o){if(!(o.isDefaultPrevented&&o.isDefaultPrevented()||o.defaultPrevented)&&(a()||n())){var r=document.activeElement?document.activeElement:e.ownerDocument.activeElement;if(r){if("IFRAME"===r.tagName)r=r.contentDocument.activeElement;else while(r.shadowRoot)r=r.shadowRoot.activeElement;if(ee(r))return}var l=0,s=0;switch(o.which){case 37:l=o.metaKey?-e.contentWidth:o.altKey?-e.containerWidth:-30;break;case 38:s=o.metaKey?e.contentHeight:o.altKey?e.containerHeight:30;break;case 39:l=o.metaKey?e.contentWidth:o.altKey?e.containerWidth:30;break;case 40:s=o.metaKey?-e.contentHeight:o.altKey?-e.containerHeight:-30;break;case 32:s=o.shiftKey?e.containerHeight:-e.containerHeight;break;case 33:s=e.containerHeight;break;case 34:s=-e.containerHeight;break;case 36:s=e.contentHeight;break;case 35:s=-e.contentHeight;break;default:return}e.settings.suppressScrollX&&0!==l||e.settings.suppressScrollY&&0!==s||(t.scrollTop-=s,t.scrollLeft+=l,ne(e),i(l,s)&&o.preventDefault())}}))}function ue(e){var t=e.element;function a(a,n){var i,o=Math.floor(t.scrollTop),r=0===t.scrollTop,l=o+t.offsetHeight===t.scrollHeight,s=0===t.scrollLeft,c=t.scrollLeft+t.offsetWidth===t.scrollWidth;return i=Math.abs(n)>Math.abs(a)?r||l:s||c,!i||!e.settings.wheelPropagation}function n(e){var t=e.deltaX,a=-1*e.deltaY;return"undefined"!==typeof t&&"undefined"!==typeof a||(t=-1*e.wheelDeltaX/6,a=e.wheelDeltaY/6),e.deltaMode&&1===e.deltaMode&&(t*=10,a*=10),t!==t&&a!==a&&(t=0,a=e.wheelDelta),e.shiftKey?[-a,-t]:[t,a]}function i(e,a,n){if(!ae.isWebKit&&t.querySelector("select:focus"))return!0;if(!t.contains(e))return!1;var i=e;while(i&&i!==t){if(i.classList.contains(U.element.consuming))return!0;var o=F(i);if(n&&o.overflowY.match(/(scroll|auto)/)){var r=i.scrollHeight-i.clientHeight;if(r>0&&(i.scrollTop>0&&n<0||i.scrollTop<r&&n>0))return!0}if(a&&o.overflowX.match(/(scroll|auto)/)){var l=i.scrollWidth-i.clientWidth;if(l>0&&(i.scrollLeft>0&&a<0||i.scrollLeft<l&&a>0))return!0}i=i.parentNode}return!1}function o(o){var r=n(o),l=r[0],s=r[1];if(!i(o.target,l,s)){var c=!1;e.settings.useBothWheelAxes?e.scrollbarYActive&&!e.scrollbarXActive?(s?t.scrollTop-=s*e.settings.wheelSpeed:t.scrollTop+=l*e.settings.wheelSpeed,c=!0):e.scrollbarXActive&&!e.scrollbarYActive&&(l?t.scrollLeft+=l*e.settings.wheelSpeed:t.scrollLeft-=s*e.settings.wheelSpeed,c=!0):(t.scrollTop-=s*e.settings.wheelSpeed,t.scrollLeft+=l*e.settings.wheelSpeed),ne(e),c=c||a(l,s),c&&!o.ctrlKey&&(o.stopPropagation(),o.preventDefault())}}"undefined"!==typeof window.onwheel?e.event.bind(t,"wheel",o):"undefined"!==typeof window.onmousewheel&&e.event.bind(t,"mousewheel",o)}function he(e){if(ae.supportsTouch||ae.supportsIePointer){var t=e.element,a={startOffset:{},startTime:0,speed:{},easingLoop:null};ae.supportsTouch?(e.event.bind(t,"touchstart",l),e.event.bind(t,"touchmove",c),e.event.bind(t,"touchend",d)):ae.supportsIePointer&&(window.PointerEvent?(e.event.bind(t,"pointerdown",l),e.event.bind(t,"pointermove",c),e.event.bind(t,"pointerup",d)):window.MSPointerEvent&&(e.event.bind(t,"MSPointerDown",l),e.event.bind(t,"MSPointerMove",c),e.event.bind(t,"MSPointerUp",d)))}function n(a,n){var i=Math.floor(t.scrollTop),o=t.scrollLeft,r=Math.abs(a),l=Math.abs(n);if(l>r){if(n<0&&i===e.contentHeight-e.containerHeight||n>0&&0===i)return 0===window.scrollY&&n>0&&ae.isChrome}else if(r>l&&(a<0&&o===e.contentWidth-e.containerWidth||a>0&&0===o))return!0;return!0}function i(a,n){t.scrollTop-=n,t.scrollLeft-=a,ne(e)}function o(e){return e.targetTouches?e.targetTouches[0]:e}function r(t){return t.target!==e.scrollbarX&&t.target!==e.scrollbarY&&((!t.pointerType||"pen"!==t.pointerType||0!==t.buttons)&&(!(!t.targetTouches||1!==t.targetTouches.length)||!(!t.pointerType||"mouse"===t.pointerType||t.pointerType===t.MSPOINTER_TYPE_MOUSE)))}function l(e){if(r(e)){var t=o(e);a.startOffset.pageX=t.pageX,a.startOffset.pageY=t.pageY,a.startTime=(new Date).getTime(),null!==a.easingLoop&&clearInterval(a.easingLoop)}}function s(e,a,n){if(!t.contains(e))return!1;var i=e;while(i&&i!==t){if(i.classList.contains(U.element.consuming))return!0;var o=F(i);if(n&&o.overflowY.match(/(scroll|auto)/)){var r=i.scrollHeight-i.clientHeight;if(r>0&&(i.scrollTop>0&&n<0||i.scrollTop<r&&n>0))return!0}if(a&&o.overflowX.match(/(scroll|auto)/)){var l=i.scrollWidth-i.clientWidth;if(l>0&&(i.scrollLeft>0&&a<0||i.scrollLeft<l&&a>0))return!0}i=i.parentNode}return!1}function c(e){if(r(e)){var t=o(e),l={pageX:t.pageX,pageY:t.pageY},c=l.pageX-a.startOffset.pageX,d=l.pageY-a.startOffset.pageY;if(s(e.target,c,d))return;i(c,d),a.startOffset=l;var u=(new Date).getTime(),h=u-a.startTime;h>0&&(a.speed.x=c/h,a.speed.y=d/h,a.startTime=u),n(c,d)&&e.cancelable&&e.preventDefault()}}function d(){e.settings.swipeEasing&&(clearInterval(a.easingLoop),a.easingLoop=setInterval((function(){e.isInitialized?clearInterval(a.easingLoop):a.speed.x||a.speed.y?Math.abs(a.speed.x)<.01&&Math.abs(a.speed.y)<.01?clearInterval(a.easingLoop):(i(30*a.speed.x,30*a.speed.y),a.speed.x*=.8,a.speed.y*=.8):clearInterval(a.easingLoop)}),10))}}var pe=function(){return{handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1}},me={"click-rail":re,"drag-thumb":se,keyboard:de,wheel:ue,touch:he},ge=function(e,t){var a=this;if(void 0===t&&(t={}),"string"===typeof e&&(e=document.querySelector(e)),!e||!e.nodeName)throw new Error("no element is specified to initialize PerfectScrollbar");for(var n in this.element=e,e.classList.add(U.main),this.settings=pe(),t)this.settings[n]=t[n];this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null;var i=function(){return e.classList.add(U.state.focus)},o=function(){return e.classList.remove(U.state.focus)};this.isRtl="rtl"===F(e).direction,!0===this.isRtl&&e.classList.add(U.rtl),this.isNegativeScroll=function(){var t=e.scrollLeft,a=null;return e.scrollLeft=-1,a=e.scrollLeft<0,e.scrollLeft=t,a}(),this.negativeScrollAdjustment=this.isNegativeScroll?e.scrollWidth-e.clientWidth:0,this.event=new J,this.ownerDocument=e.ownerDocument||document,this.scrollbarXRail=Y(U.element.rail("x")),e.appendChild(this.scrollbarXRail),this.scrollbarX=Y(U.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",i),this.event.bind(this.scrollbarX,"blur",o),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null;var r=F(this.scrollbarXRail);this.scrollbarXBottom=parseInt(r.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=Z(r.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=Z(r.borderLeftWidth)+Z(r.borderRightWidth),M(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=Z(r.marginLeft)+Z(r.marginRight),M(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=Y(U.element.rail("y")),e.appendChild(this.scrollbarYRail),this.scrollbarY=Y(U.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",i),this.event.bind(this.scrollbarY,"blur",o),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null;var l=F(this.scrollbarYRail);this.scrollbarYRight=parseInt(l.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=Z(l.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?te(this.scrollbarY):null,this.railBorderYWidth=Z(l.borderTopWidth)+Z(l.borderBottomWidth),M(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=Z(l.marginTop)+Z(l.marginBottom),M(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:e.scrollLeft<=0?"start":e.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:e.scrollTop<=0?"start":e.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach((function(e){return me[e](a)})),this.lastScrollTop=Math.floor(e.scrollTop),this.lastScrollLeft=e.scrollLeft,this.event.bind(this.element,"scroll",(function(e){return a.onScroll(e)})),ne(this)};ge.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,M(this.scrollbarXRail,{display:"block"}),M(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=Z(F(this.scrollbarXRail).marginLeft)+Z(F(this.scrollbarXRail).marginRight),this.railYMarginHeight=Z(F(this.scrollbarYRail).marginTop)+Z(F(this.scrollbarYRail).marginBottom),M(this.scrollbarXRail,{display:"none"}),M(this.scrollbarYRail,{display:"none"}),ne(this),G(this,"top",0,!1,!0),G(this,"left",0,!1,!0),M(this.scrollbarXRail,{display:""}),M(this.scrollbarYRail,{display:""}))},ge.prototype.onScroll=function(e){this.isAlive&&(ne(this),G(this,"top",this.element.scrollTop-this.lastScrollTop),G(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)},ge.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),N(this.scrollbarX),N(this.scrollbarY),N(this.scrollbarXRail),N(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)},ge.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter((function(e){return!e.match(/^ps([-_].+|)$/)})).join(" ")};var fe=ge;const be=["scroll","ps-scroll-y","ps-scroll-x","ps-scroll-up","ps-scroll-down","ps-scroll-left","ps-scroll-right","ps-y-reach-start","ps-y-reach-end","ps-x-reach-start","ps-x-reach-end"];var ve={name:"PerfectScrollbar",props:{options:{type:Object,required:!1,default:()=>{}},tag:{type:String,required:!1,default:"div"},watchOptions:{type:Boolean,required:!1,default:!1}},emits:be,data(){return{ps:null}},watch:{watchOptions(e){!e&&this.watcher?this.watcher():this.createWatcher()}},mounted(){this.create(),this.watchOptions&&this.createWatcher()},updated(){this.$nextTick((()=>{this.update()}))},beforeUnmount(){this.destroy()},methods:{create(){this.ps&&this.$isServer||(this.ps=new fe(this.$el,this.options),be.forEach((e=>{this.ps.element.addEventListener(e,(t=>this.$emit(e,t)))})))},createWatcher(){this.watcher=this.$watch("options",(()=>{this.destroy(),this.create()}),{deep:!0})},update(){this.ps&&this.ps.update()},destroy(){this.ps&&(this.ps.destroy(),this.ps=null)}},render(){return(0,n.h)(this.tag,{class:"ps"},this.$slots.default&&this.$slots.default())}},ye=a(95853);const ke=["darkMode"],_e=(0,ye.Ay)("div",ke)`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .ninjadash-nav-action-link{
        text-decoration: none;
        color: ${({theme:e})=>e[e.mainContent].secondary};
        box-shadow: none;
        padding: 0px 8px;
        img{
            vertical-align: unset;
        }
    }
    .ninjadash-nav-actions__searchbar{
        display: flex;
        align-items: center;
        @media only screen and (max-width: 767px){
            display: none;
        }
        svg,
        img{
            width: 16px;
            height: 16px;
					}
				svg{
					fill: ${({theme:e})=>e[e.mainContent]["light-text"]};
				}
        .ninjadash-searchbar{
            opacity: 0;
            visibility: visible;
            transition: .35s;
            position: relative;
            top: 3px;
            input{
                user-select: none;
                pointer-events: none;
            }
        }
        &.show{
            .ninjadash-searchbar{
                opacity: 1;
                visibility: visible;
                input{
                    user-select: all;
                    pointer-events: all;
                }
            }
            .ninjadash-search-icon{
                display: none;
            }
            .ninjadash-close-icon{
                display: block;
            }
        }
        .ninjadash-search-icon{
            svg{
                fill: ${({theme:e})=>e["gray-color"]};
            }
        }
        .ninjadash-close-icon{
            display: none;
        }
        a{
            line-height: .8;
            position: relative;
            top: 4px;
        }
    }
    .ninjadash-searchbar{
        .ant-form-item{
            margin-bottom: 0;
            .ant-form-item-control-input{
                min-height: 30px;
                .ant-input{
                    padding: 5px;
                    border: 0 none;
                    &:focus{
                        outline: none;
                        box-shadow: 0 0;
                    }
                }
            }
        }
    }
    .ninjadash-nav-actions__item{
        .ant-badge{
            .ant-badge-dot{
                top: 4px;
                ${({theme:e})=>e.rtl?"left":"right"}: 11px !important;
            }
        }
        &.ninjadash-nav-actions__message{
            .ant-badge{
                .ant-badge-dot{
                    background: ${({theme:e})=>e[e.mainContent].success};
                }
            }
        }
        svg{
            fill: ${({theme:e})=>e[e.mainContent]["gray-text"]};
        }
    }
    .ninjadash-nav-actions__message,
    .ninjadash-nav-actions__notification,
    .ninjadash-nav-actions__settings,
    .ninjadash-nav-actions__support,
    .ninjadash-nav-actions__flag-select,
    .ninjadash-nav-actions__language,
    .ninjadash-nav-actions__searchbar,
    .ninjadash-nav-actions__nav-author{
        display: flex;
        margin: 0 5px;
        span, a{
            display: block;
            line-height: normal;
        }
    }
    .ninjadash-nav-actions__nav-author{
        a.ant-dropdown-trigger{
            img{
                max-width: 20px;
            }
        }
    }

    .flag-select{
        padding-bottom: 0;
        .flag-select__option{
            margin: 0;
            img{
                top: 0;
            }
        }
        .flag-select__btn{
            line-height: 0;
            padding-right: 0;
            cursor: pointer;
        }
        .flag-select__btn:after{
            content: none;
        }
        .flag-select__options{
            width: 120px;
            padding-top: 0;
            margin: 0;
            right: 0;
            top: 30px;
            display: block;
            .flag-select__option{
                line-height: normal;
                display: block;
                padding: 5px 10px;
                span{
                    width: auto !important;
                    height: auto !important;
                    display: block;
                }
            }
        }
    }

    .flag-select {
        ul{
            width: 170px !important;
            padding: 12px 0;
            background: #fff;
            border: 0 none;
            box-shadow: 0 5px 30px ${({theme:e})=>e["gray-solid"]}15;
            li{
                &:first-child{
                    margin-top: 12px;
                }
                &:hover{
                    background: ${({theme:e})=>e["primary-color"]}05;
                }
                span{
                    display: flex !important;
                    align-items: center;
                    padding: 2px 10px;
                    img{
                        border-radius: 50%;
                    }
                    span{
                        font-weight: 500;
                        color: ${({theme:e})=>e["gray-color"]};
                        padding: 0;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
`,we=(ye.Ay.div`
    .setting-dropdown{
        max-width: 700px;
        padding: 4px 0;
        .setting-dropdown__single{
            align-items: flex-start;
            padding: 16px 20px;
            margin-bottom: 0;
            position: relative;
            &:after{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-shadow: 0 5px 20px ${({theme:e})=>e["gray-solid"]}15;
                z-index: 1;
                content: '';
                opacity: 0;
                visibility: hidden;
            }
            &:hover{
                &:after{
                    opacity: 1;
                    visibility: visible;
                }
            }
            h1{
                font-size: 15px;
                font-weight: 500;
                margin: -4px 0 2px;
				color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
            }
            p{
                margin-bottom: 0;
                color: ${({theme:e})=>e["gray-solid"]};
            }
            img{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 16px;
                transform: ${({theme:e})=>e.rtl?"rotatey(180deg)":"rotatey(0deg)"};
            }
            figcaption{
                text-align: ${({theme:e})=>e.rtl?"right":"left"}
            }
        }
    }
`,ye.Ay.div`
    .support-dropdown{
        padding: 10px 15px;
        text-align: ${({theme:e})=>e.rtl?"right":"left"};
        ul{
            &:not(:last-child){
                margin-bottom: 16px;
            }
            h1{
                font-size: 14px;
                font-weight: 400;
                color: ${({theme:e})=>e[e.mainContent]["light-text"]};
            }
            li{
                a{
                    font-weight: 500;
                    padding: 4px 16px;
                    color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
                    &:hover{
                        background: #fff;
                        color: ${({theme:e})=>e["primary-color"]};
                    }
                }
            }
        }
    }
`,ye.Ay.div`
    .user-dropdown{
        .user-dropdown__info{
            display: flex;
            align-items: flex-start;
            padding: 20px 25px;
            border-radius: 8px;
            margin-bottom: 12px;
            background: ${({theme:e})=>e[e.mainContent]["general-background"]};
            img{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
            }
            figcaption{
                h1{
                    font-size: 14px;
                    margin-bottom: 2px;
                    color:  ${({theme:e})=>e[e.mainContent]["dark-text"]};
                }
                p{
                    margin-bottom: 0px;
                    font-size: 13px;
                    color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
                }
            }
        }
        .user-dropdown__links{
            a{
                width: calc(100% + 30px);
                left: -15px;
                right: -15px;
                display: inline-flex;
                align-items: center;
                padding: 10px 12px;
                font-size: 14px;
                transition: .3s;
                color: ${({theme:e})=>e[e.mainContent]["gray-light-text"]};
                &:hover{
                    background: ${({theme:e})=>e["primary-color"]}05;
                    color: ${({theme:e})=>e[e.mainContent]["menu-active"]};
                    ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 22px;
                    svg{
                        fill: ${({theme:e})=>e["primary-color"]};
                    }
                }
                svg{
                    width: 16px;
                    transform: ${({theme:e})=>e.rtl?"rotateY(180deg)":"rotateY(0deg)"};
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 14px;
					fill: ${({theme:e})=>e[e.mainContent]["light-text"]};
                }
            }
        }
        .user-dropdown__bottomAction{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            position: relative;
            width: calc(100% + 30px);
            left: -15px;
            right: -15px;
            height: calc(100% + 15px);
            bottom: -15px;
            border-radius: 0 0 6px 6px;
            padding: 15px 0;
            background: ${({theme:e})=>e[e.mainContent]["general-background"]};
            color: ${({theme:e})=>e[e.mainContent]["light-text"]};
            svg{
                width: 15px;
                height: 15px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
            }
        }
    }
`),Ce=ye.Ay.div`
    .ninjadash-top-dropdown__title .title-text {
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 0px;
		color: ${({theme:e})=>e[e.mainContent]["dark-color"]};
    }
    .ninjadash-top-dropdown__content {
        figcaption{
            h1{
                color: ${({theme:e})=>e[e.mainContent]["dark-color"]};
            }
            .ninjadash-top-dropdownText{
                min-width: 216px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
            }
            span{
                ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 0;
            }
        }
        .notification-icon{
            width: 39.2px;
            height: 32px;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 15px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &.bg-primary{
                background: ${({theme:e})=>e["primary-color"]}15;
                svg{
                    fill: ${({theme:e})=>e["primary-color"]};
                }
            }
            &.bg-secondary{
                background: ${({theme:e})=>e["secondary-color"]}15;
                svg{
                    fill: ${({theme:e})=>e["secondary-color"]};
                }
            }
            svg{
                width: 18px;
                height: 18px;
            }
        }
        .notification-content{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .notification-text h1 {
        font-size: 14px;
        font-weight: 400;
        color: #5A5F7D;
        margin-bottom: 4px;
    }

    .notification-text h1 span {
        color: #5F63F2;
        font-weight: 500;
        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 0;
    }

    .notification-text p {
        font-size: 12px;
        color: #ADB4D2;
        margin-bottom: 0;
        text-align: ${({theme:e})=>e.rtl?"right":"left"}
    }
`;ye.Ay.span`
    i, svg, img {
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 8px;
    }
`;var Ae=a(82630),xe=a(74353),Ee=a.n(xe),Se=(0,n.pM)({name:"Notification",components:{NinjadashTopDropdown:Ce,PerfectScrollbar:ve},props:{alarms:{type:Array,default:()=>[]}},setup(e){const t=(0,n.EW)((()=>e.alarms.length>0)),a=(0,n.EW)((()=>e.alarms)),i=e=>Ee()(e).format("YYYY-MM-DD HH:mm:ss");return{faExclamationCircle:Ae.tUE,isAlarm:t,importantAlarmSummary:a,formatTime:i}}}),We=a(66262);const Le=(0,We.A)(Se,[["render",X],["__scopeId","data-v-75bd6cfe"]]);var Re=Le;const Te={class:"custom-header"};function Pe(e,t,a,o,r,l){const s=(0,n.g2)("cctvStream"),c=(0,n.g2)("sdModal"),d=(0,n.g2)("a-button"),u=(0,n.g2)("a-checkbox"),h=(0,n.g2)("a-table"),p=(0,n.g2)("a-collapse-panel"),m=(0,n.g2)("a-collapse"),g=(0,n.g2)("RealTime"),f=(0,n.gN)("permission");return(0,n.uX)(),(0,n.Wv)(g,{class:(0,i.C4)({"realtime-expanded":e.expanded})},{default:(0,n.k6)((()=>[e.CCTVModal?((0,n.uX)(),(0,n.Wv)(c,{key:0,visible:e.CCTVModal,onCancel:e.closeCCTVModal,width:500,class:"cctv-modal",wrapClassName:"cctv-modal-wrap",rootClassName:"cctv-modal-root"},{default:(0,n.k6)((()=>[(0,n.bF)(s,{cctv:e.currCCTV,alarm:!0,dontShowOnAlarm:e.pause,onChangeAlarmSetting:e.onPauseChanged},null,8,["cctv","dontShowOnAlarm","onChangeAlarmSetting"])])),_:1},8,["visible","onCancel"])):(0,n.Q3)("",!0),(0,n.bF)(m,{activeKey:e.collapsed,type:"card",accordion:"",onChange:e.changePanel},{default:(0,n.k6)((()=>[(0,n.bF)(p,{key:"1",class:"custom-tab","show-arrow":!1},{header:(0,n.k6)((()=>[(0,n.Lk)("div",Te,[(0,n.eW)(" 警報 "),(0,n.bF)(d,{size:"small",class:"expand-btn",type:"link",onClick:(0,_.D$)(e.toggleExpand,["stop"])},{default:(0,n.k6)((()=>[(0,n.eW)((0,i.v_)(e.expanded?"縮回":"展開"),1)])),_:1},8,["onClick"])])])),default:(0,n.k6)((()=>[(0,n.bo)(((0,n.uX)(),(0,n.Wv)(d,{class:"check-button",type:"primary",ghost:"",onClick:e.checkAlarm},{default:(0,n.k6)((()=>[(0,n.eW)(" 確認全部 ")])),_:1},8,["onClick"])),[[f,{permission:"update",module:"alarm-realtime"}]]),(0,n.bF)(u,{checked:e.pause,onChange:e.onPauseChanged},{default:(0,n.k6)((()=>[(0,n.eW)("暫停更新")])),_:1},8,["checked","onChange"]),(0,n.bF)(h,{"data-source":e.tableData,columns:e.columns,pagination:!1,scroll:e.tableScroll,"row-class-name":e.getRowClassName,"row-key":"Id"},null,8,["data-source","columns","scroll","row-class-name"])])),_:1})])),_:1},8,["activeKey","onChange"])])),_:1},8,["class"])}var Ie=a(79841),Xe=a(10161);const Fe=ye.Ay.div`
   
    max-width: 100%;
    position:fixed;
    bottom:0px;
    z-index:10;
    .text-alert{
        color:${({theme:e})=>e["error-color"]};
    }

    .text-checked{
        color:${({theme:e})=>e["success-color"]};
    }

    .text-normal{
        color:${({theme:e})=>e["info-color"]};
    }

    table{
        white-space: nowrap;
        border-radius:0px;
    }

    .ant-table-tbody > tr > td {
        padding: 6px 12px;
    }

    .ant-table-container table > thead > tr:first-child th:first-child {
        border-top-left-radius: 0px;
    }
    
    .ant-table-thead > tr > th {
        background-color: ${({theme:e})=>e["primary-color"]};
        color:white;
        padding: 8px 12px;
    }
    

    .ant-collapse{
        border-color:${({theme:e})=>e["primary-color"]};
        border-top:0px;
        background:transparent;
    }

    .ant-collapse-header{
        border:0px;
        padding:0px !important;
    }
    .ant-collapse-content{
        border-bottom:0px;
        border-color:${({theme:e})=>e["primary-color"]};
    }

    .ant-collapse-content-box{
        padding:0;
        color:${({theme:e})=>e["primary-color"]};
    }

    .ant-table {
        margin-top: 0.25rem;
    }

    .custom-header{
        display:flex;
        padding:0.5rem 1rem;
        border:1px solid ${({theme:e})=>e["primary-color"]};
        border-bottom:0;
        border-left:0;
        border-radius:5px 5px 0 0;
        background:${({theme:e})=>e["primary-color"]};
        color:${({theme:e})=>e["white-color"]};
    }

    .check-button{
        margin:0.25rem 1rem 0.25rem 1rem;
        height:35px;
    }

    .ant-checkbox-wrapper {
        margin: 0.25rem 1rem 0.25rem 1rem;
    }

    
`,Me=ye.Ay.div`
    display:flex;
    button{
        margin:0 0.5rem;
        padding:0;
        height:30px;
        width:40px;
        .unicon{
            margin-top:2px;
            svg{
                color:${({theme:e})=>e["primary-color"]};
                fill:${({theme:e})=>e["primary-color"]};
            }
        }
    }
    
`;var Ye=a(97357),De=a(40834),Oe=a(27622),Ne=a(94),Ke=a(82077),Ue=a(82958);const je=(0,Ie.KR)(null),$e=(0,Ie.KR)(!1),He=(0,Ie.KR)([]);function Ve(){je.value="auto",$e.value=!0}function Be(){je.value=null,$e.value=!1,He.value=[]}function Qe(e){const t=JSON.stringify(He.value.slice().sort()),a=JSON.stringify(e.slice().sort());return t!==a&&(He.value=e,!0)}function Je(e){He.value=e,je.value="user",$e.value=!0}var ze=a(96763),Ge=(0,n.pM)({components:{DataTables:Xe.A,RealTime:Fe,cctvStream:Ne.A},props:{collapsed:{type:String,require:!0},alarmSummary:{type:Array,require:!0},pause:{type:Boolean,require:!0}},emits:["onPauseChanged","changePanel"],setup(e,{emit:t}){const a=(0,De.Pj)(),{permission:i}=(0,Ue.J)("alarm-realtime"),o=window.innerWidth,r=e=>{t("changePanel",e)},l=new Map,s=3e5,c=(0,Ie.KR)(!1),d=e=>{const t=Date.now();if(l.has(e)){const a=l.get(e);if(t-a.timestamp<s)return a.value;l.delete(e)}let n=a.state.tags&&a.state.tags.tagTableData?(()=>{const e={},t=a.state.tags.tagTableData;for(const a of t)e[a.Id]=a;return e})():null;n||(n=(0,Ke.LG)());const i=n&&n[e],o=i?i.CctvList:null,r=o&&o.length>0?o.map((e=>e.Id)):[];return l.set(e,{value:r,timestamp:t,accessed:!1}),r},u=(0,Ie.KR)([]),h=(0,n.EW)((()=>{const t=new Map;for(const e of u.value)e&&null!=e.Id&&t.set(e.Id,e);for(const a of e.alarmSummary)a&&null!=a.Id&&t.set(a.Id,a);return Array.from(t.values()).sort(((e,t)=>new Date(t.AlarmTime)-new Date(e.AlarmTime)))})),p=(0,n.EW)((()=>h.value)),m={title:"操作",dataIndex:"action",key:"action",width:190,customRender:({record:e})=>{const t=d(e.ComponentId);return(0,n.bF)(Me,null,{default:()=>[(1===e.AlarmState||3===e.AlarmState)&&i.update&&(0,n.bF)((0,n.g2)("a-button"),{type:"primary",ghost:!0,onClick:()=>L({id:e.Id})},{default:()=>[(0,n.bF)((0,n.g2)("unicon"),{name:"check"},null)]}),(0,n.bF)((0,n.g2)("a-button"),{type:"primary",ghost:!0,onClick:()=>C(e)},{default:()=>[(0,n.bF)((0,n.g2)("unicon"),{name:"file-alt"},null)]}),e.PageId&&(0,n.bF)((0,n.g2)("a-button"),{type:"primary",ghost:!0,onClick:()=>A(e)},{default:()=>[(0,n.bF)((0,n.g2)("unicon"),{name:"image"},null)]}),t.length>0&&(0,n.bF)((0,n.g2)("a-button"),{type:"primary",ghost:!0,onClick:()=>S(t)},{default:()=>[(0,n.bF)((0,n.g2)("unicon"),{name:"video"},null)]})]})}},g=[m,{title:"警戒值",dataIndex:"AlarmLimitValue",key:"AlarmLimitValue",width:100,customRender:({text:e})=>e??"-"},{title:"現值",dataIndex:"RealComponentTagValue",key:"RealComponentTagValue",width:100,customRender:({text:e})=>e??"-"},{title:"時間",dataIndex:"AlarmTime",key:"time",width:110,customRender:({text:e})=>Ee()(e).format("YYYY-MM-DD HH:mm:ss")},{title:"地區",dataIndex:"RegionName",key:"RegionName",width:120},{title:"說明",dataIndex:"AlarmDescription",key:"AlarmDescription",width:230},{title:"測點",dataIndex:"ComponentName",key:"ComponentName",width:310},{title:"警報等級",dataIndex:"PriorityText",key:"PriorityText",width:80},{title:"狀態",dataIndex:"AlarmStateText",key:"AlarmStateText",width:80}],f=(0,Ie.KR)(!1),b=(0,Ie.KR)(!1),v=async()=>{b.value=!0;try{const e=await a.dispatch("alarm/getHistoryOptions"),t=e?.searchType??[];let n=null;if(t.length>0&&(n=t[0].Id??t[0].value??t[0].Value??t[0]),null==n)throw new Error("無可用的查詢條件");const i=Ee()().subtract(24,"hour"),o=Ee()();await a.dispatch("alarm/fetchAlarmHistory",{searchType:n,tags:[],date:[i,o]});const r=a.state.alarm&&a.state.alarm.historyTableData||[];u.value=r.sort(((e,t)=>Ee()(t.AlarmTime).unix()-Ee()(e.AlarmTime).unix())).slice(0,50)}catch(e){ze.error("載入歷史失敗",e)}finally{b.value=!1}},y=async()=>{f.value=!f.value,f.value?v():u.value=[]},k=(0,n.EW)((()=>{const e=50,t=600;return f.value?{x:"max-content",y:t}:{x:"max-content",y:e}}));(0,n.wB)((()=>a.state.tags?.tagTableData),(e=>{e&&e.length>0&&!c.value&&(l.clear(),c.value=!0)}));const _=({AlarmState:e})=>2===e?"text-checked":1===e?"text-alert":"text-normal",w=e=>{const a="boolean"===typeof e?e:!!e?.target?.checked;t("onPauseChanged",a)},C=({ComponentName:e,AlarmSop:t})=>{Ye.A.info({title:`${e} SOP`,content:t})},A=e=>{Oe.A.push({name:"gui-main",params:{id:e.PageId}})},x=(0,Ie.KR)(!1),E=(0,Ie.KR)([]),S=e=>{Je(e)},W=()=>{l.clear(),Be()},L=async({id:e})=>{Ye.A.confirm({title:"確認警報?",okText:"確認",cancelText:"取消",onOk:async()=>{try{await a.dispatch("alarm/checkAlarm",e),Ye.A.success({title:"已確認"})}catch(t){Ye.A.error({title:"發生錯誤",content:t.message})}}})};return{windowWidth:o,changePanel:r,tableData:p,columns:g,getRowClassName:_,checkAlarm:L,onPauseChanged:w,CCTVModal:x,currCCTV:E,closeCCTVModal:W,openCCTVModal:S,expanded:f,isLoadingHistory:b,toggleExpand:y,tableScroll:k}}});const qe=(0,We.A)(Ge,[["render",Pe]]);var Ze=qe,et=a(75220),tt={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M868 732h-70.3c-4.8 0-9.3 2.1-12.3 5.8-7 8.5-14.5 16.7-22.4 24.5a353.84 353.84 0 01-112.7 75.9A352.8 352.8 0 01512.4 866c-47.9 0-94.3-9.4-137.9-27.8a353.84 353.84 0 01-112.7-75.9 353.28 353.28 0 01-76-112.5C167.3 606.2 158 559.9 158 512s9.4-94.2 27.8-137.8c17.8-42.1 43.4-80 76-112.5s70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8 47.9 0 94.3 9.3 137.9 27.8 42.2 17.8 80.1 43.4 112.7 75.9 7.9 7.9 15.3 16.1 22.4 24.5 3 3.7 7.6 5.8 12.3 5.8H868c6.3 0 10.2-7 6.7-12.3C798 160.5 663.8 81.6 511.3 82 271.7 82.6 79.6 277.1 82 516.4 84.4 751.9 276.2 942 512.4 942c152.1 0 285.7-78.8 362.3-197.7 3.4-5.3-.4-12.3-6.7-12.3zm88.9-226.3L815 393.7c-5.3-4.2-13-.4-13 6.3v76H488c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z"}}]},name:"logout",theme:"outlined"},at=tt,nt=a(29613);function it(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?Object(arguments[t]):{},n=Object.keys(a);"function"===typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(a).filter((function(e){return Object.getOwnPropertyDescriptor(a,e).enumerable})))),n.forEach((function(t){ot(e,t,a[t])}))}return e}function ot(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var rt=function(e,t){var a=it({},e,t.attrs);return(0,n.bF)(nt.A,it({},a,{icon:at}),null)};rt.displayName="LogoutOutlined",rt.inheritAttrs=!1;var lt=rt,st=a(92317);const ct={class:"ninjadash-nav-actions__item ninjadash-nav-actions__author"},dt={class:"user-dropdown"},ut={class:"user-dropdown__info"},ht=(0,n.Lk)("p",null,"管理員",-1),pt={to:"#",class:"ninjadash-nav-action-link"},mt={class:"ninjadash-nav-actions__author--name"};var gt={__name:"info",setup(e){const{dispatch:t}=(0,De.Pj)(),{push:a}=(0,et.rd)(),o=(0,Ie.KR)("未知用戶"),r=()=>{const e=(0,st.Gq)("userData");o.value=e?.StaffName||"未知用戶"},l=e=>{"userData"===e.key&&r()};(0,n.sV)((()=>{r(),window.addEventListener("storage",l)})),(0,n.hi)((()=>{window.removeEventListener("storage",l)}));const s=(0,n.EW)((()=>o.value)),c=e=>{e.preventDefault();const n=(0,st.Gq)("brand_id");t("auth/logOut"),a(`/auth/${n}`)};return(e,t)=>{const a=(0,n.g2)("sdHeading"),o=(0,n.g2)("unicon"),r=(0,n.g2)("sdPopover");return(0,n.uX)(),(0,n.Wv)((0,Ie.R1)(_e),null,{default:(0,n.k6)((()=>[(0,n.Lk)("div",ct,[(0,n.bF)(r,{placement:"bottomRight",action:"click"},{content:(0,n.k6)((()=>[(0,n.bF)((0,Ie.R1)(we),null,{default:(0,n.k6)((()=>[(0,n.Lk)("div",dt,[(0,n.Lk)("figure",ut,[(0,n.Lk)("figcaption",null,[(0,n.bF)(a,{as:"h5"},{default:(0,n.k6)((()=>[(0,n.eW)((0,i.v_)((0,Ie.R1)(s)),1)])),_:1}),ht])]),(0,n.Lk)("a",{onClick:c,class:"user-dropdown__bottomAction",href:"#"},[(0,n.bF)((0,Ie.R1)(lt)),(0,n.eW)(" 登出 ")])])])),_:1})])),default:(0,n.k6)((()=>[(0,n.Lk)("a",pt,[(0,n.Lk)("span",mt,(0,i.v_)((0,Ie.R1)(s)),1),(0,n.bF)(o,{name:"angle-down"})])])),_:1})])])),_:1})}}};const ft=gt;var bt=ft;const vt={key:0},yt={key:1},kt={key:0},_t={key:1},wt={key:1},Ct={key:2},At={key:3},xt={key:4},Et={key:5},St={key:6},Wt={key:7};function Lt(e,t,a,o,r,l){const s=(0,n.g2)("unicon"),c=(0,n.g2)("router-link"),d=(0,n.g2)("a-menu-item"),u=(0,n.g2)("NavTitle"),h=(0,n.g2)("MenuList"),p=(0,n.g2)("a-sub-menu"),m=(0,n.g2)("a-menu");return e.init?((0,n.uX)(),(0,n.Wv)(m,{key:0,"open-keys":e.openKeys,selectedKeys:e.selectedKeys,mode:e.mode,theme:e.darkMode?"dark":"light",class:"scroll-menu",onOpenChange:e.onOpenChange},{default:(0,n.k6)((()=>[(0,n.bF)(d,{key:"dashboard"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"create-dashboard"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:"/"},{default:(0,n.k6)((()=>[(0,n.eW)("首頁")])),_:1})])),_:1}),e.permissionList.gui?((0,n.uX)(),(0,n.CE)("div",vt,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 監控系統 ")])),_:1}),e.permissionList.guiSetting?((0,n.uX)(),(0,n.Wv)(d,{key:"gui-setting"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"setting"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"gui-setting"}},{default:(0,n.k6)((()=>[(0,n.eW)("頁面設定")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.guiMain?((0,n.uX)(),(0,n.CE)("div",yt,[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.guiList,(t=>((0,n.uX)(),(0,n.CE)("div",{key:t.Id},[2===t.Category?((0,n.uX)(),(0,n.CE)("div",kt,[((0,n.uX)(),(0,n.Wv)(p,{key:`gui-${t.Id}`},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"th-large"})])),title:(0,n.k6)((()=>[(0,n.eW)((0,i.v_)(t.Name),1)])),default:(0,n.k6)((()=>[(0,n.bF)(h,{parentKey:`gui-${t.Id}`,openKeys:e.openKeys,allList:t.Children,toggleCollapsed:e.toggleCollapsed},null,8,["parentKey","openKeys","allList","toggleCollapsed"])])),_:2},1024))])):((0,n.uX)(),(0,n.CE)("div",_t,[((0,n.uX)(),(0,n.Wv)(d,{onClick:e.toggleCollapsed,key:`gui-${t.Id}`},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"th-large"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"gui-main",params:{id:t.Id}}},{default:(0,n.k6)((()=>[(0,n.eW)((0,i.v_)(t.Name),1)])),_:2},1032,["to"])])),_:2},1032,["onClick"]))]))])))),128))])):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.database?((0,n.uX)(),(0,n.CE)("div",wt,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 數據中心 ")])),_:1}),e.permissionList.databaseRealtime?((0,n.uX)(),(0,n.Wv)(d,{key:"database-realtime"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"heart-rate"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"database-realtime"}},{default:(0,n.k6)((()=>[(0,n.eW)("即時資料")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.databaseHistory?((0,n.uX)(),(0,n.Wv)(d,{key:"database-history"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"history"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"database-history"}},{default:(0,n.k6)((()=>[(0,n.eW)("歷史報表")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.databaseRuntime?((0,n.uX)(),(0,n.Wv)(d,{key:"database-runtime"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"clock-eight"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"database-runtime"}},{default:(0,n.k6)((()=>[(0,n.eW)("運轉時數")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.databaseCustomReport?((0,n.uX)(),(0,n.Wv)(d,{key:"database-customReport"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"list-ul"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"database-customReport"}},{default:(0,n.k6)((()=>[(0,n.eW)("匯出報表")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.alarm?((0,n.uX)(),(0,n.CE)("div",Ct,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 警報系統 ")])),_:1}),e.permissionList.alarmHistory?((0,n.uX)(),(0,n.Wv)(d,{key:"alarm-history"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"history"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"alarm-history"}},{default:(0,n.k6)((()=>[(0,n.eW)("歷史警報")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.alarmReliability?((0,n.uX)(),(0,n.Wv)(d,{key:"alarm-reliability"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"analytics"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"alarm-reliability"}},{default:(0,n.k6)((()=>[(0,n.eW)("故障分析")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.alarmReliabilityAnalysis?((0,n.uX)(),(0,n.Wv)(d,{key:"alarm-reliability-analysis"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"chart-line"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"alarm-reliability-analysis"}},{default:(0,n.k6)((()=>[(0,n.eW)("可靠度分析")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.system?((0,n.uX)(),(0,n.CE)("div",At,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 系統 ")])),_:1}),e.permissionList.systemUninstall?((0,n.uX)(),(0,n.Wv)(d,{key:"system-uninstall"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"bolt-slash"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"system-uninstall"}},{default:(0,n.k6)((()=>[(0,n.eW)("電力卸載")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.systemBill?((0,n.uX)(),(0,n.Wv)(d,{key:"system-bill"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"bill"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"system-bill"}},{default:(0,n.k6)((()=>[(0,n.eW)("電費")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.systemWaterbill?((0,n.uX)(),(0,n.Wv)(d,{key:"system-waterbill"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"bill"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"system-waterbill"}},{default:(0,n.k6)((()=>[(0,n.eW)("水費")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.systemBTU?((0,n.uX)(),(0,n.Wv)(d,{key:"system-btu"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"bill"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"system-btu"}},{default:(0,n.k6)((()=>[(0,n.eW)("BTU")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.systemCCTV?((0,n.uX)(),(0,n.Wv)(d,{key:"system-cctv"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"video"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"system-cctv"}},{default:(0,n.k6)((()=>[(0,n.eW)(" CCTV ")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.notify?((0,n.uX)(),(0,n.CE)("div",xt,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 通知 ")])),_:1}),e.permissionList.notifySetting?((0,n.uX)(),(0,n.Wv)(d,{key:"notify-setting"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"setting"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"notify-setting"}},{default:(0,n.k6)((()=>[(0,n.eW)("通知設定")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.notifyGroup?((0,n.uX)(),(0,n.Wv)(d,{key:"notify-group"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"comments"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"notify-group"}},{default:(0,n.k6)((()=>[(0,n.eW)("通知群組")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.notifyMessage?((0,n.uX)(),(0,n.Wv)(d,{key:"notify-message"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"message"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"notify-message"}},{default:(0,n.k6)((()=>[(0,n.eW)("發送通知")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.tags?((0,n.uX)(),(0,n.CE)("div",Et,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 測點 ")])),_:1}),e.permissionList.tagsRegion?((0,n.uX)(),(0,n.Wv)(d,{key:"tags-region"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"map-marker"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"tags-region"}},{default:(0,n.k6)((()=>[(0,n.eW)("地區")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.tagsChannel?((0,n.uX)(),(0,n.Wv)(d,{key:"tags-channel"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"channel"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"tags-channel"}},{default:(0,n.k6)((()=>[(0,n.eW)("通道")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.tagsDevice?((0,n.uX)(),(0,n.Wv)(d,{key:"tags-device"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"desktop"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"tags-device"}},{default:(0,n.k6)((()=>[(0,n.eW)("裝置")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.tagsGroup?((0,n.uX)(),(0,n.Wv)(d,{key:"tags-group"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"servers"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"tags-group"}},{default:(0,n.k6)((()=>[(0,n.eW)("群組")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.tagsTag?((0,n.uX)(),(0,n.Wv)(d,{key:"tags-tag"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"heart-rate"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"tags-tag"}},{default:(0,n.k6)((()=>[(0,n.eW)("測點")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.user?((0,n.uX)(),(0,n.CE)("div",St,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 人員 ")])),_:1}),e.permissionList.userRole?((0,n.uX)(),(0,n.Wv)(d,{key:"user-role"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"lock-alt"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"user-role"}},{default:(0,n.k6)((()=>[(0,n.eW)("權限設定")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.userList?((0,n.uX)(),(0,n.Wv)(d,{key:"user-list"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"users-alt"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"user-list"}},{default:(0,n.k6)((()=>[(0,n.eW)("人員清單")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0),e.permissionList.schedule?((0,n.uX)(),(0,n.CE)("div",Wt,[(0,n.bF)(u,{class:"ninjadash-sidebar-nav-title"},{default:(0,n.k6)((()=>[(0,n.eW)(" 排程 ")])),_:1}),e.permissionList.scheduleCalendar?((0,n.uX)(),(0,n.Wv)(d,{key:"schedule-calendar"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"calender"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"schedule-calendar"}},{default:(0,n.k6)((()=>[(0,n.eW)("日曆設定")])),_:1})])),_:1})):(0,n.Q3)("",!0),e.permissionList.scheduleWork?((0,n.uX)(),(0,n.Wv)(d,{key:"schedule"},{icon:(0,n.k6)((()=>[(0,n.bF)(s,{name:"list-ul"})])),default:(0,n.k6)((()=>[(0,n.bF)(c,{to:{name:"schedule-work"}},{default:(0,n.k6)((()=>[(0,n.eW)("工作排程")])),_:1})])),_:1})):(0,n.Q3)("",!0)])):(0,n.Q3)("",!0)])),_:1},8,["open-keys","selectedKeys","mode","theme","onOpenChange"])):(0,n.Q3)("",!0)}a(1532);var Rt=a(30995),Tt=a(19732),Pt=JSON.parse('[{"id":5,"date":"Jan 27, 2025","version":"2.2.14","new":["選擇對話框 UI/UX 全面優化","左右佈局設計革新","清除全部選擇功能","視窗拖曳功能","寬度優化與調整大小支持","API 端點修正與開發環境代理優化","關鍵設定保護確認"],"fixed":["修復拖曳功能無法正常工作的問題","改善 DOM 檢測機制","修正 API 請求路徑重複問題","修正開發環境代理設定","確保發布後使用相對路徑"],"updated":["所有選擇對話框統一升級","優化用戶體驗和操作效率","確保開發環境和生產環境都能正常運作"]},{"id":4,"date":"Feb 19, 2023","version":"1.3.0","new":["Added FireStore CRUD"],"fixed":false,"updated":false},{"id":3,"date":"Jan 4, 2023","version":"1.2.0","new":false,"fixed":["NPM errors and warnings","Minor Style issues"],"updated":["Updated Vue JS","Updated NPM packages compatible with latest Vue JS","Updated Ant Design to 3.2.15","Removed momentjs"]},{"id":2,"date":"Dec 29, 2022","version":"1.1.0","new":["Added 4 New Home Page in Vue Version"],"fixed":["Minor Style issues"],"updated":false},{"id":1,"date":"Dec 26, 2022","version":"1.0.0","new":["Initial Release"],"fixed":false,"updated":false}]'),It=a(48156);const Xt={key:0},Ft={key:1};var Mt={__name:"MenuList",props:{openKeys:{type:Array,default:()=>[]},parentKey:{type:String,default:null},allList:{type:Array,default:()=>[]},toggleCollapsed:{type:Function,default:()=>{}}},setup(e){return(t,a)=>{const o=(0,n.g2)("menu-list",!0),r=(0,n.g2)("a-sub-menu"),l=(0,n.g2)("router-link"),s=(0,n.g2)("a-menu-item");return(0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.allList,(t=>((0,n.uX)(),(0,n.CE)("div",{key:`${t.Id}`},[2===t.Category?((0,n.uX)(),(0,n.CE)("div",Xt,[((0,n.uX)(),(0,n.Wv)(r,{key:`${e.parentKey}-${t.Id}`,style:{"padding-left":"20px"}},{title:(0,n.k6)((()=>[(0,n.eW)((0,i.v_)(t.Name),1)])),default:(0,n.k6)((()=>[(0,n.bF)(o,{allList:t.Children,toggleCollapsed:e.toggleCollapsed,parentKey:`${e.parentKey}-${t.Id}`,openKeys:e.openKeys},null,8,["allList","toggleCollapsed","parentKey","openKeys"])])),_:2},1024))])):((0,n.uX)(),(0,n.CE)("div",Ft,[((0,n.uX)(),(0,n.Wv)(s,{onClick:e.toggleCollapsed,key:`${e.parentKey}-${t.Id}`},{default:(0,n.k6)((()=>[(0,n.bF)(l,{to:{name:"gui-main",params:{id:t.Id}}},{default:(0,n.k6)((()=>[(0,n.eW)((0,i.v_)(t.Name),1)])),_:2},1032,["to"])])),_:2},1032,["onClick"]))]))])))),128)}}};const Yt=Mt;var Dt=Yt,Ot=(0,n.pM)({name:"AsideItems",props:{toggleCollapsed:Tt.Ay.func,events:Tt.Ay.object},components:{NavTitle:k.ue,MenuList:Dt},setup(e){const{t:t}=(0,It.s9)(),i=(0,Ie.KR)(!1),o=(0,De.Pj)(),r=(0,n.EW)((()=>o.state.themeLayout.data)),l=(0,Ie.KR)("inline"),{events:s}=(0,Ie.QW)(e),{onRtlChange:c,onLtrChange:d,modeChangeDark:u,modeChangeLight:h,modeChangeTopNav:p,modeChangeSideNav:m}=s.value,g=(0,n.EW)((()=>(0,et.lq)())),f=(0,Ie.Kh)({rootSubmenuKeys:["sub1","sub2","sub4"],selectedKeys:["home"],openKeys:["dashboard"],preOpenKeys:["dashboard"]});function b(e){return new Promise((t=>{for(let n=0;n<e.length;n++)2!==e[n].Category&&Oe.A.addRoute("gui-main",{path:`${e[n].Id}`,component:()=>Promise.all([a.e(5943),a.e(246),a.e(916),a.e(7237),a.e(9179),a.e(8287),a.e(9087),a.e(5513),a.e(3676),a.e(8941)]).then(a.bind(a,75624))}),e[n].Children.length>0&&b(e[n].Children);t()}))}(0,n.sV)((async()=>{try{const e=await o.dispatch("gui/getAllPages");b(e.data),y.value=e.data,i.value=!0}catch(e){Rt.A.error({title:"錯誤",content:e.message})}}));const v=e=>{let t=!1;for(let a in f.openKeys)t?delete f.openKeys[a]:e.includes(f.openKeys[a])||(t=!0,delete f.openKeys[a]);t||(f.openKeys[Object.keys(f.openKeys).length+1]=e[e.length-1]),t=!0},y=(0,Ie.KR)([]);function k(e,t,a=""){let n=[];for(let i of e){let e=`${a}-${i.Id}`;if(i.Id===t){n.push(e);break}if(i.Children&&Array.isArray(i.Children)){let a=k(i.Children,t,e);a.length>0&&n.push(e,...a)}i.Children||i.Id===t||(n=[])}return n}(0,n.wB)((()=>o.state.gui.settingInitData),(async e=>{i.value=!1,y.value=e,await b(e),i.value=!0})),(0,n.nT)((()=>{if(g.value.matched.length)if(g.value.matched.length>2)if("gui-main"===g.value.matched[2].name){const e=k((0,Ie.ux)(y.value),g.value.params.id,"gui",[]);f.selectedKeys=[e[e.length-1]],f.openKeys=e,f.preOpenKeys=e}else f.selectedKeys=[g.value.matched[2].name],f.openKeys=[g.value.matched[1].name],f.preOpenKeys=[g.value.matched[1].name];else f.selectedKeys=[g.value.matched[1].name],f.openKeys=[g.value.matched[1].name],f.preOpenKeys=[g.value.matched[1].name]})),(0,n.wB)((()=>f.openKeys),((e,t)=>{f.preOpenKeys=t}));const _=(0,Ie.Kh)({dashboard:(0,Ue.J)("dashboard").permission.read,gui:(0,Ue.J)("gui").permission.read,guiSetting:(0,Ue.J)("gui-setting").permission.read,guiMain:(0,Ue.J)("gui-main").permission.read,database:(0,Ue.J)("database").permission.read,databaseRealtime:(0,Ue.J)("database-realtime").permission.read,databaseHistory:(0,Ue.J)("database-history").permission.read,databaseRuntime:(0,Ue.J)("database-runtime").permission.read,databaseCustomReport:(0,Ue.J)("database-customReport").permission.read,alarm:!1,alarmRealtime:(0,Ue.J)("alarm-realtime").permission.read,alarmHistory:(0,Ue.J)("alarm-history").permission.read,alarmReliability:(0,Ue.J)("alarm-reliability").permission.read,alarmReliabilityAnalysis:(0,Ue.J)("alarm-reliability-analysis").permission.read,system:!1,systemUninstall:(0,Ue.J)("system-uninstall").permission.read,systemBill:(0,Ue.J)("system-bill").permission.read,systemWaterbill:(0,Ue.J)("system-waterbill").permission.read,systemCCTV:(0,Ue.J)("system-cctv").permission.read,systemBTU:(0,Ue.J)("system-btu").permission.read,notify:(0,Ue.J)("notify").permission.read,notifySetting:(0,Ue.J)("notify-setting").permission.read,notifyGroup:(0,Ue.J)("notify-group").permission.read,notifyMessage:(0,Ue.J)("notify-message").permission.read,tags:(0,Ue.J)("tags").permission.read,tagsRegion:(0,Ue.J)("tags-region").permission.read,tagsChannel:(0,Ue.J)("tags-channel").permission.read,tagsDevice:(0,Ue.J)("tags-device").permission.read,tagsGroup:(0,Ue.J)("tags-group").permission.read,tagsTag:(0,Ue.J)("tags-tag").permission.read,user:(0,Ue.J)("user").permission.read,userList:(0,Ue.J)("user-list").permission.read,userRole:(0,Ue.J)("user-role").permission.read,schedule:(0,Ue.J)("schedule").permission.read,scheduleCalendar:(0,Ue.J)("schedule-calendar").permission.read,scheduleWork:(0,Ue.J)("schedule-work").permission.read});return _.system=(0,n.EW)((()=>_.systemUninstall||_.systemBill||_.systemWaterbill||_.systemBTU||_.systemCCTV)),_.alarm=(0,n.EW)((()=>_.alarmHistory||_.alarmReliability||_.alarmReliabilityAnalysis||_.alarmRealtime)),{init:i,guiList:y,mode:l,...(0,Ie.QW)(f),darkMode:r,onRtlChange:c,onLtrChange:d,modeChangeDark:u,modeChangeLight:h,modeChangeTopNav:p,modeChangeSideNav:m,versions:Pt,onOpenChange:v,t:t,permissionList:_}}});const Nt=(0,We.A)(Ot,[["render",Lt]]);var Kt=Nt,Ut=(a(75126),a(56427)),jt=(a(17642),a(58004),a(33853),a(45876),a(32475),a(15024),a(31698),a(5440)),$t=a(52521),Ht=a(96763);const Vt=()=>["/api/AlarmSummary","/AlarmSummary"],Bt=e=>{const t=(new jt.$).withUrl(e,{skipNegotiation:!0,transport:$t.w.WebSockets}).withAutomaticReconnect({nextRetryDelayInMilliseconds:()=>5e3}).build();return t.serverTimeoutInMilliseconds=6e4,t.keepAliveIntervalInMilliseconds=15e3,t},Qt=e=>({get state(){return e().state},start(...t){return e().start(...t)},stop(...t){return e().stop(...t)},invoke(...t){return e().invoke(...t)},on(...t){return e().on(...t)},off(...t){return e().off(...t)}});function Jt(e){let t=Vt()[0],a=Bt(t);const n=Qt((()=>a)),i=t=>{t.on("GetConnectedId",(async function(e){const a=(0,st.Gq)("customer_id");if(!a)return Ht.error("客戶 ID 未找到，請重新登入"),void Ut.A.error({message:"連接失敗",description:"客戶 ID 未找到，請重新登入系統",duration:5});const n={CustomerId:a,ClientId:e},i=JSON.stringify(n);try{await t.invoke("FromClientSendConnectedIdAndCustomerIdAsync",i)}catch(o){Ht.error("警報連接錯誤:",o),Ut.A.error({message:"警報連接失敗",description:"無法建立警報連接，請檢查網路或重新登入",duration:5})}})),t.on("ToClientSendAlarmSummaryJson",e),t.on("CustomerIdError",(function(e){Ht.error("客戶代碼錯誤:",e)})),t.onclose((async()=>{speechSynthesis.cancel();let e=5e3;const t=6e4,a=async()=>{try{await r(),Ht.log("AlarmSummary 重連成功")}catch(n){Ht.warn(`AlarmSummary 重連失敗，${e/1e3}s 後重試`,n),e=Math.min(2*e,t),setTimeout(a,e)}};setTimeout(a,e)}))},o=e=>{t=e,a=Bt(e),i(a)},r=async()=>{let e=null;const n=[...new Set([t,...Vt()])];for(const l of n){t!==l&&o(l);try{return await a.start(),void Ht.log(`AlarmSummary WebSocket 連接成功: ${l}`)}catch(i){e=i,Ht.warn(`AlarmSummary WebSocket 連接失敗: ${l}`,i);try{await a.stop()}catch(r){}}}Ht.error("AlarmSummary WebSocket 連接失敗:",e)};return i(a),r(),{connection:n}}var zt=a(69265),Gt=a(96763);const qt=()=>["/api/Cctv","/Cctv"],Zt=e=>{const t=(new jt.$).withUrl(e,{skipNegotiation:!0,transport:$t.w.WebSockets}).withAutomaticReconnect({nextRetryDelayInMilliseconds:()=>5e3}).build();return t.serverTimeoutInMilliseconds=6e4,t.keepAliveIntervalInMilliseconds=15e3,t};let ea=qt()[0],ta=Zt(ea),aa=!1;const na=e=>{ea=e,ta=Zt(e),aa=!1,oa()},ia=async()=>{const e=(0,st.Gq)("customer_id");if(!e)return Gt.error("客戶 ID 未找到，請重新登入"),void Ut.A.error({message:"連接失敗",description:"客戶 ID 未找到，請重新登入系統",duration:5});try{Gt.log("嘗試註冊 CCTV 客戶:",e),await ta.invoke("registerClientAsync",e,999),Gt.log("CCTV 連接註冊成功")}catch(t){throw Gt.error("CCTV 連接註冊失敗:",t),Ut.A.error({message:"CCTV 連接失敗",description:"無法註冊 CCTV 連接，可能是客戶 ID 格式不正確",duration:5}),t}};function oa(){aa||(ta.onclose((async()=>{speechSynthesis.cancel()})),ta.onreconnected((async()=>{Gt.log("CCTV WebSocket 重新連接成功");try{await ia()}catch(e){Gt.error("CCTV 重新註冊失敗:",e)}})),aa=!0)}async function ra(){if(oa(),ta.state===zt.j.Connected||ta.state===zt.j.Connecting||ta.state===zt.j.Reconnecting)return;let e=null;const t=[...new Set([ea,...qt()])];for(const i of t){ea!==i&&na(i);try{return await ta.start(),Gt.log(`CCTV WebSocket 連接成功: ${i}`),void await ia()}catch(a){e=a,Gt.warn(`CCTV WebSocket 連接失敗: ${i}`,a);try{await ta.stop()}catch(n){}}}throw Gt.error("CCTV WebSocket 連接失敗:",e),Ut.A.error({message:"CCTV WebSocket 連接失敗",description:"無法連接到 CCTV 服務器，請檢查網路連接或代理設定",duration:5}),e}async function la(){return await ra(),{connection:ta}}var sa=a(96763);const{Header:ca,Footer:da,Sider:ua,Content:ha}=y.Ay;var pa=(0,n.pM)({name:"WithAdminLayout",components:{Div:k.i,Header:ca,Layout:y.Ay,Footer:da,Sider:ua,Content:ha,AuthInfo:bt,Notification:Re,AsideItems:Kt,PerfectScrollbar:ve,Realtime:Ze,cctvStream:Ne.A},setup(){const e=(0,Ie.KR)(!1),t=(0,Ie.KR)(!0),a=(0,Ie.KR)(!0),i=(0,Ie.KR)(!1),o=(0,Ie.KR)(!1),{dispatch:r,state:l}=(0,De.Pj)(),s=(0,n.EW)((()=>l.themeLayout.rtlData)),c=(0,n.EW)((()=>l.themeLayout.data)),d=(0,n.EW)((()=>l.themeLayout.topMenu)),u=(0,n.EW)((()=>{try{const e=l.auth.login;if(!e)return"";const t=(0,st.Gq)("userData");return t&&"object"===typeof t&&t.CustomerName?t.CustomerName:""}catch(e){return""}})),h=(0,Ie.KR)("1"),p=(0,Ie.IJ)([]),m=(0,Ie.KR)({NODE_ENV:"production",VUE_APP_API_ENDPOINT:"http://192.168.1.152:8345/",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_EXPORT_API_ENDPOINT:"http://192.168.1.152:5146/",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_AUTH_DOMAIN:"strikingdash-vue.firebaseapp.com",VUE_APP_FIREBASE_DATABASE_URL:"strikingdash-vue",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_PROJECT_ID:"strikingdash-vue",VUE_APP_FIREBASE_STORAGE_BUCKET:"strikingdash-vue.appspot.com",VUE_APP_FRONTEND_URL:"http://localhost:8080/",VUE_APP_GOOGLE_MAP_API:"AIzaSyBgYKHZB_QKKLWfIRaYPCadza3nhTAbv7c",VUE_APP_IMAGE_URL:"http://192.168.1.152:7654/",VUE_APP_MQTT_URL:"ws://192.168.150.110:8083",VUE_APP_OCOGUI_URL:"http://localhost:2955",VUE_APP_PROFILE_IMAGE_ENDPOINT:"http://api.masudr.com",VUE_APP_SUB_ROUTE:"/",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",BASE_URL:"/"}.VUE_APP_VERSION||"2.3.003"),g=(0,Ie.KR)({NODE_ENV:"production",VUE_APP_API_ENDPOINT:"http://192.168.1.152:8345/",VUE_APP_AUTH0_CLIENT_ID:"RQE7Ri7VAgoUYhDY1zbeePKAvVwfsUDK",VUE_APP_AUTH0_DOMAIN:"dev-cc7jh4vf.us.auth0.com",VUE_APP_EXPORT_API_ENDPOINT:"http://192.168.1.152:5146/",VUE_APP_FIREBASE_API_KEY:"AIzaSyCTq5eJkSFhSlJZZijxdmGwQ8dv8C1Eilk",VUE_APP_FIREBASE_APP_ID:"1:230278565850:web:bde8cb518a3c9a37f83ae3",VUE_APP_FIREBASE_AUTH_DOMAIN:"strikingdash-vue.firebaseapp.com",VUE_APP_FIREBASE_DATABASE_URL:"strikingdash-vue",VUE_APP_FIREBASE_MEASUREMENT_ID:"G-43XQJBNN1T",VUE_APP_FIREBASE_MESSAGING_SENDER_ID:"230278565850",VUE_APP_FIREBASE_PROJECT_ID:"strikingdash-vue",VUE_APP_FIREBASE_STORAGE_BUCKET:"strikingdash-vue.appspot.com",VUE_APP_FRONTEND_URL:"http://localhost:8080/",VUE_APP_GOOGLE_MAP_API:"AIzaSyBgYKHZB_QKKLWfIRaYPCadza3nhTAbv7c",VUE_APP_IMAGE_URL:"http://192.168.1.152:7654/",VUE_APP_MQTT_URL:"ws://192.168.150.110:8083",VUE_APP_OCOGUI_URL:"http://localhost:2955",VUE_APP_PROFILE_IMAGE_ENDPOINT:"http://api.masudr.com",VUE_APP_SUB_ROUTE:"/",VUE_APP_TINYMCE_API_KEY:"7o2468tzzaks78b3x5oeguzaqb2z8lvmrilea7aktlo0de7k",BASE_URL:"/"}.VUE_APP_BUILD_DATE||"2026-03-25 11:15:00"),f=(0,Ie.IJ)([]),b=()=>{try{const e=(0,st.Gq)("userData"),t=e?.CustomerName||"OCO Web Scada",a=`${t} - OCO Web Scada (${m.value})`;document.title=a}catch(e){sa.error("更新頁面標題時出錯:",e)}},v=e=>{"userData"===e.key&&b()};(0,n.sV)((()=>{const e=()=>r("tags/getAllTagsAndOptions");"function"===typeof window.requestIdleCallback?window.requestIdleCallback(e,{timeout:5e3}):setTimeout(e,2e3),b(),window.addEventListener("storage",v)})),e.value=window.innerWidth<=1200&&!0;let y=[],k=0,_=!1;const w=()=>{if(!speechSynthesis.speaking&&y.length>0){const e=new SpeechSynthesisUtterance(y[k]);e.onend=C,speechSynthesis.speak(e)}},C=()=>{_?(k=0,_=!1):k=(k+1)%y.length,w()},A=e=>{const t=e.map((e=>e.AlarmDescription));y=t,_=!0},x=(0,Ie.KR)(null);let E="",S=null,W=0;const L=300,R=e=>{const t=JSON.parse(e),a=t.AlarmSummaryJson;if(a===E)return;E=a;try{const e=JSON.parse(a),t=e.some((e=>1===e.AlarmState&&e.Priority<=1));if(t)return S&&(clearTimeout(S),S=null),W=performance.now(),void P(a)}catch(o){}if(S)return;const n=performance.now(),i=n-W;i>=L?(W=n,requestAnimationFrame((()=>P(a)))):S=setTimeout((()=>{S=null,W=performance.now(),P(E)}),L-i)},T=(e,t=0)=>{const a=(0,Ke.MF)(e,"CctvList");a&&a.length>0?D({CctvIdList:a.map((e=>e.Id)),isAuto:!0}):!(0,Ke.LG)()&&t<3&&setTimeout((()=>T(e,t+1)),1e3)},P=e=>{const t=JSON.parse(e);if(t.sort(((e,t)=>new Date(t.AlarmTime)-new Date(e.AlarmTime))),Object.freeze(t),p.value=t,f.value=t.filter((e=>3===e.AlarmStatus)),A(t.filter((e=>e.IsAudio&&1===e.AlarmState))),w(),0===t.length)return;const a=t.find((e=>1===e.AlarmState));if(a){if(h.value="1",F.value=a.Id,a.Id!==x.value)x.value=a.Id,X.value=!1,a.PageId&&Oe.A.currentRoute.value.params.id!==a.PageId&&Oe.A.push({name:"gui-main",params:{id:a.PageId}}),T(a.ComponentId);else{if(X.value)return void(M.value=a.AlarmState);T(a.ComponentId)}M.value=a.AlarmState}else{const e=t[0];e&&3===e.AlarmState&&(X.value=!1,x.value=null,M.value=e.AlarmState)}},{connection:I}=Jt(R);(0,n.xo)((()=>{I.stop(),S&&(clearTimeout(S),S=null)}));const X=(0,Ie.KR)(!1),F=(0,Ie.KR)(null),M=(0,Ie.KR)(null),Y=e=>{U.value=e},D=({CctvIdList:e,isAuto:t=!0})=>{if(U.value)return;const a=Qe(e);a&&(t?Ve():(je.value="user",$e.value=!0))},O=()=>{"auto"===je.value&&(X.value=!0),Be()};let N=null,K=!1;la().then((({connection:e})=>{if(K)try{e.stop()}catch{}else N=e})).catch((e=>{sa.error("CCTV connection init failed:",e)})),(0,n.xo)((()=>{if(K=!0,window.removeEventListener("storage",v),innerWidth<=990&&z&&document.body.removeEventListener("click",z),N)try{N.stop()}catch{}}));const U=(0,Ie.KR)(!1),j=e=>{U.value=e},$=e=>{h.value=e};(0,n.wB)((()=>U.value),(e=>{e?I.stop():I.start()}));const H=t=>{t.preventDefault(),e.value=!e.value},V=e=>{a.value=!e,t.value=!0},B=e=>{t.value=!e,a.value=!0},Q=()=>{o.value=!o.value},J=()=>{innerWidth<=990&&(e.value=!e.value)},z=t=>{t.target.closest(".ant-layout-sider")||t.target.closest(".navbar-brand .ant-btn")||(e.value=!0)};innerWidth<=990&&document.body.addEventListener("click",z);const G=()=>{const e=document.querySelector("html");e.setAttribute("dir","rtl"),r("changeRtlMode",!0)},q=()=>{const e=document.querySelector("html");e.setAttribute("dir","ltr"),r("changeRtlMode",!1)},Z=()=>{r("changeLayoutMode",!0)},ee=()=>{r("changeLayoutMode",!1)},te=()=>{r("changeMenuMode",!0)},ae=()=>{r("changeMenuMode",!1)},ne=(0,n.EW)((()=>l.alarm.realtimeInitData)),ie={onRtlChange:G,onLtrChange:q,modeChangeDark:Z,modeChangeLight:ee,modeChangeTopNav:te,modeChangeSideNav:ae};return{alarmCollapsed:h,pause:U,onPauseChanged:j,changePanel:$,alarmSummary:p,importantAlarm:f,toggleCollapsed:H,handleSearchHide:V,toggleCollapsedMobile:J,onShowHide:B,collapsed:e,hide:t,searchHide:a,toggleSearch:Q,customizerAction:i,activeSearch:o,innerWidth:window.innerWidth,rtl:s,darkMode:c,topMenu:d,onEventChange:ie,alarms:ne,cctvModalOpen:$e,cctvModalList:He,changeAlarmCCTVSetting:Y,closeCCTVModal:O,customerName:u,appVersion:m,buildDate:g}}});const ma=(0,We.A)(pa,[["render",v]]);var ga=ma},68812:function(e,t,a){e.exports=a.p+"img/align-center-alt.753b187f.svg"},97357:function(e,t,a){a(1532);var n=a(30995),i=a(20641),o=a(91979),r=a(18748),l=a(58698),s=a(35789);const c={confirm(e){return n.A.confirm({icon:(0,i.h)(o.A),...e})},error(e){return n.A.error({icon:(0,i.h)(r.A),...e})},info(e){return n.A.info({icon:(0,i.h)(l.A),...e})},success(e){return n.A.success({icon:(0,i.h)(s.A),...e})},warning(e){return n.A.warning({icon:(0,i.h)(o.A),...e})}};t.A=c}}]);