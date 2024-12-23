import { InMemoryCache, ApolloClient } from "@apollo/client";

const client = new ApolloClient({
    uri: '/api',
    cache: new InMemoryCache(),
})

export default client