const TASK_CONTENT_SELECTOR = '#content .content_top>div'
const BTN_WBS_TEMPLATE = '<div class="toggleWbs fngw_plus_btn_wrapper"><span class="fngw_plus_btn wbs_show">WBS 보기</span></div>'
const WBS_URL = 'https://docs.google.com/spreadsheets/d/1CkyanuO1itSFlM4xwzZl2kOks9CdgD82_44oehk2Ue8/edit?usp=sharing'
const CATE = [
	'기획',
	'개발',
	'디자인',
	'퍼블리싱',
	'공통'
]

class AllNewFnguide {
	constructor() {
		this.target = TASK_CONTENT_SELECTOR
		this.showWBS = false
		this.first = true
	}

	stop() {
		clearInterval(this.checkBtn);
		this.first = true
	}

	setView() {
		const that = this
		this._createBtnWBS()
		this._createBtnFilters()

		if (this.first) {
			this.first = false
			this.checkBtn = setInterval (detectBtnRemove, 200)
		}

		function detectBtnRemove() {
			if ($('span.fngw_plus_btn.wbs_show').length <= 0) {
				that.setView()
			}
		}
	}

	_createBtnWBS() {
		const that = this
		$('.toggleWbs').remove();
    var $btnToggleWbs = $(BTN_WBS_TEMPLATE);
    $btnToggleWbs.appendTo('#content .content_top');
    $btnToggleWbs.click(function() {
        that._toggleWbs();
    });
	}

	_toggleWbs() {
		if (this.showWBS) {
      $('#content .content_page').show();
      $('.wbsWrap').hide();
      $('.toggleWbs .fngw_plus_btn').text('WBS 보기');
    } else {
		  this._insertWBS();
      $('#content .content_page').hide();
      $('.wbsWrap').show();
      $('.toggleWbs .fngw_plus_btn').text('업무 보기');
    }
    this.showWBS = !this.showWBS;
	}

	_insertWBS() {
    if ($('.wbsWrap').length > 0) {
      return;
    }
    var $wbsWrap = $('<div class="wbsWrap"></div>');
    $wbsWrap.hide();
    var $wbsIfram = $('<iframe src="' + WBS_URL + '" width="100%" height="' + ($(window).height() - $('header.go_header').height() - $('header.content_top').outerHeight() - 20) + 'px"></iframe>');
    $wbsWrap.append($wbsIfram).appendTo('#160.go_renew');
  }

	_createBtnFilters() {
        var $btnWrap = $('<div class="filters task fngw_plus_btn_wrapper"></div>');
        $btnWrap.append('<span class="fngw_plus_btn all active">전체</span>');

				for (var i = 0; i < CATE.length; i++) {
					$btnWrap.append('<span class="fngw_plus_btn" data-cate="[' + CATE[i]+ ']">' + CATE[i] + '</span>');
				}

				$btnWrap.appendTo('.critical.custom_header');

        $('.filters.fngw_plus_btn_wrapper .fngw_plus_btn').not('.all').on('click', function() {
            var filterString = $(this).text();
            $('#searchTypes').val('TITLE');
            $('#searchKeyword').val($(this).data('cate'));
            $('#searchBtn').click();
            setActiveFilter();
        });

        $('.filters.fngw_plus_btn_wrapper .fngw_plus_btn.all').on('click', function() {
            $('#sideFolderList li.task[data-item="companyFolder160"] p').click();
        });

        function setActiveFilter() {
            $('.filters.fngw_plus_btn_wrapper .fngw_plus_btn').removeClass('active');
            $('.filters.fngw_plus_btn_wrapper .fngw_plus_btn').filter(function() {
							return $('#searchKeyword').val().indexOf($(this).text()) >= 0 ? true : false
						}).addClass('active');
        }
    }
}
