// File: server/services/childService.js
import Child from "../models/Child";
import bcrypt from "bcrypt";

export async function addChild({ fullName, password, age, parentEmail }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newChild = new Child({
    fullName,
    password: hashedPassword,
    age,
    parentEmail,
  });
  return newChild.save();
}

// Function to get child details by child ID.
// Parents can only view their own children, while admins can view any child's details.
export async function getChildDetails({ childId, requesterRole, requesterEmail }) {
  if (requesterRole === "parent") {
    // Ensure that the child belongs to the parent making the request.
    const child = await Child.findOne({ _id: childId, parentEmail: requesterEmail });
    if (!child) {
      throw new Error("Child not found or unauthorized.");
    }
    return child;
  }
  if (requesterRole === "admin") {
    // Admins can view any child's details.
    return await Child.findById(childId);
  }
  throw new Error("Unauthorized role.");
}

// Function to remove a child (for reference)
export async function removeChild({ childId, requesterRole, requesterEmail }) {
  if (requesterRole === "parent") {
    const child = await Child.findOne({ _id: childId, parentEmail: requesterEmail });
    if (!child) {
      throw new Error("Child not found or unauthorized.");
    }
    return Child.deleteOne({ _id: childId });
  }
  if (requesterRole === "admin") {
    return await Child.deleteOne({ _id: childId });
  }
  throw new Error("Unauthorized role.");
}


// New function: updateChild
export async function updateChild({ childId, fullName, password, age, requesterRole, requesterEmail }) {
  //Find the child based on role restrictions:
  let child;
  if (requesterRole === "parent") {
    child = await Child.findOne({ _id: childId, parentEmail: requesterEmail });
    if (!child) {
      throw new Error("Child not found or unauthorized.");
    }
  } else if (requesterRole === "admin") {
    child = await Child.findById(childId);
    if (!child) {
      throw new Error("Child not found.");
    }
  } else {
    throw new Error("Unauthorized role.");
  }

  //Hash new pass
  const hashedPassword = await bcrypt.hash(password, 10);

  //Update child properties
  child.fullName = fullName;
  child.password = hashedPassword;
  child.age = age;
  
  return child.save();
}
