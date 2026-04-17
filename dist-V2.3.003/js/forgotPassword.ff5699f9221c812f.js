"use strict";(self["webpackChunkplc2_0"]=self["webpackChunkplc2_0"]||[]).push([[2249],{18789:function(t,e,n){n.r(e),n.d(e,{default:function(){return f}});var o=n(20641);const a=(0,o.Lk)("div",{class:"ninjadash-authentication-top"},[(0,o.Lk)("h2",{class:"ninjadash-authentication-top__title"},"Forgot Password?")],-1),i={class:"ninjadash-authentication-content"},r=(0,o.Lk)("p",{class:"forgot-text"}," Enter the email address you used when you joined and we’ll send you instructions to reset your password. ",-1),l={class:"return-text"};function s(t,e,n,s,p,d){const c=(0,o.g2)("a-input"),m=(0,o.g2)("a-form-item"),g=(0,o.g2)("sdButton"),x=(0,o.g2)("router-link"),h=(0,o.g2)("a-form"),u=(0,o.g2)("AuthWrapper"),f=(0,o.g2)("a-col"),b=(0,o.g2)("a-row");return(0,o.uX)(),(0,o.Wv)(b,{justify:"center"},{default:(0,o.k6)((()=>[(0,o.bF)(f,{xxl:6,xl:12,md:12,sm:18},{default:(0,o.k6)((()=>[(0,o.bF)(u,null,{default:(0,o.k6)((()=>[a,(0,o.Lk)("div",i,[(0,o.bF)(h,{onFinish:t.handleSubmit,model:t.formState,layout:"vertical"},{default:(0,o.k6)((()=>[r,(0,o.bF)(m,{label:"Email Address",name:"email"},{default:(0,o.k6)((()=>[(0,o.bF)(c,{type:"email",value:t.formState.email,"onUpdate:value":e[0]||(e[0]=e=>t.formState.email=e),placeholder:"name@example.com"},null,8,["value"])])),_:1}),(0,o.bF)(m,null,{default:(0,o.k6)((()=>[(0,o.bF)(g,{class:"btn-reset",htmlType:"submit",type:"primary",size:"lg"},{default:(0,o.k6)((()=>[(0,o.eW)(" Send Reset Instructions ")])),_:1})])),_:1}),(0,o.Lk)("p",l,[(0,o.eW)(" Return to "),(0,o.bF)(x,{to:"/auth/login"},{default:(0,o.k6)((()=>[(0,o.eW)("Sign In")])),_:1})])])),_:1},8,["onFinish","model"])])])),_:1})])),_:1})])),_:1})}var p=n(79841),d=n(95853);const c=d.Ay.div`
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
`;var m=n(96763);const g=(0,o.pM)({name:"ForgotPassword",components:{AuthWrapper:c},setup(){const t=t=>{m.log(t)},e=(0,p.Kh)({email:""});return{handleSubmit:t,formState:e}}});var x=g,h=n(66262);const u=(0,h.A)(x,[["render",s]]);var f=u}}]);