import Styled from "vue3-styled-components";

const ChildSpan = Styled.div`
    color: ${({ theme }) => theme["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
    }
   
`;
const ActionSpan = Styled.div`
    display:flex;
    justify-content:end;
    svg{
       height:20px;
       cursor:pointer;
       margin:0 5px;
    }
`;
const ModalWrap = Styled.div`
    .act-btn{
        margin:0 5px;
    }
`;

export { ChildSpan, ActionSpan, ModalWrap };
