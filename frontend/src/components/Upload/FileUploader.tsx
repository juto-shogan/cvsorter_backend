// src/components/Upload/FileUploader.tsx

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, FolderOpen, CheckCircle, XCircle } from 'lucide-react';
import { useCV } from '../../contexts/CVContext';
import { CV } from '../../types';
import api from '../../services/api'; // Import the new API service

const FileUploader: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({});
  const [error, setError] = useState<string>('');
  const { refreshStats } = useCV(); // Use refreshStats from CVContext
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  // Helper to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle file drop/selection with validation
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(''); // Clear previous errors
    const newFiles = acceptedFiles.map(file => {
      const isValidType = file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isValidType) {
        setError(prev => prev + `\n- ${file.name}: Invalid file type. Only PDF, DOC, DOCX allowed.`);
        return null;
      }
      if (!isValidSize) {
        setError(prev => prev + `\n- ${file.name}: File size exceeds 10MB limit.`);
        return null;
      }
      return file;
    }).filter(Boolean) as File[]; // Filter out nulls

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      newFiles.forEach(file => setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' })));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Remove a file from the list
  const removeFile = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    // Also remove its status and progress
    const fileToRemove = uploadedFiles[indexToRemove];
    if (fileToRemove) {
      setUploadStatus(prev => {
        const newState = { ...prev };
        delete newState[fileToRemove.name];
        return newState;
      });
      setUploadProgress(prev => {
        const newState = { ...prev };
        delete newState[fileToRemove.name];
        return newState;
      });
    }
  };

  // Handle the actual upload process
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setIsUploading(true);
    setError(''); // Clear errors before new upload

    const uploadPromises = uploadedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('cv', file); // must match backend field name

      try {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'pending' }));
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Use the api.post method for file upload
        // The api service automatically handles token and base URL
        const uploadedCV = await api.post<{ cv: CV }>('cvs/upload', formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
            }
          },
        });

        // After successful upload, update the status and trigger CV refresh
        setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        return uploadedCV.cv;
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setError(prev => prev + `\n- Failed to upload ${file.name}.`);
        return null;
      }
    });

    await Promise.all(uploadPromises);
    setIsUploading(false);
    setUploadedFiles([]); // Clear files after attempt
    refreshStats(); // Refresh CV list and dashboard stats after all uploads
  };

  // Get icon based on upload status
  const getStatusIcon = (fileName: string) => {
    const status = uploadStatus[fileName];
    const progress = uploadProgress[fileName] || 0;

    if (status === 'success') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === 'error') {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else if (status === 'pending' && isUploading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-blue-400">{progress}%</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Drag and drop area */}
      <div
        {...getRootProps()}
        className={`bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border-2 border-dashed ${
          isDragActive ? 'border-blue-500' : 'border-slate-700/50'
        } flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200`}
      >
        <input {...getInputProps()} />
        <div className="p-4 bg-blue-500/20 rounded-full mb-4">
          <FolderOpen className="h-8 w-8 text-blue-400" />
        </div>
        <p className="text-white font-semibold text-lg mb-2">Drag & Drop CVs here</p>
        <p className="text-slate-400 text-sm mb-4">
          or <span className="text-blue-400 font-medium">click to browse</span> (PDF, DOC, DOCX up to 10MB)
        </p>
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploadedFiles.length === 0 || isUploading}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span>Process Selected CVs ({uploadedFiles.length})</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm whitespace-pre-wrap">
          <p className="font-semibold mb-2 flex items-center"><XCircle className="h-5 w-5 mr-2" />Upload Errors:</p>
          <ul className="list-disc list-inside">
            {error.split('\n').filter(Boolean).map((msg, index) => (
              <li key={index}>{msg.trim().replace(/^- /, '')}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display selected files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Selected Files:</h3>
          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.name} // Using file.name as key, assuming unique names for now or add unique ID
                className="flex items-center justify-between bg-slate-700/50 border border-slate-600/50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {getStatusIcon(file.name)}
                  {!isUploading && uploadStatus[file.name] === 'pending' && ( // Allow removing only if not currently uploading
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-red-500/10"
                      title="Remove file"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;