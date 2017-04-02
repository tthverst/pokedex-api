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
			f2sp: function (text) {
				return text.replace(/([^>\f]?)(\f)/g, '$1 $2');
			},
			pluralise: function (array, text) {
				if (array.length > 1) {
					return text + "s";
				}

				return text;
			},
			json: function (content) {
				return JSON.stringify(content);
			},
			selected: function (value) {
				if(value === this.role) {
					return "selected";
				}
				
				return "";
			}
		}
	});
}

module.exports = hbsHelpers;