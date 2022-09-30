import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../store/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import(/* webpackChunkName: "about" */ '../views/Login/Index.vue'),
        meta: {auth: false}
    },
    {
        path: '/facturas',
        name: 'Invoice',
        component: () => import(/* webpackChunkName: "about" */ '../views/Invoice/List.vue'),
        meta: {auth: true}
    },
    {
        path: '/facturas/generar',
        name: 'InvoiceGenerate',
        component: () => import(/* webpackChunkName: "about" */ '../views/Invoice/Create.vue'),
        meta: {auth: true}
    },
    {
        path: '/edit-profile',
        name: 'EditProfile',
        component: () => import(/* webpackChunkName: "about" */ '../views/EditProfile/Index.vue'),
        meta: {auth: true}
    },

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {


    const publicPages = ['/', '/register']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = store.state.loggedIn
    if (to.name == 'Triqui') {
        next()
    } else if (to.meta.auth) {
        if (authRequired && loggedIn === false) {
            return next('/')
        }
    } else {
        if (loggedIn) {
            return next('/edit-profile')
        } else {
            next()
        }
    }
    next()

});

export default router
