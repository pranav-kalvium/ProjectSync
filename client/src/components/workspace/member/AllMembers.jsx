import { ChevronDown, Loader } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

const AllMembers = () => {
  // Mock data (replace with real data from useGetWorkspaceMembers)
  const members = [
    { userId: { name: "John Doe", email: "john@example.com", _id: "1" }, role: { name: "Admin" } },
    { userId: { name: "Jane Smith", email: "jane@example.com", _id: "2" }, role: { name: "Member" } },
  ];
  const user = { _id: "1" }; // Mock current user
  const canChangeMemberRole = true; // Mock permission

  return (
    <div className="grid gap-6 pt-2">
      {members.map((member) => {
        const initials = member.userId.name
          .split(" ")
          .map((n) => n.charAt(0))
          .join("")
          .slice(0, 2);
        const avatarColor = `bg-blue-500`; // Simplified color logic

        return (
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{member.userId.name}</p>
                <p className="text-sm text-gray-500">{member.userId.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className={`border rounded-md px-3 py-1 text-sm min-w-24 capitalize ${
                  !canChangeMemberRole || member.userId._id === user._id
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
                disabled={!canChangeMemberRole || member.userId._id === user._id}
              >
                {member.role.name.toLowerCase()}
                {(canChangeMemberRole && member.userId._id !== user._id) && (
                  <ChevronDown className="text-gray-500 ml-1 inline w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllMembers;