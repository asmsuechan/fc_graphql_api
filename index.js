const { hook } = require('fc-helper');
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString
} = require('graphql');
const atob = require('atob');

const messages = [
  {
    name: 'asmsuechan',
    body: 'Hello'
  },
  {
    name: 'suechan',
    body: 'World'
  }
];

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      messages: {
        type: GraphQLList(
          new GraphQLObjectType({
            name: 'message',
            fields: {
              name: { type: GraphQLString },
              body: { type: GraphQLString },
            },
          }),
        ),
        resolve() {
          return messages;
        }
      }
    }
  })
});

module.exports.handler = (event, context, callback) => {
  const request = JSON.parse(event.toString('utf8'))
  const query = JSON.parse(atob(request["body"]))["query"]
  graphql(schema, query).then((result) => {
    callback(null, { statusCode: 200, body: result });
  });
};
