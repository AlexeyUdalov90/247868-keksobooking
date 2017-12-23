'use strict';

(function () {
  var MAX_ROOM = 100;
  var MIN_CAPACITY = 0;
  var formAdvert = document.querySelector('.notice__form');
  var formFieldsets = formAdvert.querySelectorAll('fieldset');
  var advertTimeIn = formAdvert.querySelector('#timein');
  var advertTimeOut = formAdvert.querySelector('#timeout');
  var advertType = formAdvert.querySelector('#type');
  var advertPrice = formAdvert.querySelector('#price');
  var advertRoom = formAdvert.querySelector('#room_number');
  var advertCapacity = formAdvert.querySelector('#capacity');
  var advertTitle = formAdvert.querySelector('#title');
  var advertAddress = formAdvert.querySelector('#address');
  var advertReset = formAdvert.querySelector('.form__reset');
  var advertFeatures = formAdvert.querySelectorAll('.features input[type = "checkbox"]');
  var advertDescription = formAdvert.querySelector('#description');

  var houseRoomMinPrices = ['1000', '0', '5000', '10000'];
  var houseRoomTypes = ['flat', 'bungalo', 'house', 'palace'];
  var timesIn = ['12:00', '13:00', '14:00'];
  var timesOut = ['12:00', '13:00', '14:00'];

  var selectDefaultValue = function (select) {
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].hasAttribute('selected')) {
        select.options[i].selected = true;
      }
    }
  };

  var syncValues = function (element, value) {
    element.value = value;
  };

  var changeSelectOptions = function () {
    var valueRoom = +advertRoom.value;
    window.util.disableItems(advertCapacity.options, false);
    for (var i = 0; i < advertCapacity.options.length; i++) {
      var itemCapacity = advertCapacity.options[i];
      var valueCapacity = +itemCapacity.value;
      if (valueRoom === MAX_ROOM && valueCapacity === MIN_CAPACITY) {
        itemCapacity.selected = true;
      } else if (valueRoom >= valueCapacity && valueRoom !== MAX_ROOM && valueCapacity !== MIN_CAPACITY) {
        itemCapacity.selected = true;
      } else {
        itemCapacity.disabled = true;
      }
    }
  };

  var changeMinValue = function (element, value) {
    element.min = value;
  };

  var resetHandler = function () {
    advertTitle.value = '';
    advertAddress.value = 'x: 0, y: 0';
    advertPrice.value = advertPrice.getAttribute('value');
    selectDefaultValue(advertType);
    selectDefaultValue(advertRoom);
    selectDefaultValue(advertTimeIn);
    window.synchronizeFields(advertType, advertPrice, houseRoomTypes, houseRoomMinPrices, changeMinValue);
    advertFeatures.forEach(function (item) {
      item.checked = false;
    });
    changeSelectOptions(advertCapacity, advertRoom.value);
    window.synchronizeFields(advertType, advertPrice, changeMinValue);
    advertDescription.value = '';
  };

  window.util.disableItems(formFieldsets, true);

  advertTimeIn.addEventListener('change', function () {
    window.synchronizeFields(advertTimeIn, advertTimeOut, timesIn, timesOut, syncValues);
  });

  advertTimeOut.addEventListener('change', function () {
    window.synchronizeFields(advertTimeOut, advertTimeIn, timesOut, timesIn, syncValues);
  });

  advertType.addEventListener('change', function () {
    window.synchronizeFields(advertType, advertPrice, houseRoomTypes, houseRoomMinPrices, changeMinValue);
  });

  advertRoom.addEventListener('change', function () {
    changeSelectOptions(advertCapacity, advertRoom.value);
  });


  advertPrice.addEventListener('invalid', function () {
    if (advertPrice.validity.rangeUnderflow) {
      advertPrice.setCustomValidity('Цена за ночь должна быть больше чем ' + advertPrice.min);
      window.util.drawColorBorder(advertPrice, 'red');
    } else if (advertPrice.validity.rangeOverflow) {
      advertPrice.setCustomValidity('Цена за ночь не должна быть больше чем ' + advertPrice.max);
      window.util.drawColorBorder(advertPrice, 'red');
    } else if (advertPrice.validity.valueMissing) {
      advertPrice.setCustomValidity('Поле обязательно для заполнения');
      window.util.drawColorBorder(advertPrice, 'red');
    } else {
      advertPrice.setCustomValidity('');
    }
  });

  advertTitle.addEventListener('invalid', function () {
    if (advertTitle.validity.tooShort) {
      advertTitle.setCustomValidity('Заголовок должен состоять минимум из ' + advertTitle.minLength + ' символов');
      window.util.drawColorBorder(advertTitle, 'red');
    } else if (advertTitle.validity.tooLong) {
      advertTitle.setCustomValidity('Заголовок должен состоять максимум из ' + advertTitle.maxLength + ' символов');
      window.util.drawColorBorder(advertTitle, 'red');
    } else if (advertTitle.validity.valueMissing) {
      advertTitle.setCustomValidity('Поле обязательно для заполнения');
      window.util.drawColorBorder(advertTitle, 'red');
    } else {
      advertTitle.setCustomValidity('');
    }
  });

  advertPrice.addEventListener('change', function () {
    window.util.drawColorBorder(advertPrice, '');
  });

  advertTitle.addEventListener('change', function () {
    window.util.drawColorBorder(advertTitle, '');
  });

  advertReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetHandler();
  });

  formAdvert.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(formAdvert), resetHandler, window.showError);
  });

  advertAddress.value = 'x: 0, y: 0';
  changeSelectOptions(advertCapacity, advertRoom.value);
  window.synchronizeFields(advertType, advertPrice, houseRoomTypes, houseRoomMinPrices, changeMinValue);

})();
