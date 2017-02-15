// pages/list/list.js
var xtrequest = require('../../utils/xtrequest.js')

Page({
  data: {
    items: [],
    start: 0,
    category: 1,
    has_more: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // var url = 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items?count=20'
    var category = options['category']
    var title = {
      '1': '电影',
      '2': '电视剧',
      '3': '综艺'
    }
    console.log('options:', options)
    console.log('title', title[category])
    wx.setNavigationBarTitle({
      title: title[category],
    })
    var that = this
    that.setData({
      category: category
    })
    that.loadData()
  },
  scrollToLower: function () {
    var that = this
    that.loadData()
  },
  loadData: function () {
    var that = this
    xtrequest.getItemList({
      category: that.data.category,
      start: that.data.start,
      success: function (res, items) {
        if (items.length == 0 || items == null){
          that.setData({
            has_more: false
          })
        }
        var totalItems = that.data.items.concat(items)
        that.setData({
          items: totalItems,
          start: that.data.start + items.length
        })
      }
    })
  }
})