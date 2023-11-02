(function ($) {
  // multiple plugins can go here
  (function (pluginName) {
    var defaults = {
      step: $(window).width(),
      angle: 360 / 3,
    };
    $.fn[pluginName] = function (options) {
      options = $.extend(true, {}, defaults, options);

      return this.each(function () {
        var elem = this,
          $elem = $(elem),
          elemAngle = elem.style.webkitTransform,
          elemAngle = elemAngle ? parseInt(elemAngle.slice(7, -4)) : 0,
          $list = $('#' + options['listId']),
          currentListLeft = parseInt($list.css('left')),
          listChildrenSize = $list.children().size();

        // heres the guts of the plugin

        if (options['direction'] == 'right') {
          $elem.css({
            '-webkit-transform': 'rotate(' + (elemAngle - parseInt(options['angle'])) + 'deg)',
            '-webkit-transition': 'all 0.5s ease',
          });

          if (currentListLeft <= 0 - options['step'] * (listChildrenSize - 1)) {
            $list.css({
              left: 0,
            });
          } else {
            if ($(window).width() <= 540) {
              $list.css({
                left: currentListLeft - $(window).width(),
              });
            } else {
              $list.css({
                left: currentListLeft - 540,
              });
            }
          }
        }
      });
    };

    $.fn[pluginName].defaults = defaults;
  })('rotateList');
})(Zepto);

Zepto(function ($) {
  var data = [
    {
      wrapId: 'c0',
      animateIds: ['gwc', 'wp1', 'wp2', 'wp3', 'wp4'],
      animateClass: ['gwc-move', 'wp1-move', 'wp2-move', 'wp3-move', 'wp4-move'],
      done: false,
    },
    {
      wrapId: 'c1',
      animateIds: ['c1_1', 'c1_2', 'c1_3'],
      animateClass: ['c1_1-move', 'c1_2-move', 'c1_3-move'],
      done: false,
    },
    {
      wrapId: 'c2',
      animateIds: ['c2_p'],
      animateClass: ['_p-init'],
      done: false,
    },
    {
      wrapId: 'c3',
      animateIds: ['c7_p'],
      animateClass: ['_p-init'],
      done: false,
    },
    {
      wrapId: 'c4',
      animateIds: ['c8_p'],
      animateClass: ['_p-init'],
      done: false,
    },
    {
      wrapId: 'c5',
      animateIds: [],
      animateClass: [],
      done: false,
    },
  ];

  var $w = $(window),
    $loading = $('#loading'),
    $wrap = $('#wrap'),
    $scrollContent = $('#scrollContent'),
    $content = $('.content');

  var contentLength = $content.size();

  function initPage() {
    var wH = $w.height();

    if (wH > 960) {
      wH = 960;
    }

    $wrap.css({
      height: wH,
    });
    $scrollContent.css({
      height: wH * contentLength,
    });
    $content.css({
      height: wH,
    });
  }

  function resize() {
    initPage();
  }

  function windowLoad() {
    $('#loading').css({ display: 'none' });

    //首屏动画触发
    setTimeout(function () {
      onTouch.addClass('down');
    }, 600);
  }

  var onTouch = {
    startY: 0,
    startX: 0,
    pageIndex: 0,
    count: 0,
    currentTop: 0,
    ifGo: false,

    onStart: function (e) {
      this.startY = e.pageY;
      this.startX = e.pageX;
      this.currentTop = $scrollContent.css('top');
    },
    onMove: function (e) {
      event.preventDefault();
    },
    onEnd: function (e) {
      //横向判断
      var n = this.pageIndex;

      if (n == 4) {
        if ($('.c4-frame > div.c4-content1:nth-child(5) div.c4-text1').hasClass('fadeInRightBig')) {
          setTimeout(function () {
            $('#c4').addClass('animated fadeOut');
            $('#c5').addClass('animated fadeIn');
            $('#c5').css({
              position: 'absolute',
              top: '0px',
            });
          }, 700);
        }
      }
      //判断横向翻
      if (Math.abs(e.pageX - this.startX) >= Math.abs(e.pageY - this.startY)) {
        if (e.pageX - this.startX >= 0 && n == 2) {
          // (n >= 6 && n<= 11) ){
          // left go
          $('#c' + n + '_p').rotateList({
            listId: 'c' + n + '_list',
            direction: 'left',
          });
        } else {
          //right go
          $('#c' + n + '_p').rotateList({
            listId: 'c' + n + '_list',
            direction: 'right',
          });
        }

        return;
      }

      if (this.startY > e.pageY + 2) {
        this.goDown();
        this.go = true;
      } else if (this.startY < e.pageY - 2) {
        this.goUp();
        this.go = true;
      }
    },
    goDown: function () {
      this.contentScroll('down');
      console.log(this.getCurrentIndex());
      console.log(this.pageIndex);
    },
    goUp: function () {
      this.contentScroll('up');
    },
    contentScroll: function (flag) {
      var top = parseInt($scrollContent.css('-webkit-transform').split(',')[1]);

      if (flag == 'down' && Math.abs(top) < $w.height() * (contentLength - 1)) {
        $scrollContent.css({
          '-webkit-transform': 'translate3d(0px,' + (top - $w.height()) + 'px,0px);',
        });
        this.addClass('down');
      } else if (flag == 'up' && top < 0) {
        $scrollContent.css({
          '-webkit-transform': 'translate3d(0px,' + (top + $w.height()) + 'px,0px);',
        });
        this.addClass('up');
      }
    },
    addClass: function (flag) {
      // var index = this.getCurrentIndex();
      var index = this.pageIndex;
      var currentObj = data[index];
      //if (currentObj["done"]) {return;};
      if (!currentObj || currentObj['animateIds'].length < 1) {
        return;
      }

      for (var i = 0; i < currentObj['animateIds'].length; i++) {
        $('#' + currentObj['animateIds'][i]).addClass(currentObj['animateClass'][i]);
      }
      //currentObj["done"] = true;
      setTimeout(function () {
        onTouch.deleteClass(index, flag);
      }, 200);
    },
    deleteClass: function (index, flag) {
      var deleteNum = flag == 'down' ? index - 1 : index + 1;
      var deleteObj = data[deleteNum];
      if (!deleteObj || deleteObj['animateIds'].length < 1) {
        return;
      }
      for (var i = 0; i < deleteObj['animateIds'].length; i++) {
        $('#' + deleteObj['animateIds'][i]).removeClass(deleteObj['animateClass'][i]);
      }
    },
    getCurrentIndex: function () {
      var top = parseInt($scrollContent.css('-webkit-transform').split(',')[1]),
        currentIndex = parseInt(top / $w.height());
      return Math.abs(currentIndex);
    },
  };

  //6屏弹出框控制
  var c6_Window = {
    $c5: $('#c1'),
    init: function () {
      this.popup();
      this.close();
    },
    popup: function () {
      this.$c5.find('.popup').each(function (index) {
        var $t = $(this);
        $t.click(function () {
          c6_Window.$c5.find('.wrap').show();
          c6_Window.$c5.find('.wrap').find('.p').eq(index).show();
        });
      });
    },
    close: function () {
      this.$c5.find('.close').click(function () {
        c6_Window.$c5.find('.wrap').hide().find('.p').hide();
      });
    },
  };

  function shake() {
    var arena = document.getElementById('wrap');
    var parallax = new Parallax(arena, {
      calibrateX: false,
      calibrateY: true,
      invertX: false,
      invertY: false,
      scalarX: 40,
      scalarY: 40,
      frictionX: 0.1,
      frictionY: 0.1,
    });
  }

  (function () {
    var $c5 = $('#c1');

    initPage();
    window.onload = windowLoad;
    window.onscroll = scroll;
    window.onresize = resize;
    window.onorientationchange = resize;

    document.getElementById('wrap').addEventListener('touchstart', function (e) {
      e = e.changedTouches[0];
      onTouch.onStart(e);
    });

    document.getElementById('wrap').addEventListener('touchmove', function (e) {
      onTouch.onMove(e.changedTouches[0], e);
    });

    document.getElementById('wrap').addEventListener('touchend', function (e) {
      onTouch.onEnd(e.changedTouches[0]);
    });

    //shake();

    $c5.find('.popup').each(function (index) {
      var $t = $(this);
      $t.click(function () {
        $c5.find('.wrap').show().find('.p').hide().eq(index).show();
      });
    });
    $c5.find('.close').click(function () {
      $c5.find('.wrap').hide().find('.p').hide();
    });
  })();
});

function playPause() {
  var myVideo = document.querySelectorAll('audio')[0];
  if (myVideo.paused) {
    myVideo.play();
    $('.icon_audio').addClass('roll');
  } else {
    myVideo.pause();
    $('.icon_audio').removeClass('roll');
  }
}
