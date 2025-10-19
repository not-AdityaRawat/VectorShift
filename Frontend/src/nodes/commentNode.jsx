// commentNode.jsx

import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { MessageSquare, CircleX, Palette, Type as TypeIcon, AlignLeft } from 'lucide-react';
import { useStore } from '../store';

export const CommentNode = ({ id, data }) => {
  const [comment, setComment] = useState(data?.comment || 'Add your notes here...');
  const [title, setTitle] = useState(data?.title || 'Comment');
  const [bgColor, setBgColor] = useState(data?.bgColor || 'bg-yellow-200');
  const [fontSize, setFontSize] = useState(data?.fontSize || 'text-sm');
  const [nodeWidth, setNodeWidth] = useState('w-64');
  const [isMinimized, setIsMinimized] = useState(data?.isMinimized || false);
  const textareaRef = useRef(null);
  const { onNodesChange, updateNodeField } = useStore();

  // Color options for the comment node
  const colorOptions = [
    { name: 'Yellow', class: 'bg-yellow-200' },
    { name: 'Pink', class: 'bg-pink-200' },
    { name: 'Blue', class: 'bg-blue-200' },
    { name: 'Green', class: 'bg-green-200' },
    { name: 'Purple', class: 'bg-purple-200' },
    { name: 'Orange', class: 'bg-orange-200' },
    { name: 'Gray', class: 'bg-gray-200' },
  ];

  // Font size options
  const fontSizeOptions = [
    { name: 'Small', class: 'text-xs' },
    { name: 'Medium', class: 'text-sm' },
    { name: 'Large', class: 'text-base' },
  ];

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current && !isMinimized) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment, isMinimized]);

  // Calculate node width based on content
  useEffect(() => {
    const lines = comment.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length), title.length, 20);
    const calculatedWidth = Math.max(250, Math.min(500, maxLineLength * 8 + 60));
    setNodeWidth(`w-[${calculatedWidth}px]`);
  }, [comment, title]);

  // Update store when data changes
  useEffect(() => {
    updateNodeField(id, 'comment', comment);
    updateNodeField(id, 'title', title);
    updateNodeField(id, 'bgColor', bgColor);
    updateNodeField(id, 'fontSize', fontSize);
    updateNodeField(id, 'isMinimized', isMinimized);
  }, [comment, title, bgColor, fontSize, isMinimized, id, updateNodeField]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDelete = () => {
    onNodesChange([{ type: 'remove', id }]);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`${nodeWidth} h-auto border-2 border-gray-400 rounded-lg p-3 ${bgColor} relative shadow-lg`}>
      {/* Header */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <MessageSquare size={18} className="text-gray-700 flex-shrink-0" />
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="font-bold text-sm bg-transparent border-b border-transparent hover:border-gray-400 focus:border-gray-600 focus:outline-none flex-1 px-1"
              placeholder="Comment Title"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMinimize}
              className="cursor-pointer hover:bg-gray-300 p-1 rounded"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <AlignLeft size={14} className={isMinimized ? 'rotate-90' : ''} />
            </button>
            <CircleX 
              size={16} 
              className='cursor-pointer hover:text-red-700' 
              onClick={handleDelete}
            />
          </div>
        </div>

        {/* Style Controls */}
        {!isMinimized && (
          <div className="flex gap-2 items-center flex-wrap border-t border-gray-300 pt-2">
            {/* Color Picker */}
            <div className="flex items-center gap-1">
              <Palette size={12} className="text-gray-600" />
              <select
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="text-xs px-1 py-0.5 border border-gray-300 rounded bg-white cursor-pointer"
              >
                {colorOptions.map((color) => (
                  <option key={color.class} value={color.class}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size Picker */}
            <div className="flex items-center gap-1">
              <TypeIcon size={12} className="text-gray-600" />
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="text-xs px-1 py-0.5 border border-gray-300 rounded bg-white cursor-pointer"
              >
                {fontSizeOptions.map((size) => (
                  <option key={size.class} value={size.class}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Comment Text Area */}
      {!isMinimized && (
        <div className="mb-2">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={handleCommentChange}
            className={`w-full px-2 py-1.5 border border-gray-300 rounded ${fontSize} bg-white bg-opacity-70 overflow-hidden resize-vertical min-h-[80px] focus:outline-none focus:ring-2 focus:ring-gray-400`}
            placeholder="Type your comment or notes here..."
          />
        </div>
      )}

      {/* Character/Word Count */}
      {!isMinimized && (
        <div className="text-xs text-gray-600 flex justify-between items-center">
          <span>{comment.length} characters</span>
          <span>{comment.split(/\s+/).filter(word => word.length > 0).length} words</span>
        </div>
      )}

      {/* Minimized Preview */}
      {isMinimized && (
        <div className={`${fontSize} text-gray-700 italic truncate`}>
          {comment.substring(0, 50)}{comment.length > 50 ? '...' : ''}
        </div>
      )}
    </div>
  );
};
