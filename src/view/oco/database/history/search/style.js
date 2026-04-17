import Styled from "vue3-styled-components";
const Search = Styled.div`
    .ant-collapse{
        border:0
    }
    .ant-collapse-header{
        background-color:transparent !important;
        color: ${({ theme }) => theme["primary-color"]} !important;
    }
`;

export { Search };
