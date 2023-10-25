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
    // Ctrl 키와 + 또는 - 키를 동시에 눌렀을 때 확대/축소를 막음.
    // document.addEventListener('keydown', function (event) {
    //   if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-')) {
    //     event.preventDefault();
    //   }
    // });

    // Ctrl 키와 마우스 휠 동작을 포함하여 페이지 확대/축소 비활성화.
    // document.addEventListener(
    //   'wheel',
    //   function (event) {
    //     if (event.ctrlKey) {
    //       event.preventDefault();
    //     }
    //   },
    //   { passive: false },
    // );

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

        // if ($('.search-view-container').length !== 0) {
        //   $('.wrapper').addClass('is-search-view');
        // }
      })
      .resize();

    // 상세 화면 접고/펼치기
    $('.btn-crossroad-view').on('click', function () {
      var $parent = $(this).parent('.crossroad-view-container');
      var $forefather = $(this).closest('.is-crossroad-view');
      var $parentWidth = $parent.width() - 54;
      // $('.is-crossroad-view').toggleClass('is-fold');
      if ($forefather.hasClass('is-fold')) {
        // 'is-fold' 클래스가 존재하는 경우
        $forefather.removeClass('is-fold');
        $parent.css('left', '54px');
      } else {
        // 'is-fold' 클래스가 존재하지 않는 경우
        $forefather.addClass('is-fold');
        $parent.css('left', -$parentWidth);
      }
      $('.gnb').removeClass('is-open');
    });
    // $('.btn-roi-view').on('click', function () {
    //   $('.is-roi-view').toggleClass('is-fold');
    //   $('.gnb').removeClass('is-open');
    // });
    // $('.btn-search-view').on('click', function () {
    //   $('.is-search-view').toggleClass('is-fold');
    //   $('.gnb').removeClass('is-open');
    // });

    // 좌측 메뉴 프로필 보기
    $('.gnb .aside .btn-m').on('click', function () {
      $(this).addClass('active');
      $('.pop-user-info').fadeIn(250);
    });
    $(document).on('mouseenter', '.ly-map, .ly-sub, .real-time-outbreak-container', function () {
      cmmnUi.profilePopInit();
    });
  },
  // 좌측 하단 계정설정 팝업 숨기기
  profilePopInit: function () {
    $('.gnb .aside .btn-m').removeClass('active');
    $('.pop-user-info').hide();
  },
  map: function () {
    // 231018 수정
    if ($('.ly-map').length !== 0) {
      // 지도 우측 상단 현재 구역 드롭다운
      $('.area-box').dropdown();

      // 아래 주석처리 스크립트는 /js/common/map-iconbar.js 경로에서 확인
      // 지도 우측 상단 아이콘바 영역 버튼 토글
      // var $mapIconBarwrap = $('.map-iconbar-container');
      // $('.btn-display', $mapIconBarwrap).on('click', function () {
      //   $(this).parent().toggleClass('open');
      // });
      // 아이콘바 영역 버튼아이콘 리스트 클릭 이벤트
      // $('.map-icon-list button', $mapIconBarwrap).on('click', function () {
      //   var $this = $(this);

      //   if ($this.closest('.map-iconbar-container').hasClass('map-selection')) {
      //     $this.parent().find('button').removeClass('active');
      //     $this.addClass('active');
      //     $this.closest('.map-selection').removeClass('open');
      //   } else {
      //     $this.toggleClass('active');
      //     // 231019 추가
      //     if ($this.parent().find('.active').length === 0) {
      //       setTimeout(function () {
      //         $this.closest('.map-iconbar-container').children('.btn-display').removeClass().addClass('btn-display');
      //       }, 50);
      //     }
      //   }

      //   if ($this.hasClass('ic1')) {
      //     classNameReplace($this, 'ic1');
      //   } else if ($this.hasClass('ic2')) {
      //     classNameReplace($this, 'ic2');
      //   } else if ($this.hasClass('ic3')) {
      //     classNameReplace($this, 'ic3');
      //   } else if ($this.hasClass('ic4')) {
      //     classNameReplace($this, 'ic4');
      //   } else if ($this.hasClass('ic5')) {
      //     classNameReplace($this, 'ic5');
      //   }
      // });

      // 최초 지도 접속시 지도 아이콘 default : 일반지도
      // $('.map-iconbar-container.map-selection .map-icon-list .ic1')
      //   .trigger('click')
      //   .closest('.map-iconbar-container.map-selection')
      //   .removeClass('open');

      // 최초 지도 접속시 마커 전체 노출
      // $('.map-iconbar-container').not('.map-iconbar-container.map-selection').addClass('open');

      // 아이콘들에 대한 표출 여부를 정할 수 있게 해주는 버튼의 아이콘 클래스명을 교체해주는 helper함수
      // function classNameReplace(_this, className) {
      //   var $targetbtn = $('.btn-display', '.map-iconbar-container.map-selection');
      //   _this.closest('.map-iconbar-container').children('.btn-display').removeClass().addClass(`btn-display ${className}`);
      //   // 아이콘 하단에 텍스트가 있는 경우 분기 처리
      //   if (_this.closest('.map-iconbar-container').hasClass('map-selection')) {
      //     if ($targetbtn.hasClass('ic1')) {
      //       $targetbtn.find('em').text('일반지도');
      //     } else if ($targetbtn.hasClass('ic2')) {
      //       $targetbtn.find('em').text('야간지도');
      //     } else if ($targetbtn.hasClass('ic3')) {
      //       $targetbtn.find('em').text('위성지도');
      //     }
      //   }
      // }
    }
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
      // hoverState($('.is-search-view').addClass('is-hover'), '.is-search-view');
      if ($('.search-view-container').length !== 0) {
        $('.search-view-container').addClass('is-gnb-open');
      }
      $('.sudden-disorder-popup').addClass('is-gnb-open');
    });
    $(document).on('mouseenter', '.ly-container', function () {
      $('.gnb').removeClass('is-open');
      hoverState($('.is-crossroad-view').removeClass('is-hover'), '.is-crossroad-view');
      hoverState($('.is-roi-view').removeClass('is-hover'), '.is-roi-view');
      // hoverState($('.is-search-view').removeClass('is-hover'), '.is-search-view');
      if ($('.search-view-container').length !== 0) {
        $('.search-view-container').removeClass('is-gnb-open');
      }
      $('.sudden-disorder-popup').removeClass('is-gnb-open');
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
      $(this).parent('.search-view-container').removeClass('is-gnb-open');
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
          handle: '.modal-header',
          containment: '.ly-map',
          start: function () {
            $(this).css('transform', 'none');
          },
        });
      }
    });
  },
};
