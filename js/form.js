'use strict';

(function () {
  var formAdvert = document.querySelector('.notice__form');
  var formFieldsets = formAdvert.querySelectorAll('fieldset');
  var selectTimeIn = formAdvert.querySelector('#timein');
  var selectTimeOut = formAdvert.querySelector('#timeout');
  var selectType = formAdvert.querySelector('#type');
  var inputPrice = formAdvert.querySelector('#price');
  var selectRoom = formAdvert.querySelector('#room_number');
  var selectCapacity = formAdvert.querySelector('#capacity');
  var inputTitle = formAdvert.querySelector('#title');
  var inputAddress = formAdvert.querySelector('#address');
  var resetBtn = formAdvert.querySelector('.form__reset');
  var features = formAdvert.querySelectorAll('.features input[type = "checkbox"]');
  var description = formAdvert.querySelector('#description');

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
    var valueRoom = selectRoom.value;
    window.util.disableItems(selectCapacity.options, false);
    for (var i = 0; i < selectCapacity.options.length; i++) {
      var itemCapacity = selectCapacity.options[i];
      var valueCapacity = itemCapacity.value;
      if (valueRoom === '100' && valueCapacity === '0') {
        itemCapacity.selected = true;
      } else if (valueRoom >= valueCapacity && valueRoom !== '100' && valueCapacity !== '0') {
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
    inputTitle.value = '';
    inputAddress.value = 'x: 0, y: 0';
    inputPrice.value = inputPrice.getAttribute('value');
    selectDefaultValue(selectType);
    selectDefaultValue(selectRoom);
    selectDefaultValue(selectTimeIn);
    window.synchronizeFields(selectType, inputPrice, houseRoomTypes, houseRoomMinPrices, changeMinValue);
    features.forEach(function (item) {
      item.checked = false;
    });
    changeSelectOptions(selectCapacity, selectRoom.value);
    window.synchronizeFields(selectType, inputPrice, changeMinValue);
    description.value = '';
  };

  window.util.disableItems(formFieldsets, true);

  selectTimeIn.addEventListener('change', function () {
    window.synchronizeFields(selectTimeIn, selectTimeOut, timesIn, timesOut, syncValues);
  });

  selectTimeOut.addEventListener('change', function () {
    window.synchronizeFields(selectTimeOut, selectTimeIn, timesOut, timesIn, syncValues);
  });

  selectType.addEventListener('change', function () {
    window.synchronizeFields(selectType, inputPrice, houseRoomTypes, houseRoomMinPrices, changeMinValue);
  });

  selectRoom.addEventListener('change', function () {
    changeSelectOptions(selectCapacity, selectRoom.value);
  });


  inputPrice.addEventListener('invalid', function () {
    if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity('Цена за ночь должна быть больше чем ' + inputPrice.min);
      window.util.drawColorBorder(inputPrice, 'red');
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Цена за ночь не должна быть больше чем ' + inputPrice.max);
      window.util.drawColorBorder(inputPrice, 'red');
    } else if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Поле обязательно для заполнения');
      window.util.drawColorBorder(inputPrice, 'red');
    } else {
      inputPrice.setCustomValidity('');
    }
  });

  inputTitle.addEventListener('invalid', function () {
    if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Заголовок должен состоять минимум из ' + inputTitle.minLength + ' символов');
      window.util.drawColorBorder(inputTitle, 'red');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок должен состоять максимум из ' + inputTitle.maxLength + ' символов');
      window.util.drawColorBorder(inputTitle, 'red');
    } else if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Поле обязательно для заполнения');
      window.util.drawColorBorder(inputTitle, 'red');
    } else {
      inputTitle.setCustomValidity('');
    }
  });

  inputPrice.addEventListener('change', function () {
    window.util.drawColorBorder(inputPrice, '');
  });

  inputTitle.addEventListener('change', function () {
    window.util.drawColorBorder(inputTitle, '');
  });

  resetBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetHandler();
  });

  formAdvert.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(formAdvert), resetHandler, window.showError);
  });

  inputAddress.value = 'x: 0, y: 0';
  changeSelectOptions(selectCapacity, selectRoom.value);
  window.synchronizeFields(selectType, inputPrice, houseRoomTypes, houseRoomMinPrices, changeMinValue);

})();
