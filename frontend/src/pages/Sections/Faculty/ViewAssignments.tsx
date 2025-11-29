import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../../App';

const ViewAssignments: React.FC = () => {
  console.log('🚀 ViewAssignmentsSimpleWorking component mounted!');
  
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAssignments, setExpandedAssignments] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('🔧 useEffect triggered');
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      console.log('🔍 Starting fetch...');
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }
      
      console.log('📤 Making request...');
      const response = await axios.get(`${backendUrl}/api/assignment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📦 Response received:', response.data);
      setAssignments(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (assignmentId: string) => {
    const newExpanded = new Set(expandedAssignments);
    if (newExpanded.has(assignmentId)) {
      newExpanded.delete(assignmentId);
    } else {
      newExpanded.add(assignmentId);
    }
    setExpandedAssignments(newExpanded);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }} className="text-2xl text-center font-bold text-gray-800">View Assignments</h2>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#c62828' }}>Error: {error}</p>
          <button onClick={fetchAssignments} className={`mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto self-center`}>
            Retry
          </button>
        </div>
      )}
      
      {!loading && !error && assignments.length === 0 && (
        <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '8px' }}>
          <p>No assignments found</p>
        </div>
      )}
      
      {!loading && !error && assignments.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Assignments ({assignments.length}):</h3>
          {assignments.map((assignment) => (
            <div key={assignment._id} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div>
                  <h4>{assignment.name}</h4>
                  <p>{assignment.description}</p>
                  <p><small>Due: {new Date(assignment.duedate).toLocaleDateString()}</small></p>
                </div>
                {assignment.generatedAssignments && assignment.generatedAssignments.length > 0 && (
                  <button 
                    onClick={() => toggleExpand(assignment._id)}
                    className={`mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto self-center`}
                  >
                    {expandedAssignments.has(assignment._id) ? 'Hide Questions' : 'View Questions'}
                  </button>
                )}
              </div>
              
              {expandedAssignments.has(assignment._id) && assignment.generatedAssignments && (
                <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                  <h5 style={{ marginBottom: '10px', color: '#333' }}>Generated Questions ({assignment.generatedAssignments.length}):</h5>
                  {assignment.generatedAssignments.map((q: any, index: number) => (
                    <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong>Question {index + 1}</strong>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ backgroundColor: '#e8f5e8', color: '#2e7d32', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                            {q.points} pts
                          </span>
                          <span style={{ 
                            backgroundColor: q.difficulty === 'easy' ? '#e8f5e8' : q.difficulty === 'medium' ? '#fff3e0' : '#ffebee', 
                            color: q.difficulty === 'easy' ? '#2e7d32' : q.difficulty === 'medium' ? '#f57c00' : '#c62828', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontSize: '11px' 
                          }}>
                            {q.difficulty}
                          </span>
                          <span style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                            {q.type}
                          </span>
                        </div>
                      </div>
                      <p style={{ marginBottom: '8px', color: '#333' }}>{q.question}</p>
                      {q.hint && (
                        <p style={{ fontStyle: 'italic', color: '#666', fontSize: '12px' }}>
                          <strong>Hint:</strong> {q.hint}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAssignments;
