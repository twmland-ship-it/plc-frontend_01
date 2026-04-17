"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[7958],{10161:function(e,t,a){a.d(t,{A:function(){return h}});var l=a(20641),n=a(72644);const o={class:"ninjadash-datatable-filter"},r={key:0,class:"ninjadash-datatable-filter__right"},i={class:"ninjadasj-datatable"};function s(e,t,a,s,c,d){const u=(0,l.g2)("sdButton"),p=(0,l.g2)("a-space"),m=(0,l.g2)("unicon"),g=(0,l.g2)("a-input"),f=(0,l.g2)("a-button"),b=(0,l.g2)("a-col"),h=(0,l.g2)("a-row"),y=(0,l.g2)("a-table"),v=(0,l.g2)("TableWrapper"),k=(0,l.g2)("DataTableStyleWrap");return(0,l.uX)(),(0,l.Wv)(k,null,{default:(0,l.k6)((()=>[(0,l.Lk)("div",o,[(0,l.Lk)("div",null,[(0,l.bF)(p,null,{default:(0,l.k6)((()=>[e.addOption?((0,l.uX)(),(0,l.Wv)(u,{key:0,class:"act-btn",type:"primary",onClick:e.handleAdd},{default:(0,l.k6)((()=>[(0,l.eW)(" 新增 ")])),_:1},8,["onClick"])):(0,l.Q3)("",!0),e.backOption?((0,l.uX)(),(0,l.Wv)(u,{key:1,size:"default",outlined:!0,type:"primary",onClick:e.handleBack},{default:(0,l.k6)((()=>[(0,l.eW)(" 回上層 "+(0,n.v_)(e.backTitle),1)])),_:1},8,["onClick"])):(0,l.Q3)("",!0)])),_:1})]),e.filterOption?((0,l.uX)(),(0,l.CE)("div",r,[(0,l.bF)(g,{onChange:e.handleDataSearch,size:"default",placeholder:"搜尋"},{prefix:(0,l.k6)((()=>[(0,l.bF)(m,{name:"search"})])),_:1},8,["onChange"])])):(0,l.Q3)("",!0)]),(0,l.bF)(h,{align:"end"},{default:(0,l.k6)((()=>[e.importOption?((0,l.uX)(),(0,l.Wv)(b,{key:0,style:{"margin-bottom":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(f,{type:"primary",ghost:"",onClick:e.handleImport},{default:(0,l.k6)((()=>[(0,l.eW)("匯入")])),_:1},8,["onClick"])])),_:1})):(0,l.Q3)("",!0),e.exportOption?((0,l.uX)(),(0,l.Wv)(b,{key:1,style:{"margin-bottom":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(f,{type:"primary",ghost:"",onClick:e.handleExport},{default:(0,l.k6)((()=>[(0,l.eW)("匯出Excel")])),_:1},8,["onClick"])])),_:1})):(0,l.Q3)("",!0)])),_:1}),(0,l.Lk)("div",i,[(0,l.bF)(v,{class:"table-data-view table-responsive"},{default:(0,l.k6)((()=>[e.rowSelection?((0,l.uX)(),(0,l.Wv)(y,{key:0,class:"ant-table-striped","row-selection":e.rowSelections,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},childrenColumnName:e.childrenColumnName,"row-class-name":e.getRowClassName,"data-source":e.tableData,columns:e.columns,onChange:e.changePageSize},null,8,["row-selection","pagination","childrenColumnName","row-class-name","data-source","columns","onChange"])):((0,l.uX)(),(0,l.Wv)(y,{key:1,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},class:"ant-table-striped",childrenColumnName:e.childrenColumnName,"data-source":e.tableData,"row-class-name":e.getRowClassName,columns:e.columns,onChange:e.changePageSize},null,8,["pagination","childrenColumnName","data-source","row-class-name","columns","onChange"]))])),_:1})])])),_:1})}var c=a(79841),d=a(19732),u=a(95853);const p=u.Ay.div`
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
`;var m=a(79570),g=(0,l.pM)({components:{DataTableStyleWrap:p,TableWrapper:m.AC},props:{filterOption:d.Ay.bool,filterOnchange:d.Ay.bool,rowSelection:d.Ay.bool,defaultSelected:d.Ay.array,tableData:d.Ay.array,columns:d.Ay.array,handleDataSearch:d.Ay.func,handleAdd:d.Ay.func,handleBack:d.Ay.func,handleImport:d.Ay.func,handleExport:d.Ay.func,rowClassFunc:{type:Function,default:()=>{}},backOption:{type:Boolean,default:!1},addOption:{type:Boolean,default:!1},exportOption:{type:Boolean,default:!1},importOption:{type:Boolean,default:!1},expandedRow:{type:Object,default:null},childrenColumnName:{type:String,default:"children"},backTitle:{type:String,default:""}},setup(e,{emit:t}){const a=(0,c.KR)([]);(0,l.wB)((()=>e.defaultSelected),(e=>{a.value=e}),{immediate:!0});const n=e=>{a.value=e,t("onSelectChange",a.value)},o=(0,l.EW)((()=>({selectedRowKeys:(0,c.R1)(a),onChange:n,hideDefaultSelections:!0}))),r=(0,c.KR)(10),i=(0,c.KR)(["10","20","50","100"]),s=e=>{r.value=e.pageSize},d=({record:t})=>e.expandedRow.innerDataProp?t[e.expandedRow.innerDataProp]:t.children,u=(t,a)=>e.rowClassFunc(t)??a%2===1?"table-striped row-style":"row-style";return{pageSize:r,pageSizeOptions:i,rowSelections:o,changePageSize:s,getInnerData:d,getRowClassName:u}}}),f=a(66262);const b=(0,f.A)(g,[["render",s],["__scopeId","data-v-1b881e36"]]);var h=b},63260:function(e,t,a){a.d(t,{A:function(){return u}});a(1532);var l=a(30995),n=a(20641),o=a(9322),r=a(72644),i=a(79841);const s=["onClick"];var c={__name:"Index",props:{sourceData:{type:Array,default:()=>[]},deleteFunc:{type:Function,default:()=>{}},loading:{type:Boolean,default:!1}},emits:["submit"],setup(e,{emit:t}){const a=e,c=(0,i.KR)(!1),d=()=>{c.value=!0},u=()=>{c.value=!1},p=e=>{c.value=!1,t("submit",JSON.parse(e))},m=async e=>{l.A.confirm({title:"確定刪除?",okText:"確認",cancelText:"取消",onOk:async()=>{try{await a.deleteFunc(e),l.A.success({title:"已確認"})}catch(t){l.A.error({title:"發生錯誤",content:t.message})}}})};return(t,a)=>{const l=(0,n.g2)("a-list-item"),i=(0,n.g2)("a-list"),g=(0,n.g2)("sdModal"),f=(0,n.g2)("sdButton");return(0,n.uX)(),(0,n.CE)(n.FK,null,[c.value?((0,n.uX)(),(0,n.Wv)(g,{key:0,title:"常用搜尋",visible:c.value,onCancel:u},{default:(0,n.k6)((()=>[(0,n.bF)(i,{loading:e.loading,"item-layout":"horizontal","data-source":e.sourceData},{renderItem:(0,n.k6)((({item:e})=>[(0,n.bF)(l,{style:{cursor:"pointer"},onClick:t=>p(e.Value)},{actions:(0,n.k6)((()=>[(0,n.Lk)("a",{style:{color:"#ff8000"},onClick:(0,o.D$)((t=>m(e.Key)),["stop"])},"刪除",8,s)])),default:(0,n.k6)((()=>[(0,n.eW)(" "+(0,r.v_)(JSON.parse(e.Value)?.name),1)])),_:2},1032,["onClick"])])),_:1},8,["loading","data-source"])])),_:1},8,["visible"])):(0,n.Q3)("",!0),(0,n.bF)(f,{type:"primary",style:{"margin-bottom":"1rem"},onClick:d},{default:(0,n.k6)((()=>[(0,n.eW)("常用搜尋")])),_:1})],64)}}};const d=c;var u=d},64370:function(e,t,a){a.d(t,{H:function(){return n}});var l=a(20641);function n(e=".tag-filter-modal"){let t=!1,a=0,n=0,o=0,r=0,i=null,s=null;const c=()=>{const t=()=>{if(i=document.querySelector(e),i){if(s=i.querySelector(".ant-modal-header")||i.querySelector(".modal-header")||i.querySelector('[class*="header"]')||i.querySelector(".ant-modal-title")?.parentElement,!s){const e=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');if(e){const t=document.createElement("div");t.className="modal-drag-handle",t.style.cssText="\n              position: absolute;\n              top: 0;\n              left: 0;\n              right: 0;\n              height: 40px;\n              cursor: move;\n              z-index: 1000;\n              background: rgba(0,0,0,0.02);\n            ",e.style.position="relative",e.appendChild(t),s=t}}if(s){s.style.cursor="move",s.addEventListener("mousedown",d);const e=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');return e&&(e.style.position="relative",e.style.transform="translate(0, 0)"),!0}}return!1};if(t())return;const a=new MutationObserver((()=>{t()&&a.disconnect()}));a.observe(document.body,{childList:!0,subtree:!0}),setTimeout((()=>a.disconnect()),5e3)},d=e=>{if(e.target.closest(".ant-modal-close")||e.target.closest(".clear-all-btn")||e.target.closest('[class*="close"]'))return;t=!0,a=e.clientX,n=e.clientY;const l=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');if(l){const e=l.style.transform,t=e.match(/translate\(([^,]+),\s*([^)]+)\)/);t?(o=parseFloat(t[1])||0,r=parseFloat(t[2])||0):(o=0,r=0)}i.classList.add("dragging"),document.addEventListener("mousemove",u),document.addEventListener("mouseup",p),e.preventDefault(),e.stopPropagation()},u=e=>{if(!t)return;const l=e.clientX-a,s=e.clientY-n,c=o+l,d=r+s,u=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');if(u){const e=u.getBoundingClientRect(),t=window.innerWidth,a=window.innerHeight,l=t-e.width-50,n=a-e.height-50,o=100-e.width,r=-50,i=Math.max(o,Math.min(l,c)),s=Math.max(r,Math.min(n,d));u.style.transform=`translate(${i}px, ${s}px)`}},p=()=>{t&&(t=!1,i.classList.remove("dragging"),document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",p))},m=()=>{s&&s.removeEventListener("mousedown",d),document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",p)};return(0,l.sV)((()=>{c()})),(0,l.hi)((()=>{m()})),{initDrag:c,cleanup:m}}},68237:function(e,t,a){a.d(t,{A:function(){return x}});var l=a(20641),n=a(72644),o=a(9322);const r={class:"section-title"},i=["onClick"],s={key:0,class:"empty-message"},c=(0,l.Lk)("div",{class:"section-title"},"可選擇的群組",-1),d=["onClick"];function u(e,t,a,u,p,m){const g=(0,l.g2)("a-tree-select"),f=(0,l.g2)("a-form-item"),b=(0,l.g2)("a-form"),h=(0,l.g2)("a-button"),y=(0,l.g2)("unicon"),v=(0,l.g2)("SelectedList"),k=(0,l.g2)("a-col"),S=(0,l.g2)("a-spin"),C=(0,l.g2)("GroupList"),w=(0,l.g2)("a-row"),x=(0,l.g2)("a-select"),F=(0,l.g2)("sdButton"),_=(0,l.g2)("sdModal"),A=(0,l.g2)("Wrap");return(0,l.uX)(),(0,l.Wv)(A,null,{default:(0,l.k6)((()=>[(0,l.Lk)("span",null,"包含 "+(0,n.v_)(e.selectedGroups.length)+" 個群組 ",1),(0,l.Lk)("span",{class:"text-primary",onClick:t[0]||(t[0]=(...t)=>e.openModal&&e.openModal(...t))}," 選擇群組"),e.modal?((0,l.uX)(),(0,l.Wv)(_,{key:0,title:"選擇群組",visible:e.modal,maskClosable:!0,onCancel:e.closeModal,width:900,class:"tag-filter-modal"},{default:(0,l.k6)((()=>[(0,l.bF)(b,{"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,l.k6)((()=>[(0,l.bF)(f,{label:"地區",style:{"margin-top":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(g,{value:e.formState.regionId,"onUpdate:value":t[1]||(t[1]=t=>e.formState.regionId=t),style:{width:"100%"},"tree-data":e.locations,"allow-clear":"","field-names":{children:"ChildList",label:"Name",value:"Id"},placeholder:"請選擇","tree-node-filter-prop":"label"},null,8,["value","tree-data"])])),_:1}),(0,l.bF)(f,{label:"群組分類"},{default:(0,l.k6)((()=>[(0,l.bF)(g,{value:e.formState.groupClass,"onUpdate:value":t[2]||(t[2]=t=>e.formState.groupClass=t),style:{width:"100%"},"tree-data":e.groupClassOptions,"allow-clear":"","field-names":{children:"ChildList",label:"Name",value:"Id"},placeholder:"請選擇","tree-node-filter-prop":"label"},null,8,["value","tree-data"])])),_:1})])),_:1},8,["label-col","wrapper-col"]),(0,l.bF)(w,{gutter:16,style:{"margin-top":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(k,{span:12},{default:(0,l.k6)((()=>[(0,l.Lk)("div",r,[(0,l.eW)(" 已選擇的群組 ("+(0,n.v_)(e.formState.groups.length)+") ",1),e.formState.groups.length>0?((0,l.uX)(),(0,l.Wv)(h,{key:0,type:"link",size:"small",onClick:e.clearAllGroups,class:"clear-all-btn"},{default:(0,l.k6)((()=>[(0,l.eW)(" 清除全部 ")])),_:1},8,["onClick"])):(0,l.Q3)("",!0)]),(0,l.bF)(v,null,{default:(0,l.k6)((()=>[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e.formState.groups,(t=>((0,l.uX)(),(0,l.CE)("div",{key:t.value,class:"selected-item",onClick:a=>e.removeGroup(t)},[(0,l.Lk)("span",null,(0,n.v_)(t.label),1),(0,l.bF)(y,{name:"times",class:"remove-icon"})],8,i)))),128)),0===e.formState.groups.length?((0,l.uX)(),(0,l.CE)("div",s," 尚未選擇任何群組 ")):(0,l.Q3)("",!0)])),_:1})])),_:1}),(0,l.bF)(k,{span:12},{default:(0,l.k6)((()=>[c,(0,l.bF)(C,null,{default:(0,l.k6)((()=>[(0,l.bo)((0,l.bF)(S,null,null,512),[[o.aG,e.groupSearching]]),((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e.groupOptions,(t=>((0,l.uX)(),(0,l.CE)("div",{key:t.value,class:(0,n.C4)(["tag",e.isExistInSelectedGroups(t)&&"selected"]),onClick:a=>e.setGroups(t)},(0,n.v_)(t.label),11,d)))),128))])),_:1})])),_:1})])),_:1}),(0,l.bF)(x,{mode:"multiple",value:e.formState.groups,"onUpdate:value":t[3]||(t[3]=t=>e.formState.groups=t),open:!1,style:{width:"100%",display:"none"},labelInValue:!0},null,8,["value"]),(0,l.bF)(w,{gutter:[5,10],align:"center",style:{"margin-top":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(k,null,{default:(0,l.k6)((()=>[(0,l.bF)(F,{class:"act-btn",type:"primary",onClick:e.submit},{default:(0,l.k6)((()=>[(0,l.eW)(" 選定群組 ")])),_:1},8,["onClick"])])),_:1}),(0,l.bF)(k,null,{default:(0,l.k6)((()=>[(0,l.bF)(F,{class:"act-btn",type:"light",onClick:e.closeModal},{default:(0,l.k6)((()=>[(0,l.eW)(" 取消 ")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["visible","onCancel"])):(0,l.Q3)("",!0)])),_:1})}a(1532);var p=a(30995),m=(a(44114),a(18111),a(20116),a(61701),a(79841)),g=a(95853);const f=g.Ay.div`
   .text-primary{
       color:${({theme:e})=>e["primary-color"]};
       cursor:pointer;
   }
`,b=g.Ay.div`
    border:1px solid ${({theme:e})=>e["primary-color"]};
    border-radius:5px;
    height:350px;
    width:100%;
    overflow:auto;
    .tag{
        padding:0.5rem;
        font-size:14px;
        cursor:pointer;
        color:${({theme:e})=>e["primary-color"]};
        word-wrap: break-word;
        white-space: normal;
        line-height: 1.4;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #f5f5f5;
        }
    }
    .selected{
        background-color:#ff800010;
        color:${({theme:e})=>e["primary-color"]};
        padding-left:1rem;
        font-weight: 500;
    }
`,h=g.Ay.div`
    border:1px solid #d9d9d9;
    border-radius:5px;
    height:350px;
    width:100%;
    overflow:auto;
    background-color: #fafafa;

    .selected-item{
        padding:0.5rem;
        font-size:14px;
        cursor:pointer;
        color: #333;
        word-wrap: break-word;
        white-space: normal;
        line-height: 1.4;
        border-bottom: 1px solid #e8e8e8;
        transition: background-color 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
            background-color: #f0f0f0;
        }

        .remove-icon {
            color: #ff4d4f;
            font-size: 12px;
            margin-left: 8px;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }
    }

    .empty-message {
        padding: 2rem;
        text-align: center;
        color: #999;
        font-style: italic;
    }
`;var y=a(40834),v=a(18683),k=a(64370),S=(0,l.pM)({props:{selectedGroups:{type:Array,default:()=>[]},groupsValueProp:{type:String,default:"id"},groupsLabelProp:{type:String,default:"name"}},components:{GroupList:b,Wrap:f,SelectedList:h},setup(e,{emit:t}){const{dispatch:a,state:n}=(0,y.Pj)(),o=(0,m.KR)(!1);(0,k.H)(".tag-filter-modal"),(0,l.sV)((async()=>{const e=await a("group/getAllGroupsAndOptions");c.value=e.locations,u.value=e.groupClass}));const r={lg:6,md:9,xs:24},i={lg:18,md:15,xs:24},s=[{id:"1",name:"描述+名稱"},{id:"2",name:"描述"},{id:"3",name:"名稱"}],c=(0,m.KR)([]),d=(0,l.EW)((()=>{const e=[{type:"list",target:g.regionId?g.regionId:null,source:"GroupSetting.RegionListDirectLineElderList",sourceProp:"Id"},{type:"list",target:g.groupClass?g.groupClass:null,source:"GroupSetting.GroupCategoryDirectLineElderList",sourceProp:"Id"}],t=(0,v.Q8)(e,n.group.groupInitData);return t.map((e=>({value:e.Id,label:e.Name,tags:e.ContentSetting.TagList})))})),u=(0,m.KR)([]),g=(0,m.Kh)({regionId:null,groupClass:null,groups:[]}),f=e=>{const t=g.groups.find((t=>t.value===e.value));return t},b=e=>{const t=g.groups.includes(e);if(t){const t=g.groups.indexOf(e);g.groups.splice(t,1)}else g.groups.push(e)},h=e=>{const t=g.groups.findIndex((t=>t.value===e.value));t>-1&&g.groups.splice(t,1)},S=()=>{g.groups=[]},C=()=>{g.regionId=null,g.groupClass=null;const a=g.groups.map((t=>({[e.groupsValueProp]:t.value,[e.groupsLabelProp]:t.label,tags:n.group.groupInitData.find((e=>e.Id===t.value))?.ContentSetting.TagList})));t("setGroups",a),w.value=!1},w=(0,m.KR)(!1),x=()=>{g.groups=e.selectedGroups.map((e=>d.value.find((t=>t.value===e))??{value:null,label:"群組不存在"})),w.value=!0},F=()=>{g.regionId=null,g.groupClass=null,JSON.stringify(g.groups.map((e=>e.value)))!==JSON.stringify(e.selectedGroups)?p.A.confirm({title:"提示",content:"群組將不會選定，確定關閉？",onOk(){w.value=!1}}):w.value=!1};return{groupSearching:o,labelCol:r,wrapperCol:i,showNameOptions:s,locations:c,groupClassOptions:u,groupOptions:d,formState:g,isExistInSelectedGroups:f,setGroups:b,removeGroup:h,clearAllGroups:S,modal:w,openModal:x,closeModal:F,submit:C}}}),C=a(66262);const w=(0,C.A)(S,[["render",u]]);var x=w},80587:function(e,t,a){function l(e,t=2){return"number"!==typeof e?null:e.toFixed(t).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,")}function n(e,t){function a(e){const t=["日","一","二","三","四","五","六"];return t[parseInt(e,10)-1]}const l=1===t?"":t,n=e.split(" "),o=n[0],r=n[1],i=n[2],s=n[3],c=n[4],d=n[5];let u="";if("*"!==s&&"*"!==c)u+=`每${l}年 ${c} 月 ${s} 日 ${i} 時 ${r} 分 ${o} 秒`;else if("*"!==d){const e=d.split("#")[1];u+=e?`每${l}月第 ${e} 個 週${a(e)} ${i} 時 ${r} 分 ${o} 秒`:`每${l}週 ${a(d)} ${i} 時 ${r} 分 ${o} 秒`}else"*"!==s&&"*"===c?u+=`每${l}月 第 ${s} 天 ${i} 時 ${r} 分 ${o} 秒`:"*"!==o&&"*"!==r&&"*"!==i&&(u+=`每${l}日 ${i} 時 ${r} 分 ${o} 秒`);return u}function o(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),l=Math.floor(e%3600%60),n=t<10?"0"+t:t,o=a<10?"0"+a:a,r=l<10?"0"+l:l;return`${n}:${o}:${r}`}a.d(t,{Op:function(){return n},Vy:function(){return o},s_:function(){return l}})},82958:function(e,t,a){a.d(t,{J:function(){return c}});var l=a(79841),n=a(20641),o=a(92317),r=a(75220);const i=(0,l.KR)((0,o.Gq)("permission")||{}),s=()=>{i.value=(0,o.Gq)("permission")||{}};"undefined"!==typeof window&&window.addEventListener("storage",(e=>{"permission"===e.key&&s()}));function c(e){const{name:t}=(0,r.lq)();let a="";a=e||t;const o=(0,l.Kh)({read:!1,create:!1,update:!1,delete:!1}),s=()=>{const e=i.value,t=e?.[a]||[];o.read=t.includes("r"),o.create=t.includes("c"),o.update=t.includes("u"),o.delete=t.includes("d")};return s(),(0,n.wB)(i,s,{deep:!0}),{permission:o}}},87958:function(e,t,a){a.r(t),a.d(t,{default:function(){return w}});a(18111),a(61701);var l=a(20641),n=a(72644);const o={style:{display:"flex","justify-content":"end"}};function r(e,t,a,r,i,s){const c=(0,l.g2)("sdPageHeader"),d=(0,l.g2)("a-input"),u=(0,l.g2)("a-form-item"),p=(0,l.g2)("sdButton"),m=(0,l.g2)("a-form"),g=(0,l.g2)("sdModal"),f=(0,l.g2)("commonSearch"),b=(0,l.g2)("TagFilter"),h=(0,l.g2)("a-spin"),y=(0,l.g2)("a-button"),v=(0,l.g2)("sdCards"),k=(0,l.g2)("DataTables"),S=(0,l.g2)("Main");return(0,l.uX)(),(0,l.CE)("div",null,[(0,l.bF)(c,{title:"運轉時數",class:"ninjadash-page-header-main",routes:[{breadcrumbName:"數據中心"},{breadcrumbName:"運轉時數"}]}),(0,l.bF)(S,null,{default:(0,l.k6)((()=>[e.addSearchModal?((0,l.uX)(),(0,l.Wv)(g,{key:0,visible:e.addSearchModal,title:"新增常用搜尋",onCancel:e.closeAddSearchModal},{default:(0,l.k6)((()=>[(0,l.bF)(m,{model:e.addSearchFormState,labelAlign:"left"},{default:(0,l.k6)((()=>[(0,l.bF)(u,{label:"名稱",labelCol:{lg:4,xs:24},wrapperCol:{lg:20,xs:24}},{default:(0,l.k6)((()=>[(0,l.bF)(d,{value:e.addSearchFormState.name,"onUpdate:value":t[0]||(t[0]=t=>e.addSearchFormState.name=t)},null,8,["value"])])),_:1}),(0,l.Lk)("div",o,[(0,l.bF)(p,{type:"primary",onClick:e.addSearch},{default:(0,l.k6)((()=>[(0,l.eW)(" 儲存 ")])),_:1},8,["onClick"])])])),_:1},8,["model"])])),_:1},8,["visible","onCancel"])):(0,l.Q3)("",!0),(0,l.bF)(f,{sourceData:e.commonSearchList,deleteFunc:e.deleteCommonSearch,loading:e.loading,onSubmit:e.useSearch},null,8,["sourceData","deleteFunc","loading","onSubmit"]),(0,l.bF)(v,{title:"條件篩選"},{default:(0,l.k6)((()=>[(0,l.bF)(m,{model:e.formState,"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,l.k6)((()=>[(0,l.bF)(u,{label:"測點列表"},{default:(0,l.k6)((()=>[(0,l.bF)(b,{selectedTags:e.formState.tags.map((e=>e.id)),onSetTags:e.setTags},null,8,["selectedTags","onSetTags"])])),_:1})])),_:1},8,["model","label-col","wrapper-col"]),(0,l.bF)(p,{class:"act-btn",type:"primary",disabled:!e.submitable||e.loading,onClick:e.submit},{default:(0,l.k6)((()=>[(0,l.eW)((0,n.v_)(e.searching?"查詢中..":"查詢")+" ",1),e.searching?((0,l.uX)(),(0,l.Wv)(h,{key:0,size:"small"})):(0,l.Q3)("",!0)])),_:1},8,["disabled","onClick"]),(0,l.bF)(y,{type:"primary",ghost:"",style:{"margin-left":"1rem",height:"44px"},onClick:e.openAddSearchModal},{default:(0,l.k6)((()=>[(0,l.eW)(" 加入常用搜尋 ")])),_:1},8,["onClick"])])),_:1}),e.showTable?((0,l.uX)(),(0,l.Wv)(v,{key:1,title:"搜尋結果"},{default:(0,l.k6)((()=>[e.searching?((0,l.uX)(),(0,l.Wv)(h,{key:0})):(0,l.Q3)("",!0),(0,l.bF)(k,{filterOption:!0,filterOnchange:!0,tableData:e.data,columns:e.columns,rowSelection:!1,addOption:!1,exportOption:!0,handleDataSearch:e.search},null,8,["tableData","columns","handleDataSearch"])])),_:1})):(0,l.Q3)("",!0)])),_:1})])}a(1532);var i=a(30995),s=a(79841),c=a(40834),d=a(10161),u=a(95943),p=a(68237),m=a(79570),g=a(80587),f=a(82958),b=a(63260),h=a(74353),y=a.n(h),v=a(82077),k=(0,l.pM)({components:{Main:m.gZ,DataTables:d.A,TagFilter:u.A,GroupFilter:p.A,CommonSearch:b.A},setup(){const{permission:e}=(0,f.J)(),{state:t,dispatch:a}=(0,c.Pj)(),n=(0,l.EW)((()=>t.database.loading));(0,l.sV)((async()=>{await a("database/getRuntimeCommonSearch")}));const o=(0,l.EW)((()=>t.database.runtimeCommonSearchList)),r=(0,s.KR)(!1),d=(0,s.Kh)({name:""}),u=()=>{r.value=!0},p=()=>{r.value=!1},b=async()=>{try{let e=Object.assign({},w);Object.assign(e,d),await a("database/addRuntimeCommonSearch",JSON.stringify(e)),r.value=!1,i.A.success({title:"新增成功"})}catch(e){i.A.error({title:"發生錯誤",content:e.message})}},h=async e=>{await a("database/deleteRuntimeCommonSearch",e)},k=e=>{w.tags=e.tags},S={lg:2,md:9,xs:24},C={lg:6,md:15,xs:24},w=(0,s.Kh)({tags:[]}),x=e=>{w.tags=e},F=(0,l.EW)((()=>0!==w.tags.length)),_=(0,s.KR)(!1),A=(0,s.KR)(!1),L=(0,l.EW)((()=>{const a=t.database.runtimeTableData.map((t=>({...t,description:(0,v.MF)(t.TagId,"Description"),resetTime:y()(t.ResetTime).format("YYYY-MM-DD HH:mm:ss"),value:(0,g.Vy)(t.AccumulateSeconds),action:(0,l.bF)(m.J9,null,{default:()=>[e.update?(0,l.bF)("span",{onClick:()=>O(t.TagId)},[(0,l.bF)((0,l.g2)("unicon"),{name:"redo"},null)]):null]})})));return a})),W=[{title:"名稱",dataIndex:"TagName",key:"TagName",sorter:(e,t)=>e.TagName.localeCompare(t.TagName)},{title:"描述",dataIndex:"description",key:"description",sorter:(e,t)=>e.description.localeCompare(t.description)},{title:"上次重置時間",dataIndex:"resetTime",key:"resetTime"},{title:"運轉時數",dataIndex:"value",key:"value",align:"right",sorter:(e,t)=>e.AccumulateSeconds-t.AccumulateSeconds},{title:"重置",dataIndex:"action",key:"action"}],O=async e=>{i.A.confirm({title:"確認重置?",okText:"確認",cancelText:"取消",confirmLoading:n.value,onOk:async()=>{try{await a("database/resetRuntime",e),i.A.success({content:"重置成功"})}catch(t){i.A.error({title:"發生錯誤",content:t.message})}$()}})},$=async()=>{try{_.value=!0,await a("database/getRuntimeData",w),_.value=!1,A.value=!0}catch(e){_.value=!1,i.A.error({title:"發生錯誤",content:e.message})}},T=e=>{a("database/filterRuntimeTable",e.target.value)};return{commonSearchList:o,addSearchModal:r,addSearchFormState:d,openAddSearchModal:u,closeAddSearchModal:p,addSearch:b,deleteCommonSearch:h,useSearch:k,permission:e,labelCol:S,wrapperCol:C,formState:w,setTags:x,submitable:F,searching:_,showTable:A,data:L,loading:n,columns:W,submit:$,search:T}}}),S=a(66262);const C=(0,S.A)(k,[["render",r]]);var w=C}}]);