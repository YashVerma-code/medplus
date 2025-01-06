import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/lib/database/models/user.model";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  try {  
    const users = await User.find({role:role});
    if (!users) throw new Error("No user profiles found");
    
    return NextResponse.json(users);

  } catch (error) {
    console.error("Error fetching user(s):", error);
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
