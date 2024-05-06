const bankRepository = require('./bank-repository');
const { hashPassword } = require('../../../utils/password'); // Menghapus import passwordMatched karena tidak digunakan
const { BankTransfer } = require('../../../models/bank-schema'); // Menggunakan nama yang sesuai dengan schema yang diimpor

async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await bankRepository.createUser(name, email, hashedPassword);
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

async function createTransfer(userID, receiverId, jumlah) {
  const transferId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  try {
    const timestamp = Date.now();
    const receiver = await bankRepository.getUser(receiverId);
    const sender = await userRepository.getUser(userID);

    if (!receiver || !sender) {
      return null; // Handle non-existent sender or receiver
    }

    await bankRepository.createTransfer(
      transferId,
      sender,
      receiver,
      jumlah,
      timestamp
    );

    return true;
  } catch (error) {
    console.error('Error creating transfer:', error);
    return null;
  }
}

async function getTransfers() {
  try {
    const transfers = await bankRepository.getTransfers();
    return transfers.map((transfer) => ({
      userID: transfer.userID,
      transferId: transfer.transferId,
      sender: transfer.sender,
      receiver: transfer.receiver,
      jumlah: transfer.jumlah,
      timestamp: transfer.timestamp,
    }));
  } catch (error) {
    console.error('Error getting transfers:', error);
    return [];
  }
}

async function deleteTransfer(userID) {
  try {
    const transfer = await bankRepository.getTransfer(userID);
    if (!transfer) {
      return null;
    }
    await bankRepository.deleteTransfer(userID);
    return true;
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return null;
  }
}

async function updateTransfer(userID, jumlah) {
  try {
    const transfer = await bankRepository.getTransfer(userID);
    if (!transfer) {
      return null;
    }
    await bankRepository.updateTransfer(userID, jumlah);
    return true;
  } catch (error) {
    console.error('Error updating transfer:', error);
    return null;
  }
}

module.exports = {
  createTransfer,
  createUser,
  getTransfers,
  updateTransfer,
  deleteTransfer,
};
