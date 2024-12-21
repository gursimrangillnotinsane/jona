import { gql } from '@apollo/client'

const typeDefs = gql`

type Query {
    entries: [Dairy!]!
}


type Dairy {
    id:ID
    title:String
    date:String
    content:String
  }

type Mutation {
    createEntry(title: String!, content: String!): Dairy!
    editEntry(id: Int!, title: String!, content: String!): Dairy!
    deleteEntry(id: Int!): Dairy!
}
`;

export default typeDefs