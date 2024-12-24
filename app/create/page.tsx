"use client";
import { ApolloProvider } from '@apollo/client';
import client from '../../lib/client';
import AddEntry from '@/components/addEntry';
import { useUser } from "@stackframe/stack";

export default function Home() {
    useUser({ or: 'redirect' });
    return (
        <ApolloProvider client={client}>
            <AddEntry />
        </ApolloProvider>
    );
}
