const ORANGE = 'ORANGE',
BLUE = 'BLUE',
GREEN = 'GREEN',
GRAY = 'GRAY';

const getCoinIcon = symbol => {
  return `https://s3-us-west-2.amazonaws.com/s.cdpn.io/1468070/${symbol.toLowerCase()}.svg`;
};

const getCoinColor = symbol => {
  switch (symbol) {
    case 'ETH':
    case 'XRP':
    case 'ADA':
    case 'XLM':
    case 'XEM':
    case 'LSK':
    case 'DASH':
      return BLUE;
    case 'BCH':
    case 'USDT':
    case 'NEO':
      return GRAY;
    case 'BTC':
    case 'XMR':
      return ORANGE;
    case 'TRX':
    case 'EOS':
    case 'LTC':
    default:
      return GRAY;}

};

const data = [
{
  id: 1,
  name: "Bitcoin",
  symbol: "BTC",
  rank: 1,
  price: "54,890.90",
  change24hr: "2.03",
  cap: "1,024,979,185,082",
  volume: "49,916,373,331",
  circulating: "18,662,775",
  img: getCoinIcon("BTC"),
  color: getCoinColor("BTC") },

{
  id: 2,
  name: "Ethereum",
  symbol: "ETH",
  rank: 2,
  price: "1,687.48",
  change24hr: "0.01",
  cap: "194,425,866,399",
  volume: "19,938,573,864",
  circulating: "115,177,800",
  img: getCoinIcon("ETH"),
  color: getCoinColor("ETH") },

{
  id: 3,
  name: "Algo",
  symbol: "ALGO",
  rank: 3,
  price: "1.13",
  change24hr: "2.97",
  cap: "2,935,646,070",
  volume: "274,107,979",
  circulating: "2,600,693,651",
  img: "https://www.algorand.com/assets/media-kit/logos/logo-marks/png/algorand_logo_mark_black.png",
  color: getCoinColor("USDT") }];



class App extends React.Component {
  constructor(props) {
    super(props);
    this.getCoins = this.getCoins.bind(this);
    this.setIndex = this.setIndex.bind(this);
    this.state = {
      coins: [],
      index: 0,
      updating: false,
      isLoading: false,
      isShowingTooltip: false };

  }
  componentDidMount() {
    this.getCoins();
    //particlesJS("particles", particlesConfig);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.index !== this.state.index) {
      if (this.state.isShowingTooltip) {
        this.setState({ isShowingTooltip: false });
      }
      this.setState({ updating: true });
      setTimeout(() => {
        this.setState({ updating: false });
      }, 200);
    }
  }
  getCoins() {
    this.setState({ isLoading: true });

    setTimeout(() => {
      this.setState({ coins: data });
      this.setState({ isLoading: false });
    }, 1000);
  }
  mapCoins(coins) {
    return coins.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.rank,
      price: formatNum(coin.price_usd),
      change24hr: coin.percent_change_24h,
      cap: formatNum(coin.market_cap_usd),
      volume: formatNum(coin['24h_volume_usd']),
      circulating: formatNum(coin.available_supply),
      img: this.getCoinIcon(coin.symbol.toLowerCase()),
      color: getCoinColor(coin.symbol) }));

  }
  setIndex(index) {
    this.setState({ index });
  }
  render() {
    const {
      coins,
      index,
      updating,
      isLoading,
      isShowingTooltip } =
    this.state;
    let card = null;
    if (isLoading) {
      card = /*#__PURE__*/
      React.createElement("div", { id: "card-loading" }, /*#__PURE__*/
      React.createElement("div", { id: "card-loading-spinner" }));


    } else
    if (coins.length > 0) {
      card = /*#__PURE__*/
      React.createElement(Card, {
        coins: coins,
        index: index,
        setIndex: this.setIndex });


    }

    return /*#__PURE__*/(
      React.createElement("div", { id: "app", className: updating ? 'updating' : '' }, /*#__PURE__*/
      React.createElement("div", { id: "particles" }), /*#__PURE__*/
      React.createElement("div", { id: "help-tooltip", className: isShowingTooltip ? 'showing' : 'hide' }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-question-circle-o" }), /*#__PURE__*/
      React.createElement("h1", null, /*#__PURE__*/React.createElement("span", { className: "text" }, "Hover over the coin icon and scroll."), /*#__PURE__*/React.createElement("span", { className: "triangle" }))),

      card));


  }}


class Card extends React.Component {
  determineSign(num) {
    return parseFloat(num) >= 0 ? 'positive' : 'negative';
  }
  render() {
    const { coins, index } = this.props,
    coin = coins[index],
    colorClass = getColorClass(coin.color);
    return /*#__PURE__*/(
      React.createElement("div", { id: "card-wrapper", className: colorClass }, /*#__PURE__*/
      React.createElement("div", { id: "card" }, /*#__PURE__*/
      React.createElement("div", { id: "card-left", className: "card-half" }, /*#__PURE__*/
      React.createElement("div", { id: "coin-icon", style: { backgroundImage: `url(${coin.img})` } }), /*#__PURE__*/
      React.createElement("div", { id: "coin-symbol-vert" }, /*#__PURE__*/
      React.createElement("h1", null, coin.symbol)), /*#__PURE__*/

      React.createElement(CoinSelection, {
        coins: coins,
        index: index,
        setIndex: this.props.setIndex })), /*#__PURE__*/


      React.createElement("div", { id: "card-right", className: "card-half" }, /*#__PURE__*/
      React.createElement("div", { id: "card-right-contents" }, /*#__PURE__*/
      React.createElement("div", { id: "coin-header" }, /*#__PURE__*/
      React.createElement("div", { id: "coin-name" }, /*#__PURE__*/
      React.createElement("h1", null, coin.name)), /*#__PURE__*/

      React.createElement("div", { id: "coin-symbol" }, /*#__PURE__*/
      React.createElement("h1", null, coin.symbol)), /*#__PURE__*/

      React.createElement("div", { id: "coin-rank" }, /*#__PURE__*/
      React.createElement("div", { className: "label" }, /*#__PURE__*/
      React.createElement("h1", null, "Rank")), /*#__PURE__*/

      React.createElement("div", { className: "value" }, /*#__PURE__*/
      React.createElement("h1", null, coin.rank)))), /*#__PURE__*/



      React.createElement("div", { id: "coin-price" }, /*#__PURE__*/
      React.createElement("div", { className: "value" }, /*#__PURE__*/
      React.createElement("h1", null, "$", coin.price)), /*#__PURE__*/

      React.createElement("div", { id: "coin-change-24hr", className: this.determineSign(coin.change24hr) }, /*#__PURE__*/
      React.createElement("h1", null, coin.change24hr, "%"))), /*#__PURE__*/


      React.createElement("div", { id: "coin-info" }, /*#__PURE__*/
      React.createElement(CoinInfoField, { value: `$${coin.cap}`, label: "Market Cap" }), /*#__PURE__*/
      React.createElement(CoinInfoField, { value: `$${coin.volume}`, label: "Volume" }), /*#__PURE__*/
      React.createElement(CoinInfoField, { value: `${coin.circulating} ${coin.symbol}`, label: "Circulating Supply" })), /*#__PURE__*/

      React.createElement("div", { id: "card-right-stripes" }))))));





  }}


const CoinInfoField = ({
  value,
  label }) =>
{
  return /*#__PURE__*/(
    React.createElement("div", { className: "coin-info-field" }, /*#__PURE__*/
    React.createElement("div", { className: "value" }, /*#__PURE__*/
    React.createElement("h1", null, value)), /*#__PURE__*/

    React.createElement("div", { className: "label" }, /*#__PURE__*/
    React.createElement("h1", null, label))));



};

class CoinSelection extends React.Component {
  constructor(props) {
    super(props);
    this.setCurrentScrollTop = this.setCurrentScrollTop.bind(this);
    this.moveScrollTop = this.moveScrollTop.bind(this);
    this.onOptionsScroll = this.onOptionsScroll.bind(this);
    this.state = {
      currentScrollTop: 0 };

  }
  setCurrentScrollTop(val) {
    this.setState({ currentScrollTop: val });
  }
  moveScrollTop() {
    this.refs.coinOptions.scrollTop = this.state.currentScrollTop;
  }
  onOptionsScroll() {
    const option = document.getElementsByClassName('coin-option')[0],
    topOffset = window.innerHeight / 2,
    optionHeight = option.clientHeight,
    scrollTop = this.refs.coinOptions.scrollTop,
    newScrollTop = this.props.index * (optionHeight + 20),
    index = Math.max(1, Math.ceil(scrollTop / optionHeight));
    this.setCurrentScrollTop(newScrollTop);
    this.props.setIndex(index - 1);
  }
  render() {
    const coinOptions = this.props.coins.slice(0, 10).map(coin => {
      const selected = this.props.index == coin.rank - 1;
      return /*#__PURE__*/(
        React.createElement("div", { key: coin.symbol, className: `coin-option ${selected ? 'selected' : ''}` }, /*#__PURE__*/
        React.createElement("div", { className: 'coin-option-icon', style: { backgroundImage: `url(${coin.img})` } })));


    });
    return /*#__PURE__*/(
      React.createElement("div", { id: "coin-selection", onMouseLeave: this.moveScrollTop }, /*#__PURE__*/
      React.createElement("div", { id: "coin-options-wrapper",
        ref: "coinOptions",
        className: "scroll-bar",
        onScroll: _.throttle(this.onOptionsScroll, 200) }, /*#__PURE__*/

      React.createElement("div", { id: "coin-options" },
      coinOptions))));




  }}


const formatNum = num => {
  const splitNum = num.split('.'),
  firstHalf = splitNum[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  secondHalf = splitNum[1] ? splitNum[1].substring(0, 2) : splitNum[1];

  return secondHalf ? `${firstHalf}.${secondHalf}` : firstHalf;
};

const getColorClass = color => {
  switch (color) {
    case ORANGE:
      return 'orange';
    case BLUE:
      return 'blue';
    case GREEN:
      return 'green';
    case GRAY:
      return 'gray';}

};

const particlesConfig = {
  "particles": {
    "number": {
      "value": 30 },

    "color": {
      "value": "#607d8b" },

    "size": {
      "value": 2 },

    "line_linked": {
      "enable": true,
      "distance": 350,
      "color": "#607d8b" } },


  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab" },

      "onclick": {
        "enable": false } },


    "modes": {
      "grab": {
        "distance": 500,
        "line_linked": {
          "opacity": 1 } } } } };






ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));