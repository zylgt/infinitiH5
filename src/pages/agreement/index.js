
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
                        提示条款
                    </div>
                    <div className={Styles.agree_section}>
                        您的信任对我们非常重要，天津医科大学朱宪彝纪念医院互联网医院（或简称“我们”、“医院”）制定本《注册协议》（或简称“本协议”）并提醒您：
                    </div>
                    <div className={Styles.agree_section}>
                        本协议适用于天津医科大学朱宪彝纪念医院互联网医院的互联网电子服务或商品。请您注意，本协议不适用于以下情况：
                    </div>
                    <div className={Styles.agree_section}>
                        1、通过我们的互联网电子服务或商品而接入的第三方服务（包括任何第三方网站）收集的信息；
                    </div>
                    <div className={Styles.agree_section}>
                        2、通过在我们互联网电子服务或商品中进行广告服务的其他公司或机构所收集的信息。在使用我们的各项互联网电子服务或商品前，请您务必仔细阅读并透彻理解本协议，在确认充分理解并同意后方可使用相关互联网电子服务或商品。一旦您开始使用我们互联网电子服务或商品，将被视为对本协议内容的接受和认可。
                    </div>
                    <div className={Styles.agree_title}>
                        定义
                    </div>
                    <div className={Styles.agree_section}>
                        “医院服务平台”：指天津医科大学朱宪彝纪念医院互联网医院平台服务提供者天津九安医疗电子股份有限公司提供的与糖APP、与糖医护APP、与糖糖尿病管理系统、与糖云平台等软件产品。“用户”：医院平台服务的使用人，在本协议中更多地称为“您”或“用户”。
                    </div>
                    <div className={Styles.agree_title}>
                        一、总则
                    </div>
                    <div className={Styles.agree_section}>
                        1、为确保您能正常地使用我们的互联网电子服务或商品，您应当阅读并遵守本协议。请您务必审慎阅读、充分理解各条款内容，以及开通或使用某项服务的单独协议，并选择接受或不接受。
                    </div>
                    <div className={Styles.agree_section}>
                        2、除非您已阅读并接受本协议所有条款，否则您无权使用我们的互联网电子服务或商品（以下简称“本服务”）。您在服务平台的登录、查看、发布信息等行为即视为您已阅读并同意本协议的约束，包括接受更新后的本协议条款。当您与医院或服务平台发生争议时，应以最新的服务协议为准。
                    </div>
                    <div className={Styles.agree_section}>
                        3、我们为您提供全面的互联网电子服务或商品，为充分保护您对于我们提供的各项服务的知情权，我们就其提供的各项服务的相关性、有效性以及限制性提供以下注册条款。在此特别提醒您，在您使用注册前已确实仔细阅读了本协议，如果您对本协议的任何条款或者将来随时可能修改、补充的条款有异议，您可选择不注册。
                    </div>
                    <div className={Styles.agree_section}>
                        4、您在进行注册程序过程中，根据声音、文字或图形等提示可以选择表示“同意”的操作，当您点选“同意”按钮时即视为您已仔细阅读本协议，同意接受本协议项下的所有条款，包括接受我们对本协议条款随时所做的任何修改，并愿意受其约束。之后方能按系统提示完成全部注册程序、问答程序、享受相关的互联网电子服务或商品。
                    </div>
                    <div className={Styles.agree_section}>
                        5、您在医院服务平台提问、搜索、提供各项电子信息、与其它用户交流及其他电子服务，即代表您已经同意本协议。
                    </div>
                    <div className={Styles.agree_section}>
                        6、本协议的条款适用于医院服务平台提供的各种服务，但当您使用某一特定服务时，如该服务另有单独的服务条款、指引或规则，您应遵守本协议及医院服务平台随时公布的与该服务相关的服务条款、指引或规则等。前述所有的指引和规则，均构成本协议的一部分。除非本协议另有其他明示规定，新推出的产品或服务、增加或强化目前本服务的任何新功能，均受到本协议之规范。
                    </div>
                    <div className={Styles.agree_title}>
                        二、本协议的确认和接纳
                    </div>
                    <div className={Styles.agree_section}>
                        1、您同意所有注册协议条款并完成注册程序，才能成为医院服务平台的正式用户。您确认：本协议条款是处理双方权利义务的契约，始终有效，法律另有强制性规定或双方另有特别约定的，依其规定。
                    </div>
                    <div className={Styles.agree_section}>
                        2、您点击登录，即视为您确认自己具有享受医院服务平台服务、下单购买等相应的权利能力和行为能力，能够独立承担法律责任。
                    </div>
                    <div className={Styles.agree_section}>
                        3、如果您在18周岁以下，您只能在父母或监护人的监护参与下才能使用医院服务平台。
                    </div>
                    <div className={Styles.agree_section}>
                        4、我们保留在中华人民共和国大陆地区法施行之法律允许的范围内独自决定拒绝服务、关闭用户账户、清除或编辑内容或取消订单的权利。
                    </div>
                    <div className={Styles.agree_section}>
                        5、我们运用自己的操作系统通过国际互联网为您提供互联网电子服务或商品，并承担本协议和其它服务协议中对您的责任和义务。为使用本服务，您必须能够自行通过有法律资格的第三方对您提供互联网接入服务，并自行承担以下内容：
                    </div>
                    <div className={Styles.agree_section}>
                        (1)自行配备上网所需的设备，包括个人电脑，调制解调器及其他必要的设备装置。
                    </div>
                    <div className={Styles.agree_section}>
                        (2)自行承担上网所需的相关必要费用，如：电话费用、网络费用等。
                    </div>
                    <div className={Styles.agree_section}>
                        (3)本协议中规定的您的其他责任和义务。
                    </div>
                    <div className={Styles.agree_section}>
                        6、您应保证：提供详尽、真实、准确和完整的个人资料以符合实名认证的要求。如果资料发生变动，您应及时更改。若您提供任何错误、不实、过时或不完整的资料，并为我们所确知，或者我们有合理由怀疑前述资料为错误、不实、过时或不完整的资料，我们有权暂停或终止对您的帐号提供服务，并拒绝现在或将来申请使用本服务的全部或一部分的请求。在此情况下，您可通过我们的申诉途径与我们取得联系并修正个人资料经我们核实后恢复账号使用。
                    </div>
                    <div className={Styles.agree_section}>
                        7、本服务不会提供给被暂时中止或永久终止资格的医院服务平台用户。
                    </div>
                    <div className={Styles.agree_title}>
                        三、用户依法言行义务
                    </div>
                    <div className={Styles.agree_section}>
                        本协议依据国家相关法律法规规章制定，用户同意严格遵守以下义务：
                    </div>
                    <div className={Styles.agree_section}>
                        1、不得传输或发表：煽动抗拒、破坏宪法和法律、行政法规实施的言论，煽动颠覆国家政权，推翻社会主义制度的言论，煽动分裂国家、破坏国家统一的的言论，煽动民族仇恨、民族歧视、破坏民族团结的言论；
                    </div>
                    <div className={Styles.agree_section}>
                        2、从中国大陆向境外传输资料信息时必须符合中国有关法规；
                    </div>
                    <div className={Styles.agree_section}>
                        3、不得利用医院服务平台从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；
                    </div>
                    <div className={Styles.agree_section}>
                        4、不得干扰医院服务平台的正常运转，不得侵入医院服务平台及国家计算机信息系统；
                    </div>
                    <div className={Styles.agree_section}>
                        5、不得传输或发表任何违法犯罪的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的、淫秽的、不文明的等信息资料；
                    </div>
                    <div className={Styles.agree_section}>
                        6、不得传输或发表损害国家社会公共利益和涉及国家安全的信息资料或言论；
                    </div>
                    <div className={Styles.agree_section}>
                        7、不得教唆他人从事本条所禁止的行为。
                    </div>
                    <div className={Styles.agree_title}>
                        四、用户管理
                    </div>
                    <div className={Styles.agree_section}>
                        1、在进行注册过程中，您的用户名注册与使用应符合网络道德，遵守中华人民共和国的相关法律法规。您的用户名和昵称中不能含有威胁、淫秽、谩骂、非法、侵害他人正当权益等有争议性的文字。您在医院服务平台上的言论不得违法、不得违反公序良俗、不得使用攻击性语言恶意中伤他人，或作出虚假性陈述。您保证您提供的信息的真实性、合法性和有效性。您单独承担在医院服务平台上发布内容的一切相关责任。您使用或提供的服务应遵守所有适用于地方法律、国家法律和国际法律标准。
                    </div>
                    <div className={Styles.agree_section}>
                        2、您应遵守从中国境内向外传输技术性资料时必须符合中国有关法律法规。
                    </div>
                    <div className={Styles.agree_section}>
                        3、您不得使用本服务于其他非法用途。
                    </div>
                    <div className={Styles.agree_section}>
                        4、您不得干扰或扰乱本服务，不得盗用他人帐号，如有上述行为，您需对此行为造成的后果负责。
                    </div>
                    <div className={Styles.agree_section}>
                        5、您应遵守所有使用本服务的各项协议、规定、程序和惯例。您须承诺不传输任何非法的、骚扰性的、中伤他人的、辱骂性的、恐吓性的、伤害性的、庸俗的，淫秽等信息资料。另外，您也不能传输任何教唆他人构成犯罪行为的资料；不能传输助长国内不利条件和涉及国家安全的资料；不能传输任何不符合当地法规、国家法律和国际法律的资料。未经许可而非法进入其它电脑系统是禁止的。
                    </div>
                    <div className={Styles.agree_section}>
                        6、您不得发布任何不基于事实、虚构、夸大、引人误解的信息；不得发布涉及政治、性别、种族歧视或攻击他人的文字、图片、视频或语言等信息；不得发布介绍个人、科室等广告性质的内容；不得有其它涉及违反当地法规、国家法律和国际法律的行为。
                    </div>
                    <div className={Styles.agree_section}>
                        7、您发布的文章、视频、资讯不得侵犯任何第三方的合法知识产权。
                    </div>
                    <div className={Styles.agree_section}>
                        8、若您的行为不符合本协议的规定，我们有权做出独立判断，并立即停止向该您帐号提供服务。您需对自己在网上的行为承担法律责任。您若在医院服务平台上散布和传播反动、色情或其他违反国家法律的信息，我们的系统记录有可能作为您违反法律的证据。
                    </div>
                    <div className={Styles.agree_section}>
                        9、您的授权行为：对我们而言，您帐号和密码是唯一验证您真实性的依据，只要使用了正确的您帐号和密码无论是谁登录均视为已经得到您本人的授权。
                    </div>
                    <div className={Styles.agree_section}>
                        10、您同意您勾选知情同意选项或采纳医生建议即视为风险提示已告知并获得您的知情同意。
                    </div>
                    <div className={Styles.agree_section}>
                        11、在接受互联网诊疗服务时，用户应提供相关就诊者初诊数据，并保证所提供的初诊数据的完整性、真实性、合法性和准确性。
                    </div>
                    <div className={Styles.agree_section}>
                        12、您的授权行为：用户同意授权医院及医院服务平台获取患者数据，并为患者服务的目的使用所有就诊数据，包括用户在其他实体医疗机构的数据。
                    </div>
                    <div className={Styles.agree_section}>
                        13、根据相关法律法规规定，用户应理解互联网诊疗不涉及面诊、触诊、初诊，医生仅根据患者提供的信息和初诊数据提供复诊服务。
                    </div>
                    <div className={Styles.agree_title}>
                        五、用户责任
                    </div>
                    <div className={Styles.agree_section}>
                        1、您同意保障和维护医院的利益，如果因为您违反有关法律、法规或本协议的任何规定而给医院、我院医生或任何其他第三方造成任何损失，您统一承担由此产生的损害赔偿责任，其中包括但不限于医院为此而支付的律师费用。
                    </div>
                    <div className={Styles.agree_section}>
                        2、您同意承担包括但不限于如下违反相关法律法规或违反平台规则情形造成的全部责任：
                    </div>
                    <div className={Styles.agree_section}>
                        （1）提供信息不完整、不真实、不准确，对医生诊断产生误导影响；
                    </div>
                    <div className={Styles.agree_section}>
                        （2）未按要求披露过敏史等；
                    </div>
                    <div className={Styles.agree_section}>
                        （3）您或者您的近亲属不配合医疗机构进行符合诊疗规范的诊疗；
                    </div>
                    <div className={Styles.agree_section}>
                        （4）以任何形式侵犯他人名誉权等行为。
                    </div>
                    <div className={Styles.agree_title}>
                        六、您的帐号、密码和安全性
                    </div>
                    <div className={Styles.agree_section}>
                        1、您一旦注册成功，成为医院服务平台的合法用户，将得到一个您的帐号和密码。您的帐号和密码由您负责保管。您要对任何以您帐号进行的活动和事件负全责，且您有权随时根据指示更改您的密码。若发现任何非法使用您的帐号或存在安全漏洞的情况，请立即通知我们。
                    </div>
                    <div className={Styles.agree_section}>
                        2、因黑客行为或您的保管疏忽等情况导致帐号、密码遭他人非法使用，我们不承担责任。我们将根据法律法规的要求，履行其作为移动互联网信息服务提供者应当履行的义务。
                    </div>
                    <div className={Styles.agree_title}>
                        七、收费服务
                    </div>
                    <div className={Styles.agree_section}>
                        1、医院平台的相关服务是以收费方式提供的，如您使用收费服务，请遵守相关的协议。
                    </div>
                    <div className={Styles.agree_section}>
                        2、请您在支付费用时，仔细阅读收费服务的相关协议，除协议约定的情况外，否则，将不予退费。退费的方式视支付方式的不同而不同。用户应严格依据退费方式及退费周期收回退款。
                    </div>
                    <div className={Styles.agree_section}>
                        3、医院平台可能根据实际需要对收费服务的收费标准、方式进行修改和变更，也可能会对部分免费服务开始收费。前述修改、变更或开始收费前，我们将在相应服务页面进行通知或公告。如果您不同意上述修改、变更或付费内容，则应停止使用该服务。
                    </div>
                    <div className={Styles.agree_title}>
                        八、服务暂停、变更与中止条款
                    </div>
                    <div className={Styles.agree_section}>
                        1、鉴于移动互联网服务的特殊性，我们有权随时变更、中止或终止部分或全部的服务。如变更、中止或终止的服务属于免费服务，我们无需通知您，也无需对您或任何第三方承担任何责任。
                    </div>
                    <div className={Styles.agree_section}>
                        2、您理解，我们需要定期或不定期地对提供本服务的平台或相关的设备进行检修或者维护，如因此类情况而造成本服务在合理时间内的中断，我们无需为此承担任何责任，但我们应尽可能事先进行通告。
                    </div>
                    <div className={Styles.agree_section}>
                        3、如发生下列任何一种情形，我们有权随时中断或终止向您提供本协议项下的服务而无需对您或任何第三方承担任何责任：
                    </div>
                    <div className={Styles.agree_section}>
                        (1)您违反国家有关法律法规或医院平台规定，侵害他人合法权益的；
                    </div>
                    <div className={Styles.agree_section}>
                        (2)您提供的个人资料不真实；
                    </div>
                    <div className={Styles.agree_section}>
                        (3)您违反本协议中的规定；
                    </div>
                    <div className={Styles.agree_section}>
                        (4)您违反医院发布的政策；
                    </div>
                    <div className={Styles.agree_section}>
                        (5)医院认为其他不适宜的地方。
                    </div>
                    <div className={Styles.agree_title}>
                        九、结束服务
                    </div>
                    <div className={Styles.agree_section}>
                        您或我们可随时根据用户管理的规范和实际情况中断一项或多项本服务，我们无需对您或任何其他第三方负责。您对本协议的修改有异议，或对我们的服务不满，可以行使如下权利：
                    </div>
                    <div className={Styles.agree_section}>
                        1、停止使用我们提供的服务。
                    </div>
                    <div className={Styles.agree_section}>
                        2、通告我们停止对该您帐号的服务。结束您的服务后，您使用本服务的权利马上终止，即刻，我们不对您承担任何义务和责任。
                    </div>
                    <div className={Styles.agree_title}>
                        十、隐私及个人信息的保护
                    </div>
                    <div className={Styles.agree_section}>
                        1、保护您隐私是我们的一项基本政策。
                    </div>
                    <div className={Styles.agree_section}>
                        2、您的信任对我们非常重要，我们深知个人信息安全的重要性，我们将按照法律法规要求，采取安全保护措施，保护您的个人信息安全。具体详见《法律声明及隐私权政策》。
                    </div>
                    <div className={Styles.agree_title}>
                        十一、对第三方责任的声明
                    </div>
                    <div className={Styles.agree_section}>
                        我们因服务必要，可能会将相关网站链接至医院开展合作的伙伴的网站（统称“第三方网站”）。如果您使用医院提供的链接访问第三方网站，这些网站的运营商可能会收集您的个人信息。医院尽力确保所有链接的第三方网站采用同等的个人信息保护措施，但是医院不对这些第三方网站上的活动、隐私权政策或隐私保护水平承担任何法律或其他责任。
                    </div>
                    <div className={Styles.agree_title}>
                        十二、知识产权条款
                    </div>
                    <div className={Styles.agree_section}>
                        1、您一旦接受本协议，即表明您主动将其在任何时间段在医院服务平台发表的任何形式的信息内容（包括但不限于用户评价、用户咨询、各类话题文章等信息内容）的财产性权利等任何可转让的权利，如著作权财产权（包括并不限于：复制权、发行权、出租权、展览权、表演权、放映权、广播权、信息网络传播权、摄制权、改编权、翻译权、汇编权以及应当由著作权人享有的其他可转让权利），全部独家且不可撤销地转让给医院及医院服务平台所有，您同意我们有权就任何主体侵权而单独提起诉讼。
                    </div>
                    <div className={Styles.agree_section}>
                        2、本协议已经构成《中华人民共和国著作权法》第二十五条（条文序号依照2011年版著作权法确定）及相关法律规定的著作财产权等权利转让书面协议，其效力及于您在医院服务平台上发布的任何受著作权法保护的作品内容，无论该等内容形成于本协议订立前还是本协议订立后。
                    </div>
                    <div className={Styles.agree_section}>
                        3、您同意并已充分了解本协议的条款，承诺不将已发表于医院平台的信息，以任何形式发布或授权其它主体以任何方式使用（包括但限于在各类网站、媒体上使用）。
                    </div>
                    <div className={Styles.agree_section}>
                        4、医院有权不时地对本协议及医院服务平台的内容进行修改，并在医院服务平台张贴，无须另行通知您。在法律允许的最大限度范围内，医院对本协议及医院服务平台的内容拥有解释权。
                    </div>
                    <div className={Styles.agree_section}>
                        5、除法律另有强制性规定外，未经我们明确的特别书面许可，任何单位或个人不得以任何方式非法地全部或部分复制、转载、引用、链接、抓取或以其他方式使用医院服务平台的信息内容，否则，医院有权追究其法律责任。
                    </div>
                    <div className={Styles.agree_section}>
                        6、医院服务平台所刊登的资料信息（诸如文字、图表、标识、按钮图标、图像、声音文件片段、数字下载、数据编辑和软件），均是医院或其内容提供者的财产，受中国和国际版权法的保护。医院服务平台上所有内容的汇编是医院的排他财产，受中国和国际版权法的保护。
                    </div>
                    <div className={Styles.agree_title}>
                        十三、特别授权
                    </div>
                    <div className={Styles.agree_section}>
                        您完全理解并不可撤销地授予我们下列权利：
                    </div>
                    <div className={Styles.agree_section}>
                        1、一旦您向我们作出任何形式的承诺，且相关机构已确认您违反了该承诺，则我们有权立即按您的承诺或协议约定的方式对您的账户采取限制措施，包括中止或终止向您提供服务，并公示相关机构确认的您的违约情况。您了解并同意，我们无须就相关违约事项与您核对事实，或另行征得您的同意，且我们无须就此限制措施或公示行为向您或任何第三方承担任何的责任。
                    </div>
                    <div className={Styles.agree_section}>
                        2、一旦您违反本协议、或与我们签订其他协议的约定，我们有权以任何方式通知本服务或其他相关服务，要求其对您的权益采取限制措施，包括但不限于要求中止、终止对您提供的部分或全部服务，且在其经营或实际控制的网站或APP公示您的违约情况。
                    </div>
                    <div className={Styles.agree_section}>
                        3、您授权我们使用您注册、使用本服务过程中形成的信息，并允许其通过短信、邮件、电话或其他形式向您传送提供的服务。您同意接受我们通过短信、邮件、电话或其他形式向您发送活动、服务或其他相关商业信息。如果您不需要我们提供的部分或全部服务的活动、服务或其他相关商业信息的服务，在您向医院平台客服提出申请后予以中止、终止对您提供的该部分或全部服务。
                    </div>
                    <div className={Styles.agree_title}>
                        十四、医院拒绝提供担保
                    </div>
                    <div className={Styles.agree_section}>
                        1、您对移动网络服务的使用承担风险，并承担因为使用移动网络服务而产生的一切后果。医院对此不作任何类型的担保，不论是明确的或隐含的，但是不对商业性的隐含担保、特定目的和不违反规定的适当担保作限制。
                    </div>
                    <div className={Styles.agree_section}>
                        2、医院不担保本服务一定能完全满足您的要求，也不担保本服务不会受网络、通信等原因而中断，对服务的及时性、安全性、错误程序的发生都不作担保。
                    </div>
                    <div className={Styles.agree_title}>
                        十五、责任限制
                    </div>
                    <div className={Styles.agree_section}>
                        1、医院服务平台提供的服务是按照现有技术和条件所能达到的水平提供的服务，会尽最大努力为您提供服务，确保服务的连贯性和安全性；但不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失以及其他的损失和风险。医院所不能控制的事件而影响医院提供服务，医院无须承担任何责任。
                    </div>
                    <div className={Styles.agree_section}>
                        2、医院对您使用网络服务而受到的任何直接、间接、偶然、特殊及继起的损害（医院违反法律、法规和本协议的条款除外）不负责任，这些损害可能来自：不正当使用网络服务，私自在网上进行交易，非法使用网络服务或您传送的信息有所变动。这些行为都有可能会导致医院的形象受损，所以医院事先提出这种损害的可能性。
                    </div>
                    <div className={Styles.agree_section}>
                        3、医生拒绝回复的问题，包括但不限于如下情况：
                    </div>
                    <div className={Styles.agree_section}>
                        （1）非各项电子类问题，如动物疾病问题、社会意识形态问题等；
                    </div>
                    <div className={Styles.agree_section}>
                        （2）医疗司法举证或询证问题；
                    </div>
                    <div className={Styles.agree_section}>
                        （3）胎儿性别鉴定问题；
                    </div>
                    <div className={Styles.agree_section}>
                        （4）未按提问要求提问，如提问时未指定医生，却要求具体医生回复；
                    </div>
                    <div className={Styles.agree_section}>
                        （5）有危害他人/自己可能的问题；
                    </div>
                    <div className={Styles.agree_section}>
                        （6）追问医生个人信息的问题；
                    </div>
                    <div className={Styles.agree_section}>
                        （7）故意挑逗、侮辱医生的提问。
                    </div>
                    <div className={Styles.agree_section}>
                        4、医院保留对本声明作出不定时修改的权利。
                    </div>
                    <div className={Styles.agree_section}>
                        5、医院不对您所发布信息的删除或储存失败负责。医院积极采用数据备份加密等措施保障您数据的安全，但不对由于因意外因素导致的数据损失和泄漏负责。医院有权审查和监督您的行为是否符合本协议的要求，如果您违背了本协议的约定，则医院有权中断您的服务。
                    </div>
                    <div className={Styles.agree_section}>
                        6、您同意因下列情形之一的，医院不承担赔偿责任：
                    </div>
                    <div className={Styles.agree_section}>
                        （1）患者或者其近亲属不配合进行符合诊疗规范的诊疗；
                    </div>
                    <div className={Styles.agree_section}>
                        （2）医务人员在紧急情况下已经尽到合理诊疗义务；
                    </div>
                    <div className={Styles.agree_section}>
                        （3）限于当时的医疗水平难以诊疗。
                    </div>
                    <div className={Styles.agree_section}>
                        7、如果您或第三方就相关服务购买了保险，因发生保险事故导致损失的，保险公司已经向您或第三方承担或许诺承担保险理赔责任后，医院在此范围内不再承担赔偿责任。
                    </div>
                    <div className={Styles.agree_title}>
                        十六、广告说明
                    </div>
                    <div className={Styles.agree_section}>
                        1、医院平台上为您的便利而提供的外部链接，包括但不限于任何广告内容链接，以及该链接所指向网页之所有内容，均系该网页所属第三方的所有者制作和提供（以下简称“第三方网页”）。第三方网页并非也不反映医院之任何意见和主张，也不表示医院同意或支持该第三方网页上的任何内容、主张或立场。医院对第三方网页中内容之合法性、准确性、真实性、适用性、安全性和完整性等概不承担任何责任。任何单位或个人如需要第三方网页中内容（包括资讯、资料、消息、产品或服务介绍、报价等），并欲据此进行交易或其他行为前，应慎重辨别这些内容的合法性、
                        准确性、真实性、适用性、完整性和安全性（包括下载第三方网页中内容是否会感染电脑病毒），并采取谨慎的预防措施。如您不确定这些内容是否合法、准确、真实、实用、完整和安全，建议您先咨询专业人士。
                    </div>
                    <div className={Styles.agree_section}>
                        2、任何单位或者个人因相信、使用第三方网页中信息、服务、产品等内容，或据此进行交易等行为，而引致的人身伤亡、财产毁损（包括因下载而感染电脑病毒）、名誉或商誉诽谤、版权或知识产权等权利的侵犯等事件，及因该等事件所造成的损害后果，医院概不承担任何法律责任。无论何种原因，医院不对任何非与医院直接发生的交易和行为承担任何直接、间接、附带或衍生的损失和责任。
                    </div>
                    <div className={Styles.agree_title}>
                        十七、协议修改
                    </div>
                    <div className={Styles.agree_section}>
                        根据国家法律法规变化及网络运营需要，医院有权对本协议条款不时地进行修改，修改后的协议一旦被张贴在医院服务平台上即生效，并代替原来的协议，医院服务平台将公告通知变更信息。您可随时登陆查阅最新协议；您有义务不时关注并阅读最新版的协议及医院平台公告。如您不同意更新后的协议，可以且应立即停止接受医院服务平台依据本协议提供的服务；如您继续使用医院服务平台提供的服务，即视为同意更新后的协议。医院建议您在使用医院服务平台之前阅读本协议及平台的公告。如果本协议中任何一条被视为废止、无效或因任何理由不可执行，该条应视为可分的且并不影响任何其余条款的有效性和可执行性。当发生有关争议时，以最新的服务协议为准。
                    </div>
                    <div className={Styles.agree_title}>
                        十八、其他
                    </div>
                    <div className={Styles.agree_section}>
                        1、医院尊重您的合法权利，本协议及医院服务平台上发布的各类规则、声明等其他内容，均是为了更好地、更加便利地为您提供服务。医院服务平台欢迎您和社会各界提出意见和建议且将虚心接受并适时修改本协议及医院服务平台的各类规则。
                    </div>
                    <div className={Styles.agree_section}>
                        2、本协议内容中以黑体、加粗、下划线、斜体等方式显著标识的条款，请您着重阅读。
                    </div>
                    <div className={Styles.agree_section}>
                        3、您注册使用医院平台即视为您完全接受本协议，在点击“登录”之前请您再次确认已知悉并完全理解本协议的全部内容。
                    </div>
                    <div className={Styles.agree_name}>
                        隐私权政策
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
                        <table className={Styles.agree_table} border="0">
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
