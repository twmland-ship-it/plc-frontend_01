import Styled from "vue3-styled-components";

const ModalWrapper = Styled.div`
    .subtitle-row{
        margin-bottom:1rem
        color:${({ theme }) => theme["primary-color"]}
        .delete-btn{
            cursor:pointer
        }
        .subtitle{
            font-size:18px
            font-weight:500
        }
    }

    .addblock{
        border:2px dashed ${({ theme }) => theme["primary-color"]}
        color: ${({ theme }) => theme["primary-color"]}
        font-size:16px
        text-align:center
        padding:0.5rem
        margin-bottom:1.5rem
        cursor:pointer
    }
`;
export { ModalWrapper };
