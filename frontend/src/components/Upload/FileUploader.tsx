import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, FolderOpen, CheckCircle } from 'lucide-react';
import { useCV } from '../../contexts/CVContext';
import { CV } from '../../types';

const FileUploader: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{[key: string]: 'success' | 'error'}>({});
  const [error, setError] = useState<string>('');
  const { addCV } = useCV();
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  // Handle file drop/selection with validation
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== acceptedFiles.length) {
      setError('Some files were rejected. Only PDF, DOC, DOCX files under 10MB are allowed.');
    } else {
      setError('');
    }
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  }, []);

  // React Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  // Manual file picker
  const handleManualUpload = () => {
    open();
  };

  // Remove file from upload queue
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setError('');
  };

  // Process files with backend integration
  const uploadFiles = async () => {
    if (uploadedFiles.length === 0) return;
    
    setIsUploading(true);
    setError('');
    
    try {
      for (const file of uploadedFiles) {
        const formData = new FormData();
        formData.append('cv', file);
        
        const token = localStorage.getItem('authToken');
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
        
        const response = await fetch('http://localhost:5000/api/cvs/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 80 }));
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to process ${file.name}`);
        }
        
        const processedCV = await response.json();
        
        // Add the processed CV to context (backend returns complete CV object)
        addCV(processedCV.cv);
        setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }
      
      // Clear uploaded files after successful processing
      setTimeout(() => {
        setUploadedFiles([]);
        setUploadStatus({});
        setUploadProgress({});
      }, 2000);
      
    } catch (error) {
      console.error('Error processing files:', error);
      setError(error instanceof Error ? error.message : 'Failed to process files');
      
      // Mark failed files
      uploadedFiles.forEach(file => {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Format file sizes
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get status icon for file
  const getStatusIcon = (fileName: string) => {
    const status = uploadStatus[fileName];
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <X className="h-4 w-4 text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with upload button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Upload CV Files</h2>
        <button
          onClick={handleManualUpload}
          disabled={isUploading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FolderOpen className="h-5 w-5" />
          <span>Browse Files</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Drag & Drop area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-600/50 bg-slate-800/30'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-colors duration-300 ${
            isDragActive ? 'bg-blue-500/20' : 'bg-slate-700/50'
          }`}>
            <Upload className={`h-8 w-8 transition-colors duration-300 ${
              isDragActive ? 'text-blue-400' : 'text-slate-400'
            }`} />
          </div>
          <div>
            <p className="text-lg font-medium text-white mb-2">
              {isDragActive ? 'Drop the files here' : 'Drag & drop CV files here'}
            </p>
            <p className="text-slate-400 text-sm">
              or use the <span className="text-blue-400 font-medium">"Browse Files"</span> button above
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Supports PDF, DOC, DOCX files up to 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload CVs'}
            </button>
          </div>
          
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50"
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
                  {!isUploading && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-red-500/10"
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

      {/* Upload indicator */}
      {isUploading && (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <p className="text-white">Uploading CVs...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;