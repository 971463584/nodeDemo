import React,{Component} from 'react'; 
import { Button ,Input} from 'antd';
import axios from 'axios';
import globalConfig from '../config'
import 'antd/dist/antd.css';
import '../css/channel.css';

export default class NewHost extends Component{
    constructor(props){
        super(props);
        this.state = {
            newHostVal: '',//渠道
            tips: '我是提示啊',//提示
            tipsClass: 'tips',//样式
        }
    }
    
    newHostChange = (ev)=>{
        this.setState({
            newHostVal: ev.target.value
        })
    }
    //新建渠道
    newBtn = () =>{
        // console.log(this.state.channelVal);
        let newHostVal = this.state.newHostVal;
        if(newHostVal !== ""){
            axios.post(globalConfig.setApiUrl('/host/newHost'),{
                newHost_val: newHostVal
            }).then((response) => {
                console.log(response.data)
                if (response.data === 'yes') {
                    this.setState({
                        tipsClass: 'tips_wrong',
                        tips: '该域名已经存在了喔'
                    })
        
                } else if (response.data === 'ok') {
                    this.setState({
                        tipsClass: 'tips_right',
                        tips: '新建成功'
                    })
        
                }
            });
        }else{
            this.setState({
                tipsClass: 'tips_wrong',
                tips: '不能为空喔'
            })

        }

    }
    //重置
    resetBtn =(ev) => {
        this.setState({
            newHostVal: '',
            tipsClass: 'tips',
            tips: '我是提示啊'

        })
    }

    render(){
        return(
            <form>
                <p>请输入新建的域名</p>
                <Input size="large" 
                placeholder="请输入新建的域名" 
                className="newHost" 
                value={this.state.newHostVal}
                onChange={this.newHostChange}
                />
                <p className={this.state.tipsClass}>{this.state.tips}</p>
                <Button 
                type="primary" 
                className="newBtn" 
                onClick={this.newBtn.bind(this)}
                >新建域名</Button>
                <Button 
                type="primary" 
                className="resetBtn" 
                onClick={this.resetBtn.bind(this)}
                >重置</Button>
            </form>
        )
    }
}