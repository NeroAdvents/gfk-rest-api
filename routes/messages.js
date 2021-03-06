const { check, validationResult} = require("express-validator");
const router = require('express').Router();
const ProtectedRoutes = require('../middlewares/protectedRoutes');
const Message = require("../models/Message");
const User = require('../models/User');

router.post("/createMessage", 
    ProtectedRoutes,
    [
        check("message", "Please enter a valid message")
        .not()
        .isEmpty()
    ], 
    async (req, res) => {
        const error = validationResult(req);

        if (!error.isEmpty()){
            return res.status(400).json({
                errors: error.array()
            })
        }

        const {message, id_room, username, avatar} = req.body;
        const id_user = req.decoded.user.id_user;

        try {
            msg = new Message({
                message,
                id_user,
                id_room,
                username,
                avatar
            });

            await msg.save();

            res.status(200).json(msg);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error in saving");
        }

});

router.delete("/deleteMessage", ProtectedRoutes, (req, res) => {
    const id_user = req.decoded.user.id_user;

    Message.findOneAndDelete({id_message: req.body.id_message, id_user: id_user})
    .exec((err, message) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                message: 'There are an error deleting the message', 
                error: err
            });
        }
        res.status(200).json({message: 'Message deleted successfully', deletedMessage: message});
    })
});

router.post("/getMessages", ProtectedRoutes, (req, res) => {

    Message.find({id_room: req.body.id_room})
    .exec((err, messages) => {
        if (err) {
            return res.status(400).json({
                message: "There is an error getting all message from this room",
                error: err
            });
        }
        res.status(200).json({
            messages: messages
        })
    })
});

module.exports = router;