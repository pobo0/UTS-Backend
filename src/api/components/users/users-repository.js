const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {integer} NOHALL - Nomor Halaman
 * @param {integer} SZHALL - Ukuran halaman
 * @param {string} SORTING - sort
 * @param {string} SRCH - search
 * @returns {Promise}
 */
async function getUsers(NOHALL, SZHALL, SORTING, SRCH) {
  try {
    let query = {};

    if (SRCH) {
      //membuat function untuk melakukan search / pencarian
      const [FIELD, VALUE] = SRCH.split(':');
      if (FIELD && VALUE) {
        query = {
          [FIELD]: { $regex: VALUE, $options: 'i' },
        };
      }
    }

    const countTOTAL = await User.countDocuments(query); //

    let SORTCRIT;
    if (SORTING === 'desc') {
      SORTCRIT = { name: -1 };
    } else {
      SORTCRIT = { name: 1 };
    }

    if (SORTING.includes(':desc')) {
      const [Namefield, orders] = SORTING.split(' : ');
      if (Namefield === 'name' || Namefield === 'email') {
        SORTCRIT = { [Namefield]: -1 };
      }
    }

    // mengambil users dari database mongoDB
    let users;
    if (SZHALL === 0) {
      users = await User.find(query).sort(SORTCRIT);
    } else {
      users = await User.find(query)
        .sort(SORTCRIT)
        .limit(SZHALL)
        .skip(NOHALL - 1);
    }

    const pageTOTAL = Math.ceil(countTOTAL / SZHALL);
    const has_previous_page = NOHALL > 1;
    const has_next_page = SZHALL < pageTOTAL;

    return {
      page_number: NOHALL,
      page_size: SZHALL,
      page_total: pageTOTAL,
      has_previous_page: has_previous_page,
      has_next_page: has_next_page,
      data: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at,
      })),
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
