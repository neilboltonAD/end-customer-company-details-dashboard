import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  TransferRequest, 
  Subscription, 
  TransferSummary,
  CreateTransferInput,
  RejectTransferInput 
} from './types';
import { mockTransferRequests, mockSubscriptions } from '../api/mockData';

interface P2PContextType {
  // Data
  transfers: TransferRequest[];
  subscriptions: Subscription[];
  summary: TransferSummary;
  
  // Loading states
  isLoadingTransfers: boolean;
  isLoadingSubscriptions: boolean;
  isSubmitting: boolean;
  
  // Errors
  error: Error | null;
  
  // Actions
  refreshTransfers: () => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  createTransfer: (input: CreateTransferInput) => Promise<TransferRequest>;
  acceptTransfer: (transferId: string) => Promise<TransferRequest>;
  rejectTransfer: (transferId: string, input: RejectTransferInput) => Promise<TransferRequest>;
  cancelTransfer: (transferId: string) => Promise<TransferRequest>;
  
  // Computed
  incomingPending: TransferRequest[];
  outgoingPending: TransferRequest[];
  completedTransfers: TransferRequest[];
  failedTransfers: TransferRequest[];
}

const P2PContext = createContext<P2PContextType | null>(null);

interface P2PProviderProps {
  children: ReactNode;
}

export function P2PProvider({ children }: P2PProviderProps) {
  // Initialize with mock data for demo
  const [transfers, setTransfers] = useState<TransferRequest[]>(mockTransferRequests);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Computed values
  const incomingPending = transfers.filter(t => t.direction === 'Incoming' && t.status === 'Pending');
  const outgoingPending = transfers.filter(t => t.direction === 'Outgoing' && t.status === 'Pending');
  const completedTransfers = transfers.filter(t => t.status === 'Completed');
  const failedTransfers = transfers.filter(t => 
    t.status === 'Failed' || t.status === 'Rejected' || t.status === 'Cancelled'
  );

  const summary: TransferSummary = {
    incomingPending: incomingPending.length,
    outgoingPending: outgoingPending.length,
    completedLast90Days: completedTransfers.length,
    failedLast90Days: failedTransfers.length,
  };

  const refreshTransfers = useCallback(async () => {
    setIsLoadingTransfers(true);
    setError(null);
    try {
      // Simulate API delay for realistic demo
      await new Promise(resolve => setTimeout(resolve, 500));
      // In demo mode, we just use the current state (which was initialized with mock data)
      // In production, this would fetch from GraphQL
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load transfers'));
    } finally {
      setIsLoadingTransfers(false);
    }
  }, []);

  const refreshSubscriptions = useCallback(async () => {
    setIsLoadingSubscriptions(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      // In demo mode, subscriptions are pre-loaded
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load subscriptions'));
    } finally {
      setIsLoadingSubscriptions(false);
    }
  }, []);

  const createTransfer = useCallback(async (input: CreateTransferInput): Promise<TransferRequest> => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const selectedSubs = subscriptions.filter(s => input.subscriptionIds.includes(s.id));
      const totalValue = selectedSubs.reduce((sum, s) => sum + s.monthlyValue, 0);
      
      const newTransfer: TransferRequest = {
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
          status: 'Pending' as const,
        })),
        totalMonthlyValue: totalValue,
        createdDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      setTransfers(prev => [...prev, newTransfer]);
      return newTransfer;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create transfer');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [subscriptions]);

  const acceptTransfer = useCallback(async (transferId: string): Promise<TransferRequest> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      let updatedTransfer: TransferRequest | undefined;
      
      setTransfers(prev => prev.map(t => {
        if (t.id === transferId) {
          updatedTransfer = { 
            ...t, 
            status: 'InProgress' as const, 
            lastModifiedDate: new Date().toISOString() 
          };
          return updatedTransfer;
        }
        return t;
      }));

      // Simulate async completion after 2 seconds
      setTimeout(() => {
        setTransfers(prev => prev.map(t => 
          t.id === transferId 
            ? { 
                ...t, 
                status: 'Completed' as const, 
                completedDate: new Date().toISOString(),
                lastModifiedDate: new Date().toISOString() 
              }
            : t
        ));
      }, 2000);

      return updatedTransfer || transfers.find(t => t.id === transferId)!;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to accept transfer');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [transfers]);

  const rejectTransfer = useCallback(async (transferId: string, input: RejectTransferInput): Promise<TransferRequest> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedTransfer: TransferRequest | undefined;
      
      setTransfers(prev => prev.map(t => {
        if (t.id === transferId) {
          updatedTransfer = { 
            ...t, 
            status: 'Rejected' as const, 
            rejectionReason: input.reason,
            lastModifiedDate: new Date().toISOString() 
          };
          return updatedTransfer;
        }
        return t;
      }));

      return updatedTransfer || transfers.find(t => t.id === transferId)!;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to reject transfer');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [transfers]);

  const cancelTransfer = useCallback(async (transferId: string): Promise<TransferRequest> => {
    setIsSubmitting(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      let updatedTransfer: TransferRequest | undefined;
      
      setTransfers(prev => prev.map(t => {
        if (t.id === transferId) {
          updatedTransfer = { 
            ...t, 
            status: 'Cancelled' as const, 
            lastModifiedDate: new Date().toISOString() 
          };
          return updatedTransfer;
        }
        return t;
      }));

      return updatedTransfer || transfers.find(t => t.id === transferId)!;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel transfer');
      setError(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [transfers]);

  const value: P2PContextType = {
    transfers,
    subscriptions,
    summary,
    isLoadingTransfers,
    isLoadingSubscriptions,
    isSubmitting,
    error,
    refreshTransfers,
    refreshSubscriptions,
    createTransfer,
    acceptTransfer,
    rejectTransfer,
    cancelTransfer,
    incomingPending,
    outgoingPending,
    completedTransfers,
    failedTransfers,
  };

  return (
    <P2PContext.Provider value={value}>
      {children}
    </P2PContext.Provider>
  );
}

export function useP2P(): P2PContextType {
  const context = useContext(P2PContext);
  if (!context) {
    throw new Error('useP2P must be used within P2PProvider');
  }
  return context;
}
