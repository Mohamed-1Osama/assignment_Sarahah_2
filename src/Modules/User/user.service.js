import userRepository from "../../DB/Repositories/user.Repository.js";
import { isValidObjectId } from "mongoose";
import { decrypt } from "../../Common/Utils/Security/encryption.security.js";



export const getUserProfileById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error('invalid Id');
  }

  const user = await userRepository.findDocumentById(id);

  if(user?.phoneNumber) { user.phoneNumber = decrypt(user.phoneNumber)
  }
  return user    
}
  

export const getAllUsers = ()=>{
    return userRepository.getAllUsers();    
}


/**
 * updateOne - update one document , result - modifiedCount
 * findByIdAndUpdate - update one document - result , return the updated document
 * findOneAndUpdate - update one document - result , return the updated document
 * Save - update one document - result , return the updated document
 * 
 * updateMany - update number of documents , result - modifiedCount
 */

export const updateProfile = (body, userId) => {
  const { firstName, lastName, email, gender, age } = body
 return userRepository.findDocumentByIdAndUpdate(
  userId,{firstName, lastName, email, gender, age},
   {new:true , runValidators:true})
}


/**
 * deleteOne
 * deleteMany
 * 
 * 
 * findByIdAndDelete
 * findOneAndDelete
 */
export const deleteProfile = async (userId)=>{
  return userRepository.findDocumentByIdAndDelete(userId)
}