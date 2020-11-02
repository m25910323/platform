export default [
	//工作台
	{
		path: 'workbench',
		name: 'workbench',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/workbench.vue')
	},
	//客服分配
	{
		path: 'customerServiceAssign',
		name: 'customerServiceAssign',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/customerServiceAssign.vue')
	},
	//往来客服分配
	{
		path: 'contactAssign',
		name: 'contactAssign',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/contactAssign.vue')
	},
	//往来通知
	{
		path: 'contactDetail',
		name: 'contactDetail',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/contactDetail.vue')
	},
	//客服查询
	{
		path: 'customerServiceQuery',
		name: 'customerServiceQuery',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/customerServiceQuery.vue')
	},
	//收账通知分配
	{
		path: 'debtCollectionAssign',
		name: 'debtCollectionAssign',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/debtCollectionAssign.vue')
	},
	//收账通知明细
	{
		path: 'debtCollectionDetail',
		name: 'debtCollectionDetail',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/debtCollectionDetail.vue')
	},
	//税款通知分配
	{
		path: 'taxationAssign',
		name: 'taxationAssign',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/taxationAssign.vue')
	},
	//税款通知明细
	{
		path: 'taxationDetail',
		name: 'taxationDetail',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/taxationDetail1.vue')
	},
	//税款通知明细
	{
		path: 'taxationDetail1',
		name: 'taxationDetail1',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/taxationDetail.vue')
	},
	//问票通知分配
	{
		path: 'ticketAssign',
		name: 'ticketAssign',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/ticketAssign.vue')
	},
	//问票通知明细
	{
		path: 'ticketDetail',
		name: 'ticketDetail',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/ticketDetail.vue')
	},
	//客服配置
	{
		path: 'customerServiceSet',
		name: 'customerServiceSet',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/customerServiceSet.vue')
	},
	//通话记录查询
	{
		path: 'callRecords',
		name: 'callRecords',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/callRecords.vue')
	},
	//通话详情
	{
		path: 'callDetail',
		name: 'callDetail',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/callDetail.vue')
	},
	//工单管理
	{
		path: 'worksOrderManage',
		name: 'worksOrderManage',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/worksOrderManage/worksOrderManage.vue')
	},
	//工单处理
	{
		path: 'worksOrderDeal',
		name: 'worksOrderDeal',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/worksOrderManage/worksOrderDeal.vue')
	},
	//工单审核
	{
		path: 'worksOrderApprove',
		name: 'worksOrderApprove',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/worksOrderManage/worksOrderApprove.vue')
	},
	//工单统计
	{
		path: 'worksOrderStatistics',
		name: 'worksOrderStatistics',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/statistics/worksOrderStatistics.vue')
	},
	//通话统计
	{
		path: 'callStatistic',
		name: 'callStatistic',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/statistics/callStatistic.vue')
	},
	//信息查询
	{
		path: 'informationSearch',
		name: 'informationSearch',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/informationSearch/information.vue')
	},
	
	//通话统计
	{
		path: 'messagePush',
		name: 'messagePush',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/messagePush.vue')
	},
	//信息查询
	{
		path: 'messageCreate',
		name: 'messageCreate',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/callCenter/messageCreate.vue')
	},
]
