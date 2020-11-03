import { gql } from '@apollo/client';

/* export const SIGNUP_USER = gql`
`; */

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(options: { username: $username, password: $password}) {
      errors {
        field
        message
      }
      value
    }
  }
`;