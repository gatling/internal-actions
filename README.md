# Private actions

## sample

GitHub action to prove that this repository works as intended.

```yaml
- uses: gatling/private-actions@sample/v0
```

## slack-notify

GitHub action that sends a message in a Slack channel and update it when the job ends.

```yaml
- uses: gatling/private-actions@slack-notify/v1
  env: 
    PARAM_VERSION: ${{ steps.build.outputs.version }}
  with:
    token: ${{ secrets.SLACK_BOT_TOKEN }}
    channel: ${{ secrets.SLACK_CHANNEL_ID }}
    messagesDir: ./slack-messages
```

## Other

 * [How to add a new action](./NEW_ACTION.md)
