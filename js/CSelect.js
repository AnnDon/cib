/* ============================================================
 * bootstrap-dropdown.js v2.2.1
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


! function($) {

  "use strict"; // jshint ;_;


  /* DROPDOWN CLASS DEFINITION
   * ========================= */

  var toggle = '[data-toggle=cselect]',
    option = '[data-options=options] ul li a',
    CSelect = function(element) {
      var $el = $(element).on('click.cselect.data-api', this.toggle)
      $('html').on('click.cselect.data-api', function() {
        $el.parent().removeClass('open')
      })
    }

  CSelect.prototype = {

    constructor: CSelect

    ,
    toggle: function(e) {
      var $this = $(this),
        $parent, isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $this.hasClass('open')
      clearMenus()

      if (!isActive) {
        $this.toggleClass('open')
        $this.focus()
      }
      $(".self-select-dropdown").get(0).scrollTop = 0
      dropdown()
      return false
    }

    ,

    keydown: function(e) {
      var $this, $items, $active, $parent, isActive, index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) return $this.click()

      $items = $('[role=menu] li:not(.divider) a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index-- // up
        if (e.keyCode == 40 && index < $items.length - 1) index++ // down
          if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

    ,
    selected: function(e) {
      e.preventDefault();
      e.cancelBubble = true;
      var $this = $(this);
      $(this).parents(".self-select-wrapper").find(".self-select-input input:text").val($(this).text());
      $(this).parents(".self-select-wrapper").find(".self-select-input input:hidden").val($(this).data("value"));
    }

  }

  /*********************************************/
  function dropdown(e) {
    $(toggle).each(function() {
      if ($(this).hasClass("open")) {
        var a = $(".self-select-wrapper").get(0).offsetTop;
        var s = $(".self-select-dropdown").height() + a;
        if (s >= $(window).scrollTop() && s < ($(window).scrollTop() + $(window).height())) {
          $(".self-select-dropdown").css({
            "top": "30px"
          });
        } else {
          $(".self-select-dropdown").css({
            "top": -($(".self-select-dropdown").height() + 4) + "px"
          });
        }
      } else {
        $(this).removeClass("open");
      }
    })
  }

  function clearMenus() {
    $(toggle).each(function() {
      $(this).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target'),
      $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.cselect = function(option) {
    return this.each(function() {
      var $this = $(this),
        data = $this.data('cselect')
      if (!data) $this.data('cselect', (data = new CSelect(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.cselect.Constructor = CSelect


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.cselect.data-api touchstart.cselect.data-api', clearMenus)
    .on('click.cselect touchstart.cselect.data-api', '.cselect form', function(e) {
      e.stopPropagation()
    })
    .on('click.cselect.data-api touchstart.cselect.data-api', toggle, CSelect.prototype.toggle)
    .on('keydown.cselect.data-api touchstart.cselect.data-api', toggle + ', [role=menu]', CSelect.prototype.keydown)
    .on('click.cselect.data-api touchstart.cselect.data-api', option, CSelect.prototype.selected)

}(window.jQuery);