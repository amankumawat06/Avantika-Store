const { User } = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exports.createUser = async (req, res) => {
//   try {
//     let { name, phone, email, password } = req.body;
//     let profileImg = "default.jpg";
//     let profileImgId = req.file.filename;

//     if (!name || !phone || !email || !password) {
//       return res.status(status.BAD_REQUEST).json({
//         success: false,
//         message: "Required fields cannot be empty!",
//       });
//     }
//     if (req.file.size > 2 * 1024 * 1024) {
//       return res.status(status.BAD_REQUEST).json({
//         message: "Image size cannot exceed 2MB",
//       });
//     }

//     const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

//     if (existingUser) {
//       return res.status(status.BAD_REQUEST).json({
//         success: false,
//         message: "User already exist!",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt value that is used to add aslt value to evevy password if the password of different users are same then the salt value will be different

//     const newUser = new User({
//       name,
//       phone,
//       email,
//       password: hashedPassword,
//       profileImg,
//       profileImgId,
//     });
//     await newUser.save();

//     return res.status(status.CREATED).json({
//       success: true,
//       message: "Account created successfuly!",
//     });
//   } catch (err) {
//     return res.status(status.INTERNAL_SERVER_ERROR).json({
//       message: "Failed to create account!",
//     });
//   }
// };

// exports.getUser = async (req, res) => {
//   try {
//     let { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(status.BAD_REQUEST).json({
//         success: false,
//         message: "Required fields cannot empty",
//       });
//     }

//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(status.BAD_REQUEST).json({
//         success: false,
//         message: "Invalid email or password!",
//       });
//     }

//     let isPasswordCorrect = bcrypt.compare(password, user.password);

//     if (!isPasswordCorrect) {
//       return res.status(status.BAD_REQUEST).json({
//         success: false,
//         message: "Invalid email or password!",
//       });
//     }

//     const JWT_SECRET = process.env.JWT_SECRET;

//     let Token = jwt.sign(
//       {
//         id: user.id,
//         name: user.name,
//       },
//       JWT_SECRET,
//       {
//         expiresIn: "20d",
//       },
//     );

//     return res.status(status.OK).json({
//       success: true,
//       message: "Logged In successfully",
//       token: Token,
//     });
//   } catch (err) {
//     return res.status(status.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Failed to logIn",
//     });
//   }
// };

export const createUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Required fields can not be empty!",
    });
  }
};
