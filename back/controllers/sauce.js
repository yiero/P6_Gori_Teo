const Sauce = require('../models/Sauce');
const user = require('../middleware/auth');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce ({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    //const likes = 0; // taille du array UserLiked
    //const dislikes = 0;
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
      .catch(error => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
       .then(sauces => res.status(200).json(sauces))
       .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
       .then(sauces => res.status(200).json(sauces))
       .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id}) 
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch((error) => res.status(400).json({ error }));
      })
    },
  )
  .catch(error => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(() => res.status(200).json( {message: 'Sauce aimée !' }))
      .catch(error => res.status(404).json({ error }));
  //1 = like;
  //0 = unlike;
  //2 = dislike;
  //usersLiked = Sauce.usersLiked;
  //usersLiked.push(req.auth);

  //for (var i = 0; i < userLiked.lenght; i++) {
  //  if (req.auth === userId) {
  //      userLiked.splice(i, 1);
  //  }
  //}

  //if (1 == like){
  //  userLiked.push(req.auth);
  //}
  //like = usersLiked.lenght
};

// userId dans le middleware req.auth