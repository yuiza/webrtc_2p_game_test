var express = require('express');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

/* POST Room Name */
router.post('/', function(req, res){
	console.log(req.body.create);
	console.log(req.body.join);

	res.render('game', {
		title : 'Game',
		create : req.body.create,
		join   : req.body.join
	});
});

module.exports = router;
