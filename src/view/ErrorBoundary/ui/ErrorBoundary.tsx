import React, {ErrorInfo, ReactNode} from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
        return { hasError: true }
    }

    componentDidCatch(error:Error, info: ErrorInfo) {
        // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
        console.log(error, info)
    }

    render() {
        const {hasError} = this.state;
        const {children} = this.props;
        if (hasError) {
            return  <>Непредвиденная ошибка</>
        }

        return children
    }
}