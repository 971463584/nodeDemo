import React,{Component} from 'react'; 
// import {Route,Link} from 'react-router-dom'
import axios from 'axios';
import { Button ,Input} from 'antd';
import 'antd/dist/antd.css';
import '../css/channel.css';
/*==========================================*/ 
import globalConfig from '../config'
/*==========================================*/ 

export default class AppName extends Component{
    constructor(props){
        super(props);
        this.state = {
            appNameVal: '',//包名
            channelArr: [],//渠道
            tips: '我是提示啊',//提示
            tipsClass: 'tips',//提示样式
            sel_value: '--请选择渠道--',//select的value
        }
    }

    selectChange = (ev) => {
        this.setState({
            sel_value: ev.target.value
        })
        
    }

    appNameChange = (ev)=>{
        this.setState({
            appNameVal: ev.target.value
        })
    }

    //新建包名
    newBtn = (ev) =>{
        let appNameVal = this.state.appNameVal;
        let channelVal = this.state.sel_value;
        if(channelVal !== '--请选择渠道--'){
            if(appNameVal !== ""){
                axios.get(globalConfig.setApiUrl('/newPageName/ceatePageName'),{
                    params: {
                        pageName_val: appNameVal,
                        select_text: channelVal
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
        }else{
            this.setState({
                tipsClass: 'tips_wrong',
                tips: '请选择正确的渠道'
            })
        }
    }
    //重置
    resetBtn =() => {
        this.setState({
            appNameVal: '',
            tipsClass: 'tips',
            tips: '我是提示啊',
            


        })
    }

    /*生命周期*/ 
    componentDidMount(){
        //获取所有的渠道
        axios.get(globalConfig.setApiUrl('/newPageName/getChannel')).then((response) =>{
            console.log(response.data);
            this.setState({
                channelArr: response.data
            })
        })
    }

    render(){
        return (
            <form>
                <select value={this.state.sel_value} onChange={this.selectChange.bind(this)}>
                    <option>--请选择渠道--</option>
                    {this.state.channelArr.map((item,index) => {
                        return(
                        <option key={index}>{item}</option>
                        )
                    })}
                </select>
                <span>没有我要的,前往<a href="/channel">新建渠道</a></span>
                <p>请输入新建包名</p>
                <Input size="large" 
                placeholder="请输入新建的包名" 
                className="channel" 
                value={this.state.appNameVal}
                onChange={this.appNameChange}
                />
                <p className={this.state.tipsClass}>{this.state.tips}</p>
                <Button 
                type="primary" 
                className="newBtn" 
                onClick={this.newBtn.bind(this)}
                >新建包名</Button>
                <Button 
                type="primary" 
                className="resetBtn" 
                onClick={this.resetBtn.bind(this)}
                >重置</Button>
            </form>
        )
    }
}