import Styled from "vue3-styled-components";
const Wrap = Styled.div`
   .text-primary{
       color:${({ theme }) => theme["primary-color"]} !important; 
       cursor:pointer;
   }
`;

export { Wrap };
