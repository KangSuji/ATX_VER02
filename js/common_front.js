(function (context, $, undefined) {
  "use strict";

  var APP_NAME = (window.APP_NAME = "dev");
  var core = context[APP_NAME] || (context[APP_NAME] = {});

  core.$win = $(window);
  core.$doc = $(document);
  core.$html = $(document.documentElement);
  core.$html.addClass("js");
  "ontouchstart" in context && core.$html.addClass("touch");
  "orientation" in context && core.$html.addClass("mobile");

  core.is = {};

  core.debug = (function () {})();

  core.observer = {
    handlers: {},
    on: function (eventName, fn, context) {
      var events = eventName.split(" ");
      for (var eIdx = 0; eIdx < events.length; eIdx++) {
        var handlerArray = this.handlers[events[eIdx]];
        if (undefined === handlerArray) {
          handlerArray = this.handlers[events[eIdx]] = [];
        }
        handlerArray.push({ fn: fn, context: context });
      }
    },
    off: function (eventName, fn, context) {},
    notify: function (eventName, data) {
      var handlerArray = this.handlers[eventName];
      if (undefined === handlerArray) return;

      for (var hIdx = 0; hIdx < handlerArray.length; hIdx++) {
        var currentHandler = handlerArray[hIdx];
        currentHandler["fn"].call(currentHandler["context"], {
          type: eventName,
          data: data,
        });
      }
    },
  };

  core.browser = (function () {
    var detect = {},
      win = context,
      na = win.navigator,
      ua = na.userAgent,
      lua = ua.toLowerCase(),
      match;

    detect.isMobile = typeof orientation !== "undefined";
    detect.isRetina =
      "devicePixelRatio" in window && window.devicePixelRatio > 1;
    detect.isAndroid = lua.indexOf("android") !== -1;
    detect.isOpera = win.opera && win.opera.buildNumber;
    detect.isWebKit = /WebKit/.test(ua);
    detect.isTouch = !!("ontouchstart" in window);

    match = /(msie) ([\w.]+)/.exec(lua) ||
      /(trident)(?:.*rv.?([\w.]+))?/.exec(lua) || ["", null, -1];
    detect.isIE = !detect.isWebKit && !detect.isOpera && match[1] !== null; //(/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName);
    detect.isIE6 = detect.isIE && /MSIE [56]/i.test(ua);
    detect.isIE7 = detect.isIE && /MSIE [567]/i.test(ua);
    detect.isOldIE = detect.isIE && /MSIE [5678]/i.test(ua);
    detect.ieVersion = parseInt(match[2], 10); // �ъ슜踰�: if (browser.isIE && browser.version > 8) { // 9�댁긽�� ie釉뚮씪�곗�

    detect.isWin = na.appVersion.indexOf("Win") != -1;
    detect.isMac = ua.indexOf("Mac") !== -1;
    detect.isLinux = na.appVersion.indexOf("Linux") != -1;

    detect.isChrome = ua.indexOf("Chrome") !== -1;
    detect.isGecko = ua.indexOf("Firefox") !== -1;
    detect.isAir = /adobeair/i.test(ua);
    detect.isIOS = /(iPad|iPhone)/.test(ua);
    detect.isSafari = !detect.isChrome && /Safari/.test(ua);
    detect.isIETri4 = detect.isIE && ua.indexOf("Trident/4.0") !== -1;

    detect.msPointer =
      na.msPointerEnabled && na.msMaxTouchPoints && !win.PointerEvent;
    detect.pointer =
      (win.PointerEvent && na.pointerEnabled && na.maxTouchPoints) ||
      detect.msPointer;

    detect.isNotSupporte3DTransform = /android 2/i.test(lua);
    detect.isGingerbread = /android 2.3/i.test(lua);
    detect.isIcecreamsandwith = /android 4.0/i.test(lua);
    detect.hash = window.location.hash;

    if (detect.isAndroid) {
      detect.androidVersion = (function (match) {
        if (match) {
          return match[1] | 0;
        } else {
          return 0;
        }
      })(lua.match(/android ([\w.]+)/));
    } else if (detect.isIOS) {
      detect.iosVersion = (function (match) {
        if (match) {
          return match[1] | 0;
        } else {
          return 0;
        }
      })(ua.match(/OS ([[0-9]+)/));
    }
    return detect;
  })();

  core.event = (function () {
    var _ = {
      init: function () {
        var e = {
          screen: "load scroll resize orientationchange",
          wheel: "wheel",
        };
        core.$doc.on("ready", this.ready);
        core.$win.on(e.screen, this.screen);
        //core.$win.on(e.wheel, this.wheel);
      },
      ready: function (e) {
        core.$body = $("body");
        core.observer.notify("READY");
        core.observer.notify("SCROLL", false);
        core.observer.notify("RESIZE", false);
      },
      screen: function (e) {
        var e = e.type.toUpperCase();
        core.observer.notify(e);
      },
      wheel: function (e) {},
    };
    _.init();
  })();

  core.screen = (function () {
    var me = {
      data: {
        width: core.$html[0].clientWidth,
        height: core.$html[0].clientHeight,
        scrollTop: core.$html[0].scrollTop,
      },
      init: function () {
        if (window.orientation > 0) {
          core.$html.addClass("landscape");
        } else {
          core.$html.removeClass("landscape");
        }
        core.observer.on(
          "READY LOAD RESIZE",
          $.proxy(this.detect.all, this.detect)
        );
        core.observer.on("SCROLL", this.detect.scroll);
        core.observer.on("ORIENTATIONCHANGE", this.detect.orientation);
      },
      detect: {
        all: function () {
          this.size();
          this.scroll();
        },
        size: function () {
          me.data.width = core.$html[0].clientWidth;
          me.data.height = core.$html[0].clientHeight;
        },
        scroll: function () {
          me.data.scrollTop = core.$html[0].scrollTop;
        },
        orientation: function () {
          if (window.orientation > 0) {
            core.$html.addClass("landscape");
          } else {
            core.$html.removeClass("landscape");
          }
        },
      },
    };
    me.init();
    return me.data;
  })();

  core.scroll = (function () {})();

  core.ui = function (name, container, option) {
    if (!core.ui[name]) throw new Error("not ui " + name);

    var $container = $(container),
      len = $container.length;
    if (len < 1) return false;

    var supr = [];
    $container.each(function (idx) {
      var $me = $(this);
      this.ui = this.ui || {};
      if ($me.parent("pre").length > 0 || this.ui[name]) return; //syntaxhighlighter exception
      this.ui[name] = true;

      supr[idx] = new core.ui[name](this, option);
      if (supr[idx].events) supr[idx].events._init();
    });
    if (len == 1) supr = supr[0];
    return supr;
  };

  core.Selector = function (container, selector) {
    function modeling() {
      for (var i in selector) {
        selectors[i] = selectors.container.find(selector[i]);
      }
    }
    var selectors = { container: $(container) };
    modeling();

    selectors._dataSet = selectors.container.data();
    selectors.reInit = function () {
      modeling();
    };
    return selectors;
  };
})(this, jQuery);
