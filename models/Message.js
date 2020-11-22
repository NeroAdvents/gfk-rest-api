const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const MessageSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    id_user: {
        type: Number,
        required: true
    },
    id_room: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
      }
});

MessageSchema.plugin(AutoIncrement, {inc_field: 'id_message'});
module.exports = mongoose.model("message", MessageSchema);