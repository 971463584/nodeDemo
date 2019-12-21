import React,{Component} from 'react';
import { Input,Icon  } from 'antd';
import axios from 'axios';
import globalConfig from '../config';

export default class DropDown extends Component{
    constructor(props){
        super(props);
        this.state ={
            channelArr: [],//渠道
            channelVal: '',
            appNameArr: ['--请选择包名--'],//包名
            appNameVal: '',
            pageNameVal: '',
        }
    }

    //渠道
    channelChange = (ev)=>{
        this.setState({
            channelVal: ev.target.value
        })
        let channelVal = ev.target.value;
        this.props.channelVal(channelVal);
        if(channelVal !== '--请选择渠道--'){
            //获取所有的包名
            axios.get(globalConfig.setApiUrl('/newChannel/selectObj'),{
            params: {
                select_text: channelVal
            }
            }).then((response) =>{
            console.log(response.data);
            let arrs = response.data;
            let str = '--请选择包名--';
            arrs.unshift(str);
            for(let i = 0 ;i< response.data.length;i++){
                this.setState({
                appNameArr: arrs,
                tips: '',
                icons: '',
                })
            }
            })
        }else{
            this.setState({
                tips: '渠道错误',
                appNameArr: ['--请选择包名--'],
                dis:true,
                icons: <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#DC143C"/>,//落地页提示图标
                tisi: '请选择渠道及包名',
                pageNameVal: ''
            })
        }
    }

    //包名
    appNameChange = (ev) =>{
        this.setState({
            appNameVal: ev.target.value
        })
        let appNameVal = ev.target.value;
        this.props.appNameVal(appNameVal);
        if(appNameVal === '--请选择包名--'){
            this.setState({
                tips: '包名错误',
                dis: true,
                icons: <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#DC143C"/>,//落地页提示图标
                tisi: '请选择渠道及包名',
                pageNameVal: ''
            })
        }else{
            this.setState({
                tips: '',
                dis:false,
                tisi: '',
                icons: ''
            })
        }
    }

    //落地页
    pageNameChange = (ev)=>{
        this.setState({
            pageNameVal: ev.target.value
        })
        let pageNameVal = ev.target.value;
        this.props.pageNameVal(pageNameVal);
    }

    componentDidMount(){
        //获取所有的渠道
        axios.get(globalConfig.setApiUrl('/newPageName/getChannel')).then((response) =>{
            console.log(response.data);
            let arrs = response.data;
            let str = '--请选择渠道--';
            arrs.unshift(str);
            for(let i = 0 ;i< response.data.length;i++){
                this.setState({
                    channelArr: arrs
                })
            }
        })
    }
    render(){
        return (
        <div className="channel_pageName">
            <p>渠道及包名：</p>
            <select name="channel_name" id="channel_name" value={this.state.channelVal} onChange={this.channelChange.bind(this)}>
                {this.state.channelArr.map((item,index)=>{
                    return (
                        <option key={index}>{item}</option>
                    )
                })}
            </select>
            <select name="pageName_name" id="pageName_name" value={this.state.appNameVal} onChange={this.appNameChange.bind(this)}>
                {this.state.appNameArr.map((item,index)=>{
                    return (
                        <option key={index}>{item}</option>
                    )
                })}
            </select>
            <Input placeholder="包名" value={this.state.pageNameVal} onChange={this.pageNameChange.bind(this)}/>
        </div>
        )
    }
}
