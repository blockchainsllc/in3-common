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

import { RPCRequest, RPCResponse } from '../types/types'
import * as cbor from 'cbor'

/**
 * turn 
 */
export function encodeRequests(requests: RPCRequest[]): Buffer {
  return cbor.encode(requests.map(r => [r.id, r.method, convertToBuffer(r.params), convertToBuffer(r.in3)]))
}

export function decodeRequests(request: Buffer): RPCRequest[] {
  return cbor.decode(request).map(r => ({
    jsonrpc: '2.0',
    id: r[0],
    method: r[1],
    params: convertToHex(r[2]),
    in3: convertToHex(r[3])
  }))

}

export function encodeResponses(responses: RPCResponse[]): Buffer {
  return cbor.encode(responses.map(r => [r.id, convertToBuffer(r.result), r.error, convertToBuffer(r.in3)]))
}
export function decodeResponses(responses: Buffer): RPCResponse[] {
  return cbor.decode(responses).map(r => ({
    jsonrpc: '2.0',
    id: r[0],
    result: convertToHex(r[1]),
    error: r[2],
    in3: convertToHex(r[3])
  }))
}

function convertToBuffer(val: any): any {
  switch (typeof val) {
    case 'string':
      return val.startsWith('0x') ? Buffer.from((val.length % 2 ? '0' : '') + val.substr(2), 'hex') : val
    case 'object':
      if (val === null) return null
      return Array.isArray(val)
        ? val.map(convertToBuffer)
        : Object.keys(val).reduce((p, c) => { p[c] = convertToBuffer(val[c]); return p }, {})
    default:
      return val
  }
}

function convertToHex(val: any): any {
  if (Buffer.isBuffer(val)) return '0x' + val.toString('hex')

  switch (typeof val) {
    case 'object':
      if (val === null) return null
      return Array.isArray(val)
        ? val.map(convertToHex)
        : Object.keys(val).reduce((p, c) => { p[c] = convertToHex(val[c]); return p }, {})
    default:
      return val
  }
}





export function createRefs<T>(val: T, cache: string[] = []): T {
  switch (typeof val) {
    case 'string':
      const s = val as any as string
      if (s.startsWith('0x')) {
        const i = cache.indexOf(s)
        if (i >= 0) return (':' + i) as any as T
        cache.push(s)
      }
      return val

    case 'object':
      if (val === null) return null
      return (Array.isArray(val)
        ? val.map(_ => createRefs(_, cache))
        : Object.keys(val).reduce((p, c) => { p[c] = createRefs(val[c], cache); return p }, {})) as any as T
    default:
      return val
  }
}

export function resolveRefs<T>(val: T, cache: string[] = []): T {
  switch (typeof val) {
    case 'string':
      const s = val as any as string
      if (s.startsWith('0x'))
        cache.push(s)
      if (s.startsWith(':'))
        return cache[parseInt(s.substr(1))] as any as T
      return val
    case 'object':
      if (val === null) return null
      return (Array.isArray(val)
        ? val.map(_ => resolveRefs(_, cache))
        : Object.keys(val).reduce((p, c) => { p[c] = resolveRefs(val[c], cache); return p }, {})) as any as T
    default:
      return val
  }
}