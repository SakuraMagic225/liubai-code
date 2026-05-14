interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex flex-wrap items-center gap-2" aria-label="分页">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`h-9 min-w-9 rounded-full border px-3 text-sm font-medium ${
            item === page
              ? 'border-coral-400 bg-coral-400 text-white'
              : 'border-green-100 bg-white/75 text-green-600 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600'
          }`}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
