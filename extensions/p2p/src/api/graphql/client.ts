import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mockTransferRequests, mockSubscriptions, getTransferSummary } from '../mockData';

// Mock GraphQL Schema for demo purposes
const typeDefs = `
  type Query {
    company(id: ID!): Company
    transfers(companyId: ID!, status: String, direction: String): TransferConnection
    transfer(id: ID!): Transfer
  }

  type Mutation {
    createTransfer(input: CreateTransferInput!): Transfer
    acceptTransfer(id: ID!): Transfer
    rejectTransfer(id: ID!, reason: String): Transfer
    cancelTransfer(id: ID!): Transfer
  }

  type Company {
    id: ID!
    name: String!
    externalId: String
    subscriptions(vendor: String): SubscriptionConnection
    vendorIntegrations(vendor: String): VendorIntegration
  }

  type VendorIntegration {
    tenantId: String
    mpnId: String
    gdapStatus: String
    lastSyncDate: String
  }

  type SubscriptionConnection {
    edges: [SubscriptionEdge!]!
  }

  type SubscriptionEdge {
    node: Subscription!
  }

  type Subscription {
    id: ID!
    productName: String!
    sku: String
    quantity: Int!
    term: String
    billingCycle: String!
    status: String!
    microsoftSubscriptionId: String
    monthlyValue: Float
    isTransferable: Boolean!
    ineligibilityReason: String
  }

  type TransferConnection {
    edges: [TransferEdge!]!
    pageInfo: PageInfo
  }

  type TransferEdge {
    node: Transfer!
  }

  type Transfer {
    id: ID!
    direction: String!
    status: String!
    sourcePartner: Partner!
    targetPartner: Partner!
    customerTenantId: String!
    customerName: String!
    lineItems: [TransferLineItem!]!
    totalMonthlyValue: Float!
    createdDate: String!
    lastModifiedDate: String!
    expirationDate: String!
    completedDate: String
    rejectionReason: String
    auditLog: [AuditLogEntry!]
  }

  type Partner {
    id: ID!
    name: String!
    tenantId: String!
    mpnId: String
  }

  type TransferLineItem {
    id: ID!
    subscriptionId: String!
    offerId: String!
    productName: String!
    skuName: String!
    quantity: Int!
    billingCycle: String!
    termDuration: String!
    monthlyValue: Float!
    status: String!
  }

  type AuditLogEntry {
    id: ID!
    timestamp: String!
    action: String!
    userId: String!
    userName: String!
    details: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  input CreateTransferInput {
    targetPartnerTenantId: String!
    targetPartnerMpnId: String
    subscriptionIds: [String!]!
  }
`;

// Mock resolvers that return demo data
const resolvers = {
  Query: {
    company: (_: unknown, { id }: { id: string }) => ({
      id,
      name: 'demoresellercustomer3',
      externalId: '7c7cd39e-e239-43c5-b099-0888671761af',
      vendorIntegrations: {
        tenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
        mpnId: '9876543',
        gdapStatus: 'Active',
        lastSyncDate: new Date().toISOString(),
      },
      subscriptions: {
        edges: mockSubscriptions.map(sub => ({
          node: {
            id: sub.id,
            productName: sub.productName,
            sku: sub.skuName,
            quantity: sub.quantity,
            term: sub.termDuration,
            billingCycle: sub.billingCycle,
            status: sub.status,
            microsoftSubscriptionId: sub.microsoftSubscriptionId,
            monthlyValue: sub.monthlyValue,
            isTransferable: sub.isTransferable,
            ineligibilityReason: sub.ineligibilityReason,
          },
        })),
      },
    }),
    transfers: () => ({
      edges: mockTransferRequests.map(transfer => ({
        node: transfer,
      })),
      pageInfo: {
        hasNextPage: false,
        endCursor: null,
      },
    }),
    transfer: (_: unknown, { id }: { id: string }) => {
      const transfer = mockTransferRequests.find(t => t.id === id);
      if (!transfer) return null;
      return {
        ...transfer,
        auditLog: [
          {
            id: 'log-1',
            timestamp: transfer.createdDate,
            action: 'CREATED',
            userId: 'user-1',
            userName: 'Neil Bolton',
            details: 'Transfer request created',
          },
        ],
      };
    },
  },
  Mutation: {
    createTransfer: (_: unknown, { input }: { input: { targetPartnerTenantId: string; targetPartnerMpnId?: string; subscriptionIds: string[] } }) => {
      const selectedSubs = mockSubscriptions.filter(s => input.subscriptionIds.includes(s.id));
      const totalValue = selectedSubs.reduce((sum, s) => sum + s.monthlyValue, 0);
      
      return {
        id: `transfer-${Date.now()}`,
        direction: 'Outgoing',
        status: 'Pending',
        sourcePartner: {
          id: 'partner-demo',
          name: 'Demo Reseller',
          tenantId: '408f194e-7263-4a16-8b97-5d4f8a9e3b7c',
          mpnId: '9876543',
        },
        targetPartner: {
          id: 'partner-target',
          name: 'Target Partner',
          tenantId: input.targetPartnerTenantId,
          mpnId: input.targetPartnerMpnId,
        },
        customerTenantId: '8e97f6e7-f67b-445f-9e85-3b2c4f7d8a9e',
        customerName: 'demoresellercustomer3',
        lineItems: selectedSubs.map((sub, i) => ({
          id: `li-new-${i}`,
          subscriptionId: sub.id,
          offerId: sub.offerId,
          productName: sub.productName,
          skuName: sub.skuName,
          quantity: sub.quantity,
          billingCycle: sub.billingCycle,
          termDuration: sub.termDuration,
          monthlyValue: sub.monthlyValue,
          status: 'Pending',
        })),
        totalMonthlyValue: totalValue,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    },
    acceptTransfer: (_: unknown, { id }: { id: string }) => {
      const transfer = mockTransferRequests.find(t => t.id === id);
      return {
        ...transfer,
        status: 'InProgress',
        lastModifiedDate: new Date().toISOString(),
      };
    },
    rejectTransfer: (_: unknown, { id, reason }: { id: string; reason?: string }) => {
      const transfer = mockTransferRequests.find(t => t.id === id);
      return {
        ...transfer,
        status: 'Rejected',
        rejectionReason: reason,
        lastModifiedDate: new Date().toISOString(),
      };
    },
    cancelTransfer: (_: unknown, { id }: { id: string }) => {
      const transfer = mockTransferRequests.find(t => t.id === id);
      return {
        ...transfer,
        status: 'Cancelled',
        lastModifiedDate: new Date().toISOString(),
      };
    },
  },
};

// Create executable schema with mock resolvers
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Use SchemaLink for mock mode (no network requests)
const link = new SchemaLink({ schema });

export const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          transfers: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

// Export flag to indicate demo mode
export const isDemoMode = true;
