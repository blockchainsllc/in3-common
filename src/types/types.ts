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

import { ajv, validateAndThrow } from '../util/validate'
import * as Ajv from 'ajv'
/**
 * the Proof-for a single Account
 */
export interface AccountProof {
    /**
     * the serialized merle-noodes beginning with the root-node
     */
    accountProof: string /* ^0x[0-9a-fA-F]+$ */[]
    /**
     * the address of this account
     */
    address: string // ^0x[0-9a-fA-F]+$
    /**
     * the balance of this account as hex
     */
    balance: string // ^0x[0-9a-fA-F]+$
    /**
     * the codeHash of this account as hex
     */
    codeHash: string // ^0x[0-9a-fA-F]+$
    /**
     * the code of this account as hex ( if required)
     */
    code?: string // ^0x[0-9a-fA-F]+$
    /**
     * the nonce of this account as hex
     */
    nonce: string // ^0x[0-9a-fA-F]+$
    /**
     * the storageHash of this account as hex
     */
    storageHash: string // ^0x[0-9a-fA-F]+$
    /**
     * proof for requested storage-data
     */
    storageProof: {
        /**
         * the storage key
         */
        key: string // ^0x[0-9a-fA-F]+$
        /**
         * the serialized merkle-noodes beginning with the root-node ( storageHash )
         */
        proof: string /* ^0x[0-9a-fA-F]+$ */[]
        /**
         * the stored value
         */
        value: string // ^0x[0-9a-fA-F]+$
    }[]
}
/**
 * a configuration of a in3-server.
 */
export interface IN3NodeConfig {
    /**
     * the index within the contract
     * example: 13
     */
    index?: number
    /**
     * the address of the node, which is the public address it iis signing with.
     * example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679
     */
    address: string // address
    /**
     * the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself
     * example: 3600
     */
    timeout?: number
    /**
     * the endpoint to post to
     * example: https://in3.slock.it
     */
    url: string
    /**
     * the list of supported chains
     * example: 0x1
     */
    chainIds: string /* hex */[]
    /**
     * the deposit of the node in wei
     * example: 12350000
     */
    deposit: number
    /**
     * the capacity of the node.
     * example: 100
     */
    capacity?: number
    /**
     * the properties of the node.
     * example: 3
     */
    props?: number
    /**
     * the UNIX-timestamp when the node was registered
     * example: 1563279168
     */
    registerTime?: number
    /**
     * the UNIX-timestamp when the node is allowed to be deregister
     * example: 1563279168
     */
    unregisterTime?: number
}
/**
 * a local weight of a n3-node. (This is used internally to weight the requests)
 */
export interface IN3NodeWeight {
    /**
     * factor the weight this noe (default 1.0)
     * example: 0.5
     */
    weight?: number
    /**
     * number of uses.
     * example: 147
     */
    responseCount?: number
    /**
     * average time of a response in ms
     * example: 240
     */
    avgResponseTime?: number
    /**
     * last price
     */
    pricePerRequest?: number
    /**
     * timestamp of the last request in ms
     * example: 1529074632623
     */
    lastRequest?: number
    /**
     * blacklisted because of failed requests until the timestamp
     * example: 1529074639623
     */
    blacklistedUntil?: number
}
/**
 * additional config for a IN3 RPC-Request
 */
export interface IN3RPCRequestConfig {
    /**
     * the requested chainId
     * example: 0x1
     */
    chainId: string // hex
    /**
     * if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards
     * example: true
     */
    includeCode?: boolean
    /**
     * if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.
     */
    verifiedHashes?: string /* bytes32 */[]
    /**
     * if specified, the blocknumber *latest* will be replaced by blockNumber- specified value
     * example: 6
     */
    latestBlock?: number
    /**
     * if true binary-data (starting with a 0x) will be refered if occuring again.
     */
    useRef?: boolean
    /**
     * if true binary-data will be used.
     */
    useBinary?: boolean
    /**
     * if true all data in the response will be proven, which leads to a higher payload.
     */
    useFullProof?: boolean
    /**
     * if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.
     */
    finality?: number
    /**
     * defines the kind of proof the client is asking for
     * example: proof
     */
    verification?: 'never' | 'proof' | 'proofWithSignature'
    /**
     * the signature of the client
     */
    clientSignature?: any
    /**
     * a list of addresses requested to sign the blockhash
     * example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679
     */
    signatures?: string /* address */[]
}
/**
 * additional data returned from a IN3 Server
 */
export interface IN3ResponseConfig {
    /**
     * the Proof-data
     */
    proof?: Proof
    /**
     * the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.
     * example: 326478
     */
    lastNodeList?: number
    /**
     * the blocknumber of gthe last change of the validatorList
     */
    lastValidatorChange?: number
    /**
     * the current blocknumber.
     * example: 320126478
     */
    currentBlock?: number
    /**
     * IN3 protocol version numbers
     */
    version?: string
}
/**
 * a Object holding proofs for event logs. The key is the blockNumber as hex
 */
export interface LogProof {
    [name: string]: {
        /**
         * the blockNumber
         */
        number?: number
        /**
         * the serialized blockheader
         * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
         */
        block: string
        /**
         * temp. list of all receipts, which is not included in the final proof
         */
        allReceipts?: any[]
        /**
         * the map of existing receipts with the txHash as key
         */
        receipts: {
            [name: string]: {
                /**
                 * the transactionHash
                 */
                txHash?: string
                /**
                 * the transactionIndex within the block
                 */
                txIndex: number
                /**
                 * the merkleProof
                 */
                txProof?: string /* ^0x[0-9a-fA-F]+$ */[]
                /**
                 * the merkleProof
                 */
                proof: string /* ^0x[0-9a-fA-F]+$ */[]
            }
        }
    }
}
/**
 * the Proof-data as part of the in3-section
 */
export interface Proof {
    /**
     * the type of the proof
     * example: accountProof
     */
    type: 'transactionProof' | 'receiptProof' | 'blockProof' | 'accountProof' | 'callProof' | 'logProof'
    /**
     * the serialized blockheader as hex, required in most proofs
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
     */
    block?: string
    /**
     * the serialized blockheader as hex, required in case of finality asked
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b
     */
    finalityBlocks?: any[]
    /**
     * the list of transactions of the block
     * example: 
     */
    transactions?: any[]
    /**
     * the list of uncle-headers of the block
     * example: 
     */
    uncles?: any[]
    /**
     * the serialized merle-noodes beginning with the root-node
     */
    merkleProof?: string /* ^0x[0-9a-fA-F]+$ */[]
    /**
     * the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)
     */
    merkleProofPrev?: string /* ^0x[0-9a-fA-F]+$ */[]
    /**
     * the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex
     */
    txProof?: string /* ^0x[0-9a-fA-F]+$ */[]
    /**
     * the Log Proof in case of a Log-Request
     */
    logProof?: LogProof
    /**
     * a map of addresses and their AccountProof
     */
    accounts?: {
        [name: string]: AccountProof
    }
    /**
     * the transactionIndex within the block
     * example: 4
     */
    txIndex?: number
    /**
     * requested signatures
     */
    signatures?: Signature[]
}
/**
 * a JSONRPC-Request with N3-Extension
 */
export interface RPCRequest {
    /**
     * the version
     */
    jsonrpc: '2.0'
    /**
     * the method to call
     * example: eth_getBalance
     */
    method: string
    /**
     * the identifier of the request
     * example: 2
     */
    id?: number | string
    /**
     * the params
     * example: 0xe36179e2286ef405e929C90ad3E70E649B22a945,latest
     */
    params?: any[]
    /**
     * the IN3-Config
     */
    in3?: IN3RPCRequestConfig
}
/**
 * a JSONRPC-Responset with N3-Extension
 */
export interface RPCResponse {
    /**
     * the version
     */
    jsonrpc: '2.0'
    /**
     * the id matching the request
     * example: 2
     */
    id: string | number
    /**
     * in case of an error this needs to be set
     */
    error?: string
    /**
     * the params
     * example: 0xa35bc
     */
    result?: any
    /**
     * the IN3-Result
     */
    in3?: IN3ResponseConfig
    /**
     * the node handling this response (internal only)
     */
    in3Node?: IN3NodeConfig
}
/**
 * Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.
 */
export interface Signature {
    /**
     * the address of the signing node
     * example: 0x6C1a01C2aB554930A937B0a2E8105fB47946c679
     */
    address?: string // address
    /**
     * the blocknumber
     * example: 3123874
     */
    block: number
    /**
     * the hash of the block
     * example: 0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679
     */
    blockHash: string // bytes32
    /**
     * hash of the message
     * example: 0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D
     */
    msgHash: string // bytes32
    /**
     * Positive non-zero Integer signature.r
     * example: 0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f
     */
    r: string // hex
    /**
     * Positive non-zero Integer signature.s
     * example: 0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda
     */
    s: string // hex
    /**
     * Calculated curve point, or identity element O.
     * example: 28
     */
    v: number // hex
}
/* tslint:disable */
export const validationDef = { IN3NodeWeight: { description: 'a local weight of a n3-node. (This is used internally to weight the requests)', type: 'object', properties: { weight: { description: 'factor the weight this noe (default 1.0)', type: 'number', example: 0.5 }, responseCount: { description: 'number of uses.', type: 'integer', example: 147 }, avgResponseTime: { description: 'average time of a response in ms', type: 'number', example: 240 }, pricePerRequest: { description: 'last price', type: 'integer' }, lastRequest: { description: 'timestamp of the last request in ms', type: 'integer', example: 1529074632623 }, blacklistedUntil: { description: 'blacklisted because of failed requests until the timestamp', type: 'integer', example: 1529074639623 } } }, IN3RPCRequestConfig: { description: 'additional config for a IN3 RPC-Request', required: ['chainId'], properties: { chainId: { description: 'the requested chainId', type: 'string', example: '0x1', format: 'hex' }, includeCode: { description: 'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards', type: 'boolean', example: true }, verifiedHashes: { description: 'if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.', type: 'array', items: { type: 'string', format: 'bytes32' } }, latestBlock: { description: 'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value', type: 'integer', example: 6 }, useRef: { description: 'if true binary-data (starting with a 0x) will be refered if occuring again.', type: 'boolean' }, useBinary: { description: 'if true binary-data will be used.', type: 'boolean' }, useFullProof: { description: 'if true all data in the response will be proven, which leads to a higher payload.', type: 'boolean' }, finality: { description: 'if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.', type: 'number' }, verification: { description: 'defines the kind of proof the client is asking for', type: 'string', enum: ['never', 'proof', 'proofWithSignature'], example: 'proof' }, clientSignature: { description: 'the signature of the client' }, signatures: { description: 'a list of addresses requested to sign the blockhash', type: 'array', example: ['0x6C1a01C2aB554930A937B0a2E8105fB47946c679'], items: { type: 'string', format: 'address' } } } }, Signature: { description: 'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.', type: 'object', required: ['r', 's', 'v', 'msgHash', 'block', 'blockHash'], properties: { address: { type: 'string', description: 'the address of the signing node', format: 'address', example: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679' }, block: { type: 'number', description: 'the blocknumber', example: 3123874 }, blockHash: { type: 'string', description: 'the hash of the block', example: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679', format: 'bytes32' }, msgHash: { type: 'string', description: 'hash of the message', format: 'bytes32', example: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D' }, r: { type: 'string', description: 'Positive non-zero Integer signature.r', format: 'hex', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f' }, s: { type: 'string', description: 'Positive non-zero Integer signature.s', format: 'hex', example: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda' }, v: { type: 'integer', description: 'Calculated curve point, or identity element O.', format: 'hex', example: 28 } } }, IN3ResponseConfig: { type: 'object', description: 'additional data returned from a IN3 Server', properties: { proof: { description: 'the Proof-data as part of the in3-section', type: 'object', required: ['type'], properties: { type: { description: 'the type of the proof', type: 'string', enum: ['transactionProof', 'receiptProof', 'blockProof', 'accountProof', 'callProof', 'logProof'], example: 'accountProof' }, block: { type: 'string', description: 'the serialized blockheader as hex, required in most proofs', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, finalityBlocks: { type: 'array', description: 'the serialized blockheader as hex, required in case of finality asked', example: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'] }, transactions: { type: 'array', description: 'the list of transactions of the block', example: [] }, uncles: { type: 'array', description: 'the list of uncle-headers of the block', example: [] }, merkleProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', exmaple: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b', '0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1', '0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'], items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, merkleProofPrev: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)', exmaple: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b', '0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1', '0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'], items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, txProof: { type: 'array', description: 'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, logProof: { description: 'a Object holding proofs for event logs. The key is the blockNumber as hex', type: 'object', additionalProperties: { type: 'object', required: ['block', 'receipts'], properties: { number: { description: 'the blockNumber', type: 'number' }, block: { description: 'the serialized blockheader', type: 'string', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, allReceipts: { description: 'temp. list of all receipts, which is not included in the final proof', type: 'array' }, receipts: { description: 'the map of existing receipts with the txHash as key', type: 'object', additionalProperties: { type: 'object', required: ['txIndex', 'proof'], properties: { txHash: { type: 'string', description: 'the transactionHash' }, txIndex: { type: 'integer', description: 'the transactionIndex within the block' }, txProof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, proof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } } } } } } } }, accounts: { type: 'object', description: 'a map of addresses and their AccountProof', additionalProperties: { type: 'object', description: 'the Proof-for a single Account', required: ['accountProof', 'address', 'balance', 'codeHash', 'nonce', 'storageHash', 'storageProof'], properties: { accountProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, address: { type: 'string', description: 'the address of this account', pattern: '^0x[0-9a-fA-F]+$' }, balance: { type: 'string', description: 'the balance of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, codeHash: { type: 'string', description: 'the codeHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, code: { type: 'string', description: 'the code of this account as hex ( if required)', pattern: '^0x[0-9a-fA-F]+$' }, nonce: { type: 'string', description: 'the nonce of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageHash: { type: 'string', description: 'the storageHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageProof: { type: 'array', description: 'proof for requested storage-data', items: { type: 'object', required: ['key', 'proof', 'value'], properties: { key: { type: 'string', description: 'the storage key', pattern: '^0x[0-9a-fA-F]+$' }, proof: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node ( storageHash )', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, value: { type: 'string', description: 'the stored value', pattern: '^0x[0-9a-fA-F]+$' } } } } } } }, txIndex: { type: 'integer', description: 'the transactionIndex within the block', example: 4 }, signatures: { type: 'array', description: 'requested signatures', items: { description: 'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.', type: 'object', required: ['r', 's', 'v', 'msgHash', 'block', 'blockHash'], properties: { address: { type: 'string', description: 'the address of the signing node', format: 'address', example: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679' }, block: { type: 'number', description: 'the blocknumber', example: 3123874 }, blockHash: { type: 'string', description: 'the hash of the block', example: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679', format: 'bytes32' }, msgHash: { type: 'string', description: 'hash of the message', format: 'bytes32', example: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D' }, r: { type: 'string', description: 'Positive non-zero Integer signature.r', format: 'hex', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f' }, s: { type: 'string', description: 'Positive non-zero Integer signature.s', format: 'hex', example: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda' }, v: { type: 'integer', description: 'Calculated curve point, or identity element O.', format: 'hex', example: 28 } } } } } }, lastNodeList: { description: 'the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.', type: 'number', example: 326478 }, lastValidatorChange: { description: 'the blocknumber of gthe last change of the validatorList', type: 'number' }, currentBlock: { description: 'the current blocknumber.', type: 'number', example: 320126478 }, version: { description: 'Version of in3 protocol', type: 'string' } } }, RPCRequest: { type: 'object', description: 'a JSONRPC-Request with N3-Extension', required: ['jsonrpc', 'method'], properties: { jsonrpc: { description: 'the version', type: 'string', enum: ['2.0'] }, method: { description: 'the method to call', type: 'string', example: 'eth_getBalance' }, id: { description: 'the identifier of the request', type: ['number', 'string'], example: 2 }, params: { description: 'the params', type: 'array', example: ['0xe36179e2286ef405e929C90ad3E70E649B22a945', 'latest'] }, in3: { description: 'additional config for a IN3 RPC-Request', required: ['chainId'], properties: { chainId: { description: 'the requested chainId', type: 'string', example: '0x1', format: 'hex' }, includeCode: { description: 'if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards', type: 'boolean', example: true }, verifiedHashes: { description: 'if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.', type: 'array', items: { type: 'string', format: 'bytes32' } }, latestBlock: { description: 'if specified, the blocknumber *latest* will be replaced by blockNumber- specified value', type: 'integer', example: 6 }, useRef: { description: 'if true binary-data (starting with a 0x) will be refered if occuring again.', type: 'boolean' }, useBinary: { description: 'if true binary-data will be used.', type: 'boolean' }, useFullProof: { description: 'if true all data in the response will be proven, which leads to a higher payload.', type: 'boolean' }, finality: { description: 'if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.', type: 'number' }, verification: { description: 'defines the kind of proof the client is asking for', type: 'string', enum: ['never', 'proof', 'proofWithSignature'], example: 'proof' }, clientSignature: { description: 'the signature of the client' }, signatures: { description: 'a list of addresses requested to sign the blockhash', type: 'array', example: ['0x6C1a01C2aB554930A937B0a2E8105fB47946c679'], items: { type: 'string', format: 'address' } } } } } }, RPCResponse: { type: 'object', description: 'a JSONRPC-Responset with N3-Extension', required: ['jsonrpc', 'id'], properties: { jsonrpc: { description: 'the version', type: 'string', enum: ['2.0'] }, id: { description: 'the id matching the request', type: ['string', 'number'], example: 2 }, error: { description: 'in case of an error this needs to be set', type: 'string' }, result: { description: 'the params', example: '0xa35bc' }, in3: { description: 'additional data returned from a IN3 Server', type: 'object', properties: { proof: { description: 'the Proof-data as part of the in3-section', type: 'object', required: ['type'], properties: { type: { description: 'the type of the proof', type: 'string', enum: ['transactionProof', 'receiptProof', 'blockProof', 'accountProof', 'callProof', 'logProof'], example: 'accountProof' }, block: { type: 'string', description: 'the serialized blockheader as hex, required in most proofs', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, finalityBlocks: { type: 'array', description: 'the serialized blockheader as hex, required in case of finality asked', example: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'] }, transactions: { type: 'array', description: 'the list of transactions of the block', example: [] }, uncles: { type: 'array', description: 'the list of uncle-headers of the block', example: [] }, merkleProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', exmaple: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b', '0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1', '0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'], items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, merkleProofPrev: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)', exmaple: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b', '0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1', '0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'], items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, txProof: { type: 'array', description: 'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, logProof: { description: 'a Object holding proofs for event logs. The key is the blockNumber as hex', type: 'object', additionalProperties: { type: 'object', required: ['block', 'receipts'], properties: { number: { description: 'the blockNumber', type: 'number' }, block: { description: 'the serialized blockheader', type: 'string', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, allReceipts: { description: 'temp. list of all receipts, which is not included in the final proof', type: 'array' }, receipts: { description: 'the map of existing receipts with the txHash as key', type: 'object', additionalProperties: { type: 'object', required: ['txIndex', 'proof'], properties: { txHash: { type: 'string', description: 'the transactionHash' }, txIndex: { type: 'integer', description: 'the transactionIndex within the block' }, txProof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, proof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } } } } } } } }, accounts: { type: 'object', description: 'a map of addresses and their AccountProof', additionalProperties: { type: 'object', description: 'the Proof-for a single Account', required: ['accountProof', 'address', 'balance', 'codeHash', 'nonce', 'storageHash', 'storageProof'], properties: { accountProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, address: { type: 'string', description: 'the address of this account', pattern: '^0x[0-9a-fA-F]+$' }, balance: { type: 'string', description: 'the balance of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, codeHash: { type: 'string', description: 'the codeHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, code: { type: 'string', description: 'the code of this account as hex ( if required)', pattern: '^0x[0-9a-fA-F]+$' }, nonce: { type: 'string', description: 'the nonce of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageHash: { type: 'string', description: 'the storageHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageProof: { type: 'array', description: 'proof for requested storage-data', items: { type: 'object', required: ['key', 'proof', 'value'], properties: { key: { type: 'string', description: 'the storage key', pattern: '^0x[0-9a-fA-F]+$' }, proof: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node ( storageHash )', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, value: { type: 'string', description: 'the stored value', pattern: '^0x[0-9a-fA-F]+$' } } } } } } }, txIndex: { type: 'integer', description: 'the transactionIndex within the block', example: 4 }, signatures: { type: 'array', description: 'requested signatures', items: { description: 'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.', type: 'object', required: ['r', 's', 'v', 'msgHash', 'block', 'blockHash'], properties: { address: { type: 'string', description: 'the address of the signing node', format: 'address', example: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679' }, block: { type: 'number', description: 'the blocknumber', example: 3123874 }, blockHash: { type: 'string', description: 'the hash of the block', example: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679', format: 'bytes32' }, msgHash: { type: 'string', description: 'hash of the message', format: 'bytes32', example: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D' }, r: { type: 'string', description: 'Positive non-zero Integer signature.r', format: 'hex', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f' }, s: { type: 'string', description: 'Positive non-zero Integer signature.s', format: 'hex', example: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda' }, v: { type: 'integer', description: 'Calculated curve point, or identity element O.', format: 'hex', example: 28 } } } } } }, lastNodeList: { description: 'the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.', type: 'number', example: 326478 }, lastValidatorChange: { description: 'the blocknumber of gthe last change of the validatorList', type: 'number' }, currentBlock: { description: 'the current blocknumber.', type: 'number', example: 320126478 }, version: { description: 'Version of in3 protocol', type: 'string' } } }, in3Node: { description: 'a configuration of a in3-server.', type: 'object', required: ['address', 'url', 'deposit', 'chainIds'], properties: { index: { description: 'the index within the contract', type: 'integer', example: 13 }, address: { description: 'the address of the node, which is the public address it iis signing with.', type: 'string', format: 'address', example: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679' }, timeout: { description: 'the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself', type: 'integer', example: 3600 }, url: { description: 'the endpoint to post to', type: 'string', example: 'https://in3.slock.it' }, chainIds: { description: 'the list of supported chains', example: ['0x1'], type: 'array', items: { type: 'string', format: 'hex' } }, deposit: { description: 'the deposit of the node in wei', type: 'integer', example: 12350000 }, capacity: { description: 'the capacity of the node.', type: 'integer', example: 100 }, props: { description: 'the properties of the node.', type: 'integer', example: 3 }, registerTime: { description: 'the UNIX-timestamp when the node was registered', type: 'integer', example: 1563279168 }, unregisterTime: { description: 'the UNIX-timestamp when the node is allowed to be deregister', type: 'integer', example: 1563279168 } } } } }, IN3NodeConfig: { description: 'a configuration of a in3-server.', type: 'object', required: ['address', 'url', 'deposit', 'chainIds'], properties: { index: { description: 'the index within the contract', type: 'integer', example: 13 }, address: { description: 'the address of the node, which is the public address it iis signing with.', type: 'string', format: 'address', example: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679' }, timeout: { description: 'the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself', type: 'integer', example: 3600 }, url: { description: 'the endpoint to post to', type: 'string', example: 'https://in3.slock.it' }, chainIds: { description: 'the list of supported chains', example: ['0x1'], type: 'array', items: { type: 'string', format: 'hex' } }, deposit: { description: 'the deposit of the node in wei', type: 'integer', example: 12350000 }, capacity: { description: 'the capacity of the node.', type: 'integer', example: 100 }, props: { description: 'the properties of the node.', type: 'integer', example: 3 }, registerTime: { description: 'the UNIX-timestamp when the node was registered', type: 'integer', example: 1563279168 }, unregisterTime: { description: 'the UNIX-timestamp when the node is allowed to be deregister', type: 'integer', example: 1563279168 } } }, LogProof: { type: 'object', description: 'a Object holding proofs for event logs. The key is the blockNumber as hex', additionalProperties: { type: 'object', required: ['block', 'receipts'], properties: { number: { description: 'the blockNumber', type: 'number' }, block: { description: 'the serialized blockheader', type: 'string', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, allReceipts: { description: 'temp. list of all receipts, which is not included in the final proof', type: 'array' }, receipts: { description: 'the map of existing receipts with the txHash as key', type: 'object', additionalProperties: { type: 'object', required: ['txIndex', 'proof'], properties: { txHash: { type: 'string', description: 'the transactionHash' }, txIndex: { type: 'integer', description: 'the transactionIndex within the block' }, txProof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, proof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } } } } } } } }, Proof: { type: 'object', description: 'the Proof-data as part of the in3-section', required: ['type'], properties: { type: { description: 'the type of the proof', type: 'string', enum: ['transactionProof', 'receiptProof', 'blockProof', 'accountProof', 'callProof', 'logProof'], example: 'accountProof' }, block: { type: 'string', description: 'the serialized blockheader as hex, required in most proofs', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, finalityBlocks: { type: 'array', description: 'the serialized blockheader as hex, required in case of finality asked', example: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'] }, transactions: { type: 'array', description: 'the list of transactions of the block', example: [] }, uncles: { type: 'array', description: 'the list of uncle-headers of the block', example: [] }, merkleProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', exmaple: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b', '0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1', '0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'], items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, merkleProofPrev: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)', exmaple: ['0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b', '0x01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1', '0xcf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbd'], items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, txProof: { type: 'array', description: 'the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, logProof: { description: 'a Object holding proofs for event logs. The key is the blockNumber as hex', type: 'object', additionalProperties: { type: 'object', required: ['block', 'receipts'], properties: { number: { description: 'the blockNumber', type: 'number' }, block: { description: 'the serialized blockheader', type: 'string', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b' }, allReceipts: { description: 'temp. list of all receipts, which is not included in the final proof', type: 'array' }, receipts: { description: 'the map of existing receipts with the txHash as key', type: 'object', additionalProperties: { type: 'object', required: ['txIndex', 'proof'], properties: { txHash: { type: 'string', description: 'the transactionHash' }, txIndex: { type: 'integer', description: 'the transactionIndex within the block' }, txProof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, proof: { type: 'array', description: 'the merkleProof', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } } } } } } } }, accounts: { type: 'object', description: 'a map of addresses and their AccountProof', additionalProperties: { type: 'object', description: 'the Proof-for a single Account', required: ['accountProof', 'address', 'balance', 'codeHash', 'nonce', 'storageHash', 'storageProof'], properties: { accountProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, address: { type: 'string', description: 'the address of this account', pattern: '^0x[0-9a-fA-F]+$' }, balance: { type: 'string', description: 'the balance of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, codeHash: { type: 'string', description: 'the codeHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, code: { type: 'string', description: 'the code of this account as hex ( if required)', pattern: '^0x[0-9a-fA-F]+$' }, nonce: { type: 'string', description: 'the nonce of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageHash: { type: 'string', description: 'the storageHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageProof: { type: 'array', description: 'proof for requested storage-data', items: { type: 'object', required: ['key', 'proof', 'value'], properties: { key: { type: 'string', description: 'the storage key', pattern: '^0x[0-9a-fA-F]+$' }, proof: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node ( storageHash )', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, value: { type: 'string', description: 'the stored value', pattern: '^0x[0-9a-fA-F]+$' } } } } } } }, txIndex: { type: 'integer', description: 'the transactionIndex within the block', example: 4 }, signatures: { type: 'array', description: 'requested signatures', items: { description: 'Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.', type: 'object', required: ['r', 's', 'v', 'msgHash', 'block', 'blockHash'], properties: { address: { type: 'string', description: 'the address of the signing node', format: 'address', example: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679' }, block: { type: 'number', description: 'the blocknumber', example: 3123874 }, blockHash: { type: 'string', description: 'the hash of the block', example: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679', format: 'bytes32' }, msgHash: { type: 'string', description: 'hash of the message', format: 'bytes32', example: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D' }, r: { type: 'string', description: 'Positive non-zero Integer signature.r', format: 'hex', example: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f' }, s: { type: 'string', description: 'Positive non-zero Integer signature.s', format: 'hex', example: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda' }, v: { type: 'integer', description: 'Calculated curve point, or identity element O.', format: 'hex', example: 28 } } } } } }, AccountProof: { type: 'object', description: 'the Proof-for a single Account', required: ['accountProof', 'address', 'balance', 'codeHash', 'nonce', 'storageHash', 'storageProof'], properties: { accountProof: { type: 'array', description: 'the serialized merle-noodes beginning with the root-node', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, address: { type: 'string', description: 'the address of this account', pattern: '^0x[0-9a-fA-F]+$' }, balance: { type: 'string', description: 'the balance of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, codeHash: { type: 'string', description: 'the codeHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, code: { type: 'string', description: 'the code of this account as hex ( if required)', pattern: '^0x[0-9a-fA-F]+$' }, nonce: { type: 'string', description: 'the nonce of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageHash: { type: 'string', description: 'the storageHash of this account as hex', pattern: '^0x[0-9a-fA-F]+$' }, storageProof: { type: 'array', description: 'proof for requested storage-data', items: { type: 'object', required: ['key', 'proof', 'value'], properties: { key: { type: 'string', description: 'the storage key', pattern: '^0x[0-9a-fA-F]+$' }, proof: { type: 'array', description: 'the serialized merkle-noodes beginning with the root-node ( storageHash )', items: { type: 'string', pattern: '^0x[0-9a-fA-F]+$' } }, value: { type: 'string', description: 'the stored value', pattern: '^0x[0-9a-fA-F]+$' } } } } } } }

/** validates the IN3NodeWeight and returns true | false. if it failes, use validateIN3NodeWeight.errors to get a list of errors. */
export const validateIN3NodeWeight = ajv.compile(validationDef.IN3NodeWeight)
export const IN3NodeWeightDefinition = validationDef.IN3NodeWeight
/** validates the IN3NodeWeight and throws in case of an a invalid object.*/
export function validateIN3NodeWeightAndThrow(data: IN3NodeWeight) { validateAndThrow(validateIN3NodeWeight, data) }
/** validates the IN3RPCRequestConfig and returns true | false. if it failes, use validateIN3RPCRequestConfig.errors to get a list of errors. */
export const validateIN3RPCRequestConfig = ajv.compile(validationDef.IN3RPCRequestConfig)
export const IN3RPCRequestConfigDefinition = validationDef.IN3RPCRequestConfig
/** validates the IN3RPCRequestConfig and throws in case of an a invalid object.*/
export function validateIN3RPCRequestConfigAndThrow(data: IN3RPCRequestConfig) { validateAndThrow(validateIN3RPCRequestConfig, data) }
/** validates the Signature and returns true | false. if it failes, use validateSignature.errors to get a list of errors. */
export const validateSignature = ajv.compile(validationDef.Signature)
export const SignatureDefinition = validationDef.Signature
/** validates the Signature and throws in case of an a invalid object.*/
export function validateSignatureAndThrow(data: Signature) { validateAndThrow(validateSignature, data) }
/** validates the IN3ResponseConfig and returns true | false. if it failes, use validateIN3ResponseConfig.errors to get a list of errors. */
export const validateIN3ResponseConfig = ajv.compile(validationDef.IN3ResponseConfig)
export const IN3ResponseConfigDefinition = validationDef.IN3ResponseConfig
/** validates the IN3ResponseConfig and throws in case of an a invalid object.*/
export function validateIN3ResponseConfigAndThrow(data: IN3ResponseConfig) { validateAndThrow(validateIN3ResponseConfig, data) }
/** validates the RPCRequest and returns true | false. if it failes, use validateRPCRequest.errors to get a list of errors. */
export const validateRPCRequest = ajv.compile(validationDef.RPCRequest)
export const RPCRequestDefinition = validationDef.RPCRequest
/** validates the RPCRequest and throws in case of an a invalid object.*/
export function validateRPCRequestAndThrow(data: RPCRequest) { validateAndThrow(validateRPCRequest, data) }
/** validates the RPCResponse and returns true | false. if it failes, use validateRPCResponse.errors to get a list of errors. */
export const validateRPCResponse = ajv.compile(validationDef.RPCResponse)
export const RPCResponseDefinition = validationDef.RPCResponse
/** validates the RPCResponse and throws in case of an a invalid object.*/
export function validateRPCResponseAndThrow(data: RPCResponse) { validateAndThrow(validateRPCResponse, data) }
/** validates the IN3NodeConfig and returns true | false. if it failes, use validateIN3NodeConfig.errors to get a list of errors. */
export const validateIN3NodeConfig = ajv.compile(validationDef.IN3NodeConfig)
export const IN3NodeConfigDefinition = validationDef.IN3NodeConfig
/** validates the IN3NodeConfig and throws in case of an a invalid object.*/
export function validateIN3NodeConfigAndThrow(data: IN3NodeConfig) { validateAndThrow(validateIN3NodeConfig, data) }
/** validates the LogProof and returns true | false. if it failes, use validateLogProof.errors to get a list of errors. */
export const validateLogProof = ajv.compile(validationDef.LogProof)
export const LogProofDefinition = validationDef.LogProof
/** validates the LogProof and throws in case of an a invalid object.*/
export function validateLogProofAndThrow(data: LogProof) { validateAndThrow(validateLogProof, data) }
/** validates the Proof and returns true | false. if it failes, use validateProof.errors to get a list of errors. */
export const validateProof = ajv.compile(validationDef.Proof)
export const ProofDefinition = validationDef.Proof
/** validates the Proof and throws in case of an a invalid object.*/
export function validateProofAndThrow(data: Proof) { validateAndThrow(validateProof, data) }
/** validates the AccountProof and returns true | false. if it failes, use validateAccountProof.errors to get a list of errors. */
export const validateAccountProof = ajv.compile(validationDef.AccountProof)
export const AccountProofDefinition = validationDef.AccountProof
/** validates the AccountProof and throws in case of an a invalid object.*/
export function validateAccountProofAndThrow(data: AccountProof) { validateAndThrow(validateAccountProof, data) }
