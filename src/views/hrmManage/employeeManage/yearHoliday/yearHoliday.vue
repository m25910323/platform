<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>人资系统</el-breadcrumb-item>
			<el-breadcrumb-item>员工管理</el-breadcrumb-item>
			<el-breadcrumb-item>年假统计表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<!-- <el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item> -->
					<!-- <el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>

					</el-form-item> -->

					<el-form-item label="姓名" prop="userName">
						<el-input v-model="uploadData.userName">
						</el-input>
					
					</el-form-item>

					<el-button type="primary" @click='search()' size="small">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
				
			</div>



			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<el-table-column align="center" label="部门" prop="org_name"></el-table-column>
				
				<el-table-column align="center" label="姓名" prop="user_name"></el-table-column>
				<el-table-column align="center" label="岗位" prop="posn_name"></el-table-column>
				

				
				<el-table-column align="center" label="入职时间" prop="entry_date">
					<template slot-scope="scope">
						<span>{{scope.row.entry_date?formatTimeToStr(scope.row.entry_date,'yyyy-MM-dd'):'--'}}</span>

					</template>
				</el-table-column>
				
				<el-table-column align="center" label="入职年限（满年计入）" prop="userYear"></el-table-column>
				<el-table-column align="center" label="年假（当年年份）" prop="yearHoliday"></el-table-column>
				<el-table-column align="center" label="已休年假" prop="days"></el-table-column>
				<el-table-column align="center" label="未休年假" prop="remainDays"></el-table-column>
				<!-- <el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column> -->

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>

		

		

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				loading: false,
				accountPeriod: '',

				uploadData: {
					accountPeriod: '',
				},
				customerId: '',
				tableData: [],
				dialogVisible: false,
				dialogVisible1: false,
				multipleSelection:[],
				detail:{},
				detail1:{},
				personList:[],
				pageSize:10,
				currentPage:1,
				total:0
			}
		},
		components: {},
		methods: {
			
			
			refresh() {
				this.queryPage()
			},

			search() {
				this.userName = this.uploadData.userName;
				// this.accountPeriod = this.uploadData.accountPeriod;
				this.queryPage()
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.queryPage()
			},

			
			
			
			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						// "customerId": this.customerId,
						// "accountPeriod": this.accountPeriod,
						"userName": this.userName,
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/queryYearHolidayList', params)
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
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}

	/deep/ .el-select {
		width: 180px;
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
