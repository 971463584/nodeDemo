import React,{Component} from 'react'; 
import { Card, Icon,Modal } from 'antd';
import axios from 'axios';
import globalConfig from '../config'

import DropDown from '../component/DropDown'
const { Meta } = Card;
const { confirm } = Modal;

/*===============================================*/ 

/*===============================================*/ 
export default class HistoryPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            templateArr: [],//模板
            colors: [],//更新颜色
            channelVal: '',//渠道
            appNameVal: '',//包名
            pageNameVal: '',//落地页
        }
    }
    
    //查看
    lookPage(channel,appName,pageName){
        const w=window.open('about:blank');
        w.location.href=globalConfig.setApiUrl('/pages/')+channel+'/'+appName+'/'+pageName+'/index.html';
    }
    //修改
    editPage = (id,channel,appName,pageName) =>{
        this.props.history.push('/OldTemplate'+id+'?modleNum='+id+'&channel='+channel+"&appName="+appName+"&pageName="+pageName);
        
    }
    //删除
    delPage(channel,appName,pageName){
        confirm({
            title: '你确定要删除该落地页文件吗?',
            content: globalConfig.setApiUrl('/pages/')+channel+'/'+appName+'/'+pageName+'文件',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                axios.post(globalConfig.setApiUrl('/delFile/delFile'),{
                    channel: channel,
                    appName: appName,
                    pageNum: pageName,
                })
                window.location.reload(true);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    //更新
    updataPage = (id,channel,appName,pageName) =>{
        let urls='';
        if(id === 1){
            urls=globalConfig.setApiUrl('/modles/modles')
        }else if(id === 2){
            urls=globalConfig.setApiUrl('/modles/modles2')
        }else if(id === 3){
            urls=globalConfig.setApiUrl('/modles/modles3')
        }
        axios.post(urls,{
            channel: channel,
            appName: appName,
            pageNum: pageName,
        }).then((response)=>{
            if(response.data === 'ok'){
                confirm({
                    title: '现在已经是最新的版本了',
                    okText: '好的',
                    okType: 'danger',
                    onOk(){
                        window.location.reload(true);
                    }
                })
            }
        })
    }

    getChannelVal(val){
        this.setState({
            channelVal: val,//渠道
        })
    }
    getAppNameVal(val){
        console.log(val)
        this.setState({
            appNameVal: val,//包名
        })
    }
    getpageNameVal(val){
        console.log(val)
        this.setState({
            pageNameVal: val,//落地页
        })
    }
    
    
    //复制
    copyPage = (id,channel,appName,pageName)=>{
        let _this = this
        // this.props.history.push('/copyTemplate'+id+'?modleNum='+id+'&channel='+channel+"&appName="+appName+"&pageName="+pageName);
        confirm({
            title: '请输入你要复制到的渠道包名及落地页号',
            content: <DropDown 
                            channelVal={this.getChannelVal.bind(this)} 
                            appNameVal={this.getAppNameVal.bind(this)}
                            pageNameVal={this.getpageNameVal.bind(this)}
                            />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                axios.post(globalConfig.setApiUrl('/historyDirectory/copyPage'),{
                    newChannel: _this.state.channelVal,
                    newAppName: _this.state.appNameVal,
                    newPageName: _this.state.pageNameVal,
                    oldChannel: channel,
                    oldAppName: appName,
                    oldPageName: pageName
                })
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }

    //生命周期
    UNSAFE_componentWillReceiveProps (){
        if(this.props.history.location.search !== ''){
            let paths = this.props.history.location.search.split('=');
            console.log(paths[paths.length-1]);
            axios.get(globalConfig.setApiUrl('/historyDirectory/historyDirectory'),{
                params: {
                    paths: paths[paths.length-1]
                }
            }).then(response => {
                console.log(response.data)
                this.setState({
                    templateArr: response.data
                })
            });
        }
    }
    render(){
        return (
            <div>
                {this.state.templateArr.map((item,index)=>{
                    return (
                        <Card
                            key={index+1}
                            style={{ width: 300,display: 'inline-block',marginRight: 20,marginBottom: 20 }}
                            cover={
                            <img
                                alt="这是一张图片"
                                title={item.id}
                                src={`${globalConfig.setApiUrl('/pages')}/${item.channel}/${item.appName}/${item.lodiy}/remove.jpeg`}
                            />
                            }
                            actions={[
                            <Icon type="eye" key="eye" onClick={(ev)=>this.lookPage(item.channel,item.appName,item.lodiy,ev)}/>,
                            <a target="_blank" href={'/OldTemplate'+item.id+'?modleNum='+item.id+'&channel='+item.channel+"&appName="+item.appName+"&pageName="+item.lodiy}><Icon type="edit" key="edit" /></a>,
                            // <Icon type="edit" key="edit" onClick={(ev)=>this.editPage(item.id,item.channel,item.appName,item.lodiy,ev)}/>,
                            <Icon type="copy" key="copy" onClick={(ev)=>this.copyPage(item.id,item.channel,item.appName,item.lodiy,ev)}/>,
                            <Icon type="file-excel" key="file-excel" onClick={(ev)=>this.delPage(item.channel,item.appName,item.lodiy,ev)}/>,
                            <Icon type="interaction" theme={this.state.colors[index]} key="cloud-sync" onClick={(ev)=>this.updataPage(item.id,item.channel,item.appName,item.lodiy,ev)}/>
                            ]}
                        >
                            <Meta
                            description={`${item.channel}/${item.appName}/${item.lodiy}`}
                            />
                        </Card>
                    )
                })}
            </div>
         )
    }
}
