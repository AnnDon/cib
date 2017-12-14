/* =========================================================
 * cib.barTab.js v1.0.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * ========================================================= */


! function($, document, top) {

  "use strict"; // jshint ;_;

  var BarTab = function(element, options) {
    this.element = $(element);
    this.tabItem = '<li id="[tabid]" class="cib-nav-item active">' +
      '<a href="#"  class="cib-nav-item-name">[title]</a>' +
      '<a href="#!" class="cib-nav-item-close">' +
      '<img src="img/cib-nav-item-close.png" alt="" />' +
      '</a>' +
      '</li>';
    this.reg = new RegExp("\\[([^\\[\\]]*?)\\]", "igm");
    this.barWidth = 805;
    this.$element = $(element).delegate('[class="cib-nav-item-close"]', 'click.dismiss.tab', this._closeTab);
    this.$element = $(element).delegate('[class="cib-nav-item-name"]', 'click.active.tab', this._activeTab);
    this.$element = $(element).delegate('[class="cib-nav-left-btn"]', 'click.moveleft.tab', this._moveLeftTab);
    this.$element = $(element).delegate('[class="cib-nav-right-btn"]', 'click.moveright.tab', this._moveRightTab);

  }

  BarTab.prototype = {
    constructor: BarTab,
    addTab: function(options) {
      var option = $.extend({}, $.fn.bartab.defaults, options);
      var tabItemId = "cib-nav-item_tab" + option.id;
      var $this = this.element;
      var tItemHtm = this.tabItem.replace(this.reg, function(node, key) {
        return {
          title: option.title,
          tabid: tabItemId
        }[key];
      });
      //移除首页被选中的样式
      $("#main_index").removeClass("active");
      //移除所有被激活的tab条目的active类
      $this.find(".cib-nav-wrapper ul li.cib-nav-item").removeClass("active");
      $this.find(".cib-nav-wrapper ul").append(tItemHtm);
      //每天假一个tab条目，计算条目总宽度
      var tw = 20; //margin-left:20px;
      $(".cib-nav-wrapper ul li.cib-nav-item").each(function(e) {
        tw += $(this).width() + 20;
      });
      if (tw > this.barWidth) {
        $this.find(".cib-nav-wrapper-btn").show();
      } else {
        $this.find(".cib-nav-wrapper-btn").hide();
      }
      //计算当前新加的条目宽度值
      var curWidth = $this.find(".cib-nav-wrapper ul li.cib-nav-item").last().width();
      //将当前条目宽度值暂存起来
      option["items"]["cib-nav-item_tab" + option.id] = {
        curWidth: curWidth,
        tw: tw,
        id: option.id,
        title: options.title,
        url: options.url
      };
      //如果总宽度大于了900像素，则ul左移动相应的像素
      if (tw > this.barWidth) {
        $.fn.bartab.defaults.barX = $.fn.bartab.defaults.barX + 2;
        var barX = $.fn.bartab.defaults.barX;
        var ulLeft = this.barWidth - tw - barX;
        option["items"]["cib-nav-item_tab" + option.id]["ulLeft"] = ulLeft;
        $.fn.bartab.defaults.ulLeft = ulLeft;
        option.ulLeft = ulLeft;
        //本次ul左移动了多少像素
        //获得上一个添加tab左移动的值
        var prevId = "cib-nav-item_tab" + ($.fn.bartab.defaults.id - 1);
        var prevItem = $.fn.bartab.defaults["items"][prevId];
        var prevAndThisUlLeft = prevItem["ulLeft"] == undefined ? 0 - ulLeft : prevItem["ulLeft"] - ulLeft;
        $.fn.bartab.defaults["items"]["cib-nav-item_tab" + option.id].prevAndThisUlLeft = prevAndThisUlLeft;

        $this.find(".cib-nav-wrapper ul").css({
          left: ulLeft + "px"
        });
      }
      //console.log(option);
      $.fn.bartab.defaults.id = option.id + 1;
      $(".cib-nav_iframe_pane iframe").attr("src", options.url);
    },
    _closeTab: function(e) { //关闭tab
      var that = this;
      var $curItem = $(that).parents(".cib-nav-item");
        var curActive=null;
      //激活后一个tab或者前一个tab项

      if ($curItem.hasClass("active")) {
        var nextItem = $curItem.next(".cib-nav-item");
        var prevItem = $curItem.prev(".cib-nav-item");
        if (nextItem.hasClass("cib-nav-item")) {
          nextItem.addClass("active");
          var liid = nextItem.attr("id");
          $(".cib-nav_iframe_pane iframe").attr("src", $.fn.bartab.defaults["items"][liid].url);
          curActive=nextItem;
        } else if (prevItem.hasClass("cib-nav-item")) {
          prevItem.addClass("active");
          var liid = prevItem.attr("id");
          $(".cib-nav_iframe_pane iframe").attr("src", $.fn.bartab.defaults["items"][liid].url);
          curActive=prevItem;
        }
      }
      var curItemId = $curItem.attr("id");
      if ($.fn.bartab.defaults["items"][curItemId]) {
        var curItem = $.fn.bartab.defaults["items"][curItemId];
        var prevAndThisUlLeft = curItem.prevAndThisUlLeft;
        var curUlLeft = curItem.ulLeft;
        var cid = curItem.id;
        var ulLeft = 0;
        var zid = $.fn.bartab.defaults.id - 1;
        var tw = 20; //margin-left:20px;
        $(".cib-nav-wrapper ul li.cib-nav-item").each(function(e) {
          tw += $(this).width() + 20;
        });



        if (tw < this.barWidth) {
          ulLeft = 0;
        } else {
          if (cid == zid) {
            ulLeft = prevAndThisUlLeft + curUlLeft;
          } else {
            //console.log("..." + "cib-nav-item_tab" + zid);
            var lastItem = $.fn.bartab.defaults["items"]["cib-nav-item_tab" + zid];
            if (lastItem) {
              ulLeft = prevAndThisUlLeft + lastItem.ulLeft;
            } else {
              ulLeft = 0;
            }
          }
        }
        //是否显示活着隐藏左右按钮
        if (tw > this.barWidth) {
          $(".cib-nav-wrapper-btn").show();
        } else {
          $(".cib-nav-wrapper-btn").hide();
          ulLeft = 0;
        }
          var items = $.fn.bartab.defaults["items"];
          if (items.hasOwnProperty("y")){

          }
        if (curActive !== null){
            $.fn.bartab.defaults["items"][curActive.attr("id")].ulLeft = ulLeft;
        }
        $(".cib-nav-wrapper ul").css({
          left: ulLeft + "px"
        });

      }
      //删除缓存中的tab标签数据
      delete $.fn.bartab.defaults["items"][curItemId];
      $curItem.remove();
      //如果数据为空则加载默认首页
      //加载首页地址
      //console.log($.fn.bartab.defaults["items"]);
      var isEmpty = true;
      $.each($.fn.bartab.defaults["items"], function() {
        isEmpty = false;
      });
      if (isEmpty) {
        $(".cib-nav_iframe_pane iframe").attr("src", $.fn.bartab.defaults.defaultIndex);
        $("#main_index").addClass("active");
      }
    },
    _activeTab: function() { //激活tab
      $(".cib-nav-wrapper ul li.cib-nav-item").removeClass("active");
      var that = this;
      var $curItem = $(that).parents(".cib-nav-item").addClass("active");
      var thisid = $curItem.attr("id");
      $(".cib-nav_iframe_pane iframe").attr("src", $.fn.bartab.defaults["items"][thisid].url);
      $("#main_index").removeClass("active");
    },
    _moveRightTab: function() {
      var that = this;
      //获得最后一个tab的id
      var lid = $.fn.bartab.defaults.id - 1;
      if (lid >= 4) {
        var ulLeft = $.fn.bartab.defaults["items"]["cib-nav-item_tab" + lid];
        ulLeft = ulLeft == undefined ? 0 : ulLeft.ulLeft;
        if (ulLeft && ulLeft < 0) {
          ulLeft = ulLeft == undefined ? 0 : ulLeft + 20;
          if (ulLeft > 0) {
            ulLeft = 0;
          }
          $.fn.bartab.defaults["items"]["cib-nav-item_tab" + lid].ulLeft = ulLeft;
          $(".cib-nav-wrapper ul").css({
            left: ulLeft + "px"
          });
        }
      }
    },
    _moveLeftTab: function() {
      //console.log("_moveRightTab");
      var that = this;
      //获得最后一个tab的id
      var lid = $.fn.bartab.defaults.id - 1;
      if (lid >= 4) {
        var ulLeft = $.fn.bartab.defaults["items"]["cib-nav-item_tab" + lid];
        if (ulLeft !== undefined) {
          ulLeft = ulLeft.ulLeft;
          var tulLeft = ulLeft - 20;
          if (tulLeft > ulLeft) {
            tulLeft = ulLeft;
          }
          $.fn.bartab.defaults["items"]["cib-nav-item_tab" + lid].ulLeft = tulLeft;
          $(".cib-nav-wrapper ul").css({
            left: tulLeft + "px"
          });
        }
      }
    }


  }; // end BarTab prototype

  $.fn.bartab = function(option) {
    //console.log(option);
    return new BarTab(this, option);
  }

  $.fn.bartab.defaults = {
    backdrop: true,
    keyboard: true,
    show: true,
    barX: 4,
    id: 1,
    defaultIndex: "./index_load.html",
    items: {}
  }

  $.fn.bartab.Constructor = BarTab;



}(window.jQuery, window.document, window.top);