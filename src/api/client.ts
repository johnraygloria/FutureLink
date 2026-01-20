export interface Client {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export async function fetchClients(): Promise<Client[]> {
  const response = await fetch('/api/clients');
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  return response.json();
}

export async function createClient(name: string): Promise<Client> {
  const response = await fetch('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create client');
  }
  return response.json();
}

export async function deleteClient(id: number): Promise<void> {
  const response = await fetch(`/api/clients/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete client');
  }
}

export async function initDefaultClients(): Promise<Client[]> {
  const response = await fetch('/api/clients/init-defaults', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to initialize default clients');
  }
  const data = await response.json();
  return data.clients;
}