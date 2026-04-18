export const convertToMrkdwn = (line: string): string => {
    return (
        line
            // Headers → bold
            .replace(/^#{1,6}\s+(.*)/, "*$1*")
            // Bold
            .replace(/\*\*(.*?)\*\*/g, "*$1*")
            // Italic
            .replace(/_(.*?)_/g, "_$1_")
            // Inline code
            .replace(/`([^`]+)`/g, "`$1`")
            // Unordered list bullets
            .replace(/^[-*+]\s+/, "• ")
            // Ordered list
            .replace(/^\d+\.\s+/, (match) => match)
            // Links [text](url) → <url|text>
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<$2|$1>")
    );
}

export const toSlackBlocks = (markdown: string) => {
    const blocks: object[] = [];

    for (const line of markdown.split("\n")) {
        const trimmed = line.trim();

        if (!trimmed) continue; // skip empty lines

        blocks.push({
            type: "section",
            text: {
                type: "mrkdwn",
                text: convertToMrkdwn(trimmed),
            },
        });
    }
    return { text: markdown, blocks };
}

export const isMarkdown = (text: string): boolean => {
    const patterns = [
        /^#{1,6}\s+/m,           // headings (#, ##, ###)
        /\*\*.*?\*\*/,           // bold (**text**)
        /\*.*?\*/,               // italic (*text*)
        /`{1,3}.*?`{1,3}/,       // inline/code blocks
        /^\s*[-*+]\s+/m,         // unordered lists
        /^\s*\d+\.\s+/m,         // ordered lists
        /\[.*?\]\(.*?\)/,        // links
        /^>\s+/m,                // blockquotes
        /^---$/m                 // horizontal rules
    ];

    return patterns.some((pattern) => pattern.test(text));
};


export const isLocal = process.env.NODE_ENV === 'development';
