import Styled from "vue3-styled-components";
const Wrap = Styled.div`
   .text-primary{
       color:${({ theme }) => theme["primary-color"]};
       cursor:pointer;
   }

   .usage-hint{
       margin-bottom: 1rem;
       padding: 0.75rem 1rem;
       border-radius: 6px;
       background: #fff7e6;
       border: 1px solid #ffd591;
       color: #ad6800;
       line-height: 1.5;
   }

   .section-title{
       display:flex;
       align-items:center;
       gap:0.5rem;
       margin-bottom:0.75rem;
       font-weight:600;
   }

   .section-subtitle{
       font-size:12px;
       font-weight:400;
       color:#ad6800;
   }

   /* 為選擇測點對話框添加調整大小功能 */
   .tag-filter-modal .ant-modal-content {
       resize: both;
       overflow: auto;
       min-width: 600px;
       min-height: 400px;
       max-width: 90vw;
       max-height: 90vh;
   }

   .tag-filter-modal .ant-modal-body {
       overflow: auto;
       max-height: calc(90vh - 120px);
   }
`;
const TagList = Styled.div`
    border:1px solid ${({ theme }) => theme["primary-color"]};
    border-radius:5px;
    height:350px;
    width:100%;
    overflow:auto;
    .tag{
        padding:0.5rem;
        font-size:14px;
        cursor:pointer;
        color:${({ theme }) => theme["primary-color"]};
        word-wrap: break-word;
        white-space: normal;
        line-height: 1.4;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #f5f5f5;
        }
    }
    .selected{
        background-color:#ff800010;
        color:${({ theme }) => theme["primary-color"]};
        padding-left:1rem;
        font-weight: 500;
    }
`;

const SelectedList = Styled.div`
    border:1px solid #d9d9d9;
    border-radius:5px;
    height:350px;
    width:100%;
    overflow:auto;
    background-color: #fafafa;

    .selected-item{
        padding:0.5rem;
        font-size:14px;
        cursor:pointer;
        color: #333;
        word-wrap: break-word;
        white-space: normal;
        line-height: 1.4;
        border-bottom: 1px solid #e8e8e8;
        transition: background-color 0.2s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
            background-color: #f0f0f0;
        }

        .remove-icon {
            color: #ff4d4f;
            font-size: 12px;
            margin-left: 8px;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }
    }

    .empty-message {
        padding: 2rem;
        text-align: center;
        color: #999;
        font-style: italic;
    }
`;

const MultiSelector = Styled.div`
    .ant-select-selector{
        max-height:100px;
        overflow:auto;
    }
`;
export { TagList, Wrap, MultiSelector, SelectedList };
