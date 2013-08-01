component = node_modules/.bin/component
tester = node_modules/.bin/mocha-browser

clean:
	@rm -fr build components

components:
	@$(component) install --dev

build: index.js components
	@$(component) build --dev

test: build
	@$(tester) test/index.html

spm:
	@echo "define(function(require, exports, module) {" > src/sanitize.js
	@cat index.js >> src/sanitize.js
	@echo "})" >> src/sanitize.js
	@spm build

.PHONY: components build test clean spm
