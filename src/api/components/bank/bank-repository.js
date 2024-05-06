const { transfer } = require('../../../models');

async function getTransfer(userID) {
  try {
    const foundTransfer = await transfer.findById(userID);
    return foundTransfer;
  } catch (error) {
    console.error('Error getting transfer:', error);
    return null;
  }
}

async function updateTransfer(userID, jumlah) {
  try {
    const updatedTransfer = await transfer.updateOne(
      {
        _id: userID,
      },
      {
        $set: {
          jumlah,
        },
      }
    );
    return updatedTransfer;
  } catch (error) {
    console.error('Error updating transfer:', error);
    return null;
  }
}

async function createTransfer(transferId, sender, receiver, jumlah, timestamp) {
  try {
    const newTransfer = await transfer.create({
      transferId,
      sender,
      receiver,
      jumlah,
      timestamp,
    });
    return newTransfer;
  } catch (error) {
    console.error('Error creating transfer:', error);
    return null;
  }
}

async function deleteTransfer(userID) {
  try {
    const deletedTransfer = await transfer.deleteOne({ _id: userID });
    return deletedTransfer;
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return null;
  }
}

async function getTransfers() {
  try {
    const transfers = await transfer.find({});
    return transfers;
  } catch (error) {
    console.error('Error getting transfers:', error);
    return [];
  }
}

module.exports = {
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
  getTransfers,
};
