//问诊模型
export const illDate = {
    ill1:[
        {
            key:'symptom',
            content:[
                {
                    title:'您目前有无以下不适症状？',
                    answer:[

                        {
                            title:'暂无',
                            showNext:false,
                            key:'暂无',
                        },
                        {
                            title:'发热',
                            showNext:false,
                            key:'发热',
                        },
                        {
                            title:'咳嗽',
                            showNext:false,
                            key:'咳嗽',
                        },
                        {
                            title:'鼻塞',
                            showNext:false,
                            key:'鼻塞',
                        },
                        {
                            title:'流涕',
                            showNext:false,
                            key:'流涕',
                        },
                        {
                            title:'呼吸困难',
                            showNext:false,
                            key:'呼吸困难',
                        },
                        {
                            title:'腹泻',
                            showNext:false,
                            key:'腹泻',
                        },
                        {
                            title:'咽痛',
                            showNext:false,
                            key:'咽痛',
                        }
                    ],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'symptom_long',
            content:[
                {
                    title:'您的症状持续多久了？',
                    answer:[
                        {
                            title:'1~3天',
                            showNext:false,
                            key:'one_three',
                        },
                        {
                            title:'4~7天',
                            showNext:false,
                            key:'four_seven',
                        },
                        {
                            title:'8~14天',
                            showNext:false,
                            key:'eight_fourteen',
                        },
                        {
                            title:'多于14天',
                            showNext:false,
                            key:'more_fourteen',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'temperature',
            content:[
                {
                    title:'您目前的体温是？（摄氏度）',
                    answer:[],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'travel_wuhan_abroad',
            content:[
                {
                    title:'您是否有武汉或国际旅行居住史？',
                    answer:[
                        {
                            title:'是',
                            showNext:false,
                            key:'true',
                        },
                        {
                            title:'否',
                            showNext:false,
                            key:'false',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'live_wuhan_abroad',
            content:[
                {
                    title:'您最近14天内是否去过武汉或国外？',
                    answer:[
                        {
                            title:'是',
                            showNext:false,
                            key:'true',
                        },
                        {
                            title:'否',
                            showNext:false,
                            key:'false',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'contact_wuhan_abroad',
            content:[
                {
                    title:'您最近14天内是否接触过来自武汉或国外的人员？',
                    answer:[
                        {
                            title:'是',
                            showNext:false,
                            key:'true',
                        },
                        {
                            title:'否',
                            showNext:false,
                            key:'false',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
    ],
    ill2:[
        {
            key:'disease',
            content:[
                {
                    title:'是否有疾病史？',
                    answer:[
                        {
                            title:'无',
                            showNext:false,
                            key:'无',
                        },
                        {
                            title:'有',
                            showNext:true,
                            key:'有',
                        },
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                },
                {
                    title:'请选择疾病名称（可多选）',
                    answer:[
                        {
                            title:'高血压',
                            key:'高血压',
                            showNext:false,
                        },
                        {
                            title:'脑卒中',
                            key:'脑卒中',
                            showNext:false
                        },
                        {
                            title:'冠心病',
                            key:'冠心病',
                            showNext:false
                        },
                        {
                            title:'外周血管病',
                            key:'外周血管病',
                            showNext:false
                        },
                        {
                            title:'糖尿病',
                            key:'糖尿病',
                            showNext:false
                        },
                        {
                            title:'脂肪肝',
                            key:'脂肪肝',
                            showNext:false
                        },
                        {
                            title:'慢性肾脏疾病',
                            key:'慢性肾脏疾病',
                            showNext:false
                        },
                        {
                            title:'慢性胃炎或胃溃疡',
                            key:'慢性胃炎或胃溃疡',
                            showNext:false
                        },
                        {
                            title:'幽门螺杆菌感染',
                            key:'幽门螺杆菌感染',
                            showNext:false
                        },
                        {
                            title:'胃息肉',
                            key:'胃息肉',
                            showNext:false
                        },
                        {
                            title:'肠道息肉',
                            key:'肠道息肉',
                            showNext:false
                        },
                        {
                            title:'慢性阻塞性肺病',
                            key:'慢性阻塞性肺病',
                            showNext:false
                        },
                        {
                            title:'哮喘',
                            key:'哮喘',
                            showNext:false
                        },
                        {
                            title:'慢性胰腺炎',
                            key:'慢性胰腺炎',
                            showNext:false
                        },
                        {
                            title:'骨质疏松',
                            key:'骨质疏松',
                            showNext:false
                        },
                        {
                            title:'慢性肝炎或肝硬化',
                            key:'慢性肝炎或肝硬化',
                            showNext:false
                        },
                        {
                            title:'慢性胆囊炎、胆石症',
                            key:'慢性胆囊炎、胆石症',
                            showNext:false
                        },
                        {
                            title:'结核病',
                            key:'结核病',
                            showNext:false
                        },
                        {
                            title:'类风湿性关节炎',
                            key:'类风湿性关节炎',
                            showNext:false
                        },
                        {
                            title:'前列腺炎或肥大',
                            key:'前列腺炎或肥大',
                            showNext:false
                        },
                        {
                            title:'慢性乳腺疾病',
                            key:'慢性乳腺疾病',
                            showNext:false
                        },
                        {
                            title:'血脂异常',
                            key:'血脂异常',
                            showNext:false
                        },
                        {
                            title:'人乳头瘤病毒(HPV)感染',
                            key:'人乳头瘤病毒(HPV)感染',
                            showNext:false
                        },
                        {
                            title:'尿酸升高',
                            key:'尿酸升高',
                            showNext:false
                        },
                        {
                            title:'恶性肿瘤',
                            key:'恶性肿瘤',
                            showNext:false
                        },
                        {
                            title:'其他',
                            key:'其他',
                            showNext:false
                        }],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:false, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'operation',
            content:[
                {
                    title:'是否有手术外伤史？',
                    answer:[
                        {
                            title:'无',
                            showNext:false,
                            key:'无',
                        },
                        {
                            title:'有',
                            showNext:true,
                            key:'有',
                        },
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                },
                {
                    title:'请选择手术的部位（可多选）',
                    answer:[
                        {
                            title:'头颅(含脑)',
                            key:'头颅(含脑)',
                            showNext:false,
                        },
                        {
                            title:'眼',
                            key:'眼',
                            showNext:false
                        },
                        {
                            title:'耳鼻咽喉',
                            key:'耳鼻咽喉',
                            showNext:false
                        },
                        {
                            title:'颌面部及口腔',
                            key:'颌面部及口腔',
                            showNext:false
                        },
                        {
                            title:'颈部或甲状腺',
                            key:'颈部或甲状腺',
                            showNext:false
                        },
                        {
                            title:'胸部(含肺部)',
                            key:'胸部(含肺部)',
                            showNext:false
                        },
                        {
                            title:'心脏(含心脏介入)',
                            key:'心脏(含心脏介入)',
                            showNext:false
                        },
                        {
                            title:'外周血管',
                            key:'外周血管',
                            showNext:false
                        },
                        {
                            title:'胃肠',
                            key:'胃肠',
                            showNext:false
                        },
                        {
                            title:'肝胆',
                            key:'肝胆',
                            showNext:false
                        },
                        {
                            title:'肾脏',
                            key:'肾脏',
                            showNext:false
                        },
                        {
                            title:'脊柱',
                            key:'脊柱',
                            showNext:false
                        },
                        {
                            title:'乳腺',
                            key:'乳腺',
                            showNext:false
                        },
                        {
                            title:'前列腺',
                            key:'前列腺',
                            showNext:false
                        },
                        {
                            title:'其他',
                            key:'其他',
                            showNext:false
                        }],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:false, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'family',
            content:[
                {
                    title:'是否有家族史？（指父母，祖父母，外祖父母等直系亲属）',
                    answer:[
                        {
                            title:'无',
                            showNext:false,
                            key:'无',
                        },
                        {
                            title:'有',
                            showNext:true,
                            key:'有',
                        },
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                },
                {
                    title:'请选择疾病名称（可多选）',
                    answer:[
                        {
                            title:'高血压病',
                            key:'高血压病',
                            showNext:false,
                        },
                        {
                            title:'脑卒中',
                            key:'脑卒中',
                            showNext:false
                        },
                        {
                            title:'冠心病',
                            key:'冠心病',
                            showNext:false
                        },
                        {
                            title:'外周血管病',
                            key:'外周血管病',
                            showNext:false
                        },
                        {
                            title:'心力衰竭',
                            key:'心力衰竭',
                            showNext:false
                        },
                        {
                            title:'糖尿病',
                            key:'糖尿病',
                            showNext:false
                        },
                        {
                            title:'肥胖症',
                            key:'肥胖症',
                            showNext:false
                        },
                        {
                            title:'慢性肾脏疾病',
                            key:'慢性肾脏疾病',
                            showNext:false
                        },
                        {
                            title:'慢性阻塞性肺病',
                            key:'慢性阻塞性肺病',
                            showNext:false
                        },
                        {
                            title:'骨质疏松',
                            key:'骨质疏松',
                            showNext:false
                        },
                        {
                            title:'痛风',
                            key:'痛风',
                            showNext:false
                        },
                        {
                            title:'恶性肿瘤',
                            key:'恶性肿瘤',
                            showNext:false
                        },
                        {
                            title:'风湿免疫性疾病',
                            key:'风湿免疫性疾病',
                            showNext:false
                        },
                        {
                            title:'精神疾病',
                            key:'精神疾病',
                            showNext:false
                        },
                        {
                            title:'其他',
                            key:'其他',
                            showNext:false
                        }],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:false, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'allergy',
            content:[
                {
                    title:'是否有过敏史？',
                    answer:[
                        {
                            title:'无',
                            showNext:false,
                            key:'无',
                        },
                        {
                            title:'有',
                            showNext:true,
                            key:'有',
                        },
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                },
                {
                    title:'请选择过敏源（可多选）',
                    answer:[
                        {
                            title:'青霉素',
                            key:'青霉素',
                            showNext:false,
                        },
                        {
                            title:'磺胺类',
                            key:'磺胺类',
                            showNext:false
                        },
                        {
                            title:'链霉素',
                            key:'链霉素',
                            showNext:false
                        },
                        {
                            title:'头孢类',
                            key:'头孢类',
                            showNext:false
                        },
                        {
                            title:'鸡蛋',
                            key:'鸡蛋',
                            showNext:false
                        },
                        {
                            title:'牛奶',
                            key:'牛奶',
                            showNext:false
                        },
                        {
                            title:'海鲜',
                            key:'海鲜',
                            showNext:false
                        },
                        {
                            title:'花粉或尘螨',
                            key:'花粉或尘螨',
                            showNext:false
                        },
                        {
                            title:'粉尘',
                            key:'粉尘',
                            showNext:false
                        },
                        {
                            title:'洗洁剂',
                            key:'洗洁剂',
                            showNext:false
                        },
                        {
                            title:'化妆品',
                            key:'化妆品',
                            showNext:false
                        },
                        {
                            title:'其他',
                            key:'其他',
                            showNext:false
                        }],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:false, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'bear',
            content:[
                {
                    title:'是否有生育史？',
                    answer:[
                        {
                            title:'已生育',
                            showNext:false,
                            key:'done',
                        },
                        {
                            title:'未生育',
                            showNext:false,
                            key:'not',
                        },
                        {
                            title:'备孕期',
                            showNext:false,
                            key:'prepare',
                        },
                        {
                            title:'怀孕期',
                            showNext:false,
                            key:'have',
                        },
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'smoke',
            content:[
                {
                    title:'是否有吸烟史？',
                    answer:[
                        {
                            title:'不吸烟',
                            showNext:false,
                            key:'not',
                        },
                        {
                            title:'吸烟',
                            showNext:false,
                            key:'yes',
                        },
                        {
                            title:'吸烟，已戒(戒烟1年以上)',
                            showNext:false,
                            key:'cut',
                        },
                        {
                            title:'被动吸烟(每天累计15分钟以上，且每周1天以上)',
                            showNext:false,
                            key:'passive',
                        },
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'drink',
            content:[
                {
                    title:'是否有饮酒史？',
                    answer:[
                        {
                            title:'不喝',
                            showNext:false,
                            key:'not',
                        },
                        {
                            title:'喝',
                            showNext:false,
                            key:'yes',
                        },
                        {
                            title:'以前喝，现已戒酒(戒酒1年以上)',
                            showNext:false,
                            key:'cut',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:true // 是否必填
                }
            ]
        },
        {
            key:'motion',
            content:[
                {
                    title:'您的运动习惯是？',
                    answer:[
                        {
                            title:'不运动',
                            showNext:false,
                            key:'not',
                        },
                        {
                            title:'不定期运动',
                            showNext:false,
                            key:'sometimes',
                        },
                        {
                            title:'1~2次/周',
                            showNext:false,
                            key:'one_two',
                        },
                        {
                            title:'3~4次/周',
                            showNext:false,
                            key:'three_four',
                        }
                        ,
                        {
                            title:'5~6次/周',
                            showNext:false,
                            key:'five_six',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'meal',
            content:[
                {
                    title:'您通常能够按时吃三餐吗?',
                    answer:[
                        {
                            title:'能',
                            showNext:false,
                            key:'can',
                        },
                        {
                            title:'基本能',
                            showNext:false,
                            key:'basic',
                        },
                        {
                            title:'不能',
                            showNext:false,
                            key:'not',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'dinner_party',
            content:[
                {
                    title:'您参加请客吃饭（应酬）情况是?',
                    answer:[
                        {
                            title:'不参加或偶尔参加(1～2次／月)',
                            showNext:false,
                            key:'sometimes',
                        },
                        {
                            title:'比较多(1~2次/周)',
                            showNext:false,
                            key:'more',
                        },
                        {
                            title:'经常参加(3～5次/周)',
                            showNext:false,
                            key:'often',
                        },
                        {
                            title:'非常频繁(>5次／周)',
                            showNext:false,
                            key:'frequency',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'taste',
            content:[
                {
                    title:'您的饮食口味是?（可多选）',
                    answer:[
                        {
                            title:'清淡',
                            showNext:false,
                            key:'清淡',
                        },
                        {
                            title:'咸',
                            showNext:false,
                            key:'咸',
                        },
                        {
                            title:'甜',
                            showNext:false,
                            key:'甜',
                        },
                        {
                            title:'高油脂',
                            showNext:false,
                            key:'高油脂',
                        },
                        {
                            title:'辛辣',
                            showNext:false,
                            key:'辛辣',
                        },
                        {
                            title:'热烫',
                            showNext:false,
                            key:'热烫',
                        }
                    ],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'diet',
            content:[
                {
                    title:'您的饮食偏好是?（可多选）',
                    answer:[
                        {
                            title:'熏制、腌制类',
                            showNext:false,
                            key:'熏制、腌制类',
                        },
                        {
                            title:'油炸食品',
                            showNext:false,
                            key:'油炸食品',
                        },
                        {
                            title:'甜点',
                            showNext:false,
                            key:'甜点',
                        },
                        {
                            title:'零食（适量坚果除外）',
                            showNext:false,
                            key:'零食（适量坚果除外）',
                        },
                        {
                            title:'快餐',
                            showNext:false,
                            key:'快餐',
                        },
                        {
                            title:'喝粥(≥2次／天)',
                            showNext:false,
                            key:'喝粥(≥2次／天)',
                        },
                        {
                            title:'其他',
                            showNext:false,
                            key:'其他',
                        }
                    ],
                    answerMore:true, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'food',
            content:[
                {
                    title:'您的主食结构如何？',
                    answer:[

                        {
                            title:'细粮为主',
                            showNext:false,
                            key:'thin',
                        },
                        {
                            title:'粗粮搭配',
                            showNext:false,
                            key:'together',
                        },
                        {
                            title:'粗粮为主',
                            showNext:false,
                            key:'wide',
                        },

                        {
                            title:'不好说',
                            showNext:false,
                            key:'unknown',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'sleep',
            content:[
                {
                    title:'您的整体睡眠情况是？',
                    answer:[

                        {
                            title:'睡眠良好',
                            showNext:false,
                            key:'good',
                        },
                        {
                            title:'一般',
                            showNext:false,
                            key:'normal',
                        },
                        {
                            title:'较差',
                            showNext:false,
                            key:'bad',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },
        {
            key:'sleep_long',
            content:[
                {
                    title:'您的睡眠时长是？',
                    answer:[

                        {
                            title:'小于5小时/天',
                            showNext:false,
                            key:'less_five',
                        },
                        {
                            title:'5~7小时/天',
                            showNext:false,
                            key:'five_seven',
                        },
                        {
                            title:'8~10小时/天',
                            showNext:false,
                            key:'eight_ten',
                        },
                        {
                            title:'大于10小时/天',
                            showNext:false,
                            key:'more_ten',
                        }
                    ],
                    answerMore:false, // 答案是否支持多选
                    chooseAnswer:[], //答案
                    isShow:true, // 是否展示该问题
                    isMust:false // 是否必填
                }
            ]
        },

    ]
}