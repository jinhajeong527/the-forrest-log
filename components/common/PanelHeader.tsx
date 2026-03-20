interface PanelHeaderProps {
  left: React.ReactNode;
  right?: React.ReactNode;
}

export function PanelHeader({ left, right }: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between pl-4 pr-8 h-16 border-b border-foreground/10">
      {left}
      {right}
    </div>
  );
}
