const mongoose_user = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const Users = mongoose_user.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String },
  password: {
    type: String,
    required: true,
  },
  connected: {
    type: Boolean,
    default: false,
  },
});

Users.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  bcryptjs.genSalt(saltRounds, function (err, salt) {
    if (err) return next(err);

    bcryptjs.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

Users.methods.comparePassword = function (candidatePassword) {
  return bcryptjs.compare(candidatePassword, this.password);
};

module.exports = mongoose_user.model("Users", Users);
