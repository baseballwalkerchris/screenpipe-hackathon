const statusClasses: Record<"active" | "inactive", string> = {
    active: "bg-green-100 text-green-700 border border-green-300",
    inactive: "bg-red-100 text-red-700 border border-red-300",
  };
  
  interface StatusBadgeProps {
    status: "active" | "inactive"; // ✅ Define allowed values explicitly
  }
  
  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  export default StatusBadge;
  