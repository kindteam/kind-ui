/*
 * @author: human huang
 * @email:  halfthink@163.com
 * @created date: 2015-04-08
 */

var Dialog = (function ($, window, undefined) {
      var DiaLogID = 1;

      var InnerUse = function () {
      };

      var Panel = createClass(InnerUse);


      //Action
      Panel.defaults = {
            trigger: null,
            //element: null,

            //Action
            hasMask: true,
            hasEffect: true,
            fixed: true,
            isLock: false,
            quickClose: true,
            timeClose: 0,

            _timeCloseTimer: null,
            _isShow: false,
            //Callback
            onClose: function () {
            }
      };

      //UI
      $.extend(Panel.defaults, {
            title: null,
            content: null,

            width: 500,
            height: 200,
            classPrefix: 'kind-',
            DialogTPL: [
                  '<div class="{classPrefix}dialog {classPrefix}dialog-'+ DiaLogID +'">',
                  '<a class="{classPrefix}dialog-close">{closeTPL}</a>',
                  '<div class="{classPrefix}dialog-container">',
                  '<div class="{classPrefix}dialog-title">{title}</div>',
                  '<div class="{classPrefix}dialog-content">{content}</div>',
                  '</div>',
                  '</div>'
            ].join(''),
            closeTPL: '×',
            zIndex:999
      });

      // Output Interface
      $.extend(Panel.prototype, {

            hide: function () {
                  this.hidePanel();
            },
            show: function () {
                  this.showPanel();
            },
            set: function (attr, value) {
                  if (typeof attr == 'object') {
                        for (var i in attr) {
                              this[i] = attr[i];
                        }
                  }
                  else {
                        this[attr] = value;

                  }
                  return this;
            },
            resize: function() {
                  console.log('resize');
                  var winRect = this.getWinRect();
                  this.box.css({
                     left:winRect.width / 2- this.width / 2,
                     top:winRect.height / 2- this.height / 2
                  });
            },
            destroy: function() {
                  //$( this.trigger ).off();
            }

      });

      //init
      $.extend(InnerUse.prototype, {
            _init: function (opt) {

                  $.extend(this, Panel.defaults, opt);

                  this.parseElement();
                  this.bindEvent();
                  DiaLogID++;

                  this.trigger[0].kindDialog = this;
            },
            parseElement: function () {
                  this.trigger = $(this.trigger);
            }
      });


      //event
      $.extend(InnerUse.prototype, {
            bindEvent: function () {
                  //delay delegate event
                  this.trigger.click($.proxy(this.triggerClick, this));
            },
            triggerClick: function (e) {

                  if (this.trigger.data('kind-dialog-created') == 'true') {
                        this.showPanel();
                        return;
                  }

                  this.renderPanel();

                  //showPanel的时候处理事件
                  this.showPanel();

            },
            onCloseClick: function (e) {
                  this.hidePanel();
            },
            onDocClick: function (e) {
                  console.log('onDocClick');
                  if(this._isShow == false) {
                        return ;
                  }

                  var $target = $(e.target),
                        className = $target[0].className,
                        nodeName = $target[0].nodeName;

                  if (className.indexOf('kind-dialog-mask') != -1 || nodeName == 'HTML' || nodeName == 'BODY') {
                        // mask
                        this.hidePanel();
                  }
                  else if (className.indexOf('kind-dialog') != -1) {

                  }
            },
            onDocKeyup: function (e) {
                  //esc
                  if (e.keyCode == 27) {
                        this.hidePanel();
                  }
            }
      });

      //UI
      $.extend(InnerUse.prototype, {
            addBox: function () {

                  var docRect = this.getWinRect();

                  var injectObj = {
                        title: this.title,
                        content: this.content,
                        closeTPL: this.closeTPL,
                        classPrefix:this.classPrefix
                  };

                  var renderedDialogFrag = this.DialogTPL.replace(/{(\w+)}/mg, function (_, word) {
                        return injectObj[word];
                  });

                  this.box = $(renderedDialogFrag)
                        .css({
                              position: 'fixed',
                              top: docRect.height / 2 - this.height / 2,
                              left: docRect.width / 2 - this.width / 2,
                              width: this.width,
                              height: this.height,
                              zIndex:this.zIndex + 1
                        })
                        .hide().appendTo(document.body);

                  //no Title
                  if( !this.title) {
                        this.box.find('.' + this.classPrefix + 'dialog-title').remove();
                  }

                  return this;
            },

            addMask: function () {
                  var $maskOrigin = $('.' + this.classPrefix + 'dialog-mask');
                  if($maskOrigin[0]) {
                        this.mask = $maskOrigin;
                        return this;
                  }

                  this.mask = $('<div>')
                        .addClass(this.classPrefix + 'dialog-mask')
                        .css({
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: '#000',
                              opacity: '0.2',
                              zIndex: this.zIndex
                        })
                        .hide()
                        .appendTo('body');
                  return this;
            },

            renderPanel: function (e) {
                  this.addMask();
                  this.addBox();
                  this.trigger.data('kind-dialog-created', 'true');
            },

            showPanel: function () {

                  //timer close
                  if (this.timeClose) {
                        this._timeCloseTimer = setTimeout($.proxy(this.hidePanel, this), this.timeClose * 1000);
                  }

                  //close
                  if (this.quickClose) {
                        $(document).on('click.kDialog', $.proxy(this.onDocClick, this));
                  }
                  //close
                  $(document).on('keyup.kDialog', $.proxy(this.onDocKeyup, this));

                  //close
                  this.closeButton = $(this.box).find('.kind-dialog-close').on('click.kDialog', $.proxy(this.onCloseClick, this));

                  //resize
                  $(window).on('resize.kDialog', $.proxy(this.resize, this));

                  // lock scroll
                  if (this.isLock) {
                        $(window).on('mousewheel.kDialog DOMMouseScroll.kDialog', function (e) {
                              e.preventDefault();
                        });
                  }

                  this.showMask();
                  this.showBox();

            },

            hidePanel: function () {
                  var onCloseResult;
                  if (this.onClose) {
                        onCloseResult = this.onClose();
                  }
                  if (onCloseResult === false) {
                        return;
                  }

                  // cancel lock scroll
                  if (this.isLock) {
                        $(window).off('.kDialog');
                  }
                  // off Event
                  $(document).off('.kDialog');
                  $(this.box).off('.kDialog');
                  $(this.closeButton).off('.kDialog');


                  this.hideBox();
                  this.hideMask();
            },


            showMask: function () {
                  if (this.hasMask) {
                        this.mask.show();
                  }
            },
            hideMask: function () {
                  if (this.hasMask) {
                        this.mask.hide();
                  }
            },

            showBox: function () {

                  this._isShow = true;

                  if (this.hasEffect) {
                        this.box.fadeIn('fast');
                  }
                  else {
                        this.box.show();
                  }
            },
            hideBox: function () {
                  this._isShow = false;
                  this.box.hide();
            }

      });


      //util
      $.extend(InnerUse.prototype, {
            getWinRect: function () {
                  return {
                        width: $(window).width(),
                        height: $(window).height()
                  };
            },
            getDocRect: function () {
                  return {
                        width: $(document).width(),
                        height: $(document).height()
                  };
            }
      });

      function createClass(Father) {
            function F() {
            }

            function Sub() {
                  if (this.superClass['_init']) {
                        this.superClass._init.apply(this, arguments);
                  }

                  if (this['_init'] && this.hasOwnProperty('_init')) {
                        this._init.apply(this, arguments);
                  }
            }

            F.prototype = Father.prototype;
            Sub.prototype = new F;
            Sub.prototype.constructor = Sub;
            Sub.prototype.superClass = Father.prototype;
            return Sub;
      }

      return Panel;

})(jQuery, window);