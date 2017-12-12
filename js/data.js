'use strict';

(function () {
  var titlesList = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
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

  var getNumberImage = function (number) {
    return (number < 10) ? '0' + number : number;
  };

  window.data = {
    createAdverts: function (number) {
      var adverts = [];
      for (var i = 0; i < number; i++) {
        var coordinates = {x: window.util.getNumberFromRange(300, 900), y: window.util.getNumberFromRange(100, 500)};
        adverts[i] = {
          author: {avatar: 'img/avatars/user' + getNumberImage(i + 1) + '.png'},
          offer: {
            title: titlesList.splice(window.util.getRandomItem(titlesList), 1)[0],
            address: coordinates.x + ', ' + coordinates.y,
            price: window.util.getNumberFromRange(1000, 1000000),
            type: window.util.getRandomItem(typesList),
            rooms: window.util.getNumberFromRange(1, 5),
            guests: window.util.getNumberFromRange(1, 10),
            checkin: window.util.getRandomItem(timesList),
            checkout: window.util.getRandomItem(timesList),
            features: window.util.getRandomListItems(featuresList),
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
    }
  };
})();
