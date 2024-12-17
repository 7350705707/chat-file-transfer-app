
import {signup,login,logout,getUserInfo,updateProfile,addProfileImage,removeProfileImage} from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

import express from 'express';
import multer from 'multer';



const authRoutes = express.Router();

const upload = multer({ dest: 'uploads/profiles' });


authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info',verifyToken,getUserInfo);
authRoutes.post('/update-profile',verifyToken,updateProfile);
authRoutes.post('/add-profile-image',verifyToken,upload.single('profile-image'),addProfileImage);
authRoutes.delete('/delete-profile-image',verifyToken,removeProfileImage);
authRoutes.post('/logout',verifyToken,logout);


export default authRoutes;