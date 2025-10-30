import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/userController';
import { auth } from "../middleware/auth";

const router = express.Router();

// CRUD protégé (admin)
router.route("/")
  .get(auth(["admin"]), getAllUsers)
  .post(auth(["admin"]), createUser);

router.route("/:id")
  .get(auth(["admin"]), getUserById)
  .put(auth(["admin"]), updateUser)
  .delete(auth(["admin"]), deleteUser);

export default router;
