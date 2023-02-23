import defaultTheme from "./theme/defaultTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import styles from "../../styles/Editor.module.css"
import { $generateHtmlFromNodes } from '@lexical/html';
import { useState } from "react";

function Placeholder() {
  return <div className={styles.editor_placeholder}>Enter some rich text...</div>;
}




const editorConfig = {
  // The editor theme
  theme: defaultTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ],
  
  // NOde to html
  generateHtmlFromNodes: $generateHtmlFromNodes,

};




export default function Editor(props) {

  const onChange = (editorState, editor) => {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      const customFormData = {
        target: {
          name: props.name,
          value: htmlString
      }}
     props.onChange(customFormData);
   });
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles.editor_container}>
        <ToolbarPlugin />
        <div className={styles.editor_inner}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.editor_input} />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
    
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange} ignoreSelectionChange/>
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
