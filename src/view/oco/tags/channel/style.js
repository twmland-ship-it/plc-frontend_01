import Styled from "vue3-styled-components";

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

export { ActionSpan, ModalWrap };
