export default [{
	path: 'incomeTaxCalculate',
	name: 'incomeTaxCalculate',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/incomeTaxCalculate.vue')
},{
	path: 'initialSheet',
	name: 'initialSheet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/initialSheet.vue')
}, {
	path: 'employeeDetail',
	name: 'employeeDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/employeeDetail.vue')
},{
	path: 'paySheet',
	name: 'paySheet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/paySheet.vue')
},
{
	path: 'payEdit',
	name: 'payEdit',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/payEdit.vue')
},
{
	path: 'sheetSubmit',
	name: 'sheetSubmit',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/sheetSubmit.vue')
},
{
	path: 'invoice_o',
	name: 'invoice_o',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/invoice_o.vue')
},{
	path: 'invoice_t',
	name: 'invoice_t',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/invoice_t.vue')
},{
	path: 'audit',
	name: 'audit',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/audit.vue')
},
{
	path: 'reportForms',
	name: 'reportForms',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/reportForms.vue')
},

{
	path: 'showReport',
	name: 'showReport',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/showReport.vue')
},
{
	path: 'progress',
	name: 'progress',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/progress.vue')
},{
	path: 'progress2',
	name: 'progress2',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/progress2.vue')
},{
	path: 'statistics',
	name: 'statistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/statistics.vue')
},{
	path: 'taxConfirm',
	name: 'taxConfirm',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/taxConfirm.vue')
},{
	path: 'taxDeclare',
	name: 'taxDeclare',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/taxDeclare.vue')
},{
	path: 'taxQuery',
	name: 'taxQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/taxQuery.vue')
},{
	path: 'allotDoaccount',
	name: 'allotDoaccount',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/allotDoaccount.vue')
},{
	path: 'allotApprove',
	name: 'allotApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/allotApprove.vue')
},{
	path: 'allotApproveAgain',
	name: 'allotApproveAgain',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/allotApproveAgain.vue')
},{
	path: 'allotTaxConfirm',
	name: 'allotTaxConfirm',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/allotTaxConfirm.vue')
},
//收账通知分配
{
	path: 'allotDebtCollection',
	name: 'allotDebtCollection',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/allotDebtCollection.vue')
},
//一级统计表
{
	path: 'totalStatistics',
	name: 'totalStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalStatistics.vue')
},
//税款确认统计表
{
	path: 'totalTaxConfirmStatistics',
	name: 'totalTaxConfirmStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalTaxConfirmStatistics.vue')
},
//税款审核统计表
{
	path: 'totalTaxApproveStatistics',
	name: 'totalTaxApproveStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalTaxApproveStatistics.vue')
},
//凭证审核统计表
{
	path: 'totalVoucherApproveStatistics',
	name: 'totalVoucherApproveStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalVoucherApproveStatistics.vue')
},
//纳税申报统计表
{
	path: 'totalTaxDeclareStatistics',
	name: 'totalTaxDeclareStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalTaxDeclareStatistics.vue')
},
//发票审核统计表
{
	path: 'totalInvoiceApproveStatistics',
	name: 'totalInvoiceApproveStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalInvoiceApproveStatistics.vue')
},
//发票上传统计表
{
	path: 'totalUploadStatistics',
	name: 'totalUploadStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalUploadStatistics.vue')
},
//收账通知统计表
{
	path: 'totalDebtCollectionStatistics',
	name: 'totalDebtCollectionStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalDebtCollectionStatistics.vue')
},
//凭证待入库统计表
{
	path: 'totalStorageStatistics',
	name: 'totalStorageStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/totalStorageStatistics.vue')
},

//税种鉴定
{
	path: 'taxEvaluation',
	name: 'taxEvaluation',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/taxEvaluation.vue')
},
//所得税问题处理池
{
	path: 'incomeTaxDeal',
	name: 'incomeTaxDeal',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/incomeTaxDeal.vue')
},

//报表审核
{
	path: 'reportFormsApprove',
	name: 'reportFormsApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/reportFormsApprove.vue')
},
//利润通知
{
	path: 'profitNotice',
	name: 'profitNotice',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/profitNotice.vue')
},
//历史税款
{
	path: 'taxHistory',
	name: 'taxHistory',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/taxHistory.vue')
},
//汇算清缴查询 
{
	path: 'finalSettlement',
	name: 'finalSettlement',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/finalSettlement.vue')
},
//零申报未结账查询 
{
	path: 'zeroDeclareQuery',
	name: 'zeroDeclareQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/zeroDeclareQuery.vue')
},
//客户信息同步改动查询 
{
	path: 'customerHistory',
	name: 'customerHistory',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/customerHistory.vue')
},


//年终汇算
{
	path: 'settlementResultApprove',
	name: 'settlementResultApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/settlementResultApprove.vue')
},
//客户经理确认
{
	path: 'customerManagerConfirm',
	name: 'customerManagerConfirm',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/customerManagerConfirm.vue')
},
//客户经理联系
{
	path: 'customerManagerContact',
	name: 'customerManagerContact',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/customerManagerContact.vue')
},
//所得税问题处理
{
	path: 'yearincomeTaxDeal',
	name: 'yearincomeTaxDeal',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/incomeTaxDeal.vue')
},
//所得税问题处理
{
	path: 'yearTaxDeclare',
	name: 'yearTaxDeclare',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/yearTaxDeclare.vue')
},
//核定征收第五次申报
{
	path: 'yearTaxDeclareNF',
	name: 'yearTaxDeclareNF',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/yearTaxDeclareNF.vue')
},
//汇算票据跟踪
{
	path: 'instrumentTracking',
	name: 'instrumentTracking',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/instrumentTracking.vue')
},
//汇算票据查看
{
	path: 'settleResult',
	name: 'settleResult',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/settleResult.vue')
},
//汇算账务处理
{
	path: 'accountingTreatment',
	name: 'accountingTreatment',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/accountingTreatment.vue')
},
//价格建议审批
{
	path: 'priceAndSuggestionApprove',
	name: 'priceAndSuggestionApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/priceAndSuggestionApprove.vue')
},
//汇算账务
{
	path: 'settleDetail',
	name: 'settleDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/settleDetail.vue')
},
//年度汇算税款通知明细
{
	path: 'taxationDetail',
	name: 'taxationDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/taxationDetail.vue')
},
//收入差异处理
{
	path: 'contrastDiffer',
	name: 'contrastDiffer',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/yearEndSettlement/contrastDiffer.vue')
},
//短信发送记录
{
	path: 'smsRecord',
	name: 'smsRecord',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/accountFactory/smsRecord.vue')
},
]