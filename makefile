build:
	mv app/consts.js app/consts_debug.js && mv app/consts_dist.js app/consts.js
	- rm -rf dist
	mkdir dist
	./node_modules/.bin/jspm bundle app/main dist/app.js
	./node_modules/.bin/uglifyjs dist/app.js -o dist/app.min.js
	./node_modules/.bin/html-dist --config html-dist.config.js --input index.html

	cp favicon.ico dist/
	cp loader.css dist/loader.css
	cp config.js dist/
	cat dist/config.js dist/app.min.js > dist/core.min.js
	./node_modules/.bin/jspm unbundle
	mv app/consts.js app/consts_dist.js && mv app/consts_debug.js app/consts.js
deploy_dev:
	aws s3 sync --profile a2zcloud dist/ s3://com-a2zcloud-users-dev
	aws cloudfront create-invalidation --profile a2zcloud --distribution-id E1TGAS2C95SL2J --invalidation-batch "{\"Paths\": {\"Quantity\": 1,\"Items\": [\"/*\"]},\"CallerReference\": \"make deploy "`date +%Y-%m-%d:%H:%M:%S`"\"}"
deploy_live:
	aws s3 sync --profile a2zcloud dist/ s3://com-a2zcloud-users
	aws cloudfront create-invalidation --profile a2zcloud --distribution-id E1JC7II1H3SR5M --invalidation-batch "{\"Paths\": {\"Quantity\": 1,\"Items\": [\"/*\"]},\"CallerReference\": \"make deploy "`date +%Y-%m-%d:%H:%M:%S`"\"}"
