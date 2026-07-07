export interface Principal {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchPrincipals(): Promise<Principal[]> {
  const response = await fetch('/api/principals');
  if (!response.ok) {
    throw new Error('Failed to fetch principals');
  }
  return response.json();
}

export async function createPrincipal(name: string): Promise<Principal> {
  const response = await fetch('/api/principals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create principal');
  }
  return response.json();
}

export async function deletePrincipal(id: number): Promise<void> {
  const response = await fetch(`/api/principals/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete principal');
  }
}

export async function initDefaultPrincipals(): Promise<Principal[]> {
  const response = await fetch('/api/principals/init-defaults', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to initialize default principals');
  }
  const data = await response.json();
  return data.principals;
}
