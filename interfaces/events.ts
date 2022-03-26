export interface HTMLInputElement extends Event {
    target: HTMLInputElement & EventTarget;
    files: FileList;
}