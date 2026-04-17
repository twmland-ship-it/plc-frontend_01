import Styled from "vue3-styled-components";

const BillWrap = Styled.div`
    margin-top:1rem;
    padding:1rem
`;
const ChildSpan = Styled.div`
    color: ${({ theme }) => theme["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
    }
   
`;
export { BillWrap, ChildSpan };
