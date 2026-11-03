import { useState } from 'react';

export default function AnimatedLink({ children, className = '', ...props }) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e) => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 200);
    props.onClick?.(e);
  };

  return (
    <a
      {...props}
      onClick={handleClick}
      className={`relative transition-all duration-300 ease-out ${animating ? 'scale-90 opacity-70' : 'hover:scale-105 hover:shadow-xl'} ${className}`}
    >
      {children}
    </a>
  );
}
