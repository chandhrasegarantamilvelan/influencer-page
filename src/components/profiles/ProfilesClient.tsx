"use client";

import { useState } from "react";
import { ProfileCard } from "@/components/profiles/ProfileCard";

interface SocialProfileData {
  id: string;
  platformName: string;
  handle: string;
  profileUrl: string;
  followerCount: number;
  bioExcerpt: string | null;
  iconUrl: string | null;
}

interface ProfilesClientProps {
  profiles: SocialProfileData[];
}

export function ProfilesClient({ profiles }: ProfilesClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (profiles.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 text-lg">
          No social profiles available yet.
        </p>
      </div>
    );
  }

  const selectedProfile = profiles[selectedIndex];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left panel - Platform list */}
      <div className="w-full md:w-[30%] shrink-0">
        <nav aria-label="Social media platforms">
          <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {profiles.map((profile, index) => (
              <li key={profile.id}>
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                    index === selectedIndex
                      ? "bg-maroon text-white shadow-md shine-overlay"
                      : "bg-white text-zinc-700 hover:bg-zinc-50 hover:text-maroon"
                  }`}
                  aria-current={index === selectedIndex ? "true" : undefined}
                >
                  <span className="flex items-center gap-2">
                    {profile.iconUrl && (
                      <img
                        src={profile.iconUrl}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover"
                        loading="lazy"
                        aria-hidden="true"
                      />
                    )}
                    {profile.platformName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right panel - Profile Card preview */}
      <div className="w-full md:w-[70%]">
        <ProfileCard
          platform={selectedProfile.platformName}
          handle={selectedProfile.handle || null}
          followerCount={selectedProfile.followerCount ?? null}
          bioExcerpt={selectedProfile.bioExcerpt}
          profileUrl={selectedProfile.profileUrl}
          iconUrl={selectedProfile.iconUrl ?? undefined}
        />
      </div>
    </div>
  );
}
