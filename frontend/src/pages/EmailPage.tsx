import React, { useState } from 'react';
import { useCV } from '../contexts/CVContext';
import { ArrowLeft, Mail, Send, Users, FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const EmailPage: React.FC = () => {
  const { cvs } = useCV();
  const [emailData, setEmailData] = useState({
    recipients: '',
    subject: 'Approved CV Candidates - OGTL',
    message: 'Please find attached the approved CV candidates for your review.',
    includeAttachments: true
  });
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Get approved CVs
  const approvedCVs = cvs.filter(cv => cv.status === 'approved');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEmailData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData(prev => ({
      ...prev,
      includeAttachments: e.target.checked
    }));
  };

  const handleSendEmail = async () => {
    if (!emailData.recipients.trim()) {
      alert('Please enter recipient email addresses');
      return;
    }

    if (approvedCVs.length === 0) {
      alert('No approved CVs to send');
      return;
    }

    setIsSending(true);
    setSendStatus('idle');

    try {
      await api.post('email/send-approved-cvs', {
        recipients: emailData.recipients.split(',').map(email => email.trim()),
        subject: emailData.subject,
        message: emailData.message,
        includeAttachments: emailData.includeAttachments,
        cvIds: approvedCVs.map(cv => cv.id || cv._id).filter(Boolean),
      });
      setSendStatus('success');
      // Reset form after successful send
      setTimeout(() => {
        setEmailData({
          recipients: '',
          subject: 'Approved CV Candidates - OGTL',
          message: 'Please find attached the approved CV candidates for your review.',
          includeAttachments: true
        });
        setSendStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Error sending email:', error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

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
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Send Approved CVs</h1>
          </div>
          <p className="text-slate-400">
            Send approved CV candidates to stakeholders via email
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Email Details</h2>
              
              <div className="space-y-6">
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Recipients (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="recipients"
                    value={emailData.recipients}
                    onChange={handleInputChange}
                    placeholder="john@company.com, jane@company.com"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSending}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={emailData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={isSending}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={emailData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    disabled={isSending}
                  />
                </div>

                {/* Include Attachments */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="includeAttachments"
                    checked={emailData.includeAttachments}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                    disabled={isSending}
                  />
                  <label htmlFor="includeAttachments" className="text-slate-300 text-sm">
                    Include CV files as attachments
                  </label>
                </div>

                {/* Send Button */}
                <button
                  onClick={handleSendEmail}
                  disabled={isSending || approvedCVs.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Email</span>
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {sendStatus === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <p className="text-green-400 text-sm">Email sent successfully!</p>
                  </div>
                )}

                {sendStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm">Failed to send email. Please try again.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Approved CVs Summary */}
          <div className="space-y-6">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Approved CVs ({approvedCVs.length})</span>
              </h3>
              
              {approvedCVs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">No approved CVs available</p>
                  <p className="text-slate-500 text-sm mt-1">
                    Approve some CVs from the dashboard first
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {approvedCVs.map(cv => (
                    <div key={cv.id} className="bg-slate-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium text-sm">{cv.candidateName}</p>
                          <p className="text-slate-400 text-xs">{cv.position}</p>
                        </div>
                        <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                          Approved
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <h4 className="text-lg font-semibold text-white mb-4">Email Preview</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-400">To:</span>
                  <p className="text-white">{emailData.recipients || 'No recipients'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Subject:</span>
                  <p className="text-white">{emailData.subject}</p>
                </div>
                <div>
                  <span className="text-slate-400">Attachments:</span>
                  <p className="text-white">
                    {emailData.includeAttachments ? `${approvedCVs.length} CV files` : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPage;