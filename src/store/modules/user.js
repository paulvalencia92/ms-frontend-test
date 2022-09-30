import axios from "axios";

export default {
    namespaced: true,
    state: {
        users: []
    },
    getters: {
        senders(state) {
            if (!state.users.length) return;
            return state.users
                .filter(user => user.type == 'emisor')
                .map(sender => {
                    return {value: sender.id, text: `${sender.name} | ${sender.nit}`}
                });
        },
        receivers(state) {
            if (!state.users.length) return;
            return state.users
                .filter(user => user.type == 'receptor')
                .map(sender => {
                    return {value: sender.id, text: `${sender.name} | ${sender.nit}`}
                });
        }
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        }
    },
    actions: {
        async getUsers({commit}) {
            const {data} = await axios.get('/api/users');
            commit('SET_USERS', data);
        },

    },
};
