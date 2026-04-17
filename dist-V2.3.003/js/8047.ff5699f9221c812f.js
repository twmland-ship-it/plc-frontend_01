"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[8047],{24167:function(e,a,t){t.d(a,{A:function(){return $}});var n=t(20641),r=t(72644);const o={className:"ninjadahs-overview-label"},i={class:"ninjadash-overview-total"},l={class:"ninjadash-overview-total"},s={class:"ninjadahs-overview-label"},d={key:0,class:"ninjadash-overview-card__bottom"},c={class:"ninjadash-status-rate"},p={class:"ninjadash-status-label"};function h(e,a,t,h,m,u){const g=(0,n.g2)("unicon"),x=(0,n.g2)("vue3-autocounter"),f=(0,n.g2)("a-card"),b=(0,n.g2)("OverviewCard",!0);return(0,n.uX)(),(0,n.Wv)(b,{class:"ninjadash-overview-card-box"},{default:(0,n.k6)((()=>[(0,n.bF)(f,{bordered:!1,class:(0,r.C4)(e.halfCircleIcon?"ninjadash-overview-halfCircle-card":null)},{default:(0,n.k6)((()=>[(0,n.Lk)("div",{class:(0,r.C4)(`ninjadash-overview-card ninjadash-overview-card-${e.ocData.type}`)},[(0,n.Lk)("div",{class:(0,r.C4)(e.contentFirst?"ninjadash-overview-card__top d-flex justify-content-between ninjadash-overview-card-theme-2":"ninjadash-overview-card__top d-flex justify-content-between")},[(0,n.Lk)("div",{class:(0,r.C4)(`ninjadash-overview-card__top--icon ninjadash-${e.ocData.type}`)},[(0,n.bF)(g,{name:e.ocData.icon},null,8,["name"])],2),(0,n.Lk)("div",{class:(0,r.C4)(e.contentFirst?"ninjadash-overview-card__top--content":"ninjadash-overview-card__top--content text-right")},[e.halfCircleIcon?((0,n.uX)(),(0,n.CE)(n.FK,{key:0},[(0,n.Lk)("span",o,(0,r.v_)(e.ocData.label),1),(0,n.Lk)("h4",i,[(0,n.bF)(x,{ref:"counter",startAmount:0,endAmount:e.didViewCountUp?Number(e.ocData.total):0,duration:2,prefix:e.ocData.prefix,suffix:e.ocData.suffix,separator:",",decimalSeparator:".",decimals:e.ocData.decimal,autoinit:!0},null,8,["endAmount","prefix","suffix","decimals"])])],64)):((0,n.uX)(),(0,n.CE)(n.FK,{key:1},[(0,n.Lk)("h4",l,[(0,n.bF)(x,{ref:"counter",startAmount:0,endAmount:e.didViewCountUp?Number(e.ocData.total):0,duration:2,prefix:e.ocData.prefix,suffix:e.ocData.suffix,separator:",",decimalSeparator:".",decimals:e.ocData.decimal,autoinit:!0},null,8,["endAmount","prefix","suffix","decimals"])]),(0,n.Lk)("span",s,(0,r.v_)(e.ocData.label),1)],64))],2)],2),e.bottomStatus?((0,n.uX)(),(0,n.CE)("div",d,[(0,n.Lk)("span",{class:(0,r.C4)(`ninjadash-overview-status ninjadash-status-${e.ocData.growth}`)},[(0,n.Lk)("span",c,[(0,n.bF)(g,{name:"upward"===e.ocData.growth?"arrow-up":"arrow-down"},null,8,["name"]),(0,n.eW)(" "+(0,r.v_)(e.ocData.growthRate)+"% ",1)]),(0,n.Lk)("span",p,(0,r.v_)(e.ocData.dataPeriod),1)],2)])):(0,n.Q3)("",!0)],2)])),_:1},8,["class"])])),_:1})}var m=t(79841),u=t(95853);u.Ay.div`
    &.ninjadash-course-card-single{
        margin-bottom: 25px;
        .ant-card{
            background-color: ${({theme:e})=>e[e.mainContent]["white-background"]};
        }
        .ant-card-body{
            padding: 20px !important;
        }
        .ninjadash-course-card-thumbnail{
            border-radius: 10px;
            margin-bottom: 15px;
            img{
                max-width: 100%;
                width: 100%;
            }
        }
        .ninjadash-course-card-title{
            font-size: 20px;
            margin-bottom: 12px;
            font-weight: 600;
            a{
                color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
                &:hover{
                    color: ${({theme:e})=>e["primary-color"]};
                }
            }
        }
        .ninjadash-course-card-author{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            img{
                max-width: 30px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 10px;
            }
            .ninjadash-course-card-author__name{
                font-size: 15px;
                color: ${({theme:e})=>e[e.mainContent]["gray-light-text"]};
            }
            @media only screen and (max-width: 1599px){
                margin-bottom: 15px;
            }
        }
        .ninjadash-course-card-meta{
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            margin-top: -10px;
            margin-bottom: -10px;
            .ninjadash-course-card-meta__pricing{
                font-size: 20px;
                font-weight: 600;
                color: ${({theme:e})=>e["success-color"]};
            }
        }
        .ninjadash-course-card-meta__left{
            margin: 10px 0;
        }
        .ninjadash-course-card-meta__right{
            display: flex;
            align-items: center;
            margin: 5px -5px 5px;
            li{
                display: inline-flex;
                align-items: center;
                min-height: 32px;
                border-radius: 20px;
                padding: 0 15px;
                margin: 5px;
                &.bg-secondary{
                    color: ${({theme:e})=>e[e.mainContent]["secondary-white"]};
                    background-color: rgba(88,64,255,.15);
                    svg{
                        fill: ${({theme:e})=>e[e.mainContent]["secondary-white"]};
                        top: 0;
                    }
                }
                &.bg-primary{
                    color: ${({theme:e})=>e[e.mainContent]["primary-white"]};
                    background-color: rgba(251,53,134,.15);
                    svg{
                        fill: ${({theme:e})=>e[e.mainContent]["primary-white"]};;
                        top: 0;
                    }
                }
                span{
                    font-size: 13px;
                    line-height: 1;
                    font-weight: 500;
                }
                svg{
                    width: 14px;
                    ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 3px;
                }
            }
        }
    }
`;const g=u.Ay.div`
    margin-bottom: 25px;
    .ant-card {
        background-color: ${({theme:e})=>e[e.mainContent]["white-background"]};
        &.ninjadash-overview-halfCircle-card{
            overflow: hidden;
            .ant-card-body {
                padding: 24px 25px 12px !important;
                .ninjadash-overview-card {
                    .ninjadash-overview-card__bottom {
                        margin-top: 0;
                        .ninjadash-overview-status{
                            background-color: transparent;
                            padding: 0;
                        }
                    }
                    .ninjadash-overview-card__top--icon{
                        position: absolute;
                        top: -9px;
                        right: -38%;
                        width: 230px;
                        height: 168px;
                        border-radius: 100%;
                        padding: 0 30px;
                        justify-content: flex-start;
                        @media only screen and (max-width: 1699px){
                            right: -48%;
                        }
                        @media only screen and (max-width: 1599px){
                            right: -20%;
                            top: -12px;
                        }
                        @media only screen and (max-width: 1399px){
                            right: -24%;
                            top: -15px;
                        }
                        @media only screen and (max-width: 991px){
                            right: -35%;
                        }
                        @media only screen and (max-width: 767px){
                            right: -46%;
                            padding: 0 18px;
                        }
                        @media only screen and (max-width: 650px){
                            right: -56%;
                        }
                        @media only screen and (max-width: 575px){
                            right: -30%;
                        }
                        @media only screen and (max-width: 475px){
                            right: -44%;
                            top: -17px;
                        }
                        @media only screen and (max-width: 375px){
                            right: -48%;
                        }
                        svg{
                            width: 40px;
                            @media only screen and (max-width: 767px){
                                width: 30px;
                            }
                        }
                    }
                    .ninjadash-overview-card__top--content{
                        .ninjadahs-overview-label{
                            display: block;
                            margin-bottom: 4px;
                            font-size: 15px;
                        }
                    }
                }
            }
        }
    }
    .ant-card-body{
        padding: 25px 25px !important;
        @media only screen and (max-width: 767px){
            padding: 20px !important;
        }
        @media only screen and (max-width: 575px){
            padding: 15px !important;
        }
        .ninjadash-overview-total {
            color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
        }
        .ninjadash-overview-card{
            .ninjadash-overview-card__top{
                .ninjadash-overview-card__top--icon{
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    @media only screen and (max-width: 767px){
                        width: 48px;
                        height: 48px;
                    }
                    div{
                        line-height: 1;
                    }
                    svg,
                    img{
                        width: 32px;
                        height: 32px;
                    }
                    &.ninjadash-primary{
                        background-color: ${({theme:e})=>e["primary-color"]}15;
                        svg path,
                        i{
                            fill: ${({theme:e})=>e["primary-color"]};
                        }
                    }
                    &.ninjadash-secondary{
                        background-color: ${({theme:e})=>e["secondary-color"]}15;
                        svg path,
                        i{
                            fill: ${({theme:e})=>e["secondary-color"]};
                        }
                    }
                    &.ninjadash-success{
                        background-color: ${({theme:e})=>e["success-color"]}15;
                        svg path,
                        i{
                            fill: ${({theme:e})=>e["success-color"]};
                        }
                    }
                    &.ninjadash-warning{
                        background-color: ${({theme:e})=>e["warning-color"]}15;
                        svg path,
                        i{
                            fill: ${({theme:e})=>e["warning-color"]};
                        }
                    }
                    &.ninjadash-info{
                        background-color: ${({theme:e})=>e["info-color"]}15;
                        svg path,
                        i{
                            fill: ${({theme:e})=>e["info-color"]};
                        }
                    }
                }
                .ninjadash-overview-card__top--content{
                    .ninjadash-overview-total{
                        font-size: 30px;
                        line-height: 1.45;
                        font-weight: 600;
                        margin-bottom: 0;
                        color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
                        @media only screen and (max-width: 991px){
                            font-size: 24px;
                        }
                        @media only screen and (max-width: 767px){
                            font-size: 20px;
                        }
                    }
                    .ninjadahs-overview-label{
                        font-size: 16px;
                        font-weight: 400;
                        color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
                        @media only screen and (max-width: 767px){
                            font-size: 15px;
                        }
                    }
                }
                &.ninjadash-overview-card-theme-2{
                    @media only screen and (min-width: 1200px) and (max-width: 1299px){
                        flex-wrap: wrap;
                        flex-direction: column;
                        .ninjadash-overview-card__top--icon{
                            order: 1 !important;
                            margin-bottom: 10px;
                        }
                        .ninjadash-overview-card__top--content{
                            order: 2;
                        }
                    }
                    .ninjadash-overview-card__top--icon{
                        order: 2;
                    }
                }
            }
            .ninjadash-overview-card__bottom{
                margin-top: 12px;
                .ninjadash-overview-status{
                    display: inline-flex;
                    align-items: center;
                    width: 100%;
                    padding: 0 10px;
                    min-height: 46px;
                    border-radius: 8px;
                    background-color: ${({theme:e})=>e[e.mainContent]["status-background"]};
                    @media only screen and (max-width: 1399px){
                        flex-wrap: wrap;
                        padding-top: 5px;
                        padding-bottom: 8px;
                    }
                    span{
                        font-size: 14px;
                    }
                    .ninjadash-status-label{
                        ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 10px;
                        color: ${({theme:e})=>e[e.mainContent]["gray-light-text"]};
                    }
                    .ninjadash-status-rate{
                        display: flex;
                        align-items: center;
                        font-weight: 500;
                        svg,
                        img{
                            width: 20px;
                            ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: -1px;
                        }
                        .unicon{
                            line-height: 0;
                        }
                    }
                    &.ninjadash-status-upward{
                        .ninjadash-status-rate{
                            color: ${({theme:e})=>e["success-color"]};
                            svg{
                                fill: ${({theme:e})=>e["success-color"]};
                            }
                        }
                    }
                    &.ninjadash-status-downward{
                        .ninjadash-status-rate{
                            color: ${({theme:e})=>e["danger-color"]};
                            svg{
                                fill: ${({theme:e})=>e["danger-color"]};
                            }
                        }
                    }
                }
            }
        }
    }
    &.ninjadash-overview-card-support{
        .ant-card-body{
            padding: 40.5px 25px !important;
        }
    }
`;u.Ay.figure`
    .ninjadash-blog{
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(173,181,217,.05);
        margin-bottom: 25px;
        background-color: ${({theme:e})=>e[e.mainContent]["white-background"]};
        &:hover{
            .ninjadash-blog-thumb{
                &:after{
                    height: 100%;
                }
            }
        }
        .ninjadash-blog-thumb{
            position: relative;
            &:after{
                position:  absolute;
                ${({theme:e})=>e.rtl?"right":"left"}: 0;
                top: 0;
                width: 100%;
                height: 0%;
                content: '';
                border-radius: 10px;
                transition: .35s;
                background-color: ${({theme:e})=>e["dark-color"]}15;
            }
        }
        &.ninjadash-blog-style-3,
        &.ninjadash-blog-style-2{
            padding: 0px;
            .ninjadash-blog__title{
                margin: 15px 0 12px;
            }
            figcaption{
                padding: 0 25px 25px;
            }
            .ninjadash-blog-thumb{
                &:after{
                    border-radius: 10px 10px 0 0;
                }
            }
            .ninjadash-blog__image{
                border-radius: 10px 10px 0 0;
            }
        }
        .ninjadash-blog__image{
            width: 100%;
            border-radius: 10px;
        }
        .ninjadash-blog-meta{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            &.ninjadash-blog-meta-theme-3{
                justify-content: flex-start;
                margin: 7px -3px -3px;
                @media only screen and (max-width: 575px){
                    flex-wrap: wrap;

                }
                .ninjadash-blog-meta__single{
                    position: relative;
                    margin: 3px;
                    &:before{
                        position: absolute;
                        ${({theme:e})=>e.rtl?"right":"left"}: 0;
                        top: calc(50% - 4px);
                        width: 4px;
                        height: 4px;
                        border-radius: 50%;
                        background-color: ${({theme:e})=>e[e.mainContent]["light-text"]};
                    }
                    &:not(:first-child){
                        ${({theme:e})=>e.rtl?"padding-right":"padding-left"}: 10px;
                        &:before{
                            content: '';
                        }
                    }
                }
            }
        }
        .ninjadash-blog-meta__single{
            display: inline-block;
            font-size: 15px;
            color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
        }
        .ninjadash-blog__title{
            font-size: 20px;
            font-weight: 600;
            margin: 10px 0 5px;
            a{
                color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
                &:hover{
                    color: ${({theme:e})=>e["primary-color"]};
                }
            }
        }
        .ninjadash-blog__text{
            font-size: 16px;
            margin-bottom: 15px;
            color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
        }
        .ninjadash-blog__bottom{
            display: flex;
            justify-content: space-between;
        }
        .ninjadash-blog__author{
            .ninjadash-blog__author-img{
                max-width: 32px;
                border-radius: 50%;
            }
            .ninjadash-blog__author-name{
                font-size: 15px;
                ${({theme:e})=>e.rtl?"margin-right":"margin-left"}: 10px;
                color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
            }
        }
        .ninjadash-blog__meta{
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            margin: -9px;
            .ninjadash-blog__meta--item{
                margin: 9px;
                span{
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    line-height: 1;
                    color: ${({theme:e})=>e[e.mainContent]["gray-text"]};
                    svg{
                        width: 12px;
                        height: 12px;
                        ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 4px;
                        fill: ${({theme:e})=>e[e.mainContent]["gray-text"]};
                    }
                }
            }
        }
    }
`,u.Ay.div`
    &.ninjadash-overview-card-single{
        position: relative;
        margin-bottom: 25px;
        &:not(:last-child){
            &:after{
                position: absolute;
                width: 1px;
                height: 70px;
                ${({theme:e})=>e.rtl?"left":"right"}: -60px;
                top: 50%;
                transform: translateY(-50%);
                content: '';
                background-color: ${({theme:e})=>e[e.mainContent]["light-border"]};
            }
        }
				@media only screen and (max-width: 1399px){
					flex: 0 0 50% !important;
					&:not(:last-child){
            &:after{
							content: none;
						}
					}
				}
				@media only screen and (max-width: 575px){
					flex: 0 0 100% !important;
				}
        .ant-card{
            border-radius: 0px;
            background-color: unset;
        }
        &:first-child{
            .ant-card{
                border-radius: 10px 0 0 10px;
            }
        }
        &:last-child{
            .ant-card{
                border-radius: 0 10px 10px 0;
            }
        }
        &:not(:last-child){
            .ninjadash-overview-card{
                position: relative;
                &:after{
                    position: absolute;
                    ${({theme:e})=>e.rtl?"left":"right"}: 0;
                    top: 0;
                    width: 1px;
                    height: 100%;
                    content: '';
                    background-color: ${({theme:e})=>e[e.mainContent].borderLight};
                }
            }
        }
    }

    .ninjadash-overview-card{
        display: flex;
        .ninjadash-overview-card__left{
            .ninjadash-overview-card__left--icon{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 70px;
                height: 70px;
                border-radius: 14px;
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 25px;
                >div{
                    line-height: 1;
                }
                svg{
                    width: 28px;
                    height: auto;
                }
                &.ninjadash-primary{
                    background-color: ${({theme:e})=>e["primary-color"]}15;
                    svg path,
                    i{
                        fill: ${({theme:e})=>e["primary-color"]};
                        color: ${({theme:e})=>e["primary-color"]};
                    }
                }
                &.ninjadash-secondary{
                    background-color: ${({theme:e})=>e["secondary-color"]}15;
                    svg path,
                    i{
                        fill: ${({theme:e})=>e["secondary-color"]};
                        color: ${({theme:e})=>e["secondary-color"]};
                    }
                }
                &.ninjadash-success{
                    background-color: ${({theme:e})=>e["success-color"]}15;
                    svg path,
                    i{
                        fill: ${({theme:e})=>e["success-color"]};
                        color: ${({theme:e})=>e["success-color"]};
                    }
                }
                &.ninjadash-warning{
                    background-color: ${({theme:e})=>e["warning-color"]}15;
                    svg path,
                    i{
                        fill: ${({theme:e})=>e["warning-color"]};
                        color: ${({theme:e})=>e["warning-color"]};
                    }
                }
                &.ninjadash-info{
                    background-color: ${({theme:e})=>e["warning-color"]}15;
                    svg path,
                    i{
                        fill: ${({theme:e})=>e["info-color"]};
                        color: ${({theme:e})=>e["info-color"]};
                    }
                }
                &.ninjadash-danger{
                    background-color: ${({theme:e})=>e["danger-color"]}15;
                    svg path,
                    i{
                        fill: ${({theme:e})=>e["danger-color"]};
                        color: ${({theme:e})=>e["danger-color"]};
                    }
                }
            }
        }
        .ninjadash-overview-card__right{
            display: flex;
            .ninjadash-overview-card__right--content{
                ${({theme:e})=>e.rtl?"margin-left":"margin-right"}: 25px;
                .ninjadash-overview-total{
                    font-size: 30px;
                    line-height: 1.2;
                    font-weight: 600;
                    margin-bottom: 0;
                    color: ${({theme:e})=>e[e.mainContent]["dark-text"]};
                    @media only screen and (max-width: 480px){
                        font-size: 20px;
                    }
                }
                .ninjadahs-overview-label{
                    font-size: 16px;
                    color: ${({theme:e})=>e[e.mainContent]["gray-text"]}
                }
            }
            .ninjadash-overview-status{
                margin-top: 6px;
                &.ninjadash-status-growth{
                    .ninjadash-status-rate{
                        color: ${({theme:e})=>e["success-color"]};
                        svg{
													fill: ${({theme:e})=>e["success-color"]};
												}
                    }
                }
                &.ninjadash-status-down{
                    .ninjadash-status-rate{
                        color: ${({theme:e})=>e["danger-color"]};
                        svg{
													fill: ${({theme:e})=>e["danger-color"]};
												}
                    }
                }
                .ninjadash-status-rate{
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 500;
                    svg{
                        width: 20px;
                        height: 18px;
                    }
                }
            }
        }
    }
`,u.Ay.article`
    ${({theme:e,type:a})=>`\n        background-color: ${e[e.mainContent]["white-background"]};\n        padding: 14px 15px;\n        text-align: center;\n        border-radius: 10px;\n        margin-bottom: 25px;\n        box-shadow: 0px 5px 20px ${e["extra-light-color"]}05;\n\n        .ninjadash-infocard-icon {\n            width: 60px;\n            height: 60px;\n            background-color: ${e[`${a}-color`]}20;\n            color: ${e[`${a}-color`]};\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 28px;\n            margin: 2px auto 10px;\n            border-radius: 8px;\n            svg{\n                width: 34px;\n                height: 32px;\n                fill: ${e[`${a}-color`]};\n            }\n\n        }\n\n        .ninjadash-infocard-text {\n            font-size: 16px;\n            margin-bottom: 0;\n            color: ${e[e.mainContent]["gray-text"]};\n        }\n        .ninjadash-infocard-label {\n            font-size: 30px;\n            font-weight: 500;\n            margin-bottom: 4px;\n            color: ${e[e.mainContent]["dark-text"]};\n        }\n    `}
`,u.Ay.figure`
    ${({theme:e})=>`\n        background-color: ${e[e.mainContent]["white-background"]};\n        padding: 0;\n        text-align: ${e.rtl?"right":"left"};\n        border-radius: 10px;\n        box-shadow: 0px 5px 20px ${e["extra-light-color"]}05;\n        display: flex;\n        align-items: center;\n        justify-content: space-between;\n        width: 100%;\n        margin-bottom: 25px;\n        min-height: 160px;\n        @media only screen and (max-width: 1299px){\n            flex-wrap: wrap;\n            figcaption{\n                margin: 15px 0 0 0;\n            }\n        }\n        @media only screen and (max-width: 480px){\n            flex-wrap: wrap;\n            justify-content: center;\n            text-align:center;\n            figcaption{\n                margin: 20px 0 0 0 !important;\n            }\n        }\n        .newsletter-shape{\n            width: 150px;\n            height: 150px;\n            ${e.rtl?"padding-left":"padding-right"} : 15px;\n            img{\n                max-width: 100%;\n            }\n        }\n        .newsletter-content{\n            padding: 25px;\n            h4 {\n                font-size: 20px;\n                font-weight: 600;\n                line-height: 1;\n                margin: 0 0 10px;\n                color: ${e[e.mainContent]["dark-text"]};\n            }\n            p {\n                font-size: 15px;\n                margin-bottom: 15px;\n                color: ${e[e.mainContent]["gray-text"]}\n            }\n        }\n    `}
`,u.Ay.figure`
  ${({theme:e})=>`\n    width: 100%;\n    min-height: 390px;\n    background-color: ${e[e.mainContent]["white-background"]};\n    text-align: center;\n    border-radius: 10px;\n    box-shadow: 0px 5px 20px ${e["extra-light-color"]}05;\n    position: relative;\n    @media only screen and (max-width: 991px){\n        min-height: auto;\n        margin-bottom: 25px;\n    }\n\n    figcaption {\n        .ninjadash-profile-top-img {\n            position: static;\n            width: 100%;\n        }\n    }\n\n    .ninjadash-profile-content{\n        padding: 0 0 54px;\n        margin-top: -75px;\n        .ninjadash-profile-content__img{\n            margin-bottom: 10px;\n            img{\n                padding: 5px;\n                border-radius: 50%;\n                background-color: #fff;\n            }\n        }\n        .ninjadash-profile-name{\n            font-size: 18px;\n            font-weight: 600;\n            margin-bottom: 2px;\n            color: ${e[e.mainContent]["dark-text"]};\n        }\n        .ninjadash-profile-text{\n            margin-bottom: 18px;\n            color: ${e[e.mainContent]["gray-text"]};\n        }\n    }\n    .ninjadash-profile-socials{\n        display: flex;\n        align-items: center;\n        justify-content: center !important;\n        margin: -5px;\n        li{\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            width: 32px;\n            height: 32px;\n            border-radius: 6px;\n            margin: 5px;\n            span.fa,\n            svg{\n                fill: #fff;\n\t\t\t\t\t\t\t\tcolor: #fff;\n            }\n            &.ninjadash-facebook{\n                background-color: #3B5998;\n            }\n            &.ninjadash-twitter{\n                background-color: #209AE9;\n            }\n            &.ninjadash-dribble{\n                background-color: #FF8000;\n            }\n            a{\n                line-height: 1;\n            }\n        }\n    }\n\n  `}
`;var x=t(19732),f=t(54745);const b=(0,n.pM)({name:"OverviewCards",props:{ocData:x.Ay.object.def({id:"1",type:"primary",icon:"briefcase-alt",total:"100",suffix:"+",prefix:"",label:"Total Products",growth:"downward",growthRate:"15.65",dataPeriod:"Since Last Month",decimal:0}),bottomStatus:x.Ay.bool.def(!0),contentFirst:x.Ay.bool.def(!0),halfCircleIcon:x.Ay.bool.def(!1)},components:{OverviewCard:g,"vue3-autocounter":f.A},setup(){const e=(0,m.KR)(!1);return(0,n.sV)((()=>{setTimeout((()=>{e.value=!0}),200)})),{didViewCountUp:e}}});var v=b,y=t(66262);const w=(0,y.A)(v,[["render",h]]);var $=w},38725:function(e,a,t){t.d(a,{s:function(){return n}});t(44114);function n(e){const a=["#FF8000","#b22222","#cd853f","#8b4513","#ffd700","#f5f5dc","#eee8aa","#8b0000","#a52a2a","#da70d6"];if(!(e>10))return a.slice(0,e);{const n=a;for(let a=0;a<e-10;a++){const e="0123456789ABCDEF".split("");let a="#";for(var t=0;t<6;t++)a+=e[Math.floor(16*Math.random())];n.push(a)}}}},38739:function(e,a,t){t.d(a,{A:function(){return u}});var n=t(20641),r=t(72644);const o=["id"];function i(e,a,t,i,l,s){return(0,n.uX)(),(0,n.CE)("div",{id:e.chartId,style:(0,r.Tr)({height:e.height})},null,12,o)}var l=t(79841),s=t(61781),d=t.n(s),c=t(96763),p=(0,n.pM)({name:"OptimizedApexChart",props:{type:{type:String,required:!0},height:{type:[String,Number],default:"300"},id:{type:String,required:!0},options:{type:Object,default:()=>({})},series:{type:Array,default:()=>[]}},emits:["click"],setup(e,{emit:a}){const t=(0,l.KR)(null),r=(0,l.KR)(`apex-${e.id}-${Date.now()}`),o=(0,l.KR)(""),i=(0,l.KR)(!1),s=()=>JSON.stringify({series:e.series,options:e.options}),p=()=>{const e=s();return e!==o.value&&(o.value=e,!0)},h=()=>{i.value||(0,n.dY)((()=>{const n=document.getElementById(r.value);if(n&&!t.value)try{const r=Array.isArray(e.series)?e.series:[];t.value=new(d())(n,{chart:{type:e.type,height:e.height,animations:{enabled:!0,easing:"easeinout",speed:300,animateGradually:{enabled:!0,delay:50},dynamicAnimation:{enabled:!0,speed:300}},events:{click:(e,t,n)=>{a("click",e,t,n)}}},series:r,...e.options}),t.value.render(),i.value=!0,o.value=s()}catch(l){c.error("ApexChart initialization failed:",l),c.error("Chart props:",{type:e.type,height:e.height,series:e.series,options:e.options})}}))},m=()=>{if(t.value&&p())try{t.value.updateSeries(e.series,!1),t.value.updateOptions(e.options,!1,!1)}catch(a){c.warn("ApexChart update failed:",a),t.value&&(t.value.destroy(),t.value=null,i.value=!1,h())}};return(0,n.sV)((()=>{h()})),(0,n.wB)((()=>e.series),(()=>{i.value?m():h()}),{deep:!0}),(0,n.wB)((()=>e.options),(()=>{i.value&&m()}),{deep:!0}),(0,n.wB)((()=>e.height),((e,a)=>{c.log(`ApexChart height changed from ${a} to ${e}`),t.value&&i.value&&(0,n.dY)((()=>{try{c.log("Triggering ApexChart resize..."),t.value.updateDimensions()}catch(e){c.warn("ApexChart resize failed:",e),t.value&&(t.value.destroy(),t.value=null,i.value=!1,h())}}))})),(0,n.xo)((()=>{t.value&&(t.value.destroy(),t.value=null)})),{chartId:r}}}),h=t(66262);const m=(0,h.A)(p,[["render",i],["__scopeId","data-v-1e96cd28"]]);var u=m},66779:function(e,a,t){t.d(a,{A:function(){return b}});var n=t(20641),r=t(72644);const o={class:"doughnutchart-inner"},i={key:0,class:"doughnutchart-inner-text"},l={key:0,class:"doughnutchart-inner-content"},s={key:1,class:"doughnutchart-inner-content"},d={class:"doughnutchart-inner-label"};function c(e,a,t,c,p,h){const m=(0,n.g2)("DashboardChart");return(0,n.uX)(),(0,n.CE)("div",o,[e.shouldRenderInnerText?((0,n.uX)(),(0,n.CE)("div",i,[""===e.centerTextDisplay?((0,n.uX)(),(0,n.CE)("span",l,(0,r.v_)(e.dataSum)+"%",1)):((0,n.uX)(),(0,n.CE)("span",s,(0,r.v_)(e.centerTextDisplay),1)),(0,n.Lk)("span",d,(0,r.v_)(e.centerTextLabelDisplay),1)])):(0,n.Q3)("",!0),(0,n.bF)(m,{tooltip:e.tooltip,type:"doughnut",datasets:e.datasets,id:e.id,className:e.className,labels:e.labels,height:e.height,options:e.options,legend:e.legend,layout:e.layout,elements:e.elements,scales:e.scales},null,8,["tooltip","datasets","id","className","labels","height","options","legend","layout","elements","scales"])])}t(18111),t(18237),t(13579);var p=t(19732),h=t(19179),m=t(92317),u=t(96763),g=(0,n.pM)({components:{DashboardChart:h.A},props:{height:p.Ay.number.def(479),labels:p.Ay.arrayOf(p.Ay.string).def(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]),datasets:p.Ay.arrayOf(p.Ay.object).def([{data:[20,60,50,45,50,60,70,40,45,35,25,30],borderColor:"#001737",borderWidth:1,fill:!1},{data:[10,40,30,40,60,55,45,35,30,20,15,20],borderColor:"#1ce1ac",borderWidth:1,fill:!1}]),id:p.Ay.string.def("myChart"),className:p.Ay.string.def("myChart"),legend:p.Ay.object.def({display:!1,labels:{display:!1}}),layout:p.Ay.object.def({}),elements:p.Ay.object.def({line:{tension:.5,borderCapStyle:"round",borderJoinStyle:"round",capBezierPoints:!0},point:{radius:0,z:5}}),scales:p.Ay.object.def({y:{display:!1},x:{display:!1}}),tooltip:p.Ay.object.def({}),options:p.Ay.object.def({})},setup(e){const a=()=>{const e=(0,m.Gq)("debug_chart_log");return!0===e||"true"===e||1===e||"1"===e},t=(0,n.EW)((()=>e.datasets&&e.datasets[0]&&e.datasets[0].data?e.datasets[0].data.reduce(((e,a)=>Number(e)+Number(a)),0):0)),r=(0,n.EW)((()=>e.datasets&&e.datasets[0]&&e.datasets[0].centerText||"")),o=(0,n.EW)((()=>e.datasets&&e.datasets[0]&&e.datasets[0].centerTextLabel||"")),i=(0,n.EW)((()=>{const a=e.datasets&&e.datasets[0],t=a&&(null!=a.centerText||null!=a.centerTextLabel);return!t}));return(0,n.wB)((()=>e.height),((e,t)=>{a()&&u.debug(`DoughnutChart height changed from ${t} to ${e}`)})),(0,n.wB)((()=>e.datasets),(e=>{if(a()&&u.debug("DoughnutChart datasets changed:",e),!e||0===e.length)return void(a()&&u.warn("DoughnutChart: datasets are empty, keeping existing data"));const t=e.some((e=>e.data&&Array.isArray(e.data)&&e.data.length>0));t||a()&&u.warn("DoughnutChart: no valid data in datasets, keeping existing data")}),{deep:!0}),(0,n.wB)((()=>e.labels),(e=>{a()&&u.debug("DoughnutChart labels changed:",e),e&&0!==e.length||a()&&u.warn("DoughnutChart: labels are empty")}),{deep:!0}),{dataSum:t,centerTextDisplay:r,centerTextLabelDisplay:o,shouldRenderInnerText:i}}}),x=t(66262);const f=(0,x.A)(g,[["render",c],["__scopeId","data-v-1ed9dd2a"]]);var b=f},70063:function(e,a,t){t.d(a,{A:function(){return v}});var n=t(20641),r=t(72644),o=t(9322);const i={class:"subtitle"},l=["onClick"];function s(e,a,t,s,d,c){const p=(0,n.g2)("a-input"),h=(0,n.g2)("a-form-item"),m=(0,n.g2)("a-select-option"),u=(0,n.g2)("a-select"),g=(0,n.g2)("a-row"),x=(0,n.g2)("TagFilter"),f=(0,n.g2)("GroupFilter"),b=(0,n.g2)("a-spin"),v=(0,n.g2)("sdButton"),y=(0,n.g2)("a-form"),w=(0,n.g2)("ModalWrapper");return(0,n.uX)(),(0,n.Wv)(w,null,{default:(0,n.k6)((()=>[(0,n.bF)(y,{model:e.formState,"label-col":e.labelCol,"wrapper-col":e.wrapperCol,labelAlign:"left",rules:e.rules,onFinish:e.submit},{default:(0,n.k6)((()=>["card"!==e.formState.chartType?((0,n.uX)(),(0,n.Wv)(h,{key:0,label:"圖表名稱",name:"name"},{default:(0,n.k6)((()=>[(0,n.bF)(p,{value:e.formState.name,"onUpdate:value":a[0]||(a[0]=a=>e.formState.name=a)},null,8,["value"])])),_:1})):(0,n.Q3)("",!0),(0,n.bF)(h,{label:"圖表種類"},{default:(0,n.k6)((()=>[(0,n.bF)(u,{value:e.formState.chartType,"onUpdate:value":a[1]||(a[1]=a=>e.formState.chartType=a)},{default:(0,n.k6)((()=>[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.chartTypeOptions,(e=>((0,n.uX)(),(0,n.Wv)(m,{key:e.id,value:e.id,label:e.name},{default:(0,n.k6)((()=>[(0,n.eW)((0,r.v_)(e.name),1)])),_:2},1032,["value","label"])))),128))])),_:1},8,["value"])])),_:1}),"radialBar"===e.formState.chartType?((0,n.uX)(),(0,n.Wv)(h,{key:1,label:"上限值",name:"limit"},{default:(0,n.k6)((()=>[(0,n.bF)(p,{value:e.formState.limit,"onUpdate:value":a[2]||(a[2]=a=>e.formState.limit=a),valueModifiers:{number:!0}},null,8,["value"])])),_:1})):(0,n.Q3)("",!0),(0,n.bF)(h,{label:"日期區間"},{default:(0,n.k6)((()=>[(0,n.bF)(u,{value:e.formState.timePeriod,"onUpdate:value":a[3]||(a[3]=a=>e.formState.timePeriod=a),style:{width:"100%"}},{default:(0,n.k6)((()=>[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.showTimePeriodOptions,(e=>((0,n.uX)(),(0,n.Wv)(m,{key:e.id,value:e.id},{default:(0,n.k6)((()=>[(0,n.eW)((0,r.v_)(e.name),1)])),_:2},1032,["value"])))),128))])),_:1},8,["value"])])),_:1}),"line"!==e.formState.chartType?((0,n.uX)(),(0,n.Wv)(h,{key:2,label:"參數統計方式"},{default:(0,n.k6)((()=>[(0,n.bF)(u,{value:e.formState.paramSummary,"onUpdate:value":a[4]||(a[4]=a=>e.formState.paramSummary=a)},{default:(0,n.k6)((()=>[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.paramSummaryOptions,(e=>((0,n.uX)(),(0,n.Wv)(m,{key:e.value,value:e.value,label:e.label},{default:(0,n.k6)((()=>[(0,n.eW)((0,r.v_)(e.label),1)])),_:2},1032,["value","label"])))),128))])),_:1},8,["value"])])),_:1})):(0,n.Q3)("",!0),999!==e.formState.timePeriod?((0,n.uX)(),(0,n.Wv)(h,{key:3,label:"原始資料統計方式"},{default:(0,n.k6)((()=>[(0,n.bF)(u,{value:e.formState.summary,"onUpdate:value":a[5]||(a[5]=a=>e.formState.summary=a)},{default:(0,n.k6)((()=>[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.summaryTypeOptions,(e=>((0,n.uX)(),(0,n.Wv)(m,{key:e.value,value:e.value,label:e.label},{default:(0,n.k6)((()=>[(0,n.eW)((0,r.v_)(e.label),1)])),_:2},1032,["value","label"])))),128))])),_:1},8,["value"])])),_:1})):(0,n.Q3)("",!0),(0,n.bF)(h,{label:"單位"},{default:(0,n.k6)((()=>[(0,n.bF)(u,{value:e.formState.unit,"onUpdate:value":a[6]||(a[6]=a=>e.formState.unit=a),style:{width:"100%"}},{default:(0,n.k6)((()=>[((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.unitOptions,(e=>((0,n.uX)(),(0,n.Wv)(m,{key:e.Id,value:e.Id,label:e.Name},{default:(0,n.k6)((()=>[(0,n.eW)((0,r.v_)(e.Name),1)])),_:2},1032,["value","label"])))),128))])),_:1},8,["value"])])),_:1}),((0,n.uX)(!0),(0,n.CE)(n.FK,null,(0,n.pI)(e.formState.params,((a,t)=>((0,n.uX)(),(0,n.CE)("div",{key:t},[e.formState.params.length>1?((0,n.uX)(),(0,n.Wv)(g,{key:0,justify:"space-between",align:"middle",class:"subtitle-row"},{default:(0,n.k6)((()=>[(0,n.Lk)("span",i,(0,r.v_)(`參數${t+1}`),1),(0,n.Lk)("span",{class:"delete-btn",onClick:a=>e.delBlock(t)},"刪除區塊",8,l)])),_:2},1024)):(0,n.Q3)("",!0),!e.checkSchemeLength(e.formState.chartType)||e.checkSchemeLength(e.formState.chartType)>1?((0,n.uX)(),(0,n.Wv)(h,{key:1,label:"參數名稱",name:"params"},{default:(0,n.k6)((()=>[(0,n.bF)(p,{value:a.name,"onUpdate:value":e=>a.name=e},null,8,["value","onUpdate:value"])])),_:2},1024)):(0,n.Q3)("",!0),(0,n.bF)(h,{label:"測點列表"},{default:(0,n.k6)((()=>[(0,n.bF)(x,{multiple:"line"!==e.formState.chartType,selectedTags:"line"!==e.formState.chartType?e.formState.params[t].tags:[],value:"line"===e.formState.chartType?e.formState.params[t].tags[0]:null,onSetTags:a=>e.setTags(a,t),onSetSingleTag:a=>e.setTags(a,t)},null,8,["multiple","selectedTags","value","onSetTags","onSetSingleTag"])])),_:2},1024),"line"!==e.formState.chartType?((0,n.uX)(),(0,n.Wv)(h,{key:2,label:"群組列表"},{default:(0,n.k6)((()=>[(0,n.bF)(f,{selectedGroups:e.formState.params[t].groups,onSetGroups:a=>e.setGroups(a,t)},null,8,["selectedGroups","onSetGroups"])])),_:2},1024)):(0,n.Q3)("",!0),"card"!==e.formState.chartType?((0,n.uX)(),(0,n.Wv)(h,{key:3,label:"顏色"},{default:(0,n.k6)((()=>[(0,n.bF)(p,{value:a.color,"onUpdate:value":e=>a.color=e,type:"color"},null,8,["value","onUpdate:value"])])),_:2},1024)):(0,n.Q3)("",!0)])))),128)),!e.checkSchemeLength(e.formState.chartType)||e.formState.params.length<e.checkSchemeLength(e.formState.chartType)?((0,n.uX)(),(0,n.CE)("div",{key:4,class:"addblock",onClick:a[7]||(a[7]=(...a)=>e.newBlock&&e.newBlock(...a))}," + 新增區塊 ")):(0,n.Q3)("",!0),(0,n.bF)(v,{"html-type":"submit",class:"act-btn",type:"primary"},{default:(0,n.k6)((()=>[(0,n.eW)(" 儲存 "),(0,n.bo)((0,n.bF)(b,{size:"small"},null,512),[[o.aG,e.loading]])])),_:1})])),_:1},8,["model","label-col","wrapper-col","rules","onFinish"])])),_:1})}t(1532);var d=t(30995),c=(t(44114),t(18111),t(22489),t(61701),t(79841)),p=t(40834),h=t(95853);const m=h.Ay.div`
    .subtitle-row{
        margin-bottom:1rem
        color:${({theme:e})=>e["primary-color"]}
        .delete-btn{
            cursor:pointer
        }
        .subtitle{
            font-size:18px
            font-weight:500
        }
    }

    .addblock{
        border:2px dashed ${({theme:e})=>e["primary-color"]}
        color: ${({theme:e})=>e["primary-color"]}
        font-size:16px
        text-align:center
        padding:0.5rem
        margin-bottom:1.5rem
        cursor:pointer
    }
`;var u=t(95943),g=t(68237),x=(0,n.pM)({props:{sourceData:{type:Object,required:!0},chartTypeOptions:{type:Array,default:()=>[]},timePeriodOptions:{type:Array,default:()=>[]},summaryTypeOptions:{type:Array,default:()=>[]},detailPeriodOptions:{type:Array,default:()=>[]},unitOptions:{type:Array,default:()=>[]},paramSummaryOptions:{type:Array,default:()=>[]}},components:{ModalWrapper:m,TagFilter:u.A,GroupFilter:g.A},setup(e,{emit:a}){const{state:t}=(0,p.Pj)(),r=(0,n.EW)((()=>t.dashboard.loading)),o=(0,n.EW)((()=>"line"===m.chartType?e.timePeriodOptions.slice(1):e.timePeriodOptions)),i=[{id:"line",params:10},{id:"doughnut",params:10},{id:"bar",params:10},{id:"radialBar",params:1},{id:"card",params:2}],l=e=>e?i.find((a=>a.id===e)).params:0,s={lg:8,md:9,xs:24},h={lg:16,md:15,xs:24},m=(0,c.Kh)({});Object.assign(m,JSON.parse(JSON.stringify(e.sourceData))),(0,n.wB)((()=>m.chartType),(()=>{m.params=[{name:null,tags:[],groups:[],color:"#000000"}]}));const u={name:[{required:!0,message:"請輸入圖表名稱",trigger:"blur"}],limit:[{required:!0,message:"請輸入上限值",trigger:"blur"}],params:[{required:!0,validator:(e,a,t)=>{a.filter((e=>!e.name)).length>0?t("請填參數名稱"):t()},trigger:"blur"}]},g=(e,a)=>{m.params[a].groups=e.map((e=>e.id));const t=e.map((e=>e.tags.map((e=>e.Id)))).flat();m.params[a].groupTags=t},x=(e,a)=>{"line"!==m.chartType?m.params[a].tags=e.map((e=>e.id)):m.params[a].tags=e.value?[e.value]:[]},f=()=>{m.params.push({name:null,tags:[],groups:[],color:"#000000"})},b=e=>{d.A.confirm({title:"確認刪除?",okText:"確認",cancelText:"取消",onOk:()=>{m.params.splice(e,1)}})},v=()=>{a("submit",(0,c.ux)(m))};return{loading:r,checkSchemeLength:l,labelCol:s,wrapperCol:h,formState:m,rules:u,setGroups:g,setTags:x,showTimePeriodOptions:o,newBlock:f,delBlock:b,submit:v}}}),f=t(66262);const b=(0,f.A)(x,[["render",s]]);var v=b},80587:function(e,a,t){function n(e,a=2){return"number"!==typeof e?null:e.toFixed(a).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,")}function r(e,a){function t(e){const a=["日","一","二","三","四","五","六"];return a[parseInt(e,10)-1]}const n=1===a?"":a,r=e.split(" "),o=r[0],i=r[1],l=r[2],s=r[3],d=r[4],c=r[5];let p="";if("*"!==s&&"*"!==d)p+=`每${n}年 ${d} 月 ${s} 日 ${l} 時 ${i} 分 ${o} 秒`;else if("*"!==c){const e=c.split("#")[1];p+=e?`每${n}月第 ${e} 個 週${t(e)} ${l} 時 ${i} 分 ${o} 秒`:`每${n}週 ${t(c)} ${l} 時 ${i} 分 ${o} 秒`}else"*"!==s&&"*"===d?p+=`每${n}月 第 ${s} 天 ${l} 時 ${i} 分 ${o} 秒`:"*"!==o&&"*"!==i&&"*"!==l&&(p+=`每${n}日 ${l} 時 ${i} 分 ${o} 秒`);return p}function o(e){const a=Math.floor(e/3600),t=Math.floor(e%3600/60),n=Math.floor(e%3600%60),r=a<10?"0"+a:a,o=t<10?"0"+t:t,i=n<10?"0"+n:n;return`${r}:${o}:${i}`}t.d(a,{Op:function(){return r},Vy:function(){return o},s_:function(){return n}})}}]);