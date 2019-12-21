import React,{Component} from 'react'; 


import '../css/template.css';
import axios from 'axios';
import { Icon } from 'antd';
/*===============================================*/ 
import globalConfig from '../config'
/*===============================================*/ 
export default class CopyTemplate2 extends Component{
    constructor(props){
        super(props);
        this.state = {
            urls: '',//表单目标地址
            modleNum: '',//模板号
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
            templateArr: [],//模板
            dataObj: {},//所有的数据
            config_num: [],//配置数
            chapter_num: [],//章节数
            names: null,//默认的名字格式
            logos: null,//默认的logo格式
            copyChannel: '',
            copyAppname: '',
            copypageName: '',
        }
    }   

    //返回
    goBack(){
        this.props.history.push('/historyPage');
    }

    //url变对象去除掉了?
    urlToObj(urls) {
        let arr = urls.split('&');
        let obj = {};
        let newArr = [];
        arr.forEach((i,v)=>{
            newArr = i.split('=');
            if(typeof obj[newArr[0]] === 'undefined'){
                obj[newArr[0]] = newArr[1];
            }
        })
        return obj;
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
                        urls: globalConfig.setApiUrl('/modles/modles2')+'?pageNum=' + pageName +'&channelName=' + channel + '&appName='+ appName 
                    })
                }
            })
        }
    }

    //logo格式
    select_logo = (id)=>{
        this.setState({
            logos : id
        });
    }

    //app名字的格式
    select_appName = (id) => {
        this.setState({
            names : id
        });
    }

    //添加示范章节
    add_chapter_box =() => {
        let newItem = {
            chapter_name: '',
            chapter_content: ''
        };
        this.setState({
            chapter_num: [...this.state.chapter_num, newItem]
        })

    }

    //删除示范章节
    del_chapter_box = ()=>{
        this.setState({
            chapter_num: this.state.chapter_num.slice(0, this.state.chapter_num.length - 1)
        })
    }

    //添加配置
    add_config_box =() => {
        let newItem = {
            android_downLink:'',
            ios_downLink:'',
            app_hostname:'',
            app_copyright:'',
            copyright_logo: '',
        };
        this.setState({
            config_num: [...this.state.config_num, newItem]
        })

    }

    //删除配置
    del_config_box = ()=>{
        this.setState({
            config_num: this.state.config_num.slice(0, this.state.config_num.length - 1)
        })
    }

    //版权logo显示
    checkError = (e)=> {
        e.target.style.display = 'none';
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
        //获取模板及落地页号
        let urls = (this.props.history.location.search).substr(1);
        let urlObj = this.urlToObj(urls);
        console.log(urlObj);
        this.setState({
            modleNum: urlObj.modleNum,//模板号
            copyChannel: urlObj.channel,//渠道
            copyAppname: urlObj.appName,//包名
            copypageName: urlObj.pageName,//落地页号
        })
        //获取表单所有的数据
        axios.post(globalConfig.setApiUrl('/editFile/editFile'),{
            'channel': urlObj.channel,//渠道
            'appName': urlObj.appName,//包名
            'pageNum': urlObj.pageName,//落地页号
        }).then((response)=>{
            console.log(response.data);
            this.setState({
                dataObj: response.data.data,
                names: response.data.data.names,
                logos: response.data.data.logos
            })
             //配置数组
             for(let i = 0; i < response.data.data.config_num;i++){
                let configObj = {
                    android_downLink:response.data.data.android_downLink[i],
                    ios_downLink:response.data.data.ios_downLink[i],
                    app_hostname:response.data.data.app_hostname[i],
                    app_copyright:response.data.data.app_copyright[i]
                }
                this.setState({
                    config_num: [...this.state.config_num, configObj]
                })
            }
            console.log(this.state.config_num)
            for(let j = 0; j<response.data.data.chapter_num;j++){
                let chapterObj = {
                    chapter_name: response.data.data.chapter_name[j],
                    chapter_content: response.data.data.chapter_content[j]
                }
                this.setState({
                    chapter_num: [...this.state.chapter_num, chapterObj]
                })
            }
            console.log(this.state.config_num)
        })
    }


    render(){
        return (
            <form id="newCeatePage" method="post" encType="multipart/form-data" className="template1From"  action={this.state.urls}>
                <i className="goBack" onClick={this.goBack.bind(this)}>返回</i>
                <div className="modle_num">
                    <p>模板id：</p>
                    <div>
                        <input type="text" name="modle_num" defaultValue={this.state.modleNum} disabled/>
                    </div>
                </div>
                <div  style={{display:"none"}}>
                    <p>原落地页：</p>
                    <div>
                        <input type="text" 
                        name="copyLanding" 
                        value={`${this.state.dataObj.channelName}/${this.state.dataObj.appName}/${this.state.dataObj.pageNum}/`}
                        onChange={(event)=>console.log(event)} 
                        />
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
                    <input type="radio" name="logos" value="1" checked={this.state.logos === '1'} onChange={this.select_logo.bind(this, '1')}/>
                    <span>统一的logo</span>
                    <input type="radio" name="logos" value="2" checked={this.state.logos === '2'} onChange={this.select_logo.bind(this, '2')}/>
                    <span>区分logo</span>
                </div>
                <div id="Unified_logo" style={{display:this.state.logos === '1'?true:'none'}}>
                    <div className="app_logo" >
                        <p>app的logo：</p>
                        <div>
                            <i style={{
                                height:this.state.dataObj.logo?100:0,
                                width:this.state.dataObj.logo?100:0,
                                backgroundImage:this.state.dataObj.logo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.copyChannel}/${this.state.copyAppname}/${this.state.copypageName}/imgs/${this.state.dataObj.logo})`:''}}
                            ></i>
                            <input type="file" name="app_logo" autoComplete="off"/>
                        </div>
                    </div>
                </div>
                <div id="Distinguish_logo"  style={{display:this.state.logos === '2'?true:'none'}}>
                    <div className="android_logo">
                        <p>安卓的logo：</p>
                        <div>
                            <i style={{
                                height:this.state.dataObj.androidLogo?100:0,
                                width:this.state.dataObj.androidLogo?100:0,
                                backgroundImage:this.state.dataObj.androidLogo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.copyChannel}/${this.state.copyAppname}/${this.state.copypageName}/imgs/${this.state.dataObj.androidLogo})`:''}}
                            ></i>
                            <input type="file" name="android_logo" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="ios_logo">
                        <p>ios的logo：</p>
                        <div>
                            <i style={{
                                height:this.state.dataObj.iosLogo?100:0,
                                width:this.state.dataObj.iosLogo?100:0,
                                backgroundImage:this.state.dataObj.iosLogo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.copyChannel}/${this.state.copyAppname}/${this.state.copypageName}/imgs/${this.state.dataObj.iosLogo})`:''}}
                            ></i>
                            <input type="file" name="ios_logo" autoComplete="off"/>
                        </div>
                    </div>
                </div>
                <div className="select_appName">
                    <p>app名字格式：</p>
                    <input type="radio" name="names" value="1" checked={this.state.names === '1'} onChange={this.select_appName.bind(this, '1')}/>
                    <span>统一的名字</span>
                    <input type="radio" name="names" value="2" checked={this.state.names === '2'} onChange={this.select_appName.bind(this, '2')}/>
                    <span>区分名字</span>
                </div>
                <div className="Unified_appName" style={{display:this.state.names ==='1'?true:'none'}}>
                    <p>app名字：</p>
                    <div>
                        <input type="text" name="appName" 
                        required={this.state.names ==='1'?true:false}
                        defaultValue={this.state.dataObj.appNames} autoComplete="off"/>
                    </div>
                </div>
                <div className="Distinguish_appName" style={{display:this.state.names ==='2'?true:'none'}}>
                    <div className="android_appName">
                        <p>安卓-app名字：</p>
                        <div>
                            <input type="text" 
                            name="android_appName" 
                            defaultValue={this.state.dataObj.androidAppName} 
                            required={this.state.names ==='2'?true:false}
                            autoComplete="off"/>
                        </div>
                    </div>
                    <div className="ios_appName">
                        <p>ios-app名字：</p>
                        <div>
                            <input 
                            type="text" 
                            name="ios_appName" 
                            defaultValue={this.state.dataObj.iosAppName} 
                            required={this.state.names ==='2'?true:false} 
                            autoComplete="off"/>
                        </div>
                    </div>
                </div>
                <div className="book_name">
                    <p>小说名：</p>
                    <div>
                        <input type="text" name="book_name" autoComplete="off" defaultValue={this.state.dataObj.book_name} required/>
                    </div>
                </div>
                <div className="book_introduce">
                    <p>小说简介：</p>
                    <div>
                        <textarea name="book_introduce" defaultValue={this.state.dataObj.book_introduce} required></textarea>
                    </div>
                </div>
                <div className="app_downNum">
                    <p>app下载人数：</p>
                    <div>
                        <input type="text" name="app_downNum" autoComplete="off" defaultValue={this.state.dataObj.app_downNum} required/>
                    </div>
                </div>
                <div className="book_imgs">
                    <p>小说封面：</p>
                    <div>
                        <img src={` ${globalConfig.setApiUrl('/pages')}/${this.state.copyChannel}/${this.state.copyAppname}/${this.state.copypageName}/imgs/${this.state.dataObj.cover}`} alt=""/>
                        <input type="file" name="book_imgs" autoComplete="off"/>
                    </div>
                </div>
                {this.state.chapter_num.map((item,index)=>{
                    return (
                        <div className="chapter_box" key={index}>
                            <div className="chapter_name">
                                <p>示范章节名{index+1}：</p>
                                <div>
                                    <input type="text" name="chapter_name" autoComplete="off" defaultValue={item.chapter_name} required min="0"/>
                                </div>
                            </div>
                            <div className="chapter_content">
                                <p>示范章节内容{index+1}：</p>
                                <div>
                                    <textarea name="chapter_content" defaultValue={item.chapter_content} required></textarea>
                                </div>
                            </div>
                            <i className="del_chapter_box" style={{display:index===0?'none':'block'}} onClick={this.del_chapter_box.bind(this)}>删除该章节</i>
                        </div>
                    )
                })}
                <div className="add_chapter" onClick={this.add_chapter_box.bind(this)}>添加章节</div>
                <div className="book_info">
                    <p>小说标签(最多三个喔)：</p>
                    <div>
                        <input type="text" name="book_info" autoComplete="off" defaultValue={this.state.dataObj.book_info} required/>
                    </div>
                </div>

                <div className="app_down">
                    <p>app下载说明：</p>
                    <div>
                        <input type="text" name="app_down" autoComplete="off" defaultValue={this.state.dataObj.app_down} required/>
                    </div>
                </div>
                {this.state.config_num.map((item,index) => {
                    return (
                        <div id="config_box" key={index}>
                            <div className="android_downLink">
                                <p>安卓监控链接{index+1}：</p>
                                <div>
                                    <input type="text" name="android_downLink" autoComplete="off" defaultValue={item.android_downLink} required/>
                                </div>
                            </div>
                            <div className="ios_downLink">
                                <p>ios监控链接{index+1}：</p>
                                <div>
                                    <input type="text" name="ios_downLink" autoComplete="off" defaultValue={item.ios_downLink}  required/>
                                </div>
                            </div>
                            <div className="app_hostname">
                                <p>推广域名{index+1}：</p>
                                <div>
                                    <input type="text" name="app_hostname" autoComplete="off" defaultValue={item.app_hostname} required/>
                                </div>
                            </div>
                            <div className="app_copyright">
                                <p>推广域名版权{index+1}：</p>
                                <div>
                                    <input type="text" name="app_copyright" autoComplete="off" defaultValue={item.app_copyright} required/>
                                </div>
                            </div>
                            <div className="copyright_logo">
                                <p>版权的logo{index+1}：</p>
                                <div>
                                    <img 
                                    src={`${globalConfig.setApiUrl('/pages')}/${this.state.dataObj.channelName}/${this.state.dataObj.appName}/${this.state.dataObj.pageNum}/imgs/${this.state.dataObj.copyright_logo[index]}`}
                                    onError={this.checkError.bind(this)}
                                    alt="这是一张图片"/>
                                    <input type="file" name="copyright_logo" autoComplete="off"/>
                                </div>
                            </div>
                            <i className="del_config_box" onClick={this.del_config_box.bind(this)} style={{display:index===0?'none':'block'}}>删除该配置</i>
                        </div>
                    )
                })}
                <div className="add_config" onClick={this.add_config_box.bind(this)}>添加配置</div>
                <div>
                    <input type="submit" value="保存" id="submit_Btn"/>
                </div>
            </form>
         )
    }
}