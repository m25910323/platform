export default [{
	path: 'customer',
	name: 'customer',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/salesCenter/customerManage/customer.vue')
},
//银行管理
{
	path: 'bankManage',
	name: 'bankManage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/salesCenter/bankManage.vue')
}]