var memwatch = require('memwatch-next')
  , self = Object.create(memwatch)
  , fs = require('fs')
  , path = require('path')
  , hd = null;

function setup(name_suffix, time_based, file_path) {
  name_suffix = name_suffix || "node";
  process.on('SIGUSR2', function () {
    console.log("Got Signal..");
    if (!hd) {
      console.log("Starting Heap Diff");
      return hd = new memwatch.HeapDiff();
    }

    console.log("Stopping Heap Diff");
    var diff = hd.end();
    var date = "_" + +new Date();
    if (!time_based) {
      date = ""
    }
    file_path = file_path || "/tmp/";
    var file_name = 'heap_diff_' + process.pid + "_" + name_suffix + date + '.json';
    fs.writeFile(path.join(file_path, file_name), JSON.stringify(diff), function (err) {
      console.log("File generate for Heap Diff", file_path, file_name);
      if (err)
        return self.emit('error', err)
    });

    hd = null
  })
}

self.setup = setup;

module.exports = self;
