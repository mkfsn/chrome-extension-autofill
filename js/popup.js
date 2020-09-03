$(function() {
	// Load
	chrome.storage.sync.get(['config'], function(result) {
		console.log('Config currently is: ', result.config);
		let config = result.config.railway;
		$('#enable').prop('checked', config.enabled);
		$('#pid').val(config.pid);
		$('#startStation').val(config.startStation);
		$('#endStation').val(config.endStation);
		$('#rideDate1').val(config.rideDate1);
		$('#trainNoList1').val(config.trainNoList1);
		$('#normalQty').val(config.normalQty);
	});

	$("#save").click(e => {
		let config = {
			railway: {
				enabled: $('#enable').is(':checked'),
				pid: $('#pid').val(),
				startStation: $('#startStation').val(),
				endStation: $('#endStation').val(),
				rideDate1: $('#rideDate1').val(),
				trainNoList1: $('#trainNoList1').val(),
				normalQty: $('#normalQty').val()
			}
		};
		console.log(config);
		chrome.storage.sync.set({config: config}, function() {
		  console.log('Config is set to' + config);
		});
	});
});
