"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[6415],{10161:function(e,t,a){a.d(t,{A:function(){return v}});var n=a(20641),l=a(72644);const o={class:"ninjadash-datatable-filter"},r={key:0,class:"ninjadash-datatable-filter__right"},i={class:"ninjadasj-datatable"};function s(e,t,a,s,c,d){const u=(0,n.g2)("sdButton"),p=(0,n.g2)("a-space"),m=(0,n.g2)("unicon"),g=(0,n.g2)("a-input"),h=(0,n.g2)("a-button"),f=(0,n.g2)("a-col"),v=(0,n.g2)("a-row"),y=(0,n.g2)("a-table"),b=(0,n.g2)("TableWrapper"),k=(0,n.g2)("DataTableStyleWrap");return(0,n.uX)(),(0,n.Wv)(k,null,{default:(0,n.k6)((()=>[(0,n.Lk)("div",o,[(0,n.Lk)("div",null,[(0,n.bF)(p,null,{default:(0,n.k6)((()=>[e.addOption?((0,n.uX)(),(0,n.Wv)(u,{key:0,class:"act-btn",type:"primary",onClick:e.handleAdd},{default:(0,n.k6)((()=>[(0,n.eW)(" 新增 ")])),_:1},8,["onClick"])):(0,n.Q3)("",!0),e.backOption?((0,n.uX)(),(0,n.Wv)(u,{key:1,size:"default",outlined:!0,type:"primary",onClick:e.handleBack},{default:(0,n.k6)((()=>[(0,n.eW)(" 回上層 "+(0,l.v_)(e.backTitle),1)])),_:1},8,["onClick"])):(0,n.Q3)("",!0)])),_:1})]),e.filterOption?((0,n.uX)(),(0,n.CE)("div",r,[(0,n.bF)(g,{onChange:e.handleDataSearch,size:"default",placeholder:"搜尋"},{prefix:(0,n.k6)((()=>[(0,n.bF)(m,{name:"search"})])),_:1},8,["onChange"])])):(0,n.Q3)("",!0)]),(0,n.bF)(v,{align:"end"},{default:(0,n.k6)((()=>[e.importOption?((0,n.uX)(),(0,n.Wv)(f,{key:0,style:{"margin-bottom":"1rem"}},{default:(0,n.k6)((()=>[(0,n.bF)(h,{type:"primary",ghost:"",onClick:e.handleImport},{default:(0,n.k6)((()=>[(0,n.eW)("匯入")])),_:1},8,["onClick"])])),_:1})):(0,n.Q3)("",!0),e.exportOption?((0,n.uX)(),(0,n.Wv)(f,{key:1,style:{"margin-bottom":"1rem"}},{default:(0,n.k6)((()=>[(0,n.bF)(h,{type:"primary",ghost:"",onClick:e.handleExport},{default:(0,n.k6)((()=>[(0,n.eW)("匯出Excel")])),_:1},8,["onClick"])])),_:1})):(0,n.Q3)("",!0)])),_:1}),(0,n.Lk)("div",i,[(0,n.bF)(b,{class:"table-data-view table-responsive"},{default:(0,n.k6)((()=>[e.rowSelection?((0,n.uX)(),(0,n.Wv)(y,{key:0,class:"ant-table-striped","row-selection":e.rowSelections,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},childrenColumnName:e.childrenColumnName,"row-class-name":e.getRowClassName,"data-source":e.tableData,columns:e.columns,onChange:e.changePageSize},null,8,["row-selection","pagination","childrenColumnName","row-class-name","data-source","columns","onChange"])):((0,n.uX)(),(0,n.Wv)(y,{key:1,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},class:"ant-table-striped",childrenColumnName:e.childrenColumnName,"data-source":e.tableData,"row-class-name":e.getRowClassName,columns:e.columns,onChange:e.changePageSize},null,8,["pagination","childrenColumnName","data-source","row-class-name","columns","onChange"]))])),_:1})])])),_:1})}var c=a(79841),d=a(19732),u=a(95853);const p=u.Ay.div`
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
`;var m=a(79570),g=(0,n.pM)({components:{DataTableStyleWrap:p,TableWrapper:m.AC},props:{filterOption:d.Ay.bool,filterOnchange:d.Ay.bool,rowSelection:d.Ay.bool,defaultSelected:d.Ay.array,tableData:d.Ay.array,columns:d.Ay.array,handleDataSearch:d.Ay.func,handleAdd:d.Ay.func,handleBack:d.Ay.func,handleImport:d.Ay.func,handleExport:d.Ay.func,rowClassFunc:{type:Function,default:()=>{}},backOption:{type:Boolean,default:!1},addOption:{type:Boolean,default:!1},exportOption:{type:Boolean,default:!1},importOption:{type:Boolean,default:!1},expandedRow:{type:Object,default:null},childrenColumnName:{type:String,default:"children"},backTitle:{type:String,default:""}},setup(e,{emit:t}){const a=(0,c.KR)([]);(0,n.wB)((()=>e.defaultSelected),(e=>{a.value=e}),{immediate:!0});const l=e=>{a.value=e,t("onSelectChange",a.value)},o=(0,n.EW)((()=>({selectedRowKeys:(0,c.R1)(a),onChange:l,hideDefaultSelections:!0}))),r=(0,c.KR)(10),i=(0,c.KR)(["10","20","50","100"]),s=e=>{r.value=e.pageSize},d=({record:t})=>e.expandedRow.innerDataProp?t[e.expandedRow.innerDataProp]:t.children,u=(t,a)=>e.rowClassFunc(t)??a%2===1?"table-striped row-style":"row-style";return{pageSize:r,pageSizeOptions:i,rowSelections:o,changePageSize:s,getInnerData:d,getRowClassName:u}}}),h=a(66262);const f=(0,h.A)(g,[["render",s],["__scopeId","data-v-1b881e36"]]);var v=f},53646:function(e,t,a){a.r(t),a.d(t,{default:function(){return y}});a(18111),a(61701);var n=a(20641),l=a(72644);function o(e,t,a,o,r,i){const s=(0,n.g2)("sdPageHeader"),c=(0,n.g2)("TagFilter"),d=(0,n.g2)("a-form-item"),u=(0,n.g2)("a-spin"),p=(0,n.g2)("sdButton"),m=(0,n.g2)("a-form"),g=(0,n.g2)("sdCards"),h=(0,n.g2)("DataTables"),f=(0,n.g2)("TableSpan"),v=(0,n.g2)("Main");return(0,n.uX)(),(0,n.CE)("div",null,[(0,n.bF)(s,{title:"即時資料",class:"ninjadash-page-header-main",routes:[{breadcrumbName:"數據中心"},{breadcrumbName:"即時資料"}]}),(0,n.bF)(v,null,{default:(0,n.k6)((()=>[(0,n.bF)(g,{title:"條件篩選"},{default:(0,n.k6)((()=>[(0,n.bF)(m,{model:e.formState,"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,n.k6)((()=>[(0,n.bF)(d,{label:"測點列表"},{default:(0,n.k6)((()=>[(0,n.bF)(c,{selectedTags:e.formState.tag.map((e=>e.id)),onSetTags:e.setTag},null,8,["selectedTags","onSetTags"])])),_:1}),(0,n.bF)(p,{class:"act-btn",type:"primary",disabled:!e.submitable||e.loading,onClick:e.submit},{default:(0,n.k6)((()=>[(0,n.eW)((0,l.v_)(e.searching?"查詢中..":"查詢")+" ",1),e.searching?((0,n.uX)(),(0,n.Wv)(u,{key:0,size:"small"})):(0,n.Q3)("",!0)])),_:1},8,["disabled","onClick"])])),_:1},8,["model","label-col","wrapper-col"])])),_:1}),e.showTable?((0,n.uX)(),(0,n.Wv)(g,{key:0,title:"搜尋結果"},{default:(0,n.k6)((()=>[e.searching?((0,n.uX)(),(0,n.Wv)(u,{key:0})):(0,n.Q3)("",!0),(0,n.bF)(f,null,{default:(0,n.k6)((()=>[e.searching?(0,n.Q3)("",!0):((0,n.uX)(),(0,n.Wv)(h,{key:0,filterOption:!0,filterOnchange:!0,tableData:e.data,columns:e.columns,rowSelection:!1,addOption:!1,handleDataSearch:e.search,rowClassFunc:e.getRowClassName},null,8,["tableData","columns","handleDataSearch","rowClassFunc"]))])),_:1})])),_:1})):(0,n.Q3)("",!0)])),_:1})])}a(1532);var r=a(30995),i=a(79841),s=a(40834),c=a(79570),d=a(95943),u=a(10161),p=a(86747),m=a(95853);m.Ay.div`
    color: ${({theme:e})=>e["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
    }
   
`,m.Ay.div`
    font-weight:bold;
`;const g=m.Ay.div`
    .text-alert{
        td{
            color:${({theme:e})=>e["error-color"]} !important;
        }
    }
    .text-disabled{
        td{
            color:${({theme:e})=>e["disabled-color"]} !important;
        }
    }
    .text-normal{
        td{
            color:${({theme:e})=>e["success-color"]} !important;
        }
    }
`;var h=(0,n.pM)({components:{Main:c.gZ,DataTables:u.A,LevelSelect:p.A,TagFilter:d.A,TableSpan:g},setup(){const{state:e,dispatch:t}=(0,s.Pj)(),a=(0,i.KR)(!1),l=(0,n.EW)((()=>e.database.loading)),o={lg:2,md:9,xs:24},c={lg:6,md:15,xs:24},d=(0,i.Kh)({tag:[]}),u=async e=>{d.tag=e},p=(0,n.EW)((()=>0!==d.tag.length)),m=(0,i.KR)(!1),g=(0,i.KR)(!1),h=(0,n.EW)((()=>{const t=e.database.realtimeTableData.map((e=>{const{name:t,unit:a,value:n,status:l}=e;return{...e,status:l,name:t,unit:a,value:n}}));return t})),f=[{title:"名稱",dataIndex:"Name",key:"Name"},{title:"測點值",dataIndex:"Value",key:"Value",align:"right"}],v=({status:e})=>"1"===e?"text-normal":"2"===e?"text-alert":"3"===e?"text-disabled":void 0,y=async()=>{try{m.value=!0,await t("database/fetchRealtimeData",(0,i.ux)(d)),m.value=!1,g.value=!0}catch(e){m.value=!1,r.A.error({title:"發生錯誤",content:e.message})}},b=e=>{t("database/filterRealtimeTable",e.target.value)};return{init:a,labelCol:o,wrapperCol:c,formState:d,setTag:u,submitable:p,searching:m,showTable:g,data:h,loading:l,columns:f,getRowClassName:v,submit:y,search:b}}}),f=a(66262);const v=(0,f.A)(h,[["render",o]]);var y=v},64370:function(e,t,a){a.d(t,{H:function(){return l}});var n=a(20641);function l(e=".tag-filter-modal"){let t=!1,a=0,l=0,o=0,r=0,i=null,s=null;const c=()=>{const t=()=>{if(i=document.querySelector(e),i){if(s=i.querySelector(".ant-modal-header")||i.querySelector(".modal-header")||i.querySelector('[class*="header"]')||i.querySelector(".ant-modal-title")?.parentElement,!s){const e=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');if(e){const t=document.createElement("div");t.className="modal-drag-handle",t.style.cssText="\n              position: absolute;\n              top: 0;\n              left: 0;\n              right: 0;\n              height: 40px;\n              cursor: move;\n              z-index: 1000;\n              background: rgba(0,0,0,0.02);\n            ",e.style.position="relative",e.appendChild(t),s=t}}if(s){s.style.cursor="move",s.addEventListener("mousedown",d);const e=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');return e&&(e.style.position="relative",e.style.transform="translate(0, 0)"),!0}}return!1};if(t())return;const a=new MutationObserver((()=>{t()&&a.disconnect()}));a.observe(document.body,{childList:!0,subtree:!0}),setTimeout((()=>a.disconnect()),5e3)},d=e=>{if(e.target.closest(".ant-modal-close")||e.target.closest(".clear-all-btn")||e.target.closest('[class*="close"]'))return;t=!0,a=e.clientX,l=e.clientY;const n=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');if(n){const e=n.style.transform,t=e.match(/translate\(([^,]+),\s*([^)]+)\)/);t?(o=parseFloat(t[1])||0,r=parseFloat(t[2])||0):(o=0,r=0)}i.classList.add("dragging"),document.addEventListener("mousemove",u),document.addEventListener("mouseup",p),e.preventDefault(),e.stopPropagation()},u=e=>{if(!t)return;const n=e.clientX-a,s=e.clientY-l,c=o+n,d=r+s,u=i.querySelector(".ant-modal-content")||i.querySelector(".modal-content")||i.querySelector('[class*="content"]');if(u){const e=u.getBoundingClientRect(),t=window.innerWidth,a=window.innerHeight,n=t-e.width-50,l=a-e.height-50,o=100-e.width,r=-50,i=Math.max(o,Math.min(n,c)),s=Math.max(r,Math.min(l,d));u.style.transform=`translate(${i}px, ${s}px)`}},p=()=>{t&&(t=!1,i.classList.remove("dragging"),document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",p))},m=()=>{s&&s.removeEventListener("mousedown",d),document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",p)};return(0,n.sV)((()=>{c()})),(0,n.hi)((()=>{m()})),{initDrag:c,cleanup:m}}},86747:function(e,t,a){a.d(t,{A:function(){return p}});var n=a(20641),l=a(9322),o=a(72644);function r(e,t,a,r,i,s){const c=(0,n.g2)("a-select-option"),d=(0,n.g2)("a-select"),u=(0,n.g2)("a-space");return(0,n.uX)(),(0,n.CE)("div",null,[(0,n.bF)(u,null,{default:(0,n.k6)((()=>[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.levels,(a=>((0,n.uX)(),(0,n.Wv)(d,{value:e.selected[a],"onUpdate:value":t=>e.selected[a]=t,key:a,style:{width:"100%","min-width":"100px"},onChange:t=>e.handleChange(a)},{default:(0,n.k6)((()=>[e.nullOption?((0,n.uX)(),(0,n.Wv)(c,{key:0,value:null,onClick:t[0]||(t[0]=(0,l.D$)((()=>{}),["stop"]))},{default:(0,n.k6)((()=>[(0,n.eW)("無")])),_:1})):(0,n.Q3)("",!0),((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.getNextLevel(a),((a,r)=>((0,n.uX)(),(0,n.Wv)(c,{value:JSON.stringify(a),key:r,onClick:t[1]||(t[1]=(0,l.D$)((()=>{}),["stop"]))},{default:(0,n.k6)((()=>[(0,n.eW)((0,o.v_)(a[e.childName]),1)])),_:2},1032,["value"])))),128))])),_:2},1032,["value","onUpdate:value","onChange"])))),128))])),_:1})])}a(44114);var i=a(79841),s=a(19732),c=(0,n.pM)({name:"LevelSelect",props:{selectedValue:{type:Object,default:null},group:s.Ay.array,nullOption:{type:Boolean,default:!1},childName:{type:String,default:"name"},childProp:{type:String,default:"children"}},setup(e,{emit:t}){const a=(0,i.KR)(e.selectedValue||{}),l=(0,i.KR)(e.selectedValue?Array.from(Array(Object.keys(e.selectedValue).length).keys()):[0]),o=(0,n.EW)((()=>e.group?e.group:[])),r=t=>{if(0===t)return o.value;const n=l.value[t-1],r=JSON.parse(a.value[n]);return r&&r[e.childProp]&&r[e.childProp].length>0?r[e.childProp]:[]},s=n=>{const o=l.value.indexOf(n);for(let e=o+1;e<l.value.length;e++)delete a.value[e];if(l.value.splice(o+1,l.value.length-(o+1)),a.value[n]){t("change",JSON.parse(a.value[l.value.length-1]),a.value);const o=JSON.parse(a.value[n]);o[e.childProp]&&l.value.push(n+1)}else{const e=l.value.length>1?a.value[l.value.length-2]:null;t("change",JSON.parse(e),a.value)}};return{selected:a,levels:l,getNextLevel:r,handleChange:s}}}),d=a(66262);const u=(0,d.A)(c,[["render",r]]);var p=u}}]);