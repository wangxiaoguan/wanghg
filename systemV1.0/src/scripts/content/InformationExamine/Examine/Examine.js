import React, { useState, useEffect } from "react";
import { Button, message, Spin, Empty,Modal,Input } from "antd";
import "./index.less";
import {
  getService,
  postService,
  getExportExcelService,
} from "../../../common/fetch";
import moment from "moment";
const {TextArea} = Input;
import { statusEnum } from "../../../base/enum/statusEnum";
/**
 * 1. 查看单条数据
 * 2. 审核
 * 3. 查看汇总
 */

const index = (props) => {
  // 是否为汇总查看状态
  const [isTotalView, setTotalView] = useState(false); // 是否为汇总查看
  const [viewData, setViewData] = useState({});
  const [viewTime, setViewTime] = useState("");
  const [paramsValue, setParamsValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [reasonModal, setReasonModal] = useState(false);
  const [reason, setReason] = useState("");

  const mainNode = () => {
    const list = [
      [
        {
          lable: "政府采购",
          key: "govOrderTime",
        },
        {
          lable: "系统适配改造",
          key: "systemAdapteTime",
        },
        {
          lable: "系统功能、性能测试",
          key: "systemTestTime",
        },
        {
          lable: "系统试运行",
          key: "systemTestRunTime",
        },
      ],
      [
        {
          lable: "系统测试评估",
          key: "assessmentTime",
        },
        {
          lable: "系统正式上线",
          key: "systemOnlineTime",
        },
        {
          lable: "项目竣工验收",
          key: "projectFinishTime",
        },
        {
          lable: "财务决算",
          key: "financialAccountsTime",
        },
      ],
    ];

    return (
      <div className="tableItem">
        {list.map((item, n) => (
          <table key={n}>
            <thead>
              <tr>
                {item.map((data, j) => (
                  <th key={j}>{data.lable}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {item.map((data, k) => (
                  <td key={k}>
                    {(viewData[data.key] &&
                      moment(viewData[data.key]).format("YYYY-MM-DD")) || (
                      <span>&nbsp;</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    );
  };
  const capital = () => {
    return (
      <table className="capitalTable">
        <thead>
          <tr>
            <th colSpan="2">计划投资完成</th>
            <th colSpan="2">计划投资支付</th>
            <th colSpan="2">投资调整</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>日期</th>
            <th>金额（万元）</th>
            <th>日期</th>
            <th>金额（万元）</th>
            <td colSpan="2" rowSpan="2">
              {viewData.adjustInfo}
            </td>
          </tr>
          <tr>
            <td>
              {(viewData.curInvestmentPlanTime &&
                moment(viewData.curInvestmentPlanTime).format(
                  "YYYY-MM-DD"
                )) || <span>&nbsp;</span>}
            </td>
            <td>{viewData.curInvestmentPlanMoney}</td>
            <td>
              {(viewData.curInvestmentPayTime &&
                moment(viewData.curInvestmentPayTime).format("YYYY-MM-DD")) || (
                <span>&nbsp;</span>
              )}
            </td>
            <td>{viewData.curInvestmentPayMoney}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const reformTbale = () => {
    const {
      smApplicationInfoList = [],
      fsmApplicationInfoList = [],
    } = viewData;

    return (
      <table className="reformTbale">
        <thead>
          <tr>
            <th colSpan="2">{viewTime?viewTime:'XX'}月适配改造的涉密系统名称</th>
            <th>开始时间</th>
            <th>结束时间</th>
          </tr>
        </thead>
        <tbody>
          {smApplicationInfoList.length ? (
            smApplicationInfoList.map((item, j) => (
              <tr key={j}>
                <td>{j + 1}</td>
                <td>{item.systemName}</td>
                <td>{item.startTime}</td>
                <td>{item.finishTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <Empty
                  className="tableEmpty"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />{" "}
              </td>
            </tr>
          )}
        </tbody>
        <thead>
          <tr>
            <th colSpan="2">{viewTime?viewTime:'XX'}月适配改造的非涉密系统名称</th>
            <th>开始时间</th>
            <th>结束时间</th>
          </tr>
        </thead>
        <tbody>
          {fsmApplicationInfoList.length ? (
            fsmApplicationInfoList.map((item, j) => (
              <tr key={j}>
                <td>{j + 1}</td>
                <td>{item.systemName}</td>
                <td>{item.startTime}</td>
                <td>{item.finishTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <Empty
                  className="tableEmpty"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  const deplayTable = () => {
    const list = [
      {
        titile: `${viewTime?viewTime:'XX'}月涉密领域部署情况`,
        smList: viewData.smDeviceInfoNoInList || [],
        fsmList: viewData.smDeviceInfoInList || [],
      },
      {
        titile: `${viewTime?viewTime:'XX'}月非涉密领域部署情况`,
        smList: viewData.fsmDeviceInfoNoInList || [],
        fsmList: viewData.fsmDeviceInfoInList || [],
      },
    ];

    return (
      <div>
        {list.map((item, code) => (
          <div className="deplayContent" key={code}>
            <p>{item.titile}</p>
            <table border="1">
              <thead>
                <tr>
                  <th>产品分类</th>
                  <th colSpan="2">生产厂商</th>
                  <th>CPU芯片</th>
                  <th>操作系统</th>
                  <th>数量（台/套）</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {item.smList.length ? (
                  item.smList.map(
                    (data) =>
                      data.childDevices &&
                      data.childDevices.map((j, index) => {
                        return (
                          <tr key={index}>
                            {index === 0 ? (
                              <td rowSpan={data.childDevices.length}>
                                {data.deviceName}
                              </td>
                            ) : null}
                            <td>{index + 1}</td>
                            <td>{j.manufacturerName || <span>&nbsp;</span>}</td>
                            <td>{j.cpuName}</td>
                            <td>{j.osName}</td>
                            <td>{j.num}</td>
                            <td>{j.remark}</td>
                          </tr>
                        );
                      })
                  )
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <Empty
                        className="tableEmpty"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />{" "}
                    </td>
                  </tr>
                )}
              </tbody>
              <thead>
                <tr>
                  <th> </th>
                  <th colSpan="2">类别</th>
                  <th>数量（台/套）</th>
                  <th colSpan="3">备注</th>
                </tr>
              </thead>
              <tbody>
                {item.fsmList.length ? (
                  item.fsmList.map(
                    (data) =>
                      data.childDevices &&
                      data.childDevices.map((i, j) => {
                        return (
                          <tr key={j}>
                            {j === 0 ? (
                              <td rowSpan={data.childDevices.length}>
                                {data.deviceName}
                              </td>
                            ) : null}
                            <td>{j + 1}</td>
                            <td>{i.deviceDetailTypeName}</td>
                            <td>{i.num}</td>
                            <td colSpan="3">{i.remark}</td>
                          </tr>
                        );
                      })
                  )
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <Empty
                        className="tableEmpty"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />{" "}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const renderHeader = () => {
    let headerItems = [
      {
        lable: "填报单位",
        code: "createUnitName",
      },
      {
        lable: "填报人",
        code: "createUserName",
      },
      {
        lable: "时间",
        code: "createTime",
      },
    ];
    if(location.hash.indexOf('InformationCollect')>-1){
      headerItems.splice(1,1,{lable: "审核人",code: "admitName",})
    }
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    console.log(viewData,viewTime)
    return headerItems.map((item, n) => (
      <div key={n}>
        <span>{item.lable}：</span>
        {
          item.code === "createTime" ?  isTotalView ?viewTime?viewTime:moment(new Date()).format("YYYY-MM-DD"):
          viewData[item.code] && moment(viewData[item.code]).format("YYYY-MM-DD"):
          item.code === "createUnitName" ?
          viewData[item.code]?viewData[item.code]:userInfo.unitName:
          viewData[item.code]
        }

      </div>
    ));
  };

  const createDown = (type) => {
    return (
      <div
        onClick={() => {
          exportNodeAll(type);
        }}
      >
        <img src={require("../../../../assets/icon/download.png")} />
        {type === 0
          ? "下载各项目进度节点一览.xlsx"
          : "下载各项目资金使用情况一览.xlsx"}
      </div>
    );
  };

  const speedList = [
    {
      name: "一、项目推进主要进度节点",
      content: isTotalView ? createDown(0) : mainNode(),
    },
    {
      name: "二、项目资金使用情况",
      content: isTotalView ? createDown(1) : capital(),
    },
    {
      name: "三、应用系统改造情况",
      content: reformTbale(),
    },
    {
      name: "四、设备部署情况",
      content: deplayTable(),
    },
    {
      name: "五、重要事项",
      content: <div className="mockTextArea">{viewData.importantItem}</div>,
    },
    {
      name: "六、问题和建议",
      content: <div className="mockTextArea">{viewData.suggestion}</div>,
    },
  ];

  // 审核
  const examineOrder = (status) => {
    setBtnLoading(true);
    postService(
      "/workReport/infoSubmit/audit",
      {
        id: viewData.id,
        status,
      },
      (res) => {
        setBtnLoading(false);
        if (res && res.flag) {
          message.success("操作成功！");
          location.hash = "/InformationExamine";
        } else {
          message.error(res.msg);
        }
      }
    );
  };
  const examineReason = (status) => {

    setBtnLoading(true);
    postService(
      "/workReport/infoSubmit/audit",
      {
        id: viewData.id,
        status,
        notPassReason:reason
      },
      (res) => {
        setBtnLoading(false);
        if (res && res.flag) {
          message.success("操作成功！");
          location.hash = "/InformationExamine";
        } else {
          message.error(res.msg);
        }
      }
    );
  };

  useEffect(() => {
    const params = JSON.parse(decodeURI(props.match.params.data));
    setParamsValue(params);
    if (params.isTotalView) {
      setTotalView(true);
    }

    getInfoMation(params);
  }, [props.match.params.data]);

  // 获取审核详情
  const getInfoMation = (params) => {
    setLoading(true);

    if (params.isTotalView && !params.isviewCurrentTotal) {
      // 查看汇总

      const { year, month } = params.data;
      const data = month.map((item) => `${year}-${item}`);
      createViewMonthStr(month, year);

      postService("/workReport/infoSubmit/getCollect", data, (res) => {
        setLoading(false);
        if (res.flag) {
          if(res.data){
            setViewData(res.data);
          }else{
            message.warning('无数据')
          }
        } else {
          message.error(res.msg);
        }
      });
    } else {
      let url = `/workReport/infoSubmit/getDetail?id=${params.id}`; // 审核 查看详情
      if (params.isviewCurrentTotal) {
        url = `/workReport/infoSubmit/previewCollect`; // 预览本次汇总
      }
      getService(url, (res) => {
        setLoading(false);
        if (res && res.flag) {
          setViewData(res.data);
          res.data.createTime &&
            setViewTime(moment(res.data.createTime).format("YYYY-MM"));
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  const createViewMonthStr = (month, year) => {
    // 判断是否连续月份
    let flag = true;
    month.forEach((item, index) => {
      if (
        index < month.length - 1 &&
        Number(item) + 1 !== Number(month[index + 1])
      ) {
        flag = false;
      }
    });
    let dateStr = "";
    if (flag) {
      if (month.length > 1) {
        dateStr = `${year}年${Math.min.apply(null, month)}月 - ${Math.max.apply(
          null,
          month
        )}月`;
      } else {
        dateStr = `${year}年${Math.min.apply(null, month)}月`;
      }
    } else {
      dateStr = month.map((item) => `${year}年-${item}月`);
      dateStr.join(",");
    }
    setViewTime(dateStr);
  };

  const getExportMonthStr = () => {
    console.log(paramsValue)
    
    try{
      const { year, month } = paramsValue.data;
      const list = month.map((item) => `${year}-${item}-01`);
      return list.join(",");
    }catch(err){
      return null;
    }
    
  };

  const exportAll = () => {
    getExportExcelService(
      `/workReport/infoSubmit/exportTotal?months=${getExportMonthStr()}`,
      `${viewTime}信息报送汇总`
    );
   
    
  };

  const exportNodeAll = (type) => {
    if(getExportMonthStr()){
      getExportExcelService(
        `/workReport/infoSubmit/exportReportTotalDetail/${type}?months=${getExportMonthStr()}`,
        `${viewTime}${
          type === 0 ? "各项目进度节点一览" : "各项目资金使用情况一览"
        }`
      );
    }else{
      getExportExcelService(
        `/workReport/infoSubmit/exportReportNotCollectTotalDetail/${type}`,
        type === 0 ? "各项目进度节点一览" : "各项目资金使用情况一览"
      );
    }
    
  };

  const renderHandleBtn = () => {
    switch (true) {
      case paramsValue.isviewCurrentTotal:
        return (
          <Button
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        );
      case isTotalView:
        return (
          <React.Fragment>
            <Button type="primary" onClick={exportAll}>
              导出电子表格
            </Button>
            <Button
              onClick={() => {
                history.back();
              }}
            >
              返回
            </Button>
          </React.Fragment>
        );
      case `${viewData.status}` === statusEnum.TOBEREVIEWEB:
        return (
          <React.Fragment>
            <Button
              type="primary"
              onClick={() => {
                examineOrder(statusEnum.PSAA);
              }}
            >
              通过
            </Button>
            <Button
              onClick={() => {
                setReasonModal(true)
              }}
            >
              不通过
            </Button>
          </React.Fragment>
        );
      case `${viewData.status}` === statusEnum.UPDETE:
        return (
          <React.Fragment>
            <Button
              type="primary"
              onClick={() => {
                examineOrder(statusEnum.PSAA);
              }}
            >
              已阅
            </Button>
            <Button
              onClick={() => {
                history.back();
              }}
            >
              返回
            </Button>
          </React.Fragment>
        );

      default:
        return (
          <Button
            onClick={() => {
              history.back();
            }}
          >
            返回
          </Button>
        );
    }
  };

  return (
    <div className="page">
      <Spin spinning={loading}>
        <div className="pageHeader">
          <div className="leftInfoMsg">{renderHeader()}</div>
          <span>
            <Spin spinning={btnLoading}>{renderHandleBtn()}</Spin>
          </span>
        </div>
        <div className="pageContent">
          {speedList.map((item, n) => (
            <div className="speedItem" key={n}>
              <h6>{item.name}</h6>
              <div className="itemContent">{item.content}</div>
            </div>
          ))}
        </div>
      </Spin>
      <Modal
        title='不通过原因'
        visible={reasonModal}
        destroyOnClose={true}
        afterClose={()=>setReasonModal(false)}
        onCancel={()=>setReasonModal(false)}
        onOk={()=>examineReason(statusEnum.FAIL)}
      >
        <TextArea rows={4} onChange={e=>setReason(e.target.value)}/>
      </Modal>
    </div>
  );
};

export default index;

