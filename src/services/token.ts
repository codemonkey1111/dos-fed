import request from '@/utils/request';
import { isAddress } from '@/utils';

// type LastAddress = string
// type ClaimAddressMapping = { [firstAddress: string]: LastAddress }
let FETCH_CLAIM_MAPPING_PROMISE: Promise<any> | null = null

function fetchClaimMapping(): Promise<any> {
  return (
    FETCH_CLAIM_MAPPING_PROMISE ??
    (FETCH_CLAIM_MAPPING_PROMISE = request(
      `/public/merkle-tree/mapping.json`
    )
    )
  )
}

const FETCH_CLAIM_FILE_PROMISES: { [startingAddress: string]: Promise<{ [address: string]: any }> } = {}
function fetchClaimFile(key: string): Promise<{ [address: string]: any }> {
  return (
    FETCH_CLAIM_FILE_PROMISES[key] ??
    (FETCH_CLAIM_FILE_PROMISES[key] = request(
      `/public/merkle-tree/chunks/${key}.json`
    ))
  )
}

const FETCH_CLAIM_PROMISES: { [key: string]: Promise<any> } = {}
// returns the claim for the given address, or null if not valid
export function fetchClaim(account: string): Promise<any> {
  const formatted = isAddress(account)
  if (!formatted) return Promise.reject(new Error('Invalid address'))

  return (
    FETCH_CLAIM_PROMISES[account] ??
    (FETCH_CLAIM_PROMISES[account] = fetchClaimMapping()
      .then((result:any) => {
        const mapping = result.data;
        const sorted = Object.keys(mapping).sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))

        for (const startingAddress of sorted) {
          const lastAddress = mapping[startingAddress]
          if (startingAddress.toLowerCase() <= formatted.toLowerCase()) {
            if (formatted.toLowerCase() <= lastAddress.toLowerCase()) {
              return startingAddress
            }
          } else {
            throw new Error(`Claim for ${formatted} was not found in partial search`)
          }
        }
        throw new Error(`Claim for ${formatted} was not found after searching all mappings`)
      })
      .then(fetchClaimFile)
      .then((data: any) => {
        const result = data.data;
        if (result[formatted]) return result[formatted]
        return null;
        // throw new Error(`Claim for ${formatted} was not found in claim file!`)
      })
      .catch((error) => {
        console.debug('Claim fetch failed', error)
        throw error
      }))
  )
}