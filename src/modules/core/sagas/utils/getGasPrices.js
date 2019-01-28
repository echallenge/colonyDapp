/* @flow */

import type { Saga } from 'redux-saga';
import BigNumber from 'bn.js';

import { call, getContext, put, select } from 'redux-saga/effects';

import type { GasPrices } from '../../types';

import { gasPrices as gasPricesSelector } from '../../selectors';
import { updateGasPrices } from '../../actionCreators';

type EthGasStationAPIResponse = {
  average: number,
  avgWait: number,
  block_time: number,
  blockNum: number,
  fast: number,
  fastest: number,
  fastWait: number,
  fastestWait: number,
  safeLow: number,
  safeLowWait: number,
  speed: number,
};

const ETH_GAS_STATION_ENDPOINT =
  'https://ethgasstation.info/json/ethgasAPI.json';

export default function* getGasPrices(): Saga<GasPrices> {
  const colonyManager = yield getContext('colonyManager');

  const cachedPrices = yield select(gasPricesSelector);

  if (Date.now() - cachedPrices.timestamp < 15 * 60 * 1000) {
    return cachedPrices;
  }

  const networkGasPrice = yield call([
    colonyManager.networkClient.adapter.provider,
    colonyManager.networkClient.adapter.provider.getGasPrice,
  ]);

  try {
    const response = yield call(fetch, ETH_GAS_STATION_ENDPOINT);
    const data: EthGasStationAPIResponse = yield response.json();

    const pointOneGwei = new BigNumber(10 ** 8);

    const gasPrices = {
      timestamp: Date.now(),
      // TODO: Handling the weird ethers BN implementation. Remove when web3
      network: new BigNumber(networkGasPrice.toString()),
      // API prices are in 10Gwei
      suggested: new BigNumber(data.average).mul(pointOneGwei),
      suggestedWait: data.avgWait * 60,
      cheaper: new BigNumber(data.safeLow).mul(pointOneGwei),
      cheaperWait: data.safeLowWait * 60,
      faster: new BigNumber(data.fast).mul(pointOneGwei),
      fasterWait: data.fastWait * 60,
    };

    yield put(updateGasPrices(gasPrices));

    return gasPrices;
  } catch (e) {
    console.warn(`Could not get ETH gas prices: ${e.message}`);
    return { suggested: networkGasPrice, timestamp: Date.now() };
  }
}