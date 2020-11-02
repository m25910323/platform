<template>
	<div class="main_contain">
		<div class='search_contain'>
			<!-- <div class="row1">
					<span class="labelTitle">
						客户名称：
					</span>
					<el-select v-model="searchList.customerId" placeholder="请选择" @change='selectGet' filterable>
						<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
						</el-option>
					</el-select>
				</div>
				<div class="row2" style="margin-left:0.2rem">
					<span class="labelTitle">
						账期：
					</span>
					<el-date-picker v-model="searchList.period" type="month" placeholder="选择月" value-format="yyyy-MM">
					</el-date-picker>
				</div>
				<div class="searchButton" @click="search()">查询</div> -->
			<el-form :inline="true" :model="searchList" class="demo-form-inline" :rules="rules" ref='form' size="mini">
				<el-form-item label="客户名称:" prop="customerId">
					<!-- <el-autocomplete class="inline-input" v-model="formInline.customerName" :fetch-suggestions="querySearch"
						 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					<el-select v-model='searchList.customerId' filterable @change='selectGet'>
						<el-option v-for='item in $store.state.cust' :label="item.customerName" :value="item.customerId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账期:" prop="period">
					<el-date-picker v-model="searchList.period" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button @click='search("form")'>查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class='body_contain'>
			<div class='card' v-for="item in taxTreatment">
				<div class='card_head'>
					<p>{{item.taxInfoRemark2}}</p>
					<p>{{item.accountPeriod}}</p>
					<p>{{item.stepName}}</p>
					<p>税金：{{item.taxation}}元</p>
				</div>
				<div class='card_body'>
					<p>责任会计：{{item.processUserName}}</p>
					<p>工号：{{item.processUserId}}</p>
					<p>税务类型：{{declarationType == 1?'一般纳税人':'小规模纳税人'}}</p>
				</div>
				<div class='card_btn'>
					<span class='pass' @click="submitCard(item,1,'申报')" v-if='!item.taxationIdList || item.taxationIdList.length == 0'>审核通过</span>
					<span class='redo' @click='showDialog(item,item.taxationIdList[0])' v-if='item.taxationIdList && item.taxationIdList.length > 0'>比较（工资差异{{item.taxationIdList.length}}条）</span>
				</div>
			</div>
			<div class='card' v-for="item in bigTaxTreatment">
				<div class='card_head'>
					<p>{{item.taxInfoRemark2}}</p>
					<p>{{item.accountPeriod}}</p>
					<p>{{item.stepName}}</p>
					<p>税金：{{item.taxation}}元</p>
				</div>
				<div class='card_body'>
					<p>责任会计：{{item.processUserName}}</p>
					<p>工号：{{item.processUserId}}</p>
					<p>税务类型：{{declarationType == 1?'一般纳税人':'小规模纳税人'}}</p>
				</div>
				<div class='card_btn'>
					<span class='redo' @click="submitCard(item,0,'做账')">发回重做</span>
					<span class='pass' @click="submitCard(item,1,'申报')">审核通过</span>
				</div>
			</div>
		</div>
		<el-dialog title="" :visible.sync="dialogVisible" width="9.2rem" class='dialog'>
			<div class='title'>客户名称：{{info.taxInfoRemark2}}</div>
			<div class='line'>
				<div style='color: #43b3db;'>发票类型：{{fplrList.invoiceCategory + " " + fplrList.invoiceType}}</div>
				<div>发票名称：{{fplrList.invoiceName}}</div>
				<div>账期：{{info.accountPeriod}}</div>
				<div>申报纳税种类：{{fplrList.declarationType == 1?'一般纳税人':'小规模纳税人'}}</div>
			</div>
			<div class='clearfix'>
				<div class='left' style='width: calc(50% - 10px)'>
					<h5>发票录入：</h5>
					<ul>
						<li v-for='item in fplrList.e9zConfigInvoiceTaxesList' :class='["clearfix",item.columnRemark1 == "1"?"mark":""]'>
							<span class='left'>{{item.taxesTitle}}</span>
							<span class='right'>{{item.taxesValue}}</span>
						</li>
						<li v-for='item in fplrList.e9zConfigInvoiceColumnList' v-if="item.columnShow==1" :class='["clearfix",item.columnRemark1 == "1"?"mark":""]'>
							<span class='left'>{{item.columnTitle}}</span>
							<span class='right'>{{item.columnValue}}</span>
						</li>
					</ul>
				</div>
				<div class='right' style='width: calc(50% - 10px)'>
					<h5>做账：</h5>
					<ul>
						<li v-for='(item,index) in zzList.e9zConfigInvoiceTaxesList' :class='["clearfix",item.columnRemark1 == "1"?"mark":""]'>
							<span class='left'>{{item.taxesTitle}}</span>
							<span class='right'>
								<el-select v-model='item.taxesValue' @change='setTaxesValue(item)'>
									<el-option v-for="lib in item.e9zConfigInvoiceTaxesRateList" :label='lib.taxesRate' :value='lib.taxesRate'></el-option>
								</el-select>
							</span>
						</li>
						<li v-for='(item,index) in zzList.e9zConfigInvoiceColumnList' v-if="item.columnShow==1" :class='["clearfix",item.columnRemark1 == "1"?"mark":""]'>
							<span class='left'>{{item.columnTitle}}</span>
							<span class='right' style="height: 18px;line-height: 18px;" :contenteditable='item.columnRemark1 == "1"' @blur='setLine($event,index,"columnValue")'
							 v-text='item.columnValue'></span>
						</li>
					</ul>
				</div>
			</div>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commitDialog(zzList)'>完成</span>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "router1",
		data() {
			return {
				message: "12334456",
				searchList: {
					customerId: "",
					period: "",
					customerName: ''
				},
				bigTaxTreatment: [],
				taxTreatment: [],
				dialogVisible: false,
				fplrList: {},
				zzList: {},
				info: {},
				userobj: {},
				declarationType: '',
				rules: {
					customerId: [{
						required: true,
						message: '请选择客户',
						trigger: 'change'
					}],
					period: [{
						required: true,
						message: '请选择账期',
						trigger: 'change'
					}]
				},
				zengzhiValue: '',
				yinhuaValue: '',
				chengjianValue: '',
				xiaofeiValue: '',

				zengzhiValue1: '',
				yinhuaValue1: '',
				chengjianValue1: '',
				xiaofeiValue1: '',
				
				zzTaxationId:''
			}
		},
		methods: {
			// querySearch(queryString, cb) {
			// 	var cust = this.$store.state.cust;
			// 	cust.forEach((item, index) => {
			// 		item.value = item.customerName;
			// 	})
			// 	var results = queryString ? cust.filter(this.createFilter(queryString)) : cust;
			// 	// 调用 callback 返回建议列表的数据
			// 	cb(results);
			// },
			// createFilter(queryString) {
			// 	return (cust) => {
			// 		return (cust.customerName.indexOf(queryString) === 0);
			// 	};
			// },
			search(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.declarationType = this.userobj.reportTaxType;
						this.queryTaxTreatment();
						this.queryBigTaxTreatment();
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			queryTaxTreatment() {
				// this.searchList.customerId = '';
				// if (this.searchList.customerName) {
				// 	var customer = this.$store.state.cust.find(item =>
				// 		item.value === this.searchList.customerName
				// 	);
				// 	if(customer){
				// 		this.searchList.customerId = customer.customerId;
				// 	}else{
				// 		this.searchList.customerId = '';
				// 	}
				// this.formInline.customId = this.$store.state.cust.find(item =>
				// 	item.value === this.formInline.customerName
				// ).customerId
				// }
				let params = this.searchList;
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/selectTaxTreatment', this.qs.stringify(params), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.taxTreatment = res.data.data;
							if (this.taxTreatment.length == 0) {
								this.$message({
									message: "暂无税款审核数据",
									type: 'warning'
								});
							}
						} else {
							let type;
							if (res.data.code == 0) {
								type = "warning";
							} else if (res.data.code == 500) {
								type = "error";
							}
							this.$message({
								message: res.data.msg,
								type: type
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			queryBigTaxTreatment() {
				// this.searchList.customerId = '';
				// if (this.searchList.customerName) {
				// 	var customer = this.$store.state.cust.find(item =>
				// 		item.value === this.searchList.customerName
				// 	);
				// 	if(customer){
				// 		this.searchList.customerId = customer.customerId;
				// 	}else{
				// 		this.searchList.customerId = '';
				// 	}
				// this.formInline.customId = this.$store.state.cust.find(item =>
				// 	item.value === this.formInline.customerName
				// ).customerId
				// }
				let params = this.searchList;
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/selectBigTaxTreatment', this.qs.stringify(params), {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.bigTaxTreatment = res.data.data;
							if (this.bigTaxTreatment.length == 0) {
								this.$message({
									message: "暂无大额审核数据",
									type: 'warning'
								});
							}
						} else {
							let type;
							if (res.data.code == 0) {
								type = "warning";
							} else if (res.data.code == 500) {
								type = "error";
							}
							this.$message({
								message: res.data.msg,
								type: type
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			submitCard(row, status, nextStepName) {
				let params = {
					"taxationId": row.taxationId, //税款Id
					"taxInfoId": row.taxInfoId, //收账信息id
					"stepName": row.stepName, //步骤名称
					"nextStepName": nextStepName, //下一个步骤名称
					"state": status
				}
				this.axios.post('/perTaxToolTwo/e9z/taxStep/submit', params).then(res => {
						if (res.data.code == 200) {
							this.queryTaxTreatment();
							this.queryBigTaxTreatment();
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							let type;
							if (res.data.code == 0) {
								type = "warning";
							} else if (res.data.code == 500) {
								type = "error";
							}
							this.$message({
								message: res.data.msg,
								type: type
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			showDialog(obj, item) {
				this.dialogVisible = true;
				this.info = obj;
				this.zzTaxationId = item.zzTaxationId;
				let params = {
					"taxesTaxType": this.declarationType,
					"fplrTaxationId": item.fplrTaxationId,
					"fplrTaxInfoId": item.fplrTaxInfoId,
					"zzTaxInfoId": item.zzTaxInfoId,
					"zzTaxationId": item.zzTaxationId,
				}
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/selectInvoiceCompare', params).then(res => {
						if (res.data.code == 200) {
							this.fplrList = res.data.data[0].fplr;
							this.zzList = res.data.data[0].zz;
							this.fplrList.e9zConfigInvoiceColumnList.forEach((item, index) => {
								if (item.columnTitle == "增值税税率") {
									this.zengzhiValue1 = parseFloat(item.columnValue);
								} else if (item.columnTitle == "印花税税率") {
									this.yinhuaValue1 = parseFloat(item.columnValue);
								} else if (item.columnTitle == "城建税税率") {
									this.chengjianValue1 = parseFloat(item.columnValue);
								} else if (item.columnName == "verified_rate") {
									this.xiaofeiValue1 = parseFloat(item.columnValue);
								}
							})
							this.fplrList.e9zConfigInvoiceTaxesList.forEach((item, index) => {
								if (item.taxesTitle == "增值税") {
									item.taxesValue = this.zengzhiValue1;
								} else if (item.taxesTitle == "印花税") {
									item.taxesValue = this.yinhuaValue1;
								} else if (item.taxesTitle == "城市维护建设税") {
									item.taxesValue = this.chengjianValue1;
								} else if (item.taxesTitle == "消费税") {
									item.taxesValue = this.xiaofeiValue1;
								}
							})
							this.zzList.e9zConfigInvoiceColumnList.forEach((item, index) => {
								if (item.columnTitle == "增值税税率") {
									this.zengzhiValue = parseFloat(item.columnValue);
								} else if (item.columnTitle == "印花税税率") {
									this.yinhuaValue = parseFloat(item.columnValue);
								} else if (item.columnTitle == "城建税税率") {
									this.chengjianValue = parseFloat(item.columnValue);
								} else if (item.columnName == "verified_rate") {
									this.xiaofeiValue = parseFloat(item.columnValue);
								}
							})
							this.zzList.e9zConfigInvoiceTaxesList.forEach((item, index) => {
								if (item.taxesTitle == "增值税") {
									item.taxesValue = this.zengzhiValue;
								} else if (item.taxesTitle == "印花税") {
									item.taxesValue = this.yinhuaValue;
								} else if (item.taxesTitle == "城市维护建设税") {
									item.taxesValue = this.chengjianValue;
								} else if (item.taxesTitle == "消费税") {
									item.taxesValue = this.xiaofeiValue;
								}
							})
						} else {
							let type;
							if (res.data.code == 0) {
								type = "warning";
							} else if (res.data.code == 500) {
								type = "error";
							}
							this.$message({
								message: res.data.msg,
								type: type
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			setTaxesValue(item){
				if(item.taxesTitle == '增值税'){
					this.zzList.e9zConfigInvoiceColumnList.find((item) => {
						return item.columnTitle == '增值税税率'
					}).columnValue = item.taxesValue
				}else if(item.taxesTitle == '印花税'){
					this.zzList.e9zConfigInvoiceColumnList.find((item) => {
						return item.columnTitle == '印花税税率'
					}).columnValue = item.taxesValue
				}else if(item.taxesTitle == '城市维护建设税'){
					this.zzList.e9zConfigInvoiceColumnList.find((item) => {
						return item.columnTitle == '城建税税率'
					}).columnValue = item.taxesValue
				}else if(item.taxesTitle == '消费税'){
					this.zzList.e9zConfigInvoiceColumnList.find((item) => {
						return item.columnName == 'verified_rate'
					}).columnValue = item.taxesValue
				}
			},
			commitDialog(detailData) {
				let params = {
					invoiceId: detailData.invoiceId, //发票Id (如果是发票配置表)
					invoiceTmplId: detailData.tmplId, //模板id （如果是模板配置表）
					invoiceTaxableType: detailData.invoiceTaxableType, //应税类型：1 - 应税货物；2 - 应税劳务；3 - 应税服务
					invoiceName: detailData.invoiceName, //发票名称 this.detailData.invoiceName
					invoiceListId: detailData.invoiceListId, //发票信息Id
					invoiceCategory: detailData.invoiceCategory, //发票分类：防伪税控；税务局代开；有票收入；无票收入
					invoiceType: detailData.invoiceType, //发票类型：（防伪税控/代开-）专票；（防伪税控/代开-）普票；（有票收入-）形式发票；（有票收入-）通用机打；（无票收入-）无票
					area: detailData.area, //适用区域代码：All-通用
					invoiceTaxManageType: detailData.invoiceTaxManageType, //税务管理类型
					taxCalcType: detailData.taxCalcType, //计税方法：1 - 一般计税；2 - 简易征收计税
					reducePriority: detailData.reducePriority, //抵扣优先级
					tmplShowType: detailData.tmplShowType, //下拉框（0-发票 1-其他模板）
					taxesTaxType: this.declarationType, //税务类型：0：通用；232：小规模；233：一般纳税人
					type: detailData.type, //对应列/税费下拉框 1-列 2-税费
					declarationType: this.declarationType, //1：一般纳税人，2：小规模,要修改
					// declarationType: 1,
					e9zConfigInvoiceColumnList: detailData.e9zConfigInvoiceColumnList,
					
					taxationId:this.zzTaxationId
				};
				this.axios.post('/perTaxToolTwo/e9zCalculate/invoiceCalculate', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.queryTaxTreatment();
						this.queryBigTaxTreatment();
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					} else {
						this.dialogVisible = false;
						let type;
						if (res.data.code == 0) {
							type = "warning";
						} else if (res.data.code == 500) {
							type = "error";
						}
						this.$message({
							message: res.data.msg,
							type: type
						});
					}
				}).catch(function(err) {
					this.dialogVisible = false;
					this.$message({
						message: "系统繁忙，请稍后重试",
						type: "error"
					});
				})
			},
			hideDialog() {
				this.dialogVisible = false;
			},
			selectGet(vId) {
				this.userobj = {};
				this.userobj = this.$store.state.cust.find((item) => { //这里的selectList就是上面遍历的数据源
					return item.customerId === vId; //筛选出匹配数据
				});
				console.log('当前选择的用户信息', this.userobj); //
			},
			setLine(event, index, type) {
				this.zzList.e9zConfigInvoiceColumnList[index][type] = event.target.innerText;
			},
			
			
		},
		components: {},
		created() {}
	}
</script>

<style scoped lang="less">
	.main_contain {
		height: 100%;
		margin: 20px;
	}

	div.search_contain {
		/* width: 1180rem; */
		/* height: 78rem; */
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		/* justify-content: space-between; */
		border-top-left-radius: 0.05rem;
		border-top-right-radius: 0.05rem;
		background: #fff;
		padding: 0.20rem 0.20rem;

		.el-button--small {
			background: #ffb980;
			color: #fff;
			border-radius: .05rem;
			border: none;
			cursor: pointer;
			padding: .12rem .35rem;
		}
	}

	div.body_contain {
		margin-top: .2rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: start;

		.card {
			width: calc((100% - 0.8rem) / 5);
			margin-right: .2rem;
			margin-bottom: .2rem;
			background: #fff;
			height: 4.85rem;
			border-top-right-radius: 4px;

			.card_head {
				height: 2rem;
				box-sizing: border-box;
				padding-left: 0.2rem;
				color: #fff;
				padding-top: 0.3rem;
				background: url(../../assets/img/list-bg1.png) no-repeat center center;

				p:nth-of-type(1) {
					font-size: 0.18rem;
					height: 0.36rem;
					line-height: 0.36rem;
				}

				p:nth-of-type(2) {
					font-size: 0.12rem;
					height: 0.3rem;
					line-height: 0.3rem;
				}

				p:nth-of-type(3) {
					font-size: 0.16rem;
					height: 0.34rem;
					line-height: 0.34rem;
				}

				p:nth-of-type(4) {
					font-size: 0.16rem;
					height: 0.38rem;
					line-height: 0.38rem;
				}
			}

			.card_body {
				margin: 0.2rem 0;

				p {
					height: 0.3rem;
					line-height: 0.3rem;
					font-size: 0.14rem;
					padding-left: 0.2rem;
					color: #666
				}

				p:nth-of-type(1) {}

				p:nth-of-type(2) {}

				p:nth-of-type(3) {}
			}
		}

		.card:nth-of-type(5n) {
			margin-right: 0rem;
		}
	}

	.dialog {
		.title {
			height: 0.4rem;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: #333;
		}

		.line {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: space-between;
			height: 0.4rem;
			align-content: center;
			align-items: center;
			margin-bottom: 20px;
		}

		ul {
			background: #f8f8f8;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0.2rem;
			height: 3.5rem;
			overflow-y: auto;
			margin-top: 0.1rem;

			li {
				height: 0.24rem;
				font-size: 0.12rem;
			}
		}

		.mark {
			color: #ed878e;
		}

		/deep/ .el-select {
			width:100px;
		}

		/deep/ .el-input__inner {
			height: 18px;
			line-height: 18px;
		}

		/deep/ .el-input__icon {
			height: 100%;
			width: 25px;
			text-align: center;
			line-height: 18px;
		}
	}

	.btn_contain {
		text-align: center;
		margin-top: 0.36rem;
	}

	.commit {
		width: 2.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #43b3db;
		color: #fff;
		display: inline-block;
		text-align: center;
		margin-right: 0.4rem;
		border-radius: 4px;
	}

	.close {
		width: 2.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #ed878e;
		color: #fff;
		display: inline-block;
		text-align: center;
		border-radius: 4px;
	}

	.card_btn {
		text-align: center;
		margin-top: 0.36rem;
	}

	.pass {
		width: 2.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #43b3db;
		color: #fff;
		display: inline-block;
		text-align: center;
		margin-top: 0.26rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.redo {
		width: 2.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #ed878e;
		color: #fff;
		display: inline-block;
		text-align: center;
		border-radius: 4px;
		cursor: pointer;
	}

	.searchButton {
		background: #ffb980;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0.07rem 0.35rem;
		margin-left: 0.2rem
	}
</style>
