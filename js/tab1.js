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
        this.tabItems = this.tab.find('ul.tab-nav li');
        this.contentItems = this.tab.find('div.content-wrap div.content-item');
        // console.log(this.contentItems);

        // 保存配置参数
        var config = this.config;
        if (config.triggerType === 'click') {
            this.tabItems.on(config.triggerType, function () {
                _this.invoke($(this));
            })
        } else if (config.triggerType === 'mouseover' || config.triggerType != 'click') {
            this.tabItems.mouseover(function (e) {
                _this.invoke($(this));
                // 由于事件冒泡的原因mouseover事件，会导致自动切换只执行一次，所以要阻止冒泡
                e.stopPropagation();
            })
        }
        // 自动切换功能
        if (config.auto) {
            //定义全局定时器
            this.timer = null;
            // 计数器
            this.loop = 0;

            this.autoPlay();

            // 移动到tab上时，清除定时器
            this.tab.hover(function () {
                clearInterval(_this.timer);
            }, function () {
                _this.autoPlay();
            });
        }
        // 设置默认显示的页
        if (config.invoke > 1) {
            this.invoke(this.tabItems.eq(config.invoke - 1))
        }
    };

    Tab.prototype = {
        // 自动间隔切换函数
        autoPlay: function () {
            var _this = this,
                tabItems = this.tabItems, //临时保存tab列表
                tabLength = this.tabItems.length, //tab列表元素个数
                config = this.config; //配置项

            this.timer = window.setInterval(function () {
                _this.loop++;
                // 当loop 大于 tab的长度时候，loop重新归为0
                if (_this.loop >= tabLength) {
                    _this.loop = 0
                };
                tabItems.eq(_this.loop).trigger(config.triggerType);
            }, config.auto)
        },
        // 事件驱动函数
        invoke: function (currentTab) {
            var _this = this;
            // 设置索引
            var index = currentTab.index();

            // tab 选中状态
            currentTab.addClass('active').siblings().removeClass('active');
            // 切换内容区域
            var effect = this.config.effect;
            var conItems = this.contentItems;
            if (effect === 'default') {
                conItems.eq(index).addClass('current').siblings().removeClass('current');
            } else if (effect === 'fade' || effect != 'default') {
                conItems.eq(index).fadeIn().siblings().fadeOut();
            }

            // 注意：如果配置自动切换，记得把当前的loop值设置成当前的index
            if (this.config.auto) {
                this.loop = index;
            }
        },
        // 获取配置参数
        getConfig: function () {
            // 拿一下 tab 元素节点上的data-config
            var config = this.tab.attr('data-config');
            // console.log(config)
            // 确保有配置参数
            if (config && config != '') {
                // 把 config 的JSON字符串转义到
                return $.parseJSON(config);
            } else {
                return null;
            };
        }
    };


    Tab.init = function (tabs) {
        var _this = this;
        tabs.each(function () {
            new _this($(this));
        });
    }
    //   注册成jq方法
    $.fn.extend({
        tab: function () {
            this.each(function () {
                new Tab($(this));
            })
            return this;
        }
    })
    // 让外部能够访问到Tab
    window.Tab = Tab;
})(jQuery);