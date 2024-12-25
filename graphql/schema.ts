import { gql } from '@apollo/client'

const typeDefs = gql`

type Query {
    entries: [Dairy!]!
    entry(id: Int!): Dairy!
}


type Dairy {
    id:ID
    title:String
    from:String
    to:String
    date:String
    content:String
    user:String
  }

type Mutation {
    createEntry(title: String!, content: String!,from:String!,to:String!,user:String! ): Dairy!
    editEntry(id: Int!, title: String!, content: String!,from: String!, to: String!,user:String! ): Dairy!
    deleteEntry(id: Int!): Dairy!
}
`;

export default typeDefs