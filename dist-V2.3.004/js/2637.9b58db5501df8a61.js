"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[2637],{10161:function(e,t,a){a.d(t,{A:function(){return h}});var l=a(20641),n=a(72644);const o={class:"ninjadash-datatable-filter"},r={key:0,class:"ninjadash-datatable-filter__right"},s={class:"ninjadasj-datatable"};function i(e,t,a,i,u,d){const c=(0,l.g2)("sdButton"),p=(0,l.g2)("a-space"),m=(0,l.g2)("unicon"),g=(0,l.g2)("a-input"),f=(0,l.g2)("a-button"),y=(0,l.g2)("a-col"),h=(0,l.g2)("a-row"),b=(0,l.g2)("a-table"),v=(0,l.g2)("TableWrapper"),k=(0,l.g2)("DataTableStyleWrap");return(0,l.uX)(),(0,l.Wv)(k,null,{default:(0,l.k6)((()=>[(0,l.Lk)("div",o,[(0,l.Lk)("div",null,[(0,l.bF)(p,null,{default:(0,l.k6)((()=>[e.addOption?((0,l.uX)(),(0,l.Wv)(c,{key:0,class:"act-btn",type:"primary",onClick:e.handleAdd},{default:(0,l.k6)((()=>[(0,l.eW)(" 新增 ")])),_:1},8,["onClick"])):(0,l.Q3)("",!0),e.backOption?((0,l.uX)(),(0,l.Wv)(c,{key:1,size:"default",outlined:!0,type:"primary",onClick:e.handleBack},{default:(0,l.k6)((()=>[(0,l.eW)(" 回上層 "+(0,n.v_)(e.backTitle),1)])),_:1},8,["onClick"])):(0,l.Q3)("",!0)])),_:1})]),e.filterOption?((0,l.uX)(),(0,l.CE)("div",r,[(0,l.bF)(g,{onChange:e.handleDataSearch,size:"default",placeholder:"搜尋"},{prefix:(0,l.k6)((()=>[(0,l.bF)(m,{name:"search"})])),_:1},8,["onChange"])])):(0,l.Q3)("",!0)]),(0,l.bF)(h,{align:"end"},{default:(0,l.k6)((()=>[e.importOption?((0,l.uX)(),(0,l.Wv)(y,{key:0,style:{"margin-bottom":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(f,{type:"primary",ghost:"",onClick:e.handleImport},{default:(0,l.k6)((()=>[(0,l.eW)("匯入")])),_:1},8,["onClick"])])),_:1})):(0,l.Q3)("",!0),e.exportOption?((0,l.uX)(),(0,l.Wv)(y,{key:1,style:{"margin-bottom":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(f,{type:"primary",ghost:"",onClick:e.handleExport},{default:(0,l.k6)((()=>[(0,l.eW)("匯出Excel")])),_:1},8,["onClick"])])),_:1})):(0,l.Q3)("",!0)])),_:1}),(0,l.Lk)("div",s,[(0,l.bF)(v,{class:"table-data-view table-responsive"},{default:(0,l.k6)((()=>[e.rowSelection?((0,l.uX)(),(0,l.Wv)(b,{key:0,class:"ant-table-striped","row-selection":e.rowSelections,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},childrenColumnName:e.childrenColumnName,"row-class-name":e.getRowClassName,"data-source":e.tableData,columns:e.columns,onChange:e.changePageSize},null,8,["row-selection","pagination","childrenColumnName","row-class-name","data-source","columns","onChange"])):((0,l.uX)(),(0,l.Wv)(b,{key:1,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},class:"ant-table-striped",childrenColumnName:e.childrenColumnName,"data-source":e.tableData,"row-class-name":e.getRowClassName,columns:e.columns,onChange:e.changePageSize},null,8,["pagination","childrenColumnName","data-source","row-class-name","columns","onChange"]))])),_:1})])])),_:1})}var u=a(79841),d=a(19732),c=a(95853);const p=c.Ay.div`
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
`;var m=a(79570),g=(0,l.pM)({components:{DataTableStyleWrap:p,TableWrapper:m.AC},props:{filterOption:d.Ay.bool,filterOnchange:d.Ay.bool,rowSelection:d.Ay.bool,defaultSelected:d.Ay.array,tableData:d.Ay.array,columns:d.Ay.array,handleDataSearch:d.Ay.func,handleAdd:d.Ay.func,handleBack:d.Ay.func,handleImport:d.Ay.func,handleExport:d.Ay.func,rowClassFunc:{type:Function,default:()=>{}},backOption:{type:Boolean,default:!1},addOption:{type:Boolean,default:!1},exportOption:{type:Boolean,default:!1},importOption:{type:Boolean,default:!1},expandedRow:{type:Object,default:null},childrenColumnName:{type:String,default:"children"},backTitle:{type:String,default:""}},setup(e,{emit:t}){const a=(0,u.KR)([]);(0,l.wB)((()=>e.defaultSelected),(e=>{a.value=e}),{immediate:!0});const n=e=>{a.value=e,t("onSelectChange",a.value)},o=(0,l.EW)((()=>({selectedRowKeys:(0,u.R1)(a),onChange:n,hideDefaultSelections:!0}))),r=(0,u.KR)(10),s=(0,u.KR)(["10","20","50","100"]),i=e=>{r.value=e.pageSize},d=({record:t})=>e.expandedRow.innerDataProp?t[e.expandedRow.innerDataProp]:t.children,c=(t,a)=>e.rowClassFunc(t)??a%2===1?"table-striped row-style":"row-style";return{pageSize:r,pageSizeOptions:s,rowSelections:o,changePageSize:i,getInnerData:d,getRowClassName:c}}}),f=a(66262);const y=(0,f.A)(g,[["render",i],["__scopeId","data-v-1b881e36"]]);var h=y},42637:function(e,t,a){a.r(t),a.d(t,{default:function(){return k}});a(18111),a(61701);var l=a(20641),n=a(72644);function o(e,t,a,o,r,s){const i=(0,l.g2)("sdPageHeader"),u=(0,l.g2)("TagFilter"),d=(0,l.g2)("a-form-item"),c=(0,l.g2)("a-range-picker"),p=(0,l.g2)("PeriodSelect"),m=(0,l.g2)("a-form"),g=(0,l.g2)("a-spin"),f=(0,l.g2)("sdButton"),y=(0,l.g2)("sdCards"),h=(0,l.g2)("DataTables"),b=(0,l.g2)("Main"),v=(0,l.gN)("permission");return(0,l.uX)(),(0,l.CE)("div",null,[(0,l.bF)(i,{title:"歷史警報",class:"ninjadash-page-header-main",routes:[{breadcrumbName:"警報系統"},{breadcrumbName:"歷史警報"}]}),(0,l.bF)(b,null,{default:(0,l.k6)((()=>[(0,l.bF)(y,null,{default:(0,l.k6)((()=>[(0,l.bF)(m,{model:e.formState,"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,l.k6)((()=>[1===e.formState.searchType?((0,l.uX)(),(0,l.Wv)(d,{key:0,label:"測點列表"},{default:(0,l.k6)((()=>[(0,l.bF)(u,{selectedTags:e.formState.tags.map((e=>e.id)),onSetTags:e.setTags},null,8,["selectedTags","onSetTags"])])),_:1})):(0,l.Q3)("",!0),(0,l.bF)(d,{label:"時間"},{default:(0,l.k6)((()=>[(0,l.bF)(c,{value:e.formState.date,"onUpdate:value":t[0]||(t[0]=t=>e.formState.date=t),bordered:!1},null,8,["value"]),(0,l.bF)(p,{onSetDate:e.setDate},null,8,["onSetDate"])])),_:1})])),_:1},8,["model","label-col","wrapper-col"]),(0,l.bo)(((0,l.uX)(),(0,l.Wv)(f,{class:"act-btn",type:"primary",disabled:!e.sumitable,onClick:e.submit},{default:(0,l.k6)((()=>[(0,l.eW)((0,n.v_)(e.searching?"查詢中..":"查詢")+" ",1),e.searching?((0,l.uX)(),(0,l.Wv)(g,{key:0,size:"small"})):(0,l.Q3)("",!0)])),_:1},8,["disabled","onClick"])),[[v,"read"]])])),_:1}),(0,l.bF)(y,null,{default:(0,l.k6)((()=>[e.searching?((0,l.uX)(),(0,l.Wv)(g,{key:0})):(0,l.Q3)("",!0),e.showTable?((0,l.uX)(),(0,l.Wv)(h,{key:1,filterOption:!0,filterOnchange:!0,tableData:e.tableData,columns:e.columns,rowSelection:!1,exportOption:e.permission.read,handleDataSearch:e.search},null,8,["tableData","columns","exportOption","handleDataSearch"])):(0,l.Q3)("",!0)])),_:1})])),_:1})])}a(1532);var r=a(30995),s=a(79570),i=a(79841),u=a(10161),d=a(40834),c=a(95943),p=a(68237),m=a(74353),g=a.n(m),f=a(95804),y=a(82958),h=(0,l.pM)({components:{Main:s.gZ,DataTables:u.A,GroupFilter:p.A,TagFilter:c.A,PeriodSelect:f.A},setup(){const{state:e,dispatch:t}=(0,d.Pj)(),{permission:a}=(0,y.J)(),n=(0,l.EW)((()=>e.alarm.loading));(0,l.sV)((async()=>{const e=await t("alarm/getHistoryOptions");u.value=e.searchType,e.searchType&&e.searchType.length>0&&(c.searchType=e.searchType[0].Id??e.searchType[0].value??e.searchType[0].Value??e.searchType[0])}));const o={lg:2,md:9,xs:24},s={lg:5,md:15,xs:24},u=(0,i.KR)([]),c=(0,i.Kh)({searchType:null,tags:[],groups:[],date:null}),p=({startTime:e,endTime:t})=>{c.date=[g()(e),g()(t)]};(0,l.wB)((()=>c.searchType),(()=>{c.tags=[],c.groups=[]}));const m=e=>{c.tags=e},f=e=>{c.groups=e},h=(0,l.EW)((()=>!v.value)),b=async()=>{try{k.value=!1,v.value=!0,await t("alarm/fetchAlarmHistory",c),v.value=!1,k.value=!0}catch(e){v.value=!1,r.A.error({title:"發生錯誤",content:e.message})}},v=(0,i.KR)(!1),k=(0,i.KR)(!1),C=[{title:"時間",dataIndex:"AlarmTime",key:"AlarmTime"},{title:"測點",dataIndex:"FullTagName",key:"FullTagName"},{title:"測點說明",dataIndex:"TagDescription",key:"TagDescription"},{title:"測點類型",dataIndex:"TagTypeText",key:"TagTypeText"},{title:"警報狀態",dataIndex:"AlarmStateText",key:"AlarmStateText"},{title:"警報等級",dataIndex:"AlarmPriorityText",key:"AlarmPriorityText"},{title:"測點值",dataIndex:"TagValue",key:"TagValue",align:"right"}],w=(0,l.EW)((()=>e.alarm.historyTableData.map((e=>({...e,AlarmTime:g()(e.AlarmTime).format("YYYY-MM-DD HH:mm:ss")}))))),S=e=>{t("alarm/filterAlarmHistory",e.target.value)};return{permission:a,loading:n,labelCol:o,wrapperCol:s,searchTypeOptions:u,formState:c,setDate:p,setTags:m,setGroups:f,submit:b,sumitable:h,searching:v,showTable:k,columns:C,tableData:w,search:S}}}),b=a(66262);const v=(0,b.A)(h,[["render",o]]);var k=v},64370:function(e,t,a){a.d(t,{H:function(){return n}});var l=a(20641);function n(e=".tag-filter-modal"){let t=!1,a=0,n=0,o=0,r=0,s=null,i=null;const u=()=>{const t=()=>{if(s=document.querySelector(e),s){if(i=s.querySelector(".ant-modal-header")||s.querySelector(".modal-header")||s.querySelector('[class*="header"]')||s.querySelector(".ant-modal-title")?.parentElement,!i){const e=s.querySelector(".ant-modal-content")||s.querySelector(".modal-content")||s.querySelector('[class*="content"]');if(e){const t=document.createElement("div");t.className="modal-drag-handle",t.style.cssText="\n              position: absolute;\n              top: 0;\n              left: 0;\n              right: 0;\n              height: 40px;\n              cursor: move;\n              z-index: 1000;\n              background: rgba(0,0,0,0.02);\n            ",e.style.position="relative",e.appendChild(t),i=t}}if(i){i.style.cursor="move",i.addEventListener("mousedown",d);const e=s.querySelector(".ant-modal-content")||s.querySelector(".modal-content")||s.querySelector('[class*="content"]');return e&&(e.style.position="relative",e.style.transform="translate(0, 0)"),!0}}return!1};if(t())return;const a=new MutationObserver((()=>{t()&&a.disconnect()}));a.observe(document.body,{childList:!0,subtree:!0}),setTimeout((()=>a.disconnect()),5e3)},d=e=>{if(e.target.closest(".ant-modal-close")||e.target.closest(".clear-all-btn")||e.target.closest('[class*="close"]'))return;t=!0,a=e.clientX,n=e.clientY;const l=s.querySelector(".ant-modal-content")||s.querySelector(".modal-content")||s.querySelector('[class*="content"]');if(l){const e=l.style.transform,t=e.match(/translate\(([^,]+),\s*([^)]+)\)/);t?(o=parseFloat(t[1])||0,r=parseFloat(t[2])||0):(o=0,r=0)}s.classList.add("dragging"),document.addEventListener("mousemove",c),document.addEventListener("mouseup",p),e.preventDefault(),e.stopPropagation()},c=e=>{if(!t)return;const l=e.clientX-a,i=e.clientY-n,u=o+l,d=r+i,c=s.querySelector(".ant-modal-content")||s.querySelector(".modal-content")||s.querySelector('[class*="content"]');if(c){const e=c.getBoundingClientRect(),t=window.innerWidth,a=window.innerHeight,l=t-e.width-50,n=a-e.height-50,o=100-e.width,r=-50,s=Math.max(o,Math.min(l,u)),i=Math.max(r,Math.min(n,d));c.style.transform=`translate(${s}px, ${i}px)`}},p=()=>{t&&(t=!1,s.classList.remove("dragging"),document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",p))},m=()=>{i&&i.removeEventListener("mousedown",d),document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",p)};return(0,l.sV)((()=>{u()})),(0,l.hi)((()=>{m()})),{initDrag:u,cleanup:m}}},68237:function(e,t,a){a.d(t,{A:function(){return x}});var l=a(20641),n=a(72644),o=a(9322);const r={class:"section-title"},s=["onClick"],i={key:0,class:"empty-message"},u=(0,l.Lk)("div",{class:"section-title"},"可選擇的群組",-1),d=["onClick"];function c(e,t,a,c,p,m){const g=(0,l.g2)("a-tree-select"),f=(0,l.g2)("a-form-item"),y=(0,l.g2)("a-form"),h=(0,l.g2)("a-button"),b=(0,l.g2)("unicon"),v=(0,l.g2)("SelectedList"),k=(0,l.g2)("a-col"),C=(0,l.g2)("a-spin"),w=(0,l.g2)("GroupList"),S=(0,l.g2)("a-row"),x=(0,l.g2)("a-select"),T=(0,l.g2)("sdButton"),_=(0,l.g2)("sdModal"),F=(0,l.g2)("Wrap");return(0,l.uX)(),(0,l.Wv)(F,null,{default:(0,l.k6)((()=>[(0,l.Lk)("span",null,"包含 "+(0,n.v_)(e.selectedGroups.length)+" 個群組 ",1),(0,l.Lk)("span",{class:"text-primary",onClick:t[0]||(t[0]=(...t)=>e.openModal&&e.openModal(...t))}," 選擇群組"),e.modal?((0,l.uX)(),(0,l.Wv)(_,{key:0,title:"選擇群組",visible:e.modal,maskClosable:!0,onCancel:e.closeModal,width:900,class:"tag-filter-modal"},{default:(0,l.k6)((()=>[(0,l.bF)(y,{"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,l.k6)((()=>[(0,l.bF)(f,{label:"地區",style:{"margin-top":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(g,{value:e.formState.regionId,"onUpdate:value":t[1]||(t[1]=t=>e.formState.regionId=t),style:{width:"100%"},"tree-data":e.locations,"allow-clear":"","field-names":{children:"ChildList",label:"Name",value:"Id"},placeholder:"請選擇","tree-node-filter-prop":"label"},null,8,["value","tree-data"])])),_:1}),(0,l.bF)(f,{label:"群組分類"},{default:(0,l.k6)((()=>[(0,l.bF)(g,{value:e.formState.groupClass,"onUpdate:value":t[2]||(t[2]=t=>e.formState.groupClass=t),style:{width:"100%"},"tree-data":e.groupClassOptions,"allow-clear":"","field-names":{children:"ChildList",label:"Name",value:"Id"},placeholder:"請選擇","tree-node-filter-prop":"label"},null,8,["value","tree-data"])])),_:1})])),_:1},8,["label-col","wrapper-col"]),(0,l.bF)(S,{gutter:16,style:{"margin-top":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(k,{span:12},{default:(0,l.k6)((()=>[(0,l.Lk)("div",r,[(0,l.eW)(" 已選擇的群組 ("+(0,n.v_)(e.formState.groups.length)+") ",1),e.formState.groups.length>0?((0,l.uX)(),(0,l.Wv)(h,{key:0,type:"link",size:"small",onClick:e.clearAllGroups,class:"clear-all-btn"},{default:(0,l.k6)((()=>[(0,l.eW)(" 清除全部 ")])),_:1},8,["onClick"])):(0,l.Q3)("",!0)]),(0,l.bF)(v,null,{default:(0,l.k6)((()=>[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e.formState.groups,(t=>((0,l.uX)(),(0,l.CE)("div",{key:t.value,class:"selected-item",onClick:a=>e.removeGroup(t)},[(0,l.Lk)("span",null,(0,n.v_)(t.label),1),(0,l.bF)(b,{name:"times",class:"remove-icon"})],8,s)))),128)),0===e.formState.groups.length?((0,l.uX)(),(0,l.CE)("div",i," 尚未選擇任何群組 ")):(0,l.Q3)("",!0)])),_:1})])),_:1}),(0,l.bF)(k,{span:12},{default:(0,l.k6)((()=>[u,(0,l.bF)(w,null,{default:(0,l.k6)((()=>[(0,l.bo)((0,l.bF)(C,null,null,512),[[o.aG,e.groupSearching]]),((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e.groupOptions,(t=>((0,l.uX)(),(0,l.CE)("div",{key:t.value,class:(0,n.C4)(["tag",e.isExistInSelectedGroups(t)&&"selected"]),onClick:a=>e.setGroups(t)},(0,n.v_)(t.label),11,d)))),128))])),_:1})])),_:1})])),_:1}),(0,l.bF)(x,{mode:"multiple",value:e.formState.groups,"onUpdate:value":t[3]||(t[3]=t=>e.formState.groups=t),open:!1,style:{width:"100%",display:"none"},labelInValue:!0},null,8,["value"]),(0,l.bF)(S,{gutter:[5,10],align:"center",style:{"margin-top":"1rem"}},{default:(0,l.k6)((()=>[(0,l.bF)(k,null,{default:(0,l.k6)((()=>[(0,l.bF)(T,{class:"act-btn",type:"primary",onClick:e.submit},{default:(0,l.k6)((()=>[(0,l.eW)(" 選定群組 ")])),_:1},8,["onClick"])])),_:1}),(0,l.bF)(k,null,{default:(0,l.k6)((()=>[(0,l.bF)(T,{class:"act-btn",type:"light",onClick:e.closeModal},{default:(0,l.k6)((()=>[(0,l.eW)(" 取消 ")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["visible","onCancel"])):(0,l.Q3)("",!0)])),_:1})}a(1532);var p=a(30995),m=(a(44114),a(18111),a(20116),a(61701),a(79841)),g=a(95853);const f=g.Ay.div`
   .text-primary{
       color:${({theme:e})=>e["primary-color"]};
       cursor:pointer;
   }
`,y=g.Ay.div`
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
`;var b=a(40834),v=a(18683),k=a(64370),C=(0,l.pM)({props:{selectedGroups:{type:Array,default:()=>[]},groupsValueProp:{type:String,default:"id"},groupsLabelProp:{type:String,default:"name"}},components:{GroupList:y,Wrap:f,SelectedList:h},setup(e,{emit:t}){const{dispatch:a,state:n}=(0,b.Pj)(),o=(0,m.KR)(!1);(0,k.H)(".tag-filter-modal"),(0,l.sV)((async()=>{const e=await a("group/getAllGroupsAndOptions");u.value=e.locations,c.value=e.groupClass}));const r={lg:6,md:9,xs:24},s={lg:18,md:15,xs:24},i=[{id:"1",name:"描述+名稱"},{id:"2",name:"描述"},{id:"3",name:"名稱"}],u=(0,m.KR)([]),d=(0,l.EW)((()=>{const e=[{type:"list",target:g.regionId?g.regionId:null,source:"GroupSetting.RegionListDirectLineElderList",sourceProp:"Id"},{type:"list",target:g.groupClass?g.groupClass:null,source:"GroupSetting.GroupCategoryDirectLineElderList",sourceProp:"Id"}],t=(0,v.Q8)(e,n.group.groupInitData);return t.map((e=>({value:e.Id,label:e.Name,tags:e.ContentSetting.TagList})))})),c=(0,m.KR)([]),g=(0,m.Kh)({regionId:null,groupClass:null,groups:[]}),f=e=>{const t=g.groups.find((t=>t.value===e.value));return t},y=e=>{const t=g.groups.includes(e);if(t){const t=g.groups.indexOf(e);g.groups.splice(t,1)}else g.groups.push(e)},h=e=>{const t=g.groups.findIndex((t=>t.value===e.value));t>-1&&g.groups.splice(t,1)},C=()=>{g.groups=[]},w=()=>{g.regionId=null,g.groupClass=null;const a=g.groups.map((t=>({[e.groupsValueProp]:t.value,[e.groupsLabelProp]:t.label,tags:n.group.groupInitData.find((e=>e.Id===t.value))?.ContentSetting.TagList})));t("setGroups",a),S.value=!1},S=(0,m.KR)(!1),x=()=>{g.groups=e.selectedGroups.map((e=>d.value.find((t=>t.value===e))??{value:null,label:"群組不存在"})),S.value=!0},T=()=>{g.regionId=null,g.groupClass=null,JSON.stringify(g.groups.map((e=>e.value)))!==JSON.stringify(e.selectedGroups)?p.A.confirm({title:"提示",content:"群組將不會選定，確定關閉？",onOk(){S.value=!1}}):S.value=!1};return{groupSearching:o,labelCol:r,wrapperCol:s,showNameOptions:i,locations:u,groupClassOptions:c,groupOptions:d,formState:g,isExistInSelectedGroups:f,setGroups:y,removeGroup:h,clearAllGroups:C,modal:S,openModal:x,closeModal:T,submit:w}}}),w=a(66262);const S=(0,w.A)(C,[["render",c]]);var x=S},82958:function(e,t,a){a.d(t,{J:function(){return u}});var l=a(79841),n=a(20641),o=a(92317),r=a(75220);const s=(0,l.KR)((0,o.Gq)("permission")||{}),i=()=>{s.value=(0,o.Gq)("permission")||{}};"undefined"!==typeof window&&window.addEventListener("storage",(e=>{"permission"===e.key&&i()}));function u(e){const{name:t}=(0,r.lq)();let a="";a=e||t;const o=(0,l.Kh)({read:!1,create:!1,update:!1,delete:!1}),i=()=>{const e=s.value,t=e?.[a]||[];o.read=t.includes("r"),o.create=t.includes("c"),o.update=t.includes("u"),o.delete=t.includes("d")};return i(),(0,n.wB)(s,i,{deep:!0}),{permission:o}}},95804:function(e,t,a){a.d(t,{A:function(){return s}});var l=a(20641),n=a(10984),o={__name:"Index",props:{noToday:{type:Boolean,default:!1}},emits:["setDate"],setup(e,{emit:t}){const a=e=>{const{startTime:a,endTime:l}=(0,n.I)(e);t("setDate",{startTime:a,endTime:l})};return(t,n)=>{const o=(0,l.g2)("a-button"),r=(0,l.g2)("a-space");return(0,l.uX)(),(0,l.Wv)(r,{style:{"margin-top":"0.5rem"}},{default:(0,l.k6)((()=>[e.noToday?(0,l.Q3)("",!0):((0,l.uX)(),(0,l.Wv)(o,{key:0,type:"primary",ghost:"",onClick:n[0]||(n[0]=e=>a(1))},{default:(0,l.k6)((()=>[(0,l.eW)("今日")])),_:1})),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[1]||(n[1]=e=>a(2))},{default:(0,l.k6)((()=>[(0,l.eW)("昨日")])),_:1}),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[2]||(n[2]=e=>a(3))},{default:(0,l.k6)((()=>[(0,l.eW)("本週")])),_:1}),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[3]||(n[3]=e=>a(4))},{default:(0,l.k6)((()=>[(0,l.eW)("上週")])),_:1}),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[4]||(n[4]=e=>a(5))},{default:(0,l.k6)((()=>[(0,l.eW)("本月")])),_:1}),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[5]||(n[5]=e=>a(6))},{default:(0,l.k6)((()=>[(0,l.eW)("上月")])),_:1}),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[6]||(n[6]=e=>a(7))},{default:(0,l.k6)((()=>[(0,l.eW)("今年")])),_:1}),(0,l.bF)(o,{type:"primary",ghost:"",onClick:n[7]||(n[7]=e=>a(8))},{default:(0,l.k6)((()=>[(0,l.eW)("去年")])),_:1})])),_:1})}}};const r=o;var s=r}}]);