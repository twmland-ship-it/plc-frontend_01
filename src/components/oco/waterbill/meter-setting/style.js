import Styled from "vue3-styled-components";
const Wrap = Styled.div`
   .text-primary{
       color:${({ theme }) => theme["primary-color"]};
       cursor:pointer;
   }
`;
const TagList = Styled.div`
    border:1px solid ${({ theme }) => theme["primary-color"]};
    border-radius:5px;
    height:300px;
    width:100%;
    overflow:auto;
    margin-top:1rem;
    .tag{
        padding:0.5rem;
        font-size:16px;
        cursor:pointer;
        color:${({ theme }) => theme["primary-color"]};
       
    }
    .selected{
        background-color:#ff800010;
        color:${({ theme }) => theme["primary-color"]};
        padding-left:1rem;
    }
    ::-webkit-scrollbar {
        width: 12px; 
    }

`;
export { TagList, Wrap };
