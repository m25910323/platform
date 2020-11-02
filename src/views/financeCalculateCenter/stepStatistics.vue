<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>银行对账步骤统计</div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
					<el-form-item label="提交时间:">
						<el-date-picker v-model="uploadData.date" type="month" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
						<!-- <el-button @click='dzexport' size="mini" :disabled="tableList.length == 0">导出</el-button> -->
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="tableList" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="步骤统计" prop="state" :resizable="false" width="300px"></el-table-column>
					<el-table-column align="center" label="提交时间" prop="date" :resizable="false"></el-table-column>
					<el-table-column align="center" label="数量" :resizable="false">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click='showDetail(scope.row)'>{{scope.row.cou}}</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="dzexport(scope.row)">导出</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog title="查看" :visible.sync="dialogVisible" width="8rem">
			<el-table :data="detail" style="width: 100%" stripe border v-loading='loading'>
				<el-table-column align="center" label="客户名称" prop="customername" :resizable="false" width="300px"></el-table-column>
				<el-table-column align="center" label="开始账期" prop="startperiod" :resizable="false"></el-table-column>
				<el-table-column align="center" label="结束账期" prop="endperiod" :resizable="false"></el-table-column>
				<el-table-column align="center" label="银行名称" prop="bankname" :resizable="false"></el-table-column>
				<el-table-column align="center" label="银行账号" prop="bankaccount"  width="240" :resizable="false"></el-table-column>
				<el-table-column align="center" label="客户邮箱" prop="email" width="200" :resizable="false"></el-table-column>
				<el-table-column align="center" label="分配时间" prop="createtime" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="执行人" prop="accountantname" :resizable="false"></el-table-column>
				<el-table-column align="center" label="是否已比对" width="120" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.havecompare ? "是":"否"}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态" :resizable="false">
					<template slot-scope="scope">
						
						<el-tooltip class="item" effect="dark" content="邮件未收到或者邮件主题格式不正确" placement="top" v-if='scope.row.status == 1'>
							<span>已开始</span>
						</el-tooltip>
						<!-- <span v-if='scope.row.status == 1'>已开始</span> -->
						<!-- <span v-if='scope.row.status == 2'>邮件已收到</span> -->
						<el-tooltip class="item" effect="dark" content="无法识别对账单文件内容或者e9没有账单" placement="top" v-if='scope.row.status == 2'>
							<span>邮件已收到</span>
						</el-tooltip>
						<span v-if='scope.row.status == 3'>对账中</span>
						<span v-if='scope.row.status == 4'>对账结束</span>
						<span v-if='scope.row.status == 5'>取消</span>
					</template>
				</el-table-column>
				
			</el-table>
			<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination> -->
			<div class='btn_contain clearfix'>
				<span class='close' @click="hideDialog">关闭</span>

			</div>
			
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				date:'',
				loading: false,
				
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				innerVisible: false,
				
				detail: [],
				uploadData: {},
				

				
			}
		},
		components: {},
		methods: {
			queryListByPage() {
				let param = {
					date:this.date
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/getDzList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			// queryDetail(row){
			// 	let param = {
			// 		date:row.date,
			// 		state:row.state,
			// 	};
			// 	this.axios.post('/perTaxToolTwo/dz/dzDealController/queryListByPage', param).then(res => {
			// 		this.loading = false;
			// 		if (res.data.code == 200) {
			// 			this.total = res.data.count;
			// 			this.detail = res.data.data;
			// 		} else {
			// 			this.$message({
			// 				message: res.data.msg,
			// 				type: 'error'
			// 			});
			// 		}
				
			// 	}).catch(function(err) {
			// 		this.$message({
			// 			message: '获取列表失败',
			// 			type: 'error'
			// 		});
			// 	})
			// },
			showDetail(row) {
				// this.dialogVisible = true;
				// this.queryDetail(row);
				this.$router.push({
					path:'/financeCalculateCenter/cashier',
					query:{
						state:row.state,
						date:row.date,
						status:row.status
					}
				})
			},

			search() {
				this.loading = true;
				this.date = this.uploadData.date;
				// this.currentPage = 1;
				this.queryListByPage()
			},
			
			
			

			handleDownload(index, row) {
				
				window.location.href = '/perTaxToolTwo/dz/dzDealController/downloadPDF?filename=' + row.remark1;
				
			},


			hideDialog() {
				this.dialogVisible = false;
			},
			
			dzexport(row){
				window.location.href = '/perTaxToolTwo/dz/dzDealController/downloadDz?date=' + row.date + '&status=' + row.status;
			},
			
			
			
		},
		created() {
			this.queryListByPage();
			// this.getBankList()
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;

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
	}

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}

		/deep/ .el-select__caret {
			color: #fff
		}

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-button {
			color: #43b3db;
		}

		/deep/ .el-range-input {
			color: #fff;
			background: transparent
		}

		/deep/ .el-range-separator {
			color: #fff;
		}

		/deep/ .el-range__icon {
			color: #fff;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem
		}

		/deep/ .el-input__inner {
			background: transparent;
			color: #fff;
			border: 1px solid #fff;
		}

		/deep/ .el-input__inner:hover {
			border-color: #fff;
		}

		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		padding: 0.2rem 0.2rem;
		background: #fff;

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table__header tr,
	.el-table__header th {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table td {
		padding: 6px 0;
	}

	/deep/ .el-table th {
		background-color: #ebf6fb;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #ebf6fb;
	}

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
	}

	/deep/ .el-form-item__content {
		width: 180px;
	}

	/deep/ .el-date-editor.el-input {
		width: 180px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
		background-color: #fff7f1;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #efe9e5;
	}

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #ebf6fb;
	}

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	/deep/ .el-dialog {
		.el-table:before {
			background-color: transparent;
		}
	}
</style>
