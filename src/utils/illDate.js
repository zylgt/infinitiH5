//问诊模型
export const illDate = {
    ill1:[
        {
            key:'one',
            question:'本次患病多久了？',  // 问题
            answer:[            //答案
                {
                    title:'一周内',    //答案名称
                    showInput:false,   //是否展示答案下方输入框
                    name:'week'
                },
                {
                    title:'一个月内',
                    showInput:false,
                    name:'month'
                },
                {
                    title:'半年内',
                    showInput:false,
                    name:'half_year'
                },
                {
                    title:'一年内',
                    showInput:false,
                    name:'year'
                }
            ],
            choose:'',    //选择的答案
            isInput:false, // 是否有输入框
            isShowInput:false, // 是否展示输入框
            title:'',  // 输入框的问题
            inputValue:'' //输入内容
        },
        {
            key:'two',
            question:'是否就该病情到医院就诊过？',
            answer:[
                {
                    title:'没有',
                    showInput:false,
                    name:'no'
                },
                {
                    title:'有',
                    showInput:true,
                    name:'yes'
                },
            ],
            choose:'',
            isInput:true,
            isShowInput:false,
            title:'请输入医院医生诊断的疾病名称',
            inputValue:'',
        },
        // {
        //     key:'three',
        //     question:'是否吃过药？',
        //     answer:[
        //         {
        //             title:'没有',
        //             showInput:false
        // name:'no'
        //         },
        //         {
        //             title:'有',
        //             showInput:true,
        // name:'yes'
        //         },
        //     ],
        //     choose:'',
        //     isInput:true,
        //     isShowInput:false,
        //     title:'请输入吃的药的名称',
        //     inputValue:'',
        // }
    ]
}