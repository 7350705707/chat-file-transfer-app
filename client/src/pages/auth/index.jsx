import React, { useState } from "react";
import Background from "@/assets/3 Naga Hills.png";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";


const Auth = () => {

  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   const validatesingup = () => {
  //   if (!email) {
  //     toast.error("Email is required");
  //     return false;

  //   } else if (!password) {
  //     toast.error("Password is required");
  //     return false;
  //   } else if (!confirmPassword) {
  //     toast.error("Confirm Password is required");
  //     return false;
  //   } else if (password !== confirmPassword) {  
  //     toast.error("Passwords do not match");
  //     return false;
  //   }
  //   return true;
  // };

  const validateLogin = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    } else if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };


  const handleLogin = async () => {
    try{
    if(validateLogin()){
      const response = await apiClient.post(LOGIN_ROUTE, { email,password }, { withCredentials: true });
      if(response.data.user.id){
        setUserInfo(response.data.user);
        if(response.data.user.profileSetup){
          toast.success("Logged in successfully");
          navigate("/profile");
        }else{
          navigate("/chat");
        }
      }else{
        toast.error("Invalid credentials");
      }
    }
  }catch(error){
    console.log(error);
    toast.error(error.response.data);
  };

  };

//   const handleSingup = async () => {
    
//     if (validatesingup()){
//        const response = await apiClient.post(SIGNUP_ROUTE, { email,password }, { withCredentials: true });
//        if(response.status === 201){
//         setUserInfo(response.data.user);
//          navigate("/profile");
//        }
//     }

// };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl"> Welcome</h1>
              <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              {" "}
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className=" flex items-center justify-center w-full">
            <Tabs defaultValue="Login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="Login"
                >
                  Log In
                </TabsTrigger>
                {/* <TabsTrigger
                  className="data-[state=active]:bg-transparent text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  value="Signup"
                >
                  Sign Up
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="Login" className="flex flex-col gap-5 mt-10">
                <Input
                  placeholder="UserName"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
              </TabsContent>
              {/* <TabsContent value="Signup" className="flex flex-col gap-5 ">
                <Input
                  placeholder="UserName"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleSingup}>Signup</Button>
              </TabsContent> */}
            </Tabs>
          </div>
        </div>

        <div className="hidden xl:flex justify-center items-center">
                <img src={Background} alt="background login" className="h-[500px]"/>
        </div>
      </div>
    </div>
  );
};

export default Auth;
