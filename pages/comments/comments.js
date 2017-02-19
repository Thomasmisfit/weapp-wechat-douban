// pages/comments/comments.js
var xtrequest = require('../../utils/xtrequest.js')

Page({
  data: {
    item: null,
    total: 0,
    comments: [],
    start: 0,
    nextLoading: false,
    preLoading: false,
    scrollTop: 0,
    count: 20
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // console.log("options:", options)
    var that = this
    that.setData({
      item: options
    })

    that.loadData({
      success: function (res, comments) {
        that.setData({
          comments: comments
        })
      }
    })
  },
  loadData: function (params) {
    var that = this

    var success = params['success']
    var start = params['start']
    // 获取item comment信息
    xtrequest.getCommentList({
      id: that.data.item.id,
      category: that.data.item.category,
      start: start,
      count: 20,
      success: function (res, comments) {
        that.setData({
          total: res.data.total,
        })
        if (success) {
          success(res, comments)
        }
      }
    })
  },
  preBtnClick: function () {
    var that = this
    if (that.data.start == 0) {
      return
    }

    that.setData({
      preLoading: true
    })

    that.loadData({
      start: that.data.start - that.data.count,
      success: function (res, comments) {
        that.setData({
          start: that.data.start - that.data.comments.length,
          comments: comments,
          preLoading: false,
          scrollTop: 0
        })
      }
    })
  },
  nextBtnClick: function () {
    var that = this
    that.setData({
      nextLoading: true
    })
    that.loadData({
      'start': that.data.start + that.data.count,
      'success': function (res, comments) {
        that.setData({
          comments: comments,
          start: that.data.start + comments.length,
          nextLoading: false,
          scrollTop: 0
        })
      }
    })
  },
  backToDetail: function () {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function (res) {
        // success
      }
    })
  }
})