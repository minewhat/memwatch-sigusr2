var memwatch = require('memwatch-next')
  , self = Object.create(memwatch)
  , fs = require('fs')
  , path = require('path')
  , hd = null;

function setup(name_suffix, date) {
  name_suffix = name_suffix || "node";
  process.on('SIGUSR2', function () {
    if (!hd)
      return hd = new memwatch.HeapDiff();

    var diff = hd.end();
    var date = "_" + +new Date();
    if (!date) {
      date = ""
    }
    fs.writeFile(path.join('/tmp/', 'heap_diff_' + process.pid + "_" + name_suffix + date + '.json'), JSON.stringify(diff), function (err) {
      if (err)
        return self.emit('error', err)
    });

    hd = null
  })
}

self.setup = setup;

module.exports = self;
