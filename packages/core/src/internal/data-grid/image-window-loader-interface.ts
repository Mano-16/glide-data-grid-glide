import type { CellSet } from "./cell-set.js";
import type { Rectangle } from "./data-grid-types.js";

/** @category Types */
export interface ImageWindowLoader {
    setWindow(newWindow: Rectangle, freezeCols: number, freezeRows: number[]): void;
    loadOrGetImage(key: string, url: string, col: number, row: number): HTMLImageElement | ImageBitmap | undefined;
    setCallback(imageLoaded: (locations: CellSet) => void): void;
}
