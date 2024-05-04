const { User } = require('../../../models');
const { name } = require('../../../models/users-schema');

/**
 * Get a list of users
 * @param {integer} NOHALL - Nomor Halaman
 * @param {integer} NOHALL - Ukuran halaman
 * @param {string} SRCH - search
 * @param {string} SORTING - sort
 * @returns {Promise}
 */
async function getUsers(NOHALL, SZHALL, SRCH, SORTING) {
  try {
    let query = {};

    //fungsi untuk search
    if (SRCH) {
      const [field, value] = SRCH.split(' : ');
      // Membagi string pencarian untuk mendapatkan nama kolom dan nilai pencarian
      if (field && value) {
        query = {
          [field]: {
            $regex: value,
            $options: 'i',
            // Menggunakan nilai pencarian dalam ekspresi reguler untuk pencarian yang tidak peka terhadap huruf besar/kecil dan menerima simbol
          },
        };
      }
    }
    //menentukan banyak nya jumlah total dokumen
    const ConstTOTAL = await User.countDokuments(query);

    //membuat SORTCRIT
    let SORTCRIT;
    if (SORTING == 'desc') {
      SORTCRIT = { name: -1 };
    } else if (SORTING == 'asc') {
      SORTCRIT = { name: 1 };
    } else {
      SORTCRIT = { name: 1 };
    }

    //jika sort berisi desc
    if (SORTING.includes(':desc')) {
      const [Namefield, orders] = SORTING.split(' : ');
      if (Namefield === 'name' || Namefield === 'email') {
        SORTCRIT = { name: -1 };
      }
    }

    //mengambil user dari mongoDB
    let users;
    if (SZHALL === 0) {
      users = await User.find(query).sort(SORTCRIT);
    } else {
      users =
        (await User.find(query)
          .sort(SORTCRIT)
          .limit(SZHALL)
          .skip(NOHALL - 1)) * SORTCRIT;
    }

    const pageTOTAL = math.ceil(ConstTOTAL / SZHALL);
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
  } catch (eror) {
    throw new eror(eror.message);
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
