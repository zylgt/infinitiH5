import React, { Component } from 'react'
import { connect } from 'dva';
import { createForm } from 'rc-form';
import Styles from './index.less';
import { nonceStr } from '../../utils/tools'
import DocumentTitle from 'react-document-title'
import wx from 'weixin-js-sdk';
import { pageURL } from '../../utils/baseURL'

@connect(({ login }) => ({ login }))
class Agreememt extends Component {
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
            <DocumentTitle title='服务协议'>
                <div className={Styles.agree}>
                    <div className={Styles.agree_name}>
                        天津医科大学朱宪彝纪念医院互联网医院服务协议
                    </div>
                    <div className={Styles.agree_title}>
                        接受条款
                    </div>
                    <div className={Styles.agree_section}>
                        您的信任对我们非常重要，我们深知个人信息安全的重要性，我们将会按照法律法规要求，采取安全保护措施保护您的个人信息安全 。鉴此，天津医科大学朱宪彝纪念医院互联网医院（或简称“我们”、“医院”）制定本《隐私权政策》并提醒您：
                    </div>
                    <div className={Styles.agree_section}>
                        本政策适用于天津医科大学朱宪彝纪念医院互联网医院平台的服务。请您注意，本政策不适用于以下情况：
                    </div>
                    <div className={Styles.agree_section}>
                        1、通过我们的服务或产品接入的第三方服务 （包括任何第三方网站）收集的信息；
                    </div>
                    <div className={Styles.agree_section}>
                        2、通过在我们的服务或产品中进行广告服务的其他公司或机构所收集的信息。
                    </div>
                    <div className={Styles.agree_section}>
                        请您在使用平台的各项服务前，务必仔细阅读并透彻理解本政策，特别是以粗体标识的条款，您应重点阅读，在确认充分理解并同意后再开始使用。在任何情况下，您的使用行为将被视为对本政策全部内容的认可。
                    </div>
                    <div className={Styles.agree_title}>
                        第一部分 定义
                    </div>
                    <div className={Styles.agree_section}>
                        天津医科大学朱宪彝纪念医院互联网医院平台服务提供者：指天津九安医疗电子股份有限公司。
                    </div>
                    <div className={Styles.agree_section}>
                        用户：指注册使用天津医科大学朱宪彝纪念医院互联网医院平台服务的使用人，在本政策中更多地称为“您”或“用户”。
                    </div>
                    <div className={Styles.agree_section}>
                        个人信息：指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
                    </div>
                    <div className={Styles.agree_section}>
                        个人敏感信息：指包括身份证件号码、个人生物识别信息、银行账号、财产信息、行踪轨迹、交易信息、14岁以下（含）儿童信息等的个人信息（我们将在本隐私权政策中对具体个人敏感信息以粗体进行显著标识）。
                    </div>
                    <div className={Styles.agree_section}>
                        个人信息删除：指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。
                    </div>
                    <div className={Styles.agree_section}>
                        儿童：指不满十四周岁的未成年人。
                    </div>
                    <div className={Styles.agree_title}>
                        第二部分 隐私权政策
                    </div>
                    <div className={Styles.agree_section}>
                        本隐私权政策部分将帮助您了解以下内容：
                    </div>
                    <div className={Styles.agree_section}>
                        一、如何收集和使用您的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        二、如何共享、转让、公开披露您的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        三、如何保护您的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        四、如何处理未成年人的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        五、本政策如何更新
                    </div>
                    <div className={Styles.agree_section}>
                        六、如何联系
                    </div>
                    <div className={Styles.agree_title}>
                        一、如何收集和使用您的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        我们会为实现本政策所述的以下功能，收集和使用您的个人信息：
                    </div>
                    <div className={Styles.agree_title}>
                        （一）为您提供注册与认证功能
                    </div>
                    <div className={Styles.agree_section}>
                        您需要注册一个账户，以便于我们为您提供服务。当您注册时，请您至少提供手机号码、密码，我们将通过发送短信验证码的方式验证您的身份是否有效。
                    </div>
                    <div className={Styles.agree_section}>
                        您的登录名为您的手机号，我们将隐藏您手机号中间的7位数字。
                    </div>
                    <div className={Styles.agree_section}>
                        您需要向我们提供真实姓名和有效身份证件（包括但不限于身份证、医保卡）的号码、生物识别特征（静态或动态的面部特征），以便于我们进行实名（实人）认证。如果您不提供这些信息，可能会影响您对天津医科大学朱宪彝纪念医院互联网医院平台部分核心业务功能的正常使用，如预约挂号等，但不会影响您进行基本的浏览、搜索。
                    </div>
                    <div className={Styles.agree_title}>
                        （二）为您提供产品/服务信息展示与定向推送功能
                    </div>
                    <div className={Styles.agree_section}>
                        为向您提供更契合您需求的页面展示和搜索结果、了解产品适配性、识别账号异常状态，预防交易和资金风险，最终保障向您提供安全稳定的服务，我们会收集关于您使用的服务以及使用方式的信息并将这些信息进行关联，这些信息包括：
                    </div>
                    <div className={Styles.agree_section}>
                        设备信息：我们会根据您在软件安装及使用中授予的具体权限，接收并记录您所使用的设备相关信息（例如设备型号、操作系统版本、设备设置、唯一设备标识符等软硬件特征信息）、设备所在位置相关信息（例如IP 地址、GPS位置以及能够提供相关信息的Wi-Fi 接入点、蓝牙和基站等传感器信息）。
                    </div>
                    <div className={Styles.agree_section}>
                        日志信息：当您使用我们的网站或客户端提供的服务或产品时，我们会自动收集您对我们服务的详细使用情况，作为有关网络日志保存。例如您的搜索查询内容、IP地址、浏览器的类型、电信运营商、使用的语言、访问日期和时间及您访问的网页记录等。
                    </div>
                    <div className={Styles.agree_section}>
                        如您不同意收集记录前述信息，我们可能无法完成风控验证。
                    </div>
                    <div className={Styles.agree_section}>
                        请注意，单独的设备信息、日志信息等是无法识别特定自然人身份的信息。如果我们将这类非个人信息与其他信息结合用于识别特定自然人身份，或者将其与个人信息结合使用，则在结合使用期间，这类非个人信息将被视为个人信息，除取得您授权或法律法规另有规定外，我们会将该类个人信息做匿名化、去标识化处理。
                    </div>
                    <div className={Styles.agree_title}>
                        （三）为您提供问诊、健康咨询功能
                    </div>
                    <div className={Styles.agree_section}>
                        当您使用我们的产品或服务提供的问诊功能，在问诊过程中，我们可能会申请开启您的位置信息（地理位置）、相机/摄像头、麦克风（语音）、通讯录以及存储的相关权限；同时可能要求您提供病症、住院志、医嘱单、检验报告、手术及麻醉记录、护理记录、用药记录、药物食物过敏信息、生育信息、以往病史、诊治情况、家族病史、现病史、传染病史及其他个人健康生理信息，以及个人身体健康状况产生的体重、身高、肺活量和其他相关信息，用于患者病情的诊断。另外，我们可能会收集您在使用我们服务过程中产生的健康咨询详情（包括但不限于图片、文字、视频、语音）、预约挂号记录、检查检验、用药处方、医生诊断结果等信息，用于向您展示及便于您对信息进行管理。
                    </div>
                    <div className={Styles.agree_section}>
                        您可以通过天津医科大学朱宪彝纪念医院互联网医院平台为其他人进行预约或咨询等服务，您需要提供该实际用户的前述个人信息。在提供该实际用户的前述个人信息之前，您需确保您已经取得其授权同意，其中涉及儿童个人信息的，您需在提供前征得对应儿童监护人的同意。
                    </div>
                    <div className={Styles.agree_title}>
                        （四）为您提供购物功能
                    </div>
                    <div className={Styles.agree_section}>
                        当您在我们的产品及/或服务中订购相应的医疗服务和健康商城商品或服务时，我们可能会收集您的交易信息、记录，包括您所购买的商品及/或服务信息、具体订单号、订单创建时间、您应支付的金额，我们收集这些信息是为了帮助您顺利完成交易、保障您的交易安全、查询订单信息。其中，如您购买健康商城商品的，在下单过程中,您需至少提供您的收货人姓名、收货地址、收货人联系电话；您可以通过健康商城为其他人订购商品及/或服务，但需提供该实际收货人的前述个人信息，且需确保您已经取得其授权同意。
                    </div>
                    <div className={Styles.agree_title}>
                        （五）帮助您完成支付
                    </div>
                    <div className={Styles.agree_section}>
                        为完成您所订购的相应医疗服务费用的支付，您需要提供医保卡号、医保卡绑定的手机号码以及医保支付口令。如您不提供上述信息将无法正常使用医保支付功能。为完成您所订购的其他商品或服务的支付，您需要提供银行卡号、该卡的预留手机号、身份证号码，并创建账户与支付口令。如您不提供上述信息，将无法正常使用相关的支付功能，但不影响您使用天津医科大学朱宪彝纪念医院互联网医院平台产品或服务的基本浏览、搜索功能。
                    </div>
                    <div className={Styles.agree_title}>
                        （六）完成商品或服务的交付
                    </div>
                    <div className={Styles.agree_section}>
                        为便于向您交付您在我们的产品或服务中订购的具体商品/服务，您需提供收货人姓名、收货地址、邮政编码、收货人联系电话。如果我们委托第三方向您交付时，我们会在征得您同意后将上述信息共享给第三方。如果您拒绝提供此类信息，您理解并同意我们将无法完成相关交付商品或服务。
                    </div>
                    <div className={Styles.agree_title}>
                        （七）为您提供客户服务
                    </div>
                    <div className={Styles.agree_section}>
                        当您与我们联系时，我们可能会保存您的通信/通话记录和内容或您留下的联系方式等信息，以便与您联系或帮助您解决问题，或记录相关问题的处理方案及结果。为了提供服务及改进服务质量的合理需要，我们还可能使用的您的其他信息，包括您与客服联系时您提供的相关信息，您参与问卷调查时向我们发送的问卷答复信息。
                    </div>
                    <div className={Styles.agree_title}>
                        （八）为您提供安全保障
                    </div>
                    <div className={Styles.agree_section}>
                        请注意，为确保账户身份真实性、向您提供更好的安全保障，您可以向我们提供姓名和身份证号完成实名认证、也可通过绑定银行卡的方式完成实名认证。如拒绝完成实名认证服务，您可能无法使用特定的服务或产品，但不会影响您使用浏览、搜索等服务。
                    </div>
                    <div className={Styles.agree_section}>
                        为提高您使用过程的安全性，保护您或其他用户或公众的人身财产安全免遭侵害，更好地预防钓鱼网站、欺诈、网络漏洞、计算机病毒、网络攻击、网络侵入等安全风险，更准确地识别违反法律法规或天津医科大学朱宪彝纪念医院互联网医院平台相关协议规则的情况，我们可能使用或整合您的账户信息、交易信息、设备信息、有关网络日志以及我们关联公司、合作伙伴取得您授权或依据法律共享的信息，来综合判断您账户及交易风险、进行身份验证、检测及防范安全事件，并依法采取必要的记录、审计、分析、处置措施。
                    </div>
                    <div className={Styles.agree_title}>
                        （九）设备权限调用（需要九安根据实际情况看是否修改）
                    </div>
                    <div className={Styles.agree_section}>
                        为向您提供便捷、优质的服务，我们可能会调用您设备的一些权限，以下是我们可能调用的设备权限列表及对应的使用目的说明，您有权随时选择关闭下列权限的授权，但可能会影响您正常使用我们服务或产品的部分或全部功能。
                    </div>

                    <div className={Styles.agree_table_div} >
                        <table className={Styles.agree_table} border="0" cellspacing="0" cellpadding="0">
                            <thead>
                            <tr>
                                <th>
                                    <p>设备</p>
                                    <p>权限</p>
                                </th>
                                <th>
                                    <p>对应业务</p>
                                    <p>功能</p>
                                </th>
                                <th>
                                    <p>调用权限</p>
                                    <p>的目的</p>
                                </th>
                                <th>是否询问</th>
                                <th>
                                    <p>可否关闭</p>
                                    <p>权限</p>
                                </th>
                                <th>
                                    <p>如果关闭权限会</p>
                                    <p>影响用户什么功能</p>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>位置</td>
                                <td>1、用于基于位置的药店、医院信息展示、推送</td>
                                <td>1、通过用户当前位置，优化用户搜索等信息展示推荐</td>
                                <td>用户首次打开移动客户端时会弹窗询问</td>
                                <td>是</td>
                                <td>用户将无法准确使用基于位置的医疗信息展示推荐</td>
                            </tr>
                            <tr>
                                <td>通讯录</td>
                                <td>1、视话问诊-电话沟通</td>
                                <td>1、为保护医患双方个人信息安全，天津医科大学朱宪彝纪念医院互联网医院平台将在通讯录中写入一个中转电话，避免双方联系方式泄露</td>
                                <td>用户首次打开手机客户端时会弹窗询问</td>
                                <td>是</td>
                                <td>用户可能无法正常在视话问诊时使用电话申请功能</td>
                            </tr>
                            <tr>
                                <td>相机</td>
                                <td>核心业务功能</td>
                                <td>
                                    <p>1、问诊时拍摄并上传照片</p>
                                    <p>2、视频问诊</p>
                                </td>
                                <td>用户使用相应服务前会弹窗询问</td>
                                <td>是</td>
                                <td>用户无法正常使用视频问诊功能</td>
                            </tr>
                            <tr>
                                <td>通知</td>
                                <td>全部功能</td>
                                <td>接受问诊、支付结果、患者问诊等各类消息</td>
                                <td>用户首次打开手机客户端时会弹窗询问</td>
                                <td>是</td>
                                <td>用户无法正常接受各类消息，无法及时获知预约挂号、患者问诊等提醒等</td>
                            </tr>
                            <tr>
                                <td>无线数据</td>
                                <td>全部功能</td>
                                <td>连接网络</td>
                                <td>用户首次打开手机客户端时会弹窗询问</td>
                                <td>是</td>
                                <td>移动客户端无法正常使用</td>
                            </tr>
                            <tr>
                                <td>WLAN</td>
                                <td>全部功能</td>
                                <td>连接网络</td>
                                <td>用户首次打开手机客户端时会弹窗询问</td>
                                <td>是</td>
                                <td>移动客户端无法正常使用</td>
                            </tr>
                            <tr>
                                <td>存储</td>
                                <td>全部功能</td>
                                <td>写入存储用户信息，存储日志等信息</td>
                                <td>用户首次打开手机客户端时会弹窗询问</td>
                                <td>是</td>
                                <td>移动客户端无法正常使用</td>
                            </tr>
                            <tr>
                                <td>麦克风</td>
                                <td>核心业务功能</td>
                                <td>1、视频问诊</td>
                                <td>用户使用相应服务前会弹窗询问</td>
                                <td>是</td>
                                <td>医患双方在视频问诊时无法正常交流</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className={Styles.agree_title}>
                        （十）其他
                    </div>
                    <div className={Styles.agree_section}>
                        1、若您提供的信息中含有其他用户的个人信息，在向我们提供这些个人信息之前，您需确保您已经取得合法的授权。若其中涉及儿童个人信息的，您需在发布前取得对应儿童监护人的同意，前述情形下监护人有权通过本政策规定的途径联系我们，要求更正或删除涉及儿童个人信息的内容。
                    </div>
                    <div className={Styles.agree_section}>
                        2、我们将信息用于本政策未载明的其他用途，或者将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
                    </div>
                    <div className={Styles.agree_section}>
                        3、征得授权同意的例外
                    </div>
                    <div className={Styles.agree_section}>
                        根据相关法律法规规定，以下情形中收集您的个人信息无需征得您的授权同意：
                    </div>
                    <div className={Styles.agree_section}>
                        （1）与国家安全、国防安全有关的；
                    </div>
                    <div className={Styles.agree_section}>
                        （2）与公共安全、公共卫生、重大公共利益有关的；
                    </div>
                    <div className={Styles.agree_section}>
                        （3）与犯罪侦查、起诉、审判和判决执行等有关的；
                    </div>
                    <div className={Styles.agree_section}>
                        （4）出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；
                    </div>
                    <div className={Styles.agree_section}>
                        （5）所收集的个人信息是您自行向社会公众公开的；
                    </div>
                    <div className={Styles.agree_section}>
                        （6）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
                    </div>
                    <div className={Styles.agree_section}>
                        （7）根据您的要求签订合同所必需的；
                    </div>
                    <div className={Styles.agree_section}>
                        （8）用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；
                    </div>
                    <div className={Styles.agree_section}>
                        （9）为合法的新闻报道所必需的；
                    </div>
                    <div className={Styles.agree_section}>
                        （10）学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
                    </div>
                    <div className={Styles.agree_section}>
                        （11）法律法规规定的其他情形。
                    </div>
                    <div className={Styles.agree_section}>
                        请知悉，根据适用的法律，若我们对个人信息采取技术措施和其他必要措施进行处理，使得数据接收方无法重新识别特定个人且不能复原，或我们可能会对收集的信息进行去标识化地研究、统计分析和预测，用于改善平台的内容和布局，为商业决策提供产品或服务支撑，以及改进我们的产品和服务（包括使用匿名数据进行机器学习或模型算法训练），则此类处理后数据的使用无需另行向您通知并征得您的同意。
                    </div>
                    <div className={Styles.agree_section}>
                        4、如我们停止运营天津医科大学朱宪彝纪念医院互联网医院平台，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，对所持有的个人信息进行删除或匿名化处理。
                    </div>
                    <div className={Styles.agree_title}>
                        二、如何共享、转让、公开披露您的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        如果为了向您提供服务而需要将您的信息共享至第三方，我们将评估该第三方收集信息的合法性、正当性、必要性。我们将要求第三方对您的信息采取保护措施并且严格遵守相关法律法规与监管要求。另外，我们会按照法律法规及国家标准的要求以确认协议、具体场景下的文案确认、弹窗提示等形式征得您的同意或确认第三方已经征得您的同意。
                    </div>
                    <div className={Styles.agree_title}>
                        （一）共享
                    </div>
                    <div className={Styles.agree_section}>
                        1、在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
                    </div>
                    <div className={Styles.agree_section}>
                        2、我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。
                    </div>
                    <div className={Styles.agree_section}>
                        3、与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。例如，在您订购我们的商品时，我们必须与物流服务提供商共享您的订单信息才能安排送货；或者我们需要将您的订单号和订单金额与金融机构共享以实现其确认您的支付指令并完成支付等。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。
                    </div>
                    <div className={Styles.agree_title}>
                        （二）转让
                    </div>
                    <div className={Styles.agree_section}>
                        我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
                    </div>
                    <div className={Styles.agree_title}>
                        （三）公开披露
                    </div>
                    <div className={Styles.agree_section}>
                        我们仅会在以下情况下，公开披露您的个人信息：
                    </div>
                    <div className={Styles.agree_section}>
                        1、获得您明确同意或基于您的主动选择，我们可能会公开披露您的个人信息；
                    </div>
                    <div className={Styles.agree_section}>
                        2、如果我们确定您出现违反法律法规或严重违反医院相关协议规则的情况，或为保护其他用户或公众的人身财产安全免遭侵害，我们可能依据法律法规或医院相关协议规则征得您同意的情况下披露关于您的个人信息，包括相关违规行为以及医院已对您采取的措施。例如，若您囤积号源、虚假预约而严重违反用户协议，我们可能会公开披露您的身份信息、联系方式与处罚情况。
                    </div>
                    <div className={Styles.agree_title}>
                        （四）共享、转让、公开披露个人信息时事先征得授权同意的例外
                    </div>
                    <div className={Styles.agree_section}>
                        以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
                    </div>
                    <div className={Styles.agree_section}>
                        1、与国家安全、国防安全有关的；
                    </div>
                    <div className={Styles.agree_section}>
                        2、与公共安全、公共卫生、重大公共利益有关的；
                    </div>
                    <div className={Styles.agree_section}>
                        3、与犯罪侦查、起诉、审判和判决执行等有关的；
                    </div>
                    <div className={Styles.agree_section}>
                        4、出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                    </div>
                    <div className={Styles.agree_section}>
                        5、您自行向社会公众公开的个人信息；
                    </div>
                    <div className={Styles.agree_section}>
                        6、从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
                    </div>
                    <div className={Styles.agree_section}>
                        根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向您通知并征得您的同意。
                    </div>
                    <div className={Styles.agree_title}>
                        三、我们如何保护您的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        （一）目前，我们的重要信息系统已经通过信息安全等级保护（三级）测评。
                    </div>
                    <div className={Styles.agree_section}>
                        （二）互联网并非绝对安全的环境，我们强烈建议您不要使用非医院平台推荐的通信方式发送个人信息。在使用平台进行网上健康咨询时，您不可避免地要向医务人员或客服披露自己的个人信息，如联系方式或身份信息。请您妥善保护自己的个人信息，仅在必要的情形下向他人提供。 请注意，您在使用我们服务时自愿共享甚至公开分享的信息，可能会涉及您或他人的个人信息甚至个人敏感信息，如您在发帖、评论时选择上传包含个人信息的图片。请您更加谨慎地考虑，是否在使用我们的服务时共享甚至公开分享相关信息。请使用复杂密码，协助我们保证您的账号安全。我们将尽力保障您发送给我们的任何信息的安全性。
                    </div>
                    <div className={Styles.agree_section}>
                        （三）在不幸发生个人信息安全事件后，我们将按照法律法规的要求向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。事件相关情况我们将以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。
                    </div>
                    <div className={Styles.agree_section}>
                        （四）我们还将按照监管部门要求，上报个人信息安全事件的处置情况。
                    </div>
                    <div className={Styles.agree_title}>
                        四、我们如何处理未成年人的个人信息
                    </div>
                    <div className={Styles.agree_section}>
                        如果没有父母或监护人的同意，未成年人不得创建自己的用户账户。如您为未成年人的，我们要求您请您的父母或监护人仔细阅读本政策，并在征得您的父母或监护人同意的前提下使用我们的互联网电子服务或向我们提供信息。
                    </div>
                    <div className={Styles.agree_section}>
                        对于经父母或监护人同意使用我们的互联网电子服务而收集未成年人个人信息的情况，我们只会在法律法规允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用、共享、转让或披露此信息。
                    </div>
                    <div className={Styles.agree_section}>
                        根据相关规定，医院仅对满足特定年龄要求的用户提供互联网电子服务或产品。
                    </div>
                    <div className={Styles.agree_title}>
                        五、本政策如何更新
                    </div>
                    <div className={Styles.agree_section}>
                        我们的隐私权政策可能变更。
                    </div>
                    <div className={Styles.agree_section}>
                        未经您明确同意，我们不会削减您按照本政策所应享有的权利。 我们会在本页面上发布对本政策所做的任何变更。
                    </div>
                    <div className={Styles.agree_section}>
                        对于重大变更，我们还会提供更为显著的通知（包括我们会通过公示的方式进行通知甚至向您提供弹窗提示）。
                    </div>
                    <div className={Styles.agree_section}>
                        本政策所指的重大变更包括但不限于：
                    </div>
                    <div className={Styles.agree_section}>
                        1、我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
                    </div>
                    <div className={Styles.agree_section}>
                        2、我们在所有权结构、组织架构等方面发生重大变化。如业务调整、破产并购等引起的所有者变更等；
                    </div>
                    <div className={Styles.agree_section}>
                        3、个人信息共享、转让或公开披露的主要对象发生变化；
                    </div>
                    <div className={Styles.agree_section}>
                        4、您参与个人信息处理方面的权利及其行使方式发生重大变化；
                    </div>
                    <div className={Styles.agree_section}>
                        5、我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
                    </div>
                    <div className={Styles.agree_section}>
                        6、个人信息安全影响评估报告表明存在高风险时。
                    </div>


                </div>
            </DocumentTitle>

        )
    }
}
export default Agreememt;
