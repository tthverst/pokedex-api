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
			}
		}
	});
}

module.exports = hbsHelpers;