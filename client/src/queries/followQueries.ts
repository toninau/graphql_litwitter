import { gql } from '@apollo/client';

export const FOLLOW = gql`
  mutation followUser($id: Int!) {
    followUser(id: $id) {
      followedAt
    }
  }
`;

export const UNFOLLOW = gql`
  mutation unfollowUser($id: Int!) {
    unfollowUser(id: $id)
  }
`;

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