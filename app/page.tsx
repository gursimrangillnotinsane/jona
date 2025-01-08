"use client";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/client';
import MainComponent from '@/components/mainComponent';
import { useUser } from "@stackframe/stack";
import CustomCursor from '@/components/customCursour';
import { getAccessToken } from "@/components/getToekn";
import { useEffect, useState } from 'react';
import LoadingApp from '@/components/loading';
export default function Home() {
  const user = useUser({ or: 'redirect' });
  const [userId, setUserId] = useState<string | null>(null);
  const [isTokenFetched, setIsTokenFetched] = useState(false);

  useEffect(() => {
    if (user) {
      setUserId(user.id); // Save the userId in the state
    }
  }, [user]);

  useEffect(() => {
    const fetchToken = async () => {
      if (userId) {
        await getAccessToken(userId); // Fetch token only when userId is set
        setIsTokenFetched(true); // Token fetched
      }
    };

    if (userId) {
      fetchToken(); // Call the function once
    }
  }, [userId]); // This effect runs when userId is set

  if (!isTokenFetched) {
    return (
      <LoadingApp />
    )
  }
  return (
    <>
      <CustomCursor />
      <ApolloProvider client={client}>
        <MainComponent />
      </ApolloProvider>


    </>
  );
}
