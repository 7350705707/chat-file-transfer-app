import Message from "../models/MessagesModel.js";
import { mkdirSync, existsSync, renameSync, appendFileSync, unlinkSync } from "fs";
import cron from "node-cron";

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
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some error occurred At Backend");
  }
};

export const resumeUpload = async (req, res) => {
  try {
    const { filePath, chunk } = req.body;
    if (!filePath || !chunk) {
      return res.status(400).send("File path and chunk are required");
    }

    appendFileSync(filePath, chunk);

    return res.status(200).send("Chunk appended successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Some error occurred At Backend");
  }
};

export const deleteOldMessages = async () => {
  try {
    const sixtyDaysAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    const oldMessages = await Message.find({ timeStamp: { $lt: sixtyDaysAgo } });

    oldMessages.forEach(message => {
      if (message.filePath && existsSync(message.filePath)) {
        unlinkSync(message.filePath);
      }
    });

    await Message.deleteMany({ timeStamp: { $lt: sixtyDaysAgo } });

    console.log("Old messages deleted successfully");
  } catch (error) {
    console.log("Some error occurred At Backend", error);
  }
};

// Schedule the deleteOldMessages function to run every day at 10 AM
cron.schedule('0 10 * * *', deleteOldMessages);




