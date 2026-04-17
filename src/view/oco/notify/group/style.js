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

const EmailListTitle = Styled.div`
   color:rgba(0, 0, 0, 0.85);
   font-weight:500;
   margin-bottom:1rem
`;
export { ActionSpan, EmailListTitle };
