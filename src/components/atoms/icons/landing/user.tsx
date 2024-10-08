export function User(props: React.SVGAttributes<{}>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      fill="none"
      {...props}
    >
      <path
        fill="#fff"
        fillOpacity={0.7}
        d="M43.767 51.573a1.255 1.255 0 0 0-.355.647l-1.03 5.021c-.09.443.31.833.764.745l5.147-1.005c.251-.049.482-.169.663-.346l9.03-8.81-5.19-5.063-9.029 8.811ZM62.368 39.98l-1.52-1.485a2.64 2.64 0 0 0-3.67 0l-2.747 2.682 5.19 5.063 2.747-2.68a2.495 2.495 0 0 0 0-3.58Z"
      />
      <path
        fill="#fff"
        d="M33.079 40c5.095 0 9.225-4.03 9.225-9s-4.13-9-9.225-9c-5.03 0-9.16 4.03-9.16 9s4.13 9 9.16 9Zm3.719 3.375H29.49c-6.897 0-12.49 5.463-12.49 12.192C17 56.91 18.119 58 19.498 58h20.64a2.803 2.803 0 0 1-.02-1.198l1.03-5.021c.14-.684.48-1.305.986-1.797l3.295-3.215a12.59 12.59 0 0 0-8.631-3.394Z"
      />
    </svg>
  );
}
