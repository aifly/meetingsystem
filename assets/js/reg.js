(function($){
    window.baseUrl = 'http://api.symbin.cn/v1/'

    var util = {
        init:function (params) {
            this.getMeetInfo();
        },

        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        changeURLPar: function (url, arg, val) {
            var pattern = arg + '=([^&]*)';
            var replaceText = arg + '=' + val;
            return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
        },
        getMeetInfo:function(){
            var s = this;
            $.post(window.baseUrl+'zmitistudent/getmeetinfo',{
                meetid:s.getQueryString('meetid')
            },function(data){
                if(data.getret ===0 ){
                    console.log(data.list[0]);
                    s.meetInfo = data.list[0];
                    if(s.meetInfo.bannerurl){
                        var html = '<img src=' + s.meetInfo.bannerurl + ' />'
                    }else{
                        var html = '<h2>'+s.meetInfo.meetname+'</h2>';
                        html+='<div>'+s.formatDate(s.meetInfo.startdate)+' ~ '+s.formatDate(s.meetInfo.enddate)+'</div>'
                    }
                    $('#wm-banner').append(html);
                }
            });
        },
        formatDate:function(sj) {
            var now = new Date(sj * 1000);
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            return year + "-" + month + "-" + date;
        }

    };

    util.init();

})($);