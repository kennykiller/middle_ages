export interface IInputElement extends Event {
  target: HTMLInputElement & EventTarget;
  files: FileList;
}
