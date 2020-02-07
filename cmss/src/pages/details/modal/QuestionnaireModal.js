/* eslint-disable global-require */
import React from 'react';
import BaseModal from '@/pages/details/modal/BaseModal';
import { connect } from 'dva';
import { List, Typography, Spin, Pagination, message } from 'antd';
import styles from '@/pages/details/modal/index.less';
/**
 * 问卷统计弹窗
 */
const { Paragraph } = Typography;

@connect(({ detail, loading }) => ({
  detail,
  loading: loading.effects['detail/getAnswerList'],
}))
class QuestionnaireModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      loading: false,
      answerList: [],
      answerTotal: 1,
      answerCunrrent: 1,
    };
  }

  componentDidMount() {}

  onChange = page => {
    const { dataSource } = this.props;
    const question = dataSource[page - 1];
    const newPage = page;
    if (page > dataSource.length || page < 1) {
      return;
    }
    if (question.optionList.length === 0) {
      this.setState({ loading: true, answerCunrrent: 1, current: newPage });
      const { activityNewsId, dispatch } = this.props;
      const formdata = {
        activityId: activityNewsId,
        msgId: 'APP053',
        topicId: question.id,
        index: 0,
        pagesize: 10000,
      };
      dispatch({
        type: 'detail/getAnswerList',
        payload: {
          text: JSON.stringify(formdata),
        },
        callBack: res => {
          if (res.code === '0') {
            let list;
            if (res.resultMap.answerList) {
              list = res.resultMap.answerList;
            } else {
              list = [];
            }
            this.setState({
              answerList: list.length > 5 ? list.slice(0, 5) : list,
              loading: false,
              answerTotal: list.length,
            });
          } else {
            this.setState({ loading: false });
            message.error('获取结果失败');
          }
        },
      });
    } else {
      this.setState({
        current: newPage,
        answerCunrrent: 1,
        answerList: [],
      });
    }
  };

  onChangeAnswerList = page => {
    const { current } = this.state;
    const { dataSource } = this.props;
    const question = dataSource[current - 1];
    this.setState({ loading: true, answerCunrrent: page });
    this.getAnswerList(page, question.id);
  };

  getAnswerList = (page, id) => {
    const { activityNewsId, dispatch } = this.props;
    const formdata = {
      activityId: activityNewsId,
      msgId: 'APP053',
      topicId: id,
      index: page * 5 - 5,
      pagesize: 5,
    };
    dispatch({
      type: 'detail/getAnswerList',
      payload: {
        text: JSON.stringify(formdata),
      },
      callBack: res => {
        if (res.code === '0') {
          let list;
          if (res.resultMap.answerList) {
            list = res.resultMap.answerList;
          } else {
            list = [];
          }
          this.setState({ answerList: list, loading: false });
        } else {
          this.setState({ loading: false });
          message.error('获取结果失败');
        }
      },
    });
  };

  render() {
    const { current, answerTotal, loading, answerList, answerCunrrent } = this.state;
    const { dataSource } = this.props;
    const question = dataSource.length ? dataSource[current - 1] : null;
    return (
      <BaseModal {...this.props} title="问卷统计">
        <div className={styles.pageN}>{`${current}/${dataSource.length}`}</div>
        {dataSource.length > 1 ? (
          <div
            className={styles.backStyle}
            style={{ cursor: current !== 1 ? 'pointer' : 'not-allowed' }}
            onClick={() => this.onChange(current - 1)}
          >
            {'<'}
          </div>
        ) : null}
        {dataSource.length > 1 ? (
          <div
            className={styles.nextStyle}
            style={{ cursor: current !== dataSource.length ? 'pointer' : 'not-allowed' }}
            onClick={() => this.onChange(current + 1)}
          >
            {'>'}
          </div>
        ) : null}
        <div>
          {dataSource.length && (
            <div className={styles.bannerTitle}>
              <Paragraph ellipsis={{ rows: 6, expandable: true }} className={styles.questionTitle}>
                {question.title}：
              </Paragraph>
            </div>
          )}
          {dataSource.length ? (
            <Spin spinning={loading}>
              <div className={styles.newList}>
                <List
                  itemLayout="horizontal"
                  dataSource={question.optionList.length ? question.optionList : answerList}
                  renderItem={item => (
                    <List.Item className={styles.item}>
                      <span className={styles.itemTitle}>{item.content}</span>
                      {question.optionList.length ? (
                        <span className={styles.score}>{`${item.per}%`}</span>
                      ) : null}
                    </List.Item>
                  )}
                />
                {answerTotal > 5 ? (
                  <Pagination
                    current={answerCunrrent}
                    pageSize={5}
                    onChange={this.onChangeAnswerList}
                    total={answerTotal}
                    className={styles.pagination}
                  />
                ) : null}
              </div>
            </Spin>
          ) : (
            <List itemLayout="horizontal" dataSource={[]} />
          )}
        </div>
      </BaseModal>
    );
  }
}

export default QuestionnaireModal;
