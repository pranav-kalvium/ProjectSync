import React, { useState, useEffect } from "react";
import { X, Briefcase, User, CalendarDays, CheckCircle, AlertTriangle, Info, Loader2, Sparkles, Check, Trash2, RefreshCw } from "lucide-react"; 
import axios from "axios";

const CreateTaskDialog = ({ onClose, workspaceId, task = null, onTaskProcessed, defaultProjectId = null }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignee, setAssignee] = useState("");
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split("T")[0] : "2025-08-02");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  const isEditMode = Boolean(task);

  useEffect(() => {
    if (isEditMode && task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setProject(task.project?._id || task.project || "");
        setAssignee(task.assignedTo?._id || task.assignedTo || "");
        setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "2025-08-02");
        setStatus(task.status || "TODO");
        setPriority(task.priority || "MEDIUM");
    } else {
        setTitle("");
        setDescription("");
        setProject(defaultProjectId || "");
        setAssignee("");
        setDueDate("");
        setStatus("TODO");
        setPriority("MEDIUM");
    }
  }, [task, isEditMode, defaultProjectId]);

  useEffect(() => {
    if (!workspaceId) {
      setErrorMessage("Workspace ID is not available.");
      return;
    }
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/project/workspace/${workspaceId}/all`,
        );
        setProjects(response.data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setErrorMessage("Failed to load projects. Please ensure projects exist.");
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [workspaceId]);

  useEffect(() => {
    if (!workspaceId) {
      setErrorMessage("Workspace ID is not available.");
      return;
    }
    const fetchMembers = async () => {
      setLoadingMembers(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/workspace/members/${workspaceId}`,
        );
        setMembers(response.data.members || []);
      } catch (error) {
        console.error("Error fetching members:", error);
        setErrorMessage("Failed to load members. Please ensure members exist.");
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [workspaceId]);

  const handleGenerateDescription = async () => {
    if (!title) {
        setErrorMessage("Please provide a task title before generating a description.");
        return;
    }
    setErrorMessage(""); 
    setIsGenerating(true);
    setAiSuggestion(""); 
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/ai/generate-task-description`, {
            title,
        });
        setAiSuggestion(data.description);
    } catch (error) {
        console.error("AI Generation Failed:", error);
        setErrorMessage("Failed to generate AI description. Please try again.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title || !description || !project || !assignee || !dueDate || !status || !priority) {
      setErrorMessage("All fields marked with * are required.");
      return;
    }

    if (!workspaceId) {
      setErrorMessage("Workspace ID is not available.");
      return;
    }

    setIsSubmitting(true);
    const taskData = {
      title,
      description,
      project,
      assignedTo: assignee,
      dueDate,
      status,
      priority,
    };

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/task/${task._id}/project/${project}/workspace/${workspaceId}/update`,
          taskData,
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/task/project/${project}/workspace/${workspaceId}/create`,
          taskData,
        );
      }
      
      if (onTaskProcessed) {
        onTaskProcessed(response.data.task || response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error processing task:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || (isEditMode ? "Failed to update task." : "Failed to create task.");
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const FieldLabel = ({ htmlFor, children, required = false }) => (
    <label htmlFor={htmlFor} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                {isEditMode ? "Update Task" : "Create New Task"}
            </h1>
            <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X size={20} />
            </button>
        </div>

        <form className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1" onSubmit={handleSubmit} id="task-form">
            {errorMessage && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertTriangle size={18} /> {errorMessage}
            </div>
            )}
            <div>
            <FieldLabel htmlFor="title" required>Task Title</FieldLabel>
            <input
              id="title" type="text"
              className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g., Develop new landing page"
              value={title} onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
                <FieldLabel htmlFor="description" required>Task Description</FieldLabel>
                <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !title}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating && !aiSuggestion ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <Sparkles size={14} className="text-purple-500" />
                    )}
                    {isGenerating && !aiSuggestion ? "Generating..." : "Generate with AI"}
                </button>
            </div>

            {aiSuggestion && (
                <div className="mt-2 p-3 border border-purple-200 bg-purple-50 rounded-lg">
                    <p className="text-xs font-semibold text-purple-800 mb-2">AI Suggestion:</p>
                    <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 whitespace-pre-wrap">
                        {aiSuggestion}
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => setAiSuggestion("")}
                            disabled={isGenerating}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 disabled:opacity-50"
                        >
                            <Trash2 size={14}/> Discard
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={isGenerating}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
                        >
                            {isGenerating ? <Loader2 size={14} className="animate-spin"/> : <RefreshCw size={14}/>}
                            Regenerate
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setDescription(aiSuggestion);
                                setAiSuggestion("");
                            }}
                            disabled={isGenerating}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50"
                        >
                            <Check size={14}/> Apply
                        </button>
                    </div>
                </div>
            )}

            <textarea
              id="description"
              className="mt-2 flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Provide a detailed description of the task..."
              value={description} onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <FieldLabel htmlFor="project" required>Project</FieldLabel>
              <select id="project" value={project} onChange={(e) => setProject(e.target.value)} disabled={loadingProjects || isEditMode || defaultProjectId}
                className="mt-1 flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="" disabled>{loadingProjects ? "Loading projects..." : "Select a project"}</option>
                {!loadingProjects && projects.length === 0 && <option value="" disabled>No projects available</option>}
                {projects.map((proj) => (
                  <option key={proj._id} value={proj._id}>{proj.name || `Project ${proj._id.slice(-5)}`}</option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel htmlFor="assignee" required>Assigned To</FieldLabel>
              <select id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)} disabled={loadingMembers}
                className="mt-1 flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="" disabled>{loadingMembers ? "Loading members..." : "Select an assignee"}</option>
                {!loadingMembers && members.length === 0 && <option value="" disabled>No members available</option>}
                {members.map((member) => (
                  <option key={member.userId._id} value={member.userId._id}>{member.userId.name || member.userId.username}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-5">
            <div>
              <FieldLabel htmlFor="dueDate" required>Due Date</FieldLabel>
              <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 flex h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <FieldLabel htmlFor="status" required>Status</FieldLabel>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                className="mt-1 flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="BACKLOG">Backlog</option>
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="priority" required>Priority</FieldLabel>
              <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}
                className="mt-1 flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
              </select>
            </div>
          </div>
        </form>

        <div className="flex justify-end space-x-3 p-5 border-t border-gray-200 mt-auto">
            <button type="button" onClick={onClose}
            className="px-4 h-10 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors">
            Cancel
          </button>
          <button type="submit" form="task-form"
            className="px-5 h-10 bg-black text-white rounded-lg hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            disabled={isSubmitting || loadingProjects || loadingMembers}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (isEditMode ? "Save Changes" : "Create Task")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskDialog;