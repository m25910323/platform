import Vue from 'vue'
import Router from 'vue-router'

import jieyou from './router/jieyou.js'
import hrm from './router/hrmManage/hrm.js'
import salesCenter from './router/salesCenter/salesCenter.js'
import callCenter from './router/callCenter/callCenter.js'
import financeCalculateCenter from './router/financeCalculateCenter/financeCalculateCenter.js'
import systemManage from './router/systemManage/systemManage.js'
import accountFactory from './router/accountFactory/accountFactory.js'
Vue.use(Router)

export default new Router({
	routes: [

		{
			path: '/',
			redirect: '/index/personalIncomeIndex'
		},
		
		{
			path: '/index',
			name: 'index',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				
				...jieyou,
				...hrm,
				...accountFactory,
				{
					path: 'personalIncomeIndex',
					name: 'personalIncomeIndex',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/personalIncomeIndex.vue')
				},
				{
					path: 'salesCenter',
					name: 'salesCenter',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/salesCenter.vue')
				},
				{
					path: 'accountFactory',
					name: 'accountFactory',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/accountFactory.vue')
				},
				{
					path: 'systemManage',
					name: 'systemManage',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/systemManage.vue')
				},
				{
					path: 'hrmManage',
					name: 'hrmManage',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/hrmManage.vue')
				},
				{
					path: 'financeCalculateCenter',
					name: 'financeCalculateCenter',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/financeCalculateCenter.vue')
				},
				{
					path: 'fileCenter',
					name: 'fileCenter',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/fileCenter.vue')
				},
				{
					path: 'callCenter',
					name: 'callCenter',
					component: () =>
						import( /* webpackChunkName: "about" */ './views/callCenter.vue')
				},
			]
		},
		{
			path: '/accountFactory',
			name: 'accountFactory',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				...accountFactory,
			]
		},
		{
			path: '/hrmManage',
			name: 'hrmManage',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				...hrm,
			]
		},
		{
			path: '/salesCenter',
			name: 'salesCenter',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				...salesCenter,
			]
		},
		
		{
			path: '/financeCalculateCenter',
			name: 'financeCalculateCenter',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				...financeCalculateCenter,
			]
		},
		{
			path: '/callCenter',
			name: 'callCenter',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				...callCenter,
			]
		},
		{
			path: '/systemManage',
			name: 'systemManage',
			component: () =>
				import( /* webpackChunkName: "about" */ './views/index.vue'),
			children: [
				...systemManage,
			]
		},
		{
			path: '*',
			redirect: '/index/personalIncomeIndex'
		}
		// {
		//   path: '/about',
		//   name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		// component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		// }

	]
})
