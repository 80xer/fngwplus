const BTN_TEMPLATE = `<div class="fngw_plus_btn_wrapper" id="calendarViewDiv">
    <span id="btnCalendarView" class="fngw_plus_btn txt">캘린더 보기</span>
</div>`
const TOOL_BAR_SELECTOR = '#attndToolbar'
const LIST_SELECTOR = '#attndMyList'
const BTN_TOGGLE = '#btnCalendarView'

class EhrView {
	constructor() {
		this.$ehr = $(BTN_TEMPLATE)
		this.target = [TOOL_BAR_SELECTOR, LIST_SELECTOR]
		this.showing = false
		const $document = $(document)
		$document
			.on(EVENT.TOGGLE_CAL, () => {
				this.showing = !this.showing
			})
	}

	setView() {
		const that = this
		$('body').on('DOMNodeRemoved', '#content', function(){
			asyncDom('#attndMyList tbody tr', function() {
				that._start()
			})
		});

		this._start()
	}

	_start() {
		if ($('.calendar-table.toggleView').length <= 0) {
			var cal = this._createCalendar()
			cal.toggle()
		}
	}

	_createCalendar(){
    this.$ehr.appendTo(TOOL_BAR_SELECTOR)
    $('#attndMyList').addClass('toggleView');
    var cal = new CalendarView(this.showing);
    return cal;
  }
}

class CalendarView {
	constructor(showing) {
		this.showing = showing
		this.btn = BTN_TOGGLE;
		const that = this
    $(document).off('click', this.btn);
    $(document).on('click', this.btn, function() {
			that.toggle(true)
		});
    var curDate = $('.current_date .date').text().replace('.','');
    var year = parseInt(curDate.substring(0,4),10);
    var month = parseInt(curDate.substring(4,6),10) - 1;
    var cal = new Calendar(month, year);
    $('.calendar-table').remove();
    cal.generateHTML();
    $($.parseHTML(cal.getHTML())).appendTo('.content_page .go_body');
    var $calDays = $('td.calendar-day:not(:empty)');
    var inTime, outTime, workTime, state;
    $('#attndMyList tbody tr').each(function(idx, tr) {
			if (!$(tr).hasClass('holiday')) {
        inTime = $('<div class="intime' + $(tr).children().eq(1).attr('class') + '">' + $(tr).children().eq(1).text().trim() + '</div>');
        outTime = $('<div class="outtime">' + $(tr).children().eq(2).text().trim() + '</div>');
        workTime = $('<div class="worktime">' + ($(tr).children().eq(3).text().trim()||'-') + '</div>');
        state = $('<div class="state">' + ($(tr).children().eq(4).text().trim()||'-') + '</div>');
        $calDays.eq(idx).append(inTime).append(outTime).append(workTime).append(state);
      }
    })
	}

	toggle(event_flag) {
    this.showing = !this.showing;
		if(this.showing) {
      $('#attndMyList').hide();
      $('.calendar-table ').show();
      $('#btnCalendarView').text('리스트 보기');
    } else {
      $('#attndMyList').show();
      $('.calendar-table ').hide();
      $('#btnCalendarView').text('캘린더 보기');
    }
		if (event_flag) {
			$(document).trigger(EVENT.TOGGLE_CAL)
		}
	}
}
