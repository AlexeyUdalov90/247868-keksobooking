'use strict';
var SHIFT_LEFT = 5;
var SHIFT_TOP = 40;
var getRandomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getNumberFromRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomListItems = function (array) {
  var amount = Math.floor(Math.random() * array.length);
  var copyArray = array.slice();
  var items = [];
  for (var i = 0; i < amount; i++) {
    items[i] = copyArray.splice(getRandomItem(copyArray), 1)[0];
  }
  return items;
};

var getLink = function (number) {
  return (number < 10) ? '0' + number : number;
};

var createAdverts = function (number) {
  var adverts = [];
  var titlesList = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'];
  var typesList = [
    'flat',
    'house',
    'bungalo'
  ];
  var timesList = [
    '12:00',
    '13:00',
    '14:00'
  ];
  var featuresList = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  for (var i = 0; i < number; i++) {
    var coordinates = {x: getNumberFromRange(300, 900), y: getNumberFromRange(100, 500)};
    adverts[i] = {
      author: {avatar: 'img/avatars/user' + getLink(i + 1) + '.png'},
      offer: {
        title: titlesList.splice(getRandomItem(titlesList), 1)[0],
        address: coordinates.x + ', ' + coordinates.y,
        price: getNumberFromRange(1000, 1000000),
        type: getRandomItem(typesList),
        rooms: getNumberFromRange(1, 5),
        guests: getNumberFromRange(1, 10), // в условии случайное количество гостей, но должен же быть предел гостей)
        checkin: getRandomItem(timesList),
        checkout: getRandomItem(timesList),
        features: getRandomListItems(featuresList),
        description: '',
        photos: []
      },
      location: {
        x: coordinates.x,
        y: coordinates.y
      }
    };
  }
  return adverts;
};

var getType = function (type) {
  var typeNames = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом'
  };
  return typeNames[type];
};

var renderPin = function (advert) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = advert.location.x - SHIFT_LEFT + 'px';
  pinElement.style.top = advert.location.y - SHIFT_TOP + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;

  return pinElement;
};

var createFeatures = function (features) {
  var fragmentFeatures = document.createDocumentFragment();
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

var renderCard = function (advert) {
  var cardElement = mapCardTemplate.cloneNode(true);

  cardElement.querySelector('img').src = advert.author.avatar;
  cardElement.querySelector('h3').textContent = advert.offer.title;
  cardElement.querySelector('p > small').textContent = advert.offer.address;
  cardElement.querySelector('.popup__price').innerHTML = advert.offer.price + '&#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = getType(advert.offer.type);
  cardElement.querySelector('h4 + p').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  cardElement.querySelector('.popup__features + p').textContent = advert.offer.description;
  cardElement.replaceChild(createFeatures(advert.offer.features), cardElement.querySelector('.popup__features'));

  return cardElement;
};

var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragmentPins = document.createDocumentFragment();
var fragmentCard = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var advertsList = createAdverts(8);

document.querySelector('.map').classList.remove('map--faded');

advertsList.forEach(function (advert) {
  fragmentPins.appendChild(renderPin(advert));
});

mapPins.insertBefore(fragmentPins, mapPins.children[0].nextElementSibling);

fragmentCard.appendChild(renderCard(advertsList[0]));

map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));
