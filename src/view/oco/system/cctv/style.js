import Styled from "vue3-styled-components";

const GroupMsgSpan = Styled.div`
    color:red;
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
export { GroupMsgSpan, ActionSpan };
