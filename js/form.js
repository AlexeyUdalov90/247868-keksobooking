'use strict';

(function () {
  var advertForm = document.querySelector('.notice__form');
  var fieldsetsNoticeForm = advertForm.querySelectorAll('fieldset');
  var selectTimeIn = advertForm.querySelector('#timein');
  var selectTimeOut = advertForm.querySelector('#timeout');
  var selectType = advertForm.querySelector('#type');
  var inputPrice = advertForm.querySelector('#price');
  var selectRooms = advertForm.querySelector('#room_number');
  var selectCapacity = advertForm.querySelector('#capacity');
  var inputTitle = advertForm.querySelector('#title');
  var resetBtn = advertForm.querySelector('.form__reset');
  var features = advertForm.querySelectorAll('.features input[type = "checkbox"]');
  var description = advertForm.querySelector('#description');

  var minPricesHouseroom = ['1000', '0', '5000', '10000'];
  var typesHouseroom = ['flat', 'bungalo', 'house', 'palace'];
  var timesIn = ['12:00', '13:00', '14:00'];
  var timesOut = ['12:00', '13:00', '14:00'];

  var getStandSelectedValue = function (select) {
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
    var valueRoom = selectRooms.value;
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

  var resetClickHandler = function (evt) {
    evt.preventDefault();
    inputTitle.value = '';
    inputPrice.value = inputPrice.getAttribute('value');
    getStandSelectedValue(selectType);
    getStandSelectedValue(selectRooms);
    getStandSelectedValue(selectTimeIn);
    window.synchronizeFields(selectType, inputPrice, typesHouseroom, minPricesHouseroom, changeMinValue);
    features.forEach(function (item) {
      item.checked = false;
    });
    changeSelectOptions(selectCapacity, selectRooms.value);
    window.synchronizeFields(selectType, inputPrice, changeMinValue);
    description.value = '';
  };

  window.util.disableItems(fieldsetsNoticeForm, true);

  selectTimeIn.addEventListener('change', function () {
    window.synchronizeFields(selectTimeIn, selectTimeOut, timesIn, timesOut, syncValues);
  });

  selectTimeOut.addEventListener('change', function () {
    window.synchronizeFields(selectTimeOut, selectTimeIn, timesOut, timesIn, syncValues);
  });

  selectType.addEventListener('change', function () {
    window.synchronizeFields(selectType, inputPrice, typesHouseroom, minPricesHouseroom, changeMinValue);
  });

  selectRooms.addEventListener('change', function () {
    changeSelectOptions(selectCapacity, selectRooms.value);
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
      inputTitle.setCustomValidity('Заголовок должен состоять минимум из ' + inputTitle.minlength + ' символов');
      window.util.drawColorBorder(inputTitle, 'red');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Заголовок должен состоять максимум из ' + inputTitle.maxlength + ' символов');
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

  resetBtn.addEventListener('click', resetClickHandler);

  document.addEventListener('DOMContentLoaded', function () {
    changeSelectOptions(selectCapacity, selectRooms.value);
    window.synchronizeFields(selectType, inputPrice, typesHouseroom, minPricesHouseroom, changeMinValue);
  });

})();
