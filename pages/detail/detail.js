// pages/detail/detail.js
var xtrequest = require('../../utils/xtrequest.js')

Page({
  data:{
    id: '',
    category: 1,
    item: null,
    tags: [],
    comment: null
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    console.log("options:",options)
    var title = options['title']
    var id = options['id']
    var category = options['category']
    wx.setNavigationBarTitle({title: title})

    that.setData({
      id: id,
      category: category
    })
    that.loadData()
    console.log('tags:', that.data.tags) 
  },
  loadData:function(){
    var that = this
    // 获取item detail信息
    xtrequest.getItemDetail({
      id: that.data.id,
      category: that.data.category,
      success: function (res, item) {
        that.setData({
          item:item
        })
      }
    })

    //  获取item tags信息
    xtrequest.getItemTag({
      id: that.data.id,
      category: that.data.category,
      success: function (res, tags) {
        console.log("tags:",tags)
        that.setData({
          tags:tags
        })
      }
    })

    // 获取item comment信息
    xtrequest.getCommentList({
      id: that.data.id,
      category: that.data.category,
      success: function (res, comments) {
        var comment = {
          comments: comments,
          total: res.data.total
        }
        that.setData({
          comment: comment 
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})