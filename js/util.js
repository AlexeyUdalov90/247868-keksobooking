'use strict';

(function () {
  window.util = {
    getRandomItem: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    getNumberFromRange: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    getRandomListItems: function (array) {
      var copyArray = array.slice();
      copyArray.sort(function () {
        return Math.random() - 0.5;
      });
      copyArray.length = Math.floor(Math.random() * copyArray.length);
      return copyArray;
    },

    disableItems: function (array, bool) {
      for (var i = 0; i < array.length; i++) {
        array[i].disabled = bool;
      }
    },

    drawColorBorder: function (item, color) {
      item.style.borderColor = color;
    },

    hasItemInArray: function (array, value) {
      return array.some(function (elArray) {
        return elArray === value;
      });
    }
  };
})();
