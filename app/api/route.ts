import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from '../../graphql/resolver'; // Adjust the path as needed
import typeDefs from '../../graphql/schema'; // Adjust the path as needed
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';  // For JWT validation

const JWKS_URL = 'https://api.stack-auth.com/api/v1/projects/1b27bc17-7601-4537-b86a-92d105d49ff1/.well-known/jwks.json';


const server = new ApolloServer({
    resolvers,
    typeDefs,
});

// const handler = startServerAndCreateNextHandler<NextRequest>(server, {
//     context: async req => ({ req }),
// });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async (req) => {
        // Extract the Authorization header from the request
        const authorization = req.headers.get('authorization');

        if (authorization) {
            try {
                // Extract the token from the header (in format "Bearer <token>")
                const token = authorization.split(' ')[1];

                // If token is present, validate it
                const { payload } = await jose.jwtVerify(token, jose.createRemoteJWKSet(new URL(JWKS_URL)));
                // Pass the decoded user payload into the context
                return { user: payload };
            } catch (error) {
                console.error('Error validating token:', error);
                throw new Error('Authentication failed');
            }
        }

        // If no token is provided, return an empty context (unauthenticated)
        return {};
    },
});

export { handler as GET, handler as POST };

// export { handler as GET, handler as POST };
