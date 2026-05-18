# README #

### API ###

<details>
<summary> Authorization </summary>

```
POST
/api/endpoint/authorize
```

```json
{
  "Username": "Your API username",
  "Password": "Your API password"
}
```

Then you receive freshly generated Bearer token:

```json
{
  "success": "Access token for user info@amaroautodily.cz",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9........."
}
```

and this token is necessary to insert as Authorization header:
for instance in curl you would insert Authorization header in a such way

```
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9........." http://www.....
```

and this Authorization header is necessary to have included for every API call. Expiration is set to one hour.

</details>

<details>
<summary> Create order </summary>

```
POST
/api/endpoint/create-order
```

```json
[
  {
    "eshop": {
      "ID": 1,
      "Currency_ID": 1,
      "Language_ID": 1,
      "VAT_ID": 1
    },
    "order": {
      "Shipping_ID": 1,
      "Payment_ID": 1,
      "Description": "Objednávka na amaroautodily.cz",
      "PriceShippingWithoutVat": 1500,
      "PriceShippingWithVat": 1800,
      "PricePaymentWithoutVat": 1500,
      "PricePaymentWithVat": 1200,
      "PriceProductWithoutVat": 1,
      "PriceProductWithVat": 1,
      "PriceTotalWithoutVat": 1,
      "PriceTotalWithVat": 1
    },
    "invoiceAddress": {
      "FirstName": "Ferdinand",
      "LastName": "Krupke",
      "Street": "KrupkeStrasse",
      "DescriptionNumber": 10,
      "City": "Hoštice",
      "ZipCode": "74858",
      "Email": "vojkuvka@evidsoft.cz",
      "Phone": "+420712154875",
      "CompanyName": "KrupkeInvest a. s.",
      "IC": 54156161,
      "DIC": "CZ415641561"
    },
    "orderItems": [
      {
        "Product_Api_ID": "1890",
        "Quantity": "1",
        "PriceWithoutVat": "6501.60",
        "PriceWithVat": "7866.94"
      },
      {
        "Product_Api_ID": "1891",
        "Quantity": "4",
        "PriceWithoutVat": "7501.60",
        "PriceWithVat": "8866.94"
      }
    ]
  }
]
```

</details>

<details>
<summary> Create product </summary>

```
POST
/api/endpoint/create-product
```

```json
{
  "Code": "A-4568",
  "Name": "Tažné zařízení Opel Astra",
  "Manufacturer": "HAK-POL",
  "OnStock": "5",
  "Description": "Tažné zařízení, které je výborně připraveno pro Opel Astra",
  "MetaDescription": "Tažné zařízení...",
  "PriceWithoutVat": "1548,5",
  "categories": [
    {
      "ID": 4
    },
    {
      "ID": 30
    }
  ],
  "parameters": [
    {
      "Name": "Hmotnost",
      "Unit": "Kg",
      "Value": "150"
    },
    {
      "Name": "Rozměry",
      "Unit": "mm",
      "Value": "150x150"
    },
    {
      "Name": "Rok výroby",
      "Unit": null,
      "Value": "1999-2005"
    },
    {
      "Name": "Karosérie",
      "Unit": null,
      "Value": "Combi"
    }
  ],
  "images": [
    {
      "Path": "https://vamot.cz/files/images/product/original/neco.jpg",
      "Main": true,
      "Description": "Hlavní obrázek"
    },
    {
      "Path": "https://vamot.cz/files/images/product/original/neco2.jpg",
      "Main": false,
      "Description": "Technický výkres"
    }
  ],
  "CarBrand": "Opel",
  "CarModel": "Astra"
}
```

</details>

<details>
<summary> Get product availability </summary>

Fetch data about products stock

```
GET
/api/endpoint/get-product-availability
```

Response:

```json
[
  {
    "ID": "1",
    "Code": "A/008",
    "OnStock": "3"
  },
  {
    "ID": "2",
    "Code": "A-082",
    "OnStock": "3"
  },
  {
    "ID": "3",
    "Code": "A/012",
    "OnStock": "2"
  },
  {
    "ID": "4",
    "Code": "A-086",
    "OnStock": "2"
  },
  {
    "ID": "6",
    "Code": "A/012",
    "OnStock": "2"
  },
  {
    "ID": "7",
    "Code": "A-086",
    "OnStock": "2"
  },
  {
    "ID": "13",
    "Code": "A-074",
    "OnStock": "0"
  },
  {
    "ID": "27",
    "Code": "V-056",
    "OnStock": "5"
  },
  {
    "ID": "28",
    "Code": "W/018",
    "OnStock": "3"
  },
  {
    "ID": "31",
    "Code": "B-040",
    "OnStock": "0"
  },
  {
    "ID": "32",
    "Code": "B-040",
    "OnStock": "0"
  },
  {
    "ID": "36",
    "Code": "B-040",
    "OnStock": "0"
  },
  {
    "ID": "37",
    "Code": "B/010",
    "OnStock": "1"
  },
  {
    "ID": "38",
    "Code": "B/007",
    "OnStock": "2"
  },
  {
    "ID": "39",
    "Code": "B/007",
    "OnStock": "2"
  },
  {
    "ID": "40",
    "Code": "B/010",
    "OnStock": "1"
  },
  {
    "ID": "41",
    "Code": "B/001",
    "OnStock": "1"
  },
  {
    "ID": "42",
    "Code": "B/011",
    "OnStock": "0"
  }
]
```

</details>

<details>
<summary> Get product info </summary>

Fetch info about products, with codes A/008, A/009

```
GET
api/endpoint/get-products?product-codes=A/008, A/009
```

Fetch info about products, with id 1,2,3,4,5

```
GET
api/endpoint/get-products/product-ids/1,2,3,4,5
```

#### Additional Params ####

* Limit
    * By parameter limit you can restrict, how many records should be returned in response.
* Offset
    * Parameter offset is used to identify the starting point to return rows from a result set. For instance if you want
      show 3rd record from db, you set offset to 3.

```
GET
api/endpoint/get-products/offset/2/limit/50 
```

Of course, you can combine limit and offset param with previous params product-ids and product-codes..

Response

```json
[
  {
    "ID": "1",
    "Manufacturer_ID": "5",
    "Video": null,
    "OnStock": "3",
    "Code": "A/008",
    "Viewed": "649",
    "CreatedDate": null,
    "EAN": null,
    "FlagNews": false,
    "FlagClearanceSale": false,
    "Weight": "15.00",
    "CarBrand": "audi",
    "Montage": true,
    "PohodaStock": "14",
    "productEshops": [
      {
        "ID": "33",
        "Eshop_ID": "1",
        "Product_ID": "1",
        "Vat_ID": "1",
        "Homepage": null,
        "Active": true,
        "Price": "3060.00",
        "Discount": null,
        "VipDiscount": null,
        "SpecialDiscount": null,
        "vat": {
          "ID": "1",
          "Name": "Základní daň 21%",
          "Value": "21.00"
        }
      }
    ],
    "productImages": [
      {
        "ID": "14515",
        "Product_ID": "1",
        "File_ID": "15364",
        "Description": "Přírubový čep na 2 šrouby",
        "Main": true,
        "file": {
          "ID": "15364",
          "Data": null,
          "Type": "product-photo",
          "Name": "typ-cepu-a-1659938074-bL5b",
          "Extension": "jpg"
        }
      }
    ],
    "manufacturer": {
      "ID": "5",
      "File_ID": "28",
      "Name": "HAK-POL"
    },
    "categories": [
      {
        "ID": "3",
        "Product_ID": "1",
        "Category_ID": "9700",
        "category": {
          "ID": "9700",
          "File_ID": "14681",
          "Category_ID": "2",
          "CategoryIDs": "9700,9702,9703,9704",
          "categoryLangs": [
            {
              "ID": "6",
              "Category_ID": "9700",
              "Language_ID": "1",
              "Name": "Tažné zařízení",
              "Description": "",
              "ShortDescription": "",
              "slug": "tazne-zarizeni"
            }
          ],
          "category": {
            "ID": "2",
            "File_ID": null,
            "Category_ID": null,
            "CategoryIDs": "2,4,304,3570,8149,8150,9162,9705,9123,9706,9437,9438,9709,9710,9707,9436,9440,9711,9712,9708,9713,9714,9715,9716,9819,9138,9717,9718,9719,9139,9657,9700,9702,9703,9704,9720,9721,9725,9822,9726,9727,9728,9722,9729,9730,9731,9723,9732,9733,9724,9734,9735,9818",
            "categoryLangs": [
              {
                "ID": "1",
                "Category_ID": "2",
                "Language_ID": "1",
                "Name": "Autodíly",
                "Description": "",
                "ShortDescription": "",
                "slug": "autodily"
              }
            ]
          }
        }
      }
    ],
    "parameters": [
      {
        "ID": "7",
        "Product_ID": "1",
        "Parameter_ID": "8",
        "ParameterValue_ID": "4530",
        "Value": "2055 kg",
        "parameter": {
          "ID": "8",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "28",
              "Language_ID": "1",
              "Parameter_ID": "8",
              "Name": "Maximální zatížení"
            }
          ]
        },
        "parameterValue": {
          "ID": "4530",
          "Parameter_ID": "8",
          "Value": "2055 kg"
        }
      },
      {
        "ID": "3195",
        "Product_ID": "1",
        "Parameter_ID": "9",
        "ParameterValue_ID": "4620",
        "Value": "85 kg",
        "parameter": {
          "ID": "9",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "34",
              "Language_ID": "1",
              "Parameter_ID": "9",
              "Name": "Svislé zatížení"
            }
          ]
        },
        "parameterValue": {
          "ID": "4620",
          "Parameter_ID": "9",
          "Value": "85 kg"
        }
      },
      {
        "ID": "6374",
        "Product_ID": "1",
        "Parameter_ID": "10",
        "ParameterValue_ID": "4692",
        "Value": "17,8 kg",
        "parameter": {
          "ID": "10",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "25",
              "Language_ID": "1",
              "Parameter_ID": "10",
              "Name": "Celková hmotnost"
            }
          ]
        },
        "parameterValue": {
          "ID": "4692",
          "Parameter_ID": "10",
          "Value": "17,8 kg"
        }
      },
      {
        "ID": "9553",
        "Product_ID": "1",
        "Parameter_ID": "11",
        "ParameterValue_ID": "4831",
        "Value": "A, na 2 šrouby",
        "parameter": {
          "ID": "11",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "36",
              "Language_ID": "1",
              "Parameter_ID": "11",
              "Name": "Typ čepu"
            }
          ]
        },
        "parameterValue": {
          "ID": "4831",
          "Parameter_ID": "11",
          "Value": "A, na 2 šrouby"
        }
      },
      {
        "ID": "12718",
        "Product_ID": "1",
        "Parameter_ID": "12",
        "ParameterValue_ID": "4843",
        "Value": "ano",
        "parameter": {
          "ID": "12",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "42",
              "Language_ID": "1",
              "Parameter_ID": "12",
              "Name": "Výřez nárazníků"
            }
          ]
        },
        "parameterValue": {
          "ID": "4843",
          "Parameter_ID": "12",
          "Value": "ano"
        }
      },
      {
        "ID": "22818",
        "Product_ID": "1",
        "Parameter_ID": "26",
        "ParameterValue_ID": "5223",
        "Value": "Audi",
        "parameter": {
          "ID": "26",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "44",
              "Language_ID": "1",
              "Parameter_ID": "26",
              "Name": "Značka auta"
            }
          ]
        },
        "parameterValue": {
          "ID": "5223",
          "Parameter_ID": "26",
          "Value": "Audi"
        }
      },
      {
        "ID": "27464",
        "Product_ID": "1",
        "Parameter_ID": "27",
        "ParameterValue_ID": "5326",
        "Value": "A6",
        "parameter": {
          "ID": "27",
          "Unit": null,
          "ToFilter": null,
          "parameterLangs": [
            {
              "ID": "29",
              "Language_ID": "1",
              "Parameter_ID": "27",
              "Name": "Model auta"
            }
          ]
        },
        "parameterValue": {
          "ID": "5326",
          "Parameter_ID": "27",
          "Value": "A6"
        }
      },
      {
        "ID": "32110",
        "Product_ID": "1",
        "Parameter_ID": "28",
        "ParameterValue_ID": "5892",
        "Value": "sedan",
        "parameter": {
          "ID": "28",
          "Unit": null,
          "ToFilter": true,
          "parameterLangs": [
            {
              "ID": "37",
              "Language_ID": "1",
              "Parameter_ID": "28",
              "Name": "Karosérie"
            }
          ]
        },
        "parameterValue": {
          "ID": "5892",
          "Parameter_ID": "28",
          "Value": "sedan"
        }
      },
      {
        "ID": "37432",
        "Product_ID": "1",
        "Parameter_ID": "14",
        "ParameterValue_ID": "6724",
        "Value": "1997 - 2005",
        "parameter": {
          "ID": "14",
          "Unit": null,
          "ToFilter": true,
          "parameterLangs": [
            {
              "ID": "32",
              "Language_ID": "1",
              "Parameter_ID": "14",
              "Name": "Rok Výroby"
            }
          ]
        },
        "parameterValue": {
          "ID": "6724",
          "Parameter_ID": "14",
          "Value": "1997 - 2004 (C5)"
        }
      }
    ],
    "Name": "Tažné zařízení Audi A6, 4D (také Quattro)",
    "slug": "tazne-zarizeni-audi-a6-4d-take-quattro-4",
    "Description": "<p>&nbsp;</p>\n<p>Tažn&aacute; zař&iacute;zen&iacute; jsou vyr&aacute;běna za použit&iacute; nejmoderněj&scaron;&iacute;ch technologi&iacute;, tj. digit&aacute;lně ovl&aacute;dan&eacute;ho CNC laserov&eacute;ho a plazmov&eacute;ho nože a hranov&eacute;ho lisu. Pro zaji&scaron;těn&iacute; vynikaj&iacute;c&iacute; povrchov&eacute; &uacute;pravy, jsou tažn&aacute; zař&iacute;zen&iacute; či&scaron;těna v p&iacute;skovac&iacute; komoře, fosforov&aacute;na a n&aacute;sledně lakov&aacute;na pr&aacute;&scaron;kovou polyesterovou barvou. Na&scaron;e produkty jsou vybaveny nezbytn&yacute;mi homologacemi e20 a E20 a certfik&aacute;tem PIMOS. Na z&aacute;kladě těchto homologac&iacute; dod&aacute;v&aacute;me ke každ&eacute;mu tažn&eacute;mu zař&iacute;zen&iacute; typov&yacute; list. Z&aacute;kazn&iacute;k si muže namontovat tažn&eacute; zař&iacute;zen&iacute; s&aacute;m, nebo mu doporuč&iacute;me na&scaron;e mont&aacute;žn&iacute; střediska po cel&eacute; ČR.</p>\n<p>&nbsp;</p>",
    "ShortDescription": "<p>Tažné zařízení Audi A6, 4D, (také Quattro) (kromě RS6) rok výroby 04/1997-03/2005.</p>",
    "MadeYear": "1997 - 2004 (C5)",
    "OriginalPriceWithoutVat": "3060.00",
    "OriginalPriceWithVat": 3702.59999999999990905052982270717620849609375,
    "PriceWithoutVat": "3060.00",
    "ProductDiscount": 0,
    "PriceWithVat": 3702.59999999999990905052982270717620849609375
  }
]
```

</details>