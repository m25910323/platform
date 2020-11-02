export default {
	formulaRegExp(string, obj) { // TODO: 如何处理=？
		// 剔除空白符
		string = string.replace(/\s/g, '');

		// 错误情况，空字符串
		if ("" === string) {
			return "计算公式不能为空";
		}

		// 错误情况，运算符连续
		if (/[\+\-\*\/]{2,}/.test(string)) {
			return "运算符不能连续";
		}

		// 空括号
		if (/\(\)/.test(string)) {
			return "括号内不能为空";
		}

		// 错误情况，括号不配对
		var stack = [];
		for (var i = 0, item; i < string.length; i++) {
			item = string.charAt(i);
			if ('(' === item) {
				stack.push('(');
			} else if (')' === item) {
				if (stack.length > 0) {
					stack.pop();
				} else {
					return "括号请配对";
				}
			}
		}
		if (0 !== stack.length) {
			return "括号请配对";
		}

		// 错误情况，(后面是运算符 
		if (/\([\+\-\*\/]/.test(string)) {
			return "(后面不能是运算符";
		}

		// 错误情况，)前面是运算符
		if (/[\+\-\*\/]\)/.test(string)) {
			return ")前面不能是运算符";
		}

		// 错误情况，(前面不是运算符
		// if (/[^\+\-\*\/]\(/.test(string)) {
		// 	return false;
		// }

		// 错误情况，)后面不是运算符
		// if (/\)[^\+\-\*\/]/.test(string)) {
		// 	return false;
		// }

		return {
			"type": "success",
			"msg": "校验成功"
		};
	}
}
