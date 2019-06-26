/* @flow */

import type { ContractResponse } from '@colony/colony-js-client';
import { END, eventChannel } from 'redux-saga';

import type { TransactionRecordType } from '~immutable';

import {
  transactionError,
  transactionReceiptReceived,
  transactionSent,
  transactionSucceeded,
} from '../../actionCreators';

const channelSendTransaction = async ({ id, params }, txPromise, emit) => {
  if (!txPromise) {
    emit(transactionError(id, 'send', new Error('No send promise found')));
    return null;
  }

  try {
    const result = await txPromise;
    const { hash } = result.meta.transaction;
    emit(transactionSent(id, { hash, params }));
    return result;
  } catch (caughtError) {
    emit(transactionError(id, 'send', caughtError));
  }

  return null;
};

const channelGetTransactionReceipt = async (
  { id, params },
  { meta: { receiptPromise } },
  emit,
) => {
  if (!receiptPromise) {
    emit(
      transactionError(id, 'receipt', new Error('No receipt promise found')),
    );
    return null;
  }

  try {
    const receipt = await receiptPromise;
    emit(transactionReceiptReceived(id, { receipt, params }));
    return receipt;
  } catch (caughtError) {
    emit(transactionError(id, 'receipt', caughtError));
  }

  return null;
};

const channelGetEventData = async (
  { id, params },
  { eventDataPromise },
  emit,
) => {
  if (!eventDataPromise) {
    emit(
      transactionError(id, 'eventData', new Error('No event promise found')),
    );
    return null;
  }

  try {
    const eventData = await eventDataPromise;
    emit(transactionSucceeded(id, { eventData, params }));
    return eventData;
  } catch (caughtError) {
    emit(transactionError(id, 'eventData', caughtError));
  }

  return null;
};

const channelStart = async (tx, txPromise, emit) => {
  try {
    const sentTx = await channelSendTransaction(tx, txPromise, emit);
    if (!sentTx) return null;

    const receipt = await channelGetTransactionReceipt(tx, sentTx, emit);

    if (receipt && receipt.status === 1) {
      await channelGetEventData(tx, sentTx, emit);
    } else {
      /**
       * @todo Use revert reason strings (once supported) in transactions.
       */
      emit(
        transactionError(
          tx.id,
          'unsuccessful',
          new Error('The transaction was unsuccessful'),
        ),
      );
    }

    return null;
  } catch (caughtError) {
    // This is unlikely to happen, since the functions called have their own
    // error handling, but worth doing for sanity.
    emit(transactionError(tx.id, 'unsuccessful', caughtError));
    return null;
  } finally {
    emit(END);
  }
};

/*
 * Given a promise for sending a transaction, send the transaction and
 * emit actions with the transaction status.
 */
const transactionChannel = (
  txPromise: Promise<ContractResponse<*>>,
  tx: TransactionRecordType,
) =>
  eventChannel(emit => {
    channelStart(tx, txPromise, emit);
    return () => {};
  });

export default transactionChannel;
