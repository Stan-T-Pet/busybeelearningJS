// server/services/childService.js
import Child from "../models/Child";
import bcrypt from "bcrypt";

export async function addChild({ fullName, password, age, parentEmail }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const child = new Child({
    fullName,
    password: hashedPassword,
    age,
    parentEmail,
  });
  await child.save();
  return child;
}

export async function removeChild({ childId, requesterRole, requesterEmail }) {
  // If the requester is a parent, ensure the child belongs to them.
  if (requesterRole === "parent") {
    const child = await Child.findOne({ _id: childId, parentEmail: requesterEmail });
    if (!child) {
      throw new Error("Child not found or unauthorized.");
    }
    return await Child.deleteOne({ _id: childId });
  }
  // For admin, simply delete the child.
  if (requesterRole === "admin") {
    return await Child.deleteOne({ _id: childId });
  }
  throw new Error("Unauthorized role.");
}

export async function getChildDetails({ childId, requesterRole, requesterEmail }) {
  if (requesterRole === "parent") {
    // Parents can only view details of their own children.
    const child = await Child.findOne({ _id: childId, parentEmail: requesterEmail });
    if (!child) {
      throw new Error("Child not found or unauthorized.");
    }
    return child;
  }
  if (requesterRole === "admin") {
    // Admin can view any child.
    return await Child.findById(childId);
  }
  throw new Error("Unauthorized role.");
}
