function ratingStarCalulate(value) {
  var light = parseInt(parseInt(value) / 2)
  var half = parseInt(value) % 2
  var gray = 5 - light - half

  var lights = []
  var halfs = []
  var grays = []
  var ratingStar = {}

  for (var j = 0; j < light; j++) {
    lights.push(j)
  }
  for (var j = 0; j < half; j++) {
    halfs.push(j)
  }
  for (var j = 0; j < gray; j++) {
    grays.push(j)
  }

  ratingStar['lights'] = lights
  ratingStar['halfs'] = halfs
  ratingStar['grays'] = grays
  return ratingStar
}

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
    },
    movieDetailUrl: function (id) {
      return 'https://m.douban.com/rexxar/api/v2/movie/' + id
    },
    tvDetailUrl: function (id) {
      return 'https://m.douban.com/rexxar/api/v2/tv/' + id
    },
    showDetailUrl: function (id) {
      return this.tvDetailUrl(id)
    },
    movieTagUrl: function (id = 1) {
      return 'https://m.douban.com/rexxar/api/v2/movie/' + id + '/tags?count=8'
    },
    tvTagsUrl: function (id) {
      return 'https://m.douban.com/rexxar/api/v2/tv/' + id + '/tags?count=8'
    },
    showTagsUrl: function (id) {
      return this.tvTagsUrl(id)
    },
    movieCommentUrl: function (id, start = 0, count = 3) {
      return 'https://m.douban.com/rexxar/api/v2/movie/' + id + '/interests?count=' + count + '&start=' + start
    },
    tvCommentUrl: function (id, start = 0, count = 3) {
      return 'https://m.douban.com/rexxar/api/v2/tv/' + id + '/interests?count=' + count + '&start=' + start
    },
    showCommentUrl: function (id, start = 0, count = 3) {
      return this.tvCommentUrl(id, start, count)
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
          // console.log('item:', item)
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
          item['rating']['lights'] = ratingStarCalulate(value)['lights']
          item['rating']['halfs'] = ratingStarCalulate(value)['halfs']
          item['rating']['grays'] = ratingStarCalulate(value)['grays']
          item['category'] = category

          items.push(item)
        }
        if (success) {
          success(res, items)
        }
      }
    })
  },
  getItemDetail: function (params) {
    var that = this
    var id = params['id']
    var category = params['category']
    var success = params['success']

    var url = ''
    if (category == 1) {
      url = that.url.movieDetailUrl(id)
    } else if (category == 2) {
      url = that.url.tvDetailUrl(id)
    } else {
      url = that.url.showDetailUrl(id)
    }

    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        // console.log('res:', res)
        var data = res.data
        // console.log("data in details:", data)
        data['genres'] = res.data.genres.join(' / ')
        var authors = []
        var dLength = res.data.directors.length > 3 ? 3 : res.data.directors.length
        var aLength = res.data.actors.length > 3 ? 3 : res.data.actors.length
        for (var i = 0; i < dLength; i++) {
          authors.push(res.data.directors[i].name + '(导演)')
        }
        for (var i = 0; i < aLength; i++) {
          authors.push(res.data.actors[i].name)
        }
        data['authors'] = authors.join(' / ')
        data['category'] = category
        var item = data

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
          item['rating']['lights'] = ratingStarCalulate(value)['lights']
          item['rating']['halfs'] = ratingStarCalulate(value)['halfs']
          item['rating']['grays'] = ratingStarCalulate(value)['grays']
        if (success) {
          success(res, item)
        }
      }
    })

  },
  getItemTag: function (params) {
    var that = this
    var id = params['id']
    var category = params['category']
    var success = params['success']
    var url = ''
    if (category == 1) {
      url = that.url.movieTagUrl(id)
    } else if (category == 2) {
      url = that.url.tvTagsUrl(id)
    } else {
      url = that.url.showTagsUrl(id)
    }
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        var tags = res.data.tags
        if (success) {
          success(res, tags)
        }
      }
    })
  },
  getCommentList: function (params) {
    var that = this
    var id = params['id']
    var category = params['category']
    var success = params['success']
    var count = params['count'] ? params['count'] : 3
    var start = params['start'] ? params['start'] : 0

    var url = ''
    if (category == 1) {
      url = that.url.movieCommentUrl(id, start, count)
    } else if (category == 2) {
      url = that.url.tvCommentUrl(id, start, count)
    } else {
      url = that.url.showCommentUrl(id, start, count)
    }
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        var comments = res.data.interests
        var items = []
        for (var i = 0; i < comments.length; i++) {
          var item = comments[i]
          // console.log('item:', item)
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
          item['rating']['lights'] = ratingStarCalulate(value)['lights']
          item['rating']['halfs'] = ratingStarCalulate(value)['halfs']
          item['rating']['grays'] = ratingStarCalulate(value)['grays']
          item['category'] = category

          items.push(item)
        }
        // console.log("comments in list:",comments)
        if (success) {
          success(res, items)
        }
      }
    })
  }
}

module.exports = xtrequest