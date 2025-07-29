import React from 'react';
import FileUploader from '../components/Upload/FileUploader';
import { ArrowLeft, Upload, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const UploadPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">OGTL CV Upload</h1>
          </div>
          <p className="text-slate-400">
            Upload multiple CV files for automated processing and analysis
          </p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <FileUploader />
        </div>

        <div className="mt-8 bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">What happens after upload?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg inline-block mb-3">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="font-medium text-white mb-2">1. Automatic Processing</h4>
              <p className="text-slate-400 text-sm">
                CVs are automatically parsed and analyzed for key information
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-500/20 p-3 rounded-lg inline-block mb-3">
                <FileText className="h-6 w-6 text-indigo-400" />
              </div>
              <h4 className="font-medium text-white mb-2">2. Data Extraction</h4>
              <p className="text-slate-400 text-sm">
                Contact details, skills, experience, and education are extracted
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg inline-block mb-3">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="font-medium text-white mb-2">3. Ready for Review</h4>
              <p className="text-slate-400 text-sm">
                CVs appear in your dashboard ready for filtering and review
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;