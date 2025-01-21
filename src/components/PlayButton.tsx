interface PlayButtonProps {
  className?: string
  isReset?: boolean
}

export const PlayButton = ({
  className = '',
  isReset = false,
}: PlayButtonProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {isReset ? (
        // Reset icon (circular arrow)
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      ) : (
        // Play triangle
        <polygon points="5 3 19 12 5 21" />
      )}
    </svg>
  )
}
