import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { resolvers } from '../../graphql/resolver';
import typeDefs from '../../graphql/schema';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWKS_URL = 'https://api.stack-auth.com/api/v1/projects/1b27bc17-7601-4537-b86a-92d105d49ff1/.well-known/jwks.json';

interface User extends jose.JWTPayload {
    sub?: string;
}

export type Context = {
    req: NextRequest;
    user: User | null;
};

const server = new ApolloServer<Context>({
    resolvers,
    typeDefs,
});

const handler = startServerAndCreateNextHandler<NextRequest, Context>(server, {
    context: async (req) => {

        const authorization = req.headers.get('authorization');

        if (authorization) {
            try {
                const token = authorization.split(' ')[1];
                const { payload } = await jose.jwtVerify(token, jose.createRemoteJWKSet(new URL(JWKS_URL)));

                return { req, user: payload };
            } catch (error) {
                console.error('Error validating token:', error);
                throw new Error('Authentication failed');
            }
        }
        return { req, user: null };
    },
});

// Default export for Next.js API route

// export async function POST(
//     req: NextRequest,
// ) {
//     return await handler(req);
// }

export async function POST(req: NextRequest) {
    return handler(req);
}

export async function GET(req: NextRequest) {
    return handler(req);
}
