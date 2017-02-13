

var xtrequest = {
  url: {
    movieListUrl: function (start = 0) {
      return 'https://m.douban.com/rexxar/api/v2/subject_collection/movie_showing/items?start=' + start
    },
    tvListUrl: function (start = 0) {
      return 'https://m.douban.com/rexxar/api/v2/subject_collection/tv_hot/items?start=' + start
    },
    showListUrl: function (start = 0) {
      return 'https://m.douban.com/rexxar/api/v2/subject_collection/tv_variety_show/items?start=' + start
    }
  },
  getItemList: function (params) {
    var that = this
    var category = params['category']
    var success = params['success']
    var count = params['count'] ? params['count'] : 20
    var start = params['start'] ? params['start'] : 0
    // category:1 代表的是电影
    // category:2 代表的是电视剧
    // category:3 代表的是综艺节目
    var url = ''
    if (category == 1) {
      url = that.url.movieListUrl(start)
    } else if (category == 2) {
      url = that.url.tvListUrl(start)
    } else {
      url = that.url.showListUrl(start)
    }

    wx.request({
      url: url,
      method: 'GET',
      success: function (res) {
        var data = res.data.subject_collection_items
        var items = []
        var length = count <= data.length ? count : data.length
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          console.log('item:', item)
          if (!item['rating']) {
            item['rating'] = {
              value: 0
            }
          }
          var value = item['rating']['value']
          if (typeof value == 'string') {
            value = parseFloat(value)
          }

          value = item.rating.value.toFixed(1)


          item['rating']['value'] = value
          var light = parseInt(parseInt(value) / 2)
          var half = parseInt(value) % 2
          var gray = 5 - light - half

          var lights = []
          var halfs = []
          var grays = []

          for (var j = 0; j < light; j++) {
            lights.push(j)
          }
          for (var j = 0; j < half; j++) {
            halfs.push(j)
          }
          for (var j = 0; j < gray; j++) {
            grays.push(j)
          }

          item['rating']['lights'] = lights
          item['rating']['halfs'] = halfs
          item['rating']['grays'] = grays

          items.push(item)
        }
        if (success) {
          success(res, items)
        }
      }
    })
  }
}

module.exports = xtrequest