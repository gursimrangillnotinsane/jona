import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from '../../graphql/resolver'; // Adjust the path as needed
import typeDefs from '../../graphql/schema'; // Adjust the path as needed

interface MyContext {
    token?: string;
}

const server = new ApolloServer<MyContext>({ typeDefs, resolvers });

const startApolloServer = async () => {
    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => {
            // Extract token from request headers if available
            return { token: 'token' }; // Use token from headers
        },
        listen: { port: 4000 }, // Define the port for the server
    });

    console.log(`🚀  Server ready at ${url}`);
    return new Response(`Server ready at ${url}`, { status: 200 });
};

// Export the named GET and POST handlers for Next.js API route
export const GET = startApolloServer;
export const POST = startApolloServer;
