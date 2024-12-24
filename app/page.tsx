"use client";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/client';
import MainComponent from '@/components/mainComponent';
import { useUser } from "@stackframe/stack";
import PathDrawing from '@/components/motionHeart';


export default function Home() {
  useUser({ or: 'redirect' });
  return (
    <>
      <PathDrawing />
      {/* <ApolloProvider client={client}>
        <MainComponent />
      </ApolloProvider> */}
    </>
  );
}
