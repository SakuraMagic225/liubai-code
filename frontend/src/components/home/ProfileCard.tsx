import type { ISiteProfile } from '../../types';

interface ProfileCardProps {
  profile: ISiteProfile;
}

function ContactIcon({ label }: { label: string }) {
  const normalized = label.toLowerCase();

  if (normalized.includes('github')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18a2.65 2.65 0 0 0-1.1-1.45c-.9-.62.07-.6.07-.6a2.1 2.1 0 0 1 1.53 1.03 2.13 2.13 0 0 0 2.91.83 2.14 2.14 0 0 1 .64-1.34c-2.22-.25-4.56-1.11-4.56-4.95a3.88 3.88 0 0 1 1.03-2.69 3.6 3.6 0 0 1 .1-2.65s.84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.01c.85 0 1.7.11 2.5.33 1.9-1.3 2.74-1.03 2.74-1.03.55 1.38.2 2.4.1 2.65a3.87 3.87 0 0 1 1.03 2.69c0 3.85-2.34 4.7-4.57 4.95a2.4 2.4 0 0 1 .68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
        />
      </svg>
    );
  }

  if (normalized.includes('email') || normalized.includes('mail')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16v12H4z"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m4 7 8 6 8-6"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 19h.01M5 5c7.73 0 14 6.27 14 14M5 12a7 7 0 0 1 7 7"
      />
    </svg>
  );
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const links = [
    profile.githubUrl ? { label: 'GitHub', href: profile.githubUrl } : null,
    profile.email ? { label: 'Email', href: profile.email.startsWith('mailto:') ? profile.email : `mailto:${profile.email}` } : null,
    profile.rssUrl ? { label: 'RSS', href: profile.rssUrl } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;
  const avatarInitial = profile.name.trim().slice(0, 1) || '留';

  return (
    <aside className="glass-card rounded-lg p-6">
      <div className="flex items-center gap-4">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name || '头像'}
            className="h-20 w-20 rounded-full border border-green-100 object-cover shadow-soft"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-2xl font-semibold text-green-800 shadow-soft">
            {avatarInitial}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-green-800">{profile.name}</h2>
          <p className="text-sm text-green-600/75">{profile.title}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-green-600/90">{profile.bio}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-green-100 bg-white/80 text-green-600/80 transition hover:-translate-y-0.5 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-500"
          >
            <ContactIcon label={link.label} />
          </a>
        ))}
      </div>
    </aside>
  );
}
