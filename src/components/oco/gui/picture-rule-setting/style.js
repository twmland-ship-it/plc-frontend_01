import Styled from "vue3-styled-components";
const formWrap = Styled.div`
    .ant-collapse-header{
        background-color:${({ theme }) => theme["primary-color"]} !important;
        color:${({ theme }) => theme["white-color"]} !important;
        border-radius:0 !important;
    }
    .subtitle{
        font-size:18px;
        margin-bottom:1rem;
        color:${({ theme }) => theme["primary-color"]};
    }
`;

export { formWrap };
