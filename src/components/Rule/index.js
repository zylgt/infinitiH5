import React, { Component } from 'react';
import Styles from './index.less';
import router from 'umi/router';
import { Modal } from 'antd-mobile';

class Rule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRuleBottom: false,
        }
    }
    componentDidMount() {
        if (this.scroll) {
            this.scroll.addEventListener("scroll", e => {
                const {clientHeight, scrollHeight, scrollTop} = e.target;
                const isBottom = scrollTop + clientHeight + 20 > scrollHeight;
                if (isBottom) {
                    this.setState({
                        isRuleBottom: true
                    })
                } else {
                    this.setState({
                        isRuleBottom: false
                    })
                }
            });
        }
    }
    //关闭
    closeRule(){
        this.props.closeRule()
    }
    touchMove(e){
        e.preventDefault()
    }
    render() {
        const { isRuleBottom } = this.state;
        return (
            <div className={Styles.rule_window}>
                <Modal
                    visible={true}
                    transparent
                    maskClosable={false}
                >
                    <div className={Styles.rule_window_con }>
                        <div className={Styles.window}>
                            <img className={Styles.window_close} src={require('../../assets/welcome_closeicon.png')}
                                 alt="" onClick={() => {
                                this.closeRule()
                            }}/>
                            <div className={Styles.window_rule} ref={e => (this.scroll = e)}>
                                <div className={Styles.rule_title}>活动规则</div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>【活动时间】</span>
                                    <span className={Styles.rule_con_word}>2020年11月23日10时至2020年12月13日24时，共21天  </span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>【活动范围】</span>
                                    <span className={Styles.rule_con_word}>中国大陆地区用户（港、澳、台除外）  </span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_block}>【参与方式】</span>
                                    <span className={Styles.rule_con_word}>活动期间，进入活动页面上传<span className={Styles.rule_con_key}>「背后的力量」</span>相关的故事与照片或视频参与活动。上传成功，即可参与故事评选活动，根据获赞排名获得人气大奖，每周还会从当周上传故事的用户中抽取运气爆棚奖！同时，用户可邀请好友进行点赞、评论、分享自己的故事，参与互动。每位用户每日登录活动页面后（可为单个作品或多个作品）点赞100次，用户只需每天点赞、评论、分享任意组合相加10次，即可参与每日的「锦鲤幸运奖」抽奖活动！中奖结果将在次日17：00点前在英菲尼迪微信公众号中公布。  </span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_block}>【奖品设置】</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>合伙人大奖：</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>Top1-5：</span>
                                    <span className={Styles.rule_con_word}>iPhone 12 128G 颜色随机价值6799元共计5人 </span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>Top5-10：</span>
                                    <span className={Styles.rule_con_word}>京东卡（2000元）共计5人 </span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>Top11-50：</span>
                                    <span className={Styles.rule_con_word}>京东卡（500元）共计40人</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>Top51-100：</span>
                                    <span className={Styles.rule_con_word}>京东卡（100元）共计50人</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>Top101-200：</span>
                                    <span className={Styles.rule_con_word}>京东卡（50元）共计100人</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>导演甄选奖：</span>
                                    <span className={Styles.rule_con_word}>iPhone 12 128G 颜色随机 价值6799元 共计5人</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>运气爆棚奖：</span>
                                    <span className={Styles.rule_con_word}>Bose 智能音频眼镜1副（价值1599 元）</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>活动期间，每周内上传作品的用户均可参与抽奖，每周1名用户。 </span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>锦鲤幸运奖：</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>第一周互动礼品：2018款QX50 1:64车模（颜色随机）</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>第二周互动礼品：英菲尼迪水波纹马克杯（颜色随机）</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>第三周互动礼品：英菲尼迪移动电源</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>活动期间，只需每天点赞、评论、分享任意相加10次，即可参与！每日随机抽取5名幸运用户。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>【获奖公示及领取方式】</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>一、获奖公示：</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>所有奖项，将通过短信形式通知到中奖用户。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>Top1-200名将在活动截止后，通过英菲尼迪官方微信公众号公示获奖信息。用户可通过微信搜索“infinitichina”，关注英菲尼迪官方微信公众号。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>二、领取方式：（可通过两种方式进行领取奖品）</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>1、活动网站-我的-查看获奖情况-可直接填写领取信息。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                <span
                                    className={Styles.rule_con_word}>2、关注“英菲尼迪官方微信公众号”后台留言「背后的力量」，根据自动回复引导，填写领取信息。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>三、领奖时间：</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>1、所有获奖用户，隔日会收到公示获奖信息。从获奖之日起，用户需在7日内核实中奖信息及回复邮寄地址来领取奖品，如在规定日期未回复邮寄地址，则视为主动放弃获奖资格。我们将在收到您的信息后15个工作日内为获奖用户发放奖品。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>2、Top1-10，在名单公布后会有英菲尼迪客服统一联系获奖用户，并告知需要提供的相应领奖资料。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_key}>【活动规则及注意事项】</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>1、合伙人大奖为上传作品获赞数量的前5名、6-10名、11-50名、51-100名、101-200名。如遇点赞数量相等的情况，则以时间先到该获赞数量的用户优先获取奖品。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>2、导演甄选奖将由背后的力量导演摄制组依据“故事独特性”“上传图片/视频拍摄效果优秀指数”及“故事受欢迎程度”等维度多方考量，甄选出5位合伙人的故事，评选出5名获胜者。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>3、锦鲤幸运奖为活动期间，每日点赞、评论、分享任意组合相加10次，即可参与抽奖，每日随机抽取5人送出奖品。运气爆棚奖为活动期间，每周内上传了作品的用户，即可参与抽奖，每周随机抽取1人送出奖品。锦鲤幸运奖、运气爆棚奖每人只可获得1次，获得过锦鲤幸运奖或运气爆棚奖的用户将不可再次参与抽奖。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>4、合伙人大奖与导演甄选奖不可同时获得。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>5、中奖者需提供真实且准确无误的兑奖信息（包括但不限于手机号、姓名、地址等），如果中奖者逾期（7日内）提供、不提供或者提供不正确的兑奖信息导致无法兑奖、无法确认或无法联络，则视为中奖者自动放弃中奖资格，活动主办方将不做任何形式的赔偿也不承担其他责任。活动参与者提供的个人信息将被用于奖品发放等目的，因而需提供给相关第三方以发放奖品，活动参与者参与本活动视为其知悉并同意该等用途。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>6、用户在上传文字、照片、视频时，即同意英菲尼迪使用用户肖像及故事内容，英菲尼迪将保留后续使用该用户肖像用于宣传、拍摄等广告等用途的使用权利。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7、用户在上传文字、照片、视频时，必须遵守中华人民共和国相关法律法规的规定，用户同意将不会利用本活动进行任何违法或不正当的活动，包括但不限于上传包含有下列内容之一的内容：</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.1 反对宪法确定的基本原则；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.2 危害国家统一、主权和领土完整的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.3 泄露国家秘密、危害国家安全或者损害国家荣誉和利益的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.4 煽动民族仇恨、民族歧视，破坏民族团结，或者侵害民族风俗、习惯的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.5 宣扬邪教、迷信的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.6 扰乱社会秩序，破坏社会稳定的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.7 诱导未成年人违法犯罪和渲染暴力、色情、赌博、恐怖活动的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.8 侮辱或者诽谤他人，侵害公民个人隐私等他人合法权益的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.9 危害社会公德，损害民族优秀文化传统的；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.10 非法的广播电视频道、视听节目网站提供的非法内容；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.11 侵犯他人的人身权及财产权；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.12 未经他人允许的情况下使用他人肖像权；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.13 侵犯他人作品的著作权等权利；</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>7.14 有关法律、行政法规和国家规定禁止的其他内容。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>8、如发现用户在本次活动中使用任何不正当手段参与活动，主办方有权在不事先通知的前提下取消其中奖资格。本条中的“不正当手段”包括不限于通过外挂机非法辅助程序等进行刷奖、套取奖品。主办方有权对用户是否采取不正当手段参与活动进行认定。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>9、对于同一个参与者如使用技术手段，导致获赞量、转发数激增等不正常数据行为，活动主办方有权取消相关活动账号参与活动的权利。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>10、活动主办方以及相关合作方不对因为网络传输原因而导致获奖信息错误或延误承担任何责任。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>11、如发现用户有以上任何违规行为，英菲尼迪将保留取消用户参与活动资格的权利。</span>
                                </div>
                                <div className={Styles.rule_con}>
                                    <span className={Styles.rule_con_word}>12、凡参与本次活动，即视为同意本细则所叙述的各项规定。</span>
                                </div>


                            </div>

                        </div>
                        <div className={Styles.window_bottom}>
                            <img className={Styles.window_bottom_bg} src={require('../../assets/welcome_bottom_page.png')}
                                 alt=""/>
                        </div>
                        <div className={`${Styles.window_bottom} ${Styles.window_bottom_top}`}>
                            {
                                isRuleBottom ? '' :
                                    <img className={Styles.window_bottom_mask}
                                         src={require('../../assets/welcome_bottom_page_mask.png')}
                                         alt=""/>
                            }
                            {
                                isRuleBottom ? '' :
                                    <div className={Styles.window_down}>
                                        <img src={require('../../assets/down_arrow.gif')} alt=""/>
                                    </div>
                            }
                        </div>
                    </div>
                </Modal>
            </div>

        )
    }
}


export default Rule;

