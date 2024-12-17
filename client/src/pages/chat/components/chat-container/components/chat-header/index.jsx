import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  console.log(selectedChatType);

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
      <div className="flex gap-5 items-center justify-between w-full rounded-lg p-2">
        <div className="flex gap-3 items-center justify-center">
          <div className=" w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12  text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full ">
                #
              </div>
            )}
          </div>
          <div className="flex flex-col">
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && (
              <div>
                {selectedChatData.firstName
                  ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                  : `${selectedChatData.email}`}
              </div>
            )}
            <span className="text-xs opacity-50">
              {selectedChatType === "contact" && selectedChatData.firstName
                ? `${selectedChatData.email}`
                : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className="text-neutral-500 hover:text-neutral-100 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
