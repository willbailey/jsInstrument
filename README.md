jsInstrument
============

jsInstrument allows you to measure performance of arbitrary chunks of
application code. 

After including the jsInstrument script in your application
    <script src="jsInstrument.js"></script>

you can use the the start and stop methods to wrap pieces of code
you'd like to measure. start and stop take a descriptive label for the 
block of code you are measuring as an argument.

    $i.start('fullOfStars');
    // some code I'm curious about
    var str = '';
    for (var i = 0; i < 1000; i++) {
      str += '*'; 
    }
    $i.stop('fullOfStars');

jsInstrument is disabled by default. To enable tracking use:
    
    $i.setEnabled(true);
