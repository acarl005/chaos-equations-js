var express = require('express');
var app = express();

app.use('/chaos-equations-js', express.static('dist'));

var listener = app.listen(1234, function () {
  console.log('Listening at http://localhost:' + listener.address().port + '/chaos-equations-js');
});
