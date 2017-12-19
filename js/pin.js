'use strict';

(function () {
  var SHIFT_PIN_LEFT = 5;
  var SHIFT_PIN_TOP = 40;
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');
  var advertForm = document.querySelector('.notice__form');
  var fieldsetsNoticeForm = advertForm.querySelectorAll('fieldset');

  var clickedPin = null;
  var showedCard = null;

  window.pin = {
    clickHandler: function (evt) {
      if (!evt.currentTarget.classList.contains('map__pin--main')) {
        if (clickedPin && showedCard) {
          clickedPin.classList.remove('map__pin--active');
          showedCard.classList.add('hidden');
        }
        clickedPin = evt.currentTarget;
        clickedPin.classList.add('map__pin--active');
        var srcImagePin = evt.currentTarget.children[0].src;
        if (typeof window.pin.callback === 'function') {
          showedCard = window.pin.callback(srcImagePin);
        }
      }
    },

    render: function (advert) {
      var pinElement = mapPinTemplate.cloneNode(true);

      pinElement.style.left = advert.location.x - SHIFT_PIN_LEFT + 'px';
      pinElement.style.top = advert.location.y - SHIFT_PIN_TOP + 'px';
      pinElement.querySelector('img').src = advert.author.avatar;
      // pinElement.classList.add('hidden');
      pinElement.addEventListener('click', window.pin.clickHandler);

      return pinElement;
    },

    callback: null
  };

  window.pin.callback = window.showCard;

  mainPin.addEventListener('mouseup', function () {
    map.classList.remove('map--faded');
    window.render();
    advertForm.classList.remove('notice__form--disabled');
    window.util.disableItems(fieldsetsNoticeForm, false);
  });

})();
