import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { message, Tabs, Modal, Popconfirm, Divider } from 'antd';
import Content from '../MagazineManagement/Content';
import MagazineArticle from '../MagazineManagement/Article';
import API_PREFIX, { API_FILE_VIEW, API_FILE_UPLOAD, masterUrl, API_CHOOSE_SERVICE, API_FILE_VIEW_INNER } from '../../apiprefix';
import { GetQueryString, postService, getService } from '../../myFetch';
import { pageJummps } from '../PageJumps';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../redux-root/action/table/table';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)

export default class Magazine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      magazineSeriesOption: [],
      isPublishOption: [],
      previewImage: '',
      previewVisible: false,
      ispublish: false,
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
    };
  }

  componentDidMount() {
    getService(API_PREFIX + pageJummps.MagazineSeries, data => {
      if (data.status == 1) {
        let Data = data.root.list;
        let List = [];
        for (let i = 0; i < Data.length; i++) {
          List.push({ key: Data[i].id, value: Data[i].fieldName });
        }

        this.setState({ magazineSeriesOption: List });
      }else{
        message.error(data.errorMsg);
      }
    });
  }

  exchange = (magazineId, contentId) => {
    if (magazineId != null && typeof magazineId != 'undefined') {
      window.sessionStorage.setItem('magazineId', magazineId);
    }
    if (contentId != null && typeof contentId != 'undefined') {
      window.sessionStorage.setItem('contentId', contentId);
    }
  }

  handleMagazinePreview = (pictureUrl) => {
    let ImgUrl = ''
    if (API_CHOOSE_SERVICE === 1) {
      ImgUrl = this.state.ossViewPath + pictureUrl;
    } else {
      ImgUrl = API_FILE_VIEW_INNER + pictureUrl;
    }
    this.setState({
      previewImage: ImgUrl,
      previewVisible: true,
    });
  }

  publish = (record) => {
    getService(API_PREFIX + `${pageJummps.MagazinePush}/${record.id}`, data => {
      if (data.status == 1) {
        message.success('杂志已成功发布！', 2);
        this.setState({
          ispublish: record.ispublish,
        });
        this.props.getData(API_PREFIX + `${pageJummps.MagazineList}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        message.error(data.retMsg);
      }
    });

  }

  magazineList = (record) => {
    this.exchange(record.id, null);
    const list = JSON.stringify(record);
    window.sessionStorage.setItem('magazine', list);
    let contentTab = this.getSeriesName(record.seriesId) + '-' + record.name + '-' + record.periods + '-杂志目录';
    this.props.add('two', [{ title: contentTab, content: <Content periods={record.periods} tabtitle={this.getSeriesName(record.seriesId)} id={record.id} add={this.props.add} exchange={this.exchange} />, key: '2' }]);
  }

  magazineArticle = (record) => {
    this.exchange(record.id, null);
    const list = JSON.stringify(record);
    window.sessionStorage.setItem('magazine', list);

    let contentTab = this.getSeriesName(record.seriesId) + '-' + record.name + '-' + record.periods + '-杂志目录';
    let articleTab = this.getSeriesName(record.seriesId) + '-' + record.name + '-' + record.periods + '-杂志文章';
    this.props.add('one', [
      { title: contentTab, content: <Content periods={record.periods} tabtitle={this.getSeriesName(record.seriesId)} id={record.id} add={this.props.add} exchange={this.exchange} />, key: '2' },
      { title: articleTab, content: <MagazineArticle type='total' id={record.id} />, key: '3' }]);
  }
  getSeriesName = id => {
    let list = this.state.magazineSeriesOption.filter(item => { return item.key === id; });
    return list.length ? list[0].value : id;
  }
  render() {
    const { magazineSeriesOption,ossViewPath } = this.state;
    let powers = this.props.powers;
    let createPowers = powers && powers['20001.21605.001'];//新建
    let updatePowers = powers && powers['20001.21605.002'];//修改
    let readPowers = powers && powers['20001.21605.003'];
    let deletePowers = powers && powers['20001.21605.004'];//删除
    let hasReleasePower = powers && powers['20001.21605.005'];//杂志发布
    let MagazineArticle = powers && powers['20001.21605.230'];//杂志文章
    let MagazineCatalog = powers && powers['20001.21605.231'];//杂志目录
    const columns = [
      {
        title: '封面',
        dataIndex: 'coverImage',
        key: 'coverImage',
        width: 100,
        fixed: 'left',
        render: (text, record, index) => {
          return <span>
            {API_CHOOSE_SERVICE == 1 ?
              <img onClick={() => this.handleMagazinePreview(record.coverImage)} key={index} src={ossViewPath + record.coverImage} style={{ width: '50px', height: '50px' }} /> :
              <img onClick={() => this.handleMagazinePreview(record.coverImage)} key={index} src={API_FILE_VIEW_INNER + record.coverImage} style={{ width: '50px', height: '50px' }} />

            }
          </span>;

        },
      },
      {
        title: '期刊名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        fixed: 'left',
      },
      {
        title: '期数',
        dataIndex: 'periods',
        key: 'periods',
        width: 100,
      },
      {
        title: '杂志系列',
        dataIndex: 'seriesId',
        key: 'seriesId',
        render: (data, record) => {
          return <span>{this.getSeriesName(record.seriesId)}</span>;
        },
      },
      {
        title: '是否发布',
        dataIndex: 'state',
        key: 'state',
        width: 80,
        render: (data, record) => {
          return <span>{record.state ? '是' : '否'}</span>;
        },
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        key: 'publishDate',
        width: 150,
      },
      {
        title: '更新时间',
        dataIndex: 'lastUpdateDate',
        key: 'lastUpdateDate',
        width: 150,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 300,
        fixed: 'right',
        render: (text, record) => {
          return <div>
            {
              hasReleasePower ? (record.state ? <span className='banClick' style={{ color: '#000' }}>已发布</span> : <Popconfirm title="确定发布该杂志吗?" onConfirm={() => this.publish(record)}><span><a className="operation">发布</a></span></Popconfirm>) : null
            }
            {
              updatePowers ? (
                <span>
                  <Divider type="vertical" />
                  <span><a className="operation" onClick={() => { location.hash = `/InformationManagement/Magazine/Edit?id=${record.id}`; }}>编辑</a></span>
                </span>
              ) : null
            }
            {
              MagazineCatalog ? (
                <span>
                  <Divider type="vertical" />
                  <span><a className="operation" onClick={() => this.magazineList(record)}>杂志目录</a></span>
                </span>
              ) : null
            }
            {
              MagazineArticle ? (
                <span>
                  <Divider type="vertical" />
                  <span><a className="operation" onClick={() => this.magazineArticle(record)}>杂志文章</a></span>
                </span>
              ) : null
            }
          </div>;
        },
      },
    ];
    const isPublishOption = [{ key: '', value: '全部' }, { key: '1', value: '是' }, { key: '0', value: '否' }];
    const search = [
      { key: 'type', label: '杂志系列', qFilter: 'Q=seriesId', type: 'select', option: magazineSeriesOption },
      { key: 'isEnabled', label: '是否发布', qFilter: 'Q=isPush', type: 'select', option: isPublishOption },
    ];

    return <div>
      <TableAndSearch
        columns={columns}
        url={pageJummps.MagazineList}
        search={search}
        addBtn={createPowers ? { order: 1, url: '/InformationManagement/Magazine/Add' } : null}
        updateBtn={{ order: 1 }}
        deleteBtn={deletePowers ? { order: 2, url: pageJummps.MagazineDelete, txt: '可能关联杂志目录相关信息,您确定删除吗?' } : null}
        typeId="Magazine"
      // scroll={{width:1400}}
      />
      <Modal
        visible={this.state.previewVisible}
        onCancel={() => this.setState({ previewVisible: false })}
        footer={null}
        destroyOnClose>
        <div className='imgsize'><img alt="example" src={this.state.previewImage} /></div>
      </Modal>
    </div>;
  }
}