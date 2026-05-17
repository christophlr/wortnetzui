import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';
import i18n from '../i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-6 bg-zinc-50 rounded-xl border-2 border-dashed border-zinc-200 m-4">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">{i18n.t('common.error.title')}</h2>
            <p className="text-zinc-500 max-w-md mx-auto">
              {i18n.t('common.error.body')}
              {this.state.error?.message.includes('limit') ? (
                <span className="block mt-2 font-medium text-amber-600">
                  {i18n.t('common.error.webglTip')}
                </span>
              ) : (
                i18n.t('common.error.bodyFallback')
              )}
            </p>
          </div>

          <div className="p-4 bg-zinc-100 rounded-lg text-left overflow-auto max-w-2xl w-full">
            <code className="text-xs text-zinc-600 break-all">
              {this.state.error?.toString()}
            </code>
          </div>

          <Button
            onClick={this.handleReset}
            className="gap-2 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <RefreshCcw className="w-4 h-4" />
            {i18n.t('common.error.reload')}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
