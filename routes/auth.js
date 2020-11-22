const router = require('express').Router();
const { check, validationResult} = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const ProtectedRoutes = require('../middlewares/protectedRoutes');
const controller = require('../controller/file.controller');
const io = require('../index');

router.post("/register", [
      check("username", "Veuillez entrer un nom d'utilisateur valide")
        .not()
        .isEmpty(),
      check("email", "Veuillez entrer un email valide").isEmail(),
      check("password", "Veuillez entrer un mot de passe valide (+ 6 caractères)").isLength({
          min: 6
      })
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({
              msg: errors.array()[0].msg
          });
      }
      const {
          username,
          email,
          password
      } = req.body;
      try {
          let user = await User.findOne({
              email
          });
          if (user) {
              return res.status(400).json({
                  msg: "Cette adresse mail est déjà utilisée"
              });
          }

          user = new User({
              username,
              email,
              password
          });

          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(password, salt);

          await user.save();

          const payload = {
              user: {
                  id_user: user.id_user
              }
          };

          jwt.sign(
            payload,
            process.env.SECRET, {
                expiresIn: 10000
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token,
                    msg: "Compte créé avec succès"
                });
            }
          );
      } catch (err) {
          console.log(err.message);
          res.status(500).send("Sauvegarde impossible");
      }
  }
);


router.post("/login",[
      check("email", "Veuillez entrer un email valide").isEmail(),
      check("password", "Veuillez entrer un mot de passe valide (+ 6 caractères)").isLength({
          min: 6
      })
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({
              msg: errors.array()[0].msg
          });
      }
      const { email, password } = req.body;
      try {
          let user = await User.findOne({
              email
          });
          if (!user)
              return res.status(400).json({
                  msg: "L'utilisateur n'existe pas"
              });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch)
              return res.status(400).json({
                  msg: "Mot de passe incorrect !"
              });

          const payload = {
              user: {
                  id_user: user.id_user
              }
          };
          jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err;

                return res.status(200).json({
                    token,
                    msg: "Utilisateur connecté"
                });
            }
          );
      } catch (e) {
          console.error(e);
          return res.status(500).json({
              msg: "Erreur du serveur"
          });
      }
  }
);

router.post('/getProfile', ProtectedRoutes, async (req, res) => {
    const id_user = req.decoded.user.id_user;

    try {
        let user = await User.findOne({id_user: id_user});
        
        if (!user) return res.status(400).json({message: "User not found"});
        console.log({user})
        res.status(200).json({user});

    } catch (err) {
        return res.status(400).json({message: "Error getting user informations", error: err});
    }
    

    
})

router.post('/update', 
    ProtectedRoutes, 
    [
        check("username", "Veuillez entrer un nom d'utilisateur valide")
        .not()
        .isEmpty(),
        check("email", "Veuillez entrer un email valide").isEmail(),
        check("password", "Veuillez entrer un mot de passe valide (+ 6 caractères)").isLength({
          min: 6
        })
    ], async (req, res) => {
        
    const id_user = req.decoded.user.id_user;
    const {username, email, password} = req.body;

    // update

    const salt = await bcrypt.genSalt(10);
    let passwd = await bcrypt.hash(password, salt);

    User.updateOne({id_user: id_user}, {
        username: username,
        email: email,
        password: passwd
    }, function (err) {
        if (err) res.status(400).json({ message: "There is an error updating the user", error: err});
    })

    res.status(200).json({
        message: "User updated successfully"
    })

})

router.post('/uploadAvatar', ProtectedRoutes, controller.upload, (req, res) => {
    
    const id_user = req.decoded.user.id_user;
    const avatar = req.file.filename;
    console.log(req.file);

    User.findOneAndUpdate({id_user: id_user}, {
        avatar: avatar
    }, function (err) {
        if (err) res.status(400).json({ message: "There is an error in avatar upload", error: err});
    })

    res.status(200).json({message: "Avatar uploaded successfully", avatar: avatar});
})

module.exports = router;