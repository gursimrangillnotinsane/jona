'use client';

import { useRouter } from 'next/navigation';

const login = () => {
    const router = useRouter();


    function signup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const password = formData.get('password') as string;

        if (name && password && password == process.env.NEXT_PUBLIC_PASSWORD) {
            localStorage.setItem('auth', 'true');
            router.replace('/main?auth=love');
        }
        else {
            alert('Invalid credentials');
        }
        console.log(name, password)
    }


    return (
        <div>
            <form onSubmit={signup}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" placeholder="Name" />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
}
export default login