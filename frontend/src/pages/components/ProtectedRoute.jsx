import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem("user");

    if (!user) {
        // Redirect to login if no user is found in localStorage
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
