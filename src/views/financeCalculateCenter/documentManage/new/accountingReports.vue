<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案整理</el-breadcrumb-item>
			<el-breadcrumb-item>会计报表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="90px">
					<el-form-item label="客户名称" prop="customer">
						<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key='customerId'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>

						</el-select>
					</el-form-item>
					<el-form-item label="会计时间" prop="fyear">
						<el-date-picker v-model="uploadData.fyear" type="year" placeholder="请选择" value-format="yyyy" format="yyyy">
						</el-date-picker>
					</el-form-item>

					<el-button type="primary" @click='search()' size="small">  查  找  </el-button>

				</el-form>
			</div>
		</div>
		
		
		
		<div class='main_contain'>
			<p>{{customerName}}</p>
			
			
			
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="会计时间" prop="label"></el-table-column>
				<el-table-column align="center" label="资产负债表">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='jumpToFZB(scope.row.label)'>查看详情</el-button>
					</template>
				</el-table-column>
				
				<el-table-column align="center" label="现金流量表" prop="fnumber">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='jumpToLLB(scope.row.label)'>查看详情</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="利润表" prop="fperiod">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='jumpToLRB(scope.row.label)'>查看详情</el-button>
					</template>
				</el-table-column>
				
			</el-table>
			
			
			
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>
		
		<el-dialog title="详情" :visible.sync="dialogVisible" width="1300px">
			
			
		</el-dialog>


	</div>
</template>

<script>	
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				
				loading: false,
				fyear: this.formatTimeToStr(new Date(), 'yyyy'),
				
				uploadData: {
					fyear: this.formatTimeToStr(new Date(), 'yyyy'),
				},
				customerId: '',
				tableData: [],
				
				customerName:'',
				dialogVisible:false,
				monthList:[
					'01','02','03','04','05','06','07','08','09','10','11','12'
				]
				
			}
		},
		components: {},
		methods: {
			
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.fyear = this.uploadData.fyear;
				this.tableData = [];
				// this.tableData.push({label:this.fyear})
				this.monthList.forEach(item => {
					this.tableData.push({label:this.fyear + '-' + item})
				})
				console.log(this.tableData)
			},

			jumpToFZB(label){
				this.$router.push({
					path:'/financeCalculateCenter/balanceStatement1',
					query:{
						belongDate:label,
						customerName:this.customerName,
						customerId:this.customerId,
					}
				})
			},
			jumpToLLB(label){
				this.$router.push({
					path:'/financeCalculateCenter/cashStatement1',
					query:{
						belongDate:label,
						customerName:this.customerName,
						customerId:this.customerId,
					}
				})
			},
			jumpToLRB(label){
				this.$router.push({
					path:'/financeCalculateCenter/profitStatement1',
					query:{
						belongDate:label,
						customerName:this.customerName,
						customerId:this.customerId,
					}
				})
			},
			
		},
		computed: {},
		created() {
			// this.queryPage();
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
				color:#8C8C8C;
				
				span:nth-of-type(1){
					width: 50%;
					float:left;
					font-size:0.32rem;
					height:0.45rem;
					line-height:0.45rem;
					text-align: center;
				}
				span:nth-of-type(2){
					width: 50%;
					float:left;
					font-size:0.15rem;
					height:0.22rem;
					line-height:0.25rem;
					/* padding-left:0.12rem */
				}
				span:nth-of-type(3){
					width: 50%;
					float:left;
					font-size:0.15rem;
					height:0.22rem;
					line-height:0.18rem;
					/* padding-left:0.12rem */
				}
			}
		}


	.active-select {
		border-color: #409EFF !important;
		background-color: #409EFF !important;
		color:#fff !important
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
