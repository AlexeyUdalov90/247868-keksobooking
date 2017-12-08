'use strict';
var SHIFT_LEFT = 5;
var SHIFT_TOP = 40;
var ESC_KEYCODE = 27;
var getRandomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getNumberFromRange = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getRandomListItems = function (array) {
  var copyArray = array.slice();
  copyArray.sort(function () {
    return Math.random() - 0.5;
  });
  copyArray.length = Math.floor(Math.random() * copyArray.length);
  return copyArray;
};

var getNumberImage = function (number) {
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
    'bungalo',
    'palace'
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
      author: {avatar: 'img/avatars/user' + getNumberImage(i + 1) + '.png'},
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

var renderPin = function (advert) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style.left = advert.location.x - SHIFT_LEFT + 'px';
  pinElement.style.top = advert.location.y - SHIFT_TOP + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;
  pinElement.classList.add('hidden');
  pinElement.addEventListener('click', pinClickHandler);

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

  cardElement.classList.add('hidden');
  cardElement.querySelector('img').src = advert.author.avatar;
  cardElement.querySelector('h3').textContent = advert.offer.title;
  cardElement.querySelector('p > small').textContent = advert.offer.address;
  cardElement.querySelector('.popup__price').innerHTML = advert.offer.price + '&#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = typesHouseroom[advert.offer.type].name;
  cardElement.querySelector('h4 + p').textContent = advert.offer.rooms + ' комнаты для ' + advert.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  cardElement.querySelector('.popup__features + p').textContent = advert.offer.description;
  cardElement.replaceChild(createFeatures(advert.offer.features), cardElement.querySelector('.popup__features'));
  cardElement.querySelector('.popup__close').addEventListener('click', closePopup);

  return cardElement;
};

var disableItems = function (array, bool) {
  array.forEach(function (item) {
    item.disabled = bool;
  });
};

var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var fragmentPins = document.createDocumentFragment();
var fragmentCard = document.createDocumentFragment();
var mapPinsBlock = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var advertForm = document.querySelector('.notice__form');
var fieldsetsNoticeForm = advertForm.querySelectorAll('fieldset');
var advertsList = createAdverts(8);
var typesHouseroom = {
  flat: {name: 'Квартира', price: 1000},
  bungalo: {name: 'Лачуга', price: 0},
  house: {name: 'Дом', price: 5000},
  palace: {name: 'Дворец', price: 10000}
};

var clickedPin = null;
var showedCard = null;

var pinClickHandler = function (evt) {
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
        document.addEventListener('keydown', popupEscPressHandler);
        break;
      }
    }
  }
};

var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  showedCard.classList.add('hidden');
  clickedPin.classList.remove('map__pin--active');
  document.removeEventListener('keydown', popupEscPressHandler);
};

disableItems(fieldsetsNoticeForm, true);

advertsList.forEach(function (advert) {
  fragmentPins.appendChild(renderPin(advert));
  fragmentCard.appendChild(renderCard(advert));
});

mapPinsBlock.insertBefore(fragmentPins, mainPin);
map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));

var cards = map.querySelectorAll('.popup');
var pins = map.querySelectorAll('.map__pin');

mainPin.addEventListener('mouseup', function () {
  map.classList.remove('map--faded');
  pins.forEach(function (pin) {
    pin.classList.remove('hidden');
  });
  advertForm.classList.remove('notice__form--disabled');
  disableItems(fieldsetsNoticeForm, false);
});

var selectTimeIn = advertForm.querySelector('#timein');
var selectTimeOut = advertForm.querySelector('#timeout');
var selectType = advertForm.querySelector('#type');
var inputPrice = advertForm.querySelector('#price');
var selectRooms = advertForm.querySelector('#room_number');
var selectCapacity = advertForm.querySelector('#capacity');
var inputTitle = advertForm.querySelector('#title');

var syncSelect = function (value, select) {
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === value) {
      select.options[i].selected = true;
      break;
    }
  }
};

selectTimeIn.addEventListener('change', function () {
  syncSelect(selectTimeIn.value, selectTimeOut);
});

selectTimeOut.addEventListener('change', function () {
  syncSelect(selectTimeOut.value, selectTimeIn);
});
