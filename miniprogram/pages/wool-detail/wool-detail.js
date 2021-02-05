// pages/wool-detail/wool-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wool_id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const wool_id = options.wool_id
    this.setData({
      wool_id: wool_id
    })
  },

  //加载数据
  loadData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    const db = wx.cloud.database()
    const _ = db.command
    db.collection('wool').where({
      _id: this.data.wool_id,
      status: true,
    }).get({
      success: res => {
        this.setData({
          WoolData: res.data[0]
        })
        console.log('[数据库] [查询记录] 成功: ', res)
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
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
    this.loadData()
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