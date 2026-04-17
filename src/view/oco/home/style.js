import Styled from "vue3-styled-components";

const SalesOverviewStyleWrap2 = Styled.div`
    .ninjadash-overview-percentage{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 12px;
        .ninjadash-overview-percentage__item{
            display: flex;
            align-items: center;
            margin: 15px;
        }
        .ninjadash-overview-percentage__point{
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")}: 5px;
            background-color: ${({ theme }) => theme["primary-color"]};
        }
        .ninjadash-overview-percentage__text{
            font-size: 15px;
            font-weight: 500;
            color: ${({ theme }) => theme[theme.mainContent]["dark-text"]};
        }
    }
    .ant-card-body{
        padding: 30px 25px !important;
    }
    .ninjadash-overview-wrap{
        color: #333;
        canvas{
            margin: 0 auto;
            position: relative;
            z-index: 10;
            max-height: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
        }
        &__inner{
            @media only screen and (max-width: 480px){
                height: 150px !important;
            }
        }
    }
    .ninjadash-overview-box{
        margin-top: 10px;
        padding: 16.65px 32px;
        border-radius: 8px;
        background: ${({ theme }) =>
          theme[theme.mainContent]["light-background"]};
        .ninjadash-overview-box-item{
            text-align: center;
            h4{
                font-size: 18px;
                line-height: 1;
                font-weight: 600;
                margin-bottom: 6px;
                color: ${({ theme }) => theme[theme.mainContent]["dark-text"]};
            }
            p{
                margin-bottom: 0;
                font-size: 15px;
                line-height: 1.25;
                color: ${({ theme }) => theme[theme.mainContent]["dark-text"]};
            }
        }
    }

`;

const ChartContainer = Styled.div`
    display: block;
    font-family: 'Jost', sans-serif;
    padding: 25px;
    border-radius: 8px;
    min-height: 100vh;
    margin-bottom: 120px; /* 確保與底部版權資訊有足夠間距 */
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: ${({ theme }) =>
          theme[theme.mainContent]["white-background"]};
        box-shadow: 0 3px 16px ${({ theme }) =>
          theme[theme.mainContent]["border-color-default"]}50;
        padding: 8px 6px !important;
        border-radius: 5px;
        min-width: 80px;
        transition: all 0.5s ease;
        pointer-events: none;
        transform: translate(-50%, 5%);
        z-index: 222;
        top: 0;
        left: 0;
        @media only screen and (max-width: 991px){
            transform: translate(-60%, 5%);
        }
        &:before {
            position: absolute;
            content: '';
            border-top: 5px solid ${({ theme }) =>
              theme[theme.mainContent]["white-background"]};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({ theme }) => (!theme.rtl ? "left" : "right")}: 50%;
            transform: translateX(-50%);
        }
        table td{
            padding: 0;
        }
    }
    .chartjs-tooltip-key {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: "pink";
        ${({ theme }) => (theme.rtl ? "margin-left" : "margin-right")} : 5px;
    }
    .tooltip-title {
        color: ${({ theme }) => theme[theme.mainContent]["gray-text"]};
        font-size: 12px;
        line-height: 1;
        font-weight: 500 !important;
        font-family: 'Jost', sans-serif;;
        text-transform: capitalize;
        margin-bottom: 4px;
    }
    .tooltip-value {
        color: #63b963;
        font-size: 22px;
        font-weight: 600 !important;
        font-family: 'Jost', sans-serif;;
    }
    .tooltip-value sup {
        font-size: 12px;
        @media only screen and (max-width: 1199px){
            font-size: 11px;
        }
    }
    table{
        tbody{
            td{
                font-size: 12px;
                font-weight: 500;
                padding-bottom: 3px;
                color: ${({ theme }) => theme["extra-light-color"]};
                .data-label{
                    ${({ theme }) =>
                      theme.rtl ? "margin-right" : "margin-left"}: 3px;
                    color: ${({ theme }) => theme["light-gray-color"]};
                }
            }
        }
    }
    .ant-col {
        display: block;
        .column-content {
          display: block;
          .ant-card-body{
            height: auto;
            z-index: 1;
            position: relative;
          }
        }
    }
    .ant-card-head-title{
        font-weight:600;
        font-size:18px
    }
    .ant-card{
        margin-bottom:25px;
        overflow: visible;
        position: relative;
        z-index: 1;
        min-width: 200px;
        min-height: 320px; /* 進一步減少卡片最小高度 */
    }

    /* 為頁面底部添加間距，避免被卡片覆蓋 */
    .dashboard-draggable-container {
        width: 100%;
        padding-bottom: 100px; /* 添加底部間距 */
    }

    .ninjadash-chart-container {
        overflow: hidden !important;
        max-height: 100% !important;
        position: relative;
        margin-bottom: 120px !important; /* 確保與底部版權資訊有足夠間距 */
    }
    .ant-btn-primary .unicon svg {
        color: ${({ theme }) => theme["primary-color"]};
        fill: ${({ theme }) => theme["primary-color"]};
    }
    .ant-btn-danger .unicon svg {
        color: ${({ theme }) => theme["danger-color"]};
        fill: ${({ theme }) => theme["danger-color"]};
    }

    /* 拖曳相關樣式 */
    .dashboard-draggable-container {
        width: 100%;
    }

    .draggable-wrapper {
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        gap: 25px;
        width: 100%;
        align-items: start;
    }

    .chart-item {
        position: relative;
        transition: all 0.3s ease;
        width: 100%;
        overflow: visible;
        
        &:hover {
            .chart-drag-handle {
                opacity: 1;
                transform: scale(1.1);
            }
        }
    }



    .chart-title-with-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        position: relative;
        z-index: 9998;
        min-height: 40px;
        padding-right: 120px;
    }

    .chart-controls {
        display: flex;
        gap: 4px;
        margin-left: 8px;
        z-index: 9999;
        position: absolute;
        right: 60px;
        top: 0;
        background: rgba(255, 255, 255, 0.95);
        padding: 4px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .drag-btn,
        .resize-btn,
        .reset-btn {
            width: 28px;
            height: 28px;
            padding: 0;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            position: relative;
            z-index: 10000;
            flex-shrink: 0;

            &:hover {
                background: rgba(255, 255, 255, 1);
                border-color: #1890ff;
                box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
                transform: scale(1.05);
                z-index: 10001;
            }

            .unicon svg {
                color: #666;
                fill: #666;
                transition: color 0.3s ease;
                width: 14px;
                height: 14px;
            }

            &:hover .unicon svg {
                color: #1890ff;
                fill: #1890ff;
            }
        }

        .drag-btn {
            cursor: grab;
            
            &:active {
                cursor: grabbing;
            }
        }

        .reset-btn:hover .unicon svg {
            color: #ff4d4f;
            fill: #ff4d4f;
        }
    }



    .chart-item:hover {
        .chart-resize-controls {
            opacity: 1;
        }
    }

    /* 確保設定按鈕不被覆蓋 */
    .ant-card-extra {
        z-index: 10 !important;
        position: absolute;
        right: 0;
        top: 0;
        
        .ant-space {
            gap: 4px !important;
        }
        
        .ant-btn {
            width: 28px;
            height: 28px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .ant-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            
            &:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
        }
    }

    /* 拖曳時的樣式 */
    .sortable-ghost {
        opacity: 0.5;
        transform: rotate(5deg);
    }

    .sortable-chosen {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
    }

    /* 縮放模態框樣式 */
    .resize-form {
        padding: 20px 0;

        .slider-value {
            text-align: center;
            margin-top: 8px;
            font-weight: 500;
            color: #1890ff;
        }

        .ant-form-item {
            margin-bottom: 24px;
        }

        .ant-slider {
            margin: 8px 0;
        }
    }
`;

const SubContent = Styled.div`
    width:100%;
    .card-controls-overlay {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 50;
        display: flex;
        gap: 8px;
        background: rgba(255, 255, 255, 0.9);
        padding: 4px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

        .drag-btn,
        .resize-btn,
        .reset-btn {
            width: 32px;
            height: 32px;
            padding: 0;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            position: relative;
            z-index: 20;

            &:hover {
                background: rgba(255, 255, 255, 1);
                border-color: #1890ff;
                box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
                transform: scale(1.05);
                z-index: 25;
            }

            .unicon svg {
                color: #666;
                fill: #666;
                transition: color 0.3s ease;
            }

            &:hover .unicon svg {
                color: #1890ff;
                fill: #1890ff;
            }
        }

        .drag-btn {
            cursor: grab;
            
            &:active {
                cursor: grabbing;
            }
        }

        .reset-btn:hover .unicon svg {
            color: #ff4d4f;
            fill: #ff4d4f;
        }
    }

    .sub-card {
        position: relative;
        
        .chart-title-with-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
            z-index: 10;
        }
        
        .ant-card-extra {
            z-index: 30 !important;
            position: relative;
            margin-left: 20px;
            
            .ant-space {
                gap: 12px !important;
            }
            
            .ant-btn {
                width: 32px;
                height: 32px;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                
                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
            }
        }
        
        .quarter-circle {
            position: absolute; 
            bottom: 0; 
            left: 0;
            width: 100px;
            height: 100px;
            background-color: #fa8b0c15; 
            border-radius: 0 100px 0 0; 
            display: flex;
            justify-content: center;
            align-items: center;
            .unicon svg {
                position: absolute;
                left: 30px;
                bottom: 30px;
                color: #ff8000;
                fill: #ff8000;
            }
        }
        .sub-card-content {
            font-size: 35px;
            font-weight: 500;
            text-align: center;
            color: #000000;
            .suffix-text {
                text-align: right;
                margin-bottom: 0;
                font-size: 26px;
                font-weight: 400;
            }
        }
    }
    
`;

export { ChartContainer, SalesOverviewStyleWrap2, SubContent };
