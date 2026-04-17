import Styled from "vue3-styled-components";
const DiagramWrap = Styled.div`

    .action-bar{
        padding-bottom:0.5rem;
        padding-top:1rem;
        .unicon{
            svg{
                fill:${({ theme }) => theme["primary-color"]};
                color:${({ theme }) => theme["primary-color"]};
            }
        }
        .drawBtn.active {
            svg{
                fill:${({ theme }) => theme["white-color"]};
                color:${({ theme }) => theme["white-color"]};
            }
        }
    }

    .ant-collapse-header{
        background-color:${({ theme }) => theme["primary-color"]} !important;
        color:${({ theme }) => theme["white-color"]} !important;
        border-radius:0 !important;
    }


      
    .shape {
        display:flex;
        justify-content:center;
        cursor:pointer;
    }

    .canvas-wrap{
        width:100%;
        position:relative;
        max-width:1600px;
        margin:auto;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border:1px solid #ccc;
        .icons-block{
            width:300px;
            position:absolute;
            z-index:10;
            pointer-events: none;
            .ant-collapse-content{
                user-select: none; /* standard syntax */
                -webkit-user-select: none; /* for Chrome、Safari */
                -moz-user-select: none; /* for Mozilla、Firefox */
            }
            .add-btn{
                color:${({ theme }) => theme["primary-color"]} !important;
                border-color:${({ theme }) =>
                  theme["primary-color"]} !important;
            }
            .drag-area{
                display:flex;
                .drag-panel{
                    display:flex;
                    align-items:center;
                    pointer-events: auto;
                    cursor:pointer;
                    border-radius:5px 5px 0 0;
                    padding:0.3rem 0.8rem;
                    background-color:${({ theme }) =>
                      theme["primary-color"]} !important;
                    color:${({ theme }) => theme["white-color"]} !important;
                    .unicon{
                        margin-left:0.3rem
                        svg{
                           width:18px;
                           height:18px;
                            fill:${({ theme }) =>
                              theme["white-color"]} !important;
                            stroke:${({ theme }) =>
                              theme["white-color"]} !important;
                        }
                    }
                }
            }
        }
        .setting-block{
            .ant-card-head{
                background-color:${({ theme }) =>
                  theme["primary-color"]} !important;
                color:${({ theme }) => theme["white-color"]} !important;
            }
            position:absolute;
            z-index:10
            right:0;
            width:300px
        }
        .setting-menu{
            position: absolute;
            width: 300px;
            z-index:10;
            .ant-menu-item{
                display:block
            }
        }
      
    }

    & ::-webkit-scrollbar {
        width: 10px !important;
        height: 10px !important;
    }

    & ::-webkit-scrollbar-thumb {
        background: #aaa;
        border-radius: 3px;
    }

`;
export { DiagramWrap };
