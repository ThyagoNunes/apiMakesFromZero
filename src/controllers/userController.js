let users = require('../mocks/users');

module.exports = {
  listUsers(request, response) {
    const { order } = request.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });
    response.send(200, sortedUsers);
  },

  getUserById(request, response) {
    const { id } = request.params;

    const getInfoUserById = users.find((user) => user.id === Number(id));

    if (!getInfoUserById) {
      return response.send(400, { error: 'User not found' });
    }

    response.send(200, getInfoUserById);
  },

  createUser(request, response) {
    const { body } = request;

    const lastUserId = users.length;
    const newUser = {
      id: lastUserId + 1,
      name: body.name,
    };

    if (newUser.name.length < 3) {
      return response.send(400, { error: 'Min 3 char from name' });
    }

    if (users.find((user) => user.name === newUser.name)) {
      return response.send(400, { error: `This user ${newUser.name} already exists` });
    }

    users.push(newUser);
    response.send(200, newUser);
  },

  updateUser(request, response) {
    let { id } = request.params;
    const { name } = request.body;
    id = Number(id);

    const findUserById = users.find((user) => user.id === id);

    if (!findUserById) {
      return response.send(400, { error: `ID ${findUserById} not exists` });
    }

    if (findUserById) {
      if (name.length < 3) {
        return response.send(400, { error: 'Min 3 chars from name' });
      }

      const allUsersName = users
        .filter((user) => user.id !== id)
        .map((user) => user.name);

      if (allUsersName.includes(name)) {
        return response.send(400, { error: `${name} has used in other object` });
      }
      findUserById.name = name;
    } else {
      return response.send(400, { error: `Not find object with id ${id}` });
    }

    response.send(200, { id, name });
  },

  deleteUser(request, response) {
    let { id } = request.params;

    id = Number(id);
    const userExist = users.find((user) => user.id === id);

    if (!userExist) {
      return response.send(400, { error: 'User not found' });
    }

    users = users.filter((user) => user.id !== id);

    response.send(200, { deleted: 'true' });
  },
};
