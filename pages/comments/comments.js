// pages/comments/comments.js
Page({
  data:{
    item:null
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log("options:",options)
    var that = this
    that.setData({
      item: options
    })
  },
  backToDetail: function(){
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function(res){
        // success
      }
    })
  }
})