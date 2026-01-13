import { useEffect } from 'react';
import { useP2P } from '../context/P2PContext';
import { CreateTransferInput, TransferRequest } from '../context/types';

interface UseTransfersResult {
  transfers: TransferRequest[];
  incomingPending: TransferRequest[];
  outgoingPending: TransferRequest[];
  completedTransfers: TransferRequest[];
  failedTransfers: TransferRequest[];
  summary: {
    incomingPending: number;
    outgoingPending: number;
    completedLast90Days: number;
    failedLast90Days: number;
  };
  loading: boolean;
  submitting: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  create: (input: CreateTransferInput) => Promise<TransferRequest>;
  accept: (transferId: string) => Promise<TransferRequest>;
  reject: (transferId: string, reason: string) => Promise<TransferRequest>;
  cancel: (transferId: string) => Promise<TransferRequest>;
}

export function useTransfers(): UseTransfersResult {
  const {
    transfers,
    incomingPending,
    outgoingPending,
    completedTransfers,
    failedTransfers,
    summary,
    isLoadingTransfers,
    isSubmitting,
    error,
    refreshTransfers,
    createTransfer,
    acceptTransfer,
    rejectTransfer,
    cancelTransfer,
  } = useP2P();

  const reject = async (transferId: string, reason: string): Promise<TransferRequest> => {
    return rejectTransfer(transferId, { reason });
  };

  return {
    transfers,
    incomingPending,
    outgoingPending,
    completedTransfers,
    failedTransfers,
    summary,
    loading: isLoadingTransfers,
    submitting: isSubmitting,
    error,
    refresh: refreshTransfers,
    create: createTransfer,
    accept: acceptTransfer,
    reject,
    cancel: cancelTransfer,
  };
}
