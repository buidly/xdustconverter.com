import React from 'react';
import { TokenAmountWithTooltip } from 'components';
import { useGetReferralRewards } from '../hooks';

export const ClaimReferralRewards = () => {
  const { rewards, reloadReferralRewards } = useGetReferralRewards();

  if (rewards.egld === '0') {
    return <></>;
  }

  return (
    <div className='card claim-rewards-card mb-4'>
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
      <button className='btn btn-logout'>Claim rewards</button>
    </div>
  );
};
