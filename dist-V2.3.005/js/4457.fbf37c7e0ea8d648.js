"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[4457],{10161:function(e,a,t){t.d(a,{A:function(){return f}});var n=t(20641),l=t(72644);const i={class:"ninjadash-datatable-filter"},o={key:0,class:"ninjadash-datatable-filter__right"},s={class:"ninjadasj-datatable"};function r(e,a,t,r,d,c){const u=(0,n.g2)("sdButton"),p=(0,n.g2)("a-space"),g=(0,n.g2)("unicon"),m=(0,n.g2)("a-input"),h=(0,n.g2)("a-button"),b=(0,n.g2)("a-col"),f=(0,n.g2)("a-row"),y=(0,n.g2)("a-table"),k=(0,n.g2)("TableWrapper"),w=(0,n.g2)("DataTableStyleWrap");return(0,n.uX)(),(0,n.Wv)(w,null,{default:(0,n.k6)((()=>[(0,n.Lk)("div",i,[(0,n.Lk)("div",null,[(0,n.bF)(p,null,{default:(0,n.k6)((()=>[e.addOption?((0,n.uX)(),(0,n.Wv)(u,{key:0,class:"act-btn",type:"primary",onClick:e.handleAdd},{default:(0,n.k6)((()=>[(0,n.eW)(" 新增 ")])),_:1},8,["onClick"])):(0,n.Q3)("",!0),e.backOption?((0,n.uX)(),(0,n.Wv)(u,{key:1,size:"default",outlined:!0,type:"primary",onClick:e.handleBack},{default:(0,n.k6)((()=>[(0,n.eW)(" 回上層 "+(0,l.v_)(e.backTitle),1)])),_:1},8,["onClick"])):(0,n.Q3)("",!0)])),_:1})]),e.filterOption?((0,n.uX)(),(0,n.CE)("div",o,[(0,n.bF)(m,{onChange:e.handleDataSearch,size:"default",placeholder:"搜尋"},{prefix:(0,n.k6)((()=>[(0,n.bF)(g,{name:"search"})])),_:1},8,["onChange"])])):(0,n.Q3)("",!0)]),(0,n.bF)(f,{align:"end"},{default:(0,n.k6)((()=>[e.importOption?((0,n.uX)(),(0,n.Wv)(b,{key:0,style:{"margin-bottom":"1rem"}},{default:(0,n.k6)((()=>[(0,n.bF)(h,{type:"primary",ghost:"",onClick:e.handleImport},{default:(0,n.k6)((()=>[(0,n.eW)("匯入")])),_:1},8,["onClick"])])),_:1})):(0,n.Q3)("",!0),e.exportOption?((0,n.uX)(),(0,n.Wv)(b,{key:1,style:{"margin-bottom":"1rem"}},{default:(0,n.k6)((()=>[(0,n.bF)(h,{type:"primary",ghost:"",onClick:e.handleExport},{default:(0,n.k6)((()=>[(0,n.eW)("匯出Excel")])),_:1},8,["onClick"])])),_:1})):(0,n.Q3)("",!0)])),_:1}),(0,n.Lk)("div",s,[(0,n.bF)(k,{class:"table-data-view table-responsive"},{default:(0,n.k6)((()=>[e.rowSelection?((0,n.uX)(),(0,n.Wv)(y,{key:0,class:"ant-table-striped","row-selection":e.rowSelections,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},childrenColumnName:e.childrenColumnName,"row-class-name":e.getRowClassName,"data-source":e.tableData,columns:e.columns,onChange:e.changePageSize},null,8,["row-selection","pagination","childrenColumnName","row-class-name","data-source","columns","onChange"])):((0,n.uX)(),(0,n.Wv)(y,{key:1,pagination:{pageSize:e.pageSize,pageSizeOptions:e.pageSizeOptions,showSizeChanger:!0},class:"ant-table-striped",childrenColumnName:e.childrenColumnName,"data-source":e.tableData,"row-class-name":e.getRowClassName,columns:e.columns,onChange:e.changePageSize},null,8,["pagination","childrenColumnName","data-source","row-class-name","columns","onChange"]))])),_:1})])])),_:1})}var d=t(79841),c=t(19732),u=t(95853);const p=u.Ay.div`
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
`;var g=t(79570),m=(0,n.pM)({components:{DataTableStyleWrap:p,TableWrapper:g.AC},props:{filterOption:c.Ay.bool,filterOnchange:c.Ay.bool,rowSelection:c.Ay.bool,defaultSelected:c.Ay.array,tableData:c.Ay.array,columns:c.Ay.array,handleDataSearch:c.Ay.func,handleAdd:c.Ay.func,handleBack:c.Ay.func,handleImport:c.Ay.func,handleExport:c.Ay.func,rowClassFunc:{type:Function,default:()=>{}},backOption:{type:Boolean,default:!1},addOption:{type:Boolean,default:!1},exportOption:{type:Boolean,default:!1},importOption:{type:Boolean,default:!1},expandedRow:{type:Object,default:null},childrenColumnName:{type:String,default:"children"},backTitle:{type:String,default:""}},setup(e,{emit:a}){const t=(0,d.KR)([]);(0,n.wB)((()=>e.defaultSelected),(e=>{t.value=e}),{immediate:!0});const l=e=>{t.value=e,a("onSelectChange",t.value)},i=(0,n.EW)((()=>({selectedRowKeys:(0,d.R1)(t),onChange:l,hideDefaultSelections:!0}))),o=(0,d.KR)(10),s=(0,d.KR)(["10","20","50","100"]),r=e=>{o.value=e.pageSize},c=({record:a})=>e.expandedRow.innerDataProp?a[e.expandedRow.innerDataProp]:a.children,u=(a,t)=>e.rowClassFunc(a)??t%2===1?"table-striped row-style":"row-style";return{pageSize:o,pageSizeOptions:s,rowSelections:i,changePageSize:r,getInnerData:c,getRowClassName:u}}}),h=t(66262);const b=(0,h.A)(m,[["render",r],["__scopeId","data-v-1b881e36"]]);var f=b},75126:function(e,a,t){t(16859)},82958:function(e,a,t){t.d(a,{J:function(){return d}});var n=t(79841),l=t(20641),i=t(92317),o=t(75220);const s=(0,n.KR)((0,i.Gq)("permission")||{}),r=()=>{s.value=(0,i.Gq)("permission")||{}};"undefined"!==typeof window&&window.addEventListener("storage",(e=>{"permission"===e.key&&r()}));function d(e){const{name:a}=(0,o.lq)();let t="";t=e||a;const i=(0,n.Kh)({read:!1,create:!1,update:!1,delete:!1}),r=()=>{const e=s.value,a=e?.[t]||[];i.read=a.includes("r"),i.create=a.includes("c"),i.update=a.includes("u"),i.delete=a.includes("d")};return r(),(0,l.wB)(s,r,{deep:!0}),{permission:i}}},96838:function(e,a,t){t.r(a),t.d(a,{default:function(){return w}});var n=t(20641),l=t(9322);function i(e,a,t,i,o,s){const r=(0,n.g2)("a-input"),d=(0,n.g2)("a-form-item"),c=(0,n.g2)("a-spin"),u=(0,n.g2)("sdButton"),p=(0,n.g2)("a-col"),g=(0,n.g2)("a-row"),m=(0,n.g2)("a-form"),h=(0,n.g2)("ModalWrap"),b=(0,n.g2)("sdModal"),f=(0,n.g2)("sdPageHeader"),y=(0,n.g2)("DataTables"),k=(0,n.g2)("sdCards"),w=(0,n.g2)("Main");return(0,n.uX)(),(0,n.CE)("div",null,[e.modal?((0,n.uX)(),(0,n.Wv)(b,{key:0,title:e.formState.title,visible:e.modal,onCancel:e.closeModal},{default:(0,n.k6)((()=>[(0,n.bF)(h,null,{default:(0,n.k6)((()=>[(0,n.bF)(m,{model:e.formState,"label-col":e.labelCol,"wrapper-col":e.wrapperCol,rules:e.rules,labelAlign:"left",onFinish:e.submit},{default:(0,n.k6)((()=>[(0,n.bF)(d,{label:"名稱",name:"name"},{default:(0,n.k6)((()=>[(0,n.bF)(r,{value:e.formState.name,"onUpdate:value":a[0]||(a[0]=a=>e.formState.name=a),placeholder:"名稱"},null,8,["value"])])),_:1}),(0,n.bF)(g,null,{default:(0,n.k6)((()=>[(0,n.bF)(p,{lg:{span:16,offset:8},md:{span:15,offset:9},xs:{span:24,offset:0}},{default:(0,n.k6)((()=>[(0,n.Lk)("div",null,[(0,n.bF)(u,{class:"act-btn",type:"primary","html-type":"submit"},{default:(0,n.k6)((()=>[(0,n.eW)(" 儲存 "),(0,n.bo)((0,n.bF)(c,{size:"small"},null,512),[[l.aG,e.loading]])])),_:1}),(0,n.bF)(u,{class:"act-btn",type:"light",onClick:(0,l.D$)(e.closeModal,["prevent"])},{default:(0,n.k6)((()=>[(0,n.eW)(" 取消 ")])),_:1},8,["onClick"])])])),_:1})])),_:1})])),_:1},8,["model","label-col","wrapper-col","rules","onFinish"])])),_:1})])),_:1},8,["title","visible","onCancel"])):(0,n.Q3)("",!0),(0,n.bF)(f,{title:"地區",class:"ninjadash-page-header-main",routes:[{breadcrumbName:"測點"},{breadcrumbName:"地區"}]}),(0,n.bF)(w,null,{default:(0,n.k6)((()=>[(0,n.bF)(k,{title:"地區列表"},{default:(0,n.k6)((()=>[e.loading?((0,n.uX)(),(0,n.Wv)(c,{key:0})):(0,n.Q3)("",!0),e.loading?(0,n.Q3)("",!0):((0,n.uX)(),(0,n.Wv)(y,{key:1,filterOption:!0,filterOnchange:!0,tableData:e.tableData,columns:e.columns,rowSelection:!1,addOption:e.permission.create,backOption:e.isChild,handleAdd:e.openAddModal,handleDataSearch:e.search,handleBack:e.goBack,backTitle:e.backTitle},null,8,["tableData","columns","addOption","backOption","handleAdd","handleDataSearch","handleBack","backTitle"]))])),_:1})])),_:1})])}t(75126);var o=t(56427),s=(t(1532),t(30995)),r=(t(18111),t(61701),t(40834)),d=t(79570),c=t(79841),u=t(95853);const p=u.Ay.div`
    color: ${({theme:e})=>e["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
    }
   
`,g=u.Ay.div`
    display:flex;
    justify-content:end;
    svg{
       height:20px;
       cursor:pointer;
       margin:0 5px;
    }
`,m=u.Ay.div`
    .act-btn{
        margin:0 5px;
    }
`;var h=t(10161),b=t(82958),f=(0,n.pM)({components:{Main:d.gZ,ChildSpan:p,ActionSpan:g,ModalWrap:m,DataTables:h.A},setup(){const{permission:e}=(0,b.J)(),a=(0,n.EW)((()=>l.tags.loading)),{dispatch:t,state:l}=(0,r.Pj)();(0,n.sV)((async()=>{await t("tags/getTagsRegions")}));const i=[{title:"名稱",dataIndex:"name",key:"name",sorter:(e,a)=>e.name.el.innerHTML.localeCompare(a.name.el.innerHTML)},{title:"操作",dataIndex:"action",key:"action"}],d=(0,n.EW)((()=>l.tags.regionURLs.length>0)),u=(0,n.EW)((()=>l.tags.regionTableData?l.tags.regionTableData.map((a=>({name:(0,n.bF)(p,{onClick:()=>f({id:a.Id,name:a.Name})},{default:()=>[a.Name]}),action:(0,n.bF)(g,null,{default:()=>[e.update&&(0,n.bF)("span",{onClick:()=>F(a)},[(0,n.bF)((0,n.g2)("unicon"),{name:"edit"},null)]),e.delete&&(0,n.bF)("span",{onClick:()=>W(a.Id)},[(0,n.bF)((0,n.g2)("unicon"),{name:"trash"},null)])]})}))):[])),m=e=>{t("tags/filterTagsRegionTable",e.target.value)},h=(0,n.EW)((()=>l.tags.regionURLs.length>0&&l.tags.regionURLs[l.tags.regionURLs.length-1].name)),f=async({id:e,name:a})=>{try{await t("tags/getTagsRegionChild",{id:e,name:a})}catch(n){s.A.error({title:"發生錯誤",content:n.message})}},y=async()=>{await t("tags/tagsRegionGoback")},k=(0,c.KR)(!1),w=(0,c.Kh)({title:null,id:null,name:null,parentId:null}),v={name:[{required:!0,message:"請輸入名稱",trigger:"blur"}]},C={lg:8,md:9,xs:24},x={lg:16,md:15,xs:24},S=()=>{k.value=!1},A=async()=>{try{let e;w.id?(await t("tags/editTagsRegion",w),e="修改成功"):(await t("tags/addTagsRegion",w),e="新增成功"),k.value=!1,o.A.success({message:e})}catch(e){s.A.error({title:"發生錯誤",content:e.message})}},_=()=>{w.title="新增地區",w.id=null,w.name="",w.parentId=l.tags.regionURLs[l.tags.regionURLs.length-1],k.value=!0},F=({Id:e,Name:a})=>{w.title="編輯地區",w.id=e,w.name=a,w.parentId=null,k.value=!0},W=e=>{s.A.confirm({title:"確認刪除?",okText:"確認",cancelText:"取消",confirmLoading:a.value,onOk:async()=>{try{await t("tags/deleteTagsRegion",e),o.A.success({message:"刪除成功"})}catch(a){s.A.error({title:"發生錯誤",content:a.message})}}})};return{backTitle:h,permission:e,loading:a,modal:k,formState:w,rules:v,submit:A,labelCol:C,wrapperCol:x,columns:i,isChild:d,tableData:u,search:m,goBack:y,closeModal:S,openAddModal:_}}}),y=t(66262);const k=(0,y.A)(f,[["render",i]]);var w=k}}]);