function ModeSelector({ selectedMode, setSelectedMode }) {
  const modes = [
    { id: 'professional', label: 'Professional' },
    { id: 'casual', label: 'Casual' },
    { id: 'creative', label: 'Creative' },
    { id: 'concise', label: 'Concise' },
  ];

  return (
    <div className="mode-selector" aria-label="Select tone">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className={selectedMode === mode.id ? 'active' : ''}
          onClick={() => setSelectedMode(mode.id)}
          type="button"
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

export default ModeSelector;
