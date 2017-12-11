'use strict';

(function () {
  var SHIFT_PIN_LEFT = 5;
  var SHIFT_PIN_TOP = 40;
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var advertForm = document.querySelector('.notice__form');
  var fieldsetsNoticeForm = advertForm.querySelectorAll('fieldset');

  window.pin = {
    renderPin: function (advert) {
      var pinElement = mapPinTemplate.cloneNode(true);

      pinElement.style.left = advert.location.x - SHIFT_PIN_LEFT + 'px';
      pinElement.style.top = advert.location.y - SHIFT_PIN_TOP + 'px';
      pinElement.querySelector('img').src = advert.author.avatar;
      pinElement.classList.add('hidden');
      pinElement.addEventListener('click', window.map.pinClickHeandler);

      return pinElement;
    }
  };

  mainPin.addEventListener('mouseup', function () {
    var pins = document.querySelectorAll('.map .map__pin');
    map.classList.remove('map--faded');
    pins.forEach(function (pin) {
      pin.classList.remove('hidden');
    });
    advertForm.classList.remove('notice__form--disabled');
    window.util.disableItems(fieldsetsNoticeForm, false);
  });

})();
