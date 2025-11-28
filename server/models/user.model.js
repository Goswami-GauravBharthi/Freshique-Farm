import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  farmerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
  ,
  name: String,
  price: Number,
  unit:String,
  quantity: {
    type: Number,
    default: 1,
  },
  image: String,
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String, // Hashed password
      required: true,
      select: false, // Exclude password field by default
    },
    cartItems: [cartItemSchema],
    role: {
      type: String,
      enum: ["farmer", "consumer", "restaurant"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String, // URL to profile image
      default:
        "https://res.cloudinary.com/dsxyfatqg/image/upload/v1761456471/7984000_okwtmx.jpg",
    },
    location: {
      type: {
        address: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
      required: function () {
        return this.role === "farmer";
      }, // Required for farmers
    },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 12); // Salt rounds: 12
};

// Static method to compare password
userSchema.statics.comparePassword = async function (
  candidatePassword,
  hashedPassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const User = mongoose.model("User", userSchema);