const express             = require('express');
const router              = express.Router();
const logger              = require('../config/logger');

const SecurityMiddleware  = require('../helper/security.middleware');

const LoginCTRL           = require('../controller/login.controller');
const RegistrationCTRL    = require('../controller/registration.controller');
const UsersCTRL           = require('../controller/users.controller');
const ClientsCTRL         = require('../controller/clients.controller');
const ClientsAssetsCTRL   = require('../controller/clients-assets.controller');
const AgentsCTRL          = require('../controller/agents.controller');
const AssignmentsCTRL     = require('../controller/agents-assignments.controller');
const CampaignsCTRL       = require('../controller/campaigns.controller');
const CampaignsClientsCTRL= require('../controller/campaigns-clients.controller');
const CampaignsAgentsCTRL = require('../controller/campaigns-agents.controller');
const CategoriesCTRL      = require('../controller/categories.controller');
const FilesCTRL           = require('../controller/files.controller');
const FilesAssetsCTRL     = require('../controller/files-assets.controller');
const FilesReportsCTRL    = require('../controller/files-reports.controller');
const MessagesCTRL        = require('../controller/messages.controller');
const ConversationsCTRL   = require('../controller/conversations.controller');
const SysaidUsersCTRL     = require('../controller/sys-users.controller');
const SysaidSrCTRL        = require('../controller/sys-service-request.controller');
const NotificationsCTRL   = require('../controller/notifications.controller');
const LogsCTRL            = require('../controller/logs.controller');
const ReportsCTRL         = require('../controller/reports.controller');

const LoginValidator        = require('../validator/login.validator');
const RegistrationValidator = require('../validator/registration.validator');
const UsersValidator        = require('../validator/users.validator');
const AssignmentsValidator  = require('../validator/agents-assignments.validator');

const CampaignsValidator       = require('../validator/campaigns.validator');
const CampaignsClientsValidator= require('../validator/campaigns-clients.validator');
const CampaignsAgentsValidator = require('../validator/campaigns-agents.validator');

const FilesAssetsValidator     = require('../validator/files-assets.validator');
const ClientsAssetsValidator   = require('../validator/clients-assets.validator');


router.get('/api/v1/', (req, res)=>{
  res.json({'version': 1, 'name':'Clarium API'});
});

router.all('*', function(req, res, next){
  logger.info("[api] %s %s ", req.method, req.url);
  next();
});

// signin
router.post('/api/v1/login', LoginValidator.signin, LoginCTRL.signin);

// registration
router.post('/api/v1/registration', RegistrationValidator.registration, RegistrationCTRL.registration);
router.get('/api/v1/registration/campaigns', CampaignsCTRL.find);

// users
router.get('/api/v1/users', SecurityMiddleware.secureUrl, UsersCTRL.find);
router.get('/api/v1/users/count', SecurityMiddleware.secureUrl, UsersCTRL.count);
router.get('/api/v1/users/:id', SecurityMiddleware.secureUrl, UsersValidator.findById, UsersCTRL.findById);
router.post('/api/v1/users', SecurityMiddleware.secureUrl, UsersValidator.insertOne, UsersCTRL.insertOne);
router.put('/api/v1/users', SecurityMiddleware.secureUrl, UsersValidator.updateOne, UsersCTRL.updateOne);
router.delete('/api/v1/users/:id', SecurityMiddleware.secureUrl, UsersValidator.deleteOne, UsersCTRL.deleteOne);
router.post('/api/v1/password', SecurityMiddleware.secureUrl, UsersValidator.updatePassword, UsersCTRL.updatePassword);
router.put('/api/v1/password', SecurityMiddleware.secureUrl, UsersValidator.updatePassword, UsersCTRL.setPassword);

router.get('/api/v1/users/:id/reports', SecurityMiddleware.secureUrl, FilesReportsCTRL.findByUserId);

//picture
router.post('/api/v1/users/:id/picture', SecurityMiddleware.secureUrl, UsersCTRL.uploadPictue);

// Clients
router.get('/api/v1/clients', SecurityMiddleware.secureUrl, ClientsCTRL.findByQuery);
router.get('/api/v1/clients/:id/agents', SecurityMiddleware.secureUrl, AssignmentsCTRL.findAgentsByClientId);

// Clients Assets
router.get('/api/v1/clients-assets', SecurityMiddleware.secureUrl, ClientsAssetsCTRL.find);
router.post('/api/v1/clients-assets', SecurityMiddleware.secureUrl, ClientsAssetsCTRL.insertMany);
router.delete('/api/v1/clients-assets/:id', SecurityMiddleware.secureUrl,ClientsAssetsValidator.deleteOne,  ClientsAssetsCTRL.deleteOne);

router.get('/api/v1/clients/:id/assets', SecurityMiddleware.secureUrl, ClientsAssetsCTRL.findByUserId);


//Agents
router.get('/api/v1/agents', SecurityMiddleware.secureUrl, AgentsCTRL.findByQuery);
router.get('/api/v1/agents/:id/clients', SecurityMiddleware.secureUrl, AssignmentsCTRL.findClientsByAgentId);

// Assignments
router.get('/api/v1/agents-assignments/', SecurityMiddleware.secureUrl, AssignmentsCTRL.find);
router.get('/api/v1/agents-assignments/:id/clients', SecurityMiddleware.secureUrl, AssignmentsCTRL.findClientsByAgentId);
router.post('/api/v1/agents-assignments', SecurityMiddleware.secureUrl, AssignmentsValidator.insertOne,  AssignmentsCTRL.insertOne);
router.delete('/api/v1/agents-assignments/:id', SecurityMiddleware.secureUrl, AssignmentsValidator.deleteOne, AssignmentsCTRL.deleteOne);

// campaigns
router.get('/api/v1/campaigns', SecurityMiddleware.secureUrl, CampaignsCTRL.find);
router.get('/api/v1/campaigns/:id', SecurityMiddleware.secureUrl, CampaignsValidator.findById, CampaignsCTRL.findById);
router.post('/api/v1/campaigns', SecurityMiddleware.secureUrl, CampaignsValidator.insertOne, CampaignsCTRL.insertOne);
router.put('/api/v1/campaigns', SecurityMiddleware.secureUrl, CampaignsValidator.updateOne, CampaignsCTRL.updateOne);
router.delete('/api/v1/campaigns/:id', SecurityMiddleware.secureUrl, CampaignsValidator.deleteOne, CampaignsCTRL.deleteOne);

// campaigns / clients
router.get('/api/v1/campaigns-clients', SecurityMiddleware.secureUrl, CampaignsClientsCTRL.find);
router.get('/api/v1/campaigns-clients/:id', SecurityMiddleware.secureUrl, CampaignsClientsCTRL.findUsers);
router.post('/api/v1/campaigns-clients', SecurityMiddleware.secureUrl, CampaignsClientsCTRL.insertOne);
router.put('/api/v1/campaigns-clients', SecurityMiddleware.secureUrl, CampaignsClientsCTRL.insertOne);
router.delete('/api/v1/campaigns-clients/:id', SecurityMiddleware.secureUrl, CampaignsClientsCTRL.deleteOne);

// campaigns / agents
router.get('/api/v1/campaigns-agents', SecurityMiddleware.secureUrl, CampaignsAgentsCTRL.find);
router.get('/api/v1/campaigns-agents/:id', SecurityMiddleware.secureUrl, CampaignsAgentsCTRL.findAgentsByCampaign);
router.post('/api/v1/campaigns-agents', SecurityMiddleware.secureUrl, CampaignsAgentsCTRL.insertOne);
router.put('/api/v1/campaigns-agents', SecurityMiddleware.secureUrl, CampaignsAgentsCTRL.insertOne);
router.delete('/api/v1/campaigns-agents/:id', SecurityMiddleware.secureUrl, CampaignsAgentsCTRL.deleteOne);

router.get('/api/v1/agents-campaigns/:id', SecurityMiddleware.secureUrl, CampaignsAgentsCTRL.findCampaignsByAgent);


// SysaID
router.get('/api/v1/sysaid/users', SecurityMiddleware.secureUrl, SysaidUsersCTRL.find);
router.get('/api/v1/sysaid/sr',  SecurityMiddleware.secureUrl, SysaidSrCTRL.find);


// chats
router.get('/api/v1/conversations', SecurityMiddleware.secureUrl, ConversationsCTRL.find);
router.get('/api/v1/conversations/:id', SecurityMiddleware.secureUrl, ConversationsCTRL.findById);
router.post('/api/v1/conversations', SecurityMiddleware.secureUrl, ConversationsCTRL.insertOne);
router.delete('/api/v1/conversations/:id', SecurityMiddleware.secureUrl, ConversationsCTRL.deleteOne);

//
router.get('/api/v1/conversations/:id/messages/', SecurityMiddleware.secureUrl, MessagesCTRL.findByConversationId);
router.put('/api/v1/conversations/:id/messages/', SecurityMiddleware.secureUrl, MessagesCTRL.updateByConversationId);


// inbox Messages
router.get('/api/v1/messages/', SecurityMiddleware.secureUrl, MessagesCTRL.find);
router.get('/api/v1/messages/:id', SecurityMiddleware.secureUrl, MessagesCTRL.findById);
router.post('/api/v1/messages', SecurityMiddleware.secureUrl, MessagesCTRL.insertOne);
router.put('/api/v1/messages', SecurityMiddleware.secureUrl, MessagesCTRL.updateOne);
router.delete('/api/v1/messages/:id', SecurityMiddleware.secureUrl, MessagesCTRL.deleteOne);


// Categories
router.get('/api/v1/categories', SecurityMiddleware.secureUrl, CategoriesCTRL.find);
router.get('/api/v1/categories/:id', SecurityMiddleware.secureUrl,  CategoriesCTRL.findById);
router.post('/api/v1/categories', SecurityMiddleware.secureUrl, CategoriesCTRL.insertOne);
router.put('/api/v1/categories', SecurityMiddleware.secureUrl, CategoriesCTRL.updateOne);
router.delete('/api/v1/categories/:id', SecurityMiddleware.secureUrl, CategoriesCTRL.deleteOne);

// Files
router.get('/api/v1/files', SecurityMiddleware.secureUrl, FilesCTRL.find);
router.post('/api/v1/files', SecurityMiddleware.secureUrl, FilesCTRL.uploadFile);
router.post('/api/v1/files/mkdir', SecurityMiddleware.secureUrl, FilesCTRL.createDirectory);

// Files Assets
router.get('/api/v1/files/assets', SecurityMiddleware.secureUrl, FilesAssetsCTRL.find);
router.post('/api/v1/files/assets', SecurityMiddleware.secureUrl, FilesAssetsCTRL.insertOne);
router.delete('/api/v1/files/assets/:id', SecurityMiddleware.secureUrl,FilesAssetsValidator.deleteOne, FilesAssetsCTRL.deleteOne);

// Files Reports
router.get('/api/v1/files/reports', SecurityMiddleware.secureUrl, FilesReportsCTRL.find);
router.post('/api/v1/files/reports/:id', SecurityMiddleware.secureUrl, FilesReportsCTRL.insertOne);
router.delete('/api/v1/files/reports/:id', SecurityMiddleware.secureUrl, FilesReportsCTRL.deleteOne);

// Notifications
router.get('/api/v1/notifications', SecurityMiddleware.secureUrl, NotificationsCTRL.find);
router.get('/api/v1/notifications/users/:id', SecurityMiddleware.secureUrl, NotificationsCTRL.findByUserId);
router.get('/api/v1/notifications/conversations/:id', SecurityMiddleware.secureUrl, NotificationsCTRL.findByConversationId);

// Logs
router.get('/api/v1/logs', LogsCTRL.find);
router.get('/api/v1/logs/:id', SecurityMiddleware.secureUrl, LogsCTRL.findById);
router.post('/api/v1/logs', SecurityMiddleware.secureUrl, LogsCTRL.insertOne);
router.put('/api/v1/logs', SecurityMiddleware.secureUrl, LogsCTRL.updateOne);

router.get('/api/v1/reports/operations', ReportsCTRL.reportGroupByOperation);
router.get('/api/v1/reports/registrations', ReportsCTRL.reportGroupByRegistrations);
router.get('/api/v1/reports/registrations/campaign/', ReportsCTRL.reportGroupByCampaign);
router.get('/api/v1/reports/registrations/campaign/:id', ReportsCTRL.reportGroupByCampaignId);
router.get('/api/v1/reports/registrations/country/', ReportsCTRL.reportGroupByCountryCode);

router.get('/api/v1/reports/registrations/date', ReportsCTRL.reportGroupByCountryDate);
router.get('/api/v1/reports/registrations/date/day', ReportsCTRL.reportGroupByCountryDateDay);
router.get('/api/v1/reports/registrations/date/month', ReportsCTRL.reportGroupByCountryDateMonth);
router.get('/api/v1/reports/registrations/date/year', ReportsCTRL.reportGroupByCountryDateYear);


module.exports = router;
