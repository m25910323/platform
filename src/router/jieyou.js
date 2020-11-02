//税务
// import customer from '../views/customerManage/customer.vue' //发票录入
import user from '../views/manageSet/user.vue' //管理设置-用户
import cashier from '../views/receivableAccounts/cashier.vue' //应收账款-收银台
import cashierDailyReport from '../views/receivableAccounts/cashierDailyReport.vue' //应收账款-收银日报表

export default [
// 	{
// 	path: 'customer',
// 	name: 'customer',
// 	component: () =>
// 		import( /* webpackChunkName: "about" */ '../views/customerManage/customer.vue')
// },
{
	path: 'cashier',
	name: 'cashier',
	component: () =>
		import( /* webpackChunkName: "about" */ '../views/receivableAccounts/cashier.vue')
},{
	path: 'cashierDailyReport',
	name: 'cashierDailyReport',
	component: () =>
		import( /* webpackChunkName: "about" */ '../views/receivableAccounts/cashierDailyReport.vue')
},{
	path: 'user',
	name: 'user',
	component: () =>
		import( /* webpackChunkName: "about" */ '../views/manageSet/user.vue')
},{
	path: 'test',
	name: 'test',
	component: () =>
		import( /* webpackChunkName: "about" */ '../views/manageSet/test.vue')
}]