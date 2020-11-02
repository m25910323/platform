<template>
	<div class="main clearfix">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>历史查询</el-breadcrumb-item>
			<el-breadcrumb-item>历史操作记录</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="formInline" size="small" ref='form' inline label-width="90px">
					<el-form-item label="客户名称:" prop="customId" :rules="[$rules.requiredSelect]">
						<!-- <el-autocomplete class="inline-input" v-model="formInline.customerName" :fetch-suggestions="querySearch"
								 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model='formInline.customId' filterable>
							<el-option v-for='item in $store.state.cust' :label="item.customerName" :value="item.customerId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="period" :rules="[$rules.requiredSelect]">
						<el-date-picker v-model="formInline.period" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search("form")' size="small" style="float: right;margin-right: 20px;"> 查 找
					</el-button>

				</el-form>
			</div>
		</div>

		<div class="contain_body clearfix">
			<!-- :style="{justifyContent:(parent.length==6?'center':'start')}" -->
			<div class="contain_body_div clearfix marginL" v-for='(parent,index) in historyTem' :style="{justifyContent:(index%2!=0?'flex-end':'flex-start')}">
				<img v-show="index%2!=0&&parent.length==7&&historyTem[index+1]" src="../../assets/img/leftArrow.png" class="leftArrow"
				 alt="">
				<!-- :style="{width:(index==historyTem.length - 1&&ind== parent.length - 1?'200px':'')}" -->
				<div class="contain_body_div clearfix" v-for="(item,ind) in parent">
					<!-- <div v-show='item.stepName =="发票录入"' class="date1">{{item.startTime?item.startTime.split(" ")[0]:''}}</div> -->
					<div :class="['topbox',item[0].isLast == 1?'topboxBg':'']" v-show="item[item.length - 1]['stepName'] =='收账通知'">
						<div class="contentBox">
							<div :class='["triangle-bottom",item[0].isLast == 1?"topboxBg":""]'></div>
							<p>{{item[item.length - 1]['stepName']}}</p>
							<p>{{item[item.length - 1]['startTime']?item[item.length - 1]['startTime'].split(" ")[0]:''}}开始</p>
							<p>{{item[item.length - 1]['endTime']?item[item.length - 1]['endTime'].split(" ")[0]:''}}结束</p>
							<p>分配人:{{item[item.length - 1]['allocationPerson']}}</p>
							<p>执行人:{{item[item.length - 1]['executeUserName']}}</p>
							
							<p>备注:{{item[item.length - 1]['remark']}}</p>
						</div>
					</div>

					<div v-show='item[0].stepName =="发票录入"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg1':'']">
						<img class="logoimg" src="../../assets/img/fplr.png" alt="">
					</div>
					<div v-show='item[0].stepName =="发票上传"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg1':'']">
						<img class="logoimg" src="../../assets/img/fpsc.png" alt="">
					</div>
					<div v-show='item[0].stepName =="发票审核"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg2':'']">
						<img class="logoimg" src="../../assets/img/sh.png" alt="">
					</div>
					<div v-show='item[0].stepName =="凭证审核"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg2':'']">
						<img class="logoimg" src="../../assets/img/sh.png" alt="">
					</div>
					<div v-show='item[0].stepName =="税款审核"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg2':'']">
						<img class="logoimg" src="../../assets/img/sh.png" alt="">
					</div>
					<div v-show='item[0].stepName =="税款确认"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg3':'']">
						<img class="logoimg" src="../../assets/img/sk.png" alt="">
					</div>
					<div v-show='item[0].stepName =="税款通知"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg3':'']">
						<img class="logoimg" src="../../assets/img/sk.png" alt="">
					</div>
					<div v-show='item[0].stepName =="申报"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg4':'']">
						<img class="logoimg" src="../../assets/img/sb.png" alt="">
					</div>
					<div v-show='item[0].stepName =="报表审核"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg2':'']">
						<img class="logoimg" src="../../assets/img/sh.png" alt="">
					</div>
					<div v-show='item[0].stepName =="利润通知"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg2':'']">
						<img class="logoimg" src="../../assets/img/lr.png" alt="">
					</div>
					<div v-show='item[0].stepName =="所得税问题处理"' :class="['img_contain',item[0].isLast == 1?'contentBoxBg5':'']">
						<img class="logoimg" src="../../assets/img/sds.png" alt="">
					</div>


					<p :style="{opacity:(ind!= parent.length - 1?'':'0')}" style="margin-left:0.05rem;padding-top:0.1rem">
						<span class='circle' v-for='item in 6'></span>
					</p>


					<div class="box">
						<div class="contentBox" v-for="(items,index) in item" v-show="items.stepName !='收账通知'" :class="{ 'contentBoxBorder1': (items.stepName =='发票录入' || items.stepName =='发票上传') && items.isLast == 1, 'contentBoxBorder2': (items.stepName =='发票审核' || items.stepName =='凭证审核' || items.stepName == '税款审核' || items.stepName == '报表审核' || items.stepName == '利润通知') && items.isLast == 1, 'contentBoxBorder3': (items.stepName =='税款通知' || items.stepName == '税款确认') && items.isLast == 1, 'contentBoxBorder4': items.stepName =='申报' && items.isLast == 1, 'contentBoxBorder5': items.stepName =='所得税问题处理' && items.isLast == 1}">
							<div class="triangle-top" v-show="index == 0" :class="{ 'trianglecolor1': (items.stepName =='发票录入' || items.stepName =='发票上传') && items.isLast == 1, 'trianglecolor2': (items.stepName =='发票审核' || items.stepName =='凭证审核' || items.stepName == '税款审核' || items.stepName == '报表审核' || items.stepName == '利润通知') && items.isLast == 1, 'trianglecolor3': (items.stepName =='税款通知' || items.stepName == '税款确认') && items.isLast == 1, 'trianglecolor4': items.stepName =='申报' && items.isLast == 1, 'trianglecolor5': items.stepName =='所得税问题处理' && items.isLast == 1}"></div>
							<h5 style="font-size:0.14rem" :class="{ 'step1color': (items.stepName =='发票录入' || items.stepName =='发票上传') && items.isLast == 1, 'step2color': (items.stepName =='发票审核' || items.stepName =='凭证审核' || items.stepName == '税款审核' || items.stepName == '报表审核' || items.stepName == '利润通知') && items.isLast == 1 , 'step3color': (items.stepName =='税款通知' || items.stepName == '税款确认') && items.isLast == 1, 'step4color': items.stepName =='申报' && items.isLast == 1, 'step5color': items.stepName =='所得税问题处理' && items.isLast == 1}">{{items.stepName}}</h5>
							<p>{{items.startTime?items.startTime.split(" ")[0]:''}}开始</p>
							<p>{{items.endTime?items.endTime.split(" ")[0]:''}}结束</p>
							<p>分配人:{{items.allocationPerson}}</p>
							<p>执行人:{{items.executeUserName}}</p>
							<p>备注:{{items.remark}}</p>
						</div>
					</div>

				</div>
				<img v-show="index%2==0&&parent.length==7&&historyTem[index+1]" src="../../assets/img/rightArrow.png" class="rightArrow"
				 alt="">

			</div>
			<!-- <div class="contain_body_div left clearfix" v-for='(item,index) in historyList' :style="{width:(index==historyList.length - 1?'150px':'')}">
					<div v-show='item.stepName =="发票录入"' class="date1">{{item.startTime?item.startTime.split(" ")[0]:''}}</div>
					<img v-show='item.stepName =="做账"' src="../assets/img/notice.png" alt="">
					<img v-show='item.stepName =="大额审核"' src="../assets/img/users.png" alt="">
					<img v-show='item.stepName =="税款审核"' src="../assets/img/pay.png" alt="">
					<img v-show='item.stepName =="申报"' src="../assets/img/money.png" alt="">
					<p v-show='index != historyList.length - 1' style="margin-left:0.05rem;padding-top:0.1rem">
						<span class='circle' v-for='item in 10'></span>
					</p>
					<div class="contentBox" :class="{ 'contentBoxBorder1': item.stepName =='发票录入', 'contentBoxBorder2': item.stepName =='做账', 'contentBoxBorder3': item.stepName =='大额审核', 'contentBoxBorder4': item.stepName =='税款审核', 'contentBoxBorder5': item.stepName =='申报'}">
						<div id="triangle-top" :class="{ 'trianglecolor1': item.stepName =='发票录入', 'trianglecolor2': item.stepName =='做账', 'trianglecolor3': item.stepName =='大额审核', 'trianglecolor4': item.stepName =='税款审核', 'trianglecolor5': item.stepName =='申报'}"></div>
						<h5 style="font-size:0.14rem" :class="{ 'step1color': item.stepName =='发票录入', 'step2color': item.stepName =='做账', 'step3color': item.stepName =='大额审核', 'step4color': item.stepName =='税款审核', 'step5color': item.stepName =='申报'}">{{item.stepName}}</h5>
						<p>{{item.startTime?item.startTime.split(" ")[0]:''}}开始</p>
						<p>{{item.endTime?item.endTime.split(" ")[0]:''}}结束</p>
						<p>执行人:{{item.executeUserName}}</p>
						<p>备注:{{item.remark}}</p>
					</div>
				</div> -->
		</div>
	</div>
</template>

<script>
	export default {
		name: "router1",
		data() {
			return {
				message: "12334456",
				formInline: {
					customId: "",
					period: "",
					customerName: ""
				},
				// loading:false,
				historyList: [],
				historyTem: [],
				rules: {
					customId: [{
						required: true,
						message: "请选择客户",
						trigger: "change"
					}],
					period: [{
						required: true,
						message: "请选择账期",
						trigger: "change"
					}]
				}
			};
		},
		components: {},
		mounted() {

		},
		methods: {

			resetForm() {
				this.formInline = {
					customId: "",
					period: "",
					customerName: ""
				};
			},
			search(formName) {
				this.historyTem = [];
				this.$refs[formName].validate(valid => {
					if (valid) {
						// this.formInline.customId = 'jz17951';
						let params = this.formInline;
						this.axios
							.post(
								// "/perTaxToolTwo/e9z/historyQuery/selectHistory",
								"/perTaxToolTwo/e9z/historyQuery/selectHistoryNew",
								this.qs.stringify(params), {
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								}
							)
							.then(res => {
								if (res.data.code == 200) {
									// this.loading = false;
									this.historyList = res.data.data;
									if(this.historyList.length == 0){
										this.$message({
											message: "暂无历史操作记录",
											type: "warning"
										});
									}else{
										this.historyList[this.historyList.length - 1].forEach(item => {
											item.isLast = 1;
										})
										for (let i = 0, j = 0; i < this.historyList.length; i += 7, j++) {
											if (j % 2 == 0) {
												this.historyTem.push(this.historyList.slice(i, i + 7));
											} else {
												this.historyTem.push(this.historyList.slice(i, i + 7).reverse());
											}
										}
									}
									
									console.log("historyTem", this.historyTem);
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
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			}
		}
	};
</script>

<style scoped lang="less">
	/*滚动条样式*/
	::-webkit-scrollbar {
		width: 0.04rem;
		height: 0.04rem;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 0.10rem;
		-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}

	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);

	}

	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		/deep/ .search_contain {
			background: #fff;
			/* height: 40px; */
			/* padding-left: 20px; */
			padding: 0.3rem 20px 0.08rem;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}

			.el-input {
				width: 180px;
			}

			.el-form-item {
				margin-right: 30px;
			}

		}

		.main_contain {
			background: #fff;
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
				color: #409EFF
			}

			/deep/ .el-pagination {
				text-align: center;
				margin-top: 10px;
			}
		}
	}


	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-form-item .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem;
		}
	}

	.contain_body {
		height: calc(100% - 2rem);
		box-sizing: border-box;
		padding: 1.2rem 0.2rem 0.2rem;
		margin: 20px;
		background: #fff;
		overflow: auto;

		.contain_body_div {
			height: 300px;
			min-height: 2rem;
			// align-items: center;
			display: flex;
			position: relative;

			.img_contain {
				width: 0.4rem;
				height: 0.4rem;
				background: #8C8C8C;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.logoimg {
				// display: inline-block;
				// width: 0.4rem;
				// height: 0.4rem;
			}

			.circle {
				display: inline-block;
				width: 0.12rem;
				height: 0.02rem;
				// border-radius: 50%;
				background-color: #c9c9c9;
				margin-right: 0.1rem;
			}

			.date1 {
				height: 0.4rem;
				line-height: 0.4rem;
				background: #ed878e;
				color: #fff;
				border-radius: 0.05rem;
				padding: 0 0.1rem;
				font-size: 0.16rem;
			}

			.contentBoxBg1 {
				background-color: #FFAC69;
			}

			.contentBoxBg2 {
				background-color: #ED878E;
			}

			.contentBoxBg3 {
				background-color: #43B2DB;
			}

			.contentBoxBg4 {
				background-color: #7DC36D;
			}

			.contentBoxBg5 {
				background-color: #E6A08A;
			}
		}

		.box {
			position: absolute;

			.contentBox {
				// position: absolute;
				position: relative;
				top: 0.6rem;
				padding: 0.05rem 0.1rem;
				border-width: 0.02rem;
				border-style: solid;
				border-radius: 0.1rem;
				width: 1.35rem;
				margin-bottom: 0.1rem;
				border-color: #8C8C8C;

				h5 {
					color: #8C8C8C;
				}

				.triangle-top {
					width: 0;
					height: 0;
					border-right: 0.1rem solid transparent;
					border-left: 0.1rem solid transparent;
					position: absolute;
					top: -0.2rem;
					border-bottom: 0.2rem solid #8C8C8C;
				}

				.step1color {
					color: #FFAC69;
				}

				.step2color {
					color: #ED878E;
				}

				.step3color {
					color: #43B2DB;
				}

				.step4color {
					color: #7DC36D;
				}

				.step5color {
					color: #E6A08A;
				}

				.trianglecolor1 {
					border-bottom: 0.2rem solid #ed878e;
				}

				.trianglecolor2 {
					border-bottom: 0.2rem solid #ED878E;
				}

				.trianglecolor3 {
					border-bottom: 0.2rem solid #43B2DB;
				}

				.trianglecolor4 {
					border-bottom: 0.2rem solid #7DC36D;
				}

				.trianglecolor5 {
					border-bottom: 0.2rem solid #E6A08A;
				}

				#triangle-bottom {
					width: 0;
					height: 0;
					border-right: 0.1rem solid transparent;
					border-left: 0.1rem solid transparent;
					position: absolute;
					top: -0.2rem;
					border-bottom: 0.2rem solid #8C8C8C;
				}

				p {
					color: #666;
				}
			}

			.contentBoxBorder1 {
				border-color: #FFAC69;
			}

			.contentBoxBorder2 {
				border-color: #ED878E;
			}

			.contentBoxBorder3 {
				border-color: #43B2DB;
			}

			.contentBoxBorder4 {
				border-color: #7DC36D;
			}

			.contentBoxBorder5 {
				border-color: #E6A08A;
			}
		}

		.topbox {
			position: absolute;
			top: -110px;
			color: #fff;
			background-color: #c8c8c8;
			border-radius: 0.04rem;

			.contentBox {
				// position: absolute;
				position: relative;
				height: 0.9rem;
				padding: 0.02rem 0.1rem;
				// border-width: 0.02rem;
				// border-style: solid;
				border-radius: 0.1rem;
				width: 1.5rem;
				margin-bottom: 0.1rem;


				#triangle-bottom {
					width: 0;
					height: 0;
					border-bottom: 0.1rem solid transparent;
					border-right: 0.1rem solid transparent;
					border-left: 0.1rem solid transparent;
					border-top: 0.1rem solid #c8c8c8;
					position: absolute;
					top: 0.9rem;
				}

				// p {
				// 	color: #666;
				// }
			}

			.contentBoxBorder1 {
				border-color: #FFAC69;
			}

			.contentBoxBorder2 {
				border-color: #ED878E;
			}

			.contentBoxBorder3 {
				border-color: #43B2DB;
			}

			.contentBoxBorder4 {
				border-color: #7DC36D;
			}

			.contentBoxBorder5 {
				border-color: #E6A08A;
			}
		}

		.topboxBg {
			background-color: #FFAC69;
		}







		.marginL {
			margin-left: 1.7rem;
			margin-right: 1.7rem
		}

		.marginR {
			margin-right: 2rem;
			justify-content: flex-end;
		}

		// 两侧箭头样式
		.leftArrow {
			position: absolute;
			left: -1.8rem;
			top: 2rem;
			width: 1.68rem;
			height: 1.71rem;
		}

		.rightArrow {
			position: absolute;
			right: -1.6rem;
			top: 2rem;
			width: 1.68rem;
			height: 1.71rem;
		}

	}
</style>
