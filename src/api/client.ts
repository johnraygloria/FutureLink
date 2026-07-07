export type { Principal } from './principal';
export {
  fetchPrincipals as fetchClients,
  createPrincipal as createClient,
  deletePrincipal as deleteClient,
  initDefaultPrincipals as initDefaultClients,
} from './principal';

export type Client = import('./principal').Principal;
