import React,{Component} from 'react'; 
import '../css/template.css';
import axios from 'axios';
import { Icon } from 'antd';
/*===============================================*/ 
import globalConfig from '../config'
/*===============================================*/ 
export default class CopyTemplate1 extends Component{
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
            names: null,//默认的名字格式
            logos: null,//默认的logo格式
            bookState: null,
            copyChannel: null,
            copyAppname:  null,
            copypageName: null,
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
                        urls: globalConfig.setApiUrl('/modles/modles')+'?pageNum=' + pageName +'&channelName=' + channel + '&appName='+ appName 
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

    //小说的状态
    bookStateChange = (id)=>{
        this.setState({
            bookState: id
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
            config_num: this.state.config_num.slice(0, this.state.config_num.length - 1),
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
            this.setState({
                dataObj: response.data.data,
                names: response.data.data.names,
                logos: response.data.data.logos,
                bookState: response.data.data.bookState
            })
            //配置数组
            for(let i = 0; i < response.data.data.config_num;i++){
                let obj = {
                    android_downLink:response.data.data.android_downLink[i],
                    ios_downLink:response.data.data.ios_downLink[i],
                    app_hostname:response.data.data.app_hostname[i],
                    app_copyright:response.data.data.app_copyright[i]
                }
                this.setState({
                    config_num: [...this.state.config_num, obj]
                })
            }
        })
    }


    render(){
        return (
            <form id="newCeatePage" method="post" encType="multipart/form-data" className="template1From" action={this.state.urls}>
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
                        <input 
                        type="text" 
                        name="appName" 
                        defaultValue={this.state.dataObj.appNames} 
                        required={this.state.names ==='1'?true:false}
                        autoComplete="off"/>
                    </div>
                </div>
                <div className="Distinguish_appName" style={{display:this.state.names ==='2'?true:'none'}}>
                    <div className="android_appName">
                        <p>安卓-app名字：</p>
                        <div>
                            <input 
                            type="text" 
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
                <div className="appAd">
                    <p>广告词：</p>
                    <div>
                        <input type="text" name="appAd" defaultValue={this.state.dataObj.appAd}  autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookFace">
                    <p>小说封面：</p>
                    <div>
                        <img src={`${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.cover}`} alt=""/>
                        <input type="file" name="bookFace"/>
                    </div>
                </div>
                <div className="bookName">
                    <p>小说名：</p>
                    <div>
                        <input type="text" name="bookName"  defaultValue={this.state.dataObj.bookName} autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookAlias">
                    <p>小说别名：</p>
                    <div>
                        <input type="text" name="bookAlias" defaultValue={this.state.dataObj.bookAlias} autoComplete="off"/>
                    </div>
                </div>
                <div className="bookAuthor">
                    <p>小说主角：</p>
                    <div>
                        <input type="text" name="bookAuthor" defaultValue={this.state.dataObj.bookAuthor} autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookState" data-info="{{bookState}}">
                    <p>小说状态：</p>
                    <div>
                        <input type="radio" name="bookState" value="0" checked={this.state.bookState==="0"} onChange={this.bookStateChange.bind(this,"0")}/>完结
                        <input type="radio" name="bookState" value="1" checked={this.state.bookState==="1"} onChange={this.bookStateChange.bind(this,"1")}/>连载中
                    </div>
                </div>
                <div className="bookFans">
                    <p>小说观看人数：</p>
                    <div>
                        <input type="number" name="bookFans" defaultValue={this.state.dataObj.bookFans} autoComplete="off" min="0" required/>
                    </div>
                </div>
                <div className="bookStyle">
                    <p>小说特色：</p>
                    <div>
                        <input type="text" name="bookStyle" defaultValue={this.state.dataObj.bookStyle} autoComplete="off" required/>
                    </div>
                </div>
                <div className="bookNum">
                    <p>小说分数：</p>
                    <div>
                        <input type="number" name="bookNum" defaultValue={this.state.dataObj.bookNum} autoComplete="off" step="0.1" min="0" max="10.0" required/>
                    </div>
                </div>
                <div className="latestChapter">
                    <p>最后章节：</p>
                    <div>
                        <input type="text" name="latestChapter" autoComplete="off" defaultValue={this.state.dataObj.latestChapter} required/>
                    </div>
                </div>
                <div className="bookIntroduce">
                    <p>小说简介：</p>
                    <div>
                        <textarea name="bookIntroduce" defaultValue={this.state.dataObj.bookIntroduce} required></textarea>
                    </div>
                </div>
                <div className="bookDown">
                    <p>小说下载说明：</p>
                    <div>
                        <input type="text" name="bookDown" defaultValue={this.state.dataObj.bookDown} autoComplete="off" required/>
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
                <input type="submit" value="保存" id="submit_Btn"/>
            </form>
         )
    }
}