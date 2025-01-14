'use client';

import { useSession, signOut } from "next-auth/react";

export default function SignOutButton() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    button.style.background = 'linear-gradient(45deg, #000000, #2196F3)';
    button.style.transform = 'scale(1.05)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    button.style.background = 'linear-gradient(45deg, #000000, #3f51b5)';
    button.style.transform = 'scale(1)';
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
      }}
    >
      <button
        onClick={() => signOut()}
        style={{
          padding: '10px 20px',
          background: 'linear-gradient(45deg, #000000, #3f51b5)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Sign out
      </button>
    </div>
  );
}