clean:
	@rm -fr build components

components:
	@component install --dev

build: index.js components
	@component build --dev

test: build
	@mocha-browser test/index.html

spm:
	@echo "define(function(require, exports, module) {" > src/sanitize.js
	@cat index.js >> src/sanitize.js
	@echo "})" >> src/sanitize.js
	@spm build

.PHONY: components build test clean
