<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>结账状态查询</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="90px">
					<el-form-item label="客户名称" prop="fBrNo">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>

						</el-select>
					</el-form-item>
					

					<el-button type="info" @click='resetForm()' size="small" style="float: right;">  重  置  </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;">  查  找  </el-button>

				</el-form>
			</div>
		</div>

		<!-- <div style="margin-left: 20px;">
			<div style="float: left;height: 0.45rem;line-height: 0.45rem;margin-right: 20px;">
				<i class="el-icon-arrow-left" @click='prev()' style="font-size: 20px;"></i>
				<span style="font-size: 20px;">{{fyear}}</span>
				<i class="el-icon-arrow-right" @click='next()' style="font-size: 20px;"></i>
			</div>

			<div class="Article-nav">
				<div class="Article-circle" v-for='(item,index) in lineList' :class="selectNum==index?'active-select':''" @click="selectNumChange(index)">
					<span>{{item.month}}</span>
					<span>月</span>
					<span>{{item.monthEn}}</span>
				</div>
			</div>
		</div> -->

		<div class='main_contain'>
			<!-- <p>{{customerName}}</p> -->
			<!-- <div style="text-align: center;" class="clearfix">
				<el-radio-group v-model="radio3" size="small" style="float: left;" @change="setRadio">
					<el-radio-button label="总账"></el-radio-button>
					<el-radio-button label="明细账"></el-radio-button>
					<el-radio-button label="日记账" disabled></el-radio-button>
				</el-radio-group>
				<p style="display: inline-block;width:200px">{{customerName}}</p>

				<el-button class="el-icon-download" type='text' size="mini" v-show="radio3 == '明细账'" :disabled="arr1.length <= 0"
				 @click='exportExcel1()' style='float:right'>打印</el-button>
				<el-button class="el-icon-download" type='text' size="mini" v-show="radio3 == '总账'" :disabled="arr.length <= 0"
				 @click='exportExcel()' style='float:right'>打印</el-button>
				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div> -->


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="执行人">
					<template slot-scope="scope">
						<span v-html="scope.row.user.nickName"></span>
					</template>
				</el-table-column>
				<el-table-column align="center" :resizable="false" width="200">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看步骤</el-button>
						<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)">终止结账</el-button>
						
					</template>
				</el-table-column>
				
			</el-table>
			<!-- <el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size='pageSize'
			 @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination> -->


			
			
			
		</div>

		<el-dialog title="查看步骤" :visible.sync="dialogVisible" width="1200px" class='dialog' :show-close='false'
		 :close-on-press-escape='false' :close-on-click-modal='false'>
			<el-table :data="stepDataList" style="width: 100%;margin-top: 10px;" stripe border>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="步骤名称" prop='stepName'></el-table-column>
				<el-table-column align="center" label="开始时间" prop='startTime'></el-table-column>
				<el-table-column align="center" label="结束时间" prop='endTime'></el-table-column>
				<el-table-column align="center" label="执行状态">
					<template slot-scope="scope">
						<span v-show='scope.row.status == 1'>执行中</span>
						<span v-show='scope.row.status == 2'>已完成</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="备注" prop='remark'></el-table-column>
				
				<!-- <el-table-column align="center" label="本年累计数" prop="fYtdAmount">
					<template slot-scope="scope">
						<span v-html='scope.row.fYtdAmount'></span>
					</template>
				</el-table-column> -->
		
			</el-table>
			<span slot="footer" class="dialog-footer">
				
				<el-button type="primary" @click="dialogVisible = false">关闭</el-button>
			</span>
			
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				
				stepDataList:[],
				loading: false,
				loading1: false,
				
				uploadData: {
					fBrNo:''
				},
				customerId: 0,
				tableData: [],
				fBrNo:'',
				customerName: '',
				dialogVisible: false,
				total:0,
				pageSize:30,
				currentPage:1,
			}
		},
		components: {},
		methods: {
			handleDetail(index,row){
				this.dialogVisible = true;
				this.stepDataList = row.stepDataList;
			},
			
			handleCurrentChange(val){
				this.currentPage = val;
			},
			resetForm(){
				this.uploadData = {};
			},
			
			search() {
				this.fBrNo = this.uploadData.fBrNo;
				this.queryPage();
				
			},

			queryPage() {
				this.loading = true;
				let params = {
					
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/findCheckoutList', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
							this.tableData = [];
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
						this.loading = false;
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			
			handlePass(index,row) {
				let param = {
					"uuid": row.uuid,
					"fBrNo": row.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/terminateVoucherCheckout', this.qs.stringify(param)).then(res => {
					this.loading10 = false;
					if (res.data.code == 200) {
						// this.dialogVisible = false;
						this.queryPage();
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.loading10 = false;
					this.$message({
						message: '终止结账失败',
						type: 'error'
					});
				})
			},
			
			
		},
		computed: {},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'voucherCheckoutQuery') {
					
				}
			
			}
			
		},
		created() {
			
			this.queryPage();
		}
	}
</script>

<style lang='less' scoped>
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

		.search_contain {
			background: #fff;
			height: 40px;
			/* padding-left: 20px; */
			padding: 0.3rem 20px;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
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
				text-align: right;
				margin-top: 10px;
			}
		}
	}


	.Article-nav {
		/* width: 1200px; */
		height: 0.45rem;
		box-sizing: border-box;
		/* background-color: red; */
		/* padding-top: 10px;
			padding-bottom: 10px; */
		margin-left: 20px;
		/* display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			justify-content: space-around; */

		.Article-circle {
			/* display: inline-block; */
			float: left;
			width: 1rem;
			height: 0.45rem;
			margin-right: 0.12rem;
			border: 1px solid #979797;
			background: #fff;
			cursor: pointer;
			box-sizing: border-box;
			color: #8C8C8C;

			span:nth-of-type(1) {
				width: 50%;
				float: left;
				font-size: 0.32rem;
				height: 0.45rem;
				line-height: 0.45rem;
				text-align: center;
			}

			span:nth-of-type(2) {
				width: 50%;
				float: left;
				font-size: 0.15rem;
				height: 0.22rem;
				line-height: 0.25rem;
				/* padding-left:0.12rem */
			}

			span:nth-of-type(3) {
				width: 50%;
				float: left;
				font-size: 0.15rem;
				height: 0.22rem;
				line-height: 0.18rem;
				/* padding-left:0.12rem */
			}
		}
	}


	.active-select {
		border-color: #409EFF !important;
		background-color: #409EFF !important;
		color: #fff !important
	}

	.next {
		width: 207px;
		height: 56px;
		background: rgba(36, 214, 137, 1);
		border: 3px solid rgba(36, 214, 137, 1);
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}

	.last {
		width: 207px;
		height: 56px;
		background: red;
		border: 3px solid red;
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}
</style>
