import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import React,{useRef} from "react";

import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";

const MessageBar = () => {
  const socket = useSocket();
  const {selectedChatType, selectedChatData,userInfo,setIsUploading,setFileUploadProgress} = useAppStore();
  const [message, setMessage] = React.useState("");
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [showEmoji, setShowEmoji] = React.useState(false);


  React.useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
  }, [emojiRef]);

  const  handleAddEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
    // setShowEmoji(!showEmoji);

  }

  const handleSendMessage = async () => {
    if (message){
      if(selectedChatType === "contact"){
      
        socket.emit("sendMessage", {
          sender: userInfo.id,
          recipient: selectedChatData._id,
          content: message,
          messageType: "text",
          fileUrl:undefined,
      });
      }else if(selectedChatType === "channel"){
        socket.emit("send-channel-message", {
          sender: userInfo.id,
          content: message,
          messageType: "text",
          fileUrl:undefined,
          channelId:selectedChatData._id,
      });
      }
      setMessage("");
    }else{
      toast.error("Message cannot be empty");
    }
    
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };


  
  const handleAttachementClick = () => {
      if(fileInputRef.current){
          fileInputRef.current.click();
      }

  }

  const handleAttachementChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setFileUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 && response.data.filePath) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              recipient: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
      // Retry logic
      if (error.response && error.response.status === 500) {
        const file = e.target.files[0];
        const chunkSize = 1024 * 1024; // 1MB
        let offset = 0;

        while (offset < file.size) {
          const chunk = file.slice(offset, offset + chunkSize);
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("filePath", response.data.filePath);

          await apiClient.post("/resume-upload", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          offset += chunkSize;
        }
      }
    }
  }


  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md itce gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
        />
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleAttachementClick}>
            <GrAttachment className=" text-2xl"/>
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleAttachementChange}/>
        <div className="relative flex">
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={()=>setShowEmoji(!showEmoji)} >
            <RiEmojiStickerLine className=" text-2xl"/>
        </button>
        <div className="absolute bottom-16 right-0" ref={emojiRef}>
                <EmojiPicker
                theme="dark"
                open={showEmoji}
                onEmojiClick={ handleAddEmoji}
                autoFocusSearch={false}
                />
        </div>
        </div>
      </div>
      <button className=" bg-[#8417ff] rounded-md flex items-center justify-center p-5 focus:border-none focus:outline-none hover:bg-[#741bda] focus:bg-[#741bda] focus:text-white duration-300 transition-all" onClick={handleSendMessage}>
            <IoSend className=" text-2xl"/>
        </button>
    </div>
  );
};

export default MessageBar;
