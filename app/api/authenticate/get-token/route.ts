import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const clerkApiKey = process.env.CLERK_SECRET_KEY 
  const endpoint = "https://api.clerk.dev/v1/sessions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clerkApiKey}`,
      },
      body: JSON.stringify({
        identifier: "maleadmin", 
        password: "maleadmin@xyz",
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching session: ${response.statusText}`);
    }

    const data = await response.json();
    if(!data){
      throw new Error("Invalid credentials");
    }
    return NextResponse.json(
      {
        success: false,
        message:"Token founded" ,
        token:data,
      },
      { status: 400 }
    );
  }catch (error) {
    console.error("Error fetching token or making API request:", error);
    return NextResponse.json(
      {
        success: false,
        error: error,
      },
      { status: 400 }
    );
  }
}
