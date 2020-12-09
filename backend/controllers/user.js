const User = require('../models/User') //import du model user

const bcrypt = require('bcrypt') //import de bcrypt
const jwt = require('jsonwebtoken') //import de jsonwebtoken

//middleware signup pour l'inscription
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //utilisation de bcrypt pour hasher le mot de passe
        .then((hash) => {
            const user = new User({ //cr�e un nouveau user avec le model User
                email: req.body.email, //email du nouvel utilisateur est l'email pr�sent dans le corps de la requ�te
                password: hash //mot de passe du nouvel utilisateur est le mot de passe hach�
            })
            
            user.save() //sauvegarde l'utilisateur dans la base de donn�es
                .then(() => res.status(201).json({ message: 'Utilisateur cr�� !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))

}

//middleware login pour la connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //trouve l'utilisateur de la DB gr�ce � la fonction mongoose findOne     
        .then((user) => {
            if (!user) {
                return res.status(401).json({error: 'Utilisateur non trouv� !'})
            }
            bcrypt.compare(req.body.password, user.password) //compare le mot de passe avec bcrypt
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({error: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'nvlqNak25hq54xbg9HfgKywXJzuvppBTi7VrIGCW', //cl� secr�te pour g�n�rer un token
                            { expiresIn: '24h' }

                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}