import { storage } from './utils';

export function isLaeder() {
    const userPartyInfo = JSON.parse(storage.getLocal('userPartyInfo'));
    const isLeader = userPartyInfo && userPartyInfo.postlist && userPartyInfo.postlist.length > 0;
    if (isLeader) {
        return true
    } else {
        return false
    }
}