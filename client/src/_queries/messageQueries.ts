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