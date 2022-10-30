export const getUrl = (entity: string, fullUrl: string) => {
    return `http://localhost:3000/${entity}/${fullUrl.split('/').pop()}`
}