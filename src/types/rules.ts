export type TriggerType = 'telemetry_threshold' | 'device_offline' | 'schedule_cron' | 'webhook_inbound';
export type ActionType = 'actuate_device' | 'send_email' | 'send_telegram' | 'send_whatsapp' | 'webhook_post';

export interface RuleTrigger {
  type: TriggerType;
  deviceId?: string;
  pin?: string;
  operator?: '>' | '<' | '==' | '!=' | '>=' | '<=';
  thresholdValue?: number | string;
  cronExpression?: string;
}

export interface RuleAction {
  type: ActionType;
  targetDeviceId?: string;
  targetPin?: string;
  targetValue?: any;
  recipient?: string;
  messageTemplate?: string;
  webhookUrl?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  trigger: RuleTrigger;
  actions: RuleAction[];
  lastTriggeredAt?: string;
  executionCount: number;
}
