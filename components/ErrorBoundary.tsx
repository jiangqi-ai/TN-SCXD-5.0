'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error)
    console.error('Error info:', errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                  页面加载出错
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  抱歉，页面遇到了一些问题。
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-left">
                    <h3 className="text-sm font-medium text-red-800 mb-2">错误详情：</h3>
                    <pre className="text-xs text-red-700 whitespace-pre-wrap">
                      {this.state.error.message}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-red-600 whitespace-pre-wrap mt-2">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    重试
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    刷新页面
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 