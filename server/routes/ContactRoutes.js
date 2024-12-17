import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { searchContacts,getContacts, getAllContacts } from '../controllers/ContactsController.js'; // Ensure the file extension is included

const contactsRoutes = express.Router();

contactsRoutes.post('/search', verifyToken, searchContacts);
contactsRoutes.get('/get-contacts-for-dm', verifyToken, getContacts);
contactsRoutes.get('/get-all-contacts',verifyToken,getAllContacts);

export default contactsRoutes;