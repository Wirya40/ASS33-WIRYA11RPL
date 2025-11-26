import { NextResponse } from "next/server";

const API_URL = "https://course.summitglobal.id/students";


async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}


export async function GET() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const json = await safeJson(res);

    if (!json || !json.body) return NextResponse.json([]);

    return NextResponse.json(json.body.data || []);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await safeJson(res);

    if (!res.ok)
      return NextResponse.json(json || { error: "Failed" }, { status: res.status });

    return NextResponse.json(json);
  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to add student" },
      { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id)
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const json = await safeJson(res);

    if (!res.ok)
      return NextResponse.json(json || { error: "Failed" }, { status: res.status });

    return NextResponse.json(json);
  } catch (err) {
    console.error("PUT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to delete" },
        { status: res.status }
      );

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
