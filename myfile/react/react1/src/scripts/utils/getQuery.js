
import url from 'url';

function getQuery(search){
    return url.parse(search,true).query;
}

export default getQuery;