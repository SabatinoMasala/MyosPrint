import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: require('@/components/FicheEditor')
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