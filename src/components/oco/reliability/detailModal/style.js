import Styled from "vue3-styled-components";
const ChildSpan = Styled.div`
    color: ${({ theme }) => theme["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
    }
   
`;

export { ChildSpan };
