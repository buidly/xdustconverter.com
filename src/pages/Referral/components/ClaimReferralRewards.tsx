import React, { useEffect } from 'react';
import { useGetActiveTransactionsStatus } from '@elrondnetwork/dapp-core/hooks';
import { Transaction } from '@elrondnetwork/erdjs/out';
import { Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { sendAndSignTransactions } from 'apiCalls';
import { TokenAmountWithTooltip } from 'components';
import {
  useClaimReferralRewards,
  useGetReferralRewards,
  useGetReferralTier
} from '../hooks';
import { ReferralTier } from './ReferralTier';

export const ClaimReferralRewards = () => {
  const { rewards, reloadReferralRewards } = useGetReferralRewards();
  const { currentTier, nextTier } = useGetReferralTier();
  const { success, pending } = useGetActiveTransactionsStatus();

  const location = useLocation();
  const callbackRoute = `${location.pathname}${location.search}`;

  const claimReferralRewards = useClaimReferralRewards();

  useEffect(() => {
    if (success) {
      reloadReferralRewards();
    }
  }, [success]);

  const processClaimRewardsTransaction = async (
    transaction: Transaction | undefined
  ) => {
    try {
      if (transaction === undefined) {
        return;
      }

      const displayInfo = {
        processingMessage: 'Claim referral rewards',
        errorMessage: 'An error has occurred while claiming referral rewards',
        successMessage: 'referral rewards claimed '
      };
      await sendAndSignTransactions([transaction], displayInfo, callbackRoute);
    } catch (err: any) {
      console.log('processClaimRewardsTransaction error', err);
    }
  };

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();

    const transaction = claimReferralRewards();
    processClaimRewardsTransaction(transaction);
  };

  if (rewards.egld === '0') {
    return <></>;
  }

  return (
    <>
      <ReferralTier currentTier={currentTier} nextTier={nextTier} />
      <div className='card claim-rewards-card shine mb-4'>
        <div className='content'>
          <h4 className='mb-1'>Referral rewards</h4>
          <span>
            <TokenAmountWithTooltip
              value={rewards.egld}
              decimals={18}
              egldLabel={'WEGLD'}
              digits={4}
            />
            {rewards.usd && (
              <small className='d-block text-secondary'>≈ ${rewards.usd}</small>
            )}
          </span>
        </div>
        <button
          className='btn btn-logout'
          onClick={(e) => handleSubmit(e)}
          disabled={pending}
        >
          {pending ? (
            <Spinner as='span' animation='border' size='sm' />
          ) : (
            <>Claim rewards</>
          )}
        </button>
      </div>
    </>
  );
};
