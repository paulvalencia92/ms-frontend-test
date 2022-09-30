import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";
import axios from 'axios';
import productModule from './modules/products';
import invoiceModule from './modules/invoice';
import userModule from './modules/user';

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    store: window.localStorage,
    key: 'vuex',
    reducer(val) {
        if (val.access_token === null) {
            return {}
        }
        return val
    }
});

// Create store

const store = new Vuex.Store({
    state: {
        access_token: null,
        user: null,
        loggedIn: false,
        errorMessages: []
    },
    mutations: {
        SET_LOGGED_IN(state, data) {
            state.access_token = data.access_token;
            state.user = data.user;
            state.loggedIn = true;
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
        },
        UPDATE_USER(state, userUpdated) {
            state.user = userUpdated;
        },
        CLEAR_USER_DATA(state, data) {
            state.access_token = null;
            state.user = null;
            state.loggedIn = false;
        },
        SET_ERRORS(state, errorMessages) {
            state.errorMessages = errorMessages;
        },
        CLEAR_ERRORS(state) {
            state.errorMessages = [];
        }
    },
    actions: {
        async login(context, user) {
            try {
                const response = await axios.post('/api/login', user);
                context.commit('SET_LOGGED_IN', response.data);
                return Promise.resolve(response.data);
            } catch (e) {
                const errorMessages = Object.values(e.response.data.errors);
                context.commit('SET_ERRORS', errorMessages);
                return Promise.reject('danger');
            }
        },
        async logout(context) {
            const response = await axios.post('/api/logout');
            context.commit('CLEAR_USER_DATA');
            return Promise.resolve(response.data);
        },
        async updateUser(context, user) {
            try {
                const response = await axios.put(`/api/users/${user.id}`, user);
                console.log(response.data)
                context.commit('UPDATE_USER', response.data);
                return Promise.resolve('Usuario actualizado correctamente');
            } catch (e) {
                const errorMessages = Object.values(e.response.data.errors);
                context.commit('SET_ERRORS', errorMessages);
                return Promise.reject('danger');
            }
        },
    },
    modules: {
        productModule,
        userModule,
        invoiceModule,
    },
    plugins: [vuexLocal.plugin]
})

axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.state.access_token
export default store
