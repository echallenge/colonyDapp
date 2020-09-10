import { useEffect } from 'react';
import { useField, useFormikContext } from 'formik';

import { FormValues } from './PurchaseCard';

interface Props {
  name: string;
  tokensRemaining: number;
}

const displayName = 'dashboard.CoinMachine.PurchaseCard.TokensRemainingField';

const TokensRemainingField = ({ name, tokensRemaining }: Props) => {
  const { setFieldValue } = useFormikContext<FormValues>();
  const [, { value }, { setValue }] = useField(name);

  useEffect(() => {
    if (tokensRemaining < value) {
      setFieldValue('numTokens', tokensRemaining);
    } else if (tokensRemaining !== value) {
      setValue(tokensRemaining);
    }
  }, [setFieldValue, setValue, tokensRemaining, value]);

  return null;
};

TokensRemainingField.displayName = displayName;

export default TokensRemainingField;
