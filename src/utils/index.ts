import request from './request';
import { getAddress } from '@ethersproject/address'


export default {
  request,
};

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}