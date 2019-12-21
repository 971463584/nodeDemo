import React,{Component} from 'react';
import axios from 'axios';
import globalConfig from '../config';
import { List,Button ,Modal} from 'antd';

const { confirm } = Modal;

export default class HostList extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }

    editHostBtn =(ev)=> {
        let hosts = ev.target.title;
        this.props.history.push('/editHost?hosts='+hosts);
    }

    delHostBtn =(ev)=>{
        let hosts = ev.target.title;
        confirm({
            title: '你确定要删除该域名嘛？',
            content: '域名：'+hosts,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                axios.post(globalConfig.setApiUrl('/host/delHost'),{
                    del_vla : hosts
                })
                window.location.reload(true);
            },
            onCancel() {
            console.log('Cancel');
            },
          });
    }

    componentDidMount(){
        axios.post(globalConfig.setApiUrl('/host/hostList')).then(response =>{
            let arr = [];
            for(let i = 0; i< response.data.length; i++){
                let obj = {
                    title: response.data[i],
                }
                arr.push(obj)
            }
            this.setState({
                data: arr
            })
        })
    }

    render(){
        const {data} = this.state
        return (
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item,index )=> (
                <List.Item
                    actions={[
                        <Button title={item.title} type="primary" onClick={this.editHostBtn.bind(this)}>修改</Button>,
                        <Button title={item.title} type="danger" onClick={this.delHostBtn.bind(this)}>删除</Button>
                    ]}
                >
                    <List.Item.Meta
                        description={item.title}
                    />
                    {/* <div>{item.title}</div> */}
                </List.Item>
                )}
            />
        )
    }
}