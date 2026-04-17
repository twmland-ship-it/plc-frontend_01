import Styled from "vue3-styled-components";

const SubscribeSpan = Styled.div`
    display:flex
    align-item:center
    button{
        display:flex
        align-item:center
        background-color:#00C300
        border:0
        color:white
        border-radius:5px
        cursor:pointer
        padding:0.3rem 0.5rem
        margin-right:0.5rem
        .unicon svg{
            margin-left:0.2rem
            fill:white
        }
    }
    .copy-link{
        color:${({ theme }) => theme["primary-color"]}
        cursor:pointer
    }
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
export { SubscribeSpan, ActionSpan };
