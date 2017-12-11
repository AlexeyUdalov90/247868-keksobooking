'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var advertsList = window.data.createAdverts(8);
  var fragmentPins = document.createDocumentFragment();
  var fragmentCard = document.createDocumentFragment();
  var map = document.querySelector('.map');
  var mapPinsBlock = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var clickedPin = null;
  var showedCard = null;

  window.map = {
    pinClickHandler: function (evt) {
      var cards = map.querySelectorAll('.popup');
      if (!evt.currentTarget.classList.contains('map__pin--main')) {
        if (clickedPin && showedCard) {
          clickedPin.classList.remove('map__pin--active');
          showedCard.classList.add('hidden');
        }
        clickedPin = evt.currentTarget;
        clickedPin.classList.add('map__pin--active');
        var srcImagePin = evt.currentTarget.children[0].src;
        for (var i = 0; i < cards.length; i++) {
          if (srcImagePin === cards[i].querySelector('img').src) {
            showedCard = cards[i];
            showedCard.classList.remove('hidden');
            document.addEventListener('keydown', window.map.popupEscPressHandler);
            break;
          }
        }
      }
    },

    closePopup: function () {
      showedCard.classList.add('hidden');
      clickedPin.classList.remove('map__pin--active');
      document.removeEventListener('keydown', window.map.popupEscPressHandler);
    },

    popupEscPressHandler: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.map.closePopup();
      }
    }
  };

  advertsList.forEach(function (advert) {
    fragmentPins.appendChild(window.pin.renderPin(advert));
    fragmentCard.appendChild(window.card.renderCard(advert));
  });

  mapPinsBlock.insertBefore(fragmentPins, mainPin);
  map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));

})();
