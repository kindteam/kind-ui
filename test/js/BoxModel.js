/*
 * @author: human.huang
 * @created date: 2015-04-07
 */

var BoxModel = (function () {

      var boxCount = 1;

      Pix.default = {

      };

      function Pix(dom)  {

            if (dom === undefined) {
                  throw new Error('Must have dom arguments.');
            }
            else if (typeof dom == 'string') {
                  dom = document.querySelector(dom);
                  if(!dom) {
                        throw new Error('Invalid dom selector');
                  }
            }
            else if(typeof dom == 'object' && dom.length) {
                  dom.forEach((function(oneDom) {
                        new Pix(oneDom);
                  }));
                  return ;
            }


            if (this.constructor != arguments.callee) {
                  return new Pix(arguments[0])
            }
            this.dom = dom;
            this.init();
            return this;
      };

      Pix.prototype.init = function () {

            this.currentTipBox = null;
            this.currentTipBoxClass = null;

            this._injectCommonStyle();

            this._initBoxModel();

            this._getDomOffset();

            return this;

      };
      Pix.prototype.showBox = function() {
            this.createMtTip();
            this.createPtTip();

            this.createMlTip();
            this.createPlTip();
      },
      Pix.prototype._injectCommonStyle = function () {

            var style = /\/\*([\s\S]*)\*\//mg.exec(this._commonStyle.toString())[1];
            this._addStyleSheet(style);
      };

      Pix.prototype._appendStyleToDom = function (dom, attrs) {
            attrs.forEach(function (item, i) {
                  item[0] = item[0].replace(/-(\w)/g, function (_, letter) {
                        return letter.toUpperCase()
                  });
                  dom.style[item[0]] = item[1];
            });
      };

      Pix.prototype._generateStyle = function (className, cssAttrs) {

            var cssStr = '.' + className + '{';
            cssAttrs.forEach(function (item) {
                  cssStr += item[0] + ':' + item[1] + ';';
            });
            cssStr += '}';

            this._addStyleSheet(cssStr);
      };
      Pix.prototype._commonStyle = function () {
            /*

             .kind-tip-box{
                   position: absolute;
             }

             .kind-tip-box-arrow-up{
                   position: absolute;
             }

             .kind-tip-box-arrow-line{
                   position: absolute;
                   background: red;
             }

             .kind-tip-box-arrow-down{
                   position: absolute;
             }

             .kind-tip-box-indicator-line{
                   display: block;
                   position: absolute;
                   background: red;
                   transform-origin: 0 0;
             }

             .kind-tip-box-text{
                   display: block;
                   font-size: 12px;
                   height: 12px;
                   position: absolute;
                   background: red;
                   color: #ffffff;
                   white-space: nowrap;
             }

             .kind-tip-box-indicator-line-arrow{
                   position: absolute;
             }

             */
      };
      Pix.prototype._boxStyleUpdown = function () {
            /*

             .{classPrefix}{
                   left: {boxLeft}px;
                   top: {boxTop}px;
                   height: {boxHeight}px;
                   width: {boxWidth}px;
                   border-top: 1px solid red;
                   border-bottom: 1px solid red;
             }
             .{classPrefix} .kind-tip-box-arrow-up{
                   top: {arrowUpTop}px;
                   left: {arrowUpLeft}px;
                   border-bottom: 4px solid red;
                   border-left: 4px solid transparent;
                   border-right: 4px solid transparent;
             }

             .{classPrefix} .kind-tip-box-arrow-line{
                   top: {arrowLineTop}px;
                   left: {arrowLineLeft}px;
                   height: {arrowLineHeight}px;
                   width: {arrowLineWidth}px;
             }

             .{classPrefix} .kind-tip-box-arrow-down{
                   bottom: {arrowDownBottom}px;
                   left: {arrowDownLeft}px;
                   border-top: 4px solid red;
                   border-left: 4px solid transparent;
                   border-right: 4px solid transparent;
             }

             .{classPrefix} .kind-tip-box-indicator-line{
                   left: {indicatorLineLeft}px;
                   top: {indicatorLineTop}px;
                   width: {indicatorLineWidth}px;
                   height: {indicatorLineHeight}px;
                   transform: {indicatorLineTransform};
             }

             .{classPrefix} .kind-tip-box-text{
                   left: {textLeft}px;
                   top: {textTop}px;
             }

             .{classPrefix} .kind-tip-box-indicator-line-arrow{
                   left: {indicatorLineArrowLeft}px;
                   top: {indicatorLineArrowTop}px;
                   border-left: 4px solid red;
                   border-top: 4px solid transparent;
                   border-bottom: 4px solid transparent;
                   transform-origin: 50% 0;
                   transform:{indicatorArrowTransform}
             }

             */
      };
      Pix.prototype._boxStyleLeftRight = function () {
            /*

             .{classPrefix}{
                   left: {boxLeft}px;
                   top: {boxTop}px;
                   height: {boxHeight}px;
                   width: {boxWidth}px;
                   border-left: 1px solid red;
                   border-right: 1px solid red;
             }
             .{classPrefix} .kind-tip-box-arrow-up{
                   top: {arrowUpTop}px;
                   left: {arrowUpLeft}px;

                   border-bottom: 4px solid transparent;
                   border-top: 4px solid transparent;
                   border-right: 4px solid red;
             }

             .{classPrefix} .kind-tip-box-arrow-line{
                   top: {arrowLineTop}px;
                   left: {arrowLineLeft}px;
                   height: {arrowLineHeight}px;
                   width: {arrowLineWidth}px;
             }

             .{classPrefix} .kind-tip-box-arrow-down{
                   left:auto;
                   top: {arrowDownTop}px;
                   right: {arrowDownRight}px;
                   border-bottom: 4px solid transparent;
                   border-top: 4px solid transparent;
                   border-left: 4px solid red;
             }

             .{classPrefix} .kind-tip-box-indicator-line{
             left: {indicatorLineLeft}px;
             top: {indicatorLineTop}px;
             width: {indicatorLineWidth}px;
             height: {indicatorLineHeight}px;
             transform: {indicatorLineTransform};
             }

             .{classPrefix} .kind-tip-box-text{
             left: {textLeft}px;
             top: {textTop}px;
             }

             .{classPrefix} .kind-tip-box-indicator-line-arrow{
             left: {indicatorLineArrowLeft}px;
             top: {indicatorLineArrowTop}px;
             border-top: 4px solid red;
             border-left: 4px solid transparent;
             border-right: 4px solid transparent;
             transform-origin: 50% 0;
             transform:{indicatorArrowTransform}
             }

             */
      }

      Pix.prototype._createTipBox = function (text) {

            var textPrefix = arguments.callee.caller.toString().match(/this\._createTipBox\(this\.(\w{2})/)[1];

            var CONF = {
                  mt:'margin-top',
                  ml:'margin-left',
                  pt:'padding-top',
                  pl:'padding-left'
            };
            textPrefix = CONF[textPrefix];

            var boxCountClass = this.currentTipBoxClass = 'kind-tip-box-' + boxCount++;
            var tipBox = this.currentTipBox = document.createElement('div');
            tipBox.className = 'kind-tip-box ' + boxCountClass;
            tipBox.innerHTML = [
                  '<div class="kind-tip-box-arrow-up"></div>',
                  '<div class="kind-tip-box-arrow-line"></div>',
                  '<div class="kind-tip-box-arrow-down"></div>',
                  '<div class="kind-tip-box-indicator-line"></div>',
                  '<div class="kind-tip-box-indicator-line-arrow"></div>',
                  '<div class="kind-tip-box-text">'+this.dom.nodeName + '|' +textPrefix +':'+text+'</div>'
            ].join('');

            document.body.appendChild(tipBox);
      };
      Pix.prototype.createMtTip = function () {

            if (this.mt == 0) {
                  return;
            }

            this._createTipBox(this.mt + 'px');

            var attrs = {
                  classPrefix:this.currentTipBoxClass,

                  boxLeft:this.left,
                  boxTop:this.top - this.mt,
                  boxWidth:10,
                  boxHeight:this.mt,

                  arrowUpTop:0,
                  arrowUpLeft:10 - 5 - 4,

                  arrowDownBottom:0,
                  arrowDownLeft:10 - 5 - 4,

                  arrowLineTop:0,
                  arrowLineLeft:5 ,
                  arrowLineHeight:this.mt,
                  arrowLineWidth:1,


                  indicatorLineLeft:10 /2,
                  indicatorLineTop:this.mt / 2,
                  indicatorLineWidth:40,
                  indicatorLineHeight:1,
                  indicatorLineTransform:'rotateZ(-30deg)',

                  indicatorLineArrowLeft:10 / 2 + Math.sqrt(3) / 2 * 40 - 4,
                  indicatorLineArrowTop:(this.mt / 2 - 20 - 4) ,
                  indicatorArrowTransform:'rotateZ(-30deg)',

                  textLeft:10 / 2 + Math.sqrt(3) / 2 * 40,
                  textTop:-(40 / 2 - this.mt / 2 + 12)

            };


            var boxStyle = /\/\*([\s\S]*)\*\//mg.exec(this._boxStyleUpdown.toString())[1];

            var boxStyled = boxStyle.replace(/{(\w+)}/gm, function(text, rText) {
                  return attrs[rText];
            });

            this._addStyleSheet(boxStyled);

      }

      Pix.prototype.createMlTip = function ()   {

            if (this.ml == 0) {
                  return;
            }

            this._createTipBox(this.ml + 'px');

            var attrs = {
                  classPrefix:this.currentTipBoxClass,

                  boxLeft:this.left - this.ml,
                  boxTop:this.top + this.dom.clientHeight - 10,
                  boxWidth:this.ml,
                  boxHeight:10,

                  arrowUpTop:5-4,
                  arrowUpLeft:0,

                  arrowDownTop:5-4,
                  arrowDownRight: 0,

                  arrowLineTop:5,
                  arrowLineLeft:0,
                  arrowLineHeight:1,
                  arrowLineWidth:this.ml,


                  indicatorLineLeft:this.ml /2,
                  indicatorLineTop:5,
                  indicatorLineWidth:1,
                  indicatorLineHeight:20,
                  indicatorLineTransform:'',

                  indicatorLineArrowLeft:this.ml/2 -4 ,
                  indicatorLineArrowTop: 20 + 4,
                  indicatorArrowTransform:'',

                  textLeft:this.mt / 2  - this.currentTipBox.querySelector('.kind-tip-box-text').clientWidth / 2,
                  textTop:20 + 5 + 2,

            };


            var boxStyle = /\/\*([\s\S]*)\*\//mg.exec(this._boxStyleLeftRight.toString())[1];

            var boxStyled = boxStyle.replace(/{(\w+)}/gm, function(text, rText) {
                  return attrs[rText];
            });

            this._addStyleSheet(boxStyled);

      }

      Pix.prototype.createPlTip = function () {

            if (this.pl == 0) {
                  return;
            }

            this._createTipBox(this.pl + 'px');

            var attrs = {
                  classPrefix:this.currentTipBoxClass,

                  boxLeft:this.left,
                  boxTop:this.top + this.dom.clientHeight - 10,
                  boxWidth:this.pl,
                  boxHeight:10,

                  arrowUpTop:5-4,
                  arrowUpLeft:0,

                  arrowDownTop:5-4,
                  arrowDownRight: 0,

                  arrowLineTop:5,
                  arrowLineLeft:0,
                  arrowLineHeight:1,
                  arrowLineWidth:this.pl,


                  indicatorLineLeft:this.pl /2,
                  indicatorLineTop:5,
                  indicatorLineWidth:40,
                  indicatorLineHeight:1,
                  indicatorLineTransform:'rotateZ(30deg)',

                  indicatorLineArrowLeft:this.pl / 2 + Math.sqrt(3) / 2 * 40 - 4,
                  indicatorLineArrowTop: 20 + 5,
                  indicatorArrowTransform:'rotateZ(-30deg)',

                  textLeft:this.pl / 2 + Math.sqrt(3) / 2 * 40 + 2,
                  textTop:20 + 5 + 2,

            };


            var boxStyle = /\/\*([\s\S]*)\*\//mg.exec(this._boxStyleLeftRight.toString())[1];

            var boxStyled = boxStyle.replace(/{(\w+)}/gm, function(text, rText) {
                  return attrs[rText];
            });

            this._addStyleSheet(boxStyled);

      }
      Pix.prototype.createPtTip = function () {

            if (this.pt == 0) {
                  return;
            }

            this._createTipBox(this.pt + 'px');

            var attrs = {
                  classPrefix:this.currentTipBoxClass,

                  boxLeft:this.left,
                  boxTop:this.top,
                  boxWidth:10,
                  boxHeight:this.pt,

                  arrowUpTop:0,
                  arrowUpLeft:10 - 5 - 4,

                  arrowDownBottom:0,
                  arrowDownLeft:10 - 5 - 4,

                  arrowLineTop:0,
                  arrowLineLeft:5 ,
                  arrowLineHeight:this.pt,
                  arrowLineWidth:1,


                  indicatorLineLeft:10 /2,
                  indicatorLineTop:this.pt /2,
                  indicatorLineWidth:40,
                  indicatorLineHeight:1,
                  indicatorLineTransform:'',

                  indicatorLineArrowLeft:40+4,
                  indicatorLineArrowTop:this.pt / 2 - 4,
                  indicatorArrowTransform:'',

                  textLeft:40+4+4,
                  textTop:this.pt / 2 - 6,

            };


            var boxStyle = /\/\*([\s\S]*)\*\//mg.exec(this._boxStyleUpdown.toString())[1];

            var boxStyled = boxStyle.replace(/{(\w+)}/gm, function(text, rText) {
                  return attrs[rText];
            });

            this._addStyleSheet(boxStyled);

      };

      Pix.prototype._addStyleSheet = function (styleStyle) {
            var style = document.createElement('style');
            style.innerHTML = styleStyle;
            //IE hack cssText;
            document.head.appendChild(style);
      };

      Pix.prototype._initBoxModel = function () {
            var self = this;
            var boxes = [
                  ['mt', 'marginTop'],
                  ['mb', 'marginBottom'],
                  ['ml', 'marginLeft'],
                  ['mr', 'marginRight'],

                  ['pt', 'paddingTop'],
                  ['pb', 'paddingBottom'],
                  ['pl', 'paddingLeft'],
                  ['pr', 'paddingRight']

            ];

            boxes.forEach(function (item, i) {
                  self[item[0]] = self._getStyle(item[1]);
            });

      };
      Pix.prototype._getDomOffset = function () {
            var rect = this.dom.getBoundingClientRect(),
                  docOffset = this._getDocOffset();
            this.top = rect.top + docOffset.top,
                  this.left = rect.left + docOffset.left;

      };
      Pix.prototype._getDocOffset = function () {
            return {
                  left: document.documentElement.scrollLeft || document.body.scrollLeft,
                  top: document.documentElement.scrollTop || document.body.scrollTop
            }
      };
      Pix.prototype._getStyle = function (styleName) {
            var styleValue = getComputedStyle(this.dom, null)[styleName];
            if (styleValue == null) {
                  return null;
            }
            return parseFloat(styleValue);
      };

      return Pix;
})();
