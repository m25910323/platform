<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案整理</el-breadcrumb-item>
			<el-breadcrumb-item>其他资料</el-breadcrumb-item>
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
					<el-form-item label="所属账期" prop="fyear">
						<el-date-picker v-model="uploadData.fyear" type="year" placeholder="请选择" value-format="yyyy" format="yyyy">
						</el-date-picker>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;">  重  置  </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;">  查  找  </el-button>

				</el-form>
			</div>
		</div>
		
		<div style="margin-left: 20px;">
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
		</div>
		
		<div class='main_contain'>
			<!-- <p>{{customerName}}</p> -->
			<div style="text-align: center;" class="clearfix">
				<el-radio-group v-model="radio3" size="small" style="float: left;" @change="setRadio">
				      <el-radio-button label="科目余额表"></el-radio-button>
				      <!-- <el-radio-button label="核算资料" disabled></el-radio-button>
				      <el-radio-button label="移交清册" disabled></el-radio-button> -->
				</el-radio-group>
				<p style="display: inline-block;width:200px">{{customerName}}</p>
				
				<el-button class="el-icon-download" type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button>
				<!-- <el-button class="el-icon-download" type='text' size="mini" :disabled="arr.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button> -->
				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>
			
			
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="科目代码" prop="fnumber"></el-table-column>
				<el-table-column align="" label="科目名称" prop='ffullname' width="500">
					<template slot-scope="scope">
						<span v-html='scope.row.ffullname'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="期初余额借方" prop="fbeginDebitBalance"></el-table-column>
				<el-table-column align="center" label="期初余额贷方" prop="fbeginCreditBalance"></el-table-column>
				<el-table-column align="center" label="本期发生借方" prop="fdebit"></el-table-column>
				<el-table-column align="center" label="本期发生贷方" prop="fcredit"></el-table-column>
				<el-table-column align="center" label="本年累计借方" prop="fytddebit"></el-table-column>
				<el-table-column align="center" label="本年累计贷方" prop="fytdcredit"></el-table-column>
				<el-table-column align="center" label="期末余额借方" prop="fendDebitBalance"></el-table-column>
				<el-table-column align="center" label="期末余额贷方" prop="fendCreditBalance"></el-table-column>
			
			</el-table>
			
			
			
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>
		
		<el-dialog title="详情" :visible.sync="dialogVisible" width="1300px">
			<div>
				<embed width="1260" height="600" :src="pdfUrl"></embed>
			</div>
			
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				lineList:[
					{month:1,monthEn:'Jan.'},
					{month:2,monthEn:'Feb.'},
					{month:3,monthEn:'Mar.'},
					{month:4,monthEn:'Apr.'},
					{month:5,monthEn:'May.'},
					{month:6,monthEn:'Jun.'},
					{month:7,monthEn:'Jul.'},
					{month:8,monthEn:'Agu.'},
					{month:9,monthEn:'Sep.'},
					{month:10,monthEn:'Oct.'},
					{month:11,monthEn:'Nov.'},
					{month:12,monthEn:'Dec.'},
				],
				radio3:'科目余额表',
				loading: false,
				loading1: false,
				fyear: this.formatTimeToStr(new Date(), 'yyyy'),
				selectNum: new Date().getMonth(),
				uploadData: {
					fyear: this.formatTimeToStr(new Date(), 'yyyy'),
				},
				customerId: 0,
				tableData: [],
				arr: [],
				arr1: [],
				customerName:'',
				dialogVisible:false,
				pdfUrl:'',
				resData:{}
			}
		},
		components: {},
		methods: {
			resetForm(){
				this.uploadData = {};
			},
			prev(){
				this.fyear --;
				switch (this.radio3){
					case '科目余额表':
						this.queryPageYEB()
						break;
					case '明细账':
						this.queryPageMXZ();
						break;
					default:
						break;
				}
			},
			next(){
				this.fyear ++;
				switch (this.radio3){
					case '科目余额表':
						this.queryPageYEB()
						break;
					case '明细账':
						this.queryPageMXZ();
						break;
					default:
						break;
				}
			},
			refresh(){
				switch (this.radio3){
					case '科目余额表':
						this.queryPageYEB()
						break;
					case '明细账':
						this.queryPageMXZ();
						break;
					default:
						break;
				}
			},
			setRadio(val){
				switch (val){
					case '科目余额表':
						this.queryPageYEB();
						break;
					case '明细账':
						this.queryPageMXZ();
						break;
					default:
						break;
				}
			},
			selectNumChange(index) {
				this.selectNum = index;
				
				// this.fyear = this.value4.substring(0, 5) + (index + 1)
				switch (this.radio3){
					case '科目余额表':
						this.queryPageYEB()
						break;
					case '明细账':
						this.queryPageMXZ();
						break;
					default:
						break;
				}
				
			},
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.fyear = this.uploadData.fyear;
				this.radio3 = '科目余额表';
				this.queryPageYEB()
			},

			queryPageYEB() {
				this.loading = true;
				let params = {
					"customerId": this.customerId,
					// "customerId":'jz17951',
					"belongDate": this.fyear + '-' + (this.selectNum+1)
				};
				this.axios.post('/perTaxToolTwo/TBalance/getBalanceInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.resData = res.data.data;
							this.tableData = res.data.data.balanceList;
							this.tableData.push({
								fnumber:'',
								ffullname:'合计',
								fBeginDebitBalance:res.data.data.allFBeginDebitBalance,
								fBeginCreditBalance:res.data.data.allFBeginCreditBalance,
								fdebit:res.data.data.allfdebit,
								fcredit:res.data.data.allfcredit,
								fytddebit:res.data.data.allfytddebit,
								fytdcredit:res.data.data.allfytdcredit,
								fendDebitBalance:res.data.data.allFendDebitBalance,
								fendCreditBalance:res.data.data.allFendCreditBalance
							})
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
			queryPageMXZ() {
				this.loading1 = true;
				let params = {
					"customerId":'jz1554',
					"belongDate": this.fyear + '-' + (this.selectNum+1)
					// "fnumber":this.fnumber,
				};
				this.axios.post('/perTaxToolTwo/TBalance/subsidiaryLedger', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading1 = false;
						if (res.data.code == 200) {
							this.arr1 = res.data.data;

							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.arr1 = [];
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
						this.arr1 = [];
						this.loading1 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			exportExcel(){
				this.resData.customerId = this.customerId;
				this.resData.customerName = this.customerName;
				this.resData.belongDate = this.fyear + '-' + (this.selectNum+1)
				let params = this.resData;
				this.axios.post('/perTaxToolTwo/TBalanceVo/PrintTBalanceInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.pdfUrl = res.data.data.balancePdfUrl.slice(0,4) + 's' + res.data.data.balancePdfUrl.slice(4);
							// this.pdfUrl = res.data.data.balancePdfUrl;
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
