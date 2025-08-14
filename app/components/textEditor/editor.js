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
import {$generateNodesFromDOM} from '@lexical/html';
import { useEffect, } from "react";
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$insertNodes} from 'lexical'
import PropTypes from 'prop-types'

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


};


function SetInitValue(props) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      if(!props.value) return;
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.value, "text/html");
      const nodes = $generateNodesFromDOM(editor , doc);
     $insertNodes(nodes);
    });
  }, [props.value]);

  return null;
}

export default function Editor({ name, value, onChange, placeholder }) {

  const on_Change = (editorState, editor) => {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      const customFormData = {
        target: {
          name: name,
          value: htmlString
      }}
     onChange(customFormData);
   });
  }
  
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className={styles.editor_container}>
        <ToolbarPlugin />
        <div className={styles.editor_inner}>
          <RichTextPlugin
            contentEditable={<ContentEditable className={styles.editor_input} />}
            placeholder={ 
              placeholder ? placeholder : <Placeholder />}
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
          <OnChangePlugin onChange={on_Change} ignoreSelectionChange/>
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <SetInitValue value={value} />
        </div>
      </div>
    </LexicalComposer>
  );
}

Editor.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string
};
