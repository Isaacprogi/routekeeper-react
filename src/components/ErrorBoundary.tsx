import React, { Component, type ReactNode, ErrorInfo } from "react";
import "../styles/ErrorBoundary.css";


interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="eb-full-page">
          {/* Left Side: Human Interaction */}
          <aside className="eb-sidebar">
            <div className="eb-status-tag">System Alert</div>
            <h1 className="eb-hero-title">R-Keeper</h1>
            <p className="eb-description">
              The application encountered a critical exception. We've captured the diagnostics 
              to the right to help resolve the issue.
            </p>
            
            <div className="eb-actions">
              <button onClick={() => window.location.reload()} className="eb-btn-main">
                Refresh Interface
              </button>
              <button onClick={() => window.location.href = '/'} className="eb-btn-outline">
                Return Home
              </button>
            </div>

            <div className="eb-footer-note">
              Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
          </aside>

          {/* Right Side: Technical Data Spread */}
          <main className="eb-main-content">
            <section className="eb-section">
              <label>Exception Message</label>
              <div className="eb-message-box">
                {this.state.error?.message || "Internal Application Error"}
              </div>
            </section>

            <section className="eb-section eb-flex-grow">
              <label>Stack Diagnostics</label>
              <div className="eb-stack-container">
                <pre>{this.state.error?.stack || "No stack trace available."}</pre>
              </div>
            </section>

            <section className="eb-grid-details">
              <div className="eb-detail-item">
                <label>Environment</label>
                <span>{process.env.NODE_ENV}</span>
              </div>
              <div className="eb-detail-item">
                <label>Component Trace</label>
                <span>{this.state.errorInfo?.componentStack ? "Captured" : "N/A"}</span>
              </div>
            </section>
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}