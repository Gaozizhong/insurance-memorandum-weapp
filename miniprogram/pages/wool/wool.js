// pages/wool/wool.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    count: null,
    WoolData: [],
    WoolTotal: 0,
    slideButtons: [{
      text: '普通',
      src: '/images/icon/icon_love.svg'
    }, {
      text: '普通',
      extClass: 'test',
      src: '/images/icon/icon_star.svg'
    }, {
      type: 'warn',
      text: '警示',
      extClass: 'test',
      src: '/images/icon/icon_del.svg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showModal({
        title: '请登录',
        content: '将跳转到登录页面进行登录，否则某些功能将出现问题！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }

        }
      })

    }
    this.onQuery()
  },


  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
  },

  onQuery: function () {
    const db = wx.cloud.database()
    const _ = db.command
    // 查询所有可以使用的羊毛
    db.collection('wool').where({
      status: true,
      end: _.gt(new Date()),
    }).get({
      success: res => {
        this.setData({
          WoolData: res.data,
          WoolTotal: res.data.length
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  onJumpDetail(event) {
    const wool_id = event.currentTarget.id
    wx.navigateTo({
      url: `/pages/wool-detail/wool-detail?wool_id=${wool_id}`,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onQuery()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})