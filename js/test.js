/*---------------------
header js
-----------------------*/
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

/*swiper*/
