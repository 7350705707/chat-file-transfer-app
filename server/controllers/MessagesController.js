import Message from "../models/MessagesModel.js";
import {mkdirSync,existsSync,renameSync} from "fs";

export const getMessages = async (req, res) => {
  const user1 = req.userId;
  const user2 = req.body.id;

  try {
    if (!user1 || !user2) {
      return res.status(400).send("Both User Ids are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timeStamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).send("Some error occurred At Backend");
  }
};


export const uploadFile = async (req, res) => {
 try{
  const file = req.file;
  if (!file) {
    return res.status(400).send("No file uploaded");
  }

  const date = Date.now();


  let fileDir = `uploads/files/${date}`;
  let fileName = `${fileDir}/${file.originalname}`;

  mkdirSync(fileDir, { recursive: true });
  renameSync(file.path, fileName);



  return res.status(200).json({ filePath: fileName });
 }catch(error){
  console.log(error);
  return res.status(500).send("Some error occurred At Backend");
 }
}