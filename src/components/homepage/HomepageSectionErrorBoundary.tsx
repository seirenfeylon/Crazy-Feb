import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  sectionName?: string;
  sectionId?: string;
  isAdminPreview?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class HomepageSectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[HomepageSectionErrorBoundary] Error in section ${this.props.sectionId || 'unknown'}:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.isAdminPreview) {
        return (
          <div className="my-4 p-6 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-100 text-sm md:text-base">
                  Section Rendering Error ({this.props.sectionName || this.props.sectionId})
                </h4>
                <p className="text-xs text-red-300/80 mt-1 max-w-xl font-mono">
                  {this.state.error?.message || 'An unexpected runtime error occurred while rendering this section.'}
                </p>
              </div>
            </div>
            <button
              onClick={this.handleReset}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Section
            </button>
          </div>
        );
      }

      // Live user fallback: silently hide broken section or show minimal neutral placeholder
      return null;
    }

    return this.props.children;
  }
}
