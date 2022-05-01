import { HTMLInputElement } from "../../../interfaces/events";
interface basicObj extends Object {
    [prop: string]: any;
}
export declare class FileUploader {
    animationStarted: number;
    animationId: any;
    imagesTypes: string[];
    getTooltipData(): string;
    dragOver(event: DragEvent): void;
    dragLeave(event: DragEvent): void;
    drop(event: DragEvent, object: Object): void;
    chooseFile(): void;
    setDroppedFile(event: DragEvent, obj: basicObj, file: File): void;
    setFile(event: HTMLInputElement, obj: basicObj): void;
    uploadFile(file: File): void;
    animateCounter(timestamp: number): void;
    fileValidate(fileType: string, fileSize: number): true | void;
}
export {};
