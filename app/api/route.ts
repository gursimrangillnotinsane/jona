import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from '../../graphql/resolver'; // Adjust the path as needed
import typeDefs from '../../graphql/schema'; // Adjust the path as needed
import { NextRequest, NextResponse } from 'next/server';

const server = new ApolloServer({
    resolvers,
    typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };
