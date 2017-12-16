'use strict';

(function () {
  var URL_LOAD = 'https://1510.dump.academy/keksobooking/data';
  var URL_SAVE = 'https://1510.dump.academy/keksobooking';

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          default:
            onError('Произошла ошибка загрузки: ' + xhr.status + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Время ожидания ответа ' + xhr.timeout + 'мс истекло');
      });

      xhr.timeout = 20000;
      xhr.open('GET', URL_LOAD);
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            onLoad(xhr.response);
            break;
          default:
            onError('Произошла ошибка отправки: ' + xhr.status + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Время ожидания ответа ' + xhr.timeout + 'мс истекло');
      });

      xhr.timeout = 20000;

      xhr.open('POST', URL_SAVE);
      xhr.send(data);
    }
  };
})();
