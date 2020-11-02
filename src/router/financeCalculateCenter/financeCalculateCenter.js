export default [{
	path: 'cashier',
	name: 'cashier',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashier.vue')
},

//银行对账步骤统计
{
	path: 'stepStatistics',
	name: 'stepStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/stepStatistics.vue')
},
//银行对账确认统计
{
	path: 'cashierStatistics',
	name: 'cashierStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashierStatistics.vue')
},

//银行签约
{
	path: 'bankSigning',
	name: 'bankSigning',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/bankSigning.vue')
},
//核对往来查询
{
	path: 'checkingContacts',
	name: 'checkingContacts',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/checkingContacts.vue')
},
{
	path: 'bankSet',
	name: 'bankSet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/bankSet.vue')
},{
	path: 'timeSet',
	name: 'timeSet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/timeSet.vue')
},
{
	path: 'customerTrack',
	name: 'customerTrack',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/customerTrack.vue')
},
{
	path: 'customerWill',
	name: 'customerWill',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/customerWill.vue')
},
{
	path: 'cashierDesk',
	name: 'cashierDesk',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashierDesk.vue')
},
//活动配置
{
	path: 'activity',
	name: 'activity',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/activity.vue')
},
//服务项目配置
{
	path: 'serviceAndItem',
	name: 'serviceAndItem',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/serviceAndItem.vue')
},
//价格配置
{
	path: 'contractPrice',
	name: 'contractPrice',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contractPrice.vue')
},
//低价合同配置
{
	path: 'lowpriceContract',
	name: 'lowpriceContract',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/lowpriceContract.vue')
},
//合同明细配置
{
	path: 'contactSvrItem',
	name: 'contactSvrItem',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contactSvrItem.vue')
},
{
	path: 'contractManage',
	name: 'contractManage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contractManage.vue')
},
{
	path: 'contractApprove',
	name: 'contractApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contractApprove.vue')
},
//发票上传
{
	path: 'invoiceUpload',
	name: 'invoiceUpload',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceUpload.vue')
},
//扫码上传
{
	path: 'qrcodeUpload',
	name: 'qrcodeUpload',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/qrcodeUpload.vue')
},
//扫码上传记录
{
	path: 'qrcodeRecord',
	name: 'qrcodeRecord',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/qrcodeRecord.vue')
},
//扫码上传记录详情
{
	path: 'qrcodeDetail',
	name: 'qrcodeDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/qrcodeDetail.vue')
},
//发票上传
{
	path: 'invoicePrint',
	name: 'invoicePrint',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoicePrint.vue')
},

//发票上传详情
{
	path: 'invoiceResult',
	name: 'invoiceResult',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceResult.vue')
},
//凭证发票查询
{
	path: 'invoiceQuery',
	name: 'invoiceQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceQuery.vue')
},
//发票审核
{
	path: 'invoiceApprove',
	name: 'invoiceApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceApprove.vue')
},
//发票审核
{
	path: 'invoiceApproveAgain',
	name: 'invoiceApproveAgain',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceApproveAgain.vue')
},
//发票二次审核
{
	path: 'invoiceDetailAgain',
	name: 'invoiceDetailAgain',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceDetailAgain.vue')
},
//发票列表
{
	path: 'invoiceDetail',
	name: 'invoiceDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceDetail.vue')
},
//信息记录
{
	path: 'noteRecord',
	name: 'noteRecord',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/noteRecord.vue')
},
//发票列表
{
	path: 'invoiceDetail1',
	name: 'invoiceDetail1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceDetail1.vue')
},
//结账状态查询
{
	path: 'voucherCheckoutQuery',
	name: 'voucherCheckoutQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherCheckoutQuery.vue')
},
//未签名票据识别
{
	path: 'invoiceSignature',
	name: 'invoiceSignature',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/invoiceSignature.vue')
},
//问票配置
{
	path: 'ticketSet',
	name: 'ticketSet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/ticketSet.vue')
},

//财务报表档案入库
{
	path: 'reportStorage',
	name: 'reportStorage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/reportStorage.vue')
},
//凭证入库
{
	path: 'evidenceStorage',
	name: 'evidenceStorage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/evidenceStorage.vue')
},
//账簿档案入库
{
	path: 'accountStorage',
	name: 'accountStorage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/accountStorage.vue')
},
//档案查询
{
	path: 'fileQuery',
	name: 'fileQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/fileQuery.vue')
},
//档案统计
{
	path: 'fileStatistics',
	name: 'fileStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/fileStatistics.vue')
},
//档案类别
{
	path: 'fileType',
	name: 'fileType',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/fileType.vue')
},
//档案借阅登记
{
	path: 'fileBorrow',
	name: 'fileBorrow',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/fileBorrow.vue')
},
//利润表
{
	path: 'profitStatement',
	name: 'profitStatement',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/profitStatement.vue')
},
//现金流量表表
{
	path: 'cashStatement',
	name: 'cashStatement',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashStatement.vue')
},
//资产负债表
{
	path: 'balanceStatement',
	name: 'balanceStatement',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/balanceStatement.vue')
},
//凭证汇总表
{
	path: 'vouchersSummary',
	name: 'vouchersSummary',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/vouchersSummary.vue')
},
//总账
{
	path: 'generalLedger',
	name: 'generalLedger',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/generalLedger.vue')
},

//权限申请
{
	path: 'retrivalApply',
	name: 'retrivalApply',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/retrivalApply.vue')
},

//权限审批
{
	path: 'retrivalApprove',
	name: 'retrivalApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/retrivalApprove.vue')
},

//总账
{
	path: 'generalLedger1',
	name: 'generalLedger1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/generalLedger.vue')
},
//会计报表
{
	path: 'accountingReports',
	name: 'accountingReports',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/accountingReports.vue')
},
//其他资料
{
	path: 'otherArchives',
	name: 'otherArchives',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/otherArchives.vue')
},
//会计凭证
{
	path: 'voucherInfo1',
	name: 'voucherInfo1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/voucherInfo.vue')
},
//档案审批
{
	path: 'archivesApprove',
	name: 'archivesApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/archivesApprove.vue')
},
//凭证管理
{
	path: 'evidenceStorage1',
	name: 'evidenceStorage1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/evidenceStorage.vue')
},
//账簿管理
{
	path: 'accountStorage1',
	name: 'accountStorage1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/accountStorage.vue')
},
//报表管理
{
	path: 'reportStorage1',
	name: 'reportStorage1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/reportStorage.vue')
},
//档案类别
{
	path: 'archivesCategory',
	name: 'archivesCategory',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/archivesCategory.vue')
},

//新档案统计
{
	path: 'archivesStatistics',
	name: 'archivesStatistics',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/archivesStatistics.vue')
},
//新档案首页
{
	path: 'archivesIndex',
	name: 'archivesIndex',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/archivesIndex.vue')
},
//新档案查看
{
	path: 'archivesSearch',
	name: 'archivesSearch',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/archivesSearch.vue')
},
//新权限管理
{
	path: 'retrivalQuery1',
	name: 'retrivalQuery1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/retrivalQuery.vue')
},
//新利润表
{
	path: 'profitStatement1',
	name: 'profitStatement1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/profitStatement.vue')
},
//新现金流量表表
{
	path: 'cashStatement1',
	name: 'cashStatement1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/cashStatement.vue')
},
//新资产负债表
{
	path: 'balanceStatement1',
	name: 'balanceStatement1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/new/balanceStatement.vue')
},



//明细账
{
	path: 'subsidiaryAccounts',
	name: 'subsidiaryAccounts',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/subsidiaryAccounts.vue')
},
//查看凭证(问题)
{
	path: 'voucherInfo',
	name: 'voucherInfo',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherInfo.vue')
},
//查看余额表
{
	path: 'balance',
	name: 'balance',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/balance.vue')
},
//调阅人管理
{
	path: 'retrivalQuery',
	name: 'retrivalQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/retrivalQuery.vue')
},
//固定资产卡片管理

{
	path: 'fixedCard',
	name: 'fixedCard',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/fixedCard.vue')
},

//卡片凭证管理

{
	path: 'fixedCardDetail',
	name: 'fixedCardDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/fixedCardDetail.vue')
},

//凭证审核查询

{
	path: 'voucherQuery',
	name: 'voucherQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherQuery.vue')
},
//固定资产折旧明细表

{
	path: 'assetBalances',
	name: 'assetBalances',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/assetBalances.vue')
},

//凭证汇总表2
{
	path: 'voucherSummary',
	name: 'voucherSummary',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherSummary.vue')
}, 
//初始化
{
	path: 'initialization',
	name: 'initialization',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/initialization.vue')
},
//初始化
{
	path: 'initBalance',
	name: 'initBalance',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/initBalance.vue')
},
//账套初始化
{
	path: 'initZt',
	name: 'initZt',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/initZt.vue')
},
//账套查询
{
	path: 'ztQuery',
	name: 'ztQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/ztQuery.vue')
},
//固定资产折旧表
{
	path: 'depreciation',
	name: 'depreciation',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/depreciation.vue')
},
//会计分录查询
{
	path: 'tvoucherentry',
	name: 'tvoucherentry',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/tvoucherentry.vue')
},
//合计分录查询
{
	path: 'tvoucherentryQuery',
	name: 'tvoucherentryQuery',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/tvoucherentryQuery.vue')
},
//总账e9

{
	path: 'generalLedgere9',
	name: 'generalLedgere9',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/generalLedgere9.vue')
},
//明细账e9
{
	path: 'subsidiaryAccountse9',
	name: 'subsidiaryAccountse9',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/subsidiaryAccountse9.vue')
},
//查看余额表e9
{
	path: 'balanceE9',
	name: 'balanceE9',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/balanceE9.vue')
},
//凭证录入e9
{
	path: 'voucherEntry',
	name: 'voucherEntry',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherEntry.vue')
},
//凭证录入e9
{
	path: 'voucherEntry1',
	name: 'voucherEntry1',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherEntry1.vue')
},
//凭证修改e9
{
	path: 'voucherModify',
	name: 'voucherModify',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherModify.vue')
},
//凭证copy
{
	path: 'voucherCopy',
	name: 'voucherCopy',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/voucherCopy.vue')
},
//资产负债表e9
{
	path: 'balanceStatementE9',
	name: 'balanceStatementE9',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/balanceStatementE9.vue')
},
//利润表e9
{
	path: 'profitStatementE9',
	name: 'profitStatementE9',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/profitStatementE9.vue')
},
//现金流量表E9
{
	path: 'cashStatementE9',
	name: 'cashStatementE9',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashStatementE9.vue')
},
//现金流量调节表
{
	path: 'cashFlowRegulationA',
	name: 'cashFlowRegulationA',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashFlowRegulationA.vue')
},
//现金流量调节表
{
	path: 'cashFlowRegulationB',
	name: 'cashFlowRegulationB',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashFlowRegulationB.vue')
},
//现金流量调节表
{
	path: 'cashFlowRegulationC',
	name: 'cashFlowRegulationC',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/cashFlowRegulationC.vue')
},

//e9报表导出
{
	path: 'reportFormsExport',
	name: 'reportFormsExport',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/reportFormsExport.vue')
},

//固定资产类别
{
	path: 'assetGroupType',
	name: 'assetGroupType',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/assetGroupType.vue')
},
//固定资产部门
{
	path: 'departType',
	name: 'departType',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/departType.vue')
},
//固定资产变动方式
{
	path: 'AssetAlterType',
	name: 'AssetAlterType',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/AssetAlterType.vue')
},
//固定使用状况
{
	path: 'AssetStatussType',
	name: 'AssetStatussType',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/AssetStatussType.vue')
},
//会计科目
{
	path: 'ProofAccount',
	name: 'ProofAccount',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/ProofAccount.vue')
},

//资料明细库
{
	path: 'detailSet',
	name: 'detailSet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/detailSet.vue')
},
//资料查找
{
	path: 'documentSearch',
	name: 'documentSearch',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentSearch.vue')
},
//资料入库
{
	path: 'documentStorage',
	name: 'documentStorage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentStorage.vue')
},
//资料出库
{
	path: 'documentStorageOut',
	name: 'documentStorageOut',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentStorageOut.vue')
},
//资料领用
{
	path: 'documentReception',
	name: 'documentReception',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentReception.vue')
},
//资料归还
{
	path: 'documentReturn',
	name: 'documentReturn',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentReturn.vue')
},
//资料入库审核
{
	path: 'documentStorageApprove',
	name: 'documentStorageApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentStorageApprove.vue')
},
//资料领用审核
{
	path: 'documentReceptionApprove',
	name: 'documentReceptionApprove',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentReceptionApprove.vue')
},
//非资料部资料持有查询
{
	path: 'documentSearchNon',
	name: 'documentSearchNon',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentSearchNon.vue')
},
//资料转交
{
	path: 'documentDeliver',
	name: 'documentDeliver',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentDeliver.vue')
},
//库位号管理
{
	path: 'storageLocationManage',
	name: 'storageLocationManage',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/storageLocationManage.vue')
},
//资料室管理
{
	path: 'documentRoom',
	name: 'documentRoom',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentRoom.vue')
},
//盘库配置
{
	path: 'checkSet',
	name: 'checkSet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/checkSet.vue')
},
//盘库任务查询
{
	path: 'taskSet',
	name: 'taskSet',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/taskSet.vue')
},
//领用未归还统计
{
	path: 'documentUnReturn',
	name: 'documentUnReturn',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/documentManage/documentUnReturn.vue')
},




//待收取实物操作池
{
	path: 'incomeTaxDeal',
	name: 'incomeTaxDeal',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/incomeTaxDeal.vue')
},

//往来明细核对
{
	path: 'contactDetails',
	name: 'contactDetails',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contactDetails.vue')
},
//往来信息配置
{
	path: 'contactConfig',
	name: 'contactConfig',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contactConfig.vue')
},
//往来信息配置详情
{
	path: 'contactConfigDetail',
	name: 'contactConfigDetail',
	component: () =>
		import( /* webpackChunkName: "about" */ '../../views/financeCalculateCenter/contactConfigDetail.vue')
},
]