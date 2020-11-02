import axios from 'axios' //引用axios
import {
	getCookie
} from './cookie' //引用刚才我们创建的util.js文件，并使用getCookie方法

// alert(getCookie('JSESSIONID'))

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = ''; //这是调用数据接口
axios.defaults.withCredentials = true; //让ajax携带cookie

// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
	config => {
		// console.log("config",config);
		const token = getCookie('JSESSIONID'); //获取Cookie
		config.data = JSON.stringify(config.data);
		config.headers = {
			'Content-Type': 'application/json', //设置跨域头部,
			// 'Cookie':getCookie('JSESSIONID')
		};
		// if (token) {
		// 	config.params = {
		// 		'token': token
		// 	} //后台接收的参数，后面我们将说明后台如何接收
		// }
		return config;
	},
	err => {
		return Promise.reject(err);
	}
);


// http response 拦截器
// axios.interceptors.response.use((response) => {
// 	return response;
// }, function(error) {
// 	if (401 === error.response.status) {
// 		window.location = '/login';
// 	} else {
// 		return Promise.reject(error);
// 	}
// });

axios.interceptors.response.use(function(response) {
	//重定向到登录页面 
	if (response.data.code == '401') {
		localStorage.clear()
		if (!response.data.url == "") {
			window.location.href = response.data.url //这个url需要后端设置成公用的登录页url
		} else {
			window.location.href = response.data.msg
		}

	} else {
		console.info(response.data)
	}
	return response
}, function(error) {
	return Promise.reject(error)
});

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default axios;

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function fetch(url, params = {}) {

	return new Promise((resolve, reject) => {
		axios.get(url, {
				params: params
			})
			.then(response => {
				resolve(response.data);
			})
			.catch(err => {
				reject(err)
			})
	})
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.post(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			})
	})
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.patch(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			})
	})
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.put(url, data)
			.then(response => {
				resolve(response.data);
			}, err => {
				reject(err);
			})
	})
}
