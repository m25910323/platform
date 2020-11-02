(function (wd) {
	let sobotSocket;
	let ws_addr;
	let verto;
	let cur_call = null;
	let ringing = false;
	let online_visible = false;
	let first_login = false;
	let autoListen = false;
	let vertoParams;
	let connentSign = 0;
	let online = function (on) {
	    if (on) {
	        first_login = true;
	    } 
	    online_visible = on;
	}
	// 接听
	let listenCall = function () {
	    if(cur_call){
	        cur_call.answer();
	    }
	    autoListen = false;
	}
	// 挂断
	let hangupCall = function () {
	    if(cur_call){
	        cur_call.hangup();
	    }
	};
	// 退出
	let loginOut = function () {
	    if(verto){
	        verto.logout();
	    }
	}
	// verto回调函数
	let vertoCallBack = {
	    onMessage: function (verto, dialog, msg, data) {
	    },
	    onDialogState: function (d) {
	        cur_call = d;
	        ringing = d.state == $.verto.enum.state.ringing ;

	        switch (d.state) {
	            case $.verto.enum.state.ringing:
	                !!autoListen ? listenCall() : '';
	                break;
	            case $.verto.enum.state.trying:
	                break;
	            case $.verto.enum.state.early:
	                break;
	            case $.verto.enum.state.active:
	                break;
	            case $.verto.enum.state.hangup:
	                break;
	            case $.verto.enum.state.destroy:
	                cur_call = null;
	                break;
	            case $.verto.enum.state.held:
	                break;
	            default:
	                break;
	        }
	    },
	    onWSLogin: function (v, success) {
	        cur_call = null;
	        ringing = false;
	        !!success ? online(true) : '' ;
	    },
	    onWSClose: function (v, success) {
	    	$.ajax({
	    	    url : '/comm/api/1/call/queryAgentState?access_token=' + wd.zcVertoServ.token,
	    	    dataType :'json',
	    	    type : "post",
	    	    contentType: 'application/json',
	    	    data: JSON.stringify({
	    			agentId: wd.zcVertoServ.params.agentId,
	    	    	companyId: wd.zcVertoServ.params.companyId,
	    	    	appId: wd.zcVertoServ.params.appId
	    	    }),
	    	    success : function(result) {
	    	        if(result.agentState == '-1'){
						online(false);
	    	        }
	    	    }
	    	});	 
	    }
	}

	let loginVerto = function  (){
		verto = new $.verto({
		    login: vertoParams.voipAccount + "@" + vertoParams.serverIP,
		    passwd: vertoParams.voipPwd,
		    socketUrl: vertoParams.wsurl,
		    tag: "webcam",
		    ringFile: "./plugin/bell_ring2.wav",
		    audioParams: {
		        googAutoGainControl: true,
		        googNoiseSuppression: false, //噪音消除
		        googHighpassFilter: true,
		        googEchoCancellation: false  //回声消除
		    },
		    iceServers: true
		}, vertoCallBack);
		verto.loginData({
		    login: vertoParams.voipAccount + "@" + vertoParams.url,
		    passwd: vertoParams.voipPwd
		});
		verto.login();
	}
	// 初始化软电话配置
	let getSipInfo = function (way) {
		$.ajax({
			url: "https://www.sobot.com/comm/api/1/ext/queryExtForSoftphone?access_token=" + wd.zcVertoServ.token,
			dataType :'json',
		    type : "post",
		    contentType: 'application/json',
		    data: JSON.stringify({
				companyId : wd.zcVertoServ.params.companyId,
				appId : wd.zcVertoServ.params.appId,
				voipAccount: wd.zcVertoServ.params.voipAccount,
				agentId: wd.zcVertoServ.params.agentId
			}),
			success: function (result) {
				if(result.retCode == '000000'){
					vertoParams = result.item;
					vertoParams.wsurl = location.protocol.indexOf('http:') >= 0 ? ('ws://'+ vertoParams.serverIP) : ('wss://'+ vertoParams.serverIP);
				}
				if(way == 'login'){
					loginVerto();
				}
			},
			error: function (result) {
			}
		})
	}
	// 登陆方法
	let loginCallCenter = function (data,cbk){
        let info = {
        	...data,
        	agentId: wd.zcVertoServ.params.agentId,
        	groupId: wd.zcVertoServ.params.groupId,
        	companyId: wd.zcVertoServ.params.companyId,
        	appId: wd.zcVertoServ.params.appId,
        	number: wd.zcVertoServ.params.voipAccount,
        	callWay: wd.zcVertoServ.params.callWay
        }
		// ajax请求
		$.ajax({
		    url : 'https://www.sobot.com/comm/api/1/call/agentOnWork?access_token=' + wd.zcVertoServ.token,
		    dataType :'json',
		    type : "post",
		    contentType: 'application/json',
		    data: JSON.stringify(info),
		    success : function(result) {
		    	if(result.retCode == '000000'){
		    		if(info.callWay == 1){
		    			// wd.zcVertoServ.vertoLogin();
		    			if(!vertoParams){
		    				getSipInfo('login');
		    			}else {
		    				loginVerto();
		    			}
		    		};
	    		    if(data.agentState == '0'){
	    		    	wd.zcVertoServ.updateAgentState({"agentState": '0'});
	    		    }else {
	    		    	wd.zcVertoServ.updateAgentState({"agentState": '1'});
	    		    };
		    	}
		        !!cbk ? cbk(result) : '';
		    },
		    error : function(result) {
		        !!cbk ? cbk(result) : '';
		        closeSocket();
		    }
		});	
	}

	// socket心跳检测
	let socketHeart = {
		timeout: 30000,
		timeoutObj: null,
		serverTimeoutObj: null,
		start: function(){
			let self = this;
			this.timeoutObj && clearTimeout(this.timeoutObj);
			this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
				this.timeoutObj = setTimeout(function(){
					//这里发送一个心跳，后端收到后，返回一个心跳消息，
					//onmessage拿到返回的心跳就说明连接正常
					sobotSocket.send("123456789");
					self.serverTimeoutObj = setTimeout(function() {
						sobotSocket.close();
				}, self.timeout);

			}, this.timeout)
		}
	}

	let connectSocket = function (data,loginInfo,cbk) {
		sobotSocket = undefined;
		if(!data){
			if(!ws_addr){
				let info = {
					data: JSON.stringify({
						retCode : '999999',
						msg: "socket参数错误!"
					})
				}
				wd.zcVertoServ.callBack ? wd.zcVertoServ.callBack(info) : '';
				return;
			}else {
				sobotSocket = new WebSocket(ws_addr);
			}
		}else {
			ws_addr =  'wss://ctiws.sobot.com:443/ws?companyId=' + data.companyId + '&appId=' + data.appId + '&agentId=' + data.agentId +  '&token=' + data.token;
			sobotSocket = new WebSocket(ws_addr);
		}
		sobotSocket.onopen = function(event) {
			let info = {
				data: JSON.stringify({
					"msgType" : "onLine",
	        		"msg": "socket已成功连接!"
				})
			}
		  	wd.zcVertoServ.callBack ? wd.zcVertoServ.callBack(info) : '';
		  	connentSign = 0;
		  	socketHeart.start();
		  	if(!!loginInfo){
		  		loginCallCenter(loginInfo,cbk);	
		  	}
		};
		sobotSocket.onmessage = function (event) {
			// console.log('event',event);
	        if (typeof event.data === "string") {
	        	let data = JSON.parse(event.data);
	        	if(data.direction == 1 && wd.zcVertoServ.params.callWay == 1){
	        		// 软电话的外呼 主叫号码必定为voipAccount
	        		data.caller = vertoParams.voipAccount;
	        	}
	        	if(data.msgType == 'PhoneStateUserConnected'){
	        		// 用户接听只存在于外呼中
	        		data.direction = 1;
	        	}
	        	// event.data = JSON.stringify(data);
	        	let info = {
	        		data: JSON.stringify(data)
	        	}
	        	wd.zcVertoServ.callBack ? wd.zcVertoServ.callBack(info) : '';
	        }
	        socketHeart.start();
	    };
	    sobotSocket.onclose = function (event) {
	        if (event.wasClean) {
	        	let info = {
	        		data: JSON.stringify({
	        			"msgType" : "offLine",
	        			"msg": "socket已正常关闭!"
	        		})
	        	}
	            wd.zcVertoServ.callBack ? wd.zcVertoServ.callBack(info) : '';
	        }else {
	            wd.zcVertoServ.callBack ? wd.zcVertoServ.callBack(event) : '';
	            if(connentSign <= 5){
	            	connectSocket();
	            	connentSign ++ ;
	            }
	        }
	    };
	    // 连接出现异常
	    sobotSocket.onerror = function (event) {
	        wd.zcVertoServ.callBack ? wd.zcVertoServ.callBack(event) : '';
	        if(connentSign <= 5){
	        	connectSocket();
	        	connentSign ++ ;
	        }
	    };
	};
	let closeSocket = function () {
		if(sobotSocket){
			connentSign = 0;
			sobotSocket.close();
		}
	}

	wd.zcVertoServ = {
	    token: '',
		callBack: "",
		params: {},
		ininServ: function (data,callBack) {
			// 软电话需要的回调函数
			console.log(data);
	        this.callBack = callBack;
			this.params = data;	
		},
	    getToken: function (cbk){
	        // 获取token
	        let _this = this;
	        let info= {
	            ..._this.params,
	            "grant_type": "client_credentials",
	            "scope" : "select"
	        }
	        $.ajax({
	            url :"https://www.sobot.com/comm/oauth/token",
	            data: info,
	            dataType :'json',
	            type : "POST",
	            async : false,
	            success : function(result) {
	                if (!!result["access_token"]) {
	                    _this.token = result["access_token"];
	                    getSipInfo();
	                }
	                !!cbk ? cbk(result) : '';
	            }
	        });
		},
		reConnect:function (){
			let info = {
	        	token: this.token,
	        	agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
	        }
	        connectSocket(info);
	        if(this.params.callWay == 1){
        		if(!vertoParams){
        			getSipInfo('login');
        		}else {
        			setTimeout(function (){
        				loginVerto();	
        			},2000)
        		}
        	}
		},
	    agentLogin: function (info,cbk){
	        // 座席上班
	        let _this = this;
    		let data = {
            	token: this.token,
            	agentId: this.params.agentId,
            	companyId: this.params.companyId,
            	appId: this.params.appId
            }
	        connectSocket(data,info,cbk);
	    },
	    agentLoginout: function (cbk){
	        // 坐席下班
	        let _this = this;
	        $.ajax({
	            url : 'https://www.sobot.com/comm/api/1/call/agentOffWork?access_token=' + _this.token,
	            dataType :'json',
	            type : "post",
	            contentType: 'application/json',
	            data: JSON.stringify({
	            	agentId: _this.params.agentId,
	            	companyId: _this.params.companyId,
	            	appId: _this.params.appId
	            }),
	            success : function(result) {
	                !!cbk ? cbk(result) : '';
	                if(result.retCode == '000000'){
	                	if(_this.params.callWay == 1){
	                		loginOut();
	                	}
	                	closeSocket();
	                }
	            },
	            error : function(result) {
	                !!cbk ? cbk(result) : '';
	            }
	        });	
	    },
	    agentCallOut: function (data,cbk){
	        // 外呼
	        let _this = this;
	        let info = {
	        	...data,
	        	agentId: _this.params.agentId,
	        	groupId: _this.params.groupId,
	        	companyId: _this.params.companyId,
	        	appId: _this.params.appId,
	        	number: _this.params.voipAccount
	        }

	        autoListen = true;
	        // ajax请求
	        $.ajax({
	            url : 'https://www.sobot.com/comm/api/1/call/agentMakeCall?access_token=' + _this.token,
	            dataType :'json',
	            type : "post",
	            contentType: 'application/json',
	            data: JSON.stringify(info),
	            success : function(result) {
	                !!cbk ? cbk(result) : '';
	            },
	            error : function(result) {
	                !!cbk ? cbk(result) : '';
	            }
	        });
	    },
	    agentHangUp: function (data,cbk){
			// 挂机
	        let url = "/api/1/call/agentCallHangUp";
	        data.companyId = this.params.companyId;
	        data.appId = this.params.appId;
	        data.agentId = this.params.agentId;
	        this.requestFun(url,data,cbk);
	    },
	    agentListen: function () {
	    	listenCall();
	    },
	    queryAgentState: function (cbk) {
	    	let data = {
	    		agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
	    	}
	    	// 座席状态查询
	    	let url = "/api/1/call/queryAgentState";
	    	this.requestFun(url, data, cbk);
	    },
	    // updateAgentState修改坐席状态
	    updateAgentState: function (data,cbk){
	    	let _this = this;
	    	$.ajax({
	    	    url : 'https://www.sobot.com/comm/api/1/call/updateAgentState?access_token=' + _this.token,
	    	    dataType :'json',
	    	    type : "post",
	    	    contentType: 'application/json',
	    	    data: JSON.stringify({
	    	    	...data,
	    	    	agentId: _this.params.agentId,
	    	    	companyId: _this.params.companyId,
	    	    	appId: _this.params.appId
	    	    }),
	    	    success : function(result) {
	    	    	!!cbk ? cbk(result) : '';
	    	    	// _this.queryAgentState();
	    	    },
	    	    error : function(result) {
	    	        !!cbk ? cbk(result) : '';
	    	    }
	    	});
	    },
        agentTransfer: function (data, cbk) {
            // 呼叫中发起转接
            let url = "/api/1/call/agentConsultTransfer";
            let info = {
            	...data,
            	...this.params
            }
            this.requestFun(url, info, cbk);
        },
        agentTransferConfirm: function (data, cbk) {
            // 转接确认
            let url = "/api/1/call/agentTransferConfirm";
            let info = {
            	...data,
            	...this.params
            }
            this.requestFun(url, info, cbk);
        },
        agentConsultBack: function (data, cbk) {
            // 转接确认
            let url = "/api/1/call/agentConsultBack";
            let info = {
            	...data,
            	agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
            }
            this.requestFun(url, info, cbk);
        },
        rejectConsult: function (data, cbk) {
            // 转接确认
            let url = "/api/1/call/agentConsultBack";
            let info = {
            	...data,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
            }
            this.requestFun(url, info, cbk);
        },
        transferThirdNum: function (data, cbk) {
            // 转接第三方
            let url = "/api/1/call/transferThirdNum";
            let info = {
            	...data,
	    		agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
	    	}
            this.requestFun(url, info, cbk);
        },
        transferGroup: function (data, cbk) {
            // 转接技能组
            let url = "/api/1/call/transferGroup";
            let info = {
            	...data,
	    		agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
	    	}
            this.requestFun(url, info, cbk);
        },
        agentHold: function (data, cbk) {
        	// 保持
        	let url = "/api/1/call/agentHold";
        	let info = {
            	...data,
	    		agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
	    	}
            this.requestFun(url, info, cbk);
        },
        agentUnHold: function (data, cbk) {
        	// 取消保持
        	let url = "/api/1/call/agentUnHold";
        	let info = {
            	...data,
	    		agentId: this.params.agentId,
	        	companyId: this.params.companyId,
	        	appId: this.params.appId
	    	}
            this.requestFun(url, info, cbk);
        },
	    requestFun: function (url,data,cbk){
	        let _this = this;
	        $.ajax({
	            url : 'https://www.sobot.com/comm' + url + '?access_token=' + _this.token,
	            dataType :'json',
	            type : "post",
	            contentType: 'application/json',
	            data: JSON.stringify(data),
	            success : function(result) {
	                !!cbk ? cbk(result) : '';
	            },
	            error : function(result) {
	                !!cbk ? cbk(result) : '';
	            }
	        });	    
	    }
	}
})(window)