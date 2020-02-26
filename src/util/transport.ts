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

import { RPCRequest, RPCResponse } from '../types/types';
import axios from 'axios'

/**
 * A Transport-object responsible to transport the message to the handler.
 */
export interface Transport {
  /**
   * handles a request by passing the data to the handler
   */
  handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]>

  /**
   * check whether the handler is onlne.
   */
  isOnline(): Promise<boolean>

  /**
   * generates random numbers (between 0-1)
   */
  random(count: number): number[]

}


/**
 * Default Transport impl sending http-requests.
 */
export class AxiosTransport implements Transport {

  axiosConfig: any

  format: ('json' | 'cbor' | 'jsonRef')

  constructor(format: ('json' | 'cbor' | 'jsonRef') = 'json') {
    this.format = format
    this.axiosConfig = { headers: {} }
  }

  isOnline(): Promise<boolean> {
    try {
      return Promise.resolve(navigator.onLine)
    }
    catch {
      return axios.head('https://www.google.com').then(_ => true, _ => false)
    }
  }

  async handle(url: string, data: RPCRequest | RPCRequest[], timeout?: number): Promise<RPCResponse | RPCResponse[]> {
    // convertto array
    const requests = Array.isArray(data) ? data : [data]

    // add cbor-config
    const conf = { ...this.axiosConfig, headers: { ...(this.axiosConfig.headers || {}), 'Content-Type': 'application/json' } }

    // execute request
    try {
      //     requests.forEach(r=>console.log(' => req '+r.method+'('+r.params.map(_=>JSON.stringify(_)).join()+')'))
      const res = await axios.post(url, requests, { ...conf, timeout: timeout || 5000 })

      // throw if the status is an error
      if (res.status > 200) throw new Error('Invalid status')

      // if this was not given as array, we need to convert it back to a single object
      return (Array.isArray(data) || !Array.isArray(res.data)) ? res.data : res.data[0]
    } catch (err) {
      throw new Error('Invalid response from ' + url + '(' + JSON.stringify(requests, null, 2) + ')' + ' : ' + err.message + (err.response ? (err.response.data || err.response.statusText) : ''))
    }
  }

  random(count: number): number[] {
    const result = []
    for (let i = 0; i < count; i++)
      result.push(Math.random())
    return result
  }

}

/**
 * accepts even invalid or self signed SSL-Certificates (only for nodejs)
 */
export class NoneRejectingAxiosTransport extends AxiosTransport {
  constructor(format: ('json' | 'cbor' | 'jsonRef') = 'json') {
    super(format)
    try {
      const Agent = require('http' + 's').Agent
      this.axiosConfig.agent = new Agent({ rejectUnauthorized: false })
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }
    catch (x) {

    }
  }
}