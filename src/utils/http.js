import axios from "axios"; //引用axios
import { Message } from "element-ui";
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = ""; //这是调用数据接口
axios.defaults.withCredentials = true; //让ajax携带cookie
// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
  config => {
    // config.data = JSON.stringify(config.data);
    // config.headers = {
    //     'Content-Type': 'application/json', //设置跨域头部,
    // };
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
axios.interceptors.response.use(function (response) {
  //重定向到登录页面
  if (response.data.code === "401") {
    localStorage.clear();
    if (!response.data.url === "") {
      window.location.href = response.data.url; //这个url需要后端设置成公用的登录页url
    } else {
      window.location.href = response.data.msg;
    }
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
export default axios;
export function get(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        if (response.data.code === 0) {
          Message.warning(response.data.msg);
        } else if (response.data.code !== 200) {
          Message.error(response.data.msg);
        }
        resolve(response.data);
      }, err => {
        Message.error("系统繁忙，请稍后重试");
        reject("系统繁忙，请稍后重试");
      });
  });
}
export function get1(url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then(
      response => {
        if (response.data.code === 0) {
          Message.warning(response.data.msg);
        } else if (response.data.code !== 200) {
          Message.error(response.data.msg);
        }
        resolve(response.data);
      },
      err => {
        Message.error("系统繁忙，请稍后重试");
        reject("系统繁忙，请稍后重试");
      }
    );
  });
}
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        if (response.data.code === 0) {
          Message.warning(response.data.msg);
        } else if (response.data.code !== 200) {
          Message.error(response.data.msg);
        }
        resolve(response.data);
      }, err => {
        Message.error("系统繁忙，请稍后重试");
        reject("系统繁忙，请稍后重试");
      });
  });
}
export function post1(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        if (response.data.code === 0) {
          Message.warning(response.data.msg);
        } else if (response.data.code !== 200) {
          Message.error(response.data.msg);
        } else if (response.data.code === 200) {
          resolve(response.data);
        }
      },
      err => {
        Message.error("系统繁忙，请稍后重试");
        reject("系统繁忙，请稍后重试");
      }
    );
  });
}
export function upload(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(response => {
        if (response.data.code === 0) {
          Message.warning(response.data.msg);
        } else {
          Message.error(response.data.msg);
        }
        resolve(response.data);
      }, err => {
        Message.error("系统繁忙，请稍后重试");
        reject("系统繁忙，请稍后重试");
      });
  });
}
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}
