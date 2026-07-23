"use client";

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Key, 
  FileText, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Clock,
  Sparkles,
  ArrowRight,
  FileJson,
  Cpu,
  Info
} from 'lucide-react';

export default function Page() {
  const [apiKey, setApiKey] = useState('');
  const [sheetSyncUrl, setSheetSyncUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.6-flash');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'timeline'
  const [navTarget, setNavTarget] = useState('cross'); 
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  // Hydration-safe localStorage load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('edoofa_gemini_key') || '');
      setSheetSyncUrl(localStorage.getItem('edoofa_sheet_sync_url') || '');
    }
  }, []);

  // Save API key to localStorage when updated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (apiKey) localStorage.setItem('edoofa_gemini_key', apiKey);
      if (sheetSyncUrl) localStorage.setItem('edoofa_sheet_sync_url', sheetSyncUrl);
    }
  }, [apiKey, sheetSyncUrl]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const txtFiles = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.txt'));
      if (txtFiles.length === 0) {
        setError('Only .txt WhatsApp chat export files are supported.');
        return;
      }
      setError('');
      setFiles(prev => [...prev, ...txtFiles]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const txtFiles = Array.from(e.target.files).filter(f => f.name.endsWith('.txt'));
      if (txtFiles.length === 0) {
        setError('Only .txt WhatsApp chat export files are supported.');
        return;
      }
      setError('');
      setFiles(prev => [...prev, ...txtFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const runAudit = async () => {
    if (!apiKey) {
      setError('Please provide a valid Gemini API Key to run the analysis.');
      return;
    }
    if (files.length === 0) {
      setError('Please upload at least one WhatsApp chat file (.txt).');
      return;
    }

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    files.forEach(f => formData.append('chats', f));
    formData.append('apiKey', apiKey);
    formData.append('model', selectedModel);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'x-model': selectedModel
        },
        body: formData
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to complete analysis.');
      }

      setAuditData(result);
      
      // Default navigation target
      if (result.crossStudentPatterns) {
        setNavTarget('cross');
      } else {
        setNavTarget(0); // Go to first student
      }

      // Auto-sync to Google Sheet if URL is configured
      if (sheetSyncUrl) {
        syncToGoogleSheets(result);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during auditing.');
    } finally {
      setLoading(false);
    }
  };

  const syncToGoogleSheets = async (dataToSync = auditData) => {
    if (!sheetSyncUrl) {
      setError('Please configure a Google Sheets Apps Script Web App URL first.');
      return;
    }
    if (!dataToSync) return;

    setSyncingSheets(true);
    setSyncStatus('Syncing findings to Google Sheet...');
    
    try {
      await fetch(sheetSyncUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSync)
      });
      setSyncStatus('Successfully synced to Google Sheets!');
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (err) {
      console.error(err);
      setSyncStatus('Sync failed. Please verify your Apps Script URL.');
      setTimeout(() => setSyncStatus(''), 5000);
    } finally {
      setSyncingSheets(false);
    }
  };

  const resetUpload = () => {
    setAuditData(null);
    setFiles([]);
    setError('');
  };

  const exportJSON = () => {
    if (!auditData) return;
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edoofa_audit_report_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityClass = (score) => {
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  const getRiskLabel = (score) => {
    if (score >= 8) return 'Critical';
    if (score >= 6) return 'High';
    if (score >= 4) return 'Medium';
    return 'Low Risk';
  };

  const activeStudentReport = typeof navTarget === 'number' ? auditData?.individualReports[navTarget] : null;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div className="logo-section">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-accentNeon bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles size={28} className="text-accentNeon" />
            Edoofa Audit Engine
          </h1>
          <p className="text-textSecondary text-sm mt-1">Conversational compliance & counseling quality auditor</p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          {/* Model Selector */}
          <div className="flex items-center gap-2 bg-bgSecondary border border-white/10 px-3 py-2 rounded-xl">
            <Cpu size={16} className="text-textSecondary" />
            <select 
              className="bg-transparent text-sm text-textPrimary outline-none cursor-pointer"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gemini-3.6-flash" className="bg-bgSecondary">gemini-3.6-flash</option>
              <option value="gemini-3.5-flash-lite" className="bg-bgSecondary">gemini-3.5-flash-lite</option>
              <option value="gemini-3.1-pro" className="bg-bgSecondary">gemini-3.1-pro</option>
              <option value="gemini-1.5-flash" className="bg-bgSecondary">gemini-1.5-flash</option>
              <option value="gemini-1.5-pro" className="bg-bgSecondary">gemini-1.5-pro</option>
            </select>
          </div>

          {/* Key Input */}
          <div className="api-config-bar">
            <Key size={16} className="text-textSecondary" />
            <input 
              type="password" 
              placeholder="Enter Gemini API Key..." 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
            />
            <div className={`api-status-dot ${apiKey ? 'active' : ''}`} title={apiKey ? 'API Key Loaded' : 'No API Key'} />
          </div>

          {/* Sheets Sync Input */}
          <div className="api-config-bar">
            <FileText size={16} className="text-textSecondary" />
            <input 
              type="text" 
              placeholder="Google Sheets Sync URL (Apps Script)..." 
              value={sheetSyncUrl} 
              onChange={(e) => setSheetSyncUrl(e.target.value)}
              className="text-xs"
              style={{ width: '220px' }}
            />
            <div className={`api-status-dot ${sheetSyncUrl ? 'active' : ''}`} title={sheetSyncUrl ? 'Sheets Sync Configured' : 'No Sheets Sync URL'} />
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-critical rounded-xl px-6 py-4 mb-8 text-sm">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {/* 1. Welcome / File Upload Zone */}
      {!auditData && !loading && (
        <div className="upload-container">
          <div className="welcome-card">
            <h2>WhatsApp Chat Auditor</h2>
            <p>
              Upload exported counselor-student WhatsApp chat histories (.txt files) to audit conversations against the Edoofa CICR framework. Identify hidden fees, promise discrepancies, off-hours pressure, and tone shifts.
            </p>

            <div 
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input 
                type="file" 
                id="file-upload" 
                multiple 
                accept=".txt" 
                style={{ display: 'none' }} 
                onChange={handleFileSelect}
              />
              <Upload size={48} className="dropzone-icon" />
              <span className="dropzone-text">Drag & Drop WhatsApp exported files here</span>
              <span className="dropzone-subtext">or click to browse local files (supports multiple chats)</span>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <div className="selected-files-list">
                  {files.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <div className="file-info">
                        <FileText size={16} className="text-textSecondary" />
                        <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button className="remove-file-btn" onClick={(e) => { e.stopPropagation(); removeFile(idx); }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="btn btn-primary" onClick={runAudit}>
                    Start Compliance Audit
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <h2 className="text-xl font-semibold">Analyzing Conversational Dynamics...</h2>
          <p className="text-textSecondary text-sm">
            Parsing chat structure and running LLM audit across the CICR framework.
          </p>
        </div>
      )}

      {/* 3. Main Audit Dashboard */}
      {auditData && !loading && (
        <div className="dashboard-grid">
          {/* Sidebar */}
          <aside className="sidebar-panel">
            <div>
              <span className="sidebar-title">Audit Navigator</span>
            </div>

            <div className="student-list">
              {auditData.crossStudentPatterns && (
                <button 
                  className={`student-btn ${navTarget === 'cross' ? 'active' : ''}`}
                  onClick={() => setNavTarget('cross')}
                >
                  <span className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    Systemic Patterns
                  </span>
                </button>
              )}

              {auditData.individualReports.map((report, idx) => {
                let riskClass = 'low';
                let riskLabel = 'Low Risk';
                if (report.error) {
                  riskClass = 'critical';
                  riskLabel = 'Error';
                } else if (report.metrics) {
                  const maxScore = Math.max(...Object.values(report.metrics).map(m => m.score || 1));
                  riskClass = getSeverityClass(maxScore);
                  riskLabel = getRiskLabel(maxScore);
                }

                return (
                  <button 
                    key={idx} 
                    className={`student-btn ${navTarget === idx ? 'active' : ''} ${report.error ? 'border-l-4 border-critical' : ''}`}
                    onClick={() => {
                      setNavTarget(idx);
                      setActiveTab('summary');
                    }}
                  >
                    <span>{report.studentName}</span>
                    <span className={`badge-risk ${riskClass}`}>{riskLabel}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
              {sheetSyncUrl && (
                <button 
                  className="btn flex items-center justify-center gap-2 btn-primary" 
                  disabled={syncingSheets}
                  onClick={() => syncToGoogleSheets()}
                >
                  <FileText size={16} />
                  {syncingSheets ? 'Syncing...' : 'Sync to Google Sheets'}
                </button>
              )}
              {syncStatus && (
                <div className="text-[11px] text-center text-accentNeon font-medium px-2 py-1 bg-accentNeon/5 border border-accentNeon/20 rounded-lg animate-pulse">
                  {syncStatus}
                </div>
              )}
              <button className="btn flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', color: 'white' }} onClick={exportJSON}>
                <FileJson size={16} />
                Export Audit Data
              </button>
              <button className="btn flex items-center justify-center gap-2" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)' }} onClick={resetUpload}>
                Upload New Chats
              </button>
            </div>
          </aside>

          {/* Main Dashboard Panel */}
          <main className="main-panel">
            {/* View A: Cross Student Analysis */}
            {navTarget === 'cross' && auditData.crossStudentPatterns && (
              <>
                <div className="cross-student-banner">
                  <h3>
                    <TrendingUp size={20} />
                    Systemic Pattern Analysis
                  </h3>
                  <p>
                    Aggregated insights findings across all {auditData.individualReports.length} uploaded student chats. This highlights recurring pressure points and compliance discrepancies.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                  <div className="systemic-grid">
                    {auditData.crossStudentPatterns.systemicPatterns?.map((pattern, idx) => (
                      <div key={idx} className="systemic-pattern-card mb-6">
                        <h4>
                          <AlertTriangle size={18} className="text-warningHigh" />
                          {pattern.patternName}
                        </h4>
                        <div className="flex gap-4 my-3">
                          <span className="badge-risk high">
                            Frequency: {pattern.frequency}
                          </span>
                        </div>
                        <p className="text-textSecondary leading-relaxed text-sm mb-4">
                          <strong>Impact:</strong> {pattern.impact}
                        </p>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-sm text-textSecondary">
                          <strong>Evidence:</strong> {pattern.evidenceSummary}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="metric-card p-8 border-l-4 border-critical">
                      <span className="sidebar-title">Brand Reputation Risk</span>
                      <h2 className="metric-score critical text-4xl font-extrabold my-2">
                        {auditData.crossStudentPatterns.brandReputationRisk}
                      </h2>
                      <p className="text-xs text-textSecondary">
                        Collective operational and compliance risk to Edoofa's market alignment and ethical standards.
                      </p>
                    </div>

                    <div className="systemic-recommendations-card">
                      <h4 className="text-lg font-bold">Actionable Recommendations</h4>
                      <ul className="mt-4 flex flex-col gap-3">
                        {auditData.crossStudentPatterns.recommendations?.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* View B: Individual Student Analysis */}
            {activeStudentReport && (
              <>
                {activeStudentReport.error ? (
                  <div className="bg-red-500/10 border border-red-500/30 text-critical rounded-xl px-6 py-6 mb-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-lg font-bold text-red-400">
                      <AlertTriangle size={24} />
                      Failed to Audit {activeStudentReport.studentName}
                    </div>
                    <p className="text-sm text-textSecondary font-mono bg-black/40 p-4 rounded border border-white/5 whitespace-pre-wrap">
                      {activeStudentReport.error}
                    </p>
                    <p className="text-xs text-textMuted">
                      Please check that your Gemini API Key is entered correctly and has permission to query the model.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header Summary */}
                    <div className="cross-student-banner bg-white/5 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-textPrimary m-0">
                          Audit Details: {activeStudentReport.studentName}
                        </h3>
                        <span className="text-xs text-textMuted">
                          Messages: {activeStudentReport.messageCount}
                        </span>
                      </div>
                      <p>{activeStudentReport.overallSummary}</p>
                    </div>

                {/* Score Grid */}
                <div className="metrics-grid">
                  {Object.entries(activeStudentReport.metrics || {}).map(([code, m]) => {
                    const sevClass = getSeverityClass(m.score);
                    return (
                      <div key={code} className="metric-card">
                        <div className="metric-card-header">
                          <span className="metric-name">{code}</span>
                          <span className={`metric-score ${sevClass}`}>{m.score}</span>
                        </div>
                        <p className="metric-desc">{m.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-4 border-b border-white/10 pb-2">
                  <button 
                    className={`btn ${activeTab === 'summary' ? 'btn-primary' : ''}`}
                    style={activeTab !== 'summary' ? { background: 'transparent', color: 'var(--text-secondary)' } : {}}
                    onClick={() => setActiveTab('summary')}
                  >
                    <BookOpen size={16} />
                    Audit Findings ({activeStudentReport.findings?.length || 0})
                  </button>
                  <button 
                    className={`btn ${activeTab === 'timeline' ? 'btn-primary' : ''}`}
                    style={activeTab !== 'timeline' ? { background: 'transparent', color: 'var(--text-secondary)' } : {}}
                    onClick={() => setActiveTab('timeline')}
                  >
                    <Clock size={16} />
                    Flagged Conversation Stream
                  </button>
                </div>

                {/* Tab Content: Findings */}
                {activeTab === 'summary' && (
                  <div className="findings-container">
                    {(!activeStudentReport.findings || activeStudentReport.findings.length === 0) ? (
                      <div className="text-center py-12 text-textMuted">
                        <CheckCircle size={40} className="text-accentNeon mx-auto mb-4" />
                        <p>No framework violations identified in this conversation.</p>
                      </div>
                    ) : (
                      activeStudentReport.findings.map((finding, idx) => {
                        const scoreMap = { 'Critical': 9, 'High': 7, 'Medium': 5, 'Low': 2 };
                        const score = scoreMap[finding.severity] || 5;
                        const sevClass = getSeverityClass(score);

                        return (
                          <div key={idx} className={`finding-card ${sevClass}`}>
                            <div className="finding-title-row">
                              <span className="finding-title">{finding.issue}</span>
                              <div className="flex gap-2">
                                <span className="metric-code">{finding.category}</span>
                                <span className={`badge-risk ${sevClass}`}>{finding.severity}</span>
                              </div>
                            </div>
                            <p className="finding-rationale">{finding.rationale}</p>
                            
                            {finding.messages && finding.messages.length > 0 && (
                              <div className="mt-4 border-l-2 border-white/10 pl-4 flex flex-col gap-2">
                                <span className="text-xs text-textMuted flex items-center gap-1">
                                  <Info size={12} />
                                  Supporting Dialogue Quotes:
                                </span>
                                {finding.messages.map((m, mIdx) => (
                                  <div key={mIdx} className="text-xs text-textSecondary">
                                    <strong>Line {m.id} ({m.sender}):</strong> <span className="italic">"{m.text}"</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Tab Content: Flagged Chat Stream */}
                {activeTab === 'timeline' && (
                  <div className="timeline-chat">
                    {activeStudentReport.messages?.map((msg) => {
                      const isFlagged = activeStudentReport.findings?.some(finding => 
                        finding.messages?.some(fm => String(fm.id) === String(msg.id))
                      );
                      const relatedFinding = isFlagged ? activeStudentReport.findings.find(finding => 
                        finding.messages?.some(fm => String(fm.id) === String(msg.id))
                      ) : null;

                      let bubbleClass = 'counselor';
                      if (msg.sender === 'System') {
                        bubbleClass = 'system';
                      } else if (msg.sender === 'Parent' || msg.sender === 'Student' || msg.sender === 'Grandmother') {
                        bubbleClass = 'client';
                      }

                      return (
                        <div 
                          key={msg.id} 
                          id={`msg-${msg.id}`}
                          className={`chat-bubble ${bubbleClass} ${isFlagged ? 'flagged' : ''}`}
                        >
                          {isFlagged && relatedFinding && (
                            <span className="chat-flag-indicator">
                              {relatedFinding.category} - {relatedFinding.severity}
                            </span>
                          )}

                          <div className="chat-meta">
                            <span className="chat-sender">{msg.sender}</span>
                            <span>{msg.date} {msg.time}</span>
                          </div>

                          <div className="chat-text">
                            {msg.text}
                          </div>
                          
                          <div className="absolute bottom-1 right-2 text-[10px] text-textMuted">
                            #{msg.id}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
