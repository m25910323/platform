<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案查询</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.customerId" placeholder="请选择公司名称" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
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
					<el-form-item label="档案类别" prop="categoryrId">
						<el-select v-model="uploadData.categoryrId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in typeList" :label="item.categoryrName" :value='item.categoryrId'></el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click='selectExcel' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div class='card_contain' v-loading='loading'>
				<div class='card' v-for="item in cardList">
					<h4>{{item.customerName}}</h4>
					<ul>
						<li><span>全宗号</span><span>{{item.fondsNumber}}</span></li>
						<li><span>目录号</span><span :title='item.catalogNumber'>{{item.catalogNumber}}</span></li>
						<li><span>类别</span><span>{{item.categoryName}}</span></li>
						<li><span>年度</span><span>{{item.belongDate}}</span></li>
						<li><span>案卷号</span><span>{{item.dossierNumber}}</span></li>
						<li><span>保管期限</span><span>{{item.storageLimits}}</span></li>
					</ul>
				</div>
			</div>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size='pageSize'
			 @current-change='handleCurrentChange' :current-page="currentPage">
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
				dialogVisible: false,
				uploadData: {},
				total: 0,
				currentPage: 1,
				cardList: [],
				pageSize: 12,
				employeeList: [],
				typeList: [],
				postData: {}

			}
		},
		components: {},
		methods: {

			selectExcel(formName) {
				this.postData = JSON.parse(JSON.stringify(this.uploadData));
				this.currentPage = 1;
				this.queryPage()
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			queryPage() {
				let params = {
					data: this.postData,
					row: this.pageSize,
					page: this.currentPage
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesStorageInfoPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
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
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
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
			height: 40px;
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
			/* background: #fff; */
			margin: 0 20px;
			padding: 0px 0px;
			height: calc(100% - 190px);

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}

			.card_contain {
				display: flex;
				flex-direction: row;
				justify-content: start;
				flex-wrap: wrap
			}

			.card {
				width: 250px;
				height: 260px;
				background-color: #fff;
				margin-right: 12px;
				margin-bottom: 12px;

				h4 {
					height: 40px;
					line-height: 40px;
					background-color: rgb(125, 195, 109);
					color: #fff;
					text-align: center
				}

				label {
					color: #999;
				}

				ul {
					padding: 10px 0px;
				}

				li {
					height: 30px;
					/* line-height:30px; */
					padding-left: 20px;

					span:nth-of-type(2n) {
						height: 24px;
						line-height: 30px;
						display: inline-block;
						width: 150px;
						float: left;
						border-bottom: 1px solid rgb(167, 167, 167);
						/* text-indent: 12px; */
						color: #333;
						text-align: center;
						overflow: hidden;
						/*超出部分隐藏*/
						text-overflow: ellipsis;
						/* 超出部分显示省略号 */
						white-space: nowrap;
						/*规定段落中的文本不进行换行 */
					}

					span:nth-of-type(2n+1) {
						height: 30px;
						line-height: 30px;
						color: rgb(167, 167, 167);
						display: inline-block;
						width: 60px;
						float: left;
						text-align: justify;
						margin-right: 12px;
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
</style>
