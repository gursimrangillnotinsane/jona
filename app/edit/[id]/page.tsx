"use client";
import { ApolloProvider } from '@apollo/client';
import client from '../../../lib/client';
import Edit from '@/components/edit';
import { useUser } from "@stackframe/stack";
import { use } from 'react';

const Edithome = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    useUser({ or: 'redirect' });
    return (

        <ApolloProvider client={client}>
            <Edit id={id} />
        </ApolloProvider>
    )
}
export default Edithome