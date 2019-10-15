'use strict';
var OFFER_TITLES = [
  'сдается жилье',
  'уютная квартирка',
  'просторное жилье',
  'жилье без животных',
  'апартамены в центре',
  'шикарный пентхауз',
  'старая хрущевка',
  'новый евроремон'
];
var APARTAMENT_TYPE = [
  'пентаус',
  'квартира',
  'дом',
  'бунгало',
  'апартаменты',
  'общежитие'
];
var CHECKIN_TIME = [
  '12:00',
  '13:00',
  '14:00'
];
var CHECKOUT_TIME = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var APARTAMENT_PHOTO = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
var SHIFT_PIN = {
  x: 25,
  y: 70
};
var SIDE_INDENT = 50;
var NUMBER_OF_OBJECTS = 8;

// гнерируем DOM элементы, соответствующие меткам на карте
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content;
var pin = pinTemplate.querySelector('.map__pin');
var mainPin = document.querySelector('.map__pin--main');
var form = document.querySelector('.ad-form');

mainPin.addEventListener('mousedown', function () {
  form.classList.remove('ad-form--disabled');
  mapPins.prepend(placeAdsOnTheMap);
  generateCard();
});
var onMouseMove = function (moveEvt) {
  moveEvt.preventDefault();
  dragged = true;
var shift = {
  x: startCoords.x - moveEvt.clientX,
  y: startCoords.y - moveEvt.clientY
};
startCoords = {
  x:moveEvt.clientX,
  y:moveEvt.clientY
};
}
//получаем случайное количество элементов из массива
var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};
// ищем случайное число из интервала
var getRandomNumber = function (max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// генератор массива случайной длины из заданного массива
var generateRandomArray = function (arr) {
  var randomArr = [];
  var count = getRandomNumber(1, arr.length); 
  var copyArr = arr.slice();
  for (var i = 0; i < count; i++) {
    var randomElement = getRandomElement(copyArr);
    copyArr = copyArr.filter(function (item) {
      return randomElement !== item;
    });
    randomArr.push(randomElement);
  }
  return randomArr;
};

// генерация шаблонного объекта с данными
var crateSimilarAdd = function () {
  var positionX = getRandomNumber(SIDE_INDENT, map.clientHeight - SIDE_INDENT);
  var positionY = getRandomNumber(130, 630);
  return {
    'author': {
      'avatar': 'img/avatars/user0' + getRandomNumber(1, 8) + '.png'
    },
    'offer': {
      'title': getRandomElement(OFFER_TITLES),
      'type': getRandomElement(APARTAMENT_TYPE),
      'address': positionX + ', ' + positionY,
      'price': getRandomNumber(1000, 50000),
      'guests': getRandomNumber(1, 6),
      'rooms': getRandomNumber(1, 6),
      'checkin': getRandomElement(CHECKIN_TIME),
      'checkout': getRandomElement(CHECKOUT_TIME),
      'featurs': generateRandomArray(FEATURES),
      'photos': generateRandomArray(APARTAMENT_PHOTO),
    },
    'location': {
      'x': positionX,
      'y': positionY
    }
  };
};
// генерация массива с объктами данных
var generateAds = function (count) {
  var ads = [];
  for (var i = 0; i < count; i++) {
    ads.push(crateSimilarAdd());
  }
  return ads;
};
var ads = generateAds(NUMBER_OF_OBJECTS);


var generatePin = function (pinData) {
  var clonePin = pin.cloneNode(true);
  var pinImg = clonePin.querySelector('img');
  clonePin.style.left = pinData.location.x - SHIFT_PIN.x + 'px';
  clonePin.style.top = pinData.location.y - SHIFT_PIN.y + 'px';
  pinImg.src = pinData.author.avatar;
  pinImg.alt = pinData.author.title;
  return clonePin;
};
var renderPinsFromArray = function (dataArray) {
  var fragment = new DocumentFragment(); 
  for (var i = 0; i < dataArray.length; i++) { 
    fragment.prepend(generatePin(dataArray[i]));
  }
  return fragment;
};

var placeAdsOnTheMap = renderPinsFromArray(ads);
