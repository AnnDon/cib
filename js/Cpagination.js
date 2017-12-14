/* 
 * Cpagination.js v1.0.0
 * ===========================================================
 * Copyright 2012 cib.com.cn, Zh.
 * Created by majy on 2017/11/29.
 *
 * =========================================================== */


! function($) {

  "use strict"; // jshint ;_;

  var Cpagination = function(element, options) {
    this.defaults = {
      url: 'http://172.16.22.1:8888/cib/login.html', //获取数据的url
      pageIndex: 1, //当前页数
      currPage: 1,
      total: 120, //数据总记录数
      pageTotal: 10, //总分页数
      pageSize: 10, //每页显示多少条数据
      onAfterLoadData: null, //当改变每页多少条数据后的回调函数
      _isGoEnable: false //判定跳转按钮是否可用
    };
    this.init('cpagination', element, options, this.defaults)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Cpagination.prototype = {

    constructor: Cpagination

    ,
    setContent: function() {

    }

    ,
    init: function(type, element, options, defaults) {
      var pagination = '<div class="cpagination">' +
        '<ul>' +
        '<li>每页</li>' +
        '<li>' +
        '<select class="select-page" name="pagination">' +
        '<option value="10">10</option>' +
        '<option value="20">20</option>' +
        '<option value="50">50</option>' +
        '<option value="100">100</option>' +
        '<option value="200">200</option>' +
        '</select>' +
        '</li>' +
        '<li>条，共<span class="cpage_showTotalCount">[total]</span>条记录</li>' +
        '<li style="width: 20px;"></li>' +
        '<li class="cbtn"><a class="cpage_goStartPage" href="#!">首页</a></li>' +
        '<li class="cbtn" style="padding:0;"><a style="padding:0 10px;" class="cpage_goPrevousPage" href="#!">&lt;</a></li>' +
        '<li class="cbtn">' +
        '<input class="cpage_gotoOtherPage" style="width: 40px;" type="text" name="cpage_gotoOtherPage" onfocus="this.select();" value="[pageIndex]" />' +
        '</li>' +
        '<li class="totalPages"><span style="font-size: 20px;margin-left: 8px;">/</span><span class="cpage_showTotalPages">[pageTotal]</span></li>' +
        '<li class="cbtn" style="padding:0;"><a class="cpage_goNextPage" style="padding:0 10px;" href="#!">&gt;</a></li>' +
        '<li class="cbtn"><a class="cpage_goEndPage" href="#!">尾页</a></li>' +
        '<li class="cbtn goPage"><a class="cpage_gotoOtherPage_btn" href="#!">跳转</a></li>' +
        '</ul>' +
        '</div>';
      this.$element = $(element);

      var option = $.extend(defaults, options);
      var reg = new RegExp("\\[([^\\]]*?)\\]", "igm");
      pagination = pagination.replace(reg, function(node, key) {
        return {
          pageTotal: option.pageTotal,
          total: option.total,
          pageIndex: option.pageIndex
        }[key]
      });
      $(element).append(pagination);

      this.$element.delegate('.select-page', "change", $.proxy(this.changePerPages, this));
      this.$element.delegate('.cpage_goStartPage', "click", $.proxy(this.goStartPage, this));
      this.$element.delegate('.cpage_goPrevousPage', "click", $.proxy(this.goPrevousPage, this));
      this.$element.delegate('.cpage_goNextPage', "click", $.proxy(this.goNextPage, this));
      this.$element.delegate('.cpage_goEndPage', "click", $.proxy(this.goEndPage, this));
      this.$element.delegate('.cpage_gotoOtherPage', "keyup", $.proxy(this.gotoOtherPage, this));
      this.$element.delegate('.cpage_gotoOtherPage', "focus", $.proxy(this.saveCurrPage, this));
      this.$element.delegate('.cpage_gotoOtherPage_btn', "click", $.proxy(this.goOtherPage, this));

    }

    ,
    changePerPages: function(e) { //改变每页的分页条数
      var $this = $(this);
      var _this = this;

      _this.defaults.pageIndex = 1;
      var pageSize = e.currentTarget.value;
      _this.defaults.pageSize = pageSize;
      _this.defaults.pageTotal = Math.ceil(_this.defaults.total / pageSize);
      //ajax加载数据
      this.loadData(_this.defaults.params, e);
      var callback = _this.defaults.onAfterLoadData;
      if (callback && callback instanceof Function) {
        callback(_this.defaults.data);
      }
      //改变显示的总页数
      $(e.currentTarget).parents(".cpagination").find(".cpage_showTotalPages").text(_this.defaults.pageTotal);
      //修改当前显示页为第一页
      $(e.currentTarget).parents(".cpagination").find(".cpage_gotoOtherPage").val(1);

    }

    ,
    goStartPage: function(e) { //点击首页按钮
      var $this = $(this);
      var _this = this;
      var pageIndex = _this.defaults.pageIndex;
      if (pageIndex == 1) { //如果本来就是首页，那么不查询
        return;
      }
      _this.defaults.pageIndex = 1;
      _this.defaults.currPage = 1;

      //设置显示当前页数
      $(e.currentTarget).parents(".cpagination").find(".cpage_gotoOtherPage").val(1);

      //ajax加载数据
      this.loadData(_this.defaults.params, e);
      //调用回调函数
      var callback = _this.defaults.onAfterLoadData;
      if (callback && callback instanceof Function) {
        callback(_this.defaults.data);
      }
    }

    ,
    goPrevousPage: function(e) { //点击上一页
      var $this = $(this);
      var _this = this;
      var pageIndex = _this.defaults.pageIndex;
      if (pageIndex == 1) { //如果本来就是首页，那么不查询
        return;
      } else {
        pageIndex = pageIndex - 1;
      }
      _this.defaults.pageIndex = pageIndex;
      _this.defaults.currPage = pageIndex;
      $(e.currentTarget).parents(".cpagination").find(".cpage_gotoOtherPage").val(pageIndex);
      //ajax加载数据
      this.loadData(_this.defaults.params, e);
      //调用回调函数
      var callback = _this.defaults.onAfterLoadData;
      if (callback && callback instanceof Function) {
        callback(_this.defaults.data);
      }

    }

    ,
    saveCurrPage: function(e) { // 保存当前的值，以便在用户输入错误数据时恢复
      var _this = this;
      var currPage = e.currentTarget.value;
      currPage = parseInt(currPage);
      _this.defaults.currPage = currPage;
    },
    gotoOtherPage: function(e) { //跳转到某一页
      var _this = this;
      var curr = e.currentTarget.value;
      var currPage = _this.defaults.currPage;
      if (!!$.isNumeric(curr)) {
        curr = parseInt(curr);
        if (curr > _this.defaults.pageTotal) {
          curr = _this.defaults.pageTotal;
        } else if (curr < 1) {
          curr = 1;
        }
        e.currentTarget.value = curr;
        if (curr == currPage) {
          _this.defaults._isGoEnable = false;
        } else {
          _this.defaults._isGoEnable = true;
        }
      } else {
        e.currentTarget.value = currPage;
      }
      //暂存输入框的值
      _this.defaults.userInputValue = parseInt(e.currentTarget.value);
    }

    ,
    goOtherPage: function(e) {
      var _this = this;
      if (_this.defaults._isGoEnable) {
        _this.defaults.pageIndex = _this.defaults.userInputValue;
        //ajax加载数据
        this.loadData(_this.defaults.params, e);
        //调用回调函数
        var callback = _this.defaults.onAfterLoadData;
        if (callback && callback instanceof Function) {
          callback(_this.defaults.data);
        }
      }
    }

    ,
    resetOptions: function(e) {
      var _this = this;
      _this.defaults._isGoEnable = false;
    }

    ,
    goNextPage: function(e) { //点击下一页
      var _this = this;
      var pageIndex = _this.defaults.pageIndex;
      var pageTotal = _this.defaults.pageTotal;
      if (pageIndex == pageTotal) { //如果本来就是最后一页，那么不查询
        return;
      } else {
        pageIndex = pageIndex + 1;
      }
      _this.defaults.pageIndex = pageIndex;
      _this.defaults.currPage = pageIndex;
      $(e.currentTarget).parents(".cpagination").find(".cpage_gotoOtherPage").val(pageIndex);
      $(this).parents("ul").find(".cpage_gotoOtherPage").val(pageIndex + 1);
      //ajax加载数据
      this.loadData(_this.defaults.params, e);
      //调用回调函数
      var callback = _this.defaults.onAfterLoadData;
      if (callback && callback instanceof Function) {
        callback(_this.defaults.data);
      }
    }

    ,
    goEndPage: function(e) { //点击最后一页
      var _this = this;
      var pageIndex = _this.defaults.pageIndex;
      var pageTotal = _this.defaults.pageTotal;
      if (pageIndex == pageTotal) { //如果本来就是末页，那么不查询
        return;
      }
      _this.defaults.pageIndex = pageTotal;
      _this.defaults.currPage = pageTotal;
      $(e.currentTarget).parents(".cpagination").find(".cpage_gotoOtherPage").val(pageTotal);
      //ajax加载数据
      this.loadData(_this.defaults.params, e);
      //调用回调函数
      var callback = _this.defaults.onAfterLoadData;
      if (callback && callback instanceof Function) {
        callback(_this.defaults.data);
      }
    }

    ,
    _refreshPageShowData: function(data, e) {
      var _this = this;
      _this.defaults.data = data;
      _this.defaults.total = data.total;
      var pageSize = _this.defaults.pageSize;
      _this.defaults.pageTotal = Math.ceil(data.total / pageSize);
      //改变显示的总页数
      $(e.currentTarget).parents(".cpagination").find(".cpage_showTotalPages").text(_this.defaults.pageTotal);
      $(e.currentTarget).parents(".cpagination").find(".cpage_showTotalCount").text(data.total);

    },
    _initLoadData: function(params) {

    },
    loadData: function(params, e) { //ajax加载数据
      var $this = this;
      var _this = this;
      this.resetOptions();
      var pageIndex = _this.defaults.pageIndex - 1;
      var pageSize = _this.defaults.pageSize;
      params = $.extend({}, params, {
        pageIndex: pageIndex,
        pageSize: pageSize
      });
      $.ajax({
        url: _this.defaults.url,
        data: params,
        type: "get",
        success: function(data) {
          // Unit test 这是测试的json数据，真实的需要改
          data = {
            total: 184,
            list: [{
              majy: "1"
            }, {
              majy: 2
            }]
          };
          if (data && typeof data == "string") {
            data = $.parseJSON(data);
          }
          $this._refreshPageShowData(data, e);
        },
        async: false
      });
    }
  };


  $.fn.cpagination = function(option) {
    return this.each(function() {
      var $this = $(this),
        data = $this.data('cpagination'),
        options = typeof option == 'object' && option;
      if (!data) $this.data('cpagination', (data = new Cpagination(this, options)))
      if (typeof option == 'string') data[option]()
    })
  };

  $.fn.cpagination.Constructor = Cpagination;

}(window.jQuery);