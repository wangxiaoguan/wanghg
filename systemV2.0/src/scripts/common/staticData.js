import React from "react";
export const timeList = [
    {
        key:'govOrderStartTime',
        key2:'govOrderEndTime',
        name:'政府采购'
    },
    {
        key:'systemAdapteStartTime',
        key2:'systemAdapteEndTime',
        name:'系统适配改造'
    },
    {
        key:'systemTestStartTime',
        key2:'systemTestEndTime',
        name:'系统功能、性能测试'
    },
    {
        key:'systemTestRunStartTime',
        key2:'systemTestRunEndTime',
        name:'系统试运行'
    },
    {
        key:'assessmentStartTime',
        key2:'assessmentEndTime',
        name:'系统测试评估'
    },
    {
        key:'systemOnlineStartTime',
        key2:'systemOnlineEndTime',
        name:'系统正式上线'
    },
    {
        key:'projectFinishStartTime',
        key2:'projectFinishEndTime',
        name:'项目竣工验收'
    },
    {
        key:'financialAccountsStartTime',
        key2:'financialAccountsEndTime',
        name:'财务决算'
    }
]

export const timeDetailList = [
    [
        {
            lable: "政府采购",
            key: "govOrderStartTime",
            key2: "govOrderEndTime",
        },
        {
            lable: "系统适配改造",
            key: "systemAdapteStartTime",
            key2: "systemAdapteEndTime",
        },
        {
            lable: "系统功能、性能测试",
            key: "systemTestStartTime",
            key2: "systemTestEndTime",
        },
        {
            lable: "系统试运行",
            key: "systemTestRunStartTime",
            key2: "systemTestRunEndTime",
        }
    ],
    [
        {
            lable: "系统测试评估",
            key: "assessmentStartTime",
            key2: "assessmentEndTime",
        },
        {
            lable: "系统正式上线",
            key: "systemOnlineStartTime",
            key2: "systemOnlineEndTime",
        },
        {
            lable: "项目竣工验收",
            key: "projectFinishStartTime",
            key2: "projectFinishEndTime",
        },
        {
            lable: "财务决算",
            key: "financialAccountsStartTime",
            key2: "financialAccountsEndTime",
        }
    ]
]

export const status = (code) => {
    switch (code) {
        case '1':
            return <span style={{color:'#343434'}}>待提交</span>;
        case '2':
            return <span style={{color:'#999999'}}>待审核</span>;
        case '3':
            return <span style={{color:'#0DCB'}}>已通过</span>;
        case '4':
            return <span style={{color:'#FF0000'}}>未通过</span>;
        case '5':
            return <span style={{color:'#343434'}}>有更新</span>;
        default:
            break;
    }
}

export const checkStatus = (code) => {
    switch (code) {
        case 2:
            return <span style={{color:'#FF0000'}}>待审核</span>;
        default:
            return <span style={{color:'#0DCB'}}>已审核</span>;
    }
}