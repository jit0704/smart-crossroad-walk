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

    // 좌측 메뉴 프로필 보기
    $('.gnb .aside .btn-m').on('click', function () {
      $(this).addClass('active');
      $('.pop-user-info').fadeIn(250);
    });
    $(document).on('mouseenter', '.ly-map, .ly-sub', function () {
      cmmnUi.profilePopInit();
    });
  },
  // 좌측 하단 계정설정 팝업 숨기기
  profilePopInit: function () {
    $('.gnb .aside .btn-m').removeClass('active');
    $('.pop-user-info').hide();
  },
  map: function () {
    // 지도 우측 상단 현재 구역 드롭다운
    if ($('.ly-map').length !== 0) {
      $('.area-box').dropdown();
    }

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
      cmmnUi.profilePopInit();
    });
    $(document).on('mouseenter', '.roi-view-container .tab.segment', function () {
      $('.gnb').removeClass('is-open');
      cmmnUi.profilePopInit();
    });
    $(document).on('mouseenter', '.search-view-container > section', function () {
      $('.gnb').removeClass('is-open');
      cmmnUi.profilePopInit();
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
    // 딤드 팝업
    $(document).on('click', '.btn-modal-open', function () {
      $(this).modal({
        closeExisting: false,
        clickClose: false,
        fadeDuration: 100,
      });
      return false;
    });

    // 딤드 없는 팝업
    $(document).on('click', '.no-dimed-btn-modal-open', function () {
      $(this).modal({
        closeExisting: false,
        clickClose: false,
        fadeDuration: 100,
        blockerClass: 'no-dimed',
      });
      return false;
    });

    // 딤드 없는 팝업 드래그 이벤트 기능
    $(document).on($.modal.OPEN, function (e, modal) {
      if (modal.$blocker.is('.no-dimed')) {
        modal.$blocker.draggable({
          containment: '.ly-map',
          start: function () {
            $(this).css('transform', 'none');
          },
        });
      }
    });
  },
};
