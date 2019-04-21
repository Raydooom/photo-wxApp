const {
  severRequest,
  appViewCount
} = require("api/index");
const {
  wxPromise
} = require("/utils/wxUtils.js");
const {
  Promise
} = require("/utils/external/es6-promise.min.js");

App({
  wxLogin() {
    return new Promise((resolve, reject) => {
      // 获取code码
      wxPromise(wx.login).then(loginRes => {
        // 获取用户信息
        wxPromise(wx.getUserInfo, {
          lang: "zh_CN"
        }).then(res => {
          let data = {
            code: loginRes.code,
            userInfo: res.userInfo
          };
          // 设置用户信息
          this.userInfo = res.userInfo;
          console.log(this.userInfo.avatarUrl)
          severRequest("login", data).then(res => {
            this.globalData.isLogin = true;
            wx.setStorageSync("token", res.data);
            resolve();
          });
        });
      });
    });
  },
  // 访客统计
  appViewCount() {
    severRequest("appViewCount")
  },
  userInfo: {
    avatarUrl: "../../assets/images/default_avatar.jpeg",
  },
  onLaunch() {
    this.wxLogin();
    this.appViewCount();
  },
  globalData: {
    isLogin: wx.getStorageSync("token") ? true : false
  }
});