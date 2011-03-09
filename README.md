jsInstrument
============

jsInstrument allows you to measure performance of arbitrary chunks of
application code. 

After including the jsInstrument script in your application
    <script src="instrument.js"></script>

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

to display the current stats summary run:

    $i.loadConsole();

This will open the console in a new window. Stats are reset after each page refresh;
however, the console will retain the captured summary data. Call loadConsole after
each page refresh to start logging summary data to the console again. 

You can save a run for comparision by pressing the snapshot button in the console window.
