import { RelationalJson, IRowValue } from './relational-json';

export class OutputGenerator {
  protected newlineChars = [
    '\r',
    '\n',
    '\r\n',
    '\n\n',
    '\r\r',
    '\u{000a}',
    '\u{000b}',
    '\u{000c}',
    '\u{000d}',
    '\u{0085}',
    '\u{2028}',
    '\u{2029}',
  ];

  constructor(private relationalJson: RelationalJson) {}

  public generateCsv(): string {
    const removeUnwantedCharsPfa = (value: string) => this.removeUnwantedChars(value, [...this.newlineChars, ',']);
    return this.generateOutput({
      columnSeperator: ',',
      rowSeperator: '\r\n',
      tableSpacing: '\r\n',
      tableLevelCallback: (output: string, table: RelationalJson) =>
        output +
        `${table.title ? table.title + '\r\n' : ''}` +
        table.columnNames.map(x => removeUnwantedCharsPfa(x)).join(',') +
        '\r\n',
      rowLevelCallback: (rowCol: IRowValue) => removeUnwantedCharsPfa(rowCol.value),
    });
  }

  public generateMarkdown(): string {
    const removeUnwantedCharsPfa = (value: string) => this.removeUnwantedChars(value, this.newlineChars);
    const tableTitle = 'Converted JSON';
    return this.generateOutput({
      columnSeperator: '|',
      rowSeperator: '\r\n',
      tableSpacing: '\r\n',
      tableLevelCallback: (output: string, table: RelationalJson) =>
        output +
        `# ${table.title || tableTitle} <a name="${(table.title || tableTitle).split(' ').join('_')}"></a>\r\n` +
        '|' +
        table.columnNames.map(x => '*' + removeUnwantedCharsPfa(x) + '*').join('|') +
        '\r\n' +
        '|' +
        table.columnNames.map(x => '---').join('|') +
        '\r\n',
      rowLevelCallback: (rowCol: IRowValue) => removeUnwantedCharsPfa(rowCol.value),
      rowLevelLinkedTableCallback: (rowCol: IRowValue) =>
        `[${removeUnwantedCharsPfa(rowCol.value)}](#${((rowCol.linkedTable as RelationalJson).title as string)
          .split(' ')
          .join('_')})`,
    });
  }

  public generateOutput(options: IOutputGeneratorOptions): string {
    let output = '';
    output = options.tableLevelCallback ? options.tableLevelCallback(output, this.relationalJson) : output;
    const linkedTables: RelationalJson[] = [];

    output +=
      this.relationalJson.rows
        .map(
          row =>
            (options.rowStartOutput || '') +
            this.relationalJson.columnNames
              .map(columnName => {
                const foundRowValues = row.filter(x => x.columnName === columnName);
                if (foundRowValues.length > 0) {
                  if (foundRowValues[0].linkedTable != null) {
                    linkedTables.push(foundRowValues[0].linkedTable);
                    return options.rowLevelLinkedTableCallback
                      ? options.rowLevelLinkedTableCallback(foundRowValues[0])
                      : options.rowLevelCallback
                      ? options.rowLevelCallback(foundRowValues[0])
                      : foundRowValues[0].value;
                  }
                  return options.rowLevelCallback
                    ? options.rowLevelCallback(foundRowValues[0])
                    : foundRowValues[0].value;
                } else {
                  return '';
                }
              })
              .join(options.columnSeperator || ' '),
        )
        .join(options.rowEndOutput || options.rowSeperator || '') + (options.rowEndOutput || '');
    output += options.tableEndOutput || '';
    linkedTables.forEach(
      table => (output += (options.tableSpacing || '') + `${new OutputGenerator(table).generateOutput(options)}`),
    );

    return output;
  }

  protected removeUnwantedChars = (value: any, unwantedChars: string[], replaceWith: string = '') =>
    value ? value.toString().replace(new RegExp(unwantedChars.join('|'), 'g'), replaceWith) : '';
}

export type TableLevelCallback = (output: string, table: RelationalJson) => string;
export type RowLevelCallbackDelegate = (rowCol: IRowValue) => string;

/** Options for specifying how output generator should output each level of iteration.
 * @export
 * @interface IOutputGeneratorOptions
 */
export interface IOutputGeneratorOptions {
  columnSeperator?: string;
  rowSeperator?: string;
  tableLevelCallback?: TableLevelCallback;
  rowLevelCallback?: RowLevelCallbackDelegate;
  rowLevelLinkedTableCallback?: RowLevelCallbackDelegate;
  rowEndOutput?: string;
  rowStartOutput?: string;
  tableEndOutput?: string;
  tableSpacing?: string;
}
