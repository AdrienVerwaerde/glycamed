import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

// TypeScript interface for the User document
export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: "user" | "admin" | "amed";
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);
// ===== MIDDLEWARE TO HASH PASSWORD =====

// Hash password before saving (on create and update)
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.index({ email: 1 });
export default mongoose.model<IUser>("User", UserSchema);
