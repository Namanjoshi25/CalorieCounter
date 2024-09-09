import { NextResponse } from 'next/server';
import {connect }from '@/dbConfig/dbConfig';
import UserGoal from '@/models/userGoal.model';

export async function GET(request: Request) {
  await connect(); // Ensure the database is connected

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "Please provide userId" }, { status: 400 });
  }

  try {
    const userGoal = await UserGoal.findOne({ userId });

    if (!userGoal) {
      return NextResponse.json({ error: "No user goal found" }, { status: 404 });
    }

    return NextResponse.json({ userGoal }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user goal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
