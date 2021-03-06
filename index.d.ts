import Markdown from "markdown-it";
export interface MarkdownTocDescOption {
    includeLevel: number[];
    getTocTree: (tree: Heading[]) => void;
    slugify: (hash: string) => string;
}
export declare type Heading = {
    children: Heading[];
    content: string;
    link: string;
};
export declare function MarkdownItTocDesc(md: Markdown, o: MarkdownTocDescOption): void;
export default MarkdownItTocDesc;
