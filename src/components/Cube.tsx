interface CubeProps {
  height?: number
  width?: number
}

export const Cube = ({ height = 75, width = 75 }: CubeProps) => (
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
        <polygon fill="#b7f4f0" points="29,58 3,45 3,13 29,26" />
        <polygon fill="#117bbc" points="29,58 55,45 55,13 29,26" />
        <polygon fill="#5ed2e5" points="3,13 28,0 55,13 29,26" />
      </g>
    </g>
  </svg>
)

export default Cube
