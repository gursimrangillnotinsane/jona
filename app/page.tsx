"use client";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/client';
import MainComponent from '@/components/mainComponent';
import { useUser } from "@stackframe/stack";

export default function Home() {
  useUser({ or: 'redirect' });
  return (
    <ApolloProvider client={client}>
      <MainComponent />
    </ApolloProvider>
  );
}
