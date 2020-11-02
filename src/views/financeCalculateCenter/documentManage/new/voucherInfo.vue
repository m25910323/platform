<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案整理</el-breadcrumb-item>
			<el-breadcrumb-item>会计凭证</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="客户名称" prop="customer">
						<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key='customerId'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>

						</el-select>
					</el-form-item>
					<el-form-item label="会计时间" prop="fyear">
						<el-date-picker v-model="uploadData.fyear" type="year" placeholder="请选择" size="mini" value-format="yyyy" format="yyyy">
						</el-date-picker>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">  查  找  </el-button>

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
				
				<p style="display: inline-block;width:200px">{{customerName}}</p>
				
				<!-- <el-button class="el-icon-download" type='text' size="mini" :disabled="arr1.length <= 0" @click='exportExcel1()' style='float:right'>打印</el-button> -->
				
				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>
			
			<el-table :data="arr" style="width: 100%;margin-top: 10px;" border v-loading='loading' :span-method="arraySpanMethod">
				<el-table-column align="center" type="selection" width="55"></el-table-column>
			
				<el-table-column align="" label="摘要" prop="showInfo">
					<template slot-scope="scope">
						<span v-html="scope.row.showInfo"></span>
					</template>
				</el-table-column>
				<el-table-column align="" label="科目" width="400">
					<template slot-scope="scope">
						<el-button type='text' size="mini" v-show='scope.row.creditAmount == "详情" && scope.row.fattachments != 0' style='float: right;'
						 @click='showDetail(scope.row)'>查看详情</el-button>
						<span v-html="scope.row.faccountName"></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="借方金额" prop="debitAmount"></el-table-column>
				<el-table-column align="center" label="贷方金额">
					<template slot-scope="scope">
						<span v-html="scope.row.creditAmount"></span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
			
			
			
			
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>
		
		<el-dialog title="详情" :visible.sync="dialogVisible" width="1400px">
			<div v-loading='loading1'>
				<embed width="1260" height="600" :src="url" v-if='dialogVisible'></embed>
				<!-- <a :href='detail[0].pdfUrl'>11111111111</a> -->
				<embed v-for='item in detail.scheduleUrl' width="1260" height="600" :src="item" v-if='dialogVisible'></embed>
				<!-- <img v-for='item in detail.scheduleUrl' :src='item' style='width:1260px' /> -->
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
				url:'',
				radio3:'余额表',
				loading: false,
				loading1: false,
				fyear: this.formatTimeToStr(new Date(), 'yyyy'),
				selectNum: new Date().getMonth(),
				uploadData: {
					fyear: this.formatTimeToStr(new Date(), 'yyyy'),
					customer:{}
				},
				customerId: 0,
				tableData: [],
				arr: [],
				arr1: [],
				customerName:'',
				dialogVisible:false,
				pdfUrl:'',
				currentPage:1,
				pageSize:5,
				total:0,
				detail: {},
			}
		},
		components: {},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPagePZ()
			},
			prev(){
				this.fyear --;
				this.queryPagePZ()
			},
			next(){
				this.fyear ++;
				this.queryPagePZ()
			},
			refresh(){
				this.queryPagePZ()
			},
			
			selectNumChange(index) {
				if(this.uploadData.customer.customerId){
					this.selectNum = index;
					
					// this.fyear = this.value4.substring(0, 5) + (index + 1)
					this.currentPage = 1;
					this.queryPagePZ()
				}else{
					this.$message({
						message: '请选择客户名称',
						type: 'warning'
					});
				}
				
				
			},
			search() {
				if(this.uploadData.customer.customerId){
					this.customerId = this.uploadData.customer.customerId;
					this.customerName = this.uploadData.customer.customerName;
					this.fyear = this.uploadData.fyear;
					
					this.queryPagePZ()
				}else{
					this.$message({
						message: '请选择客户名称',
						type: 'warning'
					});
				}
				
			},
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (row.tag === 0) {
					if (columnIndex === 1) {
						return [1, 3];
					} else if (columnIndex === 1) {
						return [0, 0];
					}
				}
			
				if (columnIndex === 0) {
					if (this.indexList.indexOf(rowIndex) >= 0) {
						return {
							rowspan: this.indexList[this.indexList.indexOf(rowIndex) + 1] - this.indexList[this.indexList.indexOf(rowIndex)],
							colspan: 1
						};
					} else {
						return {
							rowspan: 0,
							colspan: 0
						};
					}
				}
			
			},
			queryPagePZ() {
				this.arr = [];
				this.indexList = [0];
				this.loading = true;
				let params = {
					data: {
						
						"fbrno": this.customerName,
						// "fbrno": "南京尊音科技有限公司",
						"belongDate": this.fyear + '-' + (this.selectNum+1)
					},
					page: this.currentPage,
					row: 5
				};
				this.axios.post('/perTaxToolTwo/TVoucher/getTVoucherInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.mark = 0;
							this.total =  res.data.count;
							this.tableData = res.data.data;
							this.tableData.forEach((item, index) => {
								this.mark += item.tvoucherentries.length + 1;
								this.indexList.push(this.mark);
								for (let i = 0; i < item.tvoucherentries.length + 1; i++) {
									if (i == 0) {
										this.arr.push({
											tag: 0,
											showInfo: '日期：' + item.fdate + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;凭证字号：记-' + item.fnumber +
												'&nbsp;&nbsp;&nbsp;&nbsp;附单据：' + item.fattachments + '张',
											creditAmount: '详情',
											postData: item,
											fattachments: item.fattachments
										})
									} else {
										this.arr.push({
											showInfo: item.tvoucherentries[i - 1].fexplanation,
											faccountName: item.tvoucherentries[i - 1].fnumber + "_" + item.tvoucherentries[i - 1].ffullname,
											debitAmount: item.tvoucherentries[i - 1].ffullNameBorrowAmount,
											creditAmount: item.tvoucherentries[i - 1].ffullNameLoanAmount
										})
									}

								}
							})
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
			
			showDetail(row) {
				this.loading = true;
				this.loading1 = true;
				let params = [row.postData];
				this.axios.post('/perTaxToolTwo/TVoucher/getDetailsTVoucherInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading1 = false;
						this.loading = false;
						if (res.data.code == 200) {
							// if(res.data.data[0].scheduleUrl.length > 0){
								
								this.detail = res.data.data[0];
								this.url = this.detail.pdfUrl.slice(0,4) + 's' + this.detail.pdfUrl.slice(4);
								// this.$set(this.detail,'url',this.detail.pdfUrl.slice(0,4) + 's' + this.detail.pdfUrl.slice(4));
								// this.detail.url = this.detail.pdfUrl.slice(0,4) + 's' + this.detail.pdfUrl.slice(4);
								if(this.detail.scheduleUrl[0]){
									this.detail.scheduleUrl[0] = this.detail.scheduleUrl[0].slice(0,4) + 's' + this.detail.scheduleUrl[0].slice(4);
								}
								this.dialogVisible = true;
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
							// }else{
							// 	this.$message({
							// 		message: '该凭证暂无详情',
							// 		type: 'warning'
							// 	});
							// }
							
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
						this.loading = false;
						this.loading1 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			exportExcel(){
				
				let params = {
					customerId : this.customerId,
					customerName : this.customerName,
					belongDate : this.value4,
					tbList:this.tableData
				};
				this.axios.post('/perTaxToolTwo/GeneralLedgerVo/PrintGeneralLedgerInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.pdfUrl = res.data.data[0].generalLedgerUrl;
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
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'voucherInfo1') {
					if(this.$route.query.customerId){
						this.uploadData.customer.customerId = this.$route.query.customerId;
						this.uploadData.customer.customerName = this.$route.query.customerName;
						this.uploadData.fyear = this.$route.query.belongDate.slice(0,4);
						
						this.selectNum = parseFloat(this.$route.query.belongDate.slice(5,7)) - 1;
						this.search();
					}
				}
			
			}
			
		},
		created() {
			if(this.$route.query.customerId){
				this.uploadData.customer.customerId = this.$route.query.customerId;
				this.uploadData.customer.customerName = this.$route.query.customerName;
				this.uploadData.fyear = this.$route.query.belongDate.slice(0,4);
				
				this.selectNum = parseFloat(this.$route.query.belongDate.slice(5,7)) - 1;
				this.search();
			}
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
