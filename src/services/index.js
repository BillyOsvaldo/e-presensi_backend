const presences = require('./presences/presences.service.js');
const users = require('./users/users.service.js');
const usersauthentication = require('./usersauthentication/usersauthentication.service.js')
const menus = require('./menus/menus.service.js')
const menusmanagement = require('./menusmanagement/menusmanagement.service.js')
const permissionsselect = require('./permissionsselect/permissionsselect.service.js')
const rolesselect = require('./rolesselect/rolesselect.service.js')
const machines = require('./machines/machines.service.js');
const machinesmanagement = require('./machinesmanagement/machinesmanagement.service.js');
const organizationsselect = require('./organizationsselect/organizationsselect.service.js');
const transactions = require('./transactions/transactions.service.js');
const machinesUsers = require('./machinesusers/machinesusers.service.js');
const machinesUsersManagement = require('./machinesusersmanagement/machinesusersmanagement.service.js');
const findUsersByOrganization = require('./find-users-by-organization/find-users-by-organization.service.js');
const findMachinesUsersByOrganization = require('./find-machines-users-by-organization/find-machines-users-by-organization.service.js');
const fingersUsers = require('./fingers-users/fingers-users.service.js');
const fingersUsersManagement = require('./fingers-users-management/fingers-users-management.service.js');
const usersForMachinesUsers = require('./usersformachinesusers/usersformachinesusers.service.js');
const absencesTypes = require('./absences-types/absences-types.service.js');
const absencesTypesManagement = require('./absencestypesmanagement/absencestypesmanagement.service.js');
const absencesTypesSelect = require('./absencestypesselect/absencestypesselect.service.js');
const absences = require('./absences/absences.service.js');
const absencesmanagement = require('./absencesmanagement/absencesmanagement.service.js');
const presencesReports = require('./presences-reports/presences-reports.service.js');
const presencesReportsSingle = require('./presences-reports-single/presences-reports-single.service.js');
const presencesToday = require('./presences-today/presences-today.service.js');
const presencesTodaySummary = require('./presences-today-summary/presences-today-summary.service.js');
const settings = require('./settings/settings.service.js');
const timesmanagement = require('./timesmanagement/timesmanagement.service.js');
const applists = require('./applists/applists.service.js');

module.exports = function (app) {
  app.configure(presences);
  app.configure(users);
  app.configure(usersauthentication)
  app.configure(menus)
  app.configure(menusmanagement)
  app.configure(permissionsselect)
  app.configure(rolesselect)
  app.configure(machines);
  app.configure(machinesmanagement);
  app.configure(organizationsselect);
  app.configure(transactions);
  app.configure(machinesUsers);
  app.configure(machinesUsersManagement);
  app.configure(findUsersByOrganization);
  app.configure(findMachinesUsersByOrganization);
  app.configure(fingersUsers);
  app.configure(fingersUsersManagement);
  app.configure(usersForMachinesUsers);
  app.configure(absencesTypes);
  app.configure(absencesTypesManagement);
  app.configure(absencesTypesSelect);
  app.configure(absences);
  app.configure(absencesmanagement);
  app.configure(presencesReports);
  app.configure(presencesReportsSingle);
  app.configure(presencesToday);
  app.configure(presencesTodaySummary);
  app.configure(settings);
  app.configure(timesmanagement);
  app.configure(applists);
};
