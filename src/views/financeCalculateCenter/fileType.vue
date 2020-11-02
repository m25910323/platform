<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案类别</el-breadcrumb-item>
		</el-breadcrumb>

		<div class='main_contain'>
			<label for="">档案类别：</label>
			<el-select v-model="categoryrId" placeholder="请选择" clearable filterable size="mini">
				<el-option v-for="item in dropList" :label="item.categoryrName" :value='item.categoryrId'></el-option>
			</el-select>
			<el-table :data="detail" style="width: 100%;margin-top: 12px;" stripe border>
				<el-table-column align="center" label="类别编号" prop="categoryrNumber" :resizable="false"></el-table-column>
				<el-table-column align="center" label="类别名称" prop="categoryrName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="保管年限" prop="storageLimit" :resizable="false"></el-table-column>
				<el-table-column align="center" label="备注" prop="remark1" :resizable="false"></el-table-column>


				<!-- <el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click.stop="handleDel(scope.$index, scope.row)" v-show="scope.row.state == 1 || scope.row.state == 3">删除</el-button>
						<el-dropdown v-show="scope.row.state == 1" size='mini' @command="((val)=>{handleCommand1(val,scope.row.scheduleId)})">
							<span class="el-dropdown-link" style="color: #409EFF;font-size: 12px;margin-left: 4px;">
								问票<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for='(item,index) in ticketList' :key="index" :command="item">{{item.ticketChName}}</el-dropdown-item>
			
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column> -->
			</el-table>
			<!-- <el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size=10 @current-change='handleCurrentChange'
			 :current-page="currentPage">
			</el-pagination> -->
		</div>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				categoryrId:null,
				dropList:[],
				detail: [],
				dialogVisible: false,

				total: 0,
				currentPage: 1,
				pageSize: 10,

			}
		},
		components: {},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				// this.queryPage(this.accountPeriod, this.customerId);
			},
			getDropList(){
				let params = {
					"parentId": null
				}
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesParentCategoryInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dropList = res.data.data;
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
					"categoryrId": this.categoryrId
				}
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesCategoryInfoList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
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
		watch:{
			categoryrId(val,oldval){
				this.getArchivesCategoryInfoList();
			}
		},
		created() {
			//下拉列表
			this.getDropList()
			//档案类别
			this.getArchivesCategoryInfoList()


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
			background: #fff;
			margin: 0 20px 20px;
			padding: 20px 20px;
			/* height: calc(100% - 190px); */

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
				justify-content: space-between;
				flex-wrap: wrap
			}

			.card {
				width: calc(50% - 6px);
				height: 260px;
				/* float: left; */
				background-color: #fff;
				margin-bottom: 12px;

				h4 {
					height: 40px;
					line-height: 40px;
					background-color: rgb(125, 195, 109);
					color: #fff;
					text-indent: 12px;
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
						width: 120px;
						float: left;
						border-bottom: 1px solid rgb(167, 167, 167);
						text-indent: 12px;
						color: #333
					}

					span:nth-of-type(2n+1) {
						height: 30px;
						line-height: 30px;
						color: rgb(167, 167, 167);
						display: inline-block;
						width: 80px;
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
