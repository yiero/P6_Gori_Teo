const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce ({
      ...req.body
    });
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
      if (!sauce) {
        return res.status(404).json({
          error: new Error ('Sauce non trouvée !')
        });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error ('Requête non authrisée !')
        });
      }
      Sauce.deleteOne({_id: req.params.id}) 
        .then(() => {res.status(200).json({ message: 'Sauce supprimée !' })})
        .catch((error) => res.status(400).json({ error }));
    }
  );
};