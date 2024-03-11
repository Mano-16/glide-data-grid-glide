import { drawTextCell, getMiddleCenterBias } from "../internal/data-grid/render/data-grid-lib.js";
import { InnerGridCellKind, type MarkerCell } from "../internal/data-grid/data-grid-types.js";
import { drawCheckbox } from "../internal/data-grid/render/draw-checkbox.js";
import type { BaseDrawArgs, InternalCellRenderer, PrepResult } from "./cell-types.js";
import type { RowMarkerOptions } from "../data-editor/data-editor.js";

export const markerCellRenderer: InternalCellRenderer<MarkerCell> = {
    getAccessibilityString: c => c.row.toString(),
    kind: InnerGridCellKind.Marker,
    needsHover: true,
    needsHoverPosition: false,
    drawPrep: prepMarkerRowCell,
    measure: () => 44,
    draw: a =>
        drawMarkerRowCellWithAction(a, a.cell.row, a.cell.checked, a.cell.markerKind, a.cell.onActionClick, a.cell.checkboxStyle),
    // drawMarkerRowCell(a, a.cell.row, a.cell.checked, a.cell.markerKind, a.cell.drawHandle, a.cell.checkboxStyle),
    onClick: e => {
        const { bounds, cell, posX: x, posY: y } = e;
        const cellHorizontalPadding = 4;
        const { width, height } = bounds;

        const isCheckBoxClick = x <= width - cellHorizontalPadding && x >= width - cellHorizontalPadding - 14 && Math.abs(y - height / 2) <= 10;
        const isActionClick = x >= cellHorizontalPadding / 2 && x < cellHorizontalPadding / 2 + 10 && Math.abs(y - height / 2) <= 10;


        if (isCheckBoxClick) {
            return {
                ...cell,
                checked: !cell.checked,
            };
        } else if (isActionClick && cell.onActionClick) {
            cell.onActionClick(cell.row);
        }
        return undefined;
    },
    // onClick: e => {
    //     const { bounds, cell, posX: x, posY: y } = e;
    //     const { width, height } = bounds;

    //     const centerX = cell.drawHandle ? 7 + (width - 7) / 2 : width / 2;
    //     const centerY = height / 2;

    //     if (Math.abs(x - centerX) <= 10 && Math.abs(y - centerY) <= 10) {
    //         return {
    //             ...cell,
    //             checked: !cell.checked,
    //         };
    //     }
    //     return undefined;
    // },
    onPaste: () => undefined,
};

function prepMarkerRowCell(args: BaseDrawArgs, lastPrep: PrepResult | undefined): Partial<PrepResult> {
    const { ctx, theme } = args;
    const newFont = theme.markerFontFull;
    const result: Partial<PrepResult> = lastPrep ?? {};
    if (result?.font !== newFont) {
        ctx.font = newFont;
        result.font = newFont;
    }
    result.deprep = deprepMarkerRowCell;
    ctx.textAlign = "center";
    return result;
}

function deprepMarkerRowCell(args: Pick<BaseDrawArgs, "ctx">) {
    const { ctx } = args;
    ctx.textAlign = "start";
}

// function drawMarkerRowCell(
//     args: BaseDrawArgs,
//     index: number,
//     checked: boolean,
//     markerKind: "checkbox" | "both" | "number" | "checkbox-visible",
//     drawHandle: boolean,
//     style: "circle" | "square"
// ) {
//     const { ctx, rect, hoverAmount, theme } = args;
//     const { x, y, width, height } = rect;
//     const checkedboxAlpha = checked ? 1 : markerKind === "checkbox-visible" ? 0.6 + 0.4 * hoverAmount : hoverAmount;
//     if (markerKind !== "number" && checkedboxAlpha > 0) {
//         ctx.globalAlpha = checkedboxAlpha;
//         const offsetAmount = 7 * (checked ? hoverAmount : 1);
//         drawCheckbox(
//             ctx,
//             theme,
//             checked,
//             drawHandle ? x + offsetAmount : x,
//             y,
//             drawHandle ? width - offsetAmount : width,
//             height,
//             true,
//             undefined,
//             undefined,
//             18,
//             "center",
//             style
//         );
//         if (drawHandle) {
//             ctx.globalAlpha = hoverAmount;
//             ctx.beginPath();
//             for (const xOffset of [3, 6]) {
//                 for (const yOffset of [-5, -1, 3]) {
//                     ctx.rect(x + xOffset, y + height / 2 + yOffset, 2, 2);
//                 }
//             }

//             ctx.fillStyle = theme.textLight;
//             ctx.fill();
//             ctx.beginPath();
//         }
//         ctx.globalAlpha = 1;
//     }
//     if (markerKind === "number" || (markerKind === "both" && !checked)) {
//         const text = index.toString();
//         const fontStyle = theme.markerFontFull;

//         const start = x + width / 2;
//         if (markerKind === "both" && hoverAmount !== 0) {
//             ctx.globalAlpha = 1 - hoverAmount;
//         }
//         ctx.fillStyle = theme.textLight;
//         ctx.font = fontStyle;
//         ctx.fillText(text, start, y + height / 2 + getMiddleCenterBias(ctx, fontStyle));
//         if (hoverAmount !== 0) {
//             ctx.globalAlpha = 1;
//         }
//     }
// }

function drawMarkerRowCellWithAction(
    args: BaseDrawArgs,
    index: number,
    checked: boolean,
    markerKind: "checkbox" | "both" | "number" | "checkbox-visible",
    onActionClick: RowMarkerOptions["onActionClick"] | undefined,
    style: "circle" | "square" | "thin-square"
) {
    const { ctx, rect, hoverAmount, theme } = args;
    const cellHorizontalPadding = 4;
    const { x, y, width, height } = rect;
    const checkedboxAlpha = 1;
    if (markerKind !== "number" && checkedboxAlpha > 0) {
        ctx.globalAlpha = checkedboxAlpha;
        drawCheckbox(
            ctx,
            { ...theme, cellHorizontalPadding },
            checked,
            x,
            y,
            width,
            height,
            true,
            undefined,
            undefined,
            12,
            "right",
            style
        );
        // if (drawHandle) {
        const centerWidth = (width - cellHorizontalPadding - 4) / 2;
        ctx.globalAlpha = hoverAmount;
        ctx.beginPath();
        for (const xOffset of [centerWidth, centerWidth + 3]) {
            for (const yOffset of [-5, -1, 3]) {
                ctx.rect(x + xOffset, y + height / 2 + yOffset, 2, 2);
            }
        }

        ctx.fillStyle = theme.textLight;
        ctx.fill();
        ctx.beginPath();
        // }
        if (onActionClick) {
            ctx.save();
            ctx.font = "18px sans-serif";
            drawTextCell({ ...args, rect: { ...rect, x: rect.x + cellHorizontalPadding / 2, y: rect.y - 2 }, theme: { ...theme, cellHorizontalPadding } }, "+", "left", false, false, false);
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }

    if (markerKind === "number" || (markerKind === "both" && !checked)) {
        const text = index.toString();
        const fontStyle = theme.markerFontFull;

        const start = x + width / 2;
        if (markerKind === "both" && hoverAmount !== 0) {
            ctx.globalAlpha = 1 - hoverAmount;
        }
        ctx.fillStyle = theme.textLight;
        ctx.font = fontStyle;
        ctx.fillText(text, start, y + height / 2 + getMiddleCenterBias(ctx, fontStyle));
        if (hoverAmount !== 0) {
            ctx.globalAlpha = 1;
        }
    }
}
