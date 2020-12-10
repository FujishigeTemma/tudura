f=Hello
PHONY: deploy
deploy:
	@gcloud functions deploy ${f} --runtime go113 --trigger-http --allow-unauthenticated

PHONY: delete
delete:
	@gcloud functions delete ${f}