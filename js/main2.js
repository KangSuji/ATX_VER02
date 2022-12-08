$(document).ready(function () {
  // 메인 이미지 호버
  $(".atx-box").each(function () {
    if ($(this).hasClass("advence")) {
      $(this).hover(function () {
        $(".color-wrap").toggleClass("sec02-bg01");
        $(this).toggleClass("on");
      });
    }
    if ($(this).hasClass("techenolgy")) {
      $(this).hover(function () {
        $(".color-wrap").toggleClass("sec02-bg02");
        $(this).toggleClass("on");
      });
    }
    if ($(this).hasClass("expert")) {
      $(this).hover(function () {
        $(".color-wrap").toggleClass("sec02-bg03");
        $(this).toggleClass("on");
      });
    }
  });

  var bannerSwiper = new Swiper(".top-banner-wrap .swiper-container", {
    speed: 1000,
    spaceBetween: 0,
    autoplay: false,
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
    effect: "fade",
  });

  $(".play-wrap button").on("click", function () {
    bannerSwiper.autoplay.stop();
  });
  //배너랑 충돌 나서 일단 풀페이지 막음
  // $("#fullpage").fullpage({
  //   //options here
  //   autoScrolling: true,
  //   navigation: true,
  //   navigationPosition: "right",
  //   sectionSelector: ".section",
  //   anchors: ["page01", "page02", "page03", "page04", "page05", "page06", "page07"],
  // });
});

(function ($, core, ui, undefined) {
  "use strict";
  ui.VISUAL = function () {
    var $$ = core.Selector(arguments[0], {
      visualItem: ".view> li",
      visualPrev: ".control .prev",
      visualNext: ".control .next",
      navCurrent: ".count .current",
      navCircle: ".circleSvg .circle",
      navPlay: ".circleSvg .play",
      infoText: ".info-wrap .text li",
    });

    var detect = {
      bgPos: [0, 5, 15, 35, 65, 85, 95],
      bgSpace: [5, 10, 20, 30, 20, 10, 5],
      bgCalc: {
        left: [],
        width: [],
      },
      duration: 6000,
      length: $$.visualItem.length,
      msg: [],
    };

    var events = (this.events = {
      _init: function () {
        this._set();

        $$.visualPrev.on("click", { dir: -1 }, $.proxy(this._detectSelector, this));
        $$.visualNext.on("click", { dir: 1 }, $.proxy(this._detectSelector, this));

        $$.navPlay.on("click", $.proxy(this.timer._check, this));
        core.observer.on("RESIZE", $.proxy(this._resize, this));
      },
      _set: function () {
        this._intro();
        this.timer._init();
        this._detectDevice();
        this._createBackgroundImage();
      },
      _intro: function () {
        var $a = $$.visualItem.first().find(".text-wrap").children();
        TweenMax.staggerFromTo($a, 0.7, { opacity: 0, y: 30 }, { delay: 0.5, opacity: 1, y: 0, ease: Back.easeOut }, 0.2);
      },
      _resize: function () {
        this._detectDevice();
      },
      _detectDevice: function () {
        if (core.screen.width < 768 || core.browser.isMobile) {
          detect.mobile = true;
          $$.container.addClass("mobile");
        } else {
          detect.mobile = false;
          $$.container.removeClass("mobile");
        }
      },
      _createBackgroundImage: function () {
        $$.visualItem.each(function () {
          var $me = $(this);
          var temp = '<div class="bg">';
          for (var i = 0; i < detect.bgPos.length; i++) {
            temp += "<div><span></span></div>";
          }
          temp += "</div>";
          $me.append(temp);
        });
      },
      _detectSelector: function (e) {
        e.preventDefault();
        if (detect.isAni) return;
        detect.isAni = true;
        detect.dir = e.data.dir;
        detect.$current = $$.visualItem.filter(".on");
        detect.$currentBg = detect.$current.find(".bg");
        detect.$currentSpan = detect.$currentBg.find("span");
        detect.tOrigin = detect.dir !== 1 ? "right" : "left";
        detect.nIdx = detect.$current.index() + detect.dir;
        if (detect.nIdx >= detect.length) detect.nIdx = 0;
        if (detect.nIdx < 0) detect.nIdx = detect.length - 1;

        detect.$next = $$.visualItem.eq(detect.nIdx);
        detect.$nextBg = detect.$next.find(".bg");
        detect.$nextLi = detect.$nextBg.children();
        detect.$nextSpan = detect.$nextLi.find("span");

        if (detect.dir !== 1) {
          detect.$currentSpan = $(detect.$currentSpan.get().reverse());
          detect.$nextBg.addClass("reverse");
        }
        if (!e.isTrigger || arguments[1]) {
          TweenMax.killTweensOf($$.navCircle);

          if (detect.isPlay) {
            TweenMax.to($$.navCircle, 1.3, {
              strokeDashoffset: -314,
              ease: Power2.easeOut,
            });
            events.timer._clear();
            events.timer._play();
          } else {
            TweenMax.fromTo($$.navCircle, 1.3, { strokeDashoffset: 314 }, { strokeDashoffset: -314, ease: Power2.easeOut });
            events.timer._clear();
          }
        }
        if (!detect.mobile) {
          this.animation._default();
        } else {
          this.animation._mobile();
        }
      },
      animation: {
        _default: function () {
          detect.$current.find(".bg").attr("data-dir", detect.tOrigin);

          TweenMax.staggerTo(detect.$current.find(".text-wrap").children(), 0.7, { opacity: 0 }, 0.2);

          TweenMax.set(detect.$next, { visibility: "visible", zIndex: 3 });
          $$.navCurrent.text(detect.nIdx + 1);
          events.animation._text();
          if (detect.isPlay) events.animation._circle(detect.duration / 1000 - 1.3);

          TweenMax.from(detect.$nextLi, 0.7, {
            opacity: 0,
            width: 0,
            ease: Power2.easeInOut,
            onComplete: function () {
              detect.$next.addClass("on").removeAttr("style");
              detect.$currentSpan.removeClass("animation").removeAttr("style");
              detect.$current.removeClass("on");
              detect.$nextBg.removeClass("reverse");
              detect.$nextLi.removeAttr("style");

              detect.isAni = false;
            },
          });
        },
        _mobile: function () {
          $$.navCurrent.text(detect.nIdx + 1);
          events.animation._text();

          if (detect.isPlay) {
            TweenMax.delayedCall(1.3, function () {
              events.animation._circle(detect.duration / 1000 - 1.3);
            });
          }

          TweenMax.fromTo(detect.$current, 1.3, { opacity: 1 }, { opacity: 0 });
          TweenMax.set(detect.$next, {
            opacity: 0,
            visibility: "visible",
            zIndex: 3,
          });
          TweenMax.to(detect.$next, 1.3, {
            opacity: 1,
            onComplete: function () {
              TweenMax.set(detect.$currentSpan, { opacity: 1, x: 0 });
              TweenMax.set(detect.$nextSpan, { opacity: 1, x: 0 });

              detect.$current.removeClass("on").removeAttr("style");
              detect.$next.addClass("on").removeAttr("style");
              detect.$nextBg.removeClass("reverse");

              detect.isAni = false;
            },
          });
        },
        _complete: function () {
          detect.isAni = false;
        },
        _text: function () {
          $$.infoText.removeClass("on").eq(detect.nIdx).addClass("on");
          TweenMax.staggerFromTo(detect.$next.find(".text-wrap").children(), 0.7, { opacity: 0, y: 30 }, { delay: 0.5, opacity: 1, y: 0, ease: Back.easeOut }, 0.2);
        },
        _circle: function (dur) {
          var _dur = dur || detect.duration / 1000;
          TweenMax.killTweensOf($$.navCircle);
          TweenMax.fromTo(
            $$.navCircle,
            _dur,
            { strokeDashoffset: 314 },
            {
              strokeDashoffset: 0,
              ease: Power0.easeNone,
              onComplete: function () {
                TweenMax.to($$.navCircle, 1.2, { strokeDashoffset: -314 });
              },
            }
          );
        },
      },
      timer: {
        _init: function () {
          events.animation._circle();
          this._play();
        },
        _check: function () {
          if (!detect.isPlay) {
            this.timer._init();
          } else {
            this.timer._destory();
          }
        },
        _play: function () {
          detect.isPlay = true;
          $$.navPlay.removeClass("pause");
          events.timer.vars = setInterval(function () {
            detect.isPlay = true;
            $$.navPlay.removeClass("pause");
            $$.visualNext.triggerHandler("click");
          }, detect.duration);
        },
        _clear: function () {
          detect.isPlay = false;
          $$.navPlay.addClass("pause");
          clearInterval(events.timer.vars);
        },
        _destory: function () {
          TweenMax.killTweensOf($$.navCircle);
          TweenMax.to($$.navCircle, 0.6, { strokeDashoffset: 314 });
          this._clear();
        },
      },
    });
  };

  core.observer.on("LOAD", function () {
    ui("VISUAL", ".visual-wrap");
  });
  window.core = core;
})(jQuery, window[APP_NAME], window[APP_NAME].ui);
$(window).on("load", function () {
  menu_height_setting();
  screen_nav_hover();
  menu_layout_setting();
});
$(window).on("resize", init_resize);
function init_resize() {
  menu_height_setting();
}

// GNB MENU HOVER
var gnb_sub_menu_height = 0;
var search_open = true;

function screen_nav_hover() {
  if (!is_mobile()) {
    $("#menu").hover(
      function () {
        TweenMax.killTweensOf($(".menu-container-bg"));

        TweenMax.to($(".menu-container-bg"), 0.3, {
          height: gnb_sub_menu_height,
          onStart: function () {
            TweenMax.set($(".menu-container-bg"), { autoAlpha: 1 });
            $("#menu ul.sub-menu").stop().slideDown(300);
          },
        });
        $("#header").addClass("open");
      },
      function () {
        TweenMax.killTweensOf($(".menu-container-bg"));

        TweenMax.to($(".menu-container-bg"), 0.3, {
          height: 0,
          onStart: function () {
            $("#menu ul.sub-menu").stop().slideUp(280);
          },
          onComplete: function () {
            TweenMax.set($(".menu-container-bg"), { autoAlpha: 0 });
          },
        });
        $("#header").removeClass("open");
      }
    );
  } else {
    $("#menu > li > a").on("click", function (event) {
      event.preventDefault();
      if (!$("#header").hasClass("open")) {
        TweenMax.killTweensOf($(".menu-container-bg"));

        TweenMax.to($(".menu-container-bg"), 0.3, {
          height: gnb_sub_menu_height,
          onStart: function () {
            TweenMax.set($(".menu-container-bg"), { autoAlpha: 1 });
            $("#menu ul.sub-menu").stop().slideDown(300);
          },
        });
        $("#header").addClass("open");
      } else {
        var thisHref = $(this).attr("href");
        location.href = thisHref;
      }
    });
  }
}
// GNB layout setting
function menu_layout_setting() {
  // add background markup (full menu)
  $(".header-inner").prepend('<span class="menu-container-bg"><span class="icn"></span></span>');

  // add small menu markup
  $("#menu > li").each(function () {
    var $this = $(this),
      $sub_menu = $this.find("> ul.sub-menu"),
      parent_id = "parent-" + $this.attr("id");

    // 1depth
    $("#small_menu").append($this.clone().find("> ul.sub-menu").remove().end());

    // 2depth
    if (!!$sub_menu.length) {
      var $sub_menu_li = '<li class="' + parent_id + '"></li>';
      var $sub_menu_clone = $sub_menu.clone();

      $("#small_depth_menu").append($sub_menu_li);
      $("." + parent_id).append($sub_menu_clone);
    }
  });
}

// GNB 2depth menu match height
function menu_height_setting() {
  var $sub_menu = $("#menu > li > ul.sub-menu");

  // clear
  gnb_sub_menu_height = 0;
  $sub_menu.height("auto");

  // sub menu height matching
  $sub_menu.each(function () {
    if ($(this).height() > gnb_sub_menu_height) {
      gnb_sub_menu_height = $(this).height();
    }
  });
  $sub_menu.height(gnb_sub_menu_height);
}

// SIMPLE MOBILE CHECK
function is_mobile() {
  return /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera);
}
function is_mobile_ios() {
  return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
}
$(document).ready(function () {
  var bannerSwiper = new Swiper(".top-banner-wrap .swiper-container", {
    speed: 1000,
    spaceBetween: 0,
    autoplay: {
      delay: 2000,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
    },
    effect: "fade",
  });

  $(".play-wrap button").on("click", function () {
    if ($(this).hasClass("play")) {
      $(this).removeClass("play");
      $(this).addClass("pause");
      bannerSwiper.autoplay.stop();
    } else {
      $(this).removeClass("pause");
      $(this).addClass("play");
      bannerSwiper.autoplay.start();
    }
  });
  $(".btn-scroll-down").click(function () {
    $("html, body").animate({ scrollTop: $(".page02").offset().top }, 500);
  });
});
