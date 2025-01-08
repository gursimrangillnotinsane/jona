import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const url = 'https://api.stack-auth.com/api/v1/auth/sessions';
    const serverKey = process.env.STACK_SECRET_SERVER_KEY;
    const accessType = "server"
    const clientKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || '';
    const projectID = process.env.NEXT_PUBLIC_STACK_PROJECT_ID || '';

    if (!serverKey) {
        return NextResponse.json({ error: 'Server key is not configured' }, { status: 500 });
    }

    try {
        const { user_id } = await req.json();

        if (!user_id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Stack-Secret-Server-Key': serverKey,
                'X-Stack-Publishable-Client-Key': clientKey,
                'X-Stack-Access-Type': accessType,
                'X-Stack-Project-Id': projectID
            },
            body: JSON.stringify({ user_id }),
        };

        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.error || 'Failed to fetch access token' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('Error fetching access token:', errorMessage);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
