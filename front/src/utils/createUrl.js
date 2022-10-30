export const getUrl = (entity, fullUrl) => {
    return `http://localhost:3000/${entity}/${fullUrl.split('/').pop()}`;
};
