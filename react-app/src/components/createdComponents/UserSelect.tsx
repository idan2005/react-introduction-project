import React, { useState, useEffect } from 'react';
import { UserUtils, User } from '../../Services/UserService';

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

const UserSelect = ({ 
  value, 
  onChange, 
  error, 
  label = "Select User",
  placeholder = "Select User" 
}: UserSelectProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await UserUtils.getAllUsers();
        if (result.success && result.data) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {isLoadingUsers ? (
        <div className="text-sm text-gray-500">Loading users...</div>
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {users.map((user) => (
            <option key={user.id || user.name} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      )}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default UserSelect;