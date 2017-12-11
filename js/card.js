'use strict';

(function () {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var fragmentFeatures = document.createDocumentFragment();

  var typesHouseroom = {
    flat: 'Квартира',
    bungalo: 'Лачуга',
    house: 'Дом',
    palace: 'Дворец'
  };

  window.card = {
    renderCard: function (advert) {
      var cardElement = mapCardTemplate.cloneNode(true);

      cardElement.classList.add('hidden');
      cardElement.querySelector('img').src = advert.author.avatar;
      cardElement.querySelector('h3').textContent = advert.offer.title;
      cardElement.querySelector('p > small').textContent = advert.offer.address;
      cardElement.querySelector('.popup__price').innerHTML = advert.offer.price + '&#x20bd;/ночь';
      cardElement.querySelector('h4').textContent = typesHouseroom[advert.offer.type];
      cardElement.querySelector('h4 + p').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
      cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
      cardElement.querySelector('.popup__features + p').textContent = advert.offer.description;
      cardElement.replaceChild(createFeatures(advert.offer.features), cardElement.querySelector('.popup__features'));
      cardElement.querySelector('.popup__close').addEventListener('click', window.map.closePopup);

      return cardElement;
    }
  };

  var createFeatures = function (features) {
    var featureItems = document.createElement('ul');
    featureItems.className = '.popup__features';

    features.forEach(function (feature) {
      var featureElement = document.createElement('li');
      featureElement.className = 'feature feature--' + feature;
      featureItems.appendChild(featureElement);
    });

    fragmentFeatures.appendChild(featureItems);
    return fragmentFeatures;
  };

})();
