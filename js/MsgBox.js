/**
 * Created by majy on 2017/11/25.
 */
$(function($, document) {
    "use strict";
    window.MsgBox = function() {
        var defaults = {
            content: "暂无消息", //消息里面的内容，可以是html元素
            title: "提醒", //这是消息的标题
            autoHide: 0, //这是消息自动关闭的时间，，以秒为单位，默认为0，表示不自动关闭
            width: 260 //消息提醒框的宽度，最低260
        };
        var _init = function() {
            var boxhtml = '<div id="MsgBox-box" class="msgbox" style="bottom: -400px;width:[Width]px;">' +
                '<div class="msgbox-header">' +
                '<button type="button" class="close" data-dismiss="msgbox" aria-hidden="true">&times;</button>' +
                '<h3>[Title]</h3>' +
                '</div>' +
                '<div class="msgbox-body">' +
                '[Content]' +
                '</div>' +
                '</div>';

            $("body").append(boxhtml);
        };
        _init();

        var msgboxTime;
        var autoTimeout;


        var reg = new RegExp("\\[([^\\]]*?)\\]", "igm");
        var alr = $("#MsgBox-box");
        var ahtml = alr.html();

        var _show = function(options) {
            alr.html(ahtml); //复原
            var option = $.extend(defaults, options);
            defaults = option;
            var width = option.width < 260 ? 260 : option.width;
            width += "px";
            var html = alr.html().replace(reg, function(node, key) {
                return {
                    Title: option.title,
                    Content: option.content,
                    Width: width
                }[key];
            });

            alr.html(html);
            var bottom = -400;
            msgboxTime = setTimeout(function() {
                setInterval(function() {
                    if (bottom < 0) {
                        bottom += 20;
                    }
                    alr.css({
                        bottom: bottom + "px",
                        width: width
                    });
                }, 20);
                _autoHide(defaults.autoHide);
            }, 1000);
        };

        var _hide = function() {
            //msgbox关闭按钮绑定事件
            alr.delegate(".close", "click", function() {
                alr.fadeOut(1000, function() {
                    alr.remove();
                });
                clearTimeout(msgboxTime);
                if (defaults.autoHide > 0 && autoTimeout) {
                    clearTimeout(autoTimeout);
                }
            });
        };
        //10秒后自动消失
        var _autoHide = function(timeout) {
            var t = (timeout + 1) * 1000;
            autoTimeout = setTimeout(function() {
                alr.fadeOut(1000, function() {
                    alr.remove();
                });
                clearTimeout(msgboxTime);
            }, t);
            if (timeout == 0) {
                clearTimeout(autoTimeout);
            }
        }
        _hide();
        return {
            show: _show
        };
    }();
});