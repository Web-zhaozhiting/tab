// tab类
// 将所有插件代码封装到一个匿名函数当中；
// 匿名函数自执行
(function ($) {

    var Tab = function (tab) {
        var _this = this;
        // 保存单个tab组件
        this.tab = tab;
        // 默认配置参数
        this.config = {
            // 鼠标的触发类型
            "triggerType": "click",
            // 内容切换效果
            "effect": "default",
            // 默认显示第几张图片
            "invoke": "2",
            // 是否自动播放
            "auto": false
        };
        // 如果配置参数存在，就扩展默认的配置参数
        // console.log(this.getConfig())
        if (this.getConfig()) {
            $.extend(this.config, this.getConfig());
        }
        // 保存tab标签列表、对应的内容列表
        this.tabItems     = this.tab.find('ul.tab-nav li');
        this.contentItems = this.tab.find('div.content-wrap div.content-item');
        // console.log(this.contentItems);

        // 保存配置参数
        var config = this.config;
        if(config.triggerType === 'click'){
            this.tabItems.on(config.triggerType,function () { 
                _this.invoke($(this));
             })
        }else if(config.triggerType === 'mouseover' ||config.triggerType != 'click'){
            this.tabItems.mouseover(function () { 
                _this.invoke($(this));
             })
        }
        
    };

    Tab.prototype = {
        // 事件驱动函数
        invoke:function(currentTab){
            var _this = this;
            // 设置索引
            var index=currentTab.index(); 

            // tab 选中状态
            currentTab.addClass('active').siblings().removeClass('active');
            // 切换内容区域
            var effect   =this.config.effect;
            var conItems = this.contentItems;
            console.log(effect)
            if (effect === 'default') {
                conItems.eq(index).addClass('current').siblings().removeClass('current');
            }else if(effect === 'fade'||effect != 'default'){
                conItems.eq(index).fadeIn().siblings().fadeOut();
            }
        },
        // 获取配置参数
        getConfig: function () {
            // 拿一下tab元素节点上的data-config
            var config = this.tab.attr('data-config');
            // console.log(config)
            // 确保有配置参数
            if (config && config != '') {
                // 把config的JSON字符串转义到
                return $.parseJSON(config);
            } else {
                return null;
            };
        }
    };

    // 让外部能够访问到Tab
    window.Tab = Tab;
})(jQuery);