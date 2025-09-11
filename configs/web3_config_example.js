(function(C) {
C.WEB3 = {
  "guest_idol_id" : "12D3KooWDeGhHT4xzpVV1nEwVB4rQyRnL7zDcYqUAYYCmDLyzNp5",
  "network" : {
    "resolvers" : [
      {"address" : "/ip6/2600:1f18:4544:9400:bafc:ab1c:7e8:929f/tcp/9097"}
    ],
    "publishers" : [
      {
        "type" : "PUBLIC",
        "address" : "/ip6/2600:1f18:4544:9400:bafc:ab1c:7e8:929f/tcp/9097"
      },
      {"type" : "PRIVATE", "address" : "/dns4/g-ipfs.local/tcp/80"}
    ],
    "storages" : [
      {
        "type" : "PUBLIC",
        "default" : "/ip6/2600:1f18:4544:9400:bafc:ab1c:7e8:929f/tcp/9097",
      },
      {
        "type" : "PRIVATE",
        "default" : "/dns4/g-ipfs.local/tcp/80",
      }
    ],
    "blockchains" : [
      {"type" : "PUBLIC", "address" : "/ip4/3.145.68.8/tcp/9097"},
      {"type" : "PRIVATE", "address" : "/dns4/g-ipfs.local/tcp/9097"}
    ]
  }
};
}(window.C = window.C || {}));
