import bcrypt from 'bcrypt';

import { DefaultAuthProvider } from 'adminjs';

import componentLoader from './component-loader.js';

import User from '../models/user.js';

/**
 * Make sure to modify "authenticate" to be a proper authentication method
 */
const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    try {
      // // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return null;

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      return user;
    } catch (error) {
      return null;
    }
  },
});

export default provider;
