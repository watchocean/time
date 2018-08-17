var postsData = require('../../data/posts-data.js');

Page({
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        posts_key: postsData.postList
    });
  },
  onPostTap: function (event) {
      var postId = event.currentTarget.dataset.postid;

      wx.navigateTo({
          url: '../posts/post-detail/post-detail?id=' + postId
      })
  },

    onSwiperTap: function (event) {
        var postId = event.target.dataset.postid;

        wx.navigateTo({
            url: '../posts/post-detail/post-detail?id=' + postId
        })
    }
})