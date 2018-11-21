var path = require('path');
var callsite = require('callsite');

var Utils = {
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
  }
}

module.exports = Utils;
