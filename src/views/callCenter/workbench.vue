<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>工作台</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body clearfix">
			<div class="clearfix">
				<div style="float:left;width: 280px;height:460px;background: #fff;margin-bottom: 20px;position: relative;">
					<input style="border: none;outline: none;width:200px;height:50px;margin-left: 40px;font-size: 16px;text-align: center;"
					 v-model='callPhone' placeholder="请输入"></input>
					<div class="clearfix" style="padding-left: 40px;">
						<span v-for="item in numberList" style="cursor:pointer;margin:0px 20px 10px 0px; float: left;width: 50px;text-align: center;height: 50px;line-height: 50px;border-radius: 25px;border:1px solid #efefef"
						 @click="formPhone(item)">{{item}}</span>

						<span @click="callOu" class='el-icon-phone' style="margin:0px 75px 10px; display: inline-block;width: 50px;text-align: center;height: 50px;line-height: 50px;border-radius: 25px;background:#67C23A;color: #fff;"></span>

						



						<el-radio-group v-model="agentState" @change='updateState' size="mini">
							<!-- <el-radio-button label="1" :disabled="agentState != 3">上班</el-radio-button>
							<el-radio-button label="2" :disabled="agentState != 3">上班同时置忙</el-radio-button> -->
							<el-radio-button label="3">离线</el-radio-button>
							<el-radio-button label="4" :disabled="agentState == 5">忙碌</el-radio-button>
							<el-radio-button label="5" :disabled="agentState == 4">空闲</el-radio-button>
						</el-radio-group>

						

					</div>
					<div style="box-sizing: border-box;padding-top: 40px; width: 100%;height:100%;position: absolute;left: 0px;top: 0px;background:rgba(0,0,0,.5)" v-show='state == "canHangup"'>
					<!-- <div style="box-sizing: border-box;padding-top: 40px; width: 100%;height:100%;position: absolute;left: 0px;top: 0px;background:rgba(0,0,0,.5)"> -->
						<p style="line-height:30px;height:30px;text-align: center;color: #fff;font-size: 16px;">{{callPhoneLayer}}</p>
						<!-- <p style="line-height:30px;height:30px;text-align: center;color: #fff;font-size: 16px;">{{selectcustomer}}</p> -->
						<!-- <p style="line-height:30px;height:30px;text-align: center;color: #fff;font-size: 16px;" v-for="item in customerList">{{item.customer_name}}</p> -->
						<span @click="agentHangUp" class='el-icon-phone-outline' style="top:298px;left: calc(50% - 25px); position: absolute;width: 50px;text-align: center;height: 50px;line-height: 50px;border-radius: 25px;background:#F56C6C;color: #fff;"></span>
						<div style="text-align: center;top: 360px;position: absolute;padding-left: 20px;">
							<el-button type="primary" size="mini" @click="drawer = true" style="width: 60px;margin-right: 5px;">登记</el-button>
							<el-button type="primary" size="mini" style="margin-right: 5px;" @click='agentHold'>呼叫保持</el-button>
							<el-button type="primary" size="mini" style="margin-right: 5px;" @click='agentUnHold'>取消保持</el-button>
						</div>
						
						<div style="position: absolute;top: 240px;padding-left: 10px;">
							<el-select v-model="transphone" placeholder="请选择" filterable size="mini">
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.agentId'></el-option>
								
							</el-select>
							<!-- <el-input size="mini" v-model='transphone' style="width: 200px;"></el-input> -->
							<el-button type="primary" size="mini" style="" @click='agentTransfer'>转移</el-button>
							
							<el-button type="primary" size="mini" style="" @click='agentTransferConfirm' :disabled="!canTransfer">转移确认</el-button>
							<el-button type="primary" size="mini" style="" @click='agentConsultBack' :disabled="!canTransfer">转移取消</el-button>
							<el-button type="primary" size="mini" style="" @click='rejectConsult' :disabled="!canTransfer">拒接</el-button>
						</div>
						<div style="position: absolute;top: 200px;padding-left: 10px;">
							<el-input size="mini" v-model='transphone1' style="width: 200px;" placeholder="请输入第三方号码"></el-input>
							<el-button type="primary" size="mini" style="" @click='transferThirdNum'>转移</el-button>
						</div>
						
						<!-- <div style="position: absolute;top: 430px;padding-left: 10px;">
							
							
						</div> -->
						
					</div>

				</div>

				<!-- <div style="height: 400px;" v-html="huidiao"></div>
				<el-button @click='clear'>清除</el-button> -->
				<div style="float:right;width: calc(100% - 300px);height: 500px;position:relative;z-index: 3 ;">
					<el-tabs type="border-card" style="height:100%">
						
						<el-tab-pane label="客户信息">
							<el-table :data="customerList" style="width: 100%" v-loading='loading1' @selection-change="handleSelectionChange">
								<el-table-column align="center" label="客户名称" prop="customer_name" :resizable="false"></el-table-column>
								
								<el-table-column align="center" label="账期" prop="account_period" :resizable="false"></el-table-column>

								<el-table-column align="center" label="服务状态" prop="service_status" :resizable="false"></el-table-column>

								<el-table-column align="center" label="申报税务类型" prop="declare_type" :resizable="false"></el-table-column>

								<el-table-column align="center" label="合同开始时间" prop="contract_start_time" :resizable="false">
									<template slot-scope="scope">
										<span>{{formatTimeToStr(scope.row.contract_start_time,'yyyy-MM-dd hh:mm:ss')}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="合同结束时间" prop="contract_end_time" :resizable="false">
									<template slot-scope="scope">
										<span>{{formatTimeToStr(scope.row.contract_end_time,'yyyy-MM-dd hh:mm:ss')}}</span>
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
							<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
							 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1">
							</el-pagination> -->
						</el-tab-pane>
						
						<el-tab-pane label="呼叫记录">
							<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
						
						
						
								<el-table-column align="center" label="呼叫类型" prop="call_direction" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.call_direction == 0'>呼入</span>
										<span v-else>呼出</span>
									</template>
								</el-table-column>
						
								<el-table-column align="center" label="呼叫人号码" prop="caller" :resizable="false"></el-table-column>
						
								<el-table-column align="center" label="客户名称" prop="customer_name" :resizable="false"></el-table-column>
								<el-table-column align="center" label="通话时间" prop="create_time" :resizable="false">
									<template slot-scope="scope">
										<span>{{formatTimeToStr(scope.row.create_time,'yyyy-MM-dd hh:mm:ss')}}</span>
									</template>
								</el-table-column>
						
								<el-table-column align="center" label="通话时长" prop="duration" :resizable="false"></el-table-column>
						
						
								<!-- <el-table-column align="center" label="评分" prop="score" :resizable="false"></el-table-column> -->
						
						
								<el-table-column align="center" :resizable="false">
									<template slot="header" slot-scope="scope">
										<span>操作</span>
									</template>
									<template slot-scope="scope">
										<el-button size="mini" type="text" @click="handleFP(scope.$index, scope.row)" style="margin-left: 8px;" v-show="!scope.row.customer_name">分配客户</el-button>
										<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,2)">详情</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
							 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
							</el-pagination>
						</el-tab-pane>
						
					</el-tabs>
				</div>
			</div>
			<div ref='log' style="height: 500px;display: none;"></div>
			<div style="width:100%;height:50px;display:block;position: absolute;left: 0;top: 480px;z-index: 2;    background-color: rgb(243,246,249);"></div>
			<iframe style="width:100%;display:block;position: absolute;left: 0;top: 480px;z-index: 1;"  frameborder="0"
			 marginheight="0" marginwidth="0" border="0" id="alimamaifrm" name="alimamaifrm" scrolling="no" height="800px"
			  width="100%" :src="chatUrl">

			</iframe>
		</div>
		
		<el-drawer
			title=""
			:visible.sync="drawer"
			:direction="direction"
			:wrapperClosable='closable'
			>
			
			<el-form ref="form" :model="form" label-width="100px" size="mini">
			  <el-form-item label="公司">
			    <el-select v-model="form.selectcustomer" placeholder="请选择" clearable filterable value-key="customer_id">
			    	<el-option v-for="item in customerList" :label="item.customer_name" :value='item'></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="事项类型">
				  <el-cascader v-model="form.businessType"
				      :options="callLogItem"
				      :props="props"
				      clearable></el-cascader>
			    
			  </el-form-item>
			  
			  
			  
			  
			  <el-form-item label="具体内容">
			    <el-input type="textarea" v-model="form.problem" :rows="5"></el-input>
			  </el-form-item>
			  <el-form-item label="是否已解决">
			      <el-switch v-model="form.isSolve"></el-switch>
			    </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="onSubmit" style="margin-right: 10px;">提交</el-button>
			    <el-button @click="drawer = false">取消</el-button>
			  </el-form-item>
			</el-form>
			
			
		</el-drawer>

		<el-dialog title="选择客户" :visible.sync="dialogVisible2" width="400px" class='dialog'>
			<el-form :inline="true" ref="ruleForm1" :model="formInline" class="demo-form-inline" label-width="60px" size="mini">
				<el-form-item label="公司" prop="selectcustomer" class='uploadItem'>
					<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
						 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					<el-select v-model="selectcustomer" placeholder="请选择公司名称" filterable value-key="customer_id">
						<el-option v-for="item in customerList1" :label="item.customer_name" :value='item'></el-option>
						<!-- <el-option v-for="item in ces" :label="item.customerName" :value='item'></el-option> -->
					</el-select>
				</el-form-item>
				
		
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible2 = false">取消</el-button>
				<el-button type="primary" @click="commitFP">确定</el-button>
			</span>
			
		</el-dialog>


	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				canTransfer:false,
				closable:false,
				props: { 
					multiple: true ,
					label:'itemName',
					value:'itemId',
					children:'items'
				},
				callLogItem: [],
				drawer: false,
				direction: 'rtl',
				call_log_id:null,
				dialogVisible2:false,
				customerList:[],
				customerList1:[],
				params: {},
				callPhone: '',
				callPhoneLayer: '',
				selectcustomer:'',
				currentCall: {},
				huidiao: '',
				chatUrl: '',
				agentState: 3,
				isOnwork: 0,
				phone: '',
				uploadData: {},
				empInfo: [],
				form2: {},
				form1: {},
				orgId: null,
				multipleSelection: [],
				departList: [],
				loading: false,
				loading1: false,
				formInline: {
					orgName: '',
				},
				userName: '',
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 7,
				total: 0,

				currentPage1: 1,
				pageSize1: 5,
				total1: 0,

				tableList: [],
				tableList1: [],

				dialogVisible: false,
				dialogVisible1: false,


				materialName: '',
				barCode: '',
				numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"],
				state: '',
				transphone:'',
				transphone1:'',
				customerServicerList: [],
			}
		},
		components: {},
		methods: {
			formPhone(val) {
				this.callPhone += val;
			},
			handleClose(done) {
				this.drawer = false;
			},
			onSubmit(){
				if(this.currentCall.callId){
					var id = this.currentCall.callId
				}else if(this.currentCall.callid){
					var id = this.currentCall.callid
				}
				var str = '';
				this.form.businessType.forEach(item => {
					str += item[item.length - 1] + ',';
				})
				str = str.substring(0, str.length - 1);  
				if(id){
					let param = {
						customerId:this.form.selectcustomer.customer_id,
						customerName:this.form.selectcustomer.customer_name,
						"businessType": str,
						"isSolve": this.form.isSolve?1:0,
						"problem": this.form.problem,
						callId:id
					};
					// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
					this.axios.post('/perTaxToolTwo/callCenter/CallLog/updateCallRecordContent', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.drawer = false;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
					
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}
					
					}).catch(function(err) {
						this.loading = false;
						this.$message({
							message: '提交失败',
							type: 'error'
						});
					})
				}
				
			},
			
			statusFunc(res){
			    // websocket状态变化回调函数  此函数需初始化时传入
			    // console.log("res",res);
			    var str = this.$refs.log.innerHTML;
			    var tem = {};
			    console.log('res---',res);
			    if(res && res.data){
			        tem = JSON.parse(res.data);
			        if(tem.msgType){
			            switch(tem.msgType) {
			                case 'onLine':
			                    // 缓存登陆信息 -- 清除事件放在收到离线成功的回调后进行缓存清除
								this.$message({
									message: '已上线',
									type: 'success'
								});
			                    window.sessionStorage.setItem('agentInfo',JSON.stringify(this.params));
			                    // window.sessionStorage.setItem('loginInfo',JSON.stringify({"displayNumber": $(".js-displayNum").val()}));
			                    // $(".js-login-way").attr("disabled","disabled");
			                    break; 
			                case 'offLine': //离线
								this.$message({
									message: '已离线',
									type: 'success'
								});
								break; 
							case 'AgentStateBusy': //上班置忙
								this.$message({
									message: '当前状态：忙碌',
									type: 'warning'
								});
								break; 
			                case 'repeat': //被挤下线
								this.$message({
									message: '账号已经在另外设备登录，退出当前会话',
									type: 'warning'
								});
			                    // 清除事件放在收到离线成功或者被挤下线的回调后进行缓存清除
			                    window.sessionStorage.removeItem('agentInfo');
			                    // window.sessionStorage.removeItem('loginInfo');
			                    // $(".js-login-way").removeAttr("disabled");
			                    break; 
			                case 'StopService':
								this.state = 'StopService';
								// this.dialogVisible2 = true;
								this.tem = tem;
								this.addCallRecord(tem);
								if(this.$route.query.from == 'contactDetail' && this.$route.query.phoneNumber == this.callPhone){
									this.updateDealConfirmRcrd(tem)
								}
								
								this.canTransfer = false;
								this.transphone = '';
								this.transphone1 = '';
								break; 
			                case 'UserHangUp':
			                case 'AgentHangUp':
							case 'TransferStart':
								
							case 'PhoneStateAgentRing':
								this.getCustomerByPhone(tem.direction, tem.caller ,tem.callee);
								console.log(tem);
								this.currentCall = tem;
								this.state = 'canHangup';
								if(tem.direction == 0){
									this.callPhoneLayer = tem.caller;
								}else if(tem.direction == '1'){
									this.callPhoneLayer = tem.callee;
								}
								
								break;
			                case 'AgentStateIdle':
			                    // this.currentCall = undefined;
								this.$message({
									message: '当前状态：空闲',
									type: 'warning'
								});
			                    break; 
							case 'TransferConnected':
								this.canTransfer = true;
								break; 
							
							case 'TransferConfirm':
								this.state = 'canHangup';
								break; 
			                default: 
			                    if(!!tem.callId){
			                        this.currentCall = tem;
			                    }
			                    break;
			            }
						this.$refs.log.innerHTML = str + '</br>' + 'websocket改变回调' + res.data + '</br>'
			        }
			    }
			},
			
			updateDealConfirmRcrd(tem) {
				let params = {
					dealConfirmId:this.$route.query.confirmId,
					dealConfirmReamrk2:tem.duration?1:0
					
				}
				this.axios.post('/perTaxToolTwo/import/e9z/updateDealConfirmRcrd', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							
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

			getToken() {
				window.zcVertoServ.getToken(this.displayResult);

			},
			displayResult(res){
			    // 各种操作回调 --- 外呼需存储通话信息
			    console.log("res",res);
				// if(res.retCode == '000000'){
				// 	this.$message({
				// 		message: res.retMsg,
				// 		type: 'success'
				// 	});
				// }
			    var str = this.$refs.log.innerHTML;
			    this.$refs.log.innerHTML = str + '</br>' + 'displayResult操作回调' + JSON.stringify(res)+ '</br>';
			},
			displayResult1(res){
				this.agentOnWork();
			},
			displayResult2(res){
				this.agentOnWork('0');
			},
			displayResult5(res){
				if(res.retMsg=="成功"){
					this.state = '';
				}
			},
			
			
			//座席上班（上班后为空闲状态）
			agentOnWork(agentState) {
				if (agentState == '0') {
					var data = {
						"displayNumber": '02568151906',
						"isRecordStereo": false,
						"agentState": agentState
					}
				} else {
					var data = {
						"displayNumber": '02568151906',
						"isRecordStereo": false
					}
				}
				window.zcVertoServ.agentLogin(data, this.displayResult)
			},

			//座席下班
			loginout() {
				window.zcVertoServ.agentLoginout(this.displayResult);
			},
			loginout1() {
				window.zcVertoServ.agentLoginout(this.displayResult1);
			},
			loginout2() {
				window.zcVertoServ.agentLoginout(this.displayResult2);
			},
			//坐席外呼
			callOu() {
				if(this.callPhone){
					
					var data = {
						"displayNumber": '02568151906',
						"destinationNumber": this.callPhone
					}
					window.zcVertoServ.agentCallOut(data, this.displayResult);
				}else{
					this.$message({
						message: '号码不能为空',
						type: 'error'
					});
				}
			},

			//座席挂断
			agentHangUp() {
				var data = {
					"callId": this.currentCall.callId
				}
				window.zcVertoServ.agentHangUp(data, this.displayResult);
			},

			//座席状态修改
			updateState(agentState) {
				if (agentState == '3') {
					this.loginout()
				}else if (agentState == '4') {
					this.agentOnWork('0');
					// this.loginout1()
				}else if (agentState == '5') {
					this.agentOnWork();
					// this.loginout2()
				}

			},
			updateAgentState(agentState){
			    var data = {
			        "agentState": agentState
			    }
			    window.zcVertoServ.updateAgentState(data,this.displayResult);
			},

			//座席状态查询
			queryAgentState() {
				window.zcVertoServ.queryAgentState(this.displayResult);
			},
			
			//呼叫中发起转接
			agentTransfer () {
			    var data = {
			        "callId": this.currentCall.callId,
			        "caller": this.currentCall.caller,
			        "transferNumber": this.transphone
			    }
			    window.zcVertoServ.agentTransfer(data, this.displayResult);
			},
			
			//转接第三方
			transferThirdNum () {
			    var data = {
			        "callId": this.currentCall.callId,
			        "caller": this.currentCall.caller,
			        "transferType": this.currentCall.direction || 0,
			        "transferNumber": this.transphone1
			    }
			    window.zcVertoServ.transferThirdNum(data, this.displayResult);
			},
			
			//转接确认
			agentTransferConfirm() {
			    var data = {
			        "callId": this.currentCall.callId,
			        "caller": this.currentCall.caller
			    }
			    window.zcVertoServ.agentTransferConfirm(data, this.displayResult5);
			},
			//转接发起人主动取消转接
			agentConsultBack () {
			    var data = {
			        "callId": this.currentCall.callId
			    }
			    window.zcVertoServ.agentConsultBack(data, this.displayResult5);
			},
			// 被转接人挂断
			rejectConsult() {
			    var data = {
			        "callId": this.currentCall.callId,
			        "agentId": this.currentCall.adminAgentId
			    }
			    window.zcVertoServ.rejectConsult(data, this.displayResult);
			},
			
			//保持呼叫
			agentHold() {
			    var data = {
			        "callId": this.currentCall.callId,
			        "caller": this.currentCall.caller,
			        "direction": this.currentCall.direction || 0
			    }
			    window.zcVertoServ.agentHold(data, this.displayResult);
			},
			
			//取消保持呼叫
			agentUnHold() {
			    var data = {
			        "callId": this.currentCall.callId,
			        "caller": this.currentCall.caller,
			        "direction": this.currentCall.direction || 0
			    }
			    window.zcVertoServ.agentUnHold(data, this.displayResult);
			},
			
			
			getCustomerByPhone(direction,caller,callee){
				let param = {
					"call_direction": direction,
					"caller": caller,
					"callee": callee,
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceAllocationPool/getCustomerByPhone', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.customerList = res.data.data;
				
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
			
			getCustomerByPhone1(direction,caller,callee){
				let param = {
					"call_direction": direction,
					"caller": caller,
					"callee": callee,
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceAllocationPool/getCustomerByPhone', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.customerList1 = res.data.data;
				
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
			//保存通话记录
			addCallRecord(data) {
				let param = {
					"staff_emails": '',
					"companyid": data.companyId,
					"msg_type": "",
					"appid": data.appId,
					"agentid": data.agentid,
					"callid": data.callid,
					"agent_groupid": "1",
					"agent_group_name": "1",
					"caller": data.caller,
					"callee": data.callee,
					"number_provice": data.numberProvice,
					"number_city": data.numberCity,
					"call_direction": data.direction,
					"duration": data.duration,
					"voice_aliyun_url": data.voiceAliyunUrl,
					// "customerId":this.selectcustomer.customerId,
					// "customerName":this.selectcustomer.customerName
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/addCallRecord', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.queryListByPage();

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

			search() {
				this.materialName = this.uploadData.materialName;
				this.barCode = this.uploadData.barCode;
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.queryListByPage()
			},
			handleFP(index,row){
				this.dialogVisible2 = true;
				this.call_log_id = row.call_log_id;
				this.getCustomerByPhone1(row.call_direction,row.caller,row.callee);
			},
			commitFP(){
				let param = {
					"customerId": this.selectcustomer.customer_id,
					"customerName": this.selectcustomer.customer_name,
					"callLogId": this.call_log_id,
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/updateCallLogInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.dialogVisible2 = false;
						this.queryListByPage();
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

			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"isThreeDay":1
					
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
				this.loading1 = true;


				let param = {
					"page": this.currentPage1,
					"row": this.pageSize1,
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callCenter/CallLog/getCallInfoByCust', param).then(res => {
					this.loading1 = false;
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
					this.loading1 = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
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

			handleEdit(index, row, tag) {
				this.$router.push({
					path: '/callCenter/callDetail',
					query: {
						call_log_id: row.call_log_id,
						caller: row.caller
					}
				})
			},

			


			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryListByPage1();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			//查询agentId
			getCustomerServicer() {
				let param = {};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceConfig/queryList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.customerServicerList = res.data.data;
			
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '查询失败',
						type: 'error'
					});
				})
			},

			getChatUrl() {
				let param = this.multipleSelection;
				this.axios.post('/perTaxToolTwo/callCenter/customerServiceManage/getChatUrl', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.chatUrl = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取聊天窗口失败',
						type: 'error'
					});
				})
			},
			
			init() {
				let param = {
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceConfig/getUserAgentId', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.params = {
							"client_id": '8a216da862a86c900162b2b77d69060c',
							"client_secret": '89f1d62f423c4f5ab53239b5d7e203e1',
							"companyId": 'cfaeb77d1c5e4dc388a638a74842adf1',
							"appId": '8a216da862a86c900162b2b77d69060c',
							"agentId":res.data.data.agentId,
							// "agentId": 'fb51e66bdb094489be55789d2029b56e',
							"groupId":res.data.data.agentGroup,
							// "groupId": 'cfaeb77d1c5e4dc388a638a74842adf1_10',
							"voipAccount": res.data.data.sipPhone,
							// "voipAccount": '8024473600000027',
							"callWay": 2
						}
						window.zcVertoServ.ininServ(this.params,this.statusFunc);
						this.getToken()
				
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '初始化失败',
						type: 'error'
					});
				})
			    
			}

		},
		watch: {
		
			'$route'(to, from) {
				// init data
				if (to.name == 'workbench') {
					var _this = this;
					this.queryListByPage();
					// this.queryListByPage1();
					
					if (window.sessionStorage.getItem('agentInfo')) {
						// 如果缓存中有agentInfo相关信息 则表明是刷新 只需要重新查询状态进行登陆网络电话和链接socket即可
						    this.params = JSON.parse(window.sessionStorage.getItem('agentInfo'));
						    var index = parseInt(this.params.callWay);
						    
						
						    // 调用方式
						    window.zcVertoServ.ininServ(this.params,this.statusFunc);
						    window.zcVertoServ.getToken(function (res){
						        if(!!res['access_token']){
						            window.zcVertoServ.queryAgentState(function (rs){
						                if(rs.retCode == '000000' && rs.item.agentState >= 0){
						                    // 如果查询结果状态不是离线 单独重连
											if(rs.item.agentState == 0){
												_this.agentState = 4;
											}else if(rs.item.agentState == 1){
												_this.agentState = 5;
											}
						                    window.zcVertoServ.reConnect();
						                }else{
											_this.agentState = 3;
										}
						            })
						        }
						    });
					} else {
						this.init();
						
					}
					if(this.$route.query.phoneNumber){
						this.callPhone = this.$route.query.phoneNumber
					}
					
					this.getCustomerServicer();
					this.getChatUrl();
					this.getAllCallLogItem();
				}
		
			}
		},
		created() {
			var _this = this;
			this.queryListByPage();
			// this.queryListByPage1();
			
			if (window.sessionStorage.getItem('agentInfo')) {
				// 如果缓存中有agentInfo相关信息 则表明是刷新 只需要重新查询状态进行登陆网络电话和链接socket即可
				    this.params = JSON.parse(window.sessionStorage.getItem('agentInfo'));
				    var index = parseInt(this.params.callWay);
				    
				
				    // 调用方式
				    window.zcVertoServ.ininServ(this.params,this.statusFunc);
				    window.zcVertoServ.getToken(function (res){
				        if(!!res['access_token']){
				            window.zcVertoServ.queryAgentState(function (rs){
				                if(rs.retCode == '000000' && rs.item.agentState >= 0){
				                    // 如果查询结果状态不是离线 单独重连
									if(rs.item.agentState == 0){
										_this.agentState = 4;
									}else if(rs.item.agentState == 1){
										_this.agentState = 5;
									}
				                    window.zcVertoServ.reConnect();
				                }else{
									_this.agentState = 3;
								}
				            })
				        }
				    });
			} else {
				this.init();
				
			}
			if(this.$route.query.phoneNumber){
				this.callPhone = this.$route.query.phoneNumber
			}

			this.getCustomerServicer();
			this.getChatUrl();
			this.getAllCallLogItem();

		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		/deep/ .el-button+.el-button {
			margin-left: 0px;
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
		height: 100%;
		position: relative;
		/* background: #fff; */

		.htitle {
			margin: 12px 0px 12px 20px;
			padding-left: 8px;
			border-left: 2px solid #409EFF;
			font-size: 14px;
		}

		h3 {
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			padding-left: 20px;
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
	
	/deep/ .el-drawer{
		.el-form-item__content {
			width: 280px;
		}
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
