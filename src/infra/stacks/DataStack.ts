import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getStackSuffix } from "../Utils";
export class DataStack extends Stack {
  public readonly SpacesTable: ITable;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.SpacesTable = new Table(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable${getStackSuffix(this)}`,
    });
  }
}
