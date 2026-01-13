import { useP2P } from '../context/P2PContext';
import { Subscription } from '../context/types';

interface UseSubscriptionsResult {
  subscriptions: Subscription[];
  transferable: Subscription[];
  nonTransferable: Subscription[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useSubscriptions(): UseSubscriptionsResult {
  const {
    subscriptions,
    isLoadingSubscriptions,
    error,
    refreshSubscriptions,
  } = useP2P();

  const transferable = subscriptions.filter(s => s.isTransferable);
  const nonTransferable = subscriptions.filter(s => !s.isTransferable);

  return {
    subscriptions,
    transferable,
    nonTransferable,
    loading: isLoadingSubscriptions,
    error,
    refresh: refreshSubscriptions,
  };
}
