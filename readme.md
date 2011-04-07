Bitcoin JavaScript Miner
========================

**Current Status**: Pre-Alpha


What is it?
-----------

This is a Bitcoin Miner implemented in JavaScript. It is intended for use
in a [Bitcoin Mining Pool](https://en.bitcoin.it/wiki/Pooled_mining), but
its main purpose is to act as a learning tool. Feel free to browse the commented source-code
and learn more about how Bitcoins are mined.

[Learn more about Bitcoin](http://www.bitcoin.org/ "Bitcoin")


How do I use it?
----------------

Download the full source code and upload it to any webserver. You can then
access the index.html file and begin mining!


Does It Really Mine Bitcoins?
-----------------------------

Not currently, no. The code is incomplete, and does not communicate with a real
mining pool. I intend to add that functionality, if possible, but it is not complete
yet.

When it *is* complete, it won't be very good at mining! It operates much slower
than even a standard CPU miner, and so it is unlikely to generate much income.



Current Development Status
--------------------------

JsMiner is currently just an educational tool, and has not been tested on a live
mining pool; nor has it been tested for 100% correct operation.

As time allows, I will strive to complete the code so that it works with an
actual mining pool.



File Desctriptions
------------------

This is a list of the files and what they do:

* **index.html** - The webpage for JsMiner. Provides an interface to start the mining process and view mining statistics.
* **miner.js** - This is where the Bitcoin Mining is done. It is invoked as a Web Worker (JavaScript thread).
* **sha256.js** - SHA-256 functions implemented in JavaScript.
* **work-manager.js** - Code to getwork, submitwork, and manage the Miner threads.



Thank You
---------

If you like this project, feel free contribute code, comments, and even Bitcoin donations.

*Donation Address*: 16TUsJ6ToAxp1a9RmTCGnox99MocGSYLaD

