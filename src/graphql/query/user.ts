import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
query getAllUsers{
  getAllUsers{
    userID
    firstName
    lastName
  }
}`

export const GET_ALL_USERS_DETAIL = gql`
query getAllUsers{
  getAllUsers{
    userID
    firstName
    email
    wallet
  }
}`

export const GET_USER_TYPE = gql`
  query GetUserType($userID: ID!) {
    getUser(userID: $userID) {
      type
    }
  }
`;

export const GET_USER = gql`
 query GetUser($userID: ID!) {
  getUser(userID: $userID) {
    userID
    userImage
    firstName
    lastName
    type
  }
}
`;

export const GET_ALL_USERS_LOCATION = gql`
query getAllUsers{
  getAllUsers{
    country
  }
}`

export const GET_ALL_INVESTMENTS = gql`
query getAllInvestments{
 	getAllInvestments{
    amount
  }
}`

export const GET_ALL_BALANCES = gql`
query getAllBalances{
  getAllBalances{
    amount
  }
}`

export const GET_INVESTMENTS_CHAT = gql`
query getAllInvestments{
 	getAllInvestments{
    amount
    timestamp
  }
}`

export const GET_ALL_HISTORY = gql`
query GetAllHistory{
  getAllHistory {
    id
    userID
    entityType
    actionType
    changedData
    timestamp
  }
}`


export const GET_USER_HISTORY = gql`
query GetUserHistory($userID: ID!) {
  getUserHistory(userID: $userID) {
    id
    userID
    entityType
    actionType
    changedData
    timestamp
  }
}`

export const GET_USER_NOTIFICATION = gql`
query GetUserNotification($userID: String!){
  getUserNotifications(userID: $userID){
    id
    userid
    title
    message
    seen
    timestamp
  }
}`

export const SEARCH_USER_DATA = gql`
  query SearchUserData($userID: ID!, $searchTerm: String!) {
    getUserNotifications(userID: $userID) {
      id
      userid
      message
      seen
      timestamp
    }
    getUserHistory(userID: $userID) {
      id
      userID
      entityType
      actionType
      changedData
      timestamp
    }
  }
`;

export const GET_USER_FOR_ACCOUNT = gql`
query GetUser($userID: ID!) {
  getUser(userID: $userID) {
    userImage
    firstName
    lastName
    email
    wallet
    phone
    city
    country
  }
}`;

export const GET_MEMO = gql`
query getUserMemo($userID: ID!){
  getMemo(userID: $userID){
    userID
    memo
  }
}`

export const VERIFY_EMAIL = gql`
query getUnverifiedEmail($email: String!){
  getUnverifiedEmail(email: $email){
    uniqueverifier
    email
  }
}`

export const ESTIMATED_BALANCE = gql`
query getUserASSETINFO($userID: ID!){
  getBalance(userID: $userID){
    amount
  }
}`

export const ASSETS = gql`
query getUserAsset($userID: ID!) {
    getUserAsset(userID: $userID) {
        getBalance {
            amount
        }
        getCredit {
            amount
        }
        getInvestment {
            amount
        }
        getReferences {
            amount
        }
    }
}`;

export const GET_USER_INVESTMENT = gql`
query getInvestment($userID: ID!){
  getInvestment(userID: $userID){
    userID
    amount
  }
}`

export const GET_REF = gql`
query getRef($userID: ID!){
  getReferral(userID: $userID){
    link
  }
}`

export const GET_PLAN = gql`
  query getAllPlans {
    getAllPlans {
      id
      title
      amount
      return
      duration
      referalBonus
      description {
        id
        point
      }
    }
  }
`;

export const GET_ALL_TRANS = gql`
query getALLUserTransaction($id: ID!){
  getAllUserTransaction(id: $id){
    id
    from
    to
  }
}`

export const GET_CREDITS = gql`
query getAllUserCredit($to: String!){
  getUserCreditTransactions(to: $to){
    from
    to
    amount
  }
}`

export const GET_DEBITS = gql`
query getAllUserDebit($from: String!){
  getUserDebutTransactions(from: $from){
    from
    to
    amount
  }
}`

export const GET_ADMIN_ACCOUNT = gql`
query getWallet{
  getWallet{
    address
  }
}`

export const GET_UNIQUE_VERIFIER = gql`
query getUserVerificationToken($email: String!){
  getUserVerificationToken(email: $email){
    email
    uniqueverifier
    verified
  }
}`

export const GET_REFERAL_COUNT = gql`
query getReferral($userID: ID!){
  getReferral(userID: $userID){
    link
    count
  }
}`

export const GET_WITHDRAWAL_REQUESTS = gql`
query getAllWithdrawalRequest{
  getAllWithdrawalRequests{
    userid
    amount
    timestamp
  }
}`