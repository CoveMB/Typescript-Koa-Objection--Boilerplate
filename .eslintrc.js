module.exports = {

  parserOptions: {
    ecmaVersion: 10,
    parser: "@typescript-eslint/parser",
    project: './tsconfig.json'
  },
  extends: 
  [
    "plugin:@typescript-eslint/recommended", 
    'airbnb-typescript/base', 
    'koa', 
    'plugin:jest/recommended'
  ],
  plugins: [
    "@typescript-eslint"
  ],
  settings: {
    'import/resolver':{
      node:{
        extensions: ['.js', '.ts'],
        moduleDirectory: ['node_modules', './src']
      }
    }
  },
  "rules": {
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      ts: 'never',
    }],
    "no-cycle": "off",
    // Typescript
    "@typescript-eslint/lines-between-class-members": ["warn", {"exceptAfterOverload": true}],
    "@typescript-eslint/type-annotation-spacing": ["warn", 
    { "before": false, "after": true, 
    "overrides": { 
      "arrow": { "before": true, "after": true },
      "colon": { "before": false, "after": true } }}],
    // length
    "max-len": [
      "warn",
      {
        "code": 100,
        "ignoreStrings": true,
        "ignoreUrls": true,
        "ignoreComments": true,
        "ignoreTemplateLiterals": true
      }
    ],
    "import/prefer-default-export": "off",
    "no-console": "off",
    "no-unused-vars": "off",
    "quotes": [
      "warn",
      "single"
    ],
    // Spacing
    "space-in-parens": "warn",
    "keyword-spacing": "warn",
    "no-trailing-spaces": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": ["warn", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
    "key-spacing": [
      "warn",
      {
        "align": {},
        "multiLine": {}
      }
    ],
    "no-multi-spaces": [
      "warn",
      {
        "exceptions": {
          "VariableDeclarator": true
        },
        "ignoreEOLComments": true
      }
    ],
    // Padding
    "lines-around-comment": ["warn", { 
      "beforeBlockComment": true, 
      "beforeLineComment": true 
    }],
    "eol-last": "warn",
    "no-empty": "warn",
    "no-multiple-empty-lines": "warn",
    "newline-per-chained-call": [
      "warn",
      {
        "ignoreChainWithDepth": 2
      }
    ],
    "padded-blocks": [
      "warn",
      "always"
    ],
    "padding-line-between-statements": [
      "warn",
      {
        "blankLine": "always",
        "prev": "*",
        "next": [
          "cjs-export",
          "return",
          "if"
        ]
      },
      {
        "blankLine": "always",
        "prev": [
          "const",
          "let",
          "var",
          "import"
        ],
        "next": "*"
      },
      {
        "blankLine": "any",
        "prev": [
          "const",
          "let",
          "var",
          "import"
        ],
        "next": [
          "const",
          "let",
          "var",
          "import"
        ]
      }
    ],
    // Semi and coma rules
    "comma-dangle": "off",
    "no-extra-semi": "warn",
    "semi-style": [
      "error",
      "last"
    ],
    "semi": [
      "warn",
      "always",
      {
        "omitLastInOneLineBlock": false
      }
    ],
    "@typescript-eslint/indent": [
      "warn",
      2,
      {"SwitchCase": 1}
    ],
    "comma-spacing": [
      "warn",
      {
        "before": false,
        "after": true
      }
    ],
    // Object rules
    "object-curly-spacing": [
      "warn",
      "always"
    ],
    "object-curly-newline": [
      "warn",
      {
        "ObjectPattern": {
          "multiline": true,
          "minProperties": 4,
          "consistent": true 
        },
        "ObjectExpression": {
          "multiline": true,
          "minProperties": 2,
          "consistent": true 
        },
        "ImportDeclaration": {
          "multiline": true,
          "minProperties": 4,
          "consistent": true 
        },
        "ExportDeclaration": {
          "multiline": true,
          "minProperties": 4,
          "consistent": true 
        }
      }
    ],
    // Array rules
    "array-bracket-spacing": [
      "warn",
      "always"
    ],
    "array-bracket-newline": [
      "warn",
      {
        "multiline": true,
        "minItems": 3
      }
    ],
    "array-element-newline": [
      "warn",
      {
        "multiline": true,
        "minItems": 3
      }
    ]
  },
  env: {
    "node": true,
    "browser": false,
    "jest": true
  },
}