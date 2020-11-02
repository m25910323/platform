<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>凭证发票查询</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key="customerName">
							<el-option v-for="item in periodCustList" :label="item.customerName" :value='item'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option> -->

						</el-select>
					</el-form-item>
					<el-form-item label="会计期间" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>
						
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @row-click='showDetail'
			 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column type="expand">
					<template slot-scope="props">
						<div class='clearfix'>
							<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
								<h3>发票详情</h3>
								<div style="margin-top: 12px;">
									
									<img :src="imageUrl10" alt="" style="width:100%;float: left;">
			
			
								</div>
			
			
							</div>
							<div style='float:right;width: 500px;'>
								<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
									<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
										<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
											<el-input disabled v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6'></el-input>
											<el-select disabled v-model="item.fieldValue" placeholder="请选择" clearable filterable
											 v-show='item.type == 3'>
												<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
											</el-select>
											<el-select disabled v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword :remote-method="getTycNameMatchByName2do"
											 v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
												<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
											</el-select>
											<el-date-picker disabled v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
											</el-date-picker>
											<el-input disabled v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
										</el-form-item>
			
										<div></div>
										<!-- <el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button> -->
									</el-form>
								</div>
								<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
			
									<div style="margin-top: 4px;">
										<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
										<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
									</div>
								</div>
							</div>
						</div>
			
			
					</template>
				</el-table-column>
				<el-table-column align="center" label="账期" prop='accountPeriod'></el-table-column>
				<el-table-column align="center" label="凭证字号" prop='voucherNum'></el-table-column>
				<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.createTime.slice(0,10)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.createTime.slice(0,10)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否代开" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.issuedSign == 1'>是</span>
						<span v-if='scope.row.issuedSign == 0'>否</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否认证" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
						<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
						<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态" prop="state" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.state == 1'>待审核</span>
						<span v-if='scope.row.state == 2'>审核通过</span>
						<span v-if='scope.row.state == 3'>审核不通过</span>
						<span v-if='scope.row.state == 4'>问票中</span>
					</template>
				</el-table-column>
				
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)">查看</el-button>
						
					</template>
				</el-table-column>
			
			</el-table>
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>
		
		<el-dialog title="查看" :visible.sync="dialogVisible3" width="100%" class='dialog'>
			<div class='clearfix'>
				<div style='float:left;width:700px'>
					<img :src='rowDetail.imageUrl' width='700px' />
				</div>
				<div style='float:right;width:calc(100% - 712px)'>
					
					<el-table :data="rowDetail.itemResults" style='margin-top: 10px;'>
						<el-table-column align="center" v-for='(item,index) in rowDetail.fieldResults' :prop="item.fieldName" :label="item.fieldChName"
						 :width="index == 0?'250px':'' ">
							<template slot-scope="scope">
								<div v-text="scope.row[item.fieldName]"></div>
		
							</template>
						</el-table-column>
						
		
		
					</el-table>
				</div>
			</div>
		
		
		
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				periodCustList:[],
				loading: false,
				uploadData: {
				},
				tableData: [],
				customerName: '',
				getRowKeys(row) {
					return row.scheduleId
				},
				expands: [],
				row:{},
				modelUrl: '',
				imageUrl10: '',
				form: [],
				scheduleId: "",
				scheduleType: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},
				images: [],
				rowDetail: [],
				dialogVisible3:false
			}
		},
		components: {},
		methods: {
			getPeriodCustList(){
				let param = {
				};
				this.axios.get('/perTaxToolTwo/api/user/getPeriodCustList.do').then(res => {
					if (res.data.code == 200) {
						this.periodCustList = res.data.data;
				
				
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '获取客户失败',
						type: 'error'
					});
				})
			},
			
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {
					customerId: this.customerId,
					customerName: this.customerName,
					accountPeriod: this.accountPeriod,
					
				};
				this.axios.post('/perTaxToolTwo/iocr/main/getDocumentDetailWInv', params)
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
			showDetail(row, event, column) {
				this.$refs.refTable.toggleRowExpansion(row)
				this.row = JSON.parse(JSON.stringify(row));
				this.modelUrl = row.modelUrl;
				this.imageUrl10 = row.imageUrl;
				this.form = row.detailResults;
				this.scheduleId = row.scheduleId;
				this.scheduleType = row.type;
				this.picData.scheduleId = row.scheduleId;
				this.picData.imageUrl = row.imageUrl;
				this.picData.mainId = row.mainId;
				this.images = [{
					url: row.imageUrl
				}];
			},
			expandChange(row, expandedRows) {
				var that = this
				if (expandedRows.length) {
					that.expands = []
					if (row) {
						that.expands.push(row.scheduleId);
			
						// this.$refs.refTable.toggleRowExpansion(row)
						// this.row = JSON.parse(JSON.stringify(row));
						
						this.modelUrl = row.modelUrl;
						this.imageUrl10 = row.imageUrl;
						this.form = row.detailResults;
						this.scheduleId = row.scheduleId;
						this.scheduleType = row.type;
						this.picData.scheduleId = row.scheduleId;
						this.picData.imageUrl = row.imageUrl;
						this.picData.mainId = row.mainId;
						this.images = [{
							url: row.imageUrl
						}];
					}
				} else {
					that.expands = []
				}
			
			
			},
			getDetail(index, row) {
				this.dialogVisible3 = true;
				this.scheduleId = row.scheduleId;
				this.rowDetail = row;
			},

		},
		computed: {},
		created() {
			//获取科目
			// this.getProofTAccounts(0)
			// this.queryPage()
			this.getPeriodCustList()
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
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
			background-color: #ebf6fb;
		}

		/deep/ .el-table th {
			background-color: #ebf6fb;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
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

		.search_contain {
			background: #fff;
			height: 45px;
			padding-left: 20px;
			padding-top: 12px;
			margin: 10px 20px;

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
			margin: 0 20px 20px;
			padding: 20px 20px 20px;
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

	.Article {
		/*  background: red;
    opacity: 0.2; */
		margin: 0;
		position: relative;
		/* padding-top: 53px; */

		.Article-title {
			width: 850px;
			height: 20px;
			margin: 0 auto;
			box-sizing: border-box;
			box-sizing: content-box;

			.Article-title-nav {
				width: calc(100% / 12);
				height: 38px;
				display: inline-block;
				font-size: 12px;
				text-align: center;
				line-height: 38px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #999;
			}
		}

		.Article-nav {
			width: 850px;
			height: 18px;
			margin: 0 auto;
			box-sizing: border-box;
			box-sizing: content-box;
			/* background-color: red; */
			padding-top: 10px;
			padding-bottom: 10px;
			display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			position: absolute;
			left: calc(50% - 425px);
			justify-content: space-around;

			.Article-circle {
				display: inline-block;
				width: 8px;
				height: 8px;
				border: 1px solid rgb(125, 195, 109);
				background: #fff;
				border-radius: 50%;
				margin: 0 20px;
				cursor: pointer
			}
		}

		.line {
			width: 850px;
			height: 1px;
			background-color: #DCDCDC;
			position: absolute;
			left: 50%;
			top: 34px;
			transform: translate(-50%, -50%);
			z-index: 1;

			.line-chiled {
				height: 1px;
				background: rgb(125, 195, 109);
			}
		}

		.Article-nav div:nth-of-type(2) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(3) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(4) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(5) {
			margin-left: 20px;
		}

	}

	.active-select {
		background-color: rgb(125, 195, 109) !important;
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
