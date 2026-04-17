import Styled from "vue3-styled-components";

const Wrap = Styled.div`
   .text-primary{
       color:${({ theme }) => theme["primary-color"]};
       cursor:pointer;
   }
`;

const CCTVList = Styled.div`
    border:1px solid ${({ theme }) => theme["primary-color"]};
    border-radius:5px;
    height:350px;
    width:100%;
    overflow:auto;
    .cctv{
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

export { Wrap, CCTVList, SelectedList };
