import React,{Component} from 'react'; 
import { Button ,Input,Alert } from 'antd';

import axios from 'axios';
import globalConfig from '../config'
import 'antd/dist/antd.css';
import '../css/channel.css';
const { TextArea } = Input;


export default class EditHost extends Component{
    constructor(props){
        super(props);
        this.state = {
            oldHostVal: '',//修改的域名
            editHostVal_i: '',//input输入框
            editHostVal_t: '',//textarea文本框
            tips: '我是提示啊',//提示
            tipsClass: 'tips',//样式
        }
    }
    
    newHostChange_i = (ev)=>{
        this.setState({
            editHostVal_i: ev.target.value
        })
    }
    newHostChange_t = (ev)=>{
        this.setState({
            editHostVal_t: ev.target.value
        })
    }
    //保存修改
    newBtn = () =>{
        let oldHost = this.state.oldHostVal
        let newHost = this.state.editHostVal_i;
        let newHostHtml = this.state.editHostVal_t;
        
        axios.post(globalConfig.setApiUrl('/host/editHost'),{
            oldHost: oldHost,
            newHost: newHost,
            newHostHtml: newHostHtml
        }).then(response => {
            if(response.data === 'ok'){
                this.props.history.push('/hostList');
            }
        })
    }
    //重置
    resetBtn =(ev) => {
        this.props.history.push('/hostList');
    }

    componentDidMount(){
        if(this.props.history.location.search !== ''){
            let hostStr = this.props.history.location.search.substr(1);
            let hostArr = hostStr.split('=');
            axios.post(globalConfig.setApiUrl('/host/hostContent'),{
                deit_val: hostArr[hostArr.length-1]
            }).then(response =>{
                this.setState({
                    oldHostVal: hostArr[hostArr.length-1],
                    editHostVal_t: response.data,
                    editHostVal_i: hostArr[hostArr.length-1]
                })
            })
        }
    }

    render(){
        return (
            <form className="deitHost">
                <span>域名：</span>
                <Input size="large" 
                value={this.state.editHostVal_i}
                onChange={this.newHostChange_i}
                />
                <Alert message="若修改域名，请将下方的配置文件域名一同修改" type="warning" />
                <TextArea rows={20} 
                value={this.state.editHostVal_t}
                onChange={this.newHostChange_t}
                />
                <p className={this.state.tipsClass}>{this.state.tips}</p>
                <Button 
                type="primary" 
                className="newBtn" 
                onClick={this.newBtn.bind(this)}
                >保存修改</Button>
                <Button 
                type="primary" 
                className="resetBtn" 
                onClick={this.resetBtn.bind(this)}
                >取消</Button>
            </form>
        )
    }
}