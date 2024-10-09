export function ShopIcon(props: React.SVGAttributes<{}>) {
    return (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        {...props}
      >
       <circle cx="10" cy="20.5" r="1" fill="currentColor"/><circle cx="18" cy="20.5" r="1" fill="currentColor"/>
       <path 
        fill="currentColor"
        d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1"/>
      </svg>
      
    );
  }