import { Admin } from "../models/User.js";
import bcrypt from "bcrypt";

export async function addAdmin({ fullName, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ fullName, email, password: hashedPassword });
  return newAdmin.save();
}

export async function getAdminDetails({ adminId, requesterRole }) {
  if (requesterRole !== "admin") {
    throw new Error("Unauthorized role.");
  }
  return await Admin.findById(adminId);
}

export async function updateAdmin({ adminId, fullName, email, password, requesterRole }) {
  if (requesterRole !== "admin") throw new Error("Unauthorized role.");

  const admin = await Admin.findById(adminId);
  if (!admin) throw new Error("Admin not found.");

  const hashedPassword = await bcrypt.hash(password, 10);
  admin.fullName = fullName;
  admin.email = email;
  admin.password = hashedPassword;

  return admin.save();
}

export async function removeAdmin({ adminId, requesterRole }) {
  if (requesterRole !== "admin") throw new Error("Unauthorized role.");
  return await Admin.deleteOne({ _id: adminId });
}
