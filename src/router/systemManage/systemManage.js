export default [
	//单据类型
	{
		path: 'receipts',
		name: 'receipts',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/hrSet/receipts/receiptsSet.vue')
	},
	{
		path: 'approveSet',
		name: 'approveSet',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/hrSet/approveSet/approveSet.vue')
	},
	{
		path: 'attendanceSet',
		name: 'attendanceSet',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/hrSet/attendanceSet/attendanceSet.vue')
	},
	{
		path: 'message',
		name: 'message',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/hrSet/messageManage/message.vue')
	},
	
	{
		path: 'formula',
		name: 'formula',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/setCenter/formula.vue')
	},
	{
		path: 'template',
		name: 'template',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/setCenter/template.vue')
	},
	{
		path: 'rate',
		name: 'rate',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/setCenter/rate.vue')
	},
	{
		path: 'stampduty',
		name: 'stampduty',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/setCenter/stampduty.vue')
	},
	//所得税核定征收率配置
	{
		path: 'incomeTaxSet',
		name: 'incomeTaxSet',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/setCenter/incomeTaxSet.vue')
	},
	//防伪税控减征额配置
	{
		path: 'taxReductionSet',
		name: 'taxReductionSet',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/setCenter/taxReductionSet.vue')
	},
	{
		path: 'taxnotice',
		name: 'taxnotice',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/taxnotice.vue')
	},
	{
		path: 'dictionary',
		name: 'dictionary',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/systemManage/dictionary.vue')
	},
]
