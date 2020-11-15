import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation addMessage($message: String!) {
    addMessage(message: $message) {
      id
      text
      createdAt
      user {
        username
      }
    }
  }
`;

export const USER_MESSAGES = gql`
  query messages($username: String!, $offset: Int){
    messages(username: $username, options: { offset: $offset, limit: 5 }) {
      messages {
        createdAt
        id
        text
        user {
          username
          name
        }
      }
      hasMore
    }
  }
`;