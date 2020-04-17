import { DOWNLOAD_API } from "@/services/api";
import FormRefreshButton from "@/components/FormRefreshButton";
import FormResetButton from "@/components/FormResetButton";
import Zmage from 'react-zmage'
import { Tree, Modal, Input, Select } from "antd";

import React, { Component } from 'react';

import FormItem from "antd/lib/form/FormItem";

import { createSearchString, getExtension } from "./SystemUtil";

const { TreeNode } = Tree;
const { Option } = Select;
/**
 * 创建Tabel组件的参数
 * @param {*} rowKey 
 * @param {*} columns 
 * @param {*} dataSource 
 * @param {*} page 
 * @param {*} onChange 
 * @param {*} pageSize 
 * @param {*} onShowSizeChange 
 */
export function createTableProps(
  rowKey,
  columns,
  dataSource,
  page,
  onChange,
  total,
  pageSize = 20,
  onShowSizeChange = null
) {
  return {
    rowKey,
    dataSource,
    columns,
    page,
    bordered: true,
    pagination: {
      total,
      pageSize,
      onChange,
      onShowSizeChange,
      showSizeChanger: onShowSizeChange,
      showQuickJumper: true,
      showTotal: total2 => {
        return `共${total2}条记录`;
      },
    },
  };
}

function loopTreeNode(treeData, createNodeProps, getChildrenFunction) {
  return treeData.map((item) => {
    const children = getChildrenFunction(item);
    return (
      <TreeNode {...createNodeProps(item)}>
        {
          children ? loopTreeNode(children, createNodeProps, getChildrenFunction) : null
        }
      </TreeNode>
    );
  });
}

/**
 * 创建树控件
 * 
 * createTree(data, (node)=>{title:node.name}, (node)=>node.children)
 * 
 * @param {*} treeData 树的数据
 * @param {*} createNodeProps 给单个treenode结点创建Props的函数，格式为fun(node)
 * @param {*} getChildrenFunction 获取子结点列表的函数，格式为fun(node)
 * @param {*} treeProps 树的Props属性
 */
export function createTree(treeData, createNodeProps, getChildrenFunction, treeProps) {
  if (treeData) {
    return (
      <Tree {...treeProps}>
        {
          loopTreeNode(treeData, createNodeProps, getChildrenFunction)
        }
      </Tree>
    );
  }
  return null;
}

/**
 * 使用数据保存的附件信息创建用于upload组件的附件格式
 * @param {*} attatchList 附件数组，每一项包含id,name两个属性
 * @param {*} url 
 */
export function createDefaultUploadFile(attatchList) {
  if (!attatchList) {
    return [];
  }

  try {
    if (typeof (attatchList) === 'string') {
      attatchList = JSON.parse(attatchList);
    }
    let result = [];
    for (let i = 0; i < attatchList.length; i++) {
      let item = attatchList[i];
      result.push(
        {
          uid: '-1',
          url: DOWNLOAD_API(item.id),
          name: item.name,
          status: 'done',
          response: {
            sucess: true,
            entity: [
              {
                id: item.id,
                fileName: item.name,
              }
            ]
          }
        }
      );
    }
    return result;
  } catch (error) {
    console.log('attach error');
    return [];
  }
}

/**
 * 把upload组件中的文件列表，转换成要保存到服务器的格式 [{id:1, name:'a'}, {}, ...]
 * @param {*} attatchList 
 */
export function getAttatchStr(attatchList) {
  if (attatchList) {
    let result = [];
    for (let item of attatchList) {
      result.push({ id: item.response.entity[0].id, name: item.response.entity[0].fileName });
    }
    return JSON.stringify(result);
  }
  return null;
}

/**
 * 提取附件ID
 * @param {*} attatchList 
 */
export function getAttatchID(attatchList) {
  if (attatchList) {
    let result = '';
    for (let item of attatchList) {
      result += `${item.response.entity[0].id}`
    }
    return result;
  }
  return null;
}

/**
 * 渲染附件，通常在表格中使用，根据文件名，会自动渲染成图片，或下载链接 
 */
export function renderAttatch(attatchStr) {
  let attachList = createDefaultUploadFile(attatchStr);
  return (
    <span>
      {
        attachList.map((item, i) => {
          const url = DOWNLOAD_API(item.response.entity[0].id);
          const fileName = item.response.entity[0].fileName;
          const extension = getExtension(fileName)
          // 如果是图片，显示图片；否则显示下载
          if (['.jpg', '.gif', '.png', '.svg', '.jpeg'].indexOf(extension) >= 0) {
            return <Zmage backdrop='rgba(166, 166, 166, 0.3)' style={{ margin: '10px', width: 100 }} key={i} src={url} alt={fileName} />
          }
          else {
            return <a style={{ padding: '5px 10px' }} key={i} href={url} download={fileName}>{fileName}</a>
          }
        })
      }
    </span>
  );
}

/**
 * 根据数据源创建select的options列表
 * @param {*} dataSource 数据源
 * @param {*} labelFunction 把每一项转换成显示文字的函数，如果不设置，则使用toString()
 */
export function createSelectOptions(dataSource, labelFunction = null, valueFunction = null) {
  if (dataSource && dataSource.length) {
    return dataSource.map((item, i) => {
      return <Option key={i.toString()} value={valueFunction ? valueFunction(item) : item}>{labelFunction ? labelFunction(item) : item}</Option>
    });
  }
  return [];
}

export function createYearOption(startYear = 1980) {
  let endYear = new Date().getFullYear();
  let result = [];
  if (startYear > endYear) {
    startYear = endYear;
  }
  for (let i = startYear; i <= endYear; i++) {
    result.push(i);
  }
  return result;
}

/**
 * 中国民族列表
 */
export function createNationList() {
  return [
    '汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族',
    '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族',
    '瑶族', '白族', '土家族', '哈尼族', '哈萨克族',
    '傣族', '黎族', '僳僳族', '佤族', '畲族', '高山族',
    '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族',
    '土族', '达斡尔族', '仫佬族', '羌族', '布朗族',
    '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族',
    '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族',
    '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族',
    '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族'
  ];
}
/**
 * 政治面貌列表
 */
export function createPoliticalList() {
  return ['中共党员', '中共预备党员', '共青团员', '民革党员', '民盟盟员', '民建会员', '民进会员', '农工党党员', '致公党党员', '九三学社社员', '台盟盟员', '无党派人士', '群众']
}

/**
 * 学历列表
 */
export function createEducationList() {
  return ['初中及以下', '高中', '专科', '本科', '硕士', '博士以及上'];
}

/**
 * 学位列表
 */
export function createDegreeList() {
  return ['学士', '硕士', '博士'];
}

/**
 * 院士类别列表
 */
export function createAcademicianTypeList() {
  return ['科学院院士', '工程院院士'];
}

/**
 * 熟练度列表
 */
export function createProficiencyList() {
  return ['一般', '熟练', '精通'];
}

/**
 * html内容转换为纯文件
 * @param {*} html 
 * @param {*} maxLength 纯文本的最大长度
 */
export function htmlToText(html, maxLength = 80) {
  if (!html) {
    return '';
  }
  let span = document.createElement('span');
  span.innerHTML = html;
  return span.innerText.substr(0, maxLength);
}

export function createFormRules(required, max = 100, reg = null, requiredMsg = '请输入数据') {
  let result = [];
  if (required) {
    result.push(
      {
        required,
        message: requiredMsg,
      },
    );
  }
  if (max) {
    result.push(
      {
        max,
        message: `不能超过${max}个字符`
      }
    );
  }
  if (reg) {
    result.push(
      {
        pattern: reg,
        message: `请输入正确的数据`
      }
    );
  }

  return result;
}

export const NEWS_WINDOW_PROPS = {
  columns: [
    {
      title: '标题',
      dataIndex: 'title',
    }
  ],
  searchCreater: (values, pageSize, current) => {
    return `/services/indexManage/news/list/${current}/${pageSize}${createSearchString(values)}`;
  },
  transData: (response) => {
    return {
      data: response.data.data,
      total: response.data.length,
    }
  },
  labelFunction: (item) => item.title,
  formItems: class SearchForm extends Component {
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div>
          <div className='divAreaContainer'>
            <FormItem label='标题'>
              {
                getFieldDecorator('title')(<Input />)
              }
            </FormItem>
            <FormItem>
              <FormRefreshButton />
              <FormResetButton />
            </FormItem>
          </div>
        </div>
      );
    }
  }
}

export function confirmDelete(onOk) {
  Modal.confirm(
    {
      okText: '确认删除',
      cancelText: '我再想想',
      title: '删除确认',
      content: '操作不可恢复，是否确认删除',
      onOk,
    }
  );
}
export function confirmPwdreset(onOk) {
  Modal.confirm(
    {
      okText: '确认密码初始化',
      cancelText: '取消',
      title: '确认',
      content: '操作不可恢复，是否确认',
      onOk,
    }
  );
}
export function createTdItem(label, content, spanLabel = 1, spanContent = 1) {
  return [<td key="label" colSpan={spanLabel} className="tableLabel">{label}</td>, <td key='content' colSpan={spanContent} className="contentLabel">{content}</td>];
}