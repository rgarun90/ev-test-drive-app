import { NextResponse } from 'next/server'

// Response Served from JSON-Server
export async function GET() {
  try {
    const response = await fetch(`${process.env.JSON_SERVER_BASE_URL}/vehicles`)

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    let errorMessage = 'An unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
