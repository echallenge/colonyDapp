import React, { useCallback, ReactNode } from 'react';
import { defineMessages } from 'react-intl';
import { BigNumber, bigNumberify } from 'ethers/utils';
import * as yup from 'yup';
import moveDecimal from 'move-decimal-point';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import Button from '~core/Button';
import Card from '~core/Card';
import EthUsd from '~core/EthUsd';
import { Form, WalletBalance } from '~core/Fields';
import Heading from '~core/Heading';
import Numeral from '~core/Numeral';
import { OneToken, useLoggedInUser } from '~data/index';
import { getMainClasses } from '~utils/css';

import TokensRemainingField from './TokensRemainingField';
import AmountInput from './AmountInput';

import cardStyles from '../CoinMachineCard.css';
import styles from './PurchaseCard.css';

const MSG = defineMessages({
  btnBuy: {
    id: 'dashboard.CoinMachine.PurchaseCard.btnBuy',
    defaultMessage: 'Buy',
  },
  cardHelpText: {
    id: 'dashboard.CoinMachine.PurchaseCard.cardHelpText',
    defaultMessage: `This is where you buy tokens. You put how
      much you want in the amount field and click the big green
      buy button. It’s really quite self explanatory.`,
  },
  summaryRowTitleCost: {
    id: 'dashboard.CoinMachine.PurchaseCard.summaryRowTitleCost',
    defaultMessage: 'Cost',
  },
  summaryRowTitlePrice: {
    id: 'dashboard.CoinMachine.PurchaseCard.summaryRowTitlePrice',
    defaultMessage: 'Price',
  },
  title: {
    id: 'dashboard.CoinMachine.PurchaseCard.title',
    defaultMessage: 'Buy {symbol}',
  },
});

export interface FormValues {
  numTokens: string;
  walletBalance: string;
  tokensRemaining: Props['tokensRemaining'];
  // fixme add cost field for validating numTokens (cost < balance)
}

interface Props {
  priceEth: BigNumber;
  tokensRemaining: number;
  token: OneToken;
}

interface PurchaseRowProps {
  children: ReactNode;
  valueDescription: string;
}

const PurchaseSummaryRow = ({
  children,
  valueDescription,
}: PurchaseRowProps) => (
  <div className={styles.purchaseSummaryRow}>
    {children}
    <div className={styles.purchaseSummaryRowDescription}>
      {valueDescription}
    </div>
  </div>
);

const validationSchema = yup.object({
  numTokens: yup.number().typeError().positive().required(),
});

const displayName = 'dashboard.CoinMachine.PurchaseCard';

const PurchaseCard = ({
  priceEth,
  token: { decimals, symbol },
  tokensRemaining,
}: Props) => {
  const { balance, ethereal } = useLoggedInUser();

  const getCostInEth = useCallback(
    (numTokens: string) => {
      const bnNumTokens = bigNumberify(moveDecimal(numTokens, decimals));
      const cost = bnNumTokens.isZero()
        ? new BigNumber(0)
        : priceEth.mul(bnNumTokens);
      return bigNumberify(
        moveDecimal(cost.toString(), -1 * DEFAULT_TOKEN_DECIMALS),
      );
    },
    [decimals, priceEth],
  );

  const handleSubmit = useCallback((values: FormValues) => {
    console.log(values);
  }, []);

  return (
    <Card className={getMainClasses({}, cardStyles)} help={MSG.cardHelpText}>
      <div className={styles.mainContent}>
        <div>
          <Heading
            appearance={{ size: 'medium', theme: 'dark' }}
            text={MSG.title}
            textValues={{ symbol }}
          />
        </div>
        <Form<FormValues>
          className={styles.form}
          enableReinitialize
          initialValues={{
            numTokens: '0.00',
            walletBalance: balance,
            tokensRemaining,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ dirty, isValid, values: { numTokens } }) => {
            const cost = getCostInEth(numTokens);
            return (
              <div className={styles.formContent}>
                <WalletBalance name="walletBalance" />
                <TokensRemainingField
                  name="tokensRemaining"
                  tokensRemaining={tokensRemaining}
                />
                <div>
                  <PurchaseSummaryRow valueDescription={symbol}>
                    <div />
                    <div className={styles.purchaseSummaryRowAmount}>
                      <AmountInput
                        decimals={decimals}
                        name="numTokens"
                        priceEth={priceEth}
                        tokensRemaining={tokensRemaining}
                      />
                    </div>
                  </PurchaseSummaryRow>
                  <PurchaseSummaryRow valueDescription={`ETH/${symbol}`}>
                    <div>
                      <Heading
                        appearance={{ size: 'normal', theme: 'dark' }}
                        text={MSG.summaryRowTitlePrice}
                      />
                    </div>
                    <div className={styles.purchaseSummaryRowAmount}>
                      <Numeral
                        appearance={{ theme: 'dark', weight: 'medium' }}
                        unit={DEFAULT_TOKEN_DECIMALS}
                        value={priceEth}
                      />
                      <br />
                      <EthUsd value={priceEth} />
                    </div>
                  </PurchaseSummaryRow>
                  <PurchaseSummaryRow valueDescription="ETH">
                    <div>
                      <Heading
                        appearance={{ size: 'normal', theme: 'dark' }}
                        text={MSG.summaryRowTitleCost}
                      />
                    </div>
                    <div className={styles.purchaseSummaryRowAmount}>
                      <Numeral
                        appearance={{ theme: 'dark', weight: 'medium' }}
                        unit={DEFAULT_TOKEN_DECIMALS}
                        value={cost}
                      />
                      <br />
                      <EthUsd value={cost} />
                    </div>
                  </PurchaseSummaryRow>
                </div>
                <div className={styles.buttonContainer}>
                  <Button
                    appearance={{ size: 'large', theme: 'primary' }}
                    disabled={!isValid || !dirty || ethereal}
                    type="submit"
                    text={MSG.btnBuy}
                  />
                </div>
              </div>
            );
          }}
        </Form>
      </div>
    </Card>
  );
};

PurchaseCard.displayName = displayName;

export default PurchaseCard;
