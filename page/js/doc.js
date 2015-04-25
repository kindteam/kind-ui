function convert2Hex(rgb) {
      if (~rgb.indexOf('#')) {
            return rgb;
      }
      var rgbArr = rgb.match(/\d+/g);
      return '#' + convert(rgbArr[0]) + convert(rgbArr[1]) + convert(rgbArr[2]);

      function convert(d) {
            var hex = parseInt(d).toString(16);
            if (hex.length == 1) {
                  return '0' + hex;
            }
            return hex;
      }
}

Array.prototype.unique = function()
{
      var n = [];
      for(var i = 0; i < this.length; i++)
      {
            if (n.indexOf(this[i]) == -1) n.push(this[i]);
      }
      return n;
}

function parseTable(conf) {

      var head = renderTableHead(conf.headCols), subTitle = '';


      if (conf.title) {
            if (conf.subTitle) {
                  subTitle = '<span class="ft-gray ft-14 ml10">' + conf.subTitle + '</span>'
            }
            head = '<h3 class="table-title">' + conf.title + subTitle + '</h3>' + head;
      }

      var body = renderTableBody(conf.body);

      var table = renderTable(head, body);

      var $table = $(table);

      if (conf.onRendered) {
            conf.onRendered($table);
      }

      return $(table);
      function renderTableHead(arr) {
            var head = '<thead><tr>';

            $.each(arr, function (_, item) {
                  head += '<th>' + item.text + '</th>';
            });
            head += '</tr></thead>';

            return head;
      }


      function renderTableBody(arr) {
            var body = '<tbody>';

            $.each(arr, function (_, itemTR) {

                  var tr = '<tr>';
                  $.each(itemTR, function (_, itemTD) {

                        var classFrag = '', styleFrag = '', attrsFrag = '';

                        itemTD.text = itemTD.text || '';


                        if (typeof itemTD.text == 'function') {
                              var funContent = itemTD.text.toString().match(/\/\*([\s\S]+)\*\//)[1], convertedContent;

                              //处理空格缩进的问题

                              funContent =  funContent.replace(/\n{2,}/mg, '\n');

                              var matchSpaceArr = funContent.match(/\n\s+/mg);
                              var spaceCountObj = {}, spaceCountArr = [];
                              $.each(matchSpaceArr, function(_, s) {
                                    //if(spaceCountArr.indexOf(s.length) == -1) {
                                    if($.inArray(s.length, spaceCountArr) == -1) {

                                        spaceCountArr.push(s.length);
                                    }
                                    spaceCountArr.sort();
                                    spaceCountObj[s.length] = '';
                              });

                              var spaceTabIndex = '  ';
                              $.each(spaceCountArr, function(_, spacelen) {
                                    spaceCountObj[spacelen] = spaceTabIndex;
                                    spaceTabIndex += '  ';
                              });

                              convertedContent = funContent.replace(/(\n\s{2,})/mg, function (_, space) {
                                    return '\n' + spaceCountObj[space.length];
                              });
                              console.log(convertedContent);
                              itemTD.text = convertedContent;
                        }

                        if (itemTD.className) {
                              classFrag = ' class="' + itemTD.className + '" ';
                        }

                        if (itemTD.style) {
                              styleFrag = ' style="';
                              for (var cssKey in itemTD.style) {
                                    styleFrag += cssKey + ':' + itemTD.style[cssKey] + ';';
                              }
                              styleFrag += ' "';
                        }
                        if (itemTD.attrs) {
                              for (var attr in itemTD.attrs) {
                                    attrsFrag += ' ' + attr + '=' + "\"" + itemTD.attrs[attr] + "\" ";
                              }
                        }

                        if (itemTD.strip === false) {
                              var textConvert = itemTD.text;
                        }
                        else {
                              var textConvert = $('<div>').text(itemTD.text).html();
                              console.log(textConvert)
                        }


                        if (itemTD.strong) {
                              if ($.type(itemTD.strong) == 'array') {
                                    $.each(itemTD.strong, function (_, s) {

                                          if (itemTD.strongReg === false) {
                                                var sReg = s;
                                                textConvert = textConvert.replace(sReg, '<span class="ft-orange">' + s + '</span>');
                                          }
                                          else {
                                                if (Object.prototype.toString.call(s) == '[object Array]') {
                                                      var sReg = new RegExp(s[0], 'igm');
                                                      textConvert = textConvert.replace(sReg, '<span class="ft-orange">' + s[1] + '</span>');
                                                }
                                                else if (typeof s == 'string') {
                                                      var sReg = new RegExp(s, 'igm');
                                                      textConvert = textConvert.replace(sReg, '<span class="ft-orange">' + s + '</span>');
                                                }
                                                else {
                                                      throw new Error('Strong type Error');
                                                }
                                          }
                                    })
                              }
                              else if (typeof itemTD.strong == 'string') {
                                    textConvert = textConvert.replace(itemTD.strong, '<span class="ft-orange">' + itemTD.strong + '</span>');
                              }
                        }


                        if (itemTD.code === true) {
                              textConvert = '<pre>' + textConvert + '</pre>';
                        }

                        tr += '<td ' + classFrag + styleFrag + attrsFrag + '>' + textConvert + '</td>';
                  });
                  tr += '</tr>';

                  body += tr;
            });

            body += '</tbody>';
            return body;
      }

      function renderTable(head, body) {
            return '<table>' + head + body + '</table>';
      }

}