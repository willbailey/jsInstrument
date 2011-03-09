jsInstrument
============

jsInstrument allows you to measure performance of arbitrary chunks of
application code. 

After including the jsInstrument script in your application
    <script src="jsInstrument.js"></script>

you can use the the $i.start(label) and $i.stop(label) to wrap pieces of code
you'd like to measure. jsInstrument is disabled by default. To enable tracking use:
    
    $i.setEnabled(true);
