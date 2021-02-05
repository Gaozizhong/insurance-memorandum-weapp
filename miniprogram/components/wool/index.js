// components/wool/index.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        wool:Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        
    },


    /**
     * 组件的方法列表
     */
    methods: {
        onTap(event){
            const wool_id = this.properties.wool.id
            wx.navigateTo({
                url: `/pages/wool-detail/wool-detail?wool_id=${wool_id}`,
            })
        }
    }
})
