<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案查阅</el-breadcrumb-item>
			<el-breadcrumb-item>档案查看</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain clearfix'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="90px">
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属账期" prop="belongDate">
						<el-date-picker v-model="uploadData.belongDate" type="month" placeholder="请选择" value-format="yyyy-MM" format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="全宗号" prop="fondsNumber">
						<el-input v-model="uploadData.fondsNumber" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="目录号" prop="catalogNumber">
						<el-input v-model="uploadData.catalogNumber" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="案卷号" prop="dossierNumber">

						<el-input v-model="uploadData.dossierNumber" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<!-- <el-form-item label="档案类别" prop="categoryrId">
						<el-select v-model="uploadData.categoryrId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in typeList" :label="item.categoryrName" :value='item.categoryrId'></el-option>
						</el-select>
					</el-form-item> -->
					<!-- <el-button type="primary" @click='selectExcel' size="mini">搜索</el-button> -->
					<div style="width: 100%;">
						<el-button type="info" @click='resetForm()' size="small" style="float: right;">  重  置  </el-button>
						<el-button type="primary" @click='selectExcel()' size="small" style="float: right;margin-right: 20px;">  查  找  </el-button>
					</div>
					
				</el-form>
			</div>
		</div>
		<el-select v-model="uploadData.categoryrId" placeholder="请选择" size="small" style="margin-left: 20px;" @change="selectExcel">
			<el-option v-for="item in typeList" :label="item.categoryrName" :value='item.categoryrId'></el-option>
		</el-select>
		<div class='main_contain'>
			<div class='card_contain' v-loading='loading'>
				<div class='card' v-for="item in cardList">
					<h4>{{item.customerName}}</h4>
					<ul>
						<li><span>所属账期</span><span>{{item.belongDate}}</span></li>
						<li><span>全宗号</span><span>{{item.fondsNumber}}</span></li>
						<li><span>目录号</span><span :title='item.catalogNumber'>{{item.catalogNumber}}</span></li>
						<li><span>案卷号</span><span>{{item.dossierNumber}}</span></li>
						<li><span>保管期限</span><span>{{item.storageLimits}}</span></li>
						<li><span>代账公司</span><span>{{item.accountNo}}</span></li>
					</ul>
					<div class='cardType'>
						<p class='card_type'>{{item.categoryName}}</p>
						<p class='card_num'>{{item.cou}}张</p>
					</div>
					<img src="../../../../assets/img/file_success.png" alt=""  v-show="item.borrwoStatus == 0"
						style="width: 60px;height: 50px;position: absolute;right: 10px;top: 130px;">
					<img src="../../../../assets/img/file_error.png" alt="" v-show="item.borrwoStatus == 4"
						style="width: 60px;height: 50px;position: absolute;right: 10px;top: 130px;">
					<el-button type="text" size="mini" style="position: absolute;bottom: 6px;right: 10px;" @click='handleApply(item)' v-show="item.borrwoStatus == 2">申请借阅</el-button>
					<el-button type="text" size="mini" style="position: absolute;bottom: 6px;right: 10px;" @click='handleProgress(item)' v-show="item.borrwoStatus == 0 || item.borrwoStatus == 4">查看进度</el-button>
					<el-button type="text" size="mini" style="position: absolute;bottom: 6px;right: 10px;" @click='handleDetail(item)' v-show="item.borrwoStatus == 1">查看详情</el-button>
					<!-- <el-button type="text" size="mini" style="position: absolute;bottom: 6px;right: 10px;" v-show="item.borrwoStatus == 1" disabled>已借阅</el-button> -->
				</div>
			</div>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size='pageSize'
			 @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>
		</div>

		<el-dialog title="借阅申请" :visible.sync="dialogVisible" width="600px" :before-close="hideDialog" :modal-append-to-body="false">
			<el-form ref="form" :model="detail" label-width="80px" size="mini" :inline="true">
				<el-form-item label="借阅目的">
					<el-input v-model="detail.borrowPourse" :rows="3" placeholder="请输入" type="textarea">
					</el-input>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker v-model="detail.borrowTime" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd"
					 format="yyyy-MM-dd">
					</el-date-picker>
					
				</el-form-item>
				<el-form-item label="归还时间">
					<el-date-picker v-model="detail.returnTime" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd"
					 format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>


			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitApply">提交申请</el-button>
			</span>


		</el-dialog>
		
		
		<el-dialog title="借阅进度" :visible.sync="dialogVisible1" width="600px" :before-close="hideDialog" :modal-append-to-body="false">
			<el-form ref="form" :model="detail1" label-width="80px" size="mini" :inline="true">
				<el-form-item label="借阅目的">
					<el-input v-model="detail1.borrowPurpose" :rows="3" placeholder="请输入" type="textarea" disabled>
					</el-input>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker :value="formatTimeToStr(detail1.borrowTime,'yyyy-MM-dd')" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd"
					 format="yyyy-MM-dd" disabled>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="归还时间">
					<el-date-picker :value="formatTimeToStr(detail1.returnTime,'yyyy-MM-dd')" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd"
					 format="yyyy-MM-dd" disabled>
					</el-date-picker>
				</el-form-item>
		
		
			</el-form>
			<el-steps :active="active" finish-status="success" v-show='detail1.borrwoStatus == 0'>
			  <el-step title="已提交"></el-step>
			  <el-step title="审批中"></el-step>
			  <el-step title="审批结果"></el-step>
			</el-steps>
			<el-steps :active="active1" finish-status="success" v-show='detail1.borrwoStatus == 4'>
			  <el-step title="已提交"></el-step>
			  <el-step title="审批中"></el-step>
			  <el-step title="未通过"></el-step>
			</el-steps>
		
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog" v-show='detail1.borrwoStatus == 4' >关闭</el-button>
				<el-button type="primary" @click="commitApply1" v-show='detail1.borrwoStatus == 4'>重新申请</el-button>
				<el-button type="primary" @click="hideDialog" v-show='detail1.borrwoStatus == 0'>知道了</el-button>
			</span>
		
		
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				loading: false,
				dialogVisible: false,
				dialogVisible1: false,
				uploadData: {
					categoryrId:6,
					belongDate:''
				},
				total: 0,
				currentPage: 1,
				cardList: [],
				pageSize: 8,
				employeeList: [],
				typeList: [],
				postData: {},
				detail: {
					// borrowTime:'',
					// borrowPourse:'',
					// returnTime:'',
				},
				detail1: {},
				active:1,
				active1:3,
				categoryrId:6,
				belongDate:''
			}
		},
		components: {},
		methods: {
			hideDialog(){
				this.dialogVisible = false;
				this.dialogVisible1 = false;
			},
			selectExcel(formName) {
				this.customerId = this.uploadData.customerId;
				this.fondsNumber = this.uploadData.fondsNumber;
				this.catalogNumber = this.uploadData.catalogNumber;
				this.dossierNumber = this.uploadData.dossierNumber;
				this.belongDate = this.uploadData.belongDate;
				this.categoryrId = this.uploadData.categoryrId;
				this.currentPage = 1;
				this.queryPage()
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
					    "customerId": this.customerId,
					    "fondsNumber": this.fondsNumber,
					    "catalogNumber": this.catalogNumber,
					    "dossierNumber": this.dossierNumber,
						"belongDate": this.belongDate,
						"categoryrId": this.categoryrId

					}

				};
				// let params = {
				// 	data: this.postData,
				// 	row: this.pageSize,
				// 	page: this.currentPage
				// };
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesStorageInfoPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.cardList = res.data.data;
							this.total = res.data.count;
							console.log(this.tableData)
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
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			handleApply(row) {
				this.dialogVisible = true;
				// this.detail = JSON.parse(JSON.stringify(row));
				this.detail.borrowUserName = row.borrowUserName;
				this.detail.borrowDeptName = row.borrowDeptName;
				this.detail.archivesStorageId = row.archivesStorageId;
			},
			commitApply() {
				let params = {
					"borrowTime": this.detail.borrowTime,
					"returnTime": this.detail.returnTime,
					"borrowPourse": this.detail.borrowPourse,
					"borrowUserName": this.detail.borrowUserName,
					"borrowDeptName": this.detail.borrowDeptName,
					"archivesStorageIds": [{
						"archivesStorageId": this.detail.archivesStorageId
					}]
				};
				this.axios.post('/perTaxToolTwo/ArchivesBorrowRecordInfo/SaveArchivesBorrowRecordInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.queryPage();
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
			
			
			commitApply1() {
				let params = {
					"borrowTime": this.detail1.borrowTime,
					"returnTime": this.detail1.returnTime,
					"borrowPourse": this.detail1.borrowPourse,
					"borrowUserName": this.detail1.borrowUserName,
					"borrowDeptName": this.detail1.borrowDeptName,
					"archivesStorageIds": [{
						"archivesStorageId": this.detail1.archivesStorageId
					}]
				};
				this.axios.post('/perTaxToolTwo/ArchivesBorrowRecordInfo/SaveArchivesBorrowRecordInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.queryPage();
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
			
			
			handleProgress(row){
				this.dialogVisible1 = true;
				this.detail1 = JSON.parse(JSON.stringify(row));
				// if(this.detail1.borrwoStatus == 0){
				// 	this.active = 1;
				// }else{
				// 	this.active1 = 3;
				// }
			},
			
			handleDetail(row){
				switch (row.categoryName){
					case '记账凭证':
						this.$router.push({ //核心语句
							path: '/financeCalculateCenter/voucherInfo1', //跳转的路径
							query: { //路由传参时push和query搭配使用 ，作用时传递参数
								
								customerId: row.customerId,
								customerName: row.customerName,
								belongDate:row.belongDate,
							}
						})
						break;
					case '总账':
						this.$router.push({ //核心语句
							path: '/financeCalculateCenter/generalLedger1', //跳转的路径
							query: { //路由传参时push和query搭配使用 ，作用时传递参数
								
								customerId: row.customerId,
								customerName: row.customerName,
								belongDate:row.belongDate,
								radio3:'总账'
							}
						})
						break;
					case '明细账':
						this.$router.push({ //核心语句
							path: '/financeCalculateCenter/generalLedger1', //跳转的路径
							query: { //路由传参时push和query搭配使用 ，作用时传递参数
								
								customerId: row.customerId,
								customerName: row.customerName,
								belongDate:row.belongDate,
								radio3:'明细账'
							}
						})
						break;
					case '资产负债':
						this.$router.push({ //核心语句
							path: '/financeCalculateCenter/balanceStatement1', //跳转的路径
							query: { //路由传参时push和query搭配使用 ，作用时传递参数
								
								customerId: row.customerId,
								customerName: row.customerName,
								belongDate:row.belongDate,
								type:1
							}
						})
						break;
					case '现金流量':
						this.$router.push({ //核心语句
							path: '/financeCalculateCenter/cashStatement1', //跳转的路径
							query: { //路由传参时push和query搭配使用 ，作用时传递参数
								
								customerId: row.customerId,
								customerName: row.customerName,
								belongDate:row.belongDate,
								type:1
							}
						})
						break;
					case '利润':
					
						this.$router.push({ //核心语句
							path: '/financeCalculateCenter/profitStatement1', //跳转的路径
							query: { //路由传参时push和query搭配使用 ，作用时传递参数
								
								customerId: row.customerId,
								customerName: row.customerName,
								belongDate:row.belongDate,
								type:1
							}
						})
						break;
					default:
						break;
				}
			},
			
			getArchivesCategoryInfoList() {
				let params = {
					"categoryrId": null
				}
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesCategoryInfoList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.typeList = res.data.data;
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
			this.getArchivesCategoryInfoList();
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
			/* height: 40px; */
			padding-left: 20px;
			padding-top: 12px;
			padding-bottom: 12px;
			padding-right: 20px;
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
			margin: 0 20px;
			padding: 30px;
			height: calc(100% - 190px);
			/* display: flex;
			flex-direction: row;
			justify-content: space-around; */

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: center;
				margin-top: 10px;
			}

			.card_contain {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				flex-wrap: wrap
			}

			.card {
				width: calc((100% - 100px) / 4);
				height: 220px;
				background-color: #fff;
				margin-right: 25px;
				margin-bottom: 40px;
				color: #8C8C8C;
				position: relative;

				.cardType {
					position: absolute;
					top: 50px;
					right: 10px;

					.card_type {
						width: 65px;
						height: 24px;
						text-align: center;
						line-height: 24px;
						background: rgba(229, 229, 229, 1);
					}

					.card_num {
						height: 24px;
						text-align: center;
						line-height: 24px;
						border-bottom: 1px solid #E5E5E5;
						border-left: 1px solid #E5E5E5;
						border-right: 1px solid #E5E5E5;
					}
				}

				.more {
					position: absolute;
					bottom: 10px;
				}

				h4 {
					height: 45px;
					line-height: 45px;
					background-color: #5CAFF0;
					color: #fff;
					text-align: center;
					border-top-left-radius: 4px;
					border-top-right-radius: 4px;
					font-size: 16px;
					font-weight: normal;
				}

				/* label {
					color: #8C8C8C;
				} */

				ul {
					padding: 20px 15px;
					height: 175px;
					box-sizing: border-box;
					border-bottom: 1px solid #979797;
					border-left: 1px solid #979797;
					border-right: 1px solid #979797;
					border-bottom-left-radius: 4px;
					border-bottom-right-radius: 4px;
				}

				li {
					height: 22px;
					/* line-height:30px; */
					/* padding-left: 20px; */

					span:nth-of-type(2n) {
						height: 22px;
						line-height: 22px;
						display: inline-block;
						/* width: 150px; */
						float: left;
						/* border-bottom: 1px solid rgb(167, 167, 167); */
						/* text-indent: 12px; */
						/* color: #333; */
						/* text-align: center; */
						overflow: hidden;
						/*超出部分隐藏*/
						text-overflow: ellipsis;
						/* 超出部分显示省略号 */
						white-space: nowrap;
						/*规定段落中的文本不进行换行 */
					}

					span:nth-of-type(2n+1) {
						height: 22px;
						line-height: 22px;
						/* color: rgb(167, 167, 167); */
						display: inline-block;
						width: 60px;
						float: left;
						text-align: justify;
						margin-right: 14px;
					}

					span:nth-of-type(2n+1):after {
						content: "";
						display: inline-block;
						width: 100%;
					}
				}
			}
		}
	}
	
	/deep/ .el-dialog{
		.el-form-item__content{
			width: 460px;
		}
		.el-date-editor{
			width: 180px;
		}
	}
</style>
