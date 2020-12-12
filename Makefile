f=Hello
CONNECTOR_NAME=tudura

PHONY: deploy
deploy:
	@gcloud functions deploy ${f} --vpc-connector ${CONNECTOR_NAME} --runtime go113 --trigger-http --allow-unauthenticated

PHONY: delete
delete:
	@gcloud functions delete ${f}
