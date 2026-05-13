import type { IHomeStats } from '../../types';

interface StatsBarProps {
  stats: IHomeStats;
}

const statLabels = {
  articleCount: '文章',
  tagCount: '标签',
  viewCount: '访问',
};

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <section className="grid grid-cols-3 gap-3 rounded-lg border border-green-100/70 bg-white/70 p-4">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="text-center">
          <div className="text-xl font-semibold text-green-800">{value.toLocaleString('zh-CN')}</div>
          <div className="mt-1 text-xs text-green-600/70">
            {statLabels[key as keyof IHomeStats]}
          </div>
        </div>
      ))}
    </section>
  );
}
