export const setFile = (event, obj) => {
    const file = event.target.files[0];
    console.log(file);
    obj.posterUrl = file;
    console.log(obj);
};
