'use strict';
(function () {
  var SHIFT_MAINPIN_Y = 47;
  var UP_LIMIT = 53;
  var DOWN_LIMIT = 453;
  var LEFT_LIMIT = 3;
  var RIGHT_LIMIT = 1197;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;
  var MAX_PIN = 5;
  var map = document.querySelector('.map');
  var blockPin = map.querySelector('.map__pins');
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

  var checkFilter = function (valueFilter, valueData) {
    if (valueFilter && valueFilter !== valueData) {
      return false;
    }
    return true;
  };

  var checkFilters = function (valueFilter, items, dataItems) {
    return items.every(function (item) {
      var value = valueFilter['filter-' + item];

      if (typeof value === 'undefined') {
        return true;
      }
      return dataItems.some(function (dataItem) {
        return dataItem === valueFilter['filter-' + item];
      });
    });
  };

  var getPrice = function (price) {
    if (price <= LOW_PRICE) {
      return 'low';
    }
    if (price >= HIGH_PRICE) {
      return 'high';
    }
    return 'middle';
  };

  window.render = debounce(function () {
    var pinFragment = document.createDocumentFragment();
    var cardFragment = document.createDocumentFragment();
    var pins = blockPin.querySelectorAll('.map__pin');
    var cards = map.querySelectorAll('.map__card');

    pins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        blockPin.removeChild(pin);
      }
    });

    cards.forEach(function (card) {
      map.removeChild(card);
    });

    var count = 0;
    var items = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

    for (var i = 0; i < window.backend.adverts.length; i++) {
      if (count >= MAX_PIN) {
        break;
      }

      var advert = window.backend.adverts[i];
      var offer = advert.offer;

      switch (false) {
        case checkFilter(filterValue['housing-type'], offer.type):
        case checkFilter(filterValue['housing-price'], getPrice(offer.price)):
        case checkFilter(+filterValue['housing-rooms'], offer.rooms):
        case checkFilter(+filterValue['housing-guests'], offer.guests):
        case checkFilters(filterValue, items, offer.features):
          continue;
      }

      pinFragment.appendChild(window.pin.render(window.backend.adverts[i]));
      cardFragment.appendChild(window.card.render(window.backend.adverts[i]));
      count += 1;
    }
    blockPin.insertBefore(pinFragment, mainPin);
    map.insertBefore(cardFragment, map.querySelector('.map__filters-container'));

  }, 500);

  var getCoord = function (coord, min, max) {
    if (coord < min) {
      return min;
    } else if (coord > max) {
      return max;
    }
    return coord;
  };

  window.backend.load(window.showError);

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

      mainPin.style.top = getCoord(mainPin.offsetTop - shift.y, UP_LIMIT, DOWN_LIMIT) + 'px';
      mainPin.style.left = getCoord(mainPin.offsetLeft - shift.x, LEFT_LIMIT, RIGHT_LIMIT) + 'px';

      inputAddress.value = 'x: ' + parseFloat(mainPin.style.left) + ', y: ' + (parseFloat(mainPin.style.top) + SHIFT_MAINPIN_Y);
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
