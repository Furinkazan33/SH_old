var require = (function () {
  var modules = {};
  var cache = {};

  function loadScript(url) {
    var xhr = new XMLHttpRequest();

    xhr.open('get', url, false);
    xhr.send();
    if (xhr.status === 200) {
      var fnBody = 'var module = {exports: null};\n' + xhr.responseText + '\nreturn module.exports;';
      cache[url] = (new Function(fnBody)).call({});
    }
  }

  function resolve(module) {
    if (!module.endsWith('.js')) {
      module += '.js';
    }

    var removeTrailingPathCount = 0;

    var index = module.indexOf("../");
    while (index != -1) {
      removeTrailingPathCount++;
      module = module.replace('../', '');
      index = module.indexOf("../");
    }

    try {
      throw new Error();
    }
    catch (e) {
      var stackLines = e.stack.split('\n');
      var callerIndex = 0;
      for (var i in stackLines){
        if (!stackLines[i].match(/http[s]?:\/\//)) {
          continue;
        }

        //We skipped all the lines with out an http so we now have a script reference
        //This one is the class constructor, the next is the getScriptPath() call
        //The one after that is the user code requesting the path info (so offset by 2)
        callerIndex = Number(i) + 2;
        break;
      }

      //Now parse the string for each section we want to return
      var callerPath = stackLines[callerIndex].match(/((http[s]?:\/\/.+\/)([^\/]+\.js)):/)[2];
      if (removeTrailingPathCount > 0) {
        var paths = callerPath.split('/');
        paths.pop();
        for (var i = 0; i < removeTrailingPathCount; i++) {
          paths.pop();
        }

        callerPath = paths.join('/')+'/';
      }

      module = callerPath + module;
    }
    return module;
  }

  function require(module) {
    var url = resolve(module);
    if (!Object.prototype.hasOwnProperty.call(cache, url)) {
      loadScript(url);
    }
    return cache[url];
  }

  require.cache = cache;
  require.resolve = resolve;
  return require;
}());
