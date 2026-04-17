"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[2049],{2123:function(t,e,n){n.d(e,{qu:function(){return o}});var i=n(95853);i.Ay.div`
  background: ${({theme:t})=>t[t.mainContent]["white-background"]};
  border-radius: 10px;
  box-shadow: 0px 5px 20px #9299B830;
  padding: 30px;
  .pricing-badge{
    height: 32px;
    padding: 6px 22.6px;
  }
  .price-amount{
    font-size: 36px;
    margin-bottom: 10px;
    .currency{
      font-size: 16px;
      font-weight: 600;
      top: -12px;
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 2px;
      color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
    }
    .pricing-validity{
      font-size: 13px;
      font-weight: 400;
      bottom: 0;
      ${({theme:t})=>t.rtl?"right":"left"}: -2px;
      color: ${({theme:t})=>t["light-color"]};
    }
  }
  .package-user-type{
    font-size: 13px;
    font-weight: 500;
    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
  }
  .pricing-title{
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  button{
    padding: 0px 29.32px;
    height: 44px;
    border-radius: 6px;
    &.ant-btn-white{
      border: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-secondary"]} !important;
      span{
        color: #272b41;
      }
    }
  }
`,i.Ay.div`
  margin: 28px 0 15px;
  min-height: 210px;
  .list-single{
    display: flex;
    align-items: center;
		color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
    &:not(:last-child){
      margin-bottom: 12px;
    }
    .icon{
      display: inline-block;
      margin: ${({theme:t})=>t.rtl?"0px 0 -4px 10px":"0px 10px -4px 0"};
    }
  }
`,(0,i.Ay)("span",["type"])`
  display: inline-block;
  margin-bottom: 32px;
  padding: 5px 20px;
  border-radius: 16px;
  background: ${({type:t,theme:e})=>e[`${t}-color`]}10;
  color: ${({type:t,theme:e})=>e[`${t}-color`]};
  font-size: 13px;
  font-weight: 500;
`,i.Ay.nav`
  background: ${({theme:t})=>t[t.mainContent]["white-background"]};
  margin-bottom: 25px;
  border-radius: 10px;
  padding: 0px 16px;
  @media only screen and (max-width: 767px){
    padding: 0 12px;
  }
  @media only screen and (max-width: 575px){
    text-align: center;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    li {
      display: inline-block;
      a {
        position: relative;
        display: block;
        padding: 15px 0;
        margin: 0 12px;
        color: ${({theme:t})=>t["light-color"]};
        @media only screen and (max-width: 767px){
          margin: 0 10px;
        }
        &:after{
          position: absolute;
          ${({theme:t})=>t.rtl?"right":"left"}: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          border-radius: 10px;
          opacity: 0;
          visibility: hidden;
          background: ${({theme:t})=>t["primary-color"]};
          content: "";
        }
        &.active{
          color: ${({theme:t})=>t["primary-color"]};
          &:after{
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
`,i.Ay.nav`
  border-radius: 10px;
  background: ${({theme:t})=>t[t.mainContent]["white-background"]};
  box-shadow: 0 5px 20px ${({theme:t})=>t["light-color"]}03;
  figure{
    margin-bottom: 0;
  }
  .gallery-single-content{
    padding: 18px 25px 20px;
    .gallery-single-title{
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    p{
      font-size: 13px;
      margin-bottom: 0px;
      color: ${({theme:t})=>t[t.mainContent]["light-text"]};
    }
  }
`;const o=i.Ay.div`
  text-align: center;
  .user-card{
    &.theme-list{
      .ant-card-body{
        padding: 30px 25px 30px 30px !important;
        @media only screen and (max-width: 479px){
          padding: 25px 20px 25px 20px !important;
        }
      }
      figure{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        @media only screen and (max-width: 479px){
          flex-flow: column;
        }
        @media only screen and (max-width: 379px){
          align-items: center;
        }
        img{
          max-width: 80px;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}:20px;
          @media only screen and (max-width: 479px){
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}:0px;
          }
        }
      }
      figcaption{
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        text-align: left;
        width: 100%;
        @media only screen and (max-width: 379px){
          flex-flow: column;
          align-items: center;
          text-align: center;
        }
      }
      .card__content{
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
        p{
          max-width: 400px;
          font-size: 15px;
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
        .card__designation{
            font-size: 13px;
            margin-bottom: 15px;
            color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
        }
        .card-text{
          margin-bottom: 12px;
        }
        .card-info{
          margin-bottom: 0;
          .user-meta{
            font-size: 14px;
            strong{
              font-weight: 600;
              color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            }
          }
          .user-meta + .user-meta{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
          }
        }
      }
      .card__actions{
        text-align: ${({theme:t})=>t.rtl?"left":"right"};
        flex-flow: column;
        @media only screen and (max-width: 379px){
          margin-top: 15px;
          width: 100%;
        }
        button{
          padding: 0px 19.05px;
          min-width: 114px;
        }
      }
    }
    &.theme-grid-2{
      .ant-card-body{
        padding: 0 !important;
      }
      figure{
        position: relative;
      }
      .user-card__img{
        margin-bottom: 0;
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 132px;
        height: 132px;
        border-radius: 50%;
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        z-index: 22;
        img{
          position: relative;
          top: 6px;
        }
      }
      .user-card__bg{
        background-size: cover !important;
        background-position: center !important;
        border-radius: 10px 10px 0 0;
      }
      .card__bottom{
        position: relative;
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        top: -26px;
        padding-top: 102px;
        border-radius: 30px 30px 10px 10px;
      }
      .card__actions{
        @media only screen and (max-width: 1499px){
          flex-direction: row;
        }
      }
    }
    &.theme-grid-3{
      .ant-card{
        text-align: left;
      }
      .ant-card-body{
        padding: 0 !important;
      }
      .card__top,
      .card__content,
      .card__info{
        padding: 0 30px;
      }
      .card__top{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 30px;
        margin-bottom: 10px;
        .user-card__img{
          margin-right: 12px;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
          img{
            max-width: 70px;
          }
        }
        .user-card__info{
          width: 100%;
          position: relative;
          .action-more{
            position: absolute;
            right: 0;
            ${({theme:t})=>t.rtl?"left":"right"}: 0;
            top: 0;
            svg {
              fill: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
            }
            color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
          }
          .card__designation{
            margin-bottom: 0;
          }
        }
      }
      .card__content{
        p{
          font-size: 15px;
          margin-bottom: 26px;
          color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
        .image-group{
          margin: -3px;
        }
        img{
          max-width: 34px;
          margin: 3px;
        }
      }
      .card__info{
        padding-bottom: 30px;
        padding-top: 18px;
        .ant-progress-inner{
          position: relative !important;
        }
        p{
          font-size: 12px;
          color: ${({theme:t})=>t[t.mainContent]["light-text"]};
        }
        h2{
          font-size: 14px;
          font-weight: 500;
          margin-top: 4px;
          margin-bottom: 16px;
        }
        h2.info-line {
          color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
        .info-line{
          display: flex;
          justify-content: space-between;
					color: ${({theme:t})=>t[t.mainContent]["gray-text"]}
          .success{
            color: ${({theme:t})=>t["success-color"]};
          }
        }
        .completed-count{
          margin-top: 4px;
					color: ${({theme:t})=>t[t.mainContent]["gray-text"]}
        }
        .project-progress{
          display: flex;
          justify-content: space-between;
          .progress-percentage{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
            span{
              font-size: 12px;
              color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
            }
          }
        }
      }
    }
  }
  .card{
    position: relative;
    box-shadow: 0 5px 20px ${({theme:t})=>t[t.mainContent]["light-text"]}03;
    .ant-card-body{
      padding: 25px !important;
      @media only screen and (max-width: 575px){
        padding: 15px !important;
      }
      div{
        position: static;
      }
    }
    figure{
      margin-bottom: 0;
      img{
        margin-bottom: 20px;
        width: 100%;
        border-radius: 50%;
        max-width: 150px;
      }
    }
    .card__more_actions{
      position: absolute;
      ${({theme:t})=>t.rtl?"left":"right"}: 24px;
      top: 20px;
      line-height: .5;
      padding: 5px 3px;
      border-radius: 10px;
      color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
      box-shadow: none;
      svg,
      img{
        width: 20px;
      }
    }
    .card__name{
      font-size: 16px;
      margin-bottom: 6px;
      font-weight: 500;
      a{
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        &:hover{
          color: ${({theme:t})=>t["primary-color"]};
        }
      }
    }
    .card__designation{
      font-size: 13px;
      margin-bottom: 25px;
      color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
    }
    .card__social{
      margin-top: 16px;
      a{
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px ${({theme:t})=>t[t.mainContent]["light-text"]}15;
        background: ${({theme:t})=>t[t.mainContent]["main-background-light"]};
        &:not(:last-child){
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
        }
        &.facebook svg{
          color: #3B5998;
        }
        &.twitter svg{
          color: #1DA1F2;
        }
        &.dribble svg{
          color: #C2185B;
        }
        &.instagram svg{
          color: #FF0300;
        }
      }
    }
  }

  .user-card{
    .ant-card-body{
      padding: 30px 25px 18px 25px !important;
      @media only screen and (max-width: 1599px){
        padding: 20px  20px 20px !important;
      }
      @media only screen and (max-width: 767px){
        padding: 15px  15px 15px !important;
      }
    }
    figure{
      img{
        margin-bottom: 18px;
        max-width: 120px;
      }
    }
    .card__actions{
      margin: -5px;
      display: flex;
      justify-content: center;
      @media only screen and (max-width: 1499px){
        flex-direction: column;
      }
      .ant-btn-white{
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]} !important;
        border: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]} !important;
        &:hover{
          border: 1px solid ${({theme:t})=>t["primary-color"]} !important;
        }
        svg{
          fill: ${({theme:t})=>t[t.mainContent]["gray-text"]} !important;
        }
      }
      button{
        font-size: 13px;
        padding: 0px 22.7px;
        height: 38px;
        border-radius: 6px;
        box-shadow: 0px 3px 5px ${({theme:t})=>t[t.mainContent]["light-text"]}05;
        margin: 5px;
        &:hover{
          color: #fff !important;
          background-color: ${({theme:t})=>t["primary-color"]} !important;
          svg{
            fill: #fff;
          }
        }
        svg{
          fill: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
        i{
          color: ${({theme:t})=>t[t.mainContent]["light-text"]};
        }
      }
    }
    .card__info{
      padding-top: 20px;
      margin-top: 18px;
      border-top: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
      .info-single{
        text-align: center;
      }
      .info-single__title{
        font-size: 16px;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: 4px;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      }
      p{
        margin-bottom: 0;
        color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
      }
    }
  }
`;i.Ay.div`
  .faq-badge{
    font-weight: 400;
    color: ${({theme:t})=>t["light-color"]};
    background: ${({theme:t})=>t["bg-color-light"]};
  }
  ul{
    li{
      a{
        display: inline-block;
        font-weight: 500;
        position: relative;
        padding: ${({theme:t})=>t.rtl?"12px 20px 12px 0":"12px 0 12px 20px"};
        transition: all .3s ease;
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        &.active{
          padding-left: 28px;
          &:before{
            opacity: 1;
            visibility: visible;
            ${({theme:t})=>t.rtl?"right":"left"}: -15px;
          }
          &:after{
            ${({theme:t})=>t.rtl?"right":"left"}: 5px;
          }
          &.primary{
            background: none;
            &:after{
              background: ${({theme:t})=>t["primary-color"]};
            }
          }
          &.secondary{
            background: none;
            &:after{
              background: ${({theme:t})=>t["secondary-color"]};
            }
          }
          &.success{
            background: none;
            &:after{
              background: ${({theme:t})=>t["success-color"]};
            }
          }
          &.warning{
            background: none;
            &:after{
              background: ${({theme:t})=>t["warning-color"]};
            }
          }
          &.info{
            background: none;
            &:after{
              background: ${({theme:t})=>t["info-color"]};
            }
          }
          &.danger{
            background: none;
            &:after{
              background: ${({theme:t})=>t["danger-color"]}5;
            }
          }
        }
        &:before{
          position: absolute;
          ${({theme:t})=>t.rtl?"right":"left"}: -25px;
          top: 0;
          height: 100%;
          width: 2px;
          border-radius: 10px;
          opacity: 0;
          visibility: hidden;
          content: '';
          background: ${({theme:t})=>t["primary-color"]};
          transition: all .3s ease;
        }
        &:after{
          position: absolute;
          ${({theme:t})=>t.rtl?"right":"left"}: 0;
          top: 50%;
          transform: translatey(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          content: '';
          background: ${({theme:t})=>t["primary-color"]}50;
          transition: all .3s ease;
        }
        &.secondary{
          &:after{
            background: ${({theme:t})=>t["secondary-color"]}50;
          }
          &:before{
            background: ${({theme:t})=>t["secondary-color"]};
          }
        }
        &.success{
          &:after{
            background: ${({theme:t})=>t["success-color"]}50;
          }
          &:before{
            background: ${({theme:t})=>t["success-color"]};
          }
        }
        &.warning{
          &:after{
            background: ${({theme:t})=>t["warning-color"]}50;
          }
          &:before{
            background: ${({theme:t})=>t["warning-color"]};
          }
        }
        &.info{
          &:after{
            background: ${({theme:t})=>t["info-color"]}50;
          }
          &:before{
            background: ${({theme:t})=>t["info-color"]};
          }
        }
        &.danger{
          &:after{
            background: ${({theme:t})=>t["danger-color"]}50;
          }
          &:before{
            background: ${({theme:t})=>t["danger-color"]};
          }
        }
        &.primary,
        &.secondary,
        &.info,
        &.success,
        &.warning,
        &.danger{
          background: none;
        }
      }
    }
  }
`,i.Ay.div`
  text-align: center;
  .ant-card-body{
    padding: 30px 50px 40px 50px !important;
    @media only screen and (max-width: 1599px){
      padding: 30px !important;
    }
    @media only screen and (max-width: 991px){
      padding: 25px !important;
    }
  }
  figure{
    margin-bottom: 30px;
    img{
      width: 100%;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 20px;
    color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
  }
  button{
    padding: 0 30px;
    border-radius: 6px;
    height: 44px;
  }
`,i.Ay.div`
  .ant-card{
    .ant-card-body{
      h1{
        font-weight: 500;
      }
    }
  }
  .ant-collapse{
    margin-top: 25px;
    &.ant-collapse-borderless{
      background: ${({theme:t})=>t[t.mainContent]["white-background"]};
    }
    &.ant-collapse-icon-position-left{
      .ant-collapse-header{
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]} !important;
				> div{
					line-height: 0;
				}
      }
    }
  }
  .ant-collapse-item{
    border: 1px solid ${({theme:t})=>t[t.mainContent]["light-border"]} !important;
    margin-bottom: 5px;
    &.ant-collapse-item-active{
      box-shadow: 0px 15px 40px ${({theme:t})=>t["light-color"]}15;
    }
    .ant-collapse-header{
      font-weight: 500;
      font-size: 15px;
      background-color: #fff;
      padding: 18px 25px !important;
      border-radius: 5px !important;
      @media only screen and (max-width: 575px){
        padding: ${({theme:t})=>t.rtl?"15px 15px 15px 45px":"15px 45px 15px 15px"} !important;
      }
      .ant-collapse-arrow{
        ${({theme:t})=>t.rtl?"right":"left"}: auto !important;
        ${({theme:t})=>t.rtl?"left":"right"}: 25px !important;
        top: 22px !important;
        transform: translateY(0) !important;
      }
    }
  }

  .ant-collapse-content{
    background-color: ${({theme:t})=>t[t.mainContent]["white-background"]} !important;
    box-shadow: 0 15px 40px ${({theme:t})=>t["light-color"]}15;
    .ant-collapse-content-box{
      border-top: 1px solid ${({theme:t})=>t[t.mainContent]["light-border"]} !important;
      padding: 20px 25px 30px !important;
      P{
        font-size: 15px;
        margin-bottom: 35px;
        line-height: 1.667;
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6{
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 12px;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      }
      .panel-actions{
        display: flex;
        button{
          height: 36px;
          padding: 0 15px;
          &:not(:last-child){
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
      }
    }
  }
`,i.Ay.div`
  .ant-select{
    @media only screen and (max-width: 575px){
      width: 100% !important;
    }
  }
  .ant-select-selector{
    height: 48px !important;
    .ant-select-selection-search{
      height: 48px;
      width: 100% !important;
      input{
        height: 46px !important;
      }
    }
    .ant-input-affix-wrapper{
      border: 0 none;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }
    .ant-select-selection-search-input {
      border-radius: 100px;
    }
  }
  .ant-input-suffix{
    i{
      font-size: 14px;
      top: 0 !important;
    }
    svg{
      width: 14px;
      height: 14px;
    }
  }
  .search-filter-menu{
    margin: 22px 0 20px;
    @media only screen and (max-width: 575px){
      text-align: center;
    }
    ul{
      li{
        display: inline-block;
        margin-bottom: 10px;
        &:not(:last-child){
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
        }
        a{
          font-size: 13px;
          font-weight: 500;
          display: block;
          padding: 5px 15px;
          border-radius: 5px;
          color: ${({theme:t})=>t["light-color"]};
          box-shadow: 0 3px 6px ${({theme:t})=>t["light-color"]}05;
          background: ${({theme:t})=>t[t.mainContent]["white-background"]};
          &.active{
            color: #fff;
            background: ${({theme:t})=>t["primary-color"]};
          }
        }
      }
    }
  }
  .search-page-input{
    .ant-select-selector .ant-select-selection-search .ant-input-affix-wrapper{
      background: ${({theme:t})=>t[t.mainContent]["white-background"]} !important;
      input.ant-input{
        background: ${({theme:t})=>t[t.mainContent]["white-background"]} !important;
      }
    }
  }
`,i.Ay.div`
  .result-list-top{
    max-width: 1000px;
    border-bottom: 1px solid ${({theme:t})=>t[t.mainContent]["light-border"]};
    margin-bottom: 20px;
    padding-bottom: 24px;
  }
  .search-found-text{
    font-size: 16px;
    margin-bottom: 0;
    color: ${({theme:t})=>t["light-color"]};
    .result-count{
      ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 5px;
    }
    .result-keyword{
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 4px;
    }
    .result-count,
    .result-keyword{
      font-weight: 600;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
    }
  }
  .result-limit{
    text-align: ${({theme:t})=>t.rtl?"left":"right"};
    margin-bottom: 0;
    color: ${({theme:t})=>t["light-color"]};
    @media only screen and (max-width: 767px){
      text-align: ${({theme:t})=>t.rtl?"right":"left"};
      margin-top: 10px;
    }
  }
  .result-list-content{
    border-bottom: 1px solid ${({theme:t})=>t[t.mainContent]["light-border"]};
    padding-bottom: 14px;
    margin-bottom: 30px;
    ul{
      li{
        &:not(:last-child){
          margin-bottom: 35px;
        }
        .result-list-title{
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 10px;
          .search-keyword{
            font-weight: 600;
            color: ${({theme:t})=>t["primary-color"]};
          }
        }
        p{
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
      }
    }
  }
  .ant-pagination{
    @media only screen and (max-width: 575px){
      text-align: center;
    }
  }
`,i.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  img{
    margin-bottom: 72px;
    max-width: 400px;
    width: 100%;
    @media only screen and (max-width: 575px){
      margin-bottom: 30px;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 15px;
  }
  p{
    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
  }
`,i.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  img{
    margin-bottom: 100px;
    max-width: 400px;
    width: 100%;
    @media only screen and (max-width: 575px){
      margin-bottom: 30px;
    }
  }
  .error-text{
    font-size: 60px;
    font-weight: 600;
    margin-bottom: 35px;
    color: ${({theme:t})=>t["extra-light-color"]};
  }
  p{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 26px;
  }
  button{
    height: 44px;
  }
`,i.Ay.div`
  text-align: center;
  background: ${({theme:t})=>t[t.mainContent]["white-background"]};
  padding: 75px 0 30px;
  margin-bottom: 30px;
  @media only screen and (max-width: 1150px){
    padding: 50px 0 6px;
  }
  @media only screen and (max-width: 991px){
    padding: 20px 0 0px;
  }
  .ninjadash-logo{
    margin-bottom: 55px;
    @media only screen and (max-width: 1150px){
      margin-bottom: 30px;
    }
    @media only screen and (max-width: 767px){
      margin-bottom: 25px;
    }
    img{
      max-width: 170px;
    }
  }
  .coming-soon-content{
    h1{
      font-size: 58px;
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 25px;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      @media only screen and (max-width: 991px){
        font-size: 48px;
        margin-bottom: 15px;
      }
      @media only screen and (max-width: 767px){
        font-size: 40px;
        line-height: 1.45;
      }
      @media only screen and (max-width: 479px){
        font-size: 30px;
      }
      @media only screen and (max-width: 375px){
        font-size: 20px;
      }
    }
    p{
      font-size: 17px;
      max-width: 580px;
      margin: 0 auto 25px;
      color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
      @media only screen and (max-width: 991px){
        margin-bottom: 15px;
      }
      @media only screen and (max-width: 767px){
        font-size: 16px;
      }
      @media only screen and (max-width: 375px){
        font-size: 15px;
      }
    }
  }
  .countdwon-data{
    display: flex;
    justify-content: center;
    >span{
      &:not(:last-child){
        margin-right: 50px;
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 50px;
        @media only screen and (max-width: 575px){
          margin-right: 20px;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
        }
      }
    }
  }
  .ninjadash-countdown{
    .countdown-time{
      font-size: 42px;
      font-weight: 600;
      line-height: 1.45;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      @media only screen and (max-width: 991px){
        font-size: 32px;
      }
      @media only screen and (max-width: 575px){
        font-size: 26px;
      }
      @media only screen and (max-width: 375px){
        font-size: 20px;
      }
    }
    .countdown-title{
      font-size: 16px;
      font-weight: 400;
      display: block;
      color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
      @media only screen and (max-width: 375px){
        font-size: 15px;
      }
    }
  }
  .subscription-form{
    margin-top: 40px;
    @media only screen and (max-width: 991px){
      margin-top: 25px;
    }
    @media only screen and (max-width: 1150px){
      margin-top: 35px;
    }
    .subscription-form-inner{
      display: flex;
      justify-content: center;
			@media only screen and (max-width: 575px){
				display: block;
				.ant-form-item{
					margin-bottom: 15px;
				}
			}
      @media only screen and (max-width: 375px){
        flex-flow: column;
        margin-bottom: 20px;
      }
      .ant-form-item-control{
        margin-right: 20px;
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
        @media only screen and (max-width: 375px){
          margin-right: 0;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
        }
        .ant-input{
          min-width: 320px;
          padding: 9px 20px;
          @media only screen and (max-width: 767px){
            min-width: 100%;
          }
          &::placeholder{
            color: ${({theme:t})=>t["extra-light-color"]};
          }
        }
      }
      button{
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 500;
      }
    }
  }
  .coming-soon-social{
    margin-top: 50px;
    @media only screen and (max-width: 1150px){
      margin-top: 25px;
    }
    @media only screen and (max-width: 767px){
      margin-top: 30px;
    }
    ul{
      margin-bottom: 30px;
      li{
        display: inline-block;
        &:not(:last-child){
          margin-right: 15px;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
        }
        a{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          i,
          span{
            color: #fff;
          }
					svg{
						color: #fff;
					}
          &.facebook{
            background-color: #3B5998;
          }
          &.twitter{
            background-color: #1DA1F2;
          }
          &.globe{
            background-color: #DD3E7C;
          }
          &.github{
            background-color: #23282D;
          }
        }
      }
    }
    p{
      font-size: 14px;
      color: ${({theme:t})=>t["light-color"]};
    }
  }
`,i.Ay.div`
  .form-title{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 36px;
  }
  .add-user-wrap{
   $:
  }
  .add-user-bottom{
    margin-top: 20px;
    button + button{
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 15px;
    }
    .ant-btn-light{
      background: ${({theme:t})=>t["bg-color-light"]};
      border: 1px solid #F1F2F6;
    }
    &.text-right{
      @media only screen and (max-width: 767px){
        text-align: ${({theme:t})=>t.rtl?"right":"left"} !important;
      }
    }
  }
  .card-nav{
    ul{
      flex-wrap: wrap;
      margin-bottom: -4px -10px;
      @media only screen and (max-width: 575px){
        justify-content: center;
      }
      li{
        margin: 4px 10px !important;
        &:not(:last-child){
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 26px;
          @media only screen and (max-width: 575px){
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
          }
        }
        a{
          position: relative;
          padding: 22px 0;
          font-size: 14px;
          font-weight: 500;
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
          @media only screen and (max-width: 575px){
            padding: 0;
          }
          &:after{
            position: absolute;
            ${({theme:t})=>t.rtl?"right":"left"}: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            border-radius: 4px;
            content: '';
            opacity: 0;
            visibility: hidden;
            background-color: ${({theme:t})=>t["primary-color"]};
            @media only screen and (max-width: 575px){
              display: none;
            }
          }
          &.active{
            color: ${({theme:t})=>t["primary-color"]};
            &:after{
              opacity: 1;
              visibility: visible;
            }
            svg,
            img,
            i,
            span{
              color: ${({theme:t})=>t["primary-color"]};
            }
          }
          svg,
          img,
          i,
          span{
            color: ${({theme:t})=>t["light-color"]};
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
      }
    }
  }

  /* // Photo Upload */
  .photo-upload{
    position: relative;
    max-width: 260px;
    margin-bottom: 30px;
    .ant-upload-select{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      position: absolute;
      ${({theme:t})=>t.rtl?"right":"left"}: 85px;
      bottom: 5px;
      z-index: 10;
      background-color: ${({theme:t})=>t["white-color"]};
      span{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        z-index: -1;
        background-color: ${({theme:t})=>t["primary-color"]};
      }
      svg,
      i,
      span{
        color: ${({theme:t})=>t["white-color"]};
      }
      a{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    img{
      border-radius: 50%;
    }
    .info{
      background-color: transparent;
    }
    figcaption{
      ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
      .info{
        h1,
        h2,
        h3,
        h4,
        h5,
        h6{
          font-size: 15px;
          font-weight: 500;
        }
      }
    }
  }

  .user-work-form{
    .ant-picker{
      padding: 0 15px 0 0;
    }
  }
  .user-info-form{
    .ant-select-single .ant-select-selector .ant-select-selection-item{
      color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
    }
  }
  .social-form{
    .ant-form-item-control-input-content{
      .ant-input-prefix{
        width: 44px;
        height: 44px;
        border-radius: 4px;
      }
    }
    .ant-form-item-control-input{
      height: 44px;
      .ant-input-affix-wrapper{
        &:hover,
        &:focus,
        &.ant-input-affix-wrapper-focused{
          border-color: #E3E6EF;
        }
        .ant-input{
          height: 42px;
          ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 0;
        }
      }
    }
    .ant-input-prefix{
      position: relative;
      ${({theme:t})=>t.rtl?"right":"left"}: -11px;
      span{
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        width: 100%;
        height: 100%;
        background-color: ${({theme:t})=>t["primary-color"]};
        i,
        svg,
        span.fa{
          color: #fff;
          font-size: 16px;
        }
        .fa-facebook{
          background-color: #3B5998;
        }
        .fa-twitter{
          background-color: #38B8FF;
        }
        .fa-linkedin{
          background-color: #2CAAE1;
        }
        .fa-instagram{
          background-color: #FF0300;
        }
        .fa-github{
          background-color: #292929;
        }
        .fa-youtube{
          background-color: #FE0909;
        }
      }
    }
  }
`,i.Ay.div`
   .ant-card-head{
     .ant-card-head-title{
       .v-num{
        $: 0;
         font-size: 18px;
         color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
       }
       .sign{
         font-size: 18px;
         color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
         display: inline-block;
         margin: 0 8px;
       }
       .rl-date{
        $: 0;
         font-weight: 400;
         font-size: 16px;
       }
     }
   }
  .version-list{
    .version-list__single{
      &:not(:last-child){
        margin-bottom: 30px;
      }
      ul{
        li{
          position: relative;
          ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 20px;
          font-size: 16px;
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
          &:not(:last-child){
            margin-bottom: 12px;
          }
          &:after{
            position: absolute;
            ${({theme:t})=>t.rtl?"right":"left"}: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            content: "";
          }
        }
        &.version-primary{
          li{
            &:after{
              background-color: ${({theme:t})=>t["primary-color"]};
            }
          }
        }
        &.version-success{
          li{
            &:after{
              background-color: ${({theme:t})=>t["success-color"]};
            }
          }
        }
        &.version-info{
          li{
            &:after{
              background-color: ${({theme:t})=>t["info-color"]};
            }
          }
        }
      }
    }
    .version-list__top{
      .badge{
        font-size: 12px;
        line-height: 1.2;
        letter-spacing: 1.4px;
        font-weight: 500;
        display: inline-block;
        padding: 5px 8px;
        height: auto;
        border-radius: 4px;
        margin-bottom: 14px;
        color: #fff;
        &.badge-primary{
          background-color: ${({theme:t})=>t["primary-color"]};
        }
        &.badge-info{
          background-color: ${({theme:t})=>t["info-color"]};
        }
        &.badge-success{
          background-color: ${({theme:t})=>t["success-color"]};
        }
      }
    }
  }

  .changelog-accordion{
    margin-top: 30px;
    .ant-collapse{
      background-color: transparent;
      border: 0 none;
    }
    .ant-collapse-item{
      border-radius: 6px;
      border: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
      &:not(:last-child){
        margin-bottom: 20px;
      }
      &:last-child{
        border-radius: 6px;
        .ant-collapse-header{
          border-radius: 6px;
        }
      }
    }
    .ant-collapse-header{
      border-radius: 6px;
      padding: 20px 30px 18px 30px !important;
      @media only screen and (max-width: 575px){
        padding: 16px 20px 14px 20px !important;
      }
      .ant-collapse-arrow{
        left: auto !important;
        right: 30px;
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"} : 12px;
        svg,
        img{
          width: 14px;
        }
      }
      .v-num{
        font-size: 18px;
        font-weight: 500;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        @media only screen and (max-width: 575px){
          font-size: 16px;
        }
      }
			.sign{
         margin: 0 8px;
       }
      .rl-date{
        font-size: 16px;
        font-weight: 400;
        @media only screen and (max-width: 575px){
          font-size: 14px;
        }
      }
    }
    .ant-collapse-content{
      background-color: ${({theme:t})=>t[t.mainContent]["white-background"]} !important;
      border-radius: 0 0 6px 6px;
      > .ant-collapse-content-box{
        padding: 30px 30px 25px;
      }
    }
  }
`,i.Ay.div`
  .history-title{
    font-size: 11px;
    margin-bottom: 24px;
    color: ${({theme:t})=>t[t.mainContent]["light-gray-text"]};
  }
  .v-history-list{
    li{
      display: flex;
      justify-content: space-between;
      &:not(:last-child){
        margin-bottom: 24px;
      }
      .version-name{
        font-size: 14px;
        font-weight: 500;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      }
      .version-date{
        font-size: 14px;
        color: ${({theme:t})=>t[t.mainContent]["light-gray-text"]};
      }
    }
  }
`,i.Ay.div`
  position: relative;
  padding: 0 150px;
  .button-group {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 50%;
      left: 0;
  }
`,i.Ay.div`
  .ant-card{
    direction: ltr;
  }
  .ant-card-body{
    padding: 0 !important;
  }
  .testimonial-block{
    .swiper-button-prev,
    .swiper-button-next{
      width: 44px;
      height: 44px;
      border-radius: 50%;
      box-shadow: 0 3px 10px ${({theme:t})=>t[t.mainContent]["dark-text"]}16;
      @media only screen and (max-width: 991px){
        width: 35px;
        height: 35px;
      }
      &:after{
        line-height: 0;
      }
    }
    .testimonial-title{
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 50px;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      @media only screen and (max-width: 991px){
        font-size: 24px;
      }
    }
    &.theme-1{
      padding: 60px 100px 75px 100px;
      @media only screen and (max-width: 1599px){
        padding: 60px 50px 75px 50px;
      }
      @media only screen and (max-width: 1399px){
        padding: 50px 25px 45px 25px;
      }
      .testimonial-title{
        margin-bottom: 0;
      }
      .swiper-button-prev,
      .swiper-button-next{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-80%);
        z-index: 22;
        background-color: #fff;
      }
      .swiper-button-prev{
        left: 10px;
        &:before{
          font-family: ${({theme:t})=>t["font-family"]};
          content: url('${n(40682)}');
        }
      }
      .swiper-button-next{
        right: 10px;
        &:before{
          font-family: ${({theme:t})=>t["font-family"]};
          content: url('${n(47969)}');
        }
      }
      .swiper-pagination{
        .swiper-pagination-bullet{
          width: 10px;
          height: 10px;
          background-color: #DCDDFA;
          opacity: 1;
          &.swiper-pagination-bullet-active{
            background-color: ${({theme:t})=>t["primary-color"]};
          }
        }
      }
      .swiper-container{
        padding: 40px 25px 60px;
      }
      .swiper-slide {
        text-align: center;
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 10px 20px ${({theme:t})=>t["light-color"]}10;
        @media only screen and (max-width: 1399px){
          padding: 25px;
        }
        @media only screen and (max-width: 479px){
          padding: 25px 15px;
        }
        &.swiper-slide-active{
          box-shadow: 0 20px 50px ${({theme:t})=>t["light-color"]}20;
        }
      }
      .testimonial-block__single{
          figure{
            margin-bottom: 0;
            img{
              margin-bottom: 12px;
            }
          }
          .client-name{
            font-size: 15px;
            margin-bottom: 5px;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]}
          }
          .client-designation{
            font-size: 13px;
            font-weight: 400;
            opacity: .70;
            margin-bottom: 26px;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
          }
          .client-review{
            font-size: 16px;
            margin-bottom: 0;
            line-height: 1.75;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
          }
      }
    }
    &.theme-2{
      padding: 60px 100px 75px 100px;
      background-color: ${({theme:t})=>t[t.mainContent]["light-background"]};
      @media only screen and (max-width: 1399px){
        padding: 60px 40px 75px 40px;
      }
      @media only screen and (max-width: 991px){
        padding: 50px 70px 55px 70px;
      }
      @media only screen and (max-width: 575px){
        padding: 30px 30px 45px 30px;
      }
      .testimonial-title{
        @media only screen and (max-width: 991px){
          margin-bottom: 20px;
        }
      }
      .swiper-button-prev,
      .swiper-button-next{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 22;
        background-color: #fff;
        @media only screen and (max-width: 991px){
          top: auto;
          bottom: -6px;
        }
      }
      .swiper-button-prev{
        left: 5px;
        @media only screen and (max-width: 991px){
          left: 42%;
        }
        @media only screen and (max-width: 575px){
          left: 36%;
        }
        &:before{
          font-family: ${({theme:t})=>t["font-family"]};
          content: url('${n(40682)}');
        }
      }
      .swiper-button-next{
        right: 5px;
        @media only screen and (max-width: 991px){
          right: 42%;
        }
        @media only screen and (max-width: 575px){
          right: 36%;
        }
        &:before{
          font-family: ${({theme:t})=>t["font-family"]};
          content: url('${n(47969)}');
        }
      }
      .swiper-container{
        padding: 0 20px;
        @media only screen and (max-width: 991px){
          padding: 30px 0 70px 0;
        }
      }
      .swiper-slide {
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 10px 30px ${({theme:t})=>t["light-color"]}10;
        @media only screen and (max-width: 479px){
          padding: 24px;
        }
      }
      .testimonial-block__single{
        position: relative;
        .quotation{
          position: absolute;
          ${({theme:t})=>t.rtl?"left":"right"}: 40px;
          top: 40px;
          @media only screen and (max-width: 479px){
            ${({theme:t})=>t.rtl?"left":"right"}: 25px;
          }
          img{
            @media only screen and (max-width: 479px){
              max-width: 40px;
            }
          }
        }
      }
      .testimonial-block__author{
        direction: ${({theme:t})=>t.rtl?"rtl":"ltr"};
        display: flex;
        align-items: center;
        margin-bottom: 22px;
        img{
          max-width: 70px;
          margin-right: 18px;
          ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 18px;
          @media only screen and (max-width: 479px){
            max-width: 60px;
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
          }
        }
        .author-info{
          .client-name{
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 5px;
						color: ${({theme:t})=>t[t.mainContent]["dark-text"]}
          }
          .client-designation{
            font-size: 13px;
            opacity: .70;
            margin-bottom: 0;
						color: ${({theme:t})=>t[t.mainContent]["gray-text"]}
          }
          .info{
            background-color: #fff;
          }
        }
      }
      .testimonial-block__review{
        direction: ${({theme:t})=>t.rtl?"rtl":"ltr"};
        p{
          margin-bottom: 0;
          line-height: 1.75;
          font-size: 16px;
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
      }
			@media only screen and (max-width: 575px){
				.swiper-button-next + .swiper-wrapper .swiper-slide{
					padding-bottom: 60px;
				}
			}
    }
    &.theme-3{
      padding-top: 95px;
      @media only screen and (max-width: 991px){
        padding-top: 42px;
      }
      .testimonial-title{
        margin-bottom: 0;
      }
      .swiper-pagination {
        position: absolute;
        height: fit-content;
        top: 45px;
        left: 50%;
        transform: translateX(-50%);
        @media only screen and (max-width: 575px){
          top: -15px;
        }
        .pagination-thumb{
          display: inline-block;
          width: auto;
          height: auto;
          opacity: .4;
          margin: 4px 0;
          img{
            max-width: 70px;
            @media only screen and (max-width: 991px){
              max-width: 40px;
            }
            @media only screen and (max-width: 479px){
              max-width: 25px;
            }
          }
          &.swiper-pagination-bullet-active{
            position: relative;
            z-index: 22;
            opacity: 1;
            img{
              transform: scale(1.4);
            }
          }
        }
      }
      .testimonial-block__single{
        padding: 175px 0 86px;
        @media only screen and (max-width: 991px){
          padding: 135px 30px 36px;
        }
        @media only screen and (max-width: 575px){
          padding: 80px 30px 40px;
        }
      }
      .testimonial-block__inner{
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
      }
      .testimonial-block__review{
        p{
          font-size: 16px;
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
      }
      .testimonial-block__author{
        .author-info{
          margin-top: 8px;
        }
        .author-name{
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 3px;
					color: ${({theme:t})=>t[t.mainContent]["dark-text"]}
        }
        .author-designation{
          opacity: .70;
          font-size: 14px;
					color: ${({theme:t})=>t[t.mainContent]["gray-text"]}
        }
      }
    }
    &.theme-4{
      padding: 60px 100px 75px 100px;
      background-color: ${({theme:t})=>t[t.mainContent]["light-background"]};
      @media only screen and (max-width: 1599px){
        padding: 60px 60px 75px 60px;
      }
      @media only screen and (max-width: 991px){
        padding: 50px 30px 48px 30px;
      }
      .swiper-button-prev,
      .swiper-button-next{
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 22;
        background-color: #fff;
        @media only screen and (max-width: 575px){
          top: auto;
          bottom: -6px;
        }
      }
      .swiper-button-prev{
        left: 100px;
        @media only screen and (max-width: 1599px){
          left: 50px;
        }
        @media only screen and (max-width: 575px){
          left: 36%;
        }
        &:before{
          font-family: ${({theme:t})=>t["font-family"]};
          content: url('${n(40682)}');
        }
      }
      .swiper-button-next{
        right: 100px;
        @media only screen and (max-width: 1599px){
          right: 50px;
        }
        @media only screen and (max-width: 575px){
          right: 36%;
        }
        &:before{
          font-family: ${({theme:t})=>t["font-family"]};
          content: url('${n(47969)}');
        }
      }
      .swiper-container{
        @media only screen and (max-width: 575px){
          padding: 0 0 70px;
        }
      }
      .testimonial-block__inner{
        max-width: 1000px;
        margin: 0 auto;
        padding: 50px;
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        box-shadow: 0 10px 30px ${({theme:t})=>t["light-color"]}10;
        text-align: center;
        @media only screen and (max-width: 1599px){
          max-width: 570px;
          padding: 30px;
        }
        @media only screen and (max-width: 991px){
          max-width: 450px;
        }
      }
      .testimonial-block__author{
        img{
          max-width: 100px;
          margin-bottom: 26px;
        }
      }
      .author-info{
        margin-top: 18px;
        .client-name{
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 5px;
					color: ${({theme:t})=>t[t.mainContent]["dark-text"]}
        }
        .client-designation{
          font-size: 13px;
          opacity: .70;
          margin-bottom: 0;
					color: ${({theme:t})=>t[t.mainContent]["gray-text"]}
        }
      }
      .testimonial-block__review{
        p{
          margin-bottom: 0;
          line-height: 1.75;
          font-size: 16px;
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
      }
			@media only screen and (max-width: 575px){
				.swiper-button-next + .swiper-wrapper .swiper-slide .testimonial-block__inner{
					padding-bottom: 70px;
				}
			}
    }
  }
  .testimonial-title{
    text-align: center;
  }
`,i.Ay.div`
  background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
  border-radius: 10px;
  box-shadow: 0 5px 20px #9299B810;
  margin-bottom: 50px;
  .ninjadash-support-container{
    max-width: 1110px;
    margin: 0 auto;
    @media only screen and (max-width: 1599px){
      max-width: 990px;
    }
    @media only screen and (max-width: 1399px){
      max-width: 790px;
    }
    @media only screen and (max-width: 1150px){
      max-width: 100%;
      padding: 30px
    }
  }
  .ninjadash_support-content{
    .ninjadash_support-content__title{
      font-size: 30px;
      font-weight: 600;
      margin-bottom: 10px;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      @media only screen and (max-width: 767px){
        font-size: 26px;
      }
    }
    p{
      color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
    }
    .btn-ticket{
      margin-top: 15px;
      height: 46px;
      font-size: 14px;
      font-weight: 500;
      @media only screen and (max-width: 575px){
        margin-top: 0;
      }
    }
  }
  .ninjadash_support-img{
    margin-top: 50px;
    @media only screen and (max-width: 1150px){
      margin-top: 0;
    }
    img{
      width: 100%;
      @media only screen and (max-width: 575px){
        margin-top: 30px;
      }
    }
  }
`,i.Ay.div`
  background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
  border-radius: 10px;
  box-shadow: 0 5px 20px #9299B810;
  padding: 100px 0 50px 0;
  @media only screen and (max-width: 1599px){
    padding: 50px 0 20px 0;
  }
  @media only screen and (max-width: 1199px){
    margin-bottom: 30px;
  }
  .ninjadash-support-container{
    max-width: 1110px;
    margin: 0 auto;
    @media only screen and (max-width: 1599px){
      max-width: 990px;
    }
    @media only screen and (max-width: 1399px){
      max-width: 790px;
    }
    @media only screen and (max-width: 1150px){
      max-width: 100%;
      padding: 30px
    }
  }
  .ninjadash-support-link-item{
    max-width: 350px;
    margin: 0 auto 30px;
    padding: 30px;
    text-align: center;
    border-radius: 6px;
    transition: .35s ease;
    border: 1px solid ${({theme:t})=>t[t.mainContent]["light-border"]};
    &:hover{
      box-shadow: 0 15px 25px #9299BB15;
      border-color: #fff;
    }
    .ninjadash-support-link-item__icon{
      height: 80px;
      width: 80px;
      margin: 0 auto 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      &.primary{
        background-color: ${({theme:t})=>t["primary-color"]};
      }
      &.success{
        background-color: ${({theme:t})=>t["success-color"]};
      }
      &.info{
        background-color: ${({theme:t})=>t["info-color"]};
      }
    }
    .ninjadash-support-link-item__title{
      font-size: 20px;
      font-weight: 500;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
    }
    .ninjadash-support-link-item__content{
      .btn-link{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        background-color: ${({theme:t})=>t[t.mainContent]["main-background-light"]};
        border-radius: 20px;
        margin: 36px auto 0;
        font-size: 15px;
        padding: 0 24.5px;
        width: fit-content;
      }
    }
  }
  .ninjadash_faq-block{
    margin-top: 70px;
    @media only screen and (max-width: 1150px){
      margin-top: 20px;
    }
    .ant-card{
      border: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
      .ant-card-body{
        h1{
          color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
      }
    }
    .ant-collapse-item {
      &.ant-collapse-item-active{
        box-shadow: 0 0;
      }
      .ant-collapse-header{
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]} !important;
        padding: 19.5px 25px !important;
        .ant-collapse-arrow{
          color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
      }
      .ant-collapse-content{

        box-shadow: 0 0;
      }
    }
  }
`,i.Ay.div`
  .ninjadash-term-condition-top{
    min-height: 330px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background-color: ${({theme:t})=>t[t.mainContent]["primary-white-15"]};
    .ninjadash-term-condition-top__title{
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 110px;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
      @media only screen and (max-width: 575px){
        padding: 0 15px;
        text-align: center;
        font-size: 32px;
      }
    }
  }
  .ninjadash-term-condition-content{
    padding: 1px 50px 50px;
    background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
    box-shadow: 0 10px 50px ${({theme:t})=>t[t.mainContent]["light-text"]}20;
    max-width: 770px;
    border-radius: 10px;
    margin: -125px auto auto;
		@media only screen and (max-width: 991px){
			margin-bottom: 30px;
		}
    h3{
      font-size: 30px;
      font-weight: 600;
      margin: 50px 0 30px;
      color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
    }
    p{
      font-size: 16px;
      line-height: 1.69;
      color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
    }
  }
`},7783:function(t,e,n){function i(t=2955){const e="http://localhost:2955";if(e)return String(e).trim().replace(/\/+$/,"");if("undefined"!==typeof window&&window.location){const e=window.location.protocol||"http:",n=window.location.hostname||"localhost";return`${e}//${n}:${t}`}return`http://localhost:${t}`}function o(t,e=2955){const n=String(t||"").trim().replace(/\/+$/,"");return n||i(e)}n.d(e,{a:function(){return i},y:function(){return o}})},14595:function(t,e,n){n.d(e,{zo:function(){return o}});var i=n(95853);const o=i.Ay.div`
    position: relative;
    z-index: 21;
    .ant-card-body{
        padding: 20px 25px 15px!important;
        .postBody{
            display: flex;
            position: relative;
            .post-author{
                max-width: 46px;
                border-radius: 50%;
                position: absolute;
                top: 5px;
                z-index: 22;
                ${({theme:t})=>t.rtl?"right":"left"}: 0;
            }
            textarea{
                border: 0 none;
                padding-${({theme:t})=>t.rtl?"right":"left"}: 70px;
                min-height: 55px;
                resize: none;
                background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
                &:focus{
                    outline: none;
                    box-shadow: 0 0 0 0px rgba(95, 99, 242, 0.2);
                }
            }
        }
        .postFooter{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            border-top: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
            padding-top: 15px;
            .ant-upload{
                margin-${({theme:t})=>t.rtl?"left":"right"}: 8px;
                .ant-btn{
                    height: 30px;
                    font-size: 12px;
                    font-weight: 500;
                    border-radius: 16px;
                    padding: 0 14.5px;
                    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                }
            }
            .btn-more{
                padding: 0 16px;
                height: 30px;
            }
            .postFooter_left{
                display: flex;
				.ant-btn-light{
                    svg{
                        fill: ${({theme:t})=>t[t.mainContent]["gray-text"]} !important;
                    }
                    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                    background-color: ${({theme:t})=>t["bg-color-normal"]};
                }
            }
            .btn-post{
                height: 35px;
            }
        }
    }
`;i.Ay.div`
    width: 100%;
    height: 100%;
    background: #11121760;
    position: fixed;
    top: 0;
    ${({theme:t})=>t.rtl?"right":"left"}: 0;
    z-index: -0;
`,i.Ay.div`
    width: 100%;
    height: 100%;
    background: #11121760;
    position: fixed;
    top: 0;
    ${({theme:t})=>t.rtl?"right":"left"}: 0;
    z-index: 9999;
`,i.Ay.div`
    .ant-card-body{
        padding: 20px 0 !important;
    }
    .post-content{
        .gallery{
            padding: 0 25px;
            .ant-row{
                height: 100%;
                margin: -5px;
                .ant-col{
                    padding: 5px;
                }
            }
            img{
                margin-bottom: 0px;
                border-radius: 8px;
            }
            .my-masonry-grid{
                margin: -5px;
                a{
                    padding: 5px;
                    display: block;
                    img{
                        margin-bottom: 5px;
                    }
                    &:empty{
                        display: none;
                    }
                }
            }
            .my-masonry-grid[cols=2]{
                a{
                    width: 50%;
                }
            }
        }
        .post-text{
            border-bottom: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
            padding: 0 25px 20px 25px;
            margin-bottom: 20px;
            p{
                font-size: 15px;
                color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
        .post-actions{
            padding: 0 25px 20px 25px;
            margin-bottom: 20px;
            border-bottom: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
            span{
                display: inline-flex;
                align-items: center;
                 color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
                margin-${({theme:t})=>t.rtl?"left":"right"}: 20px;
            }
            a{
                display: inline-flex;
                align-items: center;
                font-size: 13px;
                 color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
                svg,
                i{
                    margin-${({theme:t})=>t.rtl?"left":"right"}: 6px;
                }
                svg{
                    fill: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
                }
            }
        }
        .commentArea{
            display: flex;
            align-items: center;
            padding: 0 25px 20px 25px;
            border-bottom: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
            @media only screen and (max-width: 991px){
                flex-flow: column;
                align-items: flex-start;
            }
            .comment-form{
                flex: auto;
                position: relative;
                display: flex;
                align-items: center;
                margin-${({theme:t})=>t.rtl?"left":"right"}: 10px;
                @media only screen and (max-width: 991px){
                    flex-flow: column;
                    align-items: flex-start;
                    width: 100%;
                    margin-${({theme:t})=>t.rtl?"left":"right"}: 0;
                    margin-bottom: 15px;
                }
                img{
                    max-width: 36px;
                    margin-${({theme:t})=>t.rtl?"left":"right"}: 10px;
                    border-radius: 50%;
                    @media only screen and (max-width: 991px){
                        margin-${({theme:t})=>t.rtl?"left":"right"}: 0;
                        margin-bottom: 15px;
                    }
                }
                textarea{
                    padding: 14px 75px 14px 22px;
                    height: 52px;
                    border: 0 none;
                    border-radius: 25px;
                    background-color: #F4F5F7;
                    resize: none;
                }
            }
            .btn-send{
                padding: 0;
                height: 50px;
                width: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 15px #5F63F220;
                @media only screen and (max-width: 991px){
                    width: 35px;
                    height: 35px;
                }
                svg,
                i,
                img{
                    width: 16px;
                    color: #fff;
                    @media only screen and (max-width: 991px){
                        width: 14px;
                    }
                }
                svg{
                    fill: #fff;
                }
            }
            .chatbox-reply-action{
                position: absolute;
                ${({theme:t})=>t.rtl?"left":"right"}: 22px;
                align-items: center;
                @media only screen and (max-width: 991px){
                    bottom: 10px;
                }
                .smile-icon{
                    position: relative;
                    margin-${({theme:t})=>t.rtl?"left":"right"}: 18px;
                    line-height: 1;
                    @media only screen and (max-width: 991px){
                        margin-${({theme:t})=>t.rtl?"left":"right"}: 8px;
                    }
                    emoji-picker{
                        position: absolute;
                        z-index: 9999999;
                    }
                }
                a{
                    line-height: 1;
                    &:not(:last-child){
                        margin-${({theme:t})=>t.rtl?"left":"right"}: 18px;
                        @media only screen and (max-width: 991px){
                            margin-${({theme:t})=>t.rtl?"left":"right"}: 6px;
                        }
                    }
                    svg,
                    i{
                        color: #ADB4D2;
                        width: 18px;
                        @media only screen and (max-width: 991px){
                            width: 14px;
                        }
                    }
                    svg{
                        fill: #ADB4D2;
                    }
                }
                .ant-upload-list {
                    display: none;
                }
                .ant-upload{
                    margin: 0;
                    padding: 0;
                    width: auto;
                    height: auto;
                    line-height: .5;
                    background-color: transparent;
                    border: 0 none;
                }
            }
        }
        .commentReplay{
            padding: 20px 25px 0 25px;
            .ant-comment-content-author-name{
                font-size: 14px;
                font-weight: 600;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
								span{
									color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
								}
            }
            .ant-comment-actions{
                margin-top: 10px;
            }
        }
    }
`,i.Ay.div`
    display: flex;
    align-items: center;
    img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
    }
    p {
        font-size: 14px;
        font-weight: 600;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        margin: 0;
        span {
            font-size: 13px;
            font-weight: 400;
            display: block;
            margin: 0;
            color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
        }
    }
`},16397:function(t,e,n){n.d(e,{A:function(){return v}});var i=n(20641);const o={class:"project-modal"},a={class:"projects-members mb-30"},r=["src"],p=["src"],l=["src"],d=["src"],m=["src"];function x(t,e,x,c,g,h){const s=(0,i.g2)("a-input"),f=(0,i.g2)("a-form-item"),b=(0,i.g2)("a-select-option"),u=(0,i.g2)("a-select"),y=(0,i.g2)("a-textarea"),w=(0,i.g2)("a-checkbox-group"),$=(0,i.g2)("a-date-picker"),k=(0,i.g2)("a-col"),v=(0,i.g2)("sdButton"),C=(0,i.g2)("ProjectModalFooter"),j=(0,i.g2)("a-row"),_=(0,i.g2)("a-form"),z=(0,i.g2)("BasicFormWrapper"),A=(0,i.g2)("sdModal");return(0,i.uX)(),(0,i.Wv)(A,{type:t.modalType,title:"Create Project",visible:t.visible,onCancel:t.handleCancel},{default:(0,i.k6)((()=>[(0,i.Lk)("div",o,[(0,i.bF)(z,null,{default:(0,i.k6)((()=>[(0,i.bF)(_,{model:t.formState,onFinish:t.handleOk,layout:t.formState.layout},{default:(0,i.k6)((()=>[(0,i.bF)(f,{name:"project",label:""},{default:(0,i.k6)((()=>[(0,i.bF)(s,{value:t.formState.project,"onUpdate:value":e[0]||(e[0]=e=>t.formState.project=e),placeholder:"Project Name"},null,8,["value"])])),_:1}),(0,i.bF)(f,{name:"category",label:""},{default:(0,i.k6)((()=>[(0,i.bF)(u,{value:t.formState.category,"onUpdate:value":e[1]||(e[1]=e=>t.formState.category=e),style:{width:"100%"}},{default:(0,i.k6)((()=>[(0,i.bF)(b,{value:""},{default:(0,i.k6)((()=>[(0,i.eW)("Project Category")])),_:1}),(0,i.bF)(b,{value:"one"},{default:(0,i.k6)((()=>[(0,i.eW)("Project One")])),_:1}),(0,i.bF)(b,{value:"two"},{default:(0,i.k6)((()=>[(0,i.eW)("Project Two")])),_:1})])),_:1},8,["value"])])),_:1}),(0,i.bF)(f,{name:"description",label:""},{default:(0,i.k6)((()=>[(0,i.bF)(y,{rows:4,placeholder:"Project Description"})])),_:1}),(0,i.bF)(f,{name:"privacy",label:"Project Privacy"},{default:(0,i.k6)((()=>[(0,i.bF)(w,{value:t.formState.privacy,"onUpdate:value":e[2]||(e[2]=e=>t.formState.privacy=e),options:t.options},null,8,["value","options"])])),_:1}),(0,i.bF)(f,{name:"members",label:"Project Members"},{default:(0,i.k6)((()=>[(0,i.bF)(s,{value:t.formState.members,"onUpdate:value":e[3]||(e[3]=e=>t.formState.members=e),placeholder:"Search Members"},null,8,["value"])])),_:1}),(0,i.Lk)("div",a,[(0,i.Lk)("img",{style:{width:"35px"},src:n(91607),alt:""},null,8,r),(0,i.Lk)("img",{style:{width:"35px"},src:n(2876),alt:""},null,8,p),(0,i.Lk)("img",{style:{width:"35px"},src:n(20389),alt:""},null,8,l),(0,i.Lk)("img",{style:{width:"35px"},src:n(35722),alt:""},null,8,d),(0,i.Lk)("img",{style:{width:"35px"},src:n(86483),alt:""},null,8,m)]),(0,i.bF)(j,{gutter:15},{default:(0,i.k6)((()=>[(0,i.bF)(k,{md:12},{default:(0,i.k6)((()=>[(0,i.bF)(f,{name:"start",label:"Start Date"},{default:(0,i.k6)((()=>[(0,i.bF)($,{value:t.formState.start,"onUpdate:value":e[4]||(e[4]=e=>t.formState.start=e),placeholder:"mm/dd/yyyy",format:t.dateFormat},null,8,["value","format"])])),_:1})])),_:1}),(0,i.bF)(k,{md:12},{default:(0,i.k6)((()=>[(0,i.bF)(f,{name:"end",label:"End Date"},{default:(0,i.k6)((()=>[(0,i.bF)($,{value:t.formState.end,"onUpdate:value":e[5]||(e[5]=e=>t.formState.end=e),placeholder:"mm/dd/yyyy",format:t.dateFormat},null,8,["value","format"])])),_:1})])),_:1}),(0,i.bF)(k,{md:12},{default:(0,i.k6)((()=>[(0,i.bF)(f,null,{default:(0,i.k6)((()=>[(0,i.bF)(C,null,{default:(0,i.k6)((()=>[(0,i.bF)(v,{size:"default",type:"primary",key:"submit",onClick:t.handleOk},{default:(0,i.k6)((()=>[(0,i.eW)(" Add New Project ")])),_:1},8,["onClick"]),(0,i.bF)(v,{size:"default",type:"light",key:"back",outlined:"",onClick:t.handleCancel},{default:(0,i.k6)((()=>[(0,i.eW)(" Cancel ")])),_:1},8,["onClick"])])),_:1})])),_:1})])),_:1})])),_:1})])),_:1},8,["model","onFinish","layout"])])),_:1})])])),_:1},8,["type","visible","onCancel"])}var c=n(19732),g=n(45546),h=n(95853);h.Ay.div`
    .ant-page-header-heading-sub-title{
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
        position: relative;
        ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 15px;
        font-weight: 500;
        &:before{
            position: absolute;
            content: '';
            width: 1px;
            height: 24px;
            background: ${({theme:t})=>t["dash-color"]};
            ${({theme:t})=>t.rtl?"right":"left"}: 0;
            top:0;
        }
    }
`,h.Ay.div`
    margin-bottom: 25px;
    .project-sort-bar{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        .project-sort-nav,
        .project-sort-search,
        .project-sort-group{
            padding: 0 10px;
        }

        .project-sort-group{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: auto;
        }
        .project-sort-search{
            .ant-select-selection-search{
                width: 100% !important;
            }
        }
        nav{
            ul{
                li{

                    a{
                        color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
                        svg{
                            fill: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
                        }
                        &:hover{
                            color: ${({theme:t})=>t[t.mainContent]["menu-active"]};
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 1500px){
        .project-sort-search{
            .ant-select{
                width: 237px !important;
            }
        }
        .project-sort-group .sort-group{
            .ant-select{
                min-width: 180px;
            }
        }
    }
    @media (min-width: 1201px) and (max-width: 1300px) {
        .project-sort-search{
            .ant-select{
                width: 170px !important;
            }
        }
        .project-sort-group{
            padding: 0 5px;

        }
        .project-sort-group .sort-group .layout-style a{
            width: 35px;
            height: 35px;
        }
        .project-sort-group .sort-group .ant-select {
            min-width: 170px;
            ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 5px;
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 5px;
        }
    }
    @media (max-width: 1199px){
        .project-sort-search{
            flex: 0 0 100%;
            order: 0;
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            .ant-select{
                width: 350px !important;
            }
        }
        .project-sort-nav{
            order: 1;
            margin: 0 auto;
        }
        .project-sort-group{
            order: 2;
        }
    }
    @media (max-width: 991px){
        .project-sort-group{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: unset;
            flex: 0 0 100%;
            margin-top: 15px;
            .sort-group{
                justify-content: flex-start;
                .layout-style{
                    ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: auto;
                }
            }
        }
    }
    @media (max-width: 575px){
        .project-sort-group{
            .sort-group{
                > span{
                    display: none;
                }
            }
        }
    }

    nav{
        background: ${({theme:t})=>t[t.mainContent]["white-background"]};
        border-radius: 5px;
        padding: 9px 20px;
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li{
                ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 12px;
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 11px;
                ${({theme:t})=>t.rtl?"border-left":"border-right"}: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
                &:last-child{
                    ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 0;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                    ${({theme:t})=>t.rtl?"border-left":"border-right"}: 0 none;
                }
                a{
                    color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
                    font-weight: 400;
                }
                &.active{
                    a{
                        color: ${({theme:t})=>t[t.mainContent]["menu-active"]};
                    }
                }
            }
        }
    }
    .ant-select-selector .ant-select-selection-search .ant-input-affix-wrapper.ant-select-selection-search-input{
        border: 0 none;
        border-radius: 23px;
        background-color: ${({theme:t})=>t[t.mainContent]["input-bg"]} !important;
        input.ant-input{
            height: 40px !important;
            border-radius: 23px;
            background-color: ${({theme:t})=>t[t.mainContent]["input-bg"]} !important;
        }
        .ant-input-suffix{
            svg{
                color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
            }
        }
    }
    .ant-select-arrow{
        right: auto;
        ${({theme:t})=>t.rtl?"left":"right"}: 11px !important;
        svg{
            color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
        }
    }

    .sort-group{
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        display: flex;
        align-items: center;
        justify-content: flex-end;


        .ant-select{
            ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 10px;
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 15px;
            @media only screen and (max-width: 575px){
                ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 0px;
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
            }
            min-width: 260px;
            .ant-select-selector{
                border: 0 none;
                background-color: ${({theme:t})=>t[t.mainContent]["input-bg"]};
                .ant-select-selection-item{
                    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                }

            }
        }
        .layout-style{
            display: flex;
            align-items: center;
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 20px;
            a{
                display: flex;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                fill: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                &:hover,
                &.active{
                    color: ${({theme:t})=>t[t.mainContent]["menu-active"]};
                    background: ${({theme:t})=>t[t.mainContent]["white-background"]};
                    svg{
                        fill: ${({theme:t})=>t[t.mainContent]["menu-active"]};
                    }
                }
            }
        }
    }
    @media (max-width: 400px){
        .sort-group .ant-select{
            min-width: 200px;
        }
        .project-sort-search{
            .ant-select-auto-complete{
                width: 100% !important;
            }
        }
        .project-sort-nav{
            nav{
                padding: 10px;
            }
            nav ul{
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: -5px;
                li{
                    ${({theme:t})=>t.rtl?"border-left":"border-right"}: 0 none;
                    margin-bottom: 5px;
                }
            }
        }
    }
`,h.Ay.div`
    .ant-card-body{
        padding: 0px !important;
    }
    .project-top{
        padding:30px 30px 0px;
    }
    .project-bottom{
        .project-assignees{
            padding: 16px 30px 25px;
        }
    }
    .project-title{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        h1{
            font-size: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: -2px;
            a{
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 11px !important;
            }
            a,
            .ant-tag{
                margin: 2px;
            }
            .ant-tag{
                text-transform: uppercase;
                font-size: 10px;
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
                line-height: 18px;
                background: red;
                color: #fff;
                border: 0 none;
                &.early{
                    background: ${({theme:t})=>t["primary-color"]};
                }
                &.progress{
                    background: #FF4D4F;
                }
                &.late{
                    background: ${({theme:t})=>t["warning-color"]};
                }
                &.complete{
                    background: ${({theme:t})=>t["success-color"]};
                }
            }
        }
        svg {
            fill: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
        .ant-dropdown-trigger{
            color: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
        }
    }
    .project-desc{
        margin: 7px 0 25px 0;
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
    }
    .project-timing{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        div{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 30px;
            &:last-child{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 0;
            }
            span, strong{
                display: block;
            }
            span{
                font-size: 12px;
                margin-bottom: 2px;
                color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
            }
            strong{
                font-weight: 500;
                color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
            }
        }
    }
    .project-progress{
        p{
            margin: 2px 0 0 0;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
            font-size: 12px;
        }
        .ant-progress-text{
            font-size: 12px;
            font-weight: 500;
        }
    }
    .project-assignees{
        border-top: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
        margin-top: 17px;
        padding-top: 16px;
        p{
            font-size: 14px;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
        ul{
            margin: -3px;
            padding: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            li{
                list-style: none;
                padding: 3px;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
        }
    }
`,h.Ay.div`
		margin-top: 30px;
    .ant-pagination{
        display: flex;
        justify-content: flex-end;
        @media only screen and (max-width: 767px) {
            justify-content: center;
        }
    }
`,h.Ay.div`
    h1{
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 5px;
        a{
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
    }
    p{
        margin: 0;
        font-size: 12px;
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
    }
`,h.Ay.div`
    ul{
        margin: -3px;
        padding: 0;
        display: flex;
        align-items: center;
        li{
            list-style: none;
            padding: 3px;
            img{
                width: 35px;
                height: 35px;
                border-radius: 50%;
                object-fit: cover;
            }
        }
    }
`,h.Ay.div`

    .project-list-progress{
        p{
            margin: 4px 0 0 0;
            font-size: 13px;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
    }
    .date-started,
    .date-finished{
        font-weight: 500;
    }
    .ant-table{
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
				padding: 25px;
        .ant-table-thead{
            tr{
                th{
                    background-color: ${({theme:t})=>t[t.mainContent]["main-background-light"]};
                    border-bottom-color: ${({theme:t})=>t[t.mainContent]["border-color-default"]};
										color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                }
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({theme:t})=>t[t.mainContent]["main-background"]};
                    }
                }
                .ant-tag{
					border: 0 none;
                    text-transform: uppercase;
                    &.progress{
                        background-color: #FF4D4F;
						color: #fff;
                    }
                    &.early{
                        background-color: ${({theme:t})=>t["primary-color"]};
						color: #fff;
                    }
                    &.late{
                        background-color: ${({theme:t})=>t["warning-color"]};
						color: #fff;
                    }
                    &.complete{
                        background-color: ${({theme:t})=>t["success-color"]};
						color: #fff;
                    }
                }
                td{
                    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                    border-bottom-color: ${({theme:t})=>t[t.mainContent]["border-color-default"]};

                }
            }
        }
    }
    .ant-table-container table > thead > tr th{
        font-weight: 400;
        color: ${({theme:t})=>t[t.mainContent]["light-text"]};
        border-top: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
        &:before{
            content: none !important;
        }
    }
    .ant-table-container table > thead > tr th:first-child {
        border-radius: ${({theme:t})=>t.rtl?"0 10px 10px 0":"10px 0 0 10px"} !important;
        ${({theme:t})=>t.rtl?"border-right":"border-left"}: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
    }
    .ant-table-container table > thead > tr th:last-child {
        border-radius: ${({theme:t})=>t.rtl?"10px 0 0 10px":"0 10px 10px 0"} !important;
        ${({theme:t})=>t.rtl?"border-left":"border-right"}: 1px solid ${({theme:t})=>t[t.mainContent]["border-color-default"]};
    }
    .project-action {
        svg{
            fill: ${({theme:t})=>t[t.mainContent]["extra-light-text"]};
        }
    }

`,h.Ay.div`
    .project-header{
        display: flex;
        align-items: center;
        @media only screen and (max-width: 800px) {
            flex-wrap: wrap;
        }
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            button{
                margin: 15px 0 0;
            }
        }
        h1{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
            margin-bottom: 0;
            font-size: 20px;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            @media only screen and (max-width: 800px) {
                margin-bottom: 10px;
            }
            @media only screen and (max-width: 575px) {
                margin: 0;
            }
        }
        button{
            font-size: 12px;
            font-weight: 500;
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
            height: 35px;
            padding: 0px 13.5px;
						svg{
							fill: #fff;
						}
            &.btn-markComplete{
                background: #fff !important;
                border-color: ${({theme:t})=>t["border-color-deep"]} !important;
								svg{
									fill: ${({theme:t})=>t["gray-solid"]};
								}
            }
        }
    }
    .project-action{
        .project-edit,
        .project-remove{
            border-radius: 6px;
            background: #fff;
            height: 35px;
            padding: 0 15px;
            font-size: 12px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0 5px;
            box-shadow: 0 3px 5px ${({theme:t})=>t["gray-solid"]}05;
            svg,
            img{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 6px;
            }
            i{
                line-height: 0;
            }
        }
        .project-edit{
            color: ${({theme:t})=>t["primary-color"]};
						svg{
							fill: ${({theme:t})=>t["primary-color"]};
						}
        }
        .project-remove{
            color: ${({theme:t})=>t["danger-color"]};
						svg{
							fill: ${({theme:t})=>t["danger-color"]};
						}
        }
    }
    .project-progress{
        border-radius: 10px;
        background: ${({theme:t})=>t["success-color"]};
        padding: 20px 25px 20px;
        margin-bottom: 25px;
        h3{
            color: #fff;
        }
        .ant-progress-inner{
            background: rgba(255,255,255, 0.2);
        }
        .ant-progress-bg{
            background: #fff;
        }
        .ant-progress-text{
            color: #fff;
            font-weight: 500;
        }
        .ant-progress>div{
            flex-direction: row;
        }
    }
    .about-project-wrapper{
        min-height: 485px;
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        border-radius: 10px;
        margin-bottom: 25px;
    }
    .state-single{
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        &:last-child{
            margin-bottom: 0;
        }
        > div{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 20px;
        }
        a{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 12px;
            background: rgba(95,99,242,0.1);
        }
        h1{
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 3px;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
        p{
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            margin: 0;
        }
        .color-primary{
            a{
                background: rgba(255,105,165,0.1);
                svg{
                    fill: ${({theme:t})=>t["primary-color"]};
                }
            }
        }
        .color-secondary{
            a{
                background: rgba(95,99,242,0.1);
                svg{
                    fill: ${({theme:t})=>t["secondary-color"]};
                }
            }
        }
        .color-success{
            a{
                background: rgba(32,201,151,0.1);
                svg{
                    fill: ${({theme:t})=>t["success-color"]};
                }
            }
        }
        .color-warning{
            a{
                background: rgba(250,139,12,0.1);
                svg{
                    fill: ${({theme:t})=>t["warning-color"]};
                }
            }
        }
    }
    .about-content{
        p{
            font-size: 15px;
            line-height: 25px;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
    }
    .about-project{
        margin: 42px -40px 0;
        display: flex;
        align-items: center;
        @media only screen and (max-width: 991px) {
            flex-flow: column;
            align-items: flex-start;
        }
        div{
            margin: 0 40px;
            span{
                color: ${({theme:t})=>t["gray-solid"]};
                font-size: 13px;
                display: block;
                margin-bottom: 3px;
            }
            p{
                font-weight: 500;
            		color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
            }
        }
    }
    .project-users-wrapper{
        .btn-addUser{
            padding: 0px 12.6px;
            font-size: 12px;
            font-weight: 500;
            color: ${({theme:t})=>t["gray-solid"]} !important;
            border-color: ${({theme:t})=>t[t.mainContent]["border-color-default"]};
						svg{
							fill: ${({theme:t})=>t["gray-solid"]};
						}
        }
        i +span, svg +span, img +span {
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 6px;
        }
    }
    .project-users{
        min-height: 368px;
        .porject-user-single{
            display: flex;
            align-items: center;
            margin-bottom: 25px;
            &:last-child{
                margin-bottom: 0;
            }
            & > div{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 15px;
            }
            div{
                img{
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    object-fit: cover;
                    display: block;
                }
                h1{
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                }
                p{
                    color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                    margin: 0;
                }
            }
        }
    }

    .file-list{
        min-height: 385px;
        .file-list__single{
            justify-content: space-between;
            align-items: center;
            &:not(:last-child){
                margin-bottom: 18px;
            }
            span{
                display: block;
                font-size: 12px;
                line-height: 1.42;
                &.file-name{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                }
                &.file-size{
                    margin: 2px 0;;
                    color: ${({theme:t})=>t["gray-solid"]};
                }
                &.file-content-action{
                    a{
                        font-weight: 500;
                        color: ${({theme:t})=>t["primary-color"]};
                    }
                    a + a{
                        margin-left: 8px;
                    }
                }
            }
        }
        .file-single-info{
            width: 50%;
            align-items: center;
            .file-single-logo{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 16px;
                img{
                    max-width: 42px;
                }
            }
        }
        .file-single-action{
            .ant-dropdown-trigger {
                color: ${({theme:t})=>t["extra-light-color"]};
            }
						a svg{
							fill: #9299b8;
						}
        }
    }

    .dropdown-more{
        a{
            font-size: 13px;
            svg,
            i.
            img{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 8px;
            }
        }
    }
`,h.Ay.div`
    .ant-card{
        .ant-card-head{
            border-color: ${({theme:t})=>t[t.mainContent]["border-color-default"]};
            margin-bottom: 0;
        }
        .ant-card-body{
            padding: 0 !important;
        }
    }
    nav{
        a{
            font-size: 14px;
            font-weight: 500;
            color: ${({theme:t})=>t["gray-solid"]};
            position: relative;
            padding: 20px 0px;
            &:not(:last-child){
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 18px;
            }
            &:before{
                position: absolute;
                content: '';
                width: 100%;
                ${({theme:t})=>t.rtl?"right":"left"}: 0;
                bottom: -2px;
                height: 1px;

            }
            &.active{
                color: ${({theme:t})=>t["primary-color"]};
                &:before{
                    background: ${({theme:t})=>t["primary-color"]};
                }
            }
        }
    }
    .ant-table {
        background-color: unset;
    }
    table{
        margin-top: 15px;

        .ant-checkbox-checked{
            .ant-checkbox-inner{
                background: ${({theme:t})=>t["success-color"]};
                border-color: ${({theme:t})=>t["success-color"]};
            }
            &:after{
                border-color: ${({theme:t})=>t["success-color"]};
            }
        }
        thead{
            display: none;
        }
        tr{
            th{
                background: #fff;
                border-bottom: 0;
                padding: 10px;
                &:first-child{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 25px;
                }
                .ant-checkbox-indeterminate {
                    .ant-checkbox-inner{
                        &:after{
                            background: ${({theme:t})=>t["success-color"]};
                        }
                    }
                }
            }
            &:hover{
                td{
                    background: #fff;
                }
            }
        }
        .ant-table-tbody{
            > tr.ant-table-row{
                &.ant-table-row-selected{
                    > td{
                        background: #fff;
                    }
                    .task-title{
                        text-decoration: line-through;
                    }
                }
                > td{
                    padding: 10px;
                    border-bottom: 0;
                    text-align: ${({theme:t})=>t.rtl?"right":"left"};
                    &:first-child{
                        ${({theme:t})=>t.rtl?"padding-right":"padding-left"}: 25px;
                    }
                    &:last-child{
                        ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 25px;
                    }
                    .task-title{
                        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                    }
                    .task-created{
                        font-size: 12px;
                        color: ${({theme:t})=>t["gray-color"]};
                    }
                    .ant-checkbox{
                        &:hover{
                            .ant-checkbox-inner{
                                border-color: ${({theme:t})=>t["success-color"]};
                            }
                        }
                    }
                }
                &:hover{
                    box-shadow: 0 15px 50px ${({theme:t})=>t["gray-solid"]}20;
                    > td{
                        background: #fff;
                    }
                }
            }
        }
    }

    .tasklist-action{
        margin: 18px 25px 25px;
        button{
            width: 100%;
            text-align: ${({theme:t})=>t.rtl?"right":"left"};
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 500;
            &.ant-btn-primary{
                border-radius: 6px;
                background: ${({theme:t})=>t["primary-color"]}10;
            }
						svg{
							fill: ${({theme:t})=>t["primary-color"]};
							margin-right: 5px;
						}
        }
    }
`,h.Ay.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 -10px;
    span, img, div{
        display: block;
        margin: 0 10px;
        line-height: normal;
    }
    span, a{
        color: ${({theme:t})=>t["gray-solid"]};
    }
    .task-created{
        color: #9299b8 !important;
    }
    .task-move{
        svg,
        i{
            color: #D8DCEB;
        }
				svg{
					fill: #D8DCEB;
				}
    }
		.task-action{
			svg{
				fill: #9299b8;
			}
		}
`,h.Ay.div`
    padding: 25px;
    min-height: 435px;
    .activity-block{
        &:not(:last-child){
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid ${({theme:t})=>t["border-color-light"]};
        }
    }
    .activity-dateMeta{
        height: 100%;
        border-radius: 10px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        background: ${({theme:t})=>t["bg-color-light"]};
        border: 1px solid ${({theme:t})=>t["border-color-light"]};
        @media only screen and (max-width: 575px) {
            height: auto;
            padding: 30px 0px;
            margin-bottom: 25px;
        }
        h1{
            font-size: 18px;
            margin-bottom: 0px;
        }
        .activity-month{
            color: ${({theme:t})=>t["gray-color"]};
        }
    }

    .activity-single{
        &:not(:last-child){
            margin-bottom: 25px;
        }
        .activity-icon{
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            margin: ${({theme:t})=>t.rtl?"4px 0 0 10px":"4px 10px 0 0"};
            &.bg-primary{
                background: ${({theme:t})=>t["primary-color"]}15;
                color: ${({theme:t})=>t["primary-color"]};
            }
            &.bg-secondary{
                background: ${({theme:t})=>t["secondary-color"]}15;
                color: ${({theme:t})=>t["secondary-color"]};
            }
            &.bg-success{
                background: ${({theme:t})=>t["success-color"]}15;
                color: ${({theme:t})=>t["success-color"]};
            }
        }
        img{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
        }
        .activity-title{
            font-size: 14px;
            font-weight: 500;
            margin: -4px 0 0;
            span{
                font-weight: 400;
                margin: 0 2px;
                color: ${({theme:t})=>t["gray-solid"]};
            }
        }
        .activity-timeMeta{
            font-size: 12px;
            margin-bottom: 0;
            color: ${({theme:t})=>t["extra-light-color"]};
        }
    }
`;const s=h.Ay.div`
    margin-top: 10px;
    button{
        margin-right: 10px;
    }
`;var f=n(79841);const b=[{label:"Privet",value:"privet"},{label:"Team",value:"team"},{label:"Public",value:"public"}],u="MM/DD/YYYY",y=(0,i.pM)({name:"CreateProject",components:{BasicFormWrapper:g.mH,ProjectModalFooter:s},props:{visible:c.Ay.bool.def(!1),onCancel:c.Ay.func.isRequired},setup(t){const e=(0,f.KR)("primary"),n=(0,f.KR)([]),{onCancel:i}=(0,f.QW)(t),o=(0,f.Kh)({project:"",category:"",description:"",privacy:[""],members:"",start:"",end:"",layout:"vertical"}),a=()=>{i.value()},r=()=>{i.value()};return{options:b,handleOk:a,handleCancel:r,modalType:e,checked:n,dateFormat:u,formState:o}}});var w=y,$=n(66262);const k=(0,$.A)(w,[["render",x]]);var v=k},92317:function(t,e,n){n.d(e,{Ai:function(){return a},Gq:function(){return i},SO:function(){return o}});const i=t=>{const e="undefined"!==typeof window?localStorage.getItem(t):"";try{return JSON.parse(e)}catch(n){return e}},o=(t,e)=>{const n="string"!==typeof e?JSON.stringify(e):e;return localStorage.setItem(t,n)},a=t=>{localStorage.removeItem(t)}},92335:function(t,e,n){n.d(e,{at:function(){return o}});var i=n(95853);i.Ay.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    .card-chunk{
        width: 50%;
        flex: 0 0 50%;
        h1{
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
    }
    @media only screen and (max-width: 379px){
        .card-chunk{
            width: 100%;
            flex: 0 0 100%;
            h1{
                margin-bottom: 0;
            }
            p{
                margin: 5px 0 20px 0;
            }
        }
    }
    .chartjs-tooltip {
        min-width: 132px !important;
    }
`,i.Ay.div`
    &.card-mesh-wrap{
        justify-content: space-between;
		flex-wrap: wrap;
        margin-bottom: 25px;
        background-color: ${({theme:t})=>t[t.mainContent]["white-background"]};
        @media only screen and (max-width: 991px){
            flex-wrap: wrap;
        }
        @media only screen and (max-width: 1399px){
            justify-content: flex-start;
        }
        .ninjadash-overview-card-single{
            flex: 0 0 auto;
            margin-bottom: 0;
            @media only screen and (max-width: 991px){
                flex: 0 0 50%;
            }
            @media only screen and (max-width: 575px){
                flex: 0 0 100%;
            }
        }
        &.card-mesh-wrap--two{
            border-radius: 10px;
            .ninjadash-overview-card-single{
                .ninjadash-overview-card{
                    align-items: center;
                }
            }
            .ninjadash-overview-card-single::after{
                content: none;
            }
            .ninjadash-overview-card .ninjadash-overview-card__left .ninjadash-overview-card__left--icon{
                border-radius: 50%;
                svg path{
                    fill: #fff !important;
                }
                &.ninjadash-primary{
                    background-color: ${({theme:t})=>t["primary-color"]};
                }
                &.ninjadash-secondary{
                    background-color: ${({theme:t})=>t["secondary-color"]};
                }
                &.ninjadash-success{
                    background-color: ${({theme:t})=>t["success-color"]};
                }
                &.ninjadash-warning{
                    background-color: ${({theme:t})=>t["warning-color"]};
                }
            }
        }
    }
`,i.Ay.div`
    .ant-table-content{
        .ninjadash-product-price{
            font-weight: 500;
        }
    }
`,i.Ay.div`
    .ninjadash-congratulation-banner{
        @media only screen and (max-width: 991px){
            margin-bottom: 25px;
        }
        .ant-card{
            margin-bottom: 0 !important;
        }
        .ant-card-body{
            min-height: 360px !important;
        }
        .ninjadash-congratulation-banner-content{
            img{
                bottom: -155px;
            }
        }
        figcaption{
            h2{
                font-size: 30px;
                @media only screen and (max-width: 475px){
                    font-size: 24px
                }
            }
            p{
                margin-bottom: 22px;
            }
        }
        &.congratulation-banner--two{
            .ant-card-body{
                position: relative;
                padding: 55px 30px;
            }
            .ninjadash-congratulation-banner-content{
                position: static;
                img{
                    bottom: 0;
                    right: 0;
                    width: 245px;
                    max-width: 245px;
                    height: 245px;
                }
                .banner-feature-btn{
                    color: #fff !important;
                    height: 44px;
                    border-radius: 6px;
                    font-size: 15px;
                    font-weight: 500;
                    background: ${({theme:t})=>t["dark-hover"]};
                    &:focus{
                        color: ${({theme:t})=>t["dark-color"]} !important;
                    }
                }
                figcaption{
                    padding: 25px 5px;
                    p{
                        font-size: 16px;
                    }
                }
            }
        }
    }

`,i.Ay.div`
    .ant-card-head{
        border: 0 none;
        .ant-card-head-title{
            padding-bottom: 0;
        }
    }
    .ant-card{
        .ant-card-body{
            padding: 20px 20px !important;
            @media only screen and (max-width: 991px){
                padding: 20px 10px !important;
            }
            @media only screen and (max-width: 767px){
                min-height: auto;
            }
        }
    }
`,i.Ay.div`
    .ninjadash-sales-inner{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .ninjadash-sales-content{
        justify-content: center;
        text-align: center;
        margin-top: 20px -5px -5px;
        @media only screen and (max-width: 1499px){
            flex-wrap: wrap;
        }
        @media only screen and (max-width: 575px){
            flex-wrap: wrap;
            flex-direction: column;
        }
    }
    .ant-card{
        min-height: 430px;
    }
    .ant-progress{
        .ant-progress-text{
            font-size: 46px;
            font-weight: 600;
            color: ${({theme:t})=>t["primary-color"]};
        }
        .ant-progress-circle{
            top: 0;
        }
    }

    .ninjadash-sales-content__item{
        min-width: 200px;
        margin: 5px;
        @media only screen and (max-width: 575px){
            min-width: auto;
            &:not(:last-child){
                margin-bottom: 15px;
            }
        }
        .ninjadash-sales-content__item--label{
            display: inline-block;
            font-size: 16px;
            margin-bottom: 6px;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
        .ninjadash-sales-content__item--total{
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            line-height: 1;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
    }
`,i.Ay.div`
    .ninjadash-configuration-box{
        display: flex;
        margin: -5px;
        .ninjadash-configuration-box__item{
            margin: 5px;
            text-align: center;
            flex-wrap: wrap;
            .ninjadah-color-code{
                display: block;
                margin-top: 5px;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            }
        }
    }
    /* Button Hover Color Style */
    .ninjadash-configuration-box {
        &.ninjadash-configuration-box-button-hover{
            .ninjadash-configuration-box__item{
                .ant-btn-primary{
                    background-color: ${({theme:t})=>t["primary-hover"]};
                }
                .ant-btn-secondary{
                    background-color: ${({theme:t})=>t["secondary-hover"]};
                }
                .ant-btn-success{
                    background-color: ${({theme:t})=>t["success-hover"]};
                }
                .ant-btn-info{
                    background-color: ${({theme:t})=>t["info-hover"]};
                }
                .ant-btn-warning{
                    background-color: ${({theme:t})=>t["warning-hover"]};
                }
                .ant-btn-danger{
                    background-color: ${({theme:t})=>t["danger-hover"]};
                }
                .ant-btn-dark{
                    background-color: ${({theme:t})=>t["dark-hover"]};
                }
                .ant-btn-gray{
                    background-color: ${({theme:t})=>t["gray-hover"]};
                }
            }
        }
    }
    .ninjadash-heading-typography{
        p{
            margin-bottom: 0;
        }
    }
    .ninjadash-body-typography{
        margin-bottom: 20px;
        h1{
            margin-bottom: 0;
        }
        .ninjadash-typo-list{
            display: flex;
            align-items: center;
            margin: -10px;
            color: ${({theme:t})=>t["primary-color"]};
            li{
                margin: 10px;
            }
        }
        .ninjadash-body-typography__text{
            margin-top: 14px;
        }
        &.typo-small{
            p{
                font-size: 14px;
                line-height: 1.57;
            }
        }
        &.typo-big{
            p{
                font-size: 16px;
                line-height: 1.69;
            }
        }
    }
    h1{
        margin-bottom: 15px;
    }
    .ant-card .ant-card-body{
        >h1{
            margin-bottom: 30px;
        }
    }
    .ant-row{
        margin: -5px 0;
    }
    .ant-col{
        margin: 5px 0;
    }
`,i.Ay.div`
    >div{
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            align-items: flex-start !important;
            ul{
                margin: 0 0 15px;
            }
        }
    }
    .card-bar-top{
        &.flex-grid{
            ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: -20px;
            @media only screen and (max-width: 575px) {
                flex-flow: column;
                align-items: center;
            }
            h1{
                font-size: 24px;
                margin-bottom: 22px;
                @media only screen and (max-width: 1199px) {
                    font-size: 20px;
                }
            }
        }
        .flex-grid-child{
            padding: 0 20px;
        }
        p{
            font-size: 14px;
            margin-bottom: 8px;
            color: ${({theme:t})=>t["light-color"]};
        }
        h1{
            margin-bottom: 18px;
            sub{
                bottom: 0;
                font-size: 14px;
                ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 8px;
                color: ${({theme:t})=>t["success-color"]};
                svg{
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 4px;
                }
            }
        }
        .profitGrowth-list{
            text-align: center;
            .custom-label{
                font-size: 14px
            }
        }
    }
    .ninjadash-chartdata-list{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        li{
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            text-transform: capitalize;
            color: ${({theme:t})=>t["extra-light-color"]};
            &:not(:last-child){
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 16px;
            }
        }
    }
    .chartjs-tooltip{
        min-width: 140px !important;
        @media only screen and (max-width: 1199px){
            min-width: 115px !important;
        }
    }
    .deals-barChart{
        display: flex;
        .card-bar-top{
            &:not(:last-child){
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 30px;
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 30px;
            }
        }
        h4{
            font-weight: 400;
            color: ${({theme:t})=>t["light-gray-color"]};
            p{
                &.growth-down{
                    .deal-percentage{
                        color: ${({theme:t})=>t["danger-color"]};
                    }
                }
                &.growth-up{
                    .deal-percentage{
                        color: ${({theme:t})=>t["success-color"]};
                    }
                }
                .deal-percentage{
                    svg,
                    img,
                    i{
                        ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 3px;
                    }
                }
                .deal-value{
                    font-size: 22px;
                    font-weight: 600;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 8px;
                    color: ${({theme:t})=>t["dark-color"]};
                }
            }
        }
    }
    .deals-list{
        .custom-label{
            font-size: 14px;
            &:not(:last-child){
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 30px;
            }
        }
    }
`,i.Ay.div`
    .ant-card{

        @media only screen and (max-width: 1599px){
            min-height: auto;
        }
    }
    .ninjadash-chart-container{
        @media only screen and (max-width: 1399px){
            height: auto !important;
        }
    }
    .label-detailed {
        display: flex;
        justify-content: center;
        margin: 0 -12px 0;
        flex-wrap: wrap;
        .label-detailed__single {
            padding: 5px 8px;
            margin-bottom: 11px;
            display: flex;
            align-items: center;
            .label-detailed__total {
                font-size: 22px;
                font-weight: 600;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                padding: 0 5px;
            }
            .label-detailed__status {
                display: inline-flex;
                align-items: center;
                line-height: normal;
            }
            .label-detailed__status strong {
                padding: 0;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
`,i.Ay.div`
    max-height: 300px;
    margin-bottom: 30px;
    border: 1px solid ${({theme:t})=>t[t.mainContent]["light-border"]};
		@media only screen and (max-width: 1199px){
			max-height: none;
		}
    .ant-table {
        background: transparent !important;
    }
    table{
        tr{
            &:first-child{
                td{
                    padding-top: 15px;
                }
            }
            &:last-child{
                td{
                    padding-bottom: 15px;
                }
            }
            th{
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
                background-color: ${({theme:t})=>t[t.mainContent]["light-background"]};
                border-color: ${({theme:t})=>t[t.mainContent]["light-background"]};
                padding: 10.5px 20px;
            }
            td{
                font-size: 15px;
                border: 0 none;
                padding: 10.5px 20px;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};

                &:first-child{
                    font-weight: 500;
                    color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                }
            }
            th,
            td{
                &:last-child{
                    padding-right: 40px;
                    text-align: right;
                }
            }
        }
    }

`,i.Ay.div`
    text-align: center;
    height: 100%;
    .svgMap-wrapper{
        height: 100%;
        .svgMap-container,
        .svgMap-map-container,
        .svgMap-map-wrapper,
        .svgMap-map-image{
            height: 100%;
        }
        .svgMap-map-wrapper{
            position: relative;
            background-color: ${({theme:t})=>t[t.mainContent]["white-background"]} !important;
        }
    }
    .__react_component_tooltip {
        background: ${({theme:t})=>t["dark-color"]};
        border-radius: 3px;
        box-shadow: 0 10px 15px ${({theme:t})=>t["light-color"]}15;
    }
    >div{
        width: 100%;
        height: 250px;
        overflow: hidden;
        @media only screen and (max-width: 479px){
            height: 200px;
        }
    }
    svg{
        width: 450px;
        @media only screen and (max-width: 479px){
            height: 180px;
        }
        @media only screen and (max-width: 440px){
            width: 310px;
        }
        @media only screen and (max-width: 320px){
            width: 280px;
        }
    }
    .svgMap-map-controls-wrapper{
        position: absolute;
        right: 20px;
        left: auto !important;
        bottom: 10px;
        box-shadow: none !important;
        .svgMap-map-controls-zoom{
            display: flex;
            flex-direction: column;
        }
        button{
            display: inline-block;
            width: 27px;
            height: 27px;
            background: none;
            color: #5a5f7d;
            border: 1px solid #f1f2f6;
            padding: 0;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #ffffff;
            cursor: pointer;
            margin: 0 !important;
            &.svgMap-zoom-in-button{
                &:before{
                    width: 8px !important;
                    height: 1px !important;
                }
                &:after{
                    width: 1px !important;
                    height: 8px !important;
                }
            }
            &.svgMap-zoom-out-button{
                &:before{
                    width: 8px !important;
                    height: 1px !important;
                }
            }
            &:first-child{
                border-radius: 6px 6px 0 0;
            }
            &:last-child{
                border-radius: 0 0 6px 6px;
            }
            &:focus{
                outline: none;
            }
            svg{
                width: 10px;
            }
        }
        button + button{
            border-top: 0 none;
        }
    }
`,i.Ay.div`
    .ninjadash-sales-revenue{
        margin-bottom: 0 !important;
    }
    .ninjadash-sales-revenue-lineChart{
        margin-top: 10px;
        margin-left: -4px;
        margin: 10px 0 0 -4px;
    }
    .ninjadash-chart-container{
        min-height: 290px;
        margin-right: -14px;
        @media only screen and (max-width: 1199px){
            min-height: auto;
        }
    }
    .ninjadash-sales-revenue-loading{
        min-height: 290px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`,i.Ay.div`
    .ninjadash-sales-revenue{
        margin-bottom: 0 !important;
    }
    .ninjadash-sales-revenue-lineChart{
        margin-top: 10px;
        margin-left: -4px;
        margin: 10px 0 0 -4px;
    }
    .ninjadash-chart-container{
        min-height: 260px;
        margin-right: -14px;
        @media only screen and (max-width: 1199px){
            min-height: auto;
        }
        @media only screen and (max-width: 1399px){
            min-height: auto;
        }
    }
    .ninjadash-sales-revenue-loading{
        min-height: 260px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .label-detailed {
        display: flex;
        justify-content: center;
        margin: -16px -12px -5px;
        flex-wrap: wrap;
        .label-detailed__single {
            padding: 5px 8px;
            margin-bottom: 11px;
            display: flex;
            align-items: center;
            .label-detailed__type {
                font-size: 14px;
                font-weight: 400;
                display: inline-flex;
                align-items: center;
                color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                padding: 0 5px;
                &::before{
                    content: "";
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #eee;
                    display: inline-block;
                    margin-right: 5px;
                }
            }
            .label-detailed__type--primary:before {
                background: ${({theme:t})=>t["primary-color"]};
            }
            .label-detailed__type--info:before {
                background: ${({theme:t})=>t["info-color"]};
            }
            .label-detailed__total {
                font-size: 22px;
                font-weight: 600;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                padding: 0 5px;
            }
            .label-detailed__status {
                display: inline-flex;
                align-items: center;
                line-height: normal;
            }
            .label-detailed__status strong {
                padding: 0;
                font-size: 14px;
                font-weight: 500;
            }
        }
    }
`,i.Ay.div`
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
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 5px;
            background-color: ${({theme:t})=>t["primary-color"]};
        }
        .ninjadash-overview-percentage__text{
            font-size: 15px;
            font-weight: 500;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
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
        background: ${({theme:t})=>t[t.mainContent]["light-background"]};
        .ninjadash-overview-box-item{
            text-align: center;
            h4{
                font-size: 18px;
                line-height: 1;
                font-weight: 600;
                margin-bottom: 6px;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            }
            p{
                margin-bottom: 0;
                font-size: 15px;
                line-height: 1.25;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            }
        }
    }

`,i.Ay.div`
    .ninjadash-revenue-company{
        .ninjadash-revenue-company__icon{
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
            height: 32px;
            width: 32px;
            &.ninjadash-revenue-company__icon-google{
                background-color: #F1433610;
                color: #F14336
            }
            &.ninjadash-revenue-company__icon-facebook{
                background-color: #1976D210;
                color: #1976D2;
            }
            &.ninjadash-revenue-company__icon-twitter{
                background-color: #03A9F410;
                color: #03A9F4;
            }
            &.ninjadash-revenue-company__icon-linkedin{
                background-color: #007AB910;
                color: #007AB9;
            }
            &.ninjadash-revenue-company__icon-instagram{
                background-color: #D1208F10;
                color: #D1208F;
            }
        }
        .ninjadash-revenue-company__content{
            span{
                font-size: 15px;
                font-weight: 500;
                text-transform: capitalize;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            }
        }
    }
    .ant-table-content{
        table{
            tr{
                th{
                    &:first-child,
                    &:last-child{
                        text-align: left !important;
                    }
                }
                th,
                td{
                    padding-right: 0;
                    text-align: right;
                }
                td{

                    padding: 9.5px 15px !important;
                    &:first-child{
                        padding-left: 0 !important;
                    }
                    &:last-child{
                        padding-right: 0px !important;
                    }
                    .ninjadash-trend-progress{
                        min-width: 80px;

                        .ninjadash-trend-percentage{
                            font-size: 14px;
                            font-weight: 400;
                            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 14px;
                            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                        }
                        .ant-progress-inner{
                            background-color: ${({theme:t})=>t[t.mainContent]["dark-background"]};
                        }
                        .ant-progress-bg{
                            border-radius: 30px;
                        }
                        &.ninjadash-trend-progress-google{
                            .ant-progress-bg{
                                background-color: ${({theme:t})=>t["primary-color"]};
                            }
                        }
                        &.ninjadash-trend-progress-facebook{
                            .ant-progress-bg{
                                background-color: ${({theme:t})=>t["info-color"]};
                            }
                        }
                        &.ninjadash-trend-progress-twitter{
                            .ant-progress-bg{
                                background-color: ${({theme:t})=>t["success-color"]};
                            }
                        }
                        &.ninjadash-trend-progress-linkedin{
                            .ant-progress-bg{
                                background-color: ${({theme:t})=>t["secondary-color"]};
                            }
                        }
                        &.ninjadash-trend-progress-instagram{
                            .ant-progress-bg{
                                background-color: ${({theme:t})=>t["warning-color"]};
                            }
                        }
                    }
                }
            }
        }
    }
    .table-responsive{
        .ant-table-content{
            table{
                tr{
                    th,
                    td{
                        white-space: normal;
                    }
                }
            }
        }
    }
    .ant-table-content .ant-table-thead >tr >th.ant-table-cell:last-child{
        text-align: left !important;
    }
`,i.Ay.div`
    @media only screen and (max-width: 379px){
        text-align: center
    }
    h1{
        margin-bottom: 5px;
    }
    @media only screen and (max-width: 1500px){
        h1{
            font-size: 22px;
        }
    }
    & > span{
        font-size: 14px;
        color: ${({theme:t})=>t["light-gray-color"]};
    }
    p{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 21px 0 -6px 0;
        @media only screen and (max-width: 379px){
            justify-content: center;
        }
        .growth-upward, .growth-downward{
            display: inline-flex;
            align-items: center;
            ${({theme:t})=>t.rtl?"padding-left":"padding-right"}: 10px;
            font-weight: 600;

            svg{
                width: 15px;
            }
        }
        .growth-upward{
            color: ${({theme:t})=>t["success-color"]};
            svg{
                fill: ${({theme:t})=>t["success-color"]};
            }
        }
        .growth-downward{
            color: ${({theme:t})=>t["danger-color"]};
            svg{
                fill: ${({theme:t})=>t["danger-color"]};
            }
        }
        span{
            color: ${({theme:t})=>t["light-gray-color"]};
            font-size: 14px;
            display: inline-block;
        }
    }
`;const o=i.Ay.div`
    display: block;
    font-family: 'Jost', sans-serif;
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: ${({theme:t})=>t[t.mainContent]["white-background"]};
        box-shadow: 0 3px 16px ${({theme:t})=>t[t.mainContent]["border-color-default"]}50;
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
            border-top: 5px solid ${({theme:t})=>t[t.mainContent]["white-background"]};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({theme:t})=>t.rtl?"right":"left"}: 50%;
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
        ${({theme:t})=>t.rtl?"margin-left":"margin-right"} : 5px;
    }
    .tooltip-title {
        color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
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
                color: ${({theme:t})=>t["extra-light-color"]};
                .data-label{
                    ${({theme:t})=>t.rtl?"margin-right":"margin-left"}: 3px;
                    color: ${({theme:t})=>t["light-gray-color"]};
                }
            }
        }
    }
`;i.Ay.div`
    .ninjadash-event-details{
        .ninjadash-event-details__date{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: ${({theme:t})=>t["white-color"]};
            min-width: 60px;
            min-height: 60px;
            padding: 0 10px;
            border-radius: 6px;
            &.ninjadash-event-primary{
                background-color: ${({theme:t})=>t["primary-color"]};
            }
            &.ninjadash-event-info{
                background-color: ${({theme:t})=>t["info-color"]};
            }
            &.ninjadash-event-secondary{
                background-color: ${({theme:t})=>t["secondary-color"]};
            }
            &.ninjadash-event-warning{
                background-color: ${({theme:t})=>t["warning-color"]};
            }
            span{
                font-size: 15px;
                font-weight: 500;

            }
        }
        .ninjadash-event-details__content{
            margin:  ${({theme:t})=>t.rtl?"-1px 15px 0 0":"-1px 0 0 15px"};
            .ninjadash-event-details__title{
                font-size: 15px;
                font-weight: 400;
                margin-bottom: 2px;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
            }
            .ninjadash-event-details__time{
                line-height: 1;
                margin-bottom: 0;
                color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
            }
        }
    }
    .ant-table-content{
        .ant-table-tbody {
            >tr >td.ant-table-cell:last-child{
                padding-right: 0;
            }
            >tr:first-child >td.ant-table-cell{
                padding-top: 6px !important;
            }
        }
    }
    .ninjadash-event-details-action{
        display: flex;
        align-items: center;
        margin: -12px;
        justify-content: flex-end;
        a{
            display: block;
            margin: 12px;
            svg{
                fill: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
            }
            @media only screen and (max-width: 575px){
                margin: 0 5px;
            }
        }
        .ninjadash-event-details-action__edit{
            &:hover{
                svg{
                    fill: ${({theme:t})=>t["info-color"]};
                }
            }

        }
        .ninjadash-event-details-action__delete{
            &:hover{
                svg{
                    fill: ${({theme:t})=>t["danger-color"]};
                }
            }
        }
    }
`,i.Ay.div`
    @media only screen and (max-width: 1599px){
        min-height: 360px;
    }
    @media only screen and (max-width: 991px){
        min-height: auto;
    }
    .ninjadash-knowledgebase-card{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
        min-height: 310px;
        .ninjadash-knowledgebase-card__text{
            text-align: center;
            margin-top: 18px;
        }
        .ninjadash-knowledgebase-card__title{
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 8px;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
        }
        p{
            font-size: 16px;
            line-height: 1.75;
            margin-bottom: 26px;
            color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
        }
    }
    .ninjadash-knowledgebase-card__action{
        font-weight: 500;
        height: 38px;
    }
`,i.Ay.div`
    .ant-timeline{
        margin-top: 5px;
        .ant-timeline-item-content{
            p{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 500;
                span{
                    color: ${({theme:t})=>t[t.mainContent]["dark-light"]};
                    &.ninjadash-time{
                        font-size: 13px;
                        font-weight: 400;
                        color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
                    }
                }
            }
        }
    }
    .ant-card {
        @media only screen and (max-width: 1199px){
            min-height: 410px;
        }
        @media only screen and (max-width: 991px){
            min-height: auto;
        }
        .ant-card-body{
            padding-bottom: 32px !important;
        }
    }
`,i.Ay.div`
    .ant-list {
        padding-top: 5px;
        .ant-list-items{
            padding-top: 0;
            li{
                &:not(:last-child){
                    margin-bottom: 18px;
                }
            }
            .ant-list-item{
                padding: 0;
                border: 0 none;
                .ant-list-item-meta{
                    padding: 0;
                    border: 0 none;
                }
                .ninjadash-mail-time{
                    font-size: 13px;
                    color: ${({theme:t})=>t[t.mainContent]["gray-light-text"]};
                }
                .ant-list-item-meta-avatar{
                    width: 34px;
                    height: 34px;
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 16px;
                }
            }
            .ant-list-item-meta-content{
                margin-top: -4px;
                .ant-list-item-meta-title{
                    font-size: 15px;
                    font-weight: 500;
                    margin-bottom: 0;
                    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
										a{
											color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
										}
                }
                .ant-list-item-meta-description{
                    font-size: 12px;
                    color: ${({theme:t})=>t[t.mainContent]["gray-text"]};
                }
            }
        }
    }
    .ant-card{
        @media only screen and (max-width: 1199px){
            min-height: 446px;
        }
        @media only screen and (max-width: 991px){
            min-height: auto;
        }
    }
`,i.Ay.div`
    .ant-table {
        background: transparent !important;
    }
    .top-seller-table {
        min-height: auto;
        .product-info{
            max-width: 280px;
            .product-img{
                ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 10px;
            }
            .product-name{
                text-transform: capitalize;
                font-size: 15px;
                font-weight: 500;
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]}
            }
        }
        .ant-table-thead {
            th {
                background: ${({theme:t})=>t[t.mainContent]["light-background"]};
            }
        }
        .ant-table-row {
            .ant-table-cell{
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                &:not(first-child){
                    text-align: right;
                }

            }
        }
    }
`,i.Ay.div`
    .ant-table {
        min-height: 310px;
        background: transparent !important;

        .ant-table-thead {
            th {
                background: ${({theme:t})=>t[t.mainContent]["light-background"]};
                &:not(:first-child){
                    text-align: right;
                }
            }
        }
        .ant-table-tbody >tr >td.ant-table-cell{
            padding-top: 20px;
        }
        .ant-table-row {
            .ant-table-cell{
                color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
                &:not(first-child){
                    text-align: right;
                }
            }
        }
    }
    .ninjadash-product-info{
        .ninjadash-product-img{
            ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 12px;
            img{
                max-width: 31px;
            }
        }
        .ninjadash-product-name{
            font-size: 15px;
            text-transform: capitalize;
            font-weight: 500;
            color: ${({theme:t})=>t[t.mainContent]["dark-text"]}
        }
    }
`,i.Ay.div`
    margin-top: 26px;
    .doughnutchart-inner-label{
        display: inline-block;
        margin-top: 6px;
        color: ${({theme:t})=>t[t.mainContent]["dark-text"]};
    }
    .ninjadash-chartpoint{
        margin-top: 34px !important;
        margin-bottom: 10px !important;
    }
    .ninjadash-chartpoint-graph{
        @media only screen and (max-width: 480px){
            height: 150px !important;
            width: auto !important;
        }
    }
    .performance-chart-wrap{
        display: flex;
		align-items: center;
        @media only screen and (max-width: 991px){
            display: flex;
            align-items: center;
            flex-direction: column;
        }
    }
    .performance-chart-labels{
        margin-left: 38px;
		ul {
			li {
				font-size: 15px;
				font-weight: 400;
				display: flex;
				align-items: center;
				&:not(:last-child) {
					margin-bottom: 12px;
				}
				&::before {
					content: '';
					width: 7px;
					height: 7px;
					border-radius: 50%;
					background: #ccc;
					margin-right: 7px;
				}
				&.label-target {
					color: ${({theme:t})=>t[t.mainContent]["gray-color"]};
					&::before {
						background: ${({theme:t})=>t["primary-color"]};
					}
				}
				&.label-completed {
					&::before {
						background: ${({theme:t})=>t["info-color"]};
					}
				}
				&.label-in-progress {
					&::before {
						background: ${({theme:t})=>t["warning-color"]};
					}
				}
			}
		}
        @media only screen and (max-width: 991px){
            margin: 0 !important;
            ul{
                display: flex;
                align-items: center;
                gap: 20px;
                margin-top: 15px;
                li{
                    margin: 0 !important;
                }
            }
        }
        @media only screen and (max-width: 479px){
            ul{
                flex-wrap: wrap;
                justify-content: center
            }
        }
    }
	.performance-chart {
		width: 285px;
		height: 297px;
		margin: -25px;
	}
`,i.Ay.div`
    @media only screen and (max-width: 1599px){
        /* min-height: 524px; */
        /* background: #fff; */
        border-radius: 10px;
    }
    .performance-lineChart{
        margin-top: 20px;
        .chart-label{
            display: none;
        }
        ul{
            margin-top: 16px;
            li{
                &:not(:last-child){
                    ${({theme:t})=>t.rtl?"margin-left":"margin-right"}: 25px;
                }
            }
        }
    }
    .chartjs-tooltip{
        min-width: 175px !important;
        @media only screen and (max-width: 767px){
            min-width: 150px !important;
        }
    }
`,i.Ay.div`
    padding: 25px 25px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media only screen and (max-width: 1366px){
        padding-bottom: 0;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
    @media only screen and (max-width: 767px){
        flex-wrap: wrap;
    }
    @media only screen and (min-width: 767px){
        &.revenuePieChart--wrapper{
            .revenuePieChart{
                margin-left: -21px;
            }
            .chart-content__details{
                margin-left: 30px;
            }
        }
    }
    .ninjadash-chart-container{
        position: relative;
        .chartjs-tooltip{
            position: absolute;
            background: #000;
            color: #fff;
            padding: 10px 15px;
            border-radius: 6px;
            table td{
                padding: 0;
            }
        }
    }
    .pieChart{
        width: 250px !important;
        height: 250px !important;
        @media only screen and (max-width: 1366px){
            width: 170px !important;
            height: 170px !important;
        }
    }
    .chart-content__details {
        display: flex;
        align-items: center;
        @media only screen and (max-width: 767px){
            flex-wrap: wrap;
            justify-content: center;
        }
    }
    .chart-content__single {
        text-align: center;
        span {
            display: block;
            &.icon {
                width: 80px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 22px 22px 0;
                border-radius: 10px;
                @media only screen and (max-width: 1366px){
                    width: 60px;
                    height: 60px;
                }
                @media only screen and (max-width: 479px){
                    width:60px;
                    height: 60px;
                    margin: 15px 15px 0;
                }
                svg {
                    width: 30px;
                }
                span,
                i{
                    font-size: 30px;
                }
                &.color-facebook {
                    background: rgba(130, 49, 211, 0.2);
                    svg{
                        fill: #FF8000;
                    }
                }
                &.color-google {
                    background: rgba(88, 64, 255, 0.2);
                }
                &.color-twitter {
                    background: rgba(0, 170, 255, 0.2);
                    svg{
                        fill: #00aaff;
                    }
                }
            }
            &.label {
                font-weight: 500;
                font-size: 15px;
                margin-top: 7px;
                color: var(--color-dark);
            }
            &.data {
                font-weight: 500;
                font-size: 14px;
                margin-top: 2px;
                color: var(--color-gray);
            }
        }
    }
`}}]);