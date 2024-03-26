export interface Modal {
  open(): void;
  close():void;
  onSave():void;
  onCancel():void;
}
