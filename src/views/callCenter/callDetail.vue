<template>
	<div class='main_contain'>
		<el-page-header @back="goBack" content="通话详情">
		</el-page-header>

		<div class="contain_body clearfix">
			<div style="padding-top: 12px;">
				<div style="padding-top: 12px;">
					<h3 class='htitle'>本次通话信息</h3>
					<!-- <h3 style="margin-bottom: 10px;">本次通话信息</h3> -->
					
					<el-form :inline="true" :model="detail" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="detail.customerName" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="客户号码" prop="customerName">
							<el-input :value="detail.callDirection == 0?detail.caller:detail.callee" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="呼叫时间" prop="createTime">
							<el-input v-model="detail.createTime" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="通话时长" prop="duration">
							
							<el-input v-model="detail.duration" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="呼叫类型" prop="callDirection">
							<el-input :value="detail.callDirection == 0?'呼入':'呼出'" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="客服号码" prop="callee">
							<el-input  :value="detail.callDirection == 1?detail.caller:detail.callee" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="接待客服" prop="userName">
							<el-input v-model="detail.userName" disabled>
							</el-input>
						</el-form-item>
						
						
						
						
						<!-- <el-form-item label="评分" prop="score">
							<el-input v-model="detail.score" disabled>
							</el-input>
						</el-form-item> -->
						<!-- <el-form-item label="是否解决" prop="isSolve">
							<el-radio-group v-model="detail.isSolve" disabled>
							    <el-radio :label="1">解决</el-radio>
							    <el-radio :label="0">未解决</el-radio>
							  </el-radio-group>
						</el-form-item>
						<el-form-item label="事项类型" prop="businessType">
							<el-input type="textarea" v-model="detail.businessType" :rows="5">
							</el-input>
						</el-form-item>
						<el-form-item label="具体内容" prop="problem">
							<el-input type="textarea" v-model="detail.problem" :rows="5">
							</el-input>
						</el-form-item> -->
					</el-form>
				</div>
				
				<div style="padding-top: 12px;">
					<h3 class='htitle'>通话录音</h3>
					<audio :src="detail.voiceAliyunUrl" controls="controls" style="margin-left: 20px;">
					Your browser does not support the audio element.
					</audio>
				</div>
				
				<div style="padding-top: 12px;">
					<h3 class='htitle'>通话详情</h3>
					<el-form :model="detail" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
						
						<el-form-item label="是否解决" prop="isSolve" style="width: 100%;">
							<el-radio-group v-model="detail.isSolve">
							    <el-radio :label="1">解决</el-radio>
							    <el-radio :label="0">未解决</el-radio>
							  </el-radio-group>
						</el-form-item>
						<el-form-item label="事项类型" prop="businessType1" style="width: 100%;">
							<el-input type="textarea" v-model="detail.businessType1" :rows="5" disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="事项类型" prop="businessType" style="width: 100%;">
							<el-cascader v-model="detail.businessType"
							    :options="callLogItem"
							    :props="props"
							    clearable></el-cascader>
							<!-- <el-input type="textarea" v-model="detail.businessType" :rows="5">
							</el-input> -->
						</el-form-item>
						<el-form-item label="具体内容" prop="problem" style="width: 100%;">
							<el-input type="textarea" v-model="detail.problem" :rows="5">
							</el-input>
						</el-form-item>
						<el-form-item label=" " prop="problem">
							<el-button type="primary" size="mini" @click='commitFP'>确定</el-button>
						</el-form-item>
						
					</el-form>
				</div>
				
				<h3 class='htitle'>关联公司</h3>
				
				<el-table :data="tableList" style="width:calc(100% - 40px);margin: 0 20px;" v-loading='loading' v-show="activeName =='1'">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
				
					<!-- <el-table-column align="center" label="行政区域" prop="area" :resizable="false"></el-table-column> -->
					<!-- <el-table-column align="center" label="合同状态" prop="serviceStatus" :resizable="false"></el-table-column> -->
					<!-- <el-table-column align="center" label="税务类型" prop="taxType" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
				
					<el-table-column align="center" label="申报税务类型" prop="declareType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同开始时间" prop="contractStartTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contractStartTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="合同结束时间" prop="contractEndTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contractEndTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
				
					<!-- <el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,2)">详情</el-button>
						</template>
					</el-table-column> -->
				</el-table>
				<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total"  v-show="activeName =='1'">
				</el-pagination> -->
				
			</div>
			
			<div style="height: 12px;background: rgb(243,246,249);"> </div>
			

		</div>
		
		
		

		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				props: {
					multiple: true ,
					label:'itemName',
					value:'itemId',
					children:'items'
				},
				callLogItem: [],
				
				activeName:'1',
				uploadData:{},
				uploadData1:{},
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
				detail:{}

			}
		},
		components: {},
		methods: {
			goBack(){
				this.$router.push({
					path: '/callCenter/workbench',
				})
			},
			getAllCallLogItem(){
				let param = {
					
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.get('/perTaxToolTwo/callCenter/CallLog/getAllCallLogItem').then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.callLogItem = res.data.data;
				
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
			commitFP(){
				if(this.detail.businessType){
					var str = '';
					this.detail.businessType.forEach(item => {
						str += item[item.length - 1] + ',';
					})
					str = str.substring(0, str.length - 1); 
				}
				 
				let param = {
					"problem": this.detail.problem,
					"isSolve": this.detail.isSolve,
					businessType:str,
					"callLogId": this.detail.callLogId,
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/updateCallLogInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.queryListByPage1();
						// this.queryListByPage1();
				
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
			
			
			
			
			
			
			queryListByPage(data) {
				this.loading = true;
			
			
				let param = {
					customer_phone:data
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/getCustomerInfo', param).then(res => {
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
					call_log_id:this.$route.query.call_log_id
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/selectCallLogInfoById', this.qs.stringify(param)).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.detail = res.data.data;
						this.detail.businessType1 = this.detail.businessType;
						if(this.detail.callDirection == 1){
							this.queryListByPage(this.detail.callee)
						}else{
							this.queryListByPage(this.detail.caller)
						}
						
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
				this.dialogVisible = true;
				this.form2 = JSON.parse(JSON.stringify(row));
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
			//查询客户
			this.queryListByPage();
			//查询通话记录
			this.queryListByPage1();
			
			this.getAllCallLogItem()
		},
		watch: {
			
			'$route'(to, from) {
				// init data
				if (to.name == 'callDetail') {
					//查询客户
					this.queryListByPage();
					//查询通话记录
					this.queryListByPage1();
					
					this.getAllCallLogItem()
				}
				
		
			}
		},

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;
		.el-page-header {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			background-color: #fff;
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box;
			margin-bottom: 12px;
		}
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
		/* height: 100%; */
		background: #fff;
		
		.htitle {
			height: 20px;
			line-height: 20px;
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
		width: 250px;
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
