'use strict';

define([
  'Utils'
], function(Utils) {
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

      clone: function(object, propertiesNotToClone) {
        var clone = {};
        Utils.object.merge(object, clone, propertiesNotToClone);
        return clone;
      },

      watchFor: function(configs) {
        var component = configs.component;
        var properties = configs.properties || [];
        var callback = configs.callback || function() {};
        var context = configs.context || this;

        for (var index = 0; index < properties.length; index++) {
          var property = properties[index];

          component.watch(property, function(property, oldValue, newValue) {
            callback.call(context, {
              property: property,
              oldValue: oldValue,
              newValue: newValue
            });

            return newValue;
          });
        }
      },

      merge: function(fromObject, toObject, propertiesNotToMerge) {
        for (var index in fromObject) {
          if (propertiesNotToMerge != null) {
            if (propertiesNotToMerge.indexOf(index) != -1) {
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

      registerListener: function(object, property, callback) {
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

  return Utils;
});
