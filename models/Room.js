const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const RoomSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id_user: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
      }
});

RoomSchema.plugin(AutoIncrement, {inc_field: 'id_room'});
module.exports = mongoose.model("room", RoomSchema);