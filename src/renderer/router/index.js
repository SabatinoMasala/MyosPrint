import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import Router from 'vue-router'

Vue.use(ElementUI);
Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: require('@/components/Home')
        },
        {
            path: '/production-proposal/:proposal_id',
            name: 'pp-detail',
            component: require('@/components/ProductionProposal')
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
