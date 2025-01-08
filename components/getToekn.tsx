export async function getAccessToken(userId: string) {
    try {
        const response = await fetch('/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get access token');
        }

        const data = await response.json();
        // localStorage.setItem('token', 'sdfsdf');
        localStorage.setItem('token', data.access_token);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}