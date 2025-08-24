window.BENCHMARK_DATA = {
  "lastUpdate": 1756045041169,
  "repoUrl": "https://github.com/Bakhitov/nextMastraN8N",
  "entries": {
    "n8n-mcp Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "bakhitov.akhan@gmail.com",
            "name": "Bakhitov",
            "username": "Bakhitov"
          },
          "committer": {
            "email": "bakhitov.akhan@gmail.com",
            "name": "Bakhitov",
            "username": "Bakhitov"
          },
          "distinct": true,
          "id": "694be14ba450ead426330bd33a42a80efd247b0c",
          "message": "chore: ignore db files; remove large example db from index",
          "timestamp": "2025-08-24T19:04:01+05:00",
          "tree_id": "6d281e9a5005600d3d68d45c6e7bc36737248982",
          "url": "https://github.com/Bakhitov/nextMastraN8N/commit/694be14ba450ead426330bd33a42a80efd247b0c"
        },
        "date": 1756044579734,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "sample - array sorting - small",
            "value": 0.0187,
            "unit": "ms",
            "range": 0.2708,
            "extra": "53344 ops/sec"
          },
          {
            "name": "sample - array sorting - large",
            "value": 3.1668,
            "unit": "ms",
            "range": 0.7425999999999999,
            "extra": "316 ops/sec"
          },
          {
            "name": "sample - string concatenation",
            "value": 0.0046,
            "unit": "ms",
            "range": 0.2494,
            "extra": "215623 ops/sec"
          },
          {
            "name": "sample - object creation",
            "value": 0.0662,
            "unit": "ms",
            "range": 0.32130000000000003,
            "extra": "15113 ops/sec"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "bakhitov.akhan@gmail.com",
            "name": "Bakhitov",
            "username": "Bakhitov"
          },
          "committer": {
            "email": "bakhitov.akhan@gmail.com",
            "name": "Bakhitov",
            "username": "Bakhitov"
          },
          "distinct": true,
          "id": "f3afa608e1940faf3f283bfc8558d5d1eb4397f8",
          "message": "feat(entrypoint): support DB_SEED_URL and SHA256 verification",
          "timestamp": "2025-08-24T19:15:48+05:00",
          "tree_id": "b43c2deec211e35df148a001b3fe382a11379cd9",
          "url": "https://github.com/Bakhitov/nextMastraN8N/commit/f3afa608e1940faf3f283bfc8558d5d1eb4397f8"
        },
        "date": 1756045040926,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "sample - array sorting - small",
            "value": 0.0191,
            "unit": "ms",
            "range": 0.3249,
            "extra": "52390 ops/sec"
          },
          {
            "name": "sample - array sorting - large",
            "value": 3.1803,
            "unit": "ms",
            "range": 0.6665999999999999,
            "extra": "314 ops/sec"
          },
          {
            "name": "sample - string concatenation",
            "value": 0.005,
            "unit": "ms",
            "range": 0.3051,
            "extra": "201739 ops/sec"
          },
          {
            "name": "sample - object creation",
            "value": 0.0672,
            "unit": "ms",
            "range": 0.38,
            "extra": "14885 ops/sec"
          }
        ]
      }
    ]
  }
}