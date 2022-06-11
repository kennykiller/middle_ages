export const getImageUrl = (url) => {
    return new URL(`../${url}`, import.meta.url).href;
};
