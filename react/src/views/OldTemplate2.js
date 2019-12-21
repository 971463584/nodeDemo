import React,{Component} from 'react'; 


import '../css/template.css';
import axios from 'axios';
/*===============================================*/ 
import globalConfig from '../config'
/*===============================================*/ 
export default class OldTemplate2 extends Component{
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
            chapter_num: [],//章节数
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
        //获取模板及落地页号
        let urls = (this.props.history.location.search).substr(1);
        let urlObj = this.urlToObj(urls);
        console.log(urlObj);
        this.setState({
            urls: globalConfig.setApiUrl('/modles/modles2')+'?pageNum=' + urlObj.pageName +'&channelName=' + urlObj.channel + '&appName='+ urlObj.appName ,//表单目标地址
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
                dataObj: response.data.data,
                logos: response.data.data.logos,
                names: response.data.data.names
            })
             //配置数组
             let configs = response.data.data.config_num || response.data.data.app_hostname.length;
             for(let i = 0; i < configs;i++){
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
                        <input type="text" name="modle_num" value={this.state.modleNum} disabled/>
                    </div>
                </div>
                <div className="pageNum">
                    <p>落地页编号：</p>
                    <div>
                        <input type="text" name="pageNum" value={this.state.pageName} autoComplete="off" disabled className="dis_input"/>
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
                                backgroundImage:this.state.dataObj.logo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.logo})`:''}}
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
                                backgroundImage:this.state.dataObj.androidLogo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.androidLogo})`:''}}
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
                                backgroundImage:this.state.dataObj.iosLogo?`url(${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.iosLogo})`:''}}
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
                        defaultValue={this.state.dataObj.appNames} 
                        autoComplete="off"/>
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
                        <img src={` ${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.cover}`} alt=""/>
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
                                        src={`${globalConfig.setApiUrl('/pages')}/${this.state.channel}/${this.state.appName}/${this.state.pageName}/imgs/${this.state.dataObj.copyright_logo[index]}`}
                                        alt="这是一张图片"
                                        onError={this.checkError.bind(this)}
                                        />
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