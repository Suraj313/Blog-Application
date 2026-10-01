import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import ConnectDB from './src/config/db.js';
import { connect } from 'mongoose';
import User from "./src/models/User.model.js";
import Category from './src/models/Category.model.js';
import Post from './src/models/Post.model.js'
import Comment from './src/models/Comment.model.js'



const PORT = process.env.PORT || 5000;

ConnectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
