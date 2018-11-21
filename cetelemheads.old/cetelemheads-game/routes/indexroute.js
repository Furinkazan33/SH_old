var IndexRoute = {
  index: function(req, res, next) {
    res.render('home/index');
  }
};

module.exports = function(router) {
  router.get('/', IndexRoute.index);
}
