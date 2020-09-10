import React, { useCallback } from 'react';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';
import { useFormikContext } from 'formik';
import { bigNumberify, BigNumber } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';

import Button from '~core/Button';
import { Input } from '~core/Fields';
import Numeral from '~core/Numeral';
import { useLoggedInUser } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

const MSG = defineMessages({
  balanceText: {
    id: 'dashboard.CoinMachine.PurchaseCard.AmountInput.balanceText',
    defaultMessage: 'Balance {balance}',
  },
  btnMaximum: {
    id: 'dashboard.CoinMachine.PurchaseCard.AmountInput.btnMaximum',
    defaultMessage: 'Max',
  },
  connectWallet: {
    id: 'dashboard.CoinMachine.PurchaseCard.AmountInput.connectWallet',
    defaultMessage: 'Connect your wallet to make a purchase',
  },
});

interface Props {
  decimals: number;
  name: string;
  priceEth: BigNumber;
  tokensRemaining: number;
}

const displayName = 'dashboard.CoinMachine.PurchaseCard.AmountInput';

const AmountInput = ({ decimals, name, priceEth, tokensRemaining }: Props) => {
  const { formatMessage } = useIntl();
  const { balance, ethereal } = useLoggedInUser();
  const { values, setFieldValue } = useFormikContext();

  const setMax = useCallback(() => {
    const bnTokensRemaining = bigNumberify(
      moveDecimal(tokensRemaining, decimals),
    );
    const amountEth = bigNumberify(
      moveDecimal(balance, DEFAULT_TOKEN_DECIMALS),
    );
    const amountCanAfford = amountEth.div(priceEth);
    const maxCanPurchase = amountCanAfford.lt(bnTokensRemaining)
      ? amountCanAfford.toString()
      : bnTokensRemaining.toString();
    console.log(amountCanAfford.toString(), bnTokensRemaining.toString());
    setFieldValue(name, maxCanPurchase);
  }, [balance, decimals, name, priceEth, setFieldValue, tokensRemaining]);

  return (
    <Input
      appearance={{
        margin: 'none',
        theme: 'underlined',
      }}
      disabled={ethereal}
      label={{ id: 'label.amount' }}
      name={name}
      formattingOptions={{
        delimiter: ',',
        numeral: true,
        numeralDecimalScale: getTokenDecimalsWithFallback(decimals),
      }}
      subContent={
        ethereal ? (
          <FormattedMessage {...MSG.connectWallet} />
        ) : (
          <>
            <FormattedMessage
              {...MSG.balanceText}
              values={{
                balance: <Numeral value={balance} suffix=" ETH" />,
              }}
            />
            &nbsp;
            <Button
              appearance={{ theme: 'blue' }}
              onClick={setMax}
              text={MSG.btnMaximum}
            />
          </>
        )
      }
      title={ethereal ? formatMessage(MSG.connectWallet) : undefined}
    />
  );
};

AmountInput.displayName = displayName;

export default AmountInput;
