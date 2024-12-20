interface IProps {
  className: string;
}
function MonochromeThemeLogo({ className }: IProps) {
  return (
    <svg className={className} viewBox="0 0 50 50">
      <path
        fill="var(--monochrome-theme-logo-stick2-fill)"
        filter="url(#inset-shadow)"
        d="M45.52,10.14L10.14,45.52c-1.56,1.56-4.09,1.56-5.66,0l0,0c-1.56-1.56-1.56-4.09,0-5.66L39.86,4.48
		c1.56-1.56,4.09-1.56,5.66,0l0,0C47.08,6.04,47.08,8.58,45.52,10.14z"
      />
      <path
        fill="var(--monochrome-theme-logo-stick1-fill)"
        filter="url(#inset-shadow)"
        d="M21.69,6.83L6.83,21.69c-1.56,1.56-4.09,1.56-5.66,0l0,0c-1.56-1.56-1.56-4.09,0-5.66L16.03,1.17
		c1.56-1.56,4.09-1.56,5.66,0l0,0C23.25,2.73,23.25,5.27,21.69,6.83z"
      />
      <path
        fill="var(--monochrome-theme-logo-stick3-fill)"
        filter="url(#inset-shadow)"
        d="M48.83,33.97L33.97,48.83c-1.56,1.56-4.09,1.56-5.66,0l0,0c-1.56-1.56-1.56-4.09,0-5.66l14.86-14.86
		c1.56-1.56,4.09-1.56,5.66,0l0,0C50.39,29.87,50.39,32.4,48.83,33.97z"
      />
    </svg>
  );
}
export default MonochromeThemeLogo;
