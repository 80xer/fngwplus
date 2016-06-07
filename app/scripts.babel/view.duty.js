const DUTY_WEB_URL = 'https://docs.google.com/spreadsheets/d/1-abxTWAXe3ncueigz-b9wHCNl32ayNmsBR9Wn-I3aSo/pubhtml'
// const DUTY_WEB_URL = 'https://docs.google.com/spreadsheets/d/1EeC7Ze8k9RKbusCybS3Q7bUa9PIOP1YCjG4F0bWAkws/pubhtml'
const BIG_TODAY_TEMPLATE = '<div class="dutyWrap go-gadget go-gadget-99999 bigtoday">오늘당직</div>'
const CUR_DATE_SELECTOR = '.current_time_wrap .date'
const WEEK_DAY_NAME = [
	'일', '월', '화', '수', '목', '금', '토'
]

class DutyView {
	constructor() {
		this.$duty = $(BIG_TODAY_TEMPLATE)
		this.target = CUR_DATE_SELECTOR
	}

	_checkPast(dt1, dt2) {
    if (dt1.getFullYear() > dt2.getFullYear()) {
      return false;
    } else if (dt1.getFullYear() < dt2.getFullYear()) {
      return true;
    } else if (dt1.getMonth() > dt2.getMonth()) {
      return false;
    } else {
      return true;
    }
  }

	_getDayName(date) {
    return WEEK_DAY_NAME[date.getDay()];
  }

  _daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
  }

  _workdays( d1, d2 ) {
    var result = 0;
    var d0 = new Date();
    var f = 1;
		var dow
    if ((typeof(d1) == typeof(d2)) && (typeof(d1) == typeof(d0))) {
      if (d2 < d1) {
        d0 = d2;
        d2 = d1;
        d1 = d0;
        f = -1;
      }
      for (var d = d1; d < d2; d.setDate(d.getDate() + 1)) {
        dow = d.getDay();
        if ((dow > 0) && (dow < 6)) {
          result++;
        }
      }
    }
    return result * f
  }

	getDutyDate() {
		const that = this
		$.ajax({
      url: DUTY_WEB_URL
	  }).done(function(data){
      var $dutyDoc = $($.parseHTML(data));
			asyncDom('.profile .info .name', function() {
				that.checkDutyName($dutyDoc);
			})
		})
	}

	checkDutyName($dutyDoc) {
    var date = [];
    var d = new Date();
		const that = this
    $('ul#sheet-menu li', $dutyDoc).each(function(idx, li) {
			var numberPattern = /[\d\.]+/g;
	    var dateMatch = li.textContent.match( numberPattern );
	    var yy = dateMatch[0].split('.')[0];
	    var mm = parseInt(dateMatch[0].split('.')[1], 10) - 1;
	    var dt = new Date(yy,mm,1);
	    if (that._checkPast(d, dt)) {
				var sheetId = $(li).attr('id').replace('sheet-button-','');
        var userName = $('.profile .info .name').text();
        var $findName = $('div#' + sheetId + ' tr:nth-child(n+15) td:nth-child(n+8):contains("' + userName + '")', $dutyDoc);

				if ($findName.length <= 0) return;

        for (var i = 0; i < $findName.length; i++) {
          var $nameCell = $($findName[i]);
          if ($nameCell.prev().prev().text().trim().length >= 8){
            date.push($nameCell.prev().prev().text().trim().replace(/ /g,''));
          } else {
            date.push($nameCell.prev().prev().prev().text().trim().replace(/ /g,''));
          }
        }
      }
    });

		this.setDutyDate(date)
	}

	setDutyDate(date) {
		var curDate = $('.current_time_wrap .date').text().split(' ');
    var curYear = curDate[0].match(/\d+/)[0];
    var curMonth = curDate[1].match(/\d+/)[0];
    var curDay = curDate[2].match(/\d+/)[0];
    var cDate = new Date(curYear, curMonth-1, curDay);

    for (var i = 0; i < date.length; i++) {
      var dutyDate = date[i].split('.');
      var dutyYear = dutyDate[0].match(/\d+/)[0];
      var dutyMonth = dutyDate[1].match(/\d+/)[0];
      var dutyDay = dutyDate[2].match(/\d+/)[0];
      var dDate = new Date(dutyYear, dutyMonth-1, dutyDay);
      var diffDate = this._daydiff(cDate, dDate);
      var diffWorkDate = this._workdays(cDate, dDate);
      var dutyNotice = dutyYear + '년 ' + dutyMonth + '월 ' + dutyDay + '일 ' + this._getDayName(dDate) + ' 당직';
      var colorClass = '';
      var termBlink = 500;
      var dayNotice = '';

      if (diffDate < 0) {
        colorClass = 'past';
      } else if (diffDate === 0){
        dayNotice = '오늘 ';
        colorClass = 'today';
      } else if (diffDate === 1) {
        dayNotice = '내일 ';
        colorClass = 'tomorrow';
      }

      var $dutyDiv = $('<div class="dutyWrap ' + colorClass + '"><span class="dayNotice">' + dayNotice + '</span><span class="dutyNotice">' + dutyNotice + '</span></div>');
      $dutyDiv.insertAfter('.current_time_wrap');
			if (diffDate === 0 ) {
				this.$duty.insertBefore('.go-gadget.go-gadget-26');
				(function blink() {
            $('.dutyWrap.today .dayNotice').fadeOut(termBlink).fadeIn(termBlink, blink);
        })();
    	}
		}
	}

	setView() {
		this.getDutyDate()
	}
}
