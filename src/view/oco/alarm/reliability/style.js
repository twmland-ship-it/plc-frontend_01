import Styled from "vue3-styled-components";
const CardWrap = Styled.div`
    .piewrap{
        max-width:300px;
        max-height:300px;
       
        width:100%;
        margin:auto
    }
    .bordered-col {
        border: 1px solid #e8e8e8; 
        padding: 16px; 
    }
        
    .action{
        color:${({ theme }) => theme["primary-color"]}
        cursor:pointer
    }
    button{
        .unicon svg {
            color: ${({ theme }) => theme["primary-color"]};
            fill: ${({ theme }) => theme["primary-color"]};
        }
       
    }

    .del-btn {
        .unicon svg {
            color: ${({ theme }) => theme["error-color"]};
            fill: ${({ theme }) => theme["error-color"]};
        }
    }
   
`;
export { CardWrap };
