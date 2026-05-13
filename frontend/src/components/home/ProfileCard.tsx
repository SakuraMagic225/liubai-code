import type { IProfile } from '../../types';

interface ProfileCardProps {
  profile: IProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <aside className="glass-card rounded-lg p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-lg font-semibold text-green-800">
          留白
        </div>
        <div>
          <h2 className="text-lg font-semibold text-green-800">{profile.name}</h2>
          <p className="text-sm text-green-600/75">{profile.title}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-green-600/90">{profile.bio}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {profile.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-green-600/80 hover:-translate-y-0.5 hover:text-coral-400"
          >
            {link.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
