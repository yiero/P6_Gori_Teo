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
    sauce.likes = 0; 
    sauce.dislikes = 0;
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

exports.likeSauce = async (req, res, next) => {
  try {
    let sauce = await Sauce.findById( req.params.id );

  for (var i = 0; i < sauce.usersLiked.length && sauce.usersDisliked.length; i++) {
    if (req.auth.userId == sauce.userId[i]) {
        sauce.usersLiked.splice(i, 1)
        console.log("éffacé !");
    };
  };
    
    if (req.body.like == 1) {                 
      sauce.usersLiked.push(req.auth.userId); 
    }
    if (req.body.like == -1) { 
      sauce.usersDisliked.push(req.auth.userId);
    } 
    sauce.likes = sauce.usersLiked.length;
    sauce.dislikes = sauce.usersDisliked.length;
    sauce.save()
        .then(() => res.status(200).json({ message: 'Interaction mise à jour !' })) 
        .catch(error => res.status(404).json({ error }));
  } catch {
    error => res.status(404).json({ error });
  }
};
