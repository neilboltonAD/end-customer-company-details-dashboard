import { gql } from '@apollo/client';

export const GET_COMPANY_MICROSOFT_DATA = gql`
  query GetCompanyMicrosoftData($companyId: ID!) {
    company(id: $companyId) {
      id
      name
      externalId
      vendorIntegrations(vendor: MICROSOFT) {
        tenantId
        mpnId
        gdapStatus
        lastSyncDate
      }
    }
  }
`;

export const GET_COMPANY_SUBSCRIPTIONS = gql`
  query GetCompanySubscriptions($companyId: ID!) {
    company(id: $companyId) {
      id
      subscriptions(vendor: MICROSOFT) {
        edges {
          node {
            id
            productName
            sku
            quantity
            term
            billingCycle
            status
            microsoftSubscriptionId
            monthlyValue
            isTransferable
            ineligibilityReason
          }
        }
      }
    }
  }
`;

export const GET_TRANSFERS = gql`
  query GetTransfers($companyId: ID!, $status: TransferStatus, $direction: TransferDirection) {
    transfers(companyId: $companyId, status: $status, direction: $direction) {
      edges {
        node {
          id
          direction
          status
          sourcePartner {
            id
            name
            tenantId
            mpnId
          }
          targetPartner {
            id
            name
            tenantId
            mpnId
          }
          customerTenantId
          customerName
          lineItems {
            id
            subscriptionId
            offerId
            productName
            skuName
            quantity
            billingCycle
            termDuration
            monthlyValue
            status
          }
          totalMonthlyValue
          createdDate
          lastModifiedDate
          expirationDate
          completedDate
          rejectionReason
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_TRANSFER_DETAILS = gql`
  query GetTransferDetails($transferId: ID!) {
    transfer(id: $transferId) {
      id
      direction
      status
      sourcePartner {
        id
        name
        tenantId
        mpnId
      }
      targetPartner {
        id
        name
        tenantId
        mpnId
      }
      customerTenantId
      customerName
      lineItems {
        id
        subscriptionId
        offerId
        productName
        skuName
        quantity
        billingCycle
        termDuration
        monthlyValue
        status
      }
      totalMonthlyValue
      createdDate
      lastModifiedDate
      expirationDate
      completedDate
      rejectionReason
      auditLog {
        id
        timestamp
        action
        userId
        userName
        details
      }
    }
  }
`;

