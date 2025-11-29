import React, { useState, useEffect } from 'react';
import { Button, Card, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { backendUrl } from '../../../App';

const { Title } = Typography;

interface Assignment {
  _id: string;
  name: string;
  description: string;
  duedate: string;
  keywords: string[];
  instructions: string;
  syllabus: string;
  fileUrl?: string;
  originalFileName?: string;
  createdAt: string;
  updatedAt: string;
  generatedAssignments?: any[];
  aiGenerated?: boolean;
}

const ViewAssignments: React.FC = () => {
  console.log('🚀 ViewAssignments component mounted!');
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔧 ViewAssignments useEffect triggered');
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      console.log('🔍 Fetching assignments...');
      console.log('🌐 Backend URL:', backendUrl);
      console.log('🔗 Full URL:', `${backendUrl}/api/assignment`);
      
      setError(null);
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token length:', token?.length);
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      
      console.log('📤 Making request to:', `${backendUrl}/api/assignment`);
      console.log('📤 Headers:', {
        Authorization: `Bearer ${token.substring(0, 20)}...`
      });
      
      const response = await axios.get(`${backendUrl}/api/assignment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('📦 Response status:', response.status);
      console.log('📦 Response headers:', response.headers);
      console.log('📦 Response data:', response.data);
      
      if (response.data.success) {
        setAssignments(response.data.data || []);
        console.log('✅ Assignments loaded successfully');
      } else {
        setError(response.data.message || 'Failed to load assignments');
      }
    } catch (error: unknown) {
      console.error('❌ Error fetching assignments:', error);
      setError('Failed to load assignments');
      
      // Type-safe error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          console.error('Response headers:', error.response.headers);
          setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response from server - check if backend is running');
        } else {
          console.error('Error setup:', error.message);
          setError(`Request error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        console.error('General error:', error.message);
        setError(error.message);
      } else {
        console.error('Unknown error type:', error);
        setError('Unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0 text-gray-800">My Assignments</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => window.location.href = '/faculty/assignments/create'}
          className="flex items-center"
        >
          Create Assignment
        </Button>
      </div>
      
      <Card className="shadow-sm">
        {/* Debug info */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          Debug: loading={loading?.toString()}, assignments={assignments?.length}, error={error || 'none'}
        </div>
        
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Assignments</h3>
            <p className="text-red-500 mb-6">{error}</p>
            <Button 
              type="primary" 
              onClick={() => fetchAssignments()}
              className="flex items-center mx-auto"
            >
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading assignments...</h3>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first assignment.</p>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => window.location.href = '/faculty/assignments/create'}
              className="flex items-center mx-auto"
            >
              Create Your First Assignment
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Assignments Found!</h3>
            <p className="text-gray-500 mb-6">Found {assignments.length} assignments</p>
            <div className="text-left">
              {assignments.map((assignment) => (
                <div key={assignment._id} className="mb-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-semibold">{assignment.name}</h4>
                  <p className="text-gray-600">{assignment.description}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(assignment.duedate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ViewAssignments;