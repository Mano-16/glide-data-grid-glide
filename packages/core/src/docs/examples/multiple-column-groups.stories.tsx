import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    PropName,
    useMockDataGenerator,
    defaultProps,
} from "../../data-editor/stories/utils.js";
import { GridColumnIcon } from "../../internal/data-grid/data-grid-types.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Multiple Column Groups"
                    description={
                        <Description>
                            Show multiple column group hierarchies by passing an array in groups, and specify groupHeaderLevels
                        </Description>
                    }>
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

export const MultipleColumnGroups: React.VFC = () => {
    const { cols, getCellContent } = useMockDataGenerator(20, true, true, true);

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getCellContent}
            onGroupHeaderRenamed={(x, y) => window.alert(`Please rename group ${x} to ${y}`)}
            columns={cols}
            rows={1000}
            getGroupDetails={g => ({
                name: g,
                icon: g === "" ? undefined : GridColumnIcon.HeaderCode,
            })}
            groupHeaderHeight={72}
            groupHeaderLevels={2}
            rowMarkers="both"
        />
    );
};
