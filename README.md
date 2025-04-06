---
title: Taskly
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Taskly

Base URLs:

# Authentication

# user Auth

## POST signup

POST /api/v1/users/signup

> Body Parameters

```yaml
firstName: Ahmed
lastName: Shehab
username: xxx
email: yawap73385@bariswc.com
photo: file:///home/ironman/Downloads/MainBefore.jpg
password: Ahmed124

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| no |none|
|» firstName|body|string| yes |none|
|» lastName|body|string| yes |none|
|» username|body|string| yes |none|
|» email|body|string| yes |none|
|» photo|body|string(binary)| yes |none|
|» password|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Tasks

## POST Add task to a specific project

POST /api/v1/projects/18/tasks

> Body Parameters

```json
{
  "title": "yarba n5ls",
  "priority": "MEDIUM",
  "assignedTo": 21,
  "dueDate": "2025-04-06T12:30:00.000Z",
  "description": "yarab"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» title|body|string| yes |none|
|» priority|body|string| yes |none|
|» assignedTo|body|integer| yes |none|
|» dueDate|body|string| yes |none|
|» description|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET Get All taks for a project

GET /api/v1/projects/18/tasks

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": 17,
        "title": "yarba n5ls",
        "description": "yarab",
        "dueDate": "2025-10-05T14:48:00.000Z",
        "priority": "MEDIUM",
        "status": "ASSIGNED",
        "createdAt": "2025-04-05T16:18:41.253Z",
        "updatedAt": "2025-04-05T16:18:41.253Z",
        "member": {
          "user": {
            "username": "hamota1",
            "photo": null,
            "id": 21,
            "email": "ahmed.essam9608@gmail.com"
          }
        },
        "creator": {
          "user": {
            "username": "shehab1",
            "photo": null,
            "id": 20,
            "email": "ahmed10pepeto@gmail.com"
          }
        }
      },
      {
        "id": 18,
        "title": "yarba n5ls",
        "description": "yarab",
        "dueDate": "2025-10-05T14:48:00.000Z",
        "priority": "MEDIUM",
        "status": "ASSIGNED",
        "createdAt": "2025-04-05T16:20:47.083Z",
        "updatedAt": "2025-04-05T16:20:47.083Z",
        "member": {
          "user": {
            "username": "hamota1",
            "photo": null,
            "id": 21,
            "email": "ahmed.essam9608@gmail.com"
          }
        },
        "creator": {
          "user": {
            "username": "shehab1",
            "photo": null,
            "id": 20,
            "email": "ahmed10pepeto@gmail.com"
          }
        }
      },
      {
        "id": 19,
        "title": "yarba n5ls",
        "description": "yarab",
        "dueDate": "2025-10-05T14:48:00.000Z",
        "priority": "MEDIUM",
        "status": "ASSIGNED",
        "createdAt": "2025-04-05T16:21:18.583Z",
        "updatedAt": "2025-04-05T16:21:18.583Z",
        "member": {
          "user": {
            "username": "hamota1",
            "photo": null,
            "id": 21,
            "email": "ahmed.essam9608@gmail.com"
          }
        },
        "creator": {
          "user": {
            "username": "shehab1",
            "photo": null,
            "id": 20,
            "email": "ahmed10pepeto@gmail.com"
          }
        }
      },
      {
        "id": 20,
        "title": "yarba n5ls",
        "description": "yarab",
        "dueDate": "2025-10-05T14:48:00.000Z",
        "priority": "MEDIUM",
        "status": "ASSIGNED",
        "createdAt": "2025-04-05T16:22:55.503Z",
        "updatedAt": "2025-04-05T16:22:55.503Z",
        "member": {
          "user": {
            "username": "hamota1",
            "photo": null,
            "id": 21,
            "email": "ahmed.essam9608@gmail.com"
          }
        },
        "creator": {
          "user": {
            "username": "shehab1",
            "photo": null,
            "id": 20,
            "email": "ahmed10pepeto@gmail.com"
          }
        }
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» tasks|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» title|string|true|none||none|
|»»» description|string|true|none||none|
|»»» dueDate|string|true|none||none|
|»»» priority|string|true|none||none|
|»»» status|string|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|
|»»» member|object|true|none||none|
|»»»» user|object|true|none||none|
|»»»»» username|string|true|none||none|
|»»»»» photo|null|true|none||none|
|»»»»» id|integer|true|none||none|
|»»»»» email|string|true|none||none|
|»»» creator|object|true|none||none|
|»»»» user|object|true|none||none|
|»»»»» username|string|true|none||none|
|»»»»» photo|null|true|none||none|
|»»»»» id|integer|true|none||none|
|»»»»» email|string|true|none||none|

## GET Get a specific task

GET /api/v1/projects/18/tasks/30

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": 30,
      "title": "yarba n5ls",
      "description": "yarab",
      "dueDate": "2025-04-06T12:30:00.000Z",
      "priority": "MEDIUM",
      "createdAt": "2025-04-05T23:19:34.377Z",
      "comments": [],
      "member": {
        "role": "MEMBER",
        "user": {
          "id": 21,
          "username": "hamota1",
          "email": "ahmed.essam9608@gmail.com",
          "photo": null
        }
      },
      "creator": {
        "role": "MANAGER",
        "user": {
          "id": 20,
          "username": "shehab1",
          "email": "ahmed10pepeto@gmail.com",
          "photo": null
        }
      }
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» task|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» title|string|true|none||none|
|»»» description|string|true|none||none|
|»»» dueDate|string|true|none||none|
|»»» priority|string|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» comments|[string]|true|none||none|
|»»» member|object|true|none||none|
|»»»» role|string|true|none||none|
|»»»» user|object|true|none||none|
|»»»»» id|integer|true|none||none|
|»»»»» username|string|true|none||none|
|»»»»» email|string|true|none||none|
|»»»»» photo|null|true|none||none|
|»»» creator|object|true|none||none|
|»»»» role|string|true|none||none|
|»»»» user|object|true|none||none|
|»»»»» id|integer|true|none||none|
|»»»»» username|string|true|none||none|
|»»»»» email|string|true|none||none|
|»»»»» photo|null|true|none||none|

## PATCH Update a specific task

PATCH /api/v1/projects/18/tasks/30

> Body Parameters

```json
{
  "title": "yarba n5ls yarab"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» title|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": 30,
      "title": "yarba n5ls yarab",
      "description": "yarab",
      "assignedTo": 21,
      "dueDate": "2025-04-06T12:30:00.000Z",
      "status": "ASSIGNED",
      "priority": "MEDIUM",
      "active": true,
      "createdBy": 20,
      "projectId": 18,
      "createdAt": "2025-04-05T23:19:34.377Z",
      "updatedAt": "2025-04-06T00:00:09.964Z"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» task|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» title|string|true|none||none|
|»»» description|string|true|none||none|
|»»» assignedTo|integer|true|none||none|
|»»» dueDate|string|true|none||none|
|»»» status|string|true|none||none|
|»»» priority|string|true|none||none|
|»»» active|boolean|true|none||none|
|»»» createdBy|integer|true|none||none|
|»»» projectId|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|

## GET My all tasks

GET /api/v1/users/myTasks

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE Delete a specific task

DELETE /api/v1/projects/18/tasks/31

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET My tasks in a specific project

GET /api/v1/projects/18/tasks/mine

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": 30,
        "title": "yarba n5ls",
        "description": "yarab",
        "dueDate": "2025-04-06T12:30:00.000Z",
        "status": "ASSIGNED",
        "priority": "MEDIUM",
        "project": {
          "id": 18,
          "name": "testProject2"
        },
        "creator": {
          "user": {
            "username": "shehab1",
            "email": "ahmed10pepeto@gmail.com",
            "photo": null
          }
        },
        "createdAt": "2025-04-05T23:19:34.377Z"
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» tasks|[object]|true|none||none|
|»»» id|integer|false|none||none|
|»»» title|string|false|none||none|
|»»» description|string|false|none||none|
|»»» dueDate|string|false|none||none|
|»»» status|string|false|none||none|
|»»» priority|string|false|none||none|
|»»» project|object|false|none||none|
|»»»» id|integer|true|none||none|
|»»»» name|string|true|none||none|
|»»» creator|object|false|none||none|
|»»»» user|object|true|none||none|
|»»»»» username|string|true|none||none|
|»»»»» email|string|true|none||none|
|»»»»» photo|null|true|none||none|
|»»» createdAt|string|false|none||none|

## PATCH Mark the task as done

PATCH /api/v1/projects/18/tasks/30/done

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "message": "The task has been done successfully"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» message|string|true|none||none|

# comments

## PATCH Editing a specific comment

PATCH /api/v1/projects/18/tasks/30/comments/1

> Body Parameters

```json
{
  "content": "3aa4"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» content|body|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get a specific comment

GET /api/v1/projects/18/tasks/30/comments/1

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "comment": {
      "id": 1,
      "content": "3aa4",
      "taskId": 30,
      "active": true,
      "userId": 20,
      "createdAt": "2025-04-06T00:51:17.444Z",
      "updatedAt": "2025-04-06T01:08:46.318Z"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» comment|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» content|string|true|none||none|
|»»» taskId|integer|true|none||none|
|»»» active|boolean|true|none||none|
|»»» userId|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|

## DELETE deleting a specific comment

DELETE /api/v1/projects/18/tasks/30/comments/1

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "message": "The comment has been deleted successfully"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» message|string|true|none||none|

## POST Adding a comment on specific task

POST /api/v1/projects/18/tasks/30/comments

> Body Parameters

```json
{
  "content": "teslm ya reyasa"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» content|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "comment": {
      "content": "teslm ya reyasa",
      "id": 3,
      "createdAt": "2025-04-06T00:55:05.084Z",
      "user": {
        "photo": null,
        "username": "hamota1",
        "id": 21
      }
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» comment|object|true|none||none|
|»»» content|string|true|none||none|
|»»» id|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» user|object|true|none||none|
|»»»» photo|null|true|none||none|
|»»»» username|string|true|none||none|
|»»»» id|integer|true|none||none|

## GET Get all tasks on a specific task

GET /api/v1/projects/18/tasks/30/comments

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "comments": [
      {
        "id": 1,
        "content": "408l fakher mn el2akher",
        "taskId": 30,
        "active": true,
        "userId": 20,
        "createdAt": "2025-04-06T00:51:17.444Z",
        "updatedAt": "2025-04-06T00:51:17.444Z"
      },
      {
        "id": 2,
        "content": "408l fakher mn el2akher",
        "taskId": 30,
        "active": true,
        "userId": 20,
        "createdAt": "2025-04-06T00:54:06.260Z",
        "updatedAt": "2025-04-06T00:54:06.260Z"
      },
      {
        "id": 3,
        "content": "teslm ya reyasa",
        "taskId": 30,
        "active": true,
        "userId": 21,
        "createdAt": "2025-04-06T00:55:05.084Z",
        "updatedAt": "2025-04-06T00:55:05.084Z"
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» comments|[object]|true|none||none|
|»»» id|integer|true|none||none|
|»»» content|string|true|none||none|
|»»» taskId|integer|true|none||none|
|»»» active|boolean|true|none||none|
|»»» userId|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|

# Projects

## GET Get all of my projects

GET /api/v1/projects

> Body Parameters

```json
{}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "projects": [
      {
        "id": 18,
        "name": "testProject2",
        "description": "i already said thta it's a test project",
        "photo": "https://res.cloudinary.com/dsafqgv3j/image/upload/v1743860476/taskly/photo-1743860475396-866207750.webp",
        "active": true,
        "completed": false,
        "managerId": 20,
        "createdAt": "2025-04-04T21:13:58.344Z",
        "updatedAt": "2025-04-05T13:41:17.245Z"
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» projects|[object]|true|none||none|
|»»» id|integer|false|none||none|
|»»» name|string|false|none||none|
|»»» description|string|false|none||none|
|»»» photo|string|false|none||none|
|»»» active|boolean|false|none||none|
|»»» completed|boolean|false|none||none|
|»»» managerId|integer|false|none||none|
|»»» createdAt|string|false|none||none|
|»»» updatedAt|string|false|none||none|

## POST Add a project

POST /api/v1/projects

> Body Parameters

```yaml
name: testProject3
description: i already said thta it's a test3 project
photo: file:///home/ironman/Downloads/wallpaperflare.com_wallpaper.jpg

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» name|body|string| yes |none|
|» description|body|string| yes |none|
|» photo|body|string(binary)| yes |none|

> Response Examples

> 201 Response

```json
{
  "status": "success",
  "data": {
    "project": {
      "id": 22,
      "name": "testProject3",
      "description": "i already said thta it's a test3 project",
      "photo": "https://res.cloudinary.com/dsafqgv3j/image/upload/v1743906876/taskly/photo-1743906875572-314074734.webp",
      "active": true,
      "completed": false,
      "managerId": 20,
      "createdAt": "2025-04-06T02:34:38.326Z",
      "updatedAt": "2025-04-06T02:34:38.326Z"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### Responses Data Schema

HTTP Status Code **201**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» project|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» description|string|true|none||none|
|»»» photo|string|true|none||none|
|»»» active|boolean|true|none||none|
|»»» completed|boolean|true|none||none|
|»»» managerId|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|

## GET Get all project members

GET /api/v1/projects/18/members

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "data": {
    "members": [
      {
        "user": {
          "id": 20,
          "email": "ahmed10pepeto@gmail.com",
          "username": "shehab1",
          "photo": null
        }
      },
      {
        "user": {
          "id": 21,
          "email": "ahmed.essam9608@gmail.com",
          "username": "hamota1",
          "photo": null
        }
      },
      {
        "user": {
          "id": 22,
          "email": "jocol81861@bariswc.com",
          "username": "ahmedkhaled",
          "photo": "https://res.cloudinary.com/dsafqgv3j/image/upload/v1743901680/taskly/photo-1743901679353-514998346.webp"
        }
      }
    ]
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» data|object|true|none||none|
|»» members|[object]|true|none||none|
|»»» user|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» email|string|true|none||none|
|»»»» username|string|true|none||none|
|»»»» photo|string¦null|true|none||none|

## POST Adding a member to a specific task

POST /api/v1/projects/18/members

> Body Parameters

```json
{
  "memberId": "22"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» memberId|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "member": {
      "userId": 22,
      "projectId": 18,
      "active": true,
      "joinedAt": null,
      "role": "MEMBER",
      "memberStatus": "INVITATIONPENDING"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» member|object|true|none||none|
|»»» userId|integer|true|none||none|
|»»» projectId|integer|true|none||none|
|»»» active|boolean|true|none||none|
|»»» joinedAt|null|true|none||none|
|»»» role|string|true|none||none|
|»»» memberStatus|string|true|none||none|

## GET Get a specific project

GET /api/v1/projects/18

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "project": {
      "id": 18,
      "name": "testProject2",
      "description": "i already said thta it's a test project",
      "photo": "https://res.cloudinary.com/dsafqgv3j/image/upload/v1743860476/taskly/photo-1743860475396-866207750.webp",
      "completed": false,
      "createdAt": "2025-04-04T21:13:58.344Z",
      "manager": {
        "id": 20,
        "username": "shehab1",
        "email": "ahmed10pepeto@gmail.com",
        "photo": null
      },
      "members": [
        {
          "role": "MANAGER",
          "user": {
            "username": "shehab1",
            "id": 20,
            "photo": null
          }
        },
        {
          "role": "MEMBER",
          "user": {
            "username": "hamota1",
            "id": 21,
            "photo": null
          }
        }
      ]
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» project|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» description|string|true|none||none|
|»»» photo|string|true|none||none|
|»»» completed|boolean|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» manager|object|true|none||none|
|»»»» id|integer|true|none||none|
|»»»» username|string|true|none||none|
|»»»» email|string|true|none||none|
|»»»» photo|null|true|none||none|
|»»» members|[object]|true|none||none|
|»»»» role|string|true|none||none|
|»»»» user|object|true|none||none|
|»»»»» username|string|true|none||none|
|»»»»» id|integer|true|none||none|
|»»»»» photo|null|true|none||none|

## PATCH Updating a specific project

PATCH /api/v1/projects/18

> Body Parameters

```yaml
photo: file:///home/ironman/Downloads/MainBefore.jpg
description: yarab n5ls testing ba2a

```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» photo|body|string(binary)| yes |none|
|» description|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "project": {
      "id": 18,
      "name": "testProject2",
      "description": "yarab n5ls testing ba2a",
      "photo": "https://res.cloudinary.com/dsafqgv3j/image/upload/v1743908519/taskly/photo-1743908518375-357333065.webp",
      "active": true,
      "completed": false,
      "managerId": 20,
      "createdAt": "2025-04-04T21:13:58.344Z",
      "updatedAt": "2025-04-06T03:02:00.529Z"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» project|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» description|string|true|none||none|
|»»» photo|string|true|none||none|
|»»» active|boolean|true|none||none|
|»»» completed|boolean|true|none||none|
|»»» managerId|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|

## DELETE Delete a specific task

DELETE /api/v1/projects/22

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|

## DELETE Delete a member from a project

DELETE /api/v1/projects/18/members/22

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|204|[No Content](https://tools.ietf.org/html/rfc7231#section-6.3.5)|none|None|

## POST Accepting the project joining invitation

POST /api/v1/projects/20/invitation/accept

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## PATCH Editing the member role in the project

PATCH /api/v1/projects/18/members/21

> Body Parameters

```json
{
  "role": "SUPERVISOR"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|
|» role|body|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "projectMember": {
      "userId": 21,
      "projectId": 18,
      "active": true,
      "joinedAt": "2025-04-05T16:16:48.614Z",
      "role": "SUPERVISOR",
      "memberStatus": "JOINED"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» projectMember|object|true|none||none|
|»»» userId|integer|true|none||none|
|»»» projectId|integer|true|none||none|
|»»» active|boolean|true|none||none|
|»»» joinedAt|string|true|none||none|
|»»» role|string|true|none||none|
|»»» memberStatus|string|true|none||none|

## POST Assign the project to another member

POST /api/v1/projects/18/members/21

> Body Parameters

```json
{}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|
|body|body|object| no |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "project": {
      "id": 18,
      "name": "testProject2",
      "description": "yarab n5ls testing ba2a",
      "photo": "https://res.cloudinary.com/dsafqgv3j/image/upload/v1743908519/taskly/photo-1743908518375-357333065.webp",
      "active": true,
      "completed": false,
      "managerId": 21,
      "createdAt": "2025-04-04T21:13:58.344Z",
      "updatedAt": "2025-04-06T04:06:29.823Z"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» project|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» description|string|true|none||none|
|»»» photo|string|true|none||none|
|»»» active|boolean|true|none||none|
|»»» completed|boolean|true|none||none|
|»»» managerId|integer|true|none||none|
|»»» createdAt|string|true|none||none|
|»»» updatedAt|string|true|none||none|

## PATCH Leave the project

PATCH /api/v1/projects/18/leave

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| yes |none|

> Response Examples

> 200 Response

```json
{
  "status": "success",
  "data": {
    "projectMembership": {
      "userId": 20,
      "projectId": 18,
      "active": false,
      "joinedAt": "2025-04-04T21:13:58.344Z",
      "role": "MEMBER",
      "memberStatus": "LEFT"
    }
  }
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

HTTP Status Code **200**

|Name|Type|Required|Restrictions|Title|description|
|---|---|---|---|---|---|
|» status|string|true|none||none|
|» data|object|true|none||none|
|»» projectMembership|object|true|none||none|
|»»» userId|integer|true|none||none|
|»»» projectId|integer|true|none||none|
|»»» active|boolean|true|none||none|
|»»» joinedAt|string|true|none||none|
|»»» role|string|true|none||none|
|»»» memberStatus|string|true|none||none|

# Data Schema

