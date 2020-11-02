<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>工作台</el-breadcrumb-item>
			<el-breadcrumb-item>通话记录查询</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>通话记录</h3>
				
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					
					<el-tabs style="height:100%" v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="按呼叫人" name="1">
							
							<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
								
								<el-form-item label="通话时间" prop="create_time">
									<el-date-picker v-model="uploadData.create_time" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="号码" prop="caller">
									<el-input v-model="uploadData.caller" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								<el-form-item label="省" prop="number_provice">
									<el-input v-model="uploadData.number_provice" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								<el-form-item label="市" prop="number_city">
									<el-input v-model="uploadData.number_city" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								
								<el-form-item label="呼叫类型" prop="call_direction">
									<el-select v-model="uploadData.call_direction" placeholder="请选择" clearable filterable>
										<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
										<el-option v-for="item in directionList" :label="item.label" :value='item.value'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否解决" prop="isSolve">
									<el-select v-model="uploadData.isSolve" placeholder="请选择" clearable filterable>
										
										<el-option v-for="item in isSolveList" :label="item.label" :value='item.value'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否三天内" prop="isThreeDay">
									<el-select v-model="uploadData.isThreeDay" placeholder="请选择" clearable filterable>
										
										<el-option v-for="item in isSolveList" :label="item.label" :value='item.value'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="" prop="dossierName">
									<el-button size="mini" type='primary' @click='search'>搜索</el-button>
									<!-- <el-button size="mini" type='primary' @click='handleMul()' :disabled="multipleSelection.length == 0">批量领用</el-button> -->
								</el-form-item>
							</el-form>
						</el-tab-pane>
						<el-tab-pane label="按客户" name="2">
							<el-form :inline="true" :model="uploadData1" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
								<el-form-item label="客户名称" prop="customer_name">
									<el-input v-model="uploadData1.customer_name" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								<el-form-item label="通话时间" prop="create_time">
									<el-date-picker v-model="uploadData1.create_time" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
									</el-date-picker>
								</el-form-item>
								<el-form-item label="号码" prop="caller">
									<el-input v-model="uploadData1.caller" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								<el-form-item label="省" prop="number_provice">
									<el-input v-model="uploadData1.number_provice" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								<el-form-item label="市" prop="number_city">
									<el-input v-model="uploadData1.number_city" placeholder="请输入" clearable>
									</el-input>
								</el-form-item>
								
								<el-form-item label="呼叫类型" prop="call_direction">
									<el-select v-model="uploadData1.call_direction" placeholder="请选择" clearable filterable>
										<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
										<el-option v-for="item in directionList" :label="item.label" :value='item.value'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否解决" prop="isSolve">
									<el-select v-model="uploadData1.isSolve" placeholder="请选择" clearable filterable>
										
										<el-option v-for="item in isSolveList" :label="item.label" :value='item.value'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否三天内" prop="isThreeDay">
									<el-select v-model="uploadData1.isThreeDay" placeholder="请选择" clearable filterable>
										
										<el-option v-for="item in isSolveList" :label="item.label" :value='item.value'></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="" prop="dossierName">
									<el-button size="mini" type='primary' @click='search1'>搜索</el-button>
									<!-- <el-button size="mini" type='primary' @click='handleMul()' :disabled="multipleSelection.length == 0">批量领用</el-button> -->
								</el-form-item>
							</el-form>
						</el-tab-pane>
					</el-tabs>
					
					
					
				</div>
				<el-table :data="tableList" style="width: 100%" v-loading='loading' v-show="activeName =='1'">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
				
					
					<el-table-column align="center" label="呼叫类型" prop="call_direction" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.call_direction == 0'>呼入</span>
							<span v-else>呼出</span>
						</template>
					</el-table-column>
				
					<el-table-column align="center" label="呼叫人号码" prop="caller" :resizable="false"></el-table-column>
				
					<el-table-column align="center" label="呼叫人姓名" prop="callername" :resizable="false"></el-table-column>
					<el-table-column align="center" label="通话时间" prop="create_time" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.create_time,'yyyy-MM-dd hh:mm:ss')}}</span>
						</template>
					</el-table-column>
				
					<el-table-column align="center" label="通话时长" prop="duration" :resizable="false"></el-table-column>
					
				
					<el-table-column align="center" label="是否解决" prop="is_solve" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.is_solve==1">是</span>
							<span v-show="scope.row.is_solve==0">否</span>
							<span v-show="scope.row.is_solve==null"></span>
						</template>
					</el-table-column>
				
				
					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<!-- <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">回拨</el-button> -->
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,2)">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total"  v-show="activeName =='1'">
				</el-pagination>
				
				<el-table :data="tableList1" style="width: 100%" v-loading='loading' v-show="activeName =='2'">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
				
					
					<el-table-column align="center" label="客户名称" prop="customer_name" :resizable="false"></el-table-column>
				
					<!-- <el-table-column align="center" label="呼叫人" prop="caller" :resizable="false"></el-table-column> -->
				
					<el-table-column align="center" label="呼叫电话" prop="caller" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="区域" prop="area" :resizable="false"></el-table-column> -->
				
					<!-- <el-table-column align="center" label="客户经理" prop="librarySheet2" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="账期" prop="account_period" :resizable="false"></el-table-column>
				
					<el-table-column align="center" label="服务状态" prop="service_status" :resizable="false"></el-table-column>
				
					<!-- <el-table-column align="center" label="合同类型" prop="voucherNo" :resizable="false"></el-table-column> -->
					<!-- <el-table-column align="center" label="税务类型" prop="tax_type" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="申报税务类型" prop="declare_type" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="欠费记录" prop="position" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="通话时间" prop="create_time" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.create_time,'yyyy-MM-dd hh:mm:ss')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="通话时长" prop="duration" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否解决" prop="is_solve" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.is_solve==1">是</span>
							<span v-show="scope.row.is_solve==0">否</span>
							<span v-show="scope.row.is_solve==null"></span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="合同开始时间" prop="contract_start_time" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contract_start_time,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="合同结束时间" prop="contract_end_time" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contract_end_time,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
				 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1" v-show="activeName =='2'">
				</el-pagination>
			</div>

		</div>
		
		
		

		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				activeName:'1',
				uploadData:{
					isThreeDay:1
				},
				uploadData1:{
					isThreeDay:1
				},
				isThreeDay:1,
				form2: {},
				form1: {},
				
				multipleSelection: [],
				
				loading: false,
				loading1: false,
				
				userName: '',
				
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				
				currentPage1: 1,
				pageSize1: 10,
				total1: 0,
				tableList: [],
				tableList1: [],
				dialogVisible: false,
				dialogVisible1: false,
				
				directionList:[
					{label:'呼入',value:0},
					{label:'呼出',value:1}
				],
				isSolveList:[
					{label:'是',value:1},
					{label:'否',value:0}
				]

			}
		},
		components: {},
		methods: {
			
			handleClick(tab){
				console.log(tab.name);
			},
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			hideDialog1() {
				this.dialogVisible1 = false;
				this.reset();
			},
			
			reset() {
				this.form1 = {};
				this.form2 = {};
			},
			
			search() {
				this.create_time = this.uploadData.create_time;
				this.caller = this.uploadData.caller;
				this.number_provice = this.uploadData.number_provice;
				this.number_city = this.uploadData.number_city;
				this.call_direction = this.uploadData.call_direction;
				this.isSolve = this.uploadData.isSolve;
				this.isThreeDay = this.uploadData.isThreeDay;
				this.queryListByPage()
			},
			
			search1() {
				this.customer_name = this.uploadData1.customer_name;
				this.create_time = this.uploadData1.create_time;
				this.caller = this.uploadData1.caller;
				this.number_provice = this.uploadData1.number_provice;
				this.number_city = this.uploadData1.number_city;
				this.call_direction = this.uploadData1.call_direction;
				this.isSolve = this.uploadData1.isSolve;
				this.isThreeDay = this.uploadData1.isThreeDay;
				this.queryListByPage1()
			},
			
			
			queryListByPage() {
				this.loading = true;
			
			
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					
						create_time : this.create_time,
						caller : this.caller,
						number_provice : this.number_provice,
						number_city : this.number_city,
						call_direction : this.call_direction,
						isSolve : this.isSolve,
						isThreeDay : this.isThreeDay
					
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/getCallInfoByUser', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
						this.total = res.data.count;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			
			queryListByPage1() {
				this.loading = true;
			
			
				let param = {
					"page": this.currentPage1,
					"row": this.pageSize1,
					
						customer_name:this.customer_name,
						create_time : this.create_time,
						caller : this.caller,
						number_provice : this.number_provice,
						number_city : this.number_city,
						call_direction : this.call_direction,
						isSolve : this.isSolve,
						isThreeDay : this.isThreeDay
					
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/getCallInfoByCust', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList1 = res.data.data;
						this.total1 = res.data.count;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			
			handleEdit(index, row) {
				this.$router.push({
					path:'/callCenter/callDetail',
					query:{
						call_log_id:row.call_log_id,
						caller:row.caller
					}
				})
			},
			handleMul(){
				this.dialogVisible1 = true;
			},
			
			
			
			
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},


			
			

			

			

		},
		created() {
			this.queryListByPage();
			this.queryListByPage1();
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
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


	}

	.contain_body {
		/* padding: 10px 20px; */
		margin: 20px 20px;
		height: 100%;
		background: #fff;
		
		.htitle {
			margin: 12px 0px 12px 20px;
			padding-left: 8px;
			border-left: 2px solid #409EFF;
			font-size: 14px;
		}
		h3{
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			padding-left: 20px;
			background: #fff;
		}
	}



	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 5px;
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

	/deep/ .el-table th,
	/deep/ .el-table tr {
		background-color: transparent;
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
	
	/deep/ .search_contain {
	
	
		/deep/ .el-form-item {
			width: 25%;
			margin-right: 0px;
		}
	
		/deep/ .el-form-item__content {
			width: 180px;
		}
	}
	.el-form {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap
	}
	/* /deep/ .el-form-item {
		width: 20%;
	} */

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
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}

	/deep/ .custom-tree-node {
		width: 100%
	}
</style>
