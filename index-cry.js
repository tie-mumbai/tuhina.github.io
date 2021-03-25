var getOldCandles = function () {var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(

  function _callee(product, interval) {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt("return",
            new Promise(function (resolve, reject) {
              $.getJSON(HISTORY_API + "/" + product + "/candles?granularity=" + interval / 1000,
              function (response) {
                response = response.sort(function (a, b) {return a[0] - b[0];});
                for (var i = 1; i < response.length; i++) {
                  response[i][3] = response[i - 1][4];
                }
                var candles = response.map(function (candle) {return {
                    open: candle[3],
                    close: candle[4],
                    min: candle[1],
                    max: candle[2] };});

                resolve(candles);
              });

            }));case 1:case "end":return _context.stop();}}}, _callee, this);}));return function getOldCandles(_x, _x2) {return _ref.apply(this, arguments);};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}var DEFAULT_CANDLE_COUNT = 80;var DEFAULT_CANDLE_INTERVAL = 300000;var DEFAULT_PRODUCT = "LTC-USD";var FEED_URL = "wss://ws-feed.gdax.com";var HISTORY_API = "https://api.gdax.com/products/";var _ws = null;var _interval = null;Vue.filter("price", function (value) {return "$" + parseFloat(Math.round(value * 100) / 100).toFixed(2);});


var ticker = new Vue({
  el: "#ticker",
  data: {
    product: DEFAULT_PRODUCT,
    candles: [],
    candleCount: DEFAULT_CANDLE_COUNT,
    current: {
      open: 0,
      close: 0,
      min: Infinity,
      max: 0 },

    interval: DEFAULT_CANDLE_INTERVAL },

  computed: {
    displayCandles: function displayCandles() {
      if (this.candles.length > this.candleCount) {
        return this.candles.slice(
        Math.max(this.candles.length - this.candleCount, 1));

      } else {
        return this.candles;
      }
    },
    displayBoundsCandles: function displayBoundsCandles() {
      if (this.candles.length > this.candleCount * 2) {
        return this.candles.slice(
        Math.max(this.candles.length - this.candleCount * 2, 1));

      } else {
        return this.candles;
      }
    },
    displayMax: function displayMax() {
      return Math.max.apply(null, [].concat(_toConsumableArray(
      this.displayBoundsCandles.map(function (v) {return v.max;})), [
      this.current.max]));

    },
    displayMin: function displayMin() {
      return Math.min.apply(null, [].concat(_toConsumableArray(
      this.displayBoundsCandles.map(function (v) {return v.min;})), [
      this.current.min]));

    },
    labels: function labels() {
      var min = this.displayMin;
      var max = this.displayMax;
      var diff = max - min;

      if (diff === 0) {
        return [];
      }

      var step = diff / 5;

      var arr = [];

      for (var i = 0; i <= 5 + 1; i++) {
        var val = min + i * step;
        val = parseFloat(Math.round(val * 100) / 100).toFixed(2);
        arr.push(val);
      }

      arr = arr.filter(function (item, i) {return arr.indexOf(item) === i;});

      return arr;
    } },

  mounted: function mounted() {
    this.init();
  },
  watch: {
    product: function product() {
      this.init();
    },
    interval: function interval() {
      this.init();
    } },

  methods: {
    init: function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {var _this = this;var product, candles;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:

                product = this.product;

                this.candles.splice(0);
                this.current.open = 0;
                this.current.close = 0;
                this.current.min = Infinity;
                this.current.max = 0;

                candles = void 0;if (!(

                this.interval >= 10000)) {_context2.next = 15;break;}_context2.next = 10;return (
                  getOldCandles(this.product, this.interval));case 10:candles = _context2.sent;
                this.current.open = candles[candles.length - 1].close;
                this.current.close = candles[candles.length - 1].close;_context2.next = 16;break;case 15:

                candles = [];case 16:


                this.candles = candles;

                if (_ws) {
                  _ws.close();
                }

                _ws = new WebSocket(FEED_URL);
                _ws.onopen = function () {
                  _ws.send(
                  JSON.stringify({
                    type: "subscribe",
                    product_ids: [_this.product],
                    channels: [
                    "ticker",
                    {
                      name: "ticker",
                      product_ids: [_this.product] }] }));




                };

                _ws.onmessage = function (evt) {
                  var response = JSON.parse(evt.data);
                  var price = {
                    // sequence: response.sequence,
                    // time: new Date(response.time),
                    value: parseFloat(response.price) };

                  if (price.value) ticker.add(price, product);
                };

                if (_interval) {
                  clearInterval(_interval);
                }

                _interval = setInterval(function () {
                  var historicVal = {
                    open: _this.current.open,
                    close: _this.current.close,
                    min: _this.current.min,
                    max: _this.current.max };


                  _this.candles.push(historicVal);
                  _this.current.open = historicVal.close;
                  _this.current.close = historicVal.close;
                  _this.current.min = Infinity;
                  _this.current.max = 0;
                }, this.interval);case 23:case "end":return _context2.stop();}}}, _callee2, this);}));function init() {return _ref2.apply(this, arguments);}return init;}(),

    add: function add(price, product) {

      if (product !== this.product) {
        return;
      }

      this.current.close = price.value;
      this.current.open = this.current.open || price.value;
      if (price.value > this.current.max) {
        this.current.max = price.value;
      }
      if (price.value < this.current.min) {
        this.current.min = price.value;
      }
    },
    getCandleHeight: function getCandleHeight(open, close) {
      if (open === Infinity || close === Infinity) {
        return 0;
      }
      var diff = Math.abs(open - close);
      var window = this.displayMax - this.displayMin;
      var heightPerc = diff / window * 100;
      return heightPerc + "%";
    },
    getCandleOffset: function getCandleOffset(open, close) {
      if (open === Infinity || close === Infinity) {
        return 0;
      }

      var top = Math.max(open, close);

      if (!close) {
        top = open;
      }

      var window = this.displayMax - this.displayMin;
      var positionPerc = 100 - (top - this.displayMin) / window * 100;
      return positionPerc + "%";
    } } });