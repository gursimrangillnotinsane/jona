import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// Create an httpLink to handle GraphQL requests
const httpLink = new HttpLink({
    uri: '/api', // Replace with your GraphQL endpoint
});

// Create an authLink to add the token from localStorage to headers
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    console.log('token', token)
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "none",  // Add token to Authorization header
        },
    };
});

// Set up the Apollo Client with the authLink and httpLink
const client = new ApolloClient({
    link: authLink.concat(httpLink),  // Chain the authLink with httpLink
    cache: new InMemoryCache(),
});

export default client;
