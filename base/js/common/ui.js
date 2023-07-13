// publishing UI javascript
$(function () {
  // ui 인터렉션 호출
  cmmnUi.init();
});

var cmmnUi = {
  init: function () {
    cmmnUi.gnb();
    cmmnUi.modal();
  },
  gnb: function () {
    var $winH = $(window).height();
    var $dropdownEl = $('.gnb .ui.dropdown');
    var isAccordionState = false; // 1depth가 자식요소로 accordion 메뉴를 포함하고 있는지 상태 체크

    //
    (function () {
      if ($winH < 959) {
        $('.gnb').css('position', 'absolute');
        $('.gnb').css('height', $(document).height() - 20);
      }
      // console.log($doch);
    })();

    // 스크롤 유무 체크 커스텀 프로퍼티
    $.fn.hasScrollBar = function () {
      return (this.prop('scrollHeight') == 0 && this.prop('clientHeight') == 0) || this.prop('scrollHeight') > this.prop('clientHeight');
    };

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
    $('.ui.accordion').accordion();

    // 2depth 아코디언메뉴 클릭시 아코디언메뉴 높이값 실시간 체크하여 하단에 닿으면 기준점을 bottom으로 변경
    $('.ui.accordion').on('click', function () {
      var $this = $(this);
      if ($winH > 959) {
        setTimeout(function () {
          if ($('body').hasScrollBar()) {
            $this.closest('.ui.dropdown').addClass('upward2');
          } else {
            $this.closest('.ui.dropdown').removeClass('upward2');
          }
        }, 250);
      }
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
