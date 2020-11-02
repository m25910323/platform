const validatePhone = (rule, value, callback) => {
	let patter = new RegExp("^1[0-9]{10}$"); //简单验证11位手机号
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("请输入正确格式的手机号！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validateCard = (rule, value, callback) => {
	let patter = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //简单验证身份证号
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("身份证输入不合法！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validateEmail = (rule, value, callback) => {
	let patter = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$"); //简单验证邮箱
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("邮箱格式不正确，请重新输入！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validatePositiveNum = (rule, value, callback) => {
	let patter = /^[0-9]+(\.\d+)?$/;
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("必须大于等于0！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validateInt = (rule, value, callback) => {
	let patter = /^[1-9]\d*$/; 
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("只可输入整数！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validateInt14float2 = (rule, value, callback) => {
	let patter = /^(-)?\d{1,14}(\.\d{1,2})?$/;
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("整数最多14位，小数最多2位！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validateRate = (rule, value, callback) => {
	let patter = /^(0\.\d+|0|1)$/;
	if(value === "") {
		callback();
	} else if(!patter.test(value)) {
		return callback(new Error("0-1之间！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};
const validateFloat6 = (rule, value, callback) => {
	var y = String(value).indexOf(".") + 1;//获取小数点的位置
	var count = String(value).length - y;//获取小数点后的个数
	if(value === "") {
		callback();
	} else if(count > 6) {
		return callback(new Error("小数位最多六位！"));
	} else {
		callback(); //必须有此项回调，否则验证会一直不通过
	}
};

export default {
	//必填
	requiredInput: {
		required: true,
		message: '必填项不可为空',
		trigger: 'blur'
	},
	//必选
	requiredSelect: {
		required: true,
		message: '必选项不可为空',
		trigger: 'change'
	},
	//客户名称-必选
	customerId: {
		required: true,
		message: '请选择客户',
		trigger: 'change'
	},
	//账期-必选
	accountPeriod: {
		required: true,
		message: "请选择账期",
		trigger: "change"
	},
	//手机号-格式校验
	mobilePhone: {
		validator: validatePhone,
		trigger: "blur",
	},
	//身份证号-格式校验
	cardNum: {
		validator: validateCard,
		trigger: "blur"
	},
	//邮箱-格式校验
	email: {
		validator: validateEmail,
		trigger: "blur"
	},
	//数字-整数
	integer: {
		validator: validateInt,
		trigger: "blur"
	},
	//数字-正数
	positiveNum: {
		required: true,
		validator: validatePositiveNum,
		trigger: "blur"
	},
	//数字-整数最多14位，小数2位，可正可负
	integer14float2: {
		validator: validateInt14float2,
		trigger: "blur"
	},
	//数字-0-1之间
	rate: {
		validator: validateRate,
		trigger: "blur"
	},
	//数字-小数点最多6位
	float6: {
		validator: validateFloat6,
		trigger: "blur"
	},
}