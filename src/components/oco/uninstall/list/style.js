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

const TableNameSpan = Styled.div`
    color:${({ theme }) => theme["primary-color"]}
    cursor:pointer;
`;
export { ActionSpan, TableNameSpan };
