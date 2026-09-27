import { Navigate } from "react-router";

export const meta = () => [{ title: "Workspace access - Taskflow" }];

export default function WorkspaceCreatePage() {
  return <Navigate to="/workspace/" replace />;
}
