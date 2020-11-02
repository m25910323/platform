export default [
	{
		//员工薪酬记录
		path: 'salaryRecord',
		name: 'salaryRecord',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/salaryRecord/salaryRecord.vue')
	},
	{
		//员工流动记录
		path: 'yearHoliday',
		name: 'yearHoliday',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/yearHoliday/yearHoliday.vue')
	},
	{
		//带薪病假记录
		path: 'sickLeave',
		name: 'sickLeave',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/sickLeave/sickLeave.vue')
	},
	{
		//年假统计表
		path: 'empFlowSituation',
		name: 'empFlowSituation',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/empFlowSituation/empFlowSituation.vue')
	},
	{
		//员工流动记录统计表
		path: 'empFlow',
		name: 'empFlow',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/empFlow/empFlow.vue')
	},
	{
		//员工管理-入职
		path: 'induction',
		name: 'induction',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/inductionManage/induction.vue')
	},
	{
		//员工管理-离职
		path: 'demission',
		name: 'demission',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/demissionManage/demission.vue')
	},
	{
		//员工信息
		path: 'employeeInfo',
		name: 'employeeInfo',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/employeeInfo/employeeInfo.vue')
	},
	{
		//在职员工确认
		path: 'employeeConfirm',
		name: 'employeeConfirm',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/employeeConfirm/employeeConfirm.vue')
	},
	{
		path: 'organization',
		name: 'organization',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/organizationManage/organization.vue')
	},
	{
		path: 'organizationManage',
		name: 'organizationManage',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/organizationManage/organizationManage.vue')
	},
	{
		//考勤异常
		path: 'unusual',
		name: 'unusual',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/attendanceManage/unusual/unusual.vue')
	},
	{
		//考勤汇总
		path: 'summary',
		name: 'summary',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/attendanceManage/summary/summary.vue')
	},
	{
		//假期管理
		path: 'holiday',
		name: 'holiday',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/attendanceManage/holiday/holiday.vue')
	},
	{
		//假勤审批
		path: 'approve',
		name: 'approve',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/attendanceManage/approve/approve.vue')
	},
	{
		//考勤记录
		path: 'record',
		name: 'record',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/attendanceManage/record/record.vue')
	},
	{
		//员工服务-离职申请
		path: 'demissionApply',
		name: 'demissionApply',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeService/demissionApply/demissionApply.vue')
	},
	{
		//员工服务-转岗申请
		path: 'transferApply',
		name: 'transferApply',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeService/transferApply/transferApply.vue')
	},
	{
		//员工服务-转岗申请
		path: 'transferApprove',
		name: 'transferApprove',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeManage/transferApprove/transferApprove.vue')
	},
	{
		//员工服务-假勤申请
		path: 'holidayApply',
		name: 'holidayApply',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeService/holidayApply/holidayApply.vue')
	},
	{
		//员工服务-考勤确认
		path: 'checkAttendance',
		name: 'checkAttendance',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/employeeService/checkAttendance/checkAttendance.vue')
	},
	{
		//短信管理
		path: 'message',
		name: 'message',
		component: () =>
			import( /* webpackChunkName: "about" */ '../../views/hrmManage/messageManage/message.vue')
	},
]
