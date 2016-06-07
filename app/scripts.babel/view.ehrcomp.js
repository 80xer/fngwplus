const PAGINATE_SELECTOR = '#deptAttndListWapper_paginate'
const BODY_SELECTOR = '#content .go_body'
const QUERY_URL = 'http://gw.fnguide.com/api/ehr/attnd/company/record'

class EhrCompView {
	constructor() {
		this.target = [PAGINATE_SELECTOR, BODY_SELECTOR]
	}

	setView() {
		this._start()
	}

	_start() {
		this._createDeptBtn()
	}

	_createDeptBtn() {
    var deptFix = [
      '신사업TFT',
      '데이터팀',
      '리서치팀',
      '펀드평가팀',
      '금융솔루션팀',
      '데이터공학팀',
      '마케팅팀',
      '인덱스팀',
      '경영지원팀',
      '평가사업본부',
      '기관컨설팅팀',
      '금융전략팀'
    ]
    var url = window.location.href.split('?');
    if (url.length < 2) return;
    var querystring = window.location.href.split('?')[1].split('&searchtype')[0];
    querystring = querystring.replace('offset=30', 'offset=100');
    var url = QUERY_URL + '?' + querystring;
    var users;
    $.ajax({
      url: url,
      dataType: 'json'
    }).done(function (response) {
      users = response.data;
      var flags = [], dept = [], l = users.length, i;
      for( i=0; i<l; i++) {
        if( flags[users[i].deptName] || users[i].deptName.replace(/ /g,'') === '' || deptFix.indexOf(users[i].deptName) < 0) continue;
        flags[users[i].deptName] = true;
        dept.push(users[i].deptName);
      }
      dept.sort();
      $('#dept_btns').remove();
      var $div = $('<ul id="dept_btns" class="fngw_plus_btn_wrapper">');
      for (var i = 0; i < dept.length; i++) {
        $div.append('<li class="btn_tool_depts fngw_plus_btn">' + dept[i] + '</li>');
      }
      // $div.insertBefore('#deptAttndListWapper');
      $div.insertBefore('#content .content_page');

      $('li.btn_tool_depts').click(function(){
        var sTypeSelector, deptVal, sKeywordSelector, sBtnSelector;
        if ($('#attnd_tab>ul>li.on.first.daily').length > 0) {
          sTypeSelector = '#searchTypes';
          deptVal = 'deptName';
          sKeywordSelector = '#searchKeyword';
        } else {
          sTypeSelector = '#searchtype';
          deptVal = 'dept';
          sKeywordSelector = '#keyword';
        }
        sBtnSelector = '#searchBtn';
        $(sTypeSelector).val(deptVal);
        $(sKeywordSelector).val($(this).text());
        $(sBtnSelector)[0].click();
        setActiveFilter(sKeywordSelector);
      });

      function setActiveFilter(sKeywordSelector) {
        $('li.btn_tool_depts').removeClass('active');
        $('li.btn_tool_depts').filter(function() {
					return $(sKeywordSelector).val().indexOf($(this).text()) >= 0 ? true : false
				}).addClass('active');
      }

    }).fail(function (jqXHR, textStatus) {
      console.log( 'Request failed: ' + jqXHR + ', ' + textStatus );
    }).complete(function () {
    });
  }
}
