import { getKnexDBInstance, getKnexTenantInstance } from '#conns';
import { dbInstasnceStorage } from '#lib/asyncContexts';

export const getDbInstance = () => {
  let store = dbInstasnceStorage.getStore();
  let mOrT = store?.get('mOrT');
  let tId = store?.get('tId');
  if (mOrT === undefined) return undefined;
  if (mOrT) {
    return getKnexTenantInstance(tId);
  } else {
    return getKnexDBInstance(tId);
  }
};
