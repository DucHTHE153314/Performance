const moment = require('moment');
const ap = {
	word: {
		prefix: (origin, pre) => {
			if (!pre || !origin) {
				return false;
			}
			if (origin.substring(0, pre.length) == pre) {
				return true;
			}
			return false;
		},
		isUrl: (url) => {

			if (ap.word.prefix(url, 'http:') || ap.word.prefix(url, 'https:')) {
				return true;
			}

			return false;
		},
		rand: (len) => {
			var text = "";
			var possible = "abcdefghjklmnpqrstuvwxyz";

			for (var i = 0; i < len; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			return text;
		}
	},
	date: {
		format: (date) => {
			let formattedDate;
			// date = "Present", "2018", "Dec 2018"
			if (date === 'Present') {
				formattedDate = moment().format();
			} else {
				formattedDate = moment(date, 'MMMY').format();
			}

			return formattedDate;
		},
		duration: (start, end) => {
			if (!start || !end) return null
			// +1 to include the start date
			return moment(end).diff(moment(start), 'days') + 1
		}
	},
	text: {
		clean: async (text) => {
			const regexRemoveMultipleSpaces = / +/g;
			const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm;

			if (!text) return null;

			const cleanText = text
				.replace(regexRemoveLineBreaks, '')
				.replace(regexRemoveMultipleSpaces, ' ')
				.replace('...', '')
				.replace('See more', '')
				.replace('See less', '')
				.trim();

			return cleanText;
		}
	},
	array: {
		merge: (...arguments) => {
			var r = [];
			for (var i = 0; i < arguments.length; i++) {
				for (var j = 0; j < arguments[i].length; j++) {
					r.push(arguments[i][j]);
				}
			}
			return r;
		}
	}
};

module.exports = ap;