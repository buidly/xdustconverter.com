import React from 'react';
import BigNumber from 'bignumber.js';
import Select from 'react-select';
import { ValueWithTooltip } from 'components';
import { SLIPPAGE } from 'config';
import { InfoTooltip } from 'pages/Referral/components';
import { ConvertToken } from 'types';
import { accountTokensStyles } from './accountTokensStyles';
import './AccountTokens.scss';

export const WEGLD_ID = 'WEGLD';

export interface ConvertInfoProps {
  token: ConvertToken | undefined;
  allTokens: ConvertToken[];
  onTokenChange: (token: ConvertToken) => void;
  totalToken: BigNumber;
  totalUsd: BigNumber;
  totalWegld: BigNumber;
  protocolFee: number;
  slippage: number;
  setSlippage: (value: number) => void;
}

export const ConvertInfo = ({
  token,
  allTokens,
  onTokenChange,
  totalToken,
  totalUsd,
  totalWegld,
  protocolFee,
  slippage,
  setSlippage
}: ConvertInfoProps) => {
  const formattedTotalInToken = totalToken
    .decimalPlaces(6, BigNumber.ROUND_DOWN)
    .toFixed();
  const formattedTotalInUsd = totalUsd
    .decimalPlaces(2, BigNumber.ROUND_DOWN)
    .toFixed();
  const formattedTotalInWegld = totalWegld
    .decimalPlaces(6, BigNumber.ROUND_DOWN)
    .toFixed();
  const formattedConversionCost = new BigNumber(protocolFee)
    .times(formattedTotalInUsd)
    .div(100)
    .decimalPlaces(4, BigNumber.ROUND_DOWN)
    .toFixed();

  const formatAccountToken = (data: ConvertToken) => {
    return (
      <div className='d-flex flex-row align-items-center xdc__select__option'>
        <img className='mr-2' src={data.svgUrl} alt={data.ticker} />
        <span>{data.ticker}</span>
      </div>
    );
  };

  return (
    <div className='card card-info my-spacer'>
      <div className='d-flex justify-content-between align-items-center flex-wrap mb-2'>
        <div className='text-secondary mr-2'>Token</div>
        <span className='text-main'>
          <Select
            className='xdc__select'
            options={allTokens}
            formatOptionLabel={(option) => formatAccountToken(option)}
            styles={accountTokensStyles}
            placeholder='Select token'
            isSearchable={false}
            value={token}
            getOptionValue={(option) => option.identifier}
            onChange={(selected) => {
              selected && onTokenChange(selected);
            }}
          />
        </span>
      </div>
      {totalToken.isGreaterThan(0) && (
        <>
          <div className='d-flex justify-content-between flex-wrap mb-2'>
            <div className='text-secondary mr-2'>Minimum converted</div>
            <div className='d-flex flex-column'>
              <span className='text-main'>
                <ValueWithTooltip
                  formattedValue={formattedTotalInToken}
                  value={totalToken.toFixed()}
                />{' '}
                {token?.ticker}
                {!token?.identifier?.includes(WEGLD_ID) && (
                  <>
                    {' '}
                    ≈{' '}
                    <ValueWithTooltip
                      formattedValue={formattedTotalInWegld}
                      value={totalWegld.toFixed()}
                    />{' '}
                    WEGLD
                  </>
                )}
              </span>
              <small className='text-secondary text-right'>
                ≈ ${formattedTotalInUsd}
              </small>
            </div>
          </div>
          <div className='d-flex justify-content-between flex-wrap mb-2'>
            <div className='text-secondary mr-2'>Conversion cost</div>
            <span className='text-main'>≈ ${formattedConversionCost}</span>
          </div>
          <div className='d-flex justify-content-between align-items-center flex-wrap mb-2'>
            <div className='text-secondary mr-2'>
              Slippage{' '}
              <InfoTooltip>
                <p>
                  Your transaction will revert if the price moves unfavorably
                  more than this percentage.
                </p>
              </InfoTooltip>
            </div>
            <span className='text-main'>
              {SLIPPAGE.map((value) => (
                <div
                  className={`btn btn-slippage ${
                    value === slippage ? 'active' : ''
                  }`}
                  onClick={() => setSlippage(value)}
                >
                  {value * 100}%
                </div>
              ))}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
