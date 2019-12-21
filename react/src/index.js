import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css'; 
import { BrowserRouter as Router,
  Route,
  Switch
 } from 'react-router-dom';
import Channel from './views/Channel';
import AppName from './views/AppName';
import LandPage from './views/LandPage';
import HistoryPage from './views/HistoryPage';
import NewTemplate1 from './views/NewTemplate1';
import OldTemplate1 from './views/OldTemplate1';
import CopyTemplate1 from './views/CopyTemplate1';
import NewTemplate2 from './views/NewTemplate2';
import OldTemplate2 from './views/OldTemplate2';
import CopyTemplate2 from './views/CopyTemplate2';
import NewTemplate3 from './views/NewTemplate3';
import OldTemplate3 from './views/OldTemplate3';
import CopyTemplate3 from './views/CopyTemplate3';
import NewHost from './views/NewHost';
import HostList from './views/HostList';
import EditHost from './views/EditHost';
import { Layout, Menu, Icon } from 'antd';
import './index.css';
import axios from '../node_modules/axios';
import globalConfig from './config'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
class Indexs extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      num : '1',
      arr : [],
    }
  }

  //新建渠道
  channelBtns = ()=>{
    this.props.history.push('/channel');
  }
  //新建包名
  appNameBtns = ()=>{
    this.props.history.push('/appName');
  }
  //新建落地页
  landPageBtns = ()=>{
    this.props.history.push('/landPage');
  }
  //新建历史落地页
  historyBtns = ()=>{
    this.props.history.push('/historyPage');
    console.log(this.state.arr)
  }

  //新建域名
  newHostBtns = ()=>{
    this.props.history.push('/newHost');

  }
  //域名列表
  hostListBtns = ()=>{
    this.props.history.push('/hostList');
  }
  //编辑域名
  editHostBtns = ()=>{
    this.props.history.push('/editHost');
  }
  componentDidMount(){
    // this.props.history.push('/landPage')
    //拿到渠道
    axios.get(globalConfig.setApiUrl('/newPageName/getChannel')).then(response1 => {
      console.log(response1.data);
      //拿到包名
      for(let i = 0 ; i <response1.data.length; i++){
          axios.get(globalConfig.setApiUrl('/newChannel/selectObj'),{
            params: {
              select_text: response1.data[i]
            }
          }).then(response => {
            // console.log(response.data);
            let obj = {
              a: response1.data[i],
              b: response.data
            }
            this.setState({
              arr: [...this.state.arr, obj]
            })
            console.log(this.state.arr)
          })
      }
        
    })
  }

  render(){
    return(
      <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" selectedKeys={`${this.props.history.location.pathname}`}>
              <Menu.Item key="/channel" onClick={this.channelBtns.bind(this)}>
                <Icon type="control" />
                <span className="nav-text">新建渠道</span>
              </Menu.Item>
              <Menu.Item key="/appName" onClick={this.appNameBtns.bind(this)}>
                <Icon type="folder" />
                <span className="nav-text">新建包名</span>
              </Menu.Item>
              <Menu.Item key="/landPage" onClick={this.landPageBtns.bind(this)}>
                <Icon type="book" />    
                <span className="nav-text">新建落地页</span>
              </Menu.Item>
              <SubMenu
                key="/historyPage"
                title={
                  <span>
                    <Icon type="calendar" />
                    <span>查看历史落地页</span>
                  </span>
                }
              >
              {this.state.arr.map((item1,index1)=>{
                return (
                  <SubMenu key={index1} title={item1.a}>
                    {item1.b.map((item2,index2)=>{
                      return (<Menu.Item key={`${item1.a}/${item2}`} onClick={ ev => this.props.history.push(  '/historyPage?path=/'+ev.key  )}>{item2}</Menu.Item>)
                    })}
                  </SubMenu>
                )
              })}
              </SubMenu>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    <span>域名管理</span>
                  </span>
                }
              >
              <Menu.Item key="/newHost" onClick={this.newHostBtns.bind(this)}>新建域名</Menu.Item>
              <Menu.Item key="/hostList" onClick={this.hostListBtns.bind(this)}>域名列表</Menu.Item>
              <Menu.Item key="/editHost" onClick={this.editHostBtns.bind(this)}>编辑域名</Menu.Item>
            </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header className="header" style={{ background: '#fff', padding: 0 }} >落地页模板管理</Header>
            <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', maxHeight: 760, minHeight: 760, position: 'relative',overflowY:'auto'}}>
              <Switch>
              <Route path="/channel" component={Channel}></Route>{/*新建渠道*/}
              <Route path="/appName" component={AppName}></Route>{/*新建包名 */}
              <Route path="/landPage" component={LandPage}></Route>{/*新建落地页 */}
              <Route path="/historyPage" component={HistoryPage}></Route>查看历史落地页
              <Route path="/newTemplate1" component={NewTemplate1}></Route>{/*new模板1 */}
              <Route path="/oldTemplate1" component={OldTemplate1}></Route>{/*old模板1*/}
              <Route path="/newTemplate2" component={NewTemplate2}></Route>{/*new模板2 */}
              <Route path="/oldTemplate2" component={OldTemplate2}></Route>{/*old模板2 */}
              <Route path="/newTemplate3" component={NewTemplate3}></Route>{/*new模板3 */}
              <Route path="/oldTemplate3" component={OldTemplate3}></Route>{/*old模板3 */}
              <Route path="/copyTemplate1" component={CopyTemplate1}></Route>{/*old模板2 */}
              <Route path="/copyTemplate2" component={CopyTemplate2}></Route>{/*new模板3 */}
              <Route path="/copyTemplate3" component={CopyTemplate3}></Route>{/*old模板3 */}
              <Route path="/newHost" component={NewHost}></Route>{/*新建域名*/}
              <Route path="/hostList" component={HostList}></Route>{/*域名列表*/}
              <Route path="/editHost" component={EditHost}></Route>{/*修改域名*/}
              </Switch>
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
          </Layout>
          </Layout>
    )
  }
}
ReactDOM.render(
  
  <Router>
  <Route path="/" component={Indexs}></Route>
</Router>
,document.getElementById('root'));