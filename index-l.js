var h = window.innerHeight;
var w = window.innerWidth;

var time = 0;
var num = 800;

var noise = new SimplexNoise();
var seed = 500 + 100 * Math.random();
var data = [seed];
var averages_50 = [0];
var averages_25 = [0];
var deltas = [seed];

var latestData = [seed];
var latestAverages_50 = [0];
var latestAverages_25 = [0];
var latestDeltas = [seed];

var x = d3.scale.linear().range([0, w - 40]);
var y = d3.scale.linear().range([h - 40, 0]);

var xAxis = d3.svg.axis().
scale(x).
orient('bottom').
innerTickSize(-h + 4).
outerTickSize(0).
tickPadding(10);

var yAxis = d3.svg.axis().
scale(y).
orient('left').
innerTickSize(-w + 40).
outerTickSize(0).
tickPadding(10);

var line = d3.svg.line().
x(function (d, i) {return x(i + time - num);}).
y(function (d) {return y(d);});

var svg = d3.select('body').append('svg').
attr({ width: w, height: h }).
append('g').
attr('transform', 'translate(30, 20)');

var $xAxis = svg.append('g').
attr('class', 'x axis').
attr('transform', 'translate(0, ' + (h - 40) + ')').
call(xAxis);

var $yAxis = svg.append('g').
attr('class', 'y axis').
call(yAxis);

var $data = svg.append('path').
attr('class', 'line data');

var $averages_50 = svg.append('path').
attr('class', 'line average-50');

var $averages_25 = svg.append('path').
attr('class', 'line average-25');

var $rects = svg.selectAll('rect').
data(d3.range(num)).
enter().
append('rect').
attr('width', (w - 40) / num).
attr('x', function (d, i) {return i * (w - 40) / num;});

var legend = svg.append('g').
attr('transform', 'translate(20, 20)').
selectAll('g').
data([['Value', '#fff'], ['Trailing Average - 50', '#0ff'], ['Trailing Average - 25', '#ff0']]).
enter().
append('g');

legend.
append('circle').
attr('fill', function (d) {return d[1];}).
attr('r', 5).
attr('cx', 0).
attr('cy', function (d, i) {return i * 15;});

legend.
append('text').
text(function (d) {return d[0];}).
attr('transform', function (d, i) {return 'translate(10, ' + (i * 15 + 4) + ')';});

function tick() {
  time++;
  data[time] = data[time - 1] + noise.noise2D(seed, time / 2);
  data[time] = Math.max(data[time], 0);

  if (time <= 50) {
    var a = 0;
    for (var j = 0; j < time; j++) {
      a += data[time - j];
    }
    a /= 50;
    averages_50[time] = a;
  } else
  {
    var _a = averages_50[time - 1] * 50 - data[time - 50];
    _a += data[time];
    _a /= 50;
    averages_50[time] = _a;
  }

  if (time <= 25) {
    var _a2 = 0;
    for (var _j = 0; _j < time; _j++) {
      _a2 += data[time - _j];
    }
    _a2 /= 25;
    averages_25[time] = _a2;
  } else
  {
    var _a3 = averages_25[time - 1] * 25 - data[time - 25];
    _a3 += data[time];
    _a3 /= 25;
    averages_25[time] = _a3;
  }

  deltas[time] = data[time] - data[time - 1];

  if (time <= num) {
    latestData = data.slice(-num);
    latestAverages_50 = averages_50.slice(-num);
    latestAverages_25 = averages_25.slice(-num);
    latestDeltas = deltas.slice(-num);
  } else
  {
    latestData.shift();
    latestAverages_50.shift();
    latestAverages_25.shift();
    latestDeltas.shift();
    latestData.push(data[time]);
    latestAverages_50.push(averages_50[time]);
    latestAverages_25.push(averages_25[time]);
    latestDeltas.push(deltas[time]);
  }
}

function update() {
  x.domain([time - num, time]);
  var yDom = d3.extent(latestData);
  yDom[0] = Math.max(yDom[0] - 1, 0);
  yDom[1] += 1;
  y.domain(yDom);

  $xAxis.
  call(xAxis);

  $yAxis.
  call(yAxis);

  $data.
  datum(latestData).
  attr('d', line);

  $averages_50.
  datum(latestAverages_50).
  attr('d', line);

  $averages_25.
  datum(latestAverages_25).
  attr('d', line);

  $rects.
  attr('height', function (_, i) {return Math.abs(latestDeltas[i] * h / 10);}).
  attr('fill', function (_, i) {return latestDeltas[i] < 0 ? 'red' : 'green';}).
  attr('y', function (_, i) {return h - Math.abs(latestDeltas[i] * h / 10) - 42;});
}

for (var i = 0; i < num + 50; i++) {
  tick();
}

update();

setInterval(function () {
  tick();
  update();
}, 60);