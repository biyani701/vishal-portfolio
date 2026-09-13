import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { Button, Box, Stack } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Code } from '@mui/icons-material';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

// Toolbar button component
const FormatButton = ({ format, icon, onMouseDown }) => (
  <Button onMouseDown={(event) => onMouseDown(event, format)}>{icon}</Button>
);

FormatButton.propTypes = {
  format: PropTypes.string,
  icon: PropTypes.node.isRequired,
  onMouseDown: PropTypes.func.isRequired,
};

// RenderElement extracted
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'code-block':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

Element.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    type: PropTypes.string,
  }).isRequired,
};

// RenderLeaf extracted
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.code) children = <code>{children}</code>;
  return <span {...attributes}>{children}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  leaf: PropTypes.object.isRequired,
};

const BlogEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'Start writing here...' }],
    },
  ]);

  const toggleFormat = (event, format) => {
    event.preventDefault();
    const isActive = isFormatActive(editor, format);
    editor.exec({
      type: 'set_mark',
      mark: format,
      value: !isActive,
    });
  };

  const isFormatActive = (editor, format) => {
    const [match] = Array.from(editor.marks ?? []);
    return match ? match[format] === true : false;
  };

  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
      <Slate 
      editor={editor}  
      initialValue={initialValue} 
      value={value} 
      onChange={setValue}      
      >
        <Stack direction="row" spacing={1} mb={2}>
          <FormatButton format="bold" icon={<FormatBold />} onMouseDown={toggleFormat} />
          <FormatButton format="italic" icon={<FormatItalic />} onMouseDown={toggleFormat} />
          <FormatButton format="underline" icon={<FormatUnderlined />} onMouseDown={toggleFormat} />
          <FormatButton format="code" icon={<Code />} onMouseDown={toggleFormat} />
        </Stack>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter blog content..."
          spellCheck
          autoFocus
          onKeyDown={event => {
            if (event.key === '&') {
              // Prevent the ampersand character from being inserted.
              event.preventDefault()
              // Execute the `insertText` method when the event occurs.
              editor.insertText('and')
            }
          }}
        />
      </Slate>
    </Box>
  );
};

export default BlogEditor;
