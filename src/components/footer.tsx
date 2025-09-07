import React from 'react'

const Footer = () => {
  return (
    <footer className="py-3 text-center text-sm text-gray-500 border-t">
      <p>© {new Date().getFullYear()} Anonymous Feed. All rights reserved.</p>
    </footer>
  );
}

export default Footer
