const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/TournamentController');
const { validateUUID } = require('../middlewares/validationMiddleware');

// Define routes for tournaments
router.post('/', TournamentController.createTournament);
router.get('/', TournamentController.getTournaments);
router.post('/:id/join', validateUUID('id'), TournamentController.joinTournament);
router.post('/:id/players', validateUUID('id'), TournamentController.addPlayer);
router.put('/:id/players/:playerId/status', validateUUID('id'), validateUUID('playerId'), TournamentController.updatePlayerStatus);
router.put('/:id', validateUUID('id'), TournamentController.updateTournament);
router.delete('/:id', validateUUID('id'), TournamentController.deleteTournament);

module.exports = router;
