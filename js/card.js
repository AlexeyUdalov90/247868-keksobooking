'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var houseRoomTypes = {
    flat: 'Квартира',
    bungalo: 'Лачуга',
    house: 'Дом',
    palace: 'Дворец'
  };

  window.card = {
    closeClickHandler: function (evt) {
      if (evt.target.className === 'popup__close') {
        evt.target.parentElement.classList.add('hidden');
        document.querySelector('.map__pins .map__pin--active').classList.remove('map__pin--active');
      } else {
        var popups = document.querySelectorAll('.map .map__card');
        popups.forEach(function (popup) {
          if (!popup.classList.contains('hidden')) {
            popup.classList.add('hidden');
          }
        });
        evt.target.classList.remove('map__pin--active');
      }
      document.removeEventListener('keydown', window.card.escPressHandler);
    },

    escPressHandler: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.card.closeClickHandler(evt);
      }
    },

    render: function (advert) {
      var cardElement = cardTemplate.cloneNode(true);

      cardElement.classList.add('hidden');
      cardElement.querySelector('img').src = advert.author.avatar;
      cardElement.querySelector('h3').textContent = advert.offer.title;
      cardElement.querySelector('p > small').textContent = advert.offer.address;
      cardElement.querySelector('.popup__price').innerHTML = advert.offer.price + '&#x20bd;/ночь';
      cardElement.querySelector('h4').textContent = houseRoomTypes[advert.offer.type];
      cardElement.querySelector('h4 + p').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
      cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
      cardElement.querySelector('.popup__features + p').textContent = advert.offer.description;
      cardElement.replaceChild(createFeatures(advert.offer.features), cardElement.querySelector('.popup__features'));
      cardElement.querySelector('.popup__close').addEventListener('click', window.card.closeClickHandler);

      return cardElement;
    }
  };

  var createFeatures = function (features) {
    var featuresFragment = document.createDocumentFragment();
    var featureList = document.createElement('ul');
    featureList.className = '.popup__features';

    features.forEach(function (feature) {
      var featureElement = document.createElement('li');
      featureElement.className = 'feature feature--' + feature;
      featureList.appendChild(featureElement);
    });

    featuresFragment.appendChild(featureList);
    return featuresFragment;
  };

})();
