var express = require('express');
var router = express.Router();
let Poll = require('./../models/poll');
// let Question = require('./../models/Questions');
// let Answer = require('./../models/answers');
// let User = require('./../models/user');

router.get('/', (req, res, next) => {
  Poll.find().exec((err, polls) => {
      res.render('poll', { polls });
  });
});

router.post('/:pollId/vote', (req, res, next) => {
  const choice = req.body.choice;
  const identifier = `choices.${choice}.votes`;
  Poll.update({_id: req.params.pollId}, {$inc: {[identifier]: 1}}, {}, (err, numberAffected) => {
    if (err) {
          alert('update vote error');
    }
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

/* GET create page. */
router.get('/create-poll', function(req, res) {
  res.render('createPoll', { title: 'VibeCheck' });
});

// router.post('/create-poll/create', function(req, res) {
//   var newPoll= new Poll();
//   var numberOfChoices = req.body.numberOfChoices;
//   newPoll= req.body.topic;

//   for (i = 0; i < numberOfChoices; i++){
//   newPoll.choice = {req.body.choice, ;

//   }

//   newPoll.save(function(err) {
//       if (err) {
          
//           // res.status(422);
//           // // check for duplicate username
//           // if (err.name === 'MongoError' && err.code === 11000) {
//           //     return res.json({ success: false, duplicateUser: true});
//           // }

//           return res.json({ success: false, error: err}) // probably should redirect to dedicated error page.
//       }

//       res.json({ success: true});
//   });
// });


module.exports = router;
