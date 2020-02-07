import React,{Component} from 'react';
import {Table,Button} from 'antd'
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/bar';
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import styles from './index.less';
class Detail extends Component{
    constructor(props){
        super(props);
        this.state={
            tableData:[],
            loading:true,
            current:1,
        }
    }

    componentDidMount(){
        this.setPieData()
        this.getTableData()
    }
    setPieData = () => {
        let option = {
            title: { text: '' },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
            },
            color:['#BBBBBB','#FFAE00','#3699FF'],
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['30%', '55%'],
                    label: {
                        normal: {
                            formatter: '{b|{b}:}{c} {per|{d}%}\n{hr|}  ',
                            height:16,
                            rich: {
                                b: {
                                    fontSize: 14,
                                    lineHeight:14,
                                },
                                per: {
                                    color: '#666',
                                    padding:[2, 0],
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth:2,
                                    height:0
                                },
                            }
                        }
                    },
                    data:[
                        {value:147, name:'未完成',color:'#0f0'},
                        {value:335, name:'进行中'},
                        {value:1048, name:'已完成'},
                    ]
                }
            ]
            };
        let chartPie = echarts.init(document.getElementById('chartPie'));
        chartPie.setOption(option)
        let optionBar = {
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['product', '2015', '2016', '2017'],
                    ['Matcha Latte', 43.3, 85.8, 93.7],
                    ['Milk Tea', 83.1, 73.4, 55.1],
                    ['Cheese Cocoa', 86.4, 65.2, 82.5],
                    ['Walnut Brownie', 72.4, 53.9, 39.1]
                ]
            },
            xAxis: {type: 'category'},
            yAxis: {},
            series: [
                {type: 'bar'},
                {type: 'bar'},
                {type: 'bar'}
            ]
        };
        let chartBar = echarts.init(document.getElementById('chartBar'));
        chartBar.setOption(optionBar)

        
    }
    getTableData = () => {
        let list = [];
        for (let i = 0; i < 10; i++) {
        list.push ({
            partyName:'烽火党委',
            partyNum:666,
            organizeNum:26,
            organizeComplet:'97.8%',
            partyJoin:'99.8%',
            id: String (Math.round(new Date().getTime ()*Math.random())),
        });
        }
        
        setTimeout(()=>{
            this.setState ({tableData: list, loading: false});
        },1200)
    }
    exportExel = type => {
        console.log(type)
    }
    onPageChange = (page) => {
        this.setState ({current: page});
    }
    onPageSizeChange = () => {

    }
    render(){
        const {tableData,loading,current} = this.state;
        let pagination = {
            // showQuickJumper: true,
            // showSizeChanger: true,
            total: 10,
            pageSize: 5,
            current: current,
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageSizeChange,
            showTotal: total =>
              `共${total}条记录 第 ${current} / ${Math.ceil (total/5)}页`,
        };
        const columns = [    
            {
                title: '任务名称',
                dataIndex: 'partyName',
                key: 'partyName',
                width: 160,
                render:(_,data)=>{
                    return <span className='blueSpan'>{data.partyName}</span>
                }
            },
            {
                title: '组织数/党员数',
                dataIndex: 'partyNum',
                key: 'partyNum',
                width: 160,
                render:(_,data)=>{
                    return <span>{data.organizeNum}/{data.partyNum}</span>
                }
            },
            {
                title: '组织完成率',
                dataIndex: 'organizeComplet',
                key: 'organizeComplet',
                width: 160,
            },
            {
                title: '党员参与率',
                dataIndex: 'partyJoin',
                key: 'partyJoin',
                width: 160,
            },
        ];
        return(
            <div className={styles.partyDetail}>
                <div className={styles.top}>
                    <span>党建任务/</span>
                    <span>党建工作统计/</span>
                    <span>各级党组织任务执行情况</span>
                </div>
                <div className={styles.head}>
                    <span>北京联通党总支></span>
                    <span>党支部1</span>
                </div>
                <div className={styles.title}>
                    <i></i>
                    <span>本级组织发出的任务统计</span>
                </div>
                <div className={styles.atlas}>
                    <div className={styles.pie} id='chartPie'></div>
                    <div className={styles.bar} id='chartBar'></div>
                </div>
                <div className={styles.table}>
                    <h3><i></i><span>主题教育完成情况</span><Button className={styles.exportBtn} onClick={()=>this.exportExel(2)}>导出</Button></h3>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        loading={loading}
                        pagination={pagination}
                        rowKey={'id'}
                    />
                </div>
            </div>
        )
    }
}
export default Detail