function TextEditor({ inputText, setInputText }) {
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="text-editor">
      <label htmlFor="writing-input">Ask Anything...</label>
      <textarea
        id="writing-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste a draft, email, caption, or idea you want to improve..."
        maxLength="5000"
      />
      <span className="word-count">{wordCount} words</span>
    </div>
  );
}

export default TextEditor;
