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

coverage:
	@jscoverage index.js cov.js
	@mv index.js bak.js
	@mv cov.js index.js
	@$(MAKE) build
	@$(tester) test/index.html -R html-cov > coverage.html
	@mv bak.js index.js

spm:
	@echo "define(function(require, exports, module) {" > src/sanitize.js
	@cat index.js >> src/sanitize.js
	@echo "})" >> src/sanitize.js
	@spm build

gh-pages: components
	@component build
	@rm -fr gh-pages
	@mkdir gh-pages
	@mv build gh-pages/
	@cp index.html gh-pages/index.html
	@ghp-import gh-pages -n
	@rm -fr gh-pages

.PHONY: components build test clean spm gh-pages
