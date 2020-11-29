import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
  mutation register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password}) {
      errors {
        field
        message
      }
      value
    }
  }
`;

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

export const ME_USER = gql`
  query {
    me {
      id
      username
      name
      description
    }
  }
`;

export const FETCH_USER = gql`
  query user($username: String!){
    user(username: $username) {
      id
      username
      description
      name
      createdAt
      followsCount
      followersCount
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($name: String!, $description: String!) {
    updateUser(name: $name, description: $description) {
      description
      name
    }
  }
`;
