<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案查阅</el-breadcrumb-item>
			<el-breadcrumb-item>档案审批</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="借阅人" prop="borrowUserName">
						<el-input v-model="uploadData.borrowUserName" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="借阅时间" prop="borrowTime">
						<el-date-picker v-model="uploadData.borrowTime" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="归还时间" prop="returnTime">
						<el-date-picker v-model="uploadData.returnTime" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="审批状态" prop="borrwoStatus">
						<el-select v-model="uploadData.borrwoStatus" placeholder="请选择" clearable filterable>
							<el-option v-for="item in borrwoStatusList" :label="item.label" :value='item.value'></el-option>
						
						</el-select>
						
					</el-form-item>
					<el-button type="info" @click='resetForm()' size="small" style="float: right;">  重  置  </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;">  查  找  </el-button>
					

				</el-form>
			</div>
		</div>

		<div class='main_contain'>
			<!-- <p>{{customerName}}</p> -->
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="日期" prop="createTime">
					<template slot-scope="scope">
						<span>{{scope.row.createTime?formatTimeToStr(scope.row.createTime,'yyyy-MM-dd'):''}}</span>
					
					</template>
				</el-table-column>

				<el-table-column align="center" label="借阅人" prop="borrowUserName"></el-table-column>
				<!-- <el-table-column align="center" label="借阅年度" prop="fbeginCreditBalance"></el-table-column> -->
				<el-table-column align="center" label="借阅档案" prop="customerName"></el-table-column>
				<el-table-column align="center" label="借阅目的" prop="borrowPourse"></el-table-column>
				<el-table-column align="center" label="借阅时间" prop="borrowTime">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.borrowTime,'yyyy-MM-dd')}}</span>

					</template>
				</el-table-column>
				<el-table-column align="center" label="归还时间" prop="returnTime">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.returnTime,'yyyy-MM-dd')}}</span>

					</template>
				</el-table-column>
				<el-table-column align="center" label="审批状态">
					<template slot-scope="scope">
						<span v-show="scope.row.borrwoStatus == 0" style="color: #E6A23C;">审批中</span>
						<span v-show="scope.row.borrwoStatus == 1" style="color: #67C23A;">已借阅</span>
						<span v-show="scope.row.borrwoStatus == 2" style="color: #67C23A;">已归还</span>
						<span v-show="scope.row.borrwoStatus == 3" style="color: #F56C6C;">已逾期</span>
						<span v-show="scope.row.borrwoStatus == 4" style="color: #F56C6C;">审批不通过</span>
						<!-- <span v-show="scope.row.borrwoStatus == 5" style="color: #67C23A;">审批通过</span> -->
					</template>
				</el-table-column>
				<el-table-column align="center" label="审批人" prop="approveUserName"></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='handleApprove(scope.row,1)' v-show='scope.row.borrwoStatus == 0'>审批通过</el-button>
						<el-button type="text" size="mini" @click='handleApprove(scope.row,4)' v-show='scope.row.borrwoStatus == 0'>审批不通过</el-button>
						<span v-show='scope.row.borrwoStatus != 0'>--</span>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>


			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>




	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				total: 0,
				detail: {},
				loading: false,

				fyear: this.formatTimeToStr(new Date(), 'yyyy'),

				uploadData: {
					fyear: this.formatTimeToStr(new Date(), 'yyyy'),
				},
				customerId: '',
				tableData: [],

				customerName: '',
				dialogVisible: false,
				pdfUrl: '',
				borrwoStatusList:[
					{label:'全部',value:''},
					{label:'审批中',value:0},
					{label:'已借阅',value:1},
					{label:'已归还',value:2},
					{label:'已逾期',value:3},
					{label:'审批不通过',value:4},
				]
			}
		},
		components: {},
		methods: {
			resetForm(){
				this.uploadData = {};
			},
			hideDialog() {
				this.dialogVisible = false;
				this.detail = {}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},

			refresh() {
				this.queryPage()
			},

			search() {
				this.borrowUserName = this.uploadData.borrowUserName;
				this.borrowTime = this.uploadData.borrowTime;
				this.returnTime = this.uploadData.returnTime;
				this.borrwoStatus = this.uploadData.borrwoStatus;
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						"borrowUserName": this.borrowUserName,
						"borrowTime": this.borrowTime,
						"returnTime": this.returnTime,
						"borrwoStatus": this.borrwoStatus,

					}
				};
				this.axios.post('/perTaxToolTwo/ArchivesBorrowRecordInfo/findPageList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
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
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			handleApprove(row, tag) {
				if (tag == 1) {
					var title = "确认审批通过？"
				} else {
					var title = "确认审批不通过？"
				}
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"borrowRecordId": row.borrowRecordId,

						"borrwoStatus": tag

					};
					this.axios.post('/perTaxToolTwo/ArchivesBorrowRecordInfo/updateBorrowRecordInfo', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryPage();
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
				}).catch(() => {

				});
			}


		},
		computed: {},
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
