import { Parent } from "../models/User.js";
import bcryptjs from "bcryptjs";

export async function addParent({ fullName, email, password }) {
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newParent = new Parent({ fullName, email, password: hashedPassword });
  return newParent.save();
}

export async function getParentDetails({ parentId, requesterRole, requesterEmail }) {
  if (requesterRole === "parent") {
    const parent = await Parent.findOne({ _id: parentId, email: requesterEmail });
    if (!parent) throw new Error("Parent not found or unauthorized.");
    return parent;
  }
  if (requesterRole === "admin") {
    return await Parent.findById(parentId);
  }
  throw new Error("Unauthorized role.");
}

export async function updateParent({ parentId, fullName, email, password, requesterRole, requesterEmail }) {
  let parent;
  if (requesterRole === "parent") {
    parent = await Parent.findOne({ _id: parentId, email: requesterEmail });
    if (!parent) throw new Error("Parent not found or unauthorized.");
  } else if (requesterRole === "admin") {
    parent = await Parent.findById(parentId);
    if (!parent) throw new Error("Parent not found.");
  } else {
    throw new Error("Unauthorized role.");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  parent.fullName = fullName;
  parent.email = email;
  parent.password = hashedPassword;

  return parent.save();
}

export async function removeParent({ parentId, requesterRole, requesterEmail }) {
  if (requesterRole === "parent") {
    const parent = await Parent.findOne({ _id: parentId, email: requesterEmail });
    if (!parent) throw new Error("Parent not found or unauthorized.");
    return Parent.deleteOne({ _id: parentId });
  }
  if (requesterRole === "admin") {
    return await Parent.deleteOne({ _id: parentId });
  }
  throw new Error("Unauthorized role.");
}
