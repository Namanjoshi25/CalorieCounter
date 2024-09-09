"use-client"
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/user.model.js";
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { error } from "console";



connect();


export async function POST(request : NextRequest){
    try {
        const reqBody = await request.json();
        const {username, email , password} = reqBody;
        if(!username || !password || !email)  return NextResponse.json({error : "Username,Password,Email all are required"} , {status : 400})

       const user   = await User.findOne({email});
       if(user) {
        return NextResponse.json({error : "User already exists"} , {status : 400})
       }

       //hash password

       const salt = await bcryptjs.genSalt(10);
       const hashedPassword = await bcryptjs.hash(password,salt);

       const newUser = new User({
        email,password : hashedPassword,username
       })
        
       const savedUser = await newUser.save();
       

       //send verification email 

    
       
       return NextResponse.json({message  : "User Created successfully" ,success : true ,savedUser})
    } catch (error : any) {
        return NextResponse.json({error : error.message} , { status: 500})
    }
}