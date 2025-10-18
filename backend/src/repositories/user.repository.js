import User from "../models/user.model.js";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).select("+password");
  }

  async findById(id) {
    return await User.findById(id).lean();
  }

  async findAll() {
    return await User.find().select("-password");
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async findByRole(role) {
    return await User.find({ role }).select("-password");
  }
}

export default new UserRepository();
