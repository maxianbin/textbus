import { Matcher, MatchRule } from '../matcher/matcher';
import { Commander } from '../commands/commander';
import { Observable } from 'rxjs';
import { DropdownHandlerView } from './handlers/utils/dropdown';
import { CacheData, EditableOptions } from './utils/cache-data';
import { TBSelection } from '../selection/selection';

export enum Priority {
  Default = 0,
  Block = 100,
  BlockStyle = 200,
  Inline = 300,
  Property = 400
}

export interface EditContext {
  document: Document;
  window: Window;
}

export interface LimitHooksContext {
  inTags: string[];
}


export interface Hooks {
  context?: LimitHooksContext;

  setup?(frameContainer: HTMLElement, context: EditContext): void;

  onSelectionChange?(range: Range, doc: Document): Range | Range[];
}

export enum HandlerType {
  Button,
  Select,
  Dropdown,
  ActionSheet
}

export interface ButtonConfig {
  type: HandlerType.Button;
  execCommand: Commander;
  priority: Priority;
  editable: EditableOptions;
  label?: string;
  classes?: string[];
  tooltip?: string;
  match?: MatchRule | Matcher;
  hooks?: Hooks;
}

export interface SelectOptionConfig {
  value: any;
  label?: string;
  classes?: string[];
  default?: boolean;
}

export interface SelectConfig {
  type: HandlerType.Select;
  execCommand: Commander;
  priority: Priority;
  editable: EditableOptions;
  options: SelectOptionConfig[];

  highlight(options: SelectOptionConfig[], data: CacheData): SelectOptionConfig;

  match?: MatchRule | Matcher;
  classes?: string[];
  mini?: boolean;
  tooltip?: string;
  hooks?: Hooks;
}

export interface DropdownConfig {
  type: HandlerType.Dropdown;
  viewer: DropdownHandlerView;
  onHide: Observable<void>;
  execCommand: Commander;
  priority: Priority;
  editable: EditableOptions;
  classes?: string[];
  format?: string;
  tooltip?: string;
  label?: string;
  match?: MatchRule | Matcher;
  hooks?: Hooks;
}

export interface ActionConfig {
  execCommand: Commander;
  priority: Priority;
  editable: EditableOptions;
  label?: string;
  classes?: string[]
  match?: MatchRule | Matcher;
}

export interface ActionSheetConfig {
  type: HandlerType.ActionSheet;
  actions: ActionConfig[];
  label?: string;
  classes?: string[];
  tooltip?: string;
  hooks?: Hooks;
}

export type HandlerConfig = ButtonConfig | SelectConfig | DropdownConfig | ActionSheetConfig;

export interface EventDelegate {
  dispatchEvent(type: string): Observable<string>
}
