
export default {
    namespace: 'layout',
    state: {
        sendMsg:[],
        historyMsg:[],
        isSocket:false,
        orderNo:'',
        playStatus:'STOPPED'
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {

            });
        },

    },
    effects: {

    },
    reducers: {
        setData(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    },

};
