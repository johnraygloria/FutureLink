const {
  getPrincipals,
  createPrincipal,
  removePrincipal,
  initDefaultPrincipals,
} = require('./principalsController');

module.exports = {
  getClients: getPrincipals,
  createClient: createPrincipal,
  removeClient: removePrincipal,
  initDefaultClients: initDefaultPrincipals,
};
