import axios from "axios";

export default {
    namespaced: true,
    state: {
        products: [],
    },
    getters: {
        productsOptions(state){
            return state.products.map(product => {
                return {value: product.id, text: product.name}
            })
        }
    },
    mutations: {
        SET_PRODUCTS(state, products) {
            state.products = products;
        }
    },
    actions: {
        async getProducts({commit}) {
            const {data} = await axios.get('/api/products');
            commit('SET_PRODUCTS', data);
        }

    },
};
