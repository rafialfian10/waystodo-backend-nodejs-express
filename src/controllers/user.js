const status = require("http-status");

const { User, Todo, Category } = require("../../models");
// --------------------------------------------

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
      include: [
        {
          model: Todo,
          as: "todos",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "deletedAt",
              "userId",
              "categoryId",
            ],
          },
        },
        // {
        //   model: Category,
        //   as: "categories",
        //   attributes: {
        //     exclude: ["createdAt", "updatedAt", "password", "deletedAt"],
        //   },
        // },
      ],
    });

    let dataUsers = JSON.parse(JSON.stringify(users));

    dataUsers = dataUsers.map((dataUser) => {
      return { ...dataUser, photo: process.env.PATH_FILE_PHOTO + dataUser.photo };
    });

    res.status(status.OK).json(dataUsers);
  } catch (err) {
    res.status(status.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userId = await User.findByPk(id);
    if (!userId) {
      return res.status(status.NOT_FOUND).json({ message: "user not found" });
    }

    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
      include: [
        {
          model: Todo,
          as: "todos",
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "deletedAt",
              "userId",
              "categoryId",
            ],
          },
        },
        // {
        //   model: Category,
        //   as: "categories",
        //   attributes: {
        //     exclude: ["createdAt", "updatedAt", "password", "deletedAt"],
        //   },
        // },
      ],
    });

    let dataUser = JSON.parse(JSON.stringify(user));

    dataUser = {
      ...dataUser,
      photo: process.env.PATH_FILE_PHOTO + dataUser.photo,
    };

    res.status(status.OK).json(dataUser);
  } catch (err) {
    res.status(status.BAD_REQUEST).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      throw new Error("user not found");
    }

    if (req.body.user_name) {
      user.userName = req.body.user_name;
    }

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.phone) {
      user.phone = req.body.phone;
    }

    if (req.file) {
      user.photo = req.file.filename;
    }

    user = await user.save();

    user = await User.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
      },
    });

    res.status(status.OK).send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: "user not found" });
    }

    await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    res
      .status(status.OK)
      .json({ message: `user with id ${req.params.id} has been deleted` });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};
