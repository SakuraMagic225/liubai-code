interface TagBadgeProps {
  name: string;
  count?: number;
}

export function TagBadge({ name, count }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600">
      {name}
      {typeof count === 'number' ? <span className="text-green-400">({count})</span> : null}
    </span>
  );
}
