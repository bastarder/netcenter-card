(function(){
    var $ = function(s){
        return document.getElementById(s)
    }

    var App = function(){
        this.$code = ''             // 卡号 
        this.$timer = null          // 节流计时器
        this.$slowestSpeed = 200    // 最大输入时间(毫秒) 
        this.$tipEl = $('tip')      // 结果显示 
        this.$input = $('cardId')   // 状态显示 
        this.$isWait = false        // 是否正在请求 
        this.init()                 // 初始化
    }

    App.prototype = {
        init: init,                         // 初始化, 绑定键盘监听
        validateCode: validateCode,         // 验证是否为可能有效的卡号
        signCode: signCode,                 // 向服务器发送验证
        successCallback: successCallback,   // 成功回调
        failCallback: failCallback,         // 失败回调
        reset: reset,                       // 重置界面状态(延迟*秒)
    }
    
    new App();

    //////////////////////////////////////

    function init(){
        var self = this
        document.addEventListener('keypress', function(event){
            // 节流 控制在 slowestSpeed 毫秒内输入完毕, 否则不生效;
            if(!self.$timer){
                self.$timer = setTimeout(function() {
                    console.warn('过滤非法输入: [输入超时]', self.$code)
                    self.$code = ''
                    self.$timer = null
                }, self.$slowestSpeed);
            }
            var code = String.fromCharCode(event.keyCode)
            if(event.keyCode === 13 && self.validateCode()){
                self.signCode()
            }else if(/^[0-9]$/.test(code)){
                self.$code += code
            }else{
                self.$code = ''
            }
        })
    }

    function validateCode(){
        return /^[0-9]{1,}$/.test(this.$code)
    }

    function signCode(){
        var self = this
        self.$resetTimer && clearTimeout(self.$resetTimer);
        if(this.$isWait){
            return 0
        }
        this.$isWait = true
        this.$input.value = "签到中..."
        console.log('send:',this.$code)

        Ajax.get('http://localhost:5000/signcode?code=' + self.$code,
            function(data){
                data = JSON.parse(data)
                if(data.success){
                    self.successCallback(data.data)
                }else{
                    self.failCallback(data)
                }
            },
            function(data){
                self.failCallback(data)
            }
        )
    }

    function successCallback(data){
        this.$isWait = false
        this.$input.value = "签到成功!"
        this.$tipEl.innerHTML = "\
            <div class='result'>\
                <div class='msg-line name'>" + data.data + "</div>\
                <div class='msg-line phone'>" + data.phone + "</div>\
                <div class='msg-line department'>" + data.department + "</div>\
            </div>\
        "
        this.reset()
    }

    function failCallback(data){
        this.$isWait = false
        this.$input.value = "签到失败!"
        this.$tipEl.innerHTML = "\
            <div class='result error'>\
                <div class='msg-title'>出错啦!</div>\
                <div class='msg-content'>" + data.data + "</div>\
            </div>\
        "
        this.reset()
    }

    function reset(){
        var self = this
        self.$resetTimer = setTimeout(function(){
            self.$input.value = '请刷卡!'
            self.$tipEl.innerHTML = "\
                <div class='result error'>\
                    欢迎光临网络中心!\
                </div>\
            "
        }, 4000)
    }

})();
