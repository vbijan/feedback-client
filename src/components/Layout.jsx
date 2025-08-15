// src/components/Layout.jsx
import { useEffect } from 'react';

// Add "export default" before your component
export default function Layout({ children, pageTitle }) {
  useEffect(() => {
    document.title = `${pageTitle} Product Feedback`;
  }, [pageTitle]);

  return <div>{children}</div>;
}