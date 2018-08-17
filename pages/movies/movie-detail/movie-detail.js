// pages/movies/movie-detail/movie-detail.js
var util = require("../../../utils/util");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var moiveId = options.id;
      var url = app.globalData.doubanBase +
          "/v2/movie/subject/" + moiveId;
      util.http(url, this.processDoubanData);
  },
    processDoubanData: function(data) {
        if (!data) {
            return;
        }
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large

            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.setData({
            movie: movie
        });
    },
    viewMoviePostImg: function(e){
        var src = e.currentTarget.dataset.src;
        wx.previewImage({
            urls: [src],
            current: src
        })
    }
})