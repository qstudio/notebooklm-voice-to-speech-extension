
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface FeatureTogglesProps {
  autoInsert: boolean;
  confirmBeforeAdd: boolean;
  onAutoInsertChange: (checked: boolean) => void;
  onConfirmBeforeAddChange: (checked: boolean) => void;
}

const FeatureToggles: React.FC<FeatureTogglesProps> = ({
  autoInsert,
  confirmBeforeAdd,
  onAutoInsertChange,
  onConfirmBeforeAddChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-insert" className="cursor-pointer">
          Auto-insert after speaking
        </Label>
        <Switch 
          id="auto-insert" 
          checked={autoInsert}
          onCheckedChange={onAutoInsertChange}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Automatically insert text when you stop speaking.
      </p>

      <div className="flex items-center justify-between">
        <Label htmlFor="confirm-add" className="cursor-pointer">
          Confirm before adding
        </Label>
        <Switch 
          id="confirm-add" 
          checked={confirmBeforeAdd}
          onCheckedChange={onConfirmBeforeAddChange}
          disabled={!autoInsert}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Ask for confirmation before automatically adding text.
      </p>
    </div>
  );
};

export default FeatureToggles;
