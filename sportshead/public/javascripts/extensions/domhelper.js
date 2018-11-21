'use strict';

define([
  'Phaser'
], function(Phaser) {

  var collectionBase = {
    $elements: null,

    value: function() {
      for (var index in this.$elements) {
        if (this.$elements[index].checked()) {
          return this.$elements[index].value();
        }
      }
    },

    remove: function() {
      for (var index in this.$elements) {
        return this.$elements[index].remove();
      }
    }
  };

  var elementBase = {
    $domElement: null,
    append: function() {
      var args = Array.prototype.slice.call(arguments);
      for (var index in args) {
        var element = args[index];

        if (element.$domElement != null) {
          this.$domElement.appendChild(element.$domElement);
        } else {
          this.$domElement.appendChild(element);
        }
      }
    },
    appendTo: function(parent) {
      parent.append(this);
    },

    preprend: function() {
      var args = Array.prototype.slice.call(arguments);
      for (var index in args) {
        var element = args[index];

        var firstElement = this.$domElement.parent.childNodes[0];
        if (element.$domElement != null) {
          this.$domElement.insertBefore(element.$domElement, firstElement);
        } else {
          this.$domElement.insertBefore(element, firstElement);
        }
      }
    },
    preprendTo: function(parent) {
      parent.prepend(this);
    },

    addEvent: function(eventName, callback) {
      this.$domElement.addEventListener(eventName, callback);
    },

    value: function() {
      if (this.$domElement.nodeName.toLowerCase() == 'select') {
        return this.$domElement.options[this.$domElement.selectedIndex].value;
      } else {
        if (this.$domElement.attributes.toLowerCase())
        return this.$domElement.value;
      }
    },
    checked: function() {
      return this.$domElement.checked;
    },

    setMainComponent: function() {
      DomHelper._container.append(this);
    },

    remove: function() {
      this.$domElement.parentNode.removeChild(this.$domElement);
    }
  };

  var DomHelper = {
    _container: null,
    _body: null,

    _xhr: function() {
      var xhr = null;
      if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
          try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
          } catch(e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          }
        }
        else {
            xhr = new XMLHttpRequest();
        }
      }
      else {
        return null;
      }

      return xhr;

    },

    _clone: function(object) {
      var clone = {};

      for (var index in object) {
        if (typeof object[index] == "object") {
          clone[index] = DomHelper._clone(object[index]);
        } else {
          clone[index] = object[index];
        }
      }

      return clone;
    },

    init: function(containerId) {
      this._container = DomHelper.get.id(containerId);
      this._body = DomHelper.newElement(document.body);
    },

    newElement: function(element) {
      var newElement = DomHelper._clone(elementBase);
      newElement.$domElement = element;
      return newElement;
    },
    newCollection: function() {
      var newCollection = DomHelper._clone(collectionBase);
      newCollection.$elements = [];
      return newCollection;
    },

    load: function(url, callback) {
      var xhr = this._xhr();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
          var div = document.createElement('div');
          div.innerHTML = xhr.responseText;

          callback(DomHelper.newElement(div.firstChild));

          for (var index in div.childNodes) {
            var element = div.childNodes[index];
            if (element.nodeName && element.nodeName.toLowerCase() == 'script') {
              eval(element.innerHTML);
            }
          }
        }
      };

      xhr.open('GET', url, true);
      xhr.send(null);
    },

    get: {
      query: function(selector) {
        return document.querySelector(selector);
      },
      queryAll: function(selector) {
        return document.querySelectorAll(selector);
      },
      id: function(elementId) {
        var element = null;

        var domElement = document.getElementById(elementId);
        if (domElement != null) {
          element = DomHelper.newElement(domElement);
        }

        return element;
      },
      name: function(elementName) {
        var domElements = document.getElementsByName(elementName);

        var newCollection = DomHelper.newCollection(collectionBase);
        for (var index = 0; index < domElements.length; index++) {
          newCollection.$elements.push(DomHelper.newElement(domElements[index]));
        }

        return newCollection;
      },
      container: function() {
        return DomHelper._container;
      },
      body: function() {
        return DomHelper._body;
      }
    },

    add: {
      _createElement: function(elementName, options) {
        options = options || {};

        var domElement = document.createElement(elementName);
        this._buildElementHtmlAttributes(domElement, options);
        return DomHelper.newElement(domElement);
      },
      _buildElementHtmlAttributes: function(element, options) {
        this._buildElementPosition(element, options.x, options.y);
        this._buildElementClasses(element, options.classes);
        this._buildElementInnerHTML(element, options.text);
        this._buildElementValue(element, options.value);

        var htmlAttributes = ['id', 'type', 'min', 'max'];
        for (var index in htmlAttributes) {
          var htmlAttribute = htmlAttributes[index];
          if (options[htmlAttribute] != null) {
            element[htmlAttribute] = options[htmlAttribute];
          }
        }

        var htmlSizeAttributes = ['width', 'height'];
        for (var index in htmlSizeAttributes) {
          var htmlSizeAttribute = htmlSizeAttributes[index];
          if (options[htmlSizeAttribute] != null) {
            element.style[htmlSizeAttribute] = options[htmlSizeAttribute]+'px';
          }
        }

        if (options.events != null) {
          var htmlEvents = ['click', 'submit'];
          for (var index in htmlEvents) {
            var htmlEvent = htmlEvents[index];
            if (options.events[htmlEvent] != null) {
              element.addEventListener(htmlEvent, options.events[htmlEvent], false)
            }
          }
        }
      },
      _buildElementPosition: function(element, x, y) {
        element.style.position = 'relative';
        if (x != null) {
          element.style.left = x+'px';
        }

        if (y != null) {
          element.style.top = y+'px';
        }
      },
      _buildElementClasses: function(element, classes) {
        if (classes != null) {
          element.className = classes.join(' ');
        }
      },
      _buildElementInnerHTML: function(element, innerHTML) {
        if (innerHTML != null) {
          element.innerHTML = innerHTML;
        }
      },
      _buildElementValue: function(element, value) {
        if (value != null) {
          element.value = value;
        }
      },

      button: function(options) {
        return this._createElement('button', options);
      },
      label: function(options) {
        return this._createElement('label', options);
      },
      link: function(options) {
        return this._createElement('a', options);
      },
      input: function(options) {
        return this._createElement('input', options);
      },
      form: function(options) {
        return this._createElement('form', options);
      },
      panel: function(options) {
        return this._createElement('div', options);
      }
    }
  };

  return DomHelper;
});
