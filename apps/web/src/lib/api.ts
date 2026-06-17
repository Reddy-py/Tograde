// Local fallback type because @topgrade/shared may not be available in this package
// Adjust fields as needed to match the real shared type.
export type BootstrapPayload = any;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const fetchBootstrap = async (
  signal?: AbortSignal
)
: Promise<BootstrapPayload> => {
  const response = await fetch(`${API_BASE_URL}/bootstrap`, {
    signal
  });

  if (!response.ok) {
    throw new Error(`Failed to load CRM bootstrap data (${response.status})`);
  }

  return response.json() as Promise<BootstrapPayload>;
};
export const createStudent = async (student: any) => {
  console.log("Sending student:", student);
  const response = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(student)
  });

  if (!response.ok) {
    throw new Error("Failed to save student");
  }

  return response.json();
};

export const updateStudent = async (
  id: string,
  student: any
) => {
  const response = await fetch(
    `${API_BASE_URL}/students/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update student");
  }

  return response.json();
};

export const deleteStudent = async (id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/students/${id}`,
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }

  return response.json();
};
