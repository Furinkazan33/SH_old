'use strict';

var Utils = {
  object: {

    getAttribute: function(attributes, path) {

      var paths = path.split(".");

      var currentElement = attributes;
      for (var index in paths) {
        currentElement = currentElement[paths[index]];
      }

      return currentElement;
    },

    setAttribute: function(attributes, paths, value) {
      if (typeof paths === "string") {
        paths = paths.split(".");
      }

      if (paths.length > 1) {
        var element = paths.shift();
        Utils.object.setAttribute(attributes[element] = Object.prototype.toString.call(attributes[element]) === "[object Object]" ? attributes[element]: {}, paths, value);
      } else {
        attributes[paths[0]] = value;
      }
    },

    clone: function(object, propertiesToClone) {
      var clone = {};
      Utils.object.merge(object, clone, propertiesToClone);
      return clone;
    },

    merge: function(fromObject, toObject, propertiesToMerge) {
      for (var index in fromObject) {
        if (propertiesToMerge != null) {
          if (propertiesToMerge.indexOf(index) == -1) {
            continue;
          }
        }

        if (typeof fromObject[index] == "object") {
          toObject[index] = Utils.object.clone(fromObject[index]);
        } else {
          toObject[index] = fromObject[index];
        }
      }
    },

    registerListener(object, property, callback) {
      if (object.hasOwnProperty(property)) {
        Object.defineProperty(object, property, {
           get: function() {
             return object[property];
           },
           set: function(value) {
             callback.call(object, property, value);
             return object[property] = value;
           }
        });
      }
    }
  }
};
