.PHONY: test

install:
	npm install

start:
	npm start

request:
	curl http://localhost:5000/credit-score/0x8A03E0daB7E83076Af7200B09780Af7856F0298D

request_example:
	curl http://localhost:5000/example

request_public:
	curl api.cryptoscore.me/credit-score/0x8A03E0daB7E83076Af7200B09780Af7856F0298D

request_public_2:
	curl api.cryptoscore.me/credit-score/0x0005f124d6a49c29764b1db08546108ca0afeb68

test:
	npm test