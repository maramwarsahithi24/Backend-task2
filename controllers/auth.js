const express = require('express');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function loginUser(req, res){
    try{
        const {email, password} = req.body;
        const exists = await UserModel.findOne({email});
        if(!exists){
            return res.status(401).json({msg: "User not found"});
        }

        const isSame = await bcrypt.compare(password, exists.password);
        if(!isSame){
            return res.status(401).json({msg: "Invalid password"});
        }

        const token = jwt.sign(
            { id: exists._id, email: exists.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        res.cookie("token",token,{
            httpOnly: true,
            secure: false,
            maxAge:60*60*1000
        });

        return res.status(200).redirect('/syntexhub');
    } catch(error){
        console.log("error:",error);
        return res.status(500).json({msg: "login error"});
    }
}

async function signup(req, res){
    try{
        const {username, email, password} = req.body;
        const exist = await UserModel.findOne({
            $or: [{email},{username}]
        });
        if(exist){
            return res.status(401).json({msg: "User already exists"});
        }
        const hashpw = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            username: username,
            email: email,
            password: hashpw
        });
        await newUser.save();
        return res.redirect('/login');
    } catch(error){
        console.log("error:",error);
        return res.status(500).json({msg: "registration error"});
    }
}

module.exports = {
    signup, 
    loginUser
};
