import { Construct } from "constructs";
import { SalesforceObjectField } from "./salesforce-object-field";

export interface SalesforceObjectProps {
  name: string;
  fields: SalesforceObjectField[];
}

export class SalesforceObject extends Construct {
  private readonly name: string;
  private readonly fields: SalesforceObjectField[];

  constructor(scope: Construct, id: string, props: SalesforceObjectProps) {
    super(scope, id);

    this.name = props.name;
    this.fields = props.fields;
  }
}
