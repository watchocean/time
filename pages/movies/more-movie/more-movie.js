// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/util");
var app = getApp();
Page({
    data: {
        navigateTitle: "",
        requestUrl: '',
        totalCount: 0,
        movies: {},
        isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var category = options.category;
        this.data.navigateTitle = category;
        var dataUrl = "";

        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/in_theaters" ;
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase +
                    "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        util.http(dataUrl, this.processDoubanData);

    },
    //加载更多
    onScrollLower: function(event){
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData); 
        wx.showNavigationBarLoading();
    },

    onPullDownRefresh: function(event){
        var refreshUrl = this.data.requestUrl + "?start=0&count=20";
        this.data.movies = {};
        this.data.isEmpty = true;
        util.http(refreshUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },

    //处理返回数据
    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            // [1,1,1,1,1] [1,1,1,0,0]
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)
        }
        //下滑加载更多
        var totalMovies = {};
        if(!this.data.isEmpty){
            totalMovies = this.data.movies.concat(movies);
        }else{
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies:totalMovies
        });
        this.data.totalCount += 20; 
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
    },

    onReady: function() {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    }
})