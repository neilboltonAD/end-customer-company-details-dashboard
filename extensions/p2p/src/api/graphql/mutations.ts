import { gql } from '@apollo/client';

export const CREATE_TRANSFER = gql`
  mutation CreateTransfer($input: CreateTransferInput!) {
    createTransfer(input: $input) {
      id
      direction
      status
      sourcePartner {
        id
        name
        tenantId
      }
      targetPartner {
        id
        name
        tenantId
      }
      lineItems {
        id
        productName
        quantity
      }
      totalMonthlyValue
      createdDate
      expirationDate
    }
  }
`;

export const ACCEPT_TRANSFER = gql`
  mutation AcceptTransfer($transferId: ID!) {
    acceptTransfer(id: $transferId) {
      id
      status
      lastModifiedDate
      completedDate
    }
  }
`;

export const REJECT_TRANSFER = gql`
  mutation RejectTransfer($transferId: ID!, $reason: String) {
    rejectTransfer(id: $transferId, reason: $reason) {
      id
      status
      lastModifiedDate
      rejectionReason
    }
  }
`;

export const CANCEL_TRANSFER = gql`
  mutation CancelTransfer($transferId: ID!) {
    cancelTransfer(id: $transferId) {
      id
      status
      lastModifiedDate
    }
  }
`;

