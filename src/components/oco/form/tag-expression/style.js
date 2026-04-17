import Styled from "vue3-styled-components";
const DeleteSpan = Styled.span`
    width:25px;
    height:25px;
    cursor:pointer;
    margin-right:0.5rem;
    top:7.5px;
    position:relative;
    .unicon{
        svg{
            storke:rgb(255, 77, 79);
            fill:rgb(255, 77, 79);
            width:25px;
            height:25px
        }
    }
`;

const AddBtn = Styled.div`
    display:flex;
    align-item:center;
    justify-content:center;
    .unicon{
        margin-right:0.2rem;
        svg{
            stroke:rgb(90, 95, 125);
            fill:rgb(90, 95, 125);
            width:22px;
            height:22px;
        }
    }
`;
export { DeleteSpan, AddBtn };
