/**
 * Created by majy on 2017/11/25.
 */
$(function ($,document) {
    "use strict";
    window.CModal=function () {
        var _init=function () {
            var modalhtml="";
                modalhtml += '<div id="cmodal-modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">';
                modalhtml +=   '<div class="modal-header">';
                modalhtml +=      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
                modalhtml +=      '<h3>[Title]</h3>';
                modalhtml +=   '</div>';
                modalhtml += '<div class="modal-body">';
                modalhtml +=    '<p>[Message]</p>';
                modalhtml += '</div>';
                modalhtml += '<div class="modal-footer">';
                modalhtml +=     '<button class="btn cancel" data-dismiss="modal" aria-hidden="true">[BtnCancel]</button>';
                modalhtml +=    ' <button class="btn btn-primary ok">[BtnOK]</button>';
                modalhtml += '</div>';
                modalhtml += '</div>';
            $("body").append(modalhtml);
        };
        _init();

        var reg=new RegExp("\\[([^\\]]*?)\\]","igm");
        var alr=$("#cmodal-modal");
        var ahtml=alr.html();

        var _alert=function (options) {
            alr.html(ahtml);//复原

            alr.find(".ok").removeClass("btn-success").addClass("btn-primary");

            alr.find(".cancel").hide();

            var backdrop=true;

            _dialog(options,backdrop);

            return {
                on:function (callback) {
                    if (callback && callback instanceof Function){
                        alr.find(".ok").click(function () {
                            callback(true);
                        });
                    }
                }
            };
        };
        var _confirm=function (options) {
            alr.html(ahtml);//复原

            alr.find(".ok").removeClass("btn-success").addClass("btn-primary");

            alr.find(".cancel").show();

            var backdrop=false;

            _dialog(options,backdrop);

            return {
                on:function (callback) {
                    if (callback && callback instanceof Function){
                        alr.find(".ok").click(function () {
                            callback(true);
                        });
                        alr.find(".cancel").click(function () {
                            callback(false);
                        });
                    }
                }
            };
        };
        var _dialog=function (options,backdrop) {
            var ops={
                msg:"提示内容",
                title:"操作提示",
                btnok:"确定",
                btncl:"取消",
                forceHeight:false
            };
            var option={};
            option=$.extend({},ops,options);

            var html=alr.html().replace(reg,function (node, key) {
                return {
                    Title:option.title,
                    Message:option.msg,
                    BtnOK:option.btnok,
                    BtnCancel:option.btncl
                }[key];
            });

            alr.html(html);

            if (backdrop === false){
                alr.find(".modal-header button").remove();
                backdrop="static";
            }

            if (option.width && option.width>560){
                var mleft=option.width/2;
                alr.css({width:option.width+"px","margin-left":-mleft+"px"});
            }
            if (option.height && option.height>100){
                if (option.forceHeight && option.height>400){
                    var css={
                        height:option.height+"px",
                        "max-height":option.height+"px"
                    };
                    alr.css({"margin-top":"-350px"});
                    alr.find(".modal-body").css(css);
                }else{
                    alr.find(".modal-body").css({height:option.height+"px"});
                }
            }
            if (option.murl){
                alr.find(".modal-body").css({"padding":"0"});
                alr.find(".modal-footer").remove();
                var modal_body='<iframe src="'+option.murl+'" frameborder="0" width="100%"  height="100%"></iframe>';
                alr.find(".modal-body").html(modal_body);
                alr.data("data",option.data);
            }
            alr.modal({
                backdrop:backdrop
            });


        };



        var _close=function () {
            alr.modal('hide');
        };


        var _modal=function (options) {

            var backdrop="static";

            _dialog(options,backdrop);

            return {
                onHideModal:function (callback) {
                    if (callback && callback instanceof Function){
                        alr.on('hidden.bs.modal', function (e) {
                            callback();
                        });
                    }
                }
            };

        };

        return {
            alert:_alert,
            confirm:_confirm,
            close:_close,
            modal:_modal
        };
    }();
});