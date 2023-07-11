# Countdown
A little web app I use to keep track of recurring and one-time events.

## Installation
These files are not important and can be deleted post-download
```
- .gitignore
- README.md
```

Rename `events.json.example` to `events.json`

## Adding Events
### Permanent
To create events that stay after refresh or across multiple devices, you will need to edit `events.json` under "recurring" or "oneTime" add the JSON for your event, it will look something like this:
```json
{
    "event": "This is my event!",
    "timestamp": 4844770412
}
```

To get the timestamp, visit a website like [unixtimestamp.com](https://www.unixtimestamp.com), enter the time and date of the event, click "Convert" and copy the **Unix Timestamp** field of the table.

### Temporary
To create quick, temporary events, you can enter the event name and time at the bottom of the screen