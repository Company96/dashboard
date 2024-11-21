import { gql } from '@apollo/client';

export const SIGNUP = gql`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input){
    userID
  }
}`

export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) 
}`

export const LINK = gql`
mutation referalCount($link: String!){
  referralCount(link: $link){
    link
  }
}`

export const VERIFY_USER = gql`
mutation VerifyUser($uniqueverifier: String!){
  VerifyUser(uniqueverifier: $uniqueverifier)
}`