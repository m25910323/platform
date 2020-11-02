<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>人资系统</el-breadcrumb-item>
			<el-breadcrumb-item>员工管理</el-breadcrumb-item>
			<el-breadcrumb-item>人员流动明细表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="部门" prop="departmentName">
						
						<el-select v-model='uploadData.departmentName' placeholder="请选择" filterable clearable>
							<el-option v-for='item in departList' :label="item.orgName" :value="item.orgName" :key='item.orgId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="姓名" prop="userName">
						<el-input v-model="uploadData.userName">
						</el-input>
					</el-form-item>
					<el-form-item label="开始日期" prop="startDate">
						<el-date-picker v-model="uploadData.startDate" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="结束日期" prop="endDate">
						<el-date-picker v-model="uploadData.endDate" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="类型" prop="recordType">
						<el-select v-model="uploadData.recordType" placeholder="请选择">
							<el-option v-for='item in recordTypeList' :label="item.label" :value="item.value"></el-option>
						</el-select>
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
				<el-table-column align="center"
				      type="index"
				      width="50">
				    </el-table-column>
				<el-table-column align="center" label="类型" prop="recordType">
					<template slot-scope="scope">
						<span v-if="scope.row.recordType == 1">入职</span>
						<span v-if="scope.row.recordType == 2">离职</span>
						<span v-if="scope.row.recordType == 3">社保减少</span>
						<span v-if="scope.row.recordType == 4">社保增加</span>
						<span v-if="scope.row.recordType == 5">公积金减少</span>
						<span v-if="scope.row.recordType == 6">公积金增加</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
				<el-table-column align="center" label="姓名" prop="userName"></el-table-column>
				<el-table-column align="center" label="工号" prop="userCode"></el-table-column>
				<el-table-column align="center" label="工号开取时间" prop="employeeNoOpenTime"></el-table-column>
				<el-table-column align="center" label="入职日期" prop="entryDate">
					<template slot-scope="scope">
						<span>{{scope.row.entryDate?formatTimeToStr(scope.row.entryDate,'yyyy-MM-dd'):'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="银行卡号" prop="bankCardNo"></el-table-column>
				<el-table-column align="center" label="开户行" prop="bankInfo"></el-table-column>
				<el-table-column align="center" label="离职日期" prop="leaveDate">
					<template slot-scope="scope">
						<span>{{scope.row.leaveDate?formatTimeToStr(scope.row.leaveDate,'yyyy-MM-dd'):'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="隶属公司" prop="orgName"></el-table-column>
				<el-table-column align="center" label="备注" prop="remark"></el-table-column>
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
				startDate:this.formatTimeToStr(new Date(),'yyyy-MM-dd') ,
				endDate:this.formatTimeToStr(new Date(),'yyyy-MM-dd') ,
				recordType:0,
				uploadData: {
					recordType:0,
					startDate:this.formatTimeToStr(new Date(),'yyyy-MM-dd') ,
					endDate:this.formatTimeToStr(new Date(),'yyyy-MM-dd') ,
				},
				tableData: [],
				detail:{},
				detail1:{},
				personList:[],
				pageSize:10,
				currentPage:1,
				total:0,
				departList:[],
				recordTypeList:[
					{label:'全部',value:0},
					{label:'入职',value:1},
					{label:'离职',value:2},
					{label:'社保减少',value:3},
					{label:'社保增加',value:4},
					{label:'公积金减少',value:5},
					{label:'公积金增加',value:6},
					
				]
			}
		},
		components: {},
		methods: {
			resetForm() {
				this.uploadData = {};
			},
			refresh() {
				this.queryPage()
			},
			getDepart() {
				let params = {
					"orgType": 2
				}
				this.axios.post('/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
					if (res.data.code == 200) {
						this.departList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取公司列表失败',
						type: 'error'
					});
				})
			},

			search() {
				this.userName = this.uploadData.userName;
				this.startDate = this.uploadData.startDate;
				this.endDate = this.uploadData.endDate;
				this.departmentName = this.uploadData.departmentName;
				this.recordType = this.uploadData.recordType;
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
						"startDate": this.startDate,
						"endDate": this.endDate,
						"userName": this.userName,
						"recordType":this.recordType,
						"departmentName":this.departmentName,
					}

				};
				this.axios.post('/perTaxToolTwo/hrEmpInfo/getHrEmpFlowSituation', params)
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
			queryPersonList() {
				let params = {
					"page": 1,
					"row": 999,
					"data": {
						type: 1
					}
				}
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					if (res.data.code == 200) {
						this.personList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch(function(err) {
					this.$message({
						message: '获取角色列表失败',
						type: 'error'
					});
				})
			},
		},
		computed: {},
		created() {
			this.queryPage();
			this.getDepart();
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
