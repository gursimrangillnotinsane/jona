"use client";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/client';
import MainComponent from '@/components/mainComponent';
import { useUser } from "@stackframe/stack";
import PathDrawing from '@/components/motionHeart';
import CustomCursor from '@/components/customCursour';

export default function Home() {
  useUser({ or: 'redirect' });
  return (
    <>
      {/* <CustomCursor /> */}
      <div className='flex justify-evenly'>
        <PathDrawing />
        <ApolloProvider client={client}>
          <MainComponent />
        </ApolloProvider>
      </div>
    </>
  );
}
