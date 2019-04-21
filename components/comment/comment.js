// components/comment/comment.js
const {
  severRequest
} = require("../../api/index");
const {
  wxToast
} = require("../../utils/wxUtils.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    articleId: {
      type: String
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    avatar: getApp().userInfo.avatarUrl,
    commentList: "",
    active: '',
    focus: false,
    showInput: false,
    placeHolder: '请输入评论内容',
    msg: ''
  },
  ready() {
    this.setData({
      avatar: getApp().userInfo.avatarUrl
    })
    this.getComments();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取评论列表
     */
    getComments: function() {
      // 获取评论数据
      severRequest("getArticleComment", {
        id: this.data.articleId
      }).then(res => {
        this.setData({
          commentList: res.data
        })
      })
    },
    showInput() {
      this.setData({
        showInput: true,
        focus: true
      })
    },
    closeInput() {
      this.setData({
        showInput: false
      })
    },
    inputText(e) {
      this.setData({
        msg: e.detail.value
      })
    },
    sendComment() {
      if (this.data.msg.trim() == "") {
        wxToast("请输入评论内容");
        return false;
      }

      // 评论内容
      if (!this.data.isReply) {
        let data = {
          id: this.data.articleId,
          commentText: this.data.msg
        }
        severRequest("addArticleComment", data).then(res => {
          this.getComments();
          this.triggerEvent('commentEnd');
          this.setData({
            msg: '',
            showInput: false,
          })
        })
      } else {
        // 回复评论
        wx.request({
          url: HOST + '/wechat/commentSpecialReply',
          data: {
            commentId: that.data.replyCommentId,
            userId: that.data.userId,
            text: text
          },
          success: (res => {
            that.getComments();
            that.setData({
              msg: '',
              active: '',
              placeHolder: '请输入评论内容',
              isReply: false
            })
            console.log(res);
          })
        })
      }
    }
  }
})