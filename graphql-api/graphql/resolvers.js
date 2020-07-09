const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");

module.exports = {
  /*
  hello() {
    return { text: "Hello world!", views: 1234 };
  },
  */

  createUser: async function ({ userInput }, req) {
    // const email = args.userInput.email;

    const email = userInput.email;
    const existingUser = await User.findOne({ email: email });
    const errors = [];

    //validate email
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Email is invalid." });
    }

    //validate password
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short." });
    }

    //check for errors
    if (errors.length > 0) {
      const error = new Error("Invalid input data.");
      throw error;
    }

    if (existingUser) {
      //Chech if user already exists
      console.log("User exists already!");
      const error = new Error("User exists already!");
      throw error;
    }

    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: email,
      name: userInput.name,
      password: hashedPw,
    });

    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },
};
