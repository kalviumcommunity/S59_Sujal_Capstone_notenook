import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";

const Message = ({ role, content }) => {
  const renderContent = (content) => {
    const parts = content.split(/(```[^`]*```)/g);
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const language = getLanguage(part);
        const codeBlock = part.slice(3, -3).trim();
        return (
          <SyntaxHighlighter key={index} language={language} style={coy}>
            {codeBlock}
          </SyntaxHighlighter>
        );
      } else {
        return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
      }
    });
  };

  const getLanguage = (codeBlock) => {
    const match = codeBlock.match(/^```(\w+)\n/);
    return match ? match[1] : null;
  };

  return (
    <div className={`ai-message ${role}`}>
      <div className={`ai-message-content ${role}`}>
        {renderContent(content)}
      </div>
    </div>
  );
};

export default Message;
