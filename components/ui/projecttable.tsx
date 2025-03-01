import StatusBadge from "@/components/ui/statusbadge";

interface Project {
    name: string;
    status: "active" | "inactive"; // ✅ Enforce strict typing
    responses: number;
  }
  
  const projects: Project[] = [
    { name: "Project Name", status: "active", responses: 14 },
    { name: "Project Name", status: "active", responses: 14 },
    { name: "Project Name", status: "active", responses: 14 },
    { name: "Project Name", status: "inactive", responses: 14 },
  ];

const ProjectsTable = () => {
  return (
    <div className="rounded-lg overflow-hidden">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="bg-gray-800 text-white p-4 rounded-l-lg">Name</th>
            <th className="bg-gray-800 text-white p-4">Status</th>
            <th className="bg-gray-800 text-white p-4 rounded-r-lg">Responses</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td className="bg-white p-4 first:rounded-l-lg shadow-sm">{project.name}</td>
              <td className="bg-white p-4 shadow-sm"><StatusBadge status={project.status} /></td>
              <td className="bg-white p-4 last:rounded-r-lg shadow-sm">{project.responses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
