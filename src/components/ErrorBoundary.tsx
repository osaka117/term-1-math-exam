import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Math Reviewer Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1c1b18] text-[#f4f3ef] flex items-center justify-center p-6 font-mono">
          <div className="max-w-lg w-full bg-[#252420] border-2 border-red-500 p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-3">
              <span className="text-2xl">⚠️</span> SYSTEM RUNTIME RECOVERY
            </div>
            <p className="text-sm text-[#d4d2c9] mb-4">
              An unexpected display issue occurred. You can restore default state or reload below.
            </p>
            <div className="bg-[#141412] p-3 text-xs text-red-300 font-mono rounded overflow-auto max-h-36 mb-5 border border-red-900/50">
              {this.state.error?.message || String(this.state.error)}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase cursor-pointer"
              >
                Reset Data & Reload
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 bg-[#3a3934] hover:bg-[#484741] text-[#f4f3ef] font-bold text-xs uppercase cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
