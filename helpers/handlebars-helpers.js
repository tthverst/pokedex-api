function hbsHelpers(hbs) {
	return hbs.create({
		helpers: {
			divide: function (leftHand, rightHand) {
				if (parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand / rightHand);
				}

				return "NaN";
			},
			multiply: function (leftHand, rightHand) {
				if (parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand * rightHand);
				}

				return "NaN";
			},
			add: function (leftHand, rightHand) {
				if (parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand + rightHand);
				}

				return "NaN";
			},
			subtract: function (leftHand, rightHand) {
				if (parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand - rightHand);
				}

				return "NaN";
			},
			pad: function (character, resultLength, padChar) {
				var s = String(character);
				while (s.length < resultLength) { s = padChar + s; }
				return s;
			},
			nl2br: function (text, isXhtml) {
				var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
				return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			},
			pluralise: function (array, text) {
				if (array.length > 1) {
					return text + "s";
				}

				return text;
			},
			// select: function (value, options) {
				// var $el = $('<select />').html(options.fn(this));
				// $el.find('[value="' + value + '"]').attr({ 'selected': 'selected' });
				// return $el.html();
			// }
		}
	});
}

module.exports = hbsHelpers;