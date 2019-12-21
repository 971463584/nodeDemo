import React,{Component} from 'react';
import axios from 'axios';
import '../css/template.css'
import { Icon } from 'antd';
/*===============================================*/ 
import globalConfig from '../config'
/*===============================================*/ 
export default class NewTemplate1 extends Component{
    constructor(props) {
        super(props);
        this.state ={
            urls: '',//表单发送的地址
            channelArr: [],//渠道
            channelVal: '',
            appNameArr: ['--请选择包名--'],//包名
            appNameVal: '',
            pageNameArr: [],
            pageNameVal: '',//落地页
            tips: '',//渠道及包名提示
            icons: '',//落地页提示图标
            tisi: '请选择渠道及包名',//落地页提示
            dis: true,
            modleNum: '',//默认的模板号
            Unified_logo: 'none',//统一的logo
            Distinguish_logo: 'none',//区分的logo
            Unified_appName: 'none',//统一的appName
            Distinguish_appName: 'none',//区分的appName
            config_nums: [],//配置数

        }
    }

    //返回
    goBack(){
        this.props.history.push('/landPage');
    }

    //渠道
    channelChange = (ev)=>{
        this.setState({
            channelVal: ev.target.value
        })
        let channelVal = ev.target.value;
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
        let appNameVal = ev.target.value
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
    pageNameChange = (ev) =>{
        this.setState({
        pageNameVal: ev.target.value
        })
    }
  
    //确定action
    actions = ()=>{
        let channel = this.state.channelVal;
        let appName = this.state.appNameVal;
        let pageName = this.state.pageNameVal;
        if(channel !== '--请选择渠道--' && appName !== '--请选择包名--' && pageName !==''){
            axios.get(globalConfig.setApiUrl('/historyDirectory/isDirectory'),{
                params: {
                    channelName: channel,
                    appName: appName,
                    pageNum: pageName
                }
            }).then((response)=>{
                if(response.data === 'yes'){
                    this.setState({
                        icons: <Icon type="exclamation-circle" theme="twoTone" twoToneColor="#DC143C"/>,//落地页提示图标
                        tisi: '已存在',//落地页提示   
                    })
                }else if(response.data === 'no'){
                    this.setState({
                        icons: <Icon type="check-circle" theme="twoTone" />,//落地页提示图标
                        tisi: '',//落地页提示
                        urls: globalConfig.setApiUrl('/modles/modles')+'?pageNum=' + pageName +'&channelName=' + channel + '&appName='+ appName 
                    })
                }
            })
        }
    }

    //logo格式
    select_logo = (ev)=>{
        console.log(ev.target.value);
        let logos = ev.target.value;
        if(logos === '1'){
            this.setState({
                Unified_logo: 'block',//统一的logo
                Distinguish_logo: 'none',//区分的logo
            })
        }else{
            this.setState({
                Unified_logo: 'none',//统一的logo
                Distinguish_logo: 'block',//区分的logo
            })
        }
    }

    //app名字的格式
    select_appName = (ev)=>{
        console.log(ev.target.value);
        let appName = ev.target.value;
        if(appName === '1'){
            this.setState({
                Unified_appName: 'block',//统一的appName
                Distinguish_appName: 'none',//区分的appName
            })
        }else{
            this.setState({
                Unified_appName: 'none',//统一的appName
                Distinguish_appName: 'block',//区分的appName
            })
        }
    }

    //添加配置
    add_config_box =() => {
        let newItem = 1;
        this.setState({
            config_nums: [...this.state.config_nums, newItem]
        })

    }

    //删除配置
    del_config_box = ()=>{
        this.setState({
            config_nums: this.state.config_nums.slice(0, this.state.config_nums.length - 1)
        })
    }

    //重置
    resetBtn = ()=>{
        this.setState({
            Unified_logo: 'none',//统一的logo
            Distinguish_logo: 'none',//区分的logo
            Unified_appName: 'none',//统一的appName
            Distinguish_appName: 'none',//区分的appName
            pageNameVal:'',//落地页号
            icons: '',//落地页提示图标
            tisi: '请选择渠道及包名',//落地页提示
            dis: true,//落地页输入框
        })
    }

    /*生命周期*/
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
        //设置模板号
        let str = (this.props.history.location.search).substr(1);
        let strArr = str.split('=');
        this.setState({
            modleNum: strArr[strArr.length-1]
        })
    } 

    render() {
        return (
            <form id="newCeatePage" method="post" encType="multipart/form-data" className="template1From" action={this.state.urls}>
                <i className="goBack" onClick={this.goBack.bind(this)}>返回</i>
                <div className="modle_num">
                    <p>模板id：</p>
                    <div>
                        <input type="text" name="modle_num" value={this.state.modleNum} disabled/>
                    </div>
                </div>
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
                    <span>{this.state.tips}</span>
                </div>
                <div className="pageNum">
                    <p>落地页编号：</p>
                    <div>
                        <input
                            disabled={this.state.dis}
                            type="text" 
                            name="pageNum" 
                            autoComplete="off" 
                            required 
                            min="0" 
                            value={this.state.pageNameVal}
                            onChange={this.pageNameChange.bind(this)}
                            onBlur={this.actions.bind(this)}
                            />
                        <span className="tisi"></span>
                    </div>
                    <span>
                        {this.state.icons}{this.state.tisi}
                    </span>
                </div>
                <div className="select_logo">
                    <p>logo格式：</p>
                    <input type="radio" name="logos" value="1" onChange={this.select_logo.bind(this)} required/>
                    <span>统一的logo</span>
                    <input type="radio" name="logos" value="2" onChange={this.select_logo.bind(this)} required/>
                    <span>区分logo</span>
                </div>
                <div id="Unified_logo" style={{display:this.state.Unified_logo}}>
                    <div className="app_logo" >
                        <p>app的logo：</p>
                        <div>
                            <input type="file" name="app_logo" autoComplete="off" required={this.state.Unified_logo==="block"?true:false}/>
                        </div>
                    </div>
                </div>
                <div id="Distinguish_logo"  style={{display:this.state.Distinguish_logo}}>
                    <div className="android_logo">
                        <p>安卓的logo：</p>
                        <div>
                            <input type="file" name="android_logo" autoComplete="off" required={this.state.Distinguish_logo==="block"?true:false}/>
                        </div>
                    </div>
                    <div className="ios_logo">
                        <p>ios的logo：</p>
                        <div>
                            <input type="file" name="ios_logo" autoComplete="off" required={this.state.Distinguish_logo==="block"?true:false}/>
                        </div>
                    </div>
                </div>
                <div className="select_appName">
                    <p>app名字格式：</p>
                    <input type="radio" name="names" value="1" onChange={this.select_appName.bind(this)} required/>
                    <span>统一的名字</span>
                    <input type="radio" name="names" value="2"onChange={this.select_appName.bind(this)} required/>
                    <span>区分名字</span>
                </div>
                <div className="Unified_appName" style={{display: this.state.Unified_appName}}>
                    <p>app名字：</p>
                    <div>
                        <input type="text" name="appName" autoComplete="off" required={this.state.Unified_appName==="block"?true:false}/>
                    </div>
                </div>
                <div className="Distinguish_appName" style={{display: this.state.Distinguish_appName}}>
                    <div className="android_appName">
                        <p>安卓-app名字：</p>
                        <div>
                            <input type="text" name="android_appName" autoComplete="off" required={this.state.Distinguish_appName==="block"?true:false}/>
                        </div>
                    </div>
                    <div className="ios_appName">
                        <p>ios-app名字：</p>
                        <div>
                            <input type="text" name="ios_appName" autoComplete="off" required={this.state.Distinguish_appName==="block"?true:false}/>
                        </div>
                    </div>
                </div>
                <div className="appAd">
                    <p>广告词：</p>
                    <div>
                        <input type="text" name="appAd" autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookFace">
                    <p>小说封面：</p>
                    <div>
                        <input type="file" name="bookFace" autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookName">
                    <p>小说名：</p>
                    <div>
                        <input type="text" name="bookName" autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookAlias">
                    <p>小说别名：</p>
                    <div>
                        <input type="text" name="bookAlias" autoComplete="off"/>
                    </div>
                </div>
                <div className="bookAuthor">
                    <p>小说主角：</p>
                    <div>
                        <input type="text" name="bookAuthor" autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookState">
                    <p>小说状态：</p>
                    <div>
                        <input type="radio" name="bookState" value="0" required/>
                        <span>完结</span>
                        <input type="radio" name="bookState" value="1" required/>
                        <span>连载中</span>
                    </div>
                </div>
                <div className="bookFans">
                    <p>小说观看人数：</p>
                    <div>
                        <input type="number" name="bookFans" autoComplete="off" required min="0"/>
                    </div>
                </div>
                <div className="bookStyle">
                    <p>小说特色：</p>
                    <div>
                        <input type="text" name="bookStyle" autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookNum">
                    <p>小说分数：</p>
                    <div>
                        <input type="number" name="bookNum" autoComplete="off" step="0.1" required min="0.0" max="10.0"/>
                    </div>
                </div>
                <div className="latestChapter">
                    <p>最后章节：</p>
                    <div>
                        <input type="text" name="latestChapter" autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookIntroduce">
                    <p>小说简介：</p>
                    <div>
                        <textarea name="bookIntroduce" required></textarea>
                    </div>
                </div>
                <div className="bookDown">
                    <p>小说下载说明：</p>
                    <div>
                        <input type="text" name="bookDown" autoComplete="off" required/>
                    </div>
                </div>
                <div id="config_box">
                    <div className="android_downLink">
                        <p>安卓监控链接：</p>
                        <div>
                            <input type="text" name="android_downLink" autoComplete="off" required/>
                        </div>
                    </div>
                    <div className="ios_downLink">
                        <p>ios监控链接：</p>
                        <div>
                            <input type="text" name="ios_downLink" autoComplete="off" required/>
                        </div>
                    </div>
                    <div className="app_hostname">
                        <p>推广域名：</p>
                        <div>
                            <input type="text" name="app_hostname" autoComplete="off" required/>
                        </div>
                    </div>
                    <div className="app_copyright">
                        <p>推广域名版权：</p>
                        <div>
                            <input type="text" name="app_copyright" autoComplete="off" required/>
                        </div>
                    </div>
                    <div className="copyright_logo">
                        <p>版权的logo：</p>
                        <div>
                            <input type="file" name="copyright_logo" autoComplete="off"/>
                        </div>
                    </div>
                </div>
                {this.state.config_nums.map((item,index)=>{
                    return (
                        <div id="config_box" key={index+1}>
                            <div className="android_downLink">
                                <p>安卓监控链接{index+2}：</p>
                                <div>
                                    <input type="text" name="android_downLink" autoComplete="off" required/>
                                </div>
                            </div>
                            <div className="ios_downLink">
                                <p>ios监控链接{index+2}：</p>
                                <div>
                                    <input type="text" name="ios_downLink" autoComplete="off" required/>
                                </div>
                            </div>
                            <div className="app_hostname">
                                <p>推广域名{index+2}：</p>
                                <div>
                                    <input type="text" name="app_hostname" autoComplete="off" required/>
                                </div>
                            </div>
                            <div className="app_copyright">
                                <p>推广域名版权{index+2}：</p>
                                <div>
                                    <input type="text" name="app_copyright" autoComplete="off" required/>
                                </div>
                            </div>
                            <div className="copyright_logo">
                                <p>版权的logo{index+2}：</p>
                                <div>
                                    <input type="file" name="copyright_logo" autoComplete="off"/>
                                </div>
                            </div>
                            <i className="del_config_box" onClick={this.del_config_box.bind(this)}>删除该配置</i>
                        </div>
                    )
                })}
                <div className="add_config" onClick={this.add_config_box.bind(this)}>添加配置</div>
                <input type="submit" value="生成落地页" id="submit_Btn"/>
                <input type="reset" value="重置" id="reset_btn" onClick={this.resetBtn.bind(this)}/>
            </form>
        )
    }
}