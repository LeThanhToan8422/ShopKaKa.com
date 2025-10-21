Url backend : https://lqmbsshop-production.up.railway.app

1.POST : /login
request body: 
{
​
  "username": "string",

  "password": "string"

}

response: 
{
  "accessToken": "string",
  "refreshToken": "string",
  "name": "string",
  "role": "string"
}


2.POST : /register
Request body:
{

  "username": "string",

  "password": "string",

  "name": "string"

}
​
Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "username": "string",
    "name": "string"
  }
}


3.GET : /user/profile
Responses:
{
  "id": "string",
  "name": "string",
  "role": "string",
  "orders": [
    {
      "userId": "string",
      "success": true,
      "message": "string",
      "order": {
        "orderNumber": "string",
        "amount": 0.1
      },
      "sepay": {
        "qrUrl": "string"
      }
    }
  ]
}


4.PUT : /user/profile

Request body:
{

  "name": "string"

}

Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "id": "string",
    "name": "string",
    "role": "string",
    "orders": [
      {
        "userId": "string",
        "success": true,
        "message": "string",
        "order": {
          "orderNumber": "string",
          "amount": 0.1
        },
        "sepay": {
          "qrUrl": "string"
        }
      }
    ]
  }
}

5.GET : /saleAccount/{id}
Parameters:
id: string (path)

Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "id": "string",
    "characterSkins": [
      {
        "character": "string",
        "skin": "string",
        "rarity": "string",
        "avatar": "string",
        "background": "string"
      }
    ],
    "gameUsername": "string",
    "gamePassword": "string",
    "images": [
      "string"
    ],
    "owner": "string",
    "blindBoxId": "string",
    "status": "string",
    "rank": "DONG",
    "price": 0,
    "heroesCount": 0,
    "skinsCount": 0,
    "description": "string",
    "level": 0,
    "matches": 0,
    "winRate": 0.1,
    "reputation": 0,
    "loginMethod": "string",
    "additionalInfo": "string",
    "createdAt": "2025-10-18T07:01:18.920Z",
    "updatedAt": "2025-10-18T07:01:18.920Z"
  }
}

6.PUT : /saleAccount/{id}
Parameters:
id: string (path)

Request body:
{
  "gameUsername": "string",
  "gamePassword": "string",
  "characterSkin": [
    {
      "character": "string",
      "skin": "string",
      "rarity": "string",
      "avatar": "string",
      "background": "string"
    }
  ],
  "blindBoxId": "string",
  "rank": "DONG",
  "images": [
    "string"
  ],
  "price": 0,
  "heroesCount": 0,
  "skinsCount": 0,
  "description": "string",
  "level": 0,
  "matches": 0,
  "winRate": 0.1,
  "reputation": 0,
  "loginMethod": "string",
  "additionalInfo": "string"
}
Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "id": "string",
    "characterSkins": [
      {
        "character": "string",
        "skin": "string",
        "rarity": "string",
        "avatar": "string",
        "background": "string"
      }
    ],
    "gameUsername": "string",
    "gamePassword": "string",
    "images": [
      "string"
    ],
    "owner": "string",
    "blindBoxId": "string",
    "status": "string",
    "rank": "DONG",
    "price": 0,
    "heroesCount": 0,
    "skinsCount": 0,
    "description": "string",
    "level": 0,
    "matches": 0,
    "winRate": 0.1,
    "reputation": 0,
    "loginMethod": "string",
    "additionalInfo": "string",
    "createdAt": "2025-10-18T07:01:54.611Z",
    "updatedAt": "2025-10-18T07:01:54.611Z"
  }
}

7.DELETE : /saleAccount/{id}
Parameters:
id: string (path)

Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "id": "string",
    "characterSkins": [
      {
        "character": "string",
        "skin": "string",
        "rarity": "string",
        "avatar": "string",
        "background": "string"
      }
    ],
    "gameUsername": "string",
    "gamePassword": "string",
    "images": [
      "string"
    ],
    "owner": "string",
    "blindBoxId": "string",
    "status": "string",
    "rank": "DONG",
    "price": 0,
    "heroesCount": 0,
    "skinsCount": 0,
    "description": "string",
    "level": 0,
    "matches": 0,
    "winRate": 0.1,
    "reputation": 0,
    "loginMethod": "string",
    "additionalInfo": "string",
    "createdAt": "2025-10-18T07:02:32.520Z",
    "updatedAt": "2025-10-18T07:02:32.520Z"
  }
}

8.GET : /saleAccount
Parameters:
rank: string (query)
minPrice: integer($int32) (query)
maxPrice: integer($int32) (query)
minHeroes: integer($int32) (query)
minSkins: integer($int32) (query)
price: integer($int32) (query)
page: integer($int32) (query) Default value : 0
size: integer($int32) (query) Default value : 10

Responses:
{
  "totalElements": 0,
  "totalPages": 0,
  "pageable": {
    "paged": true,
    "pageNumber": 0,
    "pageSize": 0,
    "offset": 0,
    "sort": {
      "sorted": true,
      "empty": true,
      "unsorted": true
    },
    "unpaged": true
  },
  "size": 0,
  "content": [
    {
      "id": "string",
      "characterSkins": [
        {
          "character": "string",
          "skin": "string",
          "rarity": "string",
          "avatar": "string",
          "background": "string"
        }
      ],
      "gameUsername": "string",
      "gamePassword": "string",
      "images": [
        "string"
      ],
      "owner": "string",
      "blindBoxId": "string",
      "status": "string",
      "rank": "DONG",
      "price": 0,
      "heroesCount": 0,
      "skinsCount": 0,
      "description": "string",
      "level": 0,
      "matches": 0,
      "winRate": 0.1,
      "reputation": 0,
      "loginMethod": "string",
      "additionalInfo": "string",
      "createdAt": "2025-10-18T07:02:51.615Z",
      "updatedAt": "2025-10-18T07:02:51.615Z"
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "empty": true,
    "unsorted": true
  },
  "numberOfElements": 0,
  "first": true,
  "last": true,
  "empty": true
}

9.POST : /saleAccount
Request body:
{
  "gameUsername": "string",
  "gamePassword": "string",
  "characterSkin": [
    {
      "character": "string",
      "skin": "string",
      "rarity": "string",
      "avatar": "string",
      "background": "string"
    }
  ],
  "blindBoxId": "string",
  "rank": "DONG",
  "images": [
    "string"
  ],
  "price": 0,
  "heroesCount": 0,
  "skinsCount": 0,
  "description": "string",
  "level": 0,
  "matches": 0,
  "winRate": 0.1,
  "reputation": 0,
  "loginMethod": "string",
  "additionalInfo": "string"
}
Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "id": "string",
    "characterSkins": [
      {
        "character": "string",
        "skin": "string",
        "rarity": "string",
        "avatar": "string",
        "background": "string"
      }
    ],
    "gameUsername": "string",
    "gamePassword": "string",
    "images": [
      "string"
    ],
    "owner": "string",
    "blindBoxId": "string",
    "status": "string",
    "rank": "DONG",
    "price": 0,
    "heroesCount": 0,
    "skinsCount": 0,
    "description": "string",
    "level": 0,
    "matches": 0,
    "winRate": 0.1,
    "reputation": 0,
    "loginMethod": "string",
    "additionalInfo": "string",
    "createdAt": "2025-10-18T07:03:19.791Z",
    "updatedAt": "2025-10-18T07:03:19.791Z"
  }
}

10.POST : /saleAccount/upload
Parameters:
blindBoxId: string (query)

Request body:
{
  "file": "string"
}

Responses:
{
  "successList": [
    {
      "id": "string",
      "characterSkins": [
        {
          "character": "string",
          "skin": "string",
          "rarity": "string",
          "avatar": "string",
          "background": "string"
        }
      ],
      "gameUsername": "string",
      "gamePassword": "string",
      "images": [
        "string"
      ],
      "owner": "string",
      "blindBoxId": "string",
      "status": "string",
      "rank": "DONG",
      "price": 0,
      "heroesCount": 0,
      "skinsCount": 0,
      "description": "string",
      "level": 0,
      "matches": 0,
      "winRate": 0.1,
      "reputation": 0,
      "loginMethod": "string",
      "additionalInfo": "string",
      "createdAt": "2025-10-18T07:03:50.229Z",
      "updatedAt": "2025-10-18T07:03:50.229Z"
    }
  ],
  "message": "string",
  "errorList": [
    {
      "element": {
        "id": "string",
        "characterSkins": [
          {
            "character": "string",
            "skin": "string",
            "rarity": "string",
            "avatar": "string",
            "background": "string"
          }
        ],
        "gameUsername": "string",
        "gamePassword": "string",
        "images": [
          "string"
        ],
        "owner": "string",
        "blindBoxId": "string",
        "status": "string",
        "rank": "DONG",
        "price": 0,
        "heroesCount": 0,
        "skinsCount": 0,
        "description": "string",
        "level": 0,
        "matches": 0,
        "winRate": 0.1,
        "reputation": 0,
        "loginMethod": "string",
        "additionalInfo": "string",
        "createdAt": "2025-10-18T07:03:50.229Z",
        "updatedAt": "2025-10-18T07:03:50.229Z"
      },
      "message": "string"
    }
  ]
}

11.POST: /saleAccount/blindBag
Request body:
{
  "userId": "string",
  "blindBoxId": "string"
}

Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "id": "string",
    "characterSkins": [
      {
        "character": "string",
        "skin": "string",
        "rarity": "string",
        "avatar": "string",
        "background": "string"
      }
    ],
    "gameUsername": "string",
    "gamePassword": "string",
    "images": [
      "string"
    ],
    "owner": "string",
    "blindBoxId": "string",
    "status": "string",
    "rank": "DONG",
    "price": 0,
    "heroesCount": 0,
    "skinsCount": 0,
    "description": "string",
    "level": 0,
    "matches": 0,
    "winRate": 0.1,
    "reputation": 0,
    "loginMethod": "string",
    "additionalInfo": "string",
    "createdAt": "2025-10-18T07:04:18.409Z",
    "updatedAt": "2025-10-18T07:04:18.409Z"
  }
}

12.GET : /saleAccount/{userId}
Parameters:
userId: string (path) required
page: integer($int32) (query) Default value : 0
size: integer($int32) (query) Default value : 10

Responses:
{
  "totalElements": 0,
  "totalPages": 0,
  "pageable": {
    "paged": true,
    "pageNumber": 0,
    "pageSize": 0,
    "offset": 0,
    "sort": {
      "sorted": true,
      "empty": true,
      "unsorted": true
    },
    "unpaged": true
  },
  "size": 0,
  "content": [
    {
      "id": "string",
      "username": "string",
      "password": "string",
      "owner": "string",
      "blindBoxId": "string",
      "images": [
        "string"
      ],
      "rank": "string",
      "price": 0,
      "heroesCount": 0,
      "skinsCount": 0,
      "description": "string",
      "level": 0,
      "matches": 0,
      "winRate": 0.1,
      "reputation": 0,
      "loginMethod": "string",
      "additionalInfo": "string",
      "createAt": "2025-10-18T07:04:37.868Z",
      "updateAt": "2025-10-18T07:04:37.868Z",
      "active": true
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "empty": true,
    "unsorted": true
  },
  "numberOfElements": 0,
  "first": true,
  "last": true,
  "empty": true
}

13.GET : /orders
Parameters:
page: integer($int32) (query) required
size: integer($int32) (query) required

Responses:
{
  "totalElements": 0,
  "totalPages": 0,
  "pageable": {
    "paged": true,
    "pageNumber": 0,
    "pageSize": 0,
    "offset": 0,
    "sort": {
      "sorted": true,
      "empty": true,
      "unsorted": true
    },
    "unpaged": true
  },
  "size": 0,
  "content": [
    {
      "userId": "string",
      "success": true,
      "message": "string",
      "order": {
        "orderNumber": "string",
        "amount": 0.1
      },
      "sepay": {
        "qrUrl": "string"
      }
    }
  ],
  "number": 0,
  "sort": {
    "sorted": true,
    "empty": true,
    "unsorted": true
  },
  "numberOfElements": 0,
  "first": true,
  "last": true,
  "empty": true
}

14.POST: /orders
Request body:
{
  "accountId": "string",
  "userId": "string",
  "orderNumber": "string",
  "amount": 0.1,
  "sepayQR": "string"
}

Responses:
{
  "success": true,
  "message": "string",
  "item": {
    "userId": "string",
    "success": true,
    "message": "string",
    "order": {
      "orderNumber": "string",
      "amount": 0.1
    },
    "sepay": {
      "qrUrl": "string"
    }
  }
}

15.POST: /hooks/sepay-payment:
Parameters:
Authorization: string (header)

Request body:
{
  "id": "string",
  "gateway": "string",
  "transactionDate": "2025-10-17T15:02:17.429Z",
  "accountNumber": "string",
  "code": 0,
  "content": "string",
  "transferType": "string",
  "transferAmount": 0.1,
  "accumulated": 0.1,
  "subAccount": "string",
  "referenceCode": "string",
  "description": "string"
}

Responses:
{
  "amount": 0.1,
  "message": "string",
  "status": "string"
}