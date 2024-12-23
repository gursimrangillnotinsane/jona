"use client";
import { NextPage } from 'next';
import { ApolloProvider } from '@apollo/client'
import client from '../lib/client'
import MainComponent from '../components/mainComponent'
import Login from '../components/login'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Home() {

  return (
    <Login />
  );
}
