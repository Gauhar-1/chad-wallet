'use client';

// =============================================================================
// UserAvatar — Display user profile picture or initials
// =============================================================================

import { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name?: string;
  imageUrl?: string;
  size?: number;
  className?: string;
}

const UserAvatar = memo(function UserAvatar({
  name,
  imageUrl,
  size = 32,
  className,
}: UserAvatarProps) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name || 'User avatar'}
        width={size}
        height={size}
        className={cn('rounded-full', className)}
        unoptimized
      />
    );
  }

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold',
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
});

export default UserAvatar;
