import { fetchFoodData } from '@/lib/oauth';
import { NextRequest, NextResponse } from 'next/server';
// Adjust the path based on your project structure

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('food');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "food" is required' }, { status: 400 });
    }

  
    const data = await fetchFoodData(query);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch food data' }, { status: 500 });
  }
}
