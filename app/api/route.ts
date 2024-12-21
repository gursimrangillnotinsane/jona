import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import typeDefs from '../../graphql/schema'
import { resolvers } from '../../graphql/resolver'
import { NextRequest } from "next/server";

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
})


// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer, {
    context: async (req: NextRequest) => ({ req }),
});

export { handler as GET, handler as POST };