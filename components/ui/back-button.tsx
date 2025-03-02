interface BackButtonProps {
  onClick?: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button onClick={onClick} className="mr-4">
      <svg width="42" height="39" viewBox="0 0 42 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="42" height="39" rx="7" fill="#F3F3F3"/>
        <path d="M14 20L28 20M14 20L20 14M14 20L20 26" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
} 