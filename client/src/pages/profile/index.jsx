import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  DELETE_PROFILE_IMAGE_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  SIGNUP_ROUTE,
} from "@/utils/constants";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";

const Profile = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterNewPassword, setReEnterNewPassword] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, []);



  const validatesingup = () => {
      if (!email) {
        toast.error("Email is required");
        return false;
  
      } else if (!password) {
        toast.error("Password is required");
        return false;
      } else if (!confirmPassword) {
        toast.error("Confirm Password is required");
        return false;
      } else if (password !== confirmPassword) {  
        toast.error("Passwords do not match");
        return false;
      }
      return true;
    };


    
  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    return true;
  };

  const handleSingup = async () => {
    if (validatesingup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setUserInfo(response.data.user);
        navigate("/chat");
      }
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(
          `${UPDATE_PROFILE_ROUTE}`,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data.user });
          toast.success("Profile updated successfully");
          navigate("/chat");
        } else {
          const { error } = await response.json();
          toast.error(error);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data);
      }
    }
  };

  const changePassword = async () => {
    if (newPassword && newPassword === reEnterNewPassword) {
      try {
        const response = await apiClient.post(
          `${CHANGE_PASSWORD_ROUTE}`,
          { oldPassword, newPassword },
          { withCredentials: true }
        );
        if (response.status === 200) {
          toast.success("Password changed successfully");
          setUserInfo(null);
          navigate("/auth");
        } else {
          const { error } = await response.json();
          toast.error(error);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data);
      }
    } else {
      toast.error("New passwords do not match");
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please complete your profile setup");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.image) {
        setUserInfo({ ...userInfo, image: response.data.image });
        toast.success("Image uploaded successfully");
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        setImage(null);
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <div className=" bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <Tabs defaultValue="Login" className="w-3/4">
          <TabsList className="bg-transparent rounded-none w-full">
            <TabsTrigger
              className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
              value="Login"
            >
              Update Profile
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
              value="Change Password"
            >
              Change Password
            </TabsTrigger>
            {userInfo.email === "Admin@itcell" && (
              <TabsTrigger
                className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                value="Signup"
              >
                Signup Page Here
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="Login" className="flex flex-col gap-5 mt-10">
            <div onClick={handleNavigate}>
              <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
            </div>
            <div className="grid grid-cols-2">
              <div
                className="h-32 w-32 md:w-48 md:h-48 relative flex items-center justify-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                  {image ? (
                    <AvatarImage
                      src={image}
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                        selectedColor
                      )}`}
                    >
                      {firstName
                        ? firstName.split("").shift()
                        : userInfo.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
                {hovered && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer text-white"
                    onClick={image ? handleDeleteImage : handleFileInputClick}
                  >
                    {image ? (
                      <FaTrash className="text-white text-3xl cursor-pointer" />
                    ) : (
                      <FaPlus className="text-white text-3xl cursor-pointer" />
                    )}
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                  name="profile-image"
                  accept=".png, .jpg, .jpeg, .svg, .webp"
                />
              </div>
              <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                <div className="w-full">
                  <Input
                    className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                    placeholder="email"
                    type="email"
                    value={userInfo.email}
                    disabled
                  />
                </div>
                <div className="w-full">
                  <Input
                    className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                    placeholder="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <Input
                    className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                    placeholder="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="w-full flex gap-5 justify-center items-center">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(index)}
                      className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                        selectedColor === index
                          ? "outline outline-white/50 outline-4"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full">
              <Button
                className="bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-white w-full py-4 rounded-lg"
                onClick={saveChanges}
              >
                Save Changes
              </Button>
            </div>
          </TabsContent>
          <TabsContent
            value="Change Password"
            className="flex flex-col gap-5 mt-10"
          >
            <div onClick={handleNavigate}>
              <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
                placeholder="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
                placeholder="Re-enter New Password"
                type="password"
                value={reEnterNewPassword}
                onChange={(e) => setReEnterNewPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Button
                className="bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-white w-full py-4 rounded-lg"
                onClick={changePassword}
              >
                Change Password
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="Signup" className="flex flex-col gap-5 ">
          <div onClick={handleNavigate}>
              <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
            </div>
            <div className="w-full">
              <Input
                placeholder="UserName"
                type="email"
                className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Password"
                type="password"
                className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-lg p-6 bg-[#2c2e3b] text-white border-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button className="bg-purple-700 hover:bg-purple-900 transition-all duration-300 text-white w-full py-4 rounded-lg" onClick={handleSingup}>
              Signup
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
