import axios from "axios";

export default {
    namespaced: true,
    state: {
        invoices: [],
    },
    getters: {},
    mutations: {
        SET_INVOICES(state, invoices) {
            state.invoices = invoices;
        },
        UPDATE_INVOICE(state, invoice) {
            const index = state.invoices.findIndex(inv => inv.id == invoice.id)
            state.invoices.splice(index, 1, invoice)
        }
    },
    actions: {
        async getInvoices({commit}) {
            const {data} = await axios.get('/api/invoices');
            commit('SET_INVOICES', data);
        },
        async createInvoice({commit}, payload) {
            try {
                const {status} = await axios.post('/api/invoices', payload);
                return Promise.resolve(status);
            } catch (e) {
                const errorMessages = Object.values(e.response.data.errors);
                commit('SET_ERRORS', errorMessages, {root: true});
                return Promise.reject('danger');
            }
        },
        async updateInvoice({commit}, payload) {
            try {
                const {data, status} = await axios.put(`/api/invoices/${payload.id}`, payload);
                commit('UPDATE_INVOICE', data);
                return Promise.resolve(status);
            } catch (e) {
                const errorMessages = Object.values(e.response.data.errors);
                commit('SET_ERRORS', errorMessages, {root: true});
                return Promise.reject('danger');
            }
        },
        async deleteInvoice({commit}, id) {
            try {
                const {status} = await axios.delete(`/api/invoices/${id}`);
                return Promise.resolve(status);
            } catch (e) {
                const errorMessages = Object.values(e.response.data.errors);
                commit('SET_ERRORS', errorMessages, {root: true});
                return Promise.reject('danger');
            }
        }

    },
};
