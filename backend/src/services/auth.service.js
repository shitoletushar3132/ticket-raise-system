import userRepository from "../repositories/user.repository.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
class AuthService {
  async register(userData) {
    const { name, email, password, role, department } = userData;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const user = await userRepository.create({
      name,
      email,
      password,
      role: role || "employee",
      department: department || "Other",
    });

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    };
  }
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please provide email and password");
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    };
  }
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }
}

export default new AuthService();
