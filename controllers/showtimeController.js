const {testPage} = require("../services/showtime/methods");

const showtimeController = {};

showtimeController.processPerformance = async (req, res) => {
	try {
		const body = req.body;

		if (body.url) {

            await testPage({totalPage: body.total, waitingTime: body.timing, aliveTime: body.alive}, body.url);
			return res.json({
				status: 200,
				message: "Process user information successfully",
				body: {
				}
			});
		}
	} catch (e) {
		console.error("An error occurred:", e);
		return res.status(500).json({ error: "An error occurred" });
	}
};

module.exports = showtimeController;