import Styled from "vue3-styled-components";

const ChildSpan = Styled.div`
    color: ${({ theme }) => theme["primary-color"]};
    cursor:pointer;
    &:hover{
        text-decoration:underline
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
const ModalWrap = Styled.div`
    .act-btn{
        margin:0 5px;
    }

    /* 監控系統選擇樣式 */
    .monitoring-system-selection {
        border: 1px solid #d9d9d9;
        border-radius: 6px;
        padding: 16px;
        background-color: #fafafa;
    }

    .main-system-wrapper {
        margin-bottom: 16px;
        padding: 12px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        background-color: #ffffff;
    }

    .main-system-label {
        font-weight: 600;
        font-size: 16px;
        color: #262626;
    }

    .sub-systems-wrapper {
        margin-top: 16px;
    }

    .sub-systems-title {
        font-weight: 600;
        font-size: 14px;
        color: #595959;
        margin-bottom: 12px;
        padding-left: 4px;
    }

    .sub-systems-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;
        padding: 12px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        background-color: #ffffff;
    }

    .sub-system-checkbox {
        padding: 6px 8px;
        border-radius: 3px;
        transition: background-color 0.2s;

        &:hover {
            background-color: #f5f5f5;
        }
    }

    /* 響應式設計 */
    @media (max-width: 768px) {
        .sub-systems-grid {
            grid-template-columns: 1fr;
        }
    }
`;
export { ChildSpan, ActionSpan, ModalWrap };
