// publishing UI javascript
$(function () {
  mapSetting.init();
});

var mapSetting = {
  init: function () {
    mapSetting.common();
    mapSetting.camera();
    mapSetting.radar();
    mapSetting.signalLight();
    mapSetting.los();
  },
  common: function () {
    // 지도 화면 우측 중간에 있는 system-nav에서 클릭된 아이콘 상태를 ly-map div태그에 class명으로 추가해주는 함수.
    function systemNavState($this, activeState, lymapAddClass) {
      if ($this.is(activeState)) {
        $('.ly-map').addClass(lymapAddClass);
      } else {
        $('.ly-map').removeClass(lymapAddClass);
        $('.speech-bubble-guide').hide();
      }
    }

    // 우축 중간 시스템 네비게이션 클릭 이벤트
    // 230928 클릭이벤트 수정
    $('.system-nav .ico-set-item').on('click', function () {
      var $this = $(this);
      $this.toggleClass('active');
      $('.system-nav .ico-set-item').not(this).removeClass('active');

      systemNavState($this, '.camera.active', 'ico-set-camera-active');
      systemNavState($this, '.radar.active', 'ico-set-radar-active');
      systemNavState($this, '.signal-light.active', 'ico-set-signal-light-active');
      systemNavState($this, '.los.active', 'ico-set-los-active');

      // 카메라/레이더/신호등/LOS 추가 메뉴 팝업 숨김
      $('.js-add-branch').fadeOut(200);
    });

    // 메뉴 팝업의 취소 버튼 눌렀을때 메뉴 팝업 숨김
    $('.js-add-branch .js-calcel').on('click', function (e) {
      e.preventDefault();
      $(this).parent().fadeOut(200);
    });

    // 지도 위 아무곳이나 클릭하면 기 등록된 지점 메뉴 팝업 숨김
    // (국토지리정보원 API 호출시 지도 최상단 부모 클래스명이 ol-viewport로 나옵니다. 개발환경에서도 동일하게 나오는지 확인이 필요하고, 만약 클래스명이 다르면 ol-viewport클래스명 수정이 필요합니다. 참고 바랍니다.)
    $(document).on('click', '.ol-viewport', function () {
      $('.js-existing-branch').fadeOut(200);
    });
  },
  camera: function () {
    // 마우스 커서가 카메라 아이콘으로 바뀌었을때 커서 위에 안내 말풍선 노출
    var $speechBubbleCam = $('.speech-bubble-guide2');
    $(document).on('mousemove', '.ly-map.ico-set-camera-active', function (e) {
      var x = e.clientX - $(this).offset().left;
      var y = e.clientY - $(this).offset().top;
      $speechBubbleCam.css({
        left: x - 10,
        top: y - 75,
      });
    });

    // 특정 요소에 마우스가 올라갔을때 말풍선 숨김
    var targetParent = '.ly-map.ico-set-camera-active';
    var targetTag = `${targetParent} .ui.dropdown.area-box, ${targetParent} .map-type, ${targetParent} .system-nav, ${targetParent} .menu-popup`;
    $(document).on('mouseenter', targetTag, function () {
      $speechBubbleCam.hide();
    });
    $(document).on('mouseleave', targetTag, function () {
      $speechBubbleCam.show();
    });

    // 마우스 커서가 카메라 아이콘으로 바뀌었을때 지도 위 클릭 이벤트: 메뉴 팝업 생성
    // (국토지리정보원 API 호출시 지도 최상단 부모 클래스명이 ol-viewport로 나옵니다. 개발환경에서도 동일하게 나오는지 확인이 필요하고, 만약 클래스명이 다르면 ol-viewport클래스명 수정이 필요합니다. 참고 바랍니다.)
    $(document).on('click', '.ico-set-camera-active .ol-viewport', function (e) {
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      $('.js-add-branch').fadeIn(200).css({
        left: x,
        top: y,
      });
    });

    // 기 등록된 카메라 아이콘 클릭 이벤트: 메뉴 팝업 노출
    var $iconCameraPosInit; // 기 등록된(최초의) 카메라 아이콘의 좌표값을 저장하는 변수
    $('.ico-map-above-camera').on('click', function (e) {
      // 기 등록된(최초의) 카메라 아이콘의 좌표값을 전역변수($iconCameraPosInit)에 저장
      // 카메라 위치 이동 후 '취소' 할 경우 최초의 좌표값 정보가 필요하기 때문.
      if (!$(this).is('.moving')) {
        $iconCameraPosInit = $(this).css(['left', 'top']);
      }
      // ico-map-above-camera 요소에 data속성 추가
      $('.ico-map-above-camera').each(function (idx, el) {
        $(el).attr('data-name', `ico-map-above-camera${idx + 1}`);
      });
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      var $dataName = $(this).data('name');
      if (!$(this).is('.moving')) {
        $('.js-existing-branch').attr('data-name', $dataName).fadeIn(200).css({
          left: x,
          top: y,
        });
      }
    });

    // '지점 위치 이동' 메뉴 클릭시 교차로 아이콘 드래그 가능하도록 설정
    $('.js-existing-branch .js-move-position').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      var iconCamera = $(`.ico-map-above-camera[data-name="${menuData}"]`);
      $(this).parent().fadeOut(200);
      iconCamera.addClass('moving');
      if (iconCamera.is('.moving')) {
        iconCamera.draggable({
          containment: '.ly-map',
          drag: function () {
            $('.js-move-end').attr('data-name', menuData).fadeOut(200);
          },
          stop: function (e, ui) {
            // 드래그가 끝날 때 좌표를 저장.
            var endX = e.clientX + 20;
            var endY = e.clientY + 20;
            $('.js-move-end').fadeIn(200).css({
              left: endX,
              top: endY,
            });
          },
        });
      }
    });

    // '위치 이동 완료' 버튼 클릭시 카메라 아이콘 이동
    $('.js-move-end .js-complete').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      // 230928 if문 추가
      if (menuData && menuData.indexOf('camera') !== -1) {
        var x = parseInt($(this).parent().css('left')) - 130;
        var y = parseInt($(this).parent().css('top')) - 50;
        $(this).parent().fadeOut(200);

        // 카메라 아이콘 위치를 이동
        var $iconCamera = $(`.ico-map-above-camera[data-name="${menuData}"]`);
        var $iconCameraPos = $iconCamera.css(['left', 'top']);
        $iconCamera.draggable('destroy').removeClass('moving').css($iconCameraPos);
      }
    });

    // '위치 이동 취소' 버튼 클릭시 카메라 아이콘 원복 설정
    $('.js-move-end .js-calcel').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      // 230928 if문 추가
      if (menuData && menuData.indexOf('camera') !== -1) {
        $(this).parent().fadeOut(200);
        // 카메라 아이콘 위치를 원복함
        $(`.ico-map-above-camera[data-name="${menuData}"]`).draggable('destroy').removeClass('moving').css($iconCameraPosInit);
      }
    });
  },
  radar: function () {
    // 마우스 커서가 레이더 아이콘으로 바뀌었을때 커서 위에 안내 말풍선 노출
    var $speechBubbleRadar = $('.speech-bubble-guide3');
    $(document).on('mousemove', '.ly-map.ico-set-radar-active', function (e) {
      var x = e.clientX - $(this).offset().left;
      var y = e.clientY - $(this).offset().top;
      $speechBubbleRadar.css({
        left: x - 10,
        top: y - 75,
      });
    });

    // 특정 요소에 마우스가 올라갔을때 말풍선 숨김
    var targetParent = '.ly-map.ico-set-radar-active';
    var targetTag = `${targetParent} .ui.dropdown.area-box, ${targetParent} .map-type, ${targetParent} .system-nav, ${targetParent} .menu-popup`;
    $(document).on('mouseenter', targetTag, function () {
      $speechBubbleRadar.hide();
    });
    $(document).on('mouseleave', targetTag, function () {
      $speechBubbleRadar.show();
    });

    // 마우스 커서가 레이더 아이콘으로 바뀌었을때 지도 위 클릭 이벤트: 메뉴 팝업 생성
    $(document).on('click', '.ico-set-radar-active .ol-viewport', function (e) {
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      $('.js-add-branch').fadeIn(200).css({
        left: x,
        top: y,
      });
    });

    // 기 등록된 레이더 아이콘 클릭 이벤트: 메뉴 팝업 노출
    var $iconRadarPosInit; // 기 등록된(최초의) 레이더 아이콘의 좌표값을 저장하는 변수
    $('.ico-map-above-radar').on('click', function (e) {
      // 기 등록된(최초의) 레이더 아이콘의 좌표값을 전역변수($iconRadarPosInit)에 저장
      // 레이더 위치 이동 후 '취소' 할 경우 최초의 좌표값 정보가 필요하기 때문.
      if (!$(this).is('.moving')) {
        $iconRadarPosInit = $(this).css(['left', 'top']);
      }
      // ico-map-above-radar 요소에 data속성 추가
      $('.ico-map-above-radar').each(function (idx, el) {
        $(el).attr('data-name', `ico-map-above-radar${idx + 1}`);
      });
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      var $dataName = $(this).data('name');
      if (!$(this).is('.moving')) {
        $('.js-existing-branch').attr('data-name', $dataName).fadeIn(200).css({
          left: x,
          top: y,
        });
      }
    });

    // '지점 위치 이동' 메뉴 클릭시 레이더 아이콘 드래그 가능하도록 설정
    $('.js-existing-branch .js-move-position').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      var iconRadar = $(`.ico-map-above-radar[data-name="${menuData}"]`);
      $(this).parent().fadeOut(200);
      iconRadar.addClass('moving');
      if (iconRadar.is('.moving')) {
        iconRadar.draggable({
          containment: '.ly-map',
          drag: function () {
            $('.js-move-end').attr('data-name', menuData).fadeOut(200);
          },
          stop: function (e, ui) {
            // 드래그가 끝날 때 좌표를 저장.
            var endX = e.clientX + 20;
            var endY = e.clientY + 20;
            $('.js-move-end').fadeIn(200).css({
              left: endX,
              top: endY,
            });
          },
        });
      }
    });

    // '위치 이동 완료' 버튼 클릭시 레이더 아이콘 이동
    $('.js-move-end .js-complete').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      if (menuData && menuData.indexOf('radar') !== -1) {
        var x = parseInt($(this).parent().css('left')) - 130;
        var y = parseInt($(this).parent().css('top')) - 50;
        $(this).parent().fadeOut(200);

        // 레이더 아이콘 위치를 이동
        var $iconRadar = $(`.ico-map-above-radar[data-name="${menuData}"]`);
        var $iconRadarPos = $iconRadar.css(['left', 'top']);
        $iconRadar.draggable('destroy').removeClass('moving').css($iconRadarPos);
      }
    });

    // '위치 이동 취소' 버튼 클릭시 레이더 아이콘 원복 설정
    $('.js-move-end .js-calcel').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      if (menuData && menuData.indexOf('radar') !== -1) {
        $(this).parent().fadeOut(200);
        // 레이더 아이콘 위치를 원복함
        $(`.ico-map-above-radar[data-name="${menuData}"]`).draggable('destroy').removeClass('moving').css($iconRadarPosInit);
      }
    });
  },
  signalLight: function () {
    // 마우스 커서가 신호등 아이콘으로 바뀌었을때 커서 위에 안내 말풍선 노출
    var $speechBubbleSignalLight = $('.speech-bubble-guide4');
    $(document).on('mousemove', '.ly-map.ico-set-signal-light-active', function (e) {
      var x = e.clientX - $(this).offset().left;
      var y = e.clientY - $(this).offset().top;
      $speechBubbleSignalLight.css({
        left: x - 10,
        top: y - 75,
      });
    });

    // 특정 요소에 마우스가 올라갔을때 말풍선 숨김
    var targetParent = '.ly-map.ico-set-signal-light-active';
    var targetTag = `${targetParent} .ui.dropdown.area-box, ${targetParent} .map-type, ${targetParent} .system-nav, ${targetParent} .menu-popup`;
    $(document).on('mouseenter', targetTag, function () {
      $speechBubbleSignalLight.hide();
    });
    $(document).on('mouseleave', targetTag, function () {
      $speechBubbleSignalLight.show();
    });

    // 마우스 커서가 신호등 아이콘으로 바뀌었을때 지도 위 클릭 이벤트: 메뉴 팝업 생성
    $(document).on('click', '.ico-set-signal-light-active .ol-viewport', function (e) {
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      $('.js-add-branch').fadeIn(200).css({
        left: x,
        top: y,
      });
    });

    // 기 등록된 신호등 아이콘 클릭 이벤트: 메뉴 팝업 노출
    var $iconSignalLightPosInit; // 기 등록된(최초의) 신호등 아이콘의 좌표값을 저장하는 변수
    $('.ico-vehicle-signal').on('click', function (e) {
      // 기 등록된(최초의) 신호등 아이콘의 좌표값을 전역변수($iconSignalLightPosInit)에 저장
      // 신호등 위치 이동 후 '취소' 할 경우 최초의 좌표값 정보가 필요하기 때문.
      if (!$(this).is('.moving')) {
        $iconSignalLightPosInit = $(this).css(['left', 'top']);
      }
      // ico-vehicle-signal 요소에 data속성 추가
      $('.ico-vehicle-signal').each(function (idx, el) {
        $(el).attr('data-name', `ico-vehicle-signal${idx + 1}`);
      });
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      var $dataName = $(this).data('name');
      if (!$(this).is('.moving')) {
        $('.js-existing-branch').attr('data-name', $dataName).fadeIn(200).css({
          left: x,
          top: y,
        });
      }
    });

    // '지점 위치 이동' 메뉴 클릭시 신호등 아이콘 드래그 가능하도록 설정
    $('.js-existing-branch .js-move-position').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      var iconSignalLight = $(`.ico-vehicle-signal[data-name="${menuData}"]`);
      $(this).parent().fadeOut(200);
      iconSignalLight.addClass('moving');
      if (iconSignalLight.is('.moving')) {
        iconSignalLight.draggable({
          containment: '.ly-map',
          drag: function () {
            $('.js-move-end').attr('data-name', menuData).fadeOut(200);
          },
          stop: function (e, ui) {
            // 드래그가 끝날 때 좌표를 저장.
            var endX = e.clientX + 20;
            var endY = e.clientY + 20;
            $('.js-move-end').fadeIn(200).css({
              left: endX,
              top: endY,
            });
          },
        });
      }
    });

    // '위치 이동 완료' 버튼 클릭시 신호등 아이콘 이동
    $('.js-move-end .js-complete').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      if (menuData && menuData.indexOf('signal') !== -1) {
        var x = parseInt($(this).parent().css('left')) - 130;
        var y = parseInt($(this).parent().css('top')) - 50;
        $(this).parent().fadeOut(200);

        // 신호등 아이콘 위치를 이동
        var $iconSignalLight = $(`.ico-vehicle-signal[data-name="${menuData}"]`);
        var $iconSignalLightPos = $iconSignalLight.css(['left', 'top']);
        $iconSignalLight.draggable('destroy').removeClass('moving').css($iconSignalLightPos);
      }
    });

    // '위치 이동 취소' 버튼 클릭시 신호등 아이콘 원복 설정
    $('.js-move-end .js-calcel').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      if (menuData && menuData.indexOf('signal') !== -1) {
        $(this).parent().fadeOut(200);
        // 신호등 아이콘 위치를 원복함
        $(`.ico-vehicle-signal[data-name="${menuData}"]`).draggable('destroy').removeClass('moving').css($iconSignalLightPosInit);
      }
    });
  },
  los: function () {
    // 마우스 커서가 LOS 아이콘으로 바뀌었을때 커서 위에 안내 말풍선 노출
    var $speechBubbleLos = $('.speech-bubble-guide5');
    $(document).on('mousemove', '.ly-map.ico-set-los-active', function (e) {
      var x = e.clientX - $(this).offset().left;
      var y = e.clientY - $(this).offset().top;
      $speechBubbleLos.css({
        left: x - 10,
        top: y - 75,
      });
    });

    // 특정 요소에 마우스가 올라갔을때 말풍선 숨김
    var targetParent = '.ly-map.ico-set-los-active';
    var targetTag = `${targetParent} .ui.dropdown.area-box, ${targetParent} .map-type, ${targetParent} .system-nav, ${targetParent} .menu-popup`;
    $(document).on('mouseenter', targetTag, function () {
      $speechBubbleLos.hide();
    });
    $(document).on('mouseleave', targetTag, function () {
      $speechBubbleLos.show();
    });

    // 마우스 커서가 LOS 아이콘으로 바뀌었을때 지도 위 클릭 이벤트: 메뉴 팝업 생성
    $(document).on('click', '.ico-set-los-active .ol-viewport', function (e) {
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      $('.js-add-branch').fadeIn(200).css({
        left: x,
        top: y,
      });
    });

    // 기 등록된 LOS 아이콘 클릭 이벤트: 메뉴 팝업 노출
    var $iconLosPosInit; // 기 등록된(최초의) LOS 아이콘의 좌표값을 저장하는 변수
    $('.ico-map-above-los').on('click', function (e) {
      // 기 등록된(최초의) LOS 아이콘의 좌표값을 전역변수($iconLosPosInit)에 저장
      // LOS 위치 이동 후 '취소' 할 경우 최초의 좌표값 정보가 필요하기 때문.
      if (!$(this).is('.moving')) {
        $iconLosPosInit = $(this).css(['left', 'top']);
      }
      // ico-map-above-los 요소에 data속성 추가
      $('.ico-map-above-los').each(function (idx, el) {
        $(el).attr('data-name', `ico-map-above-los${idx + 1}`);
      });
      var x = e.clientX + 20;
      var y = e.clientY + 20;
      var $dataName = $(this).data('name');
      if (!$(this).is('.moving')) {
        $('.js-existing-branch').attr('data-name', $dataName).fadeIn(200).css({
          left: x,
          top: y,
        });
      }
    });

    // '지점 위치 이동' 메뉴 클릭시 레이더 아이콘 드래그 가능하도록 설정
    $('.js-existing-branch .js-move-position').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      var iconLos = $(`.ico-map-above-los[data-name="${menuData}"]`);
      $(this).parent().fadeOut(200);
      iconLos.addClass('moving');
      if (iconLos.is('.moving')) {
        iconLos.draggable({
          containment: '.ly-map',
          drag: function () {
            $('.js-move-end').attr('data-name', menuData).fadeOut(200);
          },
          stop: function (e, ui) {
            // 드래그가 끝날 때 좌표를 저장.
            var endX = e.clientX + 20;
            var endY = e.clientY + 20;
            $('.js-move-end').fadeIn(200).css({
              left: endX,
              top: endY,
            });
          },
        });
      }
    });

    // '위치 이동 완료' 버튼 클릭시 LOS 아이콘 이동
    $('.js-move-end .js-complete').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      if (menuData && menuData.indexOf('los') !== -1) {
        var x = parseInt($(this).parent().css('left')) - 130;
        var y = parseInt($(this).parent().css('top')) - 50;
        $(this).parent().fadeOut(200);

        // LOS 아이콘 위치를 이동
        var $iconLos = $(`.ico-map-above-los[data-name="${menuData}"]`);
        var $iconLosPos = $iconLos.css(['left', 'top']);
        $iconLos.draggable('destroy').removeClass('moving').css($iconLosPos);
      }
    });

    // '위치 이동 취소' 버튼 클릭시 LOS 아이콘 원복 설정
    $('.js-move-end .js-calcel').on('click', function (e) {
      e.preventDefault();
      var menuData = $(this).parent().attr('data-name');
      if (menuData && menuData.indexOf('los') !== -1) {
        $(this).parent().fadeOut(200);
        // LOS 아이콘 위치를 원복함
        $(`.ico-map-above-los[data-name="${menuData}"]`).draggable('destroy').removeClass('moving').css($iconLosPosInit);
      }
    });
  },
};
