"use client";
import { NextPage } from 'next';
import { ApolloProvider } from '@apollo/client'
import client from '../lib/client'
import MainComponent from '../components/mainComponent'

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <MainComponent />
    </ApolloProvider>
  );
}
