class Logger {
	constructor() {
		this.top = 0;
	}

	print(text) {
		const p = $(`<p style="position:fixed;top:${this.top}em;font-size:.5em;z-index:100000">${text}</p>`);
		this.top++;
		$('body').prepend(p);
	}
}

class RailwayApp {
	constructor(config) {
		this.config = config;
		this.logger = new Logger();
	}

	run() {
		if (this.urlStartsWith('https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip121/query')) {
			this.step1();
		}
	}

	step1() {
		console.log(this.config);
		if (!this.config || !this.config.railway || !this.config.railway.enabled) {
			return;
		}
		const config = this.config.railway;
		$('#pid').val(config.pid);
		$('#startStation').val(config.startStation);
		$('#endStation').val(config.endStation);
		$('#rideDate1').val(config.rideDate1);
		$('#normalQty').val(config.normalQty);
		$('#trainNoList1').val(config.trainNoList1);
	}

	urlStartsWith(prefix) {
		return document.URL.startsWith(prefix);
	}
}

class TixcraftApp {
	constructor(config) {
		// TODO: Move this to config
		this.activities = ['19_SUNMI', '19_Aimer'];
		// TODO: Move this to config
		this.areaKeywords = ['A1'];
		this.config = config;
		this.logger = new Logger();
	}

	run() {
		if (!this.config.enabled) {
			return;
		}
		if (this.prefixCheck('https://tixcraft.com/activity/game/', this.activities)) {
			this.step1();
			return;
		}
		if (this.prefixCheck('https://tixcraft.com/ticket/area/', this.activities)) {
			this.step2();
			return;
		}
		if (this.prefixCheck('https://tixcraft.com/ticket/ticket/', this.activities)) {
			this.step3();
			return;
		}
		if (this.prefixCheck('https://tixcraft.com/ticket/verify/', this.activities)) {
			this.step_();
			return;
		}
	}

	step1() {
		$('.gamelist table tr input.btn').each((k, v) => {
			if ($(v).prop('value').search('立即訂購') !== -1) {
				$(v).click();
			}
		});
	}

	step2() {
		$('label[for=select_form_auto]').click();
		$('a').each((k, v) => {
			const text = $(v).text();
			// search all keywords
			for (let i = 0; i < this.areaKeywords.length; i++) {
				if (text.search(this.areaKeywords[i]) !== -1) {
					this.logger.print(this.areaKeywords[i] + ':click');
					$(v)[0].click();
					return;
				}
			}
		});
		// check if all are sold out
		const soldout = $('.area-list li').map((k, v) => {
			const text = $(v).text();
			for (let i = 0; i < this.areaKeywords.length; i++) {
				if (text.search(this.areaKeywords[i]) === -1 ) {
					continue
				}
				if (text.search('已售完') !== -1) {
					this.logger.print(text);
					return true;
				}
				return false;
			}
			return undefined;
		}).toArray().every(v => v);
		if (soldout === true) {
			// XXX: 很暴力！
			location.reload();
		}
	}

	step3() {
		$('#ticketPriceList select').val(2);
		$('label[for=TicketForm_agree]').click();
		$('input#TicketForm_verifyCode').focus();
	}

	// Step ? (Experimental)
	step_() {
		const code = $('font[color="#ff0000"]').text();
		if (code === '') {
			// If there's no code
			return;
		}
		$("input#checkCode").val(code);
		$("input#submitButton").click();
	}

	prefixCheck(prefix, activities) {
		for (let i = 0; i < activities.length; i++) {
			const activity = activities[i];
			if (document.URL.startsWith(prefix + activity)) {
				return true;
			}
		}
		return false;
	}
}

class NTUHApp {
	constructor(config) {
		this.config = config;
		this.logger = new Logger();
	}

	run () {
		// if (!this.config.enabled) {
		// 	return;
		// }
		if (this.urlStartsWith('https://reg.ntuh.gov.tw/WebAdministration/ClinicListUnderSpecificTemplateIDSE.aspx')) {
			this.step1();
			return;
		}
		if (this.urlStartsWith('https://reg.ntuh.gov.tw/WebAdministration/RegistForm.aspx')) {
			this.step2();
			return;
		}
	}

	step1() {
		$('#DoctorServiceListInSeveralDaysTemplateIDSE_GridViewDoctorServiceList tr').each((k, tr) => {
			const a = $("td > a", tr);
			if ($(a).text() === '掛號') {
				$(a)[0].click();
				return;
			}
		});
	}

	step2() {
		$('#radInputNum_1')[0].click();
		$('input#txtIdno').val('A222625997'); // A222625997

		console.log('mkfsn', $('#ddlBirthYear').val());
		$('select#ddlBirthYear option[value=1959]').prop('selected', true);
		console.log('mkfsn', $('#ddlBirthMonth').val());
		$('select#ddlBirthMonth option[value=04]').prop('selected', true);
		console.log('mkfsn', $('#ddlBirthDay').val());
		$('select#ddlBirthDay option[value=15]').prop('selected', true);

		$('#txtVerifyCode').focus();
		$('#txtVerifyCode')[0].focus();
	}

	urlStartsWith(prefix) {
		return document.URL.startsWith(prefix);
	}
}

$(function() {
	chrome.storage.sync.get(['config'], function(result) {
		// (new TixcraftApp(result.config)).run();
		// (new NTUHApp(result.config)).run();
		(new RailwayApp(result.config)).run();
	});
});
