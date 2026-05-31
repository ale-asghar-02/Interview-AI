import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        // Sonner App.jsx ke andar mount hota hai
        // ErrorBoundary uske bahar hai isliye toast yahan kaam nahi karega
        // Swal bhi avoid karte hain boundary level pe
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <h2>Something went wrong.</h2>
                    <p>An unexpected error occurred. Please refresh the page.</p>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;