import { useField } from 'formik';
import { useEffect } from 'react';

import { useLoggedInUser } from '~data/index';

interface Props {
  name: string;
}

const displayName = 'Fields.WalletBalance';

// fixme maybe this shouldn't go here?
const WalletBalance = ({ name }: Props) => {
  const { balance } = useLoggedInUser();
  const [, { value }, { setValue }] = useField(name);

  useEffect(() => {
    if (balance !== value) {
      setValue(balance);
    }
  }, [balance, value, setValue]);

  return null;
};

WalletBalance.displayName = displayName;

export default WalletBalance;
