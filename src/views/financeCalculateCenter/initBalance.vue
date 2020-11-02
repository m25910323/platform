<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统初始化</el-breadcrumb-item>
			<el-breadcrumb-item>初始化余额录入</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable>
							<!-- <el-option v-for="item in custList" :label="item.FAcctName" :value='item.FAcctName'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>

						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>
					<el-button type="primary" @click='exportBalanceInit()' size="mini" :disabled="!fBrNo">下载模板</el-button>
					<el-upload style="display: inline-block;margin-left: 10px;" ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange1" :on-success="handleSuccess"
					 action='/perTaxToolTwo/e9/tBalance/importBalanceInit' :on-error="handleError" :before-remove="beforeRemove"
					 :on-exceed="handleExceed" :file-list="fileList"  accept=".xls" :data='postData' :show-file-list="false">
						<el-button size="mini" type="primary" :disabled="!fBrNo">导入</el-button>
					</el-upload>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>初始化余额录入</h5>
			<div class="clearfix">
				<p style="float: left;">单位名称：{{fBrNo}}</p>
				<p style="float: right;" v-show='tableData.length > 0'>启用期间： {{tableData[0]?tableData[0].fYear:''}}年第{{tableData[0]?tableData[0].fPeriod:''}}期</p>
			</div>

			<el-button type='primary' size="mini" @click='handleSave' :disabled="!canSave">保存</el-button>
			<el-button type='primary' size="mini" @click='balancesInit_isBalance' :disabled="tableData.length == 0">平衡</el-button>
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<!-- <el-table-column align="" label="项目" prop="title">
					<template slot-scope="scope">
						<span v-html='scope.row.title'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="科目代码 " prop='account_fNumber'></el-table-column>
				<el-table-column align="center" label="科目名称" prop="account_fName"></el-table-column>
				<el-table-column align="center" label="本年累计借方（原币）" prop="fYtdDebit_string">
					<template slot-scope="scope">
						<div :contenteditable="canSave && scope.row.fDetail" v-text="scope.row.fYtdDebit_string"
						 @blur='handleInput(scope.$index, "fYtdDebit_string",$event)'></div>

					</template>
				</el-table-column>
				<el-table-column align="center" label="本年累计贷方（原币）" prop='fYtdCredit_string'>
					<template slot-scope="scope">
						<div :contenteditable="canSave && scope.row.fDetail" v-text="scope.row.fYtdCredit_string"
						 @blur='handleInput(scope.$index, "fYtdCredit_string",$event)'></div>
					
					</template>
				</el-table-column>
				<el-table-column align="center" label="借贷方向" prop="fDirection"></el-table-column>
				<el-table-column align="center" label="期初余额" prop="fBeginBalance_string">
					<template slot-scope="scope">
						<div :contenteditable="canSave && scope.row.fDetail" v-text="scope.row.fBeginBalance_string"
						 @blur='handleInput(scope.$index, "fBeginBalance_string",$event)'></div>
					
					</template>
				</el-table-column>
				<el-table-column align="center" label="实际损益发生额（原币）" prop="fAmount_string">
					<template slot-scope="scope">
						<div :contenteditable="canSave && scope.row.fDetail" v-text="scope.row.fAmount_string"
						 @blur='handleInput(scope.$index, "fAmount_string",$event)'></div>
					
					</template>
				</el-table-column>
			</el-table>
		</div>
		
		<el-dialog title="试算借贷平衡" :visible.sync="dialogVisible1" width="700px" class='dialog'
		 :close-on-press-escape='false' :close-on-click-modal='false'>
			<p style="height: 20px;line-height: 20px;" v-show="isBalance">试算结果平衡。</p>
			<el-table :data="dialogData" style="width: 100%;margin-top: 10px;" stripe border>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="试算项" prop='project'></el-table-column>
				<el-table-column align="center" label="借方" prop='fDebit'></el-table-column>
				<el-table-column align="center" label="贷方" prop='fCredit'></el-table-column>
				<el-table-column align="center" label="差额" prop='sub'></el-table-column>
				
		
			</el-table>
			
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				isBalance:false,
				dialogVisible1:false,
				fBrNo:'',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fBrNo:'',
				},
				customerId: 0,
				tableData: [],
				arr: [],
				customerName: '',
				canSave: 0,
				custList:[],
				dialogData:[],
				fileList:[],
				postData:{}

			}
		},
		components: {},
		methods: {
			handleExceed(files, fileList) {
				fileList[0].name = files[0].name
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleError(err) {
				this.fileList = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
				this.fileList = fileList;
			},
			handleSuccess(response, file, fileList) {
				if(response.code == 200){
					this.systemProfileIsSave();
					this.queryPage();
					this.$message({
						message: response.msg,
						type: "success"
					});
				}else if(response.code == 0){
					this.$message({
						message: response.msg,
						type: "warning"
					});
				}else {
					this.$message({
						message: response.msg,
						type: "error"
					});
				}
				
				
			},
			handleInput(index, label, event) {
				this.$set(this.tableData[index],label,event.currentTarget.innerText);
			},
			systemProfileIsSave() {
				let params = {
					fBrNo:  this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/systemProfileIsSave', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.canSave = res.data.data == 1?true:false;



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
			search() {
				this.fBrNo = this.uploadData.fBrNo;
				this.postData = {
					fBrNo:this.fBrNo
				};
				this.systemProfileIsSave();
				this.queryPage();
			},
			
			exportBalanceInit() {
				window.location.href = '/perTaxToolTwo/e9/tBalance/exportBalanceInit?fBrNo=' + this.fBrNo;
			},
			importBalanceInit(){
				
			},

			queryPage() {
				this.loading = true;
				let params = {
					fBrNo: this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/getListBalanceInit', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;



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
			handleSave() {
				this.tableData.forEach(item => {
					item.fBrNo = this.fBrNo;
				})
				var data = this.tableData.filter((value, index) => value.fDetail == true && (value.fYtdDebit_string || value.fYtdCredit_string || value.fBeginBalance_string))
				let params = {
					fbrno:  this.fBrNo,
					fyear :this.tableData[0].fYear,
					fperiod: this.tableData[0].fPeriod,
					balanceInits: data
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/createBalanceInit', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryPage();
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
			
			balancesInit_isBalance(){
				this.dialogVisible1 = true;
				var rows = this.tableData;
				var fYtdDebitTotal =0;
				var fYtdCreditTotal =0;
				var fBeginBalanceDebitTotal=0;
				var fBeginBalanceCreditTotal=0;
				var subYtd =0,subBeginBalance=0;
				 $('#balancesInit_isBalance_label').text("");	   
				for(var i=0;i<rows.length;i++){
					var row = rows[i];
					if(row.fDetail==false){
						continue;
					}		
					var account_fNumber = row.account_fNumber;
					var account_fName = row.account_fName;
					var fYtdDebit_string = +row.fYtdDebit_string;
					var fYtdCredit_string = +row.fYtdCredit_string;
					var fDirection = row.fDirection;
					var fBeginBalance_string = +row.fBeginBalance_string;
					var fAmount_string = +row.fAmount_string;
					/*if(account_fNumber.substr(0, 1) != "5"&&(fAmount_string!=" "&&fAmount_string!=null)){
						alert(account_fNumber+account_fName+"不能在实际损益额进行录入");
						break;
					}*/
				/*	if(account_fNumber.substr(0, 1) != "5"&&(fAmount_string.length!=0)){
						alert(account_fNumber+account_fName+"不能在实际损益额进行录入");
						return;
					}*/
					if((fYtdDebit_string==null||fYtdDebit_string==" ")&&
							(fYtdCredit_string==null||fYtdCredit_string==" ")&&(fBeginBalance_string==null||fBeginBalance_string==" ")
							&&(fAmount_string==null||fAmount_string==" ")){
						continue;
					}
					if(fDirection=="借"){
						fBeginBalanceDebitTotal = this.accAdd(fBeginBalanceDebitTotal,fBeginBalance_string) ;
					}else{
						fBeginBalanceCreditTotal = this.accAdd(fBeginBalanceCreditTotal,fBeginBalance_string) ;
					}
					fYtdCreditTotal = this.accAdd(fYtdCreditTotal,fYtdCredit_string) ; 
					fYtdDebitTotal = this.accAdd(fYtdDebitTotal,fYtdDebit_string) ;
				}	
				subYtd = fYtdDebitTotal-fYtdCreditTotal;
				subBeginBalance = fBeginBalanceDebitTotal-fBeginBalanceCreditTotal;
			
				fBeginBalanceDebitTotal = this.formatNum(fBeginBalanceDebitTotal);
				fBeginBalanceCreditTotal= this.formatNum(fBeginBalanceCreditTotal);
				fYtdDebitTotal=this.formatNum(fYtdDebitTotal);
				fYtdCreditTotal=this.formatNum(fYtdCreditTotal);
				subYtd=this.formatNum(subYtd);
				subBeginBalance=this.formatNum(subBeginBalance);
				
				this.dialogData = [
					{
						project: '期初余额（原币）',
						fDebit: '',
						fCredit: '',
						sub :''
					},
					{
						project: '期初余额（本位币）',
						fDebit: fBeginBalanceDebitTotal,
						fCredit: fBeginBalanceCreditTotal,
						sub :subBeginBalance
					},
					{
						project: '本年累计（原币）',
						fDebit: '',
						fCredit: '',
						sub :''
					},
					{
						project: '本年累计（本位币）',
						fDebit: fYtdDebitTotal,
						fCredit: fYtdCreditTotal,
						sub :subYtd
					}
				];
			   if(subYtd==0&&subBeginBalance==0){
				   this.isBalance = true;
				}else{
					this.isBalance = false;
				}
			
			},
			
			formatNum(s){  
				  var  n=2;
				   n = n > 0 && n <= 20 ? n : 2;   
				   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
				   var l = s.split(".")[0].split("").reverse(),   
				   r = s.split(".")[1];   
				   var t = "";   
				   for(var i = 0; i < l.length; i ++ )   
				   {   
				      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
				   }   
				   return t.split("").reverse().join("") + "." + r;   
				 
				},  
			
			accAdd(arg1, arg2) {
			    var r1, r2, m, c;
			    try {
			        r1 = arg1.toString().split(".")[1].length;
			    }
			    catch (e) {
			        r1 = 0;
			    }
			    try {
			        r2 = arg2.toString().split(".")[1].length;
			    }
			    catch (e) {
			        r2 = 0;
			    }
			    c = Math.abs(r1 - r2);
			    m = Math.pow(10, Math.max(r1, r2));
			    if (c > 0) {
			        var cm = Math.pow(10, c);
			        if (r1 > r2) {
			            arg1 = Number(arg1.toString().replace(".", ""));
			            arg2 = Number(arg2.toString().replace(".", "")) * cm;
			        } else {
			            arg1 = Number(arg1.toString().replace(".", "")) * cm;
			            arg2 = Number(arg2.toString().replace(".", ""));
			        }
			    } else {
			        arg1 = Number(arg1.toString().replace(".", ""));
			        arg2 = Number(arg2.toString().replace(".", ""));
			    }
			    return (arg1 + arg2) / m;
			},
			
			getAD_E9Accounts_Customer() {
				let params = {
				};
				this.axios.get('/perTaxToolTwo/e9/DBOperatorAD_E9Account/getAD_E9Accounts_Customer')
					.then(res => {
						if (res.data.code == 200) {
							this.custList = res.data.data;
							
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
			// this.systemProfileIsSave();
			// this.queryPage();
			// this.getListBalanceInitFromSql()
			this.getAD_E9Accounts_Customer()
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
			padding: 0px 20px 20px;
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
