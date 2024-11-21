import { gql } from "@apollo/client"


export const RESET_PASSWORD = gql`
mutation resetPassword($email: String!, $newPassword: String!){
  resetPassword(email: $email, newPassword: $newPassword)
}`

export const UPDATE_NOTIFICATION_SEEN = gql`
mutation markNotification($id: String!){
  markNotificationAsSeen(id: $id){
    id
    userid
    seen
    message
  }
}`

export const UPDATE_USER = gql`
mutation EditUser($userID: ID!, $input: CreateUserInput!){
  editUser(userID: $userID, input: $input){
    userImage
    firstName
    lastName
    email
    wallet
    phone
    city
    country
  }
}`

export const UPDATE_PASSWORD = gql`
mutation EditPassword($userID: ID!, $input: CreateUserInput!){
  editUser(userID: $userID, input: $input){
    password
  }
}`

export const CREATE_PLAN = gql`
mutation CreatePlan($input: CreatePlanInput!){
  createPlan(input: $input){
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
`

export const UPDATE_PLAN = gql`
mutation updatePlan($planID: ID!, $input: UpdatePlanInput!) {
  updatePlan(planID: $planID, input: $input) {
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
}`

export const DELETE_PLAN = gql`
mutation deletePlan($planID: ID! ){
 deletePlan(planID: $planID)
}`

export const MAKE_TRANSACTION = gql`
mutation makeTransfer($input: MakeTransfer!){
  makeTransaction(input: $input){
    from
    to
    amount
  }
}`

export const EDIT_WALLET = gql`
mutation editWallet($walletID: ID!, $input: EditWalletInput!){
  editWallet(walletID: $walletID, input: $input){
    address
  }
}`

export const CREATE_MESSAGE = gql`
mutation sendMessage($userID: ID!, $title: String! $message: String!){
  createNotification(userID: $userID, title: $title, message: $message){
    userid
  }
}`

export const MAKE_WITHDRAWAL_REQUEST = gql`
mutation withdrawalRequest($userID: ID!, $input: CreateWithdrawalRequestInput!){
  CreateWithdrawalRequest(userID: $userID, input: $input){
    userid
  }
}`

export const CREATE_INVESTMENT = gql`mutation CreateInvestment($userID: ID!, $input: CreateInvestmentInput!){
  CreateInvestment(userID: $userID, input: $input){
    userID
  }
}`