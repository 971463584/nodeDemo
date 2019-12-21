import React,{Component} from 'react'; 
import { Button ,Input} from 'antd';
import axios from 'axios';
import globalConfig from '../config'
import 'antd/dist/antd.css';
import '../css/channel.css';
/*===================================*/ 
// import globalConfig from '../config'
/*=====================================*/ 

export default class Channel extends Component{
    constructor(props){
        super(props);
        this.state = {
            channelVal: '',//渠道
            tips: '我是提示啊',//提示
            tipsClass: 'tips',//样式
        }
    }
    
    channelChange = (ev)=>{
        this.setState({
            channelVal: ev.target.value
        })
        console.log(globalConfig);
        // console.log(this.state.channelVal);
    }
    //新建渠道
    newBtn = () =>{
        // console.log(this.state.channelVal);
        let channelVal = this.state.channelVal;
        if(channelVal !== ""){
            axios.get(globalConfig.setApiUrl('/newChannel/newChannelName'),{
                params: {
                    channel_val: channelVal
                  }
            }).then((response) => {
                console.log(response.data)
                if (response.data === 'yes') {
                    this.setState({
                        tipsClass: 'tips_wrong',
                        tips: '该渠道已经存在了喔'
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
            channelVal: '',
            tipsClass: 'tips',
            tips: '我是提示啊'

        })
    }

    render(){
        return (
            <form>
                <p>请输入新建的渠道</p>
                <Input size="large" 
                placeholder="请输入新建的渠道" 
                className="channel" 
                value={this.state.channelVal}
                onChange={this.channelChange}
                />
                <p className={this.state.tipsClass}>{this.state.tips}</p>
                <Button 
                type="primary" 
                className="newBtn" 
                onClick={this.newBtn.bind(this)}
                >新建渠道</Button>
                <Button 
                type="primary" 
                className="resetBtn" 
                onClick={this.resetBtn.bind(this)}
                >重置</Button>
            </form>
        )
    }
}