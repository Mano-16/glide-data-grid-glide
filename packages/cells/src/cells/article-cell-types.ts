import type { CustomCell } from "@lumel/glide-data-grid";

interface ArticleCellProps {
    readonly kind: "article-cell";
    readonly markdown: string;
}

export type ArticleCell = CustomCell<ArticleCellProps>;
