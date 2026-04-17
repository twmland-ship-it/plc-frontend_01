import Styled from "vue3-styled-components";
const ChartContainer = Styled.div`
    display: block;
    height:500px;
    width:100%;
    font-family: 'Jost', sans-serif;
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
`;
export { ChartContainer };
