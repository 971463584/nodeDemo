import React,{Component} from 'react'; 

import '../css/template.css';
import axios from 'axios';
/*===============================================*/ 
import globalConfig from '../config'
/*===============================================*/ 
export default class OldTemplate3 extends Component{
    constructor(props){
        super(props);
        this.state = {
            urls: '',//表单目标地址
            modleNum: '',//模板号
            channel: '',//渠道
            appName: '',//包名
            pageName: '',//落地页号
            templateArr: [],//模板
            dataObj: {},//所有的数据
            config_num: [],//配置数
            names: null,//默认的名字格式
            logos: null,//默认的logo格式
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
        //获取模板及落地页号
        let urls = (this.props.history.location.search).substr(1);
        let urlObj = this.urlToObj(urls);
        console.log(urlObj);
        this.setState({
            urls: globalConfig.setApiUrl('/modles/modles3')+'?pageNum=' + urlObj.pageName +'&channelName=' + urlObj.channel + '&appName='+ urlObj.appName ,//表单目标地址
            modleNum: urlObj.modleNum,//模板号
            channel: urlObj.channel,//渠道
            appName: urlObj.appName,//包名
            pageName: urlObj.pageName,//落地页号
             
        })
        //获取表单所有的数据
        axios.post(globalConfig.setApiUrl('/editFile/editFile'),{
            'channel': urlObj.channel,//渠道
            'appName': urlObj.appName,//包名
            'pageNum': urlObj.pageName,//落地页号
        }).then((response)=>{
            this.setState({
                names: response.data.data.names,
                dataObj: response.data.data,
                logos: response.data.data.logos
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
                        <input type="text" name="modle_num" value={this.state.modleNum} disabled/>
                    </div>
                </div>
                <div className="pageNum">
                    <p>落地页编号：</p>
                    <div>
                        <input type="text" name="pageNum" autoComplete="off" required min="0"  value={this.state.pageName} disabled className="dis_input"/>
                    </div>
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
                                backgroundImage:this.state.dataObj.logo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.logo})`:''}}></i>
                            <input type="file" name="app_logo" autoComplete="off"/>
                        </div>
                    </div>
                </div>
                <div id="Distinguish_logo"  style={{display:this.state.logos === '2'?true:'none'}}>
                    <div className="android_logo">
                        <p>安卓的logo：</p>
                        <div>
                            <i style={{
                                height:this.state.dataObj.androidLogo?100:'',
                                width:this.state.dataObj.androidLogo?100:'',
                                backgroundImage:this.state.dataObj.androidLogo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.androidLogo})`:''}}
                            ></i>
                            <input type="file" name="android_logo" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="ios_logo">
                        <p>ios的logo：</p>
                        <div>
                            <i style={{
                                height:this.state.dataObj.iosLogo?100:'',
                                width:this.state.dataObj.iosLogo?100:'',
                                backgroundImage:this.state.dataObj.iosLogo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.iosLogo})`:''}}></i>
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
                        autoComplete="off"
                        required={this.state.names ==='1'?true:false}
                        />
                    </div>
                </div>
                <div className="Distinguish_appName" style={{display:this.state.names ==='2'?true:'none'}}>
                    <div className="android_appName">
                        <p>安卓-app名字：</p>
                        <div>
                            <input type="text" 
                            name="android_appName" 
                            defaultValue={this.state.dataObj.androidAppName} 
                            autoComplete="off"
                            required={this.state.names ==='2'?true:false}
                            />
                        </div>
                    </div>
                    <div className="ios_appName">
                        <p>ios-app名字：</p>
                        <div>
                            <input type="text" 
                            name="ios_appName" 
                            defaultValue={this.state.dataObj.iosAppName}
                            required={this.state.names ==='2'?true:false} 
                            autoComplete="off"
                            />
                        </div>
                    </div>
                </div>
                <div className="app_downNum">
                    <p>app下载人数：</p>
                    <div>
                        <input type="text" name="app_downNum" autoComplete="off" defaultValue={this.state.dataObj.app_downNum} required/>
                    </div>
                </div>
                <div className="android_version">
                    <p>安卓版本：</p>
                    <div>
                        <input type="text" name="android_version" autoComplete="off" defaultValue={this.state.dataObj.android_version} required/>
                    </div>
                </div>
                <div className="ios_version">
                    <p>ios版本：</p>
                    <div>
                        <input type="text" name="ios_version" autoComplete="off" defaultValue={this.state.dataObj.ios_version} required/>
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
                                        src={`${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.copyright_logo[index]}`}
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