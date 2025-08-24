window.BENCHMARK_DATA = {
  "lastUpdate": 1756044580190,
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
      }
    ]
  }
}