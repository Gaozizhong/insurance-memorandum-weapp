// pages/publish/publish.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wool_title: "",
        wool_introduction: "",
        wool_tags: null,
        wool_value: null,
        clear: true,
        start_date: "不知何时开始（默认）",
        end_date: "不知何时结束（默认）",
        wool_detail: [],
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
    },

    // 清空数据
    clearData() {
        this.setData({
            wool_title: "",
            wool_introduction: "",
            wool_tags: null,
            wool_value: null,
            clear: true,
            start_date: "不知何时开始（默认）",
            end_date: "不知何时结束（默认）",
            wool_detail: [],
        })
    },

    bindStartDateChange(event) {
        this.setData({
            start_date: event.detail.value
        })
    },

    bindEndDateChange(event) {
        this.setData({
            end_date: event.detail.value
        })
    },

    /**
   * 选择图片
   */
    onChangeImage(event) {
        const files = event.detail.all
        let imageFiles = []
        for (let i = 0; i < files.length; i++) {
            imageFiles.push(files[i].url)
        }
        this.setData({
            wool_detail: imageFiles
        })
    },

    //提交创建表单的信息
    onSubmitCreate(event) {
        const wool_title = event.detail.value.wool_title
        if (wool_title == "") {
            wx.showToast({
                title: '请填写优惠名称',
                icon: 'none',
                duration: 2000
            })
            return
        }
        const wool_introduction = event.detail.value.wool_introduction
        if (wool_introduction == "") {
            wx.showToast({
                title: '请填写优惠介绍',
                icon: 'none',
                duration: 2000
            })
            return
        }

        const images = []
        const image_requests = []
        for (var i = 0; i < this.data.wool_detail.length; i++) {
            const filePath = this.data.wool_detail[i]
            const cloudPath = filePath.substr(filePath.lastIndexOf("/") + 1)
            // wx.cloud.uploadFile({
            //     cloudPath,
            //     filePath,
            //     success: res => {
            //         images.push(res.fileID)
            //     },
            //     fail: console.error
            // })
            image_requests.push(
                wx.cloud.uploadFile({
                    cloudPath: cloudPath,
                    filePath: filePath,
                }).then(res => {
                    images.push(res.fileID)
                }).catch(error => {
                    console.error
                })
            )
        }

        const wool_tags = event.detail.value.wool_tags.split(",")
        if (event.detail.value.wool_tags == "") {
            wx.showToast({
                title: '请填写优惠标签，让他人更好查找',
                icon: 'none',
                duration: 2000
            })
            return
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        var start_date
        var end_date
        if (this.data.start_date == "不知何时开始（默认）") {
            start_date = new Date()
        } else {
            start_date = new Date(this.data.start_date)
        }
        if (this.data.end_date == "不知何时结束（默认）") {
            end_date = new Date("Thu Dec 31 2021 08:00:00 GMT+0800 (中国标准时间)")
        } else {
            end_date = new Date(this.data.end_date)
        }
        const wool_value = event.detail.value.wool_value

        Promise.all(image_requests).then(res => {
            console.log(images)
            // 创建新的闲置信息
            const db = wx.cloud.database()
            db.collection('wool').add({
                data: {
                    title: wool_title,
                    introduction: wool_introduction,
                    details: images,
                    tags: wool_tags,
                    start: start_date,
                    end: end_date,
                    value: wool_value,
                    status: true,
                    like: 0
                },
                success: res => {
                    this.clearData()
                    wx.showToast({
                        title: '发布成功，管理员审核通过后即可上架！',
                        icon: 'none',
                        duration: 2000
                    })
                    wx.hideLoading()
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '新增记录失败'
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                    wx.hideLoading()
                }
            })
        }).catch(err => {
            console.log("upload images error:", err)
            wx.hideLoading()
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
        this.clearData()
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