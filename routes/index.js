var express = require('express');
var router = express.Router();
let Poll = require('./../models/poll');

// /* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'VibeCheck' });
// });



router.get('/', (req, res, next) => {
  Poll.find().exec((err, polls) => {
      res.render('index', { polls });
  });
});

router.post('/:pollId/vote', (req, res, next) => {
  const choice = req.body.choice;
  const identifier = `choices.${choice}.votes`;
  Poll.update({_id: req.params.pollId}, {$inc: {[identifier]: 1}}, {}, (err, numberAffected) => {
      let Pusher = require('pusher');
      let pusher = new Pusher({
          appId: process.env.PUSHER_APP_ID,
          key: process.env.PUSHER_APP_KEY,
          secret: process.env.PUSHER_APP_SECRET,
          cluster: 'eu'
      });

      let payload = { pollId: req.params.pollId, choice: choice };
      pusher.trigger('poll-events', 'vote', payload, req.body.socketId);

      res.send('');
  });

});

module.exports = router;
