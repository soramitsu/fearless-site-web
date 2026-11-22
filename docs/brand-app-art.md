# Wallet screen artwork

These standalone wallet illustrations use fictitious balances, not live chain data. Build with Node 22+ and opentype.js 1.3.4.

```sh
node scripts/brand/build-app-art.mjs --kit /path/to/brand/yatagarasu --tools /path/to/tools
```

Add `--check` for a read-only byte comparison of all SVGs and this receipt. The tools directory contains `node_modules/opentype.js`; omit it if installed alongside the kit. For a standalone kit set `SORA_BOLD_OTF` to the matching iOS Sora Bold font. Figtree outlines are shared within each SVG, with fixed digit advances for updates. Each feature plays a ten-second illustrative sequence. The static presentation is the settled state. The sunset card’s weakest text is “Total balance”: 6.21:1 minimum measured against its glyph footprint. The 118 px send seal and warning-card break are positioned for the site’s 85% crop (including the warning’s 13% upward shift).

## Animated icons

The eight 64×64 benefit/stat icons and three 96×96 TON step numerals live in src/public/icons/animated/. Each has an eight-second cycle and a static reduced-motion drawing. File sizes in bytes:

custody.svg: 1820

open-source.svg: 1324

encryption.svg: 1637

privacy.svg: 824

wallets.svg: 1154

networks.svg: 3949

users.svg: 2001

rating.svg: 1072

step-1.svg: 3896

step-2.svg: 4297

step-3.svg: 4521

## SHA-256

Kit inputs (relative to the kit root):

```
f8a90c01bc4c31aa84be5cbff3e80784bfc0da37e5aaa23eb9e05108b9ba0ece  fonts/figtree-500.ttf
b5d3fe714f8283b072579c9318c6cbe9e028ca51d6ba33eed0412a828ec331da  fonts/figtree-600.ttf
88aad0bfccf47bc631abd1351a0c815be98edf58c2c8706f72deb24a531639d6  fonts/figtree-700.ttf
7bb8f75f8df17f72b36fe783bf5f35f31f7d9e53b1025b7d8fe2ae42824e240c  svg/crest-badge.svg
0dddb03fc97971d0c9226e6ed052565dfe52e75681b1df99f5b3c356f75bede5  masters/fearless-crest.svg
cc2bce14632d0d24eedcb578e47fadc4852478a01b67fa0d81c2d99b37bad004  svg/crest-badge-small.svg
e5fdf61cbe6300ff4242c603d273b316b9866d770897cbf31cdc8aeec32a5910  masters/fearless-crest-small.svg
6949daff2d3d4deef0a77712b3830ceaf0487560613ba2c5b623ca873f97a455  tokens/shikiban.json
0e544952f4cd25efc4483a3ef0e8b43c3e570aa7fb98b69ecee725c9aaa29648  tokens/solar-geometry.json
defdad74f63dec6421a9a5d8d3ef4042d6292eb51ebb044bf725cb18528cf4e9  tokens/colors.json
19675ac743881b28bcae83a24f3ee15702c5a8af2b7a5d901c858848c4d74cd7  manifest.json
7b38e7fe552930dc0e5771b6e68877499c042e31fdd71d005ec7cf3010a7ce9d  SPEC.md
8d7dd3c933810727f4d856036be3b056a94ec39e4e3860fe7b2e32e6d00ad71c  svg/shikiban.svg
26cd265169c8e78f0ca6e97dc66df95f0b285ce1bb9707ac0e8adea0b8d188c5  svg/solar-geometry.svg
51dcbf5137ca44b808dc8647e5edd055762cc0e214bff1fd9897925789136f48  tools/shikiban.mjs
cc0d93e9bbbad9c173b5ff9936702880ad051fb564030adc86fb9555c077568b  tools/shikiban-draw.mjs
```

Additional display font:

```
69ce78540cda4f394851f0dcc56992872e8e8350a2790d5c5e2eb60ca94561d7  fearless-iOS/fearless/Fonts/sora-Bold.otf
```

Generator and delivered artwork (the receipt excludes its own recursive digest):

```
bff39036ff87df5e6cecbb960d68b22262737d156e4d1acb35344c731e1b2df6  scripts/brand/art.mjs
e74d41f203b5a85037c446727d7a26162f0660a469d96dad1e73b29b46355c50  scripts/brand/figures.mjs
e8f4e6bff9b1bac17610ce0d9d72c66149b2445abdb09394aa6d7b93f75d1081  scripts/brand/home.mjs
b8358cd350b003ee0e65d520bf374d3c2fb6fa77e5cc55db6a3b4b2324fec6bf  scripts/brand/features.mjs
52bdcb3e514b84398184ea96c47420d4e8d64e0fd6c5a7fc941549c64030d052  scripts/brand/icons.mjs
22f3ad428f77e169c2c210c5e07506626e3f1151e065e12b12ce33e2077e1233  scripts/brand/build-app-art.mjs
025251be1ea8b14e78ae595dfa36852081e3c9d6178ddcfcc6e640b951b8fd7c  src/public/hero/back.svg
98a3a1be17a4a4d79444740683e490175c8aac3827019ad41759a69844b483b7  src/public/hero/screen.svg
46f9329fe1d84da29289359c5c9f2db5694a37c11ffb30d39cb8f87d7d438056  src/public/hero/card.svg
e8b188afccc836c6b5c3f4f6e7430800f6a971b035d22d9b19227caef6b3df4f  src/public/hero/actions.svg
1c1074c76bd788c74a2f02b8a96c2d2093d841448868a5c1aaa11a667f072b72  src/public/hero/row-eth.svg
b851ab4141ac799d8d4b85c65a94249a7f0a5caafee901cbf0559e9fa247f74c  src/public/hero/row-sol.svg
a3623c487657b30a94753c0962585aaf843dff1a097a6763aa47dba58db85f9f  src/public/hero/row-dot.svg
97cc4ddd06ae3b23c067f40684f9622e84723a49140237d0aff472983b5ebb66  src/public/hero/row-xor.svg
767bd48ff644b1b153efe591302bee89e0b194a73bd86957a89b4242aae4f525  src/public/hero/toast.svg
7334e32a45e1ad8fb9c66a5c55288e0eb4f9894b8d56aca2e9e0301c96cf06b1  src/public/features/networks.svg
0699a4cac5e5dea02726f8fcc73fa541d74057a344c022a3773a7d997286387e  src/public/features/send.svg
ccc4904036d1e7ebb1dc62bac78e7955244836f261c7fcdf6a0f39fe9fb7ab26  src/public/features/scam-warning.svg
72a5dd9c6bd4a2d7b16401a4841220b8dfe72e814ab9694091909abe27dca31f  src/public/features/swap.svg
e0e5062ec887d3cf91c694bd83ca2cf03f8bbabda7fef5b3f8a4dcb7a8ff13dc  src/public/features/stake.svg
23a99953787960c7120124f4be14d7258b50c46ab0bccb0583d0204a4f8a6393  src/public/icons/animated/custody.svg
aaac7e28da340bee9302234465480d8746ba3fc2b1df25750afe9492ef37a738  src/public/icons/animated/open-source.svg
bc097e7aac03202693b6619b2c38adbe2f14f7df6aa9f05dce0ecdcec94b5ddf  src/public/icons/animated/encryption.svg
ca1b5a20e2258295f94d15201cfdc73f48a00274fadd73908cfe606f12c0d75e  src/public/icons/animated/privacy.svg
0d45d78f7c2059ee38721232a08d08674e288e288cdc2494832b2e71baa158f5  src/public/icons/animated/wallets.svg
2cca9b81abb2dca10027a2d50604b9f74698ee9dc74555dea12ec5acabfdff1f  src/public/icons/animated/networks.svg
4a1d4804f67c5c109588fe58f8823be173c70705114a5da0fd348ccc078c2490  src/public/icons/animated/users.svg
406e84299f8264fda4f8248150882a1bd1da4ff6f0b2a9c0116ac30c87d4957a  src/public/icons/animated/rating.svg
2d2d87e587ec0ae14b5c0d4b4112f7fc0163e7579c8f15bf2f1e6a13799b7031  src/public/icons/animated/step-1.svg
e7750334a0aaeb15f09bea54dd07bec1b6dad6be5da20ef354c5e9166d2e0a0e  src/public/icons/animated/step-2.svg
f9fa13ff98dcf1c5d907e4a55f9afcd2f5dce6b289f80cc7aa1386d9bcd662cd  src/public/icons/animated/step-3.svg
```
