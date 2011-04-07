// For fun, and useful reference, this code often uses 
// strange verbage. Here is a reference:
//
// Golden Hash - A final SHA-256 hash which is less than the getwork Target.
// Golden Ticket - The nonce that gave rise to a Golden Hash.
//
// This is in reference to the classic story of Willy Wonka and the Chocolate Factory.


var TotalHashes = 0;

importScripts('sha256.js');

// Function: scanhash
// 
// This function attempts to find a Golden Ticket for the
// given parameters.
//
// All of the arguments for this function can be supplied
// by a Bitcoin getwork request.
//
// midstate is 256-bits:	Array of 8, 32-bit numbers
// data is 512-bits:		Array of 16, 32-bit numbers
// hash1 is 256-bits:		Array of 8, 32-bit numbers
// target is 256-bits:		Array of 8, 32-bit numbers
//
// Returns a Golden Ticket (32-bit number) or false
function scanhash(midstate, data, hash1, target, progress_report)
{
	// Nonce is a number which starts at 0 and increments until 0xFFFFFFFF
	var nonce = 0;

	while(true) {
		// The nonce goes into the 4th 32-bit word
		data[4] = nonce;

		// Now let us see if this nonce results in a Golden Hash
		var hash = sha256_chunk(midstate, data);
		hash = sha256_chunk(SHA_256_INITIAL_STATE, hash.concat(hash1));

		TotalHashes++;

		if (is_golden_hash(hash, target)) {
			// I've got a Golden Ticket!!!
			// How many Bitcoins for the Geese?

			// The current nonce is thus a Golden Ticket
			return nonce;
		}


		if (nonce % 10000 == 0)
			progress_report();


		// If this was the last possible nonce, quit
		if (nonce == 0xFFFFFFFF)
			break;

		// Increment nonce
		nonce = safe_add(nonce, 1);
	}

	return false;
}


// Tests if a given hash is a less than or equal to the given target.
// NOTE: For Simplicity this just checks that the highest 32-bit word is 0x00000000
// TODO: Do a full comparison
//
// hash is 256-bits:		Array of 8, 32-bit numbers
// target is 256-bits:		Array of 8, 32-bit numbers
// Returns Boolean
function is_golden_hash(hash, target)
{
	return hash[7] == 0x00000000;
}



///// Web Worker /////

onmessage = function(event) {
	var job = event.data;
	job.golden_ticket = false;

	sendProgressUpdate(job);

	// Send occasional progress updates
	//setInterval(function() { sendProgressUpdate(job); }, 10000);
	

	// Begin scanning
	var golden_ticket = scanhash(event.data.midstate, event.data.data, event.data.hash1, event.data.target,
			function() { sendProgressUpdate(job); });

	// Scanning compelted. Send back the results
	job.golden_ticket = golden_ticket;
	postMessage(job);
};

function sendProgressUpdate(job)
{
	job.total_hashes = TotalHashes;

	postMessage(job);
}

 
