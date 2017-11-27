'use strict';

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
        guests: '',
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

document.querySelector('.map').classList.remove('map--faded');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var fragmentPins = document.createDocumentFragment();
var mapPins = document.querySelector('.map__pins');

var renderPin = function (advert) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = advert.location.x - 40 / 2 + 'px';
  pinElement.style.top = advert.location.y - 40 + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;

  return pinElement;
};

createAdverts(8).forEach(function (advert) {
  fragmentPins.appendChild(renderPin(advert));
});

mapPins.insertBefore(fragmentPins, mapPins.firstElementChild.nextElementSibling);
