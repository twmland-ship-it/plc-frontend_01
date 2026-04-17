"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[251],{50251:function(e,t,a){a.r(t),a.d(t,{default:function(){return ve}});a(18111),a(18237);var i=a(20641),n=a(72644),l=a(9322);const r=e=>((0,i.Qi)("data-v-33bbea2c"),e=e(),(0,i.jt)(),e),o={class:"resize-form"},s={class:"slider-value"},d={class:"slider-value"},c={key:1},u={style:{"margin-bottom":"1rem",display:"flex","align-items":"center",gap:"16px"}},p={ref:"gridEl",class:"grid-stack"},m=["data-id","gs-x","gs-y","gs-w","gs-h"],h={class:"grid-stack-item-content chart-item"},g={class:"chart-title-with-controls"},b={class:"chart-controls"},v={class:"ninjadash-chart-container"},x={class:"chart-container"},f={class:"chart-title-with-controls"},y={class:"chart-controls"},k={class:"ninjadash-overview-wrap"},w={class:"ninjadash-overview-percentage",style:{"flex-wrap":"wrap"}},C={class:"ninjadash-overview-percentage__text"},_=r((()=>(0,i.Lk)("br",null,null,-1))),z={class:"ninjadash-overview-box align-center-v justify-content-between",style:{"flex-wrap":"wrap"}},F={class:"chart-title-with-controls"},M={class:"chart-controls"},T={class:"ninjadash-chart-container"},D={class:"chart-title-with-controls"},$={class:"chart-controls"},S={class:"ninjadash-chart-container"},W={key:0,class:"card-controls-overlay"},A={class:"chart-title-with-controls"},X={class:"quarter-circle"},R=["onClick"],L={class:"suffix-text"};function j(e,t,a,r,j,O){const Q=(0,i.g2)("sdPageHeader"),E=(0,i.g2)("ModalTable"),K=(0,i.g2)("ChartForm"),I=(0,i.g2)("sdModal"),P=(0,i.g2)("a-slider"),N=(0,i.g2)("a-form-item"),H=(0,i.g2)("a-form"),V=(0,i.g2)("a-modal"),B=(0,i.g2)("a-spin"),G=(0,i.g2)("sdButton"),Y=((0,i.g2)("a-switch"),(0,i.g2)("unicon")),q=(0,i.g2)("a-button"),J=(0,i.g2)("a-space"),U=(0,i.g2)("a-row"),Z=(0,i.g2)("Chart"),ee=(0,i.g2)("a-card"),te=(0,i.g2)("DoughnutChart"),ae=(0,i.g2)("SalesOverviewStyleWrap2"),ie=(0,i.g2)("OptimizedApexChart"),ne=(0,i.g2)("vue3-autocounter"),le=(0,i.g2)("SubContent"),re=(0,i.g2)("Main");return(0,i.uX)(),(0,i.CE)("div",null,[(0,i.bF)(Q,{title:"首頁",class:"ninjadash-page-header-main",routes:[{path:"/",breadcrumbName:"首頁"}]}),e.detailModal?((0,i.uX)(),(0,i.Wv)(E,{key:0,modal:e.detailModal,title:e.detailModalTitle,columns:e.detailColumns,tableData:e.detailTableData,closeModal:e.closeDetailModal,search:e.filterDetailTable,loading:e.loading},null,8,["modal","title","columns","tableData","closeModal","search","loading"])):(0,i.Q3)("",!0),e.chartSettingModal?((0,i.uX)(),(0,i.Wv)(I,{key:1,title:"設定圖表參數test",visible:e.chartSettingModal,onCancel:e.closeModal},{default:(0,i.k6)((()=>[(0,i.bF)(K,{sourceData:e.settingFormState,chartTypeOptions:e.chartTypeOptions,timePeriodOptions:e.timePeriodOptions,summaryTypeOptions:e.summaryTypeOptions,paramSummaryOptions:e.paramSummaryOptions,unitOptions:e.unitOptions,onSubmit:e.submitSetting},null,8,["sourceData","chartTypeOptions","timePeriodOptions","summaryTypeOptions","paramSummaryOptions","unitOptions","onSubmit"])])),_:1},8,["visible","onCancel"])):(0,i.Q3)("",!0),(0,i.bF)(V,{visible:e.resizeModalVisible,"onUpdate:visible":t[2]||(t[2]=t=>e.resizeModalVisible=t),title:"調整圖表大小",onOk:e.saveResizeSettings,onCancel:e.closeResizeModal,okText:"確定",cancelText:"取消"},{default:(0,i.k6)((()=>[(0,i.Lk)("div",o,[(0,i.bF)(H,{layout:"vertical"},{default:(0,i.k6)((()=>[(0,i.bF)(N,{label:"寬度 (列數)"},{default:(0,i.k6)((()=>[(0,i.bF)(P,{value:e.resizeForm.width,"onUpdate:value":t[0]||(t[0]=t=>e.resizeForm.width=t),min:1,max:24,marks:{1:"1列",6:"6列",12:"12列",18:"18列",24:"24列"}},null,8,["value"]),(0,i.Lk)("div",s,"目前: "+(0,n.v_)(e.resizeForm.width)+" 列",1)])),_:1}),(0,i.bF)(N,{label:"高度 (像素)"},{default:(0,i.k6)((()=>[(0,i.bF)(P,{value:e.resizeForm.height,"onUpdate:value":t[1]||(t[1]=t=>e.resizeForm.height=t),min:200,max:600,step:50,marks:{200:"200px",300:"300px",400:"400px",500:"500px",600:"600px"}},null,8,["value"]),(0,i.Lk)("div",d,"目前: "+(0,n.v_)(e.resizeForm.height)+"px",1)])),_:1})])),_:1})])])),_:1},8,["visible","onOk","onCancel"]),(0,i.bF)(re,null,{default:(0,i.k6)((()=>[e.loading&&!e.isInit?((0,i.uX)(),(0,i.Wv)(B,{key:0})):(0,i.Q3)("",!0),e.isInit?((0,i.uX)(),(0,i.CE)("div",c,[(0,i.Lk)("div",u,[e.permission.create?((0,i.uX)(),(0,i.Wv)(G,{key:0,type:"primary",onClick:e.openAddModal},{default:(0,i.k6)((()=>[(0,i.eW)(" 新增圖表 ")])),_:1},8,["onClick"])):(0,i.Q3)("",!0),(0,i.Q3)("",!0)]),(0,i.Lk)("div",p,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(e.draggableDashboardData,(t=>((0,i.uX)(),(0,i.CE)("div",{key:t.id,class:"grid-stack-item","data-id":t.id,"gs-x":e.getGridPos(t.id).x,"gs-y":e.getGridPos(t.id).y,"gs-w":e.getGridPos(t.id).w,"gs-h":e.getGridPos(t.id).h},[(0,i.Lk)("div",h,["line"===t.chartType?((0,i.uX)(),(0,i.Wv)(ee,{key:0,class:"column-content"},{title:(0,i.k6)((()=>[(0,i.Lk)("div",g,[(0,i.Lk)("span",null,(0,n.v_)(t.name),1),(0,i.Lk)("div",b,[e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:0,size:"small",type:"text",class:"drag-btn",title:"拖曳排序"},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"expand-arrows",width:"14"})])),_:1})):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:1,size:"small",type:"text",class:"resize-btn",title:"調整大小",onClick:(0,l.D$)((a=>e.openResizeModal(t)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"corner-up-right",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:2,size:"small",type:"text",class:"reset-btn",title:"恢復預設大小",onClick:(0,l.D$)((a=>e.resetChartSize(t.id)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"refresh",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])])])),extra:(0,i.k6)((()=>[(0,i.bF)(J,null,{default:(0,i.k6)((()=>[e.permission.delete?((0,i.uX)(),(0,i.Wv)(q,{key:0,ghost:"",type:"danger",onClick:(0,l.D$)((a=>e.deleteChart(t.id)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"trash"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.permission.update?((0,i.uX)(),(0,i.Wv)(q,{key:1,ghost:"",type:"primary",onClick:(0,l.D$)((a=>e.openEditModal(t)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"setting"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])),_:2},1024)])),default:(0,i.k6)((()=>[(0,i.Lk)("div",v,[(0,i.bF)(U,null,{default:(0,i.k6)((()=>[(0,i.eW)("時間: "+(0,n.v_)(t.periodText),1)])),_:2},1024),(0,i.Lk)("div",x,[((0,i.uX)(),(0,i.Wv)(Z,{key:`line-${t.id}`,type:"line",id:`chart${t.id}`,className:"lineChart",height:e.getChartHeight(t.id),labels:t.data.labels,datasets:t.data.datasets,options:t.data.options},null,8,["id","height","labels","datasets","options"]))])])])),_:2},1024)):(0,i.Q3)("",!0),"doughnut"===t.chartType?((0,i.uX)(),(0,i.Wv)(ae,{key:1,class:"column-content"},{default:(0,i.k6)((()=>[(0,i.bF)(ee,{style:{height:"auto"}},{title:(0,i.k6)((()=>[(0,i.Lk)("div",f,[(0,i.Lk)("span",null,(0,n.v_)(t.name),1),(0,i.Lk)("div",y,[e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:0,size:"small",type:"text",class:"drag-btn",title:"拖曳排序"},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"expand-arrows",width:"14"})])),_:1})):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:1,size:"small",type:"text",class:"resize-btn",title:"調整大小",onClick:(0,l.D$)((a=>e.openResizeModal(t)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"corner-up-right",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:2,size:"small",type:"text",class:"reset-btn",title:"恢復預設大小",onClick:(0,l.D$)((a=>e.resetChartSize(t.id)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"refresh",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])])])),extra:(0,i.k6)((()=>[(0,i.bF)(J,null,{default:(0,i.k6)((()=>[e.permission.delete?((0,i.uX)(),(0,i.Wv)(q,{key:0,ghost:"",type:"danger",onClick:(0,l.D$)((a=>e.deleteChart(t.id)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"trash"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.permission.update?((0,i.uX)(),(0,i.Wv)(q,{key:1,ghost:"",type:"primary",onClick:(0,l.D$)((a=>e.openEditModal(t)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"setting"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])),_:2},1024)])),default:(0,i.k6)((()=>[(0,i.Lk)("div",k,[(0,i.bF)(U,null,{default:(0,i.k6)((()=>[(0,i.eW)("時間: "+(0,n.v_)(t.periodText),1)])),_:2},1024),(0,i.Lk)("p",null,"單位:"+(0,n.v_)(t.data.unit),1),(0,i.Lk)("div",{style:(0,n.Tr)({height:e.getChartHeight(t.id)+"px",overflow:"visible",position:"relative"})},[((0,i.uX)(),(0,i.Wv)(te,{key:`doughnut-${t.id}`,type:"doughnut",id:`chart${t.id}`,labels:t.data.labels,datasets:t.data.datasets,height:e.getChartHeight(t.id),options:t.data.options},null,8,["id","labels","datasets","height","options"]))],4),(0,i.Lk)("div",w,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(t.data.datasets[0].data,((e,a)=>((0,i.uX)(),(0,i.CE)("div",{class:"ninjadash-overview-percentage__item",key:a},[(0,i.Lk)("span",{class:"ninjadash-overview-percentage__point",style:(0,n.Tr)({backgroundColor:t.data.datasets[0].backgroundColor[a]})},null,4),(0,i.Lk)("span",C,[(0,i.eW)((0,n.v_)(t.data.labels[a]),1),_,(0,i.eW)((0,n.v_)((e/t.data.datasets[0].data.reduce(((e,t)=>e+t),0)*100).toFixed(2))+"%",1)])])))),128))]),(0,i.Lk)("div",z,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(t.data.datasets[0].data,((e,a)=>((0,i.uX)(),(0,i.CE)("div",{class:"ninjadash-overview-box-item",style:{"margin-bottom":"10px"},key:a},[(0,i.Lk)("h4",null,(0,n.v_)(e),1),(0,i.Lk)("p",null,(0,n.v_)(t.data.labels[a]),1)])))),128))])])])),_:2},1024)])),_:2},1024)):(0,i.Q3)("",!0),"radialBar"===t.chartType?((0,i.uX)(),(0,i.Wv)(ee,{key:2,class:"column-content"},{title:(0,i.k6)((()=>[(0,i.Lk)("div",F,[(0,i.Lk)("span",null,(0,n.v_)(t.name),1),(0,i.Lk)("div",M,[e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:0,size:"small",type:"text",class:"drag-btn",title:"拖曳排序"},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"expand-arrows",width:"14"})])),_:1})):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:1,size:"small",type:"text",class:"resize-btn",title:"調整大小",onClick:(0,l.D$)((a=>e.openResizeModal(t)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"corner-up-right",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:2,size:"small",type:"text",class:"reset-btn",title:"恢復預設大小",onClick:(0,l.D$)((a=>e.resetChartSize(t.id)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"refresh",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])])])),extra:(0,i.k6)((()=>[(0,i.bF)(J,null,{default:(0,i.k6)((()=>[e.permission.delete?((0,i.uX)(),(0,i.Wv)(q,{key:0,ghost:"",type:"danger",onClick:(0,l.D$)((a=>e.deleteChart(t.id)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"trash-alt"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.permission.update?((0,i.uX)(),(0,i.Wv)(q,{key:1,ghost:"",type:"primary",onClick:(0,l.D$)((a=>e.openEditModal(t)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"cog"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])),_:2},1024)])),default:(0,i.k6)((()=>[(0,i.bF)(U,null,{default:(0,i.k6)((()=>[(0,i.eW)("時間: "+(0,n.v_)(t.periodText),1)])),_:2},1024),(0,i.Lk)("p",null,(0,n.v_)(`單位: ${t.data.unit}`),1),(0,i.Lk)("div",T,[(0,i.Lk)("div",{style:(0,n.Tr)({height:e.getChartHeight(t.id)+"px"})},[e.loading?(0,i.Q3)("",!0):((0,i.uX)(),(0,i.Wv)(ie,{key:`radial-${t.id}-${t.data.series?.length||0}`,type:"radialBar",height:e.getChartHeight(t.id),id:`chart${t.id}`,options:t.data.chartOptions,series:t.data.series,onClick:e=>t.data.onClick()},null,8,["height","id","options","series","onClick"]))],4)])])),_:2},1024)):(0,i.Q3)("",!0),"bar"===t.chartType?((0,i.uX)(),(0,i.Wv)(ee,{key:3,class:"column-content"},{title:(0,i.k6)((()=>[(0,i.Lk)("div",D,[(0,i.Lk)("span",null,(0,n.v_)(t.name),1),(0,i.Lk)("div",$,[e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:0,size:"small",type:"text",class:"drag-btn",title:"拖曳排序"},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"expand-arrows",width:"14"})])),_:1})):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:1,size:"small",type:"text",class:"resize-btn",title:"調整大小",onClick:(0,l.D$)((a=>e.openResizeModal(t)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"corner-up-right",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.editMode?((0,i.uX)(),(0,i.Wv)(q,{key:2,size:"small",type:"text",class:"reset-btn",title:"恢復預設大小",onClick:(0,l.D$)((a=>e.resetChartSize(t.id)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"refresh",width:"14"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])])])),extra:(0,i.k6)((()=>[(0,i.bF)(J,null,{default:(0,i.k6)((()=>[e.permission.delete?((0,i.uX)(),(0,i.Wv)(q,{key:0,ghost:"",type:"danger",onClick:(0,l.D$)((a=>e.deleteChart(t.id)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"trash"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.permission.update?((0,i.uX)(),(0,i.Wv)(q,{key:1,ghost:"",type:"primary",onClick:(0,l.D$)((a=>e.openEditModal(t)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"setting"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])),_:2},1024)])),default:(0,i.k6)((()=>[(0,i.Lk)("p",null,"時間: "+(0,n.v_)(t.periodText),1),(0,i.Lk)("div",S,[(0,i.bF)(Z,{type:"bar",height:e.getChartHeight(t.id),className:"bar",id:`chart${t.id}`,labels:t.data.labels,datasets:t.data.datasets,options:t.data.options},null,8,["height","id","labels","datasets","options"])])])),_:2},1024)):(0,i.Q3)("",!0),"card"===t.chartType?((0,i.uX)(),(0,i.Wv)(le,{key:4},{default:(0,i.k6)((()=>[e.editMode?((0,i.uX)(),(0,i.CE)("div",W,[(0,i.bF)(q,{size:"small",type:"text",class:"drag-btn",title:"拖曳排序"},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"expand-arrows",width:"14"})])),_:1}),(0,i.bF)(q,{size:"small",type:"text",class:"resize-btn",title:"調整大小",onClick:(0,l.D$)((a=>e.openResizeModal(t)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"corner-up-right",width:"14"})])),_:2},1032,["onClick"]),(0,i.bF)(q,{size:"small",type:"text",class:"reset-btn",title:"恢復預設大小",onClick:(0,l.D$)((a=>e.resetChartSize(t.id)),["stop"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"refresh",width:"14"})])),_:2},1032,["onClick"])])):(0,i.Q3)("",!0),((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(t.data.data,((a,r)=>((0,i.uX)(),(0,i.Wv)(ee,{key:a.name,title:a.name??"無標題",class:"sub-card"},(0,i.eX)({title:(0,i.k6)((()=>[(0,i.Lk)("div",A,[(0,i.Lk)("span",null,(0,n.v_)(a.name??"無標題"),1)])])),default:(0,i.k6)((()=>[(0,i.Lk)("div",X,[(0,i.bF)(Y,{name:"bolt"})]),(0,i.bF)(U,null,{default:(0,i.k6)((()=>[(0,i.eW)("時間: "+(0,n.v_)(t.periodText),1)])),_:2},1024),(0,i.Lk)("div",{class:"ninjadash-chart-container sub-card-content",onClick:e=>t.data.onClick(r)},[(0,i.bF)(ne,{ref_for:!0,ref:"counter",startAmount:0,endAmount:Number(a.summary),duration:1.5,prefix:"",suffix:"",separator:",",decimalSeparator:".",decimals:2,autoinit:!0},null,8,["endAmount","duration"]),(0,i.Lk)("p",L,(0,n.v_)(t.data.unit),1)],8,R)])),_:2},[0===r?{name:"extra",fn:(0,i.k6)((()=>[(0,i.bF)(J,null,{default:(0,i.k6)((()=>[e.permission.delete?((0,i.uX)(),(0,i.Wv)(q,{key:0,ghost:"",type:"danger",onClick:(0,l.D$)((a=>e.deleteChart(t.id)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"trash-alt"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0),e.permission.update?((0,i.uX)(),(0,i.Wv)(q,{key:1,ghost:"",type:"primary",onClick:(0,l.D$)((a=>e.openEditModal(t)),["prevent"])},{default:(0,i.k6)((()=>[(0,i.bF)(Y,{name:"cog"})])),_:2},1032,["onClick"])):(0,i.Q3)("",!0)])),_:2},1024)])),key:"0"}:void 0]),1032,["title"])))),128))])),_:2},1024)):(0,i.Q3)("",!0)])],8,m)))),128))],512)])):(0,i.Q3)("",!0)])),_:1})])}a(75126);var O=a(56427),Q=(a(1532),a(30995)),E=(a(44114),a(20116),a(7588),a(61701),a(13579),a(19179)),K=a(79841),I=a(79570),P=a(40834),N=a(27615),H=a(80587),V=a(66779),B=a(70063),G=a(24167),Y=a(95853);const q=Y.Ay.div`
    .ninjadash-overview-percentage{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 12px;
        .ninjadash-overview-percentage__item{
            display: flex;
            align-items: center;
            margin: 15px;
        }
        .ninjadash-overview-percentage__point{
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 5px;
            background-color: ${({theme:e})=>e["primary-color"]};
        }
        .ninjadash-overview-percentage__text{
            font-size: 15px;
            font-weight: 500;
            color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
        }
    }
    .ant-card-body{
        padding: 30px 25px !important;
    }
    .ninjadash-overview-wrap{
        color: #333;
        canvas{
            margin: 0 auto;
            position: relative;
            z-index: 10;
            max-height: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
        }
        &__inner{
            @media only screen and (max-width: 480px){
                height: 150px !important;
            }
        }
    }
    .ninjadash-overview-box{
        margin-top: 10px;
        padding: 16.65px 32px;
        border-radius: 8px;
        background: ${({theme:e})=>e[e.mainContent]["light-background"]};
        .ninjadash-overview-box-item{
            text-align: center;
            h4{
                font-size: 18px;
                line-height: 1;
                font-weight: 600;
                margin-bottom: 6px;
                color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
            }
            p{
                margin-bottom: 0;
                font-size: 15px;
                line-height: 1.25;
                color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
            }
        }
    }

`,J=Y.Ay.div`
    display: block;
    font-family: 'Jost', sans-serif;
    padding: 25px;
    border-radius: 8px;
    min-height: 100vh;
    margin-bottom: 120px; /* 確保與底部版權資訊有足夠間距 */
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: ${({theme:e})=>e[e.mainContent]["white-background"]};
        box-shadow: 0 3px 16px ${({theme:e})=>e[e.mainContent]["border-color-default"]}50;
        padding: 8px 6px !important;
        border-radius: 5px;
        min-width: 80px;
        transition: all 0.5s ease;
        pointer-events: none;
        transform: translate(-50%, 5%);
        z-index: 222;
        top: 0;
        left: 0;
        @media only screen and (max-width: 991px){
            transform: translate(-60%, 5%);
        }
        &:before {
            position: absolute;
            content: '';
            border-top: 5px solid ${({theme:e})=>e[e.mainContent]["white-background"]};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({theme:e})=>e.rtl?"right":"left"}: 50%;
            transform: translateX(-50%);
        }
        table td{
            padding: 0;
        }
    }
    .chartjs-tooltip-key {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: "pink";
        ${({theme:e})=>e.rtl?"margin-left":"margin-right"} : 5px;
    }
    .tooltip-title {
        color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
        font-size: 12px;
        line-height: 1;
        font-weight: 500 !important;
        font-family: 'Jost', sans-serif;;
        text-transform: capitalize;
        margin-bottom: 4px;
    }
    .tooltip-value {
        color: #63b963;
        font-size: 22px;
        font-weight: 600 !important;
        font-family: 'Jost', sans-serif;;
    }
    .tooltip-value sup {
        font-size: 12px;
        @media only screen and (max-width: 1199px){
            font-size: 11px;
        }
    }
    table{
        tbody{
            td{
                font-size: 12px;
                font-weight: 500;
                padding-bottom: 3px;
                color: ${({theme:e})=>e["extra-light-color"]};
                .data-label{
                    ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 3px;
                    color: ${({theme:e})=>e["light-gray-color"]};
                }
            }
        }
    }
    .ant-col {
        display: block;
        .column-content {
          display: block;
          .ant-card-body{
            height: auto;
            z-index: 1;
            position: relative;
          }
        }
    }
    .ant-card-head-title{
        font-weight:600;
        font-size:18px
    }
    .ant-card{
        margin-bottom:25px;
        overflow: visible;
        position: relative;
        z-index: 1;
        min-width: 200px;
        min-height: 320px; /* 進一步減少卡片最小高度 */
    }

    /* 為頁面底部添加間距，避免被卡片覆蓋 */
    .dashboard-draggable-container {
        width: 100%;
        padding-bottom: 100px; /* 添加底部間距 */
    }

    .ninjadash-chart-container {
        overflow: hidden !important;
        max-height: 100% !important;
        position: relative;
        margin-bottom: 120px !important; /* 確保與底部版權資訊有足夠間距 */
    }
    .ant-btn-primary .unicon svg {
        color: ${({theme:e})=>e["primary-color"]};
        fill: ${({theme:e})=>e["primary-color"]};
    }
    .ant-btn-danger .unicon svg {
        color: ${({theme:e})=>e["danger-color"]};
        fill: ${({theme:e})=>e["danger-color"]};
    }

    /* 拖曳相關樣式 */
    .dashboard-draggable-container {
        width: 100%;
    }

    .draggable-wrapper {
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        gap: 25px;
        width: 100%;
        align-items: start;
    }

    .chart-item {
        position: relative;
        transition: all 0.3s ease;
        width: 100%;
        overflow: visible;
        
        &:hover {
            .chart-drag-handle {
                opacity: 1;
                transform: scale(1.1);
            }
        }
    }



    .chart-title-with-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        position: relative;
        z-index: 9998;
        min-height: 40px;
        padding-right: 120px;
    }

    .chart-controls {
        display: flex;
        gap: 4px;
        margin-left: 8px;
        z-index: 9999;
        position: absolute;
        right: 60px;
        top: 0;
        background: rgba(255, 255, 255, 0.95);
        padding: 4px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .drag-btn,
        .resize-btn,
        .reset-btn {
            width: 28px;
            height: 28px;
            padding: 0;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            position: relative;
            z-index: 10000;
            flex-shrink: 0;

            &:hover {
                background: rgba(255, 255, 255, 1);
                border-color: #1890ff;
                box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
                transform: scale(1.05);
                z-index: 10001;
            }

            .unicon svg {
                color: #666;
                fill: #666;
                transition: color 0.3s ease;
                width: 14px;
                height: 14px;
            }

            &:hover .unicon svg {
                color: #1890ff;
                fill: #1890ff;
            }
        }

        .drag-btn {
            cursor: grab;
            
            &:active {
                cursor: grabbing;
            }
        }

        .reset-btn:hover .unicon svg {
            color: #ff4d4f;
            fill: #ff4d4f;
        }
    }



    .chart-item:hover {
        .chart-resize-controls {
            opacity: 1;
        }
    }

    /* 確保設定按鈕不被覆蓋 */
    .ant-card-extra {
        z-index: 10 !important;
        position: absolute;
        right: 0;
        top: 0;
        
        .ant-space {
            gap: 4px !important;
        }
        
        .ant-btn {
            width: 28px;
            height: 28px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .ant-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
        }
    }

    /* 拖曳時的樣式 */
    .sortable-ghost {
        opacity: 0.5;
        transform: rotate(5deg);
    }

    .sortable-chosen {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
    }

    /* 縮放模態框樣式 */
    .resize-form {
        padding: 20px 0;

        .slider-value {
            text-align: center;
            margin-top: 8px;
            font-weight: 500;
            color: #1890ff;
        }

        .ant-form-item {
            margin-bottom: 24px;
        }

        .ant-slider {
            margin: 8px 0;
        }
    }
`,U=Y.Ay.div`
    width:100%;
    .card-controls-overlay {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 50;
        display: flex;
        gap: 8px;
        background: rgba(255, 255, 255, 0.9);
        padding: 4px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        .drag-btn,
        .resize-btn,
        .reset-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            position: relative;
            z-index: 20;

            &:hover {
                background: rgba(255, 255, 255, 1);
                border-color: #1890ff;
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
                transform: scale(1.05);
                z-index: 25;
            }

            .unicon svg {
                color: #666;
                fill: #666;
                transition: color 0.3s ease;
            }

            &:hover .unicon svg {
                color: #1890ff;
                fill: #1890ff;
            }
        }

        .drag-btn {
            cursor: grab;
            
            &:active {
                cursor: grabbing;
            }
        }

        .reset-btn:hover .unicon svg {
            color: #ff4d4f;
            fill: #ff4d4f;
        }
    }

    .sub-card {
        position: relative;
        
        .chart-title-with-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
            z-index: 10;
        }
        
        .ant-card-extra {
            z-index: 30 !important;
            position: relative;
            margin-left: 20px;
            
            .ant-space {
                gap: 12px !important;
            }
            
            .ant-btn {
                width: 32px;
                height: 32px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                
                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
            }
        }
        
        .quarter-circle {
            position: absolute; 
            bottom: 0; 
            left: 0;
            width: 100px;
            height: 100px;
            background-color: #fa8b0c15; 
            border-radius: 0 100px 0 0; 
            display: flex;
            justify-content: center;
            align-items: center;
            .unicon svg {
                position: absolute;
                left: 30px;
                bottom: 30px;
                color: #ff8000;
                fill: #ff8000;
            }
        }
        .sub-card-content {
            font-size: 35px;
            font-weight: 500;
            text-align: center;
            color: #000000;
            .suffix-text {
                text-align: right;
                margin-bottom: 0;
                font-size: 26px;
                font-weight: 400;
            }
        }
    }
    
`;var Z=a(54745),ee=a(25117),te=a(38739),ae=a(82958),ie=a(38725),ne=a(37859),le=a(10984),re=a(92317),oe=a(432),se=a.n(oe),de=a(63366),ce=a(74353),ue=a.n(ce),pe=a(12087),me=a(96763),he=(0,i.pM)({components:{Main:I.gZ,Chart:E.A,ChartContainer:J,DoughnutChart:V.A,SalesOverviewStyleWrap2:q,Vue3Autocounter:Z.A,OverviewCard:G.A,SubContent:U,ChartForm:B.A,ModalTable:ee.A,draggable:se(),OptimizedApexChart:te.A},setup(){const{state:e,dispatch:t}=(0,P.Pj)(),a=(0,i.EW)((()=>e.dashboard.loading)),n=(0,K.KR)(!1),{permission:l}=(0,ae.J)(),r=(0,K.KR)(!1),o=(0,K.KR)(new Map),s=(0,K.KR)(0),d=5e3,c=1500,u=15e3,p=8e3,m=6e4,h=3e3,g=6e4,b=(0,K.KR)(new Map),v=120,x=(e,t=[])=>{if(!b.value.has(e)){const a=new Map(t.map((e=>[e,[]])));b.value.set(e,{labels:[],series:a})}const a=b.value.get(e);return t.forEach((e=>{a.series.has(e)||a.series.set(e,[])})),a},f="dashboard_grid_positions",y=(0,K.KR)(null),k=(0,K.KR)(null),w=(0,K.KR)({}),C=()=>(0,re.Gq)(f)||{},_=e=>(0,re.SO)(f,e),z=e=>{const t=w.value[e];return t||{x:0,y:0,w:6,h:6}},F=e=>{const t={};return Array.isArray(e)&&e.forEach((e=>{if(e&&e.layout&&"object"===typeof e.layout){const{x:a,y:i,w:n,h:l}=e.layout;[a,i,n,l].every((e=>"number"===typeof e))&&(t[e.id]={x:a,y:i,w:n,h:l})}})),t},M=()=>{if(!y.value||k.value)return;k.value=pe.dn.init({column:24,float:!0,cellHeight:30,minRow:1,disableOneColumnMode:!0,margin:6,resizable:{handles:"all"},draggable:{handle:".drag-btn"}},y.value),w.value=C();const e=(0,de.A)((()=>{t("dashboard/saveLayout",w.value)}),1e3);k.value.on("change",((t,a)=>{if(!a)return;const i={...w.value};a.forEach((e=>{const t=e.el?.getAttribute("data-id");t&&(i[t]={x:e.x,y:e.y,w:e.w,h:e.h})})),w.value=i,_(i),e()}))},T=e=>{const t=o.value.get(e);return t&&Date.now()-t.timestamp<d&&t.data&&t.data.data&&Array.isArray(t.data.data)&&t.data.data.length>0},D=(e,t)=>{o.value.set(e,{data:t,timestamp:Date.now()})},$=(0,K.KR)(0),S=(0,K.KR)(0),W=(0,K.KR)(0),A=()=>{const e=(0,re.Gq)("debug_dashboard_log");return!0===e||"true"===e||1===e||"1"===e},X=()=>!document.hidden&&(!V.value&&!(Date.now()<S.value)),R=()=>{$.value=0,S.value=0,s.value=Date.now()},L=()=>{$.value+=1;const e=Math.min($.value-1,5),t=Math.min(h*Math.pow(2,e),m);S.value=Date.now()+t},j=(0,de.A)((async()=>{if(X())try{V.value=!0;const e="dashboard_data";if(T(e))return void(A()&&me.debug("使用快取資料，避免重複請求"));const a=await t("dashboard/getDashboard");a&&a.data&&Array.isArray(a.data)&&a.data.length>0?(A()&&me.debug("儀表板資料更新成功，圖表數量:",a.data.length),D(e,a),R()):(Date.now()-W.value>g&&A()&&(me.warn("儀表板資料無效或為空，跳過更新"),W.value=Date.now()),L())}catch(e){L(),A()&&me.warn("資料更新失敗:",e)}finally{V.value=!1}}),c);(0,i.sV)((async()=>{try{const e=await t("dashboard/getDashboard");Z.value=e.unit,n.value=!0,D("dashboard_data",e),s.value=Date.now(),(0,i.dY)((()=>M())),E.value=setInterval((()=>{document.hidden||j()}),u),B.value&&!I.value&&(I.value=setInterval((()=>{document.hidden||G()}),p))}catch(e){Q.A.error({title:"發生錯誤",content:e.message}),n.value=!0}})),(0,i.xo)((()=>{if(clearInterval(E.value),clearInterval(I.value),k.value){try{k.value.destroy(!1)}catch(e){}k.value=null}}));const E=(0,K.KR)(),I=(0,K.KR)(),V=(0,K.KR)(!1),B=(0,i.EW)((()=>Array.isArray(e.dashboard.data)&&e.dashboard.data.some((e=>999===e.timePeriod&&"line"===e.chartType)))),G=async()=>{if(X())try{V.value=!0,await t("dashboard/getDashboard"),R()}catch(e){L(),A()&&me.warn("Realtime refresh failed:",e)}finally{V.value=!1}},Y=(0,K.KR)([{id:"line",name:"折線圖"},{id:"doughnut",name:"圓餅圖"},{id:"bar",name:"長條圖"},{id:"radialBar",name:"儀表盤"},{id:"card",name:"卡片"}]),q=(0,K.KR)(ne.Ve),J=(0,K.KR)([{id:999,name:"即時"},{id:1,name:"本日"},{id:2,name:"昨日"},{id:3,name:"本週"},{id:4,name:"上週"},{id:5,name:"本月"},{id:6,name:"上月"},{id:7,name:"今年"},{id:8,name:"去年"}]),U=(0,K.KR)(ne.a0),Z=(0,K.KR)([]),ee=({data:e,unitText:t,timePeriod:a,params:i,chartId:n})=>{let l,r=[],o=[];if(e&&e[0]){if(999!==a)o=e[0].detail[0].Data.map((e=>ue()(e.Time).format("YYYY/MM/DD HH:mm:ss"))),e.forEach((e=>{const t=e.detail[0].Data.map((e=>e.Value)),a={label:e.name,datas:t,color:i.find((t=>t.name===e.name))?.color};r.push(a)}));else{const t=e.map((e=>e.name)),a=x(n,t),l=ue()().format("HH:mm:ss");a.labels.push(l),a.labels.length>v&&a.labels.shift(),e.forEach((e=>{const t=a.series.get(e.name),i=Number(e.summary??0);t.push(i),t.length>v&&t.shift()})),o=[...a.labels],r=t.map((e=>({label:e,datas:[...a.series.get(e)||[]],color:i.find((t=>t.name===e))?.color})))}l={plugins:{zoom:{zoom:{wheel:{enabled:!0},pinch:{enabled:!0},mode:"xy"}}},responsive:!0,maintainAspectRatio:!1,layout:{padding:{left:0,right:0,top:0,bottom:0}},scales:{y:{title:{display:!0,text:t}}}}}const s=[];r.forEach(((e,t)=>{const a=oe(r.length,[]);s.push({label:e.label,yAxisID:"y",data:e.datas,borderColor:e.color||a[t],backgroundColor:e.color||a[t]})}));const d={xs:24,sm:24,lg:18};return{colSpan:d,labels:o,datasets:s,options:l}},te=(0,K.KR)(new Map),oe=(e,t)=>{if(t&&t.length>0)return t;const a=`colors_${e}`;return te.value.has(a)||te.value.set(a,(0,ie.s)(e)),te.value.get(a)},se=(e,a,i)=>(n,l)=>{if(!l||!l[0])return;const r=l[0].index,o=e[r].detail.map((e=>({name:999!==a?e.TagName:e.Name,value:999!==a?e.Summary[U.value.find((e=>e.value===i))?.value]:e.Value}))),s=e[r].name;t("dashboard/fetchDetail",o),Ne.value=`${s} 詳情`,He.value=[{title:"名稱",dataIndex:"name",key:"name"},{title:"值",align:"right",dataIndex:"value",key:"value"}],Pe.value=!0},ce=({data:e,unitText:t,timePeriod:a,summary:i,params:n})=>{let l=[],r=[],o=[],s=0;e&&e[0]&&(l=e.map((e=>e.name)),r=e.map((e=>Number(e.summary||0))),o=n.map((e=>e.color)),s=r.reduce(((e,t)=>e+t),0));const d=oe(e?.length||0,o),c=(0,H.s_)(s,0),u="#ffffff",p=se(e,a,i),m={xs:24,sm:24,lg:6};return{colSpan:m,labels:l,unit:t,datasets:[{label:"doughnut-main",data:r,backgroundColor:d,centerText:c}],options:{cutout:"80%",borderWidth:1,maintainAspectRatio:!0,responsive:!0,borderColor:u,plugins:{legend:{display:!1},labels:{display:!1}},animation:{animateScale:!1,animateRotate:!1},onClick:p},total:s}},he=({data:e,unitText:a,limit:i,timePeriod:n,name:l,summary:r,params:o})=>{const s={xs:24,sm:24,lg:6};let d=0,c=0;return e[0]&&(d=e[0].summary,c=(d/i*100).toFixed(2)),{onClick:()=>{const a=e[0].detail.map((e=>({name:999!==n?e.TagName:e.Name,value:999!==n?e.Summary[U.value.find((e=>e.value===r)).value]:e.Value})));t("dashboard/fetchDetail",a),Ne.value=`${l} 詳情`,He.value=[{title:"名稱",dataIndex:"name",key:"name"},{title:"值",align:"right",dataIndex:"value",key:"value"}],Pe.value=!0},source:e,unit:a,colSpan:s,series:[c],chartOptions:{chart:{height:280,type:"radialBar"},colors:o[0].color?[o[0].color]:["#4BC6B9"],plotOptions:{radialBar:{startAngle:-135,endAngle:135,track:{background:"#333",startAngle:-135,endAngle:135},dataLabels:{name:{show:!1},value:{fontSize:"25px",show:!0,formatter:function(){return`${d}`}}}}},fill:{type:"gradient",gradient:{shade:"dark",type:"horizontal",gradientToColors:["#FF8000"],stops:[0,100]}},stroke:{lineCap:"butt"}}}},ge=({data:e,unitText:a,timePeriod:i,summary:n,params:l})=>{let r=[],o=[],s=[];e&&(r=e.map((e=>e.name)),o=e.map((e=>e.summary)),s=l.map((e=>e.color)));const d=oe(e?.length||0,s),c=d.length>0?d:["rgba(255, 128, 0, 0.7)"],u=d.length>0?d:["rgba(255, 128, 0, 1)"],p={xs:24,sm:24,lg:12};return{colSpan:p,labels:r,datasets:[{label:`(${a})`,data:o,backgroundColor:c,borderColor:u,borderWidth:1}],options:{responsive:!0,height:300,maintainAspectRatio:!1,scales:{y:{title:{display:!0,text:a}}},plugins:{legend:{display:!1}},elements:{bar:{borderRadius:4}},onClick:(a,l)=>{if(l[0]){const a=l[0].index,r=e[a].detail.map((e=>({name:999!==i?e.TagName:e.Name,value:999!==i?e.Summary[U.value.find((e=>e.value===n))?.value]:e.Value}))),o=e[a].name;t("dashboard/fetchDetail",r),Ne.value=`${o} 詳情`,He.value=[{title:"名稱",dataIndex:"name",key:"name"},{title:"值",align:"right",dataIndex:"value",key:"value"}],Pe.value=!0}}}}},be=({data:e,unitText:a,timePeriod:i,summary:n})=>{const l={xs:24,sm:24,lg:6};return{onClick:a=>{const l=e[a].detail.map((e=>({name:999!==i?e.TagName:e.Name,value:999!==i?e.Summary[U.value.find((e=>e.value===n))?.value]:e.Value})));t("dashboard/fetchDetail",l),Ne.value=`${e[a].name} 詳情`,He.value=[{title:"名稱",dataIndex:"name",key:"name"},{title:"值",align:"right",dataIndex:"value",key:"value"}],Pe.value=!0},unit:a,data:e.length>0?e:[0],colSpan:l}},ve=(0,i.EW)((()=>{const t=e.dashboard.data.map((e=>{let t,a=e.chartType;return"Pie"===e.name&&(a="doughnut"),"line"===a&&(t=ee({...e,chartId:e.id})),"doughnut"===a&&(t=ce(e)),"radialBar"===a&&(t=he(e)),"bar"===a&&(t=ge(e)),"card"===a&&(t=be(e)),{id:e.id,name:e.name,chartType:a,limit:e.limit,data:t,unit:e.unit,unitText:e.unitText,params:e.params,timePeriod:e.timePeriod,summary:e.summary,paramSummary:e.paramSummary,periodText:J.value.find((t=>t.id===e.timePeriod)).name,layout:e.layout}}));return t})),xe=(0,K.KR)([]),fe="dashboard_chart_order",ye=()=>(0,re.Gq)(fe)||[],ke=e=>(0,re.SO)(fe,e),we=e=>{const t=ye();if(0===t.length)return e;const a=[],i=new Map(e.map((e=>[e.id,e])));return t.forEach((e=>{i.has(e)&&(a.push(i.get(e)),i.delete(e))})),i.forEach((e=>a.push(e))),a},Ce=()=>{const e=ve.value;xe.value=we(e);const t=C(),a=F(xe.value),n={...t,...a},l=0===Object.keys(t).length?a:n;xe.value.forEach((e=>{l[e.id]||(l[e.id]={x:0,y:0,w:6,h:6})})),w.value=l,_(l),(0,i.dY)((()=>M()))};(0,i.wB)(ve,(()=>{Ce()}),{immediate:!0});const _e=e=>{const{newIndex:t,oldIndex:a}=e;if(t!==a){const e=xe.value.map((e=>e.id));ke(e),O.A.success({message:"圖表順序已更新",description:"您的圖表排列已保存，下次開啟時將保持此順序"})}},ze="dashboard_chart_sizes",Fe=()=>(0,re.Gq)(ze)||{},Me=e=>(0,re.SO)(ze,e),Te=()=>({}),De=e=>{const t=Fe(),a=t[e];if(a){const e=a.height-140;return Math.max(e,120)}const i=xe.value.find((t=>t.id===e));return i&&"doughnut"===i.chartType?150:300},$e=(0,K.KR)(!1),Se=(0,K.Kh)({chartId:null,width:6,height:300}),We=e=>{const t=Fe(),a=t[e.id]||{width:z(e.id).w,height:De(e.id)};Se.chartId=e.id,Se.width=a.width,Se.height=a.height,$e.value=!0},Ae=()=>{$e.value=!1},Xe=()=>{const e=Fe();if(e[Se.chartId]={width:Se.width,height:Se.height},Me(e),k.value){const e=y.value.querySelector(`[data-id="${Se.chartId}"]`);e&&k.value.update(e,{w:Se.width})}(0,i.dY)((()=>{xe.value=[...xe.value]})),Ae(),O.A.success({message:"圖表大小已更新",description:"您的圖表尺寸已保存"})},Re=e=>{const t=Fe();delete t[e],Me(t),(0,i.dY)((()=>{xe.value=[...xe.value]})),O.A.success({message:"圖表大小已重置",description:"圖表已恢復預設大小"})},Le=(0,K.KR)(!1),je=(0,K.Kh)({id:null,limit:null,chartType:null,name:null,timePeriod:null,paramSummary:null,summary:null,unit:null,params:[]}),Oe=()=>{const e={id:null,chartType:"line",name:null,limit:null,paramSummary:"Summation",timePeriod:1,summary:"Summation",unit:1,params:[{name:null,tags:[],groups:[],color:"#000000"}]};Object.assign(je,e),Le.value=!0},Qe=({id:e,chartType:t,params:a,name:i,limit:n,timePeriod:l,unit:r,paramSummary:o,summary:s})=>{const d={id:e,chartType:t,name:i,timePeriod:l,paramSummary:o,summary:s,unit:r,limit:n,params:a};Object.assign(je,d),Le.value=!0},Ee=()=>{Le.value=!1},Ke=async e=>{try{let a;const i=Z.value.find((t=>t.Id===e.unit)).Name;e.id?(await t("dashboard/editChart",{...e,unitText:i}),a="修改成功"):(await t("dashboard/addChart",{...e,unitText:i}),a="新增成功"),Le.value=!1,O.A.success({message:a})}catch(a){Q.A.error({title:"發生錯誤",content:a.message})}},Ie=async e=>{Q.A.confirm({title:"確認刪除?",okText:"確認",cancelText:"取消",onOk:async()=>{try{await t("dashboard/deleteChart",e),O.A.success({message:"刪除成功"})}catch(a){Q.A.error({title:"發生錯誤",content:a.message})}}})},Pe=(0,K.KR)(!1),Ne=(0,K.KR)(""),He=(0,K.KR)([]),Ve=(0,i.EW)((()=>e.dashboard.detailTableData)),Be=e=>{t("dashboard/filterDetailTable",e.target.value)},Ge=()=>{Pe.value=!1};return{permission:l,loading:a,isInit:n,customTooltips:N.so,chartTypeOptions:Y,timePeriodOptions:J,summaryTypeOptions:U,paramSummaryOptions:q,unitOptions:Z,dashboardData:ve,draggableDashboardData:xe,onDragEnd:_e,getChartStyle:Te,getChartHeight:De,resizeModalVisible:$e,resizeForm:Se,openResizeModal:We,closeResizeModal:Ae,saveResizeSettings:Xe,resetChartSize:Re,chartSettingModal:Le,settingFormState:je,openAddModal:Oe,openEditModal:Qe,closeModal:Ee,submitSetting:Ke,deleteChart:Ie,detailModal:Pe,detailModalTitle:Ne,detailColumns:He,detailTableData:Ve,filterDetailTable:Be,closeDetailModal:Ge,usePeriodTime:le.I,editMode:r,gridEl:y,getGridPos:z}}}),ge=a(66262);const be=(0,ge.A)(he,[["render",j],["__scopeId","data-v-33bbea2c"]]);var ve=be}}]);