// publishing UI javascript
$(function () {
  if ($('[include-html]').length !== 0) {
    includeHTML(); // HTML include (퍼블리싱 확인용)
  }

  // ui 인터렉션 호출
  setTimeout(function () {
    cmmnUi.init();
  }, 10);
});

var cmmnUi = {
  init: function () {
    cmmnUi.default();
    cmmnUi.map();
    cmmnUi.gnb();
    cmmnUi.modal();
  },
  default: function () {
    /* 체크박스 리스트 아코디언 메뉴 */
    $('.chk-list-container .chk-list-title button').on('click', function () {
      var $this = $(this).parent('.chk-list-title');
      var $chkContent = $this.next();
      if ($chkContent.is(':visible')) {
        // 만약 열려있다면 닫기
        $chkContent.slideUp(300);
        $this.removeClass('active');
      } else {
        // 만약 닫혀있다면 열기
        $('.chk-list-container .chk-list-content').slideUp(300);
        $('.chk-list-container .chk-list-title').removeClass('active');
        $chkContent.slideDown(300);
        $this.addClass('active');
      }
    });

    /* 좌측 메뉴에 노출되는 상세 화면(접고/펼치기) 인터랙션 */
    // 상세 화면 유무 체크
    $(window)
      .on('resize', function () {
        if ($('.crossroad-view-container').length !== 0) {
          $('.wrapper').addClass('is-crossroad-view');
        }

        // if ($('.roi-view-container').length !== 0) {
        //   $('.wrapper').addClass('is-roi-view');
        // }

        if ($('.search-view-container').length !== 0) {
          $('.wrapper').addClass('is-search-view');
        }
      })
      .resize();

    // 상세 화면 접고/펼치기
    $('.btn-crossroad-view').on('click', function () {
      $('.is-crossroad-view').toggleClass('is-fold');
      $('.gnb').removeClass('is-open');
    });
    // $('.btn-roi-view').on('click', function () {
    //   $('.is-roi-view').toggleClass('is-fold');
    //   $('.gnb').removeClass('is-open');
    // });
    $('.btn-search-view').on('click', function () {
      $('.is-search-view').toggleClass('is-fold');
      $('.gnb').removeClass('is-open');
    });
  },
  map: function () {
    // 지도 우측 상단 현재 구역 드롭다운
    if ($('.ly-map').length !== 0) {
      $('.area-box').dropdown();
    }

    // 지점 검색
    var $searchContainer = $('.search-view-container');
    function allRemoveActive() {
      $('.depth1 button', $searchContainer).removeClass('active');
      $('.depth2 .area', $searchContainer).removeClass('active');
      $('.btn-custom-wrap .depth2', $searchContainer).hide();
    }
    $('.btn-custom', $searchContainer).on('click', function () {
      $(this).parent().toggleClass('active');

      if (!$(this).parent().is('.active')) {
        allRemoveActive();
      }
      if ($(this).parent('.js-custom-wrap-system').is('.active')) {
        allRemoveActive();
        $('.js-custom-wrap-location', $searchContainer).removeClass('active');
      }
      if ($(this).parent('.js-custom-wrap-location').is('.active')) {
        $('.js-custom-wrap-system', $searchContainer).removeClass('active');
      }
    });
    $('.depth1 button', $searchContainer).on('click', function () {
      var $targetPoint = $(this).data('target');

      if ($(this).data('all') === '전체') {
        $(this).closest('.btn-custom-wrap').find('.btn-custom').text($(this).data('all'));
        setTimeout(function () {
          allRemoveActive();
          $('.btn-custom-wrap', $searchContainer).removeClass('active');
        }, 100);
      }

      $('.depth1 button', $searchContainer).removeClass('active');
      $(this).addClass('active');

      $('.depth2 .area', $searchContainer).removeClass('active');
      var $pointArea = $('#' + $targetPoint);
      $('.btn-custom-wrap .depth2', $searchContainer).show();
      $pointArea.addClass('active');
    });
    $('.depth2 button', $searchContainer).on('click', function () {
      var $txt = $(this).text();
      $(this).closest('.btn-custom-wrap').find('.btn-custom').text($txt);
      setTimeout(function () {
        allRemoveActive();
        $('.btn-custom-wrap', $searchContainer).removeClass('active');
      }, 100);
    });
    $('.js-custom-wrap-system .chk-box button', $searchContainer).on('click', function () {
      var $txt = $(this).text();
      $(this).closest('.js-custom-wrap-system').removeClass('active').children('.btn-custom').text($txt);
    });

    // 카메라 아이콘 클릭시 팝업 노출
    $('.ico-camera').on('click', function () {
      var $this = $(this);
      var $icoW = $this.outerWidth(true);
      var $icoH = $this.outerHeight(true);
      var $top = $this.position().top;
      var $left = $this.position().left;
      var $target = $this.data('target');
      var $popup = $('#' + $target);
      $popup.fadeIn(250).css({
        top: $top + $icoH + 'px',
        left: $left + $icoW + 'px',
        marginTop: '-145px',
      });
    });

    $('.camera-popup .btn-popup-close').on('click', function (e) {
      e.preventDefault();
      $(this).closest('.camera-popup').fadeOut(150);
    });
  },
  gnb: function () {
    var $winH = $(window).height();
    var $dropdownEl = $('.gnb .ui.dropdown');
    var isAccordionState = false; // 1depth가 자식요소로 accordion 메뉴를 포함하고 있는지 상태 체크

    // 스크롤 유무 체크 커스텀 프로퍼티
    // $.fn.hasScrollBar = function () {
    //   return (this.prop('scrollHeight') == 0 && this.prop('clientHeight') == 0) || this.prop('scrollHeight') > this.prop('clientHeight');
    // };

    // 좌측 메뉴에 노출되는 상세 화면(접고/펼치기)에서의 gnb 상태값 적용
    function hoverState(order, isClassNameChk) {
      if ($(this).closest('.wrapper').is(isClassNameChk)) {
        return order;
      }
    }

    // gnb hover 정의
    $(document).on('mouseenter', '.gnb', function () {
      $('.gnb').addClass('is-open');
      hoverState($('.is-crossroad-view').addClass('is-hover'), '.is-crossroad-view');
      hoverState($('.is-roi-view').addClass('is-hover'), '.is-roi-view');
      hoverState($('.is-search-view').addClass('is-hover'), '.is-search-view');
    });
    $(document).on('mouseenter', '.ly-container', function () {
      $('.gnb').removeClass('is-open');
      hoverState($('.is-crossroad-view').removeClass('is-hover'), '.is-crossroad-view');
      hoverState($('.is-roi-view').removeClass('is-hover'), '.is-roi-view');
      hoverState($('.is-search-view').removeClass('is-hover'), '.is-search-view');
    });
    $(document).on('mouseenter', '.crossroad-view-container .tab.segment', function () {
      $('.gnb').removeClass('is-open');
    });
    $(document).on('mouseenter', '.roi-view-container .tab.segment', function () {
      $('.gnb').removeClass('is-open');
    });
    $(document).on('mouseenter', '.search-view-container > section', function () {
      $('.gnb').removeClass('is-open');
    });

    // 1depth 메뉴의 하위 메뉴 initialize
    $dropdownEl.dropdown({
      onShow: function () {},
      onHide: function () {
        if ($(this).find('.ui.accordion').length !== 0) {
          return isAccordionState;
        } else {
          return true;
        }
      },
    });

    // 2depth 아코디언메뉴 initialize
    $('.gnb .ui.accordion').accordion();

    // 2depth 아코디언메뉴 클릭시 아코디언메뉴 높이값 실시간 체크하여 하단에 닿으면 기준점을 bottom으로 변경
    $('.gnb .ui.accordion').on('click', function () {
      var $this = $(this);
      var $winhHalf = $winH / 1.4;

      setTimeout(function () {
        var $accordionWrap = $this.closest('.menu').outerHeight(true);

        if ($accordionWrap > $winhHalf) {
          $this.closest('.ui.dropdown').addClass('upward2');
        } else if ($accordionWrap < $winhHalf) {
          $this.closest('.ui.dropdown').removeClass('upward2');
        }
      }, 400);
    });

    // 1depth 메뉴 클릭시 isAccordionState의 side effect 처리
    $dropdownEl.on('click', function () {
      isAccordionState = true;
      setTimeout(function () {
        isAccordionState = false;
      }, 250);
    });

    // 아코디언메뉴 클릭시 isAccordionState의 side effect 처리
    $('.gnb .ui.dropdown > .menu').on('mouseleave', function () {
      isAccordionState = true;
      if ($(this).parent().is('.active')) {
        $(this).parent().trigger('click');
        setTimeout(function () {
          isAccordionState = false;
          $('.ui.accordion').accordion('close', 0);
          $dropdownEl.removeClass('upward2'); //upward2 클래스 제거
        }, 250);
      }
    });
  },
  modal: function () {
    $('.btn-modal-open').on('click', function () {
      $(this).modal({
        closeExisting: false,
        clickClose: false,
        fadeDuration: 100,
      });
      return false;
    });
  },
};
