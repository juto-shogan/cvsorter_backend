// src/components/FileUploader.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// Add RefreshCcw for the clear button icon
import { Upload, FileText, X, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { useCV } from '../../contexts/CVContext';
import { CV } from '../../types';

// Helper function to format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploader: React.FC = () => {
  // State to hold files selected by the user
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  // State to indicate if any file is currently being processed
  const [isProcessing, setIsProcessing] = useState(false);
  // State to track the status of each individual file by name
  const [processingStatus, setProcessingStatus] = useState<{[key: string]: 'processing' | 'success' | 'error'}>({});
  // State for general error messages related to upload
  const [error, setError] = useState<string>('');
  // Access addCV function from CVContext to update global CV state
  const { addCV } = useCV();

  // Handle file drop/selection with validation
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Clear previous general error
    setError('');

    // Filter files based on type and size
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isValidType) {
        setError(prev => prev + `File "${file.name}" has an unsupported type. Only PDF, DOC, and DOCX are allowed. `);
        return false;
      }
      if (!isValidSize) {
        setError(prev => prev + `File "${file.name}" is too large. Max size is 10MB. `);
        return false;
      }
      return true;
    });

    // Filter out duplicates based on name and size before adding
    setUploadedFiles(prev => {
      const existingFiles = prev.map(f => `${f.name}-${f.size}`);
      const newFiles = validFiles.filter(file => {
        const fileKey = `${file.name}-${file.size}`;
        return !existingFiles.includes(fileKey);
      });
      return [...prev, ...newFiles];
    });
  }, []);

  // Configure react-dropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Function to remove a file from the list
  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      const removedFileName = newFiles[index]?.name;
      newFiles.splice(index, 1);
      // Also remove its processing status
      setProcessingStatus(prevStatus => {
        const newStatus = { ...prevStatus };
        if (removedFileName) {
          delete newStatus[removedFileName];
        }
        return newStatus;
      });
      return newFiles;
    });
    setError(''); // Clear error if files are removed
  };

  // Function to clear all files from the list and their statuses
  const clearAllFiles = () => {
      setUploadedFiles([]);
      setProcessingStatus({});
      setError('');
  };

  // Function to upload files to the backend
  const uploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      setError('Please select files to upload.');
      return;
    }

    setIsProcessing(true); // Start global processing indicator
    setError(''); // Clear previous general errors

    const filesToKeepAfterUpload: File[] = []; // Files that failed will be kept in the list

    for (const file of uploadedFiles) {
      // Set individual file status to 'processing'
      setProcessingStatus(prev => ({ ...prev, [file.name]: 'processing' }));

      const formData = new FormData();
      formData.append('cv', file); // 'cv' should match the field name Multer expects

      try {
        const token = localStorage.getItem('authToken'); // Get auth token from local storage
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await fetch('http://localhost:5000/api/cvs/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' is NOT set here; browser sets it with boundary
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'File upload failed.');
        }

        const uploadedCV: CV = await response.json();
        // Set individual file status to 'success'
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'success' }));
        addCV(uploadedCV); // Add the new CV to the global context state

        // This file was successful, so we DON'T add it to filesToKeepAfterUpload
      } catch (uploadError: any) {
        console.error(`Error uploading ${file.name}:`, uploadError);
        // Set individual file status to 'error'
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'error' }));
        setError(`Failed to upload ${file.name}: ${uploadError.message}`);
        filesToKeepAfterUpload.push(file); // This file failed, so we keep it in the list
      }
    }
    // After iterating through all files, update the uploadedFiles state
    // to only include those that failed.
    setUploadedFiles(filesToKeepAfterUpload);
    setIsProcessing(false); // End global processing indicator
  };

  // Get appropriate icon based on file processing status
  const getStatusIcon = (fileName: string) => {
    const status = processingStatus[fileName];
    switch (status) {
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 text-blue-500"></div>;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* File Dropzone Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-900/10' : 'border-slate-700/50 bg-slate-800/60 hover:border-blue-600/50'}
          flex flex-col items-center justify-center cursor-pointer`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-blue-400 mb-4" />
        <p className="text-lg font-medium text-white mb-2">Drag & drop CVs here, or click to browse</p>
        <p className="text-sm text-slate-400">Supported files: PDF, DOC, DOCX (Max 10MB)</p>
      </div>

      {/* Display selected/uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 space-y-4">
          <h3 className="text-lg font-semibold text-white">Files to Upload ({uploadedFiles.length})</h3>
          <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thumb-slate-600 scrollbar-track-slate-800 scrollbar-thin">
            {uploadedFiles.map((file, index) => (
              <div key={file.name + file.size + index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
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
                  {!isProcessing && ( // Only show remove button if not globally processing
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
          {/* Upload and Clear Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={uploadFiles}
              disabled={uploadedFiles.length === 0 || isProcessing}
              className="flex-grow bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing CVs...
                </>
              ) : (
                'Upload Selected CVs'
              )}
            </button>
            <button
                onClick={clearAllFiles}
                disabled={isProcessing || uploadedFiles.length === 0} // Disable if processing or no files to clear
                className="flex-shrink-0 bg-slate-700/50 hover:bg-slate-700 text-slate-300 py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                title="Clear all files from the list"
            >
                <RefreshCcw className="h-4 w-4" />
                <span>Clear List</span>
            </button>
          </div>
        </div>
      )}

      {/* Display general error messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;