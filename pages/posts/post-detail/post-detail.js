// pages/posts/post-detail/post-detail.js

var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({
    data: {
        isPlayingMusic: false,
        collected: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(option) {
        var postId = option.id;
        var postData = postsData.postList[postId];

        //如果在onLoad方法中,不是异步的去执行数据绑定
        //则不需要使用this.setData方法 
        //this.data.postData = postData;
        this.setData({
            postData: postsData.postList[postId],
            currentPostId: postId
        });

        var postsCollected = wx.getStorageSync("posts_collected");
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            //当postsCollected[postId]为空时，进行setData操作就会报错
            if (postCollected) {
                this.setData({
                    collected: postCollected
                })
            }
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("posts_collected", postsCollected);
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
            this.setData({
                isPlayingMusic: true
            });
        }
       this.setMusicMonitor();
    },

    setMusicMonitor: function(){
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.currentPostId;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function(){
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap: function(event) {
        //获取缓存和是否收藏的值
        var postsCollected = wx.getStorageSync("posts_collected");
        var postCollected = postsCollected[this.data.currentPostId];
        //更新是否收藏的值和缓存
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        //设置缓存和是否收藏的值
        wx.setStorageSync("posts_collected", postsCollected);
        this.setData({
            collected: postCollected
        });

        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },
    onShareTap: function(event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ"
        ];

        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function(res) {
                wx.showModal({
                    title: '用户' + itemList[res.tapIndex],
                    content: '现在暂时无法分享'
                })
            }
        })
    },
    onMusicTap: function(event) {
        var postData = postsData.postList[this.data.currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title
            })
            this.setData({
                isPlayingMusic: true
            });
        }
    }
})