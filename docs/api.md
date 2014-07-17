# API Documentation

### Toilet Status

To see the current occupied status of each toilet, see /status. You will receive a JSON object containing the status of each toilet.

#### Example:

http://restrooms.tld/status
{'toilet_1': true, 'toilet_2': true}

Please limit your applications to less than 500 API calls per minute.

