# JSON-CONVERSION-TOOL

#### NPM
[![json-csv-tool npm](https://img.shields.io/npm/v/json-csv-tool?label=json-csv-tool&logo=npm)](https://www.npmjs.com/package/json-csv-tool)

![](https://img.shields.io/npm/dm/json-csv-tool?logo=npm)
[![libraries io](https://img.shields.io/librariesio/release/npm/json-csv-tool)](https://libraries.io/npm/json-csv-tool)
[![snyk](https://img.shields.io/snyk/vulnerabilities/npm/json-csv-tool)](https://snyk.io/vuln/search?q=json-csv-tool&type=npm)
![](https://img.shields.io/bundlephobia/min/json-csv-tool) ![](https://img.shields.io/npm/l/json-csv-tool)

#### Github
![](https://img.shields.io/github/last-commit/rogue-elephant/json-csv-tool)
![](https://img.shields.io/github/issues-raw/rogue-elephant/json-csv-tool)
![](https://img.shields.io/github/issues-closed-raw/rogue-elephant/json-csv-tool)
![](https://img.shields.io/badge/using-typescript-008866?style=flat&logo=typescript)

## Description
Provides functions for converting JSON objects to and from CSVs.

## Try me out
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io#https://github.com/rogue-elephant/json-csv-tool)

# Usage

## Example
``` typescript
const deeperPersonJson = [
    {
        id: 1,
        personalInfo: {
            firstName: 'John',
            lastName: 'Smith',
            title: 'Mr'
        },
        jobInfo: {
            department: 'HR',
            title: 'HR Assistant',
        },
        Awards: [
            {
                year: 2016,
                title: 'Best at Everything'
            }
        ]
    },
    {
        id: 2,
        personalInfo: {
            firstName: 'Jane',
            lastName: 'Doe',
            title: 'Mrs'
        },
        jobInfo: {
            department: 'Sales',
            title: 'Sales Executive',
        }
    },
    {
        id: 3,
        personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            title: 'Mr'
        },
        jobInfo: {
            department: 'R&D',
            title: 'Data Scientist',
        },
        warnings: [
            {
                year: 2016,
                reason: 'Farted in the coffee machine'
            }
        ]
    },
];

const relationalJson: RelationalJson = new Converter().convertJson(DeeperPersonJson, {});
const outputGenerator = new OutputGenerator(relationalJson);
const csv = outputGenerator.generateCsv();
const markdown = outputGenerator.generateMarkdown();
const html = outputGenerator.generateOutput({
  columnSeperator: '',
  tableLevelCallback: (output: string, table: RelationalJson) =>
    output + `<h1>${table.title}</h1>` + '<table><tr>' + table.columnNames.map(x => `<th>${x}</th>`).join('') + '</tr>',
  rowLevelCallback: (rowCol: IRowValue) => `<td>${rowCol.value}</td>`,
  rowStartOutput: '<tr>',
  rowEndOutput: '</tr>',
  tableEndOutput: '</table>',
  tableSpacing: '<br>',
});
```

### CSV Output
```
id,personalInfo.firstName,personalInfo.lastName,personalInfo.title,jobInfo.department,jobInfo.title,Awards,warnings
1,John,Smith,Mr,HR,HR Assistant,1,
2,Jane,Doe,Mrs,Sales,Sales Executive,,
3,John,Doe,Mr,R&D,Data Scientist,,1

Awards
year,title
2016,Best at Everything

warnings
year,reason
2016,Farted in the coffee machine
```

### Markdown Output
----------------------------------------------------------------------------------------------
# Converted JSON <a name="Converted JSON"></a>
|*id*|*personalInfo.firstName*|*personalInfo.lastName*|*personalInfo.title*|*jobInfo.department*|*jobInfo.title*|*Awards*|*warnings*
|---|---|---|---|---|---|---|---
1|John|Smith|Mr|HR|HR Assistant|[1](#Awards)|
2|Jane|Doe|Mrs|Sales|Sales Executive||
3|John|Doe|Mr|R&D|Data Scientist||[1](#warnings)

# Awards <a name="Awards"></a>
|*year*|*title*
|---|---
2016|Best at Everything

# warnings <a name="warnings"></a>
|*year*|*reason*
|---|---
2016|Farted in the coffee machine
----------------------------------------------------------------------------------------------

### HTML (custom) Output
``` html
<h1>Converted JSON</h1>
<table>
    <tr>
        <th>id</th>
        <th>personalInfo.firstName</th>
        <th>personalInfo.lastName</th>
        <th>personalInfo.title</th>
        <th>jobInfo.department</th>
        <th>jobInfo.title</th>
        <th>Awards</th>
        <th>warnings</th>
    </tr>
    <tr>
        <td>1</td>
        <td>John</td>
        <td>Smith</td>
        <td>Mr</td>
        <td>HR</td>
        <td>HR Assistant</td>
        <td>1</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Jane</td>
        <td>Doe</td>
        <td>Mrs</td>
        <td>Sales</td>
        <td>Sales Executive</td>
    </tr>
    <tr>
        <td>3</td>
        <td>John</td>
        <td>Doe</td>
        <td>Mr</td>
        <td>R&D</td>
        <td>Data Scientist</td>
        <td>1</td>
    </tr>
</table>
<br>
<h1>Awards</h1>
<table>
    <tr>
        <th>year</th>
        <th>title</th>
    </tr>
    <tr>
        <td>2016</td>
        <td>Best at Everything</td>
    </tr>
</table>
<br>
<h1>warnings</h1>
<table>
    <tr>
        <th>year</th>
        <th>reason</th>
    </tr>
    <tr>
        <td>2016</td>
        <td>Farted in the coffee machine</td>
    </tr>
</table>
```

## Dot notation
You can also specify specifc fields to get based on dot notation, such as:
``` typescript
new JsonCsvConverter().convertJsonToCsv(apiJson, {whiteList: ['prefs.backgroundImageScaled.url']});
```

Or 
``` typescript
new JsonCsvConverter().convertJsonToCsv(apiJson, {whiteList: ['name', 'cards.*']});
```

## Contributing
- Clone the repo and run `npm install`.
- Create a new feature branch: `git checkout -b feature/your-feature-branch-name`.
- Write a test in the `__tests__` folder for your feature.
- Write the code to get the test passing, running `npm run test`.
- Push your branch up and submit a pull request.

Note: I have configured a launch.json for vscode that should allow for playing around with anything in index.ts and hitting f5 to debug.

## Publishing
- npm version patch
- npm publish
