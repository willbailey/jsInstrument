var $i;
if (typeof exports !== 'undefined') {
  $i = exports;
} else {
  $i = {};
}

(function(ns) {
  // create the console window
  var instrumentsWindow = window.open(
    '',
    '',
    'width=600,height=600');
  instrumentsWindow.$i = $i;

  var $i = ns;

  // storage for stats
  var cache = cache = {starts: {}, metrics: {}};

  // enable or disable statistics
  $i.setEnabled = function(enabled) {
    $i.__enabled = enabled;
  };

  $i.isEnabled = function() {
    return $i.__enabled;
  };

  // start a labeled timer
  $i.start = function(label){
    if (!$i.__enabled) return;
    cache.starts[label] = new Date().getTime();
  };

  // stop a labeled timer
  $i.stop = function(label){
    if (!$i.__enabled) return;
    var start = cache.starts[label];
    if (start) {
      var stop = new Date().getTime();
      cache.metrics[label] = cache.metrics[label] || [];
      cache.metrics[label].push({
        start: start,
        stop: stop
      });
      delete cache.starts[label];
    }
  };

  // open the console window
  var prepareConsole = function() {
    var doc = instrumentsWindow.document;
    if (doc.body.innerHTML === '') {
      var template =
      '<html>\
        <head></head>\
        <style>\
          * {font-family: helvetia, sans-serif}\
          body {background: #eee}\
          th, td {padding: 5px}\
          th {background: #990362; color:#fff; font-weight:normal; font-size: 14px; text-align:left}\
          td {background: #fff; font-size:12px}\
          tr {border-bottom: 1px solid #ccc;}\
        </style>\
        <body>\
          <h2>JS Instrument ♫</h2>\
          <table id="metrics" width="100%" cellspacing="0" border="0">\
            <tr>\
              <th>label</th>\
              <th>runs</th>\
              <th>avg</th>\
              <th>max</th>\
              <th>min</th>\
            </tr>\
            <tbody id="data"></tbody>\
          </table>\
        </body>\
      </html>';
      doc.write(template);
    }
    return doc;
  };

  // generate a friendly time format
  var formatTime = function(ms) {
    if (ms < 1000) {
      return ms + 'ms';
    }
    if (ms > 1000 && ms < 60000) {
      return (ms / 1000) + 's';
    }
    if (ms > 60000) {
      return (ms / 60000) + 'm';
    }
  };

  // generate a row of metric data
  var generateDataRow = function(metric, data) {
    var sum = 0, min, max;
    for (var i=0; i < data.length; i++) {
      var run = data[i];
      var elapsed = (run.stop - run.start);
      if (!min || elapsed < min) min = elapsed;
      if (!max || elapsed > max) max = elapsed;
      sum += elapsed;
    }
    var avg = formatTime(sum / data.length);
    min = formatTime(min);
    max = formatTime(max);
    var row =
      '<tr>\
         <td>' + metric + '</td>\
         <td>' + data.length + '</td>\
         <td>' + avg + '</td>\
         <td>' + max + '</td>\
         <td>' + min + '</td>\
      </tr>';
    return row;
  };

  // update the stats console window
  var updateStats = function() {
    var doc = prepareConsole();
    var dataTable = doc.getElementById('data');
    dataTable.innerHTML = '';
    for (metric in cache.metrics) {
      if (cache.metrics.hasOwnProperty(metric)) {
        var metrics = doc.getElementById('metrics');
        var data = cache.metrics[metric];
        var dataRow = generateDataRow(metric, data);
        dataTable.innerHTML += dataRow;
      }
    }
  };
  setInterval(updateStats, 100);
})($i);

