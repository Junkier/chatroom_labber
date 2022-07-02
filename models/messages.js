const mongoose = require('mongoose');
const moment   = require("moment");
const db       = require("./db");

// 建立 schema
let membersSchema = new mongoose.Schema({
    // _id : String ,  // 將 uid 設為 _id , 作為 Primary key (預設會建立 index)
    messages : String , 
    user : String , 
    created_at : Date,
  }, { 
    collection: "messages",
    versionKey: false
  }
);
  

// 建立 model
let Messages = db.model("messages",membersSchema);

exports.getOldMessages = ()=>{
  return Messages.find().then(r=>{
    return r.map(ele=>({
      created_at: moment(ele.created_at).format("HH:mm"),
      messages: ele.messages,
      user: Number(ele.user),
      _id: ele._id
    }))
  });
}

exports.insertOneMsg = (payload)=>{
  return Messages.create({
    messages : payload.value,
    user : payload.no,
    created_at : moment().format("YYYY-MM-DD HH:mm:ss")
  })
};

// exports.findOne = (condition, fields={} ) =>{
//   return Members.findOne(condition,fields);
// };

// exports.upsertUserInfo = async (userRecord)=>{
//   try{

//     let payload = {
//       _id : userRecord.uid ,
//       email : userRecord.email, 
//       user_name : userRecord.displayName,
//       registry_time : userRecord.metadata.creationTime,
//       registry_auth_provider : userRecord.providerData[0].providerId,
//       last_signin_time : userRecord.metadata.lastSignInTime,
//       last_signin_provider : userRecord.providerData[0].providerId,
//     };

//     // 透過 uid, 檢查該 user 是否存在
//     //   1) user 不存在 (註冊情況) , 直接 insert 即可
//     //   2) user 存在 (登入情況), 更新 user_name,last_signin_time,last_signin_provider 即可
//     let user = await Members.findOne({ _id : payload._id },{ _id :1 });

//     let msg , count;
//     if(!user){
//       await Members.create(payload);
//       msg = "Creating new member";
//       count = 1;
//     }else{
//       let updatedPayload = {
//         user_name: payload.user_name,
//         last_signin_time : payload.last_signin_time,
//         last_signin_provider : payload.last_signin_provider
//       };
//       let result = await Members.updateOne({ _id : payload._id },{ $set: updatedPayload });
//       msg = "Updating member record";
//       count = result.matchedCount;
//     };

//     logger.info(`[${payload._id}] ${msg} is done, affected rows: ${count}`);

//   } catch(err){
//     logger.error(err);
//   };
// };
