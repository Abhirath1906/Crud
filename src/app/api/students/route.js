import { NextRequest, NextResponse } from "next/server";


let localStudents = [];

export async function GET() {
  try {
    const response = await fetch("https://course.summitglobal.id/students");
    const data = await response.json();

    
    const allStudents = [
      ...data.body.data,
      ...localStudents.map((s, i) => ({ id: `local-${i + 1}`, ...s })),
    ];

    return NextResponse.json({ body: { data: allStudents }, statusCode: "200" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
   
    localStudents.push({
      ...body,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Student added locally!" }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
  }
}
