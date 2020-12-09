const Sauce = require('../models/sauce') //import du model sauce
const fs = require('fs') //import du module file system

//middleware pour afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces)
        })
        .catch((error) => {
            res.status(400).json({ error: error })
        })
}

//middleware pour la création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }))
}

//middleware pour afficher une sauce en particulier
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(404).json({ error })
        })
}

//middleware pour la suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.status(500).json({ error }))
}

//middleware pour la modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauce = new Sauce({
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat
    })
    Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => {
            res.status(201).json({ message: 'Sauce modifiée avec succès' })
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

//middleware pour la fonction like
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //like
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId)
                sauce.likes += req.body.like
            }
            //unlike
            else if (req.body.like == 0 && sauce.usersLiked.includes(req.body.userId)) {
                sauce.usersLiked.remove(req.body.userId)
                sauce.likes -= 1
            }
            //dislike
            else if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId)
                sauce.dislikes += 1
            }
            //undislike
            else if (req.body.like == 0 && sauce.usersDisliked.includes(req.body.userId)) {
                sauce.usersDisliked.remove(req.body.userId)
                sauce.dislikes -= 1
            }
        sauce.save()
            .then(() => {
                res.status(200).json({
                    message: 'Sauce liked successfully'
                });
            })
            .catch((error) => {
                res.status(400).json({
                    error: error
                });
            });
    })
};