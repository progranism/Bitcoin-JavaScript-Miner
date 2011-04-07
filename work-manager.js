function begin_mining()
{
	var job = get_work();
	job.start_date = new Date().getTime();

	var worker = new Worker("miner.js");
	worker.onmessage = onWorkerMessage;
	worker.onerror = onWorkerError;
	worker.postMessage(job);
}

function onWorkerMessage(event) {
	var job = event.data;

	// We've got a Golden Ticket!!!
	if(job.golden_ticket !== false) {
		$('#golden-ticket').val(job.golden_ticket);

		// TODO: Submit Work
	}
	else {
		// :'( it was just an update
		var total_time = (new Date().getTime()) - job.start_date;
		var hashes_per_second = job.total_hashes * 1000 / total_time;
		$('#total-hashes').val(job.total_hashes);
		$('#hashes-per-second').val(hashes_per_second);
	}
}

function onWorkerError(event) {
	throw event.data;
}


function get_work()
{
	var workrequest = "{\"method\": \"getwork\", \"params\": \[\], \"id\":0}\r\n";
	var response = "{\"result\":{\"midstate\":\"fd8c924ed9a07c7d6dd49c1079429142d94cf99d6bb978e123190d5
2fbf8ef6f\",\"data\":\"0000000116237c0c0d1baffc50d4bf2a19bf5bc6fbf381c26bac4a0a0000db4\
0000000008108b0619305607e7f04634ffe7ef35294970d5656694c6b7a0ef3b07b87e9ac4d8d90321b00\
f3390000000000000080000000000000000000000000000000000000000000000000000000000000000000\
0000000000000080020000\",\"hash1\":\"000000000000000000000000000000000000\
00000000000000000000000000000000008000000000000000000000000000000000000000000000\
000000010000\",\"target\":\"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\
00000000\"},\"error\":null,\"id\":0}";

	var response = JSON.parse(response)
	var job = {};

	job.midstate = hexstring_to_binary(response.result.midstate);
	job.data = hexstring_to_binary(response.result.data);
	job.hash1 = hexstring_to_binary(response.result.hash1);
	job.target = hexstring_to_binary(response.result.target);

	// Remove the first 512-bits of data, since they aren't used
	// in calculating hashes.
	job.data = job.data.slice(16);

	return job
}

// Given a hex string, returns an array of 32-bit integers
// Data is assumed to be stored least-significant byte first (in the string)
function hexstring_to_binary(str)
{
	var result = new Array();

	for(var i = 0; i < str.length; i += 8) {
		var number = 0x00000000;
		
		for(var j = 0; j < 4; ++j) {
			number = safe_add(number, hex_to_byte(str.substring(i + j*2, i + j*2 + 2)) << (j*8));
		}

		result.push(number);
	}

	return result;
}

function hex_to_byte(hex)
{
	return( parseInt(hex, 16));
}



