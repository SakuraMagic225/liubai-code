import type { ITag } from '../../types';
import { TagBadge } from '../common/TagBadge';

interface TagCloudProps {
  tags: ITag[];
}

export function TagCloud({ tags }: TagCloudProps) {
  return (
    <section className="rounded-lg border border-green-100/70 bg-white/75 p-6">
      <p className="text-sm font-medium text-coral-400">Tags</p>
      <h2 className="mt-2 text-lg font-semibold text-green-800">热门标签</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge key={tag.id} name={tag.name} count={tag.count} />
        ))}
      </div>
    </section>
  );
}
