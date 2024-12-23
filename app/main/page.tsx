'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApolloProvider } from '@apollo/client';
import client from '../../lib/client';
import MainComponent from '@/components/mainComponent';

const Main = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const auth = searchParams.get('auth');

        // Redirect if 'auth' query parameter is missing
        if (auth !== 'love') {
            router.replace('/');
        }
    }, [router, searchParams]);

    return (
        <ApolloProvider client={client}>
            <MainComponent />
        </ApolloProvider>
    );
};

export default Main;
