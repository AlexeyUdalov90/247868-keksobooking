'use strict';
(function () {
  var SHIFT_MAINPIN_X = 3;
  var SHIFT_MAINPIN_Y = 45;
  var UP_LIMIT_Y = 100;
  var DOWN_LIMIT_Y = 655;
  var LEFT_LIMIT_X = 3;
  var RIGHT_LIMIT_X = 1197;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var map = document.querySelector('.map');
  var mapPinsBlock = map.querySelector('.map__pins');
  var mainPin = map.querySelector('.map__pin--main');
  var advertForm = document.querySelector('.notice__form');
  var inputAddress = advertForm.querySelector('#address');
  var filterForm = map.querySelector('.map__filters');

  var filterValue = {};

  filterForm.addEventListener('change', function (evt) {
    if (evt.target.value !== 'any' || evt.target.checked === true) {
      filterValue[evt.target.id] = evt.target.value;
    }
    if (evt.target.value === 'any' || evt.target.checked === false) {
      delete filterValue[evt.target.id];
    }
    window.render();
  });

  var debounce = function (callback, time) {
    var lastTimeout;

    return function () {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(callback, time);
    };
  };

  window.render = debounce(function () {
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

    var count = 0;

    for (var i = 0; i < window.backend.adverts.length; i++) {
      var price = parseInt(window.backend.adverts[i].offer.price, 10);
      if (count > 4) {
        break;
      }
      if (filterValue['housing-type'] && window.backend.adverts[i].offer.type !== filterValue['housing-type']) {
        continue;
      }
      if (filterValue['housing-price']) {
        if (filterValue['housing-price'] === 'middle' && (price < LOW_PRICE || price > HIGH_PRICE)) {
          continue;
        }
        if (filterValue['housing-price'] === 'low' && price > LOW_PRICE) {
          continue;
        }
        if (filterValue['housing-price'] === 'high' && price < HIGH_PRICE) {
          continue;
        }
      }
      if (filterValue['housing-rooms'] && window.backend.adverts[i].offer.rooms !== parseInt(filterValue['housing-rooms'], 10)) {
        continue;
      }
      if (filterValue['housing-guests'] && window.backend.adverts[i].offer.guests !== parseInt(filterValue['housing-guests'], 10)) {
        continue;
      }
      if (filterValue['filter-wifi'] && window.util.hasItemInArray(window.backend.adverts[i].offer.features, filterValue['filter-wifi']) !== true) {
        continue;
      }
      if (filterValue['filter-dishwasher'] && window.util.hasItemInArray(window.backend.adverts[i].offer.features, filterValue['filter-dishwasher']) !== true) {
        continue;
      }
      if (filterValue['filter-parking'] && window.util.hasItemInArray(window.backend.adverts[i].offer.features, filterValue['filter-parking']) !== true) {
        continue;
      }
      if (filterValue['filter-washer'] && window.util.hasItemInArray(window.backend.adverts[i].offer.features, filterValue['filter-washer']) !== true) {
        continue;
      }
      if (filterValue['filter-elevator'] && window.util.hasItemInArray(window.backend.adverts[i].offer.features, filterValue['filter-elevator']) !== true) {
        continue;
      }
      if (filterValue['filter-conditioner'] && window.util.hasItemInArray(window.backend.adverts[i].offer.features, filterValue['filter-conditioner']) !== true) {
        continue;
      }
      fragmentPins.appendChild(window.pin.render(window.backend.adverts[i]));
      fragmentCard.appendChild(window.card.render(window.backend.adverts[i]));
      count += 1;
    }
    mapPinsBlock.insertBefore(fragmentPins, mainPin);
    map.insertBefore(fragmentCard, map.querySelector('.map__filters-container'));

  }, 500);

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

  window.backend.load(errorHandler);

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
