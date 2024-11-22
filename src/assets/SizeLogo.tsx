interface IProps {
  className: string;
}
function SizeLogo({ className }: IProps) {
  return (
    <svg viewBox="0 0 50 50" width="25px" height="25px">
      <path
        fill="var(--dark-theme-logo-fill)"
        d="M40,4c3.31,0,6,2.69,6,6v30c0,3.31-2.69,6-6,6H10c-3.31,0-6-2.69-6-6V10c0-3.31,2.69-6,6-6H40 M40,0H10C4.48,0,0,4.48,0,10v30c0,5.52,4.48,10,10,10h30c5.52,0,10-4.48,10-10V10C50,4.48,45.52,0,40,0L40,0z"
      />
      <path className={className} d="M19.84,19.84c2.75,2.75-12.43-12.43-9.68-9.68" />
      <path className={className} d="M9.83,9.83c0,4.07,0,9.82,0,6.78" />
      <path className={className} d="M16.76,9.83c3.22,0-6.93,0-6.93,0" />
      <path className={className} d="M30.16,19.84c-2.75,2.75,12.43-12.43,9.68-9.68" />
      <path className={className} d="M40.17,9.83c0,4.07,0,9.82,0,6.78" />
      <path className={className} d="M33.24,9.83c-3.22,0,6.93,0,6.93,0" />
      <path className={className} d="M19.84,30.16c2.75-2.75-12.43,12.43-9.68,9.68" />
      <path className={className} d="M9.83,40.17c0-4.07,0-9.82,0-6.78" />
      <path className={className} d="M16.76,40.17c3.22,0-6.93,0-6.93,0" />
      <path className={className} d="M30.16,30.16c-2.75-2.75,12.43,12.43,9.68,9.68" />
      <path className={className} d="M40.17,40.17c0-4.07,0-9.82,0-6.78" />
      <path className={className} d="M33.24,40.17c-3.22,0,6.93,0,6.93,0" />
    </svg>
  );
}
export default SizeLogo;
