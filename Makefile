clean:
	@rm -fr build components

components:
	@component install --dev

build: index.js components
	@component build --dev

test: build
	@mocha-browser test/index.html

.PHONY: components build test clean
