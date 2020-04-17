import request from '@/utils/request';

export async function newsStatistics(searchString) { 
  return request(`/services/dpac/hotspotanalysis/analyseClicks${searchString}`);
}

export async function clickRate() {
  return request('/services/dpac/hotspotanalysis/analyseRank');
}


export async function articleClickRate() {
  return request(`/services/dpac/hotspotanalysis/analyseContent`);
}

// 关键数据分析
export async function keyData(searchString) {
  return request(`/services/dpac/dataanalysis/analyseKeyindex/${searchString}`);
}

export async function increaseTendency(searchString) {
  return request(`/services/dpac/dataanalysis/analyseContent${searchString}`);
}
