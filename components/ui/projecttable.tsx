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
    <div className="border border-border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Responses</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project, index) => (
            <tr key={index} className="bg-card hover:bg-gray-100 transition">
              <td className="p-4">{project.name}</td>
              <td className="p-4"><StatusBadge status={project.status} /></td>
              <td className="p-4">{project.responses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
