import { Construct } from "constructs";

export type SalesforceObjectFieldType =
  | "Text"
  | "Number"
  | "Checkbox"
  | "Date"
  | "DateTime"
  | "Picklist"
  | "MultiSelectPicklist"
  | "LookupRelationship"
  | "MasterDetailRelationship"
  | "Formula"
  | "Currency"
  | "Percent"
  | "Phone"
  | "Email"
  | "URL"
  | "TextArea"
  | "RichTextArea"
  | "EncryptedText"
  | "Time"
  | "AutoNumber"
  | "HierarchyRelationship";

export interface SalesforceObjectFieldProps {
  name: string;
  type: SalesforceObjectFieldType;
}

export class SalesforceObjectField extends Construct {
  private readonly name: string;
  private readonly type: SalesforceObjectFieldType;

  constructor(scope: Construct, id: string, props: SalesforceObjectFieldProps) {
    super(scope, id);

    this.name = props.name;
    this.type = props.type;
  }
}
