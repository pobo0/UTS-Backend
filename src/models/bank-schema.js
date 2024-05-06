const mongo = require('mongoose');

const bankSchema = {
  transferId: String,
  pengirim: {
    type: mongo.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  penerima: {
    type: mongo.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  jumlah: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
};

module.exports = bankSchema;
