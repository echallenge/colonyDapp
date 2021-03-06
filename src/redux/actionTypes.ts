/* eslint-disable prettier/prettier, max-len */

/*
 * Please try to keep this list in alphabetical order :-)
 * (hopefully your editor can do it!)
 */
export enum ActionTypes {
  COLONY_AVATAR_REMOVE = 'COLONY_AVATAR_REMOVE',
  COLONY_AVATAR_REMOVE_ERROR = 'COLONY_AVATAR_REMOVE_ERROR',
  COLONY_AVATAR_REMOVE_SUCCESS = 'COLONY_AVATAR_REMOVE_SUCCESS',
  COLONY_AVATAR_UPLOAD = 'COLONY_AVATAR_UPLOAD',
  COLONY_AVATAR_UPLOAD_ERROR = 'COLONY_AVATAR_UPLOAD_ERROR',
  COLONY_AVATAR_UPLOAD_SUCCESS = 'COLONY_AVATAR_UPLOAD_SUCCESS',
  COLONY_CLAIM_TOKEN = 'COLONY_CLAIM_TOKEN',
  COLONY_CLAIM_TOKEN_ERROR = 'COLONY_CLAIM_TOKEN_ERROR',
  COLONY_CLAIM_TOKEN_SUCCESS = 'COLONY_CLAIM_TOKEN_SUCCESS',
  COLONY_CREATE = 'COLONY_CREATE',
  COLONY_CREATE_CANCEL = 'COLONY_CREATE_CANCEL',
  COLONY_CREATE_ERROR = 'COLONY_CREATE_ERROR',
  COLONY_CREATE_SUCCESS = 'COLONY_CREATE_SUCCESS',
  COLONY_DOMAIN_USER_ROLES_SET = 'COLONY_DOMAIN_USER_ROLES_SET',
  COLONY_DOMAIN_USER_ROLES_SET_ERROR = 'COLONY_DOMAIN_USER_ROLES_SET_ERROR',
  COLONY_DOMAIN_USER_ROLES_SET_SUCCESS = 'COLONY_DOMAIN_USER_ROLES_SET_SUCCESS',
  COLONY_MINT_TOKENS = 'COLONY_MINT_TOKENS',
  COLONY_MINT_TOKENS_ERROR = 'COLONY_MINT_TOKENS_ERROR',
  COLONY_MINT_TOKENS_SUBMITTED = 'COLONY_MINT_TOKENS_SUBMITTED',
  COLONY_MINT_TOKENS_SUCCESS = 'COLONY_MINT_TOKENS_SUCCESS',
  COLONY_NATIVE_TOKEN_UNLOCK = 'COLONY_NATIVE_TOKEN_UNLOCK',
  COLONY_NATIVE_TOKEN_UNLOCK_ERROR = 'COLONY_NATIVE_TOKEN_UNLOCK_ERROR',
  COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS = 'COLONY_NATIVE_TOKEN_UNLOCK_SUCCESS',
  COLONY_RECOVERY_MODE_ENTER = 'COLONY_RECOVERY_MODE_ENTER',
  COLONY_RECOVERY_MODE_ENTER_ERROR = 'COLONY_RECOVERY_MODE_ENTER_ERROR',
  COLONY_RECOVERY_MODE_ENTER_SUCCESS = 'COLONY_RECOVERY_MODE_ENTER_SUCCESS',
  COLONY_VERSION_UPGRADE = 'COLONY_VERSION_UPGRADE',
  COLONY_VERSION_UPGRADE_ERROR = 'COLONY_VERSION_UPGRADE_ERROR',
  COLONY_VERSION_UPGRADE_SUCCESS = 'COLONY_VERSION_UPGRADE_SUCCESS',
  CONNECTION_STATS_SUB_ERROR = 'CONNECTION_STATS_SUB_ERROR',
  CONNECTION_STATS_SUB_EVENT = 'CONNECTION_STATS_SUB_EVENT',
  CONNECTION_STATS_SUB_START = 'CONNECTION_STATS_SUB_START',
  CONNECTION_STATS_SUB_STOP = 'CONNECTION_STATS_SUB_STOP',
  DOMAIN_CREATE = 'DOMAIN_CREATE',
  DOMAIN_CREATE_ERROR = 'DOMAIN_CREATE_ERROR',
  DOMAIN_CREATE_SUCCESS = 'DOMAIN_CREATE_SUCCESS',
  DOMAIN_CREATE_TX = 'DOMAIN_CREATE_TX',
  DOMAIN_CREATE_TX_ERROR = 'DOMAIN_CREATE_TX_ERROR',
  DOMAIN_CREATE_TX_SUCCESS = 'DOMAIN_CREATE_TX_SUCCESS',
  DOMAIN_EDIT = 'DOMAIN_EDIT',
  DOMAIN_EDIT_ERROR = 'DOMAIN_EDIT_ERROR',
  DOMAIN_EDIT_SUCCESS = 'DOMAIN_EDIT_SUCCESS',
  GAS_PRICES_UPDATE = 'GAS_PRICES_UPDATE',
  IPFS_DATA_FETCH = 'IPFS_DATA_FETCH',
  IPFS_DATA_FETCH_ERROR = 'IPFS_DATA_FETCH_ERROR',
  IPFS_DATA_FETCH_SUCCESS = 'IPFS_DATA_FETCH_SUCCESS',
  IPFS_DATA_UPLOAD = 'IPFS_DATA_UPLOAD',
  IPFS_DATA_UPLOAD_ERROR = 'IPFS_DATA_UPLOAD_ERROR',
  IPFS_DATA_UPLOAD_SUCCESS = 'IPFS_DATA_UPLOAD_SUCCESS',
  MESSAGE_CANCEL = 'MESSAGE_CANCEL',
  MESSAGE_CREATED = 'MESSAGE_CREATED',
  MESSAGE_ERROR = 'MESSAGE_ERROR',
  MESSAGE_SIGN = 'MESSAGE_SIGN',
  MESSAGE_SIGNED = 'MESSAGE_SIGNED',
  MOVE_FUNDS_BETWEEN_POTS = 'MOVE_FUNDS_BETWEEN_POTS',
  MOVE_FUNDS_BETWEEN_POTS_SUCCESS = 'MOVE_FUNDS_BETWEEN_POTS_SUCCESS',
  MOVE_FUNDS_BETWEEN_POTS_ERROR = 'MOVE_FUNDS_BETWEEN_POTS_ERROR',
  MULTISIG_TRANSACTION_CREATED = 'MULTISIG_TRANSACTION_CREATED',
  MULTISIG_TRANSACTION_REFRESHED = 'MULTISIG_TRANSACTION_REFRESHED',
  MULTISIG_TRANSACTION_REJECT = 'MULTISIG_TRANSACTION_REJECT',
  MULTISIG_TRANSACTION_SIGN = 'MULTISIG_TRANSACTION_SIGN',
  MULTISIG_TRANSACTION_SIGNED = 'MULTISIG_TRANSACTION_SIGNED',
  NETWORK_FETCH = 'NETWORK_FETCH',
  NETWORK_FETCH_ERROR = 'NETWORK_FETCH_ERROR',
  NETWORK_FETCH_SUCCESS = 'NETWORK_FETCH_SUCCESS',
  TASK_CANCEL = 'TASK_CANCEL',
  TASK_CANCEL_ERROR = 'TASK_CANCEL_ERROR',
  TASK_CANCEL_SUCCESS = 'TASK_CANCEL_SUCCESS',
  REHYDRATE = '@@persist/REHYDRATE',
  REHYDRATED = '@@persist/REHYDRATED',
  TASK_CREATE = 'TASK_CREATE',
  TASK_CREATE_ERROR = 'TASK_CREATE_ERROR',
  TASK_CREATE_SUCCESS = 'TASK_CREATE_SUCCESS',
  TASK_FETCH = 'TASK_FETCH',
  TASK_FETCH_ALL = 'TASK_FETCH_ALL',
  TASK_FETCH_ERROR = 'TASK_FETCH_ERROR',
  TASK_FETCH_SUCCESS = 'TASK_FETCH_SUCCESS',
  TASK_FINALIZE = 'TASK_FINALIZE',
  TASK_FINALIZE_ERROR = 'TASK_FINALIZE_ERROR',
  TASK_FINALIZE_SUCCESS = 'TASK_FINALIZE_SUCCESS',
  TASK_MANAGER_COMPLETE = 'TASK_MANAGER_COMPLETE',
  TASK_MANAGER_COMPLETE_ERROR = 'TASK_MANAGER_COMPLETE_ERROR',
  TASK_MANAGER_COMPLETE_SUCCESS = 'TASK_MANAGER_COMPLETE_SUCCESS',
  TASK_MANAGER_END = 'TASK_MANAGER_END',
  TASK_MANAGER_END_ERROR = 'TASK_MANAGER_END_ERROR',
  TASK_MANAGER_END_SUCCESS = 'TASK_MANAGER_END_SUCCESS',
  TASK_MANAGER_RATE_WORKER = 'TASK_MANAGER_RATE_WORKER',
  TASK_MANAGER_RATE_WORKER_ERROR = 'TASK_MANAGER_RATE_WORKER_ERROR',
  TASK_MANAGER_RATE_WORKER_SUCCESS = 'TASK_MANAGER_RATE_WORKER_SUCCESS',
  TASK_MANAGER_REVEAL_WORKER_RATING = 'TASK_MANAGER_REVEAL_WORKER_RATING',
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR = 'TASK_MANAGER_REVEAL_WORKER_RATING_ERROR',
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS = 'TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS',
  TASK_SUB_ERROR = 'TASK_SUB_ERROR',
  TASK_SUB_EVENTS = 'TASK_SUB_EVENTS',
  TASK_SUBMIT_DELIVERABLE = 'TASK_SUBMIT_DELIVERABLE',
  TASK_SUBMIT_DELIVERABLE_ERROR = 'TASK_SUBMIT_DELIVERABLE_ERROR',
  TASK_SUBMIT_DELIVERABLE_SUCCESS = 'TASK_SUBMIT_DELIVERABLE_SUCCESS',
  TASK_WORKER_CLAIM_REWARD = 'TASK_WORKER_CLAIM_REWARD',
  TASK_WORKER_CLAIM_REWARD_ERROR = 'TASK_WORKER_CLAIM_REWARD_ERROR',
  TASK_WORKER_CLAIM_REWARD_SUCCESS = 'TASK_WORKER_CLAIM_REWARD_SUCCESS',
  TASK_WORKER_END = 'TASK_WORKER_END',
  TASK_WORKER_END_ERROR = 'TASK_WORKER_END_ERROR',
  TASK_WORKER_END_SUCCESS = 'TASK_WORKER_END_SUCCESS',
  TASK_WORKER_RATE_MANAGER = 'TASK_WORKER_RATE_MANAGER',
  TASK_WORKER_RATE_MANAGER_ERROR = 'TASK_WORKER_RATE_MANAGER_ERROR',
  TASK_WORKER_RATE_MANAGER_SUCCESS = 'TASK_WORKER_RATE_MANAGER_SUCCESS',
  TASK_WORKER_REVEAL_MANAGER_RATING = 'TASK_WORKER_REVEAL_MANAGER_RATING',
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR = 'TASK_WORKER_REVEAL_MANAGER_RATING_ERROR',
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS = 'TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS',
  TOKEN_CREATE = 'TOKEN_CREATE',
  TOKEN_CREATE_ERROR = 'TOKEN_CREATE_ERROR',
  TOKEN_CREATE_SUCCESS = 'TOKEN_CREATE_SUCCESS',
  TRANSACTION_ADD_IDENTIFIER = 'TRANSACTION_ADD_IDENTIFIER',
  TRANSACTION_ADD_PARAMS = 'TRANSACTION_ADD_PARAMS',
  TRANSACTION_CANCEL = 'TRANSACTION_CANCEL',
  TRANSACTION_CREATED = 'TRANSACTION_CREATED',
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  TRANSACTION_ESTIMATE_GAS = 'TRANSACTION_ESTIMATE_GAS',
  TRANSACTION_GAS_UPDATE = 'TRANSACTION_GAS_UPDATE',
  TRANSACTION_HASH_RECEIVED = 'TRANSACTION_HASH_RECEIVED',
  TRANSACTION_LOAD_RELATED = 'TRANSACTION_LOAD_RELATED',
  TRANSACTION_READY = 'TRANSACTION_READY',
  TRANSACTION_RECEIPT_RECEIVED = 'TRANSACTION_RECEIPT_RECEIVED',
  TRANSACTION_SEND = 'TRANSACTION_SEND',
  TRANSACTION_SENT = 'TRANSACTION_SENT',
  TRANSACTION_SUCCEEDED = 'TRANSACTION_SUCCEEDED',
  USER_ADDRESS_FETCH = 'USER_ADDRESS_FETCH',
  USER_ADDRESS_FETCH_ERROR = 'USER_ADDRESS_FETCH_ERRROR',
  USER_ADDRESS_FETCH_SUCCESS = 'USER_ADDRESS_FETCH_SUCCESS',
  USER_AVATAR_REMOVE = 'USER_AVATAR_REMOVE',
  USER_AVATAR_REMOVE_ERROR = 'USER_AVATAR_REMOVE_ERRROR',
  USER_AVATAR_REMOVE_SUCCESS = 'USER_AVATAR_REMOVE_SUCCESS',
  USER_AVATAR_UPLOAD = 'USER_AVATAR_UPLOAD',
  USER_AVATAR_UPLOAD_ERROR = 'USER_AVATAR_UPLOAD_ERRROR',
  USER_AVATAR_UPLOAD_SUCCESS = 'USER_AVATAR_UPLOAD_SUCCESS',
  USER_CONTEXT_SETUP_SUCCESS = 'USER_CONTEXT_SETUP_SUCCESS',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_ERROR = 'USER_LOGOUT_ERROR',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USERNAME_CREATE = 'USERNAME_CREATE',
  USERNAME_CREATE_ERROR = 'USERNAME_CREATE_ERROR',
  USERNAME_CREATE_SUCCESS = 'USERNAME_CREATE_SUCCESS',
  WALLET_CREATE = 'WALLET_CREATE',
  WALLET_CREATE_ERROR = 'WALLET_CREATE_ERROR',
  WALLET_CREATE_SUCCESS = 'WALLET_CREATE_SUCCESS',
  WALLET_FETCH_ACCOUNTS = 'WALLET_FETCH_ACCOUNTS',
  WALLET_FETCH_ACCOUNTS_ERROR = 'WALLET_FETCH_ACCOUNTS_ERROR',
  WALLET_FETCH_ACCOUNTS_SUCCESS = 'WALLET_FETCH_ACCOUNTS_SUCCESS',
}
