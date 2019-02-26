import{ChannelModel}  from './channel.model'
export class QuestionModel {
  id: number;
  conversation: string;
  condition: string;
  question: string;
  channel: ChannelModel;
  child: any[];
  position: any[];
}
