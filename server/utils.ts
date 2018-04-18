export const transformAudienceNumber = text => {
    return text.indexOf('万') > 0 ? text.replace(/万/, '') * 10000 : text;
}

export const isHttps = url => {
    return typeof url === "string" && url.indexOf('https') > -1
}

export const objectSort = (obj: { [key: string]: string }) => {
    return obj
}

export const objKeySort = (arys) => {
    var newkey = Object.keys(arys).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = arys[newkey[i]];
    }
    return newObj; 
}