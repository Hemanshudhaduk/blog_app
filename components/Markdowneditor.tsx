"use client";

import { useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";

export interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: number;
    className?: string;
}

// Toolbar button config
interface ToolbarButton {
    label: string;
    title: string;
    syntax: string;     // wrap selected text, or insert at cursor
    block?: boolean;    // true = insert on new line
    wrap?: [string, string]; // [prefix, suffix] for wrapping selections
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
    { label: "B", title: "Bold", syntax: "****", wrap: ["**", "**"] },
    { label: "I", title: "Italic", syntax: "__", wrap: ["_", "_"] },
    { label: "H", title: "Heading", syntax: "## ", block: true, wrap: ["## ", ""] },
    { label: "🔗", title: "Link", syntax: "[text](url)", wrap: ["[", "](url)"] },
    { label: "• ", title: "Bullet List", syntax: "\n- item\n", block: true, wrap: ["\n- ", ""] },
    { label: "</>", title: "Code Block", syntax: "```\n\n```", wrap: ["```\n", "\n```"] },
];

function countWords(text: string): number {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder = "Write your post in markdown...",
    minHeight = 320,
    className = "",
}: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const wordCount = countWords(value);
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Insert / wrap markdown syntax at cursor position
    const insertSyntax = useCallback(
        (btn: ToolbarButton) => {
            const ta = textareaRef.current;
            if (!ta) return;

            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const selected = value.slice(start, end);
            let newText = value;
            let newCursor = start;

            if (selected && btn.wrap) {
                // Wrap selected text
                const [prefix, suffix] = btn.wrap;
                newText =
                    value.slice(0, start) + prefix + selected + suffix + value.slice(end);
                newCursor = start + prefix.length + selected.length + suffix.length;
            } else if (btn.block) {
                // Insert on new line
                const prefix = btn.wrap ? btn.wrap[0] : btn.syntax;
                newText = value.slice(0, start) + prefix + value.slice(end);
                newCursor = start + prefix.length;
            } else if (btn.wrap) {
                // Insert wrap at cursor with placeholder
                const [prefix, suffix] = btn.wrap;
                const placeholder = "text";
                newText =
                    value.slice(0, start) + prefix + placeholder + suffix + value.slice(end);
                newCursor = start + prefix.length + placeholder.length;
            }

            onChange(newText);

            // Restore focus + cursor
            requestAnimationFrame(() => {
                ta.focus();
                ta.setSelectionRange(newCursor, newCursor);
            });
        },
        [value, onChange]
    );

    return (
        <div className={`flex flex-col border border-gray-200 rounded-xl overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-200 bg-gray-50">
                {TOOLBAR_BUTTONS.map((btn) => (
                    <button
                        key={btn.title}
                        title={btn.title}
                        type="button"
                        onClick={() => insertSyntax(btn)}
                        className="px-2.5 py-1 rounded text-sm font-mono text-gray-700
              hover:bg-gray-200 transition-colors"
                    >
                        {btn.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-gray-400 font-medium">Markdown</span>
            </div>

            {/* Split pane */}
            <div className="flex flex-1" style={{ minHeight }}>
                {/* Left: raw editor */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 p-4 text-sm font-mono text-gray-800 resize-none
            border-r border-gray-200 outline-none bg-white leading-relaxed"
                    style={{ minHeight }}
                />

                {/* Right: live preview */}
                <div
                    className="flex-1 p-4 overflow-auto prose prose-sm max-w-none bg-gray-50
            text-gray-800 leading-relaxed"
                    style={{ minHeight }}
                >
                    {value ? (
                        <ReactMarkdown>{value}</ReactMarkdown>
                    ) : (
                        <p className="text-gray-400 italic text-sm">Preview will appear here...</p>
                    )}
                </div>
            </div>

            {/* Footer: word count + reading time */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-200
        bg-gray-50 text-xs text-gray-500">
                <span>{wordCount} words</span>
                <span>~{readingTime} min read</span>
            </div>
        </div>
    );
}