import React, { Component } from 'react'
import { connect } from 'dva';
import { createForm } from 'rc-form';
import Styles from './index.less';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

@connect(({ login }) => ({ login }))
class Informed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timestamp:''
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        //生成签名时间戳
        let timestamp = (Date.parse(new Date()) / 1000).toString();
        this.setState({
            timestamp:timestamp,
        })
        //获取appid和签名
        // dispatch({
        //     type:'patientDescribe/getAppid',
        //     payload:{
        //         noncestr: nonceStr,
        //         timestamp: timestamp,
        //         url: pageURL + '/agreement'
        //     },
        //     callback: this.getAppidCallback.bind(this)
        // })
        //顶部进度条关闭
        NProgress.done()
    }
    componentWillUnmount(){
        //顶部进度条开启
        NProgress.start()
    }
    //获取appidcallback
    getAppidCallback(response){
        const { timestamp } = this.state;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.app_id, // 必填，公众号的唯一标识
            timestamp: timestamp , // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名
            jsApiList: ['chooseImage','uploadImage','hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表
        });
        wx.ready(function(){
            wx.hideAllNonBaseMenuItem();
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
    }

    render() {

        return (
            <DocumentTitle title='知情同意书'>
                <div className={Styles.agree}>
                    <div className={Styles.agree_name}>
                        互联网诊疗风险告知及知情同意书
                    </div>
                    <div className={Styles.agree_title}>
                        一、互联网诊疗服务规范及风险告知
                    </div>
                    <div className={Styles.agree_section}>
                        1.根据《互联网诊疗管理办法（试行）》、《互联网医院管理办法（试行）》、《远程医疗服务管理办法（试行）》等法规的要求，患者应知晓互联网诊疗相关的执业规则并接受风险告知和签署知情同意书。
                    </div>
                    <div className={Styles.agree_section}>
                        2.互联网医院开展部分常见病、慢性病复诊时，医师应当掌握患者病历资料，确定已有明确诊断后，针对相同诊断进行复诊并开具处方。互联网医院<span>可以委托第符合条件的第三方机构配送药品，可以开展远程医疗服务。(待定) </span>
                    </div>
                    <div className={Styles.agree_section}>
                        3.互联网医院不能开具麻醉药品、精神类药品处方，以及其他用药风险较高，有其他特殊管理规定的药品处方。为6岁以下的儿童开具用药处方时，应当有监护人和相关专业医师陪伴。
                    </div>
                    <div className={Styles.agree_section}>
                        4.互联网医院不能直接进行体格检查和实施检查、检验等诊查手段，一旦医生认为患者出现病情变化且需要医务人员亲自诊查时，或复诊疾病属于疑难杂症、出现急症等情形时，医生有权终止本次诊疗活动，患者应积极配合到实体医疗机构就诊。
                    </div>
                    <div className={Styles.agree_section}>
                        5.<span>互联网医院可以提供药品配送相关的服务，但实际服务提供方为合作第三方。相关的服务质量和售后保障由第三方负责。当发生不良事件时，患者应积极上报。（待定）</span>
                    </div>
                    <div className={Styles.agree_section}>
                        6.<span>互联网医院可以为患者提供“互联网+”家庭医生签约服务或远程医疗服务。患者应遵守相关的服务流程和约定。（待定）</span>
                    </div>
                    <div className={Styles.agree_section}>
                        7.<span>患者应妥善保管信息，不得非法买卖和泄露信息，并在发现信息泄露时，积极上报。</span>
                    </div>
                    <div className={Styles.agree_title}>
                        二、互联网诊疗、远程医疗服务潜在风险告知及对策
                    </div>
                    <div className={Styles.agree_section}>
                        1.接受互联网诊疗、<span>远程医疗服务</span>可能出现潜在风险，有些不常见的风险未能一一列出，如果患者有疑问应与医生讨论。
                    </div>
                    <div className={Styles.agree_section}>
                        2.受限于互联网诊疗本身的局限性（如医生不能面诊、触诊等，无法通过相关的诊查手段及检查、检验结果准确判断病情的进展），医生给出的本次诊疗方案、健康管理方案、<span>远程医疗方案</span>依赖于患者所上传的资料和描述的症状，以及既往的病历资料、临床诊断。如前述信息不准确或不全面，将对本次诊疗方案的合理制定产生一定的影响。
                    </div>
                    <div className={Styles.agree_section}>
                        3.由于疾病本身的特殊性和复杂性，患者本身的体质状况，及现有医疗水平条件的限制等，都存在可能发生各种并发症和危害自身生命健康的意外风险。
                    </div>
                    <div className={Styles.agree_section}>
                        4.由于疾病本身的复杂性，以及诊疗措施疗效出现的延后性，诊疗方案、健康管理方案、<span>远程医疗方案</span>可能不会达到患者期许的效果，且有些疾病或并发症是不可根治的，需要患者积极配合，长期坚持治疗，才能延缓疾病的进展。医生已经尽力为患者制定合理的方案，致力减少药物治疗不良反应的发生，但不可能完全避免，且不可预测，需要在患者的配合下，并根据临床情况不断调整方案。
                    </div>
                    <div className={Styles.agree_section}>
                        5.疾病的治愈需要患者谨遵医嘱、健康管理方案，并积极配合。如果患者未完全遵守和配合，则可能导致诊疗效果不理想，甚至出现病情反复、恶化等不良后果。
                    </div>
                    <div className={Styles.agree_section}>
                        6.<span>配送药品可能受到物流时效的影响，导致患者延时服用药物，或患者正在用药物或者手术等治疗其他疾病，也可能存在延时用药、联合用药等风险。</span>
                    </div>
                    <div className={Styles.agree_section}>
                        7.患者自采药品的品牌、规格、性状、使用方式等可能影响本次诊疗方案的效果，同时还可能出现危害生命健康的风险。
                    </div>
                    <div className={Styles.agree_section}>
                        8.医生主要解决本专业领域的医疗问题，非本专业的疾病需要到其它专业科室进行诊治或接受远程医疗服务。
                    </div>
                    <div className={Styles.agree_section}>
                        9.互联网医院对患者的信息按要求采取了保密措施，但泄密的可能性依然不能完全消除。
                    </div>
                    <div className={Styles.agree_section}>
                        10.患者同意并授权医院在不泄露个人信息资料的前提下，对个人信息数据库进行医学分析及大数据信息收集。
                    </div>
                    <div className={Styles.agree_title}>
                        三、患者知情同意确认
                    </div>
                    <div className={Styles.agree_section}>
                        1.<span>患者确认在互联网医院上问诊的疾病，已经在实体医疗机构明确诊断，（这条要不要删除？）</span>患者需提供真实、及时、完整和合法有效的资料，若提供的资料信息并非真实、完整、有效，医院有权停止、冻结用户并要求用户承担因此造成的法律后果。
                    </div>
                    <div className={Styles.agree_section}>
                        2.患者确认既往发生过与本次发病类似的常见病、慢性病病症，并曾经在实体医院诊疗，但现在无法提供与本次病症相关的检诊资料。
                    </div>
                    <div className={Styles.agree_section}>
                        3.<span>患者确认愿意接受医生根据诊疗经验为患者安排的远程医疗服务。</span>
                    </div>
                    <div className={Styles.agree_section}>
                        4.患者应当遵循本协议的约定发表言论、提供信息，对以下几类问题医务人员有权不予回复：
                    </div>
                    <div className={Styles.agree_section}>
                        (1)非医疗健康类问题，如涉黄、涉赌、涉毒、社会意识形态等问题；
                    </div>
                    <div className={Styles.agree_section}>
                        (2) 胎儿性别鉴定问题；
                    </div>
                    <div className={Styles.agree_section}>
                        (3) 可能危害他人、自己或社会安全的问题；
                    </div>
                    <div className={Styles.agree_section}>
                        (4) 渲染悲愤、误导他人的问题；
                    </div>
                    <div className={Styles.agree_section}>
                        (5) 其它有伤社会风化等其他甲方或医务人员认为有必要予以禁止的问题；
                    </div>
                    <div className={Styles.agree_section}>
                        (6) 医疗司法举证或询证问题；
                    </div>
                    <div className={Styles.agree_section}>
                        (7) 追问医务人员个人信息；
                    </div>
                    <div className={Styles.agree_section}>
                        (8) 故意挑逗、侮辱医务人员的提问。
                    </div>
                    <div className={Styles.agree_section}>
                        5.线上医疗服务受医生时间、空间及网络环境所限，可能无法为用户提供实时服务。如果就诊人身体出现紧急情况，应尽快到合适的医院就诊，不应该选择线上医疗服务。危急场合就诊人（或监护人）应该马上拨打急救电话，避免出现人身伤亡等情况。
                    </div>
                    <div className={Styles.agree_section}>
                        6.<span>线上医疗服务只针对常见病、慢性病患者，并且已经在院内实际有过就诊记录的患者，提供咨询服务。（两个app都提到了这点，是不是对首诊患者也不可以提供咨询服务？）</span>
                    </div>
                    <div className={Styles.agree_section}>
                        7.患者在使用线上医疗服务过程中的言行需遵守国家法律、法规等规范性文件及医院的各项规则和要求，不违背社会公共利益或公共道德，不损害他人的合法权益，不违反本协议所列条款议。
                    </div>
                    <div className={Styles.agree_section}>
                        8.患者如在接受本APP提供的服务过程中实施不正当行为，医院有权终止服务，由此造成的法律和经济后果由用户承担，不正当行为包含但不限于以下方面：
                    </div>
                    <div className={Styles.agree_section}>
                        (1)有发布医托、强烈广告性质的内容的行为；
                    </div>
                    <div className={Styles.agree_section}>
                        (2)从中国境内向外传输技术性资料时违背中国有关法律法规行为；
                    </div>
                    <div className={Styles.agree_section}>
                        (3)使用本服务从事洗钱、窃取商业秘密等非法用途；
                    </div>
                    <div className={Styles.agree_section}>
                        (4)以包括但不限于盗用他人账号、恶意编造或虚构信息、恶意投诉、未经允许进入他人电脑或手机系统等方式干扰或扰乱本服务；
                    </div>
                    <div className={Styles.agree_section}>
                        (5)有传输非法、骚扰性、影射或中伤他人、辱骂性、恐吓性、伤害性、庸俗、带有煽动性、可能引起公众恐慌、淫秽的、散播谣言等信息资料的行为；
                    </div>
                    <div className={Styles.agree_section}>
                        (6)有传输教唆他人构成犯罪行为、危害社会治安、侵害自己或他人人身安全的资料，传输助长国内不利条件和涉及国家安全的资料，传输不符合当地法规、国家法律和国际法律的资料的行为；
                    </div>
                    <div className={Styles.agree_section}>
                        (7)有发布涉及政治、性别、种族歧视或攻击他人的文字、图片或语言等信息；
                    </div>
                    <div className={Styles.agree_section}>
                        (8) 有其他发布违法信息、严重违背社会公德、违背本协议或补充协议、违反法律禁止性规定的行为。
                    </div>
                    <div className={Styles.agree_section}>
                        9.患者确认已经知晓并同意以上内容，理解相关的风险，愿意接受互联网医院的服务以及接受疾病诊疗服务，并签署知情同意书。
                    </div>
                    <div className={Styles.agree_section}>
                        10.患者确认未得到服务结果会百分之百成功的许诺。
                    </div>
                    <div className={Styles.agree_section}>
                        11.<span>您同意您的诊疗内容在去除姓名、头像、出生日期等信息后将设置为默认展示，医生给您的指导建议同时也会帮助其他相似情况的患者。（这个有没有？）</span>
                    </div>


                </div>
            </DocumentTitle>
        )
    }
}
export default Informed;
