/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { DialogType } from '~core/Dialog';
import type { TokenType } from '~types/token';

import Button from '~core/Button';
import CardList from '~core/CardList';
import Heading from '~core/Heading';

import styles from './Tokens.css';

import TokenCard from './TokenCard.jsx';

const MSG = defineMessages({
  title: {
    id: 'dashboard.Tokens.title',
    defaultMessage: 'Token Balances',
  },
  nativeTokenText: {
    id: 'dashboard.Tokens.nativeTokenText',
    defaultMessage: '*Native token: {nativeToken}',
  },
  navItemMintNewTokens: {
    id: 'dashboard.Tokens.navItemMintNewTokens',
    defaultMessage: 'Mint New Tokens',
  },
  navItemEditTokens: {
    id: 'dashboard.Tokens.navItemEditTokens',
    defaultMessage: 'Edit Tokens',
  },
});

type Props = {
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
  tokens: Array<TokenType>,
};

class Tokens extends Component<Props> {
  timeoutId: TimeoutID;

  static displayName = 'admin.Tokens';

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleOpenTokenEditDialog = () => {
    const { openDialog, tokens } = this.props;
    const tokenEditDialog = openDialog('TokenEditDialog', { tokens });
    tokenEditDialog.afterClosed().catch(() => {
      // cancel actions here
    });
  };

  handleOpenTokenMintDialog = () => {
    const { openDialog, tokens } = this.props;
    const nativeToken = tokens.find(token => token.isNative);
    const mintNewTokensDialog = openDialog('TokenMintDialog', {
      onMintNewTokensSubmitted: this.onMintNewTokensSubmitted,
      nativeToken,
    });
    mintNewTokensDialog.afterClosed().catch(() => {
      // cancel actions here
    });
  };

  onMintNewTokensSubmitted = () => {
    /*
     * TODO: Open the gas station here once implemented
     *
     * There's a chance this will happen in a reducer or some
     * other place at some point, but it's here now for demo purposes
     */
    const { openDialog } = this.props;
    const mintingNewTokensDialog = openDialog('ActivityBarExample');
    this.timeoutId = setTimeout(() => {
      mintingNewTokensDialog.close();
    }, 3000);
  };

  render() {
    const { tokens = [] } = this.props;
    const nativeToken = tokens.find(token => token.isNative);
    const isColonyAdmin = true; // TODO determine this value. Will all users visiting this route be admins?
    const isUserColonyOwner = true; // TODO determine this value.
    const canMintNewTokens = true; // TODO determine this value. token generated at colony launch ? true : false;
    return (
      <div className={styles.main}>
        <main>
          <div className={styles.titleContainer}>
            <Heading
              text={MSG.title}
              appearance={{ size: 'medium', theme: 'dark' }}
            />
            {nativeToken && (
              <Heading appearance={{ size: 'normal' }}>
                <FormattedMessage
                  {...MSG.nativeTokenText}
                  values={{ nativeToken: nativeToken.tokenSymbol }}
                />
              </Heading>
            )}
          </div>
          <div className={styles.tokenCardContainer}>
            <CardList>
              {tokens.filter(token => token.isEnabled).map(token => (
                <TokenCard key={token.id} token={token} />
              ))}
            </CardList>
          </div>
        </main>
        {isColonyAdmin && (
          <aside className={styles.sidebar}>
            <ul>
              {isUserColonyOwner &&
                canMintNewTokens && (
                  <li>
                    <Button
                      text={MSG.navItemMintNewTokens}
                      appearance={{ theme: 'blue' }}
                      onClick={this.handleOpenTokenMintDialog}
                    />
                  </li>
                )}
              <li>
                <Button
                  text={MSG.navItemEditTokens}
                  appearance={{ theme: 'blue' }}
                  onClick={this.handleOpenTokenEditDialog}
                />
              </li>
            </ul>
          </aside>
        )}
      </div>
    );
  }
}

export default Tokens;