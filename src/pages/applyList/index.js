import React, { Component } from 'react'
import { connect } from 'dva';
import { Modal,Progress,Button,TextareaItem } from 'antd-mobile';
import router from 'umi/router';
import { createForm } from 'rc-form';
import Styles from './index.less';
import { illDate } from '../../utils/illDate'
import { getQueryString } from '../../utils/tools'

@connect(({ applyList }) => ({ applyList }))
class ApplyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step:1
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        const { illData } = this.props.applyList;
        //如果没有值就跳回第一步
        if(illData.length == 0){
            router.push('./applyList?step=1')
        }
        let step = getQueryString('step') || '';
        //如果没有参数就跳回第一步
        if(step == ''){
            router.push('./applyList?step=1')
        }
        console.log('step', step)

        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illDate.ill1
            }
        })

        //监听路由变化
        this.props.history.listen((history) => {
            if( history.pathname == '/applyList' ){
                let step =  parseInt( history.query.step ) ;
                // this.setState({
                //     step: step
                // })

                dispatch({
                    type:'applyList/setData',
                    payload:{
                        step: step
                    }
                })
            }
        })


    }
    //选择答案
    chooseAnswer(e){
        const { illData, step } = this.props.applyList;
        const { dispatch } = this.props;
        // const { step } = this.state;
        let answer = e.target.getAttribute('data-answer');
        let showInput = e.target.getAttribute('data-showinput');
        console.log('answer',answer)
        console.log('showInput',showInput)

        illData[step-1].choose = answer;

        if( showInput == 'true' ){
            illData[step-1].isShowInput = true
        }else{
            illData[step-1].isShowInput = false
        }

        console.log('illData',illData)
        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illData
            }
        })
    }
    //输入框填写
    onChangeInput(val){
        console.log('val',val)
        const { illData, step } = this.props.applyList;
        const { dispatch } = this.props;

        illData[step-1].inputValue = val;

        dispatch({
            type:'applyList/setData',
            payload:{
                illData: illData
            }
        })
    }
    //下一步
    step(){
        let { illData, step } = this.props.applyList;
        const { dispatch } = this.props;
        // let step = this.state.step;
        step++;

        if(step > illData.length ){
            router.push('./patientDescribe')
            return
        }

        router.push('./applyList?step=' + step )
        // this.setState({
        //     step:step
        // })
        dispatch({
            type:'applyList/setData',
            payload:{
                step: step
            }
        })

    }


    render() {
        // const { step } = this.state;
        const { getFieldProps } = this.props.form;
        const { illData, step } = this.props.applyList;

        //百分比
        let percentage = ( step / illData.length * 100 ).toFixed(1);

        return (
            <div className={Styles.apply_list}>
                {
                    illData && illData.length > 0 ? <div>
                        <div className={Styles.apply_percent}>
                            <p className={Styles.apply_rate}>已填写{ percentage }%</p>
                            <Progress  className={Styles.percent} percent={ percentage } />
                        </div>
                        <div className={Styles.apply_choose}>
                            <p className={Styles.choose_title}>{ illData[step-1].question }</p>
                            <div className={Styles.choose_contetn}>
                                {
                                    illData[step-1].answer.map((item,index)=>{
                                        if(item.name == illData[step-1].choose){
                                            return(
                                                <div key={index}
                                                     className={`${Styles.choose_dot} ${Styles.choose_dot_select}`}
                                                     data-answer={item.name}
                                                     data-showinput={item.showInput}
                                                     onClick={(e)=>{this.chooseAnswer(e)}}
                                                >
                                                    {item.title}
                                                    <img className={Styles.item_select} src={require('../../assets/time_select.png')} alt=""/>
                                                </div>
                                            )
                                        }else{
                                            return(
                                                <div key={index}
                                                     className={Styles.choose_dot}
                                                     data-answer={item.name}
                                                     data-showinput={item.showInput}
                                                     onClick={(e)=>{this.chooseAnswer(e)}}
                                                >{item.title}</div>
                                            )
                                        }
                                    })
                                }
                            </div>
                            {
                                illData[step-1].isInput && illData[step-1].isShowInput ? <div>
                                    <p className={Styles.choose_title}>{ illData[step-1].title }</p>
                                    <TextareaItem
                                        {...getFieldProps(`${illData[step-1].key}`,{
                                            initialValue: illData[step-1].inputValue
                                        })}
                                        autoHeight
                                        placeholder={ illData[step-1].title }
                                        className={Styles.choose_input}
                                        onChange={(val)=>{this.onChangeInput(val)}}
                                    />
                                </div>: ''
                            }

                        </div>
                        <div className={Styles.apply_btn}>
                            {
                                illData[step-1].choose && !illData[step-1].isInput
                                ||
                                illData[step-1].choose && illData[step-1].isInput && !illData[step-1].isShowInput
                                ||
                                illData[step-1].choose && illData[step-1].isInput && illData[step-1].isShowInput && illData[step-1].inputValue
                                    ?
                                    <Button className={Styles.btn} onClick={()=>{this.step()}} >下一步</Button>
                                    :
                                    <Button className={Styles.btn_disabled} >下一步</Button>
                            }
                        </div>
                    </div> : ''
                }
            </div>
        )
    }
}
export default createForm()(ApplyList);