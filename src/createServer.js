const db = require('./db')
const { GraphQLServer } = require('graphql-yoga')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')

// Creating the Graphql Server

function createServer(){
    return new GraphQLServer({
        typeDefs: 'src/schema.graphql',
        resolvers:{
            Mutation,
            Query,
        },
        resolverValidationOptions:{
            requireResolverForResolveType:false,
        },
        context: req =>({
            ...req,
            db
        }),
    });
}

module.exports = createServer;