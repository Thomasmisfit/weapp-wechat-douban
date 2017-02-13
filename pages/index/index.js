//index.js
//获取应用实例
var app = getApp()
var xtrequest = require('../../utils/xtrequest.js')

Page({
  data: {
    movies: [],
    tvs: [],
    shows: []
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    // get movies list
    that.loadData(1)
    // get tvs list
    that.loadData(2)
    // get shows list
    that.loadData(3)
  },
  loadData: function (category) {
    var that = this
    xtrequest.getItemList({
      category: category,
      count: 6,
      success: function (res, items) {
        if (category == 1) {
          that.setData({
            movies: items
          })
        }
        if (category == 2) {
          that.setData({
            tvs: items
          })
        }
        if (category == 3) {
          that.setData({
            shows: items
          })
        }
      }
    })
  }
})
