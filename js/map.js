'use strict';
(function () {
  var SHIFT_MAINPIN_X = 3;
  var SHIFT_MAINPIN_Y = 45;
  var UP_LIMIT_Y = 100;
  var DOWN_LIMIT_Y = 655;
  var LEFT_LIMIT_X = 3;
  var RIGHT_LIMIT_X = 1197;
  // var AMOUNT_ADVERT = 8;
  var adverts = [];
  var map = document.querySelector('.map');
  var mapPinsBlock = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var advertForm = document.querySelector('.notice__form');
  var inputAddress = advertForm.querySelector('#address');
  var filterForm = map.querySelector('.map__filters');
  // var filterTypeHouseroom = filterForm.querySelector('#housing-type');
  var typeValue;
  var priceValue;
  var roomsValue;
  var guestsValue;
  var wifiValue;

  var successHandler = function (data) {
    adverts = data;
    updateAdverts();
  };

  var getMaxRank = function () {
    var rank = 0;
    for (var i = 0; i < filterForm.elements.length; i++) {
      if (filterForm.elements[i].tagName === 'SELECT' && filterForm.elements[i].value !== 'any') {
        rank += 1;
      } else if (filterForm.elements[i].type === 'checkbox' && filterForm.elements[i].checked === true) {
        rank += 1;
      }
    }
    return rank;
  };

  var lastTimeout;
  filterForm.addEventListener('change', function (evt) {
    if (evt.target.id === 'housing-type') {
      typeValue = evt.target.value;
    }
    if (evt.target.id === 'housing-price') {
      priceValue = evt.target.value;
    }
    if (evt.target.id === 'housing-rooms') {
      roomsValue = evt.target.value;
    }
    if (evt.target.id === 'housing-guests') {
      guestsValue = evt.target.value;
    }
    if (evt.target.id === 'filter-wifi' && evt.target.checked === true) {
      wifiValue = evt.target.value;
    } else if (evt.target.id === 'filter-wifi' && evt.target.checked === false) {
      wifiValue = '';
    }

    debounce(updateAdverts);
  });

  var debounce = function (fn) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      fn();
      var pins = mapPinsBlock.querySelectorAll('.map__pin');
      pins.forEach(function (pin) {
        pin.classList.remove('hidden');
      });
    }, 500);
  };

  var render = function (data) {
    var fragmentPins = document.createDocumentFragment();
    var fragmentCard = document.createDocumentFragment();
    var pins = mapPinsBlock.querySelectorAll('.map__pin');
    var cards = map.querySelectorAll('.map__card');

    pins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        mapPinsBlock.removeChild(pin);
      }
    });

    cards.forEach(function (card) {
      map.removeChild(card);
    });

    var amountAdvert = data.length > 5 ? 5 : data.length;
    for (var i = 0; i < amountAdvert; i++) {
      fragmentPins.appendChild(window.pin.render(data[i]));
      fragmentCard.appendChild(window.card.render(data[i]));
    }
    mapPinsBlock.insertBefore(fragmentPins, mainPin);
    map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));

  };

  var updateAdverts = function () {
    var maxRank = getMaxRank();
    adverts.forEach(function (advert) {
      getRank(advert);
    });
    render(adverts.filter(function (advert) {
      return advert.rank === maxRank;
    }));
  };

  var getRank = function (advert) {
    advert.rank = 0;
    var price = parseInt(advert.offer.price, 10);

    if (advert.offer.type === typeValue) {
      advert.rank += 1;
    }
    if (priceValue === 'middle' && price >= 10000 && price <= 50000) {
      advert.rank += 1;
    } else if (priceValue === 'low' && price <= 10000) {
      advert.rank += 1;
    } else if (priceValue === 'high' && price >= 50000) {
      advert.rank += 1;
    }
    if (parseInt(roomsValue, 10) === advert.offer.rooms) {
      advert.rank += 1;
    }
    if (parseInt(guestsValue, 10) === advert.offer.guests) {
      advert.rank += 1;
    }
    advert.offer.features.forEach(function (el) {
      if (el === wifiValue) {
        advert.rank += 1;
      }
    });

    return advert.rank;
  };

  var errorHandler = function (message) {
    var errorMessage = document.createElement('div');
    errorMessage.style.position = 'fixed';
    errorMessage.style.right = '20px';
    errorMessage.style.top = '20px';
    errorMessage.style.zIndex = '100';
    errorMessage.style.margin = '0';
    errorMessage.style.padding = '10px';
    errorMessage.style.fontSize = '18px';
    errorMessage.style.fontWeight = '700';
    errorMessage.style.color = 'rgb(255, 0, 0)';
    errorMessage.style.borderRadius = '10px';
    errorMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
    errorMessage.textContent = message;

    document.body.insertAdjacentElement('afterbegin', errorMessage);

    setTimeout(function () {
      document.body.removeChild(errorMessage);
    }, 10000);
  };

  var getCoordY = function (y) {
    if (y < UP_LIMIT_Y) {
      return UP_LIMIT_Y;
    } else if (y > DOWN_LIMIT_Y) {
      return DOWN_LIMIT_Y;
    }
    return y;
  };

  var getCoordX = function (x) {
    if (x < LEFT_LIMIT_X) {
      return LEFT_LIMIT_X;
    } else if (x > RIGHT_LIMIT_X) {
      return RIGHT_LIMIT_X;
    }
    return x;
  };

  window.backend.load(successHandler, errorHandler);

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPin.style.top = getCoordY(mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = getCoordX(mainPin.offsetLeft - shift.x) + 'px';

      inputAddress.value = 'x: ' + (parseFloat(mainPin.style.left) - SHIFT_MAINPIN_X) + ', y: ' + (parseFloat(mainPin.style.top) + SHIFT_MAINPIN_Y);
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      map.removeEventListener('mousemove', mouseMoveHandler);
      map.removeEventListener('mouseup', mouseUpHandler);
    };

    map.addEventListener('mousemove', mouseMoveHandler);
    map.addEventListener('mouseup', mouseUpHandler);
  });

})();
