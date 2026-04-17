import Styled from "vue3-styled-components";
const childSpan = Styled.div`
    color: ${({ theme }) => theme["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
    }
   
`;

const SelectWrap = Styled.div`
    font-weight:bold;
`;

const TableSpan = Styled.div`
    .text-alert{
        td{
            color:${({ theme }) => theme["error-color"]} !important;
        }
    }
    .text-disabled{
        td{
            color:${({ theme }) => theme["disabled-color"]} !important;
        }
    }
    .text-normal{
        td{
            color:${({ theme }) => theme["success-color"]} !important;
        }
    }
`;

export { childSpan, SelectWrap, TableSpan };
