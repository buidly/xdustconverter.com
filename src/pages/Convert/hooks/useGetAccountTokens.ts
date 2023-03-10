import { useEffect, useState } from 'react';
import { useGetAccount } from '@multiversx/sdk-dapp/hooks';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { AxiosError } from 'axios';
import {
  getWhitelistedAccountTokens,
  getWhitelistedDashboardTokens
} from 'apiCalls';
import { AccountToken } from 'types';

export const useGetAccountTokens = () => {
  const {
    network: { apiAddress }
  } = useGetNetworkConfig();
  const { address } = useGetAccount();
  const isLoggedIn = Boolean(address);

  const [tokens, setTokens] = useState<AccountToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchAccountTokens = async () => {
    try {
      setIsLoading(true);

      let allTokens: AccountToken[] = [];
      if (isLoggedIn) {
        allTokens = await getWhitelistedAccountTokens(apiAddress, address);
      } else {
        allTokens = await getWhitelistedDashboardTokens(apiAddress);
      }

      setTokens(allTokens);
    } catch (err) {
      console.error(error);

      const { message } = err as AxiosError;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountTokens();
  }, [isLoggedIn]);

  return { tokens, isLoading, error, reloadTokens: fetchAccountTokens };
};
