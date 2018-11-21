var path = require('path');
var callsite = require('callsite');
var fs = require('fs');

var Utils = {
  _emptyFn: function(){},

  timer: {
    delay: function(options) {
      var callback = options.callback;
      var delay = options.delay || 0;
      var context = options.context || this;

      var timeoutId = setTimeout(function() {
        clearTimeout(timeoutId);
        callback.call(context);
      }, delay);
    },
    repeat: function(options) {
      var tickCallback = options.tickCallback;
      var endCallback = options.endCallback || Utils._emptyFn;

      var interval = options.interval;
      var times = options.times || -1;
      var delay = options.delay || 0;
      var context = options.context || this;

      Utils.timer.delay({
        callback: function() {
          tickCallback.call(context);

          var count = 0;
          var intervalId = setInterval(function() {
            tickCallback.call(context);
            if (++count == times) {
              clearInterval(intervalId);
              endCallback.call(context);
            }
          }, interval);
        },
        delay: delay,
        context: context
      });
    }
  },

  array: {
    removeElement: function(array, element) {
      var index = array.indexOf(element);
      if (index > -1) {
        array.splice(index, 1);
      }
    },
    removeElementBy: function(array, field, value) {
      for (var index in array) {
        var element = array[index];
        if (Utils.object.getPropertyValue(element, field) == value) {
          array.splice(index, 1);
        }
      }
    },
    forEach: function(array, callback) {
      for (var index in array) {
        callback(array[index], index);
      }
    }
  },

  object: {
    copy: function(original, target) {
      for (var index in original) {
        target[index] = original[index];
      }
    },
    getKeys: function(object) {
      var keys = [];
      for (var index in object) {
        keys.push(index);
      }

      return keys;
    },
    getPropertyValue: function(properties, path) {
      var paths = path.split(".");

      var currentElement = properties;
      for (var index in paths) {
        currentElement = currentElement[paths[index]];
      }

      return currentElement;
    },
    setPropertyValue: function(properties, paths, value) {
      if (typeof paths === "string") {
        paths = paths.split(".");
      }

      if (paths.length > 1) {
        var element = paths.shift();
        Utils.object.setPropertyValue(properties[element] = Object.prototype.toString.call(properties[element]) === "[object Object]" ? properties[element]: {}, paths, value);
      } else {
        properties[paths[0]] = value;
      }
    },
    findObjectInCollectionBy: function(collection, field, value) {
      for (var index in collection) {
        var element = collection[index];

        if (Utils.object.getPropertyValue(element, field) == value) {
          return element;
        }
      }
      return null;
    },
    cloneObject: function(object, propertiesToClone) {
      var clone = {};
      Utils.object.mergeObject(object, clone, propertiesToClone);
      return clone;
    },

    mergeObject: function(fromObject, toObject, propertiesToMerge) {
      for (var index in fromObject) {
        if (propertiesToMerge != null) {
          if (propertiesToMerge.indexOf(index) == -1) {
            continue;
          }
        }

        if (typeof fromObject[index] == "object") {
          toObject[index] = Utils.object.cloneObject(fromObject[index]);
        } else {
          toObject[index] = fromObject[index];
        }
      }
    }
  },

  random: {
    uniqueId: function(length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

      if (!length) {
        length = 15;
      }

      var str = '';
      for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    },
    nextInt: function(min, max) {
      return parseInt(Utils.random.nextDouble(min, max));
    },
    nextDouble: function(min, max) {
      return Math.random() * (max - min) + min;
    }
  },

  socket: {
    sendToAll: function(players, event, packet) {
      Utils.socket.sendToAllExcept(players, null, event, packet);
    },

    sendToAllExcept: function(players, player, event, packet) {
      for (var index in players) {
        if (players[index] == player) {
          continue;
        }

        players[index].sendPacket(event, packet);
      }
    }
  },

  require: {
    requireUncached: function(moduleName) {
      var stack = callsite();
      var requester = stack[1].getFileName();

      var moduleFullName = path.join(path.dirname(requester), moduleName);
      delete require.cache[require.resolve(moduleFullName)]
      return require(moduleFullName);
    }
  },

  io: {
    readFileAsJSONSync: function(file) {
      var string = fs.readFileSync(file, {encoding: 'utf8'});
      return JSON.parse(string.replace(/\n|\r/g, ""));
    }
  }
}

module.exports = Utils;
