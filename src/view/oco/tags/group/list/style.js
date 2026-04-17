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

const Search = Styled.div`
    .ant-collapse{
        border:0
    }
    .ant-collapse-header{
        background-color:transparent !important;
        color: ${({ theme }) => theme["primary-color"]} !important;
    }
`;

export { ActionSpan, Search };
