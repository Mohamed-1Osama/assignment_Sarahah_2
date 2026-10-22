import { Router } from 'express';
const messageController = Router();

// helath check route
messageController.get('/health' , (req, res) => {
    res.status(200).json({ message: 'Message service is helathy' });
});


export default messageController;