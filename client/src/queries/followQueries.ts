import { gql } from '@apollo/client';

/* export const FOLLOW = gql`

`; */

export const FOLLOWS_TO = gql`
  query followsTo($id: Int!) {
    followsTo(id: $id) {
      followedAt
      followsTo {
        name
        username
        id
      }
    }
  }
`;

export const FOLLOWERS = gql`
  query followers($id: Int!) {
    followers(id: $id) {
      followedAt
      follower {
        name
        username
        id
      }
    }
  }
`;