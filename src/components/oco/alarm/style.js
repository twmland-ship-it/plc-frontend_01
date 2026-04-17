import Styled from "vue3-styled-components";
const RealTime = Styled.div`
   
    max-width: 100%;
    position:fixed;
    bottom:0px;
    z-index:10;
    .text-alert{
        color:${({ theme }) => theme["error-color"]};
    }

    .text-checked{
        color:${({ theme }) => theme["success-color"]};
    }

    .text-normal{
        color:${({ theme }) => theme["info-color"]};
    }

    .alarm-type-chip{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:52px;
        padding:2px 8px;
        border-radius:999px;
        font-size:12px;
        font-weight:600;
        line-height:1.4;
        border:1px solid currentColor;
    }

    .alarm-type-hihi{
        color:${({ theme }) => theme["error-color"]};
    }

    .alarm-type-hi{
        color:#d46b08;
    }

    .alarm-type-lolo{
        color:#531dab;
    }

    .alarm-type-lo{
        color:${({ theme }) => theme["warning-color"]};
    }

    .alarm-type-di{
        color:${({ theme }) => theme["primary-color"]};
    }

    .alarm-type-unknown{
        color:${({ theme }) => theme["gray-color"] || theme["extra-light-color"]};
    }

    table{
        white-space: nowrap;
        border-radius:0px;
    }

    .ant-table-tbody > tr > td {
        padding: 6px 12px;
    }

    .ant-table-container table > thead > tr:first-child th:first-child {
        border-top-left-radius: 0px;
    }
    
    .ant-table-thead > tr > th {
        background-color: ${({ theme }) => theme["primary-color"]};
        color:white;
        padding: 8px 12px;
    }
    

    .ant-collapse{
        border-color:${({ theme }) => theme["primary-color"]};
        border-top:0px;
        background:transparent;
    }

    .ant-collapse-header{
        border:0px;
        padding:0px !important;
    }
    .ant-collapse-content{
        border-bottom:0px;
        border-color:${({ theme }) => theme["primary-color"]};
    }

    .ant-collapse-content-box{
        padding:0;
        color:${({ theme }) => theme["primary-color"]};
    }

    .ant-table {
        margin-top: 0.25rem;
    }

    .custom-header{
        display:flex;
        padding:0.5rem 1rem;
        border:1px solid ${({ theme }) => theme["primary-color"]};
        border-bottom:0;
        border-left:0;
        border-radius:5px 5px 0 0;
        background:${({ theme }) => theme["primary-color"]};
        color:${({ theme }) => theme["white-color"]};
    }

    .check-button{
        margin:0.25rem 1rem 0.25rem 1rem;
        height:35px;
    }

    .ant-checkbox-wrapper {
        margin: 0.25rem 1rem 0.25rem 1rem;
    }

    
`;

const ActionSpan = Styled.div`
    display:flex;
    button{
        margin:0 0.5rem;
        padding:0;
        height:30px;
        width:40px;
        .unicon{
            margin-top:2px;
            svg{
                color:${({ theme }) => theme["primary-color"]};
                fill:${({ theme }) => theme["primary-color"]};
            }
        }
    }
    
`;
export { RealTime, ActionSpan };
