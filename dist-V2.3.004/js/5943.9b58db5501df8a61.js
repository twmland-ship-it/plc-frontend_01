"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[5943],{95943:function(e,l,a){a.d(l,{A:function(){return _}});var t=a(20641),o=a(72644),s=a(9322);const n={key:0},r={key:1},i={class:"section-title"},u=["onClick"],d={key:0,class:"empty-message"},g=(0,t.Lk)("div",{class:"section-title"},"可選擇的測點",-1),c=["onClick"];function p(e,l,a,p,m,f){const v=(0,t.g2)("a-tree-select"),h=(0,t.g2)("a-form-item"),b=(0,t.g2)("a-input"),k=(0,t.g2)("a-radio"),y=(0,t.g2)("a-radio-group"),w=(0,t.g2)("a-form"),C=(0,t.g2)("a-select"),S=(0,t.g2)("a-button"),x=(0,t.g2)("unicon"),F=(0,t.g2)("SelectedList"),T=(0,t.g2)("a-col"),_=(0,t.g2)("a-spin"),I=(0,t.g2)("TagList"),N=(0,t.g2)("a-row"),W=(0,t.g2)("MultiSelector"),X=(0,t.g2)("sdButton"),A=(0,t.g2)("sdModal"),L=(0,t.g2)("Wrap");return(0,t.uX)(),(0,t.Wv)(L,null,{default:(0,t.k6)((()=>[e.multiple?(0,t.Q3)("",!0):((0,t.uX)(),(0,t.CE)("span",n,(0,o.v_)(e.singleTagText),1)),e.multiple?((0,t.uX)(),(0,t.CE)("span",r,"包含 "+(0,o.v_)(e.selectedTags.length)+" 個測點 ",1)):(0,t.Q3)("",!0),(0,t.Lk)("span",{class:"text-primary",onClick:l[0]||(l[0]=(...l)=>e.openModal&&e.openModal(...l))}," 選擇測點"),e.modal?((0,t.uX)(),(0,t.Wv)(A,{key:2,title:e.title??"選擇測點",visible:e.modal,maskClosable:!0,onCancel:e.closeModal,width:900,class:"tag-filter-modal"},{default:(0,t.k6)((()=>[(0,t.bF)(w,{"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left"},{default:(0,t.k6)((()=>[(0,t.bF)(h,{label:"地區",style:{"margin-top":"1rem"}},{default:(0,t.k6)((()=>[(0,t.bF)(v,{value:e.formState.regionId,"onUpdate:value":l[1]||(l[1]=l=>e.formState.regionId=l),style:{width:"100%"},"tree-data":e.locations,"allow-clear":"","field-names":{children:"ChildList",label:"Name",value:"Id"},placeholder:"請選擇","tree-node-filter-prop":"label"},null,8,["value","tree-data"])])),_:1}),(0,t.bF)(h,{label:"測點分類"},{default:(0,t.k6)((()=>[(0,t.bF)(v,{value:e.formState.tagClass,"onUpdate:value":l[2]||(l[2]=l=>e.formState.tagClass=l),style:{width:"100%"},"tree-data":e.tagClassOptions,"allow-clear":"","field-names":{children:"ChildList",label:"Name",value:"Id"},placeholder:"請選擇","tree-node-filter-prop":"label"},null,8,["value","tree-data"])])),_:1}),e.multiple?((0,t.uX)(),(0,t.Wv)(h,{key:0,label:"搜尋",style:{"margin-top":"1rem"}},{default:(0,t.k6)((()=>[(0,t.bF)(b,{value:e.formState.searchText,"onUpdate:value":l[3]||(l[3]=l=>e.formState.searchText=l)},null,8,["value"])])),_:1})):(0,t.Q3)("",!0),(0,t.bF)(h,{label:"選單顯示"},{default:(0,t.k6)((()=>[(0,t.bF)(y,{value:e.formState.showName,"onUpdate:value":l[4]||(l[4]=l=>e.formState.showName=l)},{default:(0,t.k6)((()=>[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(e.showNameOptions,(e=>((0,t.uX)(),(0,t.Wv)(k,{key:e.id,value:e.id},{default:(0,t.k6)((()=>[(0,t.eW)((0,o.v_)(e.name),1)])),_:2},1032,["value"])))),128))])),_:1},8,["value"])])),_:1})])),_:1},8,["label-col","wrapper-col"]),e.multiple?(0,t.Q3)("",!0):((0,t.uX)(),(0,t.Wv)(C,{key:0,value:e.formState.tagForSingle,"onUpdate:value":l[5]||(l[5]=l=>e.formState.tagForSingle=l),style:{width:"100%"},"show-search":"","option-filter-prop":"label",options:e.tagsOptions,labelInValue:!0,allowClear:!0,dropdownMatchSelectWidth:!1},null,8,["value","options"])),e.multiple?((0,t.uX)(),(0,t.Wv)(N,{key:1,gutter:16,style:{"margin-top":"1rem"}},{default:(0,t.k6)((()=>[(0,t.bF)(T,{span:12},{default:(0,t.k6)((()=>[(0,t.Lk)("div",i,[(0,t.eW)(" 已選擇的測點 ("+(0,o.v_)(e.formState.tags.length)+") ",1),e.formState.tags.length>0?((0,t.uX)(),(0,t.Wv)(S,{key:0,type:"link",size:"small",onClick:e.clearAllTags,class:"clear-all-btn"},{default:(0,t.k6)((()=>[(0,t.eW)(" 清除全部 ")])),_:1},8,["onClick"])):(0,t.Q3)("",!0)]),(0,t.bF)(F,null,{default:(0,t.k6)((()=>[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(e.formState.tags,(l=>((0,t.uX)(),(0,t.CE)("div",{key:l.value,class:"selected-item",onClick:a=>e.removeTag(l)},[(0,t.Lk)("span",null,(0,o.v_)(l.label),1),(0,t.bF)(x,{name:"times",class:"remove-icon"})],8,u)))),128)),0===e.formState.tags.length?((0,t.uX)(),(0,t.CE)("div",d," 尚未選擇任何測點 ")):(0,t.Q3)("",!0)])),_:1})])),_:1}),(0,t.bF)(T,{span:12},{default:(0,t.k6)((()=>[g,(0,t.bF)(I,null,{default:(0,t.k6)((()=>[(0,t.bo)((0,t.bF)(_,null,null,512),[[s.aG,e.tagSearching]]),((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(e.tagsOptions,(l=>((0,t.uX)(),(0,t.CE)("div",{key:l.value,class:(0,o.C4)(["tag",e.isExistInSelectedTags(l)&&"selected"]),onClick:a=>e.setTags(l)},(0,o.v_)(l.label),11,c)))),128))])),_:1})])),_:1})])),_:1})):(0,t.Q3)("",!0),(0,t.bF)(W,{style:{display:"none"}},{default:(0,t.k6)((()=>[e.multiple?((0,t.uX)(),(0,t.Wv)(C,{key:0,mode:"multiple",value:e.formState.tags,"onUpdate:value":l[6]||(l[6]=l=>e.formState.tags=l),open:!1,style:{width:"100%"},labelInValue:!0},null,8,["value"])):(0,t.Q3)("",!0)])),_:1}),(0,t.bF)(N,{gutter:[5,10],align:"center",style:{"margin-top":"1rem"}},{default:(0,t.k6)((()=>[(0,t.bF)(T,null,{default:(0,t.k6)((()=>[(0,t.bF)(X,{class:"act-btn",type:"primary",onClick:e.submit},{default:(0,t.k6)((()=>[(0,t.eW)(" 選定測點 ")])),_:1},8,["onClick"])])),_:1}),(0,t.bF)(T,null,{default:(0,t.k6)((()=>[(0,t.bF)(X,{class:"act-btn",type:"light",onClick:e.closeModal},{default:(0,t.k6)((()=>[(0,t.eW)(" 取消 ")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1},8,["title","visible","onCancel"])):(0,t.Q3)("",!0)])),_:1})}a(1532);var m=a(30995),f=(a(44114),a(18111),a(20116),a(61701),a(79841)),v=a(95853);const h=v.Ay.div`
   .text-primary{
       color:${({theme:e})=>e["primary-color"]};
       cursor:pointer;
   }

   /* 為選擇測點對話框添加調整大小功能 */
   .tag-filter-modal .ant-modal-content {
       resize: both;
       overflow: auto;
       min-width: 600px;
       min-height: 400px;
       max-width: 90vw;
       max-height: 90vh;
   }

   .tag-filter-modal .ant-modal-body {
       overflow: auto;
       max-height: calc(90vh - 120px);
   }
`,b=v.Ay.div`
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
`,k=v.Ay.div`
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
`,y=v.Ay.div`
    .ant-select-selector{
        max-height:100px;
        overflow:auto;
    }
`;var w=a(40834),C=a(18683),S=a(64370),x=(0,t.pM)({props:{title:{type:String,default:null},selectedTags:{type:Array,default:()=>[]},tagsValueProp:{type:String,default:"id"},tagsLabelProp:{type:String,default:"name"},multiple:{type:Boolean,default:!0},value:{type:String,default:null}},components:{TagList:b,Wrap:h,MultiSelector:y,SelectedList:k},setup(e,{emit:l}){const{dispatch:a,state:o}=(0,w.Pj)(),s=(0,f.KR)(!1);(0,S.H)(".tag-filter-modal"),(0,t.sV)((async()=>{try{const e=await a("tags/getAllTagsAndOptions");c.value=e.tagClass,d.value=e.locations}catch(e){m.A.error({title:"錯誤",content:e.message})}}));const n=(0,t.EW)((()=>o.tags.tagInitData.find((l=>l.Id===e.value))?.Name)),r={lg:6,md:9,xs:24},i={lg:18,md:15,xs:24},u=[{id:"1",name:"說明+名稱"},{id:"2",name:"說明"},{id:"3",name:"名稱"}],d=(0,f.KR)([]),g=(0,f.KR)([]),c=(0,f.KR)([]),p=(0,f.Kh)({regionId:null,tagClass:null,showName:"1",searchText:"",tags:[],tagForSingle:{value:null,label:"測點不存在"}});(0,t.nT)((()=>{const e=[{type:"list",target:p.regionId?p.regionId:null,source:"RegionList",sourceProp:"Id"},{type:"list",target:p.tagClass?p.tagClass:null,source:"TagCategoryList",sourceProp:"Id"},{type:"text",target:p.searchText}],l=(0,C.Q8)(e,o.tags.tagInitData);p.tags=p.tags.map((e=>{const a=l.find((l=>l.Id===e.value));let t;return"1"==p.showName?t=`${a.Name}(${a.Description})`:"2"==p.showName?t=a.Description:"3"==p.showName&&(t=a.Name),{value:e.value,label:t}})),g.value=l.map((e=>{let l;return"1"==p.showName?l=`${e.Name}(${e.Description})`:"2"==p.showName?l=e.Description:"3"==p.showName&&(l=e.Name),{value:e.Id,label:l}}))}));const v=e=>{const l=p.tags.find((l=>l.value===e.value));return l},h=e=>{const l=p.tags.find((l=>l.value===e.value));if(l){const e=p.tags.indexOf(l);p.tags.splice(e,1)}else p.tags.push(e)},b=e=>{const l=p.tags.findIndex((l=>l.value===e.value));l>-1&&p.tags.splice(l,1)},k=()=>{p.tags=[]},y=(0,f.KR)(!1),x=()=>{e.multiple?p.tags=e.selectedTags.map((e=>g.value.find((l=>l.value===e))??{value:null,label:"測點不存在"})):p.tagForSingle=g.value.find((l=>l.value===e.value))??{value:null,label:"測點不存在"},y.value=!0},F=()=>{p.regionId=null,p.tagClass=null,p.showName="1",p.searchText="",JSON.stringify(p.tags.map((e=>e.value)))!==JSON.stringify(e.selectedTags)||p.tagForSingle?.value!==e.value?m.A.confirm({title:"提示",content:"測點將不會選定，確定關閉？",onOk(){y.value=!1}}):y.value=!1},T=()=>{if(p.regionId=null,p.tagClass=null,p.showName="1",p.searchText="",e.multiple){const a=p.tags.map((l=>({[e.tagsValueProp]:l.value,[e.tagsLabelProp]:l.label})));l("setTags",a)}else p.tagForSingle?l("setSingleTag",p.tagForSingle):l("setSingleTag",{value:null,label:"測點不存在"});y.value=!1};return{tagSearching:s,singleTagText:n,labelCol:r,wrapperCol:i,showNameOptions:u,tagsOptions:g,tagClassOptions:c,locations:d,formState:p,isExistInSelectedTags:v,setTags:h,removeTag:b,clearAllTags:k,modal:y,openModal:x,closeModal:F,submit:T}}}),F=a(66262);const T=(0,F.A)(x,[["render",p]]);var _=T}}]);