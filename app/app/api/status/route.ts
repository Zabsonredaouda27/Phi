import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // OpenAI integration removed - returning mock status
    const configured = false;
    
    return NextResponse.json({
      configured,
      message: configured ? 'API configured' : 'OpenAI integration has been removed'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        configured: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}