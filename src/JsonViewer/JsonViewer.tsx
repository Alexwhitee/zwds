import React, { useState } from 'react';
import './JsonViewer.css';

interface JsonViewerProps {
  data: object;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copyStatus, setCopyStatus] = useState('复制JSON');

  const formattedJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson).then(() => {
      setCopyStatus('已复制!');
      setTimeout(() => setCopyStatus('复制JSON'), 2000);
    }, () => {
      setCopyStatus('复制失败');
      setTimeout(() => setCopyStatus('复制JSON'), 2000);
    });
  };

  return (
    <div className="json-viewer-container">
      <div className="json-viewer-controls">
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '折叠' : '展开'}
        </button>
        <button onClick={handleCopy}>{copyStatus}</button>
      </div>
      {isExpanded && (
        <pre className="json-viewer-pre">
          <code>{formattedJson}</code>
        </pre>
      )}
    </div>
  );
};
