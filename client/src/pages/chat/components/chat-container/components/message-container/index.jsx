import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { apiClient } from "@/lib/api-client";
import { GET_CHANNEL_MESSAGES_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  const [showImge, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const checkImage = (filePath) => {
    const imageRegex =
      /\.(jpeg|jpg|gif|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (filePath) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${filePath}`, {
      withCredentials: true,
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        setFileDownloadProgress(progress);
      },
    });

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", filePath.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

  const getMessages = async () => {
    const response = await apiClient.post(
      GET_MESSAGES_ROUTE,
      { id: selectedChatData._id },
      { withCredentials: true }
    );

    if (response.data.messages) {
      setSelectedChatMessages(response.data.messages);
    }
  };


  const getChannelMessages = async () => {
    const response = await apiClient.get(
      `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
      { withCredentials: true }
    );

    if (response.data.messages) {
      setSelectedChatMessages(response.data.messages);
    }
  };

  useEffect(() => {
    if (selectedChatData._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }else if(selectedChatType === "channel"){
        getChannelMessages();
      }
    }
  }, [selectedChatData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMesssages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");

      const showDate = lastDate !== messageDate;
      lastDate = messageDate;

      return (
        <div key={message._id} className="flex flex-col">
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timeStamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };

  const renderDMMessage = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8217ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded my-1 max-w-[70%] break-words `}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8217ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded my-1 w-[400px] h-auto max-w-[70%] break-words `}
        >
          {checkImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              {" "}
              <img src={`${HOST}/${message.fileUrl}`} />
            </div>
          ) : (
            <div className="cursor-pointer flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessage = (message) => {
    return (
      <div
        className={`mt-5  ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8217ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[70%] break-words m-9`}
          >
            {message.content}
          </div>
        )}

{message.messageType === "file" && (
        <div
          className={`${
            message.sender === userInfo.id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8217ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded my-1 w-[400px] h-auto max-w-[70%] break-words `}
        >
          {checkImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              {" "}
              <img src={`${HOST}/${message.fileUrl}`} />
            </div>
          ) : (
            <div className="cursor-pointer flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}
        {message.sender._id !== userInfo.id ? (
          <div className=" flex items-center justify-start gap-3 ">
            <Avatar className="h-8 w-8  rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8  text-3xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
            <span className="text-xs text-white/60 ">
              {moment(message.timeStamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-white/60 ">
            {moment(message.timeStamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMesssages()}

      <div ref={scrollRef}></div>
      {showImge && (
        <div
          className="fixed z-[1000] bg-black/80 top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-sm flex-col"
          onClick={() => setShowImage(false)}
        >
          <div>
            <img src={`${HOST}/${imageUrl}`} />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
