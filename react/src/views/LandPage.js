import React,{Component} from 'react'; 
import axios from 'axios';
import { Card } from 'antd';
import globalConfig from '../config'
const { Meta } = Card;
/*==========================================*/ 

/*==========================================*/ 
// import {Route,Link} from 'react-router-dom'

export default class LandPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            templateArr: [],//模板
        }
    }

    newCeateFrom = (ev)=>{
        let templateNum = ev.target.title || ev.target.innerText;
        this.props.history.push('/newTemplate'+templateNum+'?templateId='+templateNum);
    }

    /*生命周期*/
    componentDidMount(){
        //获取所有的模板缩略图
        axios.get(globalConfig.setApiUrl('/newPage/newPageImg')).then((response) =>{
            // console.log(response.data);
            this.setState({
                templateArr: response.data
            })
        })
    } 
    render(){
        return (
           <div>
                {this.state.templateArr.map((item,index)=> {
                    return (
                        <Card
                            onClick={this.newCeateFrom.bind(this)}
                            hoverable
                            style={{ width: 240 ,display: 'inline-block',marginLeft: 15}}
                            key={item.id}
                            cover={<img title={item.id} alt="这是一张图片" src={`${globalConfig.setApiUrl('/')}${item.img}`}/>}
                        >
                            <Meta 
                                description={item.id}
                                style={{textAlign: 'center',fontSize: 18}}
                            />
                        </Card>
                        )
                })}
           </div>
        )
    }
}