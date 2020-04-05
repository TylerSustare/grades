prod:
	firebase use default;

dev:
	firebase use dev;

deploy:
	echo "\n\ndeploy-hosting\ndeploy-db\ndeploy-functions";
deploy-hosting:
	cd web-grades; nvm use; yarn build; cd ..; firebase deploy --only hosting;
deploy-db:
	firebase deploy --only firestore:rules
deploy-functions:
	cd functions; nvm use; yarn build; yarn deploy; cd ..;

firebase-storage-bucket-cors:
	gsutil cors set cors.json gs://dev-grades-fd.appspot.com
