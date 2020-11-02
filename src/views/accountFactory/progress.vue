<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>历史操作记录</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="rules" ref='form' size="mini">
					<el-form-item label="客户名称:" prop="customId">
						<!-- <el-autocomplete class="inline-input" v-model="formInline.customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model='formInline.customId' filterable>
							<el-option v-for='item in $store.state.cust' :label="item.customerName" :value="item.customerId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="period">
						<el-date-picker v-model="formInline.period" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button @click='search("form")' size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body clearfix">
				<!-- :style="{justifyContent:(parent.length==6?'center':'start')}" -->
				<div class="contain_body_div clearfix marginL" v-for='(parent,index) in historyTem' :style="{justifyContent:(index%2!=0?'flex-end':'flex-start')}">
					<img v-show="index%2!=0&&parent.length==6&&historyTem[index+1]" src="../../assets/img/leftArrow.png" class="leftArrow"
					 alt="">
					<!-- :style="{width:(index==historyTem.length - 1&&ind== parent.length - 1?'200px':'')}" -->
					<div class="contain_body_div clearfix" v-for="(item,ind) in parent">
						<!-- <div v-show='item.stepName =="发票录入"' class="date1">{{item.startTime?item.startTime.split(" ")[0]:''}}</div> -->
						<img class="logoimg" v-show='item.stepName =="收账通知"' src="../../assets/img/time.png" alt="">
						<img class="logoimg" v-show='item.stepName =="发票录入"' src="../../assets/img/time.png" alt="">
						<img class="logoimg" v-show='item.stepName =="发票上传"' src="../../assets/img/time.png" alt="">
						<img class="logoimg" v-show='item.stepName =="发票审核"' src="../../assets/img/notice.png" alt="">
						<img class="logoimg" v-show='item.stepName =="凭证审核"' src="../../assets/img/users.png" alt="">
						<img class="logoimg" v-show='item.stepName =="税款审核"' src="../../assets/img/pay.png" alt="">
						<img class="logoimg" v-show='item.stepName =="税款确认"' src="../../assets/img/pay.png" alt="">
						<img class="logoimg" v-show='item.stepName =="申报"' src="../../assets/img/money.png" alt="">


						<img class="logoimg" v-show='item.stepName =="报表审核"' src="../../assets/img/notice.png" alt="">
						<img class="logoimg" v-show='item.stepName =="利润通知"' src="../../assets/img/users.png" alt="">
						<img class="logoimg" v-show='item.stepName =="所得税问题处理"' src="../../assets/img/money.png" alt="">
						<p :style="{opacity:(ind!= parent.length - 1?'':'0')}" style="margin-left:0.05rem;padding-top:0.1rem">
							<span class='circle' v-for='item in 10'></span>
						</p>

						<div class="contentBox" :class="{ 'contentBoxBorder1': item.stepName =='发票录入' || item.stepName =='税款确认' || item.stepName =='收账通知', 'contentBoxBorder2': item.stepName =='发票上传' || item.stepName =='申报', 'contentBoxBorder3': item.stepName =='发票审核' || item.stepName =='报表审核', 'contentBoxBorder4': item.stepName =='凭证审核' || item.stepName =='利润通知', 'contentBoxBorder5': item.stepName =='税款审核' || item.stepName =='所得税问题处理'}">
							<div id="triangle-top" :class="{ 'trianglecolor1': item.stepName =='发票录入' || item.stepName =='税款确认' || item.stepName =='收账通知', 'trianglecolor2': item.stepName =='发票上传' || item.stepName =='申报', 'trianglecolor3': item.stepName =='发票审核' || item.stepName =='报表审核', 'trianglecolor4': item.stepName =='凭证审核' || item.stepName =='利润通知', 'trianglecolor5': item.stepName =='税款审核' || item.stepName =='所得税问题处理'}"></div>
							<h5 style="font-size:0.14rem" :class="{ 'step1color': item.stepName =='发票录入' || item.stepName =='税款确认' || item.stepName =='收账通知', 'step2color': item.stepName =='发票上传' || item.stepName =='申报', 'step3color': item.stepName =='发票审核' || item.stepName =='报表审核', 'step4color': item.stepName =='凭证审核' || item.stepName =='利润通知', 'step5color': item.stepName =='税款审核' || item.stepName =='所得税问题处理'}">{{item.stepName}}</h5>
							<p>{{item.startTime?item.startTime.split(" ")[0]:''}}开始</p>
							<p>{{item.endTime?item.endTime.split(" ")[0]:''}}结束</p>
							<p>分配人:{{item.allocationPerson}}</p>
							<p>执行人:{{item.executeUserName}}</p>
							<p>备注:{{item.remark}}</p>
						</div>
					</div>
					<img v-show="index%2==0&&parent.length==6&&historyTem[index+1]" src="../../assets/img/rightArrow.png" class="rightArrow"
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
				this.historyTem = [];
				this.$refs[formName].validate(valid => {
					if (valid) {
						let params = this.formInline;
						this.axios
							.post(
								"/perTaxToolTwo/e9z/historyQuery/selectHistory",
								// "/perTaxToolTwo/e9z/historyQuery/selectHistoryNew",
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
									for (let i = 0, j = 0; i < this.historyList.length; i += 6, j++) {
										if (j % 2 == 0) {
											this.historyTem.push(this.historyList.slice(i, i + 6));
										} else {
											this.historyTem.push(this.historyList.slice(i, i + 6).reverse());
										}
									}
									console.log("historyTem", this.historyTem);
									if (this.historyList.length == 0) {
										this.$message({
											message: "暂无历史操作记录",
											type: "success"
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

	.main_contain {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;

		.left_contain {
			height: 100%;
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
		padding: 0.2rem 0.2rem;
		background: #fff;
		overflow: auto;

		.contain_body_div {
			height: 170px;
			min-height: 2rem;
			// align-items: center;
			display: flex;
			position: relative;

			.logoimg {
				display: inline-block;
				width: 0.4rem;
				height: 0.4rem;
			}

			.circle {
				display: inline-block;
				width: 0.08rem;
				height: 0.08rem;
				border-radius: 50%;
				background-color: #c9c9c9;
				margin-right: 0.08rem;
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
		}

		.contentBox {
			position: absolute;
			top: 0.7rem;
			padding: 0.05rem 0.1rem;
			border-width: 0.02rem;
			border-style: solid;
			border-radius: 0.1rem;
			width: 1.6rem;

			#triangle-top {
				width: 0;
				height: 0;
				border-right: 0.1rem solid transparent;
				border-left: 0.1rem solid transparent;
				position: absolute;
				top: -0.2rem;
			}

			p {
				color: #666;
			}
		}

		.step1color {
			color: #ed878e;
		}

		.contentBoxBorder1 {
			border-color: #ed878e;
		}

		.trianglecolor1 {
			border-bottom: 0.2rem solid #ed878e;
		}

		.step2color {
			color: #7dc36d;
		}

		.contentBoxBorder2 {
			border-color: #7dc36d;
		}

		.trianglecolor2 {
			border-bottom: 0.2rem solid #7dc36d;
		}

		.step3color {
			color: #43b3db;
		}

		.contentBoxBorder3 {
			border-color: #43b3db;
		}

		.trianglecolor3 {
			border-bottom: 0.2rem solid #43b3db;
		}

		.step4color {
			color: #ffac69;
		}

		.contentBoxBorder4 {
			border-color: #ffac69;
		}

		.trianglecolor4 {
			border-bottom: 0.2rem solid #ffac69;
		}

		.step5color {
			color: #e6a08a;
		}

		.contentBoxBorder5 {
			border-color: #e6a08a;
		}

		.trianglecolor5 {
			border-bottom: 0.2rem solid #e6a08a;
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
			top: 1.2rem;
			width: 1.68rem;
			height: 1.71rem;
		}

		.rightArrow {
			position: absolute;
			right: -1.6rem;
			top: 1.2rem;
			width: 1.68rem;
			height: 1.71rem;
		}

	}
</style>
