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
    'jsInstrument',
    'width=600,height=600');
  instrumentsWindow.$i = $i;

  var $i = ns;

  // storage for stats

  var cache;
  $i.clear = function() {
    return cache = {starts: {}, metrics: {}};
  };
  $i.clear();

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

  $i.snapshot = function() {
    addTable();
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
          h2 {color: #aaa}\
          table {-webkit-box-shadow: 3px 3px 3px #ccc;}\
          th, td {padding: 5px}\
          th {background: #990362; color:#fff; font-weight:normal; font-size: 14px; text-align:left}\
          td {background: #fff; font-size:12px}\
          tr {border-bottom: 1px solid #ccc;}\
          .metadata {font-size:11px; color: #aaa; margin:10px 0px 30px 6px}\
          #snapshot {position: absolute; top: 16px; right: 20px;}\
        </style>\
        <body>\
          <h2>JS Instrument ♫</h2>\
          <input type="button" value="snapshot" id="snapshot" />\
          <div id="container"></div>\
        </body>\
      </html>';
      doc.write(template);
      doc.getElementById('snapshot').onclick = $i.snapshot;
      addTable();
    }
    return doc;
  };

  var addTable = function() {
    var tableTemplate =
      '<table width="100%" cellspacing="0" border="0">\
       </table>\
       <div class="metadata">started at: ' + new Date() + '</div>';
    var doc = instrumentsWindow.document;
    var container = doc.getElementById('container');
    var html = container.innerHTML;
    container.innerHTML = tableTemplate + html;
  };

  // generate a friendly time format
  var formatTime = function(ms) {
    if (ms < 1000) {
      return (ms + '').substr(0, 6) + 'ms';
    }
    if (ms > 1000 && ms < 60000) {
      return ((ms / 1000) + '').substr(0, 6) + 's';
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
    var dataTable = doc.getElementsByTagName('table')[0];
    dataTable.innerHTML = '';
    dataTable.innerHTML = '<tr><th>label</th><th>runs</th><th>avg</th><th>max</th><th>min</th></tr>';
    for (metric in cache.metrics) {
      if (cache.metrics.hasOwnProperty(metric)) {
        var data = cache.metrics[metric];
        var dataRow = generateDataRow(metric, data);
        dataTable.innerHTML += dataRow;
      }
    }
  };
  setInterval(updateStats, 100);
})($i);

