import React from 'react'

interface ProjectProps {
  title?: string;
  description?: string;
  owner?: string;
}

const Project = ({ 
  title = "Sample Project", 
  description = "This is a sample project description.", 
  owner = "John Doe" 
}: ProjectProps) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-2">Project Title: {title}</h2>
      <p className="text-gray-700 mb-1">Project Description: {description}</p>
      <p className="text-gray-600">Project Owner: {owner}</p>
    </>
  )
}

export default Project