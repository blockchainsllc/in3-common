
## Types

configuration-data for the Incubed-client / server

*  [IN3NodeWeight](#in3nodeweight)
*  [IN3RPCRequestConfig](#in3rpcrequestconfig)
*  [Signature](#signature)
*  [IN3ResponseConfig](#in3responseconfig)
*  [RPCRequest](#rpcrequest)
*  [RPCResponse](#rpcresponse)
*  [IN3NodeConfig](#in3nodeconfig)
*  [LogProof](#logproof)
*  [Proof](#proof)
*  [AccountProof](#accountproof)

## Errors

*  [Error Keys](#error-keys)

## Types

configuration-data for the Incubed-client / server

### IN3NodeWeight

a local weight of a n3-node. (This is used internally to weight the requests)

```javascript
import {types} from 'in3-common'
const iN3NodeWeight:types.IN3NodeWeight = {
  weight: 0.5,
  responseCount: 147,
  avgResponseTime: 240,
  lastRequest: 1529074632623,
  blacklistedUntil: 1529074639623
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **weight** `number` - factor the weight this noe (default 1.0)   
*  **responseCount** `integer` - number of uses.   
*  **avgResponseTime** `number` - average time of a response in ms   
*  **pricePerRequest** `integer` - last price   
*  **lastRequest** `integer` - timestamp of the last request in ms   
*  **blacklistedUntil** `integer` - blacklisted because of failed requests until the timestamp   

### IN3RPCRequestConfig

additional config for a IN3 RPC-Request

```javascript
import {types} from 'in3-common'
const iN3RPCRequestConfig:types.IN3RPCRequestConfig = {
  chainId: '0x1',
  includeCode: true,
  verifiedHashes: [
    null
  ],
  latestBlock: 6,
  verification: 'proof',
  signatures: [
    '0x6C1a01C2aB554930A937B0a2E8105fB47946c679'
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **chainId** `string<hex>` (required)  - the requested chainId   
*  **includeCode** `boolean` - if true, the request should include the codes of all accounts. otherwise only the the codeHash is returned. In this case the client may ask by calling eth_getCode() afterwards   
*  **verifiedHashes** `string<bytes32>[]` - if the client sends a array of blockhashes the server will not deliver any signatures or blockheaders for these blocks, but only return a string with a number.   
*  **latestBlock** `integer` - if specified, the blocknumber *latest* will be replaced by blockNumber- specified value   
*  **useRef** `boolean` - if true binary-data (starting with a 0x) will be refered if occuring again.   
*  **useBinary** `boolean` - if true binary-data will be used.   
*  **useFullProof** `boolean` - if true all data in the response will be proven, which leads to a higher payload.   
*  **finality** `number` - if given the server will deliver the blockheaders of the following blocks until at least the number in percent of the validators is reached.   
*  **verification** `string` - defines the kind of proof the client is asking for   
 Must be one of the these values : `'never`', `'proof`', `'proofWithSignature`'
*  **clientSignature** [{"description":"the signature of the client"}](#{"description":"the signature of the client"}) - the signature of the client   
*  **signatures** `string<address>[]` - a list of addresses requested to sign the blockhash   

### Signature

Verified ECDSA Signature. Signatures are a pair (r, s). Where r is computed as the X coordinate of a point R, modulo the curve order n.

```javascript
import {types} from 'in3-common'
const signature:types.Signature = {
  address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
  block: 3123874,
  blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
  msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
  r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
  s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
  v: 28
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **address** `string<address>` - the address of the signing node   
*  **block** `number` (required)  - the blocknumber   
*  **blockHash** `string<bytes32>` (required)  - the hash of the block   
*  **msgHash** `string<bytes32>` (required)  - hash of the message   
*  **r** `string<hex>` (required)  - Positive non-zero Integer signature.r   
*  **s** `string<hex>` (required)  - Positive non-zero Integer signature.s   
*  **v** `integer<hex>` (required)  - Calculated curve point, or identity element O.   

### IN3ResponseConfig

additional data returned from a IN3 Server

```javascript
import {types} from 'in3-common'
const iN3ResponseConfig:types.IN3ResponseConfig = {
  proof: {
    type: 'accountProof',
    block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
    finalityBlocks: [
      '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
    ],
    transactions: [],
    uncles: [],
    merkleProof: [
      null
    ],
    merkleProofPrev: [
      null
    ],
    txProof: [
      null
    ],
    txIndex: 4,
    signatures: [
      {
        address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
        block: 3123874,
        blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
        msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
        r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
        s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
        v: 28
      }
    ]
  },
  lastNodeList: 326478,
  currentBlock: 320126478
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **proof** [Proof](#proof) - the Proof-data   
*  **lastNodeList** `number` - the blocknumber for the last block updating the nodelist. If the client has a smaller blocknumber he should update the nodeList.   
*  **lastValidatorChange** `number` - the blocknumber of gthe last change of the validatorList   
*  **currentBlock** `number` - the current blocknumber.   

### RPCRequest

a JSONRPC-Request with N3-Extension

```javascript
import {types} from 'in3-common'
const rPCRequest:types.RPCRequest = {
  jsonrpc: '2.0',
  method: 'eth_getBalance',
  id: 2,
  params: [
    '0xe36179e2286ef405e929C90ad3E70E649B22a945',
    'latest'
  ],
  in3: {
    chainId: '0x1',
    includeCode: true,
    verifiedHashes: [
      null
    ],
    latestBlock: 6,
    verification: 'proof',
    signatures: [
      '0x6C1a01C2aB554930A937B0a2E8105fB47946c679'
    ]
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **jsonrpc** `string` (required)  - the version   
 Must be one of the these values : `'2.0`'
*  **method** `string` (required)  - the method to call   
*  **id** `number,string` - the identifier of the request   
*  **params** `array` - the params   
*  **in3** [IN3RPCRequestConfig](#in3rpcrequestconfig) - the IN3-Config   

### RPCResponse

a JSONRPC-Responset with N3-Extension

```javascript
import {types} from 'in3-common'
const rPCResponse:types.RPCResponse = {
  jsonrpc: '2.0',
  id: 2,
  error: {},
  result: '0xa35bc',
  in3: {
    proof: {
      type: 'accountProof',
      block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
      finalityBlocks: [
        '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
      ],
      transactions: [],
      uncles: [],
      merkleProof: [
        null
      ],
      merkleProofPrev: [
        null
      ],
      txProof: [
        null
      ],
      txIndex: 4,
      signatures: [
        {
          address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
          block: 3123874,
          blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
          msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
          r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
          s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
          v: 28
        }
      ]
    },
    lastNodeList: 326478,
    currentBlock: 320126478
  },
  in3Node: {
    index: 13,
    address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
    timeout: 3600,
    url: 'https://in3.slock.it',
    chainIds: [
      '0x1'
    ],
    deposit: 12350000,
    capacity: 100,
    props: 3,
    registerTime: 1563279168,
    unregisterTime: 1563279168
  }
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **jsonrpc** `string` (required)  - the version   
 Must be one of the these values : `'2.0`'
*  **id** `string,number` (required)  - the id matching the request   
*  **error** `object` - JSON RPC error object   
    properties: 
    *  **code** `integer` - number that shows error type   
    *  **message** `string` (required)  - short description of error   
    *  **data** `any` - detailed structured information of error   
*  **result** [{"description":"the params","example":"0xa35bc"}](#{"description":"the params","example":"0xa35bc"}) - the params   
*  **in3** [IN3ResponseConfig](#in3responseconfig) - the IN3-Result   
*  **in3Node** [IN3NodeConfig](#in3nodeconfig) - the node handling this response (internal only)   

### IN3NodeConfig

a configuration of a in3-server.

```javascript
import {types} from 'in3-common'
const iN3NodeConfig:types.IN3NodeConfig = {
  index: 13,
  address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
  timeout: 3600,
  url: 'https://in3.slock.it',
  chainIds: [
    '0x1'
  ],
  deposit: 12350000,
  capacity: 100,
  props: 3,
  registerTime: 1563279168,
  unregisterTime: 1563279168
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **index** `integer` - the index within the contract   
*  **address** `string<address>` (required)  - the address of the node, which is the public address it iis signing with.   
*  **timeout** `integer` - the time (in seconds) until an owner is able to receive his deposit back after he unregisters himself   
*  **url** `string` (required)  - the endpoint to post to   
*  **chainIds** `string<hex>[]` (required)  - the list of supported chains   
*  **deposit** `integer` (required)  - the deposit of the node in wei   
*  **capacity** `integer` - the capacity of the node.   
*  **props** `integer` - the properties of the node.   
*  **registerTime** `integer` - the UNIX-timestamp when the node was registered   
*  **unregisterTime** `integer` - the UNIX-timestamp when the node is allowed to be deregister   

### LogProof

a Object holding proofs for event logs. The key is the blockNumber as hex

```javascript
import {types} from 'in3-common'
const logProof:types.LogProof = 
```
 See [types.yaml](../blob/develop/src/types/types.yaml)


### Proof

the Proof-data as part of the in3-section

```javascript
import {types} from 'in3-common'
const proof:types.Proof = {
  type: 'accountProof',
  block: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b',
  finalityBlocks: [
    '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda6463a8f1ebb14f3aff6b19cb91acf2b8ec1ffee98c0437b4ac839d8a2ece1b18166da704b'
  ],
  transactions: [],
  uncles: [],
  merkleProof: [
    null
  ],
  merkleProofPrev: [
    null
  ],
  txProof: [
    null
  ],
  txIndex: 4,
  signatures: [
    {
      address: '0x6C1a01C2aB554930A937B0a2E8105fB47946c679',
      block: 3123874,
      blockHash: '0x6C1a01C2aB554930A937B0a212346037E8105fB47946c679',
      msgHash: '0x9C1a01C2aB554930A937B0a212346037E8105fB47946AB5D',
      r: '0x72804cfa0179d648ccbe6a65b01a6463a8f1ebb14f3aff6b19cb91acf2b8ec1f',
      s: '0x6d17b34aeaf95fee98c0437b4ac839d8a2ece1b18166da704b86d8f42c92bbda',
      v: 28
    }
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **type** `string` (required)  - the type of the proof   
 Must be one of the these values : `'transactionProof`', `'receiptProof`', `'blockProof`', `'accountProof`', `'callProof`', `'logProof`'
*  **block** `string` - the serialized blockheader as hex, required in most proofs   
*  **finalityBlocks** `array` - the serialized blockheader as hex, required in case of finality asked   
*  **transactions** `array` - the list of transactions of the block   
*  **uncles** `array` - the list of uncle-headers of the block   
*  **merkleProof** `string[]` - the serialized merle-noodes beginning with the root-node   
*  **merkleProofPrev** `string[]` - the serialized merkle-noodes beginning with the root-node of the previous entry (only for full proof of receipts)   
*  **txProof** `string[]` - the serialized merkle-nodes beginning with the root-node in order to prrof the transactionIndex   
*  **logProof** [LogProof](#logproof) - the Log Proof in case of a Log-Request   
*  **accounts** `object` - a map of addresses and their AccountProof   
    each key in this object will structure its value like: 
*  **txIndex** `integer` - the transactionIndex within the block   
*  **signatures** `Signature[]` - requested signatures   

### AccountProof

the Proof-for a single Account

```javascript
import {types} from 'in3-common'
const accountProof:types.AccountProof = {
  accountProof: [
    null
  ],
  storageProof: [
    {
      proof: [
        null
      ]
    }
  ]
}
```
 See [types.yaml](../blob/develop/src/types/types.yaml)

*  **accountProof** `string[]` (required)  - the serialized merle-noodes beginning with the root-node   
*  **address** `string` (required)  - the address of this account   
*  **balance** `string` (required)  - the balance of this account as hex   
*  **codeHash** `string` (required)  - the codeHash of this account as hex   
*  **code** `string` - the code of this account as hex ( if required)   
*  **nonce** `string` (required)  - the nonce of this account as hex   
*  **storageHash** `string` (required)  - the storageHash of this account as hex   
*  **storageProof** `object[]` (required)  - proof for requested storage-data   
    the array must contain object of : 
    *  **key** `string` (required)  - the storage key   
    *  **proof** `string[]` (required)  - the serialized merkle-noodes beginning with the root-node ( storageHash )   
    *  **value** `string` (required)  - the stored value   


## Error Keys 
Each Error returned has 3 properties:

|Property|type|description|
|--|--|--|
|message|String|the english description of the error|
|key|String|a id which may be used to translate the message|
|stack|String|the error-stack used for internal debugging|

### List of error-keys : 

|key|message|
|--|--|
|invalid_data| |

