import React from 'react';

const ViewAssignmentsSimple: React.FC = () => {
  console.log('🚀 ViewAssignmentsSimple component mounted!');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Assignments (Simple Version)</h1>
      <div className="bg-white p-4 rounded shadow">
        <p>This is a simple test component to verify rendering works.</p>
        <p>If you can see this, the routing is working correctly.</p>
        <p>The issue might be with the main ViewAssignments component.</p>
      </div>
    </div>
  );
};

export default ViewAssignmentsSimple;
