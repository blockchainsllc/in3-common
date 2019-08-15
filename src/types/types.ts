/***********************************************************
# This file is part of the Slock.it IoT Layer.             *
# The Slock.it IoT Layer contains:                         *
#   - USN (Universal Sharing Network)                      *
#   - INCUBED (Trustless INcentivized remote Node Network) *
#***********************************************************
# Copyright (C) 2016 - 2018 Slock.it GmbH                  *
# All Rights Reserved.                                     *
#***********************************************************
# You may use, distribute and modify this code under the   *
# terms of the license contract you have concluded with    *
# Slock.it GmbH.                                           *
# For information about liability, maintenance etc. also   *
# refer to the contract concluded with Slock.it GmbH.      *
#***********************************************************
# For more information, please refer to https://slock.it    *
# For questions, please contact info@slock.it              *
#**********************************************************/
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