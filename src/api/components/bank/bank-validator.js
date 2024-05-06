const joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

module.exports = {
  createTransfer: {
    body: {
      jumlah: joi.number().required().label('jumlah'),
      senderId: joi.string().required().label('senderId'),
    },
  },
  updateTransfer: {
    body: {
      jumlah: joi.number().required().label('jumlah'),
    },
  },
};
