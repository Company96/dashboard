import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { SEARCH_USER_DATA } from '@/graphql/query/user';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_ENDPOINT,
  cache: new InMemoryCache(),
});

const searchHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, userID } = req.query;

  // console.log("Q: ", q)

  if (!q || !userID) {
    res.status(400).json({ error: 'Missing search term or userID' });
    return;
  }

  try {
    const { data } = await client.query({
      query: SEARCH_USER_DATA,
      variables: { userID: userID as string, searchTerm: q as string },
    });

    const notifications = data.getUserNotifications
      .filter((notification: any) =>
        notification.message.toLowerCase().includes((q as string).toLowerCase())
      )
      .map((notification: any) => ({
        ...notification,
        source: 'Notification',
      }));

    const history = data.getUserHistory
      .filter((history: any) =>
        history.entityType.toLowerCase().includes((q as string).toLowerCase()) ||
        history.actionType.toLowerCase().includes((q as string).toLowerCase()) ||
        history.changedData.toLowerCase().includes((q as string).toLowerCase())
      )
      .map((history: any) => ({
        ...history,
        source: 'History',
      }));

    res.status(200).json({ results: [...notifications, ...history] });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export default searchHandler;
