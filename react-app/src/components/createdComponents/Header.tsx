import React from 'react'

interface HeaderProps {
  currentUser: string | null;
  onLogout: () => void;
}

const Header = ({ currentUser, onLogout }: HeaderProps) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <button 
        onClick={onLogout}
        className="text-blue-500 hover:underline"
      >
        ← Logout
      </button>
      {currentUser && (
        <div className="text-gray-600">
          Welcome, <span className="font-semibold">{currentUser}</span>!
        </div>
      )}
    </div>
  )
}

export default Header
