import { InMemoryCache, ApolloClient } from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://jona-alpha.vercel.app/api',
    cache: new InMemoryCache(),
})

export default client