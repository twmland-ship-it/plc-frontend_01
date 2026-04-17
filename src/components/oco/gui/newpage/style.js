import Styled from "vue3-styled-components";

const guiWrap = Styled.div`
  
    .ant-card{
        position:relative;
        margin-bottom:1rem;
        width:100%;
        .bg-icon {
            position: absolute; /* 设置绝对定位 */
            bottom: 0; /* 将 1/4 圆放置在父元素的底部 */
            right: 0; /* 将 1/4 圆放置在父元素的左侧 */
            width: 100px;
            height: 100px;
            background-color: #fa8b0c15; 
            border-radius: 100px 0 0 0;
            display: flex;
            justify-content: center;
            align-items: center;
            .unicon svg {
              position: absolute;
              height:50px;
              width:50px
              right: 10px;
              bottom: 10px;
              color: #ff8000;
              fill: ${({ theme }) => theme["primary-hover"]};
            }
        }
    }
    .action-icons{
        display:flex;
        align-items:center;
        .unicon{
            margin:0 0.4rem;
            cursor:pointer;
            svg{
                fill: #ff8000;
                color: #ff8000;
            }
        }
    }
 
    .sub-title{
        display:flex;
        justify-content:space-between;
        margin:1rem 0;
        .sub-title-text{
            font-size:24px;
            font-weight:bold;
        }
    }
`;
const modalWrap = Styled.div`
    .act-btn{
        margin:0 5px;
    }
`;

const contentWrap = Styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    height:calc(100vh - 200px);
`;
export { guiWrap, modalWrap, contentWrap };
