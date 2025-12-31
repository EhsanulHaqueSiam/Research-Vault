/**
 * Error Boundary Component
 * 
 * Catch and display errors gracefully
 */

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

// ============================================
// Types
// ============================================

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
    onReset?: () => void
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

// ============================================
// Component
// ============================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        this.props.onReset?.()
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                        <AlertTriangle size={32} className="text-red-500" />
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                        Something went wrong
                    </h2>

                    <p className="text-sm text-slate-500 max-w-md mb-6">
                        An unexpected error occurred. Please try again or return to the home page.
                    </p>

                    {this.state.error && (
                        <details className="mb-6 text-left max-w-lg w-full">
                            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                                Error details
                            </summary>
                            <pre className="mt-2 p-3 text-xs bg-slate-100 dark:bg-slate-800 rounded-lg overflow-auto">
                                {this.state.error.message}
                            </pre>
                        </details>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <RotateCcw size={16} />
                            Try Again
                        </button>
                        <a
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <Home size={16} />
                            Home
                        </a>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
