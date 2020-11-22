const { check, validationResult} = require("express-validator");
const router = require('express').Router();
const ProtectedRoutes = require('../middlewares/protectedRoutes');
const Room = require("../models/Room");

router.post("/createRoom", ProtectedRoutes, [
    check("name", "Please enter a valid name")
    .not()
    .isEmpty()
    ], 
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({
                errors: error.array()
            });
        }

        const {name, id_user} = req.body;

        try {
            let room = await Room.findOne({
                name
            })
            if (room) {
                return res.status(400).json({
                    message: "Room already exists"
                });
            }

            room = new Room({
                name,
                id_user
            })

            await room.save();

            res.status(200).send(room);
        } catch (err) {
            console.log(err);
            res.status(500).send("Error in saving");
        }
});

router.delete("/deleteRoom", ProtectedRoutes, (req, res) => {
    Room.findOneAndDelete({id_room: req.body.id_room})
    .exec((err, message) => {
        if (err) return res.status(400).json({message: 'There are an error deleting the message', error: err});
        res.status(200).json({message: 'Room deleted successfully', deletedRoom: message});
    })
})

router.get("/getRooms", ProtectedRoutes, (req, res) => {
    Room.find({})
    .exec((err, rooms) => {
        if (err) return res.status(400).json({message: 'There is an error getting all rooms', error: err});
        res.status(200).json({rooms: rooms});
    })
})

module.exports = router;