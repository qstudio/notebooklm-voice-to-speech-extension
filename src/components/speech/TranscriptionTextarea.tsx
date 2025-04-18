
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TranscriptionTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInteraction: () => void;
  onSelectionChange: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const TranscriptionTextarea: React.FC<TranscriptionTextareaProps> = ({
  value,
  onChange,
  onInteraction,
  onSelectionChange,
  textareaRef,
}) => {
  return (
    <div className="mt-4">
      <Textarea 
        ref={textareaRef}
        placeholder="Start recording or type here..." 
        className="min-h-[200px] resize-none"
        value={value}
        onChange={onChange}
        onKeyDown={onInteraction}
        onMouseDown={onInteraction}
        onMouseUp={onSelectionChange} // Added to capture mouse selection changes
        onPaste={onInteraction}
        onClick={onSelectionChange} // Changed to update cursor position on click
        onSelect={onSelectionChange}
      />
    </div>
  );
};

export default TranscriptionTextarea;
