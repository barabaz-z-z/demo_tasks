# demo_tasks

# Endpoints

## GET /external/tasks

Response Code: 200 - OK

Response body:
```
{
  "data": {
    "[1..50]": {
      "id": "{{random.number(1, 1000000)}}",
      "name": "{{random.words(15)}}",
      "createdAt": "{{date.recent()}}",
      "completeAt": "{{date.today()}}",
      "priority": "{{random.number(1,3)}}",
      "status": "{{random.number(1,3)}}"
    }
  }
}
```

## POST /external/tasks/create
Response Code: 201 - Created

Script:
```
body.id = random.number(100001, 200000);
storeArrays.tasks.push(body);
```

Response body:
```
{
  "data": "{{body.id}}"
}
```

## DELETE /external/tasks/delete/{id}

Response Code: 204 - No Content

## GET /external/tasks/get/{id}

Response Code: 200 - OK

Script:
```
const index = storeArrays.tasks.findIndex(t => t.id === Number(params.id));
if (index > -1) {
  sResult.data = storeArrays.tasks[index];
} else {
  sResult.data = 'Record not found';
}
```

Response body:
```
"{{sResult}}"
```

## GET /external/teacher/wordcard

Response Code: 200 - OK

Response body:
```
{
  "isOk": true,
  "data": {
    "[1..100]": {
      "id": "{{random.uuid()}}",
      "word": "{{random.words(1)}}",
      "transcription": "{{random.words(1)}}",
      "mediaId": null,
      "synonyms": [],
      "examples": {
        "[2..4]":"{{random.words(10)}}"
      },
      "definitions": {
        "[2..3]":"{{random.words(2)}}"
      }
    }
  }
}
```
