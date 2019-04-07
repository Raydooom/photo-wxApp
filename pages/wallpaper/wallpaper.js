const {
  wxToast,
  wxPromise
} = require("../../utils/wxUtils.js");
const {
  severRequest
} = require("../../api/index");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    monthStr: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    wallpaperList: [],
    total: 0,
    page: 1,
    pageSize: 5,
    hasMore: true,
    loadText: "正在加载",
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();
  },
  getData() {
    let params = {
      page: this.data.page,
      pageSize: this.data.pageSize
    };
    severRequest("getDailyList", params).then(res => {
      this.setData({
        page: this.data.page,
        wallpaperList: this.data.wallpaperList.concat(res.data.data),
        total: res.data.data.length,
        loading: false,
        hasMore: res.data.data.length == 0 ? false : true
      });
    });
  },
  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({
        page: this.data.page + 1
      });
      this.getData();
    }
  },
  downImg(e) {
    let data = {
      id: e.currentTarget.dataset.id,
      download: e.currentTarget.dataset.download + 1
    };
    severRequest("dailyDownload", data).then(res => {
      console.log(res.errmsg);
    });
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      success: res => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: res => {
            wxToast("保存成功");
          },
          fail: err => {
            wxToast("保存失败");
          }
        });
      }
    });
  },
  // 点赞
  praise(e) {
    let data = {
      id: e.currentTarget.dataset.id,
      praises: e.currentTarget.dataset.praises + 1,
      index: e.currentTarget.dataset.index
    };
    severRequest("dailyPraise", data).then(res => {
      if (res.data == 1) {
        console.log(res.errmsg);
        let praises = `wallpaperList[${data.index}].praises`;
        this.setData({
          [praises]: data.praises
        });
      }
    });
  },
  // 分享
  share(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../wallpaperShare/wallpaperShare?id=" + id
    });
  }
});