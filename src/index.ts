/*******************************************************************************
 * This file is part of the Incubed project.
 * Sources: https://github.com/slockit/in3-common
 * 
 * Copyright (C) 2018-2019 slock.it GmbH, Blockchains LLC
 * 
 * 
 * COMMERCIAL LICENSE USAGE
 * 
 * Licensees holding a valid commercial license may use this file in accordance 
 * with the commercial license agreement provided with the Software or, alternatively, 
 * in accordance with the terms contained in a written agreement between you and 
 * slock.it GmbH/Blockchains LLC. For licensing terms and conditions or further 
 * information please contact slock.it at in3@slock.it.
 * 	
 * Alternatively, this file may be used under the AGPL license as follows:
 *    
 * AGPL LICENSE USAGE
 * 
 * This program is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software 
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY 
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A 
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 * [Permissions of this strong copyleft license are conditioned on making available 
 * complete source code of licensed works and modifications, which include larger 
 * works using a licensed work, under the same license. Copyright and license notices 
 * must be preserved. Contributors provide an express grant of patent rights.]
 * You should have received a copy of the GNU Affero General Public License along 
 * with this program. If not, see <https://www.gnu.org/licenses/>.
 *******************************************************************************/


import * as _validate from './util/validate'
export const validate = _validate

import * as _util from './util/util'
export const util = _util
export const createRandomIndexes = _util.createRandomIndexes
export const getSigner = _util.getSigner

//import * as types from './types/types'
/*export type RPCRequest = types.RPCRequest
export type AccountProof = types.AccountProof
export type IN3Config = types.IN3Config
export type IN3NodeConfig = types.IN3NodeConfig
export type IN3NodeWeight = types.IN3NodeWeight
export type IN3RPCRequestConfig = types.IN3RPCRequestConfig
export type IN3ResponseConfig = types.IN3ResponseConfig
export type LogProof = types.LogProof
export type Proof = types.Proof
export type AuraValidatoryProof = types.AuraValidatoryProof
export type RPCResponse = types.RPCResponse
export type Signature = types.Signature
export type ServerList = types.ServerList
export type IN3RPCConfig = types.IN3RPCConfig
export type IN3RPCHandlerConfig = types.IN3RPCHandlerConfig
export type ChainSpec = types.ChainSpec*/


import * as _serialize from './modules/eth/serialize'
export const serialize = _serialize
export type BlockData = _serialize.BlockData
export type LogData = _serialize.LogData
export type ReceiptData = _serialize.ReceiptData
export type TransactionData = _serialize.TransactionData
export const Block = _serialize.Block
export type Block = _serialize.Block
export type Receipt = _serialize.Receipt
export type Transaction = _serialize.Transaction

import * as _transport from './util/transport'
export const transport = _transport
export type Transport = _transport.Transport
export const AxiosTransport = _transport.AxiosTransport

import * as _storage from './modules/eth/storage'
export const storage = _storage

//export const typeDefs = types.validationDef
export const chainAliases = _util.aliases

import * as _cbor from './util/cbor'
export const cbor = _cbor

export const createTx = _serialize.createTx
export const blockFromHex = _serialize.blockFromHex
export const toAccount = _serialize.toAccount
export const toReceipt = _serialize.toReceipt
export const hash = _serialize.hash
export const bytes32 = _serialize.bytes32
export const bytes8 = _serialize.bytes8
export const uint = _serialize.uint
export const uint64 = _serialize.uint64
export const uint128 = _serialize.uint128
export const address = _serialize.address
export const bytes = _serialize.bytes
export const toTransaction = _serialize.toTransaction
export const rlp = _serialize.rlp
export const toBlockHeader = _serialize.toBlockHeader
