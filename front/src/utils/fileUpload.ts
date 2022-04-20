import { HTMLInputElement } from "../../../interfaces/events";
interface basicObj extends Object {
  [prop: string]: any
}
export const setFile = (event: HTMLInputElement, obj: basicObj): void => {
  const file: File = event.target.files[0];
  obj.posterUrl = file;
};
