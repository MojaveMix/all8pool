const express = require('express');
const router = express.Router();
const TournamentController = require('../controllers/TournamentController');

// Define routes for tournaments
router.post('/', TournamentController.createTournament);
router.get('/', TournamentController.getTournaments);
router.post('/:id/join', TournamentController.joinTournament);
router.post('/:id/players', TournamentController.addPlayer);
router.put('/:id/players/:playerId/status', TournamentController.updatePlayerStatus);
router.put('/:id', TournamentController.updateTournament);
router.delete('/:id', TournamentController.deleteTournament);

module.exports = router;
