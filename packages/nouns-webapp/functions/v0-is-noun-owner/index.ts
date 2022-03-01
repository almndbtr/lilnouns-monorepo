// import { Handler } from '@netlify/functions';
import { isNounOwner, nounsQuery } from '../theGraph';
import { sharedResponseHeaders } from '../utils';

// const handler: Handler = async (event, context) => {
//   const nouns = await nounsQuery();
//   return {
//     statusCode: 200,
//     headers: {
//       'Content-Type': 'application/json',
//       ...sharedResponseHeaders,
//     },
//     body: JSON.stringify(isNounOwner(event.body, nouns)),
//   };
// };

// export { handler };

module.exports = async (req, res) => {
  const nouns = await nounsQuery();
  res.send( {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...sharedResponseHeaders,
    },
    body: JSON.stringify(isNounOwner(req.body, nouns)),
  });
};