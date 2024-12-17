import React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { getColor } from "@/lib/utils";
import { HOST } from "@/utils/constants";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import {FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";




  

const ProfileInfo = () => {
    const Navigate = useNavigate();
  const { userInfo , setUserInfo } = useAppStore();

  const Logout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
        if(response.status === 200){
            setUserInfo(null);
            Navigate("/auth");
        }
    } catch (error) {   
        console.log(error);
    }


};
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center ">
        <div className=" w-12 h-12 relative">
          <Avatar className="h-12 w-12  rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12  text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                  userInfo.color
                )}`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {userInfo.firstName && `${userInfo.firstName} ${userInfo.lastName}`}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <FiEdit2 onClick={()=>Navigate("/profile")} className="text-purple-500 text-xl cursor-pointer font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#acab1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
                <IoPowerSharp onClick={Logout} className="text-red-500 text-xl cursor-pointer font-medium" />
            </TooltipTrigger>
            <TooltipContent className="bg-[#acab1e] border-none text-white">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
