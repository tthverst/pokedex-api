function hbsHelpers(hbs) {
	return hbs.create({
		helpers: {
			divide: function(leftHand, rightHand, options) {
				if(parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand / rightHand);
				}

				return "NaN";
			},
			multiply: function(leftHand, rightHand, options) {
				if(parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand * rightHand);
				}

				return "NaN";
			},
			add: function(leftHand, rightHand, options) {
				if(parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand + rightHand);
				}

				return "NaN";
			},
			subtract: function(leftHand, rightHand, options) {
				if(parseInt(leftHand) && parseInt(rightHand)) {
					return (leftHand - rightHand);
				}

				return "NaN";
			},
			pad: function(character, resultLength, padChar, options) {
				var s = String(character);
				while (s.length < resultLength) {s = padChar + s;}
				return s;
			},
			nl2br: function (text, isXhtml) {
			  var breakTag = (isXhtml || typeof isXhtml === 'undefined') ? '<br />' : '<br>';
			  return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
			}
		}
	});
}

module.exports = hbsHelpers;