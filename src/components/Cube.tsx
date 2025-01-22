export type CubeVariant = 'default' | 'hover' | 'danger'

interface CubeProps {
  height?: number
  width?: number
  variant?: CubeVariant
}

const CUBE_COLORS = {
  default: {
    light: '#b7f4f0',
    medium: '#5ed2e5',
    dark: '#117bbc',
  },
  hover: {
    light: '#d4f9f7',
    medium: '#8ee5f0',
    dark: '#3d9fd8',
  },
  danger: {
    light: '#ffb7b7',
    medium: '#e55e5e',
    dark: '#bc1111',
  },
}

export const Cube = ({
  height = 75,
  width = 75,
  variant = 'default',
}: CubeProps) => {
  const colors = CUBE_COLORS[variant]

  return (
    <svg
      height={height}
      width={width}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 58 58"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <polygon fill={colors.light} points="29,58 3,45 3,13 29,26" />
          <polygon fill={colors.dark} points="29,58 55,45 55,13 29,26" />
          <polygon fill={colors.medium} points="3,13 28,0 55,13 29,26" />
        </g>
      </g>
    </svg>
  )
}

export default Cube
