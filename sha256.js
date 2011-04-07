/**
 *
 *  Secure Hash Algorithm (SHA256)
 *
 *  Original code by Angel Marin, Paul Johnston of
 *
 *  http://www.webtoolkit.info/
 *
 *  Modified for simplicity in Bitcoin Mining.
 *  Only provides a function for the SHA-256 Chunk processing.
 *
 *  i.e. SHA-256 pre-processes a string, and then runs chunk
 *  processing on 512-bit chunks of the pre-processed string.
 *
 *  This code only contains the chunk processing, which
 *  is the only part needed for Bitcoin Mining.
 *
 **/

var SHA_256_INITIAL_STATE = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);

// 32-bit Modular Binary Addition, JavaScript style
// because JavaScript would do weird things if you
// tried to just add the numbers.
function safe_add (x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}



// state is the 256-bit input state:	Array of 8, 32-bit numbers
// data is the 512-bit chunk:		Array of 16, 32-bit numbers
// Returns a 256-bit (partial) hash:	Array of 8, 32-bit numbers
//
// NOTE: If you are using this to understand SHA-256, skip the first parts of this
// function, which just create helper functions.
function sha256_chunk(state, data)
{
	// SHA-256 Round Constants
	var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);


	/////////////////////////////////////////////////////
	// HELPER FUNCTIONS
	/////////////////////////////////////////////////////
	

	//// Binary Helper Functions
	// Binary Right Rotate
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }

	// Binary Right Shift
	function R (X, n) { return ( X >>> n ); }

	//// Binary functions unique to SHA-256
	// These are used in the calculation of T1
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Sigma1(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }

	// These are used in the calculation of T2
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }

	// These are used in the calculation of W
	function Gamma0(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

		
	/////////////////////////////////////////////////////
	// THIS IS WHERE THE FUN STARTS
	// for anyone wanting to learn the SHA-256 Algorithm
	// start reading here, and reference the above as
	// needed.
	/////////////////////////////////////////////////////

	var W = new Array(64);
	var a, b, c, d, e, f, g, h, i, j;

	// Assign the state to named variables for clarity
	a = state[0];
	b = state[1];
	c = state[2];
	d = state[3];
	e = state[4];
	f = state[5];
	g = state[6];
	h = state[7];

	// Calculate the W values, which are based on the 512-bit input data.
	for (var i = 0; i < 64; ++i) {
		// For the first 16 rounds, use the raw input data as w
		if (i < 16)
			W[i] = data[i];
		else {
			var s0 = Gamma0(W[i-15]);
			var s1 = Gamma1(W[i-2]);
			// W[i] = W[i-16] + s0 + W[i-7] + s1
			W[i] = safe_add(safe_add(safe_add(W[i-16], s0), W[i-7]), s1);
		}
	}

	// Now perform 64 rounds of SHA-256
	for (var i = 0; i < 64; ++i) {
		var s0 = Sigma0(a);
		var maj = Maj(a, b, c);
		// t2 = s0 + maj
		var t2 = safe_add(s0, maj);
		var s1 = Sigma1(e);
		var ch = Ch(e, f, g);
		// var t1 = h + s1 + ch + K[i] + W[i]
		var t1 = safe_add(safe_add(safe_add(safe_add(h, s1), ch), K[i]), W[i]);

		// Shift the state and add t1 and t2
		h = g;
		g = f;
		f = e;
		e = safe_add(d, t1);	// e = d + t1
		d = c;
		c = b;
		b = a;
		a = safe_add(t1, t2);	// a = t1 + t2
	}

	// Now, as a final step, we add our result back into
	// the input state.
	a = safe_add(state[0], a);
	b = safe_add(state[0], b);
	c = safe_add(state[0], c);
	d = safe_add(state[0], d);
	e = safe_add(state[0], e);
	f = safe_add(state[0], f);
	g = safe_add(state[0], g);
	h = safe_add(state[0], h);

	return new Array(a, b, c, d, e, f, g, h);
}


